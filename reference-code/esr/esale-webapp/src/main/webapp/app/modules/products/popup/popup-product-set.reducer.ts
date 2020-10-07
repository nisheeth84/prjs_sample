import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import * as R from 'ramda';
import axios from 'axios';

export const ACTION_TYPES = {
  PRODUCT_SET_GET_LAYOUT: 'productSet/GET_LAYOUT',
  PRODUCT_SET_CREATE: 'productSet/CREATE',
  PRODUCT_SET_RESET: 'productSet/RESET',
  GET_PRODUCT_SET: 'productSet/GET_PRODUCT_SET',
  GET_PRODUCT: 'productSet/GET_PRODUCT',
  PRODUCT_SET_UPDATE: 'productSet/PRODUCT_SET_UPDATE',
  PRODUCT_SET_RESET_MESSAGE: 'productSet/PRODUCT_SET_RESET_MESSAGE'
};

export enum ProductSetAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: ProductSetAction.None,
  tabInfo: null,
  fieldInfo: null,
  fieldInfoProductSet: null,
  fieldInfoProduct: null,
  dataInfo: null,
  errorItems: [],
  successMessage: null,
  isCreateProductSetSuccess: null,
  productIdCreated: null,
  products: [],
  errorCode: null
};

export const parseErrorRespose = payload => {
  let errorCodeList = [];
  let errorCode;
  if (payload.response.data.parameters) {
    const resError = payload.response.data.parameters.extensions;
    if (resError && resError.errors && resError.errors.length > 0) {
      errorCodeList = resError.errors;
      const err = resError.errors.find(x => x.item === '');
      if (err && err.errorCode) {
        errorCode = err.errorCode;
      }
    } else if (resError) {
      errorCodeList.push(resError);
    }
  }
  return { errorCodeList, errorCode };
};

const parseProductSetLayoutResponse = res => {
  let dataInfo = null;
  let fieldInfoProductSet = null;
  let fieldInfoProduct = null;

  if (res.productSetLayout) {
    dataInfo = res.productSetLayout.dataInfo;

    if (res.productSetLayout.fieldInfoProductSet) {
      fieldInfoProductSet = res.productSetLayout.fieldInfoProductSet.filter(field => {
        return field.availableFlag !== 0;
      });
    }

    if (res.productSetLayout.fieldInfoProduct) {
      fieldInfoProduct = res.productSetLayout.fieldInfoProduct.filter(field => {
        return field.availableFlag !== 0;
      });
    }
  }

  return { dataInfo, fieldInfoProductSet, fieldInfoProduct };
};

const parseCreateProductSetResponse = res => {
  const action = ProductSetAction.Success;
  const productId = res;
  return { action, productId };
};

const parseGetProductSetResponse = response => {
  let fieldInfoProductSet = null;
  let fieldInfoProduct = null;
  const action = ProductSetAction.Success;
  const res = response.productSet;
  const dataInfo = res.dataInfo;
  const tabInfo = res.tabInfo;

  if (res.fieldInfoProductSet) {
    fieldInfoProductSet = res.fieldInfoProductSet.filter(field => {
      return field.availableFlag !== 0;
    });
  }

  if (res.fieldInfoProduct) {
    fieldInfoProduct = res.fieldInfoProduct.filter(field => {
      return field.availableFlag !== 0;
    });
  }

  return { action, dataInfo, fieldInfoProductSet, fieldInfoProduct, tabInfo };
};

const parseGetProductResponse = response => {
  const action = ProductSetAction.Success;
  let products = [];
  const product = response[0];
  if (product.isSet === 'true') {
    products = product.productRelations;
  } else {
    products = [product];
  }
  return { action, products };
};

export type PopupProductSetState = Readonly<typeof initialState>;

export default (state: PopupProductSetState = initialState, action): PopupProductSetState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.PRODUCT_SET_GET_LAYOUT):
    case REQUEST(ACTION_TYPES.PRODUCT_SET_CREATE):
    case REQUEST(ACTION_TYPES.GET_PRODUCT_SET):
    case REQUEST(ACTION_TYPES.GET_PRODUCT):
    case REQUEST(ACTION_TYPES.PRODUCT_SET_UPDATE):
      return {
        ...state,
        action: ProductSetAction.Request,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.PRODUCT_SET_GET_LAYOUT):
    case FAILURE(ACTION_TYPES.PRODUCT_SET_CREATE):
    case FAILURE(ACTION_TYPES.GET_PRODUCT_SET):
    case FAILURE(ACTION_TYPES.GET_PRODUCT):
    case FAILURE(ACTION_TYPES.PRODUCT_SET_UPDATE): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProductSetAction.Error,
        errorItems: errorRes.errorCodeList,
        errorCode: errorRes.errorCode ? errorRes.errorCode : null
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_SET_GET_LAYOUT): {
      const res = parseProductSetLayoutResponse(action.payload.data);
      return {
        ...state,
        successMessage: null,
        dataInfo: res.dataInfo,
        fieldInfoProductSet: res.fieldInfoProductSet,
        fieldInfoProduct: res.fieldInfoProduct
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_SET_UPDATE):
    case SUCCESS(ACTION_TYPES.PRODUCT_SET_CREATE): {
      const res = parseCreateProductSetResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        productIdCreated: res.productId,
        isCreateProductSetSuccess: true
      };
    }
    case SUCCESS(ACTION_TYPES.GET_PRODUCT_SET): {
      const res = parseGetProductSetResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        dataInfo: res.dataInfo,
        fieldInfoProductSet: res.fieldInfoProductSet,
        fieldInfoProduct: res.fieldInfoProduct,
        tabInfo: res.tabInfo
      };
    }
    case SUCCESS(ACTION_TYPES.GET_PRODUCT): {
      const res = parseGetProductResponse(action.payload.data.products);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        products: res.products
      };
    }
    // case SUCCESS(ACTION_TYPES.PRODUCT_SET_UPDATE): {
    //   const res = parseCreateProductSetResponse(action.payload.data);
    //   return {
    //     ...state,
    //     action: res.action,
    //     productIdCreated: res.productId,
    //     isCreateProductSetSuccess: true
    //   };
    // }
    case ACTION_TYPES.PRODUCT_SET_RESET:
      return {
        ...initialState
      };
      case ACTION_TYPES.PRODUCT_SET_RESET_MESSAGE:
        return {
          ...state,
          errorCode: null
        };
    default:
      return state;
  }
};

const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;

export const getProductSetLayout = productIds => ({
  type: ACTION_TYPES.PRODUCT_SET_GET_LAYOUT,
  payload: axios.post(
    `${productsApiUrl}/get-product-set-layout`,
    { productIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
  // const formData = new FormData();
  let mapFile = '';
  let separate = '';
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

export const createProductSet = (data, fileUpload) => ({
  type: ACTION_TYPES.PRODUCT_SET_CREATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/create-product-set`,
    buildFormData(data, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

export const getProductSet = params => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCT_SET,
    payload: axios.post(
      `${productsApiUrl}/get-product-set`,
      { productId: params.productId, isContainDataSummary: false },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const getProductDetail = productId => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_PRODUCT,
    payload: axios.post(
      `${productsApiUrl}/get-products-by-ids`,
      { productIds: [productId] },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const updateProductSet = (data, fileUpload) => {


  const listProductClone: any[] = R.clone(data.listProduct) || []


  const pickNecessaryListProduct = R.pick([
    "productId",
    "productName",
    "quantity",
    "productSetData",
    "hasChange",
    "setId",
    "updatedDate"
  ])

  const newListProduct =  R.map(pickNecessaryListProduct, listProductClone)

  return ({
    type: ACTION_TYPES.PRODUCT_SET_UPDATE,
    payload: axios.post(`${productsApiUrl}/update-product-set`, buildFormData({...data, listProduct: newListProduct}, fileUpload), {
      headers: { ['Content-Type']: 'multipart/form-data' }
    })
  })
};
/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_SET_RESET
});

export const resetMessage = () => ({
  type: ACTION_TYPES.PRODUCT_SET_RESET_MESSAGE
});
