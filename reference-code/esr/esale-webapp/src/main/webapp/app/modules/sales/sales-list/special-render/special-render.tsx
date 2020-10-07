import _ from 'lodash';
import { SALES_SPECIAL_LIST_FIELD, EMPLOYEE_ADMIN } from '../../constants';
import { getFieldLabel, getColorImage } from 'app/shared/util/string-utils';
import React from 'react';
import Popover from 'app/shared/layout/common/Popover';
import { getJsonBName } from '../../utils';
import { DATE_TIME_FORMAT, utcToTz } from 'app/shared/util/date-utils';
import { ScreenMode } from 'app/config/constants';
import EmployeeName from 'app/shared/layout/common/EmployeeName';

export const customHeaderField = (field, mode) => {
  if (_.isArray(field)) {
    let textHeader = '';
    field.forEach(element => {
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeSurname) {
        textHeader += ' ' + getFieldLabel(element, 'fieldLabel');
      }
    });
    field.forEach(element => {
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeSurnameKana) {
        textHeader += ' ' + getFieldLabel(element, 'fieldLabel');
      }
    });
    return (
      <Popover x={-20} y={25}>
        {textHeader}
      </Popover>
    );
  } else if (field.fieldName ===  SALES_SPECIAL_LIST_FIELD.customerId) {
    return (
      <div style={mode === ScreenMode.EDIT ? {width: 200} : {width: field.columnWidth? field.columnWidth : 200}} >
        <Popover x={-20} y={25}>
          {getFieldLabel(field, 'fieldLabel')}
        </Popover>
      </div>
    )
  }
};

const getContentData = (fieldName, rowData) => {
  if (rowData[fieldName]) {
    if (fieldName.endsWith('date')) {
      return utcToTz(rowData[fieldName], DATE_TIME_FORMAT.User);
    } else {
      return rowData[fieldName];
    }
  } else {
    return '';
  }
}

export const customFieldsInfo = (field, type, employeeLayoutPersonal) => {
  return field;
};

export const specialDisplayMultiLine = (fieldColumn, rowData, onOpenPopupCustomerDetail) => {
    if(SALES_SPECIAL_LIST_FIELD.productTradingProgressId)
      return (
        <Popover x={-20} y={25}>
          <span className="d-inline-block text-ellipsis">{`${getFieldLabel(rowData, 'progress_name')}`}</span>
        </Popover>
      );
    else
      return (
        <Popover x={-20} y={25}>
          <span className="d-inline-block text-ellipsis">{`${getContentData(fieldColumn.fieldName, rowData)}`}</span>
        </Popover>
      );
  
};

export const renderSpecialItemNotEdit = (fieldColumn, rowData, onOpenPopupDetail, mode) => {
  if (fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.customerId) {
    return (
      <div className={"overflow-menu margin-left-4 pr-0 auto"}>
        <a className={"d-inline-block text-ellipsis" + (mode === ScreenMode.EDIT? " width-210":"")} onClick={() => onOpenPopupDetail(rowData.customer_id)}>
          <Popover x={-20} y={25}>
            {`${rowData.customer_name ? rowData.customer_name : ''}`}
          </Popover>
        </a>
      </div>
    );
  } else if (_.includes([SALES_SPECIAL_LIST_FIELD.employeeId, SALES_SPECIAL_LIST_FIELD.createdUser, SALES_SPECIAL_LIST_FIELD.updatedUser], fieldColumn.fieldName)) {
    const fieldName = fieldColumn.fieldName === SALES_SPECIAL_LIST_FIELD.employeeId ? 'employee' : fieldColumn.fieldName;
    if (!rowData[fieldName]) {
      return <></>
    }
    return (
        <EmployeeName 
        userName={`${rowData[fieldName].employeeSurname} ${rowData[fieldName].employeeName}`}
        userImage={rowData[fieldName]['photoFilePath']}
        employeeId={rowData[fieldName].employeeId}
        sizeAvatar={30}
        backdrop={true}
        width={fieldColumn.columnWidth? fieldColumn.columnWidth : 200}
      ></EmployeeName> 
    );
  }
  return <></>
};
