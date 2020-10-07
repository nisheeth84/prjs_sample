// import { DEFINE_FIELD_TYPE } from '../layout/dynamic-form/constants';
// import { translateFieldNameSpecial } from './special-item';
// import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import _ from "lodash";
import { messages } from '../search-messages';
import { AdminRights } from '../search-enum';
import { translate } from "../../../config/i18n";

export const getFieldNameElastic = (
  fieldInfo: any,
  fieldNameExtension: string,
  isMultiLanguage?: boolean
) => {
  let translatedFieldName = fieldInfo.fieldName;
  if (
    !translatedFieldName &&
    translatedFieldName.startsWith(fieldNameExtension)
  ) {
    return translatedFieldName;
  }
  if (
    !fieldInfo.isDefault ||
    fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION
  ) {
    translatedFieldName = `${fieldNameExtension}.${translatedFieldName}`;
  } else {
    if (isMultiLanguage) {
      //   const lang = Storage.session.get("locale", "ja_jp");
      //   translatedFieldName = `${translatedFieldName}.${lang}`;
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
  }
  return translatedFieldName;
};

export const getFieldTypeSpecial = (field: any, dataLayout?: any) => {
  const _field = _.cloneDeep(field);
  const fieldName = _field.fieldName;

  if (!!dataLayout) {
    _field.fieldItems =
      field?.fieldItems?.length > 0 ? field?.fieldItems : dataLayout.fieldItems;
  }
  switch (fieldName) {
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
      const adminDataExtension = [];
      adminDataExtension.push({
        isAvailable: true,
        itemId: AdminRights.IS_NOT_ADMIN.toString(),
        itemLabel: translate(messages.nonAdministrativeRights),
        isDefault: null,
        itemOrder: 1,
      })
      adminDataExtension.push({
        isAvailable: true,
        itemId: AdminRights.IS_ADMIN.toString(),
        itemLabel: translate(messages.administrativeRights),
        isDefault: null,
        itemOrder: 2
      })
      _field.fieldItems = adminDataExtension;
      break;
    default:
      break;
  }
  return _field;
};

export const DEFINE_FIELD_TYPE = {
  SINGER_SELECTBOX: "1",
  MULTI_SELECTBOX: "2",
  CHECKBOX: "3",
  RADIOBOX: "4",
  NUMERIC: "5",
  DATE: "6",
  DATE_TIME: "7",
  TIME: "8",
  TEXT: "9",
  TEXTAREA: "10",
  FILE: "11",
  LINK: "12",
  PHONE_NUMBER: "13",
  ADDRESS: "14",
  EMAIL: "15",
  CALCULATION: "16",
  RELATION: "17",
  SELECT_ORGANIZATION: "18",
  LOOKUP: "19",
  TAB: "20",
  TITLE: "21",
  OTHER: "99",
};

export const EMPLOYEE_SPECIAL_LIST_FIELD = {
  employeeDepartments: "employee_departments",
  employeePositions: "employee_positions",
  employeeSurname: "employee_surname",
  employeeSurnameKana: "employee_surname_kana",
  employeeName: "employee_name",
  employeeNameKana: "employee_name_kana",
  employeeManager: "employee_managers",
  employeeIcon: "employee_icon",
  employeeLanguage: "language_id",
  employeeSubordinates: "employee_subordinates",
  employeeTimeZone: "timezone_id",
  employeeTelephoneNumber: "telephone_number",
  employeeEmail: "email",
  employeeCellphoneNumber: "cellphone_number",
  employeeUserId: "user_id",
  employeePackages: "employee_packages",
  employeeAdmin: "is_admin",
};

export const translateFieldNameSpecial = (fieldName: any) => {
  if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname) {
    return EMPLOY_SPECIAL_FILTER_ORDER_BY.EMPLOYEE_FULNAME;
  }
  if (fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana) {
    return EMPLOY_SPECIAL_FILTER_ORDER_BY.EMPLOYEE_FULL_NAME_KANA;
  }
  return fieldName;
};

const EMPLOY_SPECIAL_FILTER_ORDER_BY = {
  EMPLOYEE_FULNAME: "employee_full_name",
  EMPLOYEE_FULL_NAME_KANA: "employee_full_name_kana",
};
