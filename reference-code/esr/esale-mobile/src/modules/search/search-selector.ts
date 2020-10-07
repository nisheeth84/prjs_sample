import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { SearchState } from "./search-reducer";

/**
 * selector search
 */

export const customFieldInfoSelector = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.customFieldInfo
);

export const searchConditionsSelector = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.searchCondition
);

export const fieldInfoPersonalsSelector = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.fieldInfoPersonals
);

export const SearchSelector = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultSearchNavigation
);

export const ScheduleSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultScheduleSuggestionsGlobal
);

export const TimelineSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultTimelineSuggestionsGlobal
);

export const BusinessCardSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultBusinessCardSuggestionsGlobal
);

export const CustomerSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultCustomerSuggestionsGlobal
);

export const Activities = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultActivities
);

export const EmployeeSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultEmployeeSuggestionsGlobal
);

export const ProductSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultProductSuggestionsGlobal
);

export const TaskSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultTaskSuggestionsGlobal
);

export const ProductTradingSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultProductTradingSuggestionsGlobal
);

export const ReportSuggestionsGlobal = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.resultReportSuggestionsGlobal
);
export const GetCustomers = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.getCustomers
);
export const GetEmployees = createSelector(
  (state: RootState) => state.search,
  (search: SearchState) => search.getEmployees
);
