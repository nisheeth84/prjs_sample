// const convertJson = (string: any) => {
//   return string.replace(/"(\w+)"\s*:/g, "$1:");
// };
export const queryLocalNavigation = (employeeId: number) => {
  return {
    query: `query
        {
          getLocalNavigation(
            employeeId:  ${employeeId},
            ){
              localNavigation
              {						
                 allTimeline					
                 myTimeline					
                 favoriteTimeline					
                 groupTimeline
                 {			
                   joinedGroup
                   {				
                    groupId			
                    groupName			
                    newItem	
                   }		
                   favoriteGroup	
                   {			
                    groupId			
                    groupName			
                    newItem
                   }			
                   requestToJoinGroup				
                   {
                    groupId			
                    groupName			
                    newItem
                   }		
                 }	
                 departmentTimeline		
                 {
                  departmentId				
                  departmentName				
                  newItem	
                 }				
                 customerTimeline	
                 {
                  listId				
                  listName				
                  newItem	
                }	
                businessCardTimeline
                {
                  listId				
                  listName				
                  newItem	
                }   			
              }
            }
        }`,
  };
};

export const queryGetUserTimeline = (
  params = {
    employeeId: 1,
    listType: 1,
    listId: 1,
    limit: 10,
    offset: 200,
    filters: {
      filterOptions: [],
      isOnlyUnreadTimeline: true,
    },

    sort: "",
    searchValue: "",
  }
) => {
  return {
    query: `query
    {
      getLocalNavigation(
        employeeId:${params.employeeId} ,
        listType: ${params.listType},
        listId: ${params.listId},
        limit: ${params.limit},
        offset: ${params.offset},
        filters: {
          filterOptions:${params.filters.filterOptions},
          isOnlyUnreadTimeline: ${params.filters.isOnlyUnreadTimeline},
        },
        sort: ${params.sort},
        searchValue: ${params.searchValue},
        ){
        timelines{						
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
          targetDelivers{					
            targetType				
            targetId				
            targetName	
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
          {				
            fileName				
            filePath	
          }			
          reactions			
          {		
            reactionType				
            employeeId				
            employeeName				
            employeePhoto				
          }
          isFavorite					
          commentTimelines	
          {				
            timelineId				
            parentId				
            rootId				
            createdUser				
            createdUserName				
            createUserPhoto				
            createdDate				
            targetDelivers	
            {			
              targetType			
              targetId			
              targetName	
            }		
            comment				
            quotedTimeline	
            {			
              timelineId			
              parentId			
              rootId			
              comment
            }			
            attachedFiles	
            {			
              fileName			
              filePath			
            }
            reactions		
            {		
              reactionType			
              employeeId			
              employeeName			
              employeePhoto			
            }
            isFavorite				
            replyTimelines
            {				
              timelineId			
              parentId			
              rootId			
              createdUser			
              createdUserName			
              createdUserPhoto			
              createdDate			
              targetDelivers	
              {		
                targetType		
                targetId		
                targetName		
              }
              comment			
              quotedTimeline
              {			
                timelineId		
                parentId		
                rootId		
                createdUser		
                createdUserName		
                createdUserPhoto		
                createdDate		
                comment		
              }
              attachedFiles		
              {	
                fileName		
                filePath		
              }
              reactions
              {			
                reactionType		
                employeeId		
                employeeName		
                employeePhoto	
              }	
            }
              isFavorite			
          }
        }
        }`,
  };
};

export const queryCreateTimeline = (
  params = {
    employeeId: 1,
    createPosition: 7,
    targetDelivers: [
      { targetType: 5, targetId: 1000 },
      { targetType: 6, targetId: 1001 },
    ],
    targetType: 1,
    targetId: [1000, 1001, 1002],
    textComment: "",
    attachedFiles: [],
  }
) => {
  return {
    query: `query
        {
          createTimeline(
            employeeId: ${params.employeeId},
            createPosition:  ${params.createPosition},
            targetDelivers:  ${params.targetDelivers},
            targetType:  ${params.targetType},
            targetId:  ${params.targetId},
            textComment:  ${params.textComment},
            attachedFiles:  ${params.attachedFiles},
            )
        }`,
  };
};

export const queryGetTimelineFiles = (
  params = {
    employeeId: 1,
  }
) => {
  return {
    query: `query
        {
          createTimeline(
            employeeId: ${params.employeeId},
            )
        }`,
  };
};

export const queryGetAttachedFiles = (
  params = {
    employeeId: 1,
    listType: [],
    listId: 1,
    limit: 5,
    offset: 0,
    filters: [],
  }
) => {
  return {
    query: `query
        {
          createTimeline(
            employeeId: ${params.employeeId},
            listType: ${params.listType},
            listId: ${params.listId},
            limit,
            offset,
            filters: ${params.filters},
            )
        }`,
  };
};

export const queryDeleteTimeline = (
  params = {
    employeeId: 0,
    timelineId: 0,
  }
) => {
  return {
    query: `query
        {
          deleteTimeline(
            employeeId: ${params.employeeId},
            timelineId: ${params.timelineId},
            )
        }`,
  };
};

export const queryUpdateTimelineFavorite = (
  params = {
    employeeId: 0,
    timelineId: 0,
  }
) => {
  return {
    query: `query
        {
          updateTimelineFavorite(
            employeeId: ${params.employeeId},
            timelineId: ${params.timelineId},
            )
        }`,
  };
};
