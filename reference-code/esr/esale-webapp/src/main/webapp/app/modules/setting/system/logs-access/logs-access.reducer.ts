import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import axios from 'axios';

export enum LogAccessAction {
  None,
  Request,
  Error,
  Success
}

export enum ExportLogAccessAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  GET_LOG_ACCESS: 'logAccess/GET',
  EXPORT_ACCESSS_LOG: 'logAccess/EXPORT',
  EXPORT_ACCESSS_RESET: 'logAccess/RESET'
};

const initialState = {
  ExportAction: ExportLogAccessAction.None,
  action: LogAccessAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorCode: null,
  errorItems: null,
  logAccesses: null,
  exportAccessLog: null,
  customFieldInfos: null,
  contentAccess: null,
  totalCount: null
};

export type logAccessState = Readonly<typeof initialState>;

// Reducer
export default (state: logAccessState = initialState, action): logAccessState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_LOG_ACCESS): {
      return {
        ...state,
        action: LogAccessAction.Request,
        errorItems: null
      };
    }
    case REQUEST(ACTION_TYPES.EXPORT_ACCESSS_LOG): {
      return {
        ...state,
        ExportAction: ExportLogAccessAction.Request,
        errorItems: null
      };
    }
    case FAILURE(ACTION_TYPES.GET_LOG_ACCESS): {
      const res = action.payload.response.data;
      let error = null;
      if (res.parameters.extensions.errors && Array.isArray(res.parameters.extensions.errors)) {
        error = res.parameters.extensions.errors[0].errorCode;
      }
      return {
        ...state,
        action: LogAccessAction.Error,
        errorCode: error
      };
    }
    case FAILURE(ACTION_TYPES.EXPORT_ACCESSS_LOG): {
      return {
        ...state,
        ExportAction: ExportLogAccessAction.Error
      };
    }
    case SUCCESS(ACTION_TYPES.GET_LOG_ACCESS): {
      const res = action.payload.data;
      const content = [];
      if (res && res.accessLogs && res.accessLogs.length > 0) {
        res.accessLogs.forEach(element => {
          content.push(element.content);
        });
      }
      return {
        ...state,
        logAccesses: res,
        contentAccess: content,
        totalCount: res.totalCount
      };
    }
    case SUCCESS(ACTION_TYPES.EXPORT_ACCESSS_LOG): {
      const res = action.payload.data;
      return {
        ...state,
        exportAccessLog: res
      };
    }
    case ACTION_TYPES.EXPORT_ACCESSS_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const getAccessLogs = accessLogInput => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_LOG_ACCESS,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'commons/api/get-access-logs'}`, accessLogInput, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

export const exportAccessLogs = exportAccessLogsInput => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.EXPORT_ACCESSS_LOG,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'commons/api/export-access-logs'}`, exportAccessLogsInput, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.EXPORT_ACCESSS_RESET
});
