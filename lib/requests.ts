import { IssueSchedule } from "./enums";

export interface AddPostRequest {
  issueId: number;
  time: string;
  caption: string;
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

export interface AddRecipientRequest {
  
}