import { IssueSchedule, IssueType } from "./enums";

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  avatarPath: string;
}

export interface CircleDTO {
  id: number;
  inviteCode: string;
  title: string;
  dateCreated: Date;
  schedule: IssueSchedule;
}

export interface IssueDTO {
  id: number;
  circleId: number;
  type: IssueType;
  title: string;
  draftingStart: Date;
  draftingEnd: Date;
}

export interface PostDTO {
  id: number;
  issueId: number;
  userId: number;
  timestamp: Date;
  caption: string;
}

export interface TokenDTO {
  token: string;
}

export interface AddRecipientResponse {
   subscriptionId: string;
   clientSecret: string;
}