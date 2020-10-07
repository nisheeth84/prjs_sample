/**
 * Define data structure for API getLocalNavigation
 **/

export type BusinessCardTimelineType = {
  listId?: any;
  listName?: any;
  newItem?: any;
};
export type CustomerTimelineType = {
  listId?: any;
  listName?: any;
  newItem?: any;
};
export type DepartmentTimelineType = {
  departmentId?: any;
  departmentName?: any;
  childDepartments?: DepartmentTimelineType[];
  parentId?: any;
};
export type RequestToJoinGroupType = {
  groupId?: any;
  groupName?: any;
  newItem?: any;
};
export type FavoriteGroupType = {
  groupId?: any;
  groupName?: any;
  newItem?: any;
};
export type JoinedGroupType = {
  groupId?: any;
  groupName?: any;
  newItem?: any;
};
export type GetLocalNavigation = {
  localNavigation?: {
    allTimeline?: any;
    myTimeline?: any;
    favoriteTimeline?: any;
    groupTimeline?: {
      joinedGroup?: JoinedGroupType[];

      favoriteGroup?: FavoriteGroupType[];

      requestToJoinGroup?: RequestToJoinGroupType[];
    };

    departmentTimeline?: DepartmentTimelineType[];

    customerTimeline?: CustomerTimelineType[];

    businessCardTimeline?: BusinessCardTimelineType[];
  };
};
