import { useAPI } from '@/components/APIProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { AddPostRequest, CreateCircleRequest, JoinCircleRequest, LoginRequest, VerifyCodeRequest } from './requests';
import { CircleDTO, IssueDTO, PostDTO, TokenDTO } from './responses';

export function useInterval(callback: () => {}, delay: number) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
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

export function useUserCircleQuery() {
  const api = useAPI();

  return useQuery<CircleDTO|null, AxiosError>({
    queryKey: ['UserCircle'],
    queryFn: async () => {
      const response = await api.get('/circle');
      return response.data;
    }
  });
}

export function useCurrentIssueQuery(enabled: boolean) {
  const api = useAPI();

  return useQuery<IssueDTO, AxiosError>({
    queryKey: ['CurrentIssue'],
    queryFn: async () => {
      const response = await api.get('/circle/issues/current');
      return response.data;
    },
    enabled: enabled,
  });
}

export function useAddPostMutation(onSuccess?: (data: PostDTO) => void,   onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<PostDTO, AxiosError, AddPostRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('IssueId', request.issueId.toString());
      formData.append('Time', request.time);
      formData.append('Caption', request.caption);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);

      const response = await api.post(
        `/issues/${request.issueId}/posts`,
        formData,
      );

      return response.data;
    },
    onSuccess,
    onError
  });
}

export function useLoginMutation(onSuccess?:() => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, LoginRequest>({
    mutationFn: async (request) => {
      await api.post<void>('/account/login', request);
    },
    onSuccess,
    onError,
  });
}

export function useVerifyCodeMutation(onSuccess?:(data: TokenDTO) => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<TokenDTO, AxiosError, VerifyCodeRequest>({
      mutationFn: async (request) =>{
        const response = await api.post<TokenDTO>('/account/verify', request);
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
  
        const response = await api.post('/circle', formData);
        
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
        await api.post('/circles/join', { code: request.code })
      },
      onSuccess: onSuccess,
      onError: onError,
    });
}
