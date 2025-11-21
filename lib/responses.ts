import { IssueSchedule } from "./enums";

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  avatarPath?: string;
  avatarTimestamp?: Date; 
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
  inviteCode: string;
  dateCreated: Date;
  schedule: IssueSchedule;
  contributors: UserItem[];
  recipients: RecipientItem[];
}

export interface UserDTO {
  id: number;
  avatarPath?: string;
  avatarTimestamp?: Date;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  joinDate: Date;
  recipients: RecipientItem[];
}

export interface RecipientDTO {
  id: number;
  managerId: number;
  avatarPath: string;
  avatarTimestamp: Date;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
  unitNumber: string;
}

export interface FeedPost {
  id: number;
  authorId: number;
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

export interface LoginResponse {
  token: string;
  onboarded: boolean;
}

export interface CodeResponse {
  code: string;
}