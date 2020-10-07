import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { GetActivity } from '../models/get-activity-type';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import ActivityTabInfoElement from './activity-tab-info-element';
import { ScreenMode, ControlType, FIELD_BELONG } from 'app/config/constants';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { SPECIAL_FIELD_NAMES as specialFName, PRODUCT_SPECIAL_FIELD_NAMES, TAB_ID_LIST, specialFieldsProductTrading } from '../constants';
import CustomDynamicList from '../custom-common/custom-dynamic-list';
import { getValueProp } from 'app/shared/util/entity-utils';
import SpecialEditList from '../special-item/special-edit-list';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import { processDragNewField, sortOrderFields, buildDoubleColumn, processDragDropFields, processDeleteFields, isFieldDisplayNormal } from 'app/shared/util/utils';
import { translate } from 'react-jhipster';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import { useId } from "react-id-generator";
import ActivityTabHistory from './activity-tab-history';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import EmployeeName, { IEmployeeNameProps } from 'app/shared/layout/common/EmployeeName';

// const specialFields = {
//   createdDate: 'created_date',
//   createdUser: 'created_user',
//   updatedDate: 'updated_date',
//   updatedUser: 'updated_user',
//   nextScheduleId: 'next_schedule_id',
//   memo: 'memo',
//   scenarioId: 'scenario_id'
// }

export interface IActivityTabInfoProp {
  tab: number;
  countSave?: any;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  fieldEdit?: any;
  openDynamicSelectFields?: (settingMode, fieldEdit) => void;
  isSaveField?: boolean;
  destroySaveField?: () => void;
  paramsEdit?: any;
  onSaveField?: (fields, params, fieldEdit) => { listField, deleteFields };
  iconFunction?: string,
  showModal?: boolean;
  screenMode: any;
  conditionSearch?: any[],
  handleReorderField: (dragIndex, dropIndex) => void;
  summaryFields?: any;
  editedFields?: any[];
  tabList?: any;
  onShowMessage?: (message, type) => void;
  activityDetail: GetActivity;
  openDetal?: (id, isProductSet) => void;
  activityId?: any;
  fieldsUnavailable: any[];
  deletedFields?: any[];
  edittingField: any;
  onSelectDislaySummary?: any;
  addFieldUnavailable?: (field) => void;
}

/**
 * component for show tab info activity
 */
const ActivityTabInfo = forwardRef((props: IActivityTabInfoProp, ref) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const fieldTabRef = useRef(null)
  const customDynamicListRef = useRef(null);
  const [listProduct, setListProduct] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([])
  const [tabList, setTabList] = useState([])
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const customerDetailCtrlId = useId(1, "activityTabInfoCustomerDetailCtrlId_");

  useEffect(() => {
    if (props.tabList && props.tabList.length > 0) {
      setTabList(props.tabList)
    }
  }, [props.tabList])

  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.activityDetail.fieldInfoActivity)
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  /**
   * on drop new field
   * @param dragItem
   * @param dropId
   * @param isDoubleColumn
   * @param isAddLeft
   */
  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    if(!_.isNil(dragItem.fieldBelong) && dragItem.fieldBelong !== FIELD_BELONG.ACTIVITY)
      return;
      
    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable)
    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.activityDetail.fieldInfoActivity)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  /**
   * on delete fields
   * @param fieldInfo
   */
  const onDeleteFields = (fieldInfo) => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields)
    const objParams = sortOrderFields(fieldsAfterDelete, props.activityDetail.fieldInfoActivity)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex(e => e === fieldInfo.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }


  const onShowDetialCustomer = (_customerId) => {
    setCustomerId(_customerId);
    setShowCustomerDetail(true);
  }
  
  const onClosePopupCustomerDetail = () =>{
    setShowCustomerDetail(false);
    document.body.className = 'wrap-activity modal-open'
  }

  const renderTableField = (row: any[], key: any, mode?: any) => {
    return (
      <ActivityTabInfoElement
        key={key}
        fieldsInfo={row}
        screenMode={mode ? mode : props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.activityDetail.activities}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        activityId={props.activityId}
        onShowDetialCustomer={onShowDetialCustomer}
        edittingField={props.edittingField}
      />
    )
  }

  const renderContentTab = (listFieldContent: any[]) => {
    const rowRecordsTabContent = buildDoubleColumn(listFieldContent, props.screenMode)
    return (
      <>
        {rowRecordsTabContent &&
          <table className={`table-default table-content-div ${props.screenMode === ScreenMode.EDIT ? 'cursor-df' : ''}`}>
            <tbody>
              {rowRecordsTabContent.map((row, i) => {
                return renderTableField(row, i)
              })}
            </tbody>
          </table>
        }
      </>
    )
  }

  const isFieldCanDisplay = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return true;
    }
    if (_.isNil(field.relationData) || field.relationData.asSelf !== 1) {
      return true
    }
    return false;
  }


  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    },
    getCurrentFieldInfoProductSet() {
      if(customDynamicListRef && customDynamicListRef.current && customDynamicListRef.current.getCurrentFieldInfoProductSet)
        return customDynamicListRef.current.getCurrentFieldInfoProductSet();
      else 
        return [];
    },
    getDeleteFieldInfoProductSet() { 
      if (customDynamicListRef && customDynamicListRef.current && customDynamicListRef.current.getDeleteFieldInfoProductSet)
        return customDynamicListRef.current.getDeleteFieldInfoProductSet();
      else
        return [];
    },
    onDynamicFieldPopupExecuteActionForCommonProduct(fieldInfo, actionType, params) {
      if (customDynamicListRef && customDynamicListRef.current && customDynamicListRef.current.onDynamicFieldPopupExecuteAction)
        customDynamicListRef.current.onDynamicFieldPopupExecuteAction(fieldInfo, actionType, params);
    },
    resetFieldInfoProductSet() {
      if(customDynamicListRef?.current?.resetFieldInfoProductSet) {
        customDynamicListRef.current.resetFieldInfoProductSet();
      }
    }
  }));

  /* _________________Custom Dynamic_________________ */

  const openProductDetail = useCallback(
    productId => {
      props.openDetal(productId, TYPE_DETAIL_MODAL.PRODUCT);
    },
    [props.openDetal]
  );


  /**
 * modify fields, add inTab
 *
 */
  useEffect(() => {
    if (_.isNil(fields)) {
      return;
    }
    const fieldTabs = fields.filter(e => _.toString(e.fieldType) === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = fields.filter(e => isFieldDisplayNormal(e));

    fieldTabs.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e)
          if (idx >= 0) {
            fieldNormals.splice(idx, 1)
          }
        })
      }
    })
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals)
  }, [fields])


  useEffect(() => {
    setFirst(true);
    setShouldRender(true);
    if (!props.summaryFields) {
      props.onChangeFields(_.cloneDeep(props.activityDetail.fieldInfoActivity), [], []);
    } else {
      setListFieldIdEdited(props.editedFields)
    }
    return () => { setFirst(false); setFields(null); }
  }, []);

  useEffect(() => {
    if (props.editedFields) {
      setListFieldIdEdited(props.editedFields)
    }
  }, [props.editedFields])

  useEffect(() => {
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable])

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields])

  useEffect(() => {
    if (props.isSaveField) {
      const saveFieldResult = props.onSaveField(_.cloneDeep(fields), props.paramsEdit, props.fieldEdit)
      const deleteFieldTmp = saveFieldResult.deleteFields;
      const listFieldTmp = saveFieldResult.listField;
      const arrFieldDel = _.cloneDeep(deletedFields)
      if (saveFieldResult) {
        arrFieldDel.push(...deleteFieldTmp)
        setDeleteFields(arrFieldDel);
        setFields(listFieldTmp);
      }
      const idx = listFieldIdEdited.findIndex(e => e === props.fieldEdit.fieldId)
      if (idx < 0) {
        listFieldIdEdited.push(props.fieldEdit.fieldId)
      }
      listFieldTmp.forEach((field) => {
        if(!_.isNil(field.oldField) && idx < 0) {
          listFieldIdEdited.push(field.fieldId);
        }
      })
      props.onChangeFields(listFieldTmp, arrFieldDel, listFieldIdEdited);
      props.destroySaveField();
    }
  }, [props.isSaveField])

  useEffect(() => {
    if (props.activityDetail) {
      let listField
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(_.orderBy(props.activityDetail.fieldInfoActivity, 'fieldOrder', 'asc'))
      } else {
        listField = _.cloneDeep(_.orderBy(props.activityDetail.fieldInfoActivity, 'fieldOrder', 'asc'));
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter(e => isFieldCanDisplay(e)));
      }
      setFields(sortOrderFields(tmp, props.activityDetail.fieldInfoActivity))
      
      setListProduct(_.clone(props.activityDetail?.activities?.productTradings) || []);
    }
  }, [props.activityDetail, props.summaryFields, props.screenMode]);


  useEffect(() => {
    const listField = sortOrderFields(props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(_.orderBy(props.activityDetail.fieldInfoActivity, 'fieldOrder', 'asc')), props.activityDetail.fieldInfoActivity)
    setFields(listField.filter(e => isFieldCanDisplay(e)))
  }, [props.summaryFields])


  const onExecuteAction = (fieldInfo, actionType) => {
    if (actionType === DynamicControlAction.DELETE) {
      if (onDeleteFields) {
        onDeleteFields(fieldInfo)
      }
    } else if (actionType === DynamicControlAction.EDIT) {
      if (props.openDynamicSelectFields) {
        props.openDynamicSelectFields(SettingModes.EditInput, fieldInfo)
      }
    }
  }

  const ignoreDuplicate = () => {
    const records = [];
    records.push(...listFieldNormal);
    let isRenderedActivityDuration = false;
    let isRenderedReportTarget = false;
    let isRenderedInterview = false;
    for (let index = 0; index < records.length; index++) {
      const element = records[index];
      if (element.fieldName === specialFName.activityDuration
        || element.fieldName === specialFName.activityStartTime
        || element.fieldName === specialFName.activityEndTime
        || element.fieldName === specialFName.activityTime) {
        if (!isRenderedActivityDuration) {
          isRenderedActivityDuration = true;
        } else {
          records.splice(index, 1);
          index--;
        }
      } else if (element.fieldName === specialFName.taskId
        || element.fieldName === specialFName.milestoneId
        || element.fieldName === specialFName.scheduleId
        || element.fieldName === specialFName.activityTargetId) {
        if (!isRenderedReportTarget) {
          isRenderedReportTarget = true;
        } else {
          records.splice(index, 1);
          index--;
        }
      } else if (element.fieldName === specialFName.interviewer
        || element.fieldName === specialFName.businessCardId) {
        if (!isRenderedInterview) {
          isRenderedInterview = true;
        } else {
          records.splice(index, 1);
          index--;
        }
      }
    }
    return records;
  }

  const isShowScenario = (e) => {
    return e.fieldName !== 'scenario_id' ? true : props.screenMode === ScreenMode.EDIT;
  }

  const getSplitRecord = (mode: number) => {
    const _files = ignoreDuplicate();
    const records = [];
    if (mode === 0) {
      records.push(..._files.filter(e => isShowScenario(e)));
      // records.push(...listFieldNormal.filter(e => !specialFields[StringUtils.snakeCaseToCamelCase(e.fieldName)]));
    } else if (mode < 0) {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(..._files.filter(e => e.fieldOrder < listFieldTab[0].fieldOrder && isShowScenario(e)))
    } else {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(..._files.filter(e => e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder && isShowScenario(e)));
    }
    return buildDoubleColumn(records, props.screenMode);
  }


  // const getSpecialField = () => {
  //   const records = [];
  //   records.push(...listFieldNormal.filter(e => specialFields[StringUtils.snakeCaseToCamelCase(e.fieldName)]));
  //   return buildDoubleColumn(records);
  // }


  /* _________________Render_________________ */
  const onUpdateFieldValue = (itemData, type, itemEditValue) => {  };

  const getPropsOfEmployeeNameComponent = (data: { employeeName: string, employeeSurname: string, employeePhoto: any, employeeId: string | number }): IEmployeeNameProps => {
    const userName = (data.employeeSurname || '') + " " + (data.employeeName || " ")
    return {
      userName,
      userImage: data.employeePhoto?.fileUrl,
      employeeId: data.employeeId,
      sizeAvatar: 30,
      backdrop: false,
      width: 190
    }
  }

  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${field.fieldId}`;

    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
      if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
        return (
          <div id={cellId} className="break-space">
            {rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].map((item, idx) => {
              if (idx < rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].length - 1) {
                return <a>{item.productName}, </a>;
              } else {
                return <a>{item.productName}</a>;
              }
            })}
          </div>
        );
      }
    } else  if (field.fieldName === specialFieldsProductTrading.employeeId) {
      return (
        // <div id={cellId} style={{ whiteSpace: 'break-spaces' }}>
          <div className="ml-8px">
            <EmployeeName {...getPropsOfEmployeeNameComponent(rowData?.employee)}/>
          </div>
        // </div>
      );
    } else  if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy) {
      return (
          <div className="ml-8px">
            <EmployeeName {...getPropsOfEmployeeNameComponent(rowData?.createdUser)}/>

          </div>
      );
    } else  if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
      return (
          <div className="ml-8px">
            <EmployeeName {...getPropsOfEmployeeNameComponent(rowData?.updatedUser)} />
          </div>
      );
    } else {

      return (
        <SpecialEditList
          valueData={rowData}
          itemData={field}
          extensionsData={() => { }}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          mode={mode}
        />
      );
    }
  };

  const renderListProductOfSet = () => {
    return (
      <>
        {props.activityDetail?.activities?.productTradings && props.activityDetail?.activities?.productTradings.length > 0 && (
          <div className={'products-sets-wrap wrap-control-esr table-list-wrap h-auto p-0'}>
            <CustomDynamicList
              ref={customDynamicListRef}
              products={listProduct}
              fieldInfoProductSet={props.activityDetail?.fieldInfoProductTrading}
              screenMode={props.screenMode}
              customContentField={renderCellSpecial}
              onUpdateFieldValue={onUpdateFieldValue}
              onExecuteAction={onExecuteAction}
              openProductDetail={openProductDetail}
              onShowDetail={props.openDetal}
              isSetting={true}
              addFieldUnavailable={props.addFieldUnavailable}
            />
          </div>)}
      </>
    )
  }

  const renderTabHistory = () => {
    if (!tabList || tabList.length === 0) {
      return <></>
    }
    const itemTabHistories = tabList.find(x=> x.tabId === TAB_ID_LIST.changeHistory);
    return (
      <>
        {(props.screenMode === ScreenMode.EDIT || itemTabHistories.isDisplaySummary) && (
          <div className="form-group no-margin mt-4">
            <label>{translate('activity.activityDetail.tab-history')}</label>
          </div>
        )}  
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...itemTabHistories} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
        )}
        {itemTabHistories.isDisplaySummary && (
          <ActivityTabHistory
          fieldInfoActivity={props.activityDetail.fieldInfoActivity}
          activityId={props.activityId}
          tab={props.tab}
          maxRecord={itemTabHistories.maxRecord}
          />
          )}
      </>
    );
  }

  const recordBefore = getSplitRecord(-1)
  const recordAfter = getSplitRecord(1);
  const recordAll = getSplitRecord(0);
  // const specials = getSpecialField();
  return (
    <>
      <div className={"tab-pane active"}>
        {recordBefore.length > 0 &&
          <table className="table-default table-content-div cursor-df">
            <tbody>
              {recordBefore.map((row, i) => {
                if (row[0].fieldOrder > listFieldTab[0].fieldOrder) {
                  return <></>
                }
                return renderTableField(row, i)
              }
              )}
            </tbody>
          </table>
        }
        {listFieldTab && listFieldTab.length > 0 &&
        <>
          {props.screenMode === ScreenMode.DISPLAY && <br/>}
          <FieldDisplayRow
            fieldInfo={listFieldTab[0]}
            listFieldInfo={fields}
            controlType={ControlType.DETAIL_VIEW}
            isDisabled={!props.screenMode || props.screenMode === ScreenMode.DISPLAY}
            renderControlContent={renderContentTab}
            onExecuteAction={onExecuteAction}
            moveFieldCard={onDragOrderField}
            addFieldCard={onDropNewField}
            fieldIdsHighlight={listFieldIdEdited}
          />
          {props.screenMode === ScreenMode.DISPLAY && <br/>}
        </>
        }
        {recordAfter.length > 0 &&
          <table className="table-default table-content-div cursor-df">
          <tbody>
            {recordAfter.map((row, i) => {
              if (row[0].fieldOrder < listFieldTab[listFieldTab.length - 1].fieldOrder) {
                return <></>
              }
                return renderTableField(row, i)
              }
            )}
          </tbody>
        </table>
        }
        {listFieldTab && listFieldTab.length === 0 &&
          <table className={`table-default table-content-div cursor-df`}>
            <tbody>
              {recordAll.map((row, i) => { return renderTableField(row, i, props.screenMode) })}
            </tbody>
          </table>
        }
        <FieldDisplayRowDragLayer />
      </div>
      {renderListProductOfSet()}
      {renderTabHistory()}
      {
        showCustomerDetail && 
        <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          openFromModal={true}
          showModal={true}
          customerId={customerId}
          listCustomerId={[]}
          openFromMilestone={false}
          displayActivitiesTab={false}
          toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
          openFromOtherServices={false}
        />
      }
    </>
  );
})

export default ActivityTabInfo;
