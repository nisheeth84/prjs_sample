import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { SHOW_MESSAGE_SUCCESS } from '../constants';

export const ACTION_TYPES = {
  GET_LIST_SUGGESTIONS: 'customer/GET_LIST_SUGGESTIONS',
  MOVE_CUSTOMERS_TO_OTHER_LIST: 'customer/MOVE_CUSTOMERS_TO_OTHER_LIST',
  ADD_CUSTOMERS_TO_LIST: 'customer/ADD_CUSTOMERS_TO_LIST',
  RESET_POPUP_MOVE_TO_LIST: 'customer/RESET_POPUP_MOVE_TO_LIST',
  RESET_POPUP_ADD_TO_LIST: 'customer/RESET_POPUP_ADD_TO_LIST'
};

export enum ListOperationAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: ListOperationAction.None,
  errorMessage: null,
  errorItems: null,
  listInfo: null,
  customerListMemberIds: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE }
};

/**
 * parse response data of API moveCustomersToOtherList and addCustomersToList
 * @param res
 */
const parseAddMoveCustomers = res => {
  let customerListMemberIds = [];
  if (res) {
    customerListMemberIds = res.customerListMemberIds;
  }
  return { customerListMemberIds };
};

export type ListOperationState = Readonly<typeof initialState>;

/**
 * reducer
 */
export default (state: ListOperationState = initialState, action): ListOperationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_LIST_SUGGESTIONS):
    case REQUEST(ACTION_TYPES.MOVE_CUSTOMERS_TO_OTHER_LIST):
    case REQUEST(ACTION_TYPES.ADD_CUSTOMERS_TO_LIST):
      return {
        ...state,
        action: ListOperationAction.Request
      };
    case FAILURE(ACTION_TYPES.GET_LIST_SUGGESTIONS):
    case FAILURE(ACTION_TYPES.MOVE_CUSTOMERS_TO_OTHER_LIST):
    case FAILURE(ACTION_TYPES.ADD_CUSTOMERS_TO_LIST):
      return {
        ...state,
        action: ListOperationAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    // case ACTION_TYPES.GET_LIST_SUGGESTIONS:
    case SUCCESS(ACTION_TYPES.GET_LIST_SUGGESTIONS): {
      return {
        ...state,
        // action: ListOperationAction.Success,
        listInfo:
          action.payload.data &&
          action.payload.data.listInfo &&
          action.payload.data.listInfo.sort((a, b) => a.customerListId - b.customerListId)
      };
    }
    case SUCCESS(ACTION_TYPES.MOVE_CUSTOMERS_TO_OTHER_LIST):
    case SUCCESS(ACTION_TYPES.ADD_CUSTOMERS_TO_LIST): {
      const res = parseAddMoveCustomers(action.payload.data);
      return {
        ...state,
        action: ListOperationAction.Success,
        customerListMemberIds: res.customerListMemberIds,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case ACTION_TYPES.RESET_POPUP_MOVE_TO_LIST:
    case ACTION_TYPES.RESET_POPUP_ADD_TO_LIST:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

/**
 * call axios to getListSuggestions
 * @param searchValue key word to suggest list name
 */
export const getListSuggestions = searchValue => ({
  type: ACTION_TYPES.GET_LIST_SUGGESTIONS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-list-suggestions`,
    { searchValue },
    { headers: { ['Content-Type']: 'application/json' } }
  )
  // payload: {
  //   data: DUMMY_GET_LIST_SUGGESTIONS
  // }
});

/**
 * handleGetListSuggestions
 * @param searchValue key word to suggest list name
 */
export const handleGetListSuggestions = searchValue => async dispatch => {
  await dispatch(getListSuggestions(searchValue));
};

/**
 * call axios to moveCustomersToOtherList
 * @param sourceListId id of source list
 * @param destListId id of destination list
 * @param customerIds list ids of customers selected
 */
export const moveCustomersToOtherList = (sourceListId, destListId, customerIds) => ({
  type: ACTION_TYPES.MOVE_CUSTOMERS_TO_OTHER_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/move-customers-to-other-list`,
    { sourceListId, destListId, customerIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * handleMoveCustomersToOtherList
 * @param sourceListId id of source list
 * @param destListId id of destination list
 * @param customerIds list ids of customers selected
 */
export const handleMoveCustomersToOtherList = (
  sourceListId,
  destListId,
  customerIds
) => async dispatch => {
  await dispatch(moveCustomersToOtherList(sourceListId, destListId, customerIds));
};

/**
 * call axios to addCustomersToList
 * @param customerListId id of destination list
 * @param customerIds list ids of customers selected
 */
export const addCustomersToList = (customerListId, customerIds) => ({
  type: ACTION_TYPES.ADD_CUSTOMERS_TO_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/add-customers-to-list`,
    { customerListId, customerIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * handleAddCustomersToList
 * @param customerListId id of destination list
 * @param customerIds list ids of customers selected
 */
export const handleAddCustomersToList = (customerListId, customerIds) => async dispatch => {
  await dispatch(addCustomersToList(customerListId, customerIds));
};

/**
 * reset popup MoveToList
 */
export const resetPopupMoveToList = () => ({
  type: ACTION_TYPES.RESET_POPUP_MOVE_TO_LIST
});

/**
 * reset popup AddToList
 */
export const resetPopupAddToList = () => ({
  type: ACTION_TYPES.RESET_POPUP_ADD_TO_LIST
});
