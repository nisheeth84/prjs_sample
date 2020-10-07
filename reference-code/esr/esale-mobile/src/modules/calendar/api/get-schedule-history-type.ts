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

export const PARAM_GET_SCHEDULE_HISTORY = (scheduleId: number, currentPage: number, limit: number) =>
  `{
      getScheduleHistory(scheduleId: ${scheduleId}, currentPage: ${currentPage}, limit: ${limit} ) {
         data {
             updatedDate
             updatedUserId
             updatedUserName
             updatedUserImage
             contentChange
         }
       }
  }`;

/**
 * Param get schedule history in query graphql
 * @param scheduleId
 * @param currentPage
 * @param limit
 * @constructor
 */
export const PARAM_GET_SCHEDULE_HISTORY_SP = (scheduleId: string, currentPage: string, limit: string) =>
  `{
      getScheduleHistory(scheduleId: ${scheduleId}, currentPage: ${currentPage}, limit: ${limit} ) {
         data {
             updatedDate
             updatedUserId
             updatedUserName
             updatedUserImage
             contentChange
         }
       }
  }`;
