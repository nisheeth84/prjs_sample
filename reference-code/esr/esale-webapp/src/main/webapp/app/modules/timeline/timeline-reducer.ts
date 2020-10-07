import {
  TimelinesType,
  CommentTimelinesType,
  GetCommentAndReply
} from './models/get-user-timelines-type';
import { TimelineGroupTypePro } from './models/get-timeline-groups-of-employee-model';
import { TimelineGroupType } from './models/get-timeline-groups-model';
import { CommonUtil, parseResponseData, parseResponseErorData } from './common/CommonUtil';
import { ACTION_TYPES, LIMIT, TIMELINE_TYPE, LIMIT_ATTACHED_FILE } from './common/constants';
import {
  getUserTimelines,
  getUserTimelinesScroll,
  updateTimelineFavorite,
  deleteTimeline,
  updateTimelineFilters,
  getLocalNavigation,
  getTimelineFilters,
  getTimelineGroups,
  getAttachedFiles,
  updateTimelineGroup,
  createTimelineGroup,
  addRequestToTimelineGroup,
  createCommentAndReply,
  createTimeLine,
  addFavoriteTimelineGroup,
  deleteFavoriteTimelineGroup,
  getAttachedFilesScroll,
  getTimelineGroupsOfEmployee,
  deleteMemberOfTimelineGroup,
  deleteTimelineGroup,
  updateMemberOfTimelineGroup,
  addMemberToTimelineGroup,
  suggestTimelineGroupName,
  clearSuggestTimelineGroupName,
  shareTimeline,
  getFolloweds,
  getFavoriteTimelineGroups,
  updateJoinRequestGroupStatus,
  getTimelineById,
  deleteFolloweds,
  getSuggestionTimeline,
  getEmployeeOfTimelineGroups,
  getCountNew,
  getCommentAndRepliesRenew,
  getCommentAndRepliesOlder,
  getCommentAll,
  getExtTimelines,
  resetPageNumberTimeline,
  getReplyAll,
  getTimelineGroupsDetail,
  getOutTimelineGroup
} from './common/service';

import { GetTimelineFormSearch } from './models/timeline-form-search';
import { GetLocalNavigation, DepartmentTimelineType } from './models/get-local-navigation-model';
import { AttachedFilesType } from './models/get-attached-files-model';
import { SuggestTimelineGroupName } from './models/suggest-timeline-group-name-model';
import { ConfirmPopupItem } from './models/confirm-popup-item';
import { UpdateTimelineFavorite } from './models/update-timeline-favorite-model';
import { CreateCommentAndReply } from './models/create-comment-and-reply-model';
import { CreateTimeline } from './models/create-timeline-model';
import { DeleteMemberOfTimelineGroup } from './models/delete-member-of-timeline-group-model';
import { DeleteTimelineGroup } from './models/delete-timeline-group-model';
import { UpdateMemberOfTimelineGroup } from './models/update-member-of-timeline-group-model';
import { AddMember } from './models/add-member-to-timeline-group-model';
import { GetFolloweds } from './models/get-followeds-model';
import { translate } from 'react-jhipster';
import { GetTimelineGroup } from './models/create-timeline-group';
import { GetCountNew } from './models/get-count-new-model';
import addList, { findIndex, filter } from 'lodash';
import _ from 'lodash';
import { changeScreenMode, handleUpdateRecentlyDateClicked, handleSetIsDeleteMemberSuccess } from './timeline-common-reducer';
import { filterBusinessCards } from '../customers/network-map-modal/add-edit-network-map.reducer';

export enum TimelineAction {
  None,
  ERROR,
  Success,
  NO_RECORD,
  CAN_NOT_DELETE,
  IS_REQUIRE,
  MAX_LENGTH
}

interface IResponseData {
  listComment: [];
}
interface IResponseCommentRenew {
  listCommentRerew: [];
}

interface IResponseCommentOlder {
  listCommentOlder: [];
}

const initialState = {
  listTimelines: [],
  getTimelineFormSearch: null,
  formSearch: null,
  localNavigation: null,
  timelineFilters: null,
  listAttachedFiles: [],
  listSuggestTimeGroupName: null,
  listCommentAndRepliesRenew: [],
  listCommentAndRepliesOlder: [],
  parentId: null,
  listTimelineGroups: [],
  countRequestListChanel: 0,
  listEmployeeOfTimelineGroups: [],
  sortType: null,
  isOpenListAttachedFile: null,
  toggleTimelineModal: false,
  openConfirmPopup: false,
  confirmPopupItem: null,
  action: TimelineAction.None,
  timeLineFavorite: null,
  timeLineFilters: null,
  toggleViewGroupDetail: false,
  timelineGroupId: null,
  toggleViewGroupDetailOwners: false,
  toggleAddMemberToTimelineGroup: false,
  activeNavigation: null,
  deleteMemberOfTimelineGroup: null,
  deleteTimelineGroup: null,
  timelineId: null,
  toggleTimelineUpdateGroup: false,
  isEditGroup: null,
  messageInfo: null,
  messageTimelineGroup: null,
  listTimelineGroupsOfEmployee: [],
  listFavoriteGroupId: [],
  statusRequestJoin: null,
  listSuggestionTimeline: [],
  timelineItem: null,
  // followedsType: null,
  detailObjectId: null,
  detailType: null,
  countCreate: null,
  listExtTimelines: [],
  isExt: null,
  listCountNew: null,
  timelineGroupIdRes: null,
  timelineIdCreated: null,
  canScrollTimeline: null,
  canScrollAttachedTimeline: null,
  shareTimelineId: null,
  // messageFollow: null,
  timelineIdPostCreated: null,
  timelineIdExtPostCreated: null,
  resetPageNumberTimeline: null,
  resetPageNumberAttached: null,
  isModalMode: false,
  deleteTimelineGroupId: null,
  errorCode: null,
  timelineGroupInviteId: null,
  countCommentRenew: null,
  countCommentOlder: null,
  listDataComment: new Map<string, IResponseData>(),
  listDataCommentOlder: new Map<number, IResponseCommentOlder>(),
  listDataCommentRenew: new Map<number, IResponseCommentRenew>(),
  showDetailModalOther: null,
  toggleDetailModalOrther: null,
  timelineGroupRequestToGroupId: null,
  messageValidateRequire: null,
  listTimelineGroupsOfEmployeeInfo: [],
  timelineGroupUpdateInviteId: null,
  isDeleteSuccess: false,
  listTimelineGroupsDetail: [],
  isAddMemberSuccess: false,
  isClickListTimeline: null,
  isCheckRedirectPopout: null
};

export type TimelineReducerState = {
  getTimelineFormSearch: GetTimelineFormSearch;
  listTimelines: TimelinesType[];
  openConfirmPopup: boolean;
  confirmPopupItem: ConfirmPopupItem;
  action: TimelineAction;
  timeLineFavorite: UpdateTimelineFavorite;
  formSearch: any;
  localNavigation: GetLocalNavigation;
  timelineFilters: number[];
  listAttachedFiles: AttachedFilesType[];
  listSuggestTimeGroupName: SuggestTimelineGroupName;
  listCommentAndRepliesRenew: CommentTimelinesType[];
  listCommentAndRepliesOlder: CommentTimelinesType[];
  parentId: number;
  listTimelineGroups: TimelineGroupType[];
  listEmployeeOfTimelineGroups: TimelineGroupType[];
  isOpenListAttachedFile: boolean;
  sortType: any;
  toggleTimelineModal: boolean;
  toggleViewGroupDetail: boolean;
  timelineGroupId: number;
  toggleViewGroupDetailOwners: boolean;
  toggleAddMemberToTimelineGroup: boolean;
  activeNavigation: string;
  deleteMemberOfTimelineGroup: DeleteMemberOfTimelineGroup;
  deleteTimelineGroup: DeleteTimelineGroup;
  timelineId: number;
  toggleTimelineUpdateGroup: boolean;
  isEditGroup: number;
  listTimelineGroupsOfEmployee: TimelineGroupTypePro[];
  listFavoriteGroupId: number[];
  statusRequestJoin: boolean;
  timelineItem: TimelinesType;
  // followedsType: GetFolloweds;
  listSuggestionTimeline: any;
  detailObjectId: number;
  detailType: number;
  countCreate: number;
  listExtTimelines: TimelinesType[];
  isExt: boolean;
  listCountNew: GetCountNew;
  timelineGroupIdRes: number;
  timelineIdCreated: number;
  canScrollTimeline: boolean;
  canScrollAttachedTimeline: number;
  shareTimelineId: number;
  messageTimelineGroup: string;
  messageInfo: string;
  // messageFollow: string;
  timelineIdPostCreated: number;
  timelineIdExtPostCreated: number;
  resetPageNumberTimeline: boolean;
  resetPageNumberAttached: boolean;
  isModalMode: boolean;
  deleteTimelineGroupId: number;
  timelineGroupInviteId: number;
  errorCode: string;
  countCommentRenew: number;
  countCommentOlder: number;
  listDataComment: Map<string, IResponseData>;
  listDataCommentOlder: Map<number, IResponseCommentOlder>;
  listDataCommentRenew: Map<number, IResponseCommentRenew>;
  showDetailModalOther: { detailObjectId: any; detailType: any };
  toggleDetailModalOrther: boolean;
  timelineGroupRequestToGroupId: number;
  messageValidateRequire: string;
  listTimelineGroupsOfEmployeeInfo: TimelineGroupType[];
  timelineGroupUpdateInviteId: number;
  isDeleteSuccess: boolean;
  countRequestListChanel: number;
  listTimelineGroupsDetail: TimelineGroupType[];
  isAddMemberSuccess: boolean;
  isClickListTimeline: boolean;
  isCheckRedirectPopout: number;
};

export const reset = () => ({
  type: ACTION_TYPES.TIMELINE_RESET
});

const handleAction = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_CONFIRM_POPUP:
      return {
        ...state,
        openConfirmPopup: action.payload.flag,
        confirmPopupItem: action.payload.item
      };
    case ACTION_TYPES.TIMELINE_UPDATE_FORM_SEARCH:
      return {
        ...state,
        getTimelineFormSearch: action.payload
      };
    case ACTION_TYPES.TIMELINE_DELETE_TIMELINE_GROUP_NAME:
      return {
        ...state,
        listSuggestTimeGroupName: null
      };
    case ACTION_TYPES.TIMELINE_TOGGLE_LIST_FILE:
      return {
        ...state,
        isOpenListAttachedFile: action.payload
      };
    case ACTION_TYPES.UPDATE_SORTTYPE:
      return {
        ...state,
        sortType: action.payload
      };
    case ACTION_TYPES.TOGGLE_TIMELINE_MODAL:
      return {
        ...state,
        toggleTimelineModal: action.payload.flag,
        isEditGroup: action.payload.isCheckParam
      };
    case ACTION_TYPES.TIMELINE_CREATE_TIMELINE_GROUP:
      return {
        ...state,
        timelineGroupIdRes: action.payload
      };
    case ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS:
      return {
        ...state,
        toggleViewGroupDetail: action.payload
      };
    case ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS_OWNER:
      return {
        ...state,
        toggleViewGroupDetailOwners: action.payload
      };
    case ACTION_TYPES.TIMELINE_SET_DETAIL_ID:
      return {
        ...state,
        timelineGroupId: action.payload,
        timelineGroupIdEdit: action.payload
      };
    case ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_GROUP:
      return {
        ...state,
        toggleTimelineUpdateGroup: action.payload,
        timelineGroupId: action.payload
      };
    case ACTION_TYPES.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP:
      return {
        ...state,
        toggleAddMemberToTimelineGroup: action.payload
      };
    case ACTION_TYPES.TIMELINE_SET_ACTIVE_NAVIGATION:
      return {
        ...state,
        activeNavigation: action.payload,
        isClickListTimeline: true
      };
    case ACTION_TYPES.TIMELINE_UPDATE_JOIN_REQUEST_GROUP_STATUS:
      return {
        ...state,
        statusRequestJoin: action.payload
      };
    case ACTION_TYPES.TIMELINE_GET_FAVORITE_TIMELINE_GROUPS:
      return {
        ...state,
        isFavoriteGroup: action.payload
      };
    case ACTION_TYPES.SHOW_DETAIL:
      return {
        ...state,
        showDetailModalOther: {
          detailObjectId: action.payload.detailObjectId,
          detailType: action.payload.detailType
        }
      };
    case ACTION_TYPES.TIMELINE_LIST_GROUP_RESET:
      return {
        ...state,
        listTimelineGroups: [],
        countRequestListChanel: 0
      };

    // clear cache group detail
    case ACTION_TYPES.CLEAR_CACHE_GROUP_DETAIL:
      return {
        ...state,
        listFavoriteGroupId: [],
        listTimelineGroups: [],
        listTimelineGroupsOfEmployee: [],
        listTimelineGroupsOfEmployeeInfo: [],
        listTimelines: [],
        deleteTimelineGroupId: null,
        listTimelineGroupsDetail: [],
        timelineGroupInviteId: null,
        timelineGroupRequestToGroupId: null
      };
    case ACTION_TYPES.CLEAR_CACHE_LIST_ATTACHED_FILES:
      return {
        ...state,
        listAttachedFiles: []
      };
    case ACTION_TYPES.RESET_TIMELINE_ATTACHED_SCROLL:
      return {
        ...state,
        canScrollAttachedTimeline: null
      };
    case ACTION_TYPES.RESET_MESSAGE_INFO:
      return {
        ...state,
        action: null,
        messageInfo: null,
        errorCode: null
      };
    case ACTION_TYPES.SET_MODAL_MESSAGE_MODE:
      return {
        ...state,
        isModalMode: action.payload
      };
    case ACTION_TYPES.SET_OPEN_CONFIRM_MODAL:
      return {
        ...state,
        openConfirmPopup: action.payload
      };
    case ACTION_TYPES.RESET_TIMELINE_GROUP_ID_RES:
      return {
        ...state,
        timelineGroupIdRes: null
      };
    case ACTION_TYPES.CLEAR_LIST_SUGGESTIONT_TIMELINE:
      return {
        ...state,
        listSuggestionTimeline: []
      };
    case ACTION_TYPES.CLEAR_TIMELINES:
      return {
        ...state,
        listTimelines: [],
        listDataComment: new Map<string, IResponseData>(),
        listDataCommentOlder: new Map<number, IResponseCommentOlder>(),
        listDataCommentRenew: new Map<number, IResponseCommentRenew>()
      };
    case ACTION_TYPES.CLEAR_VIEW_COMMEMT_REPLY_COMMON:
      return {
        ...state,
        listDataComment: new Map<string, IResponseData>(),
        listDataCommentOlder: new Map<number, IResponseCommentOlder>(),
        listDataCommentRenew: new Map<number, IResponseCommentRenew>()
      };
    case ACTION_TYPES.TIMELINE_TOGGLE_DETAIL_MODAL_ORTHER:
      return {
        ...state,
        toggleDetailModalOrther: action.payload,
        showDetailModalOther: null
      };
    case ACTION_TYPES.CLEAR_MESS_REQUIRE:
      return {
        ...state,
        messageValidateRequire: null,
        action: null
      };
    case ACTION_TYPES.RESET_IS_CLICK_NAVIGATION:
      return {
        ...state,
        isClickListTimeline: null
      };
    default:
      return state;
  }
};

export default (state: TimelineReducerState = initialState, action): TimelineReducerState => {
  let result;
  /**  start function call api  */
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_USER_TIMELINES,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listTimelines: response.data.timelines,
        canScrollTimeline: response.data.timelines && response.data.timelines.length === LIMIT,
        resetPageNumberTimeline: !state.resetPageNumberTimeline,
        action: response.data.timelines ? TimelineAction.Success : TimelineAction.NO_RECORD
      };
    }
  );

  if (result) return result;
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_LOCAL_NAVIGATION,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        localNavigation: response.data,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_ATTACHED_FILES,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listAttachedFiles: CommonUtil.flatAttachedFilesResponse(response.data.attachedFiles),
        canScrollAttachedTimeline:
          response.data.listAttachedFiles &&
          response.data.listAttachedFiles.length === LIMIT_ATTACHED_FILE,
        resetPageNumberAttached: !state.resetPageNumberAttached
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_FILTERS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        updateTimelineFilters: response.data
      };
    }
  );

  if (result) return result;
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_CREATE_COMMENT_AND_REPLY,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        timelineIdCreated: response.data,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_SHARE_TIMELINE,
    state,
    action,
    null,
    () => {
      return {
        ...state,
        shareTimelineId: action.payload.data,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_BY_ID,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      return {
        ...state,
        timelineItem: response.timelines
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_TIMELINE,
    state,
    action,
    null,
    () => {
      return {
        ...state,
        action: TimelineAction.Success,
        isCheckRedirectPopout: action.payload.data ? action.payload.data[0] : null
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_COMMENT_AND_REPLIES_RENEW,
    state,
    action,
    null,
    () => {
      const response = action.payload.data.timelines;
      if (state.listDataCommentRenew.has(action.meta.namespace)) {
        state.listDataCommentRenew.get(action.meta.namespace).listCommentRerew = response;
      } else {
        state.listDataCommentRenew.set(action.meta.namespace, {
          listCommentRerew: response
        });
      }
      return {
        ...state,
        countCommentRenew: (state.countCommentRenew || 0) + 1
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_COMMENT_AND_REPLIES_OLDER,
    state,
    action,
    null,
    () => {
      const response = action.payload.data.timelines;
      if (state.listDataCommentOlder.has(action.meta.namespace)) {
        state.listDataCommentOlder.get(action.meta.namespace).listCommentOlder = response;
      } else {
        state.listDataCommentOlder.set(action.meta.namespace, {
          listCommentOlder: response
        });
      }
      return {
        ...state,
        countCommentOlder: (state.countCommentOlder || 0) + 1
      };
    }
  );
  if (result) return result;
  // get all Comment
  result = CommonUtil.excuteFunction(ACTION_TYPES.TIMELINE_GET_COMMENT, state, action, null, () => {
    const response = action.payload.data.timelines;
    if (state.listDataComment.has(action.meta.namespace)) {
      state.listDataComment.get(action.meta.namespace).listComment = response;
    } else {
      state.listDataComment.set(action.meta.namespace, {
        listComment: response
      });
    }
    return {
      ...state,
      countCreate: (state.countCreate || 0) + 1
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_FILTERS,
    state,
    action,
    null,
    () => {
      const response: any[] = action.payload.data.timelineFilters;
      const listTimelineType: number[] = [];
      if (response && response.length > 0) {
        response.forEach(element => {
          listTimelineType.push(element.timelineType);
        });
      } else {
        listTimelineType.push(-1);
      }
      return {
        ...state,
        timelineFilters: listTimelineType
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_COMMON_LOGIC,
    state,
    action,
    null,
    () => {
      const commonLogicRes = action.payload;
      return {
        ...state,
        ...parseResponseData(commonLogicRes)
      };
    }
  );
  if (result) return result;

  // result = CommonUtil.excuteFunction(
  //   ACTION_TYPES.TIMELINE_GET_FOLLOWED,
  //   state,
  //   action,
  //   null,
  //   () => {
  //     const response = action.payload;
  //     return {
  //       ...state,
  //       followedsType: response.data,
  //       messageFollow:
  //         response.data.total > 0
  //           ? ''
  //           : `${translate('timeline.following-management.message-no-data')}`,
  //       action: response.data.total > 0 ? TimelineAction.Success : TimelineAction.NO_RECORD
  //     };
  //   }
  // );
  // if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_FOLLOWED,
    state,
    action,
    null,
    () => {
      const timelineDeleteFollowedRes = action.payload;
      return {
        ...state,
        ...parseResponseData(timelineDeleteFollowedRes),
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  /** group */

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listTimelineGroups: _.cloneDeep(response.data.timelineGroup),
        countRequestListChanel: state.countRequestListChanel++
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_DETAIL,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listTimelineGroupsDetail: response.data.timelineGroup,
        listTimelineGroups: response.data.timelineGroup
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_EMPLOYEE_OF_TIMELINE_GROUPS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        action: TimelineAction.Success,
        listEmployeeOfTimelineGroups: response.data.timelineGroup
      };
    }
  );
  if (result) return result;

  //  group of employee
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listTimelineGroupsOfEmployee: response.data.timelineGroup,
        listTimelineGroupsOfEmployeeInfo: response.data.timelineGroup,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  // request join group
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_ADD_REQUEST_TO_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const response = action.payload.data;
      return {
        ...state,
        messeInfo: `${translate('timeline.message.add-request')}`,
        timelineGroupRequestToGroupId: response,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_ADD_FAVORITE_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const addFavoriteTimelineGroupRes = action.payload;
      return {
        ...state,
        ...parseResponseData(addFavoriteTimelineGroupRes),
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_FAVORITE_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const deleteFavoriteTimelineGroupRes = action.payload;
      return {
        ...state,
        ...parseResponseData(deleteFavoriteTimelineGroupRes),
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const addMemberToTimelineGroupRes = action.payload;
      return {
        ...state,
        ...parseResponseData(addMemberToTimelineGroupRes),
        action: TimelineAction.Success,
        isAddMemberSuccess: true
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_SET_ACTIVE_NAVIGATION,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        ...parseResponseData(response)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_LIST_TIMELINE_GROUP_NAME,
    state,
    action,
    null,
    () => {
      const getNameTimelineGroupRes = action.payload;
      return {
        ...state,
        ...parseResponseData(getNameTimelineGroupRes)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_SUGGEST_TIMELINE_GROUP_NAME,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listSuggestTimeGroupName: response
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const deleteTimelineGroupRes = action.payload;
      return {
        ...state,
        deleteTimelineGroupId: action.payload.data,
        ...parseResponseData(deleteTimelineGroupRes),
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_DELETE_MEMBER_OF_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      return {
        ...state,
        messeInfo: `${translate('timeline.message.delete-member')}`,
        action: TimelineAction.Success,
        isDeleteSuccess: true
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        timelineGroupIdRes: response.data.timelineGroupId,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_MEMBER_OF_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const timelineInviteIdss = action.payload;
      return {
        ...state,
        ...parseResponseData(timelineInviteIdss),
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  // kienpt start
  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_USER_TIMELINES_SCROLL,
    state,
    action,
    () => {
      return {
        ...state,
        canScrollTimeline: true,
        ...parseResponseErorData(action)
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        listTimelines: response.data.timelines
          ? state.listTimelines.concat(response.data.timelines)
          : state.listTimelines,
        canScrollTimeline: response.data.timelines && response.data.timelines.length === LIMIT
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_CREATE_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      const createTimelineGroupRes = action.payload;
      return {
        ...state,
        timelineGroupIdRes: createTimelineGroupRes.data,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_CREATE_TIMELINE,
    state,
    action,
    null,
    () => {
      const createTimelineRes = action.payload.data;
      return {
        ...state,
        timelineIdPostCreated: createTimelineRes,
        timelineIdExtPostCreated: createTimelineRes,
        action: TimelineAction.Success
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_ATTACHED_FILES_SCROLL,
    state,
    action,
    () => {
      return {
        ...state,
        canScrollAttachedTimeline: true,
        ...parseResponseErorData(action)
      };
    },
    () => {
      const response = action.payload;
      return {
        ...state,
        listAttachedFiles: response.data.attachedFiles
          ? state.listAttachedFiles.concat(
              CommonUtil.flatAttachedFilesResponse(response.data.attachedFiles)
            )
          : state.listAttachedFiles,
        canScrollAttachedTimeline:
          response.data.listAttachedFiles &&
          response.data.listAttachedFiles.length === LIMIT_ATTACHED_FILE
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_FAVORITE_TIMELINE_GROUPS,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listFavoriteGroupId: response.data.timelineGroupIds
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_SUGGESTION_TIMELINE,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listSuggestionTimeline: CommonUtil.convertSuggestionTimeline(response.data)
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_GET_COUNT_NEW,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        listCountNew: response.data
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_FAVORITE,
    state,
    action,
    null,
    () => {
      const response = action.payload;
      return {
        ...state,
        timeLineFavorite: response.data
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.GET_OUT_TIMELINE_GROUP,
    state,
    action,
    null,
    () => {
      return {
        ...state,
        messeInfo: `${translate('timeline.message.delete-member')}`,
        action: TimelineAction.Success,
        timelineGroupInviteId: action.payload.data
      };
    }
  );
  if (result) return result;

  /** handle synchronized action */
  return handleAction(state, action);
};

/** end function call api */

export const handleGetAttachedFiles = (param: GetTimelineFormSearch) => async dispatch => {
  await dispatch(getAttachedFiles({ ...param, limit: LIMIT_ATTACHED_FILE }));
};

export const handleInitTimelines = (
  timelineFormSearch?: GetTimelineFormSearch
) => async dispatch => {
  await dispatch(getUserTimelines(timelineFormSearch));
};

export const handleInitTimelinesScroll = (
  timelineFormSearch: GetTimelineFormSearch
) => async dispatch => {
  await dispatch(getUserTimelinesScroll(timelineFormSearch));
};

export const handleInitTimelinesFavorite = (
  timelineId: number,
  roodId: number
) => async dispatch => {
  await dispatch(updateTimelineFavorite(timelineId, roodId));
};

export const toggleConfirmPopup = (_flag: boolean, _item?: ConfirmPopupItem) => ({
  type: ACTION_TYPES.TOGGLE_CONFIRM_POPUP,
  payload: {
    flag: _flag,
    item: _item
  }
});

export const onclickDelete = (
  _timelineId: number,
  _type: number,
  _roodId?: number,
  _parentId?: number
) => async (dispatch, getState) => {
  await dispatch(deleteTimeline(_timelineId));
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
        const formSeach = getState().timelineReducerState.getTimelineFormSearch;
        if (formSeach) {
          dispatch(getUserTimelines(getState().timelineReducerState.getTimelineFormSearch));
        }
      }, 1000);
    }
  }
};

export const handleUpdateTimelineFilters = (timelineType: number[]) => async dispatch => {
  await dispatch(updateTimelineFilters(timelineType));
};

export const handleToggleAddMemberToGroupModal = flag => async (dispatch, getState) => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP, payload: flag });
};

export const handleSetActiveNavigation = param => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_SET_ACTIVE_NAVIGATION, payload: param });
};

// timeline group
export const handleGetTimelineGroups = (param: any) => async dispatch => {
  await dispatch(getTimelineGroups(param));
};

// open group member detail
export const handleToggleGroupDetail = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS, payload: flag });
};

export const handleToggleGroupDetailOwner = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS_OWNER, payload: flag });
};

// check permision user
export const handleGetTimelineGroupsOfEmployee = (
  timelineGroupId: number,
  isCheck?: boolean,
  employeeId?: number
) => async (dispatch, getState) => {
  const res = await dispatch(getTimelineGroupsOfEmployee(timelineGroupId, employeeId));
  if (!isCheck) {
    // Check open modal group-participants/group-participants-owner & call API getTimelineGroups
    if (getState().timelineReducerState.action === TimelineAction.Success) {
      if (
        getState().timelineReducerState.listTimelineGroupsOfEmployee &&
        getState().timelineReducerState.listTimelineGroupsOfEmployee.length > 0 &&
        Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].timelineGroupId) ===
          Number(timelineGroupId) &&
        Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].status) === 1 &&
        Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].authority) === 1
      ) {
        dispatch(getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 2 }));
        dispatch({ type: ACTION_TYPES.TIMELINE_SET_DETAIL_ID, payload: timelineGroupId });
        dispatch(handleToggleGroupDetailOwner(true));
        return;
      } else {
        dispatch(getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 2 }));
        dispatch({ type: ACTION_TYPES.TIMELINE_SET_DETAIL_ID, payload: timelineGroupId });
        dispatch(handleToggleGroupDetail(true));
        return;
      }
    }
  }
  return res;
};

export const handleSuggestTimelineGroupName = (
  timelineGroupName: string,
  searchType: number
) => async dispatch => {
  await dispatch(suggestTimelineGroupName(timelineGroupName, searchType));
};

export const handleGetLocalNavigation = () => async (dispatch, getState) => {
  await dispatch(getLocalNavigation());
  if (
    getState().timelineReducerState.action === TimelineAction.Success &&
    getState().timelineReducerState.localNavigation.localNavigation
  ) {
    const idGroupJoine = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().timelineReducerState.localNavigation.localNavigation.groupTimeline.joinedGroup,
      'groupId'
    );
    const idGroupFavorite = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().timelineReducerState.localNavigation.localNavigation.groupTimeline.favoriteGroup,
      'groupId'
    );
    const idGroupRequest = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().timelineReducerState.localNavigation.localNavigation.groupTimeline
        .requestToJoinGroup,
      'groupId'
    );
    const idGroupAll = addList.concat(idGroupJoine, idGroupFavorite, idGroupRequest);

    const listDepartmentId = (departments: DepartmentTimelineType[]) => {
      let list: any[] = [];
      if (departments && departments.length <= 0) {
        return list;
      }
      departments.forEach(item => {
        list.push(item.departmentId);
        if (item.childDepartments && item.childDepartments.length > 0) {
          list = list.concat(listDepartmentId(item.childDepartments));
        }
      });
      return list;
    };
    const idCustomer = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().timelineReducerState.localNavigation.localNavigation.customerTimeline,
      'listId'
    );
    const idBusiness = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(
      getState().timelineReducerState.localNavigation.localNavigation.businessCardTimeline,
      'listId'
    );

    const idDepartment = listDepartmentId(
      getState().timelineReducerState.localNavigation.localNavigation.departmentTimeline
    );
    const paramCountNew: GetCountNew = {
      groupIds: idGroupAll,
      departmentIds: idDepartment,
      listFavoriteCustomer: idCustomer,
      listFavoriteBusinessCard: idBusiness
    };
    setTimeout(() => {
      dispatch(getCountNew(paramCountNew));
    }, 1000);
  }
};
export const handleAddRequestToTimelineGroup = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(addRequestToTimelineGroup(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleGetLocalNavigation());
  }
};
export const handleAddFavoriteTimelineGroup = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(addFavoriteTimelineGroup(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleGetLocalNavigation());
  }
};
export const handleDeleteFavoriteTimelineGroup = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(deleteFavoriteTimelineGroup(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleGetLocalNavigation());
  }
};

export const handleUpdateTimelineFormSearch = (param: GetTimelineFormSearch, updateClick?: boolean) => async (
  dispatch,
  getState
) => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_UPDATE_FORM_SEARCH, payload: param });
  await dispatch({ type: ACTION_TYPES.CLEAR_TIMELINES });
  await dispatch({ type: ACTION_TYPES.CLEAR_CACHE_LIST_ATTACHED_FILES });

  if(param.filters.isOnlyUnreadTimeline){
    await dispatch(getUserTimelines({...param, limit: 1000}))
  }else{
    await dispatch(getUserTimelines(param))
  }
  if(updateClick && ( getState().timelineReducerState.action === TimelineAction.Success || getState().timelineReducerState.action === TimelineAction.NO_RECORD ) ){
    await dispatch(handleUpdateRecentlyDateClicked(param.listType, param.listId));
  }

  // dirty check
  if (
    getState().timelineCommonReducerState.valuePost &&
    getState().timelineCommonReducerState.valuePost.length > 0
  ) {
    await dispatch(changeScreenMode(true));
  } else {
    await dispatch(changeScreenMode(false));
  }
};

export const handleUpdateTimelineFormSearchNoSearch = (
  param: GetTimelineFormSearch
) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_UPDATE_FORM_SEARCH, payload: param });
};

export const handleGetTimelineFilter = () => async (dispatch, getState) => {
  await dispatch(getTimelineFilters());
  const paramSearch: GetTimelineFormSearch = {
    limit: LIMIT,
    offset: 0,
    listType: 1,
    sort: 'changedDate',
    filters: {
      filterOptions: getState().timelineReducerState.timelineFilters,
      isOnlyUnreadTimeline: false
    }
  };
  await dispatch(handleUpdateTimelineFormSearch(paramSearch));
};

export const handleGetTimelineFilterGroupDetail = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(getTimelineFilters());
  const paramSearch: GetTimelineFormSearch = {
    limit: LIMIT,
    offset: 0,
    listType: TIMELINE_TYPE.GROUP_TIMELINE,
    listId: timelineGroupId,
    sort: 'changedDate',
    filters: {
      filterOptions: getState().timelineReducerState.timelineFilters,
      isOnlyUnreadTimeline: false
    }
  };
  await dispatch(handleUpdateTimelineFormSearch(paramSearch));
};

export const handleGetCommentAndRepliesRenew = (param: GetCommentAndReply) => async dispatch => {
  await dispatch(getCommentAndRepliesRenew(param, param.rootId));
};

export const handleGetCommentAndRepliesOlder = (param: GetCommentAndReply) => async dispatch => {
  await dispatch(getCommentAndRepliesOlder(param, param.rootId));
};

export const handleGetCommentAll = (param: GetCommentAndReply) => async dispatch => {
  await dispatch(getCommentAll(param, param.rootId));
};

export const handleClearSuggestTimelineGroupName = () => async dispatch => {
  await dispatch(clearSuggestTimelineGroupName());
};

export const handleToggleListAttachedFile = (isOpen: boolean) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_TOGGLE_LIST_FILE, payload: isOpen });
};

export const updateSortType = sortType => async dispatch => {
  await dispatch({ type: ACTION_TYPES.UPDATE_SORTTYPE, payload: sortType });
};

export const handleToggleTimelineModal = (param: any) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_TIMELINE_MODAL, payload: param });
};

export const handleToggleCheckCreateOrUpdate = (isCheck: number) => async dispatch => {
  await dispatch(getTimelineGroups({ timelineGroupIds: [isCheck], sortType: 1 }));
  await dispatch(handleToggleTimelineModal({ flag: true, isCheckParam: isCheck }));
};
// close
export const handleToggleGroupParticipantsModal = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS, payload: flag });
};

export const handleToggleGroupParticipantsOwnerModal = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_GROUP_PARTICIPANTS_OWNER, payload: flag });
};

export const handleResetTimelineGroupIdRes = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.RESET_TIMELINE_GROUP_ID_RES
  });
};

export const handleCreateTimelineGroup = (param: GetTimelineGroup) => async (
  dispatch,
  getState
) => {
  const formData = CommonUtil.objectToFormData(param, '', []);
  await dispatch(createTimelineGroup(formData));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleResetTimelineGroupIdRes());
    dispatch(handleGetLocalNavigation());
    setTimeout(() => {
      dispatch(getUserTimelines(getState().timelineReducerState.getTimelineFormSearch));
    }, 1000);
  }
};

export const handleUpdateTimelineGroup = (param: GetTimelineGroup) => async (
  dispatch,
  getState
) => {
  const formData = CommonUtil.objectToFormData(param, '', []);
  await dispatch(updateTimelineGroup(formData));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(handleResetTimelineGroupIdRes());
    dispatch(handleGetLocalNavigation());
    setTimeout(() => {
      dispatch(getUserTimelines(getState().timelineReducerState.getTimelineFormSearch));
    }, 1000);
  }
};

export const handleCreateCommentAndReply = (param: CreateCommentAndReply) => async dispatch => {
  const formData = CommonUtil.objectToFormData(param, '', []);
  await dispatch(createCommentAndReply(formData));
};

export const handleToggleCreateTimeLine = (param: CreateTimeline) => async (dispatch, getState) => {
  const formData = CommonUtil.objectToFormData(param, '', []);
  await dispatch(createTimeLine(formData));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    setTimeout(() => {
      dispatch(getUserTimelines(getState().timelineReducerState.getTimelineFormSearch));
    }, 1000);
  }
};

export const handleGetAttachedFilesScroll = (param: GetTimelineFormSearch) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.RESET_TIMELINE_ATTACHED_SCROLL });
  await dispatch(getAttachedFilesScroll(param));
};

export const handleSetGroupTimelineDetailId = (timelineGroupIdValue: number) => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_SET_DETAIL_ID, payload: timelineGroupIdValue });
  await dispatch(clearSuggestTimelineGroupName());
};

// check permision after delete & update
export const handleGetPermissionOfEmployee = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(getTimelineGroupsOfEmployee(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    if (
      getState().timelineReducerState.listTimelineGroupsOfEmployee &&
      getState().timelineReducerState.listTimelineGroupsOfEmployee[0] &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].timelineGroupId) ===
        Number(timelineGroupId) &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].status) === 1 &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].authority) === 1
    ) {
      dispatch(getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 1 }));
      return;
    } else {
      dispatch(handleToggleGroupDetailOwner(false));
      dispatch(getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 1 }));
      setTimeout(() => {
        dispatch(handleToggleGroupDetail(true));
      }, 500);
      dispatch(handleSetIsDeleteMemberSuccess(true));
      return;
    }
  }
};

// handle get permission when add member
export const handleGetPermissionWhenAddMember = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(getTimelineGroupsOfEmployee(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    if (
      getState().timelineReducerState.listTimelineGroupsOfEmployee &&
      getState().timelineReducerState.listTimelineGroupsOfEmployee[0] &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].timelineGroupId) ===
        Number(timelineGroupId) &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].status) === 1 &&
      Number(getState().timelineReducerState.listTimelineGroupsOfEmployee[0].authority) === 1
    ) {
      await dispatch(
        getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 1 })
      );
      if (getState().timelineReducerState.action === TimelineAction.Success) {
        await dispatch({ type: ACTION_TYPES.TIMELINE_SET_DETAIL_ID, payload: timelineGroupId });
        await dispatch(handleToggleGroupDetailOwner(true));
        return;
      }
    } else {
      await dispatch(handleToggleGroupDetailOwner(false));
      await dispatch(
        getEmployeeOfTimelineGroups({ timelineGroupIds: [timelineGroupId], sortType: 1 })
      );
      if (getState().timelineReducerState.action === TimelineAction.Success) {
        await dispatch({ type: ACTION_TYPES.TIMELINE_SET_DETAIL_ID, payload: timelineGroupId });
        setTimeout(() => {
          dispatch(handleToggleGroupDetail(true));
        }, 500);
        return;
      }
    }
  }
};

// sontd
export const handleUpdateMemberOfTimelineGroup = (param: UpdateMemberOfTimelineGroup) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_TIMELINES_MEMBER
  });
  await dispatch(updateMemberOfTimelineGroup(param));
  if (
    getState().timelineReducerState.action === TimelineAction.Success &&
    param.isOwner === false &&
    param.isDepartment === false
  ) {
    await dispatch(
      getEmployeeOfTimelineGroups({ timelineGroupIds: [param.timelineGroupId], sortType: 1 })
    );
  } else {
    await dispatch(handleGetPermissionOfEmployee(param.timelineGroupId));
  }
};

export const handleInfoGroupUser = (timelineGroupId: number) => async dispatch => {
  await dispatch(getTimelineGroupsOfEmployee(timelineGroupId));
  await dispatch(getTimelineGroupsDetail({ timelineGroupIds: [timelineGroupId], sortType: 1 }));
};

export const handleDeleteMemberOfTimelineGroup = (
  param: DeleteMemberOfTimelineGroup,
  isGroupDetail?: boolean
) => async (dispatch, getState) => {
  await dispatch(deleteMemberOfTimelineGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(getLocalNavigation());
    if (isGroupDetail) {
      dispatch(handleInfoGroupUser(param.timelineGroupId));
    } else {
      dispatch(handleGetPermissionOfEmployee(param.timelineGroupId));
    }
  }
};

// delete member requesting to group
export const handleDeleteMemberRequest = (param: DeleteMemberOfTimelineGroup) => async (
  dispatch,
  getState
) => {
  await dispatch(deleteMemberOfTimelineGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(
      getEmployeeOfTimelineGroups({ timelineGroupIds: [param.timelineGroupId], sortType: 1 })
    );
  }
};

// open addmemberToTimelineGroup modal
export const handleAddMemberToTimelineGroup = (param: AddMember) => async (dispatch, getState) => {
  await dispatch(addMemberToTimelineGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    await dispatch(handleGetPermissionWhenAddMember(param.timelineGroupInvites[0].timelineGroupId));
    await dispatch({ type: ACTION_TYPES.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP, payload: param });
    await dispatch(handleToggleAddMemberToGroupModal(false));
  }
};

export const handleDeleteTimelineGroup = (timelineGroupId: number) => async (
  dispatch,
  getState
) => {
  await dispatch(deleteTimelineGroup(timelineGroupId));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(toggleConfirmPopup(false));
  }
};

export const handleToggleEditModal = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TOGGLE_TIMELINE_MODAL, payload: flag });
};
// end

export const handleShareTimeline = (param: any, isCommon?: boolean) => async (
  dispatch,
  getState
) => {
  await dispatch(shareTimeline(param));
  if (!isCommon) {
    setTimeout(() => {
      dispatch(getUserTimelines(getState().timelineReducerState.getTimelineFormSearch));
    }, 1000);
  } else {
    await dispatch(resetPageNumberTimeline());
    await dispatch(getExtTimelines(getState().timelineCommonReducerState.getExtTimelineFormSearch));
  }
};

export const handleGetFavoriteTimelineGroups = () => async dispatch => {
  await dispatch(getFavoriteTimelineGroups());
};

export const handleUpdateJoinRequestGroupStatus = (
  isHaveJoinRequest: boolean
) => async dispatch => {
  await dispatch(updateJoinRequestGroupStatus(isHaveJoinRequest));
};

export const handleGetTimelineById = (timelineId: number) => async dispatch => {
  await dispatch(getTimelineById(timelineId));
};

// export const handleGetFolloweds = (limit?: number, offset?: number) => async dispatch => {
//   await dispatch(getFolloweds(limit, offset || 0));
// };

export const handleDeleteFolloweds = (
  targetId: number,
  targetType: number,
  records: number,
  page: number
) => async (dispatch, getState) => {
  await dispatch(deleteFolloweds(targetId, targetType));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(toggleConfirmPopup(false));
    dispatch(getFolloweds(records, page > 0 ? page : 0));
  }
};

export const handleToggleDetailModalOther = flag => async dispatch => {
  await dispatch({ type: ACTION_TYPES.TIMELINE_TOGGLE_DETAIL_MODAL_ORTHER, payload: flag });
};

export const handleShowDetail = (
  _detailObjectId: number,
  _detailType: number
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SHOW_DETAIL,
    payload: { detailObjectId: _detailObjectId, detailType: _detailType }
  });
  await dispatch(handleToggleDetailModalOther(true));
};

export const handleGetSuggestionTimeline = (
  keyWords: string,
  timelineGroupId: number,
  listItemChoice: any
) => async dispatch => {
  await dispatch(getSuggestionTimeline(keyWords, timelineGroupId, listItemChoice));
};

export const handleClearDataTimelineGroups = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.TIMELINE_LIST_GROUP_RESET
  });
};

export const handleClearCacheGroupDetail = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_CACHE_GROUP_DETAIL
  });
};

export const handleClearCacheListAttachedFiles = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_CACHE_LIST_ATTACHED_FILES
  });
};

export const handleResetMessageInfo = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.RESET_MESSAGE_INFO
  });
};

export const handleSetModalMessageMode = (isModal: boolean) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_MODAL_MESSAGE_MODE,
    payload: isModal
  });
};

export const handleSetModalConfirm = (isOpen: boolean) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_OPEN_CONFIRM_MODAL,
    payload: isOpen
  });
};

export const clearListSuggestionTimeline = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_LIST_SUGGESTIONT_TIMELINE
  });
};

export const handClearMessValidateRequire = () => async dispatch => {
  await dispatch({ type: ACTION_TYPES.CLEAR_MESS_REQUIRE });
};

export const clearListTimelineGroups = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_LIST_TIMELINE_GROUP
  });
};

export const handleGetOutTimelineGroup = (
  param: DeleteMemberOfTimelineGroup
  , isPopout: boolean
  , isPublicChannel: boolean
) => async (dispatch, getState) => {
  await dispatch(getOutTimelineGroup(param));
  if (getState().timelineReducerState.action === TimelineAction.Success) {
    dispatch(
      getEmployeeOfTimelineGroups({ timelineGroupIds: [param.timelineGroupId], sortType: 1 })
    );
    dispatch(getLocalNavigation());
    if (isPopout === true && isPublicChannel === false) {
      await dispatch(handleToggleGroupDetailOwner(false));
      await dispatch(handleGetTimelineGroups({ timelineGroupIds: [], sortType: 1 }));
    }
  }
};

export const handleClearListTimeline = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_TIMELINES
  });
};
export const handleClearListCommentCommon = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CLEAR_VIEW_COMMEMT_REPLY_COMMON
  });
};

export const handleResetIsClickListTimeline = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.RESET_IS_CLICK_NAVIGATION
  });
};
