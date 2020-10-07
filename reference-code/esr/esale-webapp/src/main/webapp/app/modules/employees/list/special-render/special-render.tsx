import _ from 'lodash';
import { EMPLOYEE_SPECIAL_LIST_FIELD, EMPLOYEE_ADMIN } from '../../constants';
import { getFieldLabel } from 'app/shared/util/string-utils';
import React from 'react';
import { DEFINE_FIELD_TYPE, SPECICAL_FIELD_LABLE_CONVERT } from 'app/shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
import { convertSpecialItemFilter } from 'app/shared/util/special-item';
import { ControlType, ScreenMode } from 'app/config/constants';
import ReactHtmlParser from 'react-html-parser';
import { Storage } from 'react-jhipster';
import Popover from 'app/shared/layout/common/Popover';

export const customHeaderField = (field) => {
  if (_.isArray(field)) {
    let textHeader = '';
    field.forEach(element => {
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname) {
        const _element = _.cloneDeep(element);
        _element.fieldLabel = SPECICAL_FIELD_LABLE_CONVERT[element.fieldName]
        textHeader += '   ' + getFieldLabel(_element, 'fieldLabel');
      }
    })
    field.forEach(element => {
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana) {
        const _element = _.cloneDeep(element);
        _element.fieldLabel = SPECICAL_FIELD_LABLE_CONVERT[element.fieldName]
        textHeader += '   ' + getFieldLabel(_element, 'fieldLabel');
      }
    })
    return <Popover x={-20} y={25}>{textHeader}</Popover>;
  }
}

export const getPathTreeName = (str) => {
  const trimStr = str.replace(/\\|"|{|}/g, '');
  const oStr = trimStr.lastIndexOf(',');
  const str1 = trimStr.substr(0, oStr);
  const str2 = trimStr.substr(oStr + 1, trimStr.length);
  if (!str1) {
    return str2.trim();
  }
  return str2.trim() + ' (' + str1.replace(/,/g, ' - ') + ')';
}

export const getExtensionsEmployees = (employeeLayout) => {
  const extensionsData = {};
  if (!employeeLayout) {
    return extensionsData;
  }
  const languages = [];
  const deparments = [];
  const positions = [];
  const packages = [];
  const adminDataExtension = [];
  adminDataExtension.push({
    isAvailable: true,
    itemId: EMPLOYEE_ADMIN.IS_NOT_ADMIN.toString(),
    itemLabel: translate(`employees.isAdmin[${0}]`),
    isDefault: null,
    itemOrder: 1,
  })
  adminDataExtension.push({
    isAvailable: true,
    itemId: EMPLOYEE_ADMIN.IS_ADMIN.toString(),
    itemLabel: translate(`employees.isAdmin[${1}]`),
    isDefault: null,
    itemOrder: 2
  })
  if (employeeLayout && Array.isArray(employeeLayout) && employeeLayout.length > 0) {
    employeeLayout.forEach((item) => {
      if (item.fieldName === 'language_id') {
        item.fieldItems.forEach((element, idx) => {
          languages.push({
            isAvailable: true,
            itemId: element.itemId,
            itemLabel: element.itemLabel,
            isDefault: element.isDefault,
            itemOrder: element.itemOrder,
            updatedDate: element.updatedDate,
          });
        });
      }
      if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
        item.fieldItems.forEach((element, idx) => {
          deparments.push({
            isAvailable: true,
            itemId: element.itemId,
            itemLabel: element.itemLabel,
            isDefault: element.isDefault,
            itemOrder: element.itemOrder,
            updatedDate: element.updatedDate,
          });
        });
      }
      if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
        item.fieldItems.forEach((element, idx) => {
          positions.push({
            isAvailable: true,
            itemId: element.itemId,
            itemLabel: element.itemLabel,
            isDefault: element.isDefault,
            itemOrder: element.itemOrder,
            updatedDate: element.updatedDate,
          });
        });
      }
      if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
        item.fieldItems.forEach((element, idx) => {
          packages.push({
            isAvailable: true,
            itemId: element.itemId,
            itemLabel: element.itemLabel,
            isDefault: element.isDefault,
            itemOrder: element.itemOrder,
            updatedDate: element.updatedDate,
          });
        });
      }
    })
  }

  extensionsData[EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage] = languages;
  extensionsData[EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments] = deparments;
  extensionsData[EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions] = positions;
  extensionsData[EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages] = packages;
  extensionsData[EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin] = adminDataExtension

  return extensionsData;
}

export const convertSpecialFieldEmployee = (listFields, employeeLayoutPersonal) => {
  const _fields = _.cloneDeep(listFields);
  const extensionsData = getExtensionsEmployees(employeeLayoutPersonal);
  _fields.map(item => {
    item.fieldItems = _.cloneDeep((item.fieldItems && item.fieldItems.length > 0) ? item.fieldItems : extensionsData[item.fieldName]);
    switch (item.fieldName) {
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments:
        item.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
        break;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages:
        item.fieldType = DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
        break;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates:
        item.fieldType = DEFINE_FIELD_TYPE.TEXT;
        break;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin:
        item.fieldType = DEFINE_FIELD_TYPE.RADIOBOX;
        break;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone:
        item.disableDisplaySearch = true;
        break;
      default:
        break;
    }
  })
  return _fields;
}

export const customFieldsInfo = (field, type, employeeLayoutPersonal) => {
  const fieldCustom = _.cloneDeep(field);
  const extensionsData = getExtensionsEmployees(employeeLayoutPersonal);
  fieldCustom.fieldItems = extensionsData[field.fieldName];

  switch (type) {
    case ControlType.EDIT: {
      if (field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage ||
        field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone
        || field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
        return fieldCustom;
      }
    }
      break;
    case ControlType.FILTER_LIST: {
      if (_.isArray(fieldCustom)) {
        return convertSpecialItemFilter(fieldCustom);
      }
      if (field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
        fieldCustom.fieldType = DEFINE_FIELD_TYPE.RADIOBOX;
        return fieldCustom;
      }
      if (field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments ||
        field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
        fieldCustom.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
        return fieldCustom;
      }
      if (field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
        fieldCustom.fieldType = DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
        return fieldCustom;
      }
    }
      break;
    default:
      break;
  }
  return field;
}

const specialDisplayMultiLineEmployeePackage = (rowData) => {
  return (
    <div className="text-ellipsis">{rowData.employee_packages &&
      rowData.employee_packages.map((item, idx) => {
        if (idx < rowData.employee_packages.length - 1) {
          return <>{item.packagesName}{translate(`commonCharacter.comma`)}</>
        } else {
          return <>{item.packagesName}</>
        }
      })
    }</div>
  )
}

export const specialDisplayMultiLine = (fieldColumn, rowData, screenMode) => {
  if (fieldColumn.fieldName === 'language_id') {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over"><Popover x={-20} y={25}>{rowData.language && rowData.language.languageName}</Popover></div>;
    }
    return <div className="text-over">{rowData.language && rowData.language.languageName}</div>;
  } else if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over">
        <Popover x={-20} y={25}>
          {specialDisplayMultiLineEmployeePackage(rowData)}
        </Popover>
      </div>;
    }
    return <div className="text-over">
      {specialDisplayMultiLineEmployeePackage(rowData)}
    </div>;
  } else {
    if (screenMode === ScreenMode.DISPLAY) {
      if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
        return rowData.employee_departments.map((element, idx) => {
          return <div className="text-over" key={idx}>
            <Popover x={-20} y={25}>
              <div className={"specical-employee-item text-ellipsis w-auto"}>
                {getPathTreeName(getFieldLabel(element, 'pathTreeName'))}
              </div>
            </Popover>
          </div>;
        });
      }
      if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
        return rowData.employee_departments.map((element, idx) => {
          return <div className="text-over" key={idx}>
            <Popover x={-20} y={25}>
              <div className="specical-employee-item text-ellipsis w-auto">
                {getFieldLabel(element, 'positionName')}
              </div>
            </Popover>
          </div>;
        });
      }
    } else {
      if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
        return rowData.employee_departments.map((element, idx) => {
          return <div key={idx} className={"specical-employee-item text-ellipsis w-auto"}>
            {getPathTreeName(getFieldLabel(element, 'pathTreeName'))}
          </div>
        });
      }
      if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
        return rowData.employee_departments.map((element, idx) => {
          return <div key={idx} className="specical-employee-item text-ellipsis w-auto">
            {getFieldLabel(element, 'positionName')}
          </div>
        });
      }
    }
    return <></>;
  }
}

const renderSpecialItemNotEditEmployeeManager = (fieldColumn, rowData, onOpenPopupEmployeeDetail) => {
  return (rowData.employee_departments.map((element, idx) => {
    return (
      <a key={idx} className="specical-employee-item text-ellipsis w-auto" onClick={() => onOpenPopupEmployeeDetail(element.employeeId, fieldColumn.fieldId)}>
        {getFieldLabel(element, 'employeeFullName')}
      </a>
    )
  }))
}

const renderSpecialItemNotEditEmployeeSubordinates = (fieldColumn, rowData, onOpenPopupEmployeeDetail) => {
  return (
    <a className="specical-employee-item text-ellipsis">
      {rowData.employee_subordinates.map((element, index) => {
        if (index !== rowData.employee_subordinates.length - 1) {
          return (<a onClick={() => onOpenPopupEmployeeDetail(element.employeeId, fieldColumn.fieldId)}>{element.employeeFullName}{translate(`commonCharacter.comma`)}</a>)
        } else {
          return (<a onClick={() => onOpenPopupEmployeeDetail(element.employeeId, fieldColumn.fieldId)}>{element.employeeFullName}</a>)
        }
      })}
    </a>
  )
}

export const renderSpecialItemNotEdit = (fieldColumn, rowData, onOpenPopupEmployeeDetail, screenMode) => {
  if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager) {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over">
        <Popover x={-20} y={25}>
          {renderSpecialItemNotEditEmployeeManager(fieldColumn, rowData, onOpenPopupEmployeeDetail)}
        </Popover>
      </div>;
    }
    return <div className="text-over">
      {renderSpecialItemNotEditEmployeeManager(fieldColumn, rowData, onOpenPopupEmployeeDetail)}
    </div>;
  }

  if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates) {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over">
        <Popover x={-20} y={25}>
          {renderSpecialItemNotEditEmployeeSubordinates(fieldColumn, rowData, onOpenPopupEmployeeDetail)}
        </Popover>
      </div>
    }
    return <div className="text-over">
      {renderSpecialItemNotEditEmployeeSubordinates(fieldColumn, rowData, onOpenPopupEmployeeDetail)}
    </div>
  }

  if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone) {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over">
        <Popover x={-20} y={25}>{rowData.timezone && rowData.timezone.timezoneShortName}</Popover>
      </div>;
    }
    return <div className="text-over">{rowData.timezone && rowData.timezone.timezoneShortName}</div>;
  }

  if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
    if (screenMode === ScreenMode.DISPLAY) {
      return <div className="text-over">
        <Popover x={-20} y={25}>
          {_.isNil(rowData.is_admin) && ''}
          {(!_.isNil(rowData.is_admin) && rowData.is_admin) && `${translate(`employees.isAdmin[${1}]`)}`}
          {(!_.isNil(rowData.is_admin) && !rowData.is_admin) && `${translate(`employees.isAdmin[${0}]`)}`}
        </Popover>
      </div>;
    }
    return <div className="text-over">
      {_.isNil(rowData.is_admin) && ''}
      {(!_.isNil(rowData.is_admin) && rowData.is_admin) && `${translate(`employees.isAdmin[${1}]`)}`}
      {(!_.isNil(rowData.is_admin) && !rowData.is_admin) && `${translate(`employees.isAdmin[${0}]`)}`}
    </div>;
  }
  return <></>;
}
