/**
 * Define data structure for API getLocalNavigation
 **/

export type EquipmentTypesType = {
  equipmentTypeId?: any;
  equipmentTypeName?: any;
  isSelected?: any;
  displayOrder?: any;
  updatedDate?: any;
};
export type ScheduleTypesType = {
  scheduleTypeId?: any;
  scheduleTypeName?: any;
  isSelected?: any;
};
export type GroupsType = {
  groupId?: any;
  groupName?: any;
  isSelected?: any;
  employees?: EmployeesType[];
};
export type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  isSelected?: any;
  color?: any;
  employeeSurname?:any
};
export type DepartmentsType = {
  departmentId?: any;
  departmentName?: any;
  isSelected?: any;
  employees?: EmployeesType[];
};
export type CustomersFavouriteType = {
  listId?: any;
  listName?: any;
  isSelected?: any;
};
export type GetLocalNavigation = {
  searchStatic?: {
    isAllTime?: any;
    isDesignation?: any;
    startDate?: any;
    endDate?: any;
    viewTab?: any;
    task?: any;
    milestone?: any;
    isAttended?: any;
    isAbsence?: any;
    isUnconfirmed?: any;
    isShared?: any;
    isShowPerpetualCalendar?: any
    isShowHoliday?: any
  };

  searchDynamic?: {
    customersFavourite?: CustomersFavouriteType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];

    scheduleTypes?: ScheduleTypesType[];

    equipmentTypes?: EquipmentTypesType[];
  };
};

export const PARAM_GET_LOCAL_NAVIGATION = (functionDivision: string) => {
  return `query{
  getLocalNavigation(
    functionDivision: "${functionDivision}"
  ) {
    searchStatic {
      isAllTime
      isDesignation
      startDate
      endDate
      date
      viewTab
      task
      milestone
      isAttended
      isAbsence
      isUnconfirmed
      isShared
    }
    searchDynamic {
      customersFavourite{
        listId
        listName
        isSelected
      }
      departments {
        departmentId
        departmentName
        isSelected
        employees {
          employeeId
          employeeName
          isSelected
        }
      }
      groups {
        groupId
        groupName
        isSelected
      }
      scheduleTypes {
        scheduleTypeId
        scheduleTypeName
        isSelected
      }
      equipmentTypes {
        equipmentTypeId
        equipmentTypeName
        isSelected
      }
    }
  }
}`;
};

/**
 * query api saveLocalNavigation
 * @param functionDivision
 * @param searchConditions
 */
export const PARAM_SAVE_LOCAL_NAVIGATION = (functionDivision: string, searchConditions: GetLocalNavigation) => {
  return `mutation{
    saveLocalNavigation(
      functionDivision: "${functionDivision}"
      searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}
    )
  }`;
};
