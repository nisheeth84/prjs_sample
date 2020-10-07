import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';

export const ACTION_TYPES = {
  URLAPI_RESET: 'urlapi/RESET',
  URLAPI_GET_SETTING: 'urlapi/URLAPI_GET_SETTING',
  URLAPI_UPDATE_SETTING: 'urlapi/URLAPI_UPDATE_SETTING'
};

export enum publicAPIAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal
}

const initialState = {
  action: publicAPIAction.None,
  errorMessage: null,
  errorItems: [],
  urlApiUpdateSuccess: null,
  urlApiInfo: {}
};

export type PublicAPIState = Readonly<typeof initialState>;

// Reducer
export default (state: PublicAPIState = initialState, action): PublicAPIState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.URLAPI_UPDATE_SETTING):
    case REQUEST(ACTION_TYPES.URLAPI_GET_SETTING): {
      return {
        ...state,
        action: publicAPIAction.RequestModal,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.URLAPI_UPDATE_SETTING):
    case FAILURE(ACTION_TYPES.URLAPI_GET_SETTING): {
      return {
        ...state,
        action: publicAPIAction.ErrorModal,
        errorItems: action.payload.message
      };
    }
    case ACTION_TYPES.URLAPI_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.URLAPI_GET_SETTING): {
      return {
        ...state,
        urlApiInfo: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.URLAPI_UPDATE_SETTING): {
      const res = action.payload.data;
      return {
        ...state,
        urlApiUpdateSuccess: res.urlApiId
      };
    }
    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.URLAPI_RESET
});

// API base URL
const apiExternalsUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EXTERNALS_SERVICE_PATH;

/**
 * create Feedback
 *
 */
export const createFeedback = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.URLAPI_UPDATE_SETTING,
    payload: axios.post(
      `${apiExternalsUrl}/create-feed-back`,
      {
        createFeedBack: param
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * create Feedback Status
 *
 */
export const createFeedbackStatus = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.URLAPI_GET_SETTING,
    payload: axios.post(`${apiExternalsUrl}/create-feed-back-status-open`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};
