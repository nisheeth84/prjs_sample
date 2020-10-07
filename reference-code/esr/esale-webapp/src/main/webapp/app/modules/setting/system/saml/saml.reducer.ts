import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import _ from 'lodash';

export enum SamlAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  AUTHENTICATION_SAML_RESET: 'authenticationSaml/RESET',
  GET_AUTHENTICATION_SAML: 'authenticationSaml/GET',
  UPDATE_AUTHENTICATION_SAML: 'authenticationSaml/UPDATE'
};
const initialState = {
  action: SamlAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  auth: null,
  samlUpdateRes: null
};
export type SamlState = Readonly<typeof initialState>;

// API base URL
const tenantApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.TENANTS_SERVICE_PATH;

const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

// Reducer
export default (state: SamlState = initialState, action): SamlState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_AUTHENTICATION_SAML):
    case REQUEST(ACTION_TYPES.GET_AUTHENTICATION_SAML): {
      return {
        ...state,
        action: SamlAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.UPDATE_AUTHENTICATION_SAML):
    case FAILURE(ACTION_TYPES.GET_AUTHENTICATION_SAML): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: SamlAction.Error,
        errorItems: resFai.errorMsg
      };
    }

    case ACTION_TYPES.AUTHENTICATION_SAML_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_AUTHENTICATION_SAML): {
      const resGetSaml = action.payload.data;
      return {
        ...state,
        auth: {
          saml: resGetSaml
        }
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_AUTHENTICATION_SAML): {
      let randomId = null;
      if (action.payload.data.cognitoSettingsId) {
        randomId = Math.floor(Math.random() * Math.floor(100000));
      }
      return {
        ...state,
        samlUpdateRes: randomId
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
  params = _.omit(params, ['clientId', 'metaDataPath', 'userPoolId', 'metaData', '']);
  formData.append('data', JSON.stringify(params));
  formData.append('map', '{' + mapFile + '}');
  return formData;
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.AUTHENTICATION_SAML_RESET
});

export const getCognitoSetting = param => ({
  type: ACTION_TYPES.GET_AUTHENTICATION_SAML,
  payload: axios.post(`${API_CONTEXT_PATH}/tenants/public/api/get-cognito-setting`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});
export const updateAuthenticationSAML = (data, fileUpload) => ({
  type: ACTION_TYPES.UPDATE_AUTHENTICATION_SAML,
  payload: axios.post(
    `${API_CONTEXT_PATH}/tenants/api/update-cognito-setting`,
    buildFormData(data, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});
