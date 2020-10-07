import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  FieldInfoPersonalsResponse,
  ListEmployee,
} from "../employees-repository";
import { Employee, FieldInfoPersonal, Departments } from "../employees-types";
import { DISPLAY_STATUS } from "../../../config/constants/query";
import { OrderBy, FilterCondition } from "./employee-list-interface";

export interface EmployeesFilter {
  offset: number;
  limit: number;
  filterType: any;
}

export interface GroupSelected {
  groupId: number;
  groupName: string;
  isAutoGroup: boolean;
  participantType: number;
}
export interface GroupManipulated extends GroupSelected {
  status: string;
  editStatus: boolean;
}

export interface EmployeeState {
  // list of employees
  employees: Array<Employee>;
  // department
  department: Departments;
  // list of field info personals
  fieldInfoPersonals: Array<FieldInfoPersonal>;
  // request status
  status: string;
  // employee selected
  selectedEmployeeIds: Array<number>;
  // total records
  totalRecords: number;
  // status display
  statusDisplay: string;
  // title display
  titleDisplay: string;
  filter: EmployeesFilter;
  // group selected
  groupSelected: GroupSelected;
  //group manipulated
  groupManipulated: GroupManipulated;
  lastUpdatedDate: string;
}

export interface UpdateEmployeePayload {
  // position in the table
  position: number;
  employee: Employee;
}

export interface ToggleEmployeePayload {
  employeeId: number;
}

export interface AddEmployeePayload {
  employees: Array<Employee>;
}

// Use the same function to handle data append strategy, initial for the first load
// or filter data changed appending for for pagination
export type UpdateEmployeesMode = 'initial' | 'appending';
export interface GetAllEmployeePayload extends ListEmployee {
  mode: UpdateEmployeesMode;
}

export interface FilterUpdatedPayload extends EmployeesFilter { }

export interface FieldInfoPersonalsFetchedPayload
  extends FieldInfoPersonalsResponse { }

export interface DeleteEmployeePayload {
  position: number;
}
export interface EmployeeReducers extends SliceCaseReducers<EmployeeState> { }


const employeeSlice = createSlice<EmployeeState, EmployeeReducers>({
  name: 'employee',
  initialState: {
    lastUpdatedDate: '',
    employees: [],
    department: {
      departmentId: -1,
      departmentName: '',
      managerId: -1,
      managerName: '',
      managerSurname:'',
    },
    fieldInfoPersonals: [],
    selectedEmployeeIds: [],
    status: '',
    totalRecords: -1,
    statusDisplay: DISPLAY_STATUS.ALL_EMPLOYEE,
    titleDisplay: '全ての社員',
    groupSelected: {
      groupId: -1,
      groupName: '',
      isAutoGroup: true,
      participantType: -1,
    },
    groupManipulated: {
      groupId: -1,
      groupName: '',
      isAutoGroup: true,
      participantType: -1,
      status: '',
      editStatus: false,
    },
    filter: {
      offset: 0,
      limit: 20,
      filterType: {
        key: 0,
        value: 0
      }
    },
  },
  reducers: {
    employeesFetched(state, { payload }: PayloadAction<GetAllEmployeePayload>) {
      if (payload.mode === 'appending') {
        state.employees = [...state.employees, ...payload.employees];
      } else {
        state.employees = payload.employees;
      }
      state.department = payload.department;
      state.totalRecords = payload.totalRecords;
      state.lastUpdatedDate = payload.lastUpdatedDate;
    },

    setTitleDisplay(state, { payload }) {
      state.titleDisplay = payload;
    },
    fieldInfoPersonalsFetched(
      state,
      { payload }: PayloadAction<FieldInfoPersonalsFetchedPayload>
    ) {
      state.fieldInfoPersonals = payload.fieldInfoPersonals;
    },
    filterUpdated(state, { payload }: PayloadAction<FilterUpdatedPayload>) {
      state.filter = payload;
    },
    filterUpdatedOffset(state, { payload }: PayloadAction<FilterUpdatedPayload>) {
      state.filter.offset = payload.offset;
    },
    setStatusDisplay(state, { payload }) {
      state.statusDisplay = payload;
    },
    setGroupManipulated(state, { payload }: PayloadAction<GroupManipulated>) {
      state.groupManipulated = {
        groupId: payload.groupId,
        groupName: payload.groupName,
        isAutoGroup: payload.isAutoGroup,
        participantType: payload.participantType ? payload.participantType : -1,
        status: payload.status,
        editStatus: payload.editStatus,
      };
    },
    setGroupSelected(state, { payload }: PayloadAction<GroupSelected>) {
      state.groupSelected = {
        groupId: payload.groupId,
        groupName: payload.groupName,
        isAutoGroup: payload.isAutoGroup,
        participantType: payload.participantType ? payload.participantType : -1,
      };
    },
    setSelectedEmployees(state, { payload }) {
      state.selectedEmployeeIds = [...payload];
    },
    selectAllEmployees(state) {
      state.selectedEmployeeIds = state.employees.map(
        ({ employeeId }) => employeeId
      );
    },
    deselectAllEmployees(state) {
      state.selectedEmployeeIds = [];
    },
    toggleSelectEmployee(
      state,
      { payload }: PayloadAction<ToggleEmployeePayload>
    ) {
      if (~state.selectedEmployeeIds.indexOf(payload.employeeId)) {
        state.selectedEmployeeIds = state.selectedEmployeeIds.filter(
          (employeeId) => employeeId !== payload.employeeId
        );
      } else {
        state.selectedEmployeeIds = [
          ...state.selectedEmployeeIds,
          payload.employeeId,
        ];
      }
    },
    getEmployeeError(state) {
      state.status = 'error';
      state.employees = [];
      state.fieldInfoPersonals = [];
      state.department = {
        departmentId: -1,
        departmentName: '',
        managerId: -1,
        managerName: '',
        managerSurname:'',
      };
    },
    update(state, { payload }: PayloadAction<UpdateEmployeePayload>) {
      const newList = state.employees;
      newList[payload.position] = payload.employee;
      state.employees = newList;
    },
    add(state, { payload }: PayloadAction<AddEmployeePayload>) {
      state.employees = payload.employees;
    },
    delete(state, { payload }: PayloadAction<DeleteEmployeePayload>) {
      state.employees = state.employees.filter(
        (_, index) => index !== payload.position
      );
    },
  },
});
export interface InitializeListInfoState {
  orderBy: Array<OrderBy>;
  filterConditions: Array<FilterCondition>;
}
export interface SetOrderByPayload {
  orderBy: Array<OrderBy>;
}
export interface SetFilterConditionPayload {
  conditionFilter: Array<FilterCondition>;
}
export interface InitializeListInfoReducers
  extends SliceCaseReducers<InitializeListInfoState> { }

const initializeListInfo = createSlice<InitializeListInfoState, InitializeListInfoReducers>(
  {
    name: 'initializeInfo',
    initialState: {
      orderBy: [],
      filterConditions: [],
    },
    reducers: {
      setOrderBy(state, { payload }: PayloadAction<SetOrderByPayload>) {
        state.orderBy = payload.orderBy;
      },
      setFilterCondition(state, { payload }: PayloadAction<SetFilterConditionPayload>) {
        state.filterConditions = payload.conditionFilter;
      },
    }
  }
);
export interface GetEmployeeCondition {
  selectedTargetId: number;
  selectedTargetType: number;
  isUpdateListView: boolean;
  searchConditions: any;
  filterConditions: Array<FilterCondition>;
  localSearchKeyword: any;
  orderBy: Array<OrderBy>;
  isCallback: boolean;
}

export interface InitializeEmployeeConditionState {
  employeeCondition: GetEmployeeCondition;
}
export interface InitializeEmployeeConditionReducers
  extends SliceCaseReducers<InitializeEmployeeConditionState> { }
const initializeEmployeeConditions = createSlice<InitializeEmployeeConditionState, InitializeEmployeeConditionReducers>({
  name: "initializeEmployeeCondition",
  initialState: {
    employeeCondition: {
      selectedTargetId: 0,
      filterConditions: [],
      isUpdateListView: false,
      localSearchKeyword: "",
      selectedTargetType: 0,
      searchConditions: [],
      orderBy: [],
      isCallback: false
    }
  },
  reducers: {
    setCondition(state, { payload }: PayloadAction<GetEmployeeCondition>) {
      state.employeeCondition = payload;
    },
  }
});
export const initializeEmployeeConditionAction = initializeEmployeeConditions.actions;
export const initializeListInfoActions = initializeListInfo.actions;
export const employeeActions = employeeSlice.actions;
export const initializeEmployeeConditionState = initializeEmployeeConditions.reducer;
export const initializeListInfoState = initializeListInfo.reducer;
export default employeeSlice.reducer;
