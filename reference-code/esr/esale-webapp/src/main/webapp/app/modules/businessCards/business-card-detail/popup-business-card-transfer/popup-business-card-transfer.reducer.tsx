import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';

export const ACTION_TYPES = {
  UPDATE_BUSINESS_CARDS: `businessCardTranfer/UPDATE_BUSINESS_CARDS`,
  RESET_UPDATE_MODAL: 'businessCardTranfer/RESET',
};

export enum BusinessCardTranferAction {
  None,
  Request,
  Error,
  Success
}


const initialState = {
  action: BusinessCardTranferAction.None,
  errorMessage: null,
  successMessage: null,
  listOfBusinessCardId: null
};

const businessCardsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;

const parseupdateBusinessCards = res => {
  let listOfBusinessCardId = null;
  if (res.data && res.data.listOfBusinessCardId && res.data.listOfBusinessCardId.length > 0) {
    listOfBusinessCardId = res.data.listOfBusinessCardId;
  }
  return { listOfBusinessCardId };
};

const parseErrorResponse = payload => payload?.response?.data?.parameters?.extensions?.errors

export type BusinessCardTranferState = Readonly<typeof initialState>;

// Reducer
export default (state: BusinessCardTranferState = initialState, action): BusinessCardTranferState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_BUSINESS_CARDS):
      {
        return {
          ...state,
          action: BusinessCardTranferAction.Request,
          errorMessage: null
        };
      }
    case SUCCESS(ACTION_TYPES.UPDATE_BUSINESS_CARDS): {
      const res = parseupdateBusinessCards(action.payload);
      return {
        ...state,
        action: BusinessCardTranferAction.Success,
        errorMessage: null,
        listOfBusinessCardId: res.listOfBusinessCardId
      };
    }
    case FAILURE(ACTION_TYPES.UPDATE_BUSINESS_CARDS):
      return {
        ...state,
        action: BusinessCardTranferAction.Error,
        errorMessage: parseErrorResponse(action.payload),
        listOfBusinessCardId: null
      };
    case ACTION_TYPES.RESET_UPDATE_MODAL:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const updateBusinessCards = (data) => async dispatch => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  await dispatch({
    type: ACTION_TYPES.UPDATE_BUSINESS_CARDS,
    payload: axios.post(
      `${businessCardsApiUrl}/update-business-cards`,
      formData,
      { headers: { ['Content-Type']: 'multipart/form-data' } }
    )
  });
};

/**
 * reset all
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET_UPDATE_MODAL
});

