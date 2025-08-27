import axios, { AxiosInstance, AxiosStatic, GenericAbortSignal } from 'axios';
import axiosRetry from 'axios-retry';

const API_URL = 'https://hollow-production.azurewebsites.net';

export const TOKEN_KEY = 'client-token';

export const anonymousSession: AxiosInstance = axios.create({
  baseURL: API_URL,
  signal: createFailedToken(),
});

export const userSession: AxiosInstance = axios.create({
  baseURL: API_URL,
  signal: createFailedToken(),
});

// Failed token factory to prevent uninitialised sessions from being utilised
function createFailedToken(): GenericAbortSignal {
  let controller = new AbortController();
  controller.abort();
  return controller.signal;
}

export function initialiseAxios() {
  initialiseAxiosSession('');

  // Prevent use of static default
  axios.defaults.signal = createFailedToken();
  
  anonymousSession = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', },
    signal: new AbortController().signal,
    validateStatus: (status: any) => { return status === 200 },
  });
}


export function initialiseAxiosSession(token: string) {
  let controller = new AbortController();

  userSession = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': token,
  },
    validateStatus: (status: any) => { return status === 200 },
  });

  // defaultRetry(userSession);

  defaultAbort(userSession, controller);

  // Attach global abort function
  abortAllRequests = () => {
    controller.abort();
    controller = new AbortController();
    defaultAbort(userSession, controller);
  };
}

export var abortAllRequests: () => void | undefined;

let requestInterceptorId: number | undefined = undefined;

function defaultAbort(instance: AxiosInstance | AxiosStatic, controller: AbortController) {
  if (requestInterceptorId) {
    instance.interceptors.request.eject(requestInterceptorId);
  }

  // Add new interceptor to attach abort signal
  requestInterceptorId = instance.interceptors.request.use(config => {
    config.signal = controller.signal;
    return config;
  });
}

function defaultRetry(instance: AxiosInstance | AxiosStatic) {
  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
  });
}

export function extractDate(data: any) {
  return new Date(data);
}

export function extractList<T>(listData: any, extractingFunction: (data: any) => T) {
  let items: T[] = [];

  for (const datum of listData) {
    items.push(extractingFunction(datum));
  }

  return items;
}
