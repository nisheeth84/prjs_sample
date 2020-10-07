/**
 * Define data structure for API getTimelineGroup
 **/

type TimelineGroupInvitesType = {};
export type GetTimelineGroup = {
  timelineGroup?: {
    timelineGroupId?: any;
    timelineGroupName?: any;
    isPublic?: any;
    isApproval?: any;
    color?: any;
    comment?: any;
    imageData?: any;
    imageName?: any;
    width?: any;
    height?: any;
    imagePath?: any;
  };
  timelineGroupInvites?: any[];
  isDeleteImage?: boolean;
};
