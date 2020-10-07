/**
 * Define data structure for API getSchedule
 **/
/**
 * Define data structure for API getSchedule
 **/

import { CommonUtils } from './common-type';
import moment from 'moment';
import { ScheduleRepeatEndType } from '../constants';
import { CalenderViewMonthCommon } from '../grid/common';

type ScheduleHistoriesType = {
  updatedDate?: number;
  updatedUserId?: number;
  updatedUserName?: string;
  updatedUserImage?: string;
  // createdDate?: any;
  // createdUserId?: any;
  // createdUserName?: any;
  // createdUserImage?: any;
  contentChange?: any;
};
type MilestonesType = {
  milestonesId?: any;
  milestoneName?: any;
};
type TasksType = {
  taskId?: any;
  taskName?: any;
};
type FilesType = {
  fileData?: any;
  fileName?: any;
};
type EquipmentsType = {
  equipmentId?: any;
  equipmentName?: any;
  startTime?: any;
  endTime?: any;
  equipmentTypeId?: number;
  equipmentTypeName?: string;
};
type GroupsType = {
  groupId?: any;
  groupName?: any;
};
type DepartmentsType = {
  departmentId?: any;
  departmentName?: any;
};
type EmployeeInPaticipant = {
  departmentId?: any
  departmentName?: any
  employeeId?: any
  employeeName?: any
  employeeSurName?: any
  positionId?: any
  positionName?: any
  positionOrder?: any
}
type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  employeeSurName?: any
  employeeDepartments?: EmployeeInPaticipant[]
  employees?: EmployeeInPaticipant[]
  photoEmployeeImg?: any
  photoFilePath?: any
  status?: number;
};
type BusinessCardsType = {
  businessCardId?: any;
  businessCardName?: any;
  position?: string;
  departmentName?: string;
  customerName?: string;
};
type ProductTradingsType = {
  productTradingId?: any;
  producTradingName?: any;
  customerId?: any;
};
interface RelatedCustomersType {
  customerId?: number;
  customerName?: string;
}
type customerType = {
  customerId?: any;
  parentCustomerName?: any;
  customerName?: any;
  customerAddress?: any;
};

export interface ScheduleFile {
  fileName?: string;
  filePath?: string;
  status?: number;
}

export interface RelatedCustomerTypes {
  customerId?: number;
  customerName?: string;
}
export interface GetSchedule {
  scheduleId?: any;
  scheduleType?: {
    scheduleTypeId?: any;
    scheduleTypeName?: any;
  };
  updateFlag?: any;
  scheduleName?: any;
  startDate?: any;
  endDate?: any;
  isFullDay?: any;
  isRepeated?: any;
  repeatType?: any;
  repeatCycle?: any;
  regularDayOfWeek?: any;
  regularWeekOfMonth?: any;
  regularDayOfMonth?: any;
  regularEndOfMonth?: any;
  repeatEndType?: any;
  repeatEndDate?: any;
  repeatNumber?: any;
  customers?: customerType[];

  address?: any;
  productTradings?: ProductTradingsType[];

  businessCards?: BusinessCardsType[];

  participants?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };

  isAllAttended?: any;
  sharers?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };

  equipmentTypeId?: any;
  equipments?: EquipmentsType[];

  note?: any;
  files?: FilesType[];

  tasks?: TasksType[];

  milestones?: MilestonesType[];

  isPublic?: any;
  canModify?: any;
  scheduleHistories?: ScheduleHistoriesType[];
  zipCode?: any;
  addressBelowPrefectures?: any;
  buildingName?: any;
  scheduleTypeId?: any;
  itemId?: any;
  finishDate?: any;
  allFiles?: ScheduleFile[];
  customer?: {
    customerId?: number;
    parentCustomerName?: string;
    customerName?: string;
    customerAddress?: string;
  };
  relatedCustomers?: RelatedCustomerTypes[];
}

/** Common START **/
/**
 * NVL
 * @param value
 * @param valueDefault
 */
const NVL = (value: any, valueDefault?: any) => {
  return value === undefined ? (valueDefault === undefined ? null : valueDefault) : value;
};

/**
 * Get value properties of object
 * @param object
 * @param propertie
 */
const GET_VALUE_PROPERTIES = (object: any, propertie: any) => {
  return NVL(object) ? NVL(object[propertie]) : null;
};

/**
 * Get array value properties of array object
 * @param arrayObject
 * @param propertie
 */
const GET_ARRAY_VALUE_PROPERTIES = (arrayObject: any, propertie: any) => {
  if (
    arrayObject === undefined ||
    !arrayObject ||
    NVL(arrayObject) == null ||
    !(arrayObject instanceof Array)
  ) {
    return null;
  }
  return arrayObject
    .filter(obj => GET_VALUE_PROPERTIES(obj, propertie))
    .map(obj => GET_VALUE_PROPERTIES(obj, propertie));
};

/**
 * Get array value object of array object
 * @param arrayObject
 * @param arrayProperties
 */
const GET_ARRAY_VALUE_OBJECT = (arrayObject: any, arrayProperties: string[]) => {
  if (NVL(arrayObject) == null || !(arrayObject instanceof Array)) {
    return null;
  }
  let value = `[`;
  arrayObject
    .filter(obj => obj && Object.keys(obj).length !== 0)
    .forEach(obj => {
      value += `{ ${arrayProperties.map(pro => `${pro}: ${NVL(obj[pro])}`)}},`;
    });
  value += ']';
  return value;
};

/** Common END**/

/**
 * Convert data GetSchedule to GraphQL query
 * @param schedules
 */
export const GET_DATA_CREATE_UPDATE_SCHEDULE = (schedules: GetSchedule, isDrag?: boolean) => {
  const scheduleTypeId = schedules.scheduleTypeId || schedules.scheduleType.scheduleTypeId;
  const convertData = CommonUtils.convertData({
    schedule: schedules,
    files: schedules['fileUpload']
  });
  // if (schedules && schedules.scheduleId && schedules.files) {
  //   convertData['schedule']['allFiles'] = schedules.files
  // }
  convertData['schedule']['scheduleTypeId'] = CommonUtils.convertData(scheduleTypeId);
  convertData['schedule']['equipmentTypeId'] = convertData['schedule']['equipmentTypeId']
    ? convertData['schedule']['equipmentTypeId']
    : 0;

  const startDateUtc = moment.utc(
    CalenderViewMonthCommon.localToTimezoneOfConfig(schedules['startDate'])
  );
  const endDateUtc = moment.utc(
    CalenderViewMonthCommon.localToTimezoneOfConfig(
      isDrag ? schedules['finishDate'] : schedules['endDate']
    )
  );

  const startFullDay = moment.utc(
    CalenderViewMonthCommon.roundDownDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(schedules['startDate'])
    )
  );

  const endFullDay = moment.utc(
    CalenderViewMonthCommon.roundUpDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(
        isDrag ? schedules['finishDate'] : schedules['endDate']
      )
    )
  );

  convertData['schedule']['startDay'] = NVL(
    !convertData['schedule']['isFullDay']
      ? startDateUtc.format('YYYY/MM/DD')
      : startFullDay.format('YYYY/MM/DD'),
    null
  );
  convertData['schedule']['endDay'] = NVL(
    !convertData['schedule']['isFullDay']
      ? endDateUtc.format('YYYY/MM/DD')
      : endFullDay.format('YYYY/MM/DD'),
    null
  );
  convertData['schedule']['startTime'] = NVL(
    !convertData['schedule']['isFullDay']
      ? startDateUtc.format('HH:mm')
      : startFullDay.format('HH:mm'),
    null
  );
  convertData['schedule']['endTime'] = NVL(
    !convertData['schedule']['isFullDay'] ? endDateUtc.format('HH:mm') : endFullDay.format('HH:mm'),
    null
  );
  convertData['schedule']['repeatEndDate'] = NVL(
    moment
      .utc(
        CalenderViewMonthCommon.roundUpDay(
          CalenderViewMonthCommon.localToTimezoneOfConfig(moment(schedules['repeatEndDate']))
        )
      )
      .format(),
    moment.utc(CalenderViewMonthCommon.nowDate().toDate()).format('HH:mm:ss')
  );
  if (
    !convertData['schedule']['isRepeated'] ||
    convertData['schedule']['repeatEndType'] !== ScheduleRepeatEndType.Specific
  ) {
    delete convertData['schedule']['repeatEndDate'];
  }
  if (convertData['schedule']['startDateMoment']) {
    delete convertData['schedule']['startDateMoment'];
  }
  if (convertData['schedule']['finishDateSortMoment']) {
    delete convertData['schedule']['finishDateSortMoment'];
  }
  if (convertData['schedule']['finishDateMoment']) {
    delete convertData['schedule']['finishDateMoment'];
  }
  if (convertData['schedule']['startDateSortMoment']) {
    delete convertData['schedule']['startDateSortMoment'];
  }
  // if (
  //   convertData['schedule']['regularDayOfWeek'] &&
  //   convertData['schedule']['regularDayOfWeek'].length > 0
  // ) {
  //   const regular = convertData['schedule']['regularDayOfWeek'].split('');
  //   convertData['schedule']['regularDayOfWeek'] =
  //     regular[6] +
  //     regular
  //       .splice(0, 6)
  //       .join('')
  //       .trim();
  // }
  delete convertData['schedule']['files'];
  delete convertData['schedule']['fileUpload'];
  delete convertData['schedule']['scheduleType'];
  delete convertData['schedule']['startDate'];
  delete convertData['schedule']['endDate'];
  return convertData;
};
