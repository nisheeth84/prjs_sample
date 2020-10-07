import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ControlType, ScreenMode } from 'app/config/constants';
import { SALES_SPECIAL_LIST_FIELD } from '../constants';
import { EDIT_SPECIAL_ITEM } from 'app/modules/employees/constants';
import StringUtils from 'app/shared/util/string-utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';

export interface ISpecialEditListProps {
  valueData: any;
  itemData: any;
  extensionsData: any;
  nameKey?: any;
  errorInfo?: any;
  errorInfos?: any[];
  typeSpecialEdit?: any;
  updateFiles?: (files) => void; // for field file
  updateStateField: (itemData, type, itemEditValue, index?: any) => void; // callback when user edit value cell
  isFocusFirst?: boolean;
  itemFirstFocus?: null; // First item error,
  mode?: any
}

/**
 * Component for manager setting item
 * @param props
 */
const SpecialEditList: React.FC<ISpecialEditListProps> = props => {
  const { nameKey } = props;
  const rowData = { key: '', fieldValue: null };
  rowData.key = getValueProp(props.valueData, nameKey);
  const getColumnWidth = (field: any) => {
    let width = 0;
    if (_.isArray(field) && field.length > 0) {
      field.forEach(e => {
        width += e.columnWidth ? e.columnWidth : 100;
      });
    } else if (field.isCheckBox) {
      width = 90;
    } else {
      width = field.columnWidth ? field.columnWidth : 100;
    }
    return width;
  };
  const styleCell = {};
  const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${props.itemData.fieldId}`
  
  let classCell = '';
  if (props.mode !== ScreenMode.EDIT) {
    styleCell["width"] = `${getColumnWidth(props.itemData)}px`;
    styleCell['marginBottom'] = '0px';
    classCell += ' text-over text-ellipsis';
  } else {
    classCell += ' text-form-edit';
  }
  const getErrorInfo = name => {
    if (props.errorInfos) {
      const errorInfo = props.errorInfos.find(e => e.item === _.camelCase(name));
      if (errorInfo) {
        return errorInfo;
      }
    }
    return null;
  };

  const getInfoData = () => {
    let _infoData = null;
    const fieldInfoData = [];
    _infoData = _.cloneDeep(props.itemData);
    props.extensionsData[props.itemData.fieldName].forEach((element, idx) => {
      fieldInfoData.push({
        itemId: element.itemId,
        itemLabel: element.itemLabel,
        isDefault: false,
        isAvailable: element.isAvailable
      });
    });

    _infoData.fieldItems = fieldInfoData;
    _infoData.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
    if (props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeePackages) {
      _infoData.fieldType = DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
    }
    return _infoData;
  };

  const renderComponentBasicSpecial = () => {
    const infoDataBasic = getInfoData();
    const rowDataDefaultSelect = _.cloneDeep(rowData);
    if (props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.productTradingProgressId) {
      rowDataDefaultSelect.fieldValue = props.valueData.product_trading_progress_id;
    }
    return (
      <div id={cellId} style={{ ...styleCell}} className={classCell + " set-width-200" }  >
      {/* language and packages*/}
          <DynamicControlField
            key={cellId}
            showFieldLabel={false}
            errorInfo={getErrorInfo(infoDataBasic.fieldName)}
            controlType={ControlType.EDIT_LIST}
            isDnDAddField={false}
            isDnDMoveField={false}
            fieldInfo={infoDataBasic}
            elementStatus={rowDataDefaultSelect}
            updateStateElement={(d, t, e) => props.updateStateField(d, t, e, props.valueData.product_trading_id)}
            idUpdate={getValueProp(props.valueData, nameKey)}
            isFocus={StringUtils.equalPropertyName(infoDataBasic.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
          />
      </div>
    );
  };

  const renderComponentDerparment = () => {
    const infoData = getInfoData();

    if (props.valueData.employee_departments.length > 0) {
      return (
        <>
          {props.valueData.employee_departments.map((item, index) => {
            const rowDataSelect = _.cloneDeep(rowData);
            if (props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeeDepartments) {
              rowDataSelect.fieldValue = item.departmentId ? item.departmentId : null;
            } else if (props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeePositions) {
              rowDataSelect.fieldValue = item.positionId ? item.positionId : null;
            }

            return (
              <>
                {/* deparment */}
                <div className="deparment-input">
                  <>
                    <DynamicControlField
                      showFieldLabel={false}
                      errorInfo={getErrorInfo(infoData.fieldName)}
                      controlType={ControlType.EDIT_LIST}
                      isDnDAddField={false}
                      isDnDMoveField={false}
                      fieldInfo={infoData}
                      elementStatus={rowDataSelect}
                      updateStateElement={(d, t, e) => props.updateStateField(d, t, e, index + 1)}
                      idUpdate={getValueProp(props.valueData, nameKey)}
                      isFocus={StringUtils.equalPropertyName(infoData.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
                    />
                  </>
                </div>
              </>
            );
          })}
        </>
      );
    } else {
      return (
        <>
          {/* deparment */}
          <div className="deparment-input">
            <>
              <DynamicControlField
                showFieldLabel={false}
                errorInfo={getErrorInfo(infoData.fieldName)}
                controlType={ControlType.EDIT_LIST}
                isDnDAddField={false}
                isDnDMoveField={false}
                fieldInfo={infoData}
                elementStatus={rowData}
                updateStateElement={(d, t, e) => props.updateStateField(d, t, e, 1)}
                idUpdate={getValueProp(props.valueData, nameKey)}
                isFocus={StringUtils.equalPropertyName(infoData.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
              />
            </>
          </div>
        </>
      );
    }
  };
  const renderComponentName = () => {
    let itemName = null;
    let itemSurname = null;
    let itemIcon = null;
    const rowDataName = _.cloneDeep(rowData);
    const rowDataSurName = _.cloneDeep(rowData);
    const rowDataIcon = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeId) {
        itemName = element;
      }
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeSurname) {
        itemSurname = element;
      }
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeIcon) {
        itemIcon = element;
      }
    });
    itemName && (itemName.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemSurname && (itemSurname.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemIcon && (itemIcon.fieldType = DEFINE_FIELD_TYPE.FILE);
    // itemSurname.defaultValue = props.valueData.employee_surname;
    // itemName.defaultValue = props.valueData.employee_name;
    rowDataName.fieldValue = props.valueData.employee_name;
    rowDataSurName.fieldValue = props.valueData.employee_surname;
    rowDataIcon.fieldValue = [props.valueData.employee_icon];

    return (
      <>
        <div className="special-input">
          <div className="input-common-wrap-text w33">
            {itemIcon && (
              <DynamicControlField
                showFieldLabel={false}
                errorInfo={getErrorInfo(itemIcon.fieldName)}
                controlType={ControlType.EDIT_LIST}
                isDnDAddField={false}
                isDnDMoveField={false}
                fieldInfo={itemIcon}
                elementStatus={rowDataIcon}
                updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
                updateFiles={props.updateFiles}
                className={'input-common-wrap w100'}
                idUpdate={getValueProp(props.valueData, nameKey)}
                isSingleFile={true}
                acceptFileExtension={FILE_FOMATS.IMG}
                isFocus={StringUtils.equalPropertyName(itemIcon.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
              />
            )}
          </div>
          <div className="input-common-wrap-text w33">
            {itemSurname && (
              <DynamicControlField
                showFieldLabel={false}
                errorInfo={getErrorInfo(itemSurname.fieldName)}
                controlType={ControlType.EDIT_LIST}
                isDnDAddField={false}
                isDnDMoveField={false}
                fieldInfo={itemSurname}
                elementStatus={rowDataSurName}
                updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
                idUpdate={getValueProp(props.valueData, nameKey)}
                isFocus={StringUtils.equalPropertyName(itemSurname.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
              />
            )}
          </div>
          <div className="input-common-wrap-text w33">
            {itemName && (
              <DynamicControlField
                showFieldLabel={false}
                errorInfo={getErrorInfo(itemName.fieldName)}
                controlType={ControlType.EDIT_LIST}
                isDnDAddField={false}
                isDnDMoveField={false}
                fieldInfo={itemName}
                elementStatus={rowDataName}
                updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
                idUpdate={getValueProp(props.valueData, nameKey)}
                isFocus={StringUtils.equalPropertyName(itemName.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
              />
            )}
          </div>
        </div>
      </>
    );
  };

  const renderComponentKana = () => {
    let itemNameKana = null;
    let itemSurnameKana = null;
    const rowDataNameKana = _.clone(rowData);
    const rowDataSurnameKana = _.clone(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeNameKana) {
        itemNameKana = element;
      }
      if (element.fieldName === SALES_SPECIAL_LIST_FIELD.employeeSurnameKana) {
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
    return (
      <>
        <div className="special-input">
          {itemNameKana && (
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemNameKana.fieldName)}
              controlType={ControlType.EDIT_LIST}
              isDnDAddField={false}
              isDnDMoveField={false}
              fieldInfo={itemNameKana}
              elementStatus={rowDataNameKana}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
              idUpdate={getValueProp(props.valueData, nameKey)}
              isFocus={StringUtils.equalPropertyName(itemNameKana.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          )}
          {itemSurnameKana && (
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemSurnameKana.fieldName)}
              controlType={ControlType.EDIT_LIST}
              isDnDAddField={false}
              isDnDMoveField={false}
              fieldInfo={itemSurnameKana}
              elementStatus={rowDataSurnameKana}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
              idUpdate={getValueProp(props.valueData, nameKey)}
              isFocus={StringUtils.equalPropertyName(itemSurnameKana.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {!props.typeSpecialEdit &&
        (props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeeDepartments ||
          props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeePositions) &&
        renderComponentDerparment()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.NAME && renderComponentName()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.KANA && renderComponentKana()}
      {!props.typeSpecialEdit && props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeeLanguage && renderComponentBasicSpecial()}
      {!props.typeSpecialEdit && props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.employeePackages && renderComponentBasicSpecial()}
      {!props.typeSpecialEdit &&
        props.itemData.fieldName === SALES_SPECIAL_LIST_FIELD.productTradingProgressId &&
        renderComponentBasicSpecial()}
    </>
  );
};

export default SpecialEditList;
