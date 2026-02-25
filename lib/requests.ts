
export interface AddPostRequest {
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
  imageWidth: number;
  imageHeight: number;
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
  avatarUrl: string | null;
}

export interface CreateCircleRequest {
  title: string;
  imageUri: string;
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
