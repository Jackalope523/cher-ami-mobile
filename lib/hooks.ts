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
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
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
  UpdateRecipientRequest,
  UpdateUserRequest,
} from './requests';
import {
  CardDTO,
  CircleDTO,
  CodeResponse,
  FeedPageResponse,
  LoginResponse,
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

  return useQuery<number, AxiosError>({
    queryKey: ['Price'],
    queryFn: async () => {
      const response = await api.get('/recipient/price');
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

      await api.post(`/issue/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess,
    onError,
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

export function useUpdateHeaderMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

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
    onSuccess,
    onError,
  });
}

export function useUpdateAvatarMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

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
    onSuccess,
    onError,
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

  return useMutation<void, AxiosError, UpdateUserRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      formData.append('FirstName', request.firstName);
      formData.append('LastName', request.lastName);

      if (request.avatarPath) {
        formData.append('Avatar', {
          uri: request.avatarPath,
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
    onSuccess,
    onError,
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

      formData.append('FirstName', request.firstName);
      formData.append('LastName', request.lastName);

      formData.append('Street', request.street);
      formData.append('City', request.city);
      formData.append('ProvinceOrState', request.provinceOrState);
      formData.append('PostalCode', request.postalCode);
      formData.append('Country', request.country);

      if (request.unitNumber) {
        formData.append('UnitNumber', request.unitNumber);
      }

      if (request.avatarPath) {
        formData.append('Avatar', {
          uri: request.avatarPath,
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

export function useAddRecipientMutation(
  onSuccess?: () => void,
  onError?: (error: AxiosError) => void,
) {
  const api = useAPI();

  return useMutation<void, AxiosError, RecipientRequest>({
    mutationFn: async (request) => {
      const formData = new FormData();

      if (request.avatarUri) {
        formData.append('Avatar', {
          uri: request.avatarUri,
          type: 'image/jpeg',
          name: request.avatarName,
        } as any);
      }

      formData.append('FirstName', request.firstName);
      formData.append('LastName', request.lastName);

      if (request.unitNumber) {
        formData.append('UnitNumber', request.unitNumber);
      }

      formData.append('Street', request.street);
      formData.append('City', request.city);
      formData.append('ProvinceOrState', request.provinceOrState);
      formData.append('PostalCode', request.postalCode);
      formData.append('Country', request.country);

      await api.post(`/circle/recipients`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess,
    onError,
  });
}
