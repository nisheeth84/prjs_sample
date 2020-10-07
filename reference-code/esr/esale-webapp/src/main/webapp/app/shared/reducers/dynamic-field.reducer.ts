import _ from 'lodash';
import axios from 'axios';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG, IGNORE_DBL_CLICK_ACTION } from 'app/config/constants';
import {
  makeParamsLookupSuggest,
  parseResponseLookupSuggest,
  makeParamsGetDataByIds,
  parseResponseGetDataByIds,
  parseResponseRelationSuggest,
  makeParamsRelationSuggest,
  makeParamsGetRelationData,
  parseResponseGetRelationData
  // makeParamsGetDataByIds,
  // parseResponseGetDataByIds
} from './dynamic-field-helper';
import { parseErrorRespose } from '../util/string-utils';

export const ACTION_TYPES = {
  DYNAMIC_FIELD_RESET: 'dynamicField/RESET',
  DYNAMIC_FIELD_ACTIVITY_FORMATS_GET: 'dynamicField/ACTIVITY_FORMATS_GET',
  DYNAMIC_FIELD_PRODUCT_TYPES_GET: 'dynamicField/PRODUCT_TYPES_GET',
  DYNAMIC_FIELD_FIELD_INFO_GET: 'dynamicField/FIELD_INFO_GET',
  DYNAMIC_FIELD_FIELD_IDS_GET: 'dynamicField/FIELD_IDS_GET',
  DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET: 'dynamicField/CUSTOM_FIELD_INFO_GET',
  DYNAMIC_FIELD_SERVICE_INFO_GET: 'dynamicField/SERVICE_INFO_GET',
  DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET: 'dynamicField/FIELD_INFO_SERVICE_GET',
  DYNAMIC_FIELD_SUGGEST_LOOKUP_GET: `${IGNORE_DBL_CLICK_ACTION}dynamicField/SUGGEST_LOOKUP_GET`,
  DYNAMIC_FIELD_SUGGEST_RELATION_GET: `${IGNORE_DBL_CLICK_ACTION}dynamicField/SUGGEST_RELATION_GET`,
  DYNAMIC_FIELD_GET_RECORD_BY_IDS: 'dynamicField/DYNAMIC_FIELD_GET_RECORD_BY_IDS',
  DYNAMIC_FIELD_GET_RELATION_DATA: 'dynamicField/DYNAMIC_FIELD_GET_RELATION_DATA',
  DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET: 'dynamicField/DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET'
};

export enum DynamicFieldAction {
  None,
  Request,
  Error,
  Success
}

interface IDynamicFieldStateData {
  action: DynamicFieldAction;
  errorMessage: string;
  fieldInfo: any[];
  fieldByIds: any[];
  serviceInfo: any[];
  customFieldInfo: any[];
  fieldInfoService: any[];
  productTypes: any;
  activities: any;
  suggestLookup: any;
  suggestRelation: any;
  addresses?: any;
  recordData?: any;
  relationData?: any;
}

const defaultStateValue = {
  action: DynamicFieldAction.None,
  errorMessage: '',
  fieldByIds: [],
  fieldInfo: [],
  serviceInfo: [],
  fieldInfoService: [],
  customFieldInfo: [],
  productTypes: null,
  activities: null,
  suggestLookup: null,
  suggestRelation: null,
  addresses: null,
  recordData: null
};

const initialState = {
  data: new Map<string, IDynamicFieldStateData>()
};

const parseProductTypesResponse = res => {
  let products = {};
  if (res) {
    products = res;
  }
  return { products };
};

const parseActivitiesResponse = res => {
  let activities = {};
  if (res) {
    activities = res;
  }
  return { activities };
};

const parseFieldsInfoResponse = res => {
  const fields = [];
  if (res && res.fields) {
    fields.push(...res.fields);
  }
  return { fields };
};

const parseServiceInfoResponse = res => {
  const services = [];
  if (res && res.servicesInfo) {
    services.push(...res.servicesInfo);
  }
  return { services };
};

const parseAddressFromZipCodeResponse = (res, isAutoLoadParam, zipCodeParam) => {
  const addresses = [];
  if (res) {
    addresses.push(...res);
  }
  const data = { addressList: addresses, isAutoLoad: isAutoLoadParam, zipCode: zipCodeParam };
  return { data };
};

export type DynamicFieldState = Readonly<typeof initialState>;

const assignState = (state: DynamicFieldState, namespace: string, params: any) => {
  if (state.data.has(namespace)) {
    _.assign(state.data.get(namespace), params);
  } else {
    const val = _.cloneDeep(defaultStateValue);
    _.assign(val, params);
    state.data.set(namespace, val);
  }
};

const actionRequestApi = (stateRequest, actionRequest) => {
  switch (actionRequest.type) {
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_FIELD_IDS_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA):
    case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET):
      if (stateRequest.data.has(actionRequest.meta.namespace)) {
        stateRequest.data.get(actionRequest.meta.namespace).action = DynamicFieldAction.Request;
        stateRequest.data.get(actionRequest.meta.namespace).errorMessage = null;
      }
      return { ...stateRequest };
    default:
      break;
  }
};

const actionFailure = (stateRequestFailure, actionRequestFailure) => {
  switch (actionRequestFailure.type) {
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_FIELD_IDS_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA):
    case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET):
      if (stateRequestFailure.data.has(actionRequestFailure.meta.namespace)) {
        stateRequestFailure.data.get(actionRequestFailure.meta.namespace).action =
          DynamicFieldAction.Error;
        stateRequestFailure.data.get(
          actionRequestFailure.meta.namespace
        ).errorMessage = parseErrorRespose(actionRequestFailure.payload)[0];
      }
      return { ...stateRequestFailure };
    default:
      break;
  }
};

// Reducer
export default (state: DynamicFieldState = initialState, action): DynamicFieldState => {
  const stateRequest = actionRequestApi(state, action);
  if (!_.isNil(stateRequest)) {
    return stateRequest;
  }
  const stateFailure = actionFailure(state, action);
  if (!_.isNil(stateFailure)) {
    return stateFailure;
  }
  switch (action.type) {
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA):
    // case REQUEST(ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET):
    //   if (state.data.has(action.meta.namespace)) {
    //     state.data.get(action.meta.namespace).action = DynamicFieldAction.Request;
    //     state.data.get(action.meta.namespace).errorMessage = null;
    //   }
    //   return { ...state };
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA):
    // case FAILURE(ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET):
    //   if (state.data.has(action.meta.namespace)) {
    //     state.data.get(action.meta.namespace).action = DynamicFieldAction.Error;
    //     state.data.get(action.meta.namespace).errorMessage = parseErrorRespose(action.payload)[0];
    //   }
    //   return { ...state };
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET): {
      const res = parseActivitiesResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        errorMessage: null,
        activities: res.activities
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET): {
      const res = parseProductTypesResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        errorMessage: null,
        productTypes: res.products
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET): {
      const res = parseFieldsInfoResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        errorMessage: null,
        fieldInfo: res.fields
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET): {
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        customFieldInfo: action.payload.data.customFieldsInfo
          ? action.payload.data.customFieldsInfo
          : []
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET): {
      const res = parseServiceInfoResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        serviceInfo: res.services
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET): {
      const res = parseFieldsInfoResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        errorMessage: null,
        fieldInfoService: res.fields
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET): {
      const res = parseResponseLookupSuggest(action.meta.fieldBelong, action.payload.data);
      const actType = _.isEmpty(res.message)
        ? DynamicFieldAction.Success
        : DynamicFieldAction.Error;
      assignState(state, action.meta.namespace, {
        action: actType,
        errorMessage: res.message,
        suggestLookup: res.suggestLookup
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET): {
      const res = parseResponseRelationSuggest(action.meta.fieldBelong, action.payload.data);
      const actType = _.isEmpty(res.message)
        ? DynamicFieldAction.Success
        : DynamicFieldAction.Error;
      assignState(state, action.meta.namespace, {
        action: actType,
        errorMessage: res.message,
        suggestRelation: res.suggestRelation
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS): {
      const res = parseResponseGetDataByIds(action.meta.fieldBelong, action.payload.data);
      const actType = _.isEmpty(res.message)
        ? DynamicFieldAction.Success
        : DynamicFieldAction.Error;
      assignState(state, action.meta.namespace, {
        action: actType,
        errorMessage: res.message,
        recordData: res.recordData
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA): {
      const res = parseResponseGetRelationData(action.meta.fieldBelong, action.payload.data);
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        relationData: res.recordData
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET): {
      const res = parseAddressFromZipCodeResponse(
        action.payload.data,
        action.meta.isAutoLoad,
        action.meta.zipCode
      );
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        addresses: res.data
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_FIELD_FIELD_IDS_GET): {
      assignState(state, action.meta.namespace, {
        action: DynamicFieldAction.Success,
        fieldByIds:
          _.get(action.payload.data, 'customFieldsInfo') || _.get(action.payload.data, 'fields')
      });
      return { ...state };
    }
    case ACTION_TYPES.DYNAMIC_FIELD_RESET:
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicFieldAction.None;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).fieldInfo = null;
        state.data.get(action.meta.namespace).serviceInfo = null;
        state.data.get(action.meta.namespace).fieldInfoService = null;
        state.data.get(action.meta.namespace).productTypes = null;
        state.data.get(action.meta.namespace).activities = null;
        state.data.get(action.meta.namespace).suggestLookup = null;
        state.data.get(action.meta.namespace).addresses = null;
        state.data.get(action.meta.namespace).relationData = null;
        state.data.delete(action.meta.namespace);
      }
      return {
        ...state
      };
    default:
      return state;
  }
};

const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const productApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const activityApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.ACTIVITY_SERVICE_PATH;

export const PARAM_GET_ACTIVE_FORMATS = (fieldId?: number) => ({ fieldId });

export const PARAM_GET_PRODUCT_TYPE = (fieldId?: number) => ({ fieldId: fieldId ? fieldId : null });

export const PARAM_GET_FIELDS_INFO = (fieldBelong: number, fieldType: number, fieldId: number) => ({
  fieldBelong,
  fieldType,
  fieldId
});

export const PARAM_GET_SERVICES_INFO = (serviceType: number) => ({ serviceType });

export const PARAM_GET_ADDRESS_FROM_ZIP_CODE_INFO = (
  zipCode: string,
  offset: number,
  limit: number
) => ({
  zipCode: `${zipCode}`,
  offset,
  limit
});

export const getActivityFormats = (namespace, fieldId?: number) => async (dispatch, getState) => {
  const query = PARAM_GET_ACTIVE_FORMATS(fieldId);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_ACTIVITY_FORMATS_GET,
    payload: axios.post(`${activityApiUrl}/get-activity-formats`, query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace }
  });
};

export const getProductTypes = (namespace, fieldId?: number) => async (dispatch, getState) => {
  if (fieldId < 0) {
    fieldId = null;
  }
  const query = PARAM_GET_PRODUCT_TYPE(fieldId);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_PRODUCT_TYPES_GET,
    payload: axios.post(`${productApiUrl}/get-product-types`, query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace }
  });
};

export const getAddressFromZipCode = (
  namespace,
  zipCode: string,
  offset: number,
  limit: number,
  isAutoLoad?: boolean
) => async (dispatch, getState) => {
  const query = PARAM_GET_ADDRESS_FROM_ZIP_CODE_INFO(
    _.isNil(zipCode) ? null : zipCode,
    offset,
    limit
  );
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_ADDRESS_FROM_ZIP_CODE_GET,
    payload: axios.post(commonsApiUrl + '/get-addresses-from-zip-code', query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, isAutoLoad, zipCode }
  });
};

export const getFieldsInfo = (
  namespace,
  fieldBelong: number,
  fieldType: number,
  fieldId: number
) => async (dispatch, getState) => {
  const query = PARAM_GET_FIELDS_INFO(fieldBelong, fieldType, fieldId);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_GET,
    payload: axios.post(`${commonsApiUrl}/get-fields-info`, query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace }
  });
};

export const getFieldByIds = (namespace, fieldIds: number[]) => ({
  type: ACTION_TYPES.DYNAMIC_FIELD_FIELD_IDS_GET,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info-by-field-ids`,
    { fieldIds },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

export const getFieldsInfoService = (
  namespace,
  fieldBelong: number,
  fieldType: number,
  fieldId: number
) => async (dispatch, getState) => {
  const query = PARAM_GET_FIELDS_INFO(fieldBelong, fieldType, fieldId);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_FIELD_INFO_SERVICE_GET,
    payload: axios.post(`${commonsApiUrl}/get-fields-info`, query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace }
  });
};

export const getCustomFieldInfo = (namespace, fieldBelong: number) => ({
  type: ACTION_TYPES.DYNAMIC_FIELD_CUSTOM_FIELD_INFO_GET,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info`,
    { fieldBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

export const getServicesInfo = (namespace, serviceType: number) => async (dispatch, getState) => {
  const query = PARAM_GET_SERVICES_INFO(_.isNil(serviceType) ? null : serviceType);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_SERVICE_INFO_GET,
    payload: axios.post(
      API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH + '/get-services-info',
      query,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    ),
    meta: { namespace }
  });
};

export const getSuggestLookup = (
  namespace,
  fieldBelong: number,
  fieldInfo,
  offset: number,
  limit: number
) => async (dispatch, getState) => {
  const params = makeParamsLookupSuggest(fieldBelong, fieldInfo, offset, limit);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_LOOKUP_GET,
    payload: axios.post(params.url, params.query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, fieldBelong }
  });
};

export const getSuggestRelation = (
  namespace,
  fieldBelong: number,
  keySearch: string,
  offset: number,
  limit: number,
  listIdChoice: number[],
  relationFieldId: number
) => async (dispatch, getState) => {
  const params = makeParamsRelationSuggest(
    fieldBelong,
    keySearch,
    offset,
    limit,
    listIdChoice,
    relationFieldId
  );
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_SUGGEST_RELATION_GET,
    payload: axios.post(params.url, params.query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, fieldBelong }
  });
};

export const getServiceRecordByIds = (
  namespace,
  fieldBelong: number,
  recordIds: number[]
) => async (dispatch, getState) => {
  const params = makeParamsGetDataByIds(fieldBelong, recordIds);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_GET_RECORD_BY_IDS,
    payload: axios.post(params.url, params.query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, fieldBelong }
  });
};

export const getRelationData = (
  namespace,
  fieldBelong: number,
  recordIds: number[],
  fieldIds: number[]
) => async (dispatch, getState) => {
  const params = makeParamsGetRelationData(fieldBelong, recordIds, fieldIds);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_FIELD_GET_RELATION_DATA,
    payload: axios.post(params.url, params.query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, fieldBelong }
  });
};

/**
 * reset state
 */
export const reset = (namespace: string) => ({
  type: ACTION_TYPES.DYNAMIC_FIELD_RESET,
  meta: { namespace }
});
