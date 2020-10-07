import React from 'react'
import { ScreenMode, ControlType } from 'app/config/constants'
import { RESPONSE_FIELD_NAME } from 'app/modules/employees/constants';
import StringUtils from 'app/shared/util/string-utils';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from '../../../../shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { Link } from 'react-router-dom';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { downloadFile } from 'app/shared/util/file-utils';
import { translate } from 'react-jhipster'
import { LINK_TARGET_IFRAME } from 'app/config/constants';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { getDynamicData } from 'app/shared/util/utils';
import employeeDetailSetting from 'app/shared/layout/menu/employee-detail/employee-detail-setting';

export interface TabSummaryEleProps {
  // fieldData?: any,
  fieldsInfo?: any[],
  // targetId?: string,
  valueData?: any,
  screenMode,
  canDrop?: boolean,
  isOver?: boolean,
  onDragOrderField?: (dragId, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => void
  onDropNewField: (dragItem: object, dropId: number, isDoubleColumn: boolean, isAddLeft: boolean) => void
  openDynamicSelectFields: (settingMode, fieldEdit) => void
  onDeleteFields: (fieldId) => void;
  onShowMessage?: (message, type) => void;
  fieldHighlight?: number[],
  listTab?: any;
  fields?: any;
  employeeId?: any;
  edittingField: any;
}

export enum TypeMessage {
  downloadFileError,
  deleteWarning
}

const TabSummaryElement: React.FC<TabSummaryEleProps> = (props) => {

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      if (props.onShowMessage) {
        props.onShowMessage(translate('messages.ERR_COM_0042', { 0: fileName }), TypeMessage.deleteWarning);
      }
    });
  }

  const getValueDataShow = (field) => {
    let text = '';
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);
    if (fieldName === RESPONSE_FIELD_NAME.LANGUAGE_ID) {
      field.fieldItems.map((item) => {
        if (item.itemId === props.valueData.languageId) {
          text = item.itemLabel;
        }
      })
    } else if (fieldName === RESPONSE_FIELD_NAME.TIME_ZONE_ID) {
      field.fieldItems.map((item) => {
        if (item.itemId === props.valueData.timezoneId) {
          text = item.itemLabel;
        }
      })
    } else if (fieldName === RESPONSE_FIELD_NAME.DEPARTMENT_IDS) {
      props.valueData[RESPONSE_FIELD_NAME.DEPARTMENT_IDS].map((deparment, idx) => {
        text = text + deparment['departmentName'];
        if (idx < props.valueData[RESPONSE_FIELD_NAME.DEPARTMENT_IDS].length - 1) {
          text = text + translate('commonCharacter.comma');
        }
      })
    } else if (fieldName === RESPONSE_FIELD_NAME.POSITION_ID) {
      props.valueData[RESPONSE_FIELD_NAME.DEPARTMENT_IDS].map((position, idx) => {
        if (position['positionName']) {
          if (text !== '') {
            text += translate('commonCharacter.comma');
          }
          text += position['positionName'];
        }
      })
    } else if (fieldName === RESPONSE_FIELD_NAME.EMPLOYEE_ICON) {
      const file = props.valueData[fieldName];
      return file && <a className="file" onClick={() => handleClickFile(file.fileName, file.fileUrl)}>{file.fileName}</a>;
    } else if (fieldName === RESPONSE_FIELD_NAME.EMPLOYEE_PACKAGES) {
      props.valueData[RESPONSE_FIELD_NAME.EMPLOYEE_PACKAGES].forEach((packages, idx) => {
        text = text + packages['packagesName'];
        if (idx < props.valueData[RESPONSE_FIELD_NAME.EMPLOYEE_PACKAGES].length - 1) {
          text = text + translate('commonCharacter.comma');
        }
      })
    } else if (fieldName === RESPONSE_FIELD_NAME.IS_ADMIN) {
      text = translate(`employees.isAdmin[${0}]`);
      if(props.valueData[RESPONSE_FIELD_NAME.IS_ADMIN]) {
        text = translate(`employees.isAdmin[${1}]`);
      }
    }
    else {
      text = props.valueData[fieldName];
    }
    return text;
  }

  const getFieldLinkHover = () => {
    return null;
  }
  const renderComponentDisplay = (fieldInfo: any) => {
    const text = getValueDataShow(fieldInfo)
    if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.LINK && _.isNil(fieldInfo.defaultValue)) {
        return <>
          {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && <a rel="noopener noreferrer" target="blank" href={fieldInfo.urlTarget}>{fieldInfo.urlText 
          ? fieldInfo.urlText : fieldInfo.urlTarget}</a>}
          {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.DISPLAY && 
          <><a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a> <iframe src={fieldInfo.urlTarget} height={fieldInfo.iframeHeight} width="100%"/></>}
          {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.EDIT && <a href={fieldInfo.urlTarget}>{fieldInfo.urlText ? fieldInfo.urlText : fieldInfo.urlTarget}</a>}
        </>
    } else if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.EMAIL && fieldInfo.isDefault) {
      return <a href={`mailto:${text}`}>{text}</a>
    } else if (fieldInfo.isLinkedGoogleMap && fieldInfo.isDefault) {
      return <a href={`http://google.com/maps/search/${text}`}>{text}</a>
    } else if (props.valueData.employeeData && props.valueData.employeeData.length > 0 && !text) {
      return <>{getDynamicData(fieldInfo, props.valueData.employeeData, props.valueData, props.screenMode, props.employeeId, handleClickFile)}</>
    } else {
      const fieldLink = getFieldLinkHover();
      const isArray = Array.isArray(getValueProp(props.valueData, fieldInfo.fieldName)) && typeof getValueProp(props.valueData, fieldInfo.fieldName)[0] !== 'object'
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CHECKBOX
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
      if (isArray) {
        const display = [];
        const records = getValueProp(props.valueData, fieldInfo.fieldName);
        records.forEach((e, i) => {
          if (fieldLink && fieldLink.link) {
            display.push(<Link to={fieldLink.link}>{e}</Link>); // TODO pass parameter
          } else if (fieldLink && (fieldLink.hover || fieldLink.action)) {
            // TODO wait requried
          } else {
            display.push(<>{e}</>);
          }
        })
        return <>{display}</>
      } else {
        if (fieldLink && fieldLink.link) {
          return <Link to={fieldLink.link}>{text}</Link>
        } else if (fieldLink && (fieldLink.hover || fieldLink.action)) {
          // TODO wait requried
        } else {
          return <>{text}</>;
        }
      }
    }
    return <></>
  }

  const onExecuteAction = (fieldInfo, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (_.get(props, 'edittingField.fieldId') < 0 && !_.isNil(props.edittingField) && _.isNil(props.edittingField.userModifyFlg)) {
        if (props.onShowMessage) {
          props.onShowMessage(translate('messages.ERR_COM_0042'), TypeMessage.deleteWarning);
        }
      } else {
        if (props.onDeleteFields) {
          props.onDeleteFields(fieldInfo)
          if (_.get(props, 'edittingField.fieldId') === fieldInfo.fieldId) {
            props.openDynamicSelectFields(SettingModes.CreateNewInput, fieldInfo)
          }
        }
      }
    } else if (actionType === DynamicControlAction.EDIT) {
      if (props.openDynamicSelectFields) {
        props.openDynamicSelectFields(SettingModes.EditInput, fieldInfo)
      }
    }
  }

  const renderComponent = () => {
    const isTab = props.fieldsInfo && props.fieldsInfo.length === 1 && _.toString(props.fieldsInfo[0].fieldType) === DEFINE_FIELD_TYPE.TAB
    if (!isTab) {
      // const styleColumn = props.row.length === 1 ? 'title-table w15' : 'title-table w30'
      if (props.screenMode === ScreenMode.DISPLAY && _.toString(props.fieldsInfo[0].fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        return <></>
      }
      return <FieldDisplayRow
        fieldInfo={props.fieldsInfo}
        listFieldInfo={props.fields}
        controlType={ControlType.DETAIL_VIEW}
        isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
        // fieldStyleClass={{ detailViewBox: { columnFirst: styleColumn } }}
        renderControlContent={renderComponentDisplay}
        onExecuteAction={onExecuteAction}
        moveFieldCard={props.onDragOrderField}
        addFieldCard={props.onDropNewField}
        fieldIdsHighlight={props.fieldHighlight}
        // className={props.fieldHighlight && props.fieldHighlight.findIndex( e => e === props.col.fieldId) >= 0 ? 'detail-highlight-style' : ''}
        idUpdate={props.employeeId}
      />
    }
    return <></>
  }
  return renderComponent();
}

export default TabSummaryElement;
