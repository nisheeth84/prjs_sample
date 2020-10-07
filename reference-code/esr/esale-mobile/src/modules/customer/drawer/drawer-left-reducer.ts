import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface DrawerLeftState {
  titleList: string;
  updateLocalMenu: boolean;
}

export interface TitleListPayload {
  titleList: string;
}

export interface DrawerLeftReducers extends SliceCaseReducers<DrawerLeftState> {}

const drawerLeftSlice = createSlice<DrawerLeftState, DrawerLeftReducers>({
  name: "drawerLeft",
  initialState: {
    titleList: "",
    updateLocalMenu: false,
  },
  reducers: {
    handleSetTitleList(state, { payload }: PayloadAction<TitleListPayload>) {
      state.titleList = payload.titleList;
    },
    reloadLocalMenu(
      state
    ) {
      state.updateLocalMenu = !state.updateLocalMenu;
    },
  }
})

export const drawerLeftActions = drawerLeftSlice.actions;
export default drawerLeftSlice.reducer;