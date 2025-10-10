import { IssueSchedule } from "./enums";

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  avatarPath: string;
}

export interface RecipientItem {
  id: number;
  managerId: number;
  firstName: string;
  lastName: string;
  avatarPath: string;
}

export interface CircleDTO {
  id: number;
  headerPath: string;
  title: string;
  dateCreated: Date;
  schedule: IssueSchedule;
  contributors: UserItem[];
  recipients: RecipientItem[];
}

export interface FeedPost {
  id: number;
  authorAvatarPath: string;
  authorName: string;
  photoDate: Date;
  photoPath: string;
  caption: string;
}

export interface FeedPageResponse {
  issueTitle: string | null;
  issueDate: Date | null;
  posts: FeedPost[]
  nextPage: number | null;
}

export interface TokenDTO {
  token: string;
}

export interface CodeResponse {
  code: string;
}