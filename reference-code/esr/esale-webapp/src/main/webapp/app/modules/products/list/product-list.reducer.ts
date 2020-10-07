import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import StringUtils from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import {
  PRODUCT_DEF,
  PRODUCT_LIST_ID,
  PRODUCT_SPECIAL_FIELD_NAMES
} from 'app/modules/products/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import * as R from 'ramda';

export const ACTION_TYPES = {
  CREATE_PRODUCT_SET: 'productList/CREATE_PRODUCT_SET',
  CREATE_PRODUCT: 'productList/CREATE_PRODUCT',
  PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'product/CUSTOM_FIELD_INFO_GET_LIST',
  PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT: 'product/CUSTOM_FIELD_INFO_GET_LAYOUT',
  PRODUCT_LIST_PRODUCTS_GET: 'productList/PRODUCTS_GET',
  PRODUCT_LIST_PRODUCTS_UPDATE: 'productList/PRODUCTS_UPDATE',
  PRODUCT_LIST_RESET: 'productList/RESET',
  PRODUCT_LIST_RESET_MESSAGE: 'productList/RESET_MESSAGE',
  PRODUCT_LIST_CHANGE_TO_DISPLAY: 'productList/DISPLAY',
  PRODUCT_LIST_CHANGE_TO_EDIT: 'productList/EDIT',
  PRODUCT_LOCAL_MENU: 'productList/LOCAL_MENU',
  PRODUCT_LIST_CATEGORY: 'productList/PRODUCT_CATEGORY_LIST',
  CHECK_DELETE_PRODUCTS: 'controlSidebar/CHECK_DELETE',
  DELETE_PRODUCTS: 'controlSidebar/DELETE_PRODUCTS',
  DELETE_CATEGORY: 'controlSidebar/DELETE_CATEGORY',
  PRODUCT_LIST_EXPORT: 'productList/PRODUCT_LIST_EXPORT',
  PRODUCT_LIST_MOVE_PRODUCTS: 'productList/PRODUCT_LIST_MOVE_PRODUCTS',
  PRODUCTS_GET_IN_DETAIL_SCREEN_NEXT: 'productList/PRODUCTS_GET_IN_DETAIL_SCREEN_NEXT',
  PRODUCTS_GET_IN_DETAIL_SCREEN_PREV: 'productList/PRODUCTS_GET_IN_DETAIL_SCREEN_PREV'
};

export enum ProductAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: ProductAction.None,
  screenMode: ScreenMode.DISPLAY,
  customFieldInfos: null,
  products: null,
  fieldSearchInfos: null,
  customFieldSearchInfos: null,
  localMenuData: null,
  categories: null,
  checkDeleteProduct: null,
  deleteProducts: null,
  actionDelete: ProductAction.None,
  deleteCategory: null,
  productsInfo: null,
  exportProductMsg: null,
  moveToCategoryProductIds: null,
  moveToCategoryMsg: null,
  isDeleteSuccess: ProductAction.None,
  errorCodeList: null,
  errorItems: [],
  updateProduct: null,
  initializeInfor: null,
  msgSuccess: null,
  fields: null,
  listProductId: [],
  listProductSetId: [],
  isNextPageInDetailProduct: true
};

const getListProductIds = products => {
  const [listProductsSet, listProducts] = R.partition(R.propEq('is_set', true), products);
  const listProductId = R.pluck('product_id', listProducts);
  const listProductSetId = R.pluck('product_id', listProductsSet);
  return { listProductId, listProductSetId };
};

export const parseListProductResponse = res => {
  const action = ProductAction.Success;
  let products = null;
  let fieldInfos = null;
  if (res && res.fieldInfo) {
    fieldInfos = res.fieldInfo;
  }
  if (fieldInfos) {
    fieldInfos.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  let initializeInfor = null;
  let fields = null;
  if (res && res.initializeInfor) {
    fields = res.initializeInfor.fields;
    initializeInfor = res.initializeInfor.initializeInfo;
  }
  if (res.dataInfo && res.dataInfo.products) {
    products = res;
    products.dataInfo.products.forEach((element, idx) => {
      const productData = element.productData;
      const newElement = {};
      for (const prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'productData') {
          switch (prop) {
            case 'createdUserName':
              newElement[PRODUCT_SPECIAL_FIELD_NAMES.createBy] = element[prop];
              break;
            case 'updatedUserName':
              newElement[PRODUCT_SPECIAL_FIELD_NAMES.updateBy] = element[prop];
              break;
            case 'createdUser':
              newElement[PRODUCT_SPECIAL_FIELD_NAMES.createdUserId] = element[prop];
              break;
            case 'updatedUser':
              newElement[PRODUCT_SPECIAL_FIELD_NAMES.updatedUserId] = element[prop];
              break;
            case 'productRelations':
              newElement[PRODUCT_SPECIAL_FIELD_NAMES.productsSets] = element[prop];
              break;
            default:
              newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop]
                ? element[prop]
                : null;
              break;
          }
        }
      }
      productData &&
        productData.forEach(e => {
          switch (e.key) {
            case PRODUCT_SPECIAL_FIELD_NAMES.createBy:
            case PRODUCT_SPECIAL_FIELD_NAMES.updateBy:
              break;
            default:
              newElement[e.key] = e.value;
              break;
          }
        });
      products.dataInfo.products[idx] = newElement;
    });
  }
  return { action, products, initializeInfor, fields };
};

const parseListProductCategoryResponse = res => {
  const action = ProductAction.Success;
  let categories = null;
  if (res['productsCategories'] && res['productsCategories'].length > 0) {
    categories = res['productsCategories'];
  }
  return { action, categories };
};

const parseUpdateProductResponse = res => {
  let products = [];
  if (res && res.length > 0) {
    products = res;
  }
  const action = ProductAction.Success;
  return { action, products };
};

const parseCustomFieldsInfoResponse = (res, type) => {
  const action = ProductAction.Success;
  const fieldInfos = res.customFieldsInfo;
  if (fieldInfos) {
    fieldInfos.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { action, fieldInfos };
};

const parseCheckDeleteProduct = res => {
  const actionDelete = ProductAction.Success;
  const checkDeleteProduct = res.checkDeleteProduct ? res.checkDeleteProduct : null;
  return { actionDelete, checkDeleteProduct };
};

const parseDeleteProduct = (res, state) => {
  const actionDelete = ProductAction.Success;
  const delProducts = res;
  let msg;
  if (delProducts.length > 1) {
    msg = translate('messages.INF_PRO_0002', { n: delProducts.length });
  } else {
    const prd =
      state.products && state.products.dataInfo
        ? state.products.dataInfo.products.find(e => e['product_id'] === delProducts[0])
        : {};
    msg = translate('messages.INF_PRO_0001', { 0: prd && prd['product_name'] });
  }
  return { actionDelete, delProducts, msg };
};

const parseDeleteCategory = res => {
  const actionDelete = ProductAction.Success;
  const delCategory = res;
  return { actionDelete, delCategory };
};

const parseExportProducts = res => {
  const action = ProductAction.Success;
  const productsInfo = res;
  return { action, productsInfo };
};

const parseGeneralApiResponse = res => {
  const action = ProductAction.Success;
  let productIds = null;
  if (res) productIds = res.productIds;
  return { action, productIds };
};

/**
 *
 * @param payload parse error response
 */
export const parseErrorRespose = payload => {
  let errorCodeList = [];
  if (payload.response.data.parameters) {
    const resError = payload.response.data.parameters.extensions;
    if (resError && resError.errors && resError.errors.length > 0) {
      errorCodeList = resError.errors;
    } else if (resError) {
      errorCodeList.push(resError);
    }
  }
  return { errorCodeList };
};

export type ProductListState = Readonly<typeof initialState>;

// Reducer
export default (state: ProductListState = initialState, action): ProductListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_GET):
    case REQUEST(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_NEXT):
    case REQUEST(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_PREV):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_UPDATE):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_PRODUCTS):
    case REQUEST(ACTION_TYPES.DELETE_PRODUCTS):
    case REQUEST(ACTION_TYPES.DELETE_CATEGORY):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_EXPORT):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_MOVE_PRODUCTS):
      return {
        ...state,
        action: ProductAction.Request,
        errorCodeList: null,
        errorItems: []
      };

    case FAILURE(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_NEXT):
    case FAILURE(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_PREV):
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_GET): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProductAction.Error,
        errorCodeList: errorRes.errorCodeList,
        errorItems: errorRes.errorCodeList
      };
    }
    case FAILURE(ACTION_TYPES.CHECK_DELETE_PRODUCTS):
    case FAILURE(ACTION_TYPES.DELETE_PRODUCTS):
    case FAILURE(ACTION_TYPES.DELETE_CATEGORY):
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_EXPORT):
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_MOVE_PRODUCTS): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProductAction.Error,
        errorCodeList: errorRes.errorCodeList
      };
    }
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_UPDATE): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProductAction.Error,
        errorItems: errorRes.errorCodeList
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_EXPORT): {
      const res = parseExportProducts(action.payload.data);
      return {
        ...state,
        productsInfo: res.productsInfo
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_MOVE_PRODUCTS): {
      const res = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        msgSuccess: translate('messages.INF_COM_0003'),
        moveToCategoryProductIds: res.productIds
      };
    }

    case SUCCESS(ACTION_TYPES.DELETE_CATEGORY): {
      const res = parseDeleteCategory(action.payload.data);
      return {
        ...state,
        actionDelete: res.actionDelete,
        deleteCategory: res.delCategory,
        isDeleteSuccess: res.actionDelete,
        msgSuccess: translate('messages.INF_COM_0005')
      };
    }

    case SUCCESS(ACTION_TYPES.CHECK_DELETE_PRODUCTS): {
      const res = parseCheckDeleteProduct(action.payload.data);
      return {
        ...state,
        actionDelete: res.actionDelete,
        checkDeleteProduct: res.checkDeleteProduct
      };
    }

    case SUCCESS(ACTION_TYPES.DELETE_PRODUCTS): {
      const res = parseDeleteProduct(action.payload.data, state);
      return {
        ...state,
        actionDelete: res.actionDelete,
        deleteProducts: res.delProducts,
        isDeleteSuccess: res.actionDelete,
        msgSuccess: res.msg
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST): {
      const res = parseCustomFieldsInfoResponse(
        action.payload.data,
        PRODUCT_DEF.EXTENSION_BELONG_LIST
      );
      return {
        ...state,
        action: res.action,
        customFieldInfos: res.fieldInfos
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_GET): {
      const res = parseListProductResponse(action.payload.data);
      const getListIds = getListProductIds(res.products.dataInfo.products);
      return {
        ...state,
        action: res.action,
        products: res.products,
        initializeInfor: res.initializeInfor,
        fields: res.fields,
        ...getListIds
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_NEXT): {
      const res = parseListProductResponse(action.payload.data);
      const getListIds = getListProductIds(res.products.dataInfo.products);
      return {
        ...state,
        listProductId: R.uniq([...state.listProductId, ...getListIds.listProductId]),
        listProductSetId: R.uniq([...state.listProductSetId, ...getListIds.listProductId])
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCTS_GET_IN_DETAIL_SCREEN_PREV): {
      const res = parseListProductResponse(action.payload.data);
      const getListIds = getListProductIds(res.products.dataInfo.products);
      return {
        ...state,
        listProductId: R.uniq([...getListIds.listProductId, ...state.listProductId]),
        listProductSetId: R.uniq([...getListIds.listProductId, ...state.listProductSetId])
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_CATEGORY): {
      const res = parseListProductCategoryResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        categories: res.categories
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_PRODUCTS_UPDATE): {
      const res = parseUpdateProductResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        updateProduct: res.products,
        msgSuccess: translate('messages.INF_COM_0004')
      };
    }

    case ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: ProductAction.None,
        errorCodeList: null,
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.PRODUCT_LIST_RESET:
      return {
        ...initialState
      };

    case ACTION_TYPES.PRODUCT_LIST_RESET_MESSAGE:
      return {
        ...state,
        msgSuccess: null,
        moveToCategoryProductIds: null,
        errorCodeList: null,
        errorItems: []
      };

    case SUCCESS(ACTION_TYPES.CREATE_PRODUCT_SET): {
      return {
        ...state,
        action: null
      };
    }
    default:
      return state;
  }
};

// API base URL
const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

/**
 * Get custom fields info
 *
 * @param
 */
export const getCustomFieldsInfo = extensionBelong => ({
  type: ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong: PRODUCT_DEF.FIELD_BELONG
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

// use for deleting product
const checkDeleteProducts = ids => ({
  type: ACTION_TYPES.CHECK_DELETE_PRODUCTS,
  payload: axios.post(
    `${productsApiUrl}/check-delete-product`,
    { productIds: ids },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const deleteProducts = (productIds, setIds) => ({
  type: ACTION_TYPES.DELETE_PRODUCTS,
  payload: axios.post(
    `${productsApiUrl}/delete-product`,
    { productIds, setIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleCheckDeleteProduct = ids => async (dispatch, getState) => {
  await dispatch(checkDeleteProducts(ids));
};

export const handleDeleteProducts = (productIds, setIds) => async (dispatch, getState) => {
  await dispatch(deleteProducts(productIds, setIds));
};

/**
 * create product
 *
 * @param
 */
export const createProduct = data => ({
  type: ACTION_TYPES.CREATE_PRODUCT,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: CREATE_PRODUCT(data)
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/create-product'}`, data, {
    headers: { ['Content-Type']: 'application/json' }
  })
});
/**
 * update product
 *
 * @param
 */
export const updateProduct = pramscreat => ({
  type: ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: UPDATE_PRODUCT(pramscreat.productId, pramscreat.data)
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/update-product'}`, pramscreat, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * get products
 *
 * @param key
 */
export const getProducts = params => ({
  type: ACTION_TYPES.PRODUCT_LIST_PRODUCTS_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/get-products`,
    {
      // searchConditions: `${JSON.stringify(params.searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}`,
      searchConditions: params.searchConditions,
      productCategoryId: params.productCategoryId,
      isContainCategoryChild: params.isContainCategoryChild,
      searchLocal: params.searchLocal,
      // orderBy: `${JSON.stringify(params.orderBy).replace(/"(\w+)"\s*:/g, '$1:')}`,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit,
      isOnlyData: params.isOnlyData,
      // filterConditions: `${JSON.stringify(params.filterConditions).replace(/"(\w+)"\s*:/g, '$1:')}`,
      filterConditions: params.filterConditions,
      isUpdateListInfo: params.isUpdateListInfo
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getProductsInDetailScreen = (params, isNext) => ({
  type: ACTION_TYPES[`PRODUCTS_GET_IN_DETAIL_SCREEN_${isNext ? 'NEXT' : 'PREV'}`],
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/get-products`,
    {
      // searchConditions: `${JSON.stringify(params.searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}`,
      searchConditions: params.searchConditions,
      productCategoryId: params.productCategoryId,
      isContainCategoryChild: params.isContainCategoryChild,
      searchLocal: params.searchLocal,
      // orderBy: `${JSON.stringify(params.orderBy).replace(/"(\w+)"\s*:/g, '$1:')}`,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit,
      isOnlyData: true,
      // filterConditions: `${JSON.stringify(params.filterConditions).replace(/"(\w+)"\s*:/g, '$1:')}`,
      filterConditions: params.filterConditions,
      isUpdateListInfo: params.isUpdateListInfo
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const makeConditionSearchDefault = (offset, limit, productCategoryId, isContainCategoryChild) => {
  return {
    searchConditions: [],
    productCategoryId,
    isContainCategoryChild,
    searchLocal: '',
    orderBy: [],
    offset,
    limit,
    isOnlyData: false,
    filterConditions: [],
    isUpdateListInfo: false
  };
};

export const handleInitProductList = (
  offset,
  limit,
  productCategoryId,
  isContainCategoryChild
) => async (dispatch, getState) => {
  await dispatch(
    getProducts(
      makeConditionSearchDefault(offset, limit, productCategoryId, isContainCategoryChild)
    )
  );
};

export const handleSearchProduct = (
  offset: number,
  limit: number,
  productCategoryId: number,
  isContainCategoryChild: boolean,
  params: string | any[],
  filterConditions?: any[],
  orderBy?: any[]
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    productCategoryId,
    isContainCategoryChild
  );
  condition.isOnlyData = true;
  if (productCategoryId) {
    condition.isUpdateListInfo = true;
  }
  if (params && params.length > 0) {
    if (params.constructor === 'test'.constructor) {
      condition.searchLocal = `${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}`; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    } else if (params.constructor === [].constructor) {
      const searchConditions = [];
      for (let i = 0; i < params.length; i++) {
        if (!_.isNil(params[i].fieldRelation)) {
          continue;
        }
        const isArray = Array.isArray(params[i].fieldValue);
        if (
          !params[i].isSearchBlank &&
          (!params[i].fieldValue || params[i].fieldValue.length <= 0)
        ) {
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
        searchConditions.push({
          isNested: false,
          fieldType: params[i].fieldType,
          fieldId: params[i].fieldId,
          isDefault: `${params[i].isDefault}`,
          fieldName: params[i].fieldName,
          fieldValue: val,
          searchType: params[i].searchType,
          searchOption: params[i].searchOption
        });
      }
      condition.searchConditions = searchConditions;
    }
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (isArray && jsonObj[0] && Object.prototype.hasOwnProperty.call(jsonObj[0], 'from')) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          val = filterConditions[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        isNested: false,
        fieldId: filterConditions[i].fieldId,
        fieldType: filterConditions[i].fieldType,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption
      });
    }
  }
  if (orderBy && orderBy.length > 0) {
    const orderByArr = [];
    orderBy.forEach(o => {
      o.value = _.toUpper(o.value);
      orderByArr.push(_.pick(o, ['isNested', 'key', 'value', 'fieldType', 'isDefault']));
    });
    if (getState().dynamicList.data.get(PRODUCT_LIST_ID)) {
      const { fieldInfos } = getState().dynamicList.data.get(PRODUCT_LIST_ID);
      orderByArr.forEach((e, idx) => {
        if (fieldInfos && fieldInfos.fieldInfoPersonals) {
          const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
          if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
            orderByArr[idx].key = `product_data.${e.key}`;
          }
        }
      });
    }
    condition.orderBy.push(...orderByArr);
  }
  await dispatch(getProducts(condition));
};

export const handleSearchProductView = (
  offset: number,
  limit: number,
  productCategoryId: number,
  isContainCategoryChild: boolean,
  params: string | any[],
  filterConditions?: any[],
  orderBy?: any[]
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    productCategoryId,
    isContainCategoryChild
  );
  condition.isOnlyData = true;
  if (params && params.length > 0) {
    if (params.constructor === 'test'.constructor) {
      condition.searchLocal = `${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}`; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    } else if (params.constructor === [].constructor) {
      const searchConditions = [];
      for (let i = 0; i < params.length; i++) {
        const isArray = Array.isArray(params[i].fieldValue);
        if (
          !params[i].isSearchBlank &&
          (!params[i].fieldValue || params[i].fieldValue.length <= 0)
        ) {
          continue;
        }
        let val = null;
        if (params[i].isSearchBlank) {
          val = isArray ? '[]' : '';
        } else if (isArray) {
          val = JSON.stringify(params[i].fieldValue);
        } else {
          val = params[i].fieldValue.toString();
        }
        searchConditions.push({
          fieldType: params[i].fieldType,
          isDefault: `${params[i].isDefault}`,
          fieldName: params[i].fieldName,
          fieldValue: val,
          searchType: params[i].searchType,
          searchOption: params[i].searchOption
        });
      }
      condition.searchConditions = searchConditions;
    }
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      try {
        isArray = _.isString(val) ? _.isArray(JSON.parse(val)) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        val = filterConditions[i].fieldValue.toString();
      }
      condition.filterConditions.push({
        fieldType: `${filterConditions[i].fieldType}`,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        // fieldValue: val.replace('[', '').replace(']', '')
        fieldValue: val
      });
    }
  }
  if (orderBy && orderBy.length > 0) {
    condition.orderBy = orderBy;
  }
  await dispatch(getProducts(condition));
};

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads) params['files'] = [];
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    // filesMap[key] = file[key];
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
    // params['files'].push(file);
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params));
  return data;
};

const trimDataInObj = (obj: object): object => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    newObj[key] = typeof value === 'string' ? obj[key].trim() : obj[key];
  });
  return newObj;
};

export const handleUpdateProduct = (
  idList: string,
  listProduct: any[],
  offset,
  limit,
  productCategoryId,
  isContainCategoryChild,
  conditionSearch,
  filterConditions?: any[],
  orderBy?: any[],
  fileUploads?: any[]
) => async (dispatch, getState) => {
  const { products } = getState().productList;
  let saveEditValuesFilter = [];
  if (products && products.dataInfo.products && products.dataInfo.products.length > 0) {
    saveEditValuesFilter = products.dataInfo.products.filter(item =>
      R.pluck('itemId', listProduct).includes(item['product_id'])
    );
  }
  const { fieldInfos } = getState().dynamicList.data.get(idList);
  const params = [];
  const groupProduct = listProduct.reduce(function(h, obj) {
    h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
    return h;
  }, {});
  for (const prd in groupProduct) {
    if (!Object.prototype.hasOwnProperty.call(groupProduct, prd)) {
      continue;
    }
    const param = {};
    param['productId'] = Number(prd);
    let recordIdx = -1;
    if (saveEditValuesFilter.length > 0) {
      recordIdx = products.dataInfo.products.findIndex(
        e => e['product_id'].toString() === prd.toString()
      );
      if (recordIdx >= 0) {
        param['userId'] = products.dataInfo.products[recordIdx]['user_id'];
        param['updatedDate'] = getValueProp(products.dataInfo.products[recordIdx], 'updatedDate');
      }
    }
    for (let i = 0; i < groupProduct[prd].length; i++) {
      if (
        !fieldInfos ||
        !fieldInfos.fieldInfoPersonals ||
        fieldInfos.fieldInfoPersonals.length <= 0
      ) {
        continue;
      }
      const fieldIdx = fieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === groupProduct[prd][i].fieldId.toString()
      );
      if (fieldIdx < 0) {
        continue;
      }
      const fieldName = fieldInfos.fieldInfoPersonals[fieldIdx].fieldName;
      const fieldType = fieldInfos.fieldInfoPersonals[fieldIdx].fieldType;
      const isDefault = fieldInfos.fieldInfoPersonals[fieldIdx].isDefault;
      if (isDefault) {
        if (
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.createDate &&
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.updateDate &&
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.createBy &&
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.updateBy &&
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.productImageName &&
          fieldName !== PRODUCT_SPECIAL_FIELD_NAMES.productsSets
        ) {
          if (fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay) {
            param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupProduct[prd][i].itemValue;
          } else {
            param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupProduct[prd][i].itemValue
              ? groupProduct[prd][i].itemValue
              : null;
            if (
              param[StringUtils.snakeCaseToCamelCase(fieldName)] === null &&
              (fieldType === 11 || fieldType === 10 || fieldType === 9)
            ) {
              param[StringUtils.snakeCaseToCamelCase(fieldName)] = '';
            }
            if (param[StringUtils.snakeCaseToCamelCase(fieldName)] === null && fieldType === 5) {
              param[StringUtils.snakeCaseToCamelCase(fieldName)] = 0;
            }
          }
        }
      } else {
        if (param['productData'] === null || param['productData'] === undefined) {
          param['productData'] = [];
        }
        const isArray = Array.isArray(groupProduct[prd][i].itemValue);
        const itemValue = isArray
          ? JSON.stringify(groupProduct[prd][i].itemValue)
          : groupProduct[prd][i].itemValue
          ? groupProduct[prd][i].itemValue.toString()
          : null;
        param['productData'].push({
          fieldType: fieldInfos.fieldInfoPersonals[fieldIdx].fieldType.toString(),
          key: fieldName,
          value: itemValue
        });
      }
    }
    // fill other item not display
    if (!Object.prototype.hasOwnProperty.call(param, 'productData')) {
      param['productData'] = [];
    }
    params.push(param);
  }
  const trimParams = params.map(trimDataInObj);
  if (trimParams.length === 0) {
    await dispatch({ type: ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_DISPLAY });
    return;
  }
  await dispatch({
    type: ACTION_TYPES.PRODUCT_LIST_PRODUCTS_UPDATE,
    payload: axios.post(
      `${productsApiUrl + '/update-products'}`,
      buildFormData(trimParams, fileUploads),
      {
        headers: { ['Content-Type']: 'multipart/form-data' }
      }
    )
  });
  const { action } = getState().productList;
  if (action === ProductAction.Success) {
    await dispatch(
      handleSearchProduct(
        offset,
        limit,
        productCategoryId,
        isContainCategoryChild,
        conditionSearch,
        filterConditions,
        orderBy
      )
    );
    await dispatch({ type: ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_DISPLAY });
  }
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.PRODUCT_LIST_CHANGE_TO_DISPLAY
});

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_LIST_RESET
});

export const resetMessageList = () => ({
  type: ACTION_TYPES.PRODUCT_LIST_RESET_MESSAGE
});

export const getListProductCategory = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.PRODUCT_LIST_CATEGORY,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'products/api/get-product-categories'}`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

const deleteCategory = categoryId => ({
  type: ACTION_TYPES.DELETE_CATEGORY,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/delete-product-category'}`,
    {
      productCategoryId: categoryId
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleDeleteCategory = categoryId => async (dispatch, getState) => {
  await dispatch(deleteCategory(categoryId));
};

export const exportProducts = (productIds, orderBy) => ({
  type: ACTION_TYPES.PRODUCT_LIST_EXPORT,
  // payload: axios.post(
  //   `${productsApiUrl}`,
  //   {
  //     query: PARAM_EXPORT_PRODUCTS(productIds, 1, orderBy)
  //   },
  //   { headers: { ['Content-Type']: 'application/json' } }
  // )
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/export-products'}`,
    { productIds, extensionBelong: 1, orderBy },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleExportProducts = (productIds, orderBy) => async (dispatch, getState) => {
  await dispatch(exportProducts(productIds, orderBy));
};

export const moveToCategory = lstProduct => ({
  type: ACTION_TYPES.PRODUCT_LIST_MOVE_PRODUCTS,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/update-products'}`,
    buildFormData(lstProduct, []),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleMoveToCategory = (categoryId, lstData) => async (dispatch, getState) => {
  // const { products } = getState().productList;
  const lstProduct = [];
  lstData.forEach(item => {
    // const productName = products.dataInfo.products.find(x => x['product_id'] === item.productId)['product_name'];
    lstProduct.push({ productId: item.productId, productCategoryId: categoryId });
  });
  await dispatch(moveToCategory(lstProduct));
};

export const handleMoveProductsToCategory = (categoryId, products) => async (
  dispatch,
  getState
) => {
  const lstProduct = [];
  products.forEach(e => {
    const product = {};
    product['productId'] = e.product_id;
    product['productName'] = e.product_name;
    product['productCategoryId'] = categoryId;
    product['updatedDate'] = e.updated_date;
    lstProduct.push(product);
  });
  await dispatch(moveToCategory(lstProduct));
};

export const handleFilterProductsByMenu = (
  offset,
  limit,
  categoryId: number,
  isContainCategoryChild: boolean,
  params?,
  filterConditions?,
  orderBy?,
  isUpdateListView?: boolean,
  isChangePageInDetailScreen?: 'next' | 'prev'
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(offset, limit, categoryId, isContainCategoryChild);
  condition.isOnlyData = true;
  if (params && params.length > 0) {
    if (params.constructor === 'test'.constructor) {
      condition.searchLocal = params;
    } else if (params.constructor === [].constructor) {
      const searchConditions = [];
      for (let i = 0; i < params.length; i++) {
        if (!_.isNil(params[i].fieldRelation)) {
          continue;
        }
        const isArray = Array.isArray(params[i].fieldValue);
        if (
          !params[i].isSearchBlank &&
          (!params[i].fieldValue || params[i].fieldValue.length <= 0)
        ) {
          continue;
        }
        let val = null;
        if (params[i].isSearchBlank) {
          val = isArray ? '[]' : '';
        } else if (isArray) {
          val = JSON.stringify(params[i].fieldValue);
        } else {
          val = params[i].fieldValue.toString();
        }
        if (
          params[i].fieldType.toString() === DEFINE_FIELD_TYPE.DATE ||
          params[i].fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME ||
          params[i].fieldType.toString() === DEFINE_FIELD_TYPE.TIME
        ) {
          if (val && val.startsWith('[') && val.endsWith(']')) {
            val = val.substr(1, val.length - 2);
          }
        }
        searchConditions.push({
          isNested: false,
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
      condition.searchConditions = searchConditions;
    }
  }
  if (isUpdateListView) {
    condition.isUpdateListInfo = isUpdateListView;
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      try {
        isArray = _.isString(val) ? _.isArray(JSON.parse(val)) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        val = filterConditions[i].fieldValue.toString();
      }
      condition.filterConditions.push({
        isNested: false,
        fieldId: filterConditions[i].fieldId,
        fieldType: filterConditions[i].fieldType,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption,
        timeZoneOffset: filterConditions[i].timeZoneOffset
      });
    }
  }

  if (orderBy && orderBy.length > 0) {
    const { fieldInfos } = getState().dynamicList.data.get(PRODUCT_LIST_ID);
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
          orderBy[idx].key = `product_data.${e.key}`;
        }
      }
    });
    condition.orderBy.push(...orderBy);
  }
  if (isChangePageInDetailScreen) {
    dispatch(getProductsInDetailScreen(condition, isChangePageInDetailScreen === 'next'));
  } else {
    await dispatch(getProducts(condition));
  }
};
