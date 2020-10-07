import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';
import { EmployeeState, InitializeListInfoState, InitializeEmployeeConditionState } from './employee-list-reducer';
import { FieldInfoPersonal } from '../employees-types';

// extract the list of employees from employee reducer
export const employeesSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.employees
);

// extract the list of employees from employee reducer
export const lastUpdateSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.lastUpdatedDate
);

// extract the selected Employee
export const selectedEmployeeIdsSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.selectedEmployeeIds
);

// extract the total records from employee reducer
export const employeeTotalRecordsSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.totalRecords
);

// extract the status of querying employees api
export const statusSelector = createSelector(
  (state: RootState) => state.employee,
  (status: EmployeeState) => status.status
);

// extract the department of querying employees api
export const departmentSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.department
);

// extract the list of personal info
export const fieldInfoPersonalsSelector = createSelector(
  (state: RootState) => state.employee,
  (employeeState: EmployeeState) => employeeState.fieldInfoPersonals
);

// extract the status display
export const statusDiplaySelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.statusDisplay
);
// extract the title display
export const titleDiplaySelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.titleDisplay
);
// extract group id selected when filter
export const groupFilterSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.groupSelected
);
//group is selected to manipulation
export const groupManipulatedSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.groupManipulated
);
export const filterSelector = createSelector(
  (state: RootState) => state.employee,
  (employee: EmployeeState) => employee.filter
);
export const conditionSelector = createSelector(
  (state: RootState) => state.initializeEmployeeConditionState,
  (employeeeConditionState: InitializeEmployeeConditionState) => employeeeConditionState.employeeCondition
);
// convert data to fit with employee Data field
const convertData = (text: string) => {
  const data = text.split('_');
  let name = '';
  data.forEach((item: string, index: number) => {
    if (index > 0) {
      item = item.replace(item.charAt(0), item.charAt(0).toUpperCase());
      name += item;
    } else {
      name += item;
    }
  });
  return name;
};

// combinated data to create data to show
export const combinatedEmployeesSelector = createSelector(
  fieldInfoPersonalsSelector,
  employeesSelector,
  selectedEmployeeIdsSelector,
  (fieldInfoPersonals, employees, selectedEmployeeIds) => {
    return employees.map((employee) => {
      const combinations: any = [];
      fieldInfoPersonals.forEach(
        (fieldInfoPersonal: FieldInfoPersonal, pos: number) => {
          // check isDefault or not
          // true get data from fieldInfoPersonal
          // false get data from employeeData
          if (fieldInfoPersonal.isDefault) {
            combinations[pos] = {
              title: (employee as any)[
                convertData(fieldInfoPersonal.fieldName)
              ],
              type: fieldInfoPersonal.fieldName,
            };
          } else {
            combinations[pos] = {
              title: JSON.parse(employee.employeeData)[
                fieldInfoPersonal.fieldName
              ],
              type: fieldInfoPersonal.fieldName,
            };
          }
        }
      );
      return {
        employee,
        combinations,
        selected: !!~selectedEmployeeIds.indexOf(employee.employeeId),
      };
    });
  }
);
/**
 * Define function getOrderBySelector, select orderBy from store
 */
export const getOrderBySelector = createSelector(
  (state: RootState) => state.initializeListInfoState,
  (initializeInfo: InitializeListInfoState) => initializeInfo.orderBy
);
/**
 * Define function getFilterConditionSelector, select filter conditon from store
 */
export const getFilterConditionSelector = createSelector(
  (state: RootState) => state.initializeListInfoState,
  (initializeInfo: InitializeListInfoState) => initializeInfo.filterConditions
);