import _ from 'lodash';

import React from 'react'
import { ScreenMode, ControlType } from 'app/config/constants'
import { DynamicControlAction, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { Link } from 'react-router-dom';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { downloadFile } from 'app/shared/util/file-utils';
import { translate } from 'react-jhipster'
import FieldDetailViewTextArea from '../../../../shared/layout/dynamic-form/control-field/detail/field-detail-view-text-area';
import { CURRENCY, TypeMessage } from '../../constants';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { DATE_TIME_FORMAT, utcToTz } from 'app/shared/util/date-utils';
import { getDynamicData } from 'app/shared/util/utils';
import EmployeeName from 'app/shared/layout/common/EmployeeName';

export interface TabSummaryEleProps {
  fieldsInfo?: any,
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
  productId?: any;
  edittingField: any;
  openModalEmployeeDetail: (paramEmployeeId) => void;
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
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);

    if (props.valueData) {
      let valueData = '';

      switch (fieldName) {
        case "productImageName":
          valueData = "productImageName";
          break;
        case "productTypeId":
          valueData = (props.valueData['productTypeName']) ? getFieldLabel(props.valueData, "productTypeName") : '';
          break;
        case "productCategoryId":
          valueData = (props.valueData['productCategoryName']) ? getFieldLabel(props.valueData, "productCategoryName") : '';
          break;
        case "isDisplay":
          valueData = props.valueData[fieldName] ? translate("products.list.label.is-display.true") : translate("products.list.label.is-display.false")
          break;
        case "unitPrice":
          valueData = (props.valueData[fieldName] ? props.valueData[fieldName].toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : 0) + field.currencyUnit
          break;
        case "createdDate":
        case "updatedDate":
          valueData = props.valueData[fieldName] ? utcToTz(props.valueData[fieldName], DATE_TIME_FORMAT.User) : '';
          break;
        case "createdUser":
          valueData = "createdUser";
          break;
        case "updatedUser":
          valueData = "updatedUser";
          break;
        case "memo":
          valueData = "memo";
          break;
        default:
          valueData = props.valueData[fieldName]
          break;
      }

      return valueData;
    } else {
      return '';
    }
  }

  const getFieldLinkHover = () => {
    return null;
  }

  const renderLink = (id: any, name: any, avatar: any) => {
   
    return (
         <EmployeeName 
            userName={name}
            userImage={avatar}
            employeeId={id}
            sizeAvatar={30}
            backdrop={false}
          ></EmployeeName> 
    )
  }

  const renderComponentDisplay = (fieldInfo: any) => {
    const text = getValueDataShow(fieldInfo)
    if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.EMAIL && fieldInfo.isDefault) {
      return <a href={`mailto:${text}`}>{text}</a>
    } else if (fieldInfo.isLinkedGoogleMap && fieldInfo.isDefault) {
      return <a href={`http://google.com/maps/search/${text}`}>{text}</a>
    } else if (props.valueData.productData && props.valueData.productData.length > 0 && !text) {
      return <>{getDynamicData(fieldInfo, props.valueData.productData, props.valueData, props.screenMode, props.productId, handleClickFile)}</>
    } else if(props.valueData && text === "createdUser"){
      return <>{props.valueData ? renderLink(props.valueData['createdUserId'], props.valueData['createdUserName'],  props.valueData['createdUserImage']) : ''}</>
    } else if(props.valueData && text === "updatedUser"){
      return <>{props.valueData ? renderLink(props.valueData['updatedUserId'], props.valueData['updatedUserName'], props.valueData['updatedUserImage']) : ''}</>
    } else if(props.valueData && text === "productImageName"){
      return <>{props.valueData ? <a className="text-blue" onClick={() => handleClickFile(props.valueData.productImageName, props.valueData.productImagePath)}>{props.valueData['productImageName']}</a> : ''}</>
    } else if(props.valueData && text === "memo"){
      return <><FieldDetailViewTextArea text={props.valueData['memo']}/></>
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
      if (_.get(props, 'edittingField.fieldId') < 0 && _.isNil(props.edittingField.userModifyFlg) && _.isNil(props.edittingField.userModifyFlg)) {
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
      if (props.screenMode === ScreenMode.DISPLAY && _.toString(props.fieldsInfo[0].fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        return <></>
      }
      return <FieldDisplayRow
        fieldInfo={props.fieldsInfo}
        listFieldInfo={props.fields}
        controlType={ControlType.DETAIL_VIEW}
        isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
        renderControlContent={renderComponentDisplay}
        onExecuteAction={onExecuteAction}
        moveFieldCard={props.onDragOrderField}
        addFieldCard={props.onDropNewField}
        fieldIdsHighlight={props.fieldHighlight}
        idUpdate={props.productId}
      />
    }
    return <></>
  }

  return renderComponent();
}

export default TabSummaryElement;
