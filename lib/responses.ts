import { IssueSchedule } from "./enums";

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  avatarPath: string;
  avatarTimestamp: Date; 
}

export interface RecipientItem {
  id: number;
  managerId: number;
  firstName: string;
  lastName: string;
  avatarPath: string;
  avatarTimestamp: Date; 
}

export interface CircleDTO {
  id: number;
  headerPath: string;
  headerTimestamp: Date; 
  title: string;
  dateCreated: Date;
  schedule: IssueSchedule;
  contributors: UserItem[];
  recipients: RecipientItem[];
}

export interface UserDTO {
  id: number;
  avatarPath: string;
  avatarTimestamp: Date;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  joinDate: Date;
  recipients: RecipientItem[];
}

export interface FeedPost {
  id: number;
  authorAvatarPath: string;
  authorAvatarTimestamp: Date; 
  authorName: string;
  photoDate: Date;
  photoPath: string;
  caption: string;
}

export interface FeedPageResponse {
  id: number | null;
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