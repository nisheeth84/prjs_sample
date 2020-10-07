import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { SHOW_MESSAGE } from '../constants';
import { parseErrorRespose } from 'app/modules/businessCards/shared-list/shared-list.reducer';

export enum MoveListAction {
  None,
  Request,
  Error,
  Success,
  GetListSuccess,
  DragDropSuccess
}

const initialState = {
  action: MoveListAction.None,
  errorMessage: null,
  successMessage: null,
  listInfo: null,
  listSuggestions: {
    listInfo: null,
    metaValue: null
  }
};

export const ACTION_TYPES = {
  GET_BUSINESS_CARD_LIST: 'moveList/GET_BUSINESS_CARD_LIST',
  DRAG_DROP_BUSINESS_CARD: 'moveList/DRAG_DROP_BUSINESS_CARD',
  RESET: 'moveList/RESET',
  SUGGEST_LIST: 'moveList/SUGGEST_LIST'
};

const parseGetListResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? MoveListAction.Error : MoveListAction.GetListSuccess;
  const listInfo = res.data.listInfo;
  return { errorMsg, action, listInfo };
};

export type MoveListBusinessCardState = Readonly<typeof initialState>;

export default (
  state: MoveListBusinessCardState = initialState,
  action
): MoveListBusinessCardState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_BUSINESS_CARD_LIST):
    case REQUEST(ACTION_TYPES.DRAG_DROP_BUSINESS_CARD):
    case REQUEST(ACTION_TYPES.SUGGEST_LIST):
      return {
        ...state,
        action: MoveListAction.Request,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_BUSINESS_CARD_LIST):
    case FAILURE(ACTION_TYPES.DRAG_DROP_BUSINESS_CARD):
    case FAILURE(ACTION_TYPES.SUGGEST_LIST): {
      const resData = parseErrorRespose(action.payload);
      return {
        ...state,
        action: MoveListAction.Error,
        errorMessage: resData[0].errorCode
          ? 'messages.' + resData[0].errorCode
          : action.payload.message,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_BUSINESS_CARD_LIST): {
      const res = parseGetListResponse(action.payload);
      return {
        ...state,
        action: res.action,
        listInfo: res.listInfo
      };
    }
    case SUCCESS(ACTION_TYPES.DRAG_DROP_BUSINESS_CARD): {
      return {
        ...state,
        action: MoveListAction.Success,
        successMessage: { successId: SHOW_MESSAGE.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.SUGGEST_LIST): {
      return {
        ...state,
        listSuggestions: {
          listInfo: action.payload.data.listInfo,
          metaValue: action.meta.searchValue
        }
      };
    }
    case ACTION_TYPES.RESET: {
      return {
        ...state,
        action: MoveListAction.None,
        errorMessage: null,
        successMessage: null,
        listInfo: null,
        listSuggestions: {
          listInfo: null,
          metaValue: null
        }
      };
    }
    default:
      return state;
  }
};

export const getBusinessCardList = (idOfList, mode) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_BUSINESS_CARD_LIST,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card-list`,
      {
        idOfList,
        mode
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const dragDropBusinessCard = (
  listOfBusinessCardId,
  idOfNewList,
  idOfOldList
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.DRAG_DROP_BUSINESS_CARD,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/drag-drop-business-card`,
      {
        listOfBusinessCardId,
        idOfNewList,
        idOfOldList
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});

const getListSuggestions = searchValue => ({
  type: ACTION_TYPES.SUGGEST_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-list-suggestions`,
    { searchValue },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { searchValue }
});

export const handleGetListSuggestions = searchValue => async dispatch => {
  await dispatch(getListSuggestions(searchValue));
};
