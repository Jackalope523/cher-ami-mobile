import { IssueSchedule } from "./enums";

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

export interface CreateCircleRequest {
  title: string;
  schedule: IssueSchedule;
  imageUri: string;
  imageName: string;
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