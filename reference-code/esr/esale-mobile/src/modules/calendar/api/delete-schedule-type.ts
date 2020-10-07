export const PARAM_DELETE_SCHEDULE = (scheduleId: number, deleteFlg: number) =>
  `mutation {
    deleteSchedule( scheduleId: ${scheduleId}, deleteFlag: ${deleteFlg})
  }`;
