import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import {
  QUERY_GET_CUSTOMER_CONNECTION_MAP,
  QUERY_UPDATE_CUSTOMER_CONNECTION_MAP,
  QUERY_CHECK_DELETE_MASTER_MOTIVATIONS,
  QUERY_CHECK_DELETE_MASTER_STANDS,
  CUSTOMER_TYPE
} from 'app/modules/setting/constant';
import axios from 'axios';
import { update } from 'lodash';
import _ from 'lodash';

export enum MasterPositionAction {
  None,
  Request,
  Error,
  Success
}
export const ACTION_TYPES = {
  RESET_MASTER_POSITION: 'masterPosition/RESET',
  GET_CUSTOMER_CONNECTIONS_MAP: 'masterPosition/GET_CUSTOMER_CONNECTIONS_MAP',
  UPDATE_CUSTOMER_CONNECTIONS_MAP: 'masterPosition/UPDATE_CUSTOMER_CONNECTIONS_MAP',
  CHECK_DELETE_MASTER_STANDS: 'masterPosition/CHECK_DELETE_MASTER_STANDS',
  CHECK_DELETE_MASTER_MOTIVATIONS: 'masterPosition/CHECK_DELETE_MASTER_MOTIVATIONS'
};
const initialState = {
  action: MasterPositionAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  customerConnectionsMap: null,
  checkDelete: null,
  updateSuccess: null
};
export type MasterPositionState = Readonly<typeof initialState>;

// API base URL
const customerApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;

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

  if (errorCodeList.length > 0) return { errorCodeList };
  else return res;
};

// Reducer
export default (state: MasterPositionState = initialState, action): MasterPositionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_CUSTOMER_CONNECTIONS_MAP):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_MASTER_STANDS):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_MASTER_MOTIVATIONS):
    case REQUEST(ACTION_TYPES.GET_CUSTOMER_CONNECTIONS_MAP): {
      return {
        ...state,
        action: MasterPositionAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.UPDATE_CUSTOMER_CONNECTIONS_MAP):
    case FAILURE(ACTION_TYPES.CHECK_DELETE_MASTER_STANDS):
    case FAILURE(ACTION_TYPES.CHECK_DELETE_MASTER_MOTIVATIONS):
    case FAILURE(ACTION_TYPES.GET_CUSTOMER_CONNECTIONS_MAP): {
      return {
        ...state,
        action: MasterPositionAction.Error,
        errorMessage: action.payload.message
      };
    }

    case SUCCESS(ACTION_TYPES.GET_CUSTOMER_CONNECTIONS_MAP): {
      const res = action.payload.data;
      return {
        ...state,
        customerConnectionsMap: res
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_CUSTOMER_CONNECTIONS_MAP): {
      const res = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        updateSuccess: {
          Idss: res.updateCustomerConnectionsMap,
          errorCode: res.errorCodeList
        }
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_DELETE_MASTER_MOTIVATIONS): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.masterMotivationIds
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_DELETE_MASTER_STANDS): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.masterStandIds
      };
    }
    case ACTION_TYPES.RESET_MASTER_POSITION: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
};

const buildFormData = (params, fileUploads) => {
  const formData = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  const fileUploadNew = [];
  const keyFile = Object.keys(fileUploads);
  keyFile.forEach(e => {
    const tmpFileUpload = {};
    tmpFileUpload[`${e}.file_name.file0`] = fileUploads[e];
    fileUploadNew.push(tmpFileUpload);
  });

  if (fileUploads)
    fileUploadNew.forEach((file, index) => {
      const key = Object.keys(file)[0];
      mapFile += separate + `"${key}": ["variables.files.${index}"]`;
      // filesMap[key] = file[key];
      formData.append('files', file[key]);
      if (!filesNameList) {
        filesNameList = [];
      }
      filesNameList.push(key);
      separate = ',';
      // params['files'].push(file);
    });
  if (filesNameList) {
    formData.append('filesMap', filesNameList);
  }
  const tmpParams = _.cloneDeep(params);
  if ('masterMotivations' in tmpParams) {
    if (Array.isArray(tmpParams.masterMotivations)) {
      tmpParams.masterMotivations.forEach(element => {
        if ('iconPath' in element) {
          delete element['iconPath'];
        }
        if ('createdDate' in element) {
          delete element['createdDate'];
        }
        if ('createdUser' in element) {
          delete element['createdUser'];
        }
        if ('updatedUser' in element) {
          delete element['updatedUser'];
        }
      });
    }
  }
  if ('masterStands' in tmpParams) {
    if (Array.isArray(tmpParams.masterStands)) {
      tmpParams.masterStands.forEach(e => {
        if ('createdDate' in e) {
          delete e['createdDate'];
        }
        if ('createdUser' in e) {
          delete e['createdUser'];
        }
        if ('updatedUser' in e) {
          delete e['updatedUser'];
        }
      });
    }
  }
  formData.append('data', JSON.stringify(tmpParams));
  formData.append('map', '{' + mapFile + '}');
  return formData;
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET_MASTER_POSITION
});

/**
 * update Customer Connections Map
 */

export const updateCustomerConnectionsMap = (param, fileUpload) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_CUSTOMER_CONNECTIONS_MAP,
    payload: axios.post(
      `${API_CONTEXT_PATH}/customers/api/update-customer-connections-map`,
      buildFormData(param, fileUpload),
      {
        headers: { ['Content-Type']: 'multipart/form-data' }
      }
    )
  });
};

/* get Customer Connections Map */
export const getCustomerConnectionsMap = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_CUSTOMER_CONNECTIONS_MAP,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'customers/api/get-customer-connection-map'}`,
      null,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/* checkDeleteMasterMotivations */
export const checkDeleteMasterMotivations = id => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CHECK_DELETE_MASTER_MOTIVATIONS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'customers/api/check-delete-master-motivation'}`,
      { masterMotivationIds: id },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/* checkDeleteMasterStands */
export const checkDeleteMasterStands = id => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CHECK_DELETE_MASTER_STANDS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'customers/api/check-delete-master-stands'}`,
      { masterStandIds: id },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/* handle Check Delete */
export const handleCheckDelete = (type, id) => async dispatch => {
  if (type === CUSTOMER_TYPE.MASTER_MOTIVATIONS) {
    await dispatch(checkDeleteMasterMotivations(id));
  } else if (type === CUSTOMER_TYPE.MASTER_STANDS) {
    await dispatch(checkDeleteMasterStands(id));
  }
};

/* handle Update */
export const handleUpdate = (param, fileUpload) => async dispatch => {
  await dispatch(updateCustomerConnectionsMap(param, fileUpload));
};

/*  handle Get Data */
export const handleGetData = () => async dispatch => {
  await dispatch(getCustomerConnectionsMap());
};
