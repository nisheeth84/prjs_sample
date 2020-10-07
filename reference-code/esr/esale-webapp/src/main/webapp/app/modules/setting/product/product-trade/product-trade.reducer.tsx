import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { changeOrder } from 'app/shared/util/dragdrop';

export enum ProductTradeAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  RESET_PRODUCT_TRADE: 'productTrade/RESET',
  GET_PRODUCT_TRADE: 'productTrade/GET',
  UPDATE_PRODUCT_TRADE: 'productTrade/UPDATE',
  CHECK_PRODUCT_TRADE: 'productTrade/CHECK_DELETE',
  CHANGE_ORDER_PRODUCT_TRADE: 'productTrade/CHANGE_ORDER_PRODUCT_TRADE'
};

 
const initialState = {
  action: ProductTradeAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  progresses: null,
  idCheck: null,
  progressesUpdate: null
};

const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};
export type ProductTradeState = Readonly<typeof initialState>;


// API base URL
const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;

const parseGeneralApiResponse = res => {
    const resID = res.updatedProgresses;
    return { resID };
};

// Reducer
export default (state: ProductTradeState = initialState, action): ProductTradeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PRODUCT_TRADE):
    case REQUEST(ACTION_TYPES.CHECK_PRODUCT_TRADE):
    case REQUEST(ACTION_TYPES.UPDATE_PRODUCT_TRADE): {
      return {
        ...state,
        action: ProductTradeAction.Request,
      };
    }

    case FAILURE(ACTION_TYPES.GET_PRODUCT_TRADE):
    case FAILURE(ACTION_TYPES.CHECK_PRODUCT_TRADE):
    case FAILURE(ACTION_TYPES.UPDATE_PRODUCT_TRADE): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: ProductTradeAction.Error,
        errorItems: resFai.errorMsg
      };
    }

    case ACTION_TYPES.RESET_PRODUCT_TRADE: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_PRODUCT_TRADE): {
      const res = action.payload.data;
      return {
        ...state,
        progresses: res.progresses
      };
    }

    case SUCCESS(ACTION_TYPES.CHECK_PRODUCT_TRADE): {
      const res = action.payload.data;
      return {
        ...state,
        idCheck: res.productTradingProgressIds
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_PRODUCT_TRADE): {
      const res = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        progressesUpdate:  res.resID,
      };
    }

    case ACTION_TYPES.CHANGE_ORDER_PRODUCT_TRADE: {
      return {
        ...state,
        progresses: action.payload
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
  type: ACTION_TYPES.RESET_PRODUCT_TRADE
});

/**
 * get product trade
 */
export const getProductTrade = (isOnlyUsable) => ({
  type: ACTION_TYPES.GET_PRODUCT_TRADE,
  payload: axios.post(`${salesApiUrl}/get-progresses`, { isOnlyUsableData: isOnlyUsable }, { headers: { ['Content-Type']: 'application/json' } })
});

/**
 * update product trade
 */
export const updateProductTrade = (param) => ({
  type: ACTION_TYPES.UPDATE_PRODUCT_TRADE,
  payload: axios.post(`${salesApiUrl}/update-progresses`, {
    deletedProgresses: param.listDeletedProgress,
    progresses: param.listItem
  }, { headers: { ['Content-Type']: 'application/json' } })
});

/**
 * update product trade
 */
export const checkDeleteProgresses = (id) => ({
  type: ACTION_TYPES.CHECK_PRODUCT_TRADE,
  payload: axios.post(`${salesApiUrl}/get-check-delete-progresses`, { listProgressId: [id] }, { headers: { ['Content-Type']: 'application/json' } })
});


/* handle Update */
export const handleUpdate = params => async dispatch => {
  await dispatch(updateProductTrade(params));
};

/* handle Get Data */
export const handleGetData = (isOnlyUsableData) => async dispatch => {
  await dispatch(getProductTrade(isOnlyUsableData));
};

/* handle Check Delete */
export const handleCheckDelete = id => async dispatch => {
  await dispatch(checkDeleteProgresses(id));
};


/**
 * update order product trade
 *
 */
export const changeOrderProductTrade = (sourceIndex, targetIndex) => (dispatch, getState) => {
  const newServiceInfo = changeOrder(sourceIndex, targetIndex, getState().productTrade.progresses);
  // TODO: add service

  dispatch({
    type: ACTION_TYPES.CHANGE_ORDER_PRODUCT_TRADE,
    payload: newServiceInfo
  });
};
