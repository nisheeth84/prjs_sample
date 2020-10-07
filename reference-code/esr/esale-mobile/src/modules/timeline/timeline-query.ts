export const querySuggestionTimelineGroupName = (params: {
  timelineGroupName: string;
}) => {
  return {
    query: `
    {
      suggestTimelineGroupName(
        timelineGroupName: ${params.timelineGroupName}
      )
      {
        data
        [
          {
            timelineGroupId
            timelineGroupName
            imagePath
          }
        ]
      } 
    }`,
  };
};

export const queryGetTimelineGroupsOfEmployee = (params: {
  employeeId: number;
  timelineGroupId: number | null;
}) => {
  return {
    query: `
    {
      getTimelineGroupsOfEmployee(
        employeeId: ${params.employeeId}
        timelineGroupId: ${params.timelineGroupId}
      )
      {
        timelineGroup
        [
          {
            timelineGroupId
            timelineGroupName
            imagePath
            inviteId
            inviteType
            status
            authority
          }
        ]
      }
    }`,
  };
};
export const queryShareTimeline = (params: {
  employeeId: number;
  sharedTimelineId: number;
  targetDelivers: Array<any>;
  textComment: string;
  sharedContent: string;
  attachedFiles: Array<any>;
}) => {
  return {
    query: `
    {
        shareTimeline(
          employeeId: ${params.employeeId}			
          sharedTimelineId: ${params.sharedTimelineId}					
          targetDelivers: ${params.targetDelivers}						
          textComment: ${params.textComment}				
          sharedContent: ${params.sharedContent}				
          attachedFiles: ${params.attachedFiles}				
        )
        {
            data
            {
                {
                    timelineId
                }
              }
        }
    }`,
  };
};

export const queryGetTimelineGroups = (params: {
  timelineGroupIds: Array<number>;
  sortType: number;
}) => {
  return {
    query: `
    {
      getTimelineGroups(
            timelineGroupIds: ${params.timelineGroupIds}
            sortType: ${params.sortType}
        )
        {
          timelineGroup
          [
            {
              timelineGroupId
              timelineGroupName
              comment
              createdDate
              isPublic
              color
              imagePath
              imageName
              width
              height
              changedDate
              invites
              [
                {
                  inviteId
                  inviteType
                  inviteName
                  inviteImagePath
                  employeeNames
                  status
                  authority
                }
              ]
            }
          ]
        }
    }`,
  };
};

export const queryGetUserTimelines = (params: {
  employeeId: number;
  listType: number;
  listId: number;
  limit: number;
  offset: number;
  filters: {
    filterOptions: Array<object>;
    isOnlyUnreadTimeline: boolean;
  };
  sort: string; // "createdDate" | "changedDate"
}) => {
  return {
    query: `
    {
      getUserTimelines
      (
        emloyeeId: ${params.emloyeeId}
        listType: ${params.listType}
        listId: ${params.listId}
        limit: ${params.limit}
        offset: ${params.offset}
        filters: ${params.filters}
        sort: ${params.sort}
      )
      {
        timelines
        [
          {
            timelineId
            parentId
            rootId
            timelineType
            createdUser
            createdUserName
            createdUserPhoto
            createdDate
            changedDate
            timelineGroupId
            timelineGroupName
            color
            imagePath
            header
            {
              headerType
              headerId
              headerContent
            }
            comment
            sharedTimeline
            {
              timelineId
              parentId
              rootId
              createdUser
              createdUserName
              createdUserPhoto
              createdDate
              timelineGroupId
              timelineGroupName
              imagePath
              header
              {
                headerType
                headerId
                headerContent
              }
              comment
            }
            attachedFiles
            [
              {
                fileName
                filePath
              }
            ]
            reactions
            [
              {
                reactionType
                employeeId
                employeeName
                employeePhoto
              }
            ]
            isFavorite
            commentTimelines
            [
              {
                timelineId
                parentId
                rootId
                createdUser
                createdUserName
                createUserPhoto
                createdDate
                targetDelivers
                [
                  {
                    targetType
                    targetId
                    targetName
                  }
                ]
                comment
                quotedTimeline
                {
                  timelineId
                  parentId
                  rootId
                  comment
                }
                attachedFiles
                [
                  {
                    fileName
                    filePath
                  }
                ]
                reactions
                [
                  {
                    reactionType
                    employeeId
                    employeeName
                    employeePhoto
                  }
                ]
                isFavorite
                replyTimelines
                [
                  {
                    timelineId
                    parentId
                    rootId
                    createdUser
                    createdUserName
                    createUserPhoto
                    createdDate
                    targetDelivers
                    [
                      {
                        targetType
                        targetId
                        targetName
                      }
                    ]
                    comment
                    quotedTimeline
                    {
                      timelineId
                      parentId
                      rootId
                      comment
                    }
                    attachedFiles
                    [
                      {
                        fileName
                        filePath
                      }
                    ]
                    reactions
                    [
                      {
                        reactionType
                        employeeId
                        employeeName
                        employeePhoto
                      }
                    ]
                    isFavorite
                  }
                ]    
              }
            ]            
          }
        ]
      }
    }`,
  };
};

export const queryAddMemberToTimelineGroup = (params: {
  employeeId: number;
  timelineGroupInvites: Array<{
    inviteType: number;
    inviteId: number;
    status?: number;
    authority?: number;
  }>;
}) => {
  return {
    query: `
    {
      addMemberToTimelineGroup(
        employeeId: ${params.employeeId}
        timelineGroupInvites: ${params.timelineGroupInvites}
      )
      {
        timelineGroupInviteIds
      } 
    }`,
  };
};
