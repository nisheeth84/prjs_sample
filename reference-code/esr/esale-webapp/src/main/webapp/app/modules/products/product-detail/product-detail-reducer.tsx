import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode, AVAILABLE_FLAG, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import StringUtils, { parseErrorRespose, jsonParse } from 'app/shared/util/string-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { PARAM_UPDATE_CUSTOM_FIELD_INFO } from '../constants';
import _ from 'lodash';
import { isJsonString } from '../utils';

export const ACTION_TYPES = {
  PRODUCT_DETAIL_GET: 'productDetail/PRODUCT_DETAIL_GET',
  PRODUCT_DETAIL_DELETE: 'productDetail/PRODUCT_DETAIL_DELETE',
  PRODUCT_DETAIL_CHANGE_HISTORY: 'productDetail/PRODUCT_DETAIL_CHANGE_HISTORY',
  PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO: 'productDetail/PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO', 
  PRODUCT_DETAIL_CHANGE_TO_EDIT: 'productDetail/EDIT',
  PRODUCT_DETAIL_CHANGE_TO_DISPLAY: 'productDetail/DISPLAY',
  CHECK_DELETE_PRODUCTS: 'productDetail/CHECK_DELETE_PRODUCTS',
  PRODUCT_DETAIL_RESET: 'productDetail/PRODUCT_DETAIL_RESET',
  PRODUCT_TRADING_LIST_PRODUCTS_GET: 'productDetail/PRODUCT_TRADING_LIST_PRODUCTS_GET',
  PRODUCT_TRADING_CUSTOM_FIELDS_INFO: 'productDetail/PRODUCT_TRADING_CUSTOM_FIELDS_INFO'
};

export enum ProductAction {
  None,
  RequestDetail,
  RequestTask,
  Error,
  Success,
  UpdateSuccess
}

const initialState = {
  action: ProductAction.None,
  actionDelete: ProductAction.None,
  actionHistory: ProductAction.None,

  errorMessage: null,
  errorItems: null,
  errorMessageChangeStatusSuccess: null,
  errorMessageUpdateCustomFieldsInfo: null,

  fieldInfos: null,
  fieldSearchInfos: null,
  fieldIds: null,
  fieldInfoTabIds: null,

  product: null,
  // productTradings: null,
  productChangeHistory: null,
  productFieldsUnVailable: null,
  checkDeleteProduct: null,
  deleteProducts: null,
  customFieldInfos: null,
  tabInfoIds: null,
  tabListShow: null,
  screenMode: ScreenMode.DISPLAY,

  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  
  customFieldInfoProductTrading: []
};

// API base URL
const productApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

const parseListProductResponse = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (res.errors[0].extensions && res.errors[0].extensions.errors && res.errors[0].extensions.errors.length > 0) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  // const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let productTradingsInfo = null;
  if (res && res.productTradings) {
    productTradingsInfo = res;
  }

  productTradingsInfo.productTradings.forEach((element, idx) => {
    // const productTradingData = element.productTradingData;
    const newElement = {};
    for (const prop in element) {
      if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'productTradingData') {
        newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop] ? element[prop] : null;
      }
    }

    // productTradingData &&
    //   productTradingData.forEach(e => {
    //     newElement[e.key] = e.value;
    //   });

    productTradingsInfo.productTradings[idx] = newElement;
  });

  return { errorMsg, errorCodeList, productTradingsInfo };
};

const parseProductResponse = res => {
  let product = null;
  let filteredUnVailable = [];
  let tabListShow = null;


  let productTradings = {};
  if (res && res.product) {
    product = res.product;
    if (product.productTradings) {
      productTradings = product.productTradings;
      if (productTradings['productTradings']) {
        productTradings['productTradings'].forEach((element, idx) => {
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
          productTradings['productTradings'][idx] = newElement;
        })
      } else {
        productTradings['productTradings'] = [];
      }
      if (productTradings['fieldInfoTab']) {
        productTradings['fieldInfoTab'].forEach(element => {
          element.availableFlag = AVAILABLE_FLAG.WEB_APP_AVAILABLE;
        }) 
      } 
      if (productTradings['fields']) {
        productTradings['fields'].forEach(element => {
          element.availableFlag = AVAILABLE_FLAG.WEB_APP_AVAILABLE;
        }) 
      } 
    } 
  }

  if (res.product && res.product.tabInfo) {
    tabListShow = res.product.tabInfo.filter(tab => {
      return tab.isDisplay === true;
    });
  }
  
  if (product && product.fieldInfo) {
    product.fieldInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
    filteredUnVailable = product.fieldInfo.filter(field => {
      return field.availableFlag === 0;
    });
  }

  return { product, filteredUnVailable, tabListShow, productTradings };
}

const parseDeleteProduct = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const actionDelete = errorMsg.length > 0 ? ProductAction.Error : ProductAction.Success;
  const deleteProducts = res.data.deleteProducts;
  return { errorMsg, actionDelete, deleteProducts };
};

const parseProductHistory = res => {
  const productHistory = res.productHistory;
  return { productHistory };
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

const parseCheckDeleteProduct = res => {
  const actionDelete = ProductAction.Success;
  const checkDeleteProduct = res.checkDeleteProduct ? res.checkDeleteProduct : null;
  return { actionDelete, checkDeleteProduct };
};

const getParamQuery = res => {
  if(res.config.data && isJsonString(res.config.data) && jsonParse(res.config.data) && jsonParse(res.config.data).currentPage !== 1) return true;
  return false;
}

const parseCustomFieldsInfoResponse = res => {
  const fieldInfos = res.customFieldsInfo;
  if (fieldInfos) {
    fieldInfos.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return {fieldInfos };
};

export type ProductDetailState = Readonly<typeof initialState>;

// Reducer
export default (state: ProductDetailState = initialState, action): ProductDetailState => {
  switch (action.type) {
    /* REQUEST */
    case REQUEST(ACTION_TYPES.PRODUCT_DETAIL_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_DETAIL_DELETE): 
    case REQUEST(ACTION_TYPES.CHECK_DELETE_PRODUCTS): 
    {
      return {
        ...state,
        action: ProductAction.RequestDetail,
        errorItems: null,
      };
    }
    case REQUEST(ACTION_TYPES.PRODUCT_DETAIL_CHANGE_HISTORY):
    case REQUEST(ACTION_TYPES.PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        return {
          ...state,
          action: ProductAction.RequestTask,
          errorItems: null,
          messageUpdateCustomFieldInfoSuccess: null,
          messageUpdateCustomFieldInfoError: null
        };
      }

    /* FAILURE */
    case FAILURE(ACTION_TYPES.PRODUCT_DETAIL_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_DETAIL_DELETE):
    case FAILURE(ACTION_TYPES.PRODUCT_DETAIL_CHANGE_HISTORY):
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
            errorItems: errors && errors.length ? errors[0].errorCode : null
          };
        }
      }
    case FAILURE(ACTION_TYPES.PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO):
    {
      const error = parseErrorRespose(action.payload);
      return {
        ...state,
        messageUpdateCustomFieldInfoError: error && error.length ? error[0].errorCode : 'ERR_COM_0050'
      };
    }
      
    /* SUCCESS */
    case SUCCESS(ACTION_TYPES.PRODUCT_DETAIL_GET):{
      const res = parseProductResponse(action.payload.data);
      return {
        ...state,
        product: res.product,
        productFieldsUnVailable: res.filteredUnVailable,
        tabListShow: res.tabListShow,
        // productTradings: res.productTradings
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
    case SUCCESS(ACTION_TYPES.PRODUCT_DETAIL_DELETE):{
      const res = parseDeleteProduct(action.payload.data);
      return {
        ...state,
        actionDelete: res.actionDelete,
        errorMessage: res.errorMsg,
        deleteProducts: res.deleteProducts
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_DETAIL_CHANGE_HISTORY):
    case ACTION_TYPES.PRODUCT_DETAIL_CHANGE_HISTORY:
      {
        const res = parseProductHistory(action.payload.data);
        return {
          ...state,
          productChangeHistory: state.productChangeHistory && getParamQuery(action.payload) ? state.productChangeHistory.concat(res.productHistory) : res.productHistory
        };
      }
    case SUCCESS(ACTION_TYPES.PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO):
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
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_CUSTOM_FIELDS_INFO):
    {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        customFieldInfoProductTrading: res.fieldInfos
      };
    }

    case ACTION_TYPES.PRODUCT_DETAIL_CHANGE_TO_EDIT:
      {
        return {
          ...state,
          screenMode: ScreenMode.EDIT
        };
      }

    case ACTION_TYPES.PRODUCT_DETAIL_CHANGE_TO_DISPLAY:
      {
        return {
          ...state,
          errorItems: [],
          screenMode: ScreenMode.DISPLAY
        };
      }

    case ACTION_TYPES.PRODUCT_DETAIL_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

/* Action */
const getProductDetail = (productId, isOnlyData, isContainDataSummary) => ({
  type: ACTION_TYPES.PRODUCT_DETAIL_GET,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/get-product'}`, {productId, isOnlyData, isContainDataSummary}, {
    headers: { ['Content-Type']: 'application/json' }
  })
});
const deleteProduct = (productIds, setIds) => ({
  type: ACTION_TYPES.PRODUCT_DETAIL_DELETE,
  payload: axios.post(
    `${productApiUrl}/delete-product`, {productIds, setIds},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getProductChangeHistory = (productId, currentPage, limit) => ({
  type: ACTION_TYPES.PRODUCT_DETAIL_CHANGE_HISTORY,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/get-product-history'}`, {productId, currentPage, limit}, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

const paramGetProductTrading = (productId) =>{
  return {
    "isOnlyData": true,
    "searchLocal": null,
    "searchConditions": [],
    "filterConditions": [],
    "orders": [],
    "offset": 0,
    "limit": 30,
    "isFirstLoad": true,
    "selectedTargetType": 0,
    "selectedTargetId": 0,
    "productIdFilters": [productId]
  }
}
// const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
// export const getProductTrading = (productId) => ({
//   type: ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET,
//   payload: axios.post(`${salesApiUrl}/get-product-tradings`, paramGetProductTrading(productId), { headers: { 'Content-Type': 'application/json' } })
// });



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

const updateCustomFieldsInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => ({
  type: ACTION_TYPES.PRODUCT_DETAIL_UPDATE_CUSTOMFIELDSINFO,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'commons/api/update-custom-fields-info'}`, 
  PARAM_UPDATE_CUSTOM_FIELD_INFO(fieldBelong, deleteFields, convertFieldLabel(fields), tabs, deleteFieldsTab, fieldsTab),
  {
    headers: { ['Content-Type']: 'application/json' }
  })
});

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

/* Add store */
export const handleInitProductDetail = (productId, isOnlyData, isContainDataSummary) => async (dispatch, getState) => {
  if (productId != null) {
    await dispatch(getProductDetail(productId, isOnlyData, isContainDataSummary));
  }
};

export const handleInitDeleteProduct = (productIds, setIds) => async (dispatch, getState) => {
  if (productIds != null) {
    await dispatch(deleteProduct(productIds, setIds));
  }
};

export const handleInitProductChangeHistory = (productId, currentPage, limit) => async (dispatch, getState) => {
  if (productId != null) {
    await dispatch(getProductChangeHistory(productId, currentPage, limit));
  }
};

export const handleInitUpdateCustomFieldsInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => async (dispatch, getState) => {
  await dispatch(updateCustomFieldsInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab));
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit ? ACTION_TYPES.PRODUCT_DETAIL_CHANGE_TO_EDIT : ACTION_TYPES.PRODUCT_DETAIL_CHANGE_TO_DISPLAY
});

export const handleUpdateCustomFieldInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => async (
  dispatch,
  getState
) => {
  if (fieldBelong != null) {
    await dispatch(updateCustomFieldsInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab));
  }
};

export const handleReorderField = (dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().productList;
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
  payload: axios.post(`${productApiUrl}/check-delete-product`, { productIds: ids }, { headers: { ['Content-Type']: 'application/json' } })
});

export const handleCheckDeleteProduct = id => async (dispatch, getState) => {
  const ids = [];
  ids.push(id);
  await dispatch(checkDeleteProducts(ids));
};

/**
 * reset state
 */
export const resetState = () => ({
  type: ACTION_TYPES.PRODUCT_DETAIL_RESET
});