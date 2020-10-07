export const queryCreateGroupList = (
  timelineGroup: any = {
    timelineGroupName: "",
    isPublic: true,
    isApproval: false,
    color: null,
    comment: null,
    imageData: null,
    imageName: null,
    width: 0,
    height: 0
  },
  timelineGroupInvites: any = {
    inviteId: null,
    inviteType: null,
    status: null,
    authority: null,
  }
) => {
  return {
    query: `mutation{
        createTimelineGroup(
          timelineGroup: ${JSON.stringify(timelineGroup)},
          timelineGroupInvites: ${JSON.stringify(timelineGroupInvites)}
        ){
          timelineGroupId
        }
      }`,
  };
};

export const queryUpdateGroupList = (
  timelineGroup: any = {
    timelineGroupName: "",
    isPublic: true,
    isApproval: false,
    color: null,
    comment: null,
    imageData: null,
    imageName: null,
    width: 0,
    height: 0
  },
  timelineGroupInvites: any = {
    inviteId: null,
    inviteType: null,
    status: null,
    authority: null,
  },
  updateTimelineGroupInvites = true
) => {
  return {
    query: `mutation{
        createTimelineGroup(
          timelineGroup: ${JSON.stringify(timelineGroup)},
          ${updateTimelineGroupInvites ? `timelineGroupInvites: ${JSON.stringify(timelineGroupInvites)}` : ``}
        ){
          timelineGroupId
        }
      }`,
  };
};

