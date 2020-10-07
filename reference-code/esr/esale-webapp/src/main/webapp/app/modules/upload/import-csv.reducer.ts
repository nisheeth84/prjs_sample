import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import _ from 'lodash';
const UPLOAD_IMPORT_FILE = 'upload-import-file';

export const ACTION_TYPES = {
  GET_IMPORT_PROGRESS_BAR: 'upload/GET_IMPORT_PROGRESS_BAR',
  GET_IMPORT_HISTORIES: 'upload/GET_IMPORT_HISTORIES',
  GET_IMPORT_MATCHING_KEY: 'upload/GET_IMPORT_MATCHING_KEY',
  GET_IMPORT_MAPPING_ITEMS: 'upload/GET_IMPORT_MAPPING_ITEMS',
  PROCESS_IMPORT: 'upload/PROCESS_IMPORT',
  STOP_SIMULATION: 'upload/STOP_SIMULATION',
  GET_FIELD_RELATION_ITEM: 'upload/GET_FIELD_RELATION_ITEM',
  UPLOAD_RESET: 'upload/RESET'
};

export enum UploadAction {
  None,
  Init,
  UploadSuccess,
  uploadFailure
}

const initialState = {
  action: UploadAction.None,
  errorMessage: null,
  errorItem: [],
  errorParams: [],
  isSuccess: false,
  importMatchingKeys: null,
  importMappingItems: null,
  fieldRelationItems: null,
  importHistoriesData: null,
  importRowTotal: 0,
  importRowFinish: 0
};

// API base URL
const commonsApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}`;
const headers = { headers: { ['Content-Type']: 'application/json' } };

/**
 * Call API getImportHistories
 * @param params
 */
export const getDownloadTemplateUrl = async serviceId => {
  const url = `${commonsApiUrl}/get-template-fields-info-file`;
  const res = await axios.post(url, { serviceId }, headers);
  return res.data;
};

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params));
  return data;
};

/**
 * Dummy data for API get import histories
 */
const dummyHistories = () => {
  const data = [];
  for (let i = 1; i < 26; i++) {
    data.push({
      importHistoryId: i,
      createdDate: '2020-05-04 07:00:00',
      importFileName: `product00${i + 1}.csv`,
      importFilePath: `/${i % 2 === 0 ? 'tasks' : 'employees'}/${
        i % 2 === 0 ? 'task' : 'employee'
      }00${i}.csv`,
      isImportSucceed: i % 2 === 0,
      employeeName: `Dong ${i * 100}`,
      insertedCount: i * 5,
      updatedCount: i,
      errorCount: i % 3 === 1 ? 0 : i,
      importErrorFilePath: `${i % 3 === 1 ? null : 'abc/zyz.csv'}`
    });
  }
  return { importHistories: data };
};

/**
 * Call API getImportHistories
 * @param params
 */
export const getImportHistories = (serviceIdInput, sortValue) => ({
  type: ACTION_TYPES.GET_IMPORT_HISTORIES,
  // payload: axios.post(
  //   `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-import-histories`,
  //   {serviceId: serviceIdInput, orderBy: {key: "import_batch_start_time", value: sortValue} },
  //   headers
  // )
  payload: dummyHistories()
});

export const uploadFileHandler = (file: any) => {
  const uploadApiUrl = `services/employees/api/${UPLOAD_IMPORT_FILE}`;
  const formData = new FormData();
  formData.append('file', file);
  return axios
    .post(`${uploadApiUrl}`, formData, { headers: { ['Content-Type']: 'multipart/form-data' } })
    .then(res => res)
    .catch(error => {
      console.log('error upload file', error);
    });
};

export const getImportMappingItems = params => {
  const url = `${commonsApiUrl}/get-import-mapping-item`;
  return {
    type: ACTION_TYPES.GET_IMPORT_MAPPING_ITEMS,
    payload: axios.post(url, params, headers)
  };
};

export const getImportMatchingKeys = params => {
  const url = `${commonsApiUrl}/get-import-matching-key`;
  return {
    type: ACTION_TYPES.GET_IMPORT_MATCHING_KEY,
    payload: axios.post(url, params, headers)
  };
};

export const getFieldRelationItems = fieldBelong => ({
  type: ACTION_TYPES.GET_FIELD_RELATION_ITEM,
  payload: axios.post(`${commonsApiUrl}/get-field-relation-item`, { fieldBelong }, headers)
});

export const getImportProgressBar = importId => {
  return {
    type: ACTION_TYPES.GET_IMPORT_PROGRESS_BAR,
    payload: axios.post(`${commonsApiUrl}/get-import-progress-bar`, { importId }, headers)
  };
};

/**
 * update Customer Connections Map
 */

export const processImport = (param, fileUpload) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.PROCESS_IMPORT,
    payload: axios.post(
      `${commonsApiUrl}/process-import`,
      buildFormData(param, fileUpload),
      headers
    )
  });
};

const parseImportHistories = res => {
  return res;
};

const parseImportMappingItems = res => {
  return res.data.importMappingItem;
};

const parseImportmatchingKey = res => {
  return res.data.importMatchingKey;
};

const parseFieldRelationItem = res => {
  return res.data;
};

const parseImportProgressBar = res => {
  return res.data;
};

const parseError = res => {
  let errorCode = null;
  let isSuccess = true;
  if (res) {
    if (res.parameters.extensions.errors) {
      errorCode = res.parameters.extensions.errors[0].errorCode;
    }
  }
  isSuccess = _.isEmpty(errorCode);
  return { errorCode, isSuccess };
};

export type UploadState = Readonly<typeof initialState>;

export default (state: UploadState = initialState, action): UploadState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_FIELD_RELATION_ITEM):
    case REQUEST(ACTION_TYPES.GET_IMPORT_HISTORIES):
    case REQUEST(ACTION_TYPES.GET_IMPORT_MAPPING_ITEMS):
    case REQUEST(ACTION_TYPES.GET_IMPORT_MATCHING_KEY):
    case REQUEST(ACTION_TYPES.PROCESS_IMPORT):
    case REQUEST(ACTION_TYPES.GET_IMPORT_PROGRESS_BAR):
    case REQUEST(ACTION_TYPES.STOP_SIMULATION):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.GET_FIELD_RELATION_ITEM):
    case FAILURE(ACTION_TYPES.GET_IMPORT_HISTORIES):
    case FAILURE(ACTION_TYPES.GET_IMPORT_MAPPING_ITEMS):
    case FAILURE(ACTION_TYPES.GET_IMPORT_MATCHING_KEY):
    case FAILURE(ACTION_TYPES.PROCESS_IMPORT):
    case FAILURE(ACTION_TYPES.GET_IMPORT_PROGRESS_BAR):
    case FAILURE(ACTION_TYPES.STOP_SIMULATION): {
      const res = parseError(action.payload.response.data);
      return {
        ...state,
        errorMessage: res.errorCode,
        isSuccess: res.isSuccess
      };
    }
    case ACTION_TYPES.GET_IMPORT_HISTORIES: {
      const res = parseImportHistories(action.payload);
      return {
        ...state,
        importHistoriesData: res.importHistories
      };
    }
    case SUCCESS(ACTION_TYPES.GET_IMPORT_MAPPING_ITEMS): {
      const importMappingItems = parseImportMappingItems(action.payload);
      return {
        ...state,
        importMappingItems,
        errorMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_IMPORT_MATCHING_KEY): {
      const importMatchingKeys = parseImportmatchingKey(action.payload);
      return {
        ...state,
        importMatchingKeys,
        errorMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_FIELD_RELATION_ITEM): {
      const fieldRelationItems = parseFieldRelationItem(action.payload);
      return {
        ...state,
        fieldRelationItems
      };
    }
    case SUCCESS(ACTION_TYPES.GET_IMPORT_PROGRESS_BAR): {
      const { importRowTotal, importRowFinish } = parseImportProgressBar(action.payload);
      return {
        ...state,
        importRowTotal,
        importRowFinish
      };
    }
    case ACTION_TYPES.UPLOAD_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

/**
 * Handle call API getImportProgressBar
 * @param params
 */
export const handleGetImportProgressBar = importId => async (dispatch, getState) => {
  console.log('importId', importId);
  await dispatch(getImportProgressBar(importId));
};

/**
 * Handle call API getImportHitories
 * @param params
 */
export const handleGetImportHistories = (serviceId, sortValue) => async (dispatch, getState) => {
  await dispatch(getImportHistories(serviceId, sortValue ? 'DESC' : 'ASC'));
};

/**
 * Call API getImportMatchingKey
 * @param serviceId
 */
export const handleGetImportMatchingKeys = serviceId => async (dispatch, getState) => {
  await dispatch(getImportMatchingKeys(serviceId));
};

/**
 * Call API getFieldRelationItem
 * @param serviceId
 */
export const handleGetFieldRelationItems = serviceId => async (dispatch, getState) => {
  await dispatch(getFieldRelationItems(serviceId));
};

/**
 * Call API getFieldRelationItem
 * @param serviceId
 */
export const handleGetImportMappingItems = (serviceId, matchingKey, headerCsv) => async (
  dispatch,
  getState
) => {
  await dispatch(getImportMappingItems({ serviceId, matchingKey, headerCsv }));
};

/**
 * Call API getFieldRelationItem
 * @param serviceId
 */
export const handleProcessImport = (param, fileUpload) => async dispatch => {
  await dispatch(processImport(param, fileUpload));
};

/**
 * Reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.UPLOAD_RESET
});
