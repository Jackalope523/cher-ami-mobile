import { useAPI } from '@/components/APIProvider';
import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { AddPostRequest, CreateCircleRequest, EmailAuthRequest, JoinCircleRequest, RecipientRequest, VerifyCodeRequest } from './requests';
import { CircleDTO, CodeResponse, FeedPageResponse, TokenDTO } from './responses';

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useGetCircleQuery() {
  const api = useAPI();

  return useQuery<CircleDTO|null, AxiosError>({
    queryKey: ['Circle'],
    queryFn: async () => {
      const response = await api.get('/circle');
      return response.data;
    }
  });
}

export function useGetCircleCodeQuery() {
  const api = useAPI();

  return useQuery<CodeResponse, AxiosError>({
    queryKey: ['CircleCode'],
    queryFn: async () => {
      const response = await api.get('/circle/code');
      return response.data;
    }
  });
}

export function useFeedPostsInfiniteQuery() {
  const api = useAPI();

  return useInfiniteQuery<FeedPageResponse, AxiosError>({
    queryKey: ['FeedPages'],
    queryFn: async ({pageParam = 0}: QueryFunctionContext) => {
      const response = await api.get(`/circle/issues/${pageParam}`);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
}

export function useAddPostMutation(onSuccess?: () => void,   onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, AddPostRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Time', request.time);
      formData.append('Caption', request.caption);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);

      await api.post(
        `/issue/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess,
    onError
  });
}

export function useEmailAuthMutation(onSuccess?:() => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, EmailAuthRequest>({
    mutationFn: async (request) => {
      await api.post<void>('/auth/email', request);
    },
    onSuccess,
    onError,
  });
}

export function useVerifyCodeMutation(onSuccess?:(data: TokenDTO) => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<TokenDTO, AxiosError, VerifyCodeRequest>({
      mutationFn: async (request) =>{
        const response = await api.post<TokenDTO>('/auth/email/verify', request);
        return response.data;
      },
      onSuccess: onSuccess,
      onError: onError,
    });
}

export function useRerollCodeMutation(onSuccess?:(data: CodeResponse) => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<CodeResponse, AxiosError>({
      mutationFn: async () =>{
        const response = await api.post<CodeResponse>('/circle/code');
        return response.data;
      },
      onSuccess: onSuccess,
      onError: onError,
    });
}


export function useCreateCircleMutation(onSuccess?:(data: CircleDTO) => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<CircleDTO, AxiosError, CreateCircleRequest>({
      mutationFn: async (request) => {
        const formData = new FormData();
  
        formData.append('Title', request.title);
        formData.append('Schedule', request.schedule.toString());
        formData.append('Image', {
          uri: request.imageUri,
          type: 'image/jpeg',
          name: request.imageName,
        } as any);
  
        const response = await api.post(
          '/circle', 
          formData, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        return response.data;
      },
      onSuccess,
      onError,
    });
}

export function useJoinCircleMutation(onSuccess?:() => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, JoinCircleRequest>({
      mutationFn: async (request: JoinCircleRequest) => {
        await api.post('/circles/join', request)
      },
      onSuccess: onSuccess,
      onError: onError,
    });
}

export function useAddRecipientMutation(onSuccess?: () => void,   onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, RecipientRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Avatar', {
        uri: request.avatarUri,
        type: 'image/jpeg',
        name: request.avatarName,
      } as any);
      
      formData.append('Title', request.title);
      formData.append('FirstName', request.firstName);
      formData.append('LastName', request.lastName);
      formData.append('UnitNumber', request.unitNumber);
      formData.append('Street', request.street);
      formData.append('City', request.city);
      formData.append('ProvinceOrState', request.provinceOrState);
      formData.append('PostalCode', request.postalCode);
      formData.append('Country', request.country);

      await api.post(
        `/circle/recipients`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess,
    onError
  });
}
