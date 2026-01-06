
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
  dateOfBirth?: Date;
  avatarPath?: string;
}

export interface UpdateRecipientRequest {
  id: number;
  avatarPath: string | null;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
  unitNumber: string | null;
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
  avatarUri: string;
  avatarName: string;
  title: string;
  firstName: string;
  lastName: string;
  unitNumber: string|null;
  street: string;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
}