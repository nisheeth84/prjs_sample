import { CalendarView, LocalNavigation } from "../constants";
import { DataOfDetailWeek, DataOfViewList } from "./common";
import { GetViewTypesForCalendar } from "./get-view-types-for-calendar-type";
import { CheckDuplicatedEquipments } from "./check-duplicated-equipments-type";

// const _DUMMY_ = false;
export enum CalendarGridAction {
  None,
  RequestListCalendar,
  ShowGridMonth,
  ShowGridList,
  RequestErrorCalendar,
  RequestSuccessCalendar
}

export type CalendarGridState = {
  action?: CalendarGridAction;

  dateShow: moment.Moment;
  typeShowGrid: CalendarView;
  optionAll: boolean;
  optionLunarDay: boolean;
  optionHoliday: boolean;

  startHour: number;
  endHour: number;

  // dataOfMonth?: DataOfMonth;
  dataOfMonth?: any;
  dataOfDetailWeek?: DataOfDetailWeek;
  dataOfDetailDay: DataOfDetailWeek;
  dataOfList: DataOfViewList;

  numberShowSchedule: number;
  localNavigation: LocalNavigation;

  // search conditon
  localSearchKeyword?: string;
  searchConditions?: any;

  // Refresh show data in Gird
  refreshDataFlag: number;
  listTypeViewOfCalendar: GetViewTypesForCalendar;

  runningBackground: any;
  suscessMessage?: string;
  errorMessage?: string;

  // isDraggingSchedule?: boolean;
  dataEquipments?: CheckDuplicatedEquipments;
  popupEquipmentError?: boolean;
  popupEquipmentConfirm?: boolean;
  updateFlag?: number;
};