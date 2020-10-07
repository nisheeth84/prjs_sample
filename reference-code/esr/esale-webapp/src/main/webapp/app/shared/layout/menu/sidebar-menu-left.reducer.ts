import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { changeOrder } from 'app/shared/util/dragdrop';
import _ from 'lodash';

export const ACTION_TYPES = {
  MENU_LEFT_RESET: 'menuLeft/RESET',
  MENU_LEFT_GET_NOTIFICAION: 'menuLeft/NOTIFICATION',
  MENU_LEFT_GET_COMPANY_NAME: 'menuLeft/COMPANY_NAME',
  MENU_LEFT_GET_SERVICES_INFO: 'menuLeft/SERVICES_INFO',
  MENU_LEFT_CHANGE_ORDER_SERVICES_INFO: 'menuLeft/CHANGE_ORDER_SERVICES_INFO',
  MENU_LEFT_TOGGLE_EXPAND: 'menuLeft/MENU_LEFT_TOGGLE_EXPAND',
  FEEDBACK_GET_STATUS_CONTRACT: 'feedback/GET_STATUS_CONTRACT',
  FEEDBACK_GET_STATUS_OPEN: 'feedback/GET_STATUS_OPEN_FEEDBACK',
  MENU_GET_SERVICE_ORDER: 'feedback/MENU_GET_SERVICE_ORDER',
  GET_EMPLOYEES: 'employee/GET_EMPLOYEE_BY_ID',
  MENU_LEFT_RESET_EML: 'menuLeft/RESET_EML'
};

export enum menuLeftPopuptAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal
}

const initialState = {
  action: menuLeftPopuptAction.None,
  errorMessage: null,
  errorItems: [],
  notificationNumber: null,
  companyName: null,
  servicesInfo: [],
  expand: true,
  employeeId: -1,
  statusContract: null,
  servicesOrder: null,
  changeSuccessId: null,
  updatedDate: null,
  isDisplayFirstScreen: null,
  loading: false,
  isAdmin: null
};

export type MenuLeftState = Readonly<typeof initialState>;

const apiUpdateDisPlay = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;
const apiTenantsUrl = API_CONTEXT_PATH + '/' + API_CONFIG.TENANTS_SERVICE_PATH;
// Reducer
export default (state: MenuLeftState = initialState, action): MenuLeftState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_EMPLOYEES):
    case REQUEST(ACTION_TYPES.MENU_LEFT_GET_COMPANY_NAME):
    case REQUEST(ACTION_TYPES.MENU_LEFT_GET_SERVICES_INFO):
    case REQUEST(ACTION_TYPES.MENU_LEFT_GET_NOTIFICAION):
    case REQUEST(ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT):
    case REQUEST(ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN):
    case REQUEST(ACTION_TYPES.MENU_GET_SERVICE_ORDER): {
      return {
        ...state,
        action: menuLeftPopuptAction.RequestModal,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.GET_EMPLOYEES):
    case FAILURE(ACTION_TYPES.MENU_LEFT_GET_COMPANY_NAME):
    case FAILURE(ACTION_TYPES.MENU_LEFT_GET_SERVICES_INFO):
    case FAILURE(ACTION_TYPES.MENU_LEFT_GET_NOTIFICAION):
    case FAILURE(ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT):
    case FAILURE(ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN):
    case FAILURE(ACTION_TYPES.MENU_GET_SERVICE_ORDER): {
      return {
        ...state,
        action: menuLeftPopuptAction.ErrorModal,
        errorItems: action.payload.message
      };
    }
    case ACTION_TYPES.MENU_LEFT_RESET: {
      return {
        ...initialState
      };
    }
    case ACTION_TYPES.MENU_LEFT_RESET_EML: {
      return {
        ...state,
        employeeId: initialState.employeeId
      };
    }

    case SUCCESS(ACTION_TYPES.GET_EMPLOYEES): {
      const res = action.payload.data;
      return {
        ...state,
        updatedDate: res.employees[0].updatedDate,
        isDisplayFirstScreen: res.employees[0].isDisplayFirstScreen,
        loading: true,
        isAdmin: res.employees[0].isAdmin
      };
    }

    case SUCCESS(ACTION_TYPES.MENU_LEFT_GET_NOTIFICAION): {
      const res = action.payload.data;
      return {
        ...state,
        notificationNumber: res.unreadNotificationNumber
      };
    }

    case SUCCESS(ACTION_TYPES.MENU_LEFT_GET_COMPANY_NAME): {
      const res = action.payload.data;
      return {
        ...state,
        companyName: res.companyName
      };
    }

    case SUCCESS(ACTION_TYPES.MENU_LEFT_GET_SERVICES_INFO): {
      const res = action.payload.data;
      return {
        ...state,
        servicesInfo: res.servicesInfo
      };
    }

    case SUCCESS(ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN): {
      const res = action.payload.data;
      return {
        ...state,
        employeeId: res.employeeId
      };
    }

    case SUCCESS(ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT): {
      return {
        ...state,
        statusContract: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.MENU_LEFT_CHANGE_ORDER_SERVICES_INFO): {
      return {
        ...state,
        changeSuccessId: action.payload.data
        // servicesInfo: action.payload,
      };
    }

    case ACTION_TYPES.MENU_LEFT_TOGGLE_EXPAND: {
      return {
        ...state,
        expand: action.payload
      };
    }

    case SUCCESS(ACTION_TYPES.MENU_GET_SERVICE_ORDER): {
      return {
        ...state,
        servicesOrder: action.payload.data
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
  type: ACTION_TYPES.MENU_LEFT_RESET
});

/**
 * reset state
 */
export const resetEmployeeId = () => ({
  type: ACTION_TYPES.MENU_LEFT_RESET_EML
});

/**
 * get count notification
 *
 */
export const getCountNotification = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.MENU_LEFT_GET_NOTIFICAION,
    payload: axios.post(`${API_CONTEXT_PATH}/commons/api/count-unread-notification`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * get company name
 *
 */
export const getCompanyName = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.MENU_LEFT_GET_COMPANY_NAME,
    payload: axios.post(
      `${API_CONTEXT_PATH}/tenants/api/get-company-name`,
      { tenantName: param },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * get services info
 *
 */
export const getServicesInfo = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.MENU_LEFT_GET_SERVICES_INFO,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/get-services-info'}`,
      { serviceType: null },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const setExpandMenu = isExpand => {
  return {
    type: ACTION_TYPES.MENU_LEFT_TOGGLE_EXPAND,
    payload: isExpand
  };
};

/**
 * update order services
 *
 */
export const changeOrderServicesInfo = (sourceIndex, targetIndex) => async (dispatch, getState) => {
  const orderData = getState().menuLeft.servicesOrder.data;
  const serviceData = getState().menuLeft.servicesInfo;
  const finalData = [];
  if (orderData && serviceData) {
    if (Array.isArray(orderData)) {
      orderData.length > 0 &&
        orderData.forEach(e => {
          let tmpItemService = null;
          tmpItemService = serviceData.find(ele => ele.serviceId === e['serviceId']);
          tmpItemService['serviceOrder'] = e.serviceOrder;
          tmpItemService['updatedDate'] = e.updatedDate;
          finalData.push(tmpItemService);
        });
    }
  }
  const newServiceInfo = changeOrder(
    sourceIndex,
    targetIndex,
    _.isEmpty(finalData) ? serviceData : finalData
  );
  const serviceInfoIn = [];
  if (Array.isArray(newServiceInfo)) {
    newServiceInfo.length > 0 &&
      newServiceInfo.forEach((e, index) => {
        const item = {};
        item['serviceId'] = e['serviceId'];
        item['serviceName'] = e['serviceName'];
        item['serviceOrder'] = index + 1;
        item['updatedDate'] = e['updatedDate'];
        serviceInfoIn.push(item);
      });
  }
  await dispatch({
    type: ACTION_TYPES.MENU_LEFT_CHANGE_ORDER_SERVICES_INFO,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/update-service-order'}`,
      { employeeId: null, data: serviceInfoIn },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * get Status Open Feedback
 *
 */
export const getStatusOpenFeedback = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.FEEDBACK_GET_STATUS_OPEN,
    payload: axios.post(`${apiTenantsUrl}/get-feed-back-status-open`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * get Status Contract
 *
 */
export const getStatusContract = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.FEEDBACK_GET_STATUS_CONTRACT,
    payload: axios.post(
      `${apiTenantsUrl}/get-status-contract`,
      { tenantName: param },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * get service order
 *
 */
export const getServiceOrder = (employeeIdInput, dataService) => async dispatch => {
  const dataInput = [];
  if (dataService) {
    Array.isArray(dataService) &&
      dataService.forEach(e => {
        dataInput.push({ serviceId: e.serviceId });
      });
  }
  await dispatch({
    type: ACTION_TYPES.MENU_GET_SERVICE_ORDER,
    payload: axios.post(
      `${API_CONTEXT_PATH}/commons/api/get-service-order`,
      { employeeId: employeeIdInput, data: dataInput },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

// export const createServiceOrder = param => async dispatch => {
//   await dispatch({
//     type: ACTION_TYPES.MENU_GET_SERVICE_ORDER,
//     payload: axios.post(
//       `${API_CONTEXT_PATH}/commons/api/create-service-order`,
//       { employeeId: param,
//         data:[],

//       },
//       {
//         headers: { ['Content-Type']: 'application/json' }
//       }
//     )
//   });
// };

export const getEmployeeById = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_EMPLOYEES,
    payload: axios.post(`${apiUpdateDisPlay}/get-employees-by-ids`, param, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};
