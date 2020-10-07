import { AxiosRequestConfig } from 'axios';
import { TIMELINE_API, timelinesUrl } from "../../../config/constants/api";
import { apiClient } from '../../../config/clients/api-client';

export interface TimelineFiltersPayload {
  timelineType: Array<number>;
}

export interface TimelineFiltersDataResponse {
  employeeId: number;
  timelineType: number;
}

export interface TimelineFiltersResponse {
  data: Array<TimelineFiltersDataResponse>;
  status: number;
}

/**
 * Call api updateTimelineFilters
 * @param payload
 * @param config
 */

export const updateTimelineFilters = async (
  payload: TimelineFiltersPayload,
  config?: AxiosRequestConfig
): Promise<TimelineFiltersResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.updateTimelineFiltersUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
