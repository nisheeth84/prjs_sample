import { apiClient } from '../../../config/clients/api-client';
import {InitializeListModalResspone} from "./customer-my-list-ressponse-interfaces";
import{CreateMyListDataRessponse, UpdateMyListDataRessponse} from "./customer-my-list-create-update-interfaces"

/**
 * Difne payload
 */
export interface myListPayload{}
const getInitializeListModal = '/services/customers/api/get-initialize-list-modal';
/**
 * Define function initializeListModalSuggestion call API initializeListModal get data resssponse
 */
 export const initializeListModalSuggestion = async (
   payload: myListPayload): Promise<InitializeListModalResspone> =>{
     try{
      const response = await apiClient.post(
        getInitializeListModal,
        payload
      );
      return response;
     } catch(error){
       return error.resssponse;
     }
   }
   const createList = '/services/customers/api/create-list';
   /**
    * Define function createMyListSuggestion call API createList
    * @param payload
    */
 export const createMyListSuggestion  = async(
   payload: myListPayload,
 ): Promise<CreateMyListDataRessponse> => {
   try {
     const response = await apiClient.post(createList, payload);
     return response;
   } catch (error) {
     return error.response;
   }
 }

 const updateList = '/services/customers/api/update-list';
 /**
  * Define function updateMyListSuggestion call to API updateList
  * @param payload 
  * @param config 
  */
export const updateMyListSuggestion = async(
  payload: myListPayload,
): Promise<UpdateMyListDataRessponse> => {
  try {
    const response = await apiClient.post(
      updateList,
      payload
    )
    return response;
  } catch (error) {
    return error.response;
  }
}