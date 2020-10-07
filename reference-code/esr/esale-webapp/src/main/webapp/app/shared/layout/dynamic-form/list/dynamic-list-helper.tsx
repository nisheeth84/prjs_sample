import React from 'react';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, FieldInfoType, DEFINE_FIELD_NAME_TASK } from '../constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils from 'app/shared/util/string-utils';
import { EMPLOYEE_SPECIAL_LIST_FIELD, TASK_SPECIAL_LIST_FIELD, PRODUCT_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import { translate } from 'react-jhipster';
import { TYPE_MSG_EMPTY, FIELD_BELONG } from 'app/config/constants';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';

export const isColumnFixed = (field: any) => {
  if (_.isArray(field) && field.length > 0) {
    return field.filter(e => e.isColumnFixed).length > 0;
  } else {
    return field.isColumnFixed;
  }
};

export const setColumnFixedAtIndex = (fields: any[], index: number, isFixed: boolean) => {
  if (!fields || fields.length === 0) {
    return;
  }
  if (_.isArray(fields[index])) {
    fields[index].forEach((el, idx) => {
      fields[index][idx].isColumnFixed = isFixed;
    });
  } else {
    fields[index].isColumnFixed = isFixed;
  }
};

export const isColumnCheckbox = (field: any) => {
  if (_.isArray(field) && field.length > 0) {
    return false;
  } else {
    return field.isCheckBox;
  }
};

export const getColumnWidth = (field: any) => {
  let width = 0;
  if (_.isArray(field) && field.length > 0) {
    field.forEach(e => {
      width += e.columnWidth ? e.columnWidth : 200;
    });
  } else if (field.isCheckBox) {
    width = 90;
  } else {
    width = field.columnWidth ? field.columnWidth : 200;
  }
  return width;
};

export const flattenFieldGroup = (fields: any[]) => {
  const tmp = [];
  fields.forEach(field => {
    if (_.isArray(field)) {
      field.forEach(e => {
        tmp.push(e);
      });
    } else {
      tmp.push(field);
    }
  });
  return tmp;
};

export const getColumnsWidth = (fields: any[]) => {
  let width = 0;
  if (!fields || fields.length === 0) {
    return width;
  }
  fields.forEach(field => {
    width += getColumnWidth(field);
  });
  return width;
};

export const findIndexFields = (fields: any[], fieldSearch: any) => {
  if (!fields || fields.length < 1) {
    return -1;
  }
  const fieldIndex = fields.findIndex(field => {
    if (_.isArray(fieldSearch) && _.isArray(field)) {
      return _.isEqual(fieldSearch.map(e => e.fieldId).sort(), field.map(e => e.fieldId).sort());
    } else if (!_.isArray(fieldSearch) && !_.isArray(field)) {
      return _.isEqual(fieldSearch.fieldId, field.fieldId);
    } else {
      return false;
    }
  });
  return fieldIndex;
};

export const findFieldByFieldName = (fields: any[], fieldName: string) => {
  let field;
  for (let i = 0; i < fields.length; i++) {
    if (!_.isArray(fields[i])) {
      if (StringUtils.equalPropertyName(StringUtils.getValuePropStr(fields[i], "fieldName"), fieldName)) {
        field = fields[i];
        break;
      }
    } else {
      for (let j = 0; j < fields[i].length; j++) {
        if (StringUtils.equalPropertyName(StringUtils.getValuePropStr(fields[i][j], "fieldName"), fieldName)) {
          field = fields[i][j];
          break;
        }
      }
    }
    if (field) {
      break;
    }
  }
  return field;
}

export const isSpecialColumn = (field: any , fieldInfoType?, fieldBelong?) => {
  if (_.isNil(field)) {
    return false;
  }
  if (_.isArray(field) || _.isEqual(_.toString(field.fieldType), DEFINE_FIELD_TYPE.OTHER)) {
    return true;
  } else {
    if (
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments ||
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions ||
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments ||
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon ||
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage ||
      field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages ||
      (field.fieldName === TASK_SPECIAL_LIST_FIELD.milestoneName && field.fieldBelong === FIELD_BELONG.TASK) ||
      field.fieldName === TASK_SPECIAL_LIST_FIELD.operatorId ||
      field.fieldName === PRODUCT_SPECIAL_LIST_FIELD.productName ||
      field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME ||
      (field.fieldBelong === FIELD_BELONG.CUSTOMER && (field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_DATE ||
        field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_DATE)) ||
      field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO ||
      field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions ||
      field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress ||
      field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath ||
      field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate ||
      field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate ||
      (field.fieldName === DEFINE_FIELD_NAME_TASK.FINISH_DATE
        && fieldBelong === FIELD_BELONG.TASK
        && fieldInfoType === FieldInfoType.Tab)
    ) {
      return true;
    }
  }
  return false;
};

export const getValueByFieldName = (record: any, fieldName: string, fieldNameExtension: string) => {
  if (_.has(record, _.camelCase(fieldName)) || _.has(record, _.snakeCase(fieldName))) {
    return getValueProp(record, fieldName);
  } else if (_.has(record, _.camelCase(fieldNameExtension)) || _.has(record, _.snakeCase(fieldNameExtension))) {
    const extData = getValueProp(record, fieldNameExtension);
    if (extData) {
      if (_.isArray(extData)) {
        let fValue = null;
        extData.forEach(e => {
          if (StringUtils.equalPropertyName(e['key'], fieldName)) {
            fValue = e['value'];
          }
        });
        return fValue;
      } else {
        return getValueProp(extData, fieldName);
      }
    }
  }
  return null;
};

export const parseRelationIds = (relationIds: any) => {
  const ids = [];
  if (!relationIds) {
    return ids;
  }
  if (_.isString(relationIds)) {
    try {
      const tmp = JSON.parse(relationIds);
      if (_.isArray(tmp)) {
        tmp.forEach(e => {
          if (_.isNumber(e)) {
            ids.push(e);
          } else if (_.isNumber(_.get(e, 'value'))) {
            ids.push(_.get(e, 'value'));
          }
        });
      }
    } catch {
      ids.push(...relationIds.split(/(?:,|;)+/));
    }
  } else if (_.isArray(relationIds)) {
    ids.push(...relationIds);
  }
  return ids.map(x => +x);
};

export const getRecordIdsRelation = (fields: any[], records: any[], fieldNameExtension: string) => {
  const recordIds = [];
  if (!fields || fields.length < 1 || !records || records.length < 1) {
    return recordIds;
  }
  for (let i = 0; i < fields.length; i++) {
    if (!_.isEqual(_.toString(fields[i].fieldType), DEFINE_FIELD_TYPE.RELATION)) {
      continue;
    }
    if (!fields[i].relationData || !fields[i].relationData.fieldBelong) {
      continue;
    }
    const belong = fields[i].relationData.fieldBelong;
    if (recordIds.findIndex(e => e.fieldBelong === belong) < 0) {
      recordIds.push({ fieldBelong: belong, ids: [], fields: [] });
    }
    if (fields[i].relationData.displayFieldId) {
      const recIndex = recordIds.findIndex(e => e.fieldBelong === belong);
      if (recIndex >= 0) {
        if (recordIds[recIndex].fields.findIndex(e => e === fields[i].relationData.displayFieldId) < 0) {
          recordIds[recIndex].fields.push(fields[i].relationData.displayFieldId);
        }
      }
    }
    for (let j = 0; j < records.length; j++) {
      const relationIds = getValueByFieldName(records[j], fields[i].fieldName, fieldNameExtension);
      const ids = parseRelationIds(relationIds);
      ids.forEach(id => {
        const idx = recordIds.findIndex(e => e.fieldBelong === belong);
        if (recordIds[idx].ids.findIndex(o => o === id) < 0) {
          recordIds[idx].ids.push(id);
        }
      });
    }
  }
  return recordIds;
};

const renderMsgEmpty = (serviceStr, typeMsgEmpty) => {
  let msg = translate('messages.INF_COM_0020', { 0: serviceStr })
  if (typeMsgEmpty === TYPE_MSG_EMPTY.SEARCH || typeMsgEmpty === TYPE_MSG_EMPTY.FILTER) {
    msg = translate('messages.INF_COM_0019', { 0: serviceStr })
  }
  return (
    <div>{msg}</div>
  )
};

export const renderContentEmpty = (belong, typeMsgEmpty, widthTableParent) => {
  let src = '../../../content/images/Group 16.svg';
  let serviceStr = ''
  switch (belong) {
    case FIELD_BELONG.EMPLOYEE:
      src = '../../../content/images/ic-sidebar-employee.svg';
      serviceStr = translate('common.employees');
      break;
    case FIELD_BELONG.PRODUCT:
      src = '../../../content/images/ic-sidebar-product.svg';
      serviceStr = translate('common.products');
      break;
    case FIELD_BELONG.MILE_STONE:
      src = '../../../content/images/task/ic-flag-brown.svg';
      serviceStr = translate('common.milestone');
      break;
    case FIELD_BELONG.PRODUCT_TRADING:
      src = '../../../content/images/ic-sidebar-sales.svg';
      serviceStr = translate('common.product-trading');
      break;
    case FIELD_BELONG.TASK:
      src = '../../../content/images/task/ic-time1.svg';
      serviceStr = translate('common.tasks');
      break;
    case FIELD_BELONG.CUSTOMER:
      src = '../../../content/images/ic-sidebar-customer.svg';
      serviceStr = translate('common.customer');
      break;
    case FIELD_BELONG.BUSINESS_CARD:
      src = '../../../content/images/ic-sidebar-business-card.svg';
      serviceStr = translate('common.business-card');
      break;
    default:
      break;
  }
  return (
    <div className="list-table pt-2 images-group-middle position-absolute h-100" style={{ width: widthTableParent }}>
      <div className="position-relative h-100" >
        <div className="align-center images-group-content" >
          <img className="images-group-16" src={src} alt="" />
          {renderMsgEmpty(serviceStr, typeMsgEmpty)}
        </div>
      </div>
    </div>
  )
};