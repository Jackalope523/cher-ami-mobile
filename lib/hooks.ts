import { useAPI } from '@/components/APIProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import {
  AppearanceParams,
  SetupParams,
  useStripe,
} from '@stripe/stripe-react-native';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { OneSignal } from 'react-native-onesignal';
import {
  AddPostRequest,
  CreateCircleRequest,
  EmailAuthRequest,
  EmailVerifyRequest,
  IdRequest,
  ImageRequest,
  JoinCircleRequest,
  RecipientRequest,
  TokenRequest,
  UpdateCircleRequest,
  UpdateRecipientRequest,
  UpdateUserRequest,
  UploadImageDetailsRequest,
  UploadImageRequest,
} from './requests';
import {
  CardDTO,
  CircleDTO,
  CodeResponse,
  ConfigResponse,
  FeedPageResponse,
  LoginResponse,
  PriceResponse,
  RecipientDTO,
  SetupIntentResponse,
  UserDTO,
  UserItem,
} from './responses';

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

export function usePingMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const showToastMessage = useToastMessage();

  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      let response;
      for (let i = 0; i < 3; i++) {
        response = await api.get('/ping', { timeout: 60000 });

        if (response.status === 202) {
          showToastMessage(
            'Connecting to server...',
            ToastMessageType.Informational,
          );
          await new Promise((resolve) => setTimeout(resolve, 30000));
        } else if (response.status === 204) {
          return;
        } else {
          throw new Error('Ping response was not 202 or 204.');
        }
      }
      throw new Error('Server took too long to start up.');
    },
    onSuccess,
    onError,
  });
}

export function usePostCountQuery() {
  const api = useAPI();

  return useQuery<number, AxiosError>({
    queryKey: ['PostCount'],
    queryFn: async () => {
      const response = await api.get('/issue/posts/count');
      return response.data;
    },
  });
}

export function useGetPriceQuery() {
  const api = useAPI();

  return useQuery<PriceResponse, AxiosError>({
    queryKey: ['Price'],
    queryFn: async () => {
      const response = await api.get<PriceResponse>('/v2/recipient/price');
      return response.data;
    },
  });
}

export function useBlockedUsersQuery() {
  const api = useAPI();

  return useQuery<UserItem[], AxiosError>({
    queryKey: ['BlockedUsers'],
    queryFn: async () => {
      const response = await api.get('/users/blocked');
      return response.data;
    },
  });
}

export function useGetCircleQuery() {
  const api = useAPI();

  return useQuery<CircleDTO | null, AxiosError>({
    queryKey: ['Circle'],
    queryFn: async () => {
      const response = await api.get('/circle');
      return response.status === 204 ? null : response.data;
    },
  });
}

export function useConfigQuery() {
  const api = useAPI();

  return useQuery<ConfigResponse, AxiosError>({
    queryKey: ['Config'],
    queryFn: async () => {
      const response = await api.get('/config');
      return response.data;
    },
  });
}

export function useGetSelfQuery() {
  const api = useAPI();

  return useQuery<UserDTO, AxiosError>({
    queryKey: ['User', 'Self'],
    queryFn: async () => {
      const response = await api.get<UserDTO>('/user');
      return response.data;
    },
  });
}

export function useGetPaymentMethodQuery() {
  const api = useAPI();

  return useQuery<CardDTO | null, AxiosError>({
    queryKey: ['PaymentMethod'],
    queryFn: async () => {
      const response = await api.get<CardDTO[]>('/payment-methods');

      return response.data[0] ?? null;
    },
  });
}

export function useGetUserQuery(id: number) {
  const api = useAPI();

  return useQuery<UserDTO, AxiosError>({
    queryKey: ['User', id],
    queryFn: async () => {
      const response = await api.get<UserDTO>(`/users/${id}`);
      return response.data;
    },
  });
}

export function useGetRecipientQuery(id: number) {
  const api = useAPI();

  return useQuery<RecipientDTO, AxiosError>({
    queryKey: ['Recipient', id],
    queryFn: async () => {
      const response = await api.get<RecipientDTO>(`/circle/recipients/${id}`);
      return response.data;
    },
  });
}

export function useFeedPostsInfiniteQuery(enabled: boolean = true) {
  const api = useAPI();

  return useInfiniteQuery<FeedPageResponse, AxiosError>({
    queryKey: ['FeedPages'],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext) => {
      const response = await api.get<FeedPageResponse>(
        `/circle/issues/${pageParam}`,
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });
}

export function useAddPostMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, AddPostRequest>({
    mutationKey: ['AddPost'],
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Time', request.time);
      formData.append('Caption', request.caption);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);
      formData.append('ImageWidth', request.imageWidth.toString());
      formData.append('ImageHeight', request.imageHeight.toString());

      await api.post(`/issue/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      OneSignal.User.addTag(
        'last_posted_at',
        String(Math.floor(Date.now() / 1000)),
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['FeedPages'] }),
        queryClient.invalidateQueries({ queryKey: ['PostCount'] }),
      ]);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  });
}

export function useDeletePostMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, IdRequest>({
    mutationFn: async (request) => {
      await api.delete(`/posts/${request.Id}`);
    },
    onSuccess,
    onError,
  });
}

export function useRemovePaymentMethodMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, void>({
    mutationFn: async () => {
      await api.delete('/payment-method');
    },
    onSuccess,
    onError,
  });
}

export function useAddPaymentMethodMutation(
  onSuccess?: (response: boolean) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const appearance: AppearanceParams = {
    colors: {
      primary: '#B05637',
      background: '#FCFBF8',
      componentBackground: '#FCFBF8',
      componentBorder: '#DEDBD5',
      componentDivider: '#DEDBD5',
      placeholderText: '#868581',
      componentText: '#242832',
      primaryText: '#242832',
      secondaryText: '#242832',
      error: '#F47A70',
    },
    shapes: {
      borderRadius: 12,
      borderWidth: 2,
    },
  };

  return useMutation<boolean, AxiosError, void>({
    mutationFn: async () => {
      const response = await api.post<SetupIntentResponse>('/payment-method');

      const params: SetupParams = {
        setupIntentClientSecret: response.data.clientSecret,
        customerId: response.data.customerId,
        allowsDelayedPaymentMethods: response.data.allowsDelayedPaymentMethods,
        merchantDisplayName: response.data.merchantDisplayName,
        // returnURL: makeRedirectUri({ scheme: 'cherami' }),
        appearance: appearance,
      };

      const { error: initError } = await initPaymentSheet(params);

      if (!initError) {
        const { error: presentError } = await presentPaymentSheet();

        return presentError === undefined;
      } else {
        throw new Error('Error when initializing the payment sheet.');
      }
    },
    onSuccess,
    onError,
  });
}

export function useUpdatePaymentMethodMutation(
  onSuccess?: (response: boolean) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const appearance: AppearanceParams = {
    colors: {
      primary: '#B05637',
      background: '#FCFBF8',
      componentBackground: '#FCFBF8',
      componentBorder: '#DEDBD5',
      componentDivider: '#DEDBD5',
      placeholderText: '#868581',
      componentText: '#242832',
      primaryText: '#242832',
      secondaryText: '#242832',
      error: '#F47A70',
    },
    shapes: {
      borderRadius: 12,
      borderWidth: 2,
    },
  };

  return useMutation<boolean, AxiosError, void>({
    mutationFn: async () => {
      const response = await api.patch<SetupIntentResponse>('/payment-method');

      const params: SetupParams = {
        setupIntentClientSecret: response.data.clientSecret,
        customerId: response.data.customerId,
        allowsDelayedPaymentMethods: response.data.allowsDelayedPaymentMethods,
        merchantDisplayName: response.data.merchantDisplayName,
        // returnURL: makeRedirectUri({ scheme: 'cherami' }),
        appearance: appearance,
      };

      const { error: initError } = await initPaymentSheet(params);

      if (!initError) {
        const { error: presentError } = await presentPaymentSheet();

        return presentError === undefined;
      } else {
        throw new Error('Error when initializing the payment sheet.');
      }
    },
    onSuccess,
    onError,
  });
}

export function useDeleteRecipientMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, IdRequest>({
    mutationFn: async (request) => {
      await api.delete(`/circle/recipients/${request.Id}`);
    },
    onSuccess,
    onError,
  });
}

export function useUpdateHeaderMutation() {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, ImageRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: 'header.jpg',
      } as any);

      await api.post(`/circle/header`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Update failed. Try again.', ToastMessageType.Error);
    },
  });
}

export function useUpdateAvatarMutation() {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const selfQuery = useGetSelfQuery();

  return useMutation<void, AxiosError, ImageRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      await api.post(`/user/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      showToastMessage('Upload success!', ToastMessageType.Success);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['User', 'Self'] }),
        queryClient.invalidateQueries({
          queryKey: ['User', Number(selfQuery.data?.id)],
        }),
        queryClient.invalidateQueries({ queryKey: ['Circle'] }),
      ]);
    },
    onError: () => {
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  });
}

export function useEmailAuthMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, EmailAuthRequest>({
    mutationFn: async (request) => {
      await api.post<void>('/auth/email', request);
    },
    onSuccess,
    onError,
  });
}

export function useEmailVerifyMutation(
  onSuccess?: (response: LoginResponse) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<LoginResponse, AxiosError, EmailVerifyRequest>({
    mutationFn: async (request) => {
      const response = await api.post<LoginResponse>(
        '/auth/email/verify',
        request,
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
}

export function useRerollCodeMutation(
  onSuccess?: (data: CodeResponse) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<CodeResponse, AxiosError>({
    mutationFn: async () => {
      const response = await api.post<CodeResponse>('/circle/code');
      return response.data;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useUpdateUserMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const selfQuery = useGetSelfQuery();

  return useMutation<void, AxiosError, UpdateUserRequest>({
    mutationKey: ['UpdateUser'],
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('FirstName', request.firstName);
      formData.append('LastName', request.lastName);

      if (request.avatarUrl) {
        formData.append('Avatar', {
          uri: request.avatarUrl,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);
      }

      const response = await api.put('/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['User', 'Self'] }),
        queryClient.invalidateQueries({
          queryKey: ['User', Number(selfQuery.data?.id)],
        }),
        queryClient.invalidateQueries({ queryKey: ['Circle'] }),
      ]);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      if (onError) onError(error);
    },
  });
}

export function useUpdateCircleMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateCircleRequest>({
    mutationKey: ['UpdateCircle'],
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Title', request.title);

      if (request.headerUrl) {
        formData.append('Header', {
          uri: request.headerUrl,
          type: 'image/jpeg',
          name: 'header.jpg',
        } as any);
      }

      const response = await api.put('/circle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      if (onError) onError(error);
    },
  });
}

export function useDeleteUserMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, void>({
    mutationFn: async () => {
      await api.delete('/user');
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useUpdateRecipientMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, UpdateRecipientRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Name', request.name);

      formData.append('AddressLine1', request.addressLine1);
      formData.append('City', request.city);
      formData.append('ProvinceOrState', request.provinceOrState);
      formData.append('PostalCode', request.postalCode);
      formData.append('Country', request.country);
      formData.append('IsVeteran', request.isVeteran.toString());

      if (request.addressLine2) {
        formData.append('AddressLine2', request.addressLine2);
      }

      if (request.avatarUrl) {
        formData.append('Avatar', {
          uri: request.avatarUrl,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);
      }

      const response = await api.put(
        `/circle/recipients/${request.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    },
    onSuccess,
    onError,
  });
}

export function useCreateCircleMutation(
  onSuccess?: (data: CircleDTO) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<CircleDTO, AxiosError, CreateCircleRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('Title', request.title);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: 'header.jpg',
      } as any);

      const response = await api.post('/circle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess,
    onError,
  });
}

export function useJoinCircleMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, JoinCircleRequest>({
    mutationFn: async (request: JoinCircleRequest) => {
      await api.post('/circles/join', request);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useLeaveCircleMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await api.post('/circle/leave');
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useReportPostMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, IdRequest>({
    mutationFn: async (request: IdRequest) => {
      await api.post(`/posts/${request.Id}/report`);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useBlockUserMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, IdRequest>({
    mutationFn: async (request: IdRequest) => {
      await api.post(`/users/${request.Id}/block`);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useUnblockUserMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, IdRequest>({
    mutationFn: async (request: IdRequest) => {
      await api.delete(`/users/${request.Id}/block`);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useExchangeGoogleTokenMutation(
  onSuccess?: (response: LoginResponse) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<LoginResponse, AxiosError, TokenRequest>({
    mutationFn: async (request: TokenRequest) => {
      const response = await api.post<LoginResponse>(
        '/auth/google/token',
        request,
      );
      return response.data;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useExchangeAppleTokenMutation(
  onSuccess?: (response: LoginResponse) => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<LoginResponse, AxiosError, TokenRequest>({
    mutationFn: async (request: TokenRequest) => {
      const response = await api.post<LoginResponse>(
        '/auth/apple/token',
        request,
      );
      return response.data;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}

export function useUploadImageMutation() {
  const api = useAPI();
  const showToastMessage = useToastMessage();

  return useMutation<void, AxiosError, UploadImageRequest>({
    mutationKey: ['UploadImage'],
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('UploadId', request.uploadId);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      await api.post(`/issue/posts/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onError: (error) => {
      console.error(
        'Upload image failed:',
        error.response?.data || error.message,
      );
      router.replace('/feed');
      showToastMessage('Error. Try again.', ToastMessageType.Error);
    },
  });
}

export function useUploadImageDetailsMutation() {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UploadImageDetailsRequest>({
    mutationKey: ['ImageDetails'],
    mutationFn: async (payload) => {
      await api.post('/issue/posts/upload-details', payload);
    },
    onSuccess: async () => {
      OneSignal.User.addTag(
        'last_posted_at',
        String(Math.floor(Date.now() / 1000)),
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['FeedPages'] }),
        queryClient.invalidateQueries({ queryKey: ['PostCount'] }),
      ]);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  });
}

export function useAddRecipientMutation() {
  const api = useAPI();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, RecipientRequest>({
    mutationKey: ['AddRecipient'],
    mutationFn: async (request) => {
      const formData = new FormData();

      if (request.avatarUri) {
        formData.append('Avatar', {
          uri: request.avatarUri,
          type: 'image/jpeg',
          name: request.avatarName,
        } as any);
      }

      formData.append('Name', request.name);

      if (request.addressLine2) {
        formData.append('AddressLine2', request.addressLine2);
      }

      formData.append('AddressLine1', request.addressLine1);
      formData.append('City', request.city);
      formData.append('ProvinceOrState', request.provinceOrState);
      formData.append('PostalCode', request.postalCode);
      formData.append('Country', request.country);
      formData.append('IsVeteran', request.isVeteran.toString());

      await api.post(`/circle/recipients`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });
    },
    onError: (error) => {
      console.log(error.message);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  });
}
