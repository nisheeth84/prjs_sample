/**
 * Define data structure for API getSchedule
 **/
/**
 * Define data structure for API getSchedule
 **/

import { JSON_STRINGIFY, convertBooleanString } from './common-type';
import moment from 'moment';

export type ScheduleHistoriesType = {
  updatedDate?: any;
  updatedUserId?: number;
  updatedUserName?: string;
  updatedUserImage?: any;
  // createdDate?: any;
  // createdUserId?: any;
  // createdUserName?: any;
  // createdUserImage?: any;
  contentChange?: any;
};
export type MilestonesType = {
  milestonesId?: any;
  milestoneName?: any;
  time?: any;
  startDate?: any;
  endDate?: any;
  milestoneTime?: any
};
export type TasksType = {
  taskId?: any;
  taskName?: any;
  endDate?: any;
  time?: any;
};
export type FilesType = {
  fileData?: any;
  fileName?: any;
};
export type EquipmentsType = {
  equipmentId?: any;
  equipmentName?: any;
  startTime?: any;
  endTime?: any;
};
export type GroupsType = {
  groupId?: any;
  groupName?: any;
};
export type DepartmentsType = {
  departmentId?: any;
  departmentName?: any;
};
export type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  photoEmployeeImg?: string;
  status?: number;
  attendanceDivision?: any;
};
type BusinessCardsType = {
  businessCardId?: any;
  businessCardName?: any;
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
export type customerType = {
  customerId?: any;
  parentCustomerName?: any;
  customerName?: any;
  customerAddress?: any;
};

export interface GetSchedule {
  fileUpload?: any;
  scheduleId?: any;
  scheduleType?: {
    scheduleTypeId?: any;
    scheduleTypeName?: any;
  };
  updateFlag?: any;
  scheduleName?: any;
  startDay?: any;
  endDay?: any;
  startTime?: any,
  endTime?: any,
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
  queryFile?: any;
  customerRelateds?: number[];
  prefecturesId?: number;
  addressBelowPrefectures?: any;
  buildingName?: any;
  equipmentFlag?: any;
  emloyeeIds?: number[];
  repeatCondition?: any;
  updatedDate?: any;
}
export interface Calendar {
  createdUserSurName?:any
  attendanceDivision?: number;
  createdDate?:any;
  scheduleId?: number;
  scheduleName?: string;
  startDate?: any;
  finishDate?: any;
  isFullDay?: boolean;
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
  zipCode?: any;
  prefecturesId?: any;
  prefecturesName?: any;
  addressBelowPrefectures?: any;
  buildingName?: any;
  isAllAttended?: any;
  equipmentTypeId?: any;
  note?: any;
  isPublic?: any;
  canModify?: any;
  scheduleType?: {
    scheduleTypeId?: any;
    scheduleTypeName?: any;
  };
  isParticipant?: any;
  customer?: customerType[];
  relatedCustomers?: RelatedCustomersType[];
  productTradings?: ProductTradingsType[];
  businessCards?: BusinessCardsType[];
  participants?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };
  sharers?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };
  equipments?: EquipmentsType[];
  files?: FilesType[];
  tasks?: TasksType[];
  milestones?: MilestonesType[];
  scheduleHistories?: ScheduleHistoriesType[];
  employeeLoginId?: any;
  updatedDate?: any;
  scheduleTypeId?: any;
}

export const PARAM_GET_SCHEDULE = (scheduleId: number) =>
  `{
      getSchedule(scheduleId: ${scheduleId}) {
          scheduleId
          scheduleName
          startDate
          finishDate
          isFullDay
          isRepeated
          repeatType
          repeatCycle
          regularDayOfWeek
          regularWeekOfMonth
          regularDayOfMonth
          regularEndOfMonth
          repeatEndType
          repeatEndDate
          repeatNumber
          zipCode
          prefecturesId
          prefecturesName
          addressBelowPrefectures
          buildingName
          isAllAttended
          equipmentTypeId
          note
          isPublic
          canModify
          isParticipant
          scheduleType {
              scheduleTypeId
              scheduleTypeName
          }
          customer {
              customerId
              parentCustomerName
              customerName
              customerAddress
          }
          relatedCustomers {
              customerId
              customerName
          }
          productTradings {
              productTradingId
              producTradingName
          }
          businessCards {
              businessCardId
              businessCardName
          }
          participants {
              employees {
                  employeeId
                  employeeName
              }
              departments {
                  departmentId
                  departmentName
              }
              groups {
                  groupId
                  groupName
              }
          }
          sharers {
              employees {
                  employeeId
                  employeeName
              }
              departments {
                  departmentId
                  departmentName
              }
              groups {
                  groupId
                  groupName
              }
          }
          equipments {
              equipmentId
              equipmentName
              startTime
              endTime
          }
          files {
              filePath
              fileName
          }
          tasks {
              taskId
              taskName
          }
          milestones {
              milestoneId
              milestoneName
          }
          scheduleHistories {
              createdDate
              createdUserId
              createdUserName
              createdUserImage
              contentChange
          }
          updatedDate
          isParticipant
          employeeLoginId
      }
  }`;

/** Common START **/
/**
 * NVL
 * @param value
 * @param valueDefault
 */
const NVL = (value: any, valueDefault?: any) => {
  return value === undefined ? (valueDefault === undefined ? null : JSON_STRINGIFY(valueDefault)) : JSON_STRINGIFY(value);
};

// /**
//  * Get value properties of object
//  * @param object
//  * @param properties
//  */
// const GET_VALUE_PROPERTIES = (object: any, properties: any) => {
//   return NVL(object) ? NVL(object[properties]) : null;
// };

// /**
//  * Get array value properties of array object
//  * @param arrayObject
//  * @param properties
//  */
// const GET_ARRAY_VALUE_PROPERTIES = (arrayObject: any, properties: any) => {
//   if (arrayObject === undefined || !arrayObject || NVL(arrayObject) == null || !(arrayObject instanceof Array)) {
//     return [];
//   }
//   return arrayObject.filter(obj => GET_VALUE_PROPERTIES(obj, properties)).map(obj => GET_VALUE_PROPERTIES(obj, properties));
// };

// /**
//  * Get array value object of array object
//  * @param arrayObject
//  * @param arrayProperties
//  */
// const GET_ARRAY_VALUE_OBJECT = (arrayObject: any, arrayProperties: string[]) => {
//   if (NVL(arrayObject) == null || !(arrayObject instanceof Array)) {
//     return [];
//   }
//   let value = `[`;
//   arrayObject
//     .filter(obj => obj && Object.keys(obj).length !== 0)
//     .forEach(obj => {
//       value += `{ ${arrayProperties.map(pro => `${pro}: ${NVL(obj[pro])}`)}},`;
//     });
//   value += ']';
//   return value;
// };

/**
 * Convert data GetSchedule to GraphQL query
 * @param schedule GetSchedule
 */
export const CONVERT_DATA_SCHEDULE = (schedule: GetSchedule) => {
  const convertData: any = {};

  // convertData['schedule.repeatCycle'] = NVL(schedule['repeatCycle']);
  // convertData['schedule.repeatType'] = NVL(schedule['repeatType']);
  // convertData['schedule.repeatEndType'] = NVL(schedule['repeatEndType']);
  // convertData['schedule.repeatEndDate'] = NVL(schedule['repeatEndDate']);
  // convertData['schedule.repeatNumber'] = NVL(schedule['repeatNumber']);
  // convertData['schedule.isFullDay'] = convertBoolean(NVL(schedule['isFullDay'], false));
  // convertData['schedule.isRepeated'] = convertBoolean(NVL(schedule['isRepeated'], false));
  // convertData['schedule.isAllAttended'] = NVL(schedule['isAllAttended']);

  // convertData['schedule.updateFlag'] = NVL(schedule['updateFlag']);

  // convertData['files'] = convertFormFile(schedule);
  // convertData['schedule.regularDayOfWeek'] = NVL(schedule['regularDayOfWeek']);
  // convertData['schedule.scheduleName'] = NVL(schedule['scheduleName']);
  // convertData['schedule.equipmentTypeId'] = NVL(schedule['equipmentTypeId']);
  // convertData['schedule.equipments[0].equipmentId'] = '36';
  // convertData['schedule.equipments[0].startTime'] = '2020-07-14T02:27:00Z';
  // convertData['schedule.equipments[0].endTime'] = '2020-07-14T10:00:00Z';
  // convertData['schedule.equipments[0].canUse'] = true;
  // convertData['schedule.isPublic'] = convertBoolean(NVL(schedule['isPublic'], false));
  // convertData['schedule.canModify'] = convertBoolean(NVL(schedule['canModify'], false));
  // convertData['schedule.scheduleTypeId'] = schedule?.scheduleType?.scheduleTypeId;
  // convertData['schedule.startDay'] = NVL(moment(schedule['startDate']).format('YYYY/MM/DD'), moment(new Date()).format('YYYY/MM/DD'));
  // convertData['schedule.endDay'] = NVL(moment(schedule['endDate']).format('YYYY/MM/DD'), moment(new Date()).format('YYYY/MM/DD'));
  // convertData['schedule.startTime'] = NVL(moment(schedule['startDate']).format('HH:MM'), moment(new Date()).format('HH:MM'));
  // convertData['schedule.endTime'] = NVL(moment(schedule['endDate']).format('HH:MM'), moment(new Date()).format('HH:MM'));

  // convertData['schedule.prefecturesId'] = NVL(schedule['prefecturesId']);
  // convertData['schedule.equipmentFlag'] = NVL(schedule['equipmentFlag']);
  // convertData['schedule.note'] = NVL(schedule['note']);
  // convertData['schedule.regularDayOfMonth'] = NVL(schedule['regularDayOfMonth']);
  // convertData['schedule.regularWeekOfMonth'] = NVL(schedule['regularWeekOfMonth']);
  // convertData['schedule.customerId'] = GET_VALUE_PROPERTIES(schedule['customers'], 'customerId');
  // convertData['schedule.regularEndOfMonth'] = NVL(schedule['regularEndOfMonth']);


  // if(!!schedule.scheduleId){
  //   convertData['schedule.scheduleId'] = NVL(schedule['scheduleId']);
  //   convertData['schedule.updateFlag'] = NVL(schedule['updateFlag']);///
  // }

  convertData['schedule.repeatCycle'] = `${NVL(schedule['repeatCycle'])}`;
  convertData['schedule.repeatType'] = `${NVL(schedule['repeatType'])}`;
  convertData['schedule.repeatEndType'] = `${NVL(schedule['repeatEndType'])}`;
  // convertData['schedule.repeatEndDate'] = NVL(schedule['repeatEndDate']);
  convertData['schedule.repeatNumber'] = `${NVL(schedule['repeatNumber'])}`;
  convertData['schedule.isFullDay'] = convertBooleanString(NVL(schedule['isFullDay']));
  convertData['schedule.isRepeated'] = convertBooleanString(NVL(schedule['isRepeated']));
  convertData['schedule.isAllAttended'] = convertBooleanString(NVL(schedule['isAllAttended']));

  convertData['schedule.updateFlag'] = NVL(schedule['updateFlag']);

  // convertData['files'] = convertFormFile(schedule);
  // convertData['schedule.regularDayOfWeek'] = NVL(schedule['regularDayOfWeek']);
  convertData['schedule.scheduleName'] = NVL(schedule['scheduleName']);
  // convertData['schedule.equipmentTypeId'] = '76';
  // convertData['schedule.equipments[0].equipmentId'] = '36';
  // convertData['schedule.equipments[0].startTime'] = '2020-07-23T02:27:00Z';
  // convertData['schedule.equipments[0].endTime'] = '2020-07-23T10:00:00Z';
  // convertData['schedule.equipments[0].canUse'] = 'true';
  convertData['schedule.isPublic'] = convertBooleanString(NVL(schedule['isPublic']));
  convertData['schedule.canModify'] = convertBooleanString(NVL(schedule['canModify']));
  convertData['schedule.scheduleTypeId'] = `${schedule?.scheduleType?.scheduleTypeId}`;
  convertData['schedule.startDay'] = NVL(moment(schedule['startDay']).format('YYYY/MM/DD'), moment(new Date()).format('YYYY/MM/DD'));
  convertData['schedule.endDay'] = NVL(moment(schedule['endDay']).format('YYYY/MM/DD'), moment(new Date()).format('YYYY/MM/DD'));
  convertData['schedule.startTime'] = schedule['startTime'];
  convertData['schedule.endTime'] = schedule['endTime'];

  convertData['schedule.note'] = NVL(schedule['note']);
  convertData['schedule.zipCode'] = NVL(schedule['zipCode']);
  convertData['schedule.addressBelowPrefectures'] = NVL(schedule['addressBelowPrefectures']);
  convertData['schedule.buildingName'] = NVL(schedule['buildingName']);


  // convertData['schedule.regularDayOfMonth'] = NVL(schedule['regularDayOfMonth']);
  // convertData['schedule.regularWeekOfMonth'] = NVL(schedule['regularWeekOfMonth']);
  // convertData['schedule.customerId'] = GET_VALUE_PROPERTIES(schedule['customers'], 'customerId');
  // convertData['schedule.regularEndOfMonth'] = NVL(schedule['regularEndOfMonth']);


  return convertData;
};
