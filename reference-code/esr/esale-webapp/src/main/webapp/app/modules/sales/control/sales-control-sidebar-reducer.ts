import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, AVAILABLE_FLAG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS, LIST_TYPE, API_URL } from '../constants';
import _ from 'lodash';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { modeScreenType, convertFieldType } from 'app/shared/util/fieldType-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';

export const ACTION_TYPES = {
  SIDEBAR_SALES_LOCAL_MENU: 'controlSidebar/SALES_LOCAL_MENU',
  SIDEBAR_UPDATE_AUTO_GROUP: 'controlSidebar/SALES_SIDEBAR_UPDATE_AUTO_GROUP',
  SIDEBAR_DELETE_GROUP: 'controlSidebar/SALES_SIDEBAR_DELETE_GROUP',
  SIDEBAR_ADD_TO_FAVORITE_GROUP: 'controlSidebar/SALES_SIDEBAR_ADD_TO_FAVORITE_GROUP',
  SIDEBAR_REMOVE_FROM_FAVORITE_GROUP: 'controlSidebar/SALES_SIDEBAR_REMOVE_FROM_FAVORITE_GROUP',
  SIDEBAR_DELETE_DEPARTMENT: 'controlSidebar/DELETE_DEPARTMENT',
  SIDEBAR_CHANGE_DEPARTMENT_ORDER: 'controlSidebar/CHANGE_DEPARTMENT_ORDER',
  SIDEBAR_RESET: 'controlSidebar/SALES_RESET',
  SIDEBAR_SALES_LOCAL_MENU_FAVORITE: 'controlSidebar/SALES_LOCAL_MENU_FAVORITE',
  SIDEBAR_SALES_GET_EMPLOYEE: 'controlSidebar/SIDEBAR_SALES_GET_EMPLOYEE',
  RESET_MESSAGE: 'controlSidebar/RESET_MESSAGE'
};
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export const resetSidebar = () => ({
  type: ACTION_TYPES.SIDEBAR_RESET
});

export enum SalesSidebarAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: SalesSidebarAction.None,
  localMenuData: null,
  errorMessage: null,
  errorItems: null,
  localMenuMsg: null,
  updatedAutoGroupId: null,
  deleteGroupMsg: null,
  msgSuccess: SHOW_MESSAGE_SUCCESS.NONE,
  deletedGroupId: null,
  deletedDepartmentId: null,
  deleteDepartmentMsg: null,
  addToFavoriteMsg: null,
  addToFavoriteId: null,
  removeListFromFavorite: null,
  employeeDataLogin: {},
  listInfo: [],
  timeAddToList: null
};

/**
 * Parse errorMessage and errorItems
 * @param res
 */
const getErrors = res => {
  let errorMsg = '';
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    } else {
      errorMsg = res.errors[0].message;
    }
  }
  return { errorMsg, errorItems };
};

const parseLocalMenuResponse = res => {
  const tempFavorite = [...res.listInfo].filter(elm => elm.displayOrderOfFavoriteList);
  const favoriteGroup = _.sortBy(tempFavorite, 'displayOrderOfFavoriteList');
  const myGroups = [...res.listInfo].filter(elm => elm.listType === LIST_TYPE.MY_LIST);
  const sharedGroups = [...res.listInfo].filter(elm => elm.listType === LIST_TYPE.SHARE_LIST);
  const localMenu = { initializeLocalMenu: { myGroups, sharedGroups, favoriteGroup } };
  return { localMenu };
};

const parseFavorite = (state, res) => {
  const { myGroups, sharedGroups } = state.localMenuData.initializeLocalMenu;
  const allData = [...myGroups, ...sharedGroups];
  const favorite = res.data.listInfo;
  const favoriteGroup = favorite.reduce((tmpArr, elm) => {
    allData.forEach(allItem => {
      if (elm.listId === allItem.productTradingListDetailId) {
        tmpArr = [...tmpArr, allItem];
      }
    });
    return tmpArr;
  }, []);
  const localMenu = { initializeLocalMenu: { myGroups, sharedGroups, favoriteGroup } };
  return { localMenu };
};

// export const handleInitLocalMenuFavorite = () => ({
//   type: ACTION_TYPES.SIDEBAR_SALES_LOCAL_MENU_FAVORITE,
//   payload: axios.post(
//     `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/get-list`,
//     {
//       idOfList: null,
//       mode: null
//     },
//     {
//       headers: { ['Content-Type']: 'application/json' }
//     }
//   )
// });

const copyData = from => {
  const employeeDepartments = [];
  from.employeeDepartments.map(item => {
    employeeDepartments.push({
      departmentId: item.departmentId,
      positionId: item.positionId
    });
  });
  return {
    ...from,
    employeeDepartments
  };
};

const parseGetEmployeeResponse = res => {
  let fields = [];
  if (res.fields && res.fields.length > 0) {
    fields = res.fields
      .filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  let employeeData = {};
  let initEmployee = {};
  if (res.data) {
    employeeData = res.data;
    initEmployee = copyData(res.data);
  }

  return { fields, employeeData, initEmployee };
};

// use for updating auto group
export const updateAutoGroup = groupId => ({
  type: ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/refresh-auto-list`,
    {
      idOfList: groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleUpdateAutoSalesGroup: any = groupId => async (dispatch, getState) => {
  await dispatch(updateAutoGroup(groupId));

  return Promise.resolve();
};

// use for deleting group
export const deleteGroup = groupId => ({
  type: ACTION_TYPES.SIDEBAR_DELETE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/delete-product-trading-list`,
    {
      idOfList: groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleDeleteSalesGroup = groupId => async (dispatch, getState) => {
  await dispatch(deleteGroup(groupId));
};

export const addToFavorite = groupId => ({
  type: ACTION_TYPES.SIDEBAR_ADD_TO_FAVORITE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}${API_URL.ADD_LIST_TO_FAVORITE}`,
    {
      idOfList: groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleAddToFavoriteSalesGroup = groupId => async (dispatch, getState) => {
  await dispatch(addToFavorite(groupId));
};

export const removeFromFavorite = groupId => ({
  type: ACTION_TYPES.SIDEBAR_REMOVE_FROM_FAVORITE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}${API_URL.REMOVE_LIST_FROM_FAVORITE}`,
    {
      idOfList: groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleRemoveFromFavoriteSalesGroup = groupId => async (dispatch, getState) => {
  await dispatch(removeFromFavorite(groupId));
};

const getEmployee = params => ({
  type: ACTION_TYPES.SIDEBAR_SALES_GET_EMPLOYEE,
  payload: axios.post(`${employeesApiUrl}${API_URL.GET_EMPLOYEE}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleGetDataEmployee = params => async dispatch => {
  await dispatch(getEmployee(params));
};

export const handleInitLocalMenu = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SIDEBAR_SALES_LOCAL_MENU,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}${API_URL.GET_LIST}`,
      {
        idOfList: null,
        mode: null
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });

  // await dispatch(handleInitLocalMenuFavorite());
};

const parseDeleteGroupFail = res => {
  let errorMsg = [];
  const errorCode = [];
  if (res.parameters.extensions.errors && res.parameters.extensions.errors.length > 0) {
    errorMsg = res.parameters.extensions.errors[0].message
      ? res.parameters.extensions.errors[0].message
      : [];
    // errorCode.push(res.parameters.extensions.errors[0].errorCode);
    errorCode.push(res.parameters.extensions.errors[0]);
  }
  return { errorCode, errorMsg };
};

export type SalesControlSidebarState = Readonly<typeof initialState>;

export default (
  state: SalesControlSidebarState = initialState,
  action
): SalesControlSidebarState => {
  const timeUpdate = new Date().getTime();
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SIDEBAR_SALES_LOCAL_MENU):
    case REQUEST(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_DELETE_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_ADD_TO_FAVORITE_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_REMOVE_FROM_FAVORITE_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_SALES_GET_EMPLOYEE):
      return {
        ...state,
        action: SalesSidebarAction.Request,
        timeAddToList: null
      };
    /**
     * @FAILURE CASE
     */
    case FAILURE(ACTION_TYPES.SIDEBAR_SALES_LOCAL_MENU): {
      const resError = getErrors(action.payload.response.data.parameters.extensions);
      return {
        ...state,
        action: SalesSidebarAction.Error,
        errorMessage: action.payload.message,
        errorItems: resError.errorItems,
        localMenuMsg: resError.errorItems.length > 0 ? resError.errorItems[0].message : ''
      };
    }
    case FAILURE(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP):
    case FAILURE(ACTION_TYPES.SIDEBAR_DELETE_GROUP): {
      const res = parseDeleteGroupFail(action.payload.response.data);
      return {
        ...state,
        action: SalesSidebarAction.Error,
        // errorMessage: parseErrorRespose(action.payload),
        // deleteGroupMsg: parseErrorRespose(action.payload)
        errorMessage: res.errorCode,
        deleteGroupMsg: res.errorMsg
        // timeAddToList: timeUpdate
      };
    }
    case FAILURE(ACTION_TYPES.SIDEBAR_ADD_TO_FAVORITE_GROUP):
    case FAILURE(ACTION_TYPES.SIDEBAR_REMOVE_FROM_FAVORITE_GROUP): {
      return {
        ...state,
        action: SalesSidebarAction.Error,
        errorMessage: parseErrorRespose(action.payload),
        addToFavoriteMsg: parseErrorRespose(action.payload)
      };
    }
    case FAILURE(ACTION_TYPES.SIDEBAR_SALES_GET_EMPLOYEE): {
      return {
        ...state,
        action: SalesSidebarAction.Error,
        errorMessage: parseErrorRespose(action.payload)
        // addToFavoriteMsg: parseErrorRespose(action.payload)
      };
    }
    /**
     * @SUCCESS CASE
     */
    case SUCCESS(ACTION_TYPES.SIDEBAR_SALES_LOCAL_MENU): {
      const res = parseLocalMenuResponse(action.payload.data.data);
      const tmpData = action.payload.data.data.listInfo;
      return {
        ...state,
        localMenuData: res.localMenu,
        listInfo: tmpData
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP): {
      // const res = parseLocalMenuResponse(action.payload.data);
      return {
        ...state,
        updatedAutoGroupId: timeUpdate,
        msgSuccess: SHOW_MESSAGE_SUCCESS.UPDATE
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_DELETE_GROUP): {
      const res = action.payload.data;
      // const res = parseFavouriteDeleteResponse(action.payload.data, SHOW_MESSAGE_SUCCESS.DELETE);
      return {
        ...state,
        action: SalesSidebarAction.Success,
        deletedGroupId: res.groupId ? res.groupId : timeUpdate,
        msgSuccess: SHOW_MESSAGE_SUCCESS.DELETE,
        timeAddToList: timeUpdate
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_ADD_TO_FAVORITE_GROUP): {
      // const res = action.payload.data;
      return {
        ...state,
        addToFavoriteId: timeUpdate,
        msgSuccess: SHOW_MESSAGE_SUCCESS.ADD_TO_FAVORITE
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_REMOVE_FROM_FAVORITE_GROUP): {
      // const res = action.payload.data;
      return {
        ...state,
        removeListFromFavorite: timeUpdate
        // msgSuccess: SHOW_MESSAGE_SUCCESS.REMOVE_FROM_FAVORITE
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_SALES_GET_EMPLOYEE): {
      const res = parseGetEmployeeResponse(action.payload.data);
      const fieldsTmp = convertFieldType(res.fields, modeScreenType.typeAddEdit).filter(
        e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER && e.fieldName !== 'is_admin'
      );
      res.fields = fieldsTmp;
      return {
        ...state,
        action: SalesSidebarAction.None,
        employeeDataLogin: res.employeeData
        // fields: res.fields,
        // initEmployee: res.initEmployee
      };
    }
    case ACTION_TYPES.RESET_MESSAGE:
      return {
        ...state,
        msgSuccess: SHOW_MESSAGE_SUCCESS.NONE,
        errorMessage: [],
        action: SalesSidebarAction.None
      };
    default:
      return state;
  }
};

export const resetMessageSuccessSidebar = () => ({
  type: ACTION_TYPES.RESET_MESSAGE
});
