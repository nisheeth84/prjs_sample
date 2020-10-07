import { apiClient } from './../../../../config/clients/api-client';
import { SERVICES_GET_BUSINESS_CARD_SUGGESTIONS } from './../../../../config/constants/api';
import { BusinessCardSuggest, BusinessCardSuggestionsPayload } from '../activity-create-edit-reducer';
/**
 * Data of getBusinessCardSuggestionsResponse
 */
export interface dataGetBusinessCardSuggestionsResponse {
  businessCards: Array<BusinessCardSuggest>
}
/**
 * Response of API getBusinessCardSuggestions
 */
export interface getBusinessCardSuggestionsResponse {
  data: dataGetBusinessCardSuggestionsResponse
  status: number
}
/**
 * API getBusinessCardSuggestions
 * @param payload 
 */
export const getBusinessCardSuggestions = async (
  payload: BusinessCardSuggestionsPayload
): Promise<getBusinessCardSuggestionsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_BUSINESS_CARD_SUGGESTIONS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}