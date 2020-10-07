import {
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface StatusDrawerPayload {
  isDrawerOpen: boolean;
}

export interface DrawerState {
  isDrawerOpen: boolean;
}

export interface DeleteProductPayload {
  position: number;
}
export interface ProductManagerDrawerReducers
  extends SliceCaseReducers<DrawerState> { }

const productManagerSlice = createSlice<
  DrawerState,
  ProductManagerDrawerReducers
>({
  name: "business-card-drawer",
  initialState: {
    isDrawerOpen: false,
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
  },
});

export const productManagerDrawerActions = productManagerSlice.actions;
export default productManagerSlice.reducer;
