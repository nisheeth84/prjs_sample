import axios from 'axios';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG, IGNORE_DBL_CLICK_ACTION } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  TAG_AUTO_COMPLETE_RESET: 'tagAutoComplete/RESET',
  TAG_AUTO_COMPLETE_PRODUCT_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/PRODUCT_GET`,
  TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/PRODUCT_TRADING_GET`,
  TAG_AUTO_COMPLETE_EMPLOYEE_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/EMPLOYEE_GET`,
  TAG_AUTO_COMPLETE_MILESTONE_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/MILESTONE_GET`,
  TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/SAVE_SUGGESTION_CHOICE`,
};

export enum TagAutoCompleteAction {
  None,
  Request,
  Error,
  Success
}

interface ITagResponseData {
  action: TagAutoCompleteAction;
  products: any[];
  tradingProducts: any[];
  milestones: any;
  employees: any;
  errorMessage: string;
  errorItems?: any;
  suggestionsChoiceId?: any;
  parentCustomerName?: any;
  customerName?: any;
  keyWords?: any;
}

const initialState = {
  data: new Map<string, ITagResponseData>()
};

const parseProductResponse = res => {
  const productCategories = [];
  if (res && res.productCategories && res.productCategories.length > 0) {
    productCategories.push(...res.productCategories);
  }
  return { productCategories };
};

const parseProductTradingResponse = res => {
  const productTradings = [];
  if (res && res.productTradings) {
    productTradings.push(...res.productTradings);
  }
  return { productTradings };
};

const parseEmployeeResponse = res => {
  let employees = {};
  if (res) {
    employees = res;
  }
  return { employees };
};

/**
 * Parse response from getMilestonesSuggestion api
 * @param res
 */
const parseMilestoneResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? TagAutoCompleteAction.Error : TagAutoCompleteAction.Success;
  let milestones = {};
  if (res.data && res.data.getMilestonesSuggestion) {
    milestones = res.data.getMilestonesSuggestion.milestoneData.sort((a, b) => a.milestoneName > b.milestoneName ? 1 : -1);
  }

  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (res.errors[0].extensions && res.errors[0].extensions.errors && res.errors[0].extensions.errors.length > 0) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    }
  }
  return { errorMsg, action, milestones, errorItems };
};

/**
 * Parse response from saveSuggestionChoice api
 * @param res
 */
const parseSaveSuggestionChoiceResponse = res => {
  let suggestionsChoiceId = {};
  if (res) {
    suggestionsChoiceId = res;
  }

  return { suggestionsChoiceId };
};

export type TagSuggestProductCategoriesState = Readonly<typeof initialState>;

// Reducer
export default (state: TagSuggestProductCategoriesState = initialState, action): TagSuggestProductCategoriesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_EMPLOYEE_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_MILESTONE_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE): {
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = TagAutoCompleteAction.Request;
        state.data.get(action.meta.namespace).errorMessage = null;
        // set keyWords from meta to state
        state.data.get(action.meta.namespace).keyWords = action.meta.keyWords;
      }
      return {
        ...state
      };
    }
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_MILESTONE_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_EMPLOYEE_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE): {
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = TagAutoCompleteAction.Error;
        state.data.get(action.meta.namespace).errorMessage = action.payload.message;
        state.data.get(action.meta.namespace).errorItems = parseErrorRespose(action.payload);
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET): {
      const res = parseProductResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).products = res.productCategories;
      } else {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: res.productCategories,
          tradingProducts: null,
          milestones: null,
          employees: null
        });
      }
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE): {
      const res = parseSaveSuggestionChoiceResponse(action.payload.data);
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.Success,
        errorMessage: null,
        products: null,
        tradingProducts: null,
        milestones: null,
        employees: null,
        errorItems: null,
        suggestionsChoiceId: res.suggestionsChoiceId
      });
      return {
        ...state,
      };
    }
    case ACTION_TYPES.TAG_AUTO_COMPLETE_RESET:
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = TagAutoCompleteAction.None;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).employees = null;
        state.data.get(action.meta.namespace).products = null;
        state.data.get(action.meta.namespace).milestones = null;
        state.data.get(action.meta.namespace).errorItems = null;
        state.data.get(action.meta.namespace).suggestionsChoiceId = null;
        state.data.get(action.meta.namespace).keyWords = null;
      }
      return {
        ...state
      };

    default:
      return state;
  }
};

const productApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const employeeApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;
const scheduleApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
const commonApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const PARAM_GET_PRODUCT_SUGGEST = (keyWords, offset) => {
  return {
    keyWords,
    offset
  }
};


/**
 *
 * @param
 */
export const getProductCategorySuggestions = (namespace, keyWords, offset) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'products/api/products-categories-suggestion'}`,
    PARAM_GET_PRODUCT_SUGGEST(keyWords, offset),
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});




/**
 * Save suggestion choice when selected auto complete
 * @param namespace
 * @param searchValue
 */
export const saveSuggestionsChoice = (namespace, index, idResult) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE,
  payload: axios.post(
    `${commonApiUrl}/save-suggestions-choice`,
    { sugggestionsChoice: [{ index, idResult }] },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

/**
 * reset state
 */
export const reset = namespace => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_RESET,
  meta: {
    namespace
  }
});
