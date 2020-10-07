/**
 * Define data structure for API getActivityHistory
 **/

import { CommonUtil } from '../common/common-util';

type ContentChangeType = {};
type EmployeeType = {
  employeeId?: any;
  employeeName?: any;
  employeeSurname: string;
  employeePhoto?: {
    fileName?: any;
    filePath?: any;
    fileUrl?: any;
  };
};

export type ActivityHistoriesType = {
  activityHistoryId?: any;
  activityId?: any;
  updatedDate?: any;
  updatedUser?: EmployeeType;
  contentChange?: ContentChangeType[];
};
export type GetActivityHistory = {
  activityHistories?: ActivityHistoriesType[];
};
