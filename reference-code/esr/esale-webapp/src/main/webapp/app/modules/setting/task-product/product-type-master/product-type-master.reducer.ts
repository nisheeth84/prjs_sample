import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import {
  QUERY_GET_PRODUCT_TYPE,
  QUERY_UPDATE_PRODUCT_TYPE,
  QUERY_CHECK_DELETE_PRODUCT_TYPE
} from 'app/modules/setting/constant';
import axios from 'axios';

export enum ProductTypeMasterAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  PRODUCT_TYPE_MASTER_RESET: 'productTypeMaster/RESET',
  GET_PRODUCT_TYPE_MASTER: 'productTypeMaster/GET',
  UPDATE_PRODUCT_TYPE_MASTER: 'productTypeMaster/UPDATE',
  CHECK_DELETE_PRODUCT_TYPE_MASTER: 'productTypeMaster/CHECK'
};
const initialState = {
  action: ProductTypeMasterAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  dataGet: {},
  listId: null,
  chetdelete: null,
  loadding: false
};
export type ProductTypeMasterState = Readonly<typeof initialState>;

const parseApiGetResponse = res => {
  const data = res;
  const dataResponse = [];
  dataResponse['fieldInfo'] = data['fieldInfo'] ? data['fieldInfo'] : [];
  dataResponse['productTypes'] = [];
  if (data['productTypes'] !== undefined && data['productTypes'].length > 0) {
    data['productTypes'].forEach(element => {
      element['fieldUse'] = JSON.parse(element['fieldUse']);
      dataResponse['productTypes'].push(element);
    });
  }
  return { dataResponse };
};

const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

// API base URL
const productsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;

// Reducer
export default (state: ProductTypeMasterState = initialState, action): ProductTypeMasterState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCT_TYPE_MASTER):
    case REQUEST(ACTION_TYPES.CHECK_DELETE_PRODUCT_TYPE_MASTER):
    case REQUEST(ACTION_TYPES.GET_PRODUCT_TYPE_MASTER): {
      return {
        ...state,
        action: ProductTypeMasterAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.UPDATE_PRODUCT_TYPE_MASTER):
    case FAILURE(ACTION_TYPES.CHECK_DELETE_PRODUCT_TYPE_MASTER):
    case FAILURE(ACTION_TYPES.GET_PRODUCT_TYPE_MASTER): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: ProductTypeMasterAction.Error,
        errorItems: resFai.errorMsg,
        loadding: true
      };
    }

    case ACTION_TYPES.PRODUCT_TYPE_MASTER_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_PRODUCT_TYPE_MASTER): {
      const res = parseApiGetResponse(action.payload.data);
      return {
        ...state,
        dataGet: res.dataResponse,
        loadding: true
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCT_TYPE_MASTER): {
      return {
        ...state,
        listId: action.payload.data.createdProductTypes,
        loadding: true
      };
    }
    case SUCCESS(ACTION_TYPES.CHECK_DELETE_PRODUCT_TYPE_MASTER): {
      const res = action.payload.data;
      return {
        ...state,
        chetdelete: res.productTypes
      };
    }
    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_TYPE_MASTER_RESET
});

/**
 * update Product ypes
 */
export const updateProductTypes = param => ({
  type: ACTION_TYPES.UPDATE_PRODUCT_TYPE_MASTER,
  payload: axios.post(
    `${productsApiUrl}/update-product-types`,
    {
      deletedProductTypes: param.deletedProductTypes,
      productTypes: param.listItem
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
/**
 * get Product Type Master
 */
export const getProductTypeMaster = () => ({
  type: ACTION_TYPES.GET_PRODUCT_TYPE_MASTER,
  payload: axios.post(
    `${productsApiUrl}/get-product-types`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const checkDeleteProType = ids => ({
  type: ACTION_TYPES.CHECK_DELETE_PRODUCT_TYPE_MASTER,
  payload: axios.post(
    `${productsApiUrl}/check-delete-productTypes`,
    { productTypeIds: [ids] },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetProductTypeMaster = () => async (dispatch, getState) => {
  await dispatch(getProductTypeMaster());
};
