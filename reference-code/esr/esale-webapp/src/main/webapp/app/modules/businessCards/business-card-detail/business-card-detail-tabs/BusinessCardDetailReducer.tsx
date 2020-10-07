import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import axios from 'axios';

export enum GetBusinessCardDetailAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  GET_BUSINESS_CARD_DETAIL_BY_TYPE: 'businessCardDetailByType/GET',
};

const initialState = {
  businessCardDetailBy: {},
  errorCode: null,
  errorItems: null,
  action: GetBusinessCardDetailAction.None,
};

export type BusinessCardDetailByState = Readonly<typeof initialState>;

export default (state: BusinessCardDetailByState = initialState, action): BusinessCardDetailByState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_BUSINESS_CARD_DETAIL_BY_TYPE): {
      return {
        ...state,
        action: GetBusinessCardDetailAction.Request,
        errorItems: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_BUSINESS_CARD_DETAIL_BY_TYPE): {
      return {
        ...state,
        businessCardDetailBy: action.payload.data
      };
    }
    case FAILURE(ACTION_TYPES.GET_BUSINESS_CARD_DETAIL_BY_TYPE): {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};

const taskApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

export const getBusinessCardDetailBy = (payload, type) => ({
  type: ACTION_TYPES.GET_BUSINESS_CARD_DETAIL_BY_TYPE,
  payload: axios.post(`${taskApiUrl}/get-data-for-calendar-by-${type}`, payload, { headers: { ['Content-Type']: 'application/json' } })
}
);
