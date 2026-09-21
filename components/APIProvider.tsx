import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface APIProviderProps {
  children: ReactNode;
}

interface APIInterface {
  api: AxiosInstance;
}

const APIContext = createContext<APIInterface | null>(null);

export const useAPI = () => {
  const context = useContext(APIContext);

  if (!context) {
    throw new Error('useAPI must be used within an APIProvider');
  }

  return context.api;
};

// Module scope, like `api` below: rebuilding this on a render would throw away
// every cached query, which a mid-session token renewal would otherwise do.
const queryClient = new QueryClient();

const api = axios.create({
  baseURL: 'https://app-cherami-prod.azurewebsites.net',
  timeout: 30000,
  transformResponse: [
    ...(axios.defaults.transformResponse as any),
    (data: any) => {
      function reviveDates(obj: any): any {
        if (obj === null || obj === undefined) return obj;

        if (typeof obj === 'string') {
          const dateRegex =
            /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

          if (dateRegex.test(obj)) {
            const d = new Date(obj);
            if (!isNaN(d.getTime())) return d;
          }
        }

        if (Array.isArray(obj)) return obj.map(reviveDates);

        if (typeof obj === 'object') {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              obj[key] = reviveDates(obj[key]);
            }
          }
        }

        return obj;
      }

      return reviveDates(data);
    },
  ],
});

export default function APIProvider({ children }: APIProviderProps) {
  const { getToken, updateToken, deleteToken } = useAuth();

  useEffect(() => {
    if (getToken()) {
      const attachToken = api.interceptors.request.use(
        async (config) => {
          const openURLs = ['/account/login', '/account/verify'];
          if (config.url && !openURLs.includes(config.url)) {
            const token = getToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          console.error('Error attaching JWT to request: ', error);
          return Promise.reject(error);
        },
      );

      // The server hands back a fresh token once the current one is over halfway
      // through its life, so anyone using the app stays signed in.
      const renewToken = api.interceptors.response.use((response) => {
        const renewed = response.headers['x-refreshed-token'];

        if (typeof renewed === 'string' && renewed.length > 0) {
          updateToken(renewed);
        }

        return response;
      });

      // Only 401. A 500 means the server had a problem, not that this person
      // needs to sign in again.
      const staleToken = api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            deleteToken();
            router.replace('/');
          }
          return Promise.reject(error);
        },
      );

      const logError = api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.data) {
            console.error('ProblemDetails: ', error.response.data);
          }

          return Promise.reject(error);
        },
      );

      return () => {
        api.interceptors.request.eject(attachToken);
        api.interceptors.response.eject(renewToken);
        api.interceptors.response.eject(staleToken);
        api.interceptors.response.eject(logError);
      };
    }
  }, [deleteToken, getToken, updateToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <APIContext.Provider value={{ api }}>{children}</APIContext.Provider>
    </QueryClientProvider>
  );
}
