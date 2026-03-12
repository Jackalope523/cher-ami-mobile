import { IssueSchedule } from './enums';

export interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface RecipientItem {
  id: number;
  managerId: number;
  name: string;
  avatarUrl: string | null;
  isVeteran: boolean;
}

export interface CircleDTO {
  id: number;
  headerUrl: string | null;
  title: string;
  inviteCode: string;
  dateCreated: Date;
  schedule: IssueSchedule;
  contributors: UserItem[];
  recipients: RecipientItem[];
}

export interface UserDTO {
  id: number;
  externalId: string;
  avatarUrl: string | null;
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
  avatarUrl: string | null;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
  isVeteran: boolean;
}

export interface FeedPost {
  id: number;
  authorId: number;
  photoDate: Date;
  photoUrl: string;
  photoPath: string;
  imageWidth: number;
  imageHeight: number;
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

export interface ConfigResponse {
  version: string;
  oneSignalAppId: string;
  stripePublishableKey: string;
}

export interface PriceResponse {
  standardEditionPrice: number;
  militaryEditionPrice: number;
}
