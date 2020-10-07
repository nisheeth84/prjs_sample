/**
 * Define data structure for API createCommentAndReply
 **/

export type TargetDelivers = {
  targetType?: number;
  targetId?: number[];
};
export type AttachedFiles = {
  fileName?: string;
  file?: any;
};

export type CreateCommentAndReply = {
  timelineId?: any;
  rootId?: any;
  targetDelivers?: any[];
  actionType?: any;
  textComment?: any;
  quoteContent?: any;
  attachedFiles?: AttachedFiles[];
};
