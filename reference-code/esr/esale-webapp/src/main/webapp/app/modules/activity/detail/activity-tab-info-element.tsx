import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import StringUtils, { getFieldLabel, autoFormatNumber } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster'
import { ScreenMode, LINK_TARGET_IFRAME, ControlType } from 'app/config/constants';
import { downloadFile } from 'app/shared/util/file-utils';
import { Link } from 'react-router-dom';
import { RESPONSE_FIELD_NAME } from 'app/modules/activity/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { handleShowDetail } from '../list/activity-list-reducer';
import { TYPE_DETAIL_MODAL } from '../constants';
import { showModalSubDetail } from 'app/modules/calendar/modal/calendar-modal.reducer'
import { CommonUtil } from '../common/common-util';
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import { getDynamicData } from 'app/shared/util/utils';
import TooltipProductTrading from 'app/modules/activity/list/item-list/tooltip-product-trading';
import { calculate } from 'app/shared/util/calculation-utils';

type IActivityTabInfoElementProp = StateProps & DispatchProps & {
  screenMode;
  onShowMessage?: (message, type) => void;
  valueData?: any;
  activityId?: any;
  onDragOrderField?: (dragId, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => void
  onDropNewField: (dragItem: object, dropId: number, isDoubleColumn: boolean, isAddLeft: boolean) => void
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  onDeleteFields: (fieldId) => void;
  fieldsInfo?: any[];
  fieldHighlight?: number[];
  listTab?: any;
  fields?: any;
  edittingField: any;
  onShowDetialCustomer?: (customerId: number) => void;
}

export enum TypeMessage {
  downloadFileError,
  deleteWarning
}

/**
 * component for show element info activity
 * @param props
 */
const ActivityTabInfoElement = (props: IActivityTabInfoElementProp) => {

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      if (props.onShowMessage) {
        props.onShowMessage(translate('messages.ERR_COM_0042', { 0: fileName }), TypeMessage.deleteWarning);
      }
    });
  }

  const renderScheduleTaskMilestone = () => {
    let objectId, type, textValue;
    if (props.valueData?.schedule?.scheduleId) {
      objectId = props.valueData?.schedule?.scheduleId;
      textValue = props.valueData?.schedule?.scheduleName;
      type = TYPE_DETAIL_MODAL.SCHEDULE;
    } else if (props.valueData?.milestone?.milestoneId) {
      objectId = props.valueData?.milestone?.milestoneId;
      textValue = props.valueData?.milestone?.milestoneName;
      type = TYPE_DETAIL_MODAL.MILESTONE
    } else {
      objectId = props.valueData?.task?.taskId;
      textValue = props.valueData?.task?.taskName;
      type = TYPE_DETAIL_MODAL.TASK;
    }

    return (
      <div className="text-blue">
        <a onClick={() => { props.handleShowDetail(objectId, type, `ActivityDetail_${props.activityId}`, true) }}>
          {textValue}
        </a>
      </div>

    )
  }

  const renderEmployee = (employee) => {
      if (employee) {
        return <div className="ml-8px">
          <EmployeeName
            userName={(employee?.employeeSurname || '') + " " + (employee?.employeeName || '')}
            userImage={employee?.employeePhoto?.fileUrl}
            employeeId={employee?.employeeId}
            sizeAvatar={30}
            backdrop={false}
          ></EmployeeName>
        </div>
      }
  }

    /**
   * get data of field
   * @param field 
   * @param fieldName 
   * @param fieldCamelCase 
   */
  const getDataValue = (field, fieldName, fieldCamelCase) => {
    let fieldValue = '';
    if (props.valueData.activityData) {
      fieldValue = getDynamicData(field, props.valueData.activityData, props.valueData, props.screenMode, props.activityId, handleClickFile)
    }
    if (!fieldValue && props.valueData[fieldCamelCase]) {
      fieldValue = props.valueData[fieldCamelCase];
    }
    return fieldValue;
  }

  const getIconPath = (scheduleType) => {
    if(!_.isNil(scheduleType)){
      if(scheduleType.iconType === 0 || (scheduleType.iconPath && scheduleType.iconPath.includes('http'))) {
        return `${scheduleType.iconPath}`
      } else {
        return `../../../../content/images/common/calendar/${scheduleType.iconName}`
      }
    }
    return "";
  }


  const getValueDataShow = (field) => {
    let text = null;
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);
    if (fieldName === RESPONSE_FIELD_NAME.ACTIVITY_FORMAT_ID) {
      // field.fieldItems.map((item) => {
      //   if (item.itemId === props.valueData.languageId) {
      //     text = item.itemLabel;
      //   }
      // })
      text = getFieldLabel(props.valueData, "name");
    } else if (fieldName === RESPONSE_FIELD_NAME.ACTIVITY_TIME
      || fieldName === RESPONSE_FIELD_NAME.ACTIVITY_START_TIME
      || fieldName === RESPONSE_FIELD_NAME.ACTIVITY_END_TIME) {
      // if(!isRenderedActivityDuration){
        // isRenderedActivityDuration = true;
        text = `${CommonUtil.convertToDate(props.valueData['contactDate'])}(${props.valueData['activityDuration']}${translate('activity.modal.minute')})`;
      // }
    } else if (fieldName === RESPONSE_FIELD_NAME.CONTACT_DATE) {
      text = `${CommonUtil.convertToDate(props.valueData['contactDate'])}`;
    } else if (fieldName === RESPONSE_FIELD_NAME.EMPLOYEE_ID) {
      return <>{renderEmployee(props.valueData['employee'])}</>;
    } else if (fieldName === RESPONSE_FIELD_NAME.CUSTOMER_ID) {
      text = props.valueData?.customer?.customerName;
      return <a className="w-100 d-block"
        onClick={() => { props.onShowDetialCustomer && props.onShowDetialCustomer(props.valueData?.customer?.customerId) }}>
        {text}
      </a>;
    } else if (fieldName === RESPONSE_FIELD_NAME.CUSTOMER_RELATION_ID) {
      const customerRelation = props.valueData['customerRelations'];
      if (customerRelation && customerRelation.length > 0) {
        return <div className="text-blue">
          {customerRelation.map((e) => {
            return <a className="w-100 d-block"
              onClick={() => { props.onShowDetialCustomer && props.onShowDetialCustomer(e.customerRelationId) }}
              key={`customer_relation_${e.customerRelationId}`}>
              {e.customerName}
            </a>;
          })}
        </div>
      } else {
        return <></>;
      }
    } else if (fieldName === RESPONSE_FIELD_NAME.ACTIVITY_TARGET_ID) {
      return <>{renderScheduleTaskMilestone()}</>;
    } else if (fieldName === RESPONSE_FIELD_NAME.INTERVIEWER) {
      return <>
        {props.valueData?.businessCards?.map((e) => {
          return <a className="w-100 d-block text-blue-activi"
            onClick={() => { props.handleShowDetail(e.businessCardId, TYPE_DETAIL_MODAL.BUSINESS_CARD, `ActivityDetail_${props.activityId}`) }}
            key={`businessCard_${e.businessCardId}`}>
            {(e.firstName || '') + " " + (e.lastName || '')}
          </a>;
        })}
        {props.valueData?.interviewer?.map((e, idx) => {
          return <span className="w-100 d-block"
            key={`interviewer_${idx}`}>
            {e}
          </span>;
        })}
      </>
    } else if (fieldName === RESPONSE_FIELD_NAME.CREATED_USER) {
      return <>{renderEmployee(props.valueData['createdUser'])}</>;
    } else if (fieldName === RESPONSE_FIELD_NAME.UPDATED_USER) {
      return <>{renderEmployee(props.valueData['updatedUser'])}</>;
    } else if (fieldName === RESPONSE_FIELD_NAME.CREATED_DATE) {
      text = CommonUtil.convertToDate(props.valueData?.createdUser?.createdDate) + ' ' + CommonUtil.convertToTime(props.valueData?.createdUser?.createdDate);
    } else if (fieldName === RESPONSE_FIELD_NAME.UPDATED_DATE) {
      text = CommonUtil.convertToDate(props.valueData?.updatedUser?.updatedDate) + ' ' + CommonUtil.convertToTime(props.valueData?.updatedUser?.updatedDate);
    } else if (fieldName === RESPONSE_FIELD_NAME.NEXT_SCHEDULE_ID) {
      const idx = props?.fieldsInfo?.indexOf(field)
      const nextSchedule = props.valueData.nextSchedules;
      const customerName = nextSchedule?.customer?.customerName;
      let productTradingName = null;
      if(nextSchedule?.productTradings?.length > 0){
        const names = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule?.productTradings, 'productTradingName');
        productTradingName = _.join(names, ",");
      }
      const isHasOne = !_.isNil(customerName) || !_.isNil(productTradingName);
      const isHasAll = !_.isNil(customerName) && !_.isNil(productTradingName);
      return <>
      { ( nextSchedule && nextSchedule?.scheduleId )&& <>
        <a className="text-blue" onClick={() => { props.handleShowDetail(nextSchedule.scheduleId, TYPE_DETAIL_MODAL.SCHEDULE, `ActivityDetail_${props.activityId}`) }}>{CommonUtil.convertToDate(nextSchedule.startDate)}</a>&nbsp;
        <img className="icon-calendar-person ml-1" src={getIconPath(nextSchedule.scheduleType)} onClick={()=>{props.handleShowDetail(nextSchedule.scheduleId, TYPE_DETAIL_MODAL.SCHEDULE, `ActivityDetail_${props.activityId}`) }} />
        <a className="ml-1 text-blue"  onClick={()=>{props.handleShowDetail(nextSchedule.scheduleId, TYPE_DETAIL_MODAL.SCHEDULE, `ActivityDetail_${props.activityId}`) }} >
            <span>{nextSchedule.scheduleName}</span>
            {isHasOne ? `(${customerName || ''}` : '' }
            {`${isHasAll ? '／' : ''}`}
            <TooltipProductTrading data={nextSchedule?.productTradings} idCaller={`ActivityDetail_${props.activityId}`} fieldOrderInRow={idx}/>
            {`${isHasOne ? ')' : ''}`}
        </a>
      </>
      }
      </>
    }
    else {
      text =  getDataValue(field, field.fieldName, fieldName);
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
        {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && <a rel="noopener noreferrer" target="blank" href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.DISPLAY && <iframe src={fieldInfo.urlTarget} height={fieldInfo.iframeHeight} width="100%" />}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.EDIT && <a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
      </>
    } else if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.EMAIL && fieldInfo.isDefault) {
      return <a href={`mailto:${text}`}>{text}</a>
    } else if (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return <>{autoFormatNumber(calculate(fieldInfo.configValue, props.valueData, fieldInfo.decimalPlace),fieldInfo.decimalPlace)}</>
    } else if (fieldInfo.isLinkedGoogleMap && fieldInfo.isDefault) {
      return <a href={`http://google.com/maps/search/${text}`}>{text}</a>
    } else if (props.valueData.activityData && props.valueData.activityData.length > 0 && !text) {
      return <> {
        getDynamicData(fieldInfo, props.valueData.activityData, props.valueData, props.screenMode, props.activityId, handleClickFile)
      }
      </>
    } else {
      const fieldLink = getFieldLinkHover();
      const isArray = Array.isArray(getValueProp(props.valueData, fieldInfo.fieldName)) && typeof getValueProp(props.valueData, fieldInfo.fieldName)[0] !== 'object'
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CHECKBOX
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX
        && _.toString(fieldInfo.fieldName) !== RESPONSE_FIELD_NAME.INTERVIEWER
        && _.toString(fieldInfo.fieldName) !== RESPONSE_FIELD_NAME.CUSTOMER_RELATION_ID;
      if (isArray) {
        const display = [];
        const records = getValueProp(props.valueData, fieldInfo.fieldName);
        records.forEach((e) => {
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

      let idxScenario = -1;
      props.fieldsInfo.forEach((element, idx) => {
        if(element.fieldName === RESPONSE_FIELD_NAME.SCENARIO){
          idxScenario = idx;
        }
      });
      const _fields = props.fieldsInfo;

      if(idxScenario > 0 && props.screenMode === ScreenMode.DISPLAY){
        _fields.splice(idxScenario,1);
      }

      return <FieldDisplayRow
        fieldInfo={_fields}
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
        idUpdate={props.activityId}
      />
    }
    return <></>
  }

  return renderComponent();
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  handleShowDetail,
  showModalSubDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityTabInfoElement);
