import axios from 'axios';
import _ from 'lodash';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import {
  CalendarView,
  LocalNavigation,
  TabForcus,
  VIEW_TYPE_CALENDAR,
  LimitLoadDataInListView,
  ItemTypeSchedule
} from '../constants';
import moment from 'moment';
import {
  DataOfMonth,
  DataOfDetailWeek,
  CalenderViewWeekDay,
  DataOfViewList,
  CalenderViewMonthCommon,
  CalenderViewWeekCommon,
  CalenderViewWeekList,
  DataOfSchedule,
  DataOfResource
} from './common';
// import { DummyDataOfSchedule } from './dummy-data'
import {
  GetResourcesForCalendarByMonth,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_FULL,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_SHORT
} from '../models/get-resources-for-calendar-by-month-type';
import {
  GetDataForCalendarByMonth,
  PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_FULL,
  PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_SHORT
} from '../models/get-data-for-calendar-by-month-type';
import {
  GetDataForCalendarByWeek,
  PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_SHORT,
  PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_FULL
} from '../models/get-data-for-calendar-by-week-type';
import {
  GetResourcesForCalendarByWeek,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_FULL,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_SHORT
} from '../models/get-resources-for-calendar-by-week-type';
import {
  GetDataForCalendarByDay,
  PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_SHORT,
  PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_FULL
} from '../models/get-data-for-calendar-by-day-type';
import {
  GetResourcesForCalendarByDay,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_SHORT,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_FULL
} from '../models/get-resources-for-calendar-by-day-type';
import {
  GetDataForCalendarByList,
  PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_SHORT,
  PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_FULL,
  MODE_SEARCH_LIST
} from '../models/get-data-for-calendar-by-list-type';
import {
  GetResourcesForCalendarByList,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_SHORT,
  PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_FULL
} from '../models/get-resources-for-calendar-by-list-type';
import {
  UPDATE_DATA_VIEW_TYPE_FOR_CALENDAR,
  GetViewTypesForCalendar,
  ItemListType
} from '../models/get-view-types-for-calendar-type';
import { PARAM_SAVE_LOCAL_NAVIGATION } from '../models/get-local-navigation-type';
import { TaskAction } from 'app/modules/tasks/list/task-list.reducer';
import {
  GetEquipmentSuggestionsType,
  EquipmentSuggestionType
} from 'app/modules/calendar/models/get-equipment-suggestions-type';
// import { CommonUtils } from '../models/common-type';

export const ACTION_TYPE_CALENDAR = {
  /** type show and option start */
  CALENDAR_GRID_SHOW_MONTH_GRID: 'calendar/calendarGridShowMonthGrid',
  CALENDAR_GRID_SHOW_WEEK_GRID: 'calendar/calendarGridShowWeekGrid',
  CALENDAR_GRID_SHOW_DAY_GRID: 'calendar/calendarGridShowDayGrid',
  CALENDAR_GRID_SHOW_LIST_GRID: 'calendar/calendarGridShowListGrid',
  CALENDAR_GRID_OPTION_ALL: 'calendar/calendarGridOptionAll',
  CALENDAR_GRID_OPTION_LUNAR_DAY: 'calendar/calendarGridOptionLunarDay',
  CALENDAR_GRID_OPTION_HOLIDAY: 'calendar/calendarGridOptionHoliday',
  CALENDAR_GRID_ONCHANGE_DATE_SHOW: 'calendar/calendarGridOnchangeDateShow',
  CALENDAR_GRID_ONCHANGE_TAB_SCHEDULE_RESOURCE: 'calendar/calendarGridOnchangeTabScheduleResource',
  CALENDAR_GRID_ONCHANGE_KEYWORD_SEARCH: 'calendar/calendarGridOnchangekeyWordSearch',
  /** type show and option end */
  /** grid month start */
  CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE: 'calendar/getDataForCalendarByMonth/SCHEDULE',
  CALENDAR_GRID_GET_CALENDAR_MONTH_RESOURCE: 'calendar/getResourcesForCalendarByMonth/RESOURCE',
  /** grid month end */
  /** grid week start */
  CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE: 'calendar/getDataForCalendarByWeek/SCHEDULE',
  CALENDAR_GRID_GET_CALENDAR_WEEK_RESOURCE: 'calendar/getResourcesForCalendarByWeek/RESOURCE',
  /** grid week end */
  /** grid day start */
  CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE: 'calendar/getDataForCalendarByDay/SCHEDULE',
  CALENDAR_GRID_GET_CALENDAR_DAY_RESOURCE: 'calendar/getResourcesForCalendarByDay/SCHEDULE',
  /** grid day end */
  /** grid list start */
  CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE: 'calendar/getDataForCalendarByList/SCHEDULE',
  CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE: 'calendar/getResourcesForCalendarByList/RESOURCE',
  /** grid list end */

  CALENDAR_GRID_REFRESH_DATA_FLAG: 'calendar/refreshCalendarGridList',
  CALENDAR_GRID_UPDATE_LOCAL_NAVIGATION: 'calendar/updateLocalNavigation',

  CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR: 'calendar/ApiGetViewTypesForCalendar',
  CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR: 'calendar/ApiUpdateViewTypesForCalendar',
  CALENDAR_GRID_API_GET_LOCAL_NAVIGATION: 'calendar/getLocalNavigation',
  CALENDAR_GRID_API_SAVE_LOCAL_NAVIGATION: 'calendar/saveLocalNavigation',
  CALENDAR_GRID_ONCHANGE_LOCAL_NAVIGATION: 'calendar/onChangeLocalNavigation',
  CALENDAR_GRID_SET_LOAD_DATA_RUNNING_BACKGROUND: 'calendar/set/runningBackground',
  CALENDAR_GRID_IS_DRAGGING_IN_MONTH: 'calendar/set/isDragging',
  CALENDAR_GRID_UPDATE_ITEM_DRAGGING_IN_MONTH: 'calendar/set/item/Dragging',
  SET_SEARCH_CONDITIONS_DETAIL: 'search/set/searchConditionsDetail',
  RESET_SEARCH_CONDITIONS_DETAIL: 'search/reset/searchConditionsDetail',
  LOCAL_NAVIGATION_GET_EQUIPMENT_TYPES: 'localNavigation/getEquipmentTypes',
  SET_OVERFLOW: 'localNavigation/setOverflow',

  CALENDAR_GRID_SHOW_POPUP_LIST_CREATE: 'calendar/showPopupListCreate',
  CALENDAR_GRID_SHOW_POPUP_SEARCH_DETAIL: 'calendar/showPopupSearchDetail',
  GET_EQUIPMENT_SUGGESTIONS: 'calendar/GET_EQUIPMENT_SUGGESTIONS',
  RESET_EQUIPMENT_SUGGEST: 'calendar/RESET_EQUIPMENT_SUGGEST'
};

// const _DUMMY_ = false
export enum CalendarGridAction {
  None,
  RequestListCalendar,
  ShowGridMonth,
  ShowGridList,
  RequestErrorCalendar,
  RequestSuccessCalendar
}

enum RunningBackgroundStatus {
  NotRunning = 0,
  RunningBackground = 1,
  LoadingData = 2,
  LoadFailure = 3,
  LoadSuccess = 4
}
const setMomentInit = (date: Date) => {
  return moment(date)
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);
};
const FUNCTION_DIVISION = '01';
// const objDummyDataOfSchedule = new DummyDataOfSchedule()
const initialState = {
  action: CalendarGridAction.None,

  equipmentSuggestions: null,
  dateShow: setMomentInit(CalenderViewMonthCommon.nowDate().toDate()),
  typeShowGrid: null,
  optionAll: true,
  optionLunarDay: null, // show lunar calender
  optionHoliday: null, // show holiday

  startHour: 0,
  endHour: 23,

  dataOfMonth: {
    startDate: null,
    startTimestamp: 0,
    endDate: null,
    endTimestamp: 0,
    refSchedule: {},
    refResource: {},
    listWeeksOfSchedule: [],
    listWeeksOfResource: []
  },
  dataOfDetailWeek: {
    startDate: null,
    startTimestamp: 0,
    endDate: null,
    endTimestamp: 0,

    startHour: 0,
    endHour: 0,

    refSchedule: {},
    refResource: {},

    fullDaySchedule: [],
    fullDayResource: [],
    listHourSchedule: [],
    listHourResource: []
  },
  dataOfDetailDay: {
    startDate: null,
    startTimestamp: 0,
    endDate: null,
    endTimestamp: 0,

    startHour: 0,
    endHour: 0,

    refSchedule: {},
    refResource: {},

    fullDaySchedule: [],
    fullDayResource: [],
    listHourSchedule: [],
    listHourResource: []
  },
  dataOfList: {
    dataSchedule: {},
    dataResource: {}
  },

  numberShowSchedule: 4,

  refreshDataFlag: 1,

  localNavigation: null,

  // search condition
  localSearchKeyword: '',
  searchConditions: null,
  isSearchTask: false,
  isSearchMilestone: false,
  isSearchSchedule: false,

  runningBackground: {},

  listTypeViewOfCalendar: {},
  suscessMessage: null,
  errorMessage: null,
  equipmentTypes: [],
  overflow: false,
  badges: 0
};

export type CalendarGridState = {
  action?: CalendarGridAction;

  equipmentSuggestions: EquipmentSuggestionType[];
  dateShow: moment.Moment;
  typeShowGrid: CalendarView;
  optionAll: boolean;
  optionLunarDay: boolean;
  optionHoliday: boolean;

  startHour: number;
  endHour: number;

  dataOfMonth?: DataOfMonth;
  dataOfDetailWeek?: DataOfDetailWeek;
  dataOfDetailDay: DataOfDetailWeek;
  dataOfList: DataOfViewList;

  numberShowSchedule: number;
  localNavigation: LocalNavigation;

  // search conditon
  localSearchKeyword?: string;
  searchConditions?: any;
  isSearchTask?: boolean;
  isSearchMilestone?: boolean;
  isSearchSchedule?: boolean;

  // Refresh show data in Gird
  refreshDataFlag: number;
  listTypeViewOfCalendar: GetViewTypesForCalendar;

  runningBackground: any;
  suscessMessage?: string;
  errorMessage?: string;

  idDraggingScheduleInMonth?: any;
  aryDraggingItem?: any;
  equipmentTypes?: any;
  overflow?: boolean;

  showPopupListCreate?: boolean;
  showPopupSearchDetail?: boolean;

  badges?: number;
};

const listCalendarApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;
const apiScheduleUrlRestFul = API_CONTEXT_PATH + '/schedules/api';

const getRunningBackgroundApiType = (showGrid: CalendarView, tab: TabForcus) =>
  `${showGrid}_${tab}`;

const handleResponseCalendarMonthSchedule = (
  oldState: CalendarGridState,
  res: any,
  oldItemId?: number,
  oldItemType?: number
) => {
  let dataApi: GetDataForCalendarByMonth = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfMonth = CalenderViewMonthCommon.buildScheduleOfCalendarMonth(
    oldState.dataOfMonth,
    dataApi,
    oldItemId,
    oldItemType
  );
  return { dataRequest };
};

const handleResponseCalendarMonthResource = (
  oldState: CalendarGridState,
  res: any,
  oldResourceId?: number
) => {
  let dataApi: GetResourcesForCalendarByMonth = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfMonth = CalenderViewMonthCommon.buildResourceOfCalendarMonth(
    oldState.dataOfMonth,
    dataApi,
    oldResourceId
  );
  return { dataRequest };
};

const handleResponseCalendarWeekSchedule = (
  oldState: CalendarGridState,
  res: any,
  oldItemId?: number,
  oldItemType?: number
) => {
  let dataApi: GetDataForCalendarByWeek = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfDetailWeek = CalenderViewWeekCommon.buildScheduleOfCalendarWeek(
    oldState.dataOfDetailWeek,
    dataApi,
    0,
    23,
    oldItemId,
    oldItemType
  );

  return { dataRequest };
};

const handleResponseCalendarWeekResource = (
  oldState: CalendarGridState,
  res: any,
  oldResourceId?: number
) => {
  let dataApi: GetResourcesForCalendarByWeek = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfDetailWeek = CalenderViewWeekCommon.buildResourceOfCalendarWeek(
    oldState.dataOfDetailWeek,
    dataApi,
    0,
    23,
    oldResourceId
  );

  return { dataRequest };
};

const handleResponseCalendarDaySchedule = (
  oldState: CalendarGridState,
  res: any,
  oldItemId?: number,
  oldItemType?: number
) => {
  let dataApi: GetDataForCalendarByDay = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfDetailWeek = CalenderViewWeekDay.buildScheduleOfCalendarDay(
    oldState.dataOfDetailDay,
    dataApi,
    oldState.dateShow,
    0,
    23,
    oldItemId,
    oldItemType
  );

  return { dataRequest };
};

const handleResponseCalendarDayResource = (
  oldState: CalendarGridState,
  res: any,
  oldResourceId?: number
) => {
  let dataApi: GetResourcesForCalendarByDay = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfDetailWeek = CalenderViewWeekDay.buildResourceOfCalendarDay(
    oldState.dataOfDetailDay,
    dataApi,
    oldState.dateShow,
    0,
    23,
    oldResourceId
  );

  return { dataRequest };
};

const handleResponseCalendarListSchedule = (
  oldState: CalendarGridState,
  res: any,
  oldItemId?: number,
  oldItemType?: number
) => {
  let dataApi: GetDataForCalendarByList = null;

  if (res) {
    dataApi = res;
  }

  const dataRequest: DataOfViewList = CalenderViewWeekList.buildScheduleOfCalendarList(
    oldState.dataOfList,
    dataApi,
    oldItemId,
    oldItemType
  );

  return { dataRequest, badges: dataApi.badges };
};

const handleResponseCalendarListResource = (
  oldState: CalendarGridState,
  res: any,
  oldResourceId?: number
) => {
  let dataApi: GetResourcesForCalendarByList = null;

  if (res) {
    dataApi = res;
  }
  const dataRequest: DataOfViewList = CalenderViewWeekList.buildResourceOfCalendarList(
    oldState.dataOfList,
    dataApi,
    oldResourceId
  );

  return { dataRequest };
};
const handleDataGetViewTypesForCalendar = (
  oldState: CalendarGridState
): GetViewTypesForCalendar => {
  const listTypeViewOfCalendar: GetViewTypesForCalendar = {};
  listTypeViewOfCalendar.itemList = oldState.listTypeViewOfCalendar.itemList;
  listTypeViewOfCalendar.itemList &&
    listTypeViewOfCalendar.itemList.map(element => {
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Month
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.month';
        element.itemValue = oldState.typeShowGrid === element.itemId ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Week
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.week';
        element.itemValue = oldState.typeShowGrid === element.itemId ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Day
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.day';
        element.itemValue = oldState.typeShowGrid === element.itemId ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.List
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.list';
        element.itemValue = oldState.typeShowGrid === element.itemId ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowAll
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.option1';
        element.itemValue = oldState.optionAll ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowLunarDay
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.option2';
        element.itemValue = oldState.optionLunarDay ? 1 : 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowHoliday
      ) {
        element.itemLabel = 'calendars.commons.typeView.label.option3';
        element.itemValue = oldState.optionHoliday ? 1 : 0;
      }
    });
  return listTypeViewOfCalendar;
};
const handleResponseApiGetViewTypesForCalendar = (oldState: CalendarGridState, res: any) => {
  // call API and set data to state
  let typeShowGrid = CalendarView.Month;
  let optionShowAllLocal = false;
  let optionLunarDay = false;
  let optionHoliday = false;
  const listTypeViewOfCalendar: GetViewTypesForCalendar = {};
  const nowDate = CalenderViewMonthCommon.nowDate();
  const newObject = (type, id, label, value?): ItemListType => {
    return {
      itemType: type,
      itemId: id,
      itemLabel: label,
      itemValue: value,
      updatedDate: nowDate.utc().format()
    };
  };
  const updateValue = (id, value?, updated?) => {
    const indexFind = listTypeViewOfCalendar.itemList.findIndex(e => e.itemId === id);
    if (indexFind > -1) {
      listTypeViewOfCalendar.itemList[indexFind]['itemValue'] = value;
      listTypeViewOfCalendar.itemList[indexFind]['updatedDate'] = updated;
    }
  };

  listTypeViewOfCalendar.itemList = [];
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionSelect,
      CalendarView.Month,
      'calendars.commons.typeView.label.month',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionSelect,
      CalendarView.Week,
      'calendars.commons.typeView.label.week',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionSelect,
      CalendarView.Day,
      'calendars.commons.typeView.label.day',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionSelect,
      CalendarView.List,
      'calendars.commons.typeView.label.list',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionCheckBox,
      CalendarView.OptionShowAll,
      'calendars.commons.typeView.label.option1',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionCheckBox,
      CalendarView.OptionShowLunarDay,
      'calendars.commons.typeView.label.option2',
      0
    )
  );
  listTypeViewOfCalendar.itemList.push(
    newObject(
      VIEW_TYPE_CALENDAR.OptionCheckBox,
      CalendarView.OptionShowHoliday,
      'calendars.commons.typeView.label.option3',
      0
    )
  );

  const itemList = (res && res.itemList) || [];
  itemList &&
    itemList.map(element => {
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Month
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        if (element.itemValue > 0) {
          typeShowGrid = CalendarView.Month;
        }
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Week
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        if (element.itemValue > 0) {
          typeShowGrid = CalendarView.Week;
        }
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.Day
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        if (element.itemValue > 0) {
          typeShowGrid = CalendarView.Day;
        }
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionSelect &&
        element.itemId === CalendarView.List
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        if (element.itemValue > 0) {
          typeShowGrid = CalendarView.List;
        }
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowAll
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        optionShowAllLocal = element.itemValue > 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowLunarDay
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        optionLunarDay = element.itemValue > 0;
      }
      if (
        element.itemType === VIEW_TYPE_CALENDAR.OptionCheckBox &&
        element.itemId === CalendarView.OptionShowHoliday
      ) {
        updateValue(element.itemId, element.itemValue, element.updatedDate);
        optionHoliday = element.itemValue > 0;
      }
    });

  return {
    typeShowGrid,
    optionShowAll: optionShowAllLocal,
    optionLunarDay,
    optionHoliday,
    listTypeViewOfCalendar
  };
};

/**
 * sort data response by order
 * @param res
 */
const handleResponseEquipSuggestion = (res: GetEquipmentSuggestionsType) => {
  const draftData = JSON.parse(JSON.stringify(res.data));
  if (Array.isArray(draftData)) draftData.sort((a, b) => a.displayOrder - b.displayOrder);

  return draftData;
};

const handleResponseApiGetLocalNavigation = (oldState: CalendarGridState, res: any) => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  const newLocalNavigation: LocalNavigation = {};

  if (_.has(res, 'searchDynamic') && _.has(res, 'searchStatic')) {
    newLocalNavigation.searchConditions = res;
    const searchStatic = newLocalNavigation && newLocalNavigation.searchConditions.searchStatic;
    newLocalNavigation.tabFocus =
      !searchStatic || !searchStatic['viewTab'] ? TabForcus.Schedule : TabForcus.Resource;
  }
  return { errorMsg, action, localNavigation: newLocalNavigation };
};

// export type CalendarGridState = Readonly<typeof initialState>
/**
 *
 * @param state
 * @param action
 */
const stateActionCallApi = (state: CalendarGridState, action): CalendarGridState => {
  let res;
  switch (action.type) {
    // load data for month view
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_RESOURCE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_RESOURCE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_RESOURCE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_LOCAL_NAVIGATION):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_SAVE_LOCAL_NAVIGATION):
    case REQUEST(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR):
    case REQUEST(ACTION_TYPE_CALENDAR.LOCAL_NAVIGATION_GET_EQUIPMENT_TYPES):
    case REQUEST(ACTION_TYPE_CALENDAR.GET_EQUIPMENT_SUGGESTIONS):
      return {
        ...state,
        action: CalendarGridAction.RequestListCalendar
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Month, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_RESOURCE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Month, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Week, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_RESOURCE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Week, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Day, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_RESOURCE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Day, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.List, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE):
      state.runningBackground[getRunningBackgroundApiType(CalendarView.List, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadFailure;
      return {
        ...state,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR):
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_LOCAL_NAVIGATION):
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_SAVE_LOCAL_NAVIGATION):
    case FAILURE(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR):
    case FAILURE(ACTION_TYPE_CALENDAR.GET_EQUIPMENT_SUGGESTIONS):
    case FAILURE(ACTION_TYPE_CALENDAR.LOCAL_NAVIGATION_GET_EQUIPMENT_TYPES):
      return {
        ...state,
        action: CalendarGridAction.RequestErrorCalendar,
        errorMessage: action.payload,
        suscessMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE):
      res = handleResponseCalendarMonthSchedule(
        state,
        action.payload.data,
        action.payload.itemId,
        action.payload.itemType
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Month, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfMonth: res.dataRequest,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_RESOURCE):
      res = handleResponseCalendarMonthResource(
        state,
        action.payload.data,
        action.payload.resourceId
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Month, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfMonth: res.dataRequest,
        errorMessage: null
      };

    // load data for week view
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE):
      res = handleResponseCalendarWeekSchedule(
        state,
        action.payload.data,
        action.payload.itemId,
        action.payload.itemType
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Week, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfDetailWeek: res.dataRequest,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_RESOURCE):
      res = handleResponseCalendarWeekResource(
        state,
        action.payload.data,
        action.payload.resourceId
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Week, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfDetailWeek: res.dataRequest,
        errorMessage: null
      };

    // load data for day view
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE):
      res = handleResponseCalendarDaySchedule(
        state,
        action.payload.data,
        action.payload.itemId,
        action.payload.itemType
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Day, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfDetailDay: res.dataRequest,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_RESOURCE):
      res = handleResponseCalendarDayResource(
        state,
        action.payload.data,
        action.payload.resourceId
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.Day, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfDetailDay: res.dataRequest,
        errorMessage: null
      };

    // load data for list view
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE):
      res = handleResponseCalendarListSchedule(
        state,
        action.payload.data,
        action.payload.itemId,
        action.payload.itemType
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.List, TabForcus.Schedule)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfList: res.dataRequest,
        errorMessage: null,
        badges: res.badges
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE):
      res = handleResponseCalendarListResource(
        state,
        action.payload.data,
        action.payload.resourceId
      );
      state.runningBackground[getRunningBackgroundApiType(CalendarView.List, TabForcus.Resource)] =
        RunningBackgroundStatus.LoadSuccess;
      return {
        ...state,
        dataOfList: res.dataRequest,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR):
      res = handleResponseApiGetViewTypesForCalendar(state, action.payload.data);
      return {
        ...state,
        typeShowGrid: res.typeShowGrid,
        optionAll: res.optionShowAll,
        optionLunarDay: res.optionLunarDay,
        optionHoliday: res.optionHoliday,
        listTypeViewOfCalendar: res.listTypeViewOfCalendar,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_LOCAL_NAVIGATION):
      res = handleResponseApiGetLocalNavigation(state, action.payload.data);
      return {
        ...state,
        localNavigation: res.localNavigation,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR): {
      res = handleDataGetViewTypesForCalendar(state);
      return {
        ...state,
        listTypeViewOfCalendar: res
      };
    }
    default:
      return null;
  }
};

export default (state: CalendarGridState = initialState, action): CalendarGridState => {
  const apiState = stateActionCallApi(state, action);
  let res = null;
  if (apiState) return apiState;
  switch (action.type) {
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_MONTH_GRID:
      return {
        ...state,
        typeShowGrid: CalendarView.Month
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_WEEK_GRID:
      return {
        ...state,
        typeShowGrid: CalendarView.Week
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_DAY_GRID:
      return {
        ...state,
        typeShowGrid: CalendarView.Day
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_LIST_GRID:
      return {
        ...state,
        typeShowGrid: CalendarView.List
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_DATE_SHOW:
      return {
        ...state,
        dateShow: action.payload.clone()
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_ALL:
      return {
        ...state,
        optionAll: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_LUNAR_DAY:
      return {
        ...state,
        optionLunarDay: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_HOLIDAY:
      return {
        ...state,
        optionHoliday: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_TAB_SCHEDULE_RESOURCE: {
      state.localNavigation.tabFocus = action.payload;
      state.localNavigation.searchConditions.searchStatic.viewTab = action.payload;
      return state;
    }
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG:
      state.refreshDataFlag++;
      return state;
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_UPDATE_LOCAL_NAVIGATION:
      return {
        ...state,
        localNavigation: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SET_LOAD_DATA_RUNNING_BACKGROUND:
      state.runningBackground[action.payload.typeShowGridLoad] = action.payload.isRunningBackground;
      return state;
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_KEYWORD_SEARCH:
      return {
        ...state,
        localSearchKeyword: action.payload,
        searchConditions: null
      };
      return state;
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_IS_DRAGGING_IN_MONTH:
      return {
        ...state,
        idDraggingScheduleInMonth: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_UPDATE_ITEM_DRAGGING_IN_MONTH:
      return {
        ...state,
        aryDraggingItem: action.payload
      };
    case ACTION_TYPE_CALENDAR.SET_SEARCH_CONDITIONS_DETAIL:
      return {
        ...state,
        searchConditions: action.payload.searchConditions,
        isSearchSchedule: action.payload.isSearchSchedule,
        isSearchTask: action.payload.isSearchTask,
        isSearchMilestone: action.payload.isSearchMilestone
      };
    case ACTION_TYPE_CALENDAR.RESET_SEARCH_CONDITIONS_DETAIL:
      return {
        ...state,
        searchConditions: null,
        isSearchSchedule: false,
        isSearchTask: false,
        isSearchMilestone: false
      };
    case ACTION_TYPE_CALENDAR.SET_OVERFLOW:
      return {
        ...state,
        // overflow: action.payload,
        overflow: false
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_POPUP_LIST_CREATE:
      return {
        ...state,
        showPopupListCreate: action.payload
      };
    case ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_POPUP_SEARCH_DETAIL:
      return {
        ...state,
        showPopupSearchDetail: action.payload
      };
    case ACTION_TYPE_CALENDAR.RESET_EQUIPMENT_SUGGEST:
      return {
        ...state,
        equipmentSuggestions: null
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_SAVE_LOCAL_NAVIGATION): {
      return {
        ...state,
        action: CalendarGridAction.RequestSuccessCalendar
      };
    }
    case SUCCESS(ACTION_TYPE_CALENDAR.GET_EQUIPMENT_SUGGESTIONS):
      res = handleResponseEquipSuggestion(action.payload.data);
      return {
        ...state,
        equipmentSuggestions: res
      };
    case SUCCESS(ACTION_TYPE_CALENDAR.LOCAL_NAVIGATION_GET_EQUIPMENT_TYPES): {
      return {
        ...state,
        action: CalendarGridAction.RequestSuccessCalendar,
        errorMessage: null,
        equipmentTypes: action.payload.data.equipmentTypes
      };
    }
    default:
      return state;
  }
};

export const onChangeKeySearchListSchedules = (keyWord: string) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_KEYWORD_SEARCH,
    payload: keyWord
  };
};

/**
 * call API getDataForCalendarByMonth
 */
const getDataApiOfMonthSchedule = (girdState: CalendarGridState, schedule?: DataOfSchedule) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_SCHEDULE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-data-for-calendar-by-month`,
      schedule
        ? PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            schedule
          )
        : PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_FULL(girdState.dateShow, girdState.localNavigation),
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * Call Api getViewTypesForCalendar
 */
const getViewTypesForCalendar = () => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR, // ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_VIEW_TYPES_FOR_CALENDAR,
    payload: axios.post(
      `${listCalendarApiUrl}/get-view-types-for-calendar`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

export const updateDataTypeViewOfCalendar = (itemId: number, itemValue, updatedDate) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_UPDATE_TYPE_VIEW_OF_CALENDAR,
    payload: axios.post(
      `${listCalendarApiUrl}/update-view-type-for-calendar`,
      UPDATE_DATA_VIEW_TYPE_FOR_CALENDAR(itemId, itemValue, updatedDate),
      { headers: { 'Content-Type': 'application/json' } }
    )
  });
  await dispatch(getViewTypesForCalendar());
};

/**
 * call API getResourcesForCalendarByMonth
 */
const getDataApiOfMonthResource = (girdState: CalendarGridState, resource?: DataOfResource) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_MONTH_RESOURCE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-resources-for-calendar-by-month`,
      resource
        ? PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            resource
          )
        : PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_FULL(
            girdState.dateShow,
            girdState.localNavigation
          ),
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * call API getDataForCalendarByWeek
 */
const getDataApiOfWeekSchedule = (girdState: CalendarGridState, schedule?: DataOfSchedule) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_SCHEDULE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-data-for-calendar-by-week`,
      schedule
        ? PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            schedule
          )
        : PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_FULL(girdState.dateShow, girdState.localNavigation),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * call API getResourcesForCalendarByWeek
 */
const getDataApiOfWeekResource = (girdState: CalendarGridState, resource?: DataOfResource) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_WEEK_RESOURCE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-resources-for-calendar-by-week`,
      resource
        ? PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            resource
          )
        : PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_FULL(
            girdState.dateShow,
            girdState.localNavigation
          ),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * call API getDataForCalendarByDay
 */
const getDataApiOfDaySchedule = (girdState: CalendarGridState, schedule?: DataOfSchedule) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_SCHEDULE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-data-for-calendar-by-day`,
      schedule
        ? PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            schedule
          )
        : PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_FULL(girdState.dateShow, girdState.localNavigation),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * call API getResourcesForCalendarByDay
 */
const getDataApiOfDayResource = (girdState: CalendarGridState, resource?: DataOfResource) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_DAY_RESOURCE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-resources-for-calendar-by-day`,
      resource
        ? PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_SHORT(
            girdState.dateShow,
            girdState.localNavigation,
            resource
          )
        : PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_FULL(
            girdState.dateShow,
            girdState.localNavigation
          ),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * call API getDataForCalendarByList
 */
const getDataApiOfListSchedule = (
  girdState: CalendarGridState,
  schedule?: DataOfSchedule,
  dateTo?: moment.Moment,
  modeSearch?: MODE_SEARCH_LIST
) => {
  const dateFrom = girdState.dateShow;
  const limit = girdState.localNavigation.limitLoadDataInListView || LimitLoadDataInListView;

  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_SCHEDULE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-data-for-calendar-by-list`,
      schedule
        ? PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_SHORT(
            modeSearch || MODE_SEARCH_LIST.None,
            dateFrom,
            dateTo,
            girdState.localNavigation,
            schedule,
            limit,
            0,
            girdState.localSearchKeyword
          )
        : PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_FULL(
            modeSearch || (girdState.searchConditions && MODE_SEARCH_LIST.SearchDetail),
            dateFrom,
            dateTo,
            girdState.localNavigation,
            limit,
            0,
            girdState.localSearchKeyword,
            girdState.searchConditions,
            girdState.isSearchSchedule,
            girdState.isSearchTask,
            girdState.isSearchMilestone
          ),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * call API getResourcesForCalendarByList
 */
const getDataApiOfListResource = (
  girdState: CalendarGridState,
  resource?: DataOfResource,
  dateTo?: moment.Moment
) => {
  const dateFrom = girdState.dateShow;
  const limit = LimitLoadDataInListView;

  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_GET_CALENDAR_LIST_RESOURCE,
    payload: axios.post(
      `${listCalendarApiUrl}/get-resources-for-calendar-by-list`,
      resource
        ? PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_SHORT(
            dateFrom,
            dateTo,
            girdState.localNavigation,
            resource,
            limit,
            0
          )
        : PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_FULL(
            dateFrom,
            dateTo,
            girdState.localNavigation,
            limit,
            0
          ),
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

/**
 * Call Api getLocalNavigation
 */
const getLocalNavigation = () => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_LOCAL_NAVIGATION, // ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_GET_LOCAL_NAVIGATION,
    payload: axios.post(
      `${listCalendarApiUrl}/get-local-navigation`,
      { functionDivision: FUNCTION_DIVISION },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

const setRunningBackground = (inputTypeShowGridLoad: string, running: RunningBackgroundStatus) => {
  return {
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SET_LOAD_DATA_RUNNING_BACKGROUND,
    payload: {
      typeShowGridLoad: inputTypeShowGridLoad,
      isRunningBackground: running
    }
  };
};

/** dispatch get data api end */

/**
 * handle reload data of list calendar
 *  If typeLoad != NULL:  Case load data for only view of typeLoad
 *  IF item != NULL: Case load data for only item
 *  If typeLoad = NULL :
 *      Case load data for current view (girdState.typeShowGrid)
 *      All other view is running background
 *  If item = NULL : Case load All data by search condition in girdState (showDate and localNavigation)
 */
export const handleReloadData = (
  typeLoad?: CalendarView,
  schedule?: DataOfSchedule,
  resource?: DataOfResource
) => async (dispatch, getState) => {
  const girdState: CalendarGridState = getState().dataCalendarGrid;
  // create search condition state
  if (!girdState.localNavigation) return;
  const tab = girdState.localNavigation.tabFocus;
  // const listViewType = [CalendarView.Month, CalendarView.Week, CalendarView.Day, CalendarView.List]
  const listFunctions = {};
  listFunctions[CalendarView.Month] = [getDataApiOfMonthSchedule, getDataApiOfMonthResource];
  listFunctions[CalendarView.Week] = [getDataApiOfWeekSchedule, getDataApiOfWeekResource];
  listFunctions[CalendarView.Day] = [getDataApiOfDaySchedule, getDataApiOfDayResource];
  listFunctions[CalendarView.List] = [getDataApiOfListSchedule, getDataApiOfListResource];

  const loadDataForView = typeLoad || girdState.typeShowGrid;
  const aryRunFunctions = listFunctions[loadDataForView];
  if (!aryRunFunctions) return;

  if (tab === TabForcus.Schedule) {
    // call getData  to show grid
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(loadDataForView, TabForcus.Schedule),
        RunningBackgroundStatus.LoadingData
      )
    );
    await dispatch(aryRunFunctions[0](girdState, schedule));
    // refesh data grid
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
    // call data running background
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(loadDataForView, TabForcus.Resource),
        RunningBackgroundStatus.RunningBackground
      )
    );
    dispatch(aryRunFunctions[1](girdState, resource));
  } else {
    // call getData  to show grid
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(loadDataForView, TabForcus.Resource),
        RunningBackgroundStatus.LoadingData
      )
    );
    await dispatch(aryRunFunctions[1](girdState, resource));
    // refesh data grid
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
    // call data running background
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(loadDataForView, TabForcus.Schedule),
        RunningBackgroundStatus.RunningBackground
      )
    );
    dispatch(aryRunFunctions[0](girdState, schedule));
  }
  // get data for other view (running background)
  // if (!typeLoad) {
  //   for (let i = 0 i < listViewType.length i++) {
  //     if (listViewType[i] !== loadDataForView) {
  //       const otherCalls = listFunctions[listViewType[i]]
  //       await dispatch(
  //         setRunningBackground(getRunningBackgroundApiType(listViewType[i], TabForcus.Schedule), RunningBackgroundStatus.RunningBackground)
  //       )
  //       await dispatch(
  //         setRunningBackground(getRunningBackgroundApiType(listViewType[i], TabForcus.Resource), RunningBackgroundStatus.RunningBackground)
  //       )
  //       dispatch(otherCalls[0](girdState, schedule))
  //       dispatch(otherCalls[1](girdState, resource))
  //     }
  //   }
  // }
};

export const onChangeTabShow = (tab: TabForcus, notLoadDataFlg?: boolean) => async (
  dispatch,
  getState
) => {
  const oldState: CalendarGridState = getState().dataCalendarGrid;
  const statusLoadding =
    oldState.runningBackground[getRunningBackgroundApiType(oldState.typeShowGrid, tab)];
  // change tab
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_TAB_SCHEDULE_RESOURCE,
    payload: tab
  });

  // check load data
  const loadDataFailure =
    !statusLoadding ||
    statusLoadding === RunningBackgroundStatus.NotRunning ||
    statusLoadding === RunningBackgroundStatus.LoadFailure;
  const isLoadData = loadDataFailure && !notLoadDataFlg;
  if (isLoadData) {
    await dispatch(handleReloadData(oldState.typeShowGrid));
  } else {
    // refesh data to view
    await dispatch({
      type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG
    });
  }
};

/**
 * event call api saveLocalNavigation
 * @param localNavigation
 */
export const handleSaveLocalNavigation = (localNavigationData: LocalNavigation) => async (
  dispatch,
  getState
) => {
  const params = {
    searchStatic: localNavigationData.searchConditions.searchStatic,
    searchDynamic: {
      departments: [],
      groups: [],
      scheduleTypes: [],
      equipmentTypes: []
    }
    // searchDynamic: localNavigationData.searchConditions.searchDynamic
  };
  if (localNavigationData.searchConditions.searchDynamic.equipmentTypes) {
    params.searchDynamic.equipmentTypes = localNavigationData.searchConditions.searchDynamic.equipmentTypes.map(
      ({ equipmentTypeId, isSelected }) => ({
        equipmentTypeId,
        isSelected
      })
    );
  }
  if (localNavigationData.searchConditions.searchDynamic.scheduleTypes) {
    params.searchDynamic.scheduleTypes = localNavigationData.searchConditions.searchDynamic.scheduleTypes.map(
      ({ scheduleTypeId, isSelected }) => ({
        scheduleTypeId,
        isSelected
      })
    );
  }
  if (localNavigationData.searchConditions.searchDynamic.departments) {
    params.searchDynamic.departments = localNavigationData.searchConditions.searchDynamic.departments.map(
      department => {
        let employeeList = [];
        if (department.employees) {
          employeeList = department.employees.map(({ employeeId, isSelected, color }) => ({
            employeeId,
            isSelected,
            color
          }));
        }
        return {
          employees: employeeList,
          departmentId: department.departmentId,
          isSelected: department.isSelected
        };
      }
    );
  }
  if (localNavigationData.searchConditions.searchDynamic.groups) {
    params.searchDynamic.groups = localNavigationData.searchConditions.searchDynamic.groups.map(
      group => {
        let employeeList = [];
        if (group.employees) {
          employeeList = group.employees.map(({ employeeId, isSelected, color }) => ({
            employeeId,
            isSelected,
            color
          }));
        }
        return { employees: employeeList, groupId: group.groupId, isSelected: group.isSelected };
      }
    );
  }
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_API_SAVE_LOCAL_NAVIGATION,
    payload: axios.post(
      `${listCalendarApiUrl}/save-local-navigation`,
      PARAM_SAVE_LOCAL_NAVIGATION(FUNCTION_DIVISION, params),
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  await dispatch(handleReloadData());
};
export const onChangeLocalNavigation = (
  localNavigation: LocalNavigation,
  notSave?: boolean
) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_UPDATE_LOCAL_NAVIGATION,
    payload: localNavigation
  });
  if (!notSave) {
    await dispatch(handleSaveLocalNavigation(getState().dataCalendarGrid.localNavigation));
  } else {
    // if not save data then reload data
    await dispatch(handleReloadData());
  }
};
const getCurrentTabfocus = (oldState: CalendarGridState) => {
  if (!oldState.localNavigation) return;
  return oldState.localNavigation.tabFocus;
};
export const showMonthGrid = (notLoadDataFlg?: boolean) => async (dispatch, getState) => {
  // const girdState: CalendarGridState = getState().dataCalendarGrid
  // const statusLoadding = girdState.runningBackground[getRunningBackgroundApiType(CalendarView.Month, getCurrentTabfocus(girdState))]
  // if (!statusLoadding || statusLoadding === RunningBackgroundStatus.NotRunning || statusLoadding === RunningBackgroundStatus.LoadFailure) {
  //   await dispatch(handleReloadData(CalendarView.Month))
  // }
  await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_MONTH_GRID });
  if (!notLoadDataFlg) {
    dispatch(handleReloadData());
  } else {
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
  }
};
export const showWeekGrid = (notLoadDataFlg?: boolean) => async (dispatch, getState) => {
  // const girdState: CalendarGridState = getState().dataCalendarGrid
  // const statusLoadding = girdState.runningBackground[getRunningBackgroundApiType(CalendarView.Week, getCurrentTabfocus(girdState))]
  // if (!statusLoadding || statusLoadding === RunningBackgroundStatus.NotRunning || statusLoadding === RunningBackgroundStatus.LoadFailure) {
  //   await dispatch(handleReloadData(CalendarView.Week))
  // }
  await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_WEEK_GRID });
  if (!notLoadDataFlg) {
    dispatch(handleReloadData());
  } else {
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
  }
};
export const showDayGrid = (notLoadDataFlg?: boolean) => async (dispatch, getState) => {
  // const girdState: CalendarGridState = getState().dataCalendarGrid
  // const statusLoadding = girdState.runningBackground[getRunningBackgroundApiType(CalendarView.Day, getCurrentTabfocus(girdState))]
  // if (!statusLoadding || statusLoadding === RunningBackgroundStatus.NotRunning || statusLoadding === RunningBackgroundStatus.LoadFailure) {
  //   await dispatch(handleReloadData(CalendarView.Day))
  // }
  await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_DAY_GRID });
  if (!notLoadDataFlg) {
    dispatch(handleReloadData());
  } else {
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
  }
};
export const showListGrid = (notLoadDataFlg?: boolean) => async (dispatch, getState) => {
  // const girdState: CalendarGridState = getState().dataCalendarGrid
  // const statusLoadding = girdState.runningBackground[getRunningBackgroundApiType(CalendarView.List, getCurrentTabfocus(girdState))]
  // if (!statusLoadding || statusLoadding === RunningBackgroundStatus.NotRunning || statusLoadding === RunningBackgroundStatus.LoadFailure) {
  //   await dispatch(handleReloadData(CalendarView.List))
  // }
  await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_LIST_GRID });
  if (!notLoadDataFlg) {
    dispatch(handleReloadData());
  } else {
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
  }
};
export const optionShowAll = option => ({
  type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_ALL,
  payload: option
});
export const optionShowLunarDay = option => ({
  type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_LUNAR_DAY,
  payload: option
});
export const optionShowHoliday = option => ({
  type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_OPTION_HOLIDAY,
  payload: option
});

export const onChangeDateShow = (
  dateMoment: moment.Moment,
  amount?: number,
  typeShowGrid?: CalendarView,
  notLoadDataFlg?: boolean
) => async (dispatch, getState) => {
  let dateMomentNew = dateMoment.clone();
  if (typeShowGrid && amount) {
    switch (typeShowGrid) {
      case CalendarView.Month: {
        dateMomentNew = dateMoment.add(amount, 'months').clone();
        break;
      }
      case CalendarView.Week: {
        dateMomentNew = dateMoment.add(amount, 'weeks').clone();
        break;
      }
      case CalendarView.List:
      case CalendarView.Day: {
        dateMomentNew = dateMoment.add(amount, 'days').clone();
        break;
      }
      default:
        break;
    }
  }
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_ONCHANGE_DATE_SHOW,
    payload: dateMomentNew
  });
  if (!notLoadDataFlg) {
    await dispatch(handleReloadData());
  }
};

export const handleReloadDataNextOfListView = (
  schedule?: DataOfSchedule,
  resource?: DataOfResource,
  toDate?: moment.Moment
) => async (dispatch, getState) => {
  const girdState: CalendarGridState = getState().dataCalendarGrid;
  // create search condition state
  if (!girdState.localNavigation) return;
  const tab = girdState.localNavigation.tabFocus;
  if (tab === TabForcus.Schedule) {
    // call getData  to show grid
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(CalendarView.List, TabForcus.Schedule),
        RunningBackgroundStatus.LoadingData
      )
    );
    await dispatch(getDataApiOfListSchedule(girdState, schedule, toDate));
    // refesh data grid
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
    // call data running background
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(CalendarView.List, TabForcus.Resource),
        RunningBackgroundStatus.RunningBackground
      )
    );
    dispatch(getDataApiOfListResource(girdState, resource, toDate));
  } else {
    // call getData  to show grid
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(CalendarView.List, TabForcus.Resource),
        RunningBackgroundStatus.LoadingData
      )
    );
    await dispatch(getDataApiOfListResource(girdState, resource, toDate));
    // refesh data grid
    await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
    // call data running background
    await dispatch(
      setRunningBackground(
        getRunningBackgroundApiType(CalendarView.List, TabForcus.Schedule),
        RunningBackgroundStatus.RunningBackground
      )
    );
    dispatch(getDataApiOfListSchedule(girdState, schedule, toDate));
  }
};

export const handleReloadSearchDataOfListView = (
  localSearchKeyword?: string,
  schedule?: DataOfSchedule,
  resource?: DataOfResource
) => async (dispatch, getState) => {
  const girdState: CalendarGridState = getState().dataCalendarGrid;

  // create condition search for state
  if (!girdState.localNavigation) return;
  const tab = girdState.localNavigation.tabFocus;
  const notLoadDataOnChangeTab = true;
  if (tab === TabForcus.Resource) {
    // change tab if focus tab resource
    await dispatch(onChangeTabShow(TabForcus.Schedule, notLoadDataOnChangeTab));
  }
  // change view
  if (girdState.typeShowGrid !== CalendarView.List) {
    await dispatch(showListGrid(notLoadDataOnChangeTab));
  }
  // change localSearchKeyword state
  await dispatch(onChangeKeySearchListSchedules(localSearchKeyword));

  // call getData  to show grid
  await dispatch(
    setRunningBackground(
      getRunningBackgroundApiType(CalendarView.List, TabForcus.Schedule),
      RunningBackgroundStatus.LoadingData
    )
  );
  await dispatch(
    getDataApiOfListSchedule(girdState, schedule, null, MODE_SEARCH_LIST.SearchKeyword)
  );

  // refesh data grid
  await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
};

/**
 * Get view Calendar
 */
export const getViewCalendar = () => async (dispatch, getState) => {
  await dispatch(getViewTypesForCalendar());
};

/**
 * handle load data of first time
 */
export const handleInitData = () => async (dispatch, getState) => {
  const girdState: CalendarGridState = getState().dataCalendarGrid;
  // call API get view type
  await dispatch(getViewTypesForCalendar());
  await dispatch(getLocalNavigation());
  await dispatch(
    onChangeDateShow(CalenderViewMonthCommon.nowDate(), 0, girdState.typeShowGrid, true)
  );
  await dispatch(handleReloadData());
};

/**
 * Get Next schedule
 * @param itemId
 * @param itemType
 */
export const getNextSchedule = (itemId: number, itemType: ItemTypeSchedule) => (
  dispatch,
  getState
): DataOfSchedule => {
  const oldState: CalendarGridState = getState().dataCalendarGrid;
  if (!oldState) return null;
  const typeShowGrid: CalendarView = oldState.typeShowGrid;
  if (typeShowGrid === CalendarView.Month)
    return CalenderViewMonthCommon.getNextSchedule(oldState.dataOfMonth, itemId, itemType);
  if (typeShowGrid === CalendarView.Week)
    return CalenderViewWeekCommon.getNextSchedule(oldState.dataOfDetailWeek, itemId, itemType);
  if (typeShowGrid === CalendarView.Day)
    return CalenderViewWeekDay.getNextSchedule(oldState.dataOfDetailDay, itemId, itemType);
  if (typeShowGrid === CalendarView.List)
    return CalenderViewWeekList.getNextSchedule(oldState.dataOfList, itemId, itemType);
};

/**
 * Get Previous schedule
 * @param itemId
 * @param itemType
 */
export const getPreviousSchedule = (itemId: number, itemType: ItemTypeSchedule) => (
  dispatch,
  getState
): DataOfSchedule => {
  const oldState: CalendarGridState = getState().dataCalendarGrid;
  if (!oldState) return null;
  const typeShowGrid: CalendarView = oldState.typeShowGrid;
  if (typeShowGrid === CalendarView.Month)
    return CalenderViewMonthCommon.getPreviousSchedule(oldState.dataOfMonth, itemId, itemType);
  if (typeShowGrid === CalendarView.Week)
    return CalenderViewWeekCommon.getPreviousSchedule(oldState.dataOfDetailWeek, itemId, itemType);
  if (typeShowGrid === CalendarView.Day)
    return CalenderViewWeekDay.getPreviousSchedule(oldState.dataOfDetailDay, itemId, itemType);
  if (typeShowGrid === CalendarView.List)
    return CalenderViewWeekList.getPreviousSchedule(oldState.dataOfList, itemId, itemType);
};

/**
 * Refresh data when delete completed
 * @param scheduleId
 */
export const handleDelete = (scheduleId: number, itemTypeSchedule: number) => async (
  dispatch,
  getState
) => {
  await dispatch(handleReloadData());
  // const oldState: CalendarGridState = getState().dataCalendarGrid;
  // if (!oldState) return null;
  // const typeShowGrid: CalendarView = oldState.typeShowGrid;
  // if (!oldState.localNavigation) return;
  // const tab = oldState.localNavigation.tabFocus;
  // if (tab === TabForcus.Resource) {
  //   // change tab if focus tab resource
  //   await dispatch(handleReloadData());
  // } else {
  //   if (typeShowGrid === CalendarView.Month)
  //     CalenderViewMonthCommon.removeObject(
  //       oldState.dataOfMonth,
  //       scheduleId,
  //       true,
  //       itemTypeSchedule
  //     );
  //   if (typeShowGrid === CalendarView.Week)
  //     CalenderViewWeekCommon.removeObject(
  //       oldState.dataOfDetailWeek,
  //       scheduleId,
  //       true,
  //       itemTypeSchedule
  //     );
  //   if (typeShowGrid === CalendarView.Day)
  //     CalenderViewWeekCommon.removeObject(
  //       oldState.dataOfDetailDay,
  //       scheduleId,
  //       true,
  //       itemTypeSchedule
  //     );
  //   if (typeShowGrid === CalendarView.List)
  //     CalenderViewWeekList.removeObject(oldState.dataOfList, scheduleId, true, itemTypeSchedule);

  //   // refesh data grid
  //   await dispatch({ type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_REFRESH_DATA_FLAG });
  // }
};

/**
 * handle dragging schedule
 */
export const handleDragging = (idDragging: string) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_IS_DRAGGING_IN_MONTH,
    payload: idDragging
  });
};

/**
 * handle dragging schedule
 */
export const handleUpdateItemDragging = (aryItem: any) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_UPDATE_ITEM_DRAGGING_IN_MONTH,
    payload: aryItem
  });
};

/**
 * handle dragging schedule
 */
export const setShowPopupListCreate = (flg: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_POPUP_LIST_CREATE,
    payload: flg
  });
};

/**
 * handle dragging schedule
 */
export const setShowPopupSearchDetail = (flg: boolean) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.CALENDAR_GRID_SHOW_POPUP_SEARCH_DETAIL,
    payload: flg
  });
};

export const handleSearchConditions = (
  searchConditions,
  isSearchSchedule,
  isSearchTask,
  isSearchMilestone
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.SET_SEARCH_CONDITIONS_DETAIL,
    payload: { searchConditions, isSearchSchedule, isSearchTask, isSearchMilestone }
  });
  await dispatch(showListGrid(true));
  await dispatch(handleReloadData());
};

export const handleResetSearchConditions = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPE_CALENDAR.RESET_SEARCH_CONDITIONS_DETAIL,
    payload: null
  });
};

export const getEquipmentTypes = (flag = false) => ({
  type: ACTION_TYPE_CALENDAR.LOCAL_NAVIGATION_GET_EQUIPMENT_TYPES,
  payload: axios.post(
    `${listCalendarApiUrl}/get-equipment-types`,
    { isContainEquipment: flag },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * set overFlow visible
 * @param flag
 */
export const setOverFlow = (flag: boolean) => ({
  type: ACTION_TYPE_CALENDAR.SET_OVERFLOW,
  payload: flag
});

/**
 * call api equipment suggestion
 * @param equipmentTypeId
 * @param searchValue
 */
export const getEquipmentSuggestionsData = (equipmentTypeId: number, searchValue: string) => ({
  type: ACTION_TYPE_CALENDAR.GET_EQUIPMENT_SUGGESTIONS,
  payload: axios.post(
    `${apiScheduleUrlRestFul}/get-equipment-suggestions`,
    {
      equipmentTypeId,
      searchValue
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const resetEquipmentSuggest = () => ({ type: ACTION_TYPE_CALENDAR.RESET_EQUIPMENT_SUGGEST });
