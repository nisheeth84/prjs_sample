import axios from 'axios';
import _ from 'lodash';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import StringUtils, { jsonParse, parseErrorRespose } from 'app/shared/util/string-utils';
import { isJsonString } from '../utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { PARAM_UPDATE_CUSTOM_FIELD_INFO } from '../constants';


export const ACTION_TYPES = {
  PRODUCT_SET_DETAIL_GET: 'productSetDetail/PRODUCT_SET_DETAIL_GET',
  PRODUCT_SET_DETAIL_GET_QUERY: 'productSetDetail/PRODUCT_SET_DETAIL_GET_QUERY',
  PRODUCT_SET_DETAIL_CHANGE_TO_EDIT: 'productSetDetail/EDIT',
  PRODUCT_SET_DETAIL_CHANGE_TO_DISPLAY: 'productSetDetail/DISPLAY',
  PRODUCT_SET_DETAIL_TRADING_PRODUCTS: 'productSetDetail/PRODUCT_SET_DETAIL_TRADING_PRODUCTS',
  PRODUCT_SET_DETAIL_HISTORY: 'productSetDetail/HISTORY',
  PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO: 'productSetDetail/PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO',
  PRODUCT_SET_DETAIL_RESET: 'productSetDetail/PRODUCT_SET_DETAIL_RESET',
  CHECK_DELETE_PRODUCTS: 'productSetDetail/CHECK_DELETE_PRODUCTS',
  DELETE_PRODUCTS: 'productSetDetail/DELETE_PRODUCTS',
  PRODUCT_TRADING_CUSTOM_FIELDS_INFO: 'productSetDetail/PRODUCT_TRADING_CUSTOM_FIELDS_INFO'

};

export enum ProductAction {
  None,
  RequestDetail,
  RequestPopup,
  ErrorList,
  ErrorPopup,
  DoneList,
  DonePopup,
  RequestCustomer,
  RequestTask,
  Error,
  Success,
  UpdateSuccess
}

const initialState = {
  action: ProductAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessageInList: null,
  errorItems: null,
  errorMessage: null,
  checkDeleteProduct: null,
  fieldIds: null,
  tabInfoIds: null,
  fieldInfoTabIds: null,
  fieldInfos: null,
  fieldInfoProduct: null,
  fieldInfoProductSet: null,
  task: null,
  tabListShow: null,
  groups: null,
  tradingProducts: null,
  changeHistory: null,
  productSetHistory: null,
  productSet: null,
  productSetFieldsUnVailable: [],
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  customFieldInfoProductTrading: []
};

const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;

const parseCustomFieldsInfoResponse = res => {
  const fieldInfos = res.customFieldsInfo;
  if (fieldInfos) {
    fieldInfos.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return {fieldInfos };
};
const parseGetProductSetResponse = res => {
  let productSet = null;
  let filteredUnVailable = [];
  let tabListShow = null;

  if (res && res.productSet) {
    productSet = res.productSet;
    if (productSet && productSet.dataInfo && productSet.dataInfo.productTradings && productSet.dataInfo.productTradings.productTradings) {
      productSet.dataInfo.productTradings.productTradings.forEach((element, idx) => {
        const productTradingData = element.productTradingData;
        const newElement = {};
        for (const prop in element) {
          if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'productTradingData') {
            newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop] ? element[prop] : null;
          }
        }
        productTradingData &&
          productTradingData.forEach(e => {
            newElement[e.key] = e.value;
          });
          productSet.dataInfo.productTradings.productTradings[idx] = newElement;
      })
    } else if (productSet && productSet.dataInfo && productSet.dataInfo.productTradings) {
      productSet.dataInfo.productTradings.productTradings = [];
    }
  }

  if (res.productSet && res.productSet.tabInfo) {
    tabListShow = res.productSet.tabInfo.filter(tab => {
      return tab.isDisplay === true;
    });
  }

  if (res.productSet && res.productSet.fieldInfoProduct) { 
    filteredUnVailable = res.productSet.fieldInfoProduct.filter(field => {
      return field.availableFlag === 0;
    });
  }

  return { productSet, filteredUnVailable, tabListShow };
};

const parseErrorUpdate = res => {
  const errorData = [];
  if (res.errors && res.errors.length > 0) {
    res.errors.map(item => {
      if (item.extensions) {
        item.extensions.errors.map(error => {
          errorData.push(error.errorCode);
        });
      }
    });
  }
  return errorData.filter((item, index) => errorData.indexOf(item) === index);
};

const parseUpdateCustomFieldInfo = res => {
  const error = parseErrorUpdate(res); 
  let fieldIds = null;
  let tabInfoIds = null;
  let fieldInfoTabIds = null;

  if(res.updateCustomFieldsInfo){
    fieldIds = res.updateCustomFieldsInfo.fieldIds;
    tabInfoIds = res.updateCustomFieldsInfo.tabInfoIds;
    fieldInfoTabIds = res.updateCustomFieldsInfo.fieldInfoTabIds;
  }

  return { error, fieldIds, tabInfoIds, fieldInfoTabIds };
};

const parseProductHistory = res => {
  const productSetHistory = res.productSetHistory;
  return { productSetHistory };
};

const parseCheckDeleteProduct = res => {
  const actionDelete = ProductAction.Success;
  const checkDeleteProduct = res.checkDeleteProduct ? res.checkDeleteProduct : null;
  return { actionDelete, checkDeleteProduct };
};

const getParamQuery = res => {
  if(res.config.data && isJsonString(res.config.data) && jsonParse(res.config.data) && jsonParse(res.config.data).currentPage !== 1) return true;
  return false;
}

const convertFieldLabel = (fields: any[]) => {
  const listField = [];
  if (!fields) {
    return listField;
  }
  fields.forEach(e => {
    const obj = _.cloneDeep(e);
    delete obj.columnWidth;

    if (!_.isString(obj.fieldLabel)) {
      obj.fieldLabel = JSON.stringify(obj.fieldLabel);
    }
    if (_.has(obj, 'fieldItems') && _.isArray(obj.fieldItems)) {
      obj.fieldItems.forEach((item, idx) => {
        if (_.has(item, 'itemLabel') && !_.isString(item.itemLabel)) {
          obj.fieldItems[idx].itemLabel = JSON.stringify(item.itemLabel);
        }
      });
    }
    if (_.toString(obj.fieldType) === DEFINE_FIELD_TYPE.LOOKUP && obj.lookupData && obj.lookupData.itemReflect) {
      obj.lookupData.itemReflect.forEach((item, idx) => {
        if (_.has(item, 'fieldLabel') && !_.isString(item.fieldLabel)) {
          obj.lookupData.itemReflect[idx].itemLabel = JSON.stringify(item.fieldLabel);
        }
      });
    }
    listField.push(obj);
  });
  return listField;
};

export type ProductSetDetailState = Readonly<typeof initialState>;

export default (state: ProductSetDetailState = initialState, action): ProductSetDetailState => {
  switch (action.type) {

    case REQUEST(ACTION_TYPES.PRODUCT_SET_DETAIL_HISTORY):
    case REQUEST(ACTION_TYPES.PRODUCT_SET_DETAIL_GET_QUERY):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_PRODUCTS):
      return {
        ...state,
        action: ProductAction.RequestDetail,
        errorItems: null,
      };
    case REQUEST(ACTION_TYPES.PRODUCT_SET_DETAIL_TRADING_PRODUCTS):
      return {
        ...state,
        action: ProductAction.RequestTask,
        errorItems: null,
      };
    case REQUEST(ACTION_TYPES.PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        return {
          ...state,
          action: ProductAction.RequestTask,
          errorItems: null,
          messageUpdateCustomFieldInfoSuccess: null,
          messageUpdateCustomFieldInfoError: null
        };
      }
  

    case FAILURE(ACTION_TYPES.PRODUCT_SET_DETAIL_GET_QUERY):
    case FAILURE(ACTION_TYPES.PRODUCT_SET_DETAIL_HISTORY):
    case FAILURE(ACTION_TYPES.PRODUCT_SET_DETAIL_TRADING_PRODUCTS):
    case FAILURE(ACTION_TYPES.CHECK_DELETE_PRODUCTS):
      {
        const errorMes = action.payload.message;
        let errors = [];
        if (action.payload.response.data.parameters) {
          const resError = action.payload.response.data.parameters.extensions;
          if (resError.errors) {
            errors = resError.errors;
          }
        }
        {
          return {
            ...state,
            action: ProductAction.Error,
            errorMessage: errorMes,
            errorItems: errors && errors[0] ? errors[0].errorCode : null
          };
        }
      }
    case FAILURE(ACTION_TYPES.PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        const error = parseErrorRespose(action.payload);
        return {
          ...state,
          messageUpdateCustomFieldInfoError: error && error.length ? error[0].errorCode : 'ERR_COM_0050'
        };
      }

    case SUCCESS(ACTION_TYPES.PRODUCT_SET_DETAIL_GET_QUERY): {
      const res = parseGetProductSetResponse(action.payload.data);
      return {
        ...state,
        productSet: res.productSet,
        productSetFieldsUnVailable: res.filteredUnVailable,
        tabListShow: res.tabListShow
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_SET_DETAIL_HISTORY): 
    {
      const res = parseProductHistory(action.payload.data);
      return {
        ...state,
        productSetHistory: state.productSetHistory && getParamQuery(action.payload) ? state.productSetHistory.concat(res.productSetHistory) : res.productSetHistory
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        const res = parseUpdateCustomFieldInfo(action.payload.data);

        return {
          ...state,
          action: ProductAction.UpdateSuccess,
          fieldIds: res.fieldIds,
          tabInfoIds: res.tabInfoIds,
          fieldInfoTabIds: res.fieldInfoTabIds,
          messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004'
        };
      }

    case SUCCESS(ACTION_TYPES.CHECK_DELETE_PRODUCTS): {
      const res = parseCheckDeleteProduct(action.payload.data);
      return {
        ...state,
        action: res.actionDelete,
        checkDeleteProduct: res.checkDeleteProduct
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_CUSTOM_FIELDS_INFO):
      {
        const res = parseCustomFieldsInfoResponse(action.payload.data);
        return {
          ...state,
          customFieldInfoProductTrading: res.fieldInfos
        };
      }

    case ACTION_TYPES.PRODUCT_SET_DETAIL_TRADING_PRODUCTS:
      return {
        ...state,
        tradingProducts: null
      };
    case ACTION_TYPES.PRODUCT_SET_DETAIL_CHANGE_TO_DISPLAY:
      return {
        ...state,
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      };

    case ACTION_TYPES.PRODUCT_SET_DETAIL_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.PRODUCT_SET_DETAIL_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const getProductSet = productSetId => ({
  type: ACTION_TYPES.PRODUCT_SET_DETAIL_GET_QUERY,
  payload: axios.post(
    `${productsApiUrl}/get-product-set`, {productId: productSetId, isContainDataSummary: true},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getProductSetDetailHistory = (productId, currentPage, limit) => ({
  type: ACTION_TYPES.PRODUCT_SET_DETAIL_HISTORY,
  payload: axios.post(
    `${productsApiUrl}/get-product-set-history`, {productId, currentPage, limit},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getTradingProducts = productId => ({
  type: ACTION_TYPES.PRODUCT_SET_DETAIL_TRADING_PRODUCTS,
});

const updateCustomFieldsInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => ({
  type: ACTION_TYPES.PRODUCT_SET_DETAIL_UPDATE_CUSTOMFIELDSINFO,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'commons/api/update-custom-fields-info'}`, 
  PARAM_UPDATE_CUSTOM_FIELD_INFO(fieldBelong, deleteFields, convertFieldLabel(fields), tabs, deleteFieldsTab, fieldsTab),
  {
    headers: { ['Content-Type']: 'application/json' }
  })
});



export const handleInitUpdateCustomFieldsInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => async (dispatch, getState) => {
  await dispatch(updateCustomFieldsInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab));
};

export const handleInitTradingProducts = (param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getTradingProducts(param));
  }
};

export const handleInitProductSetHistory = (productId, currentPage, limit) => async (dispatch, getState) => {
  if (productId != null) {
    await dispatch(getProductSetDetailHistory(productId, currentPage, limit));
  }
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit ? ACTION_TYPES.PRODUCT_SET_DETAIL_CHANGE_TO_EDIT : ACTION_TYPES.PRODUCT_SET_DETAIL_CHANGE_TO_DISPLAY
});

export const handleInitGetProductSet = productSetId => async (dispatch, getState) => {
  await dispatch(getProductSet(productSetId));
};

export const handleReorderField = (dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().productSetData;
  const objectFieldInfos = JSON.parse(JSON.stringify(fieldInfos));

  if (objectFieldInfos && objectFieldInfos.fieldInfoPersonals && objectFieldInfos.fieldInfoPersonals.length > 0) {
    const objParam = [];
    const tempObject = objectFieldInfos.fieldInfoPersonals.splice(dragIndex, 1, objectFieldInfos.fieldInfoPersonals[dropIndex])[0]; // get the item from the array
    objectFieldInfos.fieldInfoPersonals.splice(dropIndex, 1, tempObject);
    for (let i = 0; i < objectFieldInfos.fieldInfoPersonals.length; i++) {
      objParam.push({ fieldId: objectFieldInfos.fieldInfoPersonals[i].fieldId, fieldOrder: i + 1 });
    }
    await dispatch(objParam);
  }
};

// use for deleting product
const checkDeleteProducts = ids => ({
  type: ACTION_TYPES.CHECK_DELETE_PRODUCTS,
  payload: axios.post(`${productsApiUrl}/check-delete-product`, { productIds: ids }, { headers: { ['Content-Type']: 'application/json' } })
});

export const handleCheckDeleteProduct = id => async (dispatch, getState) => {
  const ids = [];
  ids.push(id);
  await dispatch(checkDeleteProducts(ids));
};

export const getCustomFieldsInfoProductTrading = () => ({
  type: ACTION_TYPES.PRODUCT_TRADING_CUSTOM_FIELDS_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong: FIELD_BELONG.PRODUCT_TRADING
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_SET_DETAIL_RESET
});