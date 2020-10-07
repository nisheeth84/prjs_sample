import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';
import { InitializeLocalMenu, Departments, MyGroups, ShareGroups } from './drawer-left-repository';

// InitializeLocalMenuResponse
export interface InitializeLocalMenuState {
  initLocalMenu: InitializeLocalMenu;
  updateLocalMenu: boolean;
  statusKeyboard: boolean;
}

// GetInitializeLocalMenuPayload
export interface GetInitializeLocalMenuPayload {
  departments: Departments[];
  myGroups: MyGroups[];
  sharedGroups: ShareGroups[];
}

// InitializeLocalMenuReducers
export interface InitializeLocalMenuReducers
  extends SliceCaseReducers<InitializeLocalMenuState> { }

const initializeLocalMenuSlice = createSlice<
  InitializeLocalMenuState,
  InitializeLocalMenuReducers
>({
  name: 'drawer',
  initialState: {
    initLocalMenu: {
      departments: [],
      myGroups: [],
      sharedGroups: [],
    },
    updateLocalMenu: false,
    statusKeyboard: false
  },
  reducers: {
    initializeLocalMenuFetched(
      state,
      { payload }: PayloadAction<GetInitializeLocalMenuPayload>
    ) {
      state.initLocalMenu = payload;
    },
    reloadLocalMenu(
      state
    ) {
      state.updateLocalMenu = !state.updateLocalMenu;
    },
    status(
      state,
      { payload }: any
    ) {
      state.statusKeyboard = payload
    }
  },
});

export const initializeLocalMenuActions = initializeLocalMenuSlice.actions;
export default initializeLocalMenuSlice.reducer;
