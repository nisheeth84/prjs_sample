import axios from 'axios';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG, FIELD_BELONG } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { FieldInfoType } from '../constants';
import { BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';

export const ACTION_TYPES = {
  DYNAMIC_LIST_RESET: 'dynamicList/RESET',
  DYNAMIC_LIST_CHECK_ITEM: 'dynamicList/CHECK_ITEM',
  DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET: 'dynamicList/FIELD_INFO_PERSONALS_GET',
  DYNAMIC_LIST_FIELD_INFO_BELONG: 'dynamicList/FIELD_INFO_BELONG_GET',
  DYNAMIC_LIST_RELATION_DISPLAY_FIELD: 'dynamicList/RELATION_DISPLAY_FIELD',
  DYNAMIC_LIST_FIELD_INFO_PERSONALS_UPDATE: 'dynamicList/FIELD_INFO_PERSONALS_UPDATE'
};

export enum DynamicAction {
  None,
  Request,
  Error,
  Success
}

interface IDynamicListStateData {
  action: DynamicAction;
  fieldInfos: any;
  customFieldsInfo: any;
  relationDisplayField: any;
  errorMessage: string;
  recordCheckList: any[];
}

const initialState = {
  data: new Map<string, IDynamicListStateData>()
};

const parseFieldInfoPersonalResponse = (res, type) => {
  const fieldInfos = res;
  if (type === FieldInfoType.Tab) {
    fieldInfos.fieldInfoPersonals = fieldInfos.data;
    fieldInfos.fieldInfoPersonals.sort((a, b) => {
      return a.fieldOrder - b.fieldOrder;
    });
  } else if (fieldInfos.fieldInfoPersonals) {
    fieldInfos.fieldInfoPersonals.sort((a, b) => {
      if (a.isColumnFixed && b.isColumnFixed) {
        return a.fieldOrder - b.fieldOrder;
      } else if (a.isColumnFixed && !b.isColumnFixed) {
        return -1;
      } else if (!a.isColumnFixed && b.isColumnFixed) {
        return 1;
      } else {
        return a.fieldOrder - b.fieldOrder;
      }
    });
  }
  return { fieldInfos };
};

const parseFieldInfoBelongResponse = res => {
  const fieldInfos = [];
  if (res && res.fields) {
    fieldInfos.push(...res.fields);
  }
  return { fieldInfos };
};

export type DynamicListState = Readonly<typeof initialState>;

// Reducer
export default (state: DynamicListState = initialState, action): DynamicListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET):
    case REQUEST(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_BELONG):
    case REQUEST(ACTION_TYPES.DYNAMIC_LIST_RELATION_DISPLAY_FIELD):
    case REQUEST(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_UPDATE):
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Request;
        state.data.get(action.meta.namespace).errorMessage = null;
      }
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET):
    case FAILURE(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_BELONG):
    case FAILURE(ACTION_TYPES.DYNAMIC_LIST_RELATION_DISPLAY_FIELD):
    case FAILURE(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_UPDATE):
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Error;
        state.data.get(action.meta.namespace).errorMessage = parseErrorRespose(action.payload)[0];
      }
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET): {
      const res = parseFieldInfoPersonalResponse(action.payload.data, action.meta.type);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Success;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).fieldInfos = res.fieldInfos;
      } else {
        state.data.set(action.meta.namespace, {
          action: DynamicAction.Success,
          errorMessage: null,
          fieldInfos: res.fieldInfos,
          customFieldsInfo: [],
          relationDisplayField: [],
          recordCheckList: []
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_BELONG): {
      const res = parseFieldInfoBelongResponse(action.payload.data);
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Success;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).customFieldsInfo = res.fieldInfos;
      } else {
        state.data.set(action.meta.namespace, {
          action: DynamicAction.Success,
          errorMessage: null,
          fieldInfos: [],
          relationDisplayField: [],
          customFieldsInfo: res.fieldInfos,
          recordCheckList: []
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_LIST_RELATION_DISPLAY_FIELD): {
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Success;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).relationDisplayField = _.get(
          action.payload.data,
          'customFieldsInfo'
        );
      } else {
        state.data.set(action.meta.namespace, {
          action: DynamicAction.Success,
          errorMessage: null,
          fieldInfos: [],
          relationDisplayField: _.get(action.payload.data, 'customFieldsInfo'),
          customFieldsInfo: [],
          recordCheckList: []
        });
      }
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_UPDATE):
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.Success;
        state.data.get(action.meta.namespace).errorMessage = null;
      }
      return {
        ...state
      };
    case ACTION_TYPES.DYNAMIC_LIST_CHECK_ITEM:
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).recordCheckList = action.payload.checkList;
      }
      return {
        ...state
      };
    case ACTION_TYPES.DYNAMIC_LIST_RESET:
      if (state.data.has(action.meta.namespace)) {
        state.data.get(action.meta.namespace).action = DynamicAction.None;
        state.data.get(action.meta.namespace).errorMessage = null;
        state.data.get(action.meta.namespace).fieldInfos = null;
        state.data.get(action.meta.namespace).recordCheckList = null;
        state.data.delete(action.meta.namespace);
      }
      return {
        ...state
      };
    default:
      return state;
  }
};

const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const PARAM_GET_FIELD_INFO_PERSONAL = (
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId
) => ({
  fieldBelong,
  extensionBelong,
  selectedTargetType,
  selectedTargetId: selectedTargetId ? selectedTargetId : 0
});

export const PARAM_GET_FIELD_INFO_TAB = (tabBelong, tabId) => ({ tabBelong, tabId });

export const PARAM_GET_FIELDS_INFO_BELONG = (fieldBelong: number) => ({ fieldBelong });

export const PARAM_UPDATE_FIELD_INFO_PERSONAL = (
  fieldBelong,
  extensionBelong,
  fieldInfos,
  selectedTargetType,
  selectedTargetId
) => ({
  fieldBelong,
  extensionBelong,
  selectedTargetType: selectedTargetType ? selectedTargetType : 0,
  selectedTargetId: selectedTargetId ? selectedTargetId : 0,
  fieldInfos
});

export const PARAM_UPDATE_FIELD_INFO_TAB = (tabBelong, tabId, fieldInfos) => ({
  tabBelong,
  tabId,
  fieldInfos
});

/**
 * Get field info personals
 *
 * @param
 */
export const getFieldInfoPersonals = (
  namespace,
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  /** using employee MENU_TYPE */
  const targetType = !selectedTargetType || selectedTargetType < 3 ? 0 : selectedTargetType;
  const targetId = targetType === 0 ? 0 : selectedTargetId;
  const query =
    type === FieldInfoType.Personal
      ? PARAM_GET_FIELD_INFO_PERSONAL(belong, extBelong, targetType, targetId)
      : PARAM_GET_FIELD_INFO_TAB(belong, extBelong);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_GET,
    payload: axios.post(
      type === FieldInfoType.Personal
        ? `${commonsApiUrl}/get-field-info-personals`
        : `${commonsApiUrl}/get-field-info-tabs`,
      query,
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: { namespace, type }
  });
};

export const getRelationDisplayField = (namespace, fieldIds: number[]) => ({
  type: ACTION_TYPES.DYNAMIC_LIST_RELATION_DISPLAY_FIELD,
  payload: axios.post(
    `${commonsApiUrl}/get-custom-fields-info-by-field-ids`,
    { fieldIds },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

/**
 * update field info personals
 *
 * @param key
 */
export const updateFieldInfoPersonals = (
  namespace,
  belong,
  extBelong,
  type,
  objParam,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  /** note update field */
  const targetType = !selectedTargetType || selectedTargetType < 3 ? 0 : selectedTargetType;
  const targetId = targetType === 0 ? 0 : selectedTargetId;
  const query =
    type === FieldInfoType.Personal
      ? PARAM_UPDATE_FIELD_INFO_PERSONAL(belong, extBelong, objParam, targetType, targetId)
      : PARAM_UPDATE_FIELD_INFO_TAB(belong, extBelong, objParam);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_PERSONALS_UPDATE,
    payload: axios.post(commonsApiUrl + '/update-field-info-personals', query, {
      headers: { ['Content-Type']: 'application/json' }
    }),
    meta: { namespace }
  });
};
// FIELD_BELONG = 4
const getListFieldSwitcher = (customerFieldsInfor, belong) => {
  if (belong === FIELD_BELONG.BUSINESS_CARD) {
    return customerFieldsInfor.filter(
      field =>
        field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.employeeId ||
        field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate ||
        field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate
    );
  }
  return [];
};

export const handleChooseField = (
  namespace,
  sourceField,
  isSelected,
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const { fieldInfos } = getState().dynamicList.data.get(namespace);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_BELONG,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-fields-info`,
      {
        fieldBelong: belong
      },
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: { namespace }
  });
  const customerFieldsInfor = getState().dynamicList.data.get(namespace).customFieldsInfo;
  const objectFieldInfos = _.cloneDeep(fieldInfos); // JSON.parse(JSON.stringify(fieldInfos));
  const listFieldGroup = customerFieldsInfor.filter(
    field =>
      sourceField.fieldGroup &&
      field.fieldGroup === sourceField.fieldGroup &&
      field.fieldId !== sourceField.fieldId
  );

  const employess = customerFieldsInfor.find(
    field => field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.employeeId
  );
  const businessReceiveDate = customerFieldsInfor.find(
    field => field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate
  );
  const receivedLastContactDate = customerFieldsInfor.find(
    field => field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate
  );
  const listFieldSwitcher = getListFieldSwitcher(customerFieldsInfor, belong);
  listFieldGroup.forEach(item => {
    const idxRemove = objectFieldInfos.fieldInfoPersonals.findIndex(
      e => e.fieldName === item.fieldName
    );
    if (idxRemove >= 0) {
      objectFieldInfos.fieldInfoPersonals.splice(idxRemove, 1);
    }
  });

  if (objectFieldInfos && objectFieldInfos.fieldInfoPersonals) {
    const objParam = [];
    if (isSelected) {
      objectFieldInfos.fieldInfoPersonals.push({
        fieldId: sourceField.fieldId
      });
      if (listFieldGroup.length > 0) {
        listFieldGroup.map(item => {
          objectFieldInfos.fieldInfoPersonals.push({
            fieldId: item.fieldId
          });
        });
      }
      if (listFieldSwitcher.length > 0) {
        if (
          sourceField.fieldId === employess.fieldId ||
          sourceField.fieldId === businessReceiveDate.fieldId ||
          sourceField.fieldId === receivedLastContactDate.fieldId
        ) {
          listFieldSwitcher.forEach(item => {
            const idxRemove = objectFieldInfos.fieldInfoPersonals.findIndex(
              e => e.fieldName === item.fieldName
            );
            if (idxRemove >= 0) {
              objectFieldInfos.fieldInfoPersonals.splice(idxRemove, 1);
            }
            objectFieldInfos.fieldInfoPersonals.push({
              fieldId: item.fieldId
            });
          });
        }
      }
    } else if (objectFieldInfos.fieldInfoPersonals.length > 0) {
      let fieldIndex = objectFieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === sourceField.fieldId.toString()
      );
      if (fieldIndex >= 0) {
        objectFieldInfos.fieldInfoPersonals.splice(fieldIndex, 1);
      }
      if (listFieldGroup.length > 0) {
        listFieldGroup.map(item => {
          fieldIndex = objectFieldInfos.fieldInfoPersonals.findIndex(
            e => e.fieldId.toString() === sourceField.fieldId.toString()
          );
          if (fieldIndex >= 0) {
            objectFieldInfos.fieldInfoPersonals.splice(fieldIndex, 1);
          }
        });
      }
      if (listFieldSwitcher.length > 0) {
        if (
          sourceField.fieldId === employess.fieldId ||
          sourceField.fieldId === businessReceiveDate.fieldId ||
          sourceField.fieldId === receivedLastContactDate.fieldId
        ) {
          objectFieldInfos.fieldInfoPersonals = objectFieldInfos.fieldInfoPersonals.filter(
            e => e.fieldId !== employess.fieldId
          );
          objectFieldInfos.fieldInfoPersonals = objectFieldInfos.fieldInfoPersonals.filter(
            e => e.fieldId !== businessReceiveDate.fieldId
          );
        }
      }
    }
    for (let i = 0; i < objectFieldInfos.fieldInfoPersonals.length; i++) {
      objParam.push({
        fieldId: objectFieldInfos.fieldInfoPersonals[i].fieldId,
        fieldOrder: i + 1,
        columnWidth: objectFieldInfos.fieldInfoPersonals[i].columnWidth,
        isColumnFixed: objectFieldInfos.fieldInfoPersonals[i].isColumnFixed
      });
    }
    await dispatch(
      updateFieldInfoPersonals(
        namespace,
        belong,
        extBelong,
        type,
        objParam,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().dynamicList.data.get(namespace);
    if (action === DynamicAction.Success) {
      await dispatch(
        getFieldInfoPersonals(
          namespace,
          belong,
          extBelong,
          type,
          selectedTargetType,
          selectedTargetId
        )
      );
    }
  }
};

export const handleDragField = (
  namespace,
  fieldSrc,
  fieldTarget,
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const { fieldInfos } = getState().dynamicList.data.get(namespace);
  const objectFieldInfos = _.cloneDeep(fieldInfos);
  await dispatch({
    type: ACTION_TYPES.DYNAMIC_LIST_FIELD_INFO_BELONG,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-fields-info`,
      {
        fieldBelong: belong
      },
      { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: { namespace }
  });
  const customerFieldsInfor = getState().dynamicList.data.get(namespace).customFieldsInfo;
  const listFieldGroup = customerFieldsInfor.filter(
    field =>
      fieldSrc.fieldGroup &&
      field.fieldGroup === fieldSrc.fieldGroup &&
      field.fieldId !== fieldSrc.fieldId
  );

  listFieldGroup.forEach(item => {
    const idxRemove = objectFieldInfos.fieldInfoPersonals.findIndex(
      e => e.fieldName === item.fieldName
    );
    if (idxRemove > 0) {
      objectFieldInfos.fieldInfoPersonals.splice(idxRemove, 1);
    }
  });

  if (objectFieldInfos && objectFieldInfos.fieldInfoPersonals) {
    const objParam = [];
    const targetId = _.isArray(fieldTarget) ? fieldTarget[0].fieldId : fieldTarget.fieldId;
    const listFieldIdAdded = [];
    listFieldIdAdded.push({ fieldId: fieldSrc.fieldId });
    if (listFieldGroup.length > 0) {
      listFieldGroup.map(item => {
        listFieldIdAdded.push({
          fieldId: item.fieldId
        });
      });
    }
    const fieldIndex = objectFieldInfos.fieldInfoPersonals.findIndex(e => e.fieldId === targetId);
    if (fieldIndex >= 0) {
      objectFieldInfos.fieldInfoPersonals.splice(fieldIndex, 0, ...listFieldIdAdded);
    } else {
      objectFieldInfos.fieldInfoPersonals.push(...listFieldIdAdded);
    }

    for (let i = 0; i < objectFieldInfos.fieldInfoPersonals.length; i++) {
      objParam.push({
        fieldId: objectFieldInfos.fieldInfoPersonals[i].fieldId,
        fieldOrder: i + 1,
        columnWidth: objectFieldInfos.fieldInfoPersonals[i].columnWidth,
        isColumnFixed: objectFieldInfos.fieldInfoPersonals[i].isColumnFixed
      });
    }
    await dispatch(
      updateFieldInfoPersonals(
        namespace,
        belong,
        extBelong,
        type,
        objParam,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().dynamicList.data.get(namespace);
    if (action === DynamicAction.Success) {
      await dispatch(
        getFieldInfoPersonals(
          namespace,
          belong,
          extBelong,
          type,
          selectedTargetType,
          selectedTargetId
        )
      );
    }
  }
};

export const handleReorderField = (
  namespace,
  fields: { fieldId; isColumnFixed; fieldOrder }[],
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const { fieldInfos } = getState().dynamicList.data.get(namespace);
  const objectFieldInfos = _.cloneDeep(fieldInfos);

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    const objParam = [];
    fields.forEach((field, idx) => {
      const index = objectFieldInfos.fieldInfoPersonals.findIndex(
        el => el.fieldId === field.fieldId
      );
      let columnWidth = null;
      let fieldOrder = null;
      let isColumnFixed = null;
      if (index >= 0) {
        columnWidth = objectFieldInfos.fieldInfoPersonals[index].columnWidth;
      }
      if (!_.isUndefined(field.isColumnFixed)) {
        isColumnFixed = field.isColumnFixed;
      } else if (index >= 0) {
        isColumnFixed = fieldInfos.fieldInfoPersonals[index].isColumnFixed;
      }
      if (!_.isUndefined(field.fieldOrder)) {
        fieldOrder = field.fieldOrder;
      } else {
        fieldOrder = idx;
      }
      objParam.push({ fieldId: field.fieldId, columnWidth, isColumnFixed, fieldOrder });
    });
    await dispatch(
      updateFieldInfoPersonals(
        namespace,
        belong,
        extBelong,
        type,
        objParam,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().dynamicList.data.get(namespace);
    if (action === DynamicAction.Success) {
      await dispatch(
        getFieldInfoPersonals(
          namespace,
          belong,
          extBelong,
          type,
          selectedTargetType,
          selectedTargetId
        )
      );
    }
  }
};

export const handleChangeColumnsWidth = (
  namespace,
  columnsWidth: { fieldId; columnWidth }[],
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const { fieldInfos } = getState().dynamicList.data.get(namespace);
  const objectFieldInfos = _.cloneDeep(fieldInfos);

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    const objParam = [];
    for (let i = 0; i < objectFieldInfos.fieldInfoPersonals.length; i++) {
      let width = objectFieldInfos.fieldInfoPersonals[i].columnWidth;
      let isColumnFixed = fieldInfos.fieldInfoPersonals[i].isColumnFixed;
      if (isColumnFixed === null || isColumnFixed === undefined) {
        isColumnFixed = false;
      }
      const fieldIndex = columnsWidth.findIndex(
        e => e.fieldId.toString() === objectFieldInfos.fieldInfoPersonals[i].fieldId.toString()
      );
      if (fieldIndex >= 0) {
        width = columnsWidth[fieldIndex].columnWidth;
      }
      objParam.push({
        fieldId: objectFieldInfos.fieldInfoPersonals[i].fieldId,
        columnWidth: width,
        fieldOrder: i + 1,
        isColumnFixed
      });
    }
    await dispatch(
      updateFieldInfoPersonals(
        namespace,
        belong,
        extBelong,
        type,
        objParam,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().dynamicList.data.get(namespace);
    if (action === DynamicAction.Success) {
      await dispatch(
        getFieldInfoPersonals(
          namespace,
          belong,
          extBelong,
          type,
          selectedTargetType,
          selectedTargetId
        )
      );
    }
  }
};

export const handleFixColumn = (
  namespace: string,
  fieldId: number,
  isFix: boolean,
  belong,
  extBelong,
  type,
  selectedTargetType,
  selectedTargetId
) => async (dispatch, getState) => {
  const { fieldInfos } = getState().dynamicList.data.get(namespace);
  // const objectFieldInfos = _.cloneDeep(fieldInfos);
  if (fieldInfos && fieldInfos.fieldInfoPersonals && fieldInfos.fieldInfoPersonals.length > 0) {
    const objParam = [];
    const idx = fieldInfos.fieldInfoPersonals.findIndex(e => e.fieldId === fieldId);
    for (let i = 0; i < fieldInfos.fieldInfoPersonals.length; i++) {
      let isColumnFixed = false; // fieldInfos.fieldInfoPersonals[i].isColumnFixed;
      const columnWidth = fieldInfos.fieldInfoPersonals[i].columnWidth;
      if (isFix) {
        if (i <= idx) {
          isColumnFixed = true;
        } else {
          isColumnFixed = false;
        }
      }
      objParam.push({
        fieldId: fieldInfos.fieldInfoPersonals[i].fieldId,
        columnWidth,
        fieldOrder: i + 1,
        isColumnFixed
      });
    }
    if (idx >= 0 && fieldInfos.fieldInfoPersonals[idx].fieldGroup > 0) {
      const fieldGroup = fieldInfos.fieldInfoPersonals.filter(
        e => e.fieldGroup === fieldInfos.fieldInfoPersonals[idx].fieldGroup
      );
      fieldGroup.forEach(e => {
        const fIdx = objParam.findIndex(o => o.fieldId === e.fieldId);
        if (fIdx >= 0) {
          objParam[fIdx].isColumnFixed = isFix;
        }
      });
    }
    await dispatch(
      updateFieldInfoPersonals(
        namespace,
        belong,
        extBelong,
        type,
        objParam,
        selectedTargetType,
        selectedTargetId
      )
    );
    const { action } = getState().dynamicList.data.get(namespace);
    if (action === DynamicAction.Success) {
      await dispatch(
        getFieldInfoPersonals(
          namespace,
          belong,
          extBelong,
          type,
          selectedTargetType,
          selectedTargetId
        )
      );
    }
  }
};

export const handleRecordCheckItem = (namespace: string, records: any[]) => ({
  type: ACTION_TYPES.DYNAMIC_LIST_CHECK_ITEM,
  payload: {
    checkList: records ? records.filter(e => e.isChecked) : []
  },
  meta: { namespace }
});

/**
 * reset state
 */
export const reset = (namespace: string) => ({
  type: ACTION_TYPES.DYNAMIC_LIST_RESET,
  meta: { namespace }
});
