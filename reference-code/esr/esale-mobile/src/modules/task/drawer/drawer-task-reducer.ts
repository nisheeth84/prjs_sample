import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';

export interface DrawerTaskState {
  localNavigation: any;
}

export interface DrawerTaskReducer extends SliceCaseReducers<DrawerTaskState> {}

const drawerTaskSlice = createSlice<DrawerTaskState, DrawerTaskReducer>({
  name: 'drawerTask',
  initialState: {
    localNavigation: {},
  },
  reducers: {
    getLocalNavigation(state, { payload }: PayloadAction<any>) {
      state.localNavigation = payload;
    },
  },
});

export const drawerTaskAction = drawerTaskSlice.actions;
export default drawerTaskSlice.reducer;
