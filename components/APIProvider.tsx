import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect } from 'react';

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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function APIProvider({ children }: APIProviderProps) {
  useEffect(() => {
    api.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('token');

        if (
          config.url &&
          !['/verify', '/login', '/signup'].includes(config.url)
        ) {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized! Maybe logout user');
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
