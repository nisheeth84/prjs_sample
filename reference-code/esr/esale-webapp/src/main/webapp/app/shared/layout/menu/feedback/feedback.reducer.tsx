import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';

export const ACTION_TYPES = {
  FEEDBACK_RESET: 'feedback/RESET',
  FEEDBACK_CREATE: 'feedback/CREATE_FEEDBACK',
  FEEDBACK_GET_STATUS_CONTRACT: 'feedback/GET_STATUS_CONTRACT',
  FEEDBACK_GET_COMPANY_NAME: 'feedback/GET_COMPANY_NAME',
  FEEDBACK_CREATE_STATUS_OPEN: 'feedback/CREATE_FEEDBACK_STATUS',
  FEEDBACK_GET_STATUS_OPEN: 'feedback/GET_STATUS_OPEN_FEEDBACK',
  GET_GENERAL: 'general/GET',
};

export enum feedbackAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal
}

const initialState = {
  action: feedbackAction.None,
  errorMessage: null,
  errorItems: [],
  createSuccess: null,
  createStatusSuccess: null,
  companyName: null,
  value: null,
  loadingData: false
};

export type FeedbackState = Readonly<typeof initialState>;

// Reducer
export default (state: FeedbackState = initialState, action): FeedbackState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_GENERAL):
    case REQUEST(ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN):
    case REQUEST(ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT):
    case REQUEST(ACTION_TYPES.FEEDBACK_CREATE_STATUS_OPEN):
    case REQUEST(ACTION_TYPES.FEEDBACK_GET_COMPANY_NAME):
    case REQUEST(ACTION_TYPES.FEEDBACK_CREATE): {
      return {
        ...state,
        action: feedbackAction.RequestModal,
        errorItems: []
      };
    }
    case FAILURE(ACTION_TYPES.GET_GENERAL):
    case FAILURE(ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN):
    case FAILURE(ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT):
    case FAILURE(ACTION_TYPES.FEEDBACK_CREATE_STATUS_OPEN):
    case FAILURE(ACTION_TYPES.FEEDBACK_GET_COMPANY_NAME):
    case FAILURE(ACTION_TYPES.FEEDBACK_CREATE): {
      return {
        ...state,
        action: feedbackAction.ErrorModal,
        errorItems: action.payload.message
      };
    }
    case ACTION_TYPES.FEEDBACK_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_GENERAL) :{
      const res = action.payload.data;
      return {
        ...state,
        value: action.payload.data.generalSettingId ? action.payload.data : {},
        loadingData: true
      }
    }

    case SUCCESS(ACTION_TYPES.FEEDBACK_GET_COMPANY_NAME): {
      return {
        ...state,
        companyName: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.FEEDBACK_CREATE_STATUS_OPEN): {
      const res = action.payload.data;
      return {
        ...state,
        createStatusSuccess: res.employeeId
      };
    }

    case SUCCESS(ACTION_TYPES.FEEDBACK_CREATE): {
      const res = action.payload.data;
      return {
        ...state,
        createSuccess: res.feedbackId
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
  type: ACTION_TYPES.FEEDBACK_RESET
});

// API base URL
const apiTenantsUrl = API_CONTEXT_PATH + '/' + API_CONFIG.TENANTS_SERVICE_PATH;

/**
 * get company name
 *
 */
export const getCompanyName = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.FEEDBACK_GET_COMPANY_NAME,
    payload: axios.post(
      `${apiTenantsUrl}/get-company-name`,
      { tenantName: param },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * create Feedback
 *
 */
export const createFeedback = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.FEEDBACK_CREATE,
    payload: axios.post(
      `${apiTenantsUrl}/create-feed-back`,
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
    type: ACTION_TYPES.FEEDBACK_CREATE_STATUS_OPEN,
    payload: axios.post(`${apiTenantsUrl}/create-feed-back-status-open`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

export const getGeneral = fixedParams => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_GENERAL,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/get-general-setting'}`,
      { settingName: fixedParams },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
