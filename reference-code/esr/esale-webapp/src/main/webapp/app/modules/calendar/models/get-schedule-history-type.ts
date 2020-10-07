/**
 * Define data structure for API getScheduleHistory
 **/

export type GetScheduleHistory = {
  updatedDate?: any;
  updatedUserId?: any;
  updatedUserName?: any;
  updatedUserImage?: any;
  contentChange?: any;
};

export const PARAM_GET_SCHEDULE_HISTORY = (scheduleId, currentPage, limit) => {
  return {
    scheduleId,
    currentPage,
    limit
  };
};
