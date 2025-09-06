import { IssueSchedule, IssueType } from "./enums";

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