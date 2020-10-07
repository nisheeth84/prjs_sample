import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScreenMode, ControlType, LINK_TARGET_IFRAME } from 'app/config/constants'
import StringUtils, { jsonParse } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { translate } from 'react-jhipster';
import { downloadFile } from 'app/shared/util/file-utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import FieldDisplayRow from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import * as R from 'ramda'
import { getFirstCharacter, getDynamicData } from 'app/shared/util/utils';
import { TypeMessage } from 'app/modules/products/constants';
import FieldDetailViewSelectOrg from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-select-org.tsx';
import { CUSTOMER_SPECIAL_LIST_FIELD } from '../../constants';
import SpecialDisplayTooltip from '../../list/special-render/special-display-tooltip';
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';

export interface TabSummaryEleProps {
  fieldsInfo?: any[],
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
  customerId?: any;
  showPopupEmployeeDetail?: (employeeId) => void;
  showCustomerDetail?: any;
  editingField: any;
  tenant?: any
}

/**
 * Render component tab summary element
 * @param props
 */
const TabSummaryElement: React.FC<TabSummaryEleProps> = (props) => {

  const [openPopupTaskDetail, setOpenPopupTaskDetail] = useState(false);
  const [taskIdSelected, setTaskIdSelected] = useState(null);

  const [openPopupSchedulesDetail, setOpenPopupSchedulesDetail] = useState(false);
  const [schedulesIdSelected, setSchedulesIdSelected] = useState(null);

  useEffect(() => {
    if (openPopupTaskDetail || openPopupSchedulesDetail) {
      document.body.className = 'wrap-task modal-open';
    }
    if (!openPopupTaskDetail && !openPopupSchedulesDetail) {
      document.body.className = 'wrap-customer modal-open';
    }
  }, [openPopupTaskDetail, openPopupSchedulesDetail])

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      if (props.onShowMessage) {
        props.onShowMessage(translate('messages.ERR_COM_0042', { 0: fileName }), TypeMessage.deleteWarning);
      }
    });
  }

  const getDataLinkisDefault = (field) => {
    const target = field.linkTarget === 0 ? 'blank' : '';
    if (field.urlType === 2) {
      return (
        <a rel="noopener noreferrer" target={target} href={field.urlTarget}>
          {field.urlText}
        </a>
      );
    } else if (field.urlType === 1) {
      let defaultVal = "";
      let defaultLabel = "";
      if (!_.isNil(props.valueData.url) && props.valueData.url !== '') {
        const jsonValue = jsonParse(props.valueData.url, {});
        defaultVal = jsonValue["url_target"] ? jsonValue["url_target"] : "";
        defaultLabel = jsonValue["url_text"] ? jsonValue["url_text"] : "";
      }
      return (
        <>
          {defaultVal ?
            <a rel="noopener noreferrer" target={target} href={defaultVal}>{defaultLabel ? defaultLabel : defaultVal}</a> : defaultLabel ? defaultLabel : ""
          }
        </>
      );
    }
  }

  const renderPopupTaskDetail = () => {
    return (
      <DetailTaskModal
        taskId={taskIdSelected}
        canBack={true}
        toggleCloseModalTaskDetail={() => setOpenPopupTaskDetail(false)} />
    )
  }

  const handleMoveScreenPopupTaskDetail = (taskId, fieldId?, fieldName?) => {
    setOpenPopupTaskDetail(true);
    setTaskIdSelected(taskId);
  }

  const renderPopupSchedulesDetail = () => {
    return (
      <div className="wrap-calendar calendar-tab-summary">
        <CalendarDetail
          detailId={schedulesIdSelected}
          onClosed={() => setOpenPopupSchedulesDetail(false)}
        />
      </div>
    )
  }

  const handleMoveScreenPopupSchedulesDetail = (schedulesId, fieldId?, fieldName?) => {
    setOpenPopupSchedulesDetail(true);
    setSchedulesIdSelected(schedulesId);
  }

  /**
   * Get value data
   */
  const getValueDataShow = (field) => {
    let text = '';
    const fieldName = StringUtils.snakeCaseToCamelCase(field.fieldName);
    if (fieldName === 'createdUser' || fieldName === 'updatedUser') {
      const employeeDetail = props.valueData[fieldName];
      return <div className="item">
        {employeeDetail && employeeDetail.employeeId > 0 &&
          <a onClick={() =>
            props.showPopupEmployeeDetail &&
            props.showPopupEmployeeDetail(employeeDetail.employeeId)}
          >
            {employeeDetail.fileUrl
              ? <img src={employeeDetail.fileUrl} alt="" className="user no-border"/>
              : <div className={"no-avatar green"}>
                {getFirstCharacter(employeeDetail.employeeName)}
              </div>
            }
            <span className="text-blue font-size-12">{employeeDetail.employeeName}</span>
          </a>}
      </div>;
    } else if (fieldName === 'personInCharge') {
      const personInChargeDetail = props.valueData[fieldName];
      const ogranizationValues = [];
      const item = {};
      item[`department_id`] = personInChargeDetail.departmentId;
      item[`employee_id`] = personInChargeDetail.employeeId;
      item[`group_id`] = personInChargeDetail.groupId;
      ogranizationValues.push(item)
      if (personInChargeDetail.departmentId === 0 && personInChargeDetail.employeeId === 0 && personInChargeDetail.groupId === 0) {
        return null
      }
      return <FieldDetailViewSelectOrg
        ogranizationValues={ogranizationValues}
        fieldInfo={field}
        recordId={props.customerId}
        controlType={ControlType.DETAIL_VIEW} />
    } else if (fieldName === 'customerLogo') {
      const file = props.valueData[fieldName];
      return file && <a className="file" onClick={() => handleClickFile(file.photoFileName, file.fileUrl)}>{file.photoFileName}</a>
    } else if (fieldName === "businessMainId") {
      if (props.screenMode === ScreenMode.EDIT) {
        text = R.path([`businessMainName`], props.valueData);
      } else {
        text = R.path([`businessMainName`], props.valueData) + translate("customers.list.dot") + R.path([`businessSubName`], props.valueData);
      }
    } else if (fieldName === "businessSubId") {
      text = R.path([`businessSubName`], props.valueData);
    } else if (fieldName === 'customerParent') {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => props.showCustomerDetail(R.path(['parentId'], props.valueData), props.customerId)}
        >{R.path(['parentName'], props.valueData)}</a>
      )
      // return props.showCustomerDetail(props.valueData);
    } else if (fieldName === 'customerAddress') {
      const addressName = R.path(['address'], props.valueData);
      const buildingName = R.path(['building'], props.valueData);
      const zipCode = R.path(['zipCode'], props.valueData);
      let addr = `${zipCode ? translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark') + zipCode : ''}`;
      addr = addr.concat(`${addressName ? (text ? (' ' + addressName) : addressName) : ''}`);
      addr = addr.concat(`${buildingName ? (text ? (' ' + buildingName) : buildingName) : ''}`);
      if (field.isLinkedGoogleMap) {
        return <a target="_blank" rel="noopener noreferrer" href={`http://google.com/maps/search/${addr}`}>{addr}</a>;
      } else {
        return <a>{addr}</a>
      }
    } else if (fieldName === 'actionNext') {
      const nextActions = R.path([`nextActions`], props.valueData);
      const rowData = {}
      rowData[`next_actions`] = nextActions;
      rowData[`customer_id`] = R.path([`customerId`], props.valueData);
      return <div className="text-over">
        {R.path(['next_actions'], rowData) &&
          <a key={R.path(['next_actions', 0, 'taskId'], rowData)}
            onClick={() => handleMoveScreenPopupTaskDetail(R.path(['next_actions', 0, 'taskId'], rowData))}
            target="_blank"
            rel="noopener noreferrer">
            {R.path(['next_actions', 0, 'taskName'], rowData)}
          </a>
        }
        {R.path(['next_actions'], rowData) && R.path(['next_actions'], rowData).length > 1 &&
          <SpecialDisplayTooltip
            rowData={rowData}
            tenant={props.tenant}
            fieldName={CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT}
            openPopupDetail={handleMoveScreenPopupTaskDetail}
          />}
        {openPopupTaskDetail && renderPopupTaskDetail()}
      </div>;
    } else if (fieldName === 'scheduleNext') {
      const rowData = {};
      rowData[`next_schedules`] = R.path([`nextSchedules`], props.valueData);
      rowData[`customer_id`] = R.path([`customerId`], props.valueData);
      return <div className="text-over">
        {R.path(['next_schedules'], rowData) &&
          <a key={R.path(['next_schedules', 0, 'schedulesId'], rowData)}
            onClick={() => handleMoveScreenPopupSchedulesDetail(R.path(['next_schedules', 0, 'schedulesId'], rowData))}
            target="_blank"
            rel="noopener noreferrer">
            {R.path(['next_schedules', 0, 'schedulesName'], rowData)}
          </a>
        }
        {R.path(['next_schedules'], rowData) && R.path(['next_schedules'], rowData).length > 1 &&
          <SpecialDisplayTooltip
            rowData={rowData}
            tenant={props.tenant}
            fieldName={CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT}
            openPopupDetail={handleMoveScreenPopupSchedulesDetail}
          />}
        {openPopupSchedulesDetail && renderPopupSchedulesDetail()}
      </div>;
    } else if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.URL) {
      return getDataLinkisDefault(field)
    } else {
      text = R.path([fieldName], props.valueData);
    }
    return text;
  }

  const renderComponentDisplay = (fieldInfo: any) => {
    const text = getValueDataShow(fieldInfo);
    if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.LINK && _.isNil(fieldInfo.defaultValue)) {
      return <>
        {/* {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && R.path(['url_target'], jsonParse(text + '')) &&
          <a rel="noopener noreferrer" target="blank" href={R.path(['url_target'], jsonParse(text + ''))}>
            {R.path(['url_text'], jsonParse(text + '')) ? R.path(['url_text'], jsonParse(text + '')) : R.path(['url_target'], jsonParse(text + ''))}
          </a>}
        {fieldInfo.linkTarget !== LINK_TARGET_IFRAME && !R.path(['url_target'], jsonParse(text + '')) &&
          R.path(['url_text'], jsonParse(text + ''))
        }
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.DISPLAY &&
          <><a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a> <iframe src={fieldInfo.urlTarget} height={fieldInfo.iframeHeight} width="100%" /></>}
        {fieldInfo.linkTarget === LINK_TARGET_IFRAME && props.screenMode === ScreenMode.EDIT && <a href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>} */}
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
    } else if (props.valueData.customerData && props.valueData.customerData.length > 0 && !text) {
      const filterCustomerData = props.valueData.customerData.filter(it => !(_.toString(it.fieldType) === DEFINE_FIELD_TYPE.TIME && it.value === ''))
      return <>{getDynamicData(fieldInfo, filterCustomerData, props.valueData, props.screenMode, props.customerId, handleClickFile)}</>
    } else if (_.toString(fieldInfo.fieldType) === DEFINE_FIELD_TYPE.DATE_TIME) {
      return <> {utcToTz(text + '', DATE_TIME_FORMAT.User)}</>;
    } else {
      // const fieldLink = getFieldLinkHover();
      const isArray = Array.isArray(getValueProp(props.valueData, fieldInfo.fieldName)) && typeof getValueProp(props.valueData, fieldInfo.fieldName)[0] !== 'object'
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CHECKBOX
        && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
      if (isArray) {
        const display = [];
        const records = getValueProp(props.valueData, fieldInfo.fieldName);
        records.forEach(e => {
          display.push(<>{e}</>);
        })
        return <>{display}</>
      } else {
        return <>{text}</>;
      }
    }
  }

  const onExecuteAction = (fieldInfo, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (!props.onDeleteFields) {
        return;
      }
      if (_.get(props, 'edittingField.fieldId') < 0 && !_.isNil(props.editingField) && _.isNil(props.editingField.userModifyFlg)) {
        props.onShowMessage(translate('messages.ERR_COM_0042'), TypeMessage.deleteWarning);
      } else {
        props.onDeleteFields(fieldInfo)
        if (_.get(props, 'edittingField.fieldId') === fieldInfo.fieldId) {
          props.openDynamicSelectFields(SettingModes.CreateNewInput, fieldInfo)
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
      if (props.screenMode === ScreenMode.DISPLAY && props.fieldsInfo[0].fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        const labelObj = jsonParse(props.fieldsInfo[0].fieldLabel);
        labelObj['en_us'] = translate('customers.detail.label.business');
        labelObj['ja_jp'] = translate('customers.detail.label.business');
        labelObj['zh_cn'] = translate('customers.detail.label.business');
        props.fieldsInfo[0].fieldLabel = JSON.stringify(labelObj);
      }
      return <><FieldDisplayRow
        fieldInfo={props.fieldsInfo}
        listFieldInfo={props.fields}
        controlType={ControlType.DETAIL_VIEW}
        isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
        renderControlContent={renderComponentDisplay}
        onExecuteAction={onExecuteAction}
        moveFieldCard={props.onDragOrderField}
        addFieldCard={props.onDropNewField}
        fieldIdsHighlight={props.fieldHighlight}
        idUpdate={props.customerId}
      /></>
    }
    return <></>
  }

  return renderComponent();
}

export default TabSummaryElement;
