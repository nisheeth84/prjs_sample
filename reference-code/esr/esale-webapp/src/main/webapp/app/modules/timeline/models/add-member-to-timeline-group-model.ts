/**
 * Define data structure for API addMemberToTimelineGroup
 **/

export type TimelineGroupInviteIdsType = {
  timelineGroupId?: number;
  inviteType?: number;
  inviteId?: number;
  status?: number;
  authority?: number;
};
export type AddMember = {
  timelineGroupInvites?: TimelineGroupInviteIdsType[];
  content?: any;
};
