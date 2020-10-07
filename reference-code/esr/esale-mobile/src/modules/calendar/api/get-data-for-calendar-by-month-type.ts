/**
 * Define data structure for API getDataForCalendarByMonth
 **/
import { AttendanceDivisionType, ParticipationDivisionType } from '../constants';
import { DepartmentsType, EmployeesType, ScheduleTypesType, CustomersFavouriteType, EquipmentTypesType, GetLocalNavigation } from './get-local-navigation-type';
import { DataOfSchedule } from './common';


export const GetParamEmployeeIdsSelected = (localNavigation: GetLocalNavigation): number[] => {
  　const departments = localNavigation?.searchDynamic?.departments || [];
  let serachEmployeeIds: number[] = [];
  departments && departments.forEach((d: DepartmentsType) => {
    if (d.employees){
       d.employees.forEach((e: EmployeesType) => {
        if(e.isSelected){
          serachEmployeeIds.push( e.employeeId);
        }
        
      });
    }    
  });
  return serachEmployeeIds;
};

export const GetParamScheduleTypeIdsSelected = (localNavigation: GetLocalNavigation): number[] => {
  const scheduleTypeIds =
    localNavigation && localNavigation.searchDynamic
      ? localNavigation.searchDynamic.scheduleTypes
      : [];
  const serachScheduleTypeIds: number[] = [];

  scheduleTypeIds && scheduleTypeIds.forEach((e: ScheduleTypesType) => {
    if (e.isSelected) serachScheduleTypeIds.push(e.scheduleTypeId);
  });
  return serachScheduleTypeIds;
};

export const GetParamCustomerIdsSelected = (localNavigation: GetLocalNavigation): number[] => {
  const customersFavourite =
    localNavigation && localNavigation.searchDynamic
      ? localNavigation.searchDynamic.customersFavourite
      : [];
  const serachCustomerIds: number[] = [];

  customersFavourite && customersFavourite.forEach((e: CustomersFavouriteType) => {
    if (e.isSelected) serachCustomerIds.push(e.listId);
  });
  return serachCustomerIds;
};

export const GetEquipmentTypeIdsSelected = (localNavigation: GetLocalNavigation): number[] => {
  const equipmentTypes =
    localNavigation && localNavigation.searchDynamic
      ? localNavigation.searchDynamic.equipmentTypes
      : [];
  const serachEquipmentTypes: number[] = [];

  equipmentTypes && equipmentTypes.forEach((e: EquipmentTypesType) => {
    if (e.isSelected) serachEquipmentTypes.push(e.equipmentTypeId);
  });
  return serachEquipmentTypes;
};

export const GetParamAttendanceDivisions = (localNavigation: GetLocalNavigation): number[] => {
  /**
   * Checkbox 出席 / Tham gia: checked 01
   * Checkbox 欠席 / Vắng mặt: checked 02
   * Checkbox 未確認 / Chưa xác nhận: 00
   */
  const serachAttendanceDivisions: number[] = [];
  if (localNavigation && localNavigation.searchStatic) {
    const searchStatic = localNavigation.searchStatic;
    if (searchStatic.isUnconfirmed) serachAttendanceDivisions.push(AttendanceDivisionType.NOT_CONFIRMED);
    if (searchStatic.isAbsence) serachAttendanceDivisions.push(AttendanceDivisionType.ABSENT);
    if (searchStatic.isAttended) serachAttendanceDivisions.push(AttendanceDivisionType.AVAILABLE);
  }
  return serachAttendanceDivisions;
};

export const GetParamParticipationDivision = (localNavigation: GetLocalNavigation): number => {
  if (localNavigation && localNavigation.searchStatic) {
    const searchStatic = localNavigation.searchStatic;
    if (searchStatic.isShared) return ParticipationDivisionType.SHARE;
  }
  return 0;
};

export const GetParamIsSearchTask = (localNavigation: GetLocalNavigation): boolean => {
  if (localNavigation && localNavigation.searchStatic) {
    const searchStatic = localNavigation.searchStatic;
    if (searchStatic.task) return true;
  }
  return false;
};

export const GetParamIsSearchMilestone = (localNavigation: GetLocalNavigation): boolean => {
  if (localNavigation && localNavigation.searchStatic) {
    const searchStatic = localNavigation.searchStatic;
    if (searchStatic.milestone) return true;
  }
  return false;
};

export const GetParamItemInfo = (schedule?: DataOfSchedule) => {
  if (schedule) {
    return {
      itemId: schedule.itemId,
      itemType: schedule.itemType,
      isRepeat: schedule.isRepeat,
      scheduleRepeatId: schedule.scheduleRepeatId
    };
  }
  return {};
};
