import axios from 'axios';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import {
  API_CONTEXT_PATH,
  API_CONFIG,
  IGNORE_DBL_CLICK_ACTION,
  ORG_TARGET_INDEX,
  ORG_SEARCH_TYPE
} from 'app/config/constants';
import _ from 'lodash';
import { makeParamsRelationSuggest } from 'app/shared/reducers/dynamic-field-helper';

export const ACTION_TYPES = {
  SELECT_ORGANIZATION_RESET: 'selectOrganization/RESET',
  SELECT_ORGANIZATION_GET_SUGESION: `${IGNORE_DBL_CLICK_ACTION}selectOrganization/SUGESION_GET`,
  SELECT_ORGANIZATION_GET: `${IGNORE_DBL_CLICK_ACTION}selectOrganization/ORGANIZATION_GET`
};

export enum SelectOrganizationAction {
  None,
  Request,
  Error,
  Success
}

const pushEmployees = (suggestData, records, node, listItemChoice) => {
  try {
    records.forEach(rec => {
      rec[node].forEach(emp => {
        if (
          _.isEmpty(suggestData.records.filter(sug => sug.employeeId === emp.employeeId)) &&
          _.isEmpty(
            listItemChoice.filter(
              e => e.searchType === ORG_SEARCH_TYPE.EMPLOYEE && e.idChoice === emp.employeeId
            )
          )
        ) {
          suggestData.records.push(emp);
        }
      });
    });
  } catch {
    // nothing todo
  }
};

const parseSugesionResponse = (res, target?, listItemChoice?) => {
  const suggestData = { records: [], total: 0 };
  if (res) {
    if (_.isNil(target) || _.isEqual(target.split('')[ORG_TARGET_INDEX.EMPLOYEE], '1')) {
      if (res.employees && res.employees.length > 0) {
        suggestData.records.push(...res.employees);
      }
      pushEmployees(suggestData, res.departments, 'employeesDepartments', listItemChoice);
      // pushEmployees(suggestData, res.groups, 'employeesGroups', listItemChoice);
      suggestData.records.forEach(e => {
        e['recordId'] = e.employeeId;
      });
    }
    if (
      (_.isNil(target) || _.isEqual(target.split('')[ORG_TARGET_INDEX.DEPARTMENT], '1')) &&
      res.departments &&
      res.departments.length > 0
    ) {
      suggestData.records.push(...res.departments);
      suggestData.records.forEach(e => {
        e['recordId'] = e.departmentId;
        // pushEmployees(suggestData, e.employeesDepartments);
      });
    }
    if (
      (_.isNil(target) || _.isEqual(target.split('')[ORG_TARGET_INDEX.GROUP], '1')) &&
      res.groups &&
      res.groups.length > 0
    ) {
      suggestData.records.push(...res.groups);
      suggestData.records.forEach(e => {
        e['recordId'] = e.groupId;
        // pushEmployees(suggestData, e.employeesGroups);
      });
    }
    suggestData.total = res.total;
  }
  return { suggestData };
};

/**
 * get all employees in a group or department
 */
const getEmployees = (employees, employeeIds) => {
  const retEmployees = [];
  employeeIds.forEach(id => {
    employees.forEach(emp => {
      if (emp.employeeId === id) {
        retEmployees.push(emp);
      }
    });
  });
  return retEmployees;
};

/**
 * custom response data to array of organizations
 * @param res
 * @param orgIds
 */
const buildOrganizationData = (res, orgIds) => {
  const organizations = [];
  const employees = res.employee ? res.employee : [];
  const departments = res.departments ? res.departments : [];
  const groups = res.groupId ? res.groupId : [];
  const simpleEmps = res.employees ? res.employees : [];
  orgIds.forEach(elem => {
    if (elem.employeeId) {
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].employeeId === elem.employeeId) {
          organizations.push(employees[i]);
          break;
        }
      }
    } else if (elem.departmentId) {
      for (let i = 0; i < departments.length; i++) {
        if (departments[i].departmentId === elem.departmentId) {
          organizations.push({
            ...departments[i],
            employees: getEmployees(
              simpleEmps,
              departments[i].employeeIds ? departments[i].employeeIds : []
            )
          });
          break;
        }
      }
    } else if (elem.groupId) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].groupId === elem.groupId) {
          organizations.push({
            ...groups[i],
            employees: getEmployees(simpleEmps, groups[i].employeeIds ? groups[i].employeeIds : [])
          });
          break;
        }
      }
    }
  });
  return organizations;
};

const parseOrganizationResponse = (res, orgIds) => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action =
    errorMsg.length > 0 ? SelectOrganizationAction.Error : SelectOrganizationAction.Success;
  let organizationData = [];
  let employees = [];
  if (res) {
    organizationData = buildOrganizationData(res, orgIds);
    if (res.employees) {
      employees = res.employees;
    }
  }
  return { errorMsg, action, organizationData, employees };
};

const parseOrganizationResponseFail = res => {
  let errorMsg = '';
  if (res.parameters.extensions && res.parameters.extensions.length > 0) {
    errorMsg = res.parameters.extensions[0].message;
  }
  return { errorMsg };
};

interface IOrganizationResponseData {
  action: SelectOrganizationAction;
  errorMessage: any;
  suggestData: any;
  organizationData: any[];
  employees: any[];
}

const initialState = {
  data: new Map<string, IOrganizationResponseData>()
};

export type SelectOrganizationState = Readonly<typeof initialState>;

// Reducer
export default (state: SelectOrganizationState = initialState, action): SelectOrganizationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SELECT_ORGANIZATION_GET):
    case REQUEST(ACTION_TYPES.SELECT_ORGANIZATION_GET_SUGESION):
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = SelectOrganizationAction.Request;
        state.data.get(action.meta.namespace).errorMessage = null;
      }
      return { ...state };
    case FAILURE(ACTION_TYPES.SELECT_ORGANIZATION_GET):
    case FAILURE(ACTION_TYPES.SELECT_ORGANIZATION_GET_SUGESION): {
      const res = parseOrganizationResponseFail(action.payload.response.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = SelectOrganizationAction.Error;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).errorMessage = action.payload.message;
      }
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.SELECT_ORGANIZATION_GET_SUGESION): {
      const res = parseSugesionResponse(
        action.payload.data,
        action.meta.orgTarget,
        action.meta.listItemChoice
      );
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = SelectOrganizationAction.Success;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).suggestData = res.suggestData;
      } else {
        state.data.set(action.meta.namespace, {
          action: SelectOrganizationAction.Success,
          errorMessage: null,
          suggestData: res.suggestData,
          organizationData: [],
          employees: []
        });
      }
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.SELECT_ORGANIZATION_GET): {
      const res = parseOrganizationResponse(action.payload.data, action.meta.orgIds);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = res.action;
        state.data.get(action.meta.namespace).errorMessage = res.errorMsg;
        state.data.get(action.meta.namespace).organizationData = res.organizationData;
        state.data.get(action.meta.namespace).employees = res.employees;
        state.data.get(action.meta.namespace).suggestData = [];
      } else {
        state.data.set(action.meta.namespace, {
          action: res.action,
          errorMessage: res.errorMsg,
          suggestData: [],
          organizationData: res.organizationData,
          employees: res.employees
        });
      }
      return { ...state };
    }
    case ACTION_TYPES.SELECT_ORGANIZATION_RESET:
      return {
        data: new Map<string, IOrganizationResponseData>()
      };
    default:
      return state;
  }
};

const employeeApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export const handleGetEmployeeSuggestions = (
  namespace,
  fieldBelong: number,
  keySearch: string,
  offset: number,
  limit: number,
  orgTarget?: string,
  listItemChoice?: any[],
  searchType?: any
) => async dispatch => {
  const params = makeParamsRelationSuggest(
    fieldBelong,
    keySearch,
    offset,
    limit,
    listItemChoice ? listItemChoice : [],
    0,
    searchType
  );
  await dispatch({
    type: ACTION_TYPES.SELECT_ORGANIZATION_GET_SUGESION,
    payload: axios.post(params.url, params.query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace, fieldBelong, orgTarget, listItemChoice }
  });
};

const buildFormDataSelectOrganization = (departmentId, groupId, employeeId) => ({
  employeeId,
  departmentId,
  groupId
});

const getSelectedOrganizationInfo = (namespace, orgIds, departmentIds, groupIds, employeeIds) => ({
  type: ACTION_TYPES.SELECT_ORGANIZATION_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/get-selected-organization-info'}`,
    buildFormDataSelectOrganization(departmentIds, groupIds, employeeIds),
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: {
    namespace,
    orgIds
  }
});

export const handleGetSelectOrganization = (namespace, orgIds) => async dispatch => {
  const employeeIds = [];
  const departmentIds = [];
  const groupIds = [];
  // camelCase property
  const camelOrgIds = [];
  orgIds.forEach(org => {
    const property = Object.keys(org);
    const item = {};
    property.forEach(key => {
      item[_.camelCase(key)] = org[key];
    });
    camelOrgIds.push(item);
  });
  let isExist = false;
  camelOrgIds.forEach(e => {
    if (e.employeeId) {
      employeeIds.push(e.employeeId);
      isExist = true;
    } else if (e.departmentId) {
      departmentIds.push(e.departmentId);
      isExist = true;
    } else if (e.groupId) {
      groupIds.push(e.groupId);
      isExist = true;
    }
  });
  if (!isExist) {
    return;
  }
  await dispatch(
    getSelectedOrganizationInfo(namespace, camelOrgIds, departmentIds, groupIds, employeeIds)
  );
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.SELECT_ORGANIZATION_RESET
});
