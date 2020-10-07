import { TimelinesType, GetCommentAndReply } from './models/get-user-timelines-type';
import { CommonUtil, parseResponseErorData } from './common/CommonUtil';
import { ACTION_TYPES, LIMIT_EXT } from './common/constants';
import { ScreenMode } from 'app/config/constants';
import {
  getExtTimelines,
  getExtTimelinesScroll,
  getExtTimelineFilters,
  updateExtTimelineFilters,
  createTimeLine,
  deleteExtTimeline,
  updateRecentlyDateClicked,
  resetPageNumberTimeline,
  getReplyAll,
  addRequestToJoinGroup,
  deleteRequestToJoinGroup,
  getCommentAll,
  checkIsPublicGroup,
  getTimelineGroupsOfEmployeeForDetailEmp,
  getListTimelineGroupsByIds,
  getFolloweds
} from './common/service';

import { GetTimelineFormSearch } from './models/timeline-form-search';
import { CreateTimeline } from './models/create-timeline-model';
import { toggleConfirmPopup, TimelineAction, handleGetLocalNavigation } from './timeline-reducer';
import { translate } from 'react-jhipster';
import { DeleteMemberOfTimelineGroup } from './models/delete-member-of-timeline-group-model';
import {
  GetCountNew,
  GroupTimeline,
  DepartmentTimeline,
  CustomerTimeline,
  BizcardTimeline
} from './models/get-count-new-model';
import { GetFolloweds } from './models/get-followeds-model';

interface IResponseData {
  listReplies: [];
}

interface IAddRequest {
  timelineGroupRequestId: null;
}

interface IDeleteRequest {
  timelineGroupUnRequestId: null;
}

const initialState = {
  screenMode: null,
  getExtTimelineFormSearch: null,
  // extra zone
  listExtTimelines: [],
  extTimelineFilters: [],
  canScrollExtTimeline: null,
  dataListReply: new Map<string, IResponseData>(),
  countReply: null,
  dataListAddRequest: new Map<string, IAddRequest>(),
  countAddRequest: null,
  dataListDeleteRequest: new Map<string, IDeleteRequest>(),
  countDeleteRequest: null,
  isPublic: null,
  action: null,
  isScrolling: null,
  valuePost: null,
  activeStack: [1],
  mapExtTimelineFormSearch: new Map<number, GetTimelineFormSearch>(),
  listExtTimelinesScroll: [],
  timelineValueFilter: false,
  followedsType: null,
  messageFollow: null,
  isDeleteSuccess: false
};

export type TimelineCommonReducerState = {
  getExtTimelineFormSearch: GetTimelineFormSearch;
  listExtTimelines: TimelinesType[];
  extTimelineFilters: number[];
  canScrollExtTimeline: number;
  dataListReply: Map<string, IResponseData>;
  countReply: number;
  dataListAddRequest: Map<string, IAddRequest>;
  countAddRequest: number;
  dataListDeleteRequest: Map<string, IDeleteRequest>;
  countDeleteRequest: number;
  isPublic: boolean;
  screenMode: ScreenMode.DISPLAY;
  action: number;
  isScrolling: boolean;
  valuePost: string;
  activeStack: number[];
  mapExtTimelineFormSearch: Map<number, GetTimelineFormSearch>;
  listExtTimelinesScroll: TimelinesType[];
  timelineValueFilter: boolean;
  followedsType: GetFolloweds;
  messageFollow: string;
  isDeleteSuccess: boolean;
};

export const reset = () => ({
  type: ACTION_TYPES.TIMELINE_RESET
});

const handleAction = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.TIMELINE_UPDATE_EXT_FORM_SEARCH:
      return {
        ...state,
        getExtTimelineFormSearch: action.payload
      };
    case ACTION_TYPES.RESET_EXT_TIMELINE_SCROLL:
      return {
        ...state,
        canScrollExtTimeline: action.payload
      };
    case ACTION_TYPES.CLEAR_TIMELINES_MEMBER:
      return {
        ...state,
        listEmployeeOfTimelineGroups: []
      };
    case ACTION_TYPES.TIMELINE_CLEAR_EXT_TIMELINE:
      return {
        ...state,
        listExtTimelines: [],
        action: TimelineAction.None,
        canScrollExtTimeline: true,
        listExtTimelinesScroll: []
      };
    case ACTION_TYPES.CLEAR_IS_PUBLIC_GROUP:
      return {
        ...state,
        isPublic: null
      };
    /* EDIT MODE */
    case ACTION_TYPES.TIMELINE_LIST_CHANGE_TO_EDIT: {
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    }
    case ACTION_TYPES.TIMELINE_LIST_CHANGE_TO_DISPLAY: {
      return {
        ...state,
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      };
    }
    case ACTION_TYPES.SET_IS_SCROLLING:
      return {
        ...state,
        isScrolling: action.payload
      };
    case ACTION_TYPES.TIMELINE_IS_VALUE_POST:
      return {
        ...state,
        valuePost: action.payload
      };
    case ACTION_TYPES.SET_ACTIVE_STACK:
      return {
        ...state,
        activeStack: action.payload
      };
    case ACTION_TYPES.TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH:
      return {
        ...state,
        mapExtTimelineFormSearch: action.payload
      };
    case ACTION_TYPES.TIMELINE_VALUE_FILTER:
      return {
        ...state,
        timelineValueFilter: action.payload
      };
    case ACTION_TYPES.TIMELINE_CLEAR_VALUE_FILTER:
      return {
        ...state,
        timelineValueFilter: false
      };
    case ACTION_TYPES.TIMELINE_CLEAR_TIMELINE_FOLLOWER:
      return {
        ...state,
        followedsType: null
      };
    case ACTION_TYPES.SET_IS_DELETE_MEMBER:
      return {
        ...state,
        isDeleteSuccess: action.payload
      };
    default:
      return state;
  }
};

export default (
  state: TimelineCommonReducerState = initialState,
  action
): TimelineCommonReducerState => {
  let result;
  const returnSuccess = () => {
    return {
      ...state,
      action: TimelineAction.Success
    };
  };

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_EXT_TIMELINES,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listExtTimelines: response.data.timelines,
        listExtTimelinesScroll: [],
        canScrollExtTimeline:
          response.data.timelines && response.data.timelines.length === LIMIT_EXT,
        action: response.data.timelines ? TimelineAction.Success : TimelineAction.NO_RECORD
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_EXT_TIMELINE_FILTERS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        action: TimelineAction.Success,
        updateTimelineFilters: response.data
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_EXT_TIMELINE_FILTERS,
    state,
    action,
    null,
    () => {
      const response = action.payload.data.timelineFilters;
      const listTimelineType: number[] = [];
      response.forEach(element => {
        listTimelineType.push(element.timelineType);
      });
      return {
        ...state,
        extTimelineFilters: listTimelineType
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_EXT_USER_TIMELINES_SCROLL,
    state,
    action,
    () => {
      return {
        ...state,
        canScrollExtTimeline: true,
        ...parseResponseErorData(action)
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        listExtTimelinesScroll: response.data.timelines,
        canScrollExtTimeline:
          response.data.timelines && response.data.timelines.length === LIMIT_EXT
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_EXT_TIMELINE,
    state,
    action,
    null,
    () => {
      returnSuccess();
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_RECENTLY_DATE_CLICKED,
    state,
    action,
    null,
    () => {
      returnSuccess();
    }
  );
  if (result) return result;

  // get All reply
  result = CommonUtil.excuteFunction(ACTION_TYPES.TIMELINE_GET_REPLIES, state, action, null, () => {
    const response = action.payload.data.timelines;
    if (state.dataListReply.has(action.meta.namespace)) {
      state.dataListReply.get(action.meta.namespace).listReplies = response;
    } else {
      state.dataListReply.set(action.meta.namespace, {
        listReplies: response
      });
    }
    return {
      ...state,
      countReply: (state.countReply || 0) + 1
    };
  });
  if (result) return result;

  // add request to join group
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_ADD_REQUEST_TO_JOIN_GROUP,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      state.dataListAddRequest = new Map<string, IAddRequest>();
      if (state.dataListAddRequest.has(action.meta.namespace)) {
        state.dataListAddRequest.get(action.meta.namespace).timelineGroupRequestId = response;
      } else {
        state.dataListAddRequest.set(action.meta.namespace, {
          timelineGroupRequestId: response
        });
      }
      return {
        ...state,
        messeInfo: `${translate('timeline.message.add-request')}`,
        action: TimelineAction.Success,
        dataListAddRequest: state.dataListAddRequest,
        countAddRequest: (state.countAddRequest || 0) + 1
      };
    }
  );
  if (result) return result;

  // delete request to join group
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_REQUEST_TO_JOIN_GROUP,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      state.dataListDeleteRequest = new Map<string, IDeleteRequest>();
      if (state.dataListDeleteRequest.has(action.meta.namespace)) {
        state.dataListDeleteRequest.get(action.meta.namespace).timelineGroupUnRequestId = response;
      } else {
        state.dataListDeleteRequest.set(action.meta.namespace, {
          timelineGroupUnRequestId: response
        });
      }
      return {
        ...state,
        messeInfo: `${translate('timeline.message.delete-member')}`,
        action: TimelineAction.Success,
        dataListDeleteRequest: state.dataListDeleteRequest,
        countDeleteRequest: (state.countDeleteRequest || 0) + 1
      };
    }
  );
  if (result) return result;
  // check public group
  result = CommonUtil.excuteFunction(ACTION_TYPES.CHECK_PUBLIC_GROUP, state, action, null, () => {
    const response = action.payload.data;
    return {
      ...state,
      isPublic:
        response.timelineGroup && response.timelineGroup.length > 0
          ? response.timelineGroup[0].isPublic
          : null
    };
  });
  if (result) return result;

  //  group of employee for detail emp
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE_FOR_DETAIL_EMP,
    state,
    action,
    null,
    () => {
      return {
        ...state
      };
    }
  );
  if (result) return result;

  // timeline folower
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_FOLLOWED,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        followedsType: response.data,
        messageFollow:
          response.data.total > 0
            ? ''
            : `${translate('timeline.following-management.message-no-data')}`,
        action: response.data.total > 0 ? TimelineAction.Success : TimelineAction.NO_RECORD
      };
    }
  );
  if (result) return result;

  /** handle synchronized action */
  return handleAction(state, action);
};

/** end function call api */

export const handleInitExtTimelines = (
  timelineFormSearch?: GetTimelineFormSearch
) => async dispatch => {
  await dispatch(getExtTimelines(timelineFormSearch));
};

export const handleInitExtTimelinesScroll = (timelineFormSearch: GetTimelineFormSearch) => async (
  dispatch,
  getState
) => {
  await dispatch({ type: ACTION_TYPES.RESET_EXT_TIMELINE_SCROLL });
  // update map form search active start
  const activePos = getState().timelineCommonReducerState.activeStack;
  const mapFormSearch = getState().timelineCommonReducerState.mapExtTimelineFormSearch;
  mapFormSearch.set(activePos.length, timelineFormSearch);
  await dispatch({
    type: ACTION_TYPES.TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH,
    payload: mapFormSearch
  });
  // update map form search active end
  await dispatch(getExtTimelinesScroll(timelineFormSearch));
};

export const handleUpdateExtTimelineFilters = (timelineType: number[]) => async dispatch => {
  await dispatch(updateExtTimelineFilters(timelineType));
};

export const handleGetExtTimelineFilter = () => async dispatch => {
  await dispatch(resetPageNumberTimeline());
  await dispatch(getExtTimelineFilters());
};

export const handleUpdateExtTimelineFormSearch = (param: GetTimelineFormSearch) => async (
  dispatch,
  getState
) => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_UPDATE_EXT_FORM_SEARCH, payload: param });
  // update map form search active start
  const activePos = getState().timelineCommonReducerState.activeStack;
  const mapFormSearch = getState().timelineCommonReducerState.mapExtTimelineFormSearch;
  mapFormSearch.set(activePos.length, param);
  await dispatch({
    type: ACTION_TYPES.TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH,
    payload: mapFormSearch
  });
  // update map form search active end
  await dispatch(getExtTimelines(param));
};

export const handleUpdateExtTimelineFormSearchNoSearch = (param: GetTimelineFormSearch) => async (
  dispatch,
  getState
) => {
  // update map form search active start
  const activePos = getState().timelineCommonReducerState.activeStack;
  const mapFormSearch = getState().timelineCommonReducerState.mapExtTimelineFormSearch;
  mapFormSearch.set(activePos.length, param);
  await dispatch({
    type: ACTION_TYPES.TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH,
    payload: mapFormSearch
  });
  // update map form search active end
  await dispatch({ type: ACTION_TYPES.TIMELINE_UPDATE_EXT_FORM_SEARCH, payload: param });
};

export const handleInnitGetExtTimelineFilter = (_formSearch: GetTimelineFormSearch) => async (
  dispatch,
  getState
) => {
  await dispatch(getExtTimelineFilters());
  const listFillter = getState().timelineCommonReducerState.extTimelineFilters;
  const filters = { filterOptions: listFillter, isOnlyUnreadTimeline: false };
  _formSearch.filters = filters;
  await dispatch(handleUpdateExtTimelineFormSearchNoSearch(_formSearch));
  await dispatch(resetPageNumberTimeline());
  await dispatch(getExtTimelines(_formSearch));
};

export const handleCreateExtTimeLine = (param: CreateTimeline) => async (dispatch, getState) => {
  const formData = CommonUtil.objectToFormData(param, '', []);
  await dispatch(createTimeLine(formData));
  await dispatch(await dispatch(resetPageNumberTimeline()));
  setTimeout(() => {
    dispatch(getExtTimelines(getState().timelineCommonReducerState.getExtTimelineFormSearch));
  }, 1000);
};

export const onclickDeleteExtTimeline = (
  _timelineId: number,
  _type: number,
  _roodId?: number,
  _parentId?: number
) => async (dispatch, getState) => {
  await dispatch(deleteExtTimeline(_timelineId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(toggleConfirmPopup(false));
    if (_type === 1) {
      const param: GetCommentAndReply = {
        timelineId: _roodId,
        type: _type,
        rootId: _roodId
      };
      setTimeout(() => {
        dispatch(getCommentAll(param, _roodId));
      }, 1000);
    } else if (_type === 2) {
      const param: GetCommentAndReply = {
        timelineId: _parentId,
        type: _type,
        rootId: _roodId
      };
      setTimeout(() => {
        dispatch(getReplyAll(param, _parentId));
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch(getExtTimelines(getState().timelineCommonReducerState.getExtTimelineFormSearch));
      }, 1000);
    }
  }
};

export const handleUpdateRecentlyDateClicked = (actionType: number, _listId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(updateRecentlyDateClicked(actionType, _listId));
  if (getState().timelineCommonReducerState.action === TimelineAction.Success) {
    const listCountNew: GetCountNew = getState().timelineReducerState.listCountNew;
    if (actionType === 1) {
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, allTimeline: 0 }
      };
    } else if (actionType === 2) {
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, myTimeline: 0 }
      };
    } else if (actionType === 3) {
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, favoriteTimeline: 0 }
      };
    } else if (actionType === 4) {
      const listGroup: GroupTimeline[] = listCountNew.counter.groupTimeline;
      const index = listGroup.findIndex(obj => (obj.groupId === Number(_listId)));
      listGroup.splice(index, 1);
      listGroup.push({ groupId: Number(_listId) , newItem: 0 });
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, groupTimeline: listGroup }
      };
    } else if (actionType === 5) {
      const listDepartment: DepartmentTimeline[] = listCountNew.counter.departmentTimeline;
      const index = listDepartment.findIndex(obj => (obj.departmentId === Number(_listId)));
      listDepartment.splice(index, 1);
      listDepartment.push({ departmentId: Number(_listId), newItem: 0 });
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, departmentTimeline: listDepartment }
      };
    } else if (actionType === 6) {
      const listCustomerTimeline: CustomerTimeline[] = listCountNew.counter.customerTimeline;
      const index = listCustomerTimeline.findIndex(obj => (obj.listId === Number(_listId)));
      listCustomerTimeline.splice(index, 1);
      listCustomerTimeline.push({ listId: Number(_listId), newItem: 0 });
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, customerTimeline: listCustomerTimeline }
      };
    } else if (actionType === 7) {
      const listBizcardTimeline: BizcardTimeline[] = listCountNew.counter.bizcardTimeline;
      const index = listBizcardTimeline.findIndex(obj => (obj.listId === Number(_listId)));
      listBizcardTimeline.splice(index, 1);
      listBizcardTimeline.push({ listId: Number(_listId), newItem: 0 });
      getState().timelineReducerState.listCountNew = {
        ...listCountNew,
        counter: { ...listCountNew.counter, bizcardTimeline: listBizcardTimeline }
      };
    }
  }
};

export const handleGetReplyAll = (param: any, parenId: number) => async dispatch => {
  await dispatch(getReplyAll(param, parenId));
};

export const handleAddRequestToJoinGroup = (param: any) => async (dispatch, getState) => {
  await dispatch(addRequestToJoinGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleGetLocalNavigation());
  }
};

export const handleDeleteRequestToJoinGroup = (param: DeleteMemberOfTimelineGroup) => async (
  dispatch,
  getState
) => {
  await dispatch(deleteRequestToJoinGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleGetLocalNavigation());
  }
};

export const handleCheckIsPublicGroup = (param: any) => async dispatch => {
  await dispatch(checkIsPublicGroup(param));
};

export const handleClearCacheIsPublicGroup = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.CLEAR_IS_PUBLIC_GROUP });
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.TIMELINE_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.TIMELINE_LIST_CHANGE_TO_DISPLAY
});

export const handleSetIsScrolling = (_isScrolling: boolean) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.SET_IS_SCROLLING, payload: _isScrolling });
};

export const handleSetValuePost = (_value: string) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_IS_VALUE_POST, payload: _value });
};

export const handleSetActiveStack = (_value: number[]) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.SET_ACTIVE_STACK, payload: _value });
};

export const handleClearCacheTimeline = (activeStack: number[]) => async (dispatch, getState) => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_CLEAR_EXT_TIMELINE });
  // delete map form search active start
  const mapFormSearch = getState().timelineCommonReducerState.mapExtTimelineFormSearch;
  mapFormSearch.delete(activeStack.length + 1);
  await dispatch({
    type: ACTION_TYPES.TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH,
    payload: mapFormSearch
  });
  await dispatch({
    type: ACTION_TYPES.TIMELINE_UPDATE_EXT_FORM_SEARCH,
    payload: mapFormSearch.get(activeStack.length)
  });
  // delete map end
  await dispatch(handleSetActiveStack(activeStack));
};

// handle get Timeline detail for
export const handleGetTimelineGroupsOfEmployeeForDetailEmp = (
  timelineGroupId: number,
  employeeId?: number
) => async dispatch => {
  const res = await dispatch(getTimelineGroupsOfEmployeeForDetailEmp(timelineGroupId, employeeId));
  return res;
};

export const handleGetListTimelineGroupsByIds = (
  timelineGroupIds: number[],
  sortType?: number
) => async dispatch => {
  const res = await dispatch(getListTimelineGroupsByIds({ timelineGroupIds, sortType }));
  return res;
};

export const handleSaveTimelineValueFilter = (valueFilter: boolean) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_VALUE_FILTER, payload: valueFilter });
};
export const handleGetFolloweds = (limit?: number, offset?: number) => async dispatch => {
  await dispatch(getFolloweds(limit, offset || 0));
};

export const handleClearCacheFollowed = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_CLEAR_TIMELINE_FOLLOWER });
};

export const handleClearTimelineValueFilter = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.TIMELINE_CLEAR_VALUE_FILTER
  });
};

export const handleSetIsDeleteMemberSuccess = (isDeleteSuccess: boolean) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_IS_DELETE_MEMBER,
    payload: isDeleteSuccess
  });
};
