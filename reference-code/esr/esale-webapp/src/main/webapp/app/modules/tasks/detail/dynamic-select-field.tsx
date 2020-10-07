import React, { useState, useEffect, useRef } from 'react'
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { Storage, translate } from 'react-jhipster';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DynamicFieldDragable from 'app/shared/layout/dynamic-form/control-field/dynamic-field-dragable';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { ControlType } from 'app/config/constants';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';

export interface IDynamicSelectFieldProps {
  fieldInfos?: any,
  onSelectField?: (fieldInfo: any) => void,
  onUnselectField?: (fieldInfo: any) => void,
  fieldsUnVailable: any,
  currentSettingMode: any,
  onChangeSettingField?: (isChange: boolean) => void;
  fieldBelong: number;
  fieldNameExtension?: string;
  onExecuteAction?: (fieldInfo, actionType, params) => void;
  getFieldCallback?: any;
}

export enum SettingModes {
  CreateNewInput,
  AddNotAvailabelInput,
  EditInput
}

const defaultInput = {
  fieldId: null,
  fieldName: null,
  fieldLabel: {
  },
  fieldType: null,
  fieldOrder: null,
  isDefault: null,
  maxLength: null,
  modifyFlag: null,
  availableFlag: null,
  isDoubleColumn: null,
  defaultValue: null,
  currencyUnit: null,
  typeUnit: null,
  decimalPlace: null,
  urlType: null,
  urlTarget: null,
  urlText: null,
  linkTarget: null,
  configValue: null,
  isLinkedGoogleMap: null,
  fieldGroup: null,
  lookupData: null,
  relationData: null,
  tabData: null,
  createdDate: null,
  createdUser: null,
  updatedDate: null,
  updatedUser: null,
  fieldItems: null,
};



const DynamicSelectField = ((props: IDynamicSelectFieldProps, ref) => {
  const [curentSettingMode, setCurentSettingMode] = useState(props.currentSettingMode);
  const [inputEditting] = useState(defaultInput);
  const listField = [];

  useEffect(() => {
    setCurentSettingMode(props.currentSettingMode)
  }, [props.currentSettingMode])

  if (curentSettingMode === SettingModes.CreateNewInput) {
    for (const prop in DEFINE_FIELD_TYPE) {
      if (!Object.prototype.hasOwnProperty.call(DEFINE_FIELD_TYPE, prop)) {
        continue;
      }
      const fieldInput = _.cloneDeep(defaultInput);
      fieldInput.fieldType = +DEFINE_FIELD_TYPE[prop];
      listField.push(fieldInput);
    }
  }

  const [isShowMessageTabCreateField, setIsShowMessageTabCreateField] = useState(true);
  const onDeleteMessageCreateField = () => {
    setIsShowMessageTabCreateField(false);
  }

  const [isShowMessageTabEditField, setIsShowMessageTabEditField] = useState(true);
  const onDeleteMessageEditField = () => {
    setIsShowMessageTabEditField(false);
  }

  const onUpdateSettingField = (keyElemen, type, params) => {
    if (props.onChangeSettingField) {
      props.onChangeSettingField(params['userModifyFlg'])
    }
  }

  const showConfirmDelete = async () => {
    const itemName = getFieldLabel(inputEditting, 'fieldLabel');
    const result = await ConfirmDialog({
      title: (<>{translate('employees.detail.title.popupErrorMessage.delete')}</>),
      message: translate('messages.WAR_COM_0001', { itemName }),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: "button-red",
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: "button-cancel"
    });
    return result;
  }

  const executeDelete = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete();
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  }

  const deleteField = (item) => {
    // props.onDeleteFields(hoverField);
    if (props.onExecuteAction) {
      executeDelete(() => {
        props.onExecuteAction(item, DynamicControlAction.DELETE, null);
      });
    }
  }

  const editField = (item) => {
    // props.onDeleteFields(hoverField);
    if (props.onExecuteAction) {
      props.onExecuteAction(item, DynamicControlAction.EDIT, null);
    }
  }

  const renderCreateNewInput = () => {
    return (
      <>
        {isShowMessageTabCreateField && <BoxMessage
          messageType={MessageType.Info}
          message={"dynamic-control.popupSettingField.popupSettingFieldCreateField"}
          isShowDelete={true}
          onDeleteMessage={onDeleteMessageCreateField}
        />}
        <div className="tab-content">
          <div className="form-group common list scroll-table-right style-3 pr-2">
            {listField.map((item, idx) =>
              <DynamicFieldDragable key={idx}
                fieldInfo={item}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  const renderAddNotAvailabelInput = () => {
    return (
      <>
        {isShowMessageTabEditField && <BoxMessage
          messageType={MessageType.Info}
          message={"dynamic-control.popupSettingField.popupSettingFieldEditField"}
          isShowDelete={true}
          onDeleteMessage={onDeleteMessageEditField}
        />}
        <div className="tab-content">
          <div className="form-group common list scroll-table-right style-3 pr-2">
            {props.fieldsUnVailable.map((item, idx) =>
              <DynamicFieldDragable key={idx}
                fieldInfo={item}
                onDeleteField={deleteField}
                onEditField={editField}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  const renderEditInput = () => {
    return (<>
      <DynamicControlField
        key={!_.isNil(props.fieldInfos) ? props.fieldInfos.fieldId : inputEditting.fieldId}
        belong={props.fieldBelong}
        fieldNameExtension={props.fieldNameExtension}
        fieldInfo={!_.isNil(props.fieldInfos) ? props.fieldInfos : inputEditting}
        controlType={ControlType.DETAIL_EDIT}
        onExecuteAction={props.onExecuteAction}
        updateStateElement={onUpdateSettingField}
        getFieldsCallBack={props.getFieldCallback}
      />
      <br></br>
    </>
    );
  }

  const renderComponent = () => {
    return (<>
      {curentSettingMode !== SettingModes.EditInput
        && <div className="popup-content-common-right unset-min-height pt-2 v2 bg-white">
          <div className="tab-detault">
            {curentSettingMode !== SettingModes.EditInput &&
              <ul className="nav nav-tabs">
                <li className="nav-item">{curentSettingMode !== SettingModes.AddNotAvailabelInput ? <a className="nav-link active">{translate('dynamic-control.popupSettingField.tab.newField')}</a>
                  : <a onClick={() => setCurentSettingMode(SettingModes.CreateNewInput)} className="nav-link">{translate('dynamic-control.popupSettingField.tab.newField')}</a>}</li>
                <li className="nav-item">{curentSettingMode !== SettingModes.CreateNewInput ? <a className="nav-link active">{translate('dynamic-control.popupSettingField.tab.unVailableField')}</a>
                  : <a onClick={() => setCurentSettingMode(SettingModes.AddNotAvailabelInput)} className="nav-link">{translate('dynamic-control.popupSettingField.tab.unVailableField')}</a>}</li>
              </ul>
            }
            {curentSettingMode === SettingModes.CreateNewInput && renderCreateNewInput()}
            {curentSettingMode === SettingModes.AddNotAvailabelInput && renderAddNotAvailabelInput()}
          </div>
        </div>
      }
      {curentSettingMode === SettingModes.EditInput && 
        <div className="popup-content-common-right unset-min-height pt-2 v2 bg-white">
          {renderEditInput()}
        </div>
      }
    </>)
  }

  return renderComponent();

});

export default DynamicSelectField
