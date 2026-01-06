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

const api = axios.create({
  baseURL: 'https://app-cherami-staging.azurewebsites.net',
  timeout: 3000,
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
  const { getToken, deleteToken } = useAuth();

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
        api.interceptors.response.eject(staleToken);
        api.interceptors.response.eject(logError);
      };
    }
  }, [deleteToken, getToken]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <APIContext.Provider value={{ api }}>{children}</APIContext.Provider>
    </QueryClientProvider>
  );
}
