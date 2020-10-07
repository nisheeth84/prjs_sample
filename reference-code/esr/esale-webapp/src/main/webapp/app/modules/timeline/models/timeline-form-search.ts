export type GetTimelineFormSearch = {
  employeeId?: any;
  listType?: any;
  listId?: number;
  limit?: any;
  offset?: any;
  filters?: {
    filterOptions?: number[];
    isOnlyUnreadTimeline?: any;
  };
  targetDelivers?: TargetDeliver[];
  sort?: any;
  searchValue?: any;
  serviceType?: any;
  idObject?: any;
  mode?: number;
  hasLoginUser?: boolean;
};

export type TargetDeliver = {
  targetType: number;
  targetId: number[];
};
