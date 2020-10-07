import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  LocalNavigationResponse,
  UserTimelineResponse,
} from "./timeline-drawer-repository";

export interface DrawerState {
  localNavigationData: LocalNavigationResponse;
  userTimelineData: UserTimelineResponse;
}
export interface LocalNavigationPayload {
  localNavigationData: LocalNavigationResponse;
}
export interface UserTimelinePayload {
  userTimelineData: UserTimelineResponse;
}
export interface DrawerTimelineReducer extends SliceCaseReducers<DrawerState> { }
const drawerTimelineSlice = createSlice<DrawerState, DrawerTimelineReducer>({
  name: "drawerTimeline",
  initialState: {
    localNavigationData: {
      localNavigation: {
        allTimeline: 0,
        myTimeline: 0,
        favoriteTimeline: 0,
        groupTimeline: {
          joinedGroup: [],
          favoriteGroup: [],
          requestToJoinGroup: [],
        },
        departmentTimeline: [],
        customerTimeline: [],
        businessCardTimeline: [],
      },
    },
    userTimelineData: { timelines: [] },
  },
  reducers: {
    getLocalNavigation(state, { payload }: any) {
      state.localNavigationData = payload;
    },
    getUserTimeline(state, { payload }: PayloadAction<UserTimelinePayload>) {
      state.userTimelineData = payload.userTimelineData;
    },
  },
});
export const drawerTimelineAction = drawerTimelineSlice.actions;
export default drawerTimelineSlice.reducer;
