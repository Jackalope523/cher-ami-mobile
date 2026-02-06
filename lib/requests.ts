export interface AddPostRequest {
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
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
  avatarPath: string | null;
}

export interface UpdateRecipientRequest {
  id: number;
  avatarPath: string | null;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
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
}
