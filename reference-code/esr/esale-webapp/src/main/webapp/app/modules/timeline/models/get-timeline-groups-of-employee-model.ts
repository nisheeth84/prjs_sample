/**
 * Define data structure for API getTimelineGroupsOfEmployee
 **/

export type TimelineGroupTypePro = {
  timelineGroupId?: number;
  timelineGroupName?: string;
  imagePath?: string;
  inviteId?: number;
  inviteType?: any;
  status?: number;
  authority?: number;
  isPublic?: boolean;
};
export type GetTimelineGroupsOfEmployee = {
  timelineGroup?: TimelineGroupTypePro[];
};
