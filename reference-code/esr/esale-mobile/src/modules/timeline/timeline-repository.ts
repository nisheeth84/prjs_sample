import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import {
  TIMELINE_API,
  timelinesUrl,
  shareTimelineApiUrl,
  getEmployeesSuggestionApiUrl
} from "../../config/constants/api";

export interface TimelinePayload {
  shareTimelineId: number;
  targetDelivers: Array<any>;
  textComment: string;
  sharedContent: string;
  attachedFiles?: any;
}

export interface ShareTimelineDataResponse {
  timelineId: number;
}
export interface ShareTimelineResponse {
  data: ShareTimelineDataResponse;
  status: number;
}
export const createShareTimeline = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ShareTimelineResponse> => {
  try {
    const response = await apiClient.post(shareTimelineApiUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GeneralPayload {
  query: string;
}

export interface SuggestionTimelineGroupNameDataDataResponse {
  timelineGroupId: number;
  timelineGroupName: string;
  imagePath: string;
}

export interface SuggestionTimelineGroupNameDataResponse {
  data: SuggestionTimelineGroupNameDataDataResponse[];
}

export interface SuggestionTimelineGroupNameResponse {
  data: SuggestionTimelineGroupNameDataResponse;
  status: number;
}

/**
 * Call api suggestTimelineGroupName
 * @param payload
 * @param config
 */
export const suggestTimelineGroupName = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<SuggestionTimelineGroupNameResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.suggestTimelineGroupNameUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api getTimelineGroups
export interface GetTimelineGroupsDataDataResponse {
  timelineGroupId: number;
  timelineGroupName: string;
  comment: string;
  createdDate: string;
  isPublic: boolean;
  isApproval: boolean;
  color: string;
  imagePath: string;
  imageName: string;
  width: number;
  height: number;
  changedDate: string;
  invites: Array<{
    inviteId: number;
    inviteType: number;
    inviteName: string;
    inviteImagePath: string;
    department: {
      parentId: number;
      parentName: string;
      employeeId: Array<number>;
      employeeName: Array<string>;
    };
    employee: {
      departmentName: string;
      positionName: string;
      employeeSurNameKana: string;
      employeeNameKana: string;
      cellPhoneNumber: string;
      telePhoneNumber: string;
      email: string;
    };
    status: number;
    authority: number;
  }>;
}

export interface GetTimelineGroupPayload {
  timelineGroupIds?: number[];
  sortType?: number;
}
export interface GetTimelineGroupsDataResponse {
  timelineGroup: GetTimelineGroupsDataDataResponse[];
}

export interface GetTimelineGroupsResponse {
  data: GetTimelineGroupsDataResponse;
  status: number;
}

/**
 * Call api getTimelineGroups
 * @param payload
 * @param config
 */
export const getTimelineGroups = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetTimelineGroupsResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getTimelineGroups,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api getUserTimelines
export interface GetUserTimelinesDataDataResponse {
  timelineId: number;
  parentId: number;
  rootId: number;
  timelineType: number;
  createdUser: number;
  createdUserName: string;
  createdUserPhoto: string;
  createdDate: string;
  changedDate: string;
  timelineGroupId: number;
  timelineGroupName: string;
  color: string;
  imagePath: string;
  header: {
    headerType: number;
    headerId: number;
    headerContent: string;
  };
  comment: string;
  sharedTimeline: {
    timelineId: number;
    parentId: number;
    rootId: number;
    timelineType: number;
    createdUser: number;
    createdUserName: string;
    createdUserPhoto: string;
    createdDate: string;
    changedDate: string;
    timelineGroupId: number;
    timelineGroupName: string;
    color: string;
    imagePath: string;
    header: {
      headerType: number;
      headerId: number;
      headerContent: string;
    };
    comment: string;
  };
  attachedFiles: Array<{
    fileName: string;
    filePath: string;
  }>;
  reactions: Array<{
    reactionType: number;
    employeeId: number;
    employeeName: string;
    employeePhoto: string;
  }>;
  isFavorite: boolean;
  commentTimelines: Array<{
    timelineId: number;
    parentId: number;
    rootId: number;
    timelineType: number;
    createdUser: number;
    createdUserName: string;
    createdUserPhoto: string;
    createdDate: string;
    targetDelivers: Array<{
      targetType: number;
      targetId: number;
      targetName: string;
    }>;
    comment: string;
    quotedTimeline: {
      timelineId: number;
      parentId: number;
      rootId: number;
      comment: string;
    };
    attachedFiles: Array<{
      fileName: string;
      filePath: string;
    }>;
    reactions: Array<{
      reactionType: number;
      employeeId: number;
      employeeName: string;
      employeePhoto: string;
    }>;
    isFavorite: boolean;
    replyTimelines: Array<{
      timelineId: number;
      parentId: number;
      rootId: number;
      timelineType: number;
      createdUser: number;
      createdUserName: string;
      createdUserPhoto: string;
      createdDate: string;
      targetDelivers: Array<{
        targetType: number;
        targetId: number;
        targetName: string;
      }>;
      comment: string;
      quotedTimeline: {
        timelineId: number;
        parentId: number;
        rootId: number;
        comment: string;
      };
      attachedFiles: Array<{
        fileName: string;
        filePath: string;
      }>;
      reactions: Array<{
        reactionType: number;
        employeeId: number;
        employeeName: string;
        employeePhoto: string;
      }>;
      isFavorite: boolean;
    }>;
  }>;
}

export interface GetUserTimelinesDataResponse {
  timelines: GetUserTimelinesDataDataResponse[];
}

export interface GetUserTimelinesResponse {
  data: GetUserTimelinesDataResponse;
  status: number;
}

/**
 * Call api getUserTimelines
 * @param payload
 * @param config
 */
export const getUserTimelines = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetUserTimelinesResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getUserTimelineUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api timelineGroup
export interface GetTimelineGroupsOfEmployeeDataDataResponse {
  timelineGroupId: number;
  timelineGroupName: string;
  imagePath: string;
  inviteId: number;
  inviteType: number;
  status: number;
  authority: number;
}

export interface GetTimelineGroupsOfEmployeePayload {
  timelineGroupId: any;
  employeeId?: any;
}
export interface GetTimelineGroupsOfEmployeeDataResponse {
  dataGetTimelineGroupsOfEmployee:
  | {
    timelineGroupId: number;
    timelineGroupName: string;
    imagePath: string;
    inviteId: number;
    inviteType: number;
    status: number;
    authority: number;
  }[]
  | null;
  timelineGroup: GetTimelineGroupsOfEmployeeDataDataResponse[] | null;
}

export interface GetTimelineGroupsOfEmployeeResponse {
  data: GetTimelineGroupsOfEmployeeDataResponse;
  status: number;
}

/**
 * Call api getTimelineGroupsOfEmployee
 * @param payload
 * @param config
 */
export const getTimelineGroupsOfEmployee = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetTimelineGroupsOfEmployeeResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getTimelineGroupsOfEmployeeUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface ReactionPayload {
  query: string;
}

export interface Reaction {
  reactionType: number;
  employees: Array<any>;
}

export interface ReactionInfo {
  timelineId: number;
  reactionType: number;
  employeeId: number;
  employeeName: string;
  employeeImagePath: string;
}

export interface UpdateTimelineReactionDataInfo {
  reactionInfo: ReactionInfo;
}

export interface UpdateTimelineReactionInfoResponse {
  dataInfo: UpdateTimelineReactionDataInfo;
}

export interface UpdateTimelineReactionDataDataResponse {
  updateTimelineReaction: UpdateTimelineReactionInfoResponse;
}

export interface UpdateTimelineReactionDataResponse {
  data: UpdateTimelineReactionDataDataResponse;
}

export interface UpdateTimelineReactionResponse {
  data: UpdateTimelineReactionDataResponse;
  status: number;
}

interface UpdateMemberOfTimelineGroupPayload {
  timelineGroupId: number;
  inviteId: number;
  inviteType: number;
  status: number;
  authority: number;
}

interface UpdateMemberOfTimelineGroupDataResponse {
  timelineGroupId: number;
  inviteId: number;
}
export interface UpdateMemberOfTimelineGroupResponse {
  data: UpdateMemberOfTimelineGroupDataResponse;
  status: number;
}

/**
 * Call api update Member Of Timeline Group
 * @param payload
 * @param config
 */
export const updateMemberOfTimelineGroup = async (
  payload: UpdateMemberOfTimelineGroupPayload,
  config?: AxiosRequestConfig
): Promise<UpdateMemberOfTimelineGroupResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.updateMemberOfTimelineGroup, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * Update timeline reaction
 * @param payload
 * @param config
 */
export const updateTimelineReaction = async (
  payload: ReactionPayload,
  config?: AxiosRequestConfig
): Promise<UpdateTimelineReactionResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.updateTimelineReactionUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};


// get api getLocalNavigation
export interface NavigationPayload {
  query: string;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  newItem: number;
}

export interface Customer {
  listId: number;
  listName: string;
  newItem: number;
}

export interface BusinessCardTimeline {
  listId: number;
  listName: string;
  newItem: number;
}

export interface TypeGroup {
  groupId: number;
  groupName: string;
  newItem: number;
}

export interface GroupTimeline {
  joinedGroup: Array<TypeGroup>;
  favoriteGroup: Array<TypeGroup>;
  requestToJoinGroup: Array<TypeGroup>;
}

export interface LocalNavigationDataResponse {
  allTimeline: number;
  myTimeline: number;
  favoriteTimeline: number;
  groupTimeline: GroupTimeline;
  departmentTimeline: Array<Department>;
  customerTimeline: Array<Customer>;
  businessCardTimeline: Array<BusinessCardTimeline>;
}

export interface AddMemberToTimelineGroupPayload {
  timelineGroupInvites: [{
    timelineGroupId: number;
    inviteId: number;
    inviteType: number;
    status: number;
    authority: number;
  }],
  content: string
}

export interface LocalNavigationResponse {
  data: LocalNavigationDataResponse;
  status: number;
}

// api addMemberToTimelineGroup
export interface AddMemberToTimelineGroupResponse {
  data: {
    timelineGroupInviteIds: Array<number>;
  };
  status: number;
}

/**
 * call api addMemberToTimelineGroup
 * @param payload
 * @param config
 */
export const addMemberToTimelineGroup = async (
  payload: AddMemberToTimelineGroupPayload,
  config?: AxiosRequestConfig
): Promise<AddMemberToTimelineGroupResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.addMemberToTimelineGroupUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * Call api getLocalNavigation
 * @param payload
 * @param config
 */

export const getLocalNavigation = async (
  payload: NavigationPayload,
  config?: AxiosRequestConfig
): Promise<LocalNavigationResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.getLocalNavigation, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface AttachedFilesPayload {
  listType: number;
  listId: number | any;
  limit: number;
  offset: number;
  filters: {
    filterOptions: Array<number>;
    isOnlyUnreadTimeline: boolean;
  };
}

export interface AttachedFiles {
  filePath: string;
  fileName: string;
}

export interface AttachedFilesDataResponse {
  timelineId: number;
  createdUserName: string;
  createdDate: Date;
  attachedFiles: Array<AttachedFiles>;
}

export interface AttachedFilesResponse {
  data: AttachedFilesDataResponse;
  status: number;
}

/**
 * Call api getAttachedFiles
 * @param payload
 * @param config
 */

export const getAttachedFiles = async (
  payload: AttachedFilesPayload,
  config?: AxiosRequestConfig
): Promise<AttachedFilesResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getAttachedFilesUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CreateTimelinePayload {
  query: string;
}

export interface CreateTimelineDataResponse {
  timelineId: number;
}

export interface CreateTimelineResponse {
  data: CreateTimelineDataResponse;
  status: number;
}

/**
 * Call api createTimeline
 * @param payload
 * @param config
 */

export const createTimeline = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CreateTimelineResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.createTimelineUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CreateCommentPayload {
  query: string;
}

export interface CreateCommentDataResponse {
  timelineId: number;
}
export interface CreateCommentResponse {
  data: CreateCommentDataResponse;
  status: number;
}
/**
 * Call api createCommentAndReply
 * @param payload
 * @param config
 */

export const createCommentAndReply = async (
  payload: CreateCommentPayload | any,
  config?: AxiosRequestConfig
): Promise<CreateCommentResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.createCommentAndReplyUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface RecentReactionsPayload {
  query: string;
}

export interface RecentReactionsDataResponse {
  timelineId: number;
}

export interface RecentReactionsResponse {
  data: RecentReactionsDataResponse;
  status: number;
}

/**
 * Call api getRecentReactions
 * @param payload
 * @param config
 */

export const getRecentReactions = async (
  payload: CreateCommentPayload,
  config?: AxiosRequestConfig
): Promise<RecentReactionsResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.getRecentReactionsUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface DeleteTimelinePayload {
  query: string;
}

export interface DeleteTimelineDataResponse {
  timelineId: Array<number>;
}

export interface DeleteTimelineResponse {
  data: DeleteTimelineDataResponse;
  status: number;
}

/**
 * Call api deleteTimeline
 * @param payload
 * @param config
 */

export const deleteTimeline = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<DeleteTimelineResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.deleteTimelineUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteFollowed = async (
  //   payload: BusinessCardPayload,
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.deleteFollowedUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface TimelineFiltersPayload {
  employeeId: number | any;
}
export interface TimelineFilters {
  employeeId: number;
  timelineType: number;
}

export interface GetTimelineFiltersDataResponse {
  timelineFilters: Array<TimelineFilters> | any;
}

export interface GetTimelineFiltersResponse {
  data: GetTimelineFiltersDataResponse;
  status: number;
}
/**
 * Call api getTimelineFilters
 * @param payload
 * @param config
 */

export const getTimelineFilters = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetTimelineFiltersResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getTimelineFiltersUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface TimelineFavoritePayload {
  timelineId: number;
  rootId: number;
}

export interface TimelineFavoriteDataResponse {
  timelineId: number;
  status: number;
}

export interface TimelineFavoriteResponse {
  data: TimelineFavoriteDataResponse;
  status: number;
}

/**
 * Call api updateTimelineFavorite
 * @param payload
 * @param config
 */

export const updateTimelineFavorite = async (
  payload: TimelineFavoritePayload,
  config?: AxiosRequestConfig
): Promise<TimelineFavoriteResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.updateTimelineFavoriteUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CommentAndRepliesDataResponse {
  createdUser: Array<{
    createdUserId: number;
    createdUserName: string;
    createdUserImage: string;
  }>;
  createdDate: string;
  timelineId: number;
  parentId: number;
  rootId: number;
  targerDelivers: Array<{
    targetType: number;
    targetId: number;
    targetName: string;
  }>;
  comment: string;
  sharedTimeline: {
    createdUser: {
      createdUserId: number;
      createdUserName: string;
      createdUserImage: string;
    };
    createdDate: string;
    sharedTimelineId: number;
    header: {
      headerId: number;
      headerName: Array<string>;
      relate: Array<string>;
    };
  };
  attachedFiles: Array<{
    filePath: string;
    fileName: string;
  }>;
  reactions: Array<{
    reaction_type: 1;
    employees: Array<{
      employeeId: number;
      employeeName: string;
      employeeImagePath: string;
    }>;
  }>;
  isStar: boolean;
  replyCount: number;
}

export interface CommentAndRepliesResponse {
  data: Array<CommentAndRepliesDataResponse>;
  status: number;
}

export interface CommentAndRepliesPayload {
  query: string;
}

/**
 * Call api getCommentAndReplies
 * @param payload
 * @param config
 */

export const getCommentAndReplies = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CommentAndRepliesResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getCommentAndRepliesUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetFavoriteTimelineGroupsDataResponse {
  timelineGroupIds: Array<number>;
}

export interface GetFavoriteTimelineGroupsResponse {
  data: GetFavoriteTimelineGroupsDataResponse;
  status: number;
}

export const getFavoriteTimelineGroups = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetFavoriteTimelineGroupsResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getFavoriteTimelineGroupUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface FavoriteTimelineGroupDataResponse {
  timelineGroupFavoriteId: number;
}

export interface FavoriteTimelineGroupResponse {
  data: FavoriteTimelineGroupDataResponse;
  status: number;
}

export const addTimelineFavoriteGroup = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<FavoriteTimelineGroupResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.addFavoriteTimelineGroupUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api updateTimelineFavorite
 * @param payload
 * @param config
 */

export const deleteTimelineFavoriteGroup = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<FavoriteTimelineGroupResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.deleteFavoriteTimelineGroupUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface AddRequestTimelineGroupPayload {
  timelineGroupInvite: {
    timelineGroupId: number;
    employeeId: number;
  };
}

/**
 * Call api updateTimelineFavorite
 * @param payload
 * @param config
 */

export const addRequestToTimelineGroup = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<FavoriteTimelineGroupResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.addRequestToTimelineGroupUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api delete member of timeline group
 * @param payload
 * @param config
 */
export const deleteMemberOfTimelineGroup = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(TIMELINE_API.deleteMemberOfTimelineGroup, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define EmployeeSuggestion Payload
 */
export interface EmployeeSuggestionPayload {
  keyWords?: string,
  startTime?: string,
  endTime?: string,
  searchType?: number | null,
  offSet?: number,
  limit?: number,
  listItemChoice?: {
    idChoice: number,
    searchType: number
  }[],
  relationFieldId?: number
}

/**
 * Define values of employees
 */
export interface Employees {
  employeeId: number,// data mapping response
  employeeIcon: {
    fileName: string,// data mapping response
    filePath: string,// data mapping response
    fileUrl: string,// data mapping response
  },
  employeeSurname: string,// data mapping response
  employeeName: string,// data mapping response
  employeeSurnameKana: string,// data mapping response
  employeeNameKana: string,// data mapping response
  employeeDepartments: {
    departmentId: number,// data mapping response
    departmentName: string,// data mapping response
    positionId: string,// data mapping response
    positionName: string,// data mapping response
  }[],
  isBusy: boolean,
  idHistoryChoice?: number
}

/**
 * Define values of milestone
 */
export interface Departments {
  departmentId: number,// data mapping response
  departmentName: string,// data mapping response
  parentDepartment: {
    departmentId: number,// data mapping response
    departmentName: string,// data mapping response
  },
  employeesDepartments: {
    employeeId: number,// data mapping response
    photoFileName: string,// data mapping response
    photoFilePath: string,// data mapping response
    employeeSurname: string,// data mapping response
    employeeName: string,// data mapping response
    employeeSurnameKana: string,// data mapping response
    employeeNameKana: string,// data mapping response
  }[],
  idHistoryChoice?: number
}


/**
 * Define values of employees
 */
export interface Groups {
  groupId: number,// data mapping response
  groupName: string,// data mapping response
  employeesGroups: {
    employeeName: string,// data mapping response
    employeeId: number,// data mapping response
    employeeSurname: string// data mapping response
  }[],
  idHistoryChoice?: number
}

/**
 * Define values of employees
 */
export interface EmployeeSuggest {
  departments: Array<Departments>,// data mapping response
  employees: Array<Employees>,// data mapping response
  groups: Array<Groups>,// data mapping response
}

/**
 * Define structure values of data api
 */
export interface EmployeeSuggestionResponse {
  data: EmployeeSuggest;// list data form response
  status: number;// status off response
}

/**
 * Define function call API get data response
 */
export const getEmployeesSuggestion = async (
  payload: EmployeeSuggestionPayload,
): Promise<EmployeeSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      getEmployeesSuggestionApiUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface DeleteTimelineGroupPayload {
  timelineGroupId: number;
}


/**
 * Define function deleteTimelineGroup 
 */
export const deleteTimelineGroup = async (
  payload: DeleteTimelineGroupPayload,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.deleteTimelineGroupsUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};


/**
 * Define function update TimelineGroup 
 */
export const updateTimelineGroup = async (
  payload: any,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.updateTimelineGroupUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define function getSuggestionTimeline 
 */
export const getSuggestionTimeline = async (
  payload: any,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getSuggestionTimeline,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
