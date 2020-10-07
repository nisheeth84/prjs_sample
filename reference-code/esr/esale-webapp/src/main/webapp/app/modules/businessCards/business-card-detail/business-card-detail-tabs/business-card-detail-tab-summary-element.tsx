import _ from 'lodash';
import { Storage } from 'react-jhipster';
import React from 'react'
import { ScreenMode, ControlType, LINK_TARGET_IFRAME, APP_DATE_FORMAT, USER_FORMAT_DATE_KEY, DATETIME_FORMAT } from 'app/config/constants'
import { DynamicControlAction, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { Link } from 'react-router-dom';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils, { toKatakana } from 'app/shared/util/string-utils';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import FieldDetailViewTextArea from '../../../../shared/layout/dynamic-form/control-field/detail/field-detail-view-text-area';
import { DATE_TIME_FORMAT, getTimezone, getDateTimeFormatString } from 'app/shared/util/date-utils';
import { convertDateToUserFormat } from '../../util'
import dateFnsParse from 'date-fns/parse';
import dateFnsFormat from 'date-fns/format';
import momentTimeZone from 'moment-timezone';
import { translate } from 'react-jhipster'
import { downloadFile } from 'app/shared/util/file-utils';
import { getDynamicData } from 'app/shared/util/utils';
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import { BUSINESS_SPECIAL_FIELD_NAMES } from '../../constants'

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
  businessCardId?: any;
  edittingField: any;
  // open other detail popup
  onOpenPopupActivityDetail?
  onOpenModalCustomerDetail?
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

  const convertDateUserFormat = (
    dateTime: Date | string,
    formatOut?: DATE_TIME_FORMAT,
    formatIn?: DATE_TIME_FORMAT
  ) => {
    const timezone = getTimezone();
    if (!dateTime || !timezone) {
      return _.toString(dateTime);
    }
    if (_.isString(dateTime)) {
      dateTime = toKatakana(dateTime);
    }
    if (_.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
      dateTime = dateTime.slice(0, 16).replace('T', ' ');
    }
    const dt = dateFnsParse(dateTime, getDateTimeFormatString(formatIn));
    const dtAsString = dateFnsFormat(dt, DATETIME_FORMAT);
    const tz = momentTimeZone.utc(dtAsString).tz(timezone);

    if (formatOut === DATE_TIME_FORMAT.Database) {
      return tz.format(DATETIME_FORMAT);
    } else if (formatOut === DATE_TIME_FORMAT.User) {
      const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
      return tz.format(userFormat);
    } else {
      return tz.format();
    }
  };

  const getValueDataShow = (field) => {
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);

    if (props.valueData) {
      let valueData = null;

      switch (fieldName) {
        case "createdDate":
        case "updatedDate":
          valueData = props.valueData[fieldName] ? convertDateUserFormat(props.valueData[fieldName], DATE_TIME_FORMAT.User) : '';
          break;
        case "createdUser":
          valueData = "createdUser"
          break;
        case "updatedUser":
          valueData = "updatedUser"
          break;
        case "companyName":
          valueData = "companyName"
          break;
        case "businessCardImagePath":
          valueData = "businessCardImagePath"
          break;
        case "employeeId":
          valueData = "employeeId"
          break;
        case "isWorking":
          valueData = props.valueData[fieldName] ? translate("businesscards.create-edit.isWorking") : translate("businesscards.create-edit.notWorking")
          break;
        case "lastContactDate":
          valueData = "lastContactDate"
          break;
        case BUSINESS_SPECIAL_FIELD_NAMES.address: {
          const zipCode = props.valueData['zipCode'];
          const addressName = props.valueData['address'];
          const buildingName = props.valueData['building'];
          valueData = `${
            zipCode
              ? translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark') + zipCode
              : ''
            }`;
          valueData = valueData.concat(`${addressName ? (valueData ? ' ' + addressName : addressName) : ''}`);
          valueData = valueData.concat(`${buildingName ? (valueData ? ' ' + buildingName : buildingName) : ''}`);
          break;
        }
        default:
          valueData = props.valueData[fieldName]
          break;
      }
      return valueData;
    } else {
      return '';
    }
  }

  const renderLinkEmployee = (id: any, name: any, avatar: any) => {
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

  const renderReceiver = items => {
    const receivers = _.cloneDeep(items)
    receivers.forEach(item => {
      item.receiveDate = item.receiveDate ? convertDateToUserFormat(item.receiveDate) : '';
      item.receivedLastContactDate = item.receivedLastContactDate ? convertDateToUserFormat(item.receivedLastContactDate) : '';
    })

    return (
      <>
        {receivers.map((item, idx) => {
          let empName = item.employeeSurname ? item.employeeSurname : ''
          empName += item.employeeName ? ' ' + item.employeeName : ''
          if (item.receivedLastContactDate) {
            return (
              <>
                {empName} ({translate('businesscards.create-edit.receive-date')} : {item.receiveDate} {translate('businesscards.detail.label.lastContactDate')} : <span className="text-blue" onClick={() => props.onOpenPopupActivityDetail(item.activityId)}>{item.receivedLastContactDate}</span>)
                {idx !== items.length - 1 && <br />}
              </>
            )
          } else {
            return (
              <>
                {empName} ({translate('businesscards.create-edit.receive-date')} : {item.receiveDate})
                {idx !== items.length - 1 && <br />}
              </>
            )
          }
        })}
      </>
    )
    // }
  }

  const getFieldLinkHover = () => {
    return null;
  }

  const renderComponentDisplay = (fieldInfo: any) => {
    const text = getValueDataShow(fieldInfo)
    if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.LINK && _.isNil(fieldInfo.defaultValue)) {
      return <>
        {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && <a rel="noopener noreferrer" target="blank" href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.DISPLAY &&
          <><a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a> <iframe src={fieldInfo.urlTarget} height={fieldInfo.iframeHeight} width="100%" /></>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.EDIT && <a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
      </>
    } else if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.EMAIL && fieldInfo.isDefault) {
      return <a href={`mailto:${text}`}>{text}</a>
    } else if (fieldInfo.isLinkedGoogleMap && fieldInfo.isDefault) {
      return <a href={`http://google.com/maps/search/${text}`}>{text}</a>
    } else if (props.valueData.businessCardData && props.valueData.businessCardData.length > 0 && !text) {
      return <>{getDynamicData(fieldInfo, props.valueData.businessCardData, props.valueData, props.screenMode, props.businessCardId, handleClickFile)}</>
    } else if (props.valueData && text === "createdUser") {
      return renderLinkEmployee(props.valueData['createdUser'], props.valueData['createdUserName'], props.valueData['filePathCreatedUser'])
    } else if (props.valueData && text === "updatedUser") {
      return renderLinkEmployee(props.valueData['updatedUser'], props.valueData['updatedUserName'], props.valueData['filePathUpdatedUser'])
    } else if (props.valueData && text === "businessCardImagePath") {
      return <a className="color2" onClick={() => handleClickFile(props.valueData.businessCardImageName, props.valueData.businessCardImagePath)}>{props.valueData['businessCardImageName']}</a>
    } else if (props.valueData && text === "memo") {
      return <><FieldDetailViewTextArea text={props.valueData['memo']} /></>
    } else if (props.valueData && text === "companyName") {
      return <>{!props.valueData.customerId ? props.valueData.alternativeCustomerName : <a className="text-blue item" onClick={() => props.onOpenModalCustomerDetail(props.valueData.customerId)}>{props.valueData.customerName}</a>}</>
    } else if (props.valueData && text === "employeeId") {
      return renderReceiver(props.valueData.businessCardReceives.filter(item => item.employeeId));
    } else if (props.valueData && text === "lastContactDate") {
      return <a onClick={() => props.onOpenPopupActivityDetail(props.valueData.activityId)}>{props.valueData.lastContactDate ? convertDateToUserFormat(props.valueData.lastContactDate) : ''}</a>
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
      if (_.get(props, 'edittingField.fieldId') < 0 && _.isNil(props.edittingField.userModifyFlg)) {
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
      if (_.toString(props.fieldsInfo[0].fieldName) === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate || _.toString(props.fieldsInfo[0].fieldName) === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate) {
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
        idUpdate={props.businessCardId}
      />
    }
    return <></>
  }

  return renderComponent();
}

export default TabSummaryElement;
