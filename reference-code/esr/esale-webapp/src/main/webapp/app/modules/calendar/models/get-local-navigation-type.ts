/**
 * Define data structure for API getLocalNavigation
 **/

export type EquipmentTypesType = {
  equipmentTypeId?: any;
  equipmentTypeName?: any;
  isSelected?: any;
};
export type Equipment = {
  equipmentId?: any;
  equipmentName?: any;
  equipmentTypeId?: any;
  equipmentTypeName?: any;
  isAvailable?: any;
  displayOrder?: any;
};
export type ScheduleTypesType = {
  scheduleTypeId?: any;
  scheduleTypeName?: any;
  isSelected?: any;
  iconName?: string;
  iconType?: string;
  iconPath?: string;
};
export type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  isSelected?: any;
  color?: any;
  departmentId?: any;
  groupId?: any;
};
export type DepartmentsType = {
  departmentId?: any;
  departmentName?: any;
  isSelected?: any;
  employees?: EmployeesType[];
};
export type GroupsType = {
  groupId?: any;
  groupName?: any;
  isSelected?: any;
  employees?: Array<EmployeesType>;
};
export type CustomersFavouriteType = {
  listId?: any;
  listName?: any;
  isSelected?: any;
};
export type GetLocalNavigation = {
  searchConditions?: {
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
    };

    searchDynamic?: {
      customersFavourite?: CustomersFavouriteType[];
      departments?: DepartmentsType[];

      groups?: GroupsType[];

      scheduleTypes?: ScheduleTypesType[];

      equipmentTypes?: EquipmentTypesType[];

      // search by customer and business card
      customerIds?: number[];
      businessCardIds?: number[];

      employeeIds?: number[];
    };
  };
};

export const PARAM_GET_LOCAL_NAVIGATION = functionDivision => {
  return {
    functionDivision: JSON.stringify(functionDivision)
  };
};

/**
 * query api saveLocalNavigation
 * @param functionDivision
 * @param searchConditions
 */
export const PARAM_SAVE_LOCAL_NAVIGATION = (functionDivision, searchConditions) => {
  return {
    functionDivision,
    searchConditions
  };
};
