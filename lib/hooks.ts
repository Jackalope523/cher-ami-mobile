import { useAPI } from '@/components/APIProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';

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

export enum IssueSchedule {
  Monthly,
}

export interface CircleDTO {
  id: number;
  inviteCode: string;
  title: string;
  dateCreated: Date;
  schedule: IssueSchedule;
}

export function useUserCircleQuery() {
  const api = useAPI();

  return useQuery<CircleDTO|null, AxiosError>({
    queryKey: ['UserCircle'],
    queryFn: async () => {
      const response = await api.get('/circle');

      return response.data !== null ? {
        ...response.data,
        dateCreated: new Date(response.data.dateCreated),
      } : null;
    }
  });
}

export enum IssueType {
  Magazine,
}

export interface IssueDTO {
  id: number;
  circleId: number;
  type: IssueType;
  title: string;
  draftingStart: Date;
  draftingEnd: Date;
}

export function useCurrentIssueQuery(enabled: boolean) {
  const api = useAPI();

  return useQuery<IssueDTO, AxiosError>({
    queryKey: ['CurrentIssue'],
    queryFn: async () => {
      const response = await api.get('/circle/issues/current')

      const parsed: IssueDTO = {
        ...response.data,
        draftingStart: new Date(response.data.draftingStart),
        draftingEnd: new Date(response.data.draftingEnd),
      };

      return parsed;
    },
    enabled: enabled,
  });
}


export interface AddPostRequest {
  issueId: number;
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
}

export function useAddPostMutation(  onSuccess?: (data: any) => void,   onError?: (error: any) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, AddPostRequest>({
    mutationFn: async (request: AddPostRequest) => {
      const formData = new FormData();

      formData.append('IssueId', request.issueId.toString());
      formData.append('Time', request.time);
      formData.append('Caption', request.caption);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);

      await api.post(
        `/issues/${request.issueId}/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    },
    onSuccess,
    onError
  });
}

export interface LoginRequest {
  phoneNumber: string;
}

export function useLoginMutation(onSuccess?:() => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<void, AxiosError, LoginRequest>({
    mutationFn: async (request: LoginRequest) => {
      await api.post<void>('/account/login', request);
    },
    onSuccess,
    onError,
  });
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyCodeResponse {
  token: string;
}

export function useVerifyCodeMutation(onSuccess?:(data: VerifyCodeResponse) => void , onError?: (error: AxiosError) => void) {
  const api = useAPI();

  return useMutation<VerifyCodeResponse, AxiosError, VerifyCodeRequest>({
      mutationFn: async (request: VerifyCodeRequest) =>{
        const response = await api.post<VerifyCodeResponse>('/account/verify', request);
        return response.data;
      },
      onSuccess: onSuccess,
      onError: onError,
    });
}
