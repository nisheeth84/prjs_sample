import { TIMELINE_API } from './../../../config/constants/api';
import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import { searchEmployeesApiUrl } from "../../../config/constants/api";

export interface TimelinePayload {
  query: string;
}
/**
 * get local  navigation
 */
export interface LocalNavigationResponse {
  localNavigation: LocalNavigation;
}
export interface LocalNavigationDataResponse {
  data: LocalNavigationResponse;
  status: number;
}
export interface LocalNavigation {
  allTimeline: number;
  myTimeline: number;
  favoriteTimeline: number;
  groupTimeline: GroupTimeline;
  departmentTimeline: Array<DepartmentTimeline>;
  customerTimeline: Array<CustomerTimeline>;
  businessCardTimeline: Array<CustomerTimeline>;
}
export interface GroupTimeline {
  joinedGroup: Array<Group>;
  favoriteGroup: Array<Group>;
  requestToJoinGroup: Array<Group>;
}
export interface DepartmentTimeline {
  departmentId: number;
  departmentName: string;
  newItem: number;
}
export interface CustomerTimeline {
  listId: number;
  listName: string;
  newItem: number;
}
export interface Group {
  groupId: number;
  groupName: string;
  newItem: number;
}
export const getLocalNavigationTimeline = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<LocalNavigationDataResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getLocalNavigation,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * get user timeline
 */
export interface Reactions {
  reactionType?: number;
  employeeId?: number;
  employeeName?: string;
  employeePhoto?: string;
}
export interface AttachedFiles {
  fileName?: string;
  filePath?: string;
}
export interface QuotedTimeline {
  timelineId?: number;
  parentId?: number;
  rootId?: number;
  createdUser?: number;
  createdUserName?: string;
  createdUserPhoto?: string;
  createdDate?: Date;
  comment?: string;
}

export interface TargetDelivers {
  targetType: number;
  targetId: number;
  targetName: string;
}
export interface ReplyTimelines {
  timelineId: number;
  parentId: number;
  rootId: number;
  createdUser: number;
  createdUserName: string;
  createdUserPhoto: string;
  createdDate: Date;
  targetDelivers: Array<TargetDelivers>;
  comment: string;
  quotedTimeline: QuotedTimeline;
  attachedFiles: Array<AttachedFiles>;
  reactions: Array<Reactions>;
  isFavorite: boolean;
}

export interface Header {
  headerType?: number;
  headerId: number;
  headerContent?: string;
}
export interface ObjectRelate {
  objectRelateType?: number;
  objectRelateData?: object;
}
export interface CommentTimelines {
  timelineId?: number;
  parentId?: number;
  rootId?: number;
  createdUser?: number;
  createdUserName?: string;
  createUserPhoto?: string;
  createdDate?: Date;
  targetDelivers?: Array<TargetDelivers>;
  comment?: string;
  quotedTimeline?: QuotedTimeline;
  attachedFiles?: Array<AttachedFiles>;
  reactions?: Array<Reactions>;
  isFavorite: boolean;
  replyTimelines?: Array<ReplyTimelines>;
}
export interface SharedTimeline {
  timelineId?: number;
  parentId?: number;
  rootId?: number;
  createdUser?: number;
  createdUserName?: string;
  createdUserPhoto?: string;
  createdDate?: Date;
  timelineGroupId?: number;
  timelineGroupName?: string;
  imagePath?: string;
  header?: Header;
  objectRelate?: ObjectRelate;
  comment?: string;
}
export interface Timelines {
  timelineId: number;
  parentId: number;
  rootId: number;
  timelineType: number;
  createdUser: number;
  createdUserName: string;
  createdUserPhoto: string;
  createdDate: Date;
  changedDate: Date;
  timelineGroupId: number;
  timelineGroupName: string;
  color?: string;
  imagePath?: string;
  header: Header;
  objectRelate?: ObjectRelate;
  comment?: string;
  sharedTimeline?: SharedTimeline;
  attachedFiles?: Array<AttachedFiles>;
  reactions?: Reactions;
  isFavorite?: boolean;
  commentTimelines?: Array<CommentTimelines>;
}

export interface UserTimelineResponse {
  timelines: Array<Timelines>;
}
export interface UserTimelineDataResponse {
  data: UserTimelineResponse;
  status: number;
}
export const getUserTimelines = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UserTimelineDataResponse> => {
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
