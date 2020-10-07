import axios from 'axios';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG, IGNORE_DBL_CLICK_ACTION } from 'app/config/constants';
import { path } from 'ramda';

export const ACTION_TYPES = {
  TAG_AUTO_COMPLETE_RESET: 'tagAutoComplete/RESET',
  TAG_AUTO_COMPLETE_PRODUCT_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/PRODUCT_GET`,
  TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/PRODUCT_TRADING_GET`,
  TAG_AUTO_COMPLETE_EMPLOYEE_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/EMPLOYEE_GET`,
  TAG_AUTO_COMPLETE_CUSTOMER_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/CUSTOMER_GET`,
  TAG_AUTO_COMPLETE_MILESTONE_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/MILESTONE_GET`,
  TAG_AUTO_COMPLETE_TASK_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/TASK_GET`,
  TAG_AUTO_COMPLETE_BUSINESS_CARD_GET: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/TAG_AUTO_COMPLETE_BUSINESS_CARD_GET`,
  TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE: `${IGNORE_DBL_CLICK_ACTION}tagAutoComplete/SAVE_SUGGESTION_CHOICE`,
  EMPLOYEE_LIST_EMPLOYEE_GET: 'employeeDetail/EMPLOYEE_LIST_GET',
  PRODUCT_LIST_PRODUCT_GET: 'productDetail/PRODUCT_LIST_GET',
  MILESTONE_LIST_MILESTONE_GET: 'milestoneDetail/MILESTONE_LIST_GET',
  EMPLOYEE_LIST_EMPLOYEE_LAYOUT_GET: 'employeeDetail/EMPLOYEE_LAYOUT_GET',
  TASK_LIST_TASK_GET: 'taskDetail/TASK_LIST_TASK_GET',
  PRODUCT_TRADING_PRODUCT_TRADING_GET: 'productTradingDetail/PRODUCT_TRADING_GET',
  CUSTOMER_LIST_GET: 'customer/CUSTOMER_LIST_GET',
  BUSINESS_CARD_LIST_GET: 'businessCard/BUSINESS_CARD_LIST_GET',
  ACTIVITY_LIST_GET: 'activity/ACTIVITY_LIST_GET',
};

export enum TagAutoCompleteAction {
  None,
  Request,
  Error,
  Success,
  SuccessGetEmployees,
  SuccessGetCustomers,
  SuccessGetProduct,
  SuccessGetMilestones,
  SuccessGetEmployeeLayout,
  SuccessGetTasks,
  SuccessGetProductTradings,
  SuccessGetBusinessCard,
  SuccessGetActivity,
}

interface ITagResponseData {
  action: TagAutoCompleteAction;
  products: any[];
  tradingProducts: any[];
  milestones: any;
  employees: any;
  customers: any;
  tasks: any;
  businessCards: any[];
  activities: any;
  employeeLayout?: any;
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
  if (res && res.dataInfo && res.dataInfo.length > 0) {
    productCategories.push(...res.dataInfo);
  }
  return { productCategories };
};

const parseProductTradingResponse = res => {
  const productTradings = [];
  if (res && res.productTradings && res.productTradings.length > 0) {
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

const parseCustomerResponse = res => {
  let customers = {};
  if (res) {
    customers = res;
  }
  return { customers };
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
  let milestones = [];
  if (res.milestoneData) {
    milestones = res.milestoneData.sort((a, b) => a.milestoneName > b.milestoneName ? 1 : -1);
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

const getDataSuccess = (state, action) => {
  switch (action.type) {
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
          employees: null,
          customers: null,
          tasks: null,
          businessCards: null
        });
      }
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET): {
      const res = parseProductTradingResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = TagAutoCompleteAction.Success;
        state.data.get(action.meta.namespace).tradingProducts = res.productTradings;
      } else {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: null,
          tradingProducts: res.productTradings,
          milestones: null,
          employees: null,
          customers: null,
          errorItems: null,
          tasks: null,
          businessCards: null
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_EMPLOYEE_GET): {
      const res = parseEmployeeResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        // ignore the action which has meta keyWords not matching to state keyWords
        if (state.data.get(action.meta.namespace).keyWords !== action.meta.keyWords) {
          return {
            ...state
          };
        }
        state.data.get(action.meta.namespace).employees = res.employees;
      } else if (action.meta.namespace) {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: null,
          tradingProducts: null,
          milestones: null,
          employees: res.employees,
          errorItems: null,
          tasks: null,
          businessCards: null
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_TASK_GET): {
      const res = action.payload.data;
      if (state.data.has(action.meta.namespace)) {
        if (state.data.get(action.meta.namespace).keyWords !== action.meta.keyWords) {
          return {
            ...state
          };
        }
        state.data.get(action.meta.namespace).tasks = res.tasks;
      } else if (action.meta.namespace) {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: null,
          tradingProducts: null,
          milestones: null,
          employees: null,
          customers: null,
          errorItems: null,
          tasks: res,
          businessCards: null
        });
      }
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_BUSINESS_CARD_GET): {
      const res = action.payload.data;
      if (state.data.has(action.meta.namespace)) {
        if (state.data.get(action.meta.namespace).keyWords !== action.meta.keyWords) {
          return {
            ...state
          };
        }
        state.data.get(action.meta.namespace).businessCards = res.businessCards;
      } else if (action.meta.namespace) {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: null,
          tradingProducts: null,
          milestones: null,
          employees: null,
          customers: null,
          errorItems: null,
          tasks: null,
          businessCards: res
        });
      }
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_CUSTOMER_GET): {
      const res = parseCustomerResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        // ignore the action which has meta keyWords not matching to state keyWords
        if (state.data.get(action.meta.namespace).keyWords !== action.meta.keyWords) {
          return {
            ...state
          };
        }
        state.data.get(action.meta.namespace).customers = res.customers;
      } else if (action.meta.namespace) {
        state.data.set(action.meta.namespace, {
          action: TagAutoCompleteAction.Success,
          errorMessage: null,
          products: null,
          tradingProducts: null,
          milestones: null,
          employees: null,
          customers: res.customers,
          errorItems: null,
          tasks: null,
          businessCards: null
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.TAG_AUTO_COMPLETE_MILESTONE_GET): {
      const res = parseMilestoneResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).milestones = res.milestones;
        state.data.get(action.meta.namespace).errorItems = res.errorItems;
      } else {
        state.data.set(action.meta.namespace, {
          action: res.action,
          errorMessage: res.errorMsg,
          products: null,
          tradingProducts: null,
          milestones: res.milestones,
          employees: null,
          customers: null,
          errorItems: res.errorItems,
          tasks: null,
          businessCards: null
        });
      }
      return {
        ...state
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
        customers: null,
        errorItems: null,
        suggestionsChoiceId: res.suggestionsChoiceId,
        tasks: null,
        businessCards: null
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
        state.data.get(action.meta.namespace).tasks = null;
        state.data.get(action.meta.namespace).productTradings = null;
        state.data.get(action.meta.namespace).businessCards = null;
        state.data.get(action.meta.namespace).errorItems = null;
        state.data.get(action.meta.namespace).suggestionsChoiceId = null;
        state.data.get(action.meta.namespace).keyWords = null;
        state.data.get(action.meta.namespace).customers = null;
      }
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_GET): {
      const employeeListResponse = action.payload.data.employees;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetEmployees,
        errorMessage: null,
        products: null,
        tradingProducts: null,
        milestones: null,
        employees: employeeListResponse,
        errorItems: null,
        tasks: null,
        businessCards: null
      });
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET): {
      const productListResponse = action.payload.data.products;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetProduct,
        errorMessage: null,
        products: productListResponse,
        tradingProducts: null,
        milestones: null,
        employees: null,
        customers: null,
        errorItems: null,
        tasks: null,
        businessCards: null
      });
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.MILESTONE_LIST_MILESTONE_GET): {
      const data = path(['data', 'milestones'], action.payload);
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetMilestones,
        errorMessage: null,
        products: null,
        tradingProducts: null,
        milestones: data,
        employees: null,
        customers: null,
        errorItems: null,
        tasks: null,
        businessCards: null
      });
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_PRODUCT_TRADING_GET): {
      const data = action.payload.data.productTradings;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetProductTradings,
        errorMessage: null,
        products: null,
        tradingProducts: data,
        milestones: null,
        employees: null,
        customers: null,
        errorItems: null,
        tasks: null,
        businessCards: null
      });
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_LIST_TASK_GET): {
      const data = action.payload.data.tasks;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetTasks,
        errorMessage: null,
        products: null,
        tradingProducts: null,
        milestones: null,
        employees: null,
        customers: null,
        errorItems: null,
        tasks: data,
        businessCards: null
      });
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_LIST_GET): {
      const data = action.payload.data.businessCards;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetBusinessCard,
        businessCards: data
      });
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.ACTIVITY_LIST_GET): {
      const data = action.payload.data.activities;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetActivity,
        activities: data
      });
      return {
        ...state
      };
    }

    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_LAYOUT_GET): {
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetEmployeeLayout,
        errorMessage: null,
        products: null,
        tradingProducts: null,
        milestones: null,
        employees: state.data.get(action.meta.namespace) && state.data.get(action.meta.namespace).employees,
        errorItems: null,
        employeeLayout: action.payload.data.employeeLayout,
        tasks: null,
        businessCards: null
      });
      return {
        ...state,
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_GET): {
      const data = action.payload.data.customers;
      state.data.set(action.meta.namespace, {
        action: TagAutoCompleteAction.SuccessGetCustomers,
        errorMessage: null,
        products: null,
        customers: data,
        milestones: null,
        employees: null,
        errorItems: null,
        tasks: null,
        businessCards: null
      });
      return {
        ...state
      };
    }
    default:
      return state;
  }
}
export type TagAutoCompleteState = Readonly<typeof initialState>;

// Reducer
export default (state: TagAutoCompleteState = initialState, action): TagAutoCompleteState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_EMPLOYEE_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_CUSTOMER_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_MILESTONE_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_TASK_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_BUSINESS_CARD_GET):
    case REQUEST(ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET):
    case REQUEST(ACTION_TYPES.MILESTONE_LIST_MILESTONE_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_PRODUCT_TRADING_GET):
    case REQUEST(ACTION_TYPES.TASK_LIST_TASK_GET):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_GET):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_LIST_GET):
    case REQUEST(ACTION_TYPES.ACTIVITY_LIST_GET):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_LAYOUT_GET): {
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
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_CUSTOMER_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_TASK_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_BUSINESS_CARD_GET):
    case FAILURE(ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET):
    case FAILURE(ACTION_TYPES.MILESTONE_LIST_MILESTONE_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_PRODUCT_TRADING_GET):
    case FAILURE(ACTION_TYPES.TASK_LIST_TASK_GET):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_LIST_GET):
    case FAILURE(ACTION_TYPES.ACTIVITY_LIST_GET):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_LAYOUT_GET):
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_GET):
      {
        if (state.data.has(action.meta.namespace)) {
          state.data.get(action.meta.namespace).action = TagAutoCompleteAction.Error;
          state.data.get(action.meta.namespace).errorMessage = action.payload.message;
        }
        return {
          ...state
        };
      }

    default:
      return getDataSuccess(state, action);
  }
};

const productApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}`;
const employeeApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}`;
const customerApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}`;
const scheduleApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}`;
const businessCardApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}`;
const activityApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}`;

const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
const commonApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

export const getEmployeeList = (namespace, employeeIds) => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_GET,
  payload: axios.post(
    `${employeeApiUrl}/get-employees-by-ids`,
    {
      employeeIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getProductList = (namespace, productIds) => ({
  type: ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET,
  payload: axios.post(
    `${productApiUrl}/get-products-by-ids`,
    {
      productIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getMilestoneList = (namespace, milestoneIds) => ({
  type: ACTION_TYPES.MILESTONE_LIST_MILESTONE_GET,
  payload: axios.post(
    `${scheduleApiUrl}/get-milestones-by-ids`,
    {
      milestoneIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getProductTradingList = (namespace, productTradingIds) => ({
  type: ACTION_TYPES.PRODUCT_TRADING_PRODUCT_TRADING_GET,
  payload: axios.post(
    `${salesApiUrl}/get-product-tradings-by-ids`,
    {
      productTradingIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getTaskList = (namespace, taskIds) => ({
  type: ACTION_TYPES.TASK_LIST_TASK_GET,
  payload: axios.post(
    `${scheduleApiUrl}/get-tasks-by-ids`,
    {
      taskIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getCustomerList = (namespace, customerIds) => ({
  type: ACTION_TYPES.CUSTOMER_LIST_GET,
  payload: axios.post(
    `${customerApiUrl}/get-customers-by-ids`,
    {
      customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getBusinessCardList = (namespace, businessCardIds) => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_GET,
  payload: axios.post(
    `${businessCardApiUrl}/get-business-cards-by-ids`,
    {
      businessCardIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const getActivityList = (namespace, activityIds) => ({
  type: ACTION_TYPES.CUSTOMER_LIST_GET,
  payload: axios.post(
    `${activityApiUrl}/get-activities-by-ids`,
    {
      activityIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const handleGetEmployeeList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getEmployeeList(namespace, param));
  }
}

export const handleGetProductList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getProductList(namespace, param));
  }
}

export const handleGetMilestoneList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getMilestoneList(namespace, param));
  }
}

export const handleGetProductTradingList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getProductTradingList(namespace, param));
  }
}

export const handleGetTaskList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getTaskList(namespace, param));
  }
}

export const handleGetCustomerList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getCustomerList(namespace, param));
  }
}

export const handleGetBusinessCardList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getBusinessCardList(namespace, param));
  }
}

export const handleGetActivityList = (namespace, param) => async (dispatch, getState) => {
  if (param) {
    await dispatch(getActivityList(namespace, param));
  }
}

export const PARAM_GET_PRODUCT_SUGGEST = (searchValue, offset, listIdChoice) => {
  return {
    searchValue,
    offset,
    listIdChoice
  }
};

/**
 *
 * @param
 */
export const getEmployeeSuggestions = (namespace, searchValue, startTime, endTime, searchType, offSet, listItemChoice) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_EMPLOYEE_GET,
  payload: axios.post(
    `${employeeApiUrl}/get-employees-suggestion`,
    {
      keyWords: searchValue,
      startTime: "",
      endTime: "",
      searchType,
      offSet,
      limit: 10,
      listItemChoice,
      relationFieldI: null
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
    keyWords: `${JSON.stringify(searchValue)}`
  }
});

/**
 *
 * @param
 */
export const getCustomerSuggestions = (namespace, searchValue, offset, listIdChoice) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_CUSTOMER_GET,
  payload: axios.post(
    `${customerApiUrl}/get-customer-suggestion`,
    {
      keyWords: searchValue,
      offset,
      listIdChoice,
      relationFieldId: null
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
    keyWords: `${JSON.stringify(searchValue)}`
  }
});

/**
 *
 * @param
 */
export const getProductSuggestions = (namespace, searchValue, offset, listIdChoice) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_GET,
  payload: axios.post(
    `${productApiUrl}/get-product-suggestions`,
    PARAM_GET_PRODUCT_SUGGEST(searchValue, offset, listIdChoice),
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace
  }
});

/**
 *
 * @param
 */
export const getTaskSuggestions = (namespace, searchValue, offset, listIdChoice) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_TASK_GET,
  payload: axios.post(
    `${scheduleApiUrl}/get-task-suggestion`,
    {
      searchValue, offset, listIdChoice, limit: 10
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
    keyWords: `${JSON.stringify(searchValue)}`
  }
});

/**
 *
 * @param
 */
export const getProductTradingSuggestions = (namespace, searchValue, offset, listIdChoice, customerIds) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_PRODUCT_TRADING_GET,
  payload: axios.post(
    `${salesApiUrl}/get-product-trading-suggestions`,
    {
      searchValue, offset, listIdChoice, customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace
  }
});

/**
 * Get milestone suggestions when typing in search textbox
 * @param namespace
 * @param searchValue
 */
export const getMilestoneSuggestions = (namespace, searchValue, offset, listIdChoice) => (
  {
    type: ACTION_TYPES.TAG_AUTO_COMPLETE_MILESTONE_GET,
    payload: axios.post(
      `${scheduleApiUrl}/get-milestones-suggestion`,
      {
        searchValue, offset, listIdChoice, limit: 10
      },
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: {
      namespace
    }
  });

/**
 * Get milestone suggestions when typing in search textbox
 * @param namespace
 * @param searchValue
 */
export const getBusinessCardSuggestions = (namespace, searchValue, offset, listIdChoice, customerIds?) => (
  {
    type: ACTION_TYPES.TAG_AUTO_COMPLETE_BUSINESS_CARD_GET,
    payload: axios.post(
      `${businessCardApiUrl}/get-business-card-suggestions`,
      {
        searchValue, offset, listIdChoice, customerIds
      },
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: {
      namespace,
      keyWords: `${JSON.stringify(searchValue)}`
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
    { index, idResult: [idResult]},
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});

export const saveSuggestionListChoice = (namespace, index, results) => ({
  type: ACTION_TYPES.TAG_AUTO_COMPLETE_SAVE_SUGGESTION_CHOICE,
  payload: axios.post(
    `${commonApiUrl}/save-suggestions-choice`,
    { index, idResult: results },
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

export const handleGetEmployeeLayout = (namespace, extensionBelong) => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEE_LAYOUT_GET,
  payload: axios.post(
    `${employeeApiUrl}/get-employee-layout`,
    { extensionBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
  }
});