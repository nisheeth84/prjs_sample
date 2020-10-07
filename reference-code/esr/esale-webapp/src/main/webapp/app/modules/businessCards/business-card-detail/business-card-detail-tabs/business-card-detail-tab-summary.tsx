import _ from 'lodash';
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { connect, Options } from 'react-redux';
import { ScreenMode, ControlType } from 'app/config/constants';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { translate } from 'react-jhipster';
import TabSummaryElement from './business-card-detail-tab-summary-element';
import { TAB_ID_LIST } from '../../constants';
import { DynamicControlAction, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import TabActivityHistory from './business-card-detail-tab-activity-history';
import { sortOrderFields, processDragDropFields, processDeleteFields, processDragNewField, buildDoubleColumn, isFieldDisplayNormal } from 'app/shared/util/utils';
import { showListGrid, optionShowAll, handleInitData, onChangeLocalNavigation } from 'app/modules/calendar/grid/calendar-grid.reducer';
import GridCalendar from 'app/modules/calendar/grid/calendar-grid';
import { TabForcus } from 'app/modules/calendar/constants';

export interface IPopupTabSummary extends DispatchProps, StateProps {
  iconFunction?: string,
  showModal?: boolean;
  businessCard: any;
  businessCardAllFields?: any;
  screenMode: any;
  conditionSearch?: any[],
  editedFields?: any[];
  handleReorderField: (dragIndex, dropIndex) => void;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  destroySaveField?: () => void;
  isSaveField?: boolean;
  summaryFields?: any;
  paramsEdit: any;
  fieldEdit: any;
  tabList?: any;
  onShowMessage?: (message, type) => void;
  onSaveField?: (fields, params, fieldEdit) => { listField, deleteFields };
  businessCardId?: any;
  countSave?: any
  onSelectDislaySummary?: any
  deletedFields?: any[];
  edittingField: any;
  fieldsUnavailable: any[];

  // for tab activity
  activities?: any[];
  currentTab?
  onOpenModalEmployeeDetail?
  onOpenModalCustomerDetail?
  onOpenPopupTaskDetail?
  onOpenPopupBusinessCardTransfer?
  onOpenPopupActivityDetail?
  onOpenPopupMileStoneDetail?
  onOpenPopupCreateActivity?
  handleInitDataBusinessCard?

  // for tab calendar
  customerIds?: number[]
  hasLoginUser?: boolean
}

const TabSummary = forwardRef((props: IPopupTabSummary, ref) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [fields, setFields] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([])

  const fieldTabRef = useRef(null)

  const isFieldCanDisplay = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return true;
    }
    if (_.isNil(field.relationData) || field.relationData.asSelf !== 1) {
      return true
    }
    return false;
  }

  useEffect(() => {
    setFirst(true);
    setShouldRender(true);
    if (!props.summaryFields) {
      props.onChangeFields(_.cloneDeep(props.businessCard.fieldInfo), [], []);
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
    if (props.businessCard) {
      let listField = null
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(props.businessCard.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }))
      } else {
        listField = _.cloneDeep(props.businessCard.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }));
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter(e => isFieldCanDisplay(e)));
      }
      setFields(sortOrderFields(tmp, props.businessCardAllFields))
    }
  }, [props.businessCard, props.summaryFields, props.screenMode]);

  useEffect(() => {
    fields.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach((fieldInTab) => {
          fields.forEach((item) => {
            if (item.fieldId === fieldInTab) {
              if (!_.isNil(item.inTab)) {
                item.inTab = true
              } else {
                Object.assign(item, { inTab: true });
              }
            } else {
              if (_.isNil(item.inTab)) {
                Object.assign(item, { inTab: false });
              }
            }
          })
        })
      }
    })
  }, [fields])

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
    const listField = sortOrderFields(props.summaryFields ? props.summaryFields.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) }) : _.cloneDeep(props.businessCard.fieldInfo.sort((a, b) => { return (a.fieldOrder - b.fieldOrder) })), props.businessCardAllFields)
    setFields(listField.filter(e => isFieldCanDisplay(e)))
  }, [props.summaryFields])

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
      const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
      if (idx < 0) {
        listFieldIdEdited.push(props.fieldEdit.fieldId)
      }
      listFieldTmp.forEach((field) => {
        if (!_.isNil(field.oldField) && idx < 0) {
          listFieldIdEdited.push(field.fieldId);
        }
      })
      props.onChangeFields(listFieldTmp, arrFieldDel, listFieldIdEdited);
      props.destroySaveField();
    }
  }, [props.isSaveField])

  useEffect(() => {
    if (props.customerIds) {
      props.showListGrid(true)
      props.optionShowAll(true)
      const limit = props.businessCard.tabInfos.find(x => x.tabId === TAB_ID_LIST.calendar) ? props.businessCard.tabInfos.find(x => x.tabId === TAB_ID_LIST.calendar).maxRecord : 0
      const localNavigation = {}
      localNavigation['searchConditions'] = {
        searchStatic: {
          task: false,
          milestone: false
        },
        searchDynamic: {
          customerIds: props.customerIds,
          businessCardIds: [props.businessCardId],
        }
      }
      localNavigation['tabFocus'] = TabForcus.Schedule
      localNavigation['loginFlag'] = props.hasLoginUser
      localNavigation['limitLoadDataInListView'] = limit
      props.onChangeLocalNavigation(localNavigation, true)
    }
  }, [props.customerIds])

  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.businessCardAllFields)
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  const onDeleteFields = (fieldInfo) => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields)
    const objParams = sortOrderFields(fieldsAfterDelete, props.businessCardAllFields)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    props.openDynamicSelectFields(SettingModes.CreateNewInput, null);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }

  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable)
    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.businessCardAllFields)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    }
  }));

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

  const getSplitRecord = (mode: number) => {
    const records = [];
    if (mode === 0) {
      records.push(...listFieldNormal);
    } else if (mode < 0) {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder < listFieldTab[0].fieldOrder))
    } else {
      if (listFieldTab.length === 0) {
        return records;
      }
      records.push(...listFieldNormal.filter(e => e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder));
    }
    return buildDoubleColumn(records, props.screenMode);
  }

  const recordBefore = getSplitRecord(-1)
  const recordAfter = getSplitRecord(1);
  const recordAll = getSplitRecord(0);

  /* _____Render_____ */

  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.businessCard.businessCardDetail}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        businessCardId={props.businessCardId}
        edittingField={props.edittingField}
        // open other detail popup
        onOpenPopupActivityDetail={props.onOpenPopupActivityDetail}
        onOpenModalCustomerDetail={props.onOpenModalCustomerDetail}
      />
    )
  }

  const renderContentTab = (listFieldContent: any[]) => {
    const rowRecordsTabContent = buildDoubleColumn(listFieldContent, props.screenMode)
    return (
      <>
        {rowRecordsTabContent &&
          <table className="table-default table-content-div cursor-df">
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

  const tabActivityHistories = item => {
    return (
      <>
        {(props.screenMode === ScreenMode.EDIT || item.isDisplaySummary === true) && (
          <div className="caption-table mt-2 mb-2">
            {translate('businesscards.detail.label.title.activityHistories')}
          </div>
        )}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
        )}
        {item.isDisplaySummary && props.activities && (
          <TabActivityHistory
            businessCardId={props.businessCardId}
            activities={props.activities}
            currentTab={props.currentTab}
            onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail}
            onOpenModalCustomerDetail={props.onOpenModalCustomerDetail}
            onOpenPopupTaskDetail={props.onOpenPopupTaskDetail}
            onOpenPopupBusinessCardTransfer={props.onOpenPopupBusinessCardTransfer}
            onOpenPopupActivityDetail={props.onOpenPopupActivityDetail}
            onOpenPopupMileStoneDetail={props.onOpenPopupMileStoneDetail}
            onOpenPopupCreateActivity={props.onOpenPopupCreateActivity}
            customerId={props.businessCard ? props.businessCard.businessCardDetail.customerId : null}
            handleInitData={props.handleInitDataBusinessCard}
            customerIds={props.customerIds}
            hasLoginUser={props.hasLoginUser}
            isTabSummary={true}
          />
        )}
      </>
    );
  }

  const tabCalendar = item => {
    return (
      <>
        {(props.screenMode === ScreenMode.EDIT || item.isDisplaySummary === true) && (
          <div className="caption-table mt-4 mb-2">
            {translate('businesscards.detail.label.title.calendar')}
          </div>
        )}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...item} onSelectDislaySummary={props.onSelectDislaySummary} isListType={true} />
        )}
        {item.isDisplaySummary && (
          <GridCalendar modeView={true} />
        )}
      </>
    )
  }

  return (
    <div className="tab-content">
      <div className="tab-pane active">
        <div className="list-table">
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
              {props.screenMode === ScreenMode.DISPLAY && <br />}
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
              {props.screenMode === ScreenMode.DISPLAY && <br />}
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
            <table className="table-default table-content-div cursor-df">
              <tbody>
                {recordAll.map((row, i) => { return renderTableField(row, i) }
                )}
              </tbody>
            </table>}
          <FieldDisplayRowDragLayer />
          {props.tabList && props.tabList.map((item, idx) => {
            if (item.tabId === TAB_ID_LIST.activity) {
              return (
                <>{tabActivityHistories(item)}</>
              )
            }
            if (item.tabId === TAB_ID_LIST.calendar) {
              return (
                <>
                  {
                    tabCalendar(item)
                  }
                </>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
});

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  showListGrid,
  optionShowAll,
  handleInitData,
  onChangeLocalNavigation
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TabSummary);
