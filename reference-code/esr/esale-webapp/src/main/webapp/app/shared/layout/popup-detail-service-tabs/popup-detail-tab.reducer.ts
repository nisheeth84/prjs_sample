import axios from 'axios';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { TabAction } from './constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import _ from 'lodash';

export const ACTION_TYPES = {
  TASK_DATA_GET_BY_CUSTOMER: 'taskDetail/TASK_DATA_GET_BY_CUSTOMER',
  CUSTOMERS_GET_PRODUCT_TRADINGS: 'detailTabProductTrading/CUSTOMERS_GET_PRODUCT_TRADINGS',
  CUSTOMERS_GET_ACTIVITIES: 'detailTabProductTrading/CUSTOMERS_GET_ACTIVITIES'
};

const initialState = {
  action: TabAction.None,
  badgesTask: null,
  badgesProductTrading: null,
  tabTasks: null,
  tabProductTradings: null,
  tabActivities: null,
  errorMessage: null,
  errorItems: null
};

export type PopupDetailTabState = Readonly<typeof initialState>;

export default (state: PopupDetailTabState = initialState, action): PopupDetailTabState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TASK_DATA_GET_BY_CUSTOMER):
    case REQUEST(ACTION_TYPES.CUSTOMERS_GET_PRODUCT_TRADINGS):
    case REQUEST(ACTION_TYPES.CUSTOMERS_GET_ACTIVITIES):
      return {
        ...state,
        action: TabAction.RequestDetail
      };
    case FAILURE(ACTION_TYPES.TASK_DATA_GET_BY_CUSTOMER):
    case FAILURE(ACTION_TYPES.CUSTOMERS_GET_PRODUCT_TRADINGS):
    case FAILURE(ACTION_TYPES.CUSTOMERS_GET_ACTIVITIES):
      return {
        ...state,
        action: TabAction.FailureGetData,
        errorMessage: parseErrorRespose(action.payload)[0].errorCode,
        errorItems: parseErrorRespose(action.payload)
      };
    case SUCCESS(ACTION_TYPES.TASK_DATA_GET_BY_CUSTOMER): {
      return {
        ...state,
        action: TabAction.SuccessGetData,
        tabTasks: action.payload.data,
        badgesTask: action.payload.data['badges']
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMERS_GET_PRODUCT_TRADINGS): {
      return {
        ...state,
        action: TabAction.SuccessGetData,
        tabProductTradings: action.payload.data.dataInfo,
        badgesProductTrading: action.payload.data.dataInfo['productTradingBadge']
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMERS_GET_ACTIVITIES): {
      return {
        ...state,
        action: TabAction.SuccessGetData,
        tabActivities: action.payload.data
      };
    }
    default:
      return state;
  }
};

export const getTaskTab = param => ({
  type: ACTION_TYPES.TASK_DATA_GET_BY_CUSTOMER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CALENDAR_SERVICE_PATH}/get-tasks-tab`,
    param,
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const buildConditions = (condition, val) => {
  return {
    fieldType: condition.fieldType,
    isDefault: condition.isDefault,
    fieldName: condition.fieldName,
    fieldValue: val,
    searchType: condition.searchType,
    searchOption: condition.searchOption,
    timeZoneOffset: condition.timeZoneOffset
  };
};

export const handleInitTaskTab = param => async (dispatch, getState) => {
  const condition = { filterConditions: [], orderBy: [] };
  if (param) {
    const filterConditions = _.cloneDeep(param.filterConditions);
    const orderBy = _.cloneDeep(param.orderBy);
    if (filterConditions && filterConditions.length > 0) {
      for (let i = 0; i < filterConditions.length; i++) {
        _.remove(
          condition.filterConditions,
          (filterCondition: any) => filterCondition.fieldName === filterConditions[i].fieldName
        );
        if (
          !filterConditions[i].isSearchBlank &&
          (!filterConditions[i].fieldValue ||
            (filterConditions[i].fieldValue === 'false' &&
              filterConditions[i].fieldName !== 'is_public') ||
            filterConditions[i].fieldValue.length <= 0)
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
        condition.filterConditions.push(buildConditions(filterConditions[i], val));
      }
    }
    condition.orderBy = [];
    if (orderBy && orderBy.length > 0) {
      orderBy.forEach(element => {
        if (element.key.includes('.')) {
          const keyArr = element.key.split('.');
          if (keyArr[0].includes('task_data')) {
            element.key = element.isDefault === 'true' ? keyArr[1] : 'task_data.'.concat(keyArr[1]);
          } else {
            element.key = element.isDefault === 'true' ? keyArr[0] : 'task_data.'.concat(keyArr[0]);
          }
        } else {
          element.key =
            element.isDefault === 'true' ? element.key : 'task_data.'.concat(element.key);
        }
      });
      condition.orderBy.push(...orderBy);
    }
    param.orderBy = condition.orderBy;
    param.filterConditions = condition.filterConditions;
    await dispatch(getTaskTab(param));
  }
};

const setDefaultParamsProductTrading = params => {
  return {
    isOnlyData: params.isOnlyData ? params.isOnlyData : false,
    searchLocal: params.searchLocal || '',
    searchConditions: params.searchConditions || [],
    filterConditions: params.filterConditions || [],
    isFirstLoad: params.isFirstLoad ? params.isFirstLoad : false,
    selectedTargetType: params.selectedTargetType || 0,
    selectedTargetId: params.selectedTargetId || 0,
    orders: params.orders ? params.orders : [],
    limit: params.limit || 30,
    offset: params.offset || 0
    // settingDate: params.settingDate || '',
    // isUpdateListView: params.isUpdateListView ? params.isUpdateListView : false,
    // isFinish: params.isFinish ? params.isFinish : true,
  };
};

export const getProductTradings = params => ({
  type: ACTION_TYPES.CUSTOMERS_GET_PRODUCT_TRADINGS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/get-product-trading-tab`,
    params,
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleInitProductTradingTab = params => async (dispatch, getState) => {
  if (params) {
    // await dispatch(getProductTradings(setDefaultParamsProductTrading(params)));
    await dispatch(getProductTradings(params));
  }
};

const setDefaultParamsActivities = params => {
  return {
    listBusinessCardId: params.listBusinessCardId || [],
    listCustomerId: params.listCustomerId || [],
    listProductTradingId: params.listProductTradingId || [],
    searchLocal: params.searchLocal || '',
    searchConditions: params.searchConditions || [],
    filterConditions: params.filterConditions || [],
    isFirstLoad: params.isFirstLoad ? params.isFirstLoad : false,
    selectedTargetType: params.selectedTargetType || 0,
    selectedTargetId: params.selectedTargetId || 0,
    orderBy: params.orders || [],
    offset: params.offset || 0,
    limit: params.limit || 30,
    hasTimeline: params.hasTimeline ? params.hasTimeline : true
    // isUpdateListView: params.isUpdateListView ? params.isUpdateListView : false
  };
};

export const getActivities = params => ({
  type: ACTION_TYPES.CUSTOMERS_GET_ACTIVITIES,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activities`,
    params,
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleInitActivitiesTab = params => async (dispatch, getState) => {
  if (params) {
    await dispatch(getActivities(setDefaultParamsActivities(params)));
  }
};
