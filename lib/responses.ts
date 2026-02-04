import { IssueSchedule } from './enums';

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  avatarPath: string | null;
  avatarTimestamp: Date | null;
}

export interface RecipientItem {
  id: number;
  managerId: number;
  firstName: string;
  lastName: string;
  avatarPath: string | null;
  avatarTimestamp: Date | null;
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
  avatarPath: string | null;
  avatarTimestamp: Date | null;
  firstName: string;
  lastName: string;
  joinDate: Date;
  isBillingExempt: boolean;
  recipients: RecipientItem[];
}

export interface CardDTO {
  id: string;
  displayBrand: string;
  last4: string;
}

export interface RecipientDTO {
  id: number;
  managerId: number;
  avatarPath: string | null;
  avatarTimestamp: Date | null;
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
  posts: FeedPost[];
  nextPage: number | null;
}

export interface LoginResponse {
  token: string;
  onboarded: boolean;
}

export interface CodeResponse {
  code: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  customerId: string;
  merchantDisplayName: string;
  allowsDelayedPaymentMethods: boolean;
}
