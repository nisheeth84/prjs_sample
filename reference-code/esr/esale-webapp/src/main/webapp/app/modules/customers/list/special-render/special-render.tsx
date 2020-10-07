import _ from 'lodash';
import { ControlType } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { CUSTOMER_SPECIAL_LIST_FIELD } from '../../constants';
import { getFieldLabel, getColorImage } from 'app/shared/util/string-utils';
import Popover from 'app/shared/layout/common/Popover';
import React from 'react';
import * as R from 'ramda';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { translate } from 'react-jhipster';
import SpecialDisplayTooltip from './special-display-tooltip';

export const customHeaderField = (field) => {
  if (_.isArray(field)) {
    let textHeader = '';
    field.forEach(element => {
      if (element.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        textHeader = getFieldLabel(element, 'fieldLabel');
      }
    })
    return <Popover x={-20} y={25}>{textHeader}</Popover>;
  }
}


const SPACE_CHARACTER = '　　';

const getSpaceByLevel = (level, type?) => {
  if (!level || level === 0 || !type) {
    return '';
  } else if (type === ControlType.FILTER_LIST) {
    let result = '';
    while (level > 0) {
      result += SPACE_CHARACTER;
      level--;
    }
    return result;
  }
};

const tranferCurrentData = (fieldItemCurrent, parentId, level?, type?) => {
  const result = {};
  result['itemId'] = fieldItemCurrent.itemId;
  result['isAvailable'] = fieldItemCurrent.isAvailable;
  result['itemOrder'] = fieldItemCurrent.itemOrder;
  result['isDefault'] = null;
  result['itemLabel'] = getSpaceByLevel(level, type) + fieldItemCurrent.itemLabel;
  result['updatedDate'] = fieldItemCurrent.updatedDate;
  result['itemParentId'] = parentId;
  return result;
};

const getArrayFromTree = (treeFieldsItem, parentId, level, type?) => {
  let resultArray = [];
  treeFieldsItem &&
    treeFieldsItem.map(fieldItemCurrent => {
      const result = tranferCurrentData(fieldItemCurrent, parentId, level, type);
      resultArray.push(result);
      if (fieldItemCurrent.fieldItemChilds && fieldItemCurrent.fieldItemChilds.length > 0) {
        const resultChildArray = getArrayFromTree(fieldItemCurrent.fieldItemChilds, fieldItemCurrent.itemParentId, level + 1, type);
        resultArray = [...resultArray, ...resultChildArray];
      }
    });
  return resultArray;
};

const convertBusinessListFieldsItem = (listFieldsItem, type?) => {
  const data = [...getArrayFromTree(listFieldsItem, null, 0, type)];
  return data;
};

export const getExtensionsCustomer = (customerLayout, type?) => {
  const extensionsData = {};
  if (!customerLayout) {
    return extensionsData;
  }
  let business = [];
  let businessSub = [];
  const displayChildCustomers = [];
  displayChildCustomers.push({
    isAvailable: true,
    itemId: 1,
    itemLabel: translate(`customers.is-display-child-customers`),
    isDefault: null,
    itemOrder: 1
  })
  if (customerLayout && Array.isArray(customerLayout) && customerLayout.length > 0) {
    customerLayout.forEach(item => {
      if (item.fieldName === 'business_main_id') {
        business = convertBusinessListFieldsItem(item.listFieldsItem, type);
      }
      if (item.fieldName === 'business_sub_id') {
        businessSub = item.listFieldsItem;
      }
    });

    extensionsData['business_main_id'] = business;
    extensionsData['business_sub_id'] = businessSub;
    extensionsData['is_display_child_customers'] = displayChildCustomers;
  }

  return extensionsData;
};

export const convertSpecialFieldCustomer = (listFields, layoutData) => {
  const _fields = _.cloneDeep(listFields);
  const extensionsData = getExtensionsCustomer(layoutData);
  _fields.map(item => {
    if(item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS) {
      item.fieldItems = extensionsData[CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID]
    }
    item.fieldItems = _.cloneDeep(item.fieldItems && item.fieldItems.length > 0 ? item.fieldItems : extensionsData[item.fieldName]);
    switch (item.fieldName) {
      case CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID:
      case CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS:
        item.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
        break;
      case CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT:
      case CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT:
      case CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER:
      case CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER:
      case CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT:
        item.fieldType = DEFINE_FIELD_TYPE.TEXT;
        break;
      case CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO:
      case CUSTOMER_SPECIAL_LIST_FIELD.SCENARIO:
      case CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID:
        item.disableDisplaySearch = true;
        break;
      case CUSTOMER_SPECIAL_LIST_FIELD.LAST_CONTACT_DATE:
        item.fieldType = DEFINE_FIELD_TYPE.DATE;
        break;
      default:
        break;
    }
  });
  return _fields;
};

export const convertSpecialItemFilter = (fieldInfo, customerLayout, type?) => {
  let data = null;
  const extensionsData = getExtensionsCustomer(customerLayout, type);
  fieldInfo.map(item => {
    item.fieldItems = _.cloneDeep(item.fieldItems && item.fieldItems.length > 0 ? item.fieldItems : extensionsData[item.fieldName]);
    if (item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
      data = item;
      data.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX
      return;
    }
  });
  return data;
};

export const customFieldsInfo = (field, type, customerLayout) => {
  const fieldCustom = _.cloneDeep(field);
  const extensionsData = getExtensionsCustomer(customerLayout);
  fieldCustom.fieldItems = extensionsData[field.fieldName];

  switch (type) {
    case ControlType.VIEW:
      {
        if (field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.PERSON_IN_CHARGE) {
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.TEXT;
        }
      }
      break;
    case ControlType.FILTER_LIST:
    case ControlType.SEARCH:
      {
        // business_main_id and business_sub_id
        if (_.isArray(fieldCustom)) {
          return convertSpecialItemFilter(fieldCustom, customerLayout, type);
        }
        if (
          field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT ||
          field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT ||
          field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER ||
          field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER ||
          field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT
        ) {
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.TEXT;
          return fieldCustom;
        }
        if (field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS) {
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.CHECKBOX;
          return fieldCustom;
        }
        if (field.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.LAST_CONTACT_DATE) {
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.DATE;
          return fieldCustom;
        }
      }
      break;
    default:
      break;
  }
  return field;
};

export const renderItemNotEdit = (fieldColumn, rowData, tenant, onOpenPopupDetail, idDetail?: any) => {
  if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT) {
    return <div className="text-ellipsis text-over">
      <Popover x={-20} y={25}>
        {/* // TODO: go to detail next schedule. */}
        {R.path(['next_schedules'], rowData) &&
          <a key={R.path(['next_schedules', 0, 'schedulesId'], rowData)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenPopupDetail(rowData.next_schedules[0].schedulesId, fieldColumn.fieldId, fieldColumn.fieldName)}
            >
            {R.path(['next_schedules', 0, 'schedulesName'], rowData)}
          </a>
        }
      </Popover>
      {R.path(['next_schedules'], rowData) && R.path(['next_schedules'], rowData).length > 1 &&
        <SpecialDisplayTooltip
          rowData={rowData}
          tenant={tenant}
          fieldColumn={fieldColumn}
          fieldName = {CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT}
          openPopupDetail={onOpenPopupDetail}
      />}

    </div>;
  }

  if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT) {
    return <div className="text-ellipsis text-over">
      <Popover x={-20} y={25}>
        {/* // TODO: go to detail next schedule. */}
        {R.path(['next_actions'], rowData) &&
          <a key={R.path(['next_actions', 0, 'taskId'], rowData)}
            onClick={() => onOpenPopupDetail(rowData.next_actions[0].taskId, fieldColumn.fieldId, fieldColumn.fieldName)}
            rel="noopener noreferrer"
          >
            {R.path(['next_actions', 0, 'taskName'], rowData)}
          </a>
        }
      </Popover>
      {R.path(['next_actions'], rowData) && R.path(['next_actions'], rowData).length > 1 &&
        <SpecialDisplayTooltip
          rowData={rowData}
          tenant={tenant}
          fieldColumn={fieldColumn}
          fieldName = {CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT}
          openPopupDetail={onOpenPopupDetail}
      />}
    </div>;
  }

  if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER) {
    const photoPathEmployee = R.path(['created_user', 'employeePhoto'], rowData);
    const charEmploy = R.path(['created_user', 'employeeName'], rowData) ? R.path(['created_user', 'employeeName'], rowData).charAt(0) : '';
    return <div className="text-ellipsis over-unset relative org-view text-over">
      {photoPathEmployee ? <a className="avatar"><img src={photoPathEmployee} /></a> : <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>}
      {/* // TODO: go to detail user. */}
      {R.path(['created_user'], rowData) &&
        <a className={`d-inline-block text-ellipsis max-calc66 ${idDetail && R.path(['created_user', 'employeeId'], rowData) === idDetail ? 'pointer-none' : ''}`} key={R.path(['created_user', 'employeeId'], rowData)}
          onClick={() => onOpenPopupDetail(rowData.created_user.employeeId, fieldColumn.fieldId, fieldColumn.fieldName)}>
          <Popover x={-20} y={25}>
            <span className={`${idDetail && R.path(['created_user', 'employeeId'], rowData) === idDetail ? 'color-000' : ''}`}>{R.path(['created_user', 'employeeName'], rowData)}</span>
          </Popover>
        </a>
      }
    </div>;
  }

  if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER) {
    const photoPathEmployee = R.path(['updated_user', 'employeePhoto'], rowData);
    const charEmploy = R.path(['updated_user', 'employeeName'], rowData) ? R.path(['updated_user', 'employeeName'], rowData).charAt(0) : '';
    return <div className="text-ellipsis over-unset relative org-view text-over">
      {photoPathEmployee ? <a className="avatar"><img src={photoPathEmployee} /></a> : <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>}

      {/* // TODO: go to detail user. */}
      {R.path(['updated_user'], rowData) &&
        <a className={`d-inline-block text-ellipsis max-calc66 ${idDetail && R.path(['updated_user', 'employeeId'], rowData) === idDetail ? 'pointer-none' : ''}`} key={R.path(['updated_user', 'employeeId'], rowData)}
          onClick={() => onOpenPopupDetail(rowData.updated_user.employeeId, fieldColumn.fieldId, fieldColumn.fieldName)}>
          <Popover x={-20} y={25}>
            <span className={`${idDetail && R.path(['updated_user', 'employeeId'], rowData) === idDetail ? 'color-000' : ''}`}>{R.path(['updated_user', 'employeeName'], rowData)}</span>
          </Popover>
        </a>
      }
    </div>;
  }

  // updated_date + created_date
  if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_DATE || fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_DATE) {
    const dateDisplay = utcToTz(rowData[fieldColumn.fieldName], DATE_TIME_FORMAT.User);
    return <div className="text-over text-ellipsis"><Popover x={-20} y={25}>{dateDisplay}</Popover></div>;
  }
}