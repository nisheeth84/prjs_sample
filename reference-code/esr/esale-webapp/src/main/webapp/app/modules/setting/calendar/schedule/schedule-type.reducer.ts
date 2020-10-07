import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { changeOrder } from 'app/shared/util/dragdrop';
import _ from 'lodash';
import { CommonUtils } from 'app/modules/calendar/models/common-type';

export enum ScheduleTypeAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  SCHEDULE_TYPE_RESET: 'scheduleType/RESET',
  GET_SCHEDULE_TYPE: 'scheduleType/GET_SCHEDULE_TYPE',
  UPDATE_SCHEDULE_TYPE: 'scheduleType/UPDATE_SCHEDULE_TYPE',
  CHECK_DELETE_SCHEDULE_TYPE: 'scheduleType/CHECK_DELETE_SCHEDULE_TYPE',
  CHANGE_ORDER_SCHEDULE_TYPE: 'scheduleType/CHANGE_ORDER_SCHEDULE_TYPE'
};
const initialState = {
  action: ScheduleTypeAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  scheduleTypes: [],
  scheduleTypeUpdate: null,
  errorCodeList: [],
  scheduleTypeSuccsess: null,
  checkDelete: null
};
export type ScheduleTypeState = Readonly<typeof initialState>;

const parseGeneralApiResponse = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const actionSuccsess = res['updatedScheduleTypes'];

  return { errorCodeList, actionSuccsess };
};

// API base URL
const scheduleApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

// Reducer
export default (state: ScheduleTypeState = initialState, action): ScheduleTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SCHEDULE_TYPE):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_SCHEDULE_TYPE):
    case REQUEST(ACTION_TYPES.UPDATE_SCHEDULE_TYPE): {
      return {
        ...state,
        action: ScheduleTypeAction.Request,
        errorItems: null
      };
    }
    case FAILURE(ACTION_TYPES.GET_SCHEDULE_TYPE):
    case FAILURE(ACTION_TYPES.CHECK_DELETE_SCHEDULE_TYPE):
    case FAILURE(ACTION_TYPES.UPDATE_SCHEDULE_TYPE): {
      return {
        ...state,
        action: ScheduleTypeAction.Error,
        errorMessage: action.payload.message
      };
    }
    case SUCCESS(ACTION_TYPES.GET_SCHEDULE_TYPE): {
      const res = action.payload.data;
      return {
        ...state,
        scheduleTypes: res.scheduleTypes,
        checkDelete: null,
        action: ScheduleTypeAction.Success
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_SCHEDULE_TYPE): {
      const resUpdate = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        errorCodeList: resUpdate.errorCodeList,
        scheduleTypeUpdate: resUpdate.actionSuccsess,
        checkDelete: null
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_DELETE_SCHEDULE_TYPE): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.scheduleTypes
      };
    }
    case ACTION_TYPES.SCHEDULE_TYPE_RESET: {
      return {
        ...initialState
      };
    }
    case ACTION_TYPES.CHANGE_ORDER_SCHEDULE_TYPE: {
      return {
        ...state,
        scheduleTypes: action.payload
      };
    }

    default:
      return state;
  }
};

const buildFormData = (params, fileUploads) => {
  if (params && params.scheduleTypes && params.scheduleTypes.length) {
    params.scheduleTypes.forEach(e => {
      if (e.iconPath && e.iconPath.includes('blob')) {
        e.iconPath = null;
      }
    });
  }
  const obj = CommonUtils.convertFormFile(params);
  return obj;
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.SCHEDULE_TYPE_RESET
});

/**
 * Get schedules type
 */
export const getScheduleType = () => ({
  type: ACTION_TYPES.GET_SCHEDULE_TYPE,
  payload: axios.post(`${scheduleApiUrl}/get-schedule-types`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * update schedules type
 */
export const updateScheduleType = (scheduleTypes, fileUpload) => ({
  type: ACTION_TYPES.UPDATE_SCHEDULE_TYPE,
  payload: axios.post(
    `${scheduleApiUrl}/update-schedule-types`,
    buildFormData(scheduleTypes, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});
/**
 * check Delete Schedule Types
 */
export const checkDeleteScheduleTypes = id => ({
  type: ACTION_TYPES.CHECK_DELETE_SCHEDULE_TYPE,
  payload: axios.post(
    `${scheduleApiUrl}/check-delete-schedule-types`,
    {
      scheduleTypeIds: [id]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/* handle Update */
export const handleUpdate = (param, fileUpload) => async dispatch => {
  await dispatch(updateScheduleType(param, fileUpload));
};
/* handle Get Data */
export const handleGetData = () => async dispatch => {
  await dispatch(getScheduleType());
};
/* handle Check Delete */
export const handleCheckDelete = id => async dispatch => {
  await dispatch(checkDeleteScheduleTypes(id));
};

/**
 * update order schedule type
 *
 */
export const changeOrderScheduleType = (sourceIndex, targetIndex) => (dispatch, getState) => {
  const newServiceInfo = changeOrder(
    sourceIndex,
    targetIndex,
    getState().scheduleType.scheduleTypes
  );
  // TODO: add service

  dispatch({
    type: ACTION_TYPES.CHANGE_ORDER_SCHEDULE_TYPE,
    payload: newServiceInfo
  });
};
