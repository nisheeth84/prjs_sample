import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { PRODUCT_ACTION_TYPES } from '../constants';
// import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT: 'product/CUSTOM_FIELD_INFO_GET_LAYOUT',
  PRODUCT_GET: 'product/PRODUCT_GET',
  PRODUCT_EDIT: 'product/PRODUCT_EDIT',
  PRODUCT_CREATE: 'product/PRODUCT_CREATE',
  PRODUCT_EDIT_RESET: 'productEdit/RESET',
  PRODUCT_CHANGE_TO_EDIT: 'productEdit/EDIT',
  PRODUCT_CHANGE_TO_DISPLAY: 'productEdit/DISPLAY'
};

export enum ProducPopuptAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal,
  UpdateProductSuccess,
  UpdateProductFailure,
  CreateProductSuccess
}

const initialState = {
  action: ProducPopuptAction.None,
  errorMessage: null,
  errorItems: [],
  fieldInfo: [],
  dataInfo: null,
  successMessage: null,
  idSuccess: null,
  errorCode: null,
  idCreateSuccess: null
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

const parseCustomFieldsInfoResponse = res => {
  let product = null;
  let fieldInfo = null;

  if (res.productLayout) {
    product = res.productLayout.dataInfo;

    if (res.productLayout.fieldInfo) {
      fieldInfo = res.productLayout.fieldInfo
        .filter(field => {
          return field.availableFlag !== 0;
        })
        .sort((a, b) => a.fieldOrder - b.fieldOrder);
    }
  }
  return { product, fieldInfo };
};
const parseCustomFieldsInfoEditResponse = res => {
  const product = res.product;
  let errorMsg = [];
  let fieldInfo = null;

  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? ProducPopuptAction.ErrorModal : ProducPopuptAction.DoneModal;

  if (res.product.fieldInfo) {
    fieldInfo = res.product.fieldInfo
      .filter(field => {
        return field.availableFlag !== 0;
      })
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }

  return { errorMsg, action, product, fieldInfo };
};

const parseFieldsInfoEditResponse = res => {
  const resID = res;
  const action = ProducPopuptAction.UpdateProductSuccess;
  return { action, resID };
};

export type ProductPopupEditState = Readonly<typeof initialState>;

// Reducer
export default (state: ProductPopupEditState = initialState, action): ProductPopupEditState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.PRODUCT_CREATE):
    case REQUEST(ACTION_TYPES.PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT):
    case REQUEST(ACTION_TYPES.PRODUCT_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_EDIT):
      return {
        ...state,
        action: ProducPopuptAction.RequestModal,
        errorItems: []
      };
    case FAILURE(ACTION_TYPES.PRODUCT_CREATE):
    case FAILURE(ACTION_TYPES.PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT):
    case FAILURE(ACTION_TYPES.PRODUCT_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_EDIT): {
      const errorRes = parseErrorRespose(action.payload);
      return {
        ...state,
        action: ProducPopuptAction.ErrorModal,
        errorMessage: errorRes.errorCodeList,
        errorItems: errorRes.errorCodeList,
        errorCode: errorRes.errorCode ? errorRes.errorCode : null
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        fieldInfo: res.fieldInfo,
        dataInfo: res.product
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_CREATE): {
      const res = parseFieldsInfoEditResponse(action.payload.data);
      return {
        ...state,
        action: ProducPopuptAction.CreateProductSuccess,
        idCreateSuccess: res.resID
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_EDIT): {
      const res = parseFieldsInfoEditResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        idSuccess: res.resID
      };
    }
    // case SUCCESS(ACTION_TYPES.PRODUCT_CREATE): {
    //   const res = parseFieldsInfoEditResponse(action.payload.data);
    //   return {
    //     ...state,
    //     action: res.action,
    //     idSuccess: res.resID
    //   };
    // }
    case SUCCESS(ACTION_TYPES.PRODUCT_GET): {
      const res = parseCustomFieldsInfoEditResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        // errorMessage: res.errorMsg,
        fieldInfo: res.fieldInfo,
        dataInfo: res.product
      };
    }
    case ACTION_TYPES.PRODUCT_EDIT_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;

/**
 * Get custom fields info
 *
 * @param
 */
export const getProductLayout = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.PRODUCT_LAYOUT_CUSTOM_FIELD_INFO_GET_EDIT,
    payload: axios.post(`${productsApiUrl}/get-product-layout`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

// const buildFormData = (params, fileUpload) => {
//   const formData = new FormData();
//   let mapFile = '';
//   let separate = '';
//   if (fileUpload) params['files'] = [];
//   fileUpload.forEach((file, index) => {
//     const key = Object.keys(file)[0];
//     mapFile += separate + `"${key}": ["variables.files.${index}"]`;
//     formData.append(key, file[key]);
//     separate = ',';
//     params['files'].push(null);
//   });
//   const query = params.productId ? JSON.stringify(PARAMS_UPDATE_PRODUCT(params)) : JSON.stringify(PARAMS_CREATE_PRODUCT(params));
//   formData.append('operations', query.replace(/\n/g, '').replace('  ', ' '));
//   formData.append('map', '{' + mapFile + '}');
//   return formData;
// };

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
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

/**
 * create product
 *
 * @param
 */
export const createProduct = (data, fileUpload) => ({
  type: ACTION_TYPES.PRODUCT_CREATE,
  // payload: axios.post(`${productsApiUrl}/get-product-layout`, null, { headers: { ['Content-Type']: 'application/json' } })
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/create-product`,
    buildFormData(data, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

/**
 * update product
 *
 * @param
 */

export const updateProduct = (pramscreat, fileUpload) => ({
  type: ACTION_TYPES.PRODUCT_EDIT,
  // payload: axios.post(`${productsApiUrl}`, buildFormData(pramscreat, fileUpload), { headers: { ['Content-Type']: 'multipart/form-data' } })
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/update-product'}`,
    buildFormData(pramscreat, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

/**
 * get product
 *
 * @param
 */
export const getProduct = pramsget => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.PRODUCT_GET,
    payload: axios.post(
      `${productsApiUrl}/get-product`,
      {
        productId: pramsget.productId,
        isOnlyData: pramsget.isOnlyData,
        isContainDataSummary: pramsget.isContainDataSummary
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
};

export const handleSubmitProductData = (
  prarams,
  fileUpload,
  productModalMode
) => async dispatch => {
  if (productModalMode === PRODUCT_ACTION_TYPES.CREATE) {
    return await dispatch(createProduct(prarams, fileUpload));
  } else if (productModalMode === PRODUCT_ACTION_TYPES.UPDATE) {
    await dispatch(updateProduct(prarams, fileUpload));
  }
};

export const handleGetDataProduct = (prarams, productModalMode) => async dispatch => {
  if (productModalMode === PRODUCT_ACTION_TYPES.CREATE) {
    await dispatch(getProductLayout());
  } else if (productModalMode === PRODUCT_ACTION_TYPES.UPDATE) {
    await dispatch(getProduct(prarams));
  }
};
/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_EDIT_RESET
});
