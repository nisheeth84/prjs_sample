import _ from 'lodash';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import StringUtils from 'app/shared/util/string-utils';
import { parseListEmployeeResponse as parseEmployeesResponse } from 'app/modules/employees/list/employee-list.reducer';
import { parseListProductResponse } from 'app/modules/products/list/product-list.reducer';
import { TagAutoCompleteType } from '../constants';
import { parseGetTaskResponse as parseGetMilestoneResponse } from 'app/modules/tasks/list/task-list.reducer';
import { path } from 'ramda';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';

const makeConditionSearchEmployeeDefault = (offset, limit) => {
  return {
    searchConditions: [],
    filterConditions: [],
    localSearchKeyword: null,
    selectedTargetType: 1,
    selectedTargetId: 0,
    isUpdateListView: false,
    orderBy: [],
    offset,
    limit
  };
};

const makeConditionSearchProductDefault = (offset, limit) => {
  return {
    searchConditions: [],
    productCategoryId: null,
    isContainCategoryChild: false,
    searchLocal: '',
    orderBy: [],
    offset,
    limit,
    isOnlyData: false,
    filterConditions: [],
    isUpdateListInfo: false
  };
};

const makeConditionSearchMilestoneDefault = (offset, limit) => {
  return {
    statusTaskIds: [],
    searchLocal: '',
    searchConditions: [],
    orderBy: [],
    offset,
    limit,
    filterConditions: [],
    filterByUserLoginFlg: 0,
    localNavigationConditons: {
      customerIds: [],
      employeeIds: [],
      groupIds: [],
      startDate: null,
      finishDate: null
    }
  };
};

const makeConditionSearchBusinessCardDefault = (offset, limit) => {
  return {
    searchConditions: [],
    filterConditions: [],
    searchLocal: null,
    selectedTargetType: 1,
    selectedTargetId: 0,
    orderBy: [],
    offset,
    limit
  };
};

export const ACTION_TYPES = {
  EMPLOYEE_LIST_EMPLOYEES_GET: 'tagAuto/EMPLOYEES_GET',
  PRODUCT_LIST_PRODUCT_GET: 'tagAuto/PRODUCT_GET',
  TASK_LIST_TASK_GET: 'tagAuto/TASK_GET',
  MILESTONES_LIST_MILESTONES_GET: 'tagAuto/MILESTONES_LIST_MILESTONES_GET',
  PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET: 'tagAuto/PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET',
  BUSINESSCARD_LIST_BUSINESSCARD_GET: 'tagAuto/BUSINESSCARD_LIST_BUSINESSCARD_GET',
  CUSTOMER_LIST_CUSTOMERS_GET: 'tagAuto/CUSTOMER_LIST_CUSTOMERS_GET'
};

const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

/**
 * get employees
 *
 * @param key
 */
export const getEmployees = params => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET,
  payload: axios.post(
    `${employeesApiUrl}/get-employees`,
    {
      searchConditions: params.searchConditions,
      filterConditions: [],
      localSearchKeyword: null,
      selectedTargetType: 0,
      selectedTargetId: 0,
      isUpdateListView: null,
      orderBy: null,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getProducts = params => ({
  type: ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.PRODUCT_SERVICE_PATH}/get-products`,
    {
      searchConditions: params.searchConditions,
      productCategoryId: params.productCategoryId,
      isContainCategoryChild: params.isContainCategoryChild,
      searchLocal: params.searchLocal,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit,
      isOnlyData: params.isOnlyData,
      filterConditions: params.filterConditions,
      isUpdateListInfo: params.isUpdateListInfo
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getMilestones = params => ({
  type: ACTION_TYPES.MILESTONES_LIST_MILESTONES_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-milestones`,
    {
      searchCondition: params.searchConditions,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getProductTradings = params => ({
  type: ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/get-product-tradings`,
    {
      searchConditions: params.searchConditions,
      offset: params.offset,
      limit: params.limit,
      isOnlyData: true,
      isFirstLoad: true,
      searchLocal: null,
      orders: [],
      filterConditions: [],
      selectedTargetId: 0,
      selectedTargetType: 0
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

// TODO
export const getTasks = params => ({
  type: ACTION_TYPES.TASK_LIST_TASK_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-tasks`,
    params,
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getCustomers = params => ({
  type: ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customers`,
    {
      searchConditions: params.searchConditions,
      filterConditions: [],
      localSearchKeyword: null,
      selectedTargetType: 0,
      selectedTargetId: 0,
      isUpdateListView: null,
      orderBy: null,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getBusinessCard = params => ({
  type: ACTION_TYPES.BUSINESSCARD_LIST_BUSINESSCARD_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards`,
    {
      searchConditions: params.searchConditions,
      filterConditions: [],
      searchLocal: null,
      selectedTargetType: 0,
      selectedTargetId: 0,
      orderBy: null,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export enum FieldsSearchResultsAction {
  None,
  Request,
  Error,
  SuccessGetEmployee,
  SuccessGetProduct,
  SuccessGetTask,
  SuccessGetMilestones,
  SuccessGetProductTradings,
  SuccessGetBusinessCards,
  SuccessGetCustomers
}

export interface FieldsSearchResultsData {
  action: FieldsSearchResultsAction;
  dataResponse: any;
}
const initialState = {
  action: FieldsSearchResultsAction.None,
  dataResponse: null
};

export type FieldsSearchResultsState = Readonly<typeof initialState>;

// Reducer
export default (
  state: FieldsSearchResultsState = initialState,
  action
): FieldsSearchResultsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET):
    case REQUEST(ACTION_TYPES.MILESTONES_LIST_MILESTONES_GET):
    case REQUEST(ACTION_TYPES.TASK_LIST_TASK_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_LIST_BUSINESSCARD_GET):
      return {
        ...state,
        action: FieldsSearchResultsAction.Request
      };
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET):
    case FAILURE(ACTION_TYPES.MILESTONES_LIST_MILESTONES_GET):
    case FAILURE(ACTION_TYPES.TASK_LIST_TASK_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET):
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_LIST_BUSINESSCARD_GET):
      return {
        ...state,
        action: FieldsSearchResultsAction.Error
      };

    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET): {
      const res = parseEmployeesResponse(action.payload.data);
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetEmployee,
        dataResponse: res.employees
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_PRODUCT_GET): {
      const res = parseListProductResponse(action.payload.data);
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetProduct,
        dataResponse: res.products
      };
    }
    case SUCCESS(ACTION_TYPES.MILESTONES_LIST_MILESTONES_GET): {
      const res = action.payload.data;
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetMilestones,
        dataResponse: res
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCT_TRADING_GET): {
      const res = action.payload.data;
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetProductTradings,
        dataResponse: res
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_LIST_TASK_GET): {
      const res = path(['dataInfo'], action.payload.data);
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetTask,
        dataResponse: res
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET): {
      const res = action.payload.data;
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetCustomers,
        dataResponse: res
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_LIST_BUSINESSCARD_GET): {
      const res = action.payload.data;
      return {
        ...state,
        action: FieldsSearchResultsAction.SuccessGetBusinessCards,
        dataResponse: res
      };
    }
    default:
      return { ...state };
  }
};

const convertCondition = (offset, limit, params, type: TagAutoCompleteType) => {
  let condition;
  switch (type) {
    case TagAutoCompleteType.Employee:
      condition = makeConditionSearchEmployeeDefault(offset, limit);
      condition.isOnlyData = true;
      break;
    case TagAutoCompleteType.Product:
    case TagAutoCompleteType.ProductTrading:
      condition = makeConditionSearchProductDefault(offset, limit);
      condition.isOnlyData = true;
      break;
    case TagAutoCompleteType.Milestone:
      condition = makeConditionSearchMilestoneDefault(offset, limit);
      condition.isOnlyData = true;
      break;
    case TagAutoCompleteType.Task:
      condition = makeConditionSearchMilestoneDefault(offset, limit);
      break;
    case TagAutoCompleteType.Customer:
      condition = makeConditionSearchEmployeeDefault(offset, limit);
      break;
    case TagAutoCompleteType.BusinessCard:
      condition = makeConditionSearchBusinessCardDefault(offset, limit);
      break;
    default:
      break;
  }
  if (params && params.length > 0) {
    if (params.constructor === 'test'.constructor) {
      condition.searchLocal = JSON.stringify(params);
    } else if (params.constructor === [].constructor) {
      const searchConditions = [];
      params.forEach(param => {
        if (!_.isNil(param.fieldRelation)) {
          return;
        }
        const isArray = Array.isArray(param.fieldValue);
        if (!param.isSearchBlank && (!param.fieldValue || param.fieldValue.length <= 0)) {
          return;
        }
        let val = null;
        if (param.isSearchBlank) {
          val = isArray ? '[]' : '';
        } else if (isArray) {
          val = JSON.stringify(param.fieldValue);
        } else {
          val = param.fieldValue.toString();
        }
        if (
          type === TagAutoCompleteType.Task &&
          param.fieldType &&
          param.fieldType.toString() === DEFINE_FIELD_TYPE.DATE
        ) {
          val = JSON.stringify(param.fieldValue[0]);
        }
        searchConditions.push(
          type === TagAutoCompleteType.Milestone || type === TagAutoCompleteType.Task
            ? {
                fieldType: param.fieldType,
                isDefault: `${param.isDefault}`,
                fieldName: param.fieldName ? param.fieldName.split('.')[0] : param.fieldName,
                fieldValue: val,
                searchType: param.searchType,
                searchOption: param.searchOption
              }
            : {
                isNested: false,
                fieldType: param.fieldType,
                fieldId: param.fieldId,
                isDefault: `${param.isDefault}`,
                fieldName: param.fieldName,
                fieldValue: val,
                searchType: param.searchType,
                searchOption: param.searchOption
              }
        );
      });
      condition.searchConditions = searchConditions;
    }
  }
  return condition;
};

export const handleSearchProducts = (offset, limit, params?) => async dispatch => {
  await dispatch(getProducts(convertCondition(offset, limit, params, TagAutoCompleteType.Product)));
};

export const handleSearchEmployees = (offset, limit, params) => async dispatch => {
  await dispatch(
    getEmployees(convertCondition(offset, limit, params, TagAutoCompleteType.Employee))
  );
};

export const handleSearchMilestones = (offset, limit, params) => async dispatch => {
  await dispatch(
    getMilestones(convertCondition(offset, limit, params, TagAutoCompleteType.Milestone))
  );
};

export const handleSearchProductTradings = (offset, limit, params) => async dispatch => {
  await dispatch(
    getProductTradings(convertCondition(offset, limit, params, TagAutoCompleteType.ProductTrading))
  );
};

export const handleSearchTasks = (offset, limit, params) => async dispatch => {
  await dispatch(getTasks(convertCondition(offset, limit, params, TagAutoCompleteType.Task)));
};

export const handleSearchCustomers = (offset, limit, params) => async dispatch => {
  await dispatch(
    getCustomers(convertCondition(offset, limit, params, TagAutoCompleteType.Customer))
  );
};
export const handleSearchBusinessCard = (offset, limit, params) => async dispatch => {
  await dispatch(
    getBusinessCard(convertCondition(offset, limit, params, TagAutoCompleteType.BusinessCard))
  );
};
