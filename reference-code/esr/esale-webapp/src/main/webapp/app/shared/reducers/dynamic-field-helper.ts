import {
  SEARCH_TYPE,
  SEARCH_OPTION,
  FIELD_BELONG,
  API_CONTEXT_PATH,
  API_CONFIG
} from 'app/config/constants';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from '../layout/dynamic-form/constants';
import {
  timeTzToUtc,
  tzToUtc,
  DATE_TIME_FORMAT,
  switchFormatDate,
  TYPE_SWICH_FORMAT
} from 'app/shared/util/date-utils';
import { LOOKUP_TYPE_SEARCH_OPTION_ORS } from 'app/shared/layout/common/suggestion/constants';

export const PARAM_GET_LOOKUP_EMPLOYEES = (searchConditions, offset, limit, orderBy = []) => ({
  searchConditions,
  filterConditions: [],
  localSearchKeyword: null,
  selectedTargetType: 0,
  selectedTargetId: 0,
  isUpdateListView: false,
  orderBy,
  offset,
  limit
});

export const PARAM_GET_LOOKUP_PRODUCTS = (searchConditions, offset, limit, orderBy = []) => ({
  searchConditions,
  productCategoryId: null,
  isContainCategoryChild: false,
  searchLocal: null,
  orderBy,
  offset,
  limit,
  isOnlyData: true,
  filterConditions: [],
  isUpdateListInfo: false
});

export const PARAM_GET_LOOKUP_TASKS = (searchConditions, offset, limit, orderBy = []) => ({
  statusTaskIds: [],
  searchLocal: '',
  localNavigationConditons: {
    employeeIds: null,
    groupIds: null,
    customerIds: null,
    startDate: null,
    finishDate: null
  },
  searchConditions,
  orderBy,
  limit,
  filterConditions: [],
  offset,
  filterByUserLoginFlg: 0
});

export const PARAM_GET_LOOKUP_CUSTOMERS = (searchConditions, offset, limit, orderBy = []) => ({
  searchConditions,
  orderBy,
  offset,
  limit,
  filterConditions: [],
  isUpdateListView: false
});

export const PARAM_GET_LOOKUP_BUSINESS_CARDS = (searchConditions, offset, limit, orderBy = []) => ({
  selectedTargetType: 0,
  selectedTargetId: 0,
  searchConditions,
  orderBy,
  limit,
  filterConditions: [],
  offset,
  isFirstLoad: false
});

export const PARAM_GET_LOOKUP_SCHEDULES = (
  searchScheduleCondition,
  offset,
  limit,
  orderBy = []
) => ({
  isSearchSchedule: true,
  isSearchMilestone: false,
  isSearchTask: false,
  searchScheduleCondition,
  searchMilestoneCondition: [],
  searchTaskCondition: [],
  limit,
  offset
});

export const PARAM_GET_LOOKUP_TRADING_PRODUCT = (
  searchConditions,
  offset,
  limit,
  orderBy = []
) => ({
  selectedTargetType: 0,
  selectedTargetId: 0,
  searchConditions,
  offset,
  limit,
  isFirstLoad: false,
  filterConditions: []
});

export const PARAM_GET_LOOKUP_ACTIVITY = (searchConditions, offset, limit, orderBy = []) => ({
  searchConditions,
  selectedTargetType: 0,
  orderBy,
  limit,
  offset
});
// TODO other service

export const PARAM_GET_RELATION_SUGGEST_EMPLOYEES = (
  keySearch: string,
  offSet,
  limit,
  listItemChoice: any[],
  relationFieldId: number,
  searchType = null
) => ({
  keyWords: keySearch,
  offSet,
  limit,
  listItemChoice,
  relationFieldI: relationFieldId,
  searchType
});

export const PARAM_GET_RELATION_SUGGEST_PRODUCTS = (
  keySearch: string,
  offset: number,
  limit,
  listIdChoice: number[],
  relationFieldId: number
) => ({
  limit,
  offset,
  searchValue: keySearch,
  listIdChoice,
  relationFieldId
});

export const PARAM_GET_RELATION_SUGGEST_TASK = (
  keySearch: string,
  offset,
  limit,
  listIdChoice: number[],
  relationFieldId: number
) => ({
  searchValue: keySearch,
  limit,
  offset,
  listIdChoice,
  relationFieldId
});

export const PARAM_GET_RELATION_SUGGEST_CUSTOMER = (
  keySearch: string,
  offset,
  listIdChoice: number[],
  relationFieldId: number
) => ({
  keyWords: keySearch,
  offset,
  listIdChoice,
  relationFieldId
});

export const PARAM_GET_RELATION_SUGGEST_BUSINESS_CARD = (
  keySearch: string,
  offset: number,
  listIdChoice: number[],
  relationFieldId: number
) => ({
  offset,
  searchValue: keySearch,
  listIdChoice,
  relationFieldId
});

export const PARAM_GET_RELATION_SUGGEST_ACTIVITY = (
  keySearch: string,
  offset: number,
  listIdChoice: number[],
  relationFieldId: number
) => ({
  customerIds: [],
  offset,
  searchValue: keySearch,
  listIdChoice,
  relationFieldId
});

// TODO other service

export const PARAM_GET_EMPLOYEE_BY_IDS = recordIds => ({
  employeeIds: recordIds
});

export const PARAM_GET_PRODUCT_BY_IDS = recordIds => ({
  productIds: recordIds
});

export const PARAM_GET_TASK_BY_IDS = recordIds => ({
  taskIds: recordIds
});

export const PARAM_GET_CUSTOMER_BY_IDS = recordIds => ({
  customerIds: recordIds
});

export const PARAM_GET_BUSINESS_CARD_BY_IDS = recordIds => ({
  businessCardIds: recordIds
});

export const PARAM_GET_ACTIVITY_BY_IDS = recordIds => ({
  activityIds: recordIds
});

// TODO other service

export const PARAM_GET_RELATION_DATA = (
  listIds: number[],
  fieldBelong: number,
  fieldIds: number[]
) => ({ listIds, fieldBelong, fieldIds });

export const SEARCH_FROM_TO_TYPES = [
  '5', // numberic
  '6', // date
  '7', // date time
  '8', // time
  '16' // calculation
];

export const BELONG_DATAS = {
  '8': 'employee_data',
  '14': 'product_data',
  '15': 'task_data',
  '5': 'customer_data',
  '6': 'activity_data',
  '16': 'product_trading_data',
  '4': 'business_card_data'
};

const addSeconds = datetime => {
  if (!_.isNil(datetime) && datetime.length === 16) {
    return `${datetime}:00`;
  }
  return datetime;
};

const makeValueSearch = fieldInfo => {
  if (SEARCH_FROM_TO_TYPES.includes(fieldInfo.fieldType.toString())) {
    let valueSearch = fieldInfo.fieldValue;
    const type = fieldInfo.fieldType.toString();
    if (type === DEFINE_FIELD_TYPE.TIME) {
      valueSearch = timeTzToUtc(valueSearch, true);
    }
    if (type === DEFINE_FIELD_TYPE.DATE) {
      valueSearch = switchFormatDate(valueSearch, TYPE_SWICH_FORMAT.USER_TO_DEFAULT);
    }
    if (type === DEFINE_FIELD_TYPE.DATE_TIME) {
      valueSearch = addSeconds(
        tzToUtc(
          switchFormatDate(valueSearch, TYPE_SWICH_FORMAT.USER_TO_DEFAULT),
          DATE_TIME_FORMAT.Database
        )
      );
    }
    return JSON.stringify({ from: valueSearch, to: valueSearch });
  }
  return fieldInfo.fieldValue;
};

const SEARCH_KEY_WORD = {
  '14': [DEFINE_FIELD_TYPE.TEXT, DEFINE_FIELD_TYPE.TEXTAREA],
  '6': [DEFINE_FIELD_TYPE.TEXT, DEFINE_FIELD_TYPE.TEXTAREA],
  '8': [DEFINE_FIELD_TYPE.TEXT, DEFINE_FIELD_TYPE.TEXTAREA],
  '16': [DEFINE_FIELD_TYPE.TEXT, DEFINE_FIELD_TYPE.TEXTAREA],
  '4': [DEFINE_FIELD_TYPE.TEXT, DEFINE_FIELD_TYPE.TEXTAREA, DEFINE_FIELD_TYPE.ADDRESS]
};

const makeFieldNameSearch = (fieldInfo, fieldBelong, order = false) => {
  let fieldNameSearch = fieldInfo.fieldName;
  if (!fieldInfo.isDefault && fieldBelong && BELONG_DATAS[fieldBelong.toString()]) {
    fieldNameSearch = `${BELONG_DATAS[fieldBelong.toString()]}.${fieldInfo.fieldName}`;
  }
  if (
    !order &&
    fieldInfo.isDefault &&
    SEARCH_KEY_WORD[_.toString(fieldBelong)] &&
    SEARCH_KEY_WORD[_.toString(fieldBelong)].includes(_.toString(fieldInfo.fieldType))
  ) {
    fieldNameSearch += '.keyword';
  }
  return fieldNameSearch;
};

const makeValueOrder = (fieldInfo, fieldBelong) => {
  try {
    const orderBy = [];
    if (fieldBelong === FIELD_BELONG.ACTIVITY) {
      return [];
    }
    const fType = fieldInfo.fieldType.toString();
    if (
      fType === DEFINE_FIELD_TYPE.TEXT ||
      fType === DEFINE_FIELD_TYPE.TEXTAREA ||
      fType === DEFINE_FIELD_TYPE.LINK ||
      fType === DEFINE_FIELD_TYPE.PHONE_NUMBER ||
      fType === DEFINE_FIELD_TYPE.EMAIL
    ) {
      orderBy.push({
        isNested: false,
        key: makeFieldNameSearch(fieldInfo, fieldBelong, true),
        value: 'ASC',
        fieldType: fType,
        isDefault: _.isNil(fieldInfo.isDefault) ? 'false' : fieldInfo.isDefault.toString()
      });
    }
    return orderBy;
  } catch (error) {
    return [];
  }
};

const makeValueSearchOpt = fieldInfo => {
  let searchOpt = SEARCH_OPTION.AND;
  const fType = fieldInfo.fieldType.toString();
  if (LOOKUP_TYPE_SEARCH_OPTION_ORS.includes(fType)) {
    searchOpt = SEARCH_OPTION.OR;
  }
  return searchOpt;
};

export const makeParamsLookupSuggest = (fieldBelong: number, fieldInfo: any, offset, limit) => {
  const searchConditions = [];
  searchConditions.push({
    fieldType: fieldInfo.fieldType,
    isDefault: `${fieldInfo.isDefault}`,
    fieldName: makeFieldNameSearch(fieldInfo, fieldBelong),
    fieldValue: makeValueSearch(fieldInfo),
    searchType: SEARCH_TYPE.LIKE,
    searchOption: makeValueSearchOpt(fieldInfo)
  });
  const orderBy = makeValueOrder(fieldInfo, fieldBelong);

  const params = { url: '', query: null };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH + '/get-employees';
    params.query = PARAM_GET_LOOKUP_EMPLOYEES(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH + '/get-products';
    params.query = PARAM_GET_LOOKUP_PRODUCTS(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH + '/get-tasks';
    params.query = PARAM_GET_LOOKUP_TASKS(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH + '/get-product-tradings';
    params.query = PARAM_GET_LOOKUP_TRADING_PRODUCT(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH + '/get-customers';
    params.query = PARAM_GET_LOOKUP_CUSTOMERS(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH + '/get-business-cards';
    params.query = PARAM_GET_LOOKUP_BUSINESS_CARDS(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.SCHEDULE) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH + '/get-data-for-calendar-by-list';
    params.query = PARAM_GET_LOOKUP_SCHEDULES(searchConditions, offset, limit, orderBy);
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activities`;
    params.query = PARAM_GET_LOOKUP_ACTIVITY(searchConditions, offset, limit, orderBy);
  }
  // TODO other service
  return params;
};

const NODE_GETS = {
  '8': {
    records: 'employees',
    total: 'totalRecords',
    keyId: 'employeeId'
  },
  '14': {
    // product
    records: 'dataInfo.products',
    total: 'recordCount',
    keyId: 'productId'
  },
  '15': {
    // task
    records: 'dataInfo.tasks',
    total: 'countTotalTask',
    keyId: 'taskId'
  },
  '5': {
    // customer
    records: 'customers',
    total: 'totalRecords',
    keyId: 'customerId'
  },
  '2': {
    // schedule
    records: 'itemList',
    total: 'totalRecords',
    keyId: 'itemId'
  },
  '4': {
    // business card
    records: 'businessCards',
    total: 'totalRecords',
    keyId: 'businessCardId'
  },
  '16': {
    // business card
    records: 'productTradings',
    total: 'total',
    keyId: 'productTradingId'
  },
  '6': {
    // activities
    records: 'activities',
    total: 'total',
    keyId: 'activityId'
  }
  // other services
};

export const parseResponseLookupSuggest = (fieldBelong: number, res) => {
  let message = '';
  if (res.errors && res.errors.length > 0) {
    message = res.errors[0].message;
  }
  const suggestLookup = { records: [], totalRecord: 0 };
  const nodeGets = NODE_GETS[_.toString(fieldBelong)] || { records: '', total: '', keyId: '' };
  const records = _.get(res, nodeGets.records);
  if (records && records.length > 0) {
    suggestLookup.records.push(...records);
    suggestLookup.records.forEach(e => {
      e['recordId'] = e[nodeGets.keyId];
    });
  }
  const total = _.get(res, nodeGets.total);
  if (total) {
    suggestLookup.totalRecord = total;
  }
  return { message, suggestLookup };
};

export const makeParamsRelationSuggest = (
  fieldBelong: number,
  keySearch: string,
  offset,
  limit,
  listIdChoice: any[],
  relationFieldId: number,
  searchType = null
) => {
  const params = { url: '', query: null };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    const listItemChoice = [];
    listIdChoice.forEach(e => {
      if (_.isObject(e)) {
        listItemChoice.push(e);
      } else {
        listItemChoice.push({ idChoice: e, searchType: 2 });
      }
    });
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH + '/get-employees-suggestion';
    params.query = PARAM_GET_RELATION_SUGGEST_EMPLOYEES(
      keySearch,
      offset,
      limit,
      listItemChoice,
      relationFieldId,
      searchType
    );
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH + '/get-product-suggestions';
    params.query = PARAM_GET_RELATION_SUGGEST_PRODUCTS(
      keySearch,
      offset,
      limit,
      listIdChoice,
      relationFieldId
    );
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH + '/get-task-suggestion';
    params.query = PARAM_GET_RELATION_SUGGEST_TASK(
      keySearch,
      offset,
      limit,
      listIdChoice,
      relationFieldId
    );
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH + '/get-customer-suggestion';
    params.query = PARAM_GET_RELATION_SUGGEST_CUSTOMER(
      keySearch,
      offset,
      listIdChoice,
      relationFieldId
    );
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    params.url =
      API_CONTEXT_PATH +
      '/' +
      API_CONFIG.BUSINESS_CARD_SERVICE_PATH +
      '/get-business-card-suggestions';
    params.query = PARAM_GET_RELATION_SUGGEST_BUSINESS_CARD(
      keySearch,
      offset,
      listIdChoice,
      relationFieldId
    );
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    params.url = `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activities-suggestions`;
    params.query = PARAM_GET_RELATION_SUGGEST_ACTIVITY(
      keySearch,
      offset,
      listIdChoice,
      relationFieldId
    );
  }
  // TODO other service
  return params;
};

export const parseResponseRelationSuggest = (fieldBelong: number, res) => {
  let message = '';
  if (res.errors && res.errors.length > 0) {
    message = res.errors[0].message;
  }
  const suggestRelation = { records: [], totalRecord: undefined }; // TODO waiting api add totalRecord to response
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    if (res && res.employees && res.employees.length > 0) {
      suggestRelation.records.push(...res.employees);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.employeeId;
      });
    }
    // TODO waiting response api
    if (res && res.total) {
      suggestRelation.totalRecord = res.total;
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    if (res && res.dataInfo && res.dataInfo.length > 0) {
      suggestRelation.records.push(...res.dataInfo);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.productId;
      });
    }
    // TODO waiting response total records api
    if (res && res.total) {
      suggestRelation.totalRecord = res.total;
    }
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    if (res && res.tasks && res.tasks.length > 0) {
      suggestRelation.records.push(...res.tasks);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.taskId;
      });
    }
    // TODO waiting response total records api
    if (res && res.total) {
      suggestRelation.totalRecord = res.total;
    }
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    if (res && res.customers && res.customers.length > 0) {
      suggestRelation.records.push(...res.customers);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.customerId;
      });
    }
    if (res && res.total) {
      suggestRelation.totalRecord = res.total;
    }
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    if (res && res.businessCards && res.businessCards.length > 0) {
      suggestRelation.records.push(...res.businessCards);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.businessCardId;
      });
    }
    // TODO waiting response total records api
    if (res && res.total) {
      suggestRelation.totalRecord = res.total;
    }
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    if (res && res.activities && res.activities.length > 0) {
      suggestRelation.records.push(...res.activities);
      suggestRelation.records.forEach(e => {
        e['recordId'] = e.activityId;
      });
      suggestRelation.totalRecord = res.activities.length;
    }
  }
  // TODO other service

  return { message, suggestRelation };
};

export const makeParamsGetDataByIds = (fieldBelong, recordIds: number[]) => {
  const params = { url: '', query: {} };
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH + '/get-employees-by-ids';
    params.query = PARAM_GET_EMPLOYEE_BY_IDS(recordIds);
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.PRODUCT_SERVICE_PATH + '/get-products-by-ids';
    params.query = PARAM_GET_PRODUCT_BY_IDS(recordIds);
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    params.url = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH + '/get-tasks-by-ids';
    params.query = PARAM_GET_TASK_BY_IDS(recordIds);
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH + '/get-customers-by-ids';
    params.query = PARAM_GET_CUSTOMER_BY_IDS(recordIds);
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH + '/get-business-cards-by-ids';
    params.query = PARAM_GET_BUSINESS_CARD_BY_IDS(recordIds);
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    params.url =
      API_CONTEXT_PATH + '/' + API_CONFIG.ACTIVITY_SERVICE_PATH + '/get-activities-by-ids';
    params.query = PARAM_GET_ACTIVITY_BY_IDS(recordIds);
  }
  return params;
};

export const parseResponseGetDataByIds = (fieldBelong: number, res) => {
  let message = '';
  if (res.errors && res.errors.length > 0) {
    message = res.errors[0].message;
  }
  const recordData = [];
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    if (res && res.employees) {
      recordData.push(...res.employees);
      recordData.forEach(e => {
        e['recordId'] = e.employeeId;
      });
    }
  } else if (fieldBelong === FIELD_BELONG.PRODUCT) {
    if (res && res.products) {
      recordData.push(...res.products);
      recordData.forEach(e => {
        e['recordId'] = e.productId;
      });
    }
  } else if (fieldBelong === FIELD_BELONG.TASK) {
    if (res && res.tasks) {
      recordData.push(...res.tasks);
      recordData.forEach(e => {
        e['recordId'] = e.taskId;
      });
    }
  } else if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    if (res && res.customers) {
      recordData.push(...res.customers);
      recordData.forEach(e => {
        e['recordId'] = e.customerId;
      });
    }
  } else if (fieldBelong === FIELD_BELONG.ACTIVITY) {
    if (res && res.activities) {
      recordData.push(...res.activities);
      recordData.forEach(e => {
        e['recordId'] = e.activityId;
        e['createdDate'] = _.get(e['createdDate'], 'date');
        e['updatedDate'] = _.get(e['updatedDate'], 'date');
        e['contactDate'] = _.get(e['contactDate'], 'date');
      });
    }
  } else if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
    if (res && res.businessCards) {
      recordData.push(...res.businessCards);
      recordData.forEach(e => {
        e['recordId'] = e.businessCardId;
        e['createdDate'] = _.get(e['createdDate'], 'date');
        e['updatedDate'] = _.get(e['updatedDate'], 'date');
        e['lastContactDate'] = _.get(e['lastContactDate'], 'date');
      });
    }
  }

  // TODO other service

  return { message, recordData };
};

export const makeParamsGetRelationData = (
  fieldBelong: number,
  listIds: number[],
  fieldIds: number[]
) => {
  const params = { url: '', query: {} };
  params.url = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH + '/get-relation-data';
  params.query = PARAM_GET_RELATION_DATA(listIds, fieldBelong, fieldIds);
  return params;
};

export const parseResponseGetRelationData = (fieldBelong: number, res: any) => {
  const recordData = { records: [], fieldItems: [] };
  if (res && res.relationData) {
    recordData.records.push(...res.relationData.map(e => ({ ...e, fieldBelong })));
  }
  if (res && res.fieldItems) {
    recordData.fieldItems.push(...res.fieldItems);
  }
  return { recordData };
};
