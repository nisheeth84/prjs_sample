import axios from 'axios';
import { ACTION_TYPES, LIMIT_ATTACHED_FILE } from './constants';
import { GetTimelineFormSearch } from '../models/timeline-form-search';
import { DeleteMemberOfTimelineGroup } from '../models/delete-member-of-timeline-group-model';
import { UpdateMemberOfTimelineGroup } from '../models/update-member-of-timeline-group-model';
import { AddMember } from '../models/add-member-to-timeline-group-model';
import { GetCountNew } from './../models/get-count-new-model';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import { GetCommentAndReply } from '../models/get-user-timelines-type';

const baseUrl = API_CONTEXT_PATH + '/' + API_CONFIG.TIMELINES_SERVICE_PATH;
const baseEmpUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export const getUserTimelines = (param?: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_GET_USER_TIMELINES,
  payload: axios.post(`${baseUrl}/get-user-timelines`, param, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const getLocalNavigation = () => ({
  type: ACTION_TYPES.TIMELINE_GET_LOCAL_NAVIGATION,
  payload: axios.post(`${baseUrl}/get-local-navigation`, {})
});
export const getCountNew = (param?: GetCountNew) => ({
  type: ACTION_TYPES.TIMELINE_GET_COUNT_NEW,
  payload: axios.post(`${baseUrl}/get-count-new`, param)
});

export const getAttachedFiles = (param: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_GET_ATTACHED_FILES,
  payload: axios.post(`${baseUrl}/get-attached-files`, {
    listType: param.listType,
    listId: param.listId,
    limit: LIMIT_ATTACHED_FILE,
    offset: param.offset,
    filters: {
      filterOptions: param.filters.filterOptions,
      isOnlyUnreadTimeline: param.filters.isOnlyUnreadTimeline
    }
  })
});

export const updateTimelineFilters = typeTimelines => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_FILTERS,
  payload: axios.post(`${baseUrl}/update-timeline-filters`, {
    timelineType: typeTimelines
  })
});

export const createCommentAndReply = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_CREATE_COMMENT_AND_REPLY,
  payload: axios.post(`${baseUrl}/create-comment-and-reply`, param, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
});

export const shareTimeline = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_SHARE_TIMELINE,
  payload: axios.post(`${baseUrl}/share-timeline`, param, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
});

export const getTimelineById = timelineIdParam => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_BY_ID,
  payload: axios.post(`${baseUrl}/get-timeline-by-id`, {
    timelineId: timelineIdParam
  })
});

export const updateTimelineFavorite = (idTimeline, idRoot) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_FAVORITE,
  payload: axios.post(`${baseUrl}/update-timeline-favorite`, {
    timelineId: idTimeline,
    rootId: idRoot
  })
});

export const deleteTimeline = (id: number) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_TIMELINE,
  payload: axios.post(`${baseUrl}/delete-timeline`, {
    timelineId: id
  })
});

export const getCommentAndRepliesRenew = (param: GetCommentAndReply, _roodId: number) => ({
  type: ACTION_TYPES.TIMELINE_GET_COMMENT_AND_REPLIES_RENEW,
  payload: axios.post(`${baseUrl}/get-comment-and-replies`, param),
  meta: {
    namespace: _roodId || 0
  }
});

export const getCommentAndRepliesOlder = (param: GetCommentAndReply, _roodId: number) => ({
  type: ACTION_TYPES.TIMELINE_GET_COMMENT_AND_REPLIES_OLDER,
  payload: axios.post(`${baseUrl}/get-comment-and-replies`, param),
  meta: {
    namespace: _roodId || 0
  }
});

export const getCommentAll = (param: GetCommentAndReply, _roodId?: any) => ({
  type: ACTION_TYPES.TIMELINE_GET_COMMENT,
  payload: axios.post(`${baseUrl}/get-comment-and-replies`, param),
  meta: {
    namespace: _roodId || 0
  }
});

export const getReplyAll = (param: GetCommentAndReply, _parentId) => ({
  type: ACTION_TYPES.TIMELINE_GET_REPLIES,
  payload: axios.post(`${baseUrl}/get-comment-and-replies`, param),
  meta: {
    namespace: _parentId || 0
  }
});

export const updateTimelineReaction = (idTimeline, idRoot, typeReaction) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_REACTION,
  payload: axios.post(`${baseUrl}/update-timeline-reaction`, {
    timelineId: idTimeline,
    rootId: idRoot,
    reactionType: typeReaction
  })
});

export const getTimelineFilters = () => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_FILTERS,
  payload: axios.post(`${baseUrl}/get-timeline-filters`, {})
});

export const getFolloweds = (limitFollow?: number, offsetFollow?: number) => ({
  type: ACTION_TYPES.TIMELINE_GET_FOLLOWED,
  payload: axios.post(`${baseUrl}/get-followeds`, {
    limit: limitFollow,
    offset: offsetFollow,
    followTargetType: null,
    followTargetId: null
  })
});

export const deleteFolloweds = (targetId: number, targetType: number) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_FOLLOWED,
  payload: axios.post(`${baseUrl}/delete-followeds`, {
    followeds: [
      {
        followTargetType: targetType,
        followTargetId: targetId
      }
    ]
  })
});

export const getTimelineGroups = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS,
  payload: axios.post(`${baseUrl}/get-timeline-groups`, {
    timelineGroupIds: param.timelineGroupIds,
    sortType: param.sortType
  })
});

export const getEmployeeOfTimelineGroups = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_GET_EMPLOYEE_OF_TIMELINE_GROUPS,
  payload: axios.post(`${baseUrl}/get-timeline-groups`, {
    timelineGroupIds: param.timelineGroupIds,
    sortType: param.sortType
  })
});

export const getTimelineGroupsOfEmployee = (timelineGroupIds, employeeId?) => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE,
  payload: axios.post(`${baseUrl}/get-timeline-groups-of-employee`, {
    timelineGroupId: timelineGroupIds,
    employeeId
  })
});

export const addFavoriteTimelineGroup = timelineGroupIds => ({
  type: ACTION_TYPES.TIMELINE_ADD_FAVORITE_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/add-favorite-timeline-group`, {
    timelineGroupId: timelineGroupIds
  })
});

export const deleteFavoriteTimelineGroup = timelineGroupIds => ({
  type: ACTION_TYPES.TIMELINE_DELETE_FAVORITE_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/delete-favorite-timeline-group`, {
    timelineGroupId: timelineGroupIds
  })
});

export const addMemberToTimelineGroup = (param: AddMember) => ({
  type: ACTION_TYPES.TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/add-member-to-timeline-group`, param)
});

export const addRequestToTimelineGroup = timelineGroupIds => ({
  type: ACTION_TYPES.TIMELINE_ADD_REQUEST_TO_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/add-request-to-timeline-group`, {
    timelineGroupInvite: {
      timelineGroupId: timelineGroupIds
    }
  })
});

// add & delete request to join group
export const addRequestToJoinGroup = timelineGroupIds => ({
  type: ACTION_TYPES.TIMELINE_ADD_REQUEST_TO_JOIN_GROUP,
  payload: axios.post(`${baseUrl}/add-request-to-timeline-group`, {
    timelineGroupInvite: {
      timelineGroupId: timelineGroupIds
    }
  }),
  meta: {
    namespace: timelineGroupIds || 0
  }
});

export const deleteRequestToJoinGroup = (param: DeleteMemberOfTimelineGroup) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_REQUEST_TO_JOIN_GROUP,
  payload: axios.post(`${baseUrl}/delete-member-of-timeline-group`, {
    timelineGroupId: param.timelineGroupId,
    inviteId: param.inviteId,
    inviteType: param.inviteType
  }),
  meta: {
    namespace: param.timelineGroupId || 0
  }
});
// end

export const suggestTimelineGroupName = (groupName: string, searchTypeValue: number) => ({
  type: ACTION_TYPES.TIMELINE_SUGGEST_TIMELINE_GROUP_NAME,
  payload: axios.post(`${baseUrl}/suggest-timeline-group-name`, {
    timelineGroupName: groupName,
    searchType: searchTypeValue
  })
});

export const clearSuggestTimelineGroupName = () => ({
  type: ACTION_TYPES.TIMELINE_DELETE_TIMELINE_GROUP_NAME
});

export const deleteTimelineGroup = (param: number) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/delete-timeline-group`, { timelineGroupId: param })
});

export const deleteMemberOfTimelineGroup = (param: DeleteMemberOfTimelineGroup) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_MEMBER_OF_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/delete-member-of-timeline-group`, {
    timelineGroupId: param.timelineGroupId,
    inviteId: param.inviteId,
    inviteType: param.inviteType
  })
});

export const createTimelineGroup = (timelineGroupForm: any) => ({
  type: ACTION_TYPES.TIMELINE_CREATE_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/create-timeline-group`, timelineGroupForm, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
});

export const updateTimelineGroup = (timelineGroupForm: any) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/update-timeline-group`, timelineGroupForm, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
});

export const updateMemberOfTimelineGroup = (param: UpdateMemberOfTimelineGroup) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_MEMBER_OF_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/update-member-of-timeline-group`, {
    timelineGroupId: param.timelineGroupId,
    inviteId: param.inviteId,
    inviteType: param.inviteType,
    status: param.status,
    authority: param.authority
  })
});

// kien pt xu ly
export const getUserTimelinesScroll = (param: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_GET_USER_TIMELINES_SCROLL,
  payload: axios.post(`${baseUrl}/get-user-timelines`, param)
});

export const getExtTimelinesScroll = (param: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_EXT_USER_TIMELINES_SCROLL,
  payload: axios.post(`${baseUrl}/get-ext-timelines`, {
    employeeId: param.employeeId,
    serviceType: param.serviceType,
    idObject: param.idObject,
    targetDelivers: param.targetDelivers,
    limit: param.limit,
    offset: param.offset,
    filters: param.filters,
    hasLoginUser: param.hasLoginUser
  })
});

export const updateRecentlyDateClicked = (paramActionId, paramIistId) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_RECENTLY_DATE_CLICKED,
  payload: axios.post(`${baseUrl}/update-recently-date-clicked`, {
    actionType: paramActionId,
    listId: paramIistId
  })
});
// kienpt end

export const createTimeLine = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_CREATE_TIMELINE,
  payload: axios.post(`${baseUrl}/create-timeline`, param, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
});

export const getAttachedFilesScroll = (param: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_GET_ATTACHED_FILES_SCROLL,
  payload: axios.post(`${baseUrl}/get-attached-files`, {
    listType: param.listType,
    listId: param.listId,
    limit: param.limit,
    offset: param.offset,
    filters: {
      filterOptions: param.filters.filterOptions,
      isOnlyUnreadTimeline: param.filters.isOnlyUnreadTimeline
    }
  })
});

export const updateJoinRequestGroupStatus = (isJoinRequestStatus: boolean) => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_JOIN_REQUEST_GROUP_STATUS,
  payload: isJoinRequestStatus
});

export const getFavoriteTimelineGroups = () => ({
  type: ACTION_TYPES.TIMELINE_GET_FAVORITE_TIMELINE_GROUPS,
  payload: axios.post(`${baseUrl}/get-favorite-timeline-groups`, {})
});

export const getSuggestionTimeline = (
  keyWordsValue: string,
  timelineGroupIdValue: number,
  _listItemChoice: any
) => ({
  type: ACTION_TYPES.GET_SUGGESTION_TIMELINE,
  payload: axios.post(`${baseEmpUrl}/get-suggestion-timeline`, {
    keyWords: keyWordsValue,
    timelineGroupId: timelineGroupIdValue,
    offset: 0,
    listItemChoice: _listItemChoice ? _listItemChoice : []
  })
});

export const getExtTimelines = (param?: GetTimelineFormSearch) => ({
  type: ACTION_TYPES.TIMELINE_GET_EXT_TIMELINES,
  payload: axios.post(`${baseUrl}/get-ext-timelines`, {
    employeeId: param.employeeId,
    serviceType: param.serviceType,
    idObject: param.idObject,
    targetDelivers: param.targetDelivers,
    limit: 5,
    offset: param.offset,
    filters: param.filters,
    mode: param.mode,
    hasLoginUser: param.hasLoginUser
  })
});

export const getExtTimelineFilters = () => ({
  type: ACTION_TYPES.TIMELINE_GET_EXT_TIMELINE_FILTERS,
  payload: axios.post(`${baseUrl}/get-timeline-filters`, {})
});

export const updateExtTimelineFilters = typeTimelines => ({
  type: ACTION_TYPES.TIMELINE_UPDATE_EXT_TIMELINE_FILTERS,
  payload: axios.post(`${baseUrl}/update-timeline-filters`, {
    timelineType: typeTimelines
  })
});

export const deleteExtTimeline = (id: number) => ({
  type: ACTION_TYPES.TIMELINE_DELETE_TIMELINE,
  payload: axios.post(`${baseUrl}/delete-timeline`, {
    timelineId: id
  })
});

export const resetPageNumberTimeline = () => ({
  type: ACTION_TYPES.RESET_PAGE_NUMBER_TIMELINE
});

export const getFullListReaction = () => ({
  type: ACTION_TYPES.TIMELINE_GET_FULL_LIST_REACTION,
  payload: axios.get(`/content/json/timeline/emoji.json`, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const getRecentReactions = _employeeId => ({
  type: ACTION_TYPES.TIMELINE_GET_RECENT_REACTIONS,
  payload: axios.post(`${baseUrl}/get-recent-reactions`, {
    employeeId: _employeeId
  })
});

export const getTimelineGroupsDetail = (param: any) => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_DETAIL,
  payload: axios.post(`${baseUrl}/get-timeline-groups`, {
    timelineGroupIds: param.timelineGroupIds,
    sortType: param.sortType
  })
});

export const getOutTimelineGroup = (param: DeleteMemberOfTimelineGroup) => ({
  type: ACTION_TYPES.GET_OUT_TIMELINE_GROUP,
  payload: axios.post(`${baseUrl}/delete-member-of-timeline-group`, {
    timelineGroupId: param.timelineGroupId,
    inviteId: param.inviteId,
    inviteType: param.inviteType
  })
});

export const checkIsPublicGroup = (param: any) => ({
  type: ACTION_TYPES.CHECK_PUBLIC_GROUP,
  payload: axios.post(`${baseUrl}/get-timeline-groups`, {
    timelineGroupIds: param.timelineGroupIds,
    sortType: param.sortType
  })
});

export const getTimelineGroupsOfEmployeeForDetailEmp = (timelineGroupIds, employeeId?) => ({
  type: ACTION_TYPES.TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE_FOR_DETAIL_EMP,
  payload: axios.post(`${baseUrl}/get-timeline-groups-of-employee`, {
    timelineGroupId: timelineGroupIds,
    employeeId
  })
});

export const getListTimelineGroupsByIds = (param: any) => ({
  payload: axios.post(`${baseUrl}/get-timeline-groups`, {
    timelineGroupIds: param.timelineGroupIds,
    sortType: param.sortType
  })
});