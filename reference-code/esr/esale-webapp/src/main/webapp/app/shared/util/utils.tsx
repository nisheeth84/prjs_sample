import _ from 'lodash';
import { DEFINE_FIELD_TYPE, TYPE_UNIT, SPECIAL_FIELD_HIDE_DETAIL } from '../layout/dynamic-form/constants';
import {
  ORG_FORMATS,
  ScreenMode,
  LINK_TARGET_IFRAME,
  ControlType,
  APP_DATE_FORMAT,
  APP_TIME_FORMAT,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  USER_ICON_PATH,
  CHECK_RESPONSE_FROM_SAML,
  SIGNOUT_SAML_URL,
} from 'app/config/constants';
import FieldDetailViewRelation from '../layout/dynamic-form/control-field/detail/field-detail-view-relation';
import React from 'react';
import FieldDetailViewTextArea from '../layout/dynamic-form/control-field/detail/field-detail-view-text-area';
import FieldDetailViewSelectOrg from '../layout/dynamic-form/control-field/detail/field-detail-view-select-org';
import { getFieldLabel, autoFormatNumber, jsonParse } from './string-utils';
import { translate } from 'react-jhipster';
import { calculate } from './calculation-utils';
import { formatDate, utcToTz, DATE_TIME_FORMAT, autoFormatTime } from './date-utils';
import dateFnsFormat from 'date-fns/format';
import { Storage } from 'react-jhipster';

export const isMouseOnRef = (ref, event) => {
  if (ref.current && ref.current.contains(event.target)) {
    return true;
  }
  return false;
};

export const deepEqual = (x?: object | null, y?: object | null, ignoreRootProps?: Set<string>) => {
  if (x == null || y == null) {
    return x === y;
  }
  const keys = Object.keys(x);
  if (!_.isEqual(Object.keys(x).sort(), Object.keys(y).sort())) {
    return false;
  }

  for (const key of keys) {
    if (ignoreRootProps && ignoreRootProps.has(key)) {
      continue;
    }
    if (key === 'fieldLabel' || key === 'itemLabel') {
      if (_.isNil(x[key]) && _.isNil(y[key])) {
        continue;
      }
      if (_.isNil(x[key]) || _.isNil(y[key])) {
        return false;
      }
      let obj1 = '';
      let obj2 = '';
      try {
        obj1 = _.isString(x[key]) ? jsonParse(x[key]) : x[key];
        obj2 = _.isString(y[key]) ? jsonParse(y[key]) : y[key];
      } catch (e) {
        obj1 = x[key];
        obj2 = y[key];
      }
      if (!_.isEqual(obj1, obj2)) {
        return false;
      }
    } else {
      if (_.isObject(x[key])) {
        const result = deepEqual(x[key], y[key]);
        if (!result) {
          return false;
        } else {
          continue;
        }
      } else if (!_.isEqual(x[key], y[key])) {
        return false;
      }
    }
  }
  return true;
};

export const isFieldInTab = (field: any, listField: any) => {
  if (!field || !listField) {
    return false;
  }
  const listTab = listField.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB);
  if (!listTab || listTab.length < 1) {
    return false;
  }
  for (let i = 0; i < listTab.length; i++) {
    if (listTab[i].tabData && _.isArray(listTab[i].tabData)) {
      if (listTab[i].tabData.findIndex(e => e === field.fieldId) >= 0) {
        return true;
      }
    }
  }
  return false;
};

export const WAR_COM_0010 = 'WAR_COM_0010';

const revertFieldRelation = field => {
  field.fieldId = field.oldField.fieldId;
  field.relationData.fieldId = field.oldField.relationData.fieldId;
  field.relationField.fieldId = field.oldField.relationData.fieldId;
  field.relationField.relationData.fieldId = field.oldField.fieldId;
  return field;
};

const isMultiToSingle = (field, paramsEditField) => {
  return (
    field.fieldId > 0 &&
    ((!_.isNil(field.relationData) && (field.relationData.format === 2 && paramsEditField.relationData.format === 1)) ||
      (!_.isNil(field.relationField) &&
        field.relationField.relationData.format === 2 &&
        paramsEditField.relationField.relationData.format === 1) || _.get(paramsEditField, 'relationField.isMultiToSingle')) && _.isNil(field.copyField)
  );
};

export const processRelationselectOrganization = (listField, paramsEditField, deleteField) => {
  let newParamsEditField = _.cloneDeep(paramsEditField);
  listField.forEach((field, index) => {
    if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && field.fieldId === paramsEditField.fieldId) {
      // Multi -> Single
      if (isMultiToSingle(field, paramsEditField)) {
        const newParams = _.cloneDeep(newParamsEditField);
        const newFieldRelation = _.cloneDeep(field);
        newFieldRelation.fieldId = Math.round(Math.random() * 100000 * -1);
        newParams.fieldId = newFieldRelation.fieldId;
        newParams.relationData.fieldId = Math.round(Math.random() * 100000 * -1);
        const copyField1 = { from: paramsEditField.fieldId, to: newParams.fieldId };
        newFieldRelation['copyField'] = copyField1;
        if (newParams.relationField && paramsEditField.relationField) {
          newParams.relationField.fieldId = newParams.relationData.fieldId;
          newParams.relationField.relationData.fieldId = newParams.fieldId;
          const copyField2 = { from: paramsEditField.relationField.fieldId, to: newParams.relationField.fieldId };
          newParams.relationField['copyField'] = copyField2;
        }
        newParamsEditField = newParams;
        deleteField.push(paramsEditField.fieldId);
        newFieldRelation['oldField'] = field;
        listField.splice(index, 1, newFieldRelation);
      } else if (
        field.fieldId < 0 &&
        !_.isNil(field.oldField) &&
        !_.isNil(field.relationData) &&
        ((field.relationData.format === 2 &&
          paramsEditField.relationData.format === 1 &&
          _.get(paramsEditField, "relationField.relationData.format") === 1) ||
          (_.get(field, "relationField.relationData.format") === 2 &&
            _.get(paramsEditField, "relationField.relationData.format") === 1 &&
            paramsEditField.relationData.format === 1)) &&
        _.isNil(field.oldField)
      ) {
        revertFieldRelation(field);
      } else if (
        field.fieldId < 0 &&
        !_.isNil(field.relationData) &&
        ((field.relationData.format === 1 &&
          paramsEditField.relationData.format === 2 &&
          _.get(paramsEditField, "relationField.relationData.format") === 2) ||
          (!_.isNil(field.relationField) && field.relationField.relationData.format === 1 &&
            _.get(paramsEditField, "relationField.relationData.format") === 2 &&
            paramsEditField.relationData.format === 2)) &&
        !_.isNil(field.oldField)
      ) {
        revertFieldRelation(field);
        if (!_.isNil(field.copyField)) {
          delete field.copyField;
        }
        if (!_.isNil(field.relationField.copyField)) {
          delete field.relationField.copyField;
        }
      }
    } else if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION && field.fieldId === paramsEditField.fieldId) {
      if (
        field.fieldId > 0 &&
        (field.selectOrganizationData && _.toString(field.selectOrganizationData.format) === ORG_FORMATS.MULTI &&
          _.toString(paramsEditField.selectOrganizationData.format) === ORG_FORMATS.SINGLE)
      ) {
        const newParams = _.cloneDeep(newParamsEditField);
        const newFieldOganization = _.cloneDeep(field);
        newFieldOganization.fieldId = Math.round(Math.random() * 100000 * -1);
        const copyField = { from: paramsEditField.fieldId, to: newFieldOganization.fieldId };
        newFieldOganization['copyField'] = copyField;
        newParams.fieldId = newFieldOganization.fieldId;
        newParamsEditField = newParams;
        newFieldOganization['oldField'] = field;
        deleteField.push(paramsEditField.fieldId);
        listField.splice(index, 1, newFieldOganization);
      } else if (
        field.fieldId > 0 &&
        _.toString(field.selectOrganizationData.format) === ORG_FORMATS.SINGLE &&
        _.toString(paramsEditField.selectOrganizationData.format) === ORG_FORMATS.MULTI &&
        !_.isNil(field.oldField)
      ) {
        field.fieldId = field.oldField.fieldId;
        if (!_.isNil(field.copyField)) {
          delete field.copyField;
        }
      }
    }
  });
  return { listField, newParamsEditField, deleteField };
};

export const putDataToFieldEdit = (listField, paramsEditField, fieldInfoEdit) => {
  listField.forEach((field, index) => {
    if (field.fieldId === paramsEditField.fieldId) {
      Object.keys(paramsEditField).forEach(item1 => {
        Object.keys(field).forEach(item2 => {
          if (item1 === item2) {
            if (item1 === 'fieldLabel') {
              field[item2] = _.isString(paramsEditField[item1]) ? paramsEditField[item1] : JSON.stringify(paramsEditField[item1]);
            } else if (item1 === 'fieldItems' && paramsEditField['fieldItems'] !== null) {
              paramsEditField[item1].map(item => {
                item['itemLabel'] = _.isString(item['itemLabel']) ? item['itemLabel'] : JSON.stringify(item['itemLabel']);
              });
              field[item2] = paramsEditField[item1];
            } else if (item1 === 'tabData' && paramsEditField['tabData'] !== null) {
              field[item2] = _.isString(paramsEditField[item1]) ? paramsEditField[item1] : JSON.stringify(paramsEditField[item1]);
            } else if (item1 === 'lookupData') {
              field[item2] = paramsEditField[item1];
              field[item1] !== null &&
                field[item2].itemReflect.forEach((e, idx) => {
                  if (e.fieldLabel) {
                    field[item2].itemReflect[idx].fieldLabel = _.isString(e.fieldLabel) ? e.fieldLabel : JSON.stringify(e.fieldLabel);
                  }
                });
            } else if (item1 === 'differenceSetting') {
              field[item2] = paramsEditField[item1];
              if (!_.isNil(field[item2])) {
                field[item2].forwardText = _.isString(paramsEditField[item1].forwardText)
                  ? paramsEditField[item1].forwardText
                  : JSON.stringify(paramsEditField[item1].forwardText);
                field[item2].backwardText = _.isString(paramsEditField[item1].backwardText)
                  ? paramsEditField[item1].backwardText
                  : JSON.stringify(paramsEditField[item1].backwardText);
              }
            } else {
              field[item2] = paramsEditField[item1];
            }
          } else if (_.isEqual(item1, 'relationField')) {
            field['relationField'] = paramsEditField[item1];
          }
        });
      });
      if (_.isNil(field.userModifyFlg)) {
        Object.assign(field, { userModifyFlg: paramsEditField.userModifyFlg });
      }
    }
    if (_.isNil(field.userModifyFlg)) {
      Object.assign(field, { userModifyFlg: false });
    }
  });
  return listField;
};

export const isFieldRelationAsTab = field => {
  if (!field || _.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
    return false;
  }
  if (field.relationData && field.relationData.displayTab === 1 && field.relationData.asSelf !== 1) {
    return true;
  }
  return false;
};

export const createNewFieldLookup = (listField, field, deleteField) => {
  const itemReflect = field['lookupData'].itemReflect ? field['lookupData'].itemReflect : [];
  itemReflect.forEach(e => {
    const idx = listField.findIndex(o => o.fieldId === e.fieldId);
    if (idx < 0) {
      let newIdx = listField.findIndex(o => o.fieldId === field.fieldId) + 1;
      while (newIdx < listField.length) {
        if (_.get(listField[newIdx], 'lookupFieldId') === field.fieldId) {
          newIdx += 1;
        } else {
          break;
        }
      }
      const newField = {
        fieldId: e.fieldId,
        fieldType: e.fieldType,
        fieldLabel: e.fieldLabel,
        fieldOrder: newIdx,
        lookupFieldId: field.fieldId,
        inTab: field.inTab,
        userModifyFlg: true
      };
      if (field.inTab) {
        const tabIdx = listField.findIndex(
          f => f.tabData && _.isArray(f.tabData) && f.tabData.findIndex(o => o === field.fieldId) >= 0
        );
        if (tabIdx >= 0) {
          listField[tabIdx].tabData.push(e.fieldId);
        }
      }
      listField.splice(newIdx, 0, newField);
    } else {
      if (listField[idx].fieldId <= 0 && !_.isNil(e.fieldType)) {
        listField[idx].fieldType = e.fieldType;
      }
      listField[idx].fieldLabel = !_.isString(e.fieldLabel) ? JSON.stringify(e.fieldLabel) : e.fieldLabel;
      listField[idx].lookupFieldId = field.fieldId;
      listField[idx].userModifyFlg = field.userModifyFlg;
    }
    delete e.fieldType;
  });
  const listDeleted = [];
  if (itemReflect.length > 0) {
    listDeleted.push(
      ...listField.filter(e => e.lookupFieldId === field.fieldId && itemReflect.findIndex(o => o.fieldId === e.fieldId) < 0)
    );
  } else {
    listDeleted.push(...listField.filter(e => e.lookupFieldId === field.fieldId));
  }
  listDeleted.forEach(e => {
    const idx = listField.findIndex(o => o.fieldId === e.fieldId);
    if (idx >= 0) {
      listField.splice(idx, 1);
      if (e.fieldId > 0) {
        deleteField.push(e.fieldId);
      }
    }
  });
  field.lookupData.itemReflect = itemReflect;
  const fieldIdx = listField.findIndex(e => e.fieldId === field.fieldId);
  if (fieldIdx >= 0 && listField[fieldIdx].lookupData) {
    listField[fieldIdx].lookupData.itemReflect = itemReflect;
  }
  return { listField, deleteField }
}

const compareField = (listFieldOrdered, allFields) => {
  const listFields = _.cloneDeep(listFieldOrdered);
  listFields.forEach((field) => {
    const inTabTmp = field.inTab;
    if (allFields) {
      const idx = allFields.findIndex(e => e.fieldId === field.fieldId)
      if (field.fieldId > 0) {
        delete field.userModifyFlg;
        delete field.inTab;
      }
      if (idx >= 0 && deepEqual(allFields[idx], field) === false) {
        field.userModifyFlg = true
      } else if (idx >= 0 && deepEqual(allFields[idx], field) === true) {
        field.userModifyFlg = false;
      }
    }
    field.inTab = inTabTmp;
  })
  return listFields;
}

/**
   * When drag a field from popup setting fields in to screen
   *
   * @param dragFieldId
   * @param dropFieldId
   */

export const sortOrderFields = (listField: any[], allFields: any[]) => {
    const listFieldOrdered = [];
    const listTab = listField.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB)
    if (!listTab || listTab.length < 1) {
      for (let i = 0; i < listField.length; i++) {
        const field = _.cloneDeep(listField[i]);
        field.fieldOrder = i + 1;
        listFieldOrdered.push(field)
      }

      return compareField(listFieldOrdered, allFields);
    }
    let order = 1;
    const startTabIndex = listField.findIndex(e => e.fieldId === listTab[0].fieldId);
    for (let i = 0; i < startTabIndex; i++) {
      const field = _.cloneDeep(listField[i]);
      if (isFieldInTab(field, listField)) {
        continue;
      }
      field.fieldOrder = order;
      listFieldOrdered.push(field)
      order = order + 1;
    }
    for (let i = 0; i < listTab.length; i++) {
      const field = _.cloneDeep(listTab[i]);
      field.fieldOrder = order;
      listFieldOrdered.push(field)
      order = order + 1;
      if (field.tabData && _.isArray(field.tabData)) {
        const tabData = listField.filter(e => field.tabData.findIndex(o => o === e.fieldId) >= 0)
        for (let j = 0; j < tabData.length; j++) {
          const fieldInTab = _.cloneDeep(tabData[j]);
          fieldInTab.fieldOrder = order;
          listFieldOrdered.push(fieldInTab)
          order = order + 1;
        }
      }
    }
    const listFieldTail = listField.filter(e => listFieldOrdered.findIndex(o => o.fieldId === e.fieldId) < 0)

    for (let i = 0; i < listFieldTail.length; i++) {
      const field = _.cloneDeep(listFieldTail[i]);
      if (isFieldInTab(field, listField)) {
        continue;
      }
      field.fieldOrder = order;
      listFieldOrdered.push(field)
      order = order + 1;
    }

    listFieldOrdered.sort((a, b) => { return a.fieldOrder - b.fieldOrder })

    return compareField(listFieldOrdered, allFields);
  }

  /**
   * get rowRecord for list Field not in Tab
   */

export  const buildDoubleColumn = (listFields: any[], screenMode) => {
    const dblColumns = []
    if (!listFields) {
      return dblColumns;
    }
    if (screenMode === ScreenMode.DISPLAY) {
      listFields = listFields.filter(e => _.toString(e.fieldType) !== DEFINE_FIELD_TYPE.LOOKUP && _.isNil(SPECIAL_FIELD_HIDE_DETAIL.find(item => item === e.fieldName)));
    }
    let isCheck = true;
    for (let i = 0; i < listFields.length; i++) {
      const rowData = [];
      if (i === 0) {
        rowData.push(listFields[i]);
        dblColumns.push(rowData);
      } else {
        const isDouble = listFields[i].isDoubleColumn;
        const beforeDouble = listFields[i - 1].isDoubleColumn;
        let beforePrevDouble = false;
        if (i > 1) {
          beforePrevDouble = listFields[i - 2].isDoubleColumn  && !isCheck
        }
        if (!isDouble) {
          rowData.push(listFields[i]);
          dblColumns.push(rowData);
        } else {
          if (!beforeDouble) {
            rowData.push(listFields[i]);
            dblColumns.push(rowData);
          } else {
            if (beforePrevDouble) {
              rowData.push(listFields[i]);
              dblColumns.push(rowData);
              isCheck = true;
            } else {
              dblColumns[dblColumns.length - 1].push(listFields[i])
              isCheck = false;
            }
          }
        }
      }
    }
    return dblColumns;
  }

export  const reMakeFieldDragDrop = (isDoubleColumn, fieldDrag, dropIndex, isAddLeft, fields, screenMode, countSave, fieldsUnavailable?) => {
    const addNewFieldIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId);
    const dropField = fields[dropIndex]
    if (!isDoubleColumn) {
      if (fieldDrag.fieldId < 0 && _.isNil(countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
        fields.splice(dropIndex + 1, 0, fieldDrag);
      } else {
        fieldDrag.isDoubleColumn = isDoubleColumn;
        if (fieldDrag.availableFlag > 0) {
          const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
          const tempObject = fields.splice(dragIndex, 1)[0];
          const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
          fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
        } else {
          const dragIndex = fieldsUnavailable.findIndex(e => e.fieldId === fieldDrag.fieldId)
          const tempObject = fieldsUnavailable.splice(dragIndex, 1)[0];
          const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
          fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
        }
      }
    } else {
      const dblColumns = buildDoubleColumn(fields, screenMode);
      const arrDrop = dblColumns.find(e => (e.length === 1 && e[0].fieldId === fields[dropIndex].fieldId) ||
        (e.length === 2 && (e[0].fieldId === fields[dropIndex].fieldId || e[1].fieldId === fields[dropIndex].fieldId)))
      if (arrDrop.length === 1) {
        fields[dropIndex].isDoubleColumn = true;
      } else if (arrDrop.length === 2) {
        const idx = fields.findIndex(e => e.fieldId === arrDrop[1].fieldId);
        if (idx >= 0) {
          fields[dropIndex].isDoubleColumn = false;
        }
        if (fields[dropIndex].fieldId === arrDrop[0].fieldId) {
          fields[dropIndex].isDoubleColumn = true;
        } else {
          if (fields[dropIndex].fieldId === arrDrop[1].fieldId && dropIndex > 0) {
            fields[dropIndex - 1].isDoubleColumn = true;
          }
        }
      }
      if (fieldDrag.fieldId < 0 && _.isNil(countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
        fieldDrag.isDoubleColumn = true;
      } else {
        fieldDrag.isDoubleColumn = isDoubleColumn;
        // const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
        // fields.splice(dragIndex, 1);

        // if (arrDrop.length === 1) {
        //   fields[dropIndex].isDoubleColumn = true;
        // } else if (arrDrop.length === 2) {
        //   const idx = fields.findIndex(e => e.fieldId === arrDrop[1].fieldId);
        //   if (idx >= 0) {
        //     fields[dropIndex].isDoubleColumn = false;
        //   }
        //   if (fields[dropIndex].fieldId === arrDrop[0].fieldId) {
        //     fields[dropIndex].isDoubleColumn = true;
        //   } else {
        //     if (fields[dropIndex].fieldId === arrDrop[1].fieldId && dropIndex > 0) {
        //       fields[dropIndex - 1].isDoubleColumn = true;
        //     }
        //   }
        // }
        if (fieldDrag.availableFlag > 0) {
          const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
          const tempObject = fields.splice(dragIndex, 1)[0];
          const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
          fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, tempObject);
        } else {
          const dragIndex = fieldsUnavailable.findIndex(e => e.fieldId === fieldDrag.fieldId)
          fieldsUnavailable.splice(dragIndex, 1);
          const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
          fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, fieldDrag);
        }
      }
      if (fieldDrag.fieldId < 0 && _.isNil(countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
        const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
        fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, fieldDrag);
      }
      // const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
      // fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, fieldDrag);
    }
    return fields
  }

export const processDragDropFields = (fields, dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean, fieldTabRef, screenMode, countSave, listFieldIdEdited) =>{
  let dragIndex = -1;
    if (_.isArray(dragFieldId)) {
       dragIndex = fields.findIndex(e => e.fieldId === dragFieldId[0]);
    } else {
      dragIndex = fields.findIndex(e => e.fieldId === dragFieldId);
      const idx = listFieldIdEdited.findIndex( e => e.fieldId === fields[dragIndex].fieldId)
      if (idx < 0) {
        listFieldIdEdited.push(fields[dragIndex].fieldId)
      }
    }
    const dropIndex = fields.findIndex(e => e.fieldId === dropFieldId);
    if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
      return
    }
    if (_.toString(fields[dragIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && _.toString(fields[dropIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB) {
      const fieldDropId = fields[dropIndex].fieldId
      // const tempObject = fields.splice(dragIndex, dragFieldId.length, fields[dropIndex]);
      const tempObject = fields.splice(dragIndex, _.isArray(dragFieldId) ? dragFieldId.length : 1);
      const indexTmp =  dragIndex > dropIndex ? _.findIndex(fields, function(e: any) { return e.fieldId === fieldDropId}) : _.findLastIndex(fields, function(e: any) { return e.fieldId === fieldDropId})
      // fields.splice(indexTmp, 1, ...tempObject);
      fields.splice(indexTmp + 1, 0, ...tempObject);
		} else if ((!fields[dragIndex].inTab && _.toString(fields[dragIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB)
			&& (fields[dropIndex].inTab || _.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB)) { // drag field out Tab into TabArea
      if (fields[dropIndex].inTab) {
        fields.forEach((field, idx) => {
          if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
            const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
            if (index >= 0) {
              let tabData = fields[idx].tabData;
              if (_.isNil(tabData)) {
                tabData = [];
              }
              tabData.push(fields[dragIndex].fieldId);
              fields[idx].tabData = tabData;
              fields[dragIndex].inTab = true;
              reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft, fields, screenMode, countSave)
              // fields[dragIndex].isDoubleColumn = isDoubleColumn;
              // const tempObject = fields.splice(dragIndex, 1)[0];
              // fields.splice(dropIndex + 1, 0, tempObject);
            }
          }
        })
      } else {
        let tabData = fields[dropIndex].tabData;
        if (_.isNil(tabData)) {
          tabData = [];
        }
        tabData.push(fields[dragIndex].fieldId);
        fields[dropIndex].tabData = tabData;
        fields[dragIndex].inTab = true;
        fields[dragIndex].isDoubleColumn = isDoubleColumn;
        if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
          fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
        }
        const tempObject = fields.splice(dragIndex, 1)[0];
        fields.splice(dropIndex + 1, 0, tempObject);
      }
    } else if (fields[dragIndex].inTab && _.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB) {
			let tabData = fields[dropIndex].tabData
			if (_.isNil(tabData)) {
				tabData = []
			}
			let exits = false;
			if (tabData.findIndex(o => o === fields[dragIndex].fieldId) < 0) {
				tabData.push(fields[dragIndex].fieldId)
				fields[dropIndex].tabData = tabData;
        fields[dragIndex].inTab = true;
        fields[dragIndex].isDoubleColumn = isDoubleColumn;
        exits = true;
        if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
          fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
        }
			}
			if (exits) {
				fields.forEach((field, idx) => {
					if (idx !== dropIndex && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB) {
						if (field.tabData && _.isArray(field.tabData)) {
							const temp = field.tabData
							const index = temp.findIndex(o => o === fields[dragIndex].fieldId)
							if (index >= 0) {
								temp.splice(index, 1);
								fields[idx].tabData = temp;
							}
						}
					}
				})
			}

		} else if (fields[dragIndex].inTab && _.toString(fields[dropIndex].fieldType) !== DEFINE_FIELD_TYPE.TAB) { // drag field in Tab to free Area
			fields.forEach((field, i) => {
				if (i !== dropIndex && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB) {
					if (field.tabData && _.isArray(field.tabData)) {
						const temp = field.tabData
						const index = temp.findIndex(o => o === fields[dragIndex].fieldId)
						if (index >= 0) {
							temp.splice(index, 1);
							fields[i].tabData = temp;
						}
					}
				}
      })
      if (!fields[dropIndex].inTab) {
        fields[dragIndex].inTab = false;
      } else {
        fields.forEach((field, idx) => {
          if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
            const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
            if (index >= 0) {
              let tabData = fields[idx].tabData;
              if (_.isNil(tabData)) {
                tabData = [];
              }
              tabData.push(fields[dragIndex].fieldId);
              fields[idx].tabData = tabData;
            }
          }
        })
      }
      reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft, fields, screenMode, countSave)
      // fields[dragIndex].isDoubleColumn = isDoubleColumn;
      // const tempObject = fields.splice(dragIndex, 1)[0];
      // const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropFieldId)
      // fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
    } else if (_.toString(fields[dragIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && _.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB) {
      const fieldTabDrag = _.cloneDeep(fields[dragIndex])
      const fieldTabDrop = _.cloneDeep(fields[dropIndex])
      const fieldsInTabDrag = []
      fields.splice(dragIndex, 1);
      fields.forEach((field, idx) => {
        const index = fieldTabDrag.tabData.findIndex(e => e === field.fieldId)
        if (index >= 0) {
          fieldsInTabDrag.push(field);
          fields.splice(idx, 1)
        }
      })
      const indexDrop = fields.findIndex(e => e.fieldId === fieldTabDrop.fieldId)
      fields.splice(indexDrop + 1, 0, fieldTabDrag)
      if (indexDrop >= 0) {
        const indexPush = fields.findIndex(e => e.fieldId === fieldTabDrag.fieldId)
        fieldsInTabDrag.forEach((fieldInTab, idx) => {
          fields.splice(indexPush + idx, 0, fieldInTab);
        })
      }
    } else {
      reMakeFieldDragDrop(isDoubleColumn, fields[dragIndex], dropIndex, isAddLeft, fields, screenMode, countSave)
    }
}

export const processDeleteFields = (fieldsAfterDelete, fieldInfo, deletedFields) => {
    const fieldOrderMax = fieldsAfterDelete[fieldsAfterDelete.length - 1].fieldOrder;
    fieldsAfterDelete.forEach((item, idx) => {
      if (item.fieldId === fieldInfo.fieldId) {
        if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.TAB && fieldInfo.tabData) {
          fieldInfo.tabData.forEach((fieldId) => {
            const index = fieldsAfterDelete.findIndex(e => e.fieldId === fieldId);
            if (index >= 0) {
              fieldsAfterDelete[index].inTab = false;
              fieldsAfterDelete[index].fieldOrder = fieldOrderMax + 1 + idx;
            }
          })
        }
        if (fieldInfo.fieldType === DEFINE_FIELD_TYPE.LOOKUP && fieldInfo.lookupData || (fieldInfo.lookupData && fieldInfo.lookupData.itemReflect)) {
          fieldInfo.lookupData.itemReflect.forEach( e => {
            const itemIdx = fieldsAfterDelete.findIndex( o => o.fieldId === e.fieldId)
            if (itemIdx >= 0 ) {
              if (e.fieldId > 0) {
                deletedFields.push(e.fieldId);
              }
              fieldsAfterDelete.splice(itemIdx, 1);
            }
          })
        }
        if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.RELATION && fieldInfo.relationData || (fieldInfo.relationData && fieldInfo.relationData.fieldId > 0)) {
          deletedFields.push(fieldInfo.relationData.fieldId);
        }
        if (fieldInfo.fieldId > 0) {
          deletedFields.push(fieldInfo.fieldId);
        }
        const fIdx = fieldsAfterDelete.findIndex( e => e.fieldId === item.fieldId)
        if (fIdx >= 0) {
          fieldsAfterDelete.splice(fIdx, 1);
        }
      }
    })
}

export const processDragNewField = (fields, fieldDrag, dropId, isDoubleColumn: boolean, isAddLeft: boolean, fieldTabRef, screenMode, countSave, fieldsUnavailable?) => {
  if (fieldDrag.fieldId === null) {
    fieldDrag.fieldId = Math.round(Math.random() * 100000 * - 1);
  }
  if (_.isNil(fieldDrag.salesProcess)) {
    Object.assign(fieldDrag, { salesProcess: null });
   }
  fieldDrag.inTab = false;
  const dropIndex = fields.findIndex(e => e.fieldId === dropId);
  if (_.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB && _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB) {
    let tabData = fields[dropIndex].tabData;
    if (!tabData) {
      tabData = []
    }
    tabData.push(fieldDrag.fieldId);
    fields[dropIndex].tabData = tabData;
    fieldDrag.inTab = true;
      if (fieldTabRef && fieldTabRef.current && fieldTabRef.current.resetCurrentTab) {
      fieldTabRef.current.resetCurrentTab(fields[dropIndex].fieldId);
    }
  } else if (fields[dropIndex].inTab && _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB) {
    fields.forEach((field, idx) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB && field.tabData && _.isArray(field.tabData)) {
        const index = field.tabData.findIndex(e => e === fields[dropIndex].fieldId)
        if (index >= 0) {
          const tabData = fields[idx].tabData;
          tabData.push(fieldDrag.fieldId);
          fields[idx].tabData = tabData;
          fieldDrag.inTab = true;
        }
      }
    })
  }
  if (_.toString(fieldDrag.fieldType) === DEFINE_FIELD_TYPE.TAB ||
      (_.toString(fields[dropIndex].fieldType) === DEFINE_FIELD_TYPE.TAB &&
      _.toString(fieldDrag.fieldType) !== DEFINE_FIELD_TYPE.TAB)) {
    fields.splice(dropIndex + 1, 0, fieldDrag);
  } else {
    reMakeFieldDragDrop(isDoubleColumn, fieldDrag, dropIndex, isAddLeft, fields, screenMode, countSave, fieldsUnavailable)
  }
}

export const getMaxItemShowInList = (tabId, arrayItem, tabsInfo) => {
  let max = 0;
  tabsInfo.map((item) => {
    if (item.tabId === tabId) {
      max = item.maxRecord;
    }
  })
  arrayItem = arrayItem.slice(0, max);
  return arrayItem;
}

const userFormatDate = APP_DATE_FORMAT;
const LINK_FIXED = 2;

export const getDynamicData = (field, extensionData, valueData, screenMode, id, handleClickFile) => {
  let dynamicData = null;
  const type = _.toString(field.fieldType);
  if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
    const arrData = [];
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        field.fieldItems.sort((a,b) => {return a.itemOrder - b.itemOrder}).map((item) => {
          if(item.isAvailable) {
            const values = jsonParse(data.value);
            const isArray = Array.isArray(values);
            if (isArray) {
              values.map((value) => {
                if (value.toString() === item.itemId.toString()) {
                  arrData.push(getFieldLabel(item, 'itemLabel'));
                }
              });
              dynamicData = arrData.join(', ');
            } else {
              if (values.toString() === item.itemId.toString()) {
                dynamicData = getFieldLabel(item, 'itemLabel');
              }
            }

          }
        })
      }
    })
  } else if (type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.RADIOBOX) {
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        field.fieldItems.sort((a,b) => {return a.itemOrder - b.itemOrder}).map((item) => {
          if (item.isAvailable && !_.isNil(item.itemId) && data.value === item.itemId.toString()) {
            dynamicData = getFieldLabel(item, 'itemLabel');
          }
        })
      }
    })
  } else if (type === DEFINE_FIELD_TYPE.ADDRESS) {
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        if (!_.isEmpty(data.value)) {
          const dataJson = jsonParse(data.value)['address'];
          if (field.isLinkedGoogleMap) {
            dynamicData = <a target="_blank" rel="noopener noreferrer" href={`http://google.com/maps/search/${dataJson}`}>{translate("dynamic-control.fieldDetail.layoutAddress.lable.postMark")}{dataJson}</a>;
          } else {
            dynamicData = <a>{translate("dynamic-control.fieldDetail.layoutAddress.lable.postMark")}{dataJson}</a>
          }
        }
      }
    })
  } else if (type === DEFINE_FIELD_TYPE.FILE) {
    const isDisplay = screenMode === ScreenMode.DISPLAY;
    let files = [];
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        try {
          files = _.isString(data.value) ? jsonParse(data.value) : data.value;
          if (!files) {
            files = [];
          } else if (!Array.isArray(files)) {
            files = [files];
          }
        } catch (e) {
          files = [];
        }
      }
    });
    return (
      <>
        {files.map((file, idx) => {
          const fileName = file['file_name'] ? file['file_name'] : file['fileName'];
          const filePath = file['file_path'] ? file['file_path'] : file['filePath'];
          const fileUrl = file['file_url'] ? file['file_url'] : file['fileUrl'];
          return (
            <>
              {isDisplay ?
                <a className="file" onClick={evt => handleClickFile(fileName, fileUrl ? fileUrl : filePath)}>{fileName}</a> : fileName
              }
              {idx < files.length - 1 && ', '}
            </>
          )
        })}
      </>
    );
  } else if (type === DEFINE_FIELD_TYPE.CALCULATION) {
    dynamicData =
    !(/^-?\d*\.?\d*$/g.test(calculate(field.configValue, valueData, field.decimalPlace)))
    ? calculate(field.configValue, valueData, field.decimalPlace)
    : autoFormatNumber(calculate(field.configValue, valueData, field.decimalPlace),field.decimalPlace);
  } else if (type === DEFINE_FIELD_TYPE.DATE) {
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        dynamicData = data.value ? formatDate(data.value) : ''
      }
    });
  } else if (type === DEFINE_FIELD_TYPE.DATE_TIME) {
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        dynamicData = data.value ? dateFnsFormat(data.value, userFormatDate + ' ' + APP_TIME_FORMAT) : ''
        dynamicData = utcToTz(dynamicData, DATE_TIME_FORMAT.User)
      }
    });
  } else if (type === DEFINE_FIELD_TYPE.TIME) {
    const DATE_DEFAULT = '2020-01-01 ';
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        dynamicData = data.value ? autoFormatTime(data.value, true) : ''
        if (dynamicData) {
          const defaultValueTmp = _.cloneDeep(dynamicData)
          dynamicData = _.toString(utcToTz(DATE_DEFAULT + defaultValueTmp, DATE_TIME_FORMAT.User)).split(" ")[1];
        }
      }
    });
  } else if (type === DEFINE_FIELD_TYPE.RELATION) {
    const fieldBelong = _.get(field, 'relationData.fieldBelong')
    return (
      extensionData.map((data) => {
        if (data.key === field.fieldName) {
          const values = jsonParse(data.value);
          const isArray = Array.isArray(values);
          if (isArray) {
            return (
              <FieldDetailViewRelation
                id={`${field.fieldId}${_.get(field, 'fieldBelong')}-${values.join('-')}`}
                key={`${field.fieldId}${_.get(field, 'fieldBelong')}-${values.join('-')}`}
                viewInList={false}
                recordIds={values}
                fieldBelong={fieldBelong}
                serviceFieldBelong={_.get(field, 'fieldBelong')}
              />
              // values.map((value, idx) => {
              //   return (
              //   <>
              //   <Link key={+value} to={{pathname: getLinkListModule(fieldBelong), state:{openDetail: true, recordId: +value}}} >{value}</Link>
              //   {idx < values.length - 1 && translate('commonCharacter.comma')}
              //   </>)
              // })
            )
          }
        }
      }))
  } else {
    extensionData.map((data) => {
      if (data.key === field.fieldName) {
        if (type === DEFINE_FIELD_TYPE.LINK) {
          if (field.linkTarget === LINK_TARGET_IFRAME) {
            const urlDisplay = (!_.isNil(field.urlTarget) && (field.urlTarget !== "")) ? field.urlTarget : data.value;
            dynamicData = <><a rel="noopener noreferrer" target="blank" href={urlDisplay}>{field.urlText}</a>
            <iframe src={urlDisplay} height={field.iframeHeight} width="100%"/></>
          } else {
            const target = field.linkTarget === 0 ? "blank" : "";
            if (field.urlType === LINK_FIXED) {
              dynamicData = <a rel="noopener noreferrer" target={target} href={field.urlTarget}>{field.urlText}</a>
            } else {
              let defaultVal = "";
              let defaultLabel = "";
              if (!_.isNil(data.value) && data.value !== '') {
                const jsonValue = jsonParse(data.value, {});
                defaultVal = jsonValue["url_target"] ? jsonValue["url_target"] : "";
                defaultLabel = jsonValue["url_text"] ? jsonValue["url_text"] : "";
              }
              if (defaultVal) {
                dynamicData = <a rel="noopener noreferrer" target={target} href={defaultVal}>{defaultLabel ? defaultLabel : defaultVal}</a>
              }else {
                dynamicData = defaultLabel ? defaultLabel : "";
              }
            }
          }
        } else if (type === DEFINE_FIELD_TYPE.NUMERIC) {
          dynamicData = (field.typeUnit === TYPE_UNIT.symbol ? `${field.currencyUnit} ` : '')
            + autoFormatNumber(data.value, field.decimalPlace)
            + (field.typeUnit === TYPE_UNIT.unit ? ` ${field.currencyUnit}` : '');
        } else if (type === DEFINE_FIELD_TYPE.EMAIL) {
          dynamicData = <a href={`mailto:${data.value}`}>{data.value}</a>
        } else if (type === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
          dynamicData = <FieldDetailViewSelectOrg fieldInfo={field} ogranizationValues={data.value}
                          recordId={id}
                          controlType={screenMode === ScreenMode.DISPLAY ? ControlType.DETAIL_VIEW : ControlType.DETAIL_EDIT}/>;
        } else if (type === DEFINE_FIELD_TYPE.TEXTAREA) {
          dynamicData = <FieldDetailViewTextArea text={data.value} />
        } else {
          dynamicData = data.value;
        }
      }
    })
  }
  return dynamicData;
}

export const getFirstCharacter = (name) => {
  return name ? name.charAt(0) : "";
}
/*
* check copyfield (Mutils -> Single: relation, organization)
**/

const checkCopyField = ((fields, deletedFieldId) => {
  let check = true
  fields.forEach((field) => {
    if (field.copyField) {
      if (field.copyField.from === deletedFieldId) {
        check = false;
      }
    }
  })
  return check
})

/*
* Revert field deleted
**/

export const revertDeletedFields = (deletedField, fieldsAvailable, fieldsUnVailable, fieldsRevert) => {
  const deletedFields = _.cloneDeep(_.uniq(deletedField))
  _.uniq(deletedField).forEach((deleteFieldId) => {
    let isRevert = true;
    isRevert = checkCopyField(_.concat(fieldsAvailable, fieldsUnVailable), deleteFieldId)
    if (isRevert && fieldsRevert) {
      const index = fieldsRevert.findIndex(e => e.fieldId === deleteFieldId)
      if(index >= 0) {
        fieldsRevert[index]['fieldOrder'] = fieldsRevert.length + 1
        if(fieldsRevert[index]['availableFlag'] > 0) {
          fieldsAvailable.push(fieldsRevert[index]);
        } else {
          fieldsUnVailable.push(fieldsRevert[index]);
        }
        const idxDelete = deletedFields.findIndex(e => e === deleteFieldId)
        if (idxDelete >= 0) {
          deletedFields.splice(idxDelete, 1);
        }
      }
    }
  })
  return { deletedFields, fieldsAvailable, fieldsUnVailable, fieldsRevert}
}

export const initialRevertFields = (fieldsAvailable, fieldsUnavailable, fieldsRevert) => {
  // if (fieldsAvailable && fieldsUnavailable && fieldsRevert) {
    _.concat(fieldsAvailable, fieldsUnavailable).forEach((field) => {
      const idx = fieldsRevert.findIndex(e => e.fieldId === field.fieldId)
      if (idx < 0) {
        fieldsRevert.push(field)
      } else if (field.userModifyFlg === true) {
        fieldsRevert[idx] = field;
      }
    })
    return fieldsRevert;
  // }
}

export const detectReachEndScroll = func => event => {
  const node: any = event.target;
  const { scrollHeight, scrollTop, clientHeight } = node;
  if (scrollHeight === scrollTop + clientHeight) {
    func(event);
  }
};

export const filterDataNotNull = (arr:any[]) => {
  try {
    return arr.filter(Boolean)
  } catch (error) {
    return arr
  }
}

export const isFieldDisplayNormal = (field) => {
  if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.TAB) {
    return false;
  }
  return true;
}

export const concatArray = (fields1, fields2, field) => {
    const fields = _.cloneDeep(fields1.sort((a, b) => {return (a.fieldOrder - b.fieldOrder)}));
    fields2.forEach((item) => {
      if (item.fieldId === field.fieldId) {
        field.fieldOrder = fields1.length + 1;
        if (fields.findIndex(e => e.fieldId === field.fieldId) < 0) {
          fields.push(field)
        }
      }
    })
  return fields
}

export const clearStorage = () => {
  Storage.local.remove(AUTH_TOKEN_KEY);
  Storage.local.remove(AUTH_REFRESH_TOKEN_KEY);
  Storage.session.remove(AUTH_TOKEN_KEY);
  Storage.session.remove(AUTH_REFRESH_TOKEN_KEY);
  Storage.session.remove(USER_ICON_PATH);
  if (Storage.session.get(SIGNOUT_SAML_URL)) {
    Storage.session.set(CHECK_RESPONSE_FROM_SAML, true);
  }
}

export const isPathNameLocation = (pathName: string): boolean => {
  try {
    return window.location.pathname.includes(pathName);
  } catch (error) {
    return false
  }
}