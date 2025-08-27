import {
  GatheringReportType,
  SnapshotReportType,
} from '../../flows/gathering/gatheringPigeon';
import { UserReportType } from '../../flows/profile/profileApi';

export function attachAction<T>(
  options: { label: string; enum: T }[],
  action: (value: T) => any,
) {
  return options.map((option) => {
    return {
      option: option.enum,
      label: option.label,
      onPress: () => action(option.enum),
    };
  });
}

export const SnapshotReportOptions = [
  {
    id: 0,
    label: 'Inappropriate',
    enum: SnapshotReportType.Inappropriate,
  },
  {
    id: 1,
    label: 'Graphic content/ Violence/ Nudity',
    enum: SnapshotReportType.GraphicContent,
  },
  {
    id: 2,
    label: 'False information/ Manipulated media',
    enum: SnapshotReportType.ManipulatedMedia,
  },
  {
    id: 3,
    label: 'Promotion',
    enum: SnapshotReportType.Promotion,
  },
  {
    id: 4,
    label: 'Spam',
    enum: SnapshotReportType.Spam,
  },
  {
    id: 5,
    label: 'Other',
    enum: SnapshotReportType.Other,
  },
];

export const GatheringReportOptions = [
  {
    id: 0,
    label: 'Inappropriate Gathering',
    enum: GatheringReportType.InappropriateGathering,
  },
  {
    id: 1,
    label: 'Inappropriate Header Image',
    enum: GatheringReportType.InappropriateHeader,
  },
  {
    id: 2,
    label: 'Misleading',
    enum: GatheringReportType.Misleading,
  },
  {
    id: 3,
    label: 'Illegal',
    enum: GatheringReportType.Illegal,
  },
  {
    id: 4,
    label: 'Promotion',
    enum: GatheringReportType.Promotion,
  },
  {
    id: 5,
    label: 'Spam',
    enum: GatheringReportType.Spam,
  },
  {
    id: 6,
    label: 'Other',
    enum: GatheringReportType.Other,
  },
];

export const UserReportOptions = [
  {
    id: 0,
    label: 'Rude',
    enum: UserReportType.Rude,
  },
  {
    id: 1,
    label: 'Hate Speech',
    enum: UserReportType.HateSpeech,
  },
  {
    id: 2,
    label: 'Harassment',
    enum: UserReportType.Harassment,
  },
  {
    id: 3,
    label: 'Violence/Assault',
    enum: UserReportType.ViolenceOrAssault,
  },
  {
    id: 4,
    label: 'Other',
    enum: UserReportType.Other,
  },
];
