/**
 * Define data structure for API getUserTimelines
 **/
export type Header = {
  headerType?: any;
  headerId?: any;
  startTime?: any;
  endTime?: any;
  headerContent?: {
    jaJp?: string;
    enUs?: string;
    zhCn?: string;
  };
};
export type ReactionsType = {
  reactionType?: string;
  employeeId?: number;
  employeeName?: string;
  employeePhoto?: string;
  timelineId?: number;
  status?: number;
};
export type AttachedFilesType = {
  fileName?: string;
  filePath?: string;
  fileUrl?: string;
};
export type TargetDeliversType = {
  targetType?: any;
  targetId?: any;
  targetName?: any;
};
export type ReplyTimelinesType = {
  timelineId?: any;
  parentId?: any;
  rootId?: any;
  createdUser?: any;
  createdUserName?: any;
  createdUserPhoto?: any;
  createdDate?: any;
  targetDelivers?: TargetDeliversType[];
  comment?: {
    mode?: number;
    content?: any;
  };
  quotedTimeline?: QuoteTimelineType;
  attachedFiles?: AttachedFilesType[];
  reactions?: ReactionsType[];
  isFavorite?: any;
  // timeline group id for group share
  timelineGroupId?: number;
};

export type QuoteTimelineType = {
  timelineId?: any;
  parentId?: any;
  rootId?: any;
  createdUser?: any;
  createdUserName?: any;
  createdUserPhoto?: any;
  createdDate?: any;
  comment?: {
    mode?: number;
    content?: any;
  };
};

export type CommentTimelinesType = {
  timelineId?: any;
  parentId?: any;
  rootId?: any;
  createdUser?: number;
  createdUserName?: any;
  createdUserPhoto?: any;
  createdDate?: any;
  targetDelivers?: TargetDeliversType[];
  comment?: {
    mode?: number;
    content?: any;
  };
  quotedTimeline?: QuoteTimelineType;
  attachedFiles?: AttachedFilesType[];
  reactions?: ReactionsType[];
  isFavorite?: any;
  replyTimelines?: ReplyTimelinesType[];
  // timeline group id for group share
  timelineGroupId?: number;
};

export type ShareTimelineType = {
  timelineId?: any;
  parentId?: any;
  rootId?: any;
  createdUser?: any;
  createdUserName?: any;
  createdUserPhoto?: any;
  createdDate?: any;
  timelineGroupId?: any;
  timelineGroupName?: any;
  imagePath?: any;
  header?: {
    headerId?: any;
    headerContent?: any;
  };
  comment?: {
    mode?: number;
    content?: any;
  };
};
export type TimelinesType = {
  timelineId?: any;
  parentId?: any;
  rootId?: any;
  timelineType?: [
    {
      timelineTypeId: number;
    }
  ];
  isChannelMember?: boolean;
  createdUser?: number;
  createdUserName?: any;
  createdUserPhoto?: any;
  createdDate?: any;
  changedDate?: any;
  timelineGroupId?: any;
  timelineGroupName?: any;
  color?: any;
  imagePath?: any;
  header?: Header;
  targetDelivers?: TargetDeliversType[];
  comment?: {
    mode?: number;
    content?: any;
  };
  sharedTimeline?: ShareTimelineType;

  attachedFiles?: AttachedFilesType[];
  reactions?: ReactionsType[];
  isFavorite?: any;
  commentTimelines?: CommentTimelinesType[];
};
export type GetUserTimelines = {
  timelines?: TimelinesType[];
};
export type GetCommentAndReply = {
  timelineId: number;
  type: number;
  olderCommentId?: number;
  newerCommentId?: number;
  rootId: number;
};
