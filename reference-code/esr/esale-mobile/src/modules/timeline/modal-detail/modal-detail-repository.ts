import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import { searchEmployeesApiUrl, TIMELINE_API } from "../../../config/constants/api";

export interface TimelineByIdPayload {
  timelineId: number;
}

export interface TimelineDataResponse {
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

export interface TimelineResponse {
  data: TimelineDataResponse;
  status: number;
}

export const getTimelineById = async (
  payload: TimelineByIdPayload,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getTimelineById,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
