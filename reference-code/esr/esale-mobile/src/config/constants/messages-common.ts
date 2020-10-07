import { I18nMessages } from "../../types";

export const messages: I18nMessages = {
  schedule_name: {
    id: "schedule_name",
    defaultMessage: "件名",
  },

  schedule_type: {
    id: "schedule_type",
    defaultMessage: "種別",
  },
  
  start_day: {
    id: "start_day",
    defaultMessage: "スケジュール開始日時",
  },
  
  start_time: {
    id: "start_time",
    defaultMessage: "開始時間",
  },
  
  formatFullDate: {
    id: "formatFullDate",
    defaultMessage: "{{year}}年{{month}}月{{day}}日",
  },
  
  formatTime: {
    id: "formatTime",
    defaultMessage: "{{fromHour}}:{{fromMin}} ～ {{toHour}}:{{toMin}}",
  },
  
  formatDateTime: {
    id: "formatDateTime",
    defaultMessage: "{{fromYear}}年{{fromMonth}}月{{fromDay}}日 {{fromHour}}:{{fromMin}} ～ {{toYear}}年{{toMonth}}月{{toDay}}日 {{toHour}}:{{toMin}}",
  },
};
