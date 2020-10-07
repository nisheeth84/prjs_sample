import { apiClient } from './../../config/clients/api-client';
// import { GET_LIST_CALENDAR } from './actions/queries-calendar';
import { Calendar } from './api/get-schedule-type';
import { JSON_STRINGIFY, objectToFormData } from '../calendar/api/common-type';
import {
  EmployeesType,
  EquipmentTypesType,
  GetLocalNavigation,
  GroupsType,
  ScheduleTypesType,
} from './api/get-local-navigation-type';
import { GetSchedule, CONVERT_DATA_SCHEDULE } from './api/get-schedule-type';
import {
  PARAM_GET_DATA_FOR_CALENDAR_BY_LIST,
  MODE_SEARCH_LIST,
  GetDataForCalendarByList,
} from './api/get-data-for-calendar-by-list-type';
import moment from 'moment';
import { FUNCTION_DIVISION, LocalNavigation, API } from './constants';
import { GET_SCHEDULE } from './assets/dummy';
import { DataOfSchedule } from './api/common';
import { PARAM_GET_DATA_FOR_CALENDAR_BY_DAY } from './api/get-data-for-calendar-by-day-type';
// import getDataByList from '../calendar/assets/response.json';

const isDummy = false;
export interface CalendarsResponse {
  getDataForCalendarByList: GetDataForCalendarByList;
}

export interface CalendarDataResponse {
  data: CalendarsResponse;
}

export interface CalendarResponse {
  data: GetDataForCalendarByList;
  status: number;
}

export interface CalendarPayload {
  query: string;
}
export interface ListCalendarsResponse {
  data: Calendar;
  status: number;
}
export interface CalendarPayload { }

export const getDataCalendarForListRepo = async (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  offset: number,
  localNavigation: GetLocalNavigation,
  limit: number
): Promise<CalendarResponse> => {
  try {
    // const limit = LimitLoadDataInListView;

    const param = PARAM_GET_DATA_FOR_CALENDAR_BY_LIST(
      MODE_SEARCH_LIST.None,
      dateFrom,
      dateTo,
      localNavigation,
      undefined,
      limit,
      offset,
      undefined,
      undefined,
      true,
      true,
      true
    );
    const response = await apiClient.post(
      API.GET_DATA_FOR_CALENDAR_BY_LIST,
      param
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDataCalendarForListResource = async (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  _offset?: number,
  _localNavigation?: GetLocalNavigation,
  _limit?: number
): Promise<CalendarResponse> => {
  try {
    // const limit = LimitLoadDataInListView;
    const typeId: any = [];
    _localNavigation?.searchDynamic?.equipmentTypes?.map((arr: any) => {
      if (arr.isSelected === 1) {
        typeId.push(arr.equipmentTypeId);
      }
    });
    const response = await apiClient.post(
      API.GET_RESOURCE_FOR_CALENDAR_BY_LIST,
      {
        equipmentTypeIds: typeId,
        dateFrom: dateFrom.utc(true).format(),
        dateTo: dateTo.utc(true).format(),
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface SchedulesResponse {
  getSchedule: Calendar;
}

export interface ScheduleDataResponse {
  data: SchedulesResponse;
}

export interface ScheduleResponse {
  data: Calendar;
  status: number;
}

export interface ScheduleUpdateResponse {
  data: any;
  status: number;
}

export interface ScheduleDeleteResponse {
  data: any;
  status: number;
}

/**
 * Interface DataCalendarByList
 */
export interface DataCalendarByListInterface {
  data: any;
  status: number;
}

export interface CreateScheduleResponse {
  data: any;
}

/**
 * interface GetScheduleHistoriesResponse
 */
export interface GetScheduleHistoriesResponse {
  data: any;
  errors: any;
}

/**
 * interface LocalNavigationResponse
 */
type LocalNavigationResponse = {
  data: any;
  errors?: any;
};

/**
 * interface CalendarByDayResponse
 */
type CalendarByDayResponse = {
  data: any;
  errors?: any;
};
/* 
  Get Detail Schedule
*/
export const getSchedule = async (id: number): Promise<ScheduleResponse> => {
  try {
    const response = await apiClient.post(
      API.GET_SCHEDULE,
      {
        scheduleId: id,
      }
    );
    if (isDummy) {
      response.data = GET_SCHEDULE();
    }
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * update schedule status
 * @param id
 * @param status
 * @param updateDate
 */
export const updateScheduleStatus = async (
  id: number,
  status: string,
  updateDate: string
): Promise<ScheduleUpdateResponse> => {
  try {
    const response = await apiClient.post(
      API.UPDATE_SCHEDULE_STATUS,
      {
        scheduleId: id,
        updatedStatus: status,
        updatedDate: JSON_STRINGIFY(updateDate),
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * update schedule status
 * @param id
 */
export const deleteSchedule = async (
  id: number,
  deleteFlg: number
): Promise<ScheduleDeleteResponse> => {
  try {
    const response = await apiClient.post(
      API.DELETE_SCHEDULE,
      {
        scheduleId: id,
        deleteFlag: deleteFlg,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/*
 * Create Schedule
 * @param schedule
 */
export const createSchedule = async (
  schedule: GetSchedule,
  fileUpload: any
): Promise<CreateScheduleResponse> => {
  try {

    const param = buildFormData(schedule, fileUpload);

    const response = await apiClient.post(API.CREATE_SCHEDULE, param);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api getDataForCalendarByList
 * @param date
 */
export const getDataForCalendarByList = async (
  date: moment.Moment
): Promise<DataCalendarByListInterface> => {
  try {
    const paramFromDate = moment.utc(date).format();
    const paramToDate = moment.utc(date).hours(23).format();

    const response = await apiClient.post(
      API.GET_DATA_FOR_CALENDAR_BY_LIST,
      {
        dateFrom: paramFromDate,
        dateTo: paramToDate,
        isSearchTask: true,
        isSearchMilestone: true,
        isSearchSchedule: true,
        loginFlag: true,
      }

    );
    return response;
  } catch (e) {
    return e.response;
  }
};

/**
 * call Api getScheduleHistory
 * @param scheduleId
 * @param currentPage
 * @param limit
 */
export const getScheduleHistory = async (
  scheduleId: number,
  currentPage: number,
  limit: number
) => {
  try {
    let response = await apiClient.post(
      API.GET_SCHEDULE_HISTORY,
      {
        scheduleId: scheduleId,
        currentPage: currentPage,
        limit: limit,
      }
    );
    // if (isDummy)
    //   response.data.data.getScheduleHistory.data = CALENDAR_DETAIL();
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call Api getLocalNavigation
 * @param functionDivision
 */
export const getLocalNavigation = async (
  functionDivision: string
): Promise<LocalNavigationResponse> => {
  try {
    const response = await apiClient.post(
      API.GET_LOCAL_NAVIGATION,
      {
        functionDivision: functionDivision,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * build form data
 * @param params value query
 * @param taskActionType flag action
 * @param fileUpload fileUpload
 */
const buildFormData = (params: GetSchedule, fileUpload: any) => {
  params['fileUpload'] = fileUpload;
  const query = CONVERT_DATA_SCHEDULE(params);

  return objectToFormData(query, '', []);
};

/**
 * event call api saveLocalNavigation
 * @param localNavigationData
 */
export const handleSaveLocalNavigation = async (
  localNavigationData: GetLocalNavigation
) => {
  try {
    const params: GetLocalNavigation = {
      searchStatic: localNavigationData.searchStatic,
      searchDynamic: {
        departments: [],
        groups: [],
        scheduleTypes: [],
        equipmentTypes: [],
      },
    };
    const searchStatic = localNavigationData.searchStatic;
    let viewTab;
    if (searchStatic?.viewTab) {
      viewTab = 1;
    } else {
      viewTab = 0;
    }
    let viewTask = searchStatic?.task;
    if (searchStatic?.task) {
      viewTask = 1;
    } else if (!searchStatic?.task) {
      viewTask = 0;
    }
    let mileStone = searchStatic?.milestone;
    if (searchStatic?.milestone) {
      mileStone = 1;
    } else if (!searchStatic?.milestone) {
      mileStone = 0;
    }

    let isAttended = searchStatic?.isAttended;
    if (searchStatic?.isAttended) {
      isAttended = 1;
    } else if (!searchStatic?.isAttended) {
      isAttended = 0;
    }

    let isAbsence = searchStatic?.isAbsence;
    if (searchStatic?.isAbsence) {
      isAbsence = 1;
    } else if (!searchStatic?.isAbsence) {
      isAbsence = 0;
    }

    let isUnconfirmed = searchStatic?.isUnconfirmed;
    if (searchStatic?.isUnconfirmed) {
      isUnconfirmed = 1;
    } else if (!searchStatic?.isUnconfirmed) {
      isUnconfirmed = 0;
    }

    let isShared = searchStatic?.isShared;
    if (searchStatic?.isShared) {
      isShared = 1;
    } else if (!searchStatic?.isShared) {
      isShared = 0;
    }

    const dataSchedule = localNavigationData.searchDynamic?.scheduleTypes;

    var raw = JSON.stringify({
      functionDivision: FUNCTION_DIVISION,
      searchConditions: {
        searchStatic: {
          isAllTime: searchStatic?.isAllTime,
          isDesignation: searchStatic?.isDesignation,
          startDate: searchStatic?.startDate,
          endDate: searchStatic?.endDate,
          viewTab: viewTab,
          task: viewTask,
          milestone: mileStone,
          isAttended: isAttended,
          isAbsence: isAbsence,
          isUnconfirmed: isUnconfirmed,
          isShared: isShared,
        },
        searchDynamic: {
          departments: localNavigationData.searchDynamic?.departments,
          groups: localNavigationData.searchDynamic?.groups,
          scheduleTypes: dataSchedule,
          equipmentTypes: localNavigationData.searchDynamic?.equipmentTypes,
        },
      },
    });
    // console.log('RAW', raw);

    if (
      localNavigationData.searchDynamic &&
      localNavigationData.searchDynamic.equipmentTypes
    ) {
      params.searchDynamic!.equipmentTypes = localNavigationData.searchDynamic.equipmentTypes.map(
        ({ equipmentTypeId, isSelected }: EquipmentTypesType) => ({
          equipmentTypeId,
          isSelected: Number(isSelected),
        })
      );
    }
    if (
      localNavigationData.searchDynamic &&
      localNavigationData.searchDynamic.scheduleTypes
    ) {
      params.searchDynamic!.scheduleTypes = localNavigationData.searchDynamic.scheduleTypes.map(
        ({ scheduleTypeId, isSelected }: ScheduleTypesType) => ({
          scheduleTypeId,
          isSelected: Number(isSelected),
        })
      );
    }
    if (
      localNavigationData.searchDynamic &&
      localNavigationData.searchDynamic.departments
    ) {
      params.searchDynamic!.departments = localNavigationData.searchDynamic.departments.map(
        (department) => {
          let employeeList: Array<EmployeesType> = [];
          if (department.employees) {
            employeeList = department.employees.map(
              ({ employeeId, isSelected, color }: EmployeesType) => ({
                employeeId,
                isSelected: Number(isSelected),
                color,
              })
            );
          }
          return {
            employees: employeeList,
            departmentId: department.departmentId,
            isSelected: Number(department.isSelected),
          };
        }
      );
    }
    if (
      localNavigationData.searchDynamic &&
      localNavigationData.searchDynamic.groups
    ) {
      params.searchDynamic!.groups = localNavigationData.searchDynamic.groups.map(
        ({ groupId, isSelected }: GroupsType) => ({
          groupId,
          isSelected: Number(isSelected),
        })
      );
    }
    const response = await apiClient.post(
      API.SAVE_LOCAL_NAVIGATION,
      // {
      //   functionDivision: FUNCTION_DIVISION,
      //   searchConditions: JSON.stringify(params).replace(/"(\w+)"\s*:/g, '$1:')
      // },
      raw
    );

    return response;
  } catch (e) {
    console.log('data error save local', e);
    return e.response;
  }
};

/**
 * call API getDataForCalendarByDay
 */
export const getDataApiOfDaySchedule = async (
  dateShow: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule
): Promise<CalendarByDayResponse> => {
  try {
    const param = schedule
      ? PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(
        dateShow.utc(),
        localNavigation,
        schedule
      )
      : PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(dateShow.utc(), localNavigation);
    const response = await apiClient.post(
      API.GET_DATA_FOR_CALENDAR_BY_DAY,
      param

    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getDataApiOfDayResource = async (
  dateShow: moment.Moment,
  localNavigation: LocalNavigation
): Promise<CalendarByDayResponse> => {
  try {
    const typeId: any = [];
    localNavigation.searchDynamic?.equipmentTypes?.map((arr) => {
      if (arr.isSelected === 1) {
        typeId.push(...[arr.equipmentTypeId]);
      }
    });
    const response = await apiClient.post(
      API.GET_RESOURCE_FOR_CALENDAR_BY_DAY,
      {
        date: dateShow,
        equipmentTypeIds: typeId,
        isGetDateInfo: true,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getEquipmentTypes = async (
  isContainEquipment: any
): Promise<ScheduleUpdateResponse> => {
  try {
    const response = await apiClient.post(
      API.GET_EQUIPMENT_TYPES,
      {
        isContainEquipment: isContainEquipment,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * get Schedule Types
 */
export const getScheduleTypes = async () => {
  try {
    const response = await apiClient.post(
      API.GET_SCHEDULE_TYPES,
      {}
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * get Holiday Types
 */
export const getHoliday = async () => {
  try {
    const response = await apiClient.post(
      API.GET_HOLIDAY,
      {}

    );
    return response;
  } catch (error) {
    return error.response;
  }
};
