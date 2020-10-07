import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import { CUSTOMIZE_FIELD_NAME } from '../layout/dynamic-form/constants';
import { FIELD_BELONG } from 'app/config/constants';
import { convertSpecialFieldEmployee } from 'app/modules/employees/list/special-render/special-render';
import _ from 'lodash';
import { convertSpecialFieldCustomer } from 'app/modules/customers/list/special-render/special-render';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';

const EMPLOY_SPECIAL_FILTER_ORDER_BY = {
  EMPLOYEE_FULNAME: 'employee_full_name',
  EMPLOYEE_FULL_NAME_KANA: 'employee_full_name_kana'
};

export const convertSpecialItemFilter = fieldInfo => {
  let data = null;
  fieldInfo.map(item => {
    if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname) {
      data = item;
      return;
    }
    if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana) {
      data = item;
      return;
    }
  });
  return data;
};

export const convertSpecialField = (fields, layoutData, fieldBelong) => {
  if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
    return convertSpecialFieldEmployee(fields, layoutData);
  }
  if (fieldBelong === FIELD_BELONG.CUSTOMER) {
    return convertSpecialFieldCustomer(fields, layoutData);
  }
  return fields;
};

export const translateFieldNameSpecial = fieldName => {
  if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname) {
    return EMPLOY_SPECIAL_FILTER_ORDER_BY.EMPLOYEE_FULNAME;
  }
  if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana) {
    return EMPLOY_SPECIAL_FILTER_ORDER_BY.EMPLOYEE_FULL_NAME_KANA;
  }
  return fieldName;
};

/**
 * Get fieldName for list sort/filter conditions
 * @param name
 */
export const getFieldName = name => {
  let str = name;
  if (str.includes('.') > 0) {
    const tmp = str.split('.');

    // Get fieldName in customize field (jsonb) of service, ex: employee, customer
    if (CUSTOMIZE_FIELD_NAME.includes(tmp[0].toLowerCase())) {
      str = tmp[1];
    } else {
      str = tmp[0];
    }
  }
  if (str.indexOf('full_name') !== -1) {
    str = str.replace('full_name', 'surname');
  }
  return str;
};
