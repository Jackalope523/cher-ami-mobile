export interface UploadImageRequest {
  uploadId: string;
  imageUri: string;
}

export interface UploadImageDetailsRequest {
  uploadId: string;
  caption: string;
  photoDate: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUri: string;
}

export interface UpdatePostRequest {
  id: number;
  caption: string;
  photoDate: string;
}

export interface ImageRequest {
  imageUri: string;
}

export interface EmailAuthRequest {
  email: string;
}

export interface EmailVerifyRequest {
  email: string;
  code: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  avatarUrl: string | null;
}

export interface NotificationPreferencesRequest {
  pushNewPosts: boolean;
  pushIssueReminders: boolean;
  pushNewMembers: boolean;
  emailIssueReminders: boolean;
  emailMarketing: boolean;
}

export interface CreateCircleRequest {
  title: string;
  imageUri: string | null;
}

export interface UpdateCircleRequest {
  title: string;
  headerUrl: string | null;
}

export interface JoinCircleRequest {
  code: string;
}

export interface TokenRequest {
  authorizationCode: string;
}

export interface IdRequest {
  Id: number;
}

export interface RecipientRequest {
  avatarUri: string | null;
  avatarName: string | null;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
  isVeteran: boolean;
}

export interface UpdateRecipientRequest {
  id: number;
  avatarUrl: string | null;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
  isVeteran: boolean;
}
