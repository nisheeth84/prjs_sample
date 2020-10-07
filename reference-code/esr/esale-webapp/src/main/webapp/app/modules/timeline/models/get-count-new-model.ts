export type GroupTimeline = {
  groupId?: number;
  newItem?: number;
};
export type DepartmentTimeline = {
  departmentId?: number;
  newItem?: number;
};
export type CustomerTimeline = {
  listId?: number;
  newItem?: number;
};
export type BizcardTimeline = {
  listId?: number;
  newItem?: number;
};
export type GetCountNew = {
  counter?: {
    allTimeline?: number;
    myTimeline?: number;
    favoriteTimeline?: number;
    groupTimeline?: GroupTimeline[];
    departmentTimeline?: DepartmentTimeline[];
    customerTimeline?: CustomerTimeline[];
    bizcardTimeline?: BizcardTimeline[];
  };
  groupIds?: number[];
  departmentIds?: number[];
  listFavoriteCustomer?: number[];
  listFavoriteBusinessCard?: number[];
};
