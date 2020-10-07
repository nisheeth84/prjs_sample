import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG, TYPE_MSG_EMPTY } from 'app/config/constants';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import {
  EMPLOYEE_DEF,
  EMPLOYEE_LIST_ID,
  EMPLOYEE_SPECIAL_LIST_FIELD,
  SHOW_MESSAGE_SUCCESS
} from 'app/modules/employees/constants';
import _, { cloneDeep } from 'lodash';
import { getValueProp } from 'app/shared/util/entity-utils';
import { IRootState } from 'app/shared/reducers';

export const ACTION_TYPES = {
  EMPLOYEE_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'employeeList/CUSTOM_FIELD_INFO_GET_LIST',
  EMPLOYEE_LIST_EMPLOYEES_GET: 'employeeList/EMPLOYEES_GET',
  EMPLOYEE_LIST_EMPLOYEES_UPDATE: 'employeeList/EMPLOYEES_UPDATE',
  EMPLOYEE_LIST_RESET: 'employeeList/RESET',
  EMPLOYEE_LIST_RESET_MSG_SUCCESS: 'employeeList/RESET_MSG_SUCCESS',
  EMPLOYEE_LIST_CHANGE_TO_EDIT: 'employeeList/EDIT',
  EMPLOYEE_LIST_CHANGE_TO_DISPLAY: 'employeeList/DISPLAY',
  EMPLOYEE_LIST_REMOVE_MANAGER: 'employeeList/REMOVE_MANAGER',
  EMPLOYEE_LIST_LEAVE_GROUP: 'employeeList/LEAVE_GROUP',
  EMPLOYEE_LIST_MOVE_TO_DEPARTMENT: 'employeeList/MOVE_TO_DEPARTMENT',
  EMPLOYEE_LIST_DOWNLOAD: 'employeeList/DOWNLOAD',
  EMPLOYEE_LIST_INITIALIZE_LIST_INFO: 'employeeList/INITIALIZE_LIST_INFO',
  EMPLOYEE_LIST_GET_LAYOUT_PERSONAL: 'employeeList/GET_LAYOUT_PERSIONAL',
  EMPLOYEE_LIST_GET_LAYOUT: 'employeeList/GET_LAYOUT',
  EMPLOYEE_LIST_SEND_MAIL: 'employeeList/SEND_MAIL',
  EMPLOYEE_LIST_RESET_LIST: 'employeeList/EMPLOYEE_LIST_RESET_LIST',
  EMPLOYEE_LIST_GET_INFO_SEARCH_CONDITION_GROUP: 'employeeList/GET_SEARCH_CONDITION_INFO_GROUP',
  EMPLOYEE_LIST_RESET_MSG_ERROR: 'employeeList/EMPLOYEE_LIST_RESET_MSG_ERROR',
  EMPLOYEE_CHECK_INVALID_LICENSE: 'employeeList/EMPLOYEE_CHECK_INVALID_LICENSE'
};

export enum EmployeeAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: EmployeeAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  customFieldInfos: null,
  employees: null,
  employeesCheckList: null,
  removeManagerEmployeesId: null,
  leaveGroupEmployeesId: null,
  idsMovedSuccess: null,
  idsMovedError: null,
  employeesInfo: null,
  initializeListInfo: null,
  fields: null,
  employeeLayoutPersonal: null,
  employeeLayout: null,
  msgSuccess: null,
  typeMsgEmpty: TYPE_MSG_EMPTY.NONE,
  listSendMailResponse: [
    {
      employeeId: null,
      userName: null,
      sendMailSuccess: null
    }
  ],
  infoSearchConditionGroup: null,
  license: {
    isInvalidLicense: true,
    packages: null
  }
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

const parseCustomFieldsInfoResponse = (res, type) => {
  const fieldInfos = res;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fieldInfos };
};

export const parseProductsResponse = res => {};

export const parseListEmployeeResponse = res => {
  let employees = null;
  employees = res;
  if (res && res.employees && res.employees.length > 0) {
    employees.employees.forEach((element, idx) => {
      const employeeData = element.employeeData;
      const newElement = {};
      for (const prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'employeeData') {
          newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop];
        }
      }
      employeeData.forEach(e => {
        newElement[e.key] = e.value;
      });
      employees.employees[idx] = newElement;
    });
  }
  return { employees };
};

// parse responsed message with same message format
const parseGeneralApiResponse = (res, type) => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  let typeMsg = null;
  switch (type) {
    case 'update':
      typeMsg = SHOW_MESSAGE_SUCCESS.UPDATE;
      break;
    case 'create':
      typeMsg = SHOW_MESSAGE_SUCCESS.CREATE;
      break;
    case 'delete':
      typeMsg = SHOW_MESSAGE_SUCCESS.DELETE;
      break;
    default:
      typeMsg = SHOW_MESSAGE_SUCCESS.NONE;
      break;
  }
  const action = errorMsg.length > 0 ? EmployeeAction.Error : EmployeeAction.Success;
  const msgSuccess = errorMsg.length > 0 ? SHOW_MESSAGE_SUCCESS.NONE : typeMsg;
  const employeeIds = res.data;
  return { errorMsg, errorCodeList, action, employeeIds, msgSuccess };
};

const parseInitializeListInfo = res => {
  const action = EmployeeAction.Success;
  let initializeListInfo = [];
  let fields = [];
  if (res && res.initializeInfo) {
    initializeListInfo = res.initializeInfo;
  }
  if (res && res.fields && res.fields.length > 0) {
    fields = res.fields;
  }
  return { action, initializeListInfo, fields };
};

const parseLayoutInfoPersional = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? EmployeeAction.Error : EmployeeAction.Success;
  const employeeLayoutPersonal = res.employeesLayout;
  return { errorMsg, errorCodeList, action, employeeLayoutPersonal };
};

let flagUpdateEmployees = false;

const getDataSuccess = (state, action) => {
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_CUSTOM_FIELD_INFO_GET_LIST): {
      const res = parseCustomFieldsInfoResponse(
        action.payload.data,
        EMPLOYEE_DEF.EXTENSION_BELONG_LIST
      );
      return {
        ...state,
        action: EmployeeAction.Success,
        errorMessage: null,
        customFieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_UPDATE): {
      flagUpdateEmployees = true;
      return {
        ...state,
        action: EmployeeAction.Success,
        updateEmployeesMsg: null
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET): {
      const res = parseListEmployeeResponse(action.payload.data);
      let msgSuccess = { successId: SHOW_MESSAGE_SUCCESS.NONE };
      if (flagUpdateEmployees) {
        msgSuccess = { successId: SHOW_MESSAGE_SUCCESS.UPDATE };
        flagUpdateEmployees = false;
      }
      return {
        ...state,
        action: EmployeeAction.Success,
        employees: Object.assign(res.employees, { typeMsgEmpty: initialState.typeMsgEmpty }),
        msgSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_REMOVE_MANAGER): {
      const res = action.payload.data;
      return {
        ...state,
        removeManagerEmployeesId: res.list,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE }
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT): {
      const res = action.payload.data;
      return {
        ...state,
        employeeLayout: res.employeeLayout
      };
    }

    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_LEAVE_GROUP): {
      const leaveGroupEmployeesId = action.payload.data;
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE },
        leaveGroupEmployeesId: leaveGroupEmployeesId && leaveGroupEmployeesId.employeeIds
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_MOVE_TO_DEPARTMENT): {
      return {
        ...state,
        idsMovedSuccess: action.payload.data.idsMovedSuccess,
        idsMovedError: action.payload.data.idsMovedError,
        moveToDepartmentMsg: null,
        msgSuccess: action.payload.data.idsMovedError?.length > 0 ? null : { successId: SHOW_MESSAGE_SUCCESS.UPDATE } 
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_DOWNLOAD): {
      return {
        ...state,
        employeesInfo: action.payload.data,
        downloadEmployeesMsg: null
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_INITIALIZE_LIST_INFO): {
      const res = parseInitializeListInfo(action.payload.data);
      return {
        ...state,
        initializeListInfo: res.initializeListInfo,
        fields: res.fields
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT_PERSONAL): {
      const res = parseLayoutInfoPersional(action.payload.data);
      return {
        ...state,
        employeeLayoutPersonal: res.employeeLayoutPersonal,
        errorMessage: res.errorMsg
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_SEND_MAIL): {
      return {
        ...state,
        action: EmployeeAction.Success,
        listSendMailResponse: action.payload.data.listSendMailResponse,
        sendMailError: null,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_LIST_GET_INFO_SEARCH_CONDITION_GROUP): {
      return {
        ...state,
        action: EmployeeAction.Success,
        infoSearchConditionGroup: action.payload.data.employeesGroupSearchConditionInfos
      };
    }
    case ACTION_TYPES.EMPLOYEE_CHECK_INVALID_LICENSE: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};

const getStatus = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: EmployeeAction.None,
        errorItems: [],
        errorMessage: null,
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.EMPLOYEE_LIST_RESET:
      return {
        ...initialState
      };

    case ACTION_TYPES.EMPLOYEE_LIST_RESET_MSG_SUCCESS:
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE }
      };
    case ACTION_TYPES.EMPLOYEE_LIST_RESET_LIST:
      return {
        ...state,
        employees: initialState.employees
      };
    default:
      return state;
  }
};

export type EmployeeListState = Readonly<typeof initialState>;

// Reducer
export default (state: EmployeeListState = initialState, action): EmployeeListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_UPDATE):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_REMOVE_MANAGER):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_LEAVE_GROUP):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_MOVE_TO_DEPARTMENT):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_DOWNLOAD):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT_PERSONAL):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_SEND_MAIL):
    case REQUEST(ACTION_TYPES.EMPLOYEE_LIST_GET_INFO_SEARCH_CONDITION_GROUP):
      return {
        ...state,
        action: EmployeeAction.Request,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_REMOVE_MANAGER):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_LEAVE_GROUP):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_INITIALIZE_LIST_INFO):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT_PERSONAL):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_UPDATE):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_DOWNLOAD):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_MOVE_TO_DEPARTMENT):
    case FAILURE(ACTION_TYPES.EMPLOYEE_LIST_SEND_MAIL): {
      return {
        ...state,
        action: EmployeeAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    }
    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY:
    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_EDIT:
    case ACTION_TYPES.EMPLOYEE_LIST_RESET:
    case ACTION_TYPES.EMPLOYEE_LIST_RESET_MSG_SUCCESS:
    case ACTION_TYPES.EMPLOYEE_LIST_RESET_LIST: {
      return getStatus(state, action);
    }
    case ACTION_TYPES.EMPLOYEE_LIST_RESET_MSG_ERROR: {
      return {
        ...state,
        errorMessage: initialState.errorMessage,
        errorItems: initialState.errorItems
      };
    }
    default:
      return getDataSuccess(state, action);
  }
};

const makeConditionSearchDefault = (offset, limit) => {
  return {
    searchConditions: [],
    filterConditions: [],
    localSearchKeyword: null,
    selectedTargetType: 0,
    selectedTargetId: 0,
    isUpdateListView: false,
    orderBy: [],
    offset,
    limit
  };
};

/**
 * Get custom fields info
 *
 * @param
 */
export const getCustomFieldsInfo = extensionBelong => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      // query: PARAM_GET_CUSTOM_FIELD_INFO(FIELD_BELONG.EMPLOYEE)
      fieldBelong: FIELD_BELONG.EMPLOYEE
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * get employees
 *
 * @param key
 */
export const getEmployees = params => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-employees`,
    {
      searchConditions: params.searchConditions,
      filterConditions: params.filterConditions,
      localSearchKeyword: params.localSearchKeyword,
      selectedTargetType: params.selectedTargetType,
      selectedTargetId: params.selectedTargetType === 1 ? 0 : params.selectedTargetId,
      isUpdateListView: params.isUpdateListView,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleInitEmployeeList = (offset, limit) => async (dispatch, getState) => {
  initialState.typeMsgEmpty = TYPE_MSG_EMPTY.NONE;
  await dispatch(getEmployees(makeConditionSearchDefault(offset, limit)));
  // await dispatch(getCustomFieldsInfo(1)); // for update
};

const checkIsNested = element => {
  if (
    element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments ||
    element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions ||
    element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager ||
    element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates
  ) {
    return true;
  }
  return false;
};

export const handleSearchEmployee = (
  offset: number,
  limit: number,
  conditionsSearch: string | any[],
  filterConditions?: any[],
  selectedTargetType?: number,
  selectedTargetId?: number,
  isUpdateListView?: boolean,
  orderBy?: any[]
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(offset, limit);
  const params = _.cloneDeep(conditionsSearch);
  if (!params || params.length <= 0) {
    // await dispatch(getEmployees(condition));
  } else if (params.constructor === 'test'.constructor) {
    condition.localSearchKeyword = params; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if (params.constructor === [].constructor) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        // spe
        if (params[i].fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
          params[i].fieldValue.forEach((element, idx) => {
            if (element === '0') {
              params[i].fieldValue[idx] = 'false';
            } else {
              params[i].fieldValue[idx] = 'true';
            }
          });
        }
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        // isNested: checkIsNested(params[i]),
        fieldType: params[i].fieldType,
        fieldId: params[i].fieldId,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
    condition.searchConditions = searchConditions;
  }
  if (selectedTargetType) {
    condition.selectedTargetType = selectedTargetType;
  }
  if (selectedTargetId) {
    condition.selectedTargetId = selectedTargetId;
  }
  if (isUpdateListView) {
    condition.isUpdateListView = isUpdateListView;
  }
  if (filterConditions && filterConditions.length > 0) {
    // condition.filterConditions.push(..._.map(filterConditions, o => _.pick(o, ['fieldType', 'isDefault', 'fieldName', 'fieldValue'])));
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
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
          if (filterConditions[i].fieldName === 'is_admin') {
            filterConditions[i].fieldValue = JSON.parse(filterConditions[i].fieldValue);
            filterConditions[i].fieldValue.forEach((element, idx) => {
              if (element === '0') {
                filterConditions[i].fieldValue[idx] = 'false';
              } else {
                filterConditions[i].fieldValue[idx] = 'true';
              }
            });
            filterConditions[i].fieldValue = JSON.stringify(filterConditions[i].fieldValue);
          }
          val = filterConditions[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        // isNested: checkIsNested(filterConditions[i]),
        fieldId: filterConditions[i].fieldId,
        fieldType: filterConditions[i].fieldType,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption,
        timeZoneOffset: filterConditions[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }

  if (orderBy && orderBy.length > 0) {
    const { fieldInfos } = getState().dynamicList.data.get(EMPLOYEE_LIST_ID);
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
          orderBy[idx].key = `employee_data.${e.key}`;
        }
        if (
          orderBy[idx].key === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments ||
          orderBy[idx].key === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions ||
          orderBy[idx].key === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager ||
          orderBy[idx].key === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates
        ) {
          orderBy[idx].isNested = true;
        }
      }
    });
    condition.orderBy.push(...orderBy);
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  await dispatch(getEmployees(condition));
};

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads) params['files'] = [];
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    // filesMap[key] = file[key];
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
    // params['files'].push(file);
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params['employees']));
  return data;
};

export const handleCheckInvalidLicense = (isUpdate?: boolean) => async (
  dispatch,
  getState: () => IRootState
) => {
  try {
    const { isMissingLicense } = getState().authentication;
    if (!isMissingLicense) return;

    const res = await axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/check-invalid-license`
    );

    dispatch({
      type: ACTION_TYPES.EMPLOYEE_CHECK_INVALID_LICENSE,
      payload: {
        license: res.data,
        ...(isUpdate &&
          res.data.isInvalidLicense && {
            msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE_LICENSE }
          })
      }
    });
  } catch (error) {
    //
  }
};

export const handleUpdateEmployee = (
  idList: string,
  listEmployee: any[],
  offset,
  limit,
  conditionSearch,
  filterConditions?: any[],
  selectedTargetType?: number,
  selectedTargetId?: number,
  isUpdateListView?: boolean,
  orderBy?: any[],
  fileUploads?: any[]
) => async (dispatch, getState) => {
  const { employees } = getState().employeeList;
  const { fieldInfos } = getState().dynamicList.data.get(idList);
  const params = [];
  const groupEmployee = listEmployee.reduce(function(h, obj) {
    h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
    return h;
  }, {});
  for (const emp in groupEmployee) {
    if (!Object.prototype.hasOwnProperty.call(groupEmployee, emp)) {
      continue;
    }
    const param = {};
    param['employeeId'] = Number(emp);
    // param['rowId'] = Number(emp);
    let recordIdx = -1;
    if (employees && employees.employees && employees.employees.length > 0) {
      recordIdx = employees.employees.findIndex(
        e => e['employee_id'].toString() === emp.toString()
      );
      if (recordIdx >= 0) {
        param['userId'] = employees.employees[recordIdx]['user_id'];
        param['updatedDate'] = getValueProp(employees.employees[recordIdx], 'updatedDate');
      }
    }
    let arrDerpartment = [];
    let arrPosition = [];
    for (let i = 0; i < groupEmployee[emp].length; i++) {
      if (
        !fieldInfos ||
        !fieldInfos.fieldInfoPersonals ||
        fieldInfos.fieldInfoPersonals.length <= 0
      ) {
        continue;
      }
      const fieldIdx = fieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === groupEmployee[emp][i].fieldId.toString()
      );
      if (fieldIdx < 0) {
        continue;
      }
      const fieldName = fieldInfos.fieldInfoPersonals[fieldIdx].fieldName;
      // const dynamicIndex = fieldNameDynamic.findIndex( e => e.toString() === fieldName.toString());
      const isDefault = fieldInfos.fieldInfoPersonals[fieldIdx].isDefault;
      if (isDefault) {
        if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
          arrDerpartment = groupEmployee[emp][i].itemValue;
        } else if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
          arrPosition = groupEmployee[emp][i].itemValue;
        } else if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
          param['packagesId'] = groupEmployee[emp][i].itemValue;
        } else if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage) {
          param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupEmployee[emp][i].itemValue
            ? parseInt(groupEmployee[emp][i].itemValue, 10)
            : null;
        } else {
          param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupEmployee[emp][i].itemValue;
        }
      } else {
        if (param['employeeData'] === null || param['employeeData'] === undefined) {
          param['employeeData'] = [];
        }
        const isArray = Array.isArray(groupEmployee[emp][i].itemValue);
        const itemValue = isArray
          ? JSON.stringify(groupEmployee[emp][i].itemValue)
          : groupEmployee[emp][i].itemValue
          ? groupEmployee[emp][i].itemValue.toString()
          : '';
        param['employeeData'].push({
          fieldType: fieldInfos.fieldInfoPersonals[fieldIdx].fieldType.toString(),
          key: fieldName,
          value: itemValue
        });
      }
    }
    // fill other item not display
    if (!Object.prototype.hasOwnProperty.call(param, 'employeeData')) {
      param['employeeData'] = [];
    }

    if (arrPosition.length === 0) {
      const extDerpartment = getValueProp(employees.employees[recordIdx], 'employeeDepartments');
      extDerpartment.map(elm => {
        arrPosition.push(elm.positionId);
      });
    }

    if (arrDerpartment.length === 0) {
      const extDerpartment = getValueProp(employees.employees[recordIdx], 'employeeDepartments');
      extDerpartment.map(elm => {
        arrDerpartment.push(elm.departmentId);
      });
    }

    if (arrDerpartment.length > 0) {
      param['departmentIds'] = [];
      arrDerpartment.forEach((item, idx) => {
        param['departmentIds'].push({
          departmentId: arrDerpartment[idx] !== '' ? parseInt(arrDerpartment[idx], 10) : null,
          positionId: arrPosition[idx] !== '' ? parseInt(arrPosition[idx], 10) : null
        });
      });
    }
    if (!_.has(param, 'languageId')) {
      const extLang = getValueProp(employees.employees[recordIdx], 'language');
      if (extLang && getValueProp(extLang, 'languageId')) {
        param['languageId'] = getValueProp(extLang, 'languageId');
      }
    }
    if (!_.has(param, 'timezoneId')) {
      const extLang = getValueProp(employees.employees[recordIdx], 'timezone');
      if (extLang && getValueProp(extLang, 'timezone')) {
        param['timezoneId'] = getValueProp(extLang, 'timezoneId');
      }
    }
    params.push(param);
  }
  await dispatch({
    type: ACTION_TYPES.EMPLOYEE_LIST_EMPLOYEES_UPDATE,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/update-employees`,
      buildFormData({ employees: params }, fileUploads),
      {
        headers: { ['Content-Type']: 'multipart/form-data' }
      }
    )
  });
  const { action } = getState().employeeList;
  if (action === EmployeeAction.Success) {
    await dispatch(
      handleSearchEmployee(
        offset,
        limit,
        conditionSearch,
        filterConditions,
        selectedTargetType,
        selectedTargetId,
        isUpdateListView,
        orderBy
      )
    );
    await dispatch({ type: ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY });
    dispatch(handleCheckInvalidLicense(true));
  }
};

export const handleFilterEmployeeByMenu = (
  offset,
  limit,
  conditions?,
  selectedTargetType?: number,
  selectedTargetId?: number,
  isUpdateListView?: boolean,
  filterConditions?,
  orderBy?
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(offset, limit);
  // condition.filterType = filterGroup;
  if (conditions) {
    const searchConditions = [];
    for (let i = 0; i < conditions.length; i++) {
      if (!conditions[i].fieldValue || !_.isNil(conditions[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(conditions[i].fieldValue);
      if (isArray) {
        if (conditions[i].fieldValue.length <= 0) {
          continue;
        }
        if (conditions[i].statusChoose !== null && conditions[i].statusChoose === false) {
          continue;
        }
      }
      if (conditions[i].toString().length <= 0) {
        continue;
      }
      searchConditions.push({
        isDefault: `${conditions[i].isDefault}`,
        fieldName: conditions[i].fieldName,
        fieldValue: isArray
          ? JSON.stringify(conditions[i].fieldValue)
          : conditions[i].fieldValue.toString(),
        searchType: conditions[i].searchType,
        searchOption: conditions[i].searchOption
      });
    }
    condition.searchConditions = searchConditions;
  }

  if (selectedTargetType) {
    condition.selectedTargetType = selectedTargetType;
  }
  if (selectedTargetId) {
    condition.selectedTargetId = selectedTargetId;
  }
  if (isUpdateListView) {
    condition.isUpdateListView = isUpdateListView;
  }

  if (filterConditions && filterConditions.length > 0) {
    condition.filterConditions = filterConditions;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orderBy && orderBy.length > 0) {
    condition.orderBy = orderBy;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  await dispatch(getEmployees(condition));
};

// use for get layout personal
export const getLayoutPersional = extensionBelong => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT_PERSONAL,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/get-employee-layout-personal'}`,
    { extensionBelong },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

// use for get employee layout
export const getEmployeeLayout = extensionBelong => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_GET_LAYOUT,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/get-employee-layout'}`,
    { extensionBelong },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

// use for remove manager
export const removeManager = employeeIds => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_REMOVE_MANAGER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/remove-manager`,
    {
      employeeIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleRemoveManager = employeeIds => async (dispatch, getState) => {
  await dispatch(removeManager(employeeIds));
};
// use for leaving group
export const leaveGroup = (groupId, employeeIds) => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_LEAVE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/leave-groups`,
    {
      groupId,
      employeeIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleLeaveGroup = (groupId, employeeIds) => async (dispatch, getState) => {
  await dispatch(leaveGroup(groupId, employeeIds));
};
// use for moving 1 employee to another department
export const moveToDepartment = params => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_MOVE_TO_DEPARTMENT,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/move-to-department'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleGetFieldInfoBelong = extensionBelong => async (dispatch, getState) => {
  await dispatch(getLayoutPersional(extensionBelong));
};

export const handleGetEmployeeLayout = extensionBelong => async (dispatch, getState) => {
  await dispatch(getEmployeeLayout(extensionBelong));
};

export const getInitializeListInfo = fieldBelong => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_INITIALIZE_LIST_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-initialize-list-info'}`,
    { fieldBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleMoveToDepartment = (departmentId, employeeIds, moveType) => async (
  dispatch,
  getState
) => {
  const data = {};
  data[`departmentId`] = departmentId;
  data[`employeeIds`] = employeeIds;
  data[`moveType`] = moveType;
  await dispatch(moveToDepartment(data));
};
// use for downloading employees' info
export const downloadEmployees = params => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_DOWNLOAD,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/download-employees'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleDownloadEmployees = (
  employeeIds,
  orderBy,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const data = { employeeIds, orderBy, selectedTargetType, selectedTargetId };
  await dispatch(downloadEmployees(data));
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY
});

export const handleGetInitializeListInfo = fieldBelong => async (dispatch, getState) => {
  await dispatch(getInitializeListInfo(fieldBelong));
};

const createUserLogin = employeeIds => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_SEND_MAIL,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/send-mail-for-users`,
    { employeeIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleCreateUserLogin = employeeIds => async (dispatch, getState) => {
  await dispatch(createUserLogin(employeeIds));
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_RESET
});

/**
 * reset state
 */
export const resetMessageSuccess = () => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_RESET_MSG_SUCCESS
});

/**
 * reset state
 */
export const resetList = () => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_RESET_LIST
});

export interface DataResponseOverflowMenu {
  employee: any;
  email: string;
}

export const getSearchConditionInfoGroup = groupId => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_GET_INFO_SEARCH_CONDITION_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-group-search-condition-info`,
    { groupId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const resetMsgError = () => ({
  type: ACTION_TYPES.EMPLOYEE_LIST_RESET_MSG_ERROR
});
