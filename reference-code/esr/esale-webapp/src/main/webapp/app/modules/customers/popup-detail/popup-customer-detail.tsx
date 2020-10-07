import React, { useState, useEffect, useRef, useMemo } from 'react';
import { path } from 'ramda';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import TabSummary from 'app/modules/customers/popup-detail/detail-tabs/popup-detail-tab-summary';
import CustomersTabCalendar from './detail-tabs/popup-detail-tab-calendar';
import DetailTabProductTrading from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-product-trading';
import DetailTabActivity from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-activity';
import { Storage, translate } from 'react-jhipster';
import TabList from './popup-customer-detail-tab-list';
import { isScreenModeDisplay, isScreenModeEdit, AVAILABLE_FLAG, TIMEOUT_TOAST_MESSAGE, SCREEN_TYPES, ScreenMode } from 'app/config/constants';
import { TIMELINE_SERVICE_TYPES } from 'app/modules/timeline/common/constants';
import {
  TAB_ID_LIST,
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_VIEW_MODES,
  CUSTOMER_SPECIAL_FIELD_NAMES,
  CUSTOMER_GET_FIELD_TAB
} from 'app/modules/customers/constants';
import _ from 'lodash';
import { FIELD_BELONG } from 'app/config/constants';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import useEventListener from 'app/shared/util/use-event-listener';
import { Modal } from 'reactstrap';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import CustomerTimelineArea from './customer-timeline-area';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import CustomerTabChangeHistory from './detail-tabs/popup_detail_tab_change_history';
import DynamicSelectField, { SettingModes } from '../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { isNullOrUndefined } from 'util';
import CreateEditCustomerModal from '../create-edit-customer/create-edit-customer-modal';
import * as R from 'ramda';
import CustomerIntegrationModal from "app/modules/customers/customer-integration/customer-integration";
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import { GetActivitiesForm } from 'app/modules/activity/models/get-activities-type';
import {
  handleReorderField,
  handleInitDeleteCustomer,
  handleInitCustomerDetail,
  changeScreenMode,
  handleInitChangeHistory,
  reset,
  handleUpdateCustomFieldInfo,
  CustomerAction,
  handleGetCustomerChild,
  handleGetCustomerFollowed,
  handleCreateFollowed,
  handleDeleteFollowed,
  handleCountRelationCustomers
} from './popup-customer-detail.reducer';
import {
  handleGetCustomerLayout
} from 'app/modules/customers/list/customer-list.reducer';
import { handleShowDetail, handleInitActivities, clearShowDetail } from 'app/modules/activity/list/activity-list-reducer';
import { DynamicControlAction, DEFINE_FIELD_TYPE, FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import {
  isMouseOnRef,
  WAR_COM_0010,
  processRelationselectOrganization as processRelationSelectOrganization,
  putDataToFieldEdit,
  isFieldRelationAsTab,
  createNewFieldLookup,
  revertDeletedFields,
  initialRevertFields,
  concatArray
} from 'app/shared/util/utils';
import TabNetworkMap from './detail-tabs/popup_detail_tab_network_map';
import { TypeGetTaskByIdService, ConditionScope, ConditionRange } from 'app/shared/layout/popup-detail-service-tabs/constants';
import PopupDetailServiceTabTask from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-task';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import StringUtils, { decodeUserLogin, getFieldLabel } from 'app/shared/util/string-utils';
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { BUSINESS_CARD_ACTION_TYPES } from 'app/modules/businessCards/constants';
import { ACTIVITY_ACTION_TYPES, TYPE_DETAIL_MODAL, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import ScenarioPopup from 'app/modules/customers/create-edit-customer/popup/scenario-popup';
import { reset as resetScenario } from 'app/modules/customers/create-edit-customer/create-edit-customer.reducer';
import DynamicSelectFieldTab from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field-tab';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import { getFieldInfoPersonals } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import ShowDetail from 'app/modules/activity/common/show-detail';
import ConfirmPopup from 'app/modules/activity/control/confirm-popup';
import { CalendarView } from 'app/modules/calendar/constants';
import PopupDeleteCustomer from 'app/modules/customers/control/popup/popup-delete-customer';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';

export interface IPopupCustomerDetailProps extends StateProps, DispatchProps {
  id: string
  // flag show modal
  showModal: boolean;
  // id of customer
  customerId: number;
  // List id from screen list
  listCustomerId: any;
  popout?: boolean;
  popoutParams?: any;
  tenant;
  openFromMilestone?: any;
  // message success
  customerSuccessMessage?: string;
  // reset message success
  resetSuccessMessage?: () => void;
  // switch mode
  toggleSwitchEditMode?: (isEdit: boolean) => void;
  // close customer detail
  toggleClosePopupCustomerDetail?: (hasUpdated?: boolean) => void;
  // open create/edit customer
  onOpenModalCreateEditCustomer?: (actionType, viewMode, CustomerId) => void;
  // openFromTask?: boolean;
  // openFromSchedule?: boolean;
  iconFunction?: any;
  displayActivitiesTab?: boolean;
  handleOpenCustomerDetailByItself?: (nextCustomerId, prevCustomerId) => void;
  openFromOtherServices?: boolean;
  isOpenCustomerDetailNotFromList?: boolean
  prevCustomerIds?: any[]
  openFromModal?: boolean;
  canBack?: boolean,
  listProductTradingId?:any[]
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

export enum PopupConditionDisplay {
  None,
  ModalDialog,
  Window
}

export const arrFieldNameReject = [
  CUSTOMER_SPECIAL_FIELD_NAMES.isDisplayChildCustomers,
  CUSTOMER_SPECIAL_FIELD_NAMES.lastContactDate
]

/**
 * Component for show detail of customer
 * @param props
 */
const PopupCustomerDetail = (props: IPopupCustomerDetailProps) => {
  const initialState = {
    tabListShow: _.cloneDeep(props.customer && props.tabListShow.filter(e => e.isDisplay).sort((a, b) => a.tabOrder - b.tabOrder)),
    tabList: _.cloneDeep(props.customer && props.customer.tabsInfo),
    tabListUpdate: null,
    summaryFields: null
  };
  const [employeeId, setEmployeeId] = useState(null);
  const [, setShouldRender] = useState(false);
  const [tabListShow, setTabListShow] = useState(props.customer ? props.tabListShow : null);
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary);
  const [currentCustomerId, setCurrentCustomerId] = useState(props.customerId || path(['popoutParams', 'customerId'], props));
  const [customerChild, setCustomerChild] = useState([]);
  const [customerChildId, setCustomerChildId] = useState([]);
  const [isShowCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [summaryFields, setSummaryFields] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [customerFields, setCustomerFields] = useState(null);
  // const [taskFields, setTaskFields] = useState(null);
  const [tradingProductsFields, setTradingProductsFields] = useState(null);
  const [businessCardsFields, setBusinessCardsFields] = useState(null);
  const [customerLayout, setCustomerLayout] = useState(null);
  const [listCustomerId, setListCustomerId] = useState(props.listCustomerId);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [, setShowConditionDisplay] = useState(PopupConditionDisplay.None);

  const [tabList, setTabList] = useState(props.customer ? _.cloneDeep(props.customer.tabsInfo) : null);
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const [isShowPopupDelErr, setIsShowPopupDelErr] = useState(true);
  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [customerActionType, setCustomerActionType] = useState(CUSTOMER_ACTION_TYPES.CREATE);
  const [customerViewMode, setCustomerViewMode] = useState(CUSTOMER_VIEW_MODES.EDITABLE);
  const [isDisplayRange, setIsDisplayRange] = useState(false);
  const [openModalTaskCreate, setOpenModalTaskCreate] = useState(false);
  const [scopeCondition, setScopeCondition] = useState(ConditionScope.Total);
  const [rangeCondition, setRangeCondition] = useState(ConditionRange.ThisAndChildren);
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState(null);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [paramsEdit, setParamsEdit] = useState();

  const [calendarModeGrid, setCalendarModeGrid] = useState(CalendarView.Month);

  const customerDetail = props.customer && props.customerFieldsAvailable;
  const [customerFieldUnavailable, setCustomerFieldUnavailable] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [fieldCallback, setFieldCallback] = useState({});
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [countSave] = useState({});
  const [isEditAvailableField, setIsEditAvailableField] = useState(false);
  const tabSummaryRef = useRef(null);
  const displayRangeRef = useRef(null);
  const tableListRef = useRef(null);
  const [heightTable, setHeightTable] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDelete, setIsDelete] = useState(false);
  const [normalMessage, setNormalMessage] = useState(null);
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState(null);
  const [callApiUpdate, setCallApiUpdate] = useState('');
  const [openCreateBusinessCard, setOpenCreateBusinessCard] = useState(false);
  const [openModalCreateEditActivity, setOpenModalCreateEditActivity] = useState(false);
  const [createEditActivityParams, setCreateEditActivityParams] = useState({
    activityId: null, activityDraftId: null, actionType: ACTIVITY_ACTION_TYPES.CREATE, viewMode: ACTIVITY_VIEW_MODES.EDITABLE
  });
  const [openModalCreateCalendar, setOpenModalCreateCalendar] = useState(false);
  const actionTabRef = useRef(null);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const [isLoadEmployee, setIsLoadEmployee] = useState(false);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([]);
  const [showScenarioPopup, setShowScenarioPopup] = useState(false);
  const [scenarioId, setScenarioId] = useState(null);
  // product trading field
  const [tabProductTradingFields, setTabProductTradingFields] = useState([]);
  const [tabProductTradingFieldsOrigin, setTabProductTradingFieldsOrigin] = useState([]);
  const [tabTaskFields, setTabTaskFields] = useState([]);
  const [tabTaskFieldsOrigin, setTabTaskFieldsOrigin] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);
  const [deleteTabProductTradingFields, setDeleteTabProductTradingFields] = useState([]);
  const [deleteTabTaskFields, setDeleteTabTaskFields] = useState([]);
  const [isShowTimeline, setShowTimeline] = useState(true);
  const [screenMode, setScreenMode] = useState(props.screenMode);
  const [isShowRelationCustomers, setShowRelationCustomers] = useState(false);
  const [isDataChange, setIsDataChange] = useState(false);
  const [cloneTabTaskFields, setCloneTabTaskFields] = useState([]);
  const [cloneTabProductTradingFields, setCloneTabProductTradingFields] = useState([]);
  const [clickTab, setClickTab] = useState(false);
  const formId = "form-customer-detail";
  const classAddCreateOrther: string[][] = [['input-check-image']];
  const [isChanged] = useDetectFormChange(formId, [screenMode], classAddCreateOrther);
  const { screenMoveInfo } = props;

  const [openCustomerIntegration, setOpenCustomerIntegration] = useState(false);

  const isScreenDisplay = useMemo(() => isScreenModeDisplay(screenMode), [screenMode]);

  const isScreenEdit = useMemo(() => isScreenModeEdit(screenMode), [screenMode]);

  const [isFirstCustomerDetailFromList, setIsFirstCustomerDetailFromList] = useState(true);
  const [badgesCalendar, setBadgesCalendar] = useState(null);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const employeeDetailCtrlId = useId(1, "customerDetailEmployeeDetail_")
  const scenarioPopupCtrlId = useId(1, "customerDetailScenarioPopup_")

  useEffect(() => {
    const prevCustomerIdsTmp = props.prevCustomerIds || []
    const isOpenCustomerDetailNotFromListTmp = props.isOpenCustomerDetailNotFromList
    if (isOpenCustomerDetailNotFromListTmp || prevCustomerIdsTmp.length > 0) {
      setIsFirstCustomerDetailFromList(false)
    } else {
      setIsFirstCustomerDetailFromList(true)
    }
  }, [props.isOpenCustomerDetailNotFromList, props.prevCustomerIds])

  useEffect(() => {
    if (summaryFieldRevert && summaryFields && customerFieldUnavailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, customerFieldUnavailable, summaryFieldRevert));
    }
  }, [summaryFields, customerFieldUnavailable])

  useEffect(() => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({ type: MessageType.None, message: [] })
      setEditedSummaryFields([])
    }
    setScreenMode(props.screenMode);
  }, [props.screenMode]);

  useEffect(() => {
    if (props.customer) {
      const fields = props.customer.fields.filter(e => !arrFieldNameReject.includes(e.fieldName));
      setCustomerFields(fields);
      setSummaryFieldRevert(fields);
      const scenarioIdTmp = R.path(['customer', 'scenarioId'], props.customer) || null;
      setScenarioId(scenarioIdTmp);
      setScheduleData({
        customer: {
          customerId: props.customerId ? props.customerId : null,
          customerName: props.customer && props.customer.customer ? props.customer.customer.customerName : '',
        }
      });
    }
    setCustomerFieldUnavailable(_.cloneDeep(props.customerFieldsUnVailable));
  }, [props.customer])

  useEffect(() => {
    if (props.customerSuccessMessage) {
      setCallApiUpdate(props.customerSuccessMessage);
    }
  }, [props.customerSuccessMessage]);

  useEffect(() => {
    if (props.openFromMilestone && props.displayActivitiesTab) {
      setCurrentTab(TAB_ID_LIST.activityHistory);
    }
  }, [props.openFromMilestone, props.displayActivitiesTab]);

  /**
   * Check change data
   */
  const isChangeInputEdit = () => {
    let isChange = false;
    if (isScreenEdit) {
      const oldData = {
        summaryField: _.cloneDeep(props.customerFieldsAvailable.fields),
        tabList: _.cloneDeep(props.customer.tabsInfo)
      };
      if (summaryFields === null && tabListUpdate === null && popupSettingMode !== SettingModes.EditInput) {
        isChange = false;
      } else {
        if (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList)) {
          isChange = true;
        }
        if (!_.isNil(summaryFields)) {
          summaryFields.forEach(field => {
            if (field.userModifyFlg && field.userModifyFlg === true) {
              isChange = true;
            }
          });
        }
      }
    } else {
      isChange = false;
    }
    if (isChanged) {
      isChange = true;
    }
    if (isDelete) {
      isChange = true;
    }
    return isChange;
  };
  const handleToggleFollowed = () => {
    const param = {
      followTargetType: 1,
      followTargetId: props.customerId,
    };
    if (props.isFollowed) {
      props.handleDeleteFollowed(param);
    } else {
      props.handleCreateFollowed(param);
    }
  };


  /**
   * Get condition filter by display range
   */
  const getParamByDisplayRange = (customerIdSelected, tab) => {
    const param = {
      mode: 'detail',
      customerId: customerIdSelected,
      tabId: tab,
      isGetChildCustomer: false,
      isGetDataOfEmployee: true,
      tabFilter: null,
      hasTimeLine: true,
      childCustomerIds: []
    };
    param.isGetDataOfEmployee = (scopeCondition === ConditionScope.PersonInCharge);
    param.isGetChildCustomer = (rangeCondition === ConditionRange.ThisAndChildren);

    // switch (tab) {
    //   case TAB_ID_LIST.summary:
    //     break;
    //   case TAB_ID_LIST.calendar: {
    //     const tabFilter = {
    //       calendarType: 1,
    //       date: '2020/05/05'
    //     };
    //     param.tabFilter = tabFilter;
    //     break;
    //   }
    //   default:
    //     break;
    // }
    return param;
  };


  const displayNormalMessage = (message, type) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
  };

  /**
   * execute dirty check
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, patternType?: number) => {
    const partternType = patternType || DIRTYCHECK_PARTTERN.PARTTERN1;
    const isChange = isChangeInputEdit();
    if (isChange || isDataChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType });
    } else {
      action();
    }
  };

  /**
   * Close popup
   */
  const handleClosePopup = () => {
    setShowConditionDisplay(PopupConditionDisplay.None);
    executeDirtyCheck(() => {
      props.reset();
      props.toggleClosePopupCustomerDetail(hasDataChanged);
    }, null, DIRTYCHECK_PARTTERN.PARTTERN2);
  };

  /**
   * Process close popup and new window
   */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.customer) {
      setTabList(props.customer.tabsInfo);
      const param = getParamByDisplayRange(props.customer.customerId, currentTab);
      props.handleInitCustomerDetail(param);
      setCustomerSuccessMsg(callApiUpdate);
      setCallApiUpdate('');
      if (props.popout) {
        setTimeout(() => { document.body.className = 'body-full-width wrap-customer' }, 300)
      }
      if (!isLoadEmployee && _.toArray(props.customer.fields).length > 0) {
        setFieldRelationTab(props.customer.fields.filter(e => isFieldRelationAsTab(e)))
        setIsLoadEmployee(true);
      }
      setCustomerFieldUnavailable(props.customerFieldsUnVailable)
    }
  }, [props.customer])

  /**
 * Handle for clicking the outside of dropdown
 * @param e
 */
  const handleClickOutside = (e) => {
    if (actionTabRef.current && !actionTabRef.current.contains(e.target)) {
      setIsOpenMenuAddTab(false);
    }
  }

  const getFieldInfoTabProductTrading = () => {
    props.getFieldInfoPersonals(
      `${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`,
      FIELD_BELONG.CUSTOMER,
      TAB_ID_LIST.tradingProduct,
      FieldInfoType.Tab,
      null,
      null
    );
  }

  const getFieldInfoTabTask = () => {
    props.getFieldInfoPersonals(
      `${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.TASK}`,
      FIELD_BELONG.CUSTOMER,
      TAB_ID_LIST.task,
      FieldInfoType.Tab,
      null,
      null
    );
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    document.body.className = "wrap-customer";
    // get task, product trading
    getFieldInfoTabTask();
    getFieldInfoTabProductTrading();
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
      document.body.className = document.body.className.replace('wrap-customer', '');
    };
  }, []);

  useEffect(() => {
    if (props.detailType === TYPE_DETAIL_MODAL.TASK || props.detailType === TYPE_DETAIL_MODAL.MILESTONE || props.detailType === TYPE_DETAIL_MODAL.SCHEDULE) {
      document.body.className = 'wrap-task modal-open';
    } else {
      document.body.className = 'wrap-customer modal-open';
    }
  }, [props.detailType])

  /**
   * Init data for renderTabContents
   * @param customerIdSelected current customer id
   * @param tab current tab id
   */
  const handleInitData = (customerIdSelected, tab) => {
    const param = getParamByDisplayRange(customerIdSelected, tab);
    // Get field info and init data for tab
    switch (tab) {
      case TAB_ID_LIST.summary:
        props.handleInitCustomerDetail(param);
        break;
      case TAB_ID_LIST.tradingProduct:
        getFieldInfoTabProductTrading();
        break;
      case TAB_ID_LIST.task:
        getFieldInfoTabTask();
        break;
      case TAB_ID_LIST.changeHistory:
        // CustomerTabChangeHistory
        props.handleInitChangeHistory(customerIdSelected, 1, 30, true);
        setCurrentPage(1);
        break;
      case TAB_ID_LIST.activityHistory:
        setCurrentPage(1);
        break;
      default:
        break;
    }
  };

  const resetStateExecuteDirtyCheck = () => {
    props.changeScreenMode(false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setCustomerFieldUnavailable(_.cloneDeep(props.customerFieldsUnVailable));
    setCurrentFieldEdit(null);
    setTabListShow(initialState.tabListShow);
    setTabList(initialState.tabList);
    setToastMessage(null);
    setFieldCallback({});
    // setIsOpenMenuAddTab(false);
    setDeletedSummaryFields([]);
    setNormalMessage({ type: MessageType.None, message: [] })
  }

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (currentCustomerId !== screenMoveInfo.objectId) setCurrentCustomerId(screenMoveInfo.objectId);
      if (currentTab !== TAB_ID_LIST.summary && !props.displayActivitiesTab) {
        setCurrentTab(TAB_ID_LIST.summary);
      }
      handleInitData(screenMoveInfo.objectId, TAB_ID_LIST.summary);
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === CustomerAction.UpdateCustomerSuccess) {
      props.handleGetCustomerLayout();
      handleInitData(currentCustomerId, currentTab);
      setSummaryFields(null);
      props.changeScreenMode(false);
      setFieldCallback(null);
      resetStateExecuteDirtyCheck();
      setHasDataChanged(true);
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action]);

  /**
   * Process get data when currentCustomerId, currentTab, filterDisplayRange changed
   */
  useEffect(() => {
    handleInitData(currentCustomerId, currentTab);
    setShouldRender(true);
    return () => {
      setShowConditionDisplay(PopupConditionDisplay.None);
    };
  }, [currentCustomerId, currentTab]);

  /**
   * Execute when currentCustomerId changed
   */
  useEffect(() => {
    if (currentCustomerId) {
      props.handleGetCustomerChild(currentCustomerId);
    }

    return () => {
      // props.reset();
      if (props.resetSuccessMessage) {
        props.resetSuccessMessage();
      }
      setCustomerSuccessMsg(null);
      props.clearShowDetail();
    };
  }, [currentCustomerId]);

  useEffect(() => {
    if (props.customerChild) {
      setShowCustomerTimeline(true);
      setCustomerChild(props.customerChild);
      const cloneChildId = [];
      props.customerChild.map(customer => cloneChildId.push(customer.customerId));
      setCustomerChildId(cloneChildId);
    }
  }, [props.customerChild])

  useEffect(() => {
    setCurrentCustomerId(props.customerId || path(['popoutParams', 'customerId'], props));
    setCurrentTab(TAB_ID_LIST.summary);
  }, [props.customerId, props.popoutParams]);

  /**
  * switch to histories Tab, openFromOtherServices
  *    */
  useEffect(() => {
    if (props.openFromOtherServices && props.displayActivitiesTab) {
      setCurrentTab(TAB_ID_LIST.activityHistory);
    }
  }, [props.openFromOtherServices, props.displayActivitiesTab]);

  /**
   * Execute when customer,tabListShow changed
   */
  useEffect(() => {
    if (props.customer) {
      const tabListData = _.cloneDeep(props.tabListShow);
      tabListData && tabListData.forEach(element => {
        if (element.tabId === TAB_ID_LIST.calendar) {
          element['badges'] = badgesCalendar;
          return;
        }
      });
      setTabListShow(tabListData);
    }
  }, [props.customer, props.tabListShow]);

  useEffect(() => {
    if (props.badgesCalendar !== 0 || props.badgesTask || props.badgesProductTrading) {
      setBadgesCalendar(props.badgesCalendar)
      const tabListData = _.cloneDeep(tabListShow);
      tabListData?.forEach(element => {
        if (element.tabId === TAB_ID_LIST.calendar) {
          element['badges'] = props.badgesCalendar;
        }
        if (element.tabId === TAB_ID_LIST.task) {
          element['badges'] = props.badgesTask;
        }
        if (element.tabId === TAB_ID_LIST.tradingProduct) {
          element['badges'] = props.badgesProductTrading;
        }
      });
      setTabListShow(tabListData);
    }
  }, [props.badgesCalendar, props.badgesTask, props.badgesProductTrading])

  
  /**
   * Process get,set data session
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const obj = {
        screenMode,
        summaryFields,
        customerFields,
        tabListShow,
        currentTab,
        currentCustomer: currentCustomerId,
        tradingProductsFields,
        businessCardsFields,
        customerLayout,
        listCustomerId,
        tabProductTradingFields,
        tabTaskFields,
        deleteTabProductTradingFields,
        deleteTabTaskFields,
      };
      Storage.local.set(PopupCustomerDetail.name, _.cloneDeep(obj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(PopupCustomerDetail.name));
      if (saveObj) {
        setScreenMode(saveObj.screenMode);
        setSummaryFields(saveObj.summaryFields);
        setCustomerFields(saveObj.customerFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setCurrentCustomerId(saveObj.currentCustomer);
        setTradingProductsFields(saveObj.tradingProductsFields);
        setBusinessCardsFields(saveObj.businessCardsFields);
        setCustomerLayout(saveObj.customerLayout);
        setListCustomerId(saveObj.listCustomerId);
        setTabProductTradingFields(saveObj.tabProductTradingFields);
        setTabTaskFields(saveObj.tabTaskFields);
        setDeleteTabProductTradingFields(saveObj.deleteTabProductTradingFields);
        setDeleteTabTaskFields(saveObj.deleteTabTaskFields);
        handleInitData(saveObj.currentCustomer, saveObj.currentTab);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupCustomerDetail.name);
    }
  };

  /**
   * Execute when first open screen
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
      setForceCloseWindow(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
    } else {
      setShowModal(true);
      setShouldRender(true);
    }
    const param = {
      followTargetType: 1,
      followTargetId: props.customerId,
    }
    props.handleGetCustomerFollowed(param);
  }, []);

  /**
   * Copy url customer detail to clipbroad
   */
  const copyUrlCustomerDetail = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/customer-detail/${currentCustomerId}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  /**
   * Open new window
   */
  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/customer-detail/${currentCustomerId}`, '', style.toString());
    // close popup without dirtyCheck
    setShowConditionDisplay(PopupConditionDisplay.None);
    props.toggleClosePopupCustomerDetail();
  };

  // const handleOpenNewWindow = () => {
  //   if (props.screenMode === ScreenMode.EDIT) {
  //     executeDirtyCheck(() => {
  //       openNewWindow();
  //     })
  //   } else {
  //     openNewWindow();
  //   }
  // }

  /**
   * Parse error message when delete customer
   */
  const parseErrorMessageDeleteCustomerRes = data => {
    const arrErrMessageDeleteCustomer = [];
    if (props.errorMessageDeleteCustomer && customerDetail && customerDetail.customer) {
      const customerName = customerDetail.customer.customerName;
      Object.keys(data).forEach(item => {
        if (item !== 'customerId') {
          const count = data[item];
          const message = translate('customers.detail.error.delete.' + item, { customerName, count });
          arrErrMessageDeleteCustomer.push(message);
        }
      });
    }
    return arrErrMessageDeleteCustomer;
  };

  /**
   * Disable dialog confirm delete when delete customer error
   */
  const disablePopupDeleteErr = () => {
    setIsShowPopupDelErr(false);
  };

  /**
   * Open edit customer
   */
  const onOpenModalCustomer = (actionType, viewMode, customer) => {
    const setDataModalCustomer = () => {
      setOpenModalCustomer(true);
      setCustomerActionType(actionType);
      setCustomerViewMode(viewMode);
      setCurrentCustomerId(customer);
      setCustomerSuccessMsg(null);
    }
    if (!openModalCustomer) {
      if (viewMode !== CUSTOMER_VIEW_MODES.PREVIEW && props.screenMode !== ScreenMode.DISPLAY) {
        executeDirtyCheck(() => {
          setDataModalCustomer();
        });
      } else {
        setDataModalCustomer();
      }

    }
  };

  const onCloseModalCustomer = (param) => {
    setOpenModalCustomer(false);
    if (param) {
      setHasDataChanged(true);
      setCallApiUpdate(param.message)
      if (currentTab !== TAB_ID_LIST.summary) {
        handleInitData(currentCustomerId, TAB_ID_LIST.summary);
      }
      handleInitData(currentCustomerId, currentTab);
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) || _.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD)) {
      props.toggleClosePopupCustomerDetail(hasDataChanged);
    }
  }

  /**
   * Dialog confirm delete customer
   */
  const showConfirmDelete = async () => {
    const itemName = customerDetail.customer.customerName;
    const result = await ConfirmDialog({
      title: <>{translate('customers.detail.title.popupErrorMessage.delete')}</>,
      message: StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName }),
      confirmText: translate('customers.detail.title.popupErrorMessage.delete'),
      confirmClass: 'button-red',
      cancelText: translate('customers.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    return result;
  };

  /**
   * Execute delete
   */
  const executeDelete = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete();
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  };

  const countRelation = (arrayR) => {
    let count = 0;
    arrayR && arrayR.length > 0 && arrayR.map(item => {
      for (const property in item) {
        if (property !== 'customerId' && item[property]) {
          count += item[property];
        }
      }
    })
    return count;
  }

  /**
   * Check employees have related data or not
   */
  const hasRelationData = () => {
    return countRelation(props.relationCustomerData) > 0;
  }

  const callApiDelete = () => {
    props.handleInitDeleteCustomer(currentCustomerId);
    setShowRelationCustomers(false);
  }

  /**
   * Process delete customer
   */
  const deleteCustomer = () => {
    executeDelete(() => {
      props.handleCountRelationCustomers([currentCustomerId]);
    });
  };

  useEffect(() => {
    if (props.relationCustomerData) {
      if (hasRelationData()) {
        setShowRelationCustomers(true);
      } else {
        callApiDelete();
      }
    }
  }, [props.relationCustomerData])

  /**
   * close modal create task
   */
  const onCloseModalTask = actionStatus => {
    if (openModalTaskCreate) {
      setOpenModalTaskCreate(false);
    }
    if (actionStatus) {
      // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
      //      props.handleSearchTask({});
    }
  };

  const getIndexCurrentCustomer = () => {
    let index = null;
    listCustomerId.forEach((id, idx) => {
      if (currentCustomerId === id) {
        index = idx;
      }
    });
    return index;
  };

  /**
   * Next customer
   */
  const onNextCustomer = () => {
    let nextCustomerId = null;
    const indexCurrentCustomer = getIndexCurrentCustomer();
    listCustomerId.forEach((id, idx) => {
      if (idx === indexCurrentCustomer) {
        nextCustomerId = listCustomerId[idx + 1];
      }
    });
    executeDirtyCheck(() => {
      setCurrentCustomerId(_.cloneDeep(nextCustomerId));
      const param = getParamByDisplayRange(nextCustomerId, currentTab);
      props.handleInitCustomerDetail(param);
      resetStateExecuteDirtyCheck();
    })
  };

  /**
   * Prev customer
   */
  const onPrevCustomer = () => {
    let prevCustomerId = null;
    const indexCurrentCustomer = getIndexCurrentCustomer();
    listCustomerId.forEach((id, idx) => {
      if (idx === indexCurrentCustomer) {
        prevCustomerId = listCustomerId[idx - 1];
      }
    });
    executeDirtyCheck(() => {
      setCurrentCustomerId(_.cloneDeep(prevCustomerId));
      const param = getParamByDisplayRange(prevCustomerId, currentTab);
      props.handleInitCustomerDetail(param);
      resetStateExecuteDirtyCheck();
    })
  };

  /**
   * Execute when close screen
   */
  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  /**
   * Execute when receive message
   */
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else if (!ev.data.keepOpen) {
          handleClosePopup();
        }
      }
    }
  };

  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message: [message], styleClass };
    setToastMessage(objParams);
    if (type === MessageType.Success || message === WAR_COM_0010 || message === "WAR_COM_0013") {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const getErrorMessage = errorCode => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  };

  /**
   * Action change tab
   */
  const changeTab = clickedTabId => {
    setCurrentTab(clickedTabId);
    setClickTab(true);
  };

  useEffect(() => {
    if (props.tabProductTradingFieldsProps) {
      setTabProductTradingFields(props.tabProductTradingFieldsProps);
      setTabProductTradingFieldsOrigin(props.tabProductTradingFieldsProps);
    }
  }, [props.tabProductTradingFieldsProps]);

  useEffect(() => {
    if (props.tabTaskFieldsProps) {
      setTabTaskFields(props.tabTaskFieldsProps);
      setTabTaskFieldsOrigin(props.tabTaskFieldsProps);
    }
  }, [props.tabTaskFieldsProps]);

  const updateCustomFieldInfo = () => {
    setCloneTabTaskFields(tabTaskFields);
    setCloneTabProductTradingFields(tabProductTradingFields);
    if (tabListUpdate !== null) {
      tabListUpdate.map(item => {
        delete item.tabLabel;
        delete item.fieldOrder;
        delete item.badges;
      });
    }
    const summaryFieldsTmp = _.cloneDeep(summaryFields);
    const fieldsUpdate = [];
    if (!_.isNil(summaryFields)) {
      customerFieldUnavailable.forEach(field => {
        const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          summaryFieldsTmp.push(field);
        }
      });
    }
    const deleteSummaryFieldTmp = _.cloneDeep(deletedSummaryFields);
    deleteFieldUnavailable.forEach(field => {
      const index = deletedSummaryFields.findIndex(e => e.fieldId !== field.fieldId);
      if (index < 0) {
        deleteSummaryFieldTmp.push(field);
      }
    });
    if (summaryFieldsTmp !== null) {
      summaryFieldsTmp.map(item => {
        const field = _.cloneDeep(item);
        delete field.fieldBelong;
        delete field.createdDate;
        delete field.createdUser;
        delete field.updatedUser;
        if (!_.isNil(field.oldField)) {
          delete field.oldField;
        }
        if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(field.relationField)) {
          if (!_.isNil(field.relationField.isMultiToSingle)) {
            delete field.relationField.isMultiToSingle;
          }
          const relationField = _.cloneDeep(field.relationField);
          delete field.relationField;
          fieldsUpdate.push(field);
          relationField.fieldLabel =
            !_.isNil(relationField) && _.isString(relationField.fieldLabel)
              ? relationField.fieldLabel
              : JSON.stringify(relationField.fieldLabel);
          delete relationField.createdDate;
          delete relationField.createdUser;
          delete relationField.updatedUser;
          fieldsUpdate.push(relationField);
        } else {
          fieldsUpdate.push(field);
        }
      });
    }
    const fieldProductTradingTab = [];
    tabProductTradingFields.forEach(field => {
      fieldProductTradingTab.push({
        fieldId: field.fieldId,
        fieldOrder: field.fieldOrder,
        tabId: TAB_ID_LIST.tradingProduct,
        fieldInfoTabId: field.fieldInfoTabId
      });
    });
    const fieldTaskTab = [];
    tabTaskFields.forEach(field => {
      fieldTaskTab.push({
        fieldId: field.fieldId,
        fieldOrder: field.fieldOrder,
        tabId: TAB_ID_LIST.task,
        fieldInfoTabId: field.fieldInfoTabId
      });
    });
    // delete field
    const deleteTabIdTaskFields = [];
    deleteTabTaskFields.forEach(field => {
      if (field.fieldInfoTabId) {
        deleteTabIdTaskFields.push(field.fieldInfoTabId);
      }
    })

    const deleteTabIdProductTradingFields = [];
    deleteTabProductTradingFields.forEach(field => {
      if (field.fieldInfoTabId) {
        deleteTabIdProductTradingFields.push(field.fieldInfoTabId);
      }
    })
    props.handleUpdateCustomFieldInfo(FIELD_BELONG.CUSTOMER, deletedSummaryFields,
      fieldsUpdate, tabListUpdate, [...deleteTabIdTaskFields, ...deleteTabIdProductTradingFields], [...fieldProductTradingTab, ...fieldTaskTab]);
    props.changeScreenMode(false);
  };

  /**
   * Action drag drop tab
   */
  const onDragDropTabList = (dragTabId, dropTabId) => {
    const dragIndexListShow = tabListShow.findIndex(e => e.tabId === dragTabId);
    let dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
    const dragIndexList = tabList.findIndex(e => e.tabId === dragTabId);
    let dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
    if (dragIndexListShow < 0 || dropIndexListShow < 0 || dragIndexListShow === dropIndexListShow) {
      return;
    }
    const objParamListShow = [];
    const objParamList = [];
    if (Math.abs(dragIndexListShow - dropIndexListShow) === 1) {
      const tempObjectListShow = tabListShow.splice(dragIndexListShow, 1, tabListShow[dropIndexListShow])[0]; // get the item from the array
      tabListShow.splice(dropIndexListShow, 1, tempObjectListShow);
    } else {
      const tmpObjectListShow = tabListShow.splice(dragIndexListShow, 1)[0]; // get the item from the array
      dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
      tabListShow.splice(dropIndexListShow, 0, tmpObjectListShow);
    }
    if (Math.abs(dragIndexList - dropIndexList) === 1) {
      const tempObjectList = tabList.splice(dragIndexList, 1, tabList[dropIndexList])[0]; // get the item from the array
      tabList.splice(dropIndexList, 1, tempObjectList);
    } else {
      const tmpObjectList = tabList.splice(dragIndexList, 1)[0]; // get the item from the array
      dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
      tabList.splice(dropIndexList, 0, tmpObjectList);
    }

    for (let i = 0; i < tabListShow.length; i++) {
      objParamListShow.push(_.cloneDeep(tabListShow[i]));
      objParamListShow[i].tabOrder = i + 1;
    }
    for (let i = 0; i < tabList.length; i++) {
      objParamList.push(_.cloneDeep(tabList[i]));
      objParamList[i].tabOrder = i + 1;
    }
    setTabListShow(objParamListShow);
    setTabList(objParamList);
    setTabListUpdate(objParamList);
  };

  const onDelAddTab = (tabListDelAddAfter, tabListAfter) => {
    const tabArray = [];
    if (tabListDelAddAfter.length > 0) {
      setTabListShow(_.cloneDeep(tabListDelAddAfter));
      tabListDelAddAfter.forEach(it => {
        tabArray.push(it.tabId);
      })
    }
    let listTemp = tabListAfter.sort((a, b) => a.tabOrder - b.tabOrder);
    listTemp = listTemp.map((it, index) => {
      let obj = {};
      if (tabArray.includes(it.tabId)) {
        obj = Object.assign(it, { isDisplay: true, tabOrder: index + 1 });
      } else {
        obj = Object.assign(it, { isDisplay: false, tabOrder: tabListDelAddAfter.length + index + 1 });
      }
      return obj;
    })
    const difference = tabListAfter.filter(x => !tabListDelAddAfter.includes(x));
    const deletedFields = [];
    difference.map(f => deletedFields.push(f.tabId));
    setDeletedSummaryFields(deletedFields);
    setTabListUpdate(listTemp);
    setTabList(_.cloneDeep(tabListAfter));
  };

  let isChangeField = false;
  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  };

  const openDynamicSelectFields = async (currentSettingMode, currentField) => {
    if (
      isChangeField &&
      currentFieldEdit &&
      (currentField.fieldId > 0 || (currentField.fieldId < 0 && !_.isNil(currentField.userModifyFlg))) &&
      currentField.fieldId !== currentFieldEdit.fieldId
    ) {
      const onEdit = () => {
        setPopupSettingMode(currentSettingMode);
        setCurrentFieldEdit(currentField);
      };
      const onCancel = () => { };
      await DialogDirtyCheck({
        onLeave: onEdit,
        onStay: onCancel
      });
    } else {
      setPopupSettingMode(currentSettingMode);
      setCurrentFieldEdit(currentField);
    }
    if (currentFieldEdit && currentFieldEdit.fieldId < 0 && _.isNil(currentFieldEdit.userModifyFlg)
      && _.isNil(countSave[currentFieldEdit.fieldId]) && currentField.fieldId !== currentFieldEdit.fieldId) {
      const summaryFieldsTmp = _.cloneDeep(summaryFields);
      const idx = summaryFieldsTmp.findIndex(e => e.fieldId === currentFieldEdit.fieldId);
      if (idx >= 0) {
        countSave[currentFieldEdit.fieldId] = 0;
        summaryFieldsTmp.splice(idx, 1);
        setSummaryFields(summaryFieldsTmp);
      }
    }
  };

  const deleteFieldUnAvailable = fieldInfo => {
    const fieldsUnAvailable = _.cloneDeep(customerFieldUnavailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setCustomerFieldUnavailable(fieldsUnAvailable);
    }
  };

  const destroySaveField = () => {
    setIsSaveField(false);
  };

  const onSaveField = (fields, paramsEditField, fieldInfoEdit) => {
    setCurrentFieldEdit(null);
    let deleteField = [];
    let listField = _.cloneDeep(fields);
    const resultProcess = processRelationSelectOrganization(listField, paramsEditField, deleteField);
    listField = resultProcess.listField;
    deleteField = resultProcess.deleteField;
    const newParamsEditField = resultProcess.newParamsEditField;
    listField = putDataToFieldEdit(listField, newParamsEditField, fieldInfoEdit);

    listField.forEach((field, index) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        const newLookup = createNewFieldLookup(listField, field, deleteField)
        listField = newLookup.listField;
        deleteField = newLookup.deleteField;
      }
      if (field.fieldId === fieldInfoEdit.fieldId) {
        if (field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
          const idx = customerFieldUnavailable.findIndex(e => e.fieldId === field.fieldId);
          if (idx < 0) {
            customerFieldUnavailable.push(field);
          } else {
            customerFieldUnavailable[idx] = field;
          }
          displayToastMessage(WAR_COM_0010, MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
          listField.splice(index, 1);
        } else if (field.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          if (listField.findIndex(e => e.fieldId === field.fieldId) < 0) {
            listField.push(field);
          }
          if (editedSummaryFields.findIndex(e => e === field.fieldId) < 0) {
            editedSummaryFields.push(field.fieldId);
            setEditedSummaryFields(_.cloneDeep(editedSummaryFields));
          }
          const idxUnAvailable = customerFieldUnavailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            customerFieldUnavailable.splice(idxUnAvailable, 1);
          }
        }
      }
    });

    for (let i = 0; i < listField.length; i++) {
      listField[i].fieldOrder = i + 1;
    }
    const ret = { listField: null, deleteFields: null };

    setFieldRelationTab(listField.filter(e => isFieldRelationAsTab(e)));

    ret.listField = listField;
    ret.deleteFields = deleteField;
    setFieldCallback(_.cloneDeep(ret));
    return ret;
  };

  const onExecuteAction = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(props.customer.fields.filter(e => e.availableFlag > 0), customerFieldUnavailable, fieldInfo);
          if (summaryFields) {
            props.customer.fields.forEach(field => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field);
              }
            });
          }
          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
          const arrFieldDel = _.cloneDeep(deleteFieldUnavailable);
          if (saveFieldResult.deleteFields.length > 0) {
            arrFieldDel.push(...saveFieldResult.deleteFields);
          }
          setDeleteFieldUnavailable(arrFieldDel);
        }
        setFieldEdit(fieldInfo);
        setParamsEdit(params);
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.CANCEL:
        {
          const summaryFieldsTmp = _.cloneDeep(summaryFields);
          const idx = summaryFieldsTmp.findIndex(e => e.fieldId === fieldInfo.fieldId);
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0) && !fieldInfo.copyField) {
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
              countSave[fieldInfo.fieldId] = 0;
            }
            if (!_.isNil(summaryFields)) {
              setSummaryFields(summaryFieldsTmp);
            }
          } else if (fieldInfo.fieldId > 0 && fieldInfo.availableFlag === 0) {
            const idx2 = customerFieldUnavailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              customerFieldUnavailable.push(fieldInfo);
            }
          }
          if (isEditAvailableField) {
            setPopupSettingMode(SettingModes.AddNotAvailabelInput);
            setIsEditAvailableField(false);
          } else setPopupSettingMode(SettingModes.CreateNewInput);
          break;
        }
      case DynamicControlAction.DELETE:
        deleteFieldUnAvailable(fieldInfo);
        if (fieldInfo) {
          setIsDelete(true);
        }
        break;
      case DynamicControlAction.EDIT:
        if (!_.isNil(fieldInfo.fieldId)) {
          setIsEditAvailableField(true);
        }
        openDynamicSelectFields(SettingModes.EditInput, fieldInfo);
        if (fieldInfo.fieldId === null) {
          tabSummaryRef.current.onAddNewField(fieldInfo);
        }
        break;
      default:
        break;
    }
  };

  const selectFieldTab = (listField, idTab) => {
    switch (idTab) {
      case TAB_ID_LIST.tradingProduct:
        setTabProductTradingFields(listField);
        setDeleteTabProductTradingFields(
          deleteTabProductTradingFields.filter(
            fieldDelete => !listField.find(f => f.fieldId === fieldDelete.fieldId))
        );
        break;
      case TAB_ID_LIST.task:
        setTabTaskFields(listField);
        setDeleteTabTaskFields(
          deleteTabTaskFields.filter(
            fieldDelete => !listField.find(f => f.fieldId === fieldDelete.fieldId))
        );
        break;
      default:
        break;
    }
  }

  const deleteFieldTab = (fieldDeleteId, idTab) => {
    let field;
    switch (idTab) {
      case TAB_ID_LIST.tradingProduct:
        field = tabProductTradingFields.find(f => f.fieldId === fieldDeleteId);
        setDeleteTabProductTradingFields([...deleteTabProductTradingFields, field]);
        break;
      case TAB_ID_LIST.task:
        field = tabTaskFields.find(f => f.fieldId === fieldDeleteId);
        setDeleteTabTaskFields([...deleteTabTaskFields, field]);
        break;
      default:
        break;
    }
  }

  const renderDynamicSelectFields = () => {
    if (currentTab === TAB_ID_LIST.task) {
      return <DynamicSelectFieldTab
        listFieldInfo={tabTaskFields}
        tabType={currentTab}
        selectFieldTab={selectFieldTab}
        deleteFieldTab={deleteFieldTab}
      />
    } else if (currentTab === TAB_ID_LIST.tradingProduct) {
      return <DynamicSelectFieldTab
        listFieldInfo={tabProductTradingFields}
        tabType={currentTab}
        selectFieldTab={selectFieldTab}
        deleteFieldTab={deleteFieldTab}
      />
    } else if (currentTab === TAB_ID_LIST.summary) {
      const listField = _.concat(summaryFields ? summaryFields : [], customerFieldUnavailable);
      return (
        <DynamicSelectField
          onChangeSettingField={isChangeSettingField}
          fieldsUnVailable={customerFieldUnavailable}
          currentSettingMode={popupSettingMode}
          listFieldInfo={listField}
          fieldInfos={currentFieldEdit}
          fieldNameExtension={'customer_data'}
          onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
          fieldBelong={FIELD_BELONG.CUSTOMER}
          getFieldsCallBack={
            !_.isEmpty(fieldCallback) ? fieldCallback : { listField: customerFields, deleteFields: null }
          }
        />
      );
    }
    return <></>
  };

  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      props.changeScreenMode(false);
      setPopupSettingMode(SettingModes.CreateNewInput);
      setTabListUpdate(null);
      setCurrentFieldEdit(null);
      setTabListShow(initialState.tabListShow);
      setTabList(initialState.tabList);
      setTabTaskFields(tabTaskFieldsOrigin);
      setTabProductTradingFields(tabProductTradingFieldsOrigin);
      setDeleteTabProductTradingFields([]);
      setDeleteTabTaskFields([]);
    });
  };

  const handleScroll = e => {
    // if (contentTabRef && contentTabRef.current.getBoundingClientRect().top === 180 ) {
    //   setMenuTabClass('');
    //   setMenuStyleScroll({});
    // }
    const element = e.target;

    // CustomerTabChangeHistory
    if (
      props.changeHistory &&
      props.changeHistory.length > 0 && // The previous empty result means that all the records have been taken
      currentTab === TAB_ID_LIST.changeHistory &&
      element.scrollHeight - element.scrollTop === element.clientHeight && !clickTab
    ) {
      props.handleInitChangeHistory(currentCustomerId, currentPage + 1, 30, false);
      setCurrentPage(currentPage + 1);
    }

    // DetailTabActivity
    if (
      currentTab === TAB_ID_LIST.activityHistory &&
      element.scrollHeight - element.scrollTop === element.clientHeight && !clickTab
    ) {
      let listCustomerIdParam = [currentCustomerId];
      const searchConditions = [];
      const scopeConditionTmp = {
        fieldType: 4,
        isDefault: true,
        fieldName: 'employee_id',
        fieldValue: JSON.stringify([decodeUserLogin()['custom:employee_id']])
      }
      if (rangeCondition === ConditionRange.ThisAndChildren) {
        let customerChildTmp = [];
        if (customerChild) {
          customerChildTmp = customerChild.map(item => Number.isInteger(item) ? item : item.customerId);
        }
        listCustomerIdParam = [currentCustomerId].concat(customerChildTmp);
      }
      if (scopeCondition === ConditionScope.PersonInCharge) {
        searchConditions.push(scopeConditionTmp);
      }
      const param: GetActivitiesForm = {
        limit: (currentPage + 1) * 30,
        listCustomerId: listCustomerIdParam,
        searchConditions
      }
      props.handleInitActivities(param);
      setCurrentPage(currentPage + 1);
    }
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      setClickTab(false);
    }
  };

  useEffect(() => {
    if (customerSuccessMsg) {
      displayToastMessage(customerSuccessMsg, MessageType.Success, 'block-feedback block-feedback-green text-left');
    }
  }, [customerSuccessMsg]);

  useEffect(() => {
    setHasDataChanged(!_.isEmpty(props.messageChangeStatusSuccess));
    displayToastMessage(props.messageChangeStatusSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  }, [props.messageChangeStatusSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageChangeStatusFailed, MessageType.Error);
  }, [props.errorMessageChangeStatusFailed]);

  useEffect(() => {
    setHasDataChanged(!_.isEmpty(props.messageUpdateCustomFieldInfoSuccess));
    displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
    setTabTaskFieldsOrigin(cloneTabTaskFields);
    setTabProductTradingFieldsOrigin(cloneTabProductTradingFields);
  }, [props.messageUpdateCustomFieldInfoSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageDeleteCustomer, MessageType.Error);
  }, [props.errorMessageDeleteCustomer]);

  useEffect(() => {
    displayToastMessage(props.messageDeleteSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
    if (props.messageDeleteSuccess) {
      setHasDataChanged(true);
      setTimeout(() => {
        if (props.popout) {
          setForceCloseWindow(true);
          handleClosePopup();
        } else handleClosePopup();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }, [props.messageDeleteSuccess]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, customerFieldUnavailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setCustomerFieldUnavailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
    }
  }, [props.messageUpdateCustomFieldInfoError]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageGetUrlQuicksight, MessageType.Error);
  }, [props.errorMessageGetUrlQuicksight]);

  const onActionChangeRange = (scopeConditionNew, rangeConditionNew, isChangeScope) => {

    if (isChangeScope) {
      setScopeCondition(scopeConditionNew);
    }
    else {
      setRangeCondition(rangeConditionNew);
    }
    // TODO:
    const param = {
      mode: 'detail',
      customerId: currentCustomerId,
      tabId: currentTab,
      isGetChildCustomer: !isChangeScope ? rangeConditionNew === ConditionRange.ThisAndChildren : rangeCondition === ConditionRange.ThisAndChildren,
      isGetDataOfEmployee: isChangeScope ? scopeConditionNew === ConditionScope.PersonInCharge : scopeCondition === ConditionScope.PersonInCharge,
      tabFilter: null,
      hasTimeLine: true,
      childCustomerIds: []
    };
    if (currentTab === TAB_ID_LIST.summary) {
      props.handleInitCustomerDetail(param);
    }
  }

  /**
   * Render area display range
   */
  const renderDisplayRange = () => {
    return (
      <div className="select-box card position-absolute">
        <div className="wrap-check-radio unset-height">
          <p className="radio-item">
            <input type="radio" id="radio111" name="name-radio3"
              checked={scopeCondition === ConditionScope.Total}
              onClick={() => onActionChangeRange(ConditionScope.Total, null, true)}
            />
            <label htmlFor="radio111">{translate('customers.detail.label.displayRange.showAll')}</label>
          </p>
          <p className="radio-item">
            <input type="radio" id="radio112" name="name-radio3"
              checked={scopeCondition === ConditionScope.PersonInCharge}
              onClick={() => onActionChangeRange(ConditionScope.PersonInCharge, null, true)} />
            <label htmlFor="radio112">{translate('customers.detail.label.displayRange.displayOnlyUserLogin')}</label>
          </p>
        </div>
        <div className="wrap-check-radio unset-height">
          <p className="radio-item">
            <input type="radio" id="radio113" name="name-radio4"
              checked={rangeCondition === ConditionRange.ThisAndChildren}
              onClick={() => onActionChangeRange(null, ConditionRange.ThisAndChildren, false)} />
            <label htmlFor="radio113">{translate('customers.detail.label.displayRange.allCustomer')}</label>
          </p>
          <p className="radio-item">
            <input type="radio" id="radio114" name="name-radio4"
              checked={rangeCondition === ConditionRange.ThisCustomerOnly}
              onClick={() => onActionChangeRange(null, ConditionRange.ThisCustomerOnly, false)} />
            <label htmlFor="radio114">{translate('customers.detail.label.displayRange.customerCurrentOpen')}</label>
          </p>
        </div>
      </div>
    );
  };


  const renderToastMessage = () => {
    return (<>
      <div className="message-area message-area-bottom position-absolute">
        {toastMessage.message.map((messsageParams, idx) => {
          return (
            <BoxMessage
              key={idx}
              messageType={toastMessage.type}
              message={getErrorMessage(messsageParams)}
              styleClassMessage={toastMessage.styleClass}
              className=" "
            />
          );
        })}
      </div>
    </>)
  }

  const renderToastMessageSuccess = () => {
    if (toastMessage !== null && toastMessage.type === MessageType.Success) {
      return (
        renderToastMessage()
      );
    }
  }

  const renderToastMessageErrorOrWarning = () => {
    if (toastMessage !== null && (toastMessage.type === MessageType.Warning || toastMessage.type === MessageType.Error)) {
      return (
        renderToastMessage()
      );
    }
  }

  const renderMessage = () => {
    if (normalMessage === null) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={normalMessage.type} message={messageDownloadFileError} />;
      }
    } else {
      return (
        <>
          {normalMessage.message.map((messsageParams, idx) => {
            return (
              <>
                {messsageParams.map((item, index) => {
                  return <BoxMessage key={index} messageType={normalMessage.type} message={getErrorMessage(item.errorCode)} />;
                })}
              </>
            );
          })}
        </>
      );
    }
  };

  /**
   * Show popup if customerId exists
   */
  const handleOpenCustomerIntegration = () => {
    executeDirtyCheck(() => {
      if (props.customerId) {
        setOpenCustomerIntegration(true);
      }
      resetStateExecuteDirtyCheck();
    })
  };

  /**
   * Close Customer Integration Modal
   * @param reloadFlag
   */
  const handleCloseCustomerIntegration = (reloadFlag?: boolean, customerSaveId?: number, msgSuccess?: any) => {
    setOpenCustomerIntegration(false);
    if (msgSuccess) {
      displayToastMessage(msgSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
    }
    if (customerSaveId && props.customerId !== customerSaveId) {
      handleClosePopup()
    } else if (reloadFlag) {
      const paramReload = getParamByDisplayRange(customerSaveId, currentTab);
      props.handleInitCustomerDetail(paramReload);
    }
  };

  const handleOpenModalCreateUpdateActivity = (activityId, activityDraftId, actionType, viewMode) => {
    executeDirtyCheck(() => {
      setCreateEditActivityParams({ activityId, activityDraftId, actionType, viewMode });
      setOpenModalCreateEditActivity(true);
    })
  }

  const rederCustomerPreview = () => {
    if (listCustomerId
      && currentCustomerId !== listCustomerId[0]
      && isFirstCustomerDetailFromList) {
      return <a className="icon-small-primary icon-prev" onClick={onPrevCustomer} />
    } else {
      return <a className="icon-small-primary icon-prev disable" />
    }
  }

  const rederCustomerNext = () => {
    if (listCustomerId
      && currentCustomerId !== listCustomerId[listCustomerId.length - 1]
      && isFirstCustomerDetailFromList) {
      return <a className="icon-small-primary icon-next" onClick={onNextCustomer} />
    } else {
      return <a className="icon-small-primary icon-next disable" />
    }
  }

  /**
   * Render area tool on top screen
   */
  const renderPopupTool = () => {
    return (
      <div className="popup-tool">
        <div className="left w30" >
          <a className="icon-tool mr-2 width-20 d-inline-block" onClick={() => executeDirtyCheck(() => setOpenCreateBusinessCard(true))}>
            <img src="../../../content/images/ic-sidebar-business-card.svg" alt="" />
          </a>
          <a className="icon-tool mr-2" onClick={() => handleOpenModalCreateUpdateActivity(null, null, ACTIVITY_ACTION_TYPES.CREATE, ACTIVITY_VIEW_MODES.EDITABLE)}>
            <img src="../../../content/images/common/ic-bag.svg" alt="" />
          </a>
          <a className="icon-tool mr-2" onClick={() => executeDirtyCheck(() => setOpenModalCreateCalendar(true))}>
            <img src="../../../content/images/icon-calendar.svg" alt="" />
          </a>
          <a className="icon-tool mr-2" onClick={() => executeDirtyCheck(() => setOpenModalTaskCreate(true))}>
            <img src="../../../content/images/calendar/ic-task-brown.svg" alt="" />
          </a>
          <a className="icon-tool mr-2">
            <img src="../../../content/images/icon-mail-white.svg" alt="" />
          </a>
          {renderMessage()}
        </div>
        {isScreenEdit && (
          <a
            className="button-primary button-activity-registration content-left"
            onClick={() =>
              onOpenModalCustomer(CUSTOMER_ACTION_TYPES.CREATE, CUSTOMER_VIEW_MODES.PREVIEW, currentCustomerId)
            }>
            {translate('employees.detail.label.button.preview')}
          </a>
        )}
        <div className="right">
          {!isScreenEdit && (
            <>
              <a
                onClick={() => onOpenModalCustomer(CUSTOMER_ACTION_TYPES.UPDATE, CUSTOMER_VIEW_MODES.EDITABLE, currentCustomerId)}
                className="icon-small-primary icon-edit-small"
              />
              <a onClick={deleteCustomer} className="icon-small-primary icon-erase-small" />
              <a title="" className="icon-small-primary icon-integration-small" onClick={handleOpenCustomerIntegration}></a>
              <div className="button-pull-down-parent" ref={displayRangeRef}>
                <a
                  className={isDisplayRange ? 'button-pull-down-small active' : 'button-pull-down-small boder-bold'}
                  onClick={() => setIsDisplayRange(!isDisplayRange)}
                >
                  {translate('customers.detail.label.displayRange')}
                </a>
                {isDisplayRange && renderDisplayRange()}
              </div>
            </>
          )}
          {isScreenDisplay && (
            <a className="button-primary button-add-new" onClick={() => props.changeScreenMode(true)}>
              {translate('customers.detail.label.button.edit')}
            </a>
          )}
          {isScreenEdit && (
            <>
              <a onClick={handleClosePopupModeEdit} className="button-cancel">
                {translate('employees.detail.label.button.cancel')}
              </a>
              {_.isEqual(popupSettingMode, SettingModes.EditInput) ? (
                <a className="button-blue disable">{translate('employees.detail.label.button.save')}</a>
              ) : (
                  <a onClick={updateCustomFieldInfo} className="button-blue">
                    {translate('employees.detail.label.button.save')}
                  </a>
                )}
            </>
          )}
          {rederCustomerPreview()}
          {rederCustomerNext()}
          {openCustomerIntegration && (
            <CustomerIntegrationModal
              iconFunction='ic-sidebar-customer.svg'
              handleCloseCusIntegration={handleCloseCustomerIntegration}
              customerIds={[currentCustomerId]}
            />
          )}
        </div>
      </div>
    );
  };
  // const onChangeTaskFields = (value) => {
  //   setTaskFields(_.cloneDeep(value));
  // }

  /**
   * Change field tab summary
   */
  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null });
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  };

  const onShowMessage = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  const calculateHeightTable = () => {
    if (document.body.className === 'wrap-task modal-open') {
      return null;
    }
    if (tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 52;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  /**
  * Update tabList when select DislaySummary
  * editedItem : item after edited
  */
  const onSelectDisplaySummary = editedItem => {
    const editItemIndex = tabList.findIndex(tab => tab.tabId === editedItem.tabId);
    const copyTabList = _.cloneDeep(tabList);
    copyTabList[editItemIndex] = { ...copyTabList[editItemIndex], ...editedItem };
    setTabListUpdate(_.cloneDeep(copyTabList));
    setTabList(_.cloneDeep(copyTabList));
  }

  const handleOpenScenario = () => {
    setShowScenarioPopup(true);
  }

  const handleCloseScenario = (value) => {
    if (value) {
      setCustomerSuccessMsg('');
      setCallApiUpdate('INF_COM_0004');
      handleInitData(currentCustomerId, currentTab);
      props.resetScenario(value);
    }
    setShowScenarioPopup(false);
  }



  const showOtherCustomerDetail = (nextId, prevId) => {
    executeDirtyCheck(() => {
      props.handleOpenCustomerDetailByItself(nextId, prevId);
    })
  }

  const showAnyDetail = (objectId, type) => {
    if (objectId) {
      if (type === TYPE_DETAIL_MODAL.CUSTOMER) {
        // open next customer detail from customer detail
        const nextCustomerId = objectId;
        const prevCustomerId = props.customerId;
        showOtherCustomerDetail(nextCustomerId, prevCustomerId)
      } else {
        props.handleShowDetail(objectId, type, `Customer_${props.customerId}`);
      }
    }
  }

  /**
   * Render tab contents
   */
  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {currentTab === TAB_ID_LIST.summary && customerDetail && customerDetail.tabsInfo && tabList && (
          <TabSummary
            idEmployeeDetail={props.id}
            ref={tabSummaryRef}
            customer={customerDetail}
            screenMode={props.screenMode}
            handleReorderField={props.handleReorderField}
            onChangeFields={onChangeSummaryFields}
            editedFields={editedSummaryFields}
            summaryFields={summaryFields}
            openDynamicSelectFields={openDynamicSelectFields}
            tabList={tabList}
            isSaveField={isSaveField}
            destroySaveField={destroySaveField}
            fieldEdit={fieldEdit}
            paramsEdit={paramsEdit}
            onSaveField={onSaveField}
            onShowMessage={onShowMessage}
            customerId={currentCustomerId}
            countSave={countSave}
            customerAllFields={props.customer}
            deletedFields={deletedSummaryFields}
            editingField={currentFieldEdit}
            fieldsUnavailable={customerFieldUnavailable}
            onSelectDisplaySummary={onSelectDisplaySummary}
            showPopupEmployeeDetail={setEmployeeId}
            showCustomerDetail={showOtherCustomerDetail}
            openScenario={handleOpenScenario}
            tenant={props.tenant}
            showAnyDetail={showAnyDetail}
            searchScope={scopeCondition}
            searchRange={rangeCondition}
            customerChild={customerChild}
            onOpenModalCreateUpdateActivity={handleOpenModalCreateUpdateActivity}
            onOpenCustomerParent={(id) => showOtherCustomerDetail(id, props.customerId)}
            showDetailTask={props.showDetailTask}
          />
        )}
        {currentTab === TAB_ID_LIST.calendar && customerDetail &&
          <CustomersTabCalendar
            customerId={currentCustomerId}
            customerChild={customerChild}
            searchScope={scopeCondition}
            searchRange={rangeCondition}
            calendarModeGrid={calendarModeGrid}
            handleChangeModeViewGrid={(calendarModeGridParam) => { setCalendarModeGrid(calendarModeGridParam) }}
          />
        }
        {currentTab === TAB_ID_LIST.networkConnection && <TabNetworkMap customerId={currentCustomerId} />}
        {currentTab === TAB_ID_LIST.task && (
          <PopupDetailServiceTabTask
            customerId={currentCustomerId}
            customerChild={customerChild}
            searchScope={scopeCondition}
            searchRange={rangeCondition}
            typeTaskTab={TypeGetTaskByIdService.CustomerId}
            fieldInfo={tabTaskFields}
            showCustomerDetail={showOtherCustomerDetail}
          // task={props.tabTasks}
          // taskFields={taskFields}
          // screenMode={props.screenMode}
          // onChangeFields={onChangeTaskFields}
          />
        )}
        {/* && props.customerLayout */}
        {currentTab === TAB_ID_LIST.changeHistory && props.changeHistory && (
          <CustomerTabChangeHistory
            customerName={customerDetail.customer.customerName}
          />
        )}
        {/* TODO:
        {currentTab === TAB_ID_LIST.revenueChart && (
          <CustomerReveueChart customerId={currentCustomerId} />
        )} */}
        {customerDetail && currentTab === TAB_ID_LIST.tradingProduct &&
          <DetailTabProductTrading
            customer={currentCustomerId}
            customerChild={customerChild}
            fieldInfo={tabProductTradingFields}
            searchScope={scopeCondition}
            searchRange={rangeCondition}
            showCustomerDetail={showOtherCustomerDetail}
            showAnyDetail={showAnyDetail}
          />
        }
        {customerDetail && currentTab === TAB_ID_LIST.activityHistory &&
          <DetailTabActivity
            listProductTradingId={props.listProductTradingId}
            customer={currentCustomerId}
            customerChild={customerChild}
            searchScope={scopeCondition}
            searchRange={rangeCondition}
            onOpenModalCreateUpdateActivity={handleOpenModalCreateUpdateActivity}
            hideShowDetail={true}
            onOpenCustomerParent={(id) => showOtherCustomerDetail(id, props.customerId)}
          />
        }
        <RelationDisplayTab
          id="customerRelationId"
          recordData={customerDetail ? customerDetail.customer : null}
          fieldNameExtension="customerData"
          isHeader={false}
          listFieldInfo={fieldRelationTab}
          currentTabId={currentTab}
        />
      </>
    );
  };

  // const [isShowMessageTabCreateField, setIsShowMessageTabCreateField] = useState(true);
  // /**
  //  * Delete Message Create Field
  //  */
  // const onDeleteMessageCreateField = () => {
  //   setIsShowMessageTabCreateField(false);
  // }

  // const [isShowMessageTabEditField, setIsShowMessageTabEditField] = useState(true);
  // /**
  //  * Delete Message Edit Field
  //  */
  // const onDeleteMessageEditField = () => {
  //   setIsShowMessageTabEditField(false);
  // }

  const onMouseDown = event => {
    if (isDisplayRange && !isMouseOnRef(displayRangeRef, event)) {
      setIsDisplayRange(false);
    }
  };
  const getCustomerImage = (detail) => {
    const image = R.path(['customer', 'customerLogo', 'fileUrl'], detail);
    return image ? <img src={image} /> : <img className="no-image" src="../../../content/images/noimage.png" />
  }
  useEventListener('mousedown', onMouseDown);

  const onClosePopupCreate = typePopup => {
    document.body.className = 'wrap-customer modal-open';
    switch (typePopup) {
      case "business-card": {
        setOpenCreateBusinessCard(false);
        break;
      }
      case "activity": {
        setOpenModalCreateEditActivity(false);
        break;
      }
      case "calendar": {
        setOpenModalCreateCalendar(false);
        break;
      }
      default:
        break;
    }
  }
  const handleSetRelation = () => {
    setShowRelationCustomers(false)
  }
  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
  }

  const addTab = (tabId) => {
    tabList.map((tab) => {
      if (tab.tabId === tabId) {
        tab.isDisplay = true;
        tab.tabOrder = tabListShow[tabListShow.length - 1].tabOrder + 1;
        tabListShow.push(tab)
      }
    })
    const tabListTmp = tabList.filter(e => e.isDisplay === false)
    const tabsUpdate = _.cloneDeep(tabListShow);
    const lastTabOrderDisplay = tabListShow[tabListShow.length - 1].tabOrder;
    tabListTmp.sort((a, b) => a.tabOrder - b.tabOrder).forEach((item, idx) => {
      item.tabOrder = lastTabOrderDisplay + idx + 1;
      tabsUpdate.push(item);
    })
    setTabListShow(_.cloneDeep(tabListShow))
    onDelAddTab(tabListShow, tabList);
  }

  const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && props.screenMode === ScreenMode.EDIT) {
      return (
        <li className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option z-index-99">
              <ul>
                {tabList.map((tab, idx) => {
                  let tabHidden = true;
                  tabListShow.forEach((tabShow) => {
                    if (tab.tabId === tabShow.tabId) {
                      tabHidden = false;
                    }
                  })
                  if (tabHidden === true) {
                    return (
                      <>
                        <li><a key={idx} onClick={(tabId) => addTab(tab.tabId)} >{getFieldLabel(tab, 'tabLabel')}</a></li>
                      </>
                    )
                  }
                })}
              </ul>
            </div>
          }
        </li>
      )
    } else {
      return <></>
    }
  }

  /**
   * Render component
   */
  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-task popup-modal-common show popup-align-right " id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    {isScreenEdit ?
                      <a className="icon-small-primary icon-return-small" onClick={() => executeDirtyCheck(() => { props.changeScreenMode(false) }, null, DIRTYCHECK_PARTTERN.PARTTERN2)} />
                      : (!isFirstCustomerDetailFromList || props.openFromModal || props.canBack ?
                        <a className="icon-small-primary icon-return-small" onClick={handleClosePopup} />
                        : <a className="icon-small-primary icon-return-small disable" />)
                    }
                    {customerDetail && <span className="text">{getIconFunction()}{customerDetail.customer.customerName}</span>}
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-share" onClick={(url) => copyUrlCustomerDetail()} />
                  {showModal && <a className="icon-small-primary icon-link-small" onClick={openNewWindow} />}
                  {showModal && <a onClick={handleClosePopup} className="icon-small-primary icon-close-up-small line" />}
                </div>
                {parseErrorMessageDeleteCustomerRes(props.errorMessageDeleteCustomer).length > 0 && isShowPopupDelErr ?
                  <div className="popup-esr2 popup-esr3 popup-customer-notification-cannot-delete" id="popup-esr2">
                    <div className="popup-esr2-content">
                      <div className="popup-esr2-body ">
                        <h4 className="title">{translate('customers.detail.title.popupErrorMessage.delete')}</h4>
                        <div>{translate('customers.detail.warning.popupErrorMessage.delete')}</div>
                        <div>{translate('customers.detail.suggest.popupErrorMessage.delete')}</div>
                        <div className="box-gray-customer">
                          {parseErrorMessageDeleteCustomerRes(props.errorMessageDeleteCustomer).map((item, idx) => (
                            <>
                              <div key={idx}>{item}</div>
                            </>
                          ))}
                        </div>
                        <div className="button">
                          <a onClick={disablePopupDeleteErr} title="" className="button-blue disable button-verification">{translate('customers.detail.label.button.cancel')}</a>
                        </div>
                      </div>
                    </div>
                  </div> : null
                }
                {renderToastMessageErrorOrWarning()}
              </div>
              <div className="modal-body">
                <div className="popup-content style-3 v2">
                  {renderPopupTool()}
                  <div className={`popup-content-common-wrap ${isScreenEdit ? '' : isShowTimeline ? '' : 'popup-content-close'}`} id={formId}>
                    <div className="popup-content-common-left position-relative style-3 overflow-y-hover" onScroll={handleScroll}>
                      <div className="flag-wrap" >
                        <div className="block-card">
                          <div className="img">
                            {customerDetail && getCustomerImage(customerDetail)}
                          </div>
                          <div className="content">
                            {customerDetail &&
                              <a
                                className="text-blue item"
                                title="superior"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => showOtherCustomerDetail(customerDetail.customer.parentId, props.customerId)}
                              >{customerDetail.customer.parentName}</a>}
                            {customerDetail && <span className="item">{customerDetail.customer.customerAliasName}</span>}
                            <div className="name text-break no-white-space-warp">
                              {customerDetail && <a className="pointer-none">{customerDetail.customer.customerName}</a>}
                            </div>
                            {customerDetail && <div className="font-size-12 color-333">{customerDetail.customer.businessMainName}&emsp;{customerDetail.customer.businessSubName}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <a className="button-primary button-activity-registration text-nowrap" onClick={() => handleToggleFollowed()}>
                            {translate(!props.isFollowed ? 'customers.detail.label.button.follow' : 'customers.detail.label.button.unfollow')}
                          </a>
                        </div>
                      </div>
                      <div className={`popup-content-common-content mh-auto ${isScreenEdit ? "pl-4" : ""}`}>
                        <div className="tab-detault">
                          <ul className="nav nav-tabs mb-1 sticky">
                            {tabList && tabListShow && <TabList
                              onChangeTab={changeTab}
                              tabList={tabList}
                              tabListShow={tabListShow}
                              onDragDropTabList={onDragDropTabList}
                              deleteAddTab={onDelAddTab}
                              currentTab={currentTab}
                              screenMode={props.screenMode}
                            />}
                            <RelationDisplayTab
                              id="customerRelationId"
                              isHeader={true}
                              listFieldInfo={fieldRelationTab}
                              currentTabId={currentTab}
                              onChangeTab={changeTab}
                            />
                            {renderActionTab()}
                          </ul>
                          {/* Remove class: scroll-table-v2 */}
                          <div
                            className={`tab-content min-height-200`}
                            ref={tableListRef}
                          >
                            {renderTabContents()}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isShowCustomerTimeline &&
                      <CustomerTimelineArea
                        objectId={props.customerId}
                        serviceType={TIMELINE_SERVICE_TYPES.CUSTOMER}
                        onShowTimeline={() => setShowTimeline(!isShowTimeline)}
                        isScreenDisplay={isScreenDisplay}
                        childCustomer={customerChildId}
                        hasLoginUser={scopeCondition !== ConditionScope.Total}
                        scopeCondition={scopeCondition}
                        rangeCondition={rangeCondition}
                        isDataChange={(value) => setIsDataChange(value)}
                      />
                    }
                    {isScreenEdit && renderDynamicSelectFields()}
                  </div>
                </div>
                {renderToastMessageSuccess()}
              </div>
            </div>
            {openModalTaskCreate && <ModalCreateEditTask
              toggleCloseModalTask={onCloseModalTask}
              iconFunction="ic-task-brown.svg"
              taskActionType={TASK_ACTION_TYPES.CREATE}
              taskId={null}
              taskViewMode={TASK_VIEW_MODES.EDITABLE}
              canBack={true}
              customerId={props.customerId}
            />}

            {openModalCreateCalendar && <CreateEditSchedule
              onClosePopup={() => onClosePopupCreate('calendar')}
              scheduleDataParam={scheduleData}
            />}
            {openModalCreateEditActivity && <ActivityModalForm
              // customerId={createEditActivityParams.actionType === ACTIVITY_ACTION_TYPES.UPDATE ? props.customerId : null}
              customerId={props.customerId}
              activityActionType={createEditActivityParams.actionType}
              activityViewMode={createEditActivityParams.viewMode}
              activityId={createEditActivityParams.activityId}
              onCloseModalActivity={() => onClosePopupCreate('activity')}
              canBack={true} />}
            {openCreateBusinessCard && <CreateEditBusinessCard
              customerId={props.customerId ? props.customerId : null}
              isOpenedFromModal={true}
              customerName={props.customer && props.customer.customer ? props.customer.customer.customerName : ''}
              closePopup={() => onClosePopupCreate('business-card')}
              iconFunction="ic-sidebar-business-card.svg"
              businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE} />}

            {openModalCustomer && <CreateEditCustomerModal
              id={props.id}
              toggleCloseModalCustomer={onCloseModalCustomer}
              customerActionType={customerActionType}
              customerViewMode={customerViewMode}
              isOpenedFromModal={true}
              listFieldPreview={summaryFields}
              customerId={currentCustomerId} />}
            {showScenarioPopup && <ScenarioPopup
              id={scenarioPopupCtrlId[0]}
              closeScenarioPopup={handleCloseScenario}
              initData={{ customerId: props.customerId, scenarioId }}
            />}
          </div>
        </div>
        {employeeId &&
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={false}
            openFromModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={() => setEmployeeId(null)} />
        }
        {isShowRelationCustomers && !props.errorCountRelation && props.relationCustomerData && props.relationCustomerData.length > 0 &&
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} autoFocus={true} zIndex="9999">
            <PopupDeleteCustomer
              setShowRelationCustomers={handleSetRelation}
              customerName={R.path(['customer', 'customerName'], props.customer) || ''}
              customerList={[props.customerId]}
              deleteCustomers={() => callApiDelete()}
            />
          </Modal>}
        <ShowDetail idCaller={`Customer_${props.customerId}`} cleanClosePopup={true} />
        {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} />}
      </>
    )
  }

  const renderPopupCustomerDetail = () => {
    if (showModal) {
      if (props.openFromOtherServices) {
        document.body.className = 'wrap-customer modal-open';
      }
      return (
        <Modal className="wrap-customer" id="popup-customer-detail" isOpen={true} fade={true} toggle={() => { }} backdrop={true} autoFocus={true} zIndex={props.openFromMilestone ? '9999' : 'auto'}>
          {renderComponent()}
        </Modal>
      );
    } else if (props.popout) {
      document.body.className = 'body-full-width wrap-customer';
      return (
        <>
          {renderComponent()}
        </>
      );
    } else {
      return <></>;
    }
  };

  return renderPopupCustomerDetail();
};

const mapStateToProps = ({popupDetailTab, dataCalendarGrid, customerDetail, authentication, applicationProfile, screenMoveState, customerInfo, dynamicList, activityListReducerState, customerList }: IRootState) => ({
  fieldInfos: customerDetail.fieldInfos,
  customFieldInfos: customerDetail.customFieldInfos,
  fieldSearchInfos: customerDetail.fieldSearchInfos,
  customFieldSearchInfos: customerDetail.customFieldSearchInfos,
  customer: customerDetail.customer,
  actionType: customerDetail.action,
  errorMessageInList: customerDetail.errorMessageInList,
  errorItems: customerDetail.errorItems,
  errorMessageChangeStatusFailed: customerDetail.errorMessageChangeStatusFailed,
  errorMessageDeleteCustomer: customerDetail.errorMessageDeleteCustomer,
  customersCheckList: customerDetail.customersCheckList,
  screenMode: customerDetail.screenMode,
  groups: customerDetail.groups,
  userLogin: customerDetail.userLogin,
  authorities: authentication.account.authorities,
  tenant: applicationProfile.tenant,
  changeHistory: customerDetail.changeHistory?.history,
  customerLayout: customerDetail.customerLayout,
  customerFieldsUnVailable: customerDetail.customerFieldsUnVailable,
  messageChangeStatusSuccess: customerDetail.messageChangeStatusSuccess,
  tabListShow: customerDetail.tabListShow,
  customerFieldsAvailable: customerDetail.customerFieldsAvailable,
  messageUpdateCustomFieldInfoSuccess: customerDetail.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: customerDetail.messageUpdateCustomFieldInfoError,
  action: customerDetail.action,
  messageDeleteSuccess: customerDetail.messageDeleteSuccess,
  isFollowed: customerDetail.isFollowed,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  errorMessageGetUrlQuicksight: customerDetail.errorMessageGetUrlQuicksight,
  customerChild: customerDetail.customerChild,
  // actionTypeScenario: customerInfo.action,
  tabProductTradingFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`)?.fieldInfos?.fieldInfoPersonals,
  tabTaskFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.TASK}`)?.fieldInfos?.fieldInfoPersonals,
  confirmPopupItem: activityListReducerState.confirmPopupItem,
  openConfirmPopup: activityListReducerState.openConfirmPopup,
  relationCustomerData: customerDetail.relationCustomerData,
  errorCountRelation: customerDetail.errorCountRelation,
  isFromModal: activityListReducerState.isFromModal,
  detailType: activityListReducerState.detailType,
  showDetailTask: activityListReducerState.showDetailTask,
  badgesCalendar: dataCalendarGrid.badges,
  badgesTask: popupDetailTab.badgesTask,
  badgesProductTrading: popupDetailTab.badgesProductTrading
});

const mapDispatchToProps = {
  handleReorderField,
  handleInitDeleteCustomer,
  handleInitCustomerDetail,
  changeScreenMode,
  handleInitChangeHistory,
  handleUpdateCustomFieldInfo,
  handleGetCustomerChild,
  moveScreenReset,
  handleGetCustomerFollowed,
  handleCreateFollowed,
  handleDeleteFollowed,
  reset,
  resetScenario,
  handleInitActivities,
  getFieldInfoPersonals,
  handleShowDetail,
  clearShowDetail,
  handleCountRelationCustomers,
  handleGetCustomerLayout
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupCustomerDetail);
