
export interface AddPostRequest {
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
}

export interface ImageRequest {
  imageUri: string;
  imageName: string;
}

export interface EmailAuthRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatarPath: string;
  inviteCode: string;
}


export interface CreateCircleRequest {
  title: string;
  imageUri: string;
}

export interface JoinCircleRequest {
  code: string;
}

export interface GoogleTokenRequest {
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
  unitNumber: string;
  street: string;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
}