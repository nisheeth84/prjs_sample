import { apiClient } from "../../config/clients/api-client";
import { SERVICE_GET_TIMEZONES, SERVICE_GET_LANGUAGES } from "../../config/constants/api";

/**
 * Define interface TimezoneResponses
 */
export interface TimezoneResponses {
  data: any;
  status: number;
}

/**
 * Define interface call API getTimezones
 */
export const getTimezones = async (
  ): Promise<TimezoneResponses> => {
    try {
      return await apiClient.post(SERVICE_GET_TIMEZONES, {});
    } catch (error) {
      return error.ressponse;
    }
  }

/**
 * Define interface LanguageResponses
 */
export interface LanguageResponses {
  data: any;
  status: number;
}

/**
 * Define interface call API getLanguages
 */
export const getLanguages = async (
  ): Promise<LanguageResponses> => {
    try {
      return await apiClient.post(SERVICE_GET_LANGUAGES, {});
    } catch (error) {
      return error.ressponse;
    }
  }
