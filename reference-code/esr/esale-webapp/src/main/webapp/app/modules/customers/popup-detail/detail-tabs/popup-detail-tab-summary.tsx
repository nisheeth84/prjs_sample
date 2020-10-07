import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ITEM_TYPE, CUSTOMER_SPECIAL_FIELD_NAMES } from '../../constants'
import TabSummaryElement from './popup-detail-tab-summary-element';
import _ from 'lodash';
import { useId } from "react-id-generator";
import { TAB_ID_LIST } from '../../constants';
import { Storage, translate } from 'react-jhipster';
import { SettingModes } from '../../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import StringUtils, { autoFormatNumber, getFieldLabel, jsonParse, firstChar, getEmployeeImageUrl, escapeSpaceHtml } from 'app/shared/util/string-utils';
import FieldDisplayRow, { FieldDisplayRowDragLayer } from 'app/shared/layout/dynamic-form/control-field/view/field-display-row';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import { ScreenMode, ControlType, APP_TIME_FORMAT, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import CustomerTabChangeHistory from 'app/modules/customers/popup-detail/detail-tabs/popup_detail_tab_change_history';
import {
  deepEqual,
  isFieldInTab,
  processDeleteFields,
  sortOrderFields,
  processDragDropFields,
  processDragNewField,
  isFieldDisplayNormal,
  buildDoubleColumn,
  isMouseOnRef
} from 'app/shared/util/utils';
import * as R from 'ramda'
import { formatDate, DATE_TIME_FORMAT, utcToTz, autoFormatTime, dateToStringUserTzFormat, datetimeToStringUserTzFormat } from 'app/shared/util/date-utils';
import dateFnsFormat from 'date-fns/format';
import TabDisplaySetting from 'app/shared/layout/common/tab-display-setting';
import ScenarioElement from 'app/modules/customers/create-edit-customer/popup/scenario-element';
import DetailTabActivity from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-activity';
import { arrFieldNameReject } from '../popup-customer-detail';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import { IRootState } from 'app/shared/reducers';
import {
  showListGrid,
  handleInitData,
  onChangeLocalNavigation,
  optionShowAll,
  onChangeDateShow
} from 'app/modules/calendar/grid/calendar-grid.reducer';
import { connect, Options } from 'react-redux';
import {
  CalendarView,
  LocalNavigation,
  TabForcus,
  VIEW_TYPE_CALENDAR,
  LimitLoadDataInListView,
  ItemTypeSchedule
} from 'app/modules/calendar/constants';
import {
  ConditionRange,
  ConditionScope
} from 'app/shared/layout/popup-detail-service-tabs/constants';
import GridCalendar from 'app/modules/calendar/grid/calendar-grid';
import Popover from 'app/shared/layout/common/Popover';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import { CalenderViewMonthCommon } from 'app/modules/calendar/grid/common';
import { CURRENCY } from 'app/modules/products/constants';
import ProductDetail from 'app/modules/products/product-detail/product-detail';
import { checkOverdueComplete } from 'app/shared/layout/common/suggestion/tag-auto-complete-task/helper';

export interface IPopupTabSummary extends DispatchProps, StateProps {
  idEmployeeDetail: string
  iconFunction?: string,
  showModal?: boolean;
  customer: any;
  screenMode: any;
  conditionSearch?: any[],
  handleReorderField: (dragIndex, dropIndex) => void;
  onChangeFields?: (fields: any[], deletedFields: any[], editFields: any[]) => void;
  summaryFields?: any;
  editedFields?: any[];
  openDynamicSelectFields: (settingMode, fieldEdit) => void;
  tabList?: any;
  isSaveField?: boolean;
  destroySaveField?: () => void;
  fieldEdit: any;
  paramsEdit: any;
  onShowMessage?: (message, type) => void;
  onSaveField?: (fields, params, fieldEdit) => { listField, deleteFields };
  customerId?: any;
  countSave?: any;
  customerAllFields?: any;
  onSelectDisplaySummary?: any;
  showPopupEmployeeDetail?: (employeeId) => void;
  showCustomerDetail?: (nextId, prevId) => void;
  editingField: any;
  fieldsUnavailable: any[];
  deletedFields: any;
  openScenario?: any;
  tenant?: any;
  showAnyDetail?: (id, type) => void;
  searchScope?: number;
  searchRange?: number;
  customerChild?: any[];
  onOpenCustomerParent?: any;
  onOpenModalCreateUpdateActivity?: (activityId, activityDraftId, actionType, viewMode) => void;
  showDetailTask?: boolean;
}

const LIST_TXT_STATUS = [
  '未着手',
  '着手中',
  '完了'
]

/**
 * Render component tab summary
 * @param props
 */
const TabSummary = forwardRef((props: IPopupTabSummary, ref) => {
  const localNavigationTmp: LocalNavigation = {
    searchConditions: {
      searchStatic: {
        task: false,
        milestone: false
      },
      searchDynamic: {
        customerIds: [props.customerId]
      }
    },
    tabFocus: TabForcus.Schedule,
    loginFlag: false,
    limitLoadDataInListView: 40
  }
  const [localNavigation, setLocalNavigation] = useState(null);

  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [fields, setFields] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldIdEdited, setListFieldIdEdited] = useState([]);
  const [deletedFields, setDeleteFields] = useState([]);
  const [fieldsUnavailable, setFieldsUnavailable] = useState([]);
  const [scenarioList, setScenarioList] = useState([]);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeIdSelected, setEmployeeIdSelected] = useState(null);

  const [openPopupProductDetail, setOpenPopupProductDetail] = useState(false);
  const [productIdSelected, setProductIdSelected] = useState(null);

  const fieldTabRef = useRef(null)
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  const [isShowAllPersonInCharge, setIsShowAllPersonInCharge] = useState(false);
  const [taskIdShowPersonInCharge, setTaskIdShowPersonInCharge] = useState(null);
  const personInChargeRef = useRef(null);
  const employeeDetailCtrlId = useId(1, "customerSummaryEmployeeDetail_")

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
    if (props.showDetailTask) {
      document.body.className = "wrap-task modal-open";
    } else {
      document.body.className = "wrap-customer modal-open";
    }
  }, [props.showDetailTask])

  useEffect(() => {
    if (props.customer) {
      const customerFields = props.customer.fields.filter(e => !arrFieldNameReject.includes(e.fieldName));
      let listField = null;
      if (props.screenMode === ScreenMode.EDIT) {
        listField = props.summaryFields ? props.summaryFields.sort((a, b) => a.fieldOrder - b.fieldOrder) : customerFields.sort((a, b) => a.fieldOrder - b.fieldOrder);
      } else {
        listField = customerFields.sort((a, b) => a.fieldOrder - b.fieldOrder);
        setListFieldIdEdited([]);
      }
      const tmp = []
      if (!_.isNil(listField)) {
        tmp.push(...listField.filter(e => isFieldCanDisplay(e)));
      }
      setFields(sortOrderFields(tmp, props.customerAllFields.fields));
      const dataTabs = R.path(['dataTabs'], props.customer);
      const tabScenario = dataTabs && dataTabs.filter(e => e.tabId === TAB_ID_LIST.scenario);
      let listTmp = [];
      if (tabScenario && tabScenario.length > 0) {
        listTmp = R.path(['data', 'scenarios', 'milestones'], tabScenario[0]) || [];
      }
      setScenarioList(listTmp);
    }
  }, [props.customer, props.summaryFields, props.screenMode]);

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
      props.onChangeFields(_.cloneDeep(props.customer.fields), [], []);
    } else {
      setListFieldIdEdited(props.editedFields)
    }
    return () => { setFirst(false); setFields(null); }
  }, []);

  useEffect(() => {
    if (props.editedFields) {
      setListFieldIdEdited(props.editedFields)
    }
  }, [props.editedFields]);

  useEffect(() => {
    if (props.fieldsUnavailable) {
      setFieldsUnavailable(props.fieldsUnavailable)
    }
  }, [props.fieldsUnavailable]);

  useEffect(() => {
    setDeleteFields(props.deletedFields)
  }, [props.deletedFields]);

  const rowRecords = [];
  for (let i = 0; i < fields.length; i++) {
    const rowData = [];
    if (i === 0) {
      rowData.push(fields[i]);
      rowRecords.push(rowData);
    } else {
      const isDouble = fields[i].isDoubleColumn;
      const beforeDouble = fields[i - 1].isDoubleColumn;
      let beforePrevDouble = false;
      if (i > 1) {
        beforePrevDouble = fields[i - 2].isDoubleColumn
      }
      if (!isDouble) {
        rowData.push(fields[i]);
        rowRecords.push(rowData);
      } else {
        if (!beforeDouble) {
          rowData.push(fields[i]);
          rowRecords.push(rowData);
        } else {
          if (beforePrevDouble) {
            rowData.push(fields[i]);
            rowRecords.push(rowData);
          } else {
            rowRecords[rowRecords.length - 1].push(fields[i])
          }
        }
      }
    }
  }

  const reMakeFieldDragDrop = (isDoubleColumn, fieldDrag, dropIndex, isAddLeft) => {
    const addNewFieldIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId);
    const dropField = fields[dropIndex]
    if (!isDoubleColumn) {
      if (fieldDrag.fieldId < 0 && _.isNil(props.countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
        fields.splice(dropIndex + 1, 0, fieldDrag);
      } else {
        fieldDrag.isDoubleColumn = isDoubleColumn;
        const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
        const tempObject = fields.splice(dragIndex, 1)[0];
        const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
        fields.splice(dropIndexAfterSplice + 1, 0, tempObject);
      }
    } else {
      const dblColumns = buildDoubleColumn(fields, props.screenMode);
      const arrDrop = dblColumns.find(e => (e.length === 1 && e[0].fieldId === fields[dropIndex].fieldId) ||
        (e.length === 2 && (e[0].fieldId === fields[dropIndex].fieldId || e[1].fieldId === fields[dropIndex].fieldId)))
      if (fieldDrag.fieldId < 0 && _.isNil(props.countSave[fieldDrag.fieldId]) && addNewFieldIndex < 0) {
        fieldDrag.isDoubleColumn = true;
      } else {
        fieldDrag.isDoubleColumn = isDoubleColumn;
        const dragIndex = fields.findIndex(e => e.fieldId === fieldDrag.fieldId)
        fields.splice(dragIndex, 1);
      }

      if (arrDrop.length === 1) {
        fields[dropIndex].isDoubleColumn = true;
      } else if (arrDrop.length === 2) {
        const idx = fields.findIndex(e => e.fieldId === arrDrop[1].fieldId);
        if (idx >= 0) {
          fields[dropIndex].isDoubleColumn = false;
        }
        if (fields[dropIndex].fieldId === arrDrop[0].fieldId) {
          fields[dropIndex].isDoubleColumn = true;
        } else {
          if (fields[dropIndex].fieldId === arrDrop[1].fieldId && dropIndex > 0) {
            fields[dropIndex - 1].isDoubleColumn = true;
          }
        }
      }
      const dropIndexAfterSplice = fields.findIndex(e => e.fieldId === dropField.fieldId)
      fields.splice(dropIndexAfterSplice + (isAddLeft ? 0 : 1), 0, fieldDrag);
    }
  }

  /**
   * Action drag order field
   * @param dragFieldId
   * @param dropFieldId
   */
  const onDragOrderField = (dragFieldId, dropFieldId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    processDragDropFields(fields, dragFieldId, dropFieldId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, listFieldIdEdited)
    const objParam = sortOrderFields(fields, props.customerAllFields.fields)
    setFields(objParam);
    props.onChangeFields(objParam, deletedFields, listFieldIdEdited);
  }

  const onDeleteFields = (fieldInfo) => {
    const fieldsAfterDelete = _.cloneDeep(fields);
    processDeleteFields(fieldsAfterDelete, fieldInfo, deletedFields)
    const objParams = sortOrderFields(fieldsAfterDelete, props.customerAllFields.fields)
    setFields(objParams);
    const idx = listFieldIdEdited.findIndex(e => e.fieldId === props.fieldEdit.fieldId)
    if (idx >= 0) {
      listFieldIdEdited.splice(idx, 1);
    }
    // props.openDynamicSelectFields(SettingModes.CreateNewInput, null);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
  }

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

  const getTabDisplaySetting = (tabId, arrayItem) => {
    try {
      return R.compose(
        R.find(tab => tab.tabId === tabId)
      )(arrayItem);
    } catch (error) {
      return [];
    }
  }

  /**
   * useEffect for TabSummaryElementCalendar set param localNavigation
   */
  useEffect(() => {
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.calendar, props.customer.tabsInfo);
    if (dataTabDisplaySetting && dataTabDisplaySetting.isDisplaySummary) {
      const limit = dataTabDisplaySetting.maxRecord ? dataTabDisplaySetting.maxRecord : 5; 

      let customerIds = [props.customerId];
      let loginFlag = false;
      if (props.searchRange === ConditionRange.ThisAndChildren) {
        let customerChild = [];
        if (props.customerChild) {
          customerChild = props.customerChild.map(e => Number.isInteger(e) ? e : e.customerId);
        }
        customerIds = [props.customerId].concat(customerChild);
      }
      if (props.searchScope === ConditionScope.PersonInCharge) {
        loginFlag = true;
      }
  
      localNavigationTmp.searchConditions.searchDynamic.customerIds = customerIds;
      localNavigationTmp.loginFlag = loginFlag;
      localNavigationTmp.limitLoadDataInListView = limit;
      setLocalNavigation(localNavigationTmp)
    }
  }, [props.searchScope, props.searchRange]);

  /**
   * useEffect for TabSummaryElementCalendar init
   */
  useEffect(() => {
    props.optionShowAll(false);
    props.showListGrid(true)
    props.onChangeDateShow(
      CalenderViewMonthCommon.nowDate(),
      0,
      CalendarView.Month,
      true
    );
  }, []);

  /**
   * useEffect for TabSummaryElementCalendar call api
   */
  useEffect(() => {
    if (localNavigation != null) {
      props.onChangeLocalNavigation(localNavigation, true);
    }
  }, [localNavigation]);


  /**
   * Action drop new field
   * @param dragItem
   * @param dropId
   */
  const onDropNewField = (dragItem, dropId, isDoubleColumn: boolean, isAddLeft: boolean) => {
    const fieldDrag = _.cloneDeep(dragItem);
    processDragNewField(fields, fieldDrag, dropId, isDoubleColumn, isAddLeft, fieldTabRef, props.screenMode, props.countSave, fieldsUnavailable)
    listFieldIdEdited.push(fieldDrag.fieldId);
    const objParams = sortOrderFields(fields, props.customerAllFields.fields)
    setFields(objParams);
    props.onChangeFields(objParams, deletedFields, listFieldIdEdited);
    props.openDynamicSelectFields(SettingModes.EditInput, fieldDrag);
  }

  useImperativeHandle(ref, () => ({
    onAddNewField(field) {
      onDropNewField(field, fields[fields.length - 1].fieldId, false, false);
    }
  }));

  /**
   * Get max item show in list
   * @param tabId
   * @param arrayItem
   */
  const getMaxItemShowInList = (tabId, arrayItem) => {
    try {
      let pathData = '';
      switch (tabId) {
        case TAB_ID_LIST.task:
          pathData = R.path(["data", "tasks"]);
          break;
        case TAB_ID_LIST.tradingProduct:
          pathData = R.path(["data", "dataInfo", "productTradings"]);
          break;
        case TAB_ID_LIST.changeHistory:
          // TabSummaryElementChangeHistory
          pathData = R.path(["data", "customersHistory"]);
          break;
        case TAB_ID_LIST.activityHistory:
          pathData = R.path(["data", "activities"]);
          break;
        default:
          break;
      }
      return R.compose(
        pathData,
        R.find(tab => tab.tabId === tabId)
      )(arrayItem);
    } catch (error) {
      return [];
    }
  }

  const renderEmployeeCard = (employee, classCard?) => {
    const name = `${employee.employeeSurname ? (employee.employeeName ? employee.employeeSurname + ' ' + employee.employeeName : employee.employeeSurname) : ''}`;
    return (
      <div className={`item ${classCard || ''}`}>
        <a onClick={() => props.showPopupEmployeeDetail(employee.employeeId)}>
          {(employee.fileUrl || employee.photoFilePath)
            ? <img src={employee.fileUrl || employee.photoFilePath} alt="" className="user border-0" />
            : <div className={"no-avatar green"}>
              {name.charAt(0)}
            </div>
          }
          <span className="text-blue font-size-12">{name}</span>
        </a>
      </div>
    )
  }

  const showAllPersonInCharge = (employees, taskId) => {
    if (taskIdShowPersonInCharge && taskId === taskIdShowPersonInCharge) {
      return (
        <div className="box-select-option position-absolute max-height-300 overflow-auto max-width-300 mh-auto location-r0" ref={personInChargeRef}>
          {employees.map((employee, idx) => {
            return (
              <React.Fragment key={idx}>
                {renderEmployeeCard(employee)}
              </React.Fragment>
            )
          })}
        </div>
      )
    }
    return <></>
  }

  const handleMouseDown = (e) => {
    if (personInChargeRef && !isMouseOnRef(personInChargeRef, e)) {
      setIsShowAllPersonInCharge(false);
    }
  }
  useEventListener('mousedown', handleMouseDown);

  /**
   * Tab Revenue Infomation
   */
  const TabSummaryElementRevenueInfomation = () => {
    return (<>
      <label htmlFor="" className="color-333 font-weight-500 mt-5">{translate('customers.detail.label.tab.revenueInfomation')}</label>
      <div className="customer-map-chart-wrap">
        <img src="../../../content/images/map-chart.svg" alt="" />
      </div>
    </>)
  }

  /**
   * Tab Activity History
   */
  const TabSummaryElementActivityHistory = (index) => {
    const valueDataActivity = getMaxItemShowInList(TAB_ID_LIST.activityHistory, props.customer.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.activityHistory, props.customer.tabsInfo);
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary && valueDataActivity && valueDataActivity.length > 0 || props.screenMode === ScreenMode.EDIT)
          && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.activityHistory')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {valueDataActivity && valueDataActivity.length > 0 &&
          <DetailTabActivity
            customer={props.customerId}
            activities={valueDataActivity}
            isGetDataFromSummary={true}
            hideShowDetail={true}
            onOpenModalCreateUpdateActivity={props.onOpenModalCreateUpdateActivity}
            onOpenCustomerParent={(id) => props.showAnyDetail(id, TYPE_DETAIL_MODAL.CUSTOMER)}
          />
        }
      </div>)
  }

  const renderPopupEmployeeDetail = () => {
    return (
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        backdrop={true}
        openFromModal={true}
        employeeId={employeeIdSelected}
        listEmployeeId={[employeeIdSelected]}
        toggleClosePopupEmployeeDetail={() => setOpenPopupEmployeeDetail(false)}
        resetSuccessMessage={() => { }}
      />
    )
  }

  const handleMoveScreenPopupEmployeeDetail = (employeeId) => {
    setOpenPopupEmployeeDetail(true);
    setEmployeeIdSelected(employeeId);
  }

  const getPersionInCharge = (productTrading) => {
    const urlImage = getEmployeeImageUrl(R.path(['employee'], productTrading));
    const employeeId = R.path(['employee', 'employeeId'], productTrading)
    const employeeName = R.path(['employee', 'employeeName'], productTrading)
    const employeeSurname = R.path(['employee', 'employeeSurname'], productTrading)
    const employeeFullName = StringUtils.getFullName(employeeSurname, employeeName);
    const char = firstChar(employeeSurname);
    return <>
      {productTrading &&
        <div className="item form-inline">
          {urlImage ? <img className="user" src={urlImage} /> : <a tabIndex={-1} className="no-avatar green">{char}</a>}
          <a className="d-inline-block text-ellipsis file max-calc45"
            onClick={() => handleMoveScreenPopupEmployeeDetail(employeeId)}>
            <Popover x={-20} y={25}>
              {employeeFullName}
            </Popover>
          </a>
          {openPopupEmployeeDetail && renderPopupEmployeeDetail()}
        </div>
      }
    </>
  }

  const renderPopupProductDetail = () => {
    return (
      <ProductDetail
        key={productIdSelected}
        showModal={true}
        openFromModal={true}
        productId={productIdSelected}
        toggleClosePopupProductDetail={() => setOpenPopupProductDetail(false)}
      />
    )
  }

  const handleMoveProductDetail = (productId) => {
    setOpenPopupProductDetail(true);
    setProductIdSelected(productId);
  }

  const getProductName = (productTrading) => {
    const productId = R.path(['product', 'productId'], productTrading)
    const productName = R.path(['product', 'productName'], productTrading)
    return <>
      {productTrading &&
        <div className="item form-inline">
          <a className="d-inline-block text-ellipsis file max-calc45"
            onClick={() => handleMoveProductDetail(productId)}>
            <Popover x={-20} y={25}>
              {productName}
            </Popover>
          </a>
          {openPopupProductDetail && renderPopupProductDetail()}
        </div>
      }
    </>
  }

  const getCustomerName = (productTrading) => {
    if (productTrading.customerId === props.customerId) {
      return (
        <Popover x={-20} y={25}>
          {productTrading.customerName}
        </Popover>
      )
    } else {
      return (
        <a className="color-blue"
          onClick={() => props.showCustomerDetail(productTrading.customerId, props.customerId)}>
          <Popover x={-20} y={25}>
            {productTrading.customerName}
          </Popover>
        </a>
      )
    }
  }

  const getAmountInProductTrading = (productTradingData) => {
    let amountInProductTrading = 0
    productTradingData && productTradingData.forEach(element => {
      if (element.key === "amount") {
        amountInProductTrading = Number.parseInt(element.value, 10);
        return;
      }
    });
    return amountInProductTrading;
  }

  /**
   * Tab Trading Product
   */
  const TabSummaryElementTradingProduct = (index, isSpecialItem) => {
    const valueDataTradingProduct = getMaxItemShowInList(TAB_ID_LIST.tradingProduct, props.customer.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.tradingProduct, props.customer.tabsInfo);
    let total = 0;
    let isRenderTable = true;
    if (!valueDataTradingProduct || !_.isArray(valueDataTradingProduct) || valueDataTradingProduct.length < 1) {
      isRenderTable = false;
    }
    isRenderTable && valueDataTradingProduct.forEach((product) => {
      total += R.path(['amount'], product)
    })
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary && isRenderTable || props.screenMode === ScreenMode.EDIT)
          && !isSpecialItem && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.tradingProduct')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {isRenderTable &&
          <table
            className={isSpecialItem
              ? 'table-thead-background table-content table-layout-fixed mt-5'
              : 'table-layout-fixed table-thead-background table-content'}>
            <thead>
              {isSpecialItem && <tr><th colSpan={7}>{translate('customers.detail.label.tab.tradingProduct')}</th></tr>}
              <tr>
                <th>{translate('customers.detail.label.product')}</th>
                <th>{translate('customers.detail.label.customerName')}</th>
                <th>{translate('customers.detail.label.personInCharge')}</th>
                <th>{translate('customers.detail.label.progress')}</th>
                <th><div className="word-break-word">{translate('customers.detail.label.completionDate')}</div></th>
                <th>
                  <div>{translate('customers.detail.label.amountOfMoney')}</div>
                  <div>
                    {translate('customers.detail.label.total')}<span className="text-align-right">{StringUtils.numberFormat(total)}{translate('customers.detail.label.moneyType')}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {valueDataTradingProduct.map((productTrading, indexProduct) => {
                return (
                  <tr key={indexProduct}>
                    <td>{getProductName(productTrading)}</td>
                    <td>{getCustomerName(productTrading)}</td>
                    <td>{getPersionInCharge(productTrading)}</td>
                    <td>
                      <Popover x={-20} y={25}>
                        <span className="d-inline-block text-ellipsis">
                          {`${getFieldLabel(productTrading, 'progressName')}`}
                        </span>
                      </Popover>
                    </td>
                    <td>
                      <Popover x={-20} y={25}>
                        <span className="date">
                          {R.path(['endPlanDate'], productTrading)
                            && utcToTz(R.path(['endPlanDate'], productTrading) + '', DATE_TIME_FORMAT.User)
                              .split(' ')[0]}
                        </span>
                      </Popover>
                    </td>
                    <td className="text-right">
                      {StringUtils.numberFormat(R.path(['amount'], productTrading))}{translate('customers.detail.label.moneyType')}
                    </td>
                  </tr>
                )
              })
              }
            </tbody>
          </table>
        }
      </div>
    );
  }

  /**
   * Tab Summary Element Change History
   */
  const TabSummaryElementChangeHistory = (index) => {
    const valueDataChangeHistory = getMaxItemShowInList(TAB_ID_LIST.changeHistory, props.customer.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.changeHistory, props.customer.tabsInfo);
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary && valueDataChangeHistory && valueDataChangeHistory.length > 0 || props.screenMode === ScreenMode.EDIT)
          && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.changeHistory')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {valueDataChangeHistory && valueDataChangeHistory.length > 0 &&
          <CustomerTabChangeHistory
            customerName={props.customer.customer.customerName}
            valueDataChangeHistoryInTabSummary={valueDataChangeHistory}
          />
        }
      </div>
    );
  }

  const TabSummaryElementCalendar = (index) => {
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.calendar, props.customer.tabsInfo);
    return (
      <div key={index}>
        {(dataTabDisplaySetting.isDisplaySummary || props.screenMode === ScreenMode.EDIT)
          && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('businesscards.detail.label.title.calendar')}</label>}
        {props.screenMode === ScreenMode.EDIT && (
          <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
        )}
        {dataTabDisplaySetting.isDisplaySummary && (
          <GridCalendar modeView={true} />
        )}
      </div>
    )
  }


  /**
   * Tab Element Schedule
   */
  const TabSummaryElementSchedule = () => {
    const valueDataCalendar = getMaxItemShowInList(TAB_ID_LIST.calendar, props.customer.dataCalendar);

    const parseTime = (number) => {
      if (number < 10) {
        return (
          '0' + number
        )
      } else {
        return number;
      }
    }

    const checkConditionShowIcon = (item) => {
      return <td className="w65"><span>{item.itemName}</span></td>
    }

    return (
      <>
        <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.schedule')}</label>
        <table className="table-default table-calendar-customer">
          <tbody>
            {valueDataCalendar.map((dataCalendar) => {
              let numRow = dataCalendar.itemList.length;
              let isMultiRow = true;
              const date = new Date(dataCalendar.date);
              return (

                dataCalendar.itemList.map((item) => {
                  if (item.itemType === ITEM_TYPE.itemTypeSchedule) {
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);
                    const startTime = parseTime(startDate.getHours()) + ':' + parseTime(startDate.getMinutes());
                    const endTime = parseTime(endDate.getHours()) + ':' + parseTime(endDate.getMinutes());
                    if (numRow > 1 && isMultiRow) {
                      numRow = numRow - 1;
                      isMultiRow = false;
                      return (
                        <>
                          <tr>
                            <td rowSpan={dataCalendar.itemList.length}><span className="date font-size-10">{date.getMonth() + 1}月{date.getDate()}日</span></td>
                            <td className="font-size-10">{startTime}~{endTime}</td>
                            {checkConditionShowIcon(item)}
                          </tr>
                        </>
                      )
                    } else if (numRow === 1 && isMultiRow) {
                      return (
                        <>
                          <tr>
                            <td rowSpan={1}><span className="date font-size-10">{new Date(dataCalendar.date).getMonth() + 1}月{new Date(dataCalendar.date).getDate()}日</span></td>
                            <td className="font-size-10">{startTime}~{endTime}</td>
                            {checkConditionShowIcon(item)}
                          </tr>
                        </>
                      )
                    } else if (numRow === 1 && !isMultiRow) {
                      return (
                        <>
                          <tr>
                            <td className="font-size-10">{startTime}~{endTime}</td>
                            {checkConditionShowIcon(item)}
                          </tr>
                        </>
                      )
                    }
                  }
                })
              )
            })}
          </tbody>
        </table>
      </>
    );
  }

  /**
   * Tab Task
   */
  const TabSummaryElementTask = (index) => {
    const valueDataTask = getMaxItemShowInList(TAB_ID_LIST.task, props.customer.dataTabs);
    const dataTabDisplaySetting = getTabDisplaySetting(TAB_ID_LIST.task, props.customer.tabsInfo);
    return (
      <>
        <div key={index} className="w100">
          {(dataTabDisplaySetting.isDisplaySummary && valueDataTask && valueDataTask.length > 0 || props.screenMode === ScreenMode.EDIT)
            && <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.detail.label.tab.task')}</label>}
          {props.screenMode === ScreenMode.EDIT && (
            <TabDisplaySetting item={...dataTabDisplaySetting} onSelectDislaySummary={props.onSelectDisplaySummary} isListType={true} />
          )}
          {valueDataTask && valueDataTask.length > 0 &&
            <table className="table-thead-background table-content">
              <thead className="w100">
                <tr>
                  <th>{translate('customers.detail.label.deadline')}</th>
                  <th className="max-width-200">{translate('customers.detail.label.taskName')}</th>
                  <th className="max-width-200">{translate('customers.detail.label.customerName')}</th>
                  <th>{translate('customers.detail.label.tab.tradingProduct')}</th>
                  <th>{translate('customers.detail.label.status')}</th>
                  <th>{translate('customers.detail.label.personInCharge')}</th>
                </tr>
              </thead>
              <tbody className="w100">
                {valueDataTask.map((task) => {
                  return (
                    <tr key={task.taskId}>
                      <td>
                        <Popover x={-20} y={25}><span className={`date ${checkOverdueComplete(task.finishDate, task.status) ? 'text-red ' : ''}`}>{utcToTz(task.finishDate + '', DATE_TIME_FORMAT.User).split(' ')[0]}</span></Popover>
                      </td>
                      <td className="max-width-200">
                        <Popover x={-20} y={25}><a onClick={() => props.showAnyDetail(task.taskId, TYPE_DETAIL_MODAL.TASK)}>{task.taskName}</a></Popover>
                      </td>
                      <td className="max-width-200">
                        <Popover x={-20} y={25}>
                          {task.customers && task.customers.length > 0 && task.customers.map((item, idx) => {
                            return (
                              <>
                                {item.customerId === props.customerId
                                  ? <span>{item.customerName}</span>
                                  : <a onClick={() => props.showAnyDetail(item.customerId, TYPE_DETAIL_MODAL.CUSTOMER)}>{item.customerName}</a>}
                                {idx < task.customers.length - 1 && translate('commonCharacter.comma')}
                              </>
                            )
                          })
                          }
                        </Popover>
                      </td>
                      <td>
                        <Popover x={-20} y={25}>
                          {task.productTradings && task.productTradings.map((item, idx) => {
                            return (
                              <React.Fragment key={idx}>
                                <a onClick={() => props.showAnyDetail(item.productId, TYPE_DETAIL_MODAL.PRODUCT)}>{item.productName}</a>
                                {idx < task.productTradings.length - 1 && translate('commonCharacter.comma')}
                              </React.Fragment>
                            )
                          })
                          }
                        </Popover>
                      </td>
                      <td><Popover x={-20} y={25}>{LIST_TXT_STATUS[task.statusTaskId ? task.statusTaskId - 1 : 0]}</Popover></td>
                      <td>
                        {task.employees && task.employees.length > 0 && (
                          <>
                            {renderEmployeeCard(task.employees[0], "d-inline-block mr-3")}
                            <div className="position-relative d-inline-block">
                              {task.employees.length > 1 &&
                                <a className="text-blue" onClick={() => { setIsShowAllPersonInCharge(true); setTaskIdShowPersonInCharge(task.taskId) }}>
                                  {translate('customers.detail.label.show-more', { count: task.employees.length - 1 })}
                                </a>}
                              {isShowAllPersonInCharge && showAllPersonInCharge(task.employees, task.taskId)}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          }
        </div>
      </>
    );
  }

  /**
   * Tab mail
   */
  const TabSummaryElementMail = () => {
    return (<>
      <div className="mt-4 mb-2">
        <label htmlFor="" className="color-333 font-weight-500">{translate('customers.detail.label.tab.mail')}</label>
        <a className="button-pull-down-small float-right">フィルタ</a>
      </div>
      <table className="table-list table-none-border-cell mb-2">
        <tbody>
          <tr>
            <td >
              <label className="icon-check-start">
                <input type="checkbox" name="" defaultChecked /><i />
              </label>
            </td>
            <td >
              <label className="icon-check-lock">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td >名刺A</td>
            <td >ここにメールのタイトルが入ります。</td>
            <td >yyyy/mm/dd</td>
          </tr>
          <tr>
            <td>
              <label className="icon-check-start">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td>
              <label className="icon-check-lock">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td>名刺B</td>
            <td>ここにメールのタイトルが入ります。</td>
            <td>yyyy/mm/dd</td>
          </tr>
          <tr>
            <td>
              <label className="icon-check-start">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td>
              <label className="icon-check-lock">
              </label>
            </td>
            <td>名刺C</td>
            <td>ここにメールのタイトルが入ります。</td>
            <td>yyyy/mm/dd</td>
          </tr>
          <tr>
            <td>
              <label className="icon-check-start">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td>
              <label className="icon-check-lock">
              </label>
            </td>
            <td>名刺D</td>
            <td>ここにメールのタイトルが入ります。</td>
            <td>yyyy/mm/dd</td>
          </tr>
          <tr>
            <td>
              <label className="icon-check-start">
                <input type="checkbox" name="" /><i />
              </label>
            </td>
            <td>
              <label className="icon-check-lock">
              </label>
            </td>
            <td>名刺E</td>
            <td>ここにメールのタイトルが入ります。</td>
            <td>yyyy/mm/dd</td>
          </tr>
        </tbody>
      </table>
    </>)
  }

  const isBasicItems = (fieldName) => {
    const camelCaseFieldName = StringUtils.snakeCaseToCamelCase(fieldName);
    if (camelCaseFieldName === 'nextActions' || camelCaseFieldName === 'nextSchedules' || camelCaseFieldName === 'memo'
      || camelCaseFieldName === 'createdDate' || camelCaseFieldName === 'createdUser' || camelCaseFieldName === 'updatedDate'
      || camelCaseFieldName === 'updatedUser' || camelCaseFieldName === 'photoFileName') {
      return true;
    }
    return false;
  }

  const isProductTradingData = (fieldName) => {
    const camelCaseFieldName = StringUtils.snakeCaseToCamelCase(fieldName);
    if (camelCaseFieldName === 'productTradingData') {
      return true;
    }
    return false;
  }

  // render Tab summary
  const renderTableField = (row: any[], key: any) => {
    return (
      <TabSummaryElement
        fieldsInfo={row}
        screenMode={props.screenMode}
        fieldHighlight={listFieldIdEdited}
        valueData={props.customer.customer}
        onDragOrderField={onDragOrderField}
        onDropNewField={onDropNewField}
        openDynamicSelectFields={props.openDynamicSelectFields}
        onDeleteFields={onDeleteFields}
        fields={fields}
        onShowMessage={props.onShowMessage}
        customerId={props.customerId}
        showPopupEmployeeDetail={props.showPopupEmployeeDetail}
        showCustomerDetail={props.showCustomerDetail}
        editingField={props.editingField}
        tenant={props.tenant}
      />
    )
  }

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

  return (
    <>
      {/* <div className="tab-pane active"> */}
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
      {
        <ScenarioElement scenarioList={scenarioList} openModal={props.openScenario} />
      }
      <FieldDisplayRowDragLayer />
      {props.tabList.map((item, index) => {
        if (item.tabId === TAB_ID_LIST.activityHistory) {
          return (<>{TabSummaryElementActivityHistory(item.tabId)}</>)
        } else if (item.tabId === TAB_ID_LIST.tradingProduct) {
          return (<>{TabSummaryElementTradingProduct(item.tabId, false)}</>)
        } else if (item.tabId === TAB_ID_LIST.task) {
          return (<>{TabSummaryElementTask(item.tabId)}</>)
        } else if (item.tabId === TAB_ID_LIST.changeHistory) {
          return (<>{TabSummaryElementChangeHistory(item.tabId)}</>)
        } else if (item.tabId === TAB_ID_LIST.calendar) {
          return (<>{TabSummaryElementCalendar(item.tabId)}</>)
        }
        // if (item.tabId === TAB_ID_LIST.mail && item.isDisplaySummary) {
        //   return (<>{TabSummaryElementMail()}</>)
        // }
      })}
    </>
  );
});

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
});

const mapDispatchToProps = {
  showListGrid,
  handleInitData,
  onChangeLocalNavigation,
  optionShowAll,
  onChangeDateShow
};
const options = { forwardRef: true };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TabSummary);
