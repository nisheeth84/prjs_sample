import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  AttachedFilesDataResponse,
  CommentAndRepliesDataResponse,
  CommentAndRepliesResponse,
  GetFavoriteTimelineGroupsDataResponse,
  GetTimelineFiltersDataResponse,
  GetTimelineGroupsDataResponse,
  // GetTimelineGroupsOfEmployeeDataDataResponse,
  GetTimelineGroupsOfEmployeeDataResponse,
  GetUserTimelinesDataResponse,
  SuggestionTimelineGroupNameDataDataResponse,
  SuggestionTimelineGroupNameDataResponse,
} from "./timeline-repository";
import { Color } from "./register-editer-group-chanel/register-group-chanel-color-screen";
import { getColor } from "./register-editer-group-chanel/color";

export interface TimelineState
  extends GetTimelineGroupsDataResponse,
  GetUserTimelinesDataResponse {
  dataSuggestionTimelineGroupName: SuggestionTimelineGroupNameDataDataResponse[] | any;
  dataGetTimelineGroupsOfEmployee: Array<any>;
  groupColor: Color;
  listColor: Array<Color>;
  timelineGroups: Array<any>;
  dataGetTimelineFilter: GetTimelineFiltersDataResponse | any;
  dataAttachedFiles: AttachedFilesDataResponse[] | any;
  dataCommentAndReplies: CommentAndRepliesDataResponse[] | any;
  filterOptions: Array<number>;
  dataFavoriteTimelineGroups: GetFavoriteTimelineGroupsDataResponse | any;
  dataEmployeeSuggestion: Array<any>;
  sortOptions: string;
  listTypeOption: number;
  suggestionTimeline: any;
  itemUpdateTimeline: any;
}

export interface TimelineReducers extends SliceCaseReducers<TimelineState> { }

function handleUpdateListTimeline(itemUpdate: any, listTimeline: any) {
  const timelineIndex = listTimeline.findIndex((i: any ) => i.timelineId === itemUpdate.timelineId )
  let newArray = [...listTimeline]
  newArray[timelineIndex] = itemUpdate;
  return newArray || [];
}

const timelineSlice = createSlice<TimelineState, TimelineReducers>({
  name: "timeline",
  initialState: {
    // shareTimeline: { timelineId: 0 },
    dataSuggestionTimelineGroupName: [],
    dataGetTimelineGroupsOfEmployee: [
      {
        timelineGroupId: 0,
        timelineGroupName: "",
        imagePath: "",
        inviteId: 0,
        inviteType: "",
        status: 0,
        authority: 0,
      },
    ],
    dataGetTimelineFilter: { timelineFilters: [] },
    dataAttachedFiles: [],
    timelineGroup: [
      // {
      //   timelineGroupId: 0,
      //   timelineGroupName: "",
      //   comment: "",
      //   createdDate: "",
      //   isPublic: true,
      //   color: "",
      //   imagePath: "",
      //   imageName: "",
      //   width: 0,
      //   height: 0,
      //   changedDate: "",
      //   invites: [],
      //   isApproval: false
      // },
    ],
    dataCommentAndReplies: [],
    timelineGroups: [],
    timelines: [],
    listColor: getColor(),
    groupColor: getColor()[0],
    filterOptions: [3],
    dataFavoriteTimelineGroups: [],
    dataEmployeeSuggestion: [],
    sortOptions: "",
    listTypeOption: 1,
    suggestionTimeline: [],
    itemUpdateTimeline: {}
  },
  reducers: {
    suggestTimelineGroupName(
      state,
      { payload }: PayloadAction<SuggestionTimelineGroupNameDataResponse>
    ) {
      state.dataSuggestionTimelineGroupName = payload;
    },
    getTimelineGroups(
      state,
      { payload }: PayloadAction<GetTimelineGroupsDataResponse>
    ) {
      state.timelineGroup = payload.timelineGroup;
    },

    saveListColor(state, { payload }: PayloadAction<Array<Color>>) {
      state.listColor = payload;
    },

    getUserTimelines(
      state,
      { payload }: PayloadAction<GetUserTimelinesDataResponse>
    ) {
      state.timelines = payload.timelines;
    },
    getTimelineGroupsOfEmployee(state, { payload }: PayloadAction<any>) {
      state.dataGetTimelineGroupsOfEmployee = payload.timelineGroup;
    },
    saveCurrentColor(state, { payload }: PayloadAction<Color>) {
      state.groupColor = payload;
    },
    getTimelineFilters(
      state,
      { payload }: PayloadAction<GetTimelineFiltersDataResponse>
    ) {
      state.dataGetTimelineFilter = payload.timelineFilters;
    },
    getAttachedFilters(
      state,
      { payload }: PayloadAction<AttachedFilesDataResponse>
    ) {
      state.dataAttachedFiles = payload.attachedFiles;
    },
    getCommentAndReplies(
      state,
      { payload }: PayloadAction<CommentAndRepliesResponse>
    ) {
      state.dataCommentAndReplies = payload.data;
    },
    updateFilterOptions(state, { payload }: PayloadAction<any>) {
      state.filterOptions = payload;
    },
    updateSortOptions(state, { payload }: PayloadAction<any>) {
      state.sortOptions = payload;
    },
    updateListTypeOptionOptions(state, { payload }: PayloadAction<any>) {
      state.listTypeOption = payload;
    },
    getFavoriteTimelineGroups(state, { payload }: any) {
      state.dataFavoriteTimelineGroups = payload;
    },
    getEmployeeSuggestion(state, { payload }: any) {
      state.dataEmployeeSuggestion = payload;
    },
    getSuggestionTimeline(state, { payload }: any) {
      state.suggestionTimeline = payload.employees;
    },

    updateListUserTimelines(
      state,
      { payload }: PayloadAction<any>
    ) {
      state.timelines = handleUpdateListTimeline(payload.timelines, state.timelines);
    },


  },
});


export const timelineActions = timelineSlice.actions;
export default timelineSlice.reducer;
