import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { appStatus } from "../../config/constants";
import {
  BusinessCardGlobalDataResponse,
  CustomerSuggestionsGlobalDataResponse,
  Employees,
  // ProductSuggestionsGlobalDataResponse,
  Products,
  ReportSuggestionsGlobalDataResponse,
  Schedules,
  TaskSuggestionsGlobalDataResponse,
  TimelineSuggestionsGlobal,
} from "./search-reponsitory";
import {
  ACTIVITIES_DUMMY,
  ANALYSIS_DUMMY,
  BUSINESS_DUMMY,
  CUSTOMER_DUMMY,
  EMPLOYEES_DUMMY,
  PRODUCT_DUMMY,
  PRODUCT_TRADINGS_DUMMY,
  SCHEDULES_DUMMY,
  TASK_DUMMY,
  TIMELINE_DUMMY,
} from "./search-dummy";
import { FieldInfoItem } from "../../config/constants/field-info-interface";

export interface SearchState {
  resultSearchNavigation: Array<any>;
  resultScheduleSuggestionsGlobal: Array<Schedules>;
  resultTimelineSuggestionsGlobal: Array<TimelineSuggestionsGlobal>;
  resultBusinessCardSuggestionsGlobal: Array<BusinessCardGlobalDataResponse>;
  resultCustomerSuggestionsGlobal: Array<CustomerSuggestionsGlobalDataResponse>;
  resultActivities: Array<any>;
  resultEmployeeSuggestionsGlobal: Array<Employees>;
  resultProductSuggestionsGlobal: Array<Products>;
  resultTaskSuggestionsGlobal: Array<TaskSuggestionsGlobalDataResponse>;
  resultProductTradingSuggestionsGlobal: Array<any>;
  resultReportSuggestionsGlobal: Array<ReportSuggestionsGlobalDataResponse>;
  status: string;
  getCustomers: Array<any>;
  getEmployees: Array<any>;
  fieldInfoPersonals: Array<FieldInfoItem>;
  customFieldInfo: Array<FieldInfoItem>;
  searchCondition?: Array<any> | null;
}

export interface SearchReducers extends SliceCaseReducers<SearchState> {}

/**
 * Search Reducers
 */
const SearchSlice = createSlice<SearchState, SearchReducers>({
  name: "search",
  initialState: {
    resultSearchNavigation: [],
    status: appStatus.PENDING,
    resultScheduleSuggestionsGlobal: SCHEDULES_DUMMY.schedules,
    resultTimelineSuggestionsGlobal: TIMELINE_DUMMY.timelines,
    resultBusinessCardSuggestionsGlobal: BUSINESS_DUMMY.businessCards,
    resultCustomerSuggestionsGlobal: CUSTOMER_DUMMY.customers,
    resultActivities: ACTIVITIES_DUMMY.dataInfo.activities,
    resultProductSuggestionsGlobal: PRODUCT_DUMMY.products,
    resultTaskSuggestionsGlobal: TASK_DUMMY.tasks,
    resultProductTradingSuggestionsGlobal:
      PRODUCT_TRADINGS_DUMMY.productTradings,
    resultEmployeeSuggestionsGlobal: EMPLOYEES_DUMMY.employees,
    resultReportSuggestionsGlobal: ANALYSIS_DUMMY.reports,
    getCustomers: [],
    getEmployees: [],
    fieldInfoPersonals: [],
    customFieldInfo: [],
    searchCondition: null,
  },
  reducers: {
    getSearchConditions(state, { payload }: PayloadAction<any>) {
      state.searchCondition = payload;
    },
    getFieldInfoService(state, { payload }: PayloadAction<any>) {
      state.fieldInfoPersonals = payload;
    },
    getCustomFieldInfoServices(state, { payload }: PayloadAction<any>) {
      state.customFieldInfo = payload;
    },
    getDataSearch(state, { payload }: PayloadAction<any>) {
      state.resultSearchNavigation = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getDataScheduleSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultScheduleSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getTimelineSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultTimelineSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getBusinessCardSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultBusinessCardSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getCustomerSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultCustomerSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getActivities(state, { payload }: PayloadAction<any>) {
      state.resultActivities = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getEmployeeSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultEmployeeSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getReportSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultReportSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getProductSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultProductSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getTaskSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultTaskSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getProductTradingSuggestionsGlobal(state, { payload }: PayloadAction<any>) {
      state.resultProductTradingSuggestionsGlobal = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getCustomers(state, { payload }: PayloadAction<any>) {
      state.getCustomers = [payload.data];
      state.status = appStatus.SUCCESS;
    },
    getEmployees(state, { payload }: PayloadAction<any>) {
      state.getEmployees = payload.employees;
      state.status = appStatus.SUCCESS;
    },
  },
});

export const SearchActions = SearchSlice.actions;
export default SearchSlice.reducer;
