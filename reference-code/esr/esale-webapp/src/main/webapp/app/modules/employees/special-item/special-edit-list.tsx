import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ControlType } from 'app/config/constants';
import { EMPLOYEE_SPECIAL_LIST_FIELD } from '../constants';
import { EDIT_SPECIAL_ITEM } from 'app/modules/employees/constants';
import StringUtils from 'app/shared/util/string-utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { translate } from 'react-jhipster';

export interface ISpecialEditListProps {
  valueData: any,
  itemData: any,
  extensionsData: any,
  nameKey?: any,
  errorInfo?: any,
  errorInfos?: any[],
  typeSpecialEdit?: any,
  updateFiles?: (files) => void; // for field file
  updateStateField: (itemData, type, itemEditValue, index?: any) => void             // callback when user edit value cell
  isFocusFirst?: boolean,
  itemFirstFocus?: null // First item error
}

/**
 * Component for manager setting item
 * @param props 
 */
const SpecailEditList: React.FC<ISpecialEditListProps> = (props) => {
  const { nameKey } = props;
  const rowData = { key: '', fieldValue: null };
  rowData.key = getValueProp(props.valueData, nameKey);

  const getErrorInfo = (name) => {
    if (props.errorInfos) {
      const errorInfo = props.errorInfos.find(e => e.item === _.camelCase(name) && e.rowId.toString() === rowData.key.toString());
      if (errorInfo) {
        return errorInfo;
      }
    }
    return null;
  }

  const getInfoData = () => {
    let _infoData = null;
    const fieldInfoData = [];
    _infoData = _.cloneDeep(props.itemData);
    props.extensionsData[props.itemData.fieldName].forEach((element, idx) => {
      fieldInfoData.push({
        itemId: element.itemId,
        itemLabel: element.itemLabel,
        isDefault: false,
        isAvailable: element.isAvailable,
      })
    });

    _infoData.fieldItems = fieldInfoData;
    _infoData.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
    if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
      _infoData.fieldType = DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
    }
    if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
      const itemPosDefault = {
        isAvailable: true,
        itemId: null,
        itemLabel: translate(`employees.list.special.position-label`),
        isDefault: false,
        itemOrder: null,
      }
      // push default fisrt item
      _infoData.fieldItems.splice(0, 0, itemPosDefault);
    }

    return _infoData;
  }

  const renderComponentBasicSpecial = () => {
    const infoDataBasic = getInfoData();
    const rowDataDefaultSelect = _.cloneDeep(rowData);
    if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages) {
      const _fieldValue = [];
      if (props.valueData && props.valueData.employee_packages) {
        props.valueData.employee_packages.map(item => {
          _fieldValue.push(item.packagesId);
        })
      }
      rowDataDefaultSelect.fieldValue = _fieldValue;
    }
    let errorInfo = null;
    if (props.errorInfos && props.errorInfos.length > 0) {
      errorInfo = props.errorInfos.find(item => item.rowId.toString() === rowData.key.toString() && item.item === infoDataBasic.fieldName)

      if (errorInfo) {
        let packageNamesError = "";
        errorInfo.itemName.map((elm, idx) => {
          if (idx < errorInfo.itemName.length - 1) {
            packageNamesError += elm + ','
          } else {
            packageNamesError += elm;
          }
        })
        errorInfo.errorMsg = translate(`messages.${errorInfo.errorCode}`, { 0: packageNamesError, 1: 0 });
      }
    }

    if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage) {
      rowDataDefaultSelect.fieldValue = props.valueData.language && props.valueData.language.languageId ? props.valueData.language.languageId : null;
    }

    return (
      <>
        {/* language and packages*/}
        <div >
          <>
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={errorInfo}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={infoDataBasic}
              elementStatus={rowDataDefaultSelect}
              updateStateElement={(d, t, e) => props.updateStateField(d, t, e)}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          </>
        </div>
      </>
    )
  }

  const renderComponentDerparment = () => {
    const infoData = getInfoData();

    if (props.valueData.employee_departments.length > 0) {
      return (
        <>
          {props.valueData.employee_departments.map((item, index) => {
            const rowDataSelect = _.cloneDeep(rowData);
            if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
              rowDataSelect.fieldValue = item.departmentId ? item.departmentId : null;
            } else if (props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
              rowDataSelect.fieldValue = item.positionId ? item.positionId : null;
            }

            return (
              <>
                {/* deparment */}
                <div className='deparment-input'>
                  <>
                    <DynamicControlField
                      showFieldLabel={false}
                      errorInfo={getErrorInfo(infoData.fieldName)}
                      controlType={ControlType.EDIT_LIST} isDnDAddField={false}
                      isDnDMoveField={false} fieldInfo={infoData}
                      elementStatus={rowDataSelect}
                      updateStateElement={(d, t, e) => props.updateStateField(d, t, e, index + 1)}
                      idUpdate={getValueProp(props.valueData, nameKey)}
                    />
                  </>
                </div>
              </>
            )
          })}
        </>
      )
    } else {
      return <>
        {/* deparment */}
        <div className='deparment-input'>
          <>
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(infoData.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={infoData}
              elementStatus={rowData}
              updateStateElement={(d, t, e) => props.updateStateField(d, t, e, 1)}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          </>
        </div>
      </>
    }
  }
  const renderComponentName = () => {
    let itemName = null;
    let itemSurname = null;
    let itemIcon = null;
    const rowDataName = _.cloneDeep(rowData);
    const rowDataSurName = _.cloneDeep(rowData);
    const rowDataIcon = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeName) {
        itemName = element;
      }
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname) {
        itemSurname = element;
      }
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon) {
        itemIcon = element;
      }
    });
    itemName && (itemName.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemSurname && (itemSurname.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemIcon && (itemIcon.fieldType = DEFINE_FIELD_TYPE.FILE);

    rowDataName.fieldValue = props.valueData.employee_name;
    rowDataSurName.fieldValue = props.valueData.employee_surname;
    rowDataIcon.fieldValue = [props.valueData.employee_icon];

    return <>
      <div className="special-input p-0">
        <div className="input-common-wrap-text w33">
          {itemIcon &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemIcon.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemIcon}
              elementStatus={rowDataIcon}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              updateFiles={props.updateFiles}
              className={' input-common-wrap w100 width-200'}
              idUpdate={getValueProp(props.valueData, nameKey)}
              isSingleFile={true}
              acceptFileExtension={FILE_FOMATS.IMG}
            />
          }
        </div>
        <div className="input-common-wrap-text w33">
          {itemSurname &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemSurname.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemSurname}
              elementStatus={rowDataSurName}
              className={' input-common-wrap w100 width-200'}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          }
        </div>
        <div className="input-common-wrap-text w33">
          {itemName &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemName.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemName}
              elementStatus={rowDataName}
              className={' input-common-wrap w100 width-200'}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          }
        </div>
      </div>
    </>;
  }

  const renderComponentKana = () => {
    let itemNameKana = null;
    let itemSurnameKana = null;
    const rowDataNameKana = _.clone(rowData);
    const rowDataSurnameKana = _.clone(rowData)
    props.itemData.forEach(element => {
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeNameKana) {
        itemNameKana = element;
      }
      if (element.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana) {
        itemSurnameKana = element;
      }
    });
    if (itemNameKana) {
      itemNameKana.fieldType = DEFINE_FIELD_TYPE.TEXT;
      itemNameKana.defaultValue = props.valueData.employee_name_kana;
    }
    if (itemSurnameKana) {
      itemSurnameKana.fieldType = DEFINE_FIELD_TYPE.TEXT;
      itemSurnameKana.defaultValue = props.valueData.employee_surname_kana;
    }
    rowDataNameKana.fieldValue = props.valueData.employee_name_kana;
    rowDataSurnameKana.fieldValue = props.valueData.employee_surname_kana;
    return <>
      <div className="special-input">
      <div className="input-common-wrap-text w48">
          {itemSurnameKana &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemSurnameKana.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemSurnameKana}
              elementStatus={rowDataSurnameKana}
              className={' input-common-wrap-text width-200 '}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          }
        </div>
        <div className="input-common-wrap-text w48">
          {itemNameKana &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemNameKana.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemNameKana}
              elementStatus={rowDataNameKana}
              className={' input-common-wrap-text width-200 '}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
            />
          }
        </div>
      </div>
    </>;
  }

  return (
    <>
      {!props.typeSpecialEdit && (
        props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments
        || props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions)
        &&
        renderComponentDerparment()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.NAME && renderComponentName()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.KANA && renderComponentKana()}
      {!props.typeSpecialEdit && props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage && renderComponentBasicSpecial()}
      {!props.typeSpecialEdit && props.itemData.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages && renderComponentBasicSpecial()}
    </>
  )
}

export default SpecailEditList;