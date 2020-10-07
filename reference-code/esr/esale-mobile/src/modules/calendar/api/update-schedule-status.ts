export const PARAM_UPDATE_SCHEDULE_STATUS = (scheduleId : number, status : string, updatedDate : string)  => {
  return `mutation{
    updateScheduleStatus(scheduleId: ${scheduleId}, updatedStatus: ${status}, updatedDate: ${updatedDate})
  }`;
};
