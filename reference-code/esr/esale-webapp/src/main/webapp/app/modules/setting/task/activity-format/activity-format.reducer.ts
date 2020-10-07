import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import {
  QUERY_GET_ACTIVITY_FORMAT,
  QUERY_UPDATE_ACTIVITY_FORMAT,
  CHECK_ACTIVITY_FORMATS
} from 'app/modules/setting/constant';
import axios from 'axios';

export enum ActivityFormatAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  ACTIVITY_FORMAT_RESET: 'activityFormat/RESET',
  GET_ACTIVITY_FORMAT: 'activityFormat/GET',
  UPDATE_ACTIVITY_FORMAT: 'activityFormat/UPDATE',
  CHECK_ACTIVITY_FORMAT: 'activityFormat/CHECK_DELETE',
  ACTIVITY_FORMAT_RESET_IDSS: 'activityFormat/RESET_IDSS'
};
const initialState = {
  action: ActivityFormatAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  activity: null,
  checkDelete: null,
  activityUpdate: null
};
export type ActivityFormatState = Readonly<typeof initialState>;

// API base URL
const activityApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.ACTIVITY_SERVICE_PATH;

const parseApiGetResponse = res => {
  const data = res;
  const dataResponse = [];
  dataResponse['fieldInfo'] = data['fieldInfo'] ? data['fieldInfo'] : [];
  dataResponse['productTradingFieldInfo'] = data['productTradingFieldInfo']
    ? data['productTradingFieldInfo']
    : [];
  dataResponse['activityFormats'] = [];
  if (data['activityFormats'] !== undefined && data['activityFormats'].length > 0) {
    data['activityFormats'].forEach(element => {
      element['fieldUse'] = JSON.parse(element['fieldUse']);
      element['productTradingFieldUse'] = JSON.parse(element['productTradingFieldUse']);
      dataResponse['activityFormats'].push(element);
    });
  }
  return { dataResponse };
};

const parseactivityEditResponse = res => {
  const resID = res.deletedActivityFormats;
  return { resID };
};
const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

// Reducer
export default (state: ActivityFormatState = initialState, action): ActivityFormatState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_ACTIVITY_FORMAT):
    case REQUEST(ACTION_TYPES.CHECK_ACTIVITY_FORMAT):
    case REQUEST(ACTION_TYPES.GET_ACTIVITY_FORMAT): {
      return {
        ...state,
        action: ActivityFormatAction.Request,
        errorItems: []
      };
    }
    case FAILURE(ACTION_TYPES.UPDATE_ACTIVITY_FORMAT):
    case FAILURE(ACTION_TYPES.CHECK_ACTIVITY_FORMAT):
    case FAILURE(ACTION_TYPES.GET_ACTIVITY_FORMAT): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: ActivityFormatAction.Error,
        errorItems: resFai.errorMsg
      };
    }

    case ACTION_TYPES.ACTIVITY_FORMAT_RESET: {
      return {
        ...initialState,
        action: action.payload
      };
    }

    case ACTION_TYPES.ACTIVITY_FORMAT_RESET_IDSS: {
      return {
        ...state,
        activityUpdate: null
      };
    }

    case SUCCESS(ACTION_TYPES.GET_ACTIVITY_FORMAT): {
      const res = parseApiGetResponse(action.payload.data);
      return {
        ...state,
        action: ActivityFormatAction.Success,
        activity: res.dataResponse
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_ACTIVITY_FORMAT): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.activityFormatIds
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_ACTIVITY_FORMAT): {
      const res = parseactivityEditResponse(action.payload.data);
      return {
        ...state,
        activityUpdate: res.resID
      };
    }

    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = (actionCurrentRequest = ActivityFormatAction.None) => ({
  type: ACTION_TYPES.ACTIVITY_FORMAT_RESET,
  payload: actionCurrentRequest
});

/**
 * resetIdss
 */
export const resetIdss = () => ({
  type: ACTION_TYPES.ACTIVITY_FORMAT_RESET_IDSS
});

/**
 * update Activity Format
 */
export const updateActivityFormat = param => ({
  type: ACTION_TYPES.UPDATE_ACTIVITY_FORMAT,
  payload: axios.post(
    `${activityApiUrl}/update-activity-formats`,
    {
      activityFormats: param.listItem,
      deletedActivityFormats: param.deletedActivityFormats
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
/**
 * Get Activity Format
 */
export const getActivityFormat = () => ({
  type: ACTION_TYPES.GET_ACTIVITY_FORMAT,
  payload: axios.post(
    `${activityApiUrl}/get-activity-formats`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * check Positions type
 */
export const checkActivityFormat = id => ({
  type: ACTION_TYPES.CHECK_ACTIVITY_FORMAT,
  payload: axios.post(
    `${activityApiUrl}/check-delete-activity-formats`,
    { activityFormatIds: [id] },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/* handle Update */
export const handleUpdate = params => async dispatch => {
  await dispatch(updateActivityFormat(params));
};

/* handle Get Data */
export const handleGetActivityFormat = () => async (dispatch, getState) => {
  await dispatch(getActivityFormat());
};

/* handle Check Delete */
export const handleCheckDelete = id => async dispatch => {
  await dispatch(checkActivityFormat(id));
};
