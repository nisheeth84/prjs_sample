/**
 * Define data structure for API getMilestone
 **/

type listTask = {
  taskId?: any;
  taskName?: any;
  status?: any;
  isOperator?: any;
  finishDate?: any;
};

export interface GetMilestone {
  milestoneId?: any;
  memo?: any;

  milestoneName?: any;
  endDate?: any;
  isDone?: any;
  isPublic?: any;
  customer?: {
    customerId?: any;
    customerName?: any;
  };
  timelines?: any;
  createdDate?: any;
  updatedDate?: any;
  updatedUser?: any;
  milestoneHistories?: {
    updatedDate?: any;
    updatedUserId?: any;
    updatedUserName?: any;
    updatedUserImage?: any;
    contentChange?: any;
  };

  listTask?: listTask[];
}

/**
 * Get milestone By Id
 * @param milestoneId
 */

export const PARAM_GET_MILESTONE = milestoneId =>
  `{
      getMilestone(milestoneId: ${milestoneId}) {
          milestoneId
          milestoneName
          memo
          listTask {
            taskId
            taskName
            status
            isOperator
          }
          endDate
          isDone
          isPublic
          customer {
            customerId
            customerName
          }
          timelines
          createdDate
          createdUser
          updatedDate
          updatedUser
          milestoneHistories {
            updatedDate
            updatedUserId
            updatedUserName
            updatedUserImage
            contentChange
          }
      }
  }`;
