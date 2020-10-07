/**
 * Define data structure for API get-timeline
 **/
export type AttachedFilesType = {
  fileName?: string;
  file?: any;
};

export type TargetDeliversType = {
  targetType?: number;
  targetId?: number[];
};
export type CreateTimeline = {
  employeeId?: number;
  createPosition?: number;
  targetDelivers?: TargetDeliversType[];
  textComment?: any;
  attachedFiles?: AttachedFilesType[];
};
