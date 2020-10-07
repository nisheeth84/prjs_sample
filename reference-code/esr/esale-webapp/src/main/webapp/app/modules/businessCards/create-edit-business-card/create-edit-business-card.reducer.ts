import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH, AVAILABLE_FLAG } from 'app/config/constants';
import { translate } from 'react-jhipster';

const businessCardsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

export enum CreateEditBusinessCardAction {
  None,
  Request,
  Error,
  Success,
  GetFieldSuccess,
  GetFieldFailure,
  GetBusinessCardSuccess,
  GetBusinessCardFailure,
  CreateEditSuccess,
  CreateEditFailure
}

const initialState = {
  action: CreateEditBusinessCardAction.None,
  errorMessage: null,
  errorCode: null,
  successMessage: null,
  customFieldInfos: null,
  errorItems: null,
  errorCodeList: null,
  businessCardIdResponse: null,
  businessCardDetail: null,
  suggestDepartment: null
};

export const ACTION_TYPES = {
  GET_CUSTOM_FIELD_INFO: 'businessCard/GET_CUSTOM_FIELD_INFO',
  GET_BUSINESS_CARD: 'businessCard/GET_BUSINESS_CARD',
  CREATE_BUSINESS_CARD: 'businessCard/CREATE_BUSINESS_CARD',
  EDIT_BUSINESS_CARD: 'businessCard/EDIT_BUSINESS_CARD',
  RESET: 'businessCard/RESET',
  SUGGEST_DEPARTMENT: 'businessCard/SUGGEST_DEPARTMENT'
};

const buildFormData = (params, fileUploads, isUpdate) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads)
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
  if (!isUpdate) {
    data.append('data', JSON.stringify(params));
  } else data.append('data', JSON.stringify({ businessCards: [params] }));
  return data;
};

const parseCustomFieldsInfoResponse = res => {
  let errors = [];
  let errorMsg = null;
  if (res.errors && res.errors.length > 0) {
    errors = res.errors[0].extensions ? res.errors[0].extension.errors : null;
    errorMsg = res.errors[0].message;
  }
  const action =
    (errors && errors.length > 0) || errorMsg
      ? CreateEditBusinessCardAction.GetFieldFailure
      : CreateEditBusinessCardAction.GetFieldSuccess;
  let fieldInfos = res.customFieldsInfo;
  if (fieldInfos) {
    fieldInfos = fieldInfos
      .filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, errors, action, fieldInfos };
};

const parseCreateBusinessCardResponse = res => {
  let errors = null;
  let isError = false;
  if (res.errors && res.errors.length > 0) {
    errors = res.errors;
    isError = true;
  }
  const action =
    errors && errors.length > 0
      ? CreateEditBusinessCardAction.CreateEditFailure
      : CreateEditBusinessCardAction.CreateEditSuccess;
  let businessCardId = null;
  if (res && res.businessCardId) {
    businessCardId = res.businessCardId;
  }
  return { errors, isError, action, businessCardId };
};

const parseGetBusinessCardResponse = res => {
  let errorMsg = null;
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg
    ? CreateEditBusinessCardAction.GetBusinessCardFailure
    : CreateEditBusinessCardAction.GetBusinessCardSuccess;
  let businessCardDetail = null;
  let fieldInfos = null;
  if (res) {
    businessCardDetail = res.businessCardDetail;
    fieldInfos = res.fieldInfo;
    if (fieldInfos) {
      fieldInfos = fieldInfos
        .filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
        .sort((a, b) => a.fieldOrder - b.fieldOrder);
    }
  }
  return { errorMsg, action, businessCardDetail, fieldInfos };
};

const parseEditBusinessCardResponse = res => {
  console.log({ res });

  let errors = [];
  let errorMsg = null;
  if (res.errors && res.errors.length > 0) {
    errors = res.errors[0].extensions ? res.errors[0].extension.errors : null;
    errorMsg = res.errors[0].message;
  }
  const action =
    (errors && errors.length > 0) || errorMsg
      ? CreateEditBusinessCardAction.CreateEditFailure
      : CreateEditBusinessCardAction.CreateEditSuccess;

  let businessCardId = null;
  if (
    res &&
    res.listOfBusinessCardId.length > 0
  ) {
    businessCardId = res.listOfBusinessCardId[0];
  }
  return { errors, errorMsg, action, businessCardId };
};

export const parseErrorRespose = payload => {
  let errorCodeList = [];
  let errorCode;
  if (payload.response.data.parameters) {
    const resError = payload.response.data.parameters.extensions;
    if (resError && resError.errors && resError.errors.length > 0) {
      errorCodeList = resError.errors;
      const err = resError.errors.find(x => x.errorCode === 'ERR_COM_0050');
      if (err && err.errorCode) {
        errorCode = err.errorCode;
      }
    } else if (resError) {
      errorCodeList.push(resError);
    }
  }
  return { errorCodeList, errorCode };
};

export type CreateEditBusinessCardState = Readonly<typeof initialState>;

export default (
  state: CreateEditBusinessCardState = initialState,
  action
): CreateEditBusinessCardState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_CUSTOM_FIELD_INFO):
    case REQUEST(ACTION_TYPES.CREATE_BUSINESS_CARD):
    case REQUEST(ACTION_TYPES.SUGGEST_DEPARTMENT):
      return {
        ...state,
        action: CreateEditBusinessCardAction.Request,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_CUSTOM_FIELD_INFO):
    case FAILURE(ACTION_TYPES.SUGGEST_DEPARTMENT):
    case FAILURE(ACTION_TYPES.GET_BUSINESS_CARD):
    case FAILURE(ACTION_TYPES.CREATE_BUSINESS_CARD): {
      const resError = parseCreateBusinessCardResponse(
        action.payload.response.data.parameters.extensions
      );
      return {
        ...state,
        action: CreateEditBusinessCardAction.Error,
        errorMessage: action.payload.message,
        successMessage: null,
        suggestDepartment: null,
        errorItems: resError.errors
      };
    }
    case FAILURE(ACTION_TYPES.EDIT_BUSINESS_CARD): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: CreateEditBusinessCardAction.Error,
        errorMessage: errorRes.errorCodeList,
        errorItems: errorRes.errorCodeList,
        errorCode: errorRes.errorCode
      };
    }
    case SUCCESS(ACTION_TYPES.GET_CUSTOM_FIELD_INFO): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);

      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customFieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_BUSINESS_CARD): {
      const res = parseCreateBusinessCardResponse(action.payload.data);
      return {
        ...state,
        successMessage: translate('messages.INF_COM_0003'),
        action: res.action,
        businessCardIdResponse: res.businessCardId
      };
    }
    case SUCCESS(ACTION_TYPES.GET_BUSINESS_CARD): {
      const res = parseGetBusinessCardResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        businessCardDetail: res.businessCardDetail,
        customFieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.EDIT_BUSINESS_CARD): {
      const res = parseEditBusinessCardResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: translate('messages.INF_COM_0004'),
        businessCardIdResponse: res.businessCardId,
        errorCode: null
      };
    }
    case SUCCESS(ACTION_TYPES.SUGGEST_DEPARTMENT): {
      const res = action.payload.data;
      return {
        ...state,
        action: res.action,
        suggestDepartment: res.department,
        errorMessage: res.errorMsg
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export const getCustomFieldInfo = params => ({
  type: ACTION_TYPES.GET_CUSTOM_FIELD_INFO,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    JSON.stringify({
      fieldBelong: params.fieldBelong
    }),
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const createBusinessCard = (params, fileUploads) => ({
  type: ACTION_TYPES.CREATE_BUSINESS_CARD,
  payload: axios.post(
    `${businessCardsApiUrl}/create-business-card`,
    buildFormData(params, fileUploads, false),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

export const updateBusinessCard = (params, fileUploads) => ({
  type: ACTION_TYPES.EDIT_BUSINESS_CARD,
  payload: axios.post(
    `${businessCardsApiUrl}/update-business-cards`,
    buildFormData(params, fileUploads, true),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

export const getBusinessCard = params => ({
  type: ACTION_TYPES.GET_BUSINESS_CARD,
  payload: axios.post(`${businessCardsApiUrl}/get-business-card`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const suggestBusinessCardDepartment = params => ({
  type: ACTION_TYPES.SUGGEST_DEPARTMENT,
  payload: axios.post(`${businessCardsApiUrl}/suggest-business-card-department`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleGetBusinessCard = params => async (dispatch, getState) => {
  await dispatch(getBusinessCard(params));
};

export const handleSuggestBusinessCardDepartment = params => async (dispatch, getState) => {
  await dispatch(suggestBusinessCardDepartment(params));
};

export const handleCreateBusinessCard = (params, fileUploads) => async (dispatch, getState) => {
  await dispatch(createBusinessCard(params, fileUploads));
};
export const reset = () => ({
  type: ACTION_TYPES.RESET
});
