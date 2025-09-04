import { useAPI } from '@/components/APIProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
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

  return useQuery<CircleDTO|null, Error>({
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

  return useQuery<IssueDTO, Error>({
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

export interface MutationParams {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface AddPostRequest {
  issueId: number;
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
}


export function useAddPostMutation(params: MutationParams) {
  const api = useAPI();

  return useMutation({
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

      const response = await api.post(
        `/issues/${request.issueId}/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    },
    onSuccess: params.onSuccess,
    onError: params.onError,
  });
}
