import { apiClient } from '../../../../config/clients/api-client';
import {  getEmployeeSuggestion } from '../../../../config/constants/api';
import { EmployeeSuggestionResponse } from '../control-field/interface/employee-suggest-interface';

export interface ListItemChoice {
  idChoice : number;
  searchType: number;
}
export interface EmployeeSuggestionsPayLoad {
  offSet : number;
  keyWords : string;
  searchType : any;
  listItemChoice : ListItemChoice[];
  endTime: string;
  limit: number;
  startTime: string;
  relationFieldI : any;
}
/**
 * Define function call API get data 
 */
export const getEmployeeSuggestions = async (
  payload : EmployeeSuggestionsPayLoad
  ): Promise<EmployeeSuggestionResponse> => {
    try {
      const response = await apiClient.post(
        getEmployeeSuggestion,
        {
          searchType: payload.searchType,
          offSet : payload.offSet,
          endTime: payload.endTime,
          keyWords : payload.keyWords,
          limit: payload.limit,
          startTime : payload.startTime,
          listItemChoice : payload.listItemChoice,
          relationFieldI : payload.relationFieldI
        },
      );
      return response;
    } catch (error) {
      return error.response;
    }
  };