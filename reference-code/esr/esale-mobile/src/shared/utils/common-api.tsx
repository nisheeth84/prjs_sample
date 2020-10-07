import { Dispatch } from '@reduxjs/toolkit';
import {
  employeeActions,
  EmployeesFilter,
  initializeEmployeeConditionAction,
  GetEmployeeCondition
} from '../../modules/employees/list/employee-list-reducer';
import {
  //QUERY_FILTER_EMPLOYEES,
  // QUERY_INITIALIZE_LOCAL_MENU,
} from '../../config/constants/query';
import { OrderBy, FilterCondition } from '../../modules/employees/list/employee-list-interface';

/**
 * 
 * @param key My_Group/ share_group/ department
 * @param value  
 * @param isUpdateListView 
 * @param searchConditions 
 * @param filterCondition get from reducer getFilterConditionSelector
 * @param localSearchKeyword 
 * @param orderBy get fron reducer getOrderBySelector
 * @param dispatch call reducer
 * @param employeesFilter 
 */
export const filterEmployee = async (
  targetType: number,
  targetId: number,
  isUpdateListView: boolean,
  searchConditions: any,
  // Get from getFilterConditionSelector
  filterCondition: Array<FilterCondition>,
  localSearchKeyword: any,
  // Get from getOrderBySelector
  orderBy: Array<OrderBy>,
  dispatch: Dispatch<any>,
  employeesFilter: EmployeesFilter,
) => {

  // Set condition
  const setEmployeeCondition: GetEmployeeCondition = {
    selectedTargetId: targetId,
    selectedTargetType: targetType,
    isUpdateListView: isUpdateListView,
    searchConditions: searchConditions || [],
    filterConditions: filterCondition || [],
    localSearchKeyword: localSearchKeyword || "",
    orderBy: orderBy || [],
    isCallback: true
  }

  dispatch(initializeEmployeeConditionAction.setCondition(setEmployeeCondition));
  // update filter data
  dispatch(employeeActions.filterUpdated(employeesFilter));
};

