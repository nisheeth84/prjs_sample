import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';

export const ACTION_TYPES = {
  NOTIFICATION_RESET: 'notification/RESET',
  NOTIFICATION_GET: 'notification/GET',
  NOTIFICATION_UPDATE: 'notification/UPDATE'
};

export enum notificationPopuptAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal,
  UpdateProductSuccess,
  UpdateProductFailure
}

const initialState = {
  action: notificationPopuptAction.None,
  errorMessage: null,
  errorItems: [],
  dataInfo: null,
  successMessage: null,
  idUpdate: null
};

export type NotificationState = Readonly<typeof initialState>;

// Reducer
export default (state: NotificationState = initialState, action): NotificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.NOTIFICATION_GET):
    case REQUEST(ACTION_TYPES.NOTIFICATION_UPDATE):
      return {
        ...state,
        action: notificationPopuptAction.RequestModal,
        errorItems: []
      };
    case FAILURE(ACTION_TYPES.NOTIFICATION_GET):
    case FAILURE(ACTION_TYPES.NOTIFICATION_UPDATE):
      return {
        ...state,
        action: notificationPopuptAction.ErrorModal,
        errorItems: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.NOTIFICATION_GET): {
      return {
        ...state,
        dataInfo: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.NOTIFICATION_UPDATE): {
      return {
        ...state,
        idUpdate: action.payload.data
      };
    }
    case ACTION_TYPES.NOTIFICATION_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const notificationApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

/**
 * get getNotification
 *
 * @param
 */
export const getNotification = (limitParam, textSearchParam) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.NOTIFICATION_GET,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/get-notifications'}`,
      { limit: limitParam, textSearch: textSearchParam },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * reset handleGetData
 */
export const handleGetData = (prarams?) => async dispatch => {
  await dispatch(getNotification(prarams && prarams.limit ? prarams.limit : null, prarams && prarams.textSearch ? prarams.textSearch : ''));
};

/**
 * reset handleGetData
 */
export const updateNotification = praramsUpdate => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.NOTIFICATION_UPDATE,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/update-notification-address'}`,
      {
        notificationId: praramsUpdate.notifi.notificationId,
        updatedDate: praramsUpdate.notifi.updatedDate
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.NOTIFICATION_RESET
});
