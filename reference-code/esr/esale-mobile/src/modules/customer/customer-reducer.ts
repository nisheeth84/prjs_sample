import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  GetCustomerListDataResponse,
  GetMasterScenarioDataResponse,
  GetMasterScenariosDataResponse,
  GetScenarioDataResponse,
} from "./customer-repository";

/**
 * interface use for customer state
 */
export interface CustomerState extends GetMasterScenariosDataResponse {
  dataGetCustomerList: GetCustomerListDataResponse;
  milestones: Array<any>;
  milestoneNames: Array<{
    milestoneName: string;
  }>;
}

/**
 * interface use for customer reducer
 */
export interface CustomerReducers extends SliceCaseReducers<CustomerState> {}

const customerSlice = createSlice<CustomerState, CustomerReducers>({
  name: "customer",
  initialState: {
    dataGetCustomerList: {
      myList: [],
      sharedList: [],
      favouriteList: [],
    },
    scenarios: [],
    milestones: [],
    milestoneNames: [],
  },
  reducers: {
    /**
     * insert dataGetCustomerList from payload to state
     * @param state 
     * @param params 
     */
    getCustomerList(
      state,
      { payload }: PayloadAction<GetCustomerListDataResponse>
    ) {
      state.dataGetCustomerList = payload;
    },
    /**
     * insert scenarios from payload to state
     * @param state 
     * @param params 
     */
    getMasterScenarios(
      state,
      { payload }: PayloadAction<GetMasterScenariosDataResponse>
    ) {
      state.scenarios = payload.scenarios;
    },
    /**
     * insert milestoneNames from payload to state
     * @param state 
     * @param params 
     */
    getMasterScenario(
      state,
      { payload }: PayloadAction<GetMasterScenarioDataResponse>
    ) {
      state.milestoneNames = payload.milestones;
    },
    /**
     * insert milestones array from payload to state
     * @param state 
     * @param params 
     */
    getScenario(state, { payload }: PayloadAction<GetScenarioDataResponse>) {
      state.milestones = payload.scenarios.milestones;
    },
  },
});

export const CustomerActions = customerSlice.actions;
export default customerSlice.reducer;
