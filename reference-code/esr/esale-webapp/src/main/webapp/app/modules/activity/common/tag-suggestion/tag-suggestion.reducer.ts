import axios from 'axios';
import { CommonUtil } from '../common-util';
import { ReportTargetType } from './models/report-target-type';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  TAG_SUGGESTION_RESET: 'tagSuggestionReset/TAG_SUGGESTION_RESET',
  TAG_SUGGESTION_REPORT_TARGET: 'tagSuggestionReset/TAG_SUGGESTION_REPORT_TARGET',
  TAG_SUGGESTION_BUSINESS_CARD: 'tagSuggestionReset/TAG_SUGGESTION_BUSINESS_CARD',
  TAG_SUGGESTION_LAZY_BUSINESS_CARD: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_BUSINESS_CARD',
  TAG_SUGGESTION_CUSTOMER: 'tagSuggestionReset/TAG_SUGGESTION_CUSTOMER',
  TAG_SUGGESTION_LAZY_CUSTOMER: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_CUSTOMER',
  TAG_SUGGESTION_PRODUCT_TRADING: 'tagSuggestionReset/TAG_SUGGESTION_PRODUCT_TRADING',
  TAG_SUGGESTION_PRODUCT: 'tagSuggestionReset/TAG_SUGGESTION_PRODUCT',
  TAG_SUGGESTION_LAZY_PRODUCT_TRADING: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_PRODUCT_TRADING',
  TAG_SUGGESTION_LAZY_PRODUCT: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_PRODUCT',
  SET_DATA_PRODUCT: 'tagSuggestionReset/SET_DATA_PRODUCT',
  TAG_SUGGESTION_SCHEDULE: 'tagSuggestionReset/TAG_SUGGESTION_SCHEDULE',
  TAG_SUGGESTION_MILESTONE: 'tagSuggestionReset/TAG_SUGGESTION_MILESTONE',
  TAG_SUGGESTION_TASK: 'tagSuggestionReset/TAG_SUGGESTION_TASK',
  TAG_SUGGESTION_LAZY_SCHEDULE: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_SCHEDULE',
  TAG_SUGGESTION_LAZY_MILESTONE: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_MILESTONE',
  TAG_SUGGESTION_LAZY_TASK: 'tagSuggestionReset/TAG_SUGGESTION_LAZY_TASK',
  SAVE_SUGGESTION_CHOICE: 'tagSuggestionReset/SAVE_SUGGESTION_CHOICE',
  BUSINESS_CARD_GET_BY_IDS: 'tagSuggestionReset/BUSINESS_CARD_GET_BY_IDS'
};

export enum TagSuggestionAction {
  None,
  Request,
  Error,
  Success
}

interface ITagResponseData {
  action: TagSuggestionAction;
  errorMessage: string;
  errorItems?: any;
  reportTargets: ReportTargetType;
  businessCards: any[];
  customers: any[];
  productTradings: any[];
  products: any[];
  schedules: any[];
  milestones: any[];
  tasks: any[];
  totalSchedules: number;
  totalMilestones: number;
  totalTasks: number;
  totalProductTradings: number;
  totalProducts: number;
  totalBusinessCard: number;
  totalCustomer: number;
  suggestionsChoiceId: any;
  businessCardsByIds: any;
}

const LIMIT = 10;
const initialState = {
  data: new Map<string, ITagResponseData>()
};

const defaultValue = {
  action: [],
  errorMessage: [],
  errorItems: null,
  reportTargets: null,
  businessCards: [],
  customers: [],
  productTradings: [],
  products: [],
  schedules: [],
  milestones: [],
  tasks: [],
  totalSchedules: LIMIT,
  totalMilestones: LIMIT,
  totalTasks: LIMIT,
  totalProductTradings: LIMIT,
  totalProducts: LIMIT,
  totalBusinessCard: null,
  totalCustomer: null,
  suggestionsChoiceId: null,
  businessCardsByIds: null
};

const apiUrlCustomer = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;
const apiUrlBusinessCard = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const apiUrlProduct = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH;
const apiUrlSales = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
const apiUrlSchedule = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;
const apiUrlCommon = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

export type TagSuggestionState = Readonly<typeof initialState>;

const getErrorMsgResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? TagSuggestionAction.Error : TagSuggestionAction.Success;
  return { errorMsg, action };
};

const parseBusinessCardResponse = res => {
  const businessCards = [];
  if (res.businessCards) {
    businessCards.push(...res.businessCards);
  }
  const _length = businessCards.length;
  return { ...getErrorMsgResponse(res), businessCards, totalBusinessCard: _length < LIMIT ? 0 : LIMIT };
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

const parseCustomerResponse = res => {
  const customers = [];

  if (res.customers) {
    customers.push(...res.customers);
  }
  const _length = customers.length;
  return { ...getErrorMsgResponse(res), customers, totalCustomer: _length < LIMIT ? 0 : LIMIT };
};

const parseProductTradingResponse = res => {
  const productTradings = [];

  if (res.productTradings) {
    productTradings.push(...res.productTradings);
  }
  const _length = productTradings.length;
  return {
    ...getErrorMsgResponse(res),
    productTradings,
    totalProductTradings: _length < LIMIT ? 0 : LIMIT,
    totalProducts: LIMIT
  };
};

const parseProductResponse = res => {
  const products = [];

  if (res.dataInfo) {
    products.push(...res.dataInfo);
  }
  const _length = products.length;
  return { ...getErrorMsgResponse(res), products, totalProducts: _length < LIMIT ? 0 : LIMIT };
};

const parseScheduleResponse = res => {
  const schedules = [];

  if (res.schedules) {
    schedules.push(...res.schedules);
  }
  const _length = schedules.length;
  return {
    ...getErrorMsgResponse(res),
    schedules,
    totalSchedules: _length < LIMIT ? 0 : LIMIT,
    totalMilestones: LIMIT,
    totalTasks: LIMIT
  };
};

const parseMilestoneResponse = (res, limit?) => {
  const milestones = [];

  if (res.milestoneData) {
    milestones.push(...res.milestoneData);
  }
  const _length = milestones.length;
  return {
    ...getErrorMsgResponse(res),
    milestones,
    totalMilestones: _length < (limit || LIMIT) ? 0 : LIMIT,
    totalSchedules: 0,
    totalTasks: LIMIT
  };
};

const parseTasksResponse = (res, limit?) => {
  const tasks = [];

  if (res.tasks) {
    tasks.push(...res.tasks);
  }
  const _length = tasks.length;
  return {
    ...getErrorMsgResponse(res),
    tasks,
    totalTasks: _length < (limit || LIMIT) ? 0 : LIMIT,
    totalSchedules: 0,
    totalMilestones: 0
  };
};

export default (state: TagSuggestionState = initialState, action): TagSuggestionState => {
  let result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_BUSINESS_CARD,
    state,
    action,
    null,
    () => {
      const res = parseBusinessCardResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).businessCards = res.businessCards;
        state.data.get(action.meta.namespace).totalBusinessCard = res.totalBusinessCard;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          businessCards: res.businessCards,
          totalBusinessCard: res.totalBusinessCard
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_BUSINESS_CARD,
    state,
    action,
    null,
    () => {
      const res = parseBusinessCardResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        const businessCards = res.businessCards || [];
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).businessCards = businessCards.concat(
          res.businessCards
        );
        state.data.get(action.meta.namespace).totalBusinessCard = res.totalBusinessCard;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          businessCards: res.businessCards,
          totalBusinessCard: res.totalBusinessCard
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_CUSTOMER,
    state,
    action,
    null,
    () => {
      const res = parseCustomerResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).customers = res.customers;
        state.data.get(action.meta.namespace).totalCustomer = res.totalCustomer;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          customers: res.customers,
          totalCustomer: res.totalCustomer
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_CUSTOMER,
    state,
    action,
    null,
    () => {
      const res = parseCustomerResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        const customers = res.customers || [];
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).customers = customers.concat(res.customers);
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          customers: res.customers
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_PRODUCT_TRADING,
    state,
    action,
    null,
    () => {
      const res = parseProductTradingResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).productTradings = res.productTradings;
        state.data.get(action.meta.namespace).totalProductTradings = res.totalProductTradings;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          productTradings: res.productTradings,
          totalProductTradings: res.totalProductTradings
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_PRODUCT,
    state,
    action,
    null,
    () => {
      const res = parseProductResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).products = res.products;
        state.data.get(action.meta.namespace).totalProducts = res.totalProducts;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          products: res.products,
          totalProducts: res.totalProducts
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_SCHEDULE,
    state,
    action,
    null,
    () => {
      const res = parseScheduleResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).schedules = res.schedules;
        state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
        state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
        state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          schedules: res.schedules,
          totalSchedules: res.totalSchedules
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.BUSINESS_CARD_GET_BY_IDS,
    state,
    action,
    null,
    () => {
      const businessCardsByIds = action.payload.data.businessCards;
      state.data.set(action.meta.namespace, {
        ...defaultValue,
        errorMessage: '',
        action: TagSuggestionAction.Success,
        businessCardsByIds
      });
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_SCHEDULE,
    state,
    action,
    null,
    () => {
      const res = parseScheduleResponse(action.payload.data);

      if (state.data.has(action.meta.namespace)) {
        const schedules = state.data.get(action.meta.namespace).schedules || [];
        const offset = action.meta.offset;
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).schedules = offset === 0 ? _.cloneDeep(res.schedules) :
          (res.schedules && res.schedules.length > 0 ? schedules.concat(res.schedules) : schedules);
        state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
        state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
        state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          schedules: res.schedules,
          totalSchedules: res.totalSchedules
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_PRODUCT_TRADING,
    state,
    action,
    null,
    () => {
      const res = parseProductTradingResponse(action.payload.data);
      const offset = action.meta.offset;
      if (state.data.has(action.meta.namespace)) {
        const productTradings = state.data.get(action.meta.namespace).productTradings || [];
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).productTradings = offset === 0 ? _.cloneDeep(res.productTradings) : productTradings.concat(
          res.productTradings
        );
        state.data.get(action.meta.namespace).totalProductTradings = res.totalProductTradings;
        state.data.get(action.meta.namespace).totalProducts = res.totalProducts;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          productTradings: res.productTradings,
          totalProductTradings: res.totalProductTradings,
          totalProducts: res.totalProducts
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_PRODUCT,
    state,
    action,
    null,
    () => {
      const res = parseProductResponse(action.payload.data);
      const offset = action.meta.offset;
      if (state.data.has(action.meta.namespace)) {
        const products = state.data.get(action.meta.namespace).products || [];
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).products = offset === 0 ? _.cloneDeep(res.products) : products.concat(res.products);
        state.data.get(action.meta.namespace).totalProducts = res.totalProducts;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          products: res.products,
          totalProducts: res.totalProducts
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_MILESTONE,
    state,
    action,
    null,
    () => {
      const res = parseMilestoneResponse(action.payload.data, action.meta.limit);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).milestones = res.milestones;
        state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
        state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
        state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          milestones: res.milestones,
          totalMilestones: res.totalMilestones
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_MILESTONE,
    state,
    action,
    null,
    () => {
      const res = parseMilestoneResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        const milestones = state.data.get(action.meta.namespace).milestones || [];
        const offset = action.meta.offset;
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).milestones = offset === 0 ? _.cloneDeep(res.milestones) :
          (res.milestones && res.milestones.length > 0
            ? milestones.concat(res.milestones)
            : milestones);
        state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
        state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
        state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          milestones: res.milestones,
          totalMilestones: res.totalMilestones
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.TAG_SUGGESTION_TASK, state, action, null, () => {
    const res = parseTasksResponse(action.payload.data, action.meta.limit);
    if (state.data.has(action.meta.namespace)) {
      state.data.get(action.meta.namespace).action = res.action;
      state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
      state.data.get(action.meta.namespace).tasks = res.tasks;
      state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
      state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
      state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
    } else {
      state.data.set(action.meta.namespace, {
        ...defaultValue,
        action: res.action,
        errorMessage: res.errorMsg,
        tasks: res.tasks,
        totalTasks: res.totalTasks
      });
    }
    return {
      ...state
    };
  });
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.TAG_SUGGESTION_LAZY_TASK,
    state,
    action,
    null,
    () => {
      const res = parseTasksResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        const tasks = state.data.get(action.meta.namespace).tasks || [];
        const offset = action.meta.offset;
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).tasks = offset === 0 ? res.tasks :
          (res.tasks && res.tasks.length > 0 ? tasks.concat(res.tasks) : tasks);
        state.data.get(action.meta.namespace).totalTasks = res.totalTasks;
        state.data.get(action.meta.namespace).totalSchedules = res.totalSchedules;
        state.data.get(action.meta.namespace).totalMilestones = res.totalMilestones;
      } else {
        state.data.set(action.meta.namespace, {
          ...defaultValue,
          action: res.action,
          errorMessage: res.errorMsg,
          tasks: res.tasks,
          totalTasks: res.totalTasks
        });
      }
      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(
    ACTION_TYPES.SAVE_SUGGESTION_CHOICE,
    state,
    action,
    null,
    () => {
      const res = parseSaveSuggestionChoiceResponse(action.payload.data);
      state.data.set(action.meta.namespace, {
        ...defaultValue,
        suggestionsChoiceId: res.suggestionsChoiceId,
        errorMessage: null,
        action: TagSuggestionAction.Success
      });

      return {
        ...state
      };
    }
  );
  if (result) return result;

  result = CommonUtil.excuteFunction(ACTION_TYPES.SET_DATA_PRODUCT, state, action, null, () => {
    const { productTradings, products } = action.payload;
    if (state.data.has(action.meta.namespace)) {
      state.data.get(action.meta.namespace).productTradings = productTradings;
      state.data.get(action.meta.namespace).products = products;
    }
    return {
      ...state
    };
  });
  if (result) return result;

  if (action.type === ACTION_TYPES.TAG_SUGGESTION_RESET) {
    if (state.data.has(action.meta.namespace)) {
      state.data.get(action.meta.namespace).action = TagSuggestionAction.None;
      state.data.get(action.meta.namespace).errorMessage = null;
      state.data.get(action.meta.namespace).errorItems = null;
      state.data.get(action.meta.namespace).reportTargets = null;
      state.data.get(action.meta.namespace).businessCards = [];
      state.data.get(action.meta.namespace).customers = [];
      state.data.get(action.meta.namespace).productTradings = [];
      state.data.get(action.meta.namespace).products = [];
      state.data.get(action.meta.namespace).schedules = [];
      state.data.get(action.meta.namespace).milestones = [];
      state.data.get(action.meta.namespace).tasks = [];
      state.data.get(action.meta.namespace).totalSchedules = LIMIT;
      state.data.get(action.meta.namespace).totalMilestones = LIMIT;
      state.data.get(action.meta.namespace).totalTasks = LIMIT;
      state.data.get(action.meta.namespace).totalProductTradings = LIMIT;
      state.data.get(action.meta.namespace).totalProducts = LIMIT;
      state.data.get(action.meta.namespace).totalBusinessCard = null;
      state.data.get(action.meta.namespace).totalCustomer = null;
      state.data.get(action.meta.namespace).suggestionsChoiceId = null;
      state.data.get(action.meta.namespace).businessCardsByIds = null;
    }
    return {
      ...state
    };
  } else {
    return state;
  }
};

/**
 * reset state
 */
export const reset = namespace => ({
  type: ACTION_TYPES.TAG_SUGGESTION_RESET,
  meta: {
    namespace
  }
});

export const getSuggestionsBusinessCard = (
  namespace: any,
  _searchValue?: string,
  _customerIds?: [],
  _offset?: number,
  _listChoice?: [],
  _relationFiledId?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_BUSINESS_CARD,
  payload: axios.post(`${apiUrlBusinessCard}/get-business-card-suggestions`, {
    offset: _offset || 0,
    searchValue: _searchValue,
    listIdChoice: _listChoice,
    customerIds: _customerIds,
    relationFiledId: _relationFiledId
  }),
  // payload: axios.get(`/content/json/getBusinessCardSuggestions.json`, {
  //   headers: { ['Content-Type']: 'application/json' }
  // }),
  meta: {
    namespace
  }
});

export const getLazySuggestionsBusinessCard = (
  namespace: any,
  _searchValue?: string,
  _customerIds?: [],
  _offset?: number,
  _listChoice?: [],
  _relationFiledId?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_BUSINESS_CARD,
  payload: axios.post(`${apiUrlBusinessCard}/get-business-card-suggestions`, {
    offset: _offset || 0,
    searchValue: _searchValue,
    listIdChoice: _listChoice,
    customerIds: _customerIds,
    relationFiledId: _relationFiledId
  }),
  // payload: axios.get(`/content/json/getBusinessCardSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace
  }
});

export const getCustomerSuggestion = (
  namespace: any,
  _searchValue?: string,
  _listChoice?: number,
  _offset?: number,
  _relationFiledId?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_CUSTOMER,
  payload: axios.post(`${apiUrlCustomer}/get-customer-suggestion`, {
    keyWords: _searchValue,
    offset: _offset || 0,
    listIdChoice: _listChoice || [],
    relationFieldId: _relationFiledId
  }),
  // payload: axios.get(`/content/json/getCustomerSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace
  }
});

export const getLazyCustomerSuggestion = (
  namespace: any,
  _searchValue?: string,
  _listChoice?: number,
  _offset?: number,
  _relationFiledId?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_CUSTOMER,
  payload: axios.post(`${apiUrlCustomer}/get-customer-suggestion`, {
    keyWords: _searchValue,
    offset: _offset || 0,
    listIdChoice: _listChoice || [],
    relationFieldId: _relationFiledId
  }),
  // payload: axios.get(`/content/json/getCustomerSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace
  }
});

export const prepareProductTradingSuggestions = (
  namespace: any,
  _keyWords?: string,
  _offset?: number,
  _customerIds?: any[],
  _listChoice?: [],
  _isFinish?: boolean
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_PRODUCT_TRADING,
  payload: axios.post(`${apiUrlSales}/get-product-trading-suggestions`, {
    searchValue: _keyWords,
    offset: _offset,
    customerIds: _customerIds || [],
    listIdChoice: _listChoice || []
    // isFinish: _isFinish
  }),
  // payload: axios.get(`/content/json/getProductTradingSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace
  }
});

export const prepareProductSuggestions = (
  namespace: any,
  _searchValue?: string,
  _offset?: number,
  _listChoice?: [],
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_PRODUCT,
  payload: axios.post(`${apiUrlProduct}/get-product-suggestions`, {
    searchValue: _searchValue,
    offset: _offset,
    listIdChoice: _listChoice,
    limit: _limit || LIMIT
  }),
  // payload: axios.get(`/content/json/getProductSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const getProductTradingSuggestions = (
  namespace: any,
  keyWords?: string,
  offset?: number,
  customerIds?: any[],
  listChoice?: []
) => async dispatch => {
  await dispatch(
    prepareProductTradingSuggestions(namespace, keyWords, offset, customerIds, listChoice)
  );
};

export const getLazyProductTradingSuggestions = (
  namespace: any,
  _keyWords?: string,
  _offset?: number,
  _customerIds?: any[],
  _listChoice?: any[],
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_PRODUCT_TRADING,
  payload: axios.post(`${apiUrlSales}/get-product-trading-suggestions`, {
    searchValue: _keyWords,
    offset: _offset,
    customerIds: _customerIds,
    listIdChoice: _listChoice || []
  }),
  // payload: axios.get(`/content/json/getProductTradingSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const getLazyProductSuggestions = (
  namespace: any,
  _searchValue?: string,
  _offset?: number,
  _listChoice?: any[],
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_PRODUCT,
  payload: axios.post(`${apiUrlProduct}/get-product-suggestions`, {
    searchValue: _searchValue,
    offset: _offset,
    listIdChoice: _listChoice,
    limit: _limit || 0
  }),
  // payload: axios.get(`/content/json/getProductSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const getProductSuggestions = (
  namespace: any,
  searchValue?: string,
  offset?: number,
  listChoice?: []
) => async dispatch => {
  await dispatch(prepareProductSuggestions(namespace, searchValue, offset, listChoice));
};

export const prepareMilestonesSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _listIdChoice?: any,
  _offset?: number,
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_MILESTONE,
  payload: axios.post(`${apiUrlSchedule}/get-milestones-suggestion`, {
    searchValue: _searchValue,
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    listIdChoice: _listIdChoice || [],
    offset: _offset || 0,
    limit: _limit || LIMIT
  }),
  // payload: axios.get(`/content/json/getMilestonesSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    limit: _limit || LIMIT
  }
});

export const getMilestonesSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _listIdChoice?: any,
  _offset?: number
) => async dispatch => {
  await dispatch(
    prepareMilestonesSuggestion(namespace, _searchValue, _customerId, _listIdChoice, _offset)
  );
};

export const prepareScheduleSuggestions = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_SCHEDULE,
  payload: axios.post(`${apiUrlSchedule}/get-schedule-suggestions`, {
    searchValue: _searchValue || '',
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    offset: _offset || 0,
    limit: LIMIT
  }),
  // payload: axios.get(`/content/json/getScheduleSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace
  }
});

export const getScheduleSuggestions = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number
) => async dispatch => {
  await dispatch(prepareScheduleSuggestions(namespace, _searchValue, _customerId, _offset));
};

export const getLazyScheduleSuggestions = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_SCHEDULE,
  payload: axios.post(`${apiUrlSchedule}/get-schedule-suggestions`, {
    searchValue: _searchValue,
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    offset: _offset,
    limit: LIMIT
  }),
  // payload: axios.get(`/content/json/getScheduleSuggestions.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const getLazyMilestonesSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _listIdChoice?: any,
  _offset?: number,
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_MILESTONE,
  payload: axios.post(`${apiUrlSchedule}/get-milestones-suggestion`, {
    searchValue: _searchValue,
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    listIdChoice: _listIdChoice || [],
    offset: _offset || 0,
    limit: _limit || LIMIT
  }),
  // payload: axios.get(`/content/json/getMilestonesSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const prepareTasksSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number,
  _listIdChoice?: any,
  _relationFieldId?: any,
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_TASK,
  payload: axios.post(`${apiUrlSchedule}/get-task-suggestion`, {
    searchValue: _searchValue,
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    offset: _offset || 0,
    limit: _limit || LIMIT,
    listIdChoice: _listIdChoice || [],
    relationFieldId: _relationFieldId || 0
  }),
  // payload: axios.get(`/content/json/getTasksSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    limit: _limit || LIMIT
  }
});

export const getTasksSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number,
  _listIdChoice?: []
) => async dispatch => {
  await dispatch(
    prepareTasksSuggestion(namespace, _searchValue, _customerId, _offset, _listIdChoice)
  );
};

export const getLazyTasksSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  _offset?: number,
  _listIdChoice?: any,
  _relationFieldId?: any,
  _limit?: number
) => ({
  type: ACTION_TYPES.TAG_SUGGESTION_LAZY_TASK,
  payload: axios.post(`${apiUrlSchedule}/get-task-suggestion`, {
    searchValue: _searchValue,
    customerId: _customerId && _customerId > 0 ? _customerId : null,
    offset: _offset || 0,
    limit: _limit || LIMIT,
    listIdChoice: _listIdChoice || [],
    relationFieldId: _relationFieldId
  }),
  // payload: axios.get(`/content/json/getTasksSuggestion.json`, { headers: { ['Content-Type']: 'application/json' } }),
  meta: {
    namespace,
    offset: _offset
  }
});

export const initRepostTargetSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number
) => async (dispatch, getState) => {
  await dispatch(prepareScheduleSuggestions(namespace, _searchValue, _customerId, 0));
  if (
    getState().tagSuggestionState.data.get(namespace).action === TagSuggestionAction.Success &&
    getState().tagSuggestionState.data.get(namespace).totalSchedules < LIMIT
  ) {
    const _limit = LIMIT - getState().tagSuggestionState.data.get(namespace).schedules.length;
    await dispatch(
      prepareMilestonesSuggestion(namespace, _searchValue, _customerId, null, 0, _limit)
    );
    if (getState().tagSuggestionState.data.get(namespace).action === TagSuggestionAction.Success) {
      const _total =
        getState().tagSuggestionState.data.get(namespace).schedules.length +
        getState().tagSuggestionState.data.get(namespace).milestones.length;
      if (_total < LIMIT) {
        await dispatch(
          prepareTasksSuggestion(
            namespace,
            _searchValue,
            _customerId,
            0,
            null,
            null,
            LIMIT - _total
          )
        );
      }
    }
  }
};

export const searchRepostTargetSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerId?: number,
  isFirst?: boolean
) => async (dispatch, getState) => {
  // call api get schedule
  let schedulesLength = getState().tagSuggestionState.data?.get(namespace)?.schedules?.length || 0;
  let totalSchedules = getState().tagSuggestionState.data?.get(namespace)?.totalSchedules || 0;
  if (isFirst) {
    await dispatch(getLazyScheduleSuggestions(namespace, _searchValue, _customerId, 0));
  } else if (totalSchedules === LIMIT) {
    await dispatch(
      getLazyScheduleSuggestions(namespace, _searchValue, _customerId, schedulesLength)
    );
  }
  schedulesLength = getState().tagSuggestionState.data.get(namespace).schedules.length;
  totalSchedules = getState().tagSuggestionState.data.get(namespace).totalSchedules;

  // call api Milestones
  let milestonesLength = getState().tagSuggestionState.data?.get(namespace)?.milestones?.length || 0;
  let totalMilestones = getState().tagSuggestionState.data?.get(namespace).totalMilestones || 0;
  if (totalSchedules < LIMIT && totalMilestones === LIMIT) {
    const scheduleLengthLast = schedulesLength % LIMIT;
    const limitMiles = milestonesLength === 0 ? LIMIT - scheduleLengthLast : LIMIT;
    const offset = milestonesLength === 0 ? 0 : milestonesLength;
    await dispatch(
      getLazyMilestonesSuggestion(namespace, _searchValue, _customerId, null, offset, limitMiles)
    );
  }
  milestonesLength = getState().tagSuggestionState.data.get(namespace).milestones.length;
  totalMilestones = getState().tagSuggestionState.data.get(namespace).totalMilestones;

  // call api Tasks
  const tasksLength = getState().tagSuggestionState.data?.get(namespace)?.tasks?.length || 0;
  const totalTasks = getState().tagSuggestionState.data?.get(namespace).totalTasks || 0;
  if (totalSchedules < LIMIT && totalMilestones < LIMIT && totalTasks === LIMIT) {
    const scheduleMilesLengthLast = (schedulesLength + milestonesLength) % LIMIT;
    const limitTasks = tasksLength > 0 ? LIMIT : LIMIT - scheduleMilesLengthLast;
    const offset = tasksLength > 0 ? tasksLength : 0;
    await dispatch(
      getLazyTasksSuggestion(namespace, _searchValue, _customerId, offset, null, null, limitTasks)
    );
  }
};

export const initProductSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerIds?: [],
  _productTradingIdChoice?: [],
  _productIdChoice?: [],
  isFinish?: boolean
) => async (dispatch, getState) => {
  await dispatch(
    prepareProductTradingSuggestions(
      namespace,
      _searchValue,
      0,
      _customerIds,
      _productTradingIdChoice
      // isFinish
    )
  );
  const productTradings = getState().tagSuggestionState.data.get(namespace).productTradings || [];
  if (
    getState().tagSuggestionState.data.get(namespace).action === TagSuggestionAction.Success &&
    productTradings.length < LIMIT
  ) {
    await dispatch(
      prepareProductSuggestions(
        namespace,
        _searchValue,
        0,
        _productIdChoice,
        LIMIT - productTradings.length
      )
    );
  }
};

export const searchProductSuggestion = (
  namespace: any,
  _searchValue?: string,
  _customerIds?: [],
  _productTradingIdChoice?: [],
  _productIdChoice?: [],
  isFirst?: boolean
) => async (dispatch, getState) => {
  // call api get Product Trading
  let productTradingsLength = getState().tagSuggestionState.data?.get(namespace)?.productTradings?.length || 0;
  let totalProductTradings = getState().tagSuggestionState.data?.get(namespace)?.totalProductTradings || 0;
  if (isFirst) {
    await dispatch(
      getLazyProductTradingSuggestions(namespace, _searchValue, 0, _customerIds, _productTradingIdChoice)
    );
  } else if (totalProductTradings === LIMIT) {
    await dispatch(
      getLazyProductTradingSuggestions(namespace, _searchValue, productTradingsLength, _customerIds, _productTradingIdChoice)
    );
  }
  productTradingsLength = getState().tagSuggestionState.data.get(namespace).productTradings.length;
  totalProductTradings = getState().tagSuggestionState.data.get(namespace).totalProductTradings;


  // call api Product
  const productsLength = getState().tagSuggestionState.data?.get(namespace)?.products?.length || 0;
  const totalProducts = getState().tagSuggestionState.data?.get(namespace).totalProducts || 0;
  if (totalProductTradings < LIMIT && totalProducts === LIMIT) {
    const productTradingsLengthLast = productTradingsLength % LIMIT;
    const limitProducts = productsLength > 0 ? LIMIT : LIMIT - productTradingsLengthLast;
    const offset = productsLength > 0 ? productsLength : 0;
    await dispatch(
      getLazyProductSuggestions(namespace, _searchValue, offset, _productIdChoice, limitProducts)
    );
  }
};

/**
 * Save suggestion choice when selected auto complete
 * @param namespace
 * @param searchValue
 */
export const saveSuggestionsChoice = (namespace, index, idResult) => ({
  type: ACTION_TYPES.SAVE_SUGGESTION_CHOICE,
  payload: axios.post(`${apiUrlCommon}/save-suggestions-choice`, {
    index,
    idResult: [idResult]
  }),
  meta: {
    namespace
  }
});

export const getBusinessCardsByIds = (namespace, businessCardIds) => ({
  type: ACTION_TYPES.BUSINESS_CARD_GET_BY_IDS,
  payload: axios.post(
    `${apiUrlBusinessCard}/get-business-cards-by-ids`,
    {
      businessCardIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace
  }
});
