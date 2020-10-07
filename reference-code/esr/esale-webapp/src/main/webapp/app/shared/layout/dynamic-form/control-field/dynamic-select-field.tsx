import React, { useState, useEffect } from 'react'
import { getFieldLabel } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';
import BoxMessage, { MessageType } from '../../../layout/common/box-message';
import DynamicFieldDragable, {DynamicFieldDragLayer} from './dynamic-field-dragable';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { ControlType } from 'app/config/constants';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from '../constants';
import ConfirmDialog from '../../dialog/confirm-dialog';
import ReactResizeDetector from 'react-resize-detector';

export interface IDynamicSelectFieldProps {
  fieldInfos?: any,
  listFieldInfo?: any[],
  onSelectField?: (fieldInfo: any) => void,
  onUnselectField?: (fieldInfo: any) => void,
  fieldsUnVailable: any,
  currentSettingMode: any,
  onChangeSettingField?: (isChange: boolean) => void;
  fieldBelong: number; 
  fieldNameExtension?: string;
  onExecuteAction?: (fieldInfo, actionType, params) => void
  getFieldsCallBack?: any
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
  currencyUnit: '',
  selectOrganizationData: null,
  typeUnit: 0,
  decimalPlace: 0,
  urlType: 1,
  urlTarget: null,
  urlText: null,
  iframeHeight: null,
  linkTarget: null,
  configValue: null,
  isLinkedGoogleMap: true,
  fieldGroup: null,
  lookupData: null,
  relationData: null,
  tabData: null,
  createdDate: null,
  createdUser: null,
  updatedDate: null,
  updatedUser: null,
  fieldItems: [],
  differenceSetting: {
    isDisplay: false,
    backwardColor: 'color-7',
    backwardText: '',
    forwardColor: 'color-3',
    forwardText: ''
    }
};

const DynamicSelectField = ((props: IDynamicSelectFieldProps, ref) => {
  const [curentSettingMode, setCurentSettingMode] = useState(props.currentSettingMode);
  const [widthFieldDisplay, setWidthFieldDisplay] = useState(0);
  const [inputEditting] = useState(defaultInput);
  const listField = [];

  useEffect(() => {
    setCurentSettingMode(props.currentSettingMode)
  }, [props.currentSettingMode])

  if(curentSettingMode === SettingModes.CreateNewInput) {
    for(const prop in DEFINE_FIELD_TYPE) {
      if (!Object.prototype.hasOwnProperty.call(DEFINE_FIELD_TYPE, prop) || DEFINE_FIELD_TYPE[prop] === DEFINE_FIELD_TYPE.LOOKUP) {
        continue;
      }
      const fieldInput = _.cloneDeep(defaultInput);
      fieldInput.fieldType = +DEFINE_FIELD_TYPE[prop];
      if (fieldInput.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER) {
        if(_.toString(fieldInput.fieldType) === DEFINE_FIELD_TYPE.DATE || _.toString(fieldInput.fieldType) === DEFINE_FIELD_TYPE.TIME) {
          fieldInput.configValue = "0"
        } else if (_.toString(fieldInput.fieldType) === DEFINE_FIELD_TYPE.DATE_TIME) {
          fieldInput.configValue = "0,0"
        } else if (_.toString(fieldInput.fieldType) === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
          fieldInput.selectOrganizationData = {format: 1, target: "111"}
        }
        listField.push(fieldInput);
      }
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

  const showConfirmDelete = async (item) => {
    const itemName = getFieldLabel(item, 'fieldLabel');
    const result = await ConfirmDialog({
      title: (<>{translate('employees.detail.title.popupErrorMessage.delete')}</>),
      message: itemName ? translate('messages.WAR_COM_0001', { itemName }) : translate('messages.WAR_COM_00011'),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: "button-red",
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: "button-cancel"
    });
    return result;
  }

  const executeDelete = async (item, action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete(item);
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  }

  const deleteField = (item) => {
    if (props.onExecuteAction) {
      executeDelete(item, () => {
        props.onExecuteAction(item, DynamicControlAction.DELETE, null);
      });
    }
  }

  const editField = (item) => {
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
          className={"mt-2"}
        />}
        <div className="tab-content mb-0">
        <ReactResizeDetector handleWidth onResize={(w,h) => setWidthFieldDisplay(w)}>
          <div className="form-group common list scroll-table-right style-3 pr-2 overflow-y-hover mb-0 pb-0">
            {listField.map((item, idx) =>
              <DynamicFieldDragable key={idx}
                fieldInfo={item}
                onEditField={editField}
              />
            )}
          </div>
        </ReactResizeDetector>
        </div>
        <DynamicFieldDragLayer width={widthFieldDisplay} />
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
          className={"mt-2"}
        />}
        <div className="tab-content mb-0">
        <ReactResizeDetector handleWidth onResize={(w,h) => setWidthFieldDisplay(w)}>
          <div className="form-group common list scroll-table-right style-3 pr-2 overflow-y-hover mb-0 pb-0">
          {props.fieldsUnVailable && props.fieldsUnVailable.map((item, idx) =>
              <DynamicFieldDragable key={idx}
                fieldInfo={item}
                onDeleteField={deleteField}
                onEditField={editField}
              />
            )}
          </div>
        </ReactResizeDetector>
        </div>
        <DynamicFieldDragLayer width={widthFieldDisplay} />
      </>
    );
  }

  const renderEditInput = () => {
    return (
      <div className="tab-content mb-0">
        <DynamicControlField
          key={!_.isNil(props.fieldInfos) ? props.fieldInfos.fieldId : inputEditting.fieldId}
          belong={props.fieldBelong}
          fieldNameExtension={props.fieldNameExtension}
          fieldInfo={!_.isNil(props.fieldInfos) ? props.fieldInfos : inputEditting}
          listFieldInfo={props.listFieldInfo}
          controlType={ControlType.DETAIL_EDIT}
          onExecuteAction={props.onExecuteAction}
          updateStateElement={onUpdateSettingField}
          getFieldsCallBack={props.getFieldsCallBack}
        />
        <br></br>
      </div>
    );
  }

  const renderComponent = () => {
    return (
      <div className="popup-content-common-right unset-min-height pt-2 v2 bg-white">
        <div className={`tab-detault position-static ${curentSettingMode === SettingModes.EditInput ? "overflow-auto height100vh-200 pr-2 style-3 overflow-y-hover" : 'overflow-y-hover'}`}>
          {curentSettingMode !== SettingModes.EditInput &&
            <ul className="nav nav-tabs" style={{width: 'auto'}}>
              <li className="nav-item">{curentSettingMode !== SettingModes.AddNotAvailabelInput ? <a className="nav-link active">{translate('dynamic-control.popupSettingField.tab.newField')}</a>
                : <a onClick={() => setCurentSettingMode(SettingModes.CreateNewInput)} className="nav-link">{translate('dynamic-control.popupSettingField.tab.newField')}</a>}</li>
              <li className="nav-item">{curentSettingMode !== SettingModes.CreateNewInput ? <a className="nav-link active">{translate('dynamic-control.popupSettingField.tab.unVailableField')}</a>
                : <a onClick={() => setCurentSettingMode(SettingModes.AddNotAvailabelInput)} className="nav-link">{translate('dynamic-control.popupSettingField.tab.unVailableField')}</a>}</li>
            </ul>
          }
          {curentSettingMode === SettingModes.CreateNewInput && renderCreateNewInput()}
          {curentSettingMode === SettingModes.AddNotAvailabelInput && renderAddNotAvailabelInput()}
          {curentSettingMode === SettingModes.EditInput && renderEditInput()}
        </div>

      </div>
    )
  }

  return renderComponent();

});

export default DynamicSelectField
