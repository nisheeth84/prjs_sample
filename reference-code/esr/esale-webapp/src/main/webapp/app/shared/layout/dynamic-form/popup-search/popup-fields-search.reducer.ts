import axios from 'axios';
import { translate } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, SEARCH_TYPE, SEARCH_OPTION, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import _ from 'lodash';
import {
  makeParamsGetRecordModulo,
  parseResponseGetRecordsModulo,
  isFieldNested,
  getFieldNameExtension,
  getKeyNameService,
  makeParamsGetServiceLayout,
  parseResponseGetServiceLayout
} from 'app/modules/modulo-bridge';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import { DEFINE_FIELD_TYPE } from '../constants';
import { SELECT_TARGET_TYPE, EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import { getFieldNameElastic } from 'app/shared/util/elastic-search-util';
import { mappingFieldSearchOtherService } from './constants';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';

export const ACTION_TYPES = {
  FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET: 'fieldsSearch/FIELD_INFO_PERSONAL_GET',
  FIELDS_SEARCH_CUSTOM_FIELD_GET: 'fieldsSearch/CUSTOM_FIELD_GET',
  FIELDS_SEARCH_SERVICE_INFO_GET: 'fieldsSearch/SERVICE_INFO_GET',
  FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE: 'fieldsSearch/FIELD_INFO_PERSONAL_UPDATE',
  FIELDS_SEARCH_SERVICE_LAYOUT_GET: 'fieldsSearch/FIELDS_SEARCH_SERVICE_LAYOUT_GET',
  FIELDS_SEARCH_RESET: 'fieldsSearch/RESET',
  FIELDS_SEARCH_UPDATE_COMPLETED: 'fieldsSearch/FIELDS_SEARCH_UPDATE_COMPLETED'
};

export const FieldsSearchAction = {
  None: 0,
  Request: 1,
  Error: 2,
  Success: 3,
  UpdateCompleted: 4
};

const initialState = {
  action: FieldsSearchAction.None,
  fieldInfos: null,
  customField: null,
  servicesInfo: null,
  servicesLayout: null,
  errorMessage: null,
  successMessage: null
};

const parseFieldInfoPersonalResponse = res => {
  const fieldInfos = res;
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fieldInfos.fieldInfoPersonals.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

const parseCustomFieldsInfoResponse = res => {
  const fieldInfos = res;
  if (fieldInfos && fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

const parseServiceInfoResponse = res => {
  // let errorMsg = '';
  // if (res.errors && res.errors.length > 0) {
  //   errorMsg = res.errors[0].message;
  // }
  // const action = errorMsg.length > 0 ? FieldsSearchAction.Error : FieldsSearchAction.Success;
  const services = [];
  if (res && res.servicesInfo) {
    services.push(...res.servicesInfo);
  }
  return { services };
};

export type PopupFieldsSearchState = Readonly<typeof initialState>;

// Reducer
export default (state: PopupFieldsSearchState = initialState, action): PopupFieldsSearchState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_SERVICE_INFO_GET):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_SERVICE_LAYOUT_GET):
      return {
        ...state,
        action: FieldsSearchAction.Request,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_SERVICE_INFO_GET):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_SERVICE_LAYOUT_GET):
      return {
        ...state,
        action: FieldsSearchAction.Error,
        errorMessage: parseErrorRespose(action.payload)[0].errorCode,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET): {
      const res = parseFieldInfoPersonalResponse(action.payload.data);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        successMessage: null,
        fieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        errorMessage: null,
        customField: res.fieldInfos,
        successMessage: null
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE):
      return {
        ...state,
        action: FieldsSearchAction.Success,
        successMessage:
          action.meta && action.meta.successMessage
            ? action.meta.successMessage
            : translate('messages.INF_COM_0004')
      };
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_SERVICE_INFO_GET): {
      const res = parseServiceInfoResponse(action.payload.data);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        servicesInfo: res.services
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_SERVICE_LAYOUT_GET): {
      const res = parseResponseGetServiceLayout(action.meta.fieldBelong, action.payload.data);
      return {
        ...state,
        action: FieldsSearchAction.Success,
        servicesLayout: res.recordData
      };
    }
    case ACTION_TYPES.FIELDS_SEARCH_UPDATE_COMPLETED: {
      return {
        ...state,
        action: FieldsSearchAction.UpdateCompleted
      };
    }
    case ACTION_TYPES.FIELDS_SEARCH_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const FS_PARAM_GET_FIELD_INFO_PERSONAL = (
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId
) => {
  return {
    fieldBelong,
    extensionBelong,
    selectedTargetType,
    selectedTargetId
  };
};
export const FS_PARAM_UPDATE_FIELD_INFO_PERSONAL = (
  fieldInfos,
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId
) => ({
  fieldBelong,
  extensionBelong,
  fieldInfos,
  selectedTargetType: selectedTargetType ? selectedTargetType : 0,
  selectedTargetId: selectedTargetId ? selectedTargetId : 0
});

export const FS_PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong => ({ fieldBelong });

export const FS_PARAM_GET_SERVICES_INFO = (serviceType: number) => ({ serviceType });

/**
 * Get field info personals
 *
 * @param
 */
export const getFieldInfoPersonals = fieldBelong => ({
  type: ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-field-info-personals`,
    {
      fieldBelong,
      extensionBelong: 2,
      selectedTargetType: 0,
      selectedTargetId: 0
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Get custom fields info
 *
 * @param
 */
export const getCustomFieldsInfo = fieldBelong => ({
  type: ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getServicesInfo = () => async (dispatch, getState) => {
  const query = FS_PARAM_GET_SERVICES_INFO(null);
  await dispatch({
    type: ACTION_TYPES.FIELDS_SEARCH_SERVICE_INFO_GET,
    payload: axios.post(commonsApiUrl + '/get-services-info', query, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

export const getServiceLayout = fieldBelong => async (dispatch, getState) => {
  const query = makeParamsGetServiceLayout(fieldBelong);
  if (_.isEmpty(query.url)) {
    return;
  }
  await dispatch({
    type: ACTION_TYPES.FIELDS_SEARCH_SERVICE_LAYOUT_GET,
    payload: axios.post(
      query.url,
      {},
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    ),
    meta: { fieldBelong }
  });
};

/**
 * update field info personals
 *
 * @param key
 */
export const updateFieldInfoPersonals = (
  objParam,
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId
) => ({
  type: ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE,
  payload: axios.post(
    `${commonsApiUrl}/update-field-info-personals`,
    FS_PARAM_UPDATE_FIELD_INFO_PERSONAL(
      objParam,
      fieldBelong,
      extensionBelong,
      selectedTargetType,
      selectedTargetId
    ),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleUpdateField = (
  listField: any[],
  fieldBelong,
  extensionBelong?,
  selectedTargetType?,
  selectedTargetId?
) => async (dispatch, getState) => {
  if (listField && listField.length > 0) {
    const objParam = [];
    listField.forEach(el => {
      objParam.push({
        fieldId: el.fieldId,
        fieldOrder: el.fieldOrder,
        relationFieldId: el.relationFieldId
      });
    });
    if (
      selectedTargetType &&
      (selectedTargetType === SELECT_TARGET_TYPE.ALL_EMPLOYEE ||
        selectedTargetType === SELECT_TARGET_TYPE.EMPLOYEE_QUIT_JOB ||
        selectedTargetType === SELECT_TARGET_TYPE.DEPARTMENT)
    ) {
      selectedTargetId = 0;
      selectedTargetType = 0;
    }
    await dispatch(
      updateFieldInfoPersonals(
        objParam,
        fieldBelong,
        extensionBelong,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().popupFieldsSearch;
    if (action === FieldsSearchAction.Success) {
      await dispatch(getFieldInfoPersonals(fieldBelong));
      const lastAction = getState().popupFieldsSearch.action;
      if (lastAction === FieldsSearchAction.Success) {
        await dispatch({
          type: SUCCESS(ACTION_TYPES.FIELDS_SEARCH_FIELD_INFO_PERSONAL_UPDATE),
          payload: {},
          meta: {
            successMessage: translate('messages.INF_COM_0004')
          }
        });
      }
    }
    dispatch({
      type: ACTION_TYPES.FIELDS_SEARCH_UPDATE_COMPLETED,
      payload: {}
    });
  }
};

const searchOtherService = async (url, param, fieldBelong) => {
  const resData = await axios
    .post(url, param, { headers: { ['Content-Type']: 'application/json' } })
    .then(response => {
      return parseResponseGetRecordsModulo(fieldBelong, response.data);
    })
    .catch(err => console.log(err));

  return resData;
};

const buildSearchCondition = (params, fieldBelong) => {
  const searchConditions = [];
  for (let i = 0; i < params.length; i++) {
    if (!_.isNil(params[i].fieldRelation)) {
      continue;
    }
    const isArray = Array.isArray(params[i].fieldValue);
    if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
      continue;
    }
    let val = null;
    if (params[i].isSearchBlank) {
      val = isArray ? '[]' : '';
    } else if (isArray) {
      // spe
      if (params[i].fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
        params[i].fieldValue.forEach((element, idx) => {
          if (element === '0') {
            params[i].fieldValue[idx] = 'false';
          } else {
            params[i].fieldValue[idx] = 'true';
          }
        });
      }
      let jsonVal = params[i].fieldValue;
      if (
        jsonVal.length > 0 &&
        jsonVal[0] &&
        (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
          Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
      ) {
        jsonVal = jsonVal[0];
      }
      val = JSON.stringify(jsonVal);
    } else {
      val = params[i].fieldValue.toString();
    }
    if (!params[i].isDefault && !_.toString(params[i].fieldName).includes('.')) {
      params[i].fieldName = `${getFieldNameExtension(fieldBelong)}.${params[i].fieldName}`;
    }
    searchConditions.push({
      fieldType: params[i].fieldType,
      fieldId: params[i].fieldId,
      isDefault: `${params[i].isDefault}`,
      fieldName: params[i].fieldName,
      fieldValue: val,
      searchType: params[i].searchType,
      searchOption: params[i].searchOption,
      timeZoneOffset: params[i].timeZoneOffset
    });
  }
  return searchConditions;
};

export const addConditionRelation = async (listFieldCondition: any) => {
  if (!listFieldCondition || listFieldCondition.length < 1) {
    return listFieldCondition;
  }
  const listFieldGroup = _.groupBy(
    listFieldCondition.filter(e => e.relationFieldId > 0),
    'relationFieldId'
  );
  if (!listFieldGroup) {
    return listFieldCondition;
  }
  const relationResult = [];
  for (const prop in listFieldGroup) {
    if (!Object.prototype.hasOwnProperty.call(listFieldGroup, prop)) {
      continue;
    }
    const searchConditions = [];
    const params = listFieldGroup[prop];
    if (
      !params ||
      params.length < 1 ||
      !params[0].fieldRelation ||
      !params[0].fieldRelation.relationData
    ) {
      continue;
    }
    const fBelong = params[0].fieldRelation.relationData.fieldBelong;
    const relationName = `${getFieldNameExtension(params[0].fieldRelation.fieldBelong)}.${
      params[0].fieldRelation.fieldName
      }`;
    for (let i = 0; i < params.length; i++) {
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      if (!params[i].isDefault && !_.toString(params[i].fieldName).includes('.')) {
        params[i].fieldName = `${getFieldNameExtension(fBelong)}.${params[i].fieldName}`;
      }
      const optParam = {
        fieldType: params[i].fieldType,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      };
      if (fBelong === FIELD_BELONG.EMPLOYEE) {
        optParam['fieldId'] = params[i].fieldId;
        optParam['isNested'] = isFieldNested(params[i]);
      }
      searchConditions.push(optParam);
    }
    if (searchConditions.length < 1) {
      continue;
    }
    const requestInfo = makeParamsGetRecordModulo(fBelong, searchConditions, 0, 1000);
    const resData = await searchOtherService(requestInfo.url, requestInfo.query, fBelong);
    const objSearch = { key: relationName, fieldId: params[0].fieldRelation.fieldId, value: [0] };
    if (
      resData &&
      resData.recordData &&
      resData.recordData.records &&
      resData.recordData.records.length > 0
    ) {
      objSearch.value = resData.recordData.records.map(e => {
        return e.recordId;
      });
    }
    relationResult.push(objSearch);
  }
  relationResult.forEach(el => {
    const idx = listFieldCondition.findIndex(o =>
      StringUtils.equalPropertyName(el.key, el.fieldName)
    );
    if (idx < 0) {
      listFieldCondition.push({
        fieldId: el.fieldId,
        isDefault: false,
        fieldType: +DEFINE_FIELD_TYPE.RELATION,
        fieldName: el.key,
        fieldValue: el.value,
        searchType: SEARCH_TYPE.LIKE,
        searchOption: SEARCH_OPTION.OR
      });
    } else {
      listFieldCondition[idx].fieldValue = el.value;
    }
  });
  return listFieldCondition;
};

export const addConditionSubService = async (
  listFieldCondition: {}[],
  listInputCondition: any[],
  customFieldsInfo: {}[],
  mainBelong: number,
  subBelong: number
) => {
  const conditions = [];
  listInputCondition.forEach(e => {
    if (
      e.fieldRelation &&
      e.fieldRelation.relationData &&
      e.fieldRelation.relationData &&
      e.fieldRelation.relationData.fieldBelong
    ) {
      e.fieldName = getFieldNameElastic(
        e,
        getFieldNameExtension(+e.fieldRelation.relationData.fieldBelong)
      );
    } else {
      e.fieldName = getFieldNameElastic(e, getFieldNameExtension(subBelong));
    }
    if (e.isSearchBlank) {
      e.fieldValue = '';
    }
    conditions.push(e);
  });
  await addConditionRelation(conditions);
  const searchCondition = buildSearchCondition(conditions, subBelong);
  if (!searchCondition || searchCondition.length < 1) {
    return;
  }
  const requestInfo = makeParamsGetRecordModulo(subBelong, searchCondition, 0, 1000);
  let fBelong = subBelong;
  // special case
  if (
    (mainBelong === FIELD_BELONG.ACTIVITY || mainBelong === FIELD_BELONG.BUSINESS_CARD) &&
    subBelong === FIELD_BELONG.PRODUCT_TRADING
  ) {
    requestInfo.url = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activity-product-tradings-histories`;
    delete requestInfo.query.filterConditions;
    delete requestInfo.query['orders'];
    delete requestInfo.query.offset;
    delete requestInfo.query.limit;
    if (requestInfo.query.searchConditions) {
      requestInfo.query.searchConditions.forEach(e => delete e.fieldId);
    }
    fBelong = FIELD_BELONG.ACTIVITY;
  }
  if (mainBelong === FIELD_BELONG.SCHEDULE && subBelong === FIELD_BELONG.MILE_STONE) {
    if (_.get(requestInfo, 'query.searchCondition')) {
      _.get(requestInfo, 'query.searchCondition').forEach(e => delete e.fieldId);
    }
  }

  // resole search customer DISPLAY_CHILD_CUSTOMERS start
  if (mainBelong === FIELD_BELONG.CUSTOMER || subBelong === FIELD_BELONG.CUSTOMER) {
    if (requestInfo.query.searchConditions) {
      requestInfo.query.searchConditions.forEach(e => {
        if (e.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS) {
          e.fieldValue = "true"
        }
      });
    }
  }
  // resole search customer DISPLAY_CHILD_CUSTOMERS end

  const resData = await searchOtherService(requestInfo.url, requestInfo.query, fBelong);
  const fieldType =
    mainBelong === FIELD_BELONG.ACTIVITY
      ? +DEFINE_FIELD_TYPE.RADIOBOX
      : +DEFINE_FIELD_TYPE.CHECKBOX;
  const objSearch = {
    fieldId: _.get(
      _.find(customFieldsInfo, {
        fieldBelong: mainBelong,
        fieldName: getKeyNameService(mainBelong)
      }),
      'fieldId'
    ),
    isDefault: true,
    fieldType,
    fieldName: getKeyNameService(mainBelong),
    fieldValue: ['0'],
    searchType: SEARCH_TYPE.LIKE,
    searchOption: SEARCH_OPTION.OR
  };
  if (
    resData &&
    resData.recordData &&
    resData.recordData.records &&
    resData.recordData.records.length > 0
  ) {
    if (mainBelong === FIELD_BELONG.BUSINESS_CARD && subBelong === FIELD_BELONG.ACTIVITY) {
      const tmpFieldValue = [];
      resData.recordData.records.forEach(e => {
        if (!_.isEmpty(e.businessCards)) {
          e.businessCards.forEach(businessCards => {
            tmpFieldValue.push(_.toString(businessCards.businessCardId));
          });
        } else {
          tmpFieldValue.push(_.toString(0));
        }
      });
      objSearch.fieldValue = tmpFieldValue;
    } else {
      objSearch.fieldValue = resData.recordData.records.map(e => {
        return _.toString(e.recordId);
      });
    }
  }


  if (_.find(mappingFieldSearchOtherService, { mainFieldBelong: mainBelong })) {
    const mapping = _.find(mappingFieldSearchOtherService, { mainFieldBelong: mainBelong });
    if (mapping.subFields && _.find(mapping.subFields, { fieldBelong: subBelong })) {
      objSearch.fieldName = _.get(
        _.find(mapping.subFields, { fieldBelong: subBelong }),
        'fieldName'
      );
    }
  }
  const idx = listFieldCondition.findIndex(e => _.get(e, 'fieldName') === objSearch.fieldName);
  if (idx >= 0 && _.isArray(_.get(listFieldCondition[idx], 'fieldValue'))) {
    listFieldCondition[idx]['fieldValue'].push(...objSearch.fieldValue);
  } else {
    listFieldCondition.push(objSearch);
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.FIELDS_SEARCH_RESET
});
