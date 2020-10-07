import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { CustomerState } from "./customer-reducer";

/**
 * get customer list selector
 */
export const GetCustomerListSelector = createSelector(
  (state: RootState) => state.customerReducers,
  (customerReducer: CustomerState) => customerReducer.dataGetCustomerList
);

/**
 * get master scenarios
 */
export const getMasterScenariosSelector = createSelector(
  (state: RootState) => state.customerReducers,
  (CustomerReducer: CustomerState) => CustomerReducer.scenarios
);

/**
 * get master scenario
 */
export const getMasterScenarioSelector = createSelector(
  (state: RootState) => state.customerReducers,
  (CustomerReducer: CustomerState) => CustomerReducer.milestoneNames
);

/**
 * get scenario
 */
export const getScenarioSelector = createSelector(
  (state: RootState) => state.customerReducers,
  (CustomerReducer: CustomerState) => CustomerReducer.milestones
);
