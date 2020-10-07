import { DEFINE_FIELD_TYPE } from '../layout/dynamic-form/constants';
import { Storage } from 'react-jhipster';
import { translateFieldNameSpecial } from './special-item';
import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import _ from 'lodash';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';

export const getFieldNameElastic = (
  fieldInfo: any,
  fieldNameExtension: string,
  isMultiLanguage?: boolean
) => {
  let translatedFieldName = fieldInfo.fieldName;
  if (!translatedFieldName && translatedFieldName.startsWith(fieldNameExtension)) {
    return translatedFieldName;
  }
  if (_.isNil(fieldNameExtension)) {
    return translatedFieldName;
  }
  if (
    !fieldInfo.isDefault ||
    fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION
  ) {
    translatedFieldName = `${fieldNameExtension}.${translatedFieldName}`;
  } else {
    if (isMultiLanguage) {
      const lang = Storage.session.get('locale', 'ja_jp');
      translatedFieldName = `${translatedFieldName}.${lang}`;
    }
    if (
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.FILE
    ) {
      // TODO: wait elactic search for employee_fulname
      translatedFieldName = translateFieldNameSpecial(translatedFieldName);
      translatedFieldName = `${translatedFieldName}.keyword`;
    }
    if (
      translatedFieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager ||
      translatedFieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates
    ) {
      translatedFieldName = `${translatedFieldName}.keyword`;
    }
    // for customer
    if (translatedFieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
      translatedFieldName = CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS;
    }
  }
  return translatedFieldName;
};

export const getFieldTypeSpecial = field => {
  const _field = _.cloneDeep(field);
  switch (_field.fieldName) {
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions:
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments:
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage:
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone:
      _field.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
      break;
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages:
      _field.fieldType = DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
      break;
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager:
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates:
      _field.fieldType = DEFINE_FIELD_TYPE.TEXT;
      break;
    case EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin:
      _field.fieldType = DEFINE_FIELD_TYPE.RADIOBOX;
      break;
    default:
      break;
  }
  return _field;
};
