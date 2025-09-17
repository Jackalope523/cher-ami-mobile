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
  baseURL: 'http://10.0.2.2:5000',
  timeout: 3000,
  transformResponse: [
    ...(axios.defaults.transformResponse as any),
    (data: any) => {
      function reviveDates(obj: any): any {
        if (obj === null || obj === undefined) return obj;
        if (
          typeof obj === 'string' &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)
        ) {
          return new Date(obj);
        }
        if (Array.isArray(obj)) return obj.map(reviveDates);
        if (typeof obj === 'object') {
          for (const key in obj) obj[key] = reviveDates(obj[key]);
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
    api.interceptors.request.use(
      async (config) => {
        const openURLs = [
          '/account/signup',
          '/account/login',
          '/account/verify',
        ];
        if (config.url && !openURLs.includes(config.url)) {
          const token = await getToken();
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.error('Error attaching JWT to request: ', error);
        return Promise.reject(error);
      },
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await deleteToken();
          router.replace('/');
        }
        return Promise.reject(error);
      },
    );

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data) {
          console.error('ProblemDetails: ', error.response.data);
        }

        return Promise.reject(error);
      },
    );
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <APIContext.Provider value={{ api }}>{children}</APIContext.Provider>
    </QueryClientProvider>
  );
}
