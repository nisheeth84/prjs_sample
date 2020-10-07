import {
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface StatusDrawerPayload {
  isDrawerOpen: boolean;
}

export interface DrawerState {
  isDrawerOpen: boolean;
  refresh: boolean;
}

export interface DeleteProductPayload {
  position: number;
}
export interface BusinessCardDrawerReducers
  extends SliceCaseReducers<DrawerState> {}

const businessCardSlice = createSlice<DrawerState, BusinessCardDrawerReducers>({
  name: "business-card-drawer",
  initialState: {
    isDrawerOpen: false,
    refresh: false,
  },
  reducers: {
    /**
     * Save left drawer status (open/close) to state
     * @param state
     * @param param1
     */
    toggleDrawerStatus(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    /**
     * listen refresh list
     * @param state 
     */
    refreshList(state) {
      state.refresh = !state.refresh;
    }
  },
});

export const businessCardDrawerActions = businessCardSlice.actions;
export default businessCardSlice.reducer;
