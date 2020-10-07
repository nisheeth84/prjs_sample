import _ from "lodash";
import moment from "moment";
import { APP_DATE_FORMAT_ES, DEFAULT_TIMEZONE, FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from "../../../../../../config/constants/constants";
import { DefineFieldType, KeySearch } from "../../../../../../config/constants/enum";
import { translate } from "../../../../../../config/i18n";
import { Field } from "../../../../../../modules/employees/employees-repository";
import { DATE_TIME_FORMAT, timeUtcToTz, utcToTz } from "../../../../../util/date-utils";
import StringUtils from "../../../../../util/string-utils";
import { messages } from './relation-suggest-messages';
import { calculate } from "../../../../../util/calculation-utils";
import { getSelectedOrganizationInfo } from "../../../../suggestions/repository/employee-suggest-repositoty";
/**
 * Define milestone suggest view
 */
export interface IRelationProps {
  nameValue: any,
  fieldInfoItem: any,
  relationFieldInfo: Field,
  formatDate: string,
  languageCode: string,
  timezoneName: string,
  fields?:any
}

const convertValueCheckboxPulldownMuti = (props: IRelationProps) => {
  let content = TEXT_EMPTY;
  let defaultValue = null;
  let valueConvert = props.nameValue;
  try {
    defaultValue = _.isString(props.nameValue) ? JSON.parse(props.nameValue) : props.nameValue;
    if (!_.isArray(defaultValue)) {
      defaultValue = [defaultValue];
    }
  } catch {
    defaultValue = [];
  }
  defaultValue.forEach((item: any) => {
    const fieldLabel = `${StringUtils.getFieldLabel(props.fieldInfoItem.fieldItems.find((i: any) => i.itemId == item), ITEM_LABEL, props.languageCode)}`;
    if (content === TEXT_EMPTY) {
      content = `${content}${fieldLabel}`;
    } else {
      content = `${content}, ${fieldLabel}`;
    }
  });
  if (content === TEXT_EMPTY) {
    valueConvert = `${StringUtils.getFieldLabel(props.fieldInfoItem, FIELD_LABLE, props.languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
  } else {
    valueConvert = content
  }
  return valueConvert;
}

export const convertValueRelation = async (props: IRelationProps) => {
  let valueConvert = props.nameValue;
  if (props.fieldInfoItem) {
    const fieldType = props.fieldInfoItem?.fieldType?.toString();
    switch (fieldType) {
      case DefineFieldType.SINGER_SELECTBOX:
        valueConvert = `${StringUtils.getFieldLabel(props.fieldInfoItem.fieldItems.find((i: any) => i.itemId == valueConvert), ITEM_LABEL, props.languageCode)}`;
        break;
      case DefineFieldType.MULTI_SELECTBOX:
        valueConvert = convertValueCheckboxPulldownMuti(props)
        break;
      case DefineFieldType.CHECKBOX:
        valueConvert = convertValueCheckboxPulldownMuti(props)
        break;
      case DefineFieldType.RADIOBOX:
        valueConvert = `${StringUtils.getFieldLabel(props.fieldInfoItem.fieldItems.find((i: any) => i.itemId == valueConvert), ITEM_LABEL, props.languageCode)}`;
        break;
      case DefineFieldType.NUMERIC:
        break;
      case DefineFieldType.DATE:
        const newDate = moment(valueConvert, APP_DATE_FORMAT_ES);
        if (newDate.isValid()) {
          valueConvert = newDate.format(props.formatDate.toUpperCase());
        }
        break;
      case DefineFieldType.DATE_TIME:
        valueConvert = utcToTz(valueConvert, props.timezoneName ?? DEFAULT_TIMEZONE, props.formatDate, DATE_TIME_FORMAT.User);
        break;
      case DefineFieldType.TIME:
        valueConvert = timeUtcToTz(valueConvert, props.timezoneName ?? DEFAULT_TIMEZONE, props.formatDate);
        break;
      case DefineFieldType.TEXT:
        break;
      case DefineFieldType.TEXTAREA:
        break;
      case DefineFieldType.FILE:
        break;
      case DefineFieldType.PHONE_NUMBER:
        break;
      case DefineFieldType.ADDRESS:
        const objectAddress = JSON.parse(valueConvert);
        valueConvert = `${translate(messages.common_119908_15_relation_unitAddress)} ${objectAddress.zip_code ?? TEXT_EMPTY} ${objectAddress.address_name ?? TEXT_EMPTY} ${objectAddress.building_name ?? TEXT_EMPTY}`;
        break;
      case DefineFieldType.EMAIL:
        break;
      case DefineFieldType.SELECT_ORGANIZATION:
        const dataView = await handleGetData(valueConvert);
        if (dataView) {
          let datalist = "";
          for (let index = 0; index < dataView.length; index++) {
            const item = dataView[index];
            if (index !== dataView.length - 1 && item.itemName !== TEXT_EMPTY) {
              datalist += `${item.itemName}, `
            } else {
              datalist += `${item.itemName}`
            }
          }
          if (datalist === TEXT_EMPTY) {
            valueConvert = `${StringUtils.getFieldLabel(props.fieldInfoItem, FIELD_LABLE, props.languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
          } else {
            valueConvert = datalist;
          }
        }
        break;
      case DefineFieldType.CALCULATION:
        valueConvert = calculate(props.fieldInfoItem.configValue,props.fields, props.fieldInfoItem?.decimalPlace);
        break;
      default:
        break;
    }
  }
  return valueConvert;
}

  /**
   * get data to show detail
   */
  const handleGetData = async (valueArr: any) => {
    const dataArr: any[] = []
    const value: any = {
      departmentId: [],
      groupId: [],
      employeeId: []
    }
    JSON.parse(valueArr).forEach((item: any) => {
      if (item.department_id) {
        value.departmentId.push(item.department_id)
      }
      if (item.group_id) {
        value.groupId.push(item.group_id)
      }
      if (item.employee_id) {
        value.employeeId.push(item.employee_id)
      }
    })
    const response = await getSelectedOrganizationInfo(value);
    if (response) {
      if (response.status === 200) {
        if (response.data) {
          const listEmployeeId: any[] = []
          setEmployee(response.data.employee, listEmployeeId, dataArr)
        }
      } else {
        // TODO: set error message
      }
    } else {
      // TODO: set error message
    }
    return dataArr
  }

  /**
   * set data employee to show
   * @param data data from response
   * @param listEmployeeId list exist employee id
   * @param dataArr data array to show
   */
  const setEmployee = (data: any[], listEmployeeId: any[], dataArr: any[]) => {
    data?.forEach((item: any) => {
      if (!listEmployeeId.includes(item.employeeId)) {
        listEmployeeId.push(item.employeeId)
        dataArr.push({
          itemId: `${item.employeeId}`,
          itemName: `${item.employeeSurname ?? TEXT_EMPTY} ${item.employeeName ?? TEXT_EMPTY}`,
          itemType: KeySearch.EMPLOYEE,
          isLink: true
        })
      }
    })
  }