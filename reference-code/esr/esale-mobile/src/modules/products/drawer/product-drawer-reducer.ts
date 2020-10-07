import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface StatusDrawerPayload {
  isDrawerOpen: boolean
}

export interface DrawerState {
  isDrawerOpen: boolean
}

export interface DeleteProductPayload {
  position: number;
}
export interface ProductDrawerReducers extends SliceCaseReducers<DrawerState> { }

const productSlice = createSlice<DrawerState, ProductDrawerReducers>({
  name: "product-drawer",
  initialState: {
    isDrawerOpen: false
  },
  reducers: {

    /**
     * Save left drawer status (open/close) to state
     * @param state 
     * @param param1 
     */
    saveDrawerStatus(state, { payload }: PayloadAction<boolean>) {
      state.isDrawerOpen = payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
