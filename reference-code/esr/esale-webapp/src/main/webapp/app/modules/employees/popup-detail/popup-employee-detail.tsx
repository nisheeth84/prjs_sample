/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import TabSummary from './popup-detail-tabs/popup-detail-tab-summary';
import TabCustomer from './popup-detail-tabs/popup-detail-tab-customer';
import TabBusinessCards from './popup-detail-tabs/popup_detail_tab_business_cards';
import TabGroups from './popup-detail-tabs/popup-detail-tab-groups';
import EmployeeTabChangeHistory from 'app/modules/employees/popup-detail/popup-detail-tabs/popup_detail_tab_change_history';
import TabCalendar from './popup-detail-tabs/popup-detail-tab-calendar';
import { Storage, translate } from 'react-jhipster';
import TabList from './popup-employee-detail-tab-list';
import { ScreenMode, AVAILABLE_FLAG, TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import { TAB_ID_LIST, EMPLOYEE_ACTION_TYPES, EMPLOYEE_VIEW_MODES } from 'app/modules/employees/constants';
import _ from 'lodash';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES, FIELD_BELONG, SCREEN_TYPES } from 'app/config/constants';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import useEventListener from 'app/shared/util/use-event-listener';
import { Modal } from 'reactstrap';
import ModalCreateEditEmployee from '../create-edit/modal-create-edit-employee';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import { isNullOrUndefined } from 'util';
import DynamicSelectField, { SettingModes } from '../../../shared/layout/dynamic-form/control-field/dynamic-select-field';
import { useDragLayer } from 'react-dnd';
import DetailTabProductTrading from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-product-trading';
import DynamicSelectFieldTab from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field-tab';
import PopupDetailServiceTabTask from 'app/shared/layout/popup-detail-service-tabs/popup-detail-tab-task';
import { getFieldInfoPersonals } from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import * as R from 'ramda';
import TimelineAddEdit from 'app/modules/timeline/timeline-add-edit/timeline-add-edit';
import StringUtils from 'app/shared/util/string-utils';
import {
  handleInitChangeEmployeeStatus,
  handleReorderField,
  handleInitEmployeeDetail,
  handleInitFollowEmployee,
  handleInitUnfollowEmployee,
  handleInitGroups,
  handleInitlistFavoriteGroup,
  handleInitTradingProducts,
  handleInitCalendarMonth,
  changeScreenMode,
  handleInitCustomerTab,
  handleGetCustomerLayoutTab,
  handleInitTaskTab,
  handleInitChangeHistory,
  handleInitEmployeeLayout,
  handleInitUserLogin,
  reset,
  handleUpdateCustomFieldInfo,
  EmployeeAction,
  handleGetFollowEmployee
} from './popup-employee-detail-reducer';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import { DynamicControlAction, DEFINE_FIELD_TYPE, FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import { AvatarColor } from 'app/shared/layout/common/suggestion/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { processRelationselectOrganization, putDataToFieldEdit, isFieldRelationAsTab, createNewFieldLookup, revertDeletedFields, initialRevertFields, concatArray, filterDataNotNull } from 'app/shared/util/utils';
import { TypeMessage } from './popup-detail-tabs/popup-detail-tab-summary-element';
import { handleGetTimelineGroupsOfEmployeeForDetailEmp, handleGetListTimelineGroupsByIds } from 'app/modules/timeline/timeline-common-reducer';
import { CUSTOMER_GET_FIELD_TAB } from 'app/modules/customers/constants';
import { TypeGetTaskByIdService } from 'app/shared/layout/popup-detail-service-tabs/constants';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import ShowDetail from 'app/modules/activity/common/show-detail';
import { handleShowDetail, clearShowDetail } from 'app/modules/activity/list/activity-list-reducer';
import { TARGET_TYPE } from 'app/modules/timeline/common/constants';
export interface IPopupEmployeeDetailProps extends StateProps, DispatchProps {
  id: string;
  iconFunction?: string;
  showModal: boolean;
  backdrop?: boolean; // [backdrop:false] when open from popup
  employeeId: number;
  listEmployeeId: any;
  popout?: boolean;
  popoutParams?: any;
  tenant;
  employeeSuccessMessage?: string;
  openFromModal?: boolean;
  openFromMilestone?: boolean;
  resetSuccessMessage?: () => void;
  toggleSwitchEditMode?: (isEdit: boolean) => void;
  toggleClosePopupEmployeeDetail?: (isBack?, isUpdateList?) => void;
  onOpenModalCreateEditEmployee?: (actionType, viewMode, employeeId) => void;
  handleOpenEmployeeDetailByItself?: (nextEmployeeId, prevEmployeeId) => void;
  isOpenEmployeeDetailNotFromList?: boolean
  prevEmployeeIds?: any[],
  isNewEmployee?: false
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

const QUIT_WORK = 1;
const WORKING = 0;
const watchTargetType = 3

const PopupEmployeeDetail = (props: IPopupEmployeeDetailProps) => {
  const initialState = {
    tabListShow: _.cloneDeep(props.employee && props.tabListShow.filter(e => e.isDisplay).sort((a, b) => a.tabOrder - b.tabOrder)),
    tabList: _.cloneDeep(props.employee && props.employee.tabsInfo),
    tabListUpdate: null,
    summaryFields: null
  };
  const [, setShouldRender] = useState(false);
  const [tabListShow, setTabListShow] = useState(props.employee ? _.cloneDeep(props.tabListShow.filter(e => e.isDisplay)) : null);
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary);
  const [currentEmployee, setCurrentEmployee] = useState(props.employeeId ? props.employeeId : props.popoutParams.employeeId);
  const [summaryFields, setSummaryFields] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [customerFields, setCustomerFields] = useState(null);
  const [taskFields, setTaskFields] = useState(null);
  const [tradingProductsFields, setTradingProductsFields] = useState(null);
  const [businessCardsFields, setBusinessCardsFields] = useState(null);
  const [employeeLayout, setemployeeLayout] = useState(null);
  const [listEmployeeId, setListEmployeeId] = useState(props.listEmployeeId);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [, setShowConditionDisplay] = useState(PopupConditionDisplay.None);
  const [employeeStatus, setEmployeeStatus] = useState(Number);
  const [tabTaskFields, setTabTaskFields] = useState([]);

  const [tabList, setTabList] = useState(props.employee ? _.cloneDeep(props.employee.tabsInfo) : null);
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [employeeActionType, setEmployeeActionType] = useState(EMPLOYEE_ACTION_TYPES.CREATE);
  const [employeeViewMode, setEmployeeViewMode] = useState(EMPLOYEE_VIEW_MODES.EDITABLE);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeSuccessMsg, setEmployeeSuccessMsg] = useState(null);
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState([]);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [paramsEdit, setParamsEdit] = useState();
  const [employeeFieldUnavailable, setEmployeeFieldUnavailable] = useState([]);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const employeeDetail = props.employee && props.employeeFieldsAvailable;
  const tabSummaryRef = useRef(null);
  const tableListRef = useRef(null);
  const actionTabRef = useRef(null);
  const scrollWrap = useRef(null);
  const [isLoadEmployee, setIsLoadEmployee] = useState(false);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);

  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [normalMessage, setNormalMessage] = useState(null);
  const [countSave] = useState({});
  const [heightTable, setHeightTable] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { screenMoveInfo } = props;
  const [fieldCallback, setFieldCallback] = useState({});
  const [screenMode, setScreenMode] = useState(props.screenMode);
  const [isScrollMin, setIsScrollMin] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [showTipListSubordinates, setShowTipListSubordinates] = useState(false);
  const tipListRef = useRef(null);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([])
  const [timeLineGroup, setTimeLineGroup] = useState([])
  const [tabProductTradingFields, setTabProductTradingFields] = useState([]);
  const [deleteTabProductTradingFields, setDeleteTabProductTradingFields] = useState([]);
  const [deleteTabTaskFields, setDeleteTabTaskFields] = useState([]);
  const [deleteTabCustomerFields, setDeleteTabCustomerFields] = useState([]);
  const [tabCustomerFields, setTabCustomerFields] = useState([]);
  const [clickTab, setClickTab] = useState(false);
  const employeeEditCtrlId = useId(1, "detailEmployeeEditCtrlId_");
  const [isFirstEmployeeDetailFromList, setIsFirstEmployeeDetailFromList] = useState(true);

  const [tabBusinessCardFields, setTabBusinessCardFields] = useState([]);
  const [deleteTabBusinessCardFields, setDeleteTabBusinessCardFields] = useState([]);

  const [badgesCalendar, setBadgesCalendar] = useState(null);
  const [isUpdateList, setIsUpdateList] = useState(false);
  const [openAddTimeLine, setOpenAddTimeLine] = useState(false);


  // obj: [tab_id]: data corresponent
  const objTabInfo = {
    [TAB_ID_LIST.tradingProduct]: {
      fieldBelong: FIELD_BELONG.PRODUCT_TRADING,
      stateTab: tabProductTradingFields,
      setTab: setTabProductTradingFields,
      stateDelete: deleteTabProductTradingFields,
      setDelete: setDeleteTabProductTradingFields,
    },
    [TAB_ID_LIST.task]: {
      fieldBelong: FIELD_BELONG.TASK,
      stateTab: tabTaskFields,
      setTab: setTabTaskFields,
      stateDelete: deleteTabTaskFields,
      setDelete: setDeleteTabTaskFields,
    },
    [TAB_ID_LIST.customer]: {
      fieldBelong: FIELD_BELONG.CUSTOMER,
      stateTab: tabCustomerFields,
      setTab: setTabCustomerFields,
      stateDelete: deleteTabCustomerFields,
      setDelete: setDeleteTabCustomerFields,
    },
    [TAB_ID_LIST.businessCard]: {
      fieldBelong: FIELD_BELONG.BUSINESS_CARD,
      stateTab: tabBusinessCardFields,
      setTab: setTabBusinessCardFields,
      stateDelete: deleteTabBusinessCardFields,
      setDelete: setDeleteTabBusinessCardFields,
    }
  }

  const WAR_COM_0010 = "WAR_COM_0010";
  const WAR_COM_0013 = "WAR_COM_0013";


  useEffect(() => {
    if (props.tabProductTradingFieldsProps) {
      setTabProductTradingFields(props.tabProductTradingFieldsProps);
    }
  }, [props.tabProductTradingFieldsProps]);

  useEffect(() => {
    if (props.tabCustomerFieldsProps) {
      setTabCustomerFields(props.tabCustomerFieldsProps);
    }
  }, [props.tabCustomerFieldsProps]);

  useEffect(() => {
    if (props.tabBusinessCardFieldsProps) {
      setTabBusinessCardFields(props.tabBusinessCardFieldsProps);
    }
  }, [props.tabBusinessCardFieldsProps]);


  useEffect(() => {
    if (summaryFieldRevert && summaryFields && employeeFieldUnavailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, employeeFieldUnavailable, summaryFieldRevert));
    }
  }, [summaryFields, employeeFieldUnavailable])

  useEffect(() => {
    if (props.employee) {
      setSummaryFieldRevert(props.employee.fields)
    }
  }, [props.employee])

  useEffect(() => {
    const prevEmployeeIdsTmp = props.prevEmployeeIds || []
    const isOpenEmployeeDetailNotFromListTmp = props.isOpenEmployeeDetailNotFromList
    if (isOpenEmployeeDetailNotFromListTmp || prevEmployeeIdsTmp.length > 0) {
      setIsFirstEmployeeDetailFromList(false)
    } else {
      setIsFirstEmployeeDetailFromList(true)
    }
  }, [props.isOpenEmployeeDetailNotFromList, props.prevEmployeeIds])

  useEffect(() => {
    if (currentEmployee) {
      // @ts-ignore
      props.handleGetTimelineGroupsOfEmployeeForDetailEmp(null, currentEmployee).then(({ action }) => {
        const listGroup = action.payload?.data?.timelineGroup || [];
        if (listGroup.length > 0) {
          const listGroupId = [];
          listGroup.forEach(element => {
            listGroupId.push(element.timelineGroupId)
          });
          // @ts-ignore
          props.handleGetListTimelineGroupsByIds(listGroupId, 1).then((res2) => {
            setTimeLineGroup(res2.value?.data?.timelineGroup || [])
          })
        }
        // check follow employee
        if (!props.isNewEmployee) {
          props.handleGetFollowEmployee(props.id, 3, currentEmployee)
        }
      })
    }
  }, [currentEmployee])

  useEffect(() => {
    return () => {
      // props.reset(); // fixbug open new window from relation
      if (props.resetSuccessMessage) {
        props.resetSuccessMessage();
      }
      setEmployeeSuccessMsg(null);
    };
  }, [currentEmployee]);

  useEffect(() => {
    if (props.employee) {
      // props.employee.fields.forEach((field) => {
      // if (!_.isNil(field.tabData) && field.tabData.length > 0) {
      props.employee.fields.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      //   }
      // })
      if (!isLoadEmployee && _.toArray(props.employee.fields).length > 0) {
        setFieldRelationTab(props.employee.fields.filter(e => isFieldRelationAsTab(e)))
        setIsLoadEmployee(true);
      }
    }
    setEmployeeFieldUnavailable(_.cloneDeep(props.employeeFieldsUnVailable));
  }, [props.employee]);

  const CHANGE_STATUS = {
    disable: 'disable',
    active: 'active'
  };

  const isChangeInputEdit = () => {
    let isChange = false;
    if (screenMode === ScreenMode.EDIT) {
      const oldData = {
        summaryField: _.cloneDeep(props.employeeFieldsAvailable.fields),
        tabList: _.cloneDeep(props.employee.tabsInfo)
      };
      if (summaryFields === null && tabListUpdate === null && popupSettingMode !== SettingModes.EditInput) {
        isChange = false;
      } else {
        if (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList)) {
          isChange = true;
        }
        // if ((summaryFields !== null && !_.isEqual(summaryFields, oldData.summaryField)) || (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList))) {
        if (!_.isNil(summaryFields)) {
          summaryFields.forEach((field) => {
            if (field.userModifyFlg && field.userModifyFlg === true) {
              isChange = true;
            }
          })
        }
        if (!_.isNil(tabListUpdate)) { // Todo
          isChange = true;
        }
        if (popupSettingMode === SettingModes.EditInput) {
          isChange = true;
        }
      }
    } else {
      isChange = false;
    }
    if (isDelete) {
      isChange = true;
    }
    return isChange;
  };

  const resetStateExecuteDirtyCheck = () => {
    props.changeScreenMode(props.id, false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setEmployeeFieldUnavailable(_.cloneDeep(props.employeeFieldsUnVailable));
    setCurrentFieldEdit(null);
    setTabListShow(initialState.tabListShow);
    setTabList(initialState.tabList);
    setToastMessage(null);
    setFieldCallback({});
    setIsOpenMenuAddTab(false);
    setDeletedSummaryFields([]);
    setNormalMessage({ type: MessageType.None, message: [] })
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const getFieldInfoTab = (tabId, fieldBelong) => {
    props.getFieldInfoPersonals(
      `${CUSTOMER_GET_FIELD_TAB}${fieldBelong}`,
      FIELD_BELONG.EMPLOYEE,
      tabId,
      FieldInfoType.Tab,
      null,
      null
    );
  }

  /**
   * Init data for renderTabContents
   * @param employee current employee id
   * @param tabId current tab id
   */
  const handleInitData = (employee, tabId) => {
    switch (tabId) {
      case TAB_ID_LIST.summary:
        props.handleInitEmployeeDetail(props.id, employee);
        break;
      case TAB_ID_LIST.customer:
        getFieldInfoTab(tabId, FIELD_BELONG.CUSTOMER);
        props.handleInitCustomerTab(props.id, employee);
        props.handleGetCustomerLayoutTab(props.id);
        break;
      case TAB_ID_LIST.businessCard:
        if (!props.isNewEmployee) {
          getFieldInfoTab(tabId, FIELD_BELONG.BUSINESS_CARD);
        }
        break;
      case TAB_ID_LIST.tradingProduct:
        getFieldInfoTab(tabId, FIELD_BELONG.PRODUCT_TRADING);
        break;
      case TAB_ID_LIST.task:
        getFieldInfoTab(tabId, FIELD_BELONG.TASK);
        break;
      case TAB_ID_LIST.groups:
        // props.handleInitUserLogin();
        // props.handleInitGroups(employee);
        // props.handleInitlistFavoriteGroup(employee);
        break;
      case TAB_ID_LIST.changeHistory:
        // EmployeeTabChangeHistory
        props.handleInitChangeHistory(props.id, employee, 1, 30, true);
        setCurrentPage(1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === EmployeeAction.UpdateSuccess) {
      handleInitData(currentEmployee, currentTab);
      setSummaryFields(null);
      props.changeScreenMode(props.id, false);
      setFieldCallback(null);
      resetStateExecuteDirtyCheck()
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action]);

  useEffect(() => {
    if (props.employeeSuccessMessage) {
      setEmployeeSuccessMsg(props.employeeSuccessMessage);
    }
  }, [props.employeeSuccessMessage]);

  /**
 * Execute when employee,tabListShow changed
 */
  useEffect(() => {
    if (props.employee) {
      const tabListData = _.cloneDeep(props.tabListShow);
      tabListData && tabListData.forEach(element => {
        if (element.tabId === TAB_ID_LIST.calendar) {
          element['badges'] = badgesCalendar;
          return;
        }
      });
      setTabListShow(tabListData);
      setTabList(_.cloneDeep(props.employee.tabsInfo));
    }
  }, [props.employee, props.tabListShow]);

  useEffect(() => {
    if (props.badgesCalendar !== 0 || props.badgesTask || props.badgesProductTrading) {
      setBadgesCalendar(props.badgesCalendar)
      const tabListData = _.cloneDeep(tabListShow);
      if (!tabListData) return;
    tabListData && tabListData.forEach(element => {
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

  const calculateHeightTable = () => {
    if (tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 24;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  const {
    isDragging,
  } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging()
  }));

  const handleScrollIsDragging = e => {
    const element = e.target;
    if (element.scrollTop === 0) {
      setIsScrollMin(true);
    } else {
      setIsScrollMin(false)
    }
  };

  useEffect(() => {
    if  (openAddTimeLine) {
      const parentEmployee = document.getElementById("popup-employee-detail")?.parentElement;
      const parentTimeline = document.getElementById('popup-edit-insert-timeline').parentElement;
      const nextParentSibling = parentTimeline.nextElementSibling;
      if (parentEmployee && parentTimeline && nextParentSibling) {
        const zIndexEmployee = +getComputedStyle(parentEmployee).zIndex;
        parentTimeline.style.zIndex = (zIndexEmployee + 2).toString();
        (nextParentSibling as HTMLElement).style.zIndex = (zIndexEmployee + 1).toString();
      }
    }
  }, [openAddTimeLine]);

  useEffect(() => {
    setScreenMode(props.screenMode);
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({ type: MessageType.None, message: [] })
      setEditedSummaryFields([])
    }
  }, [props.screenMode]);

  useEffect(() => {
    if (props.tabTaskFieldsProps) {
      setTabTaskFields(props.tabTaskFieldsProps);
    }
  }, [props.tabTaskFieldsProps]);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const obj = {
        summaryFields,
        customerFields,
        tabListShow,
        currentTab,
        currentEmployee,
        taskFields,
        tradingProductsFields,
        businessCardsFields,
        employeeLayout,
        listEmployeeId,
        screenMode,
        tabProductTradingFields,
        tabTaskFields,
        deleteTabProductTradingFields,
        deleteTabTaskFields,
        tabBusinessCardFields,
        deleteTabBusinessCardFields
      };
      Storage.local.set(PopupEmployeeDetail.name, _.cloneDeep(obj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(PopupEmployeeDetail.name));
      if (saveObj) {
        setSummaryFields(saveObj.summaryFields);
        setCustomerFields(saveObj.customerFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setCurrentEmployee(saveObj.currentEmployee);
        setTaskFields(saveObj.taskFields);
        setTradingProductsFields(saveObj.tradingProductsFields);
        setBusinessCardsFields(saveObj.businessCardsFields);
        setemployeeLayout(saveObj.employeeLayout);
        setListEmployeeId(saveObj.listEmployeeId);
        handleInitData(saveObj.currentEmployee, saveObj.currentTab);
        setScreenMode(saveObj.screenMode);
        setTabProductTradingFields(saveObj.tabProductTradingFields);
        setDeleteTabProductTradingFields(saveObj.deleteTabProductTradingFields);
        setTabTaskFields(saveObj.tabTaskFields);
        setDeleteTabTaskFields(saveObj.deleteTabTaskFields);
        setTabBusinessCardFields(saveObj.tabBusinessCardFields);
        setDeleteTabBusinessCardFields(saveObj.deleteTabBusinessCardFields);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupEmployeeDetail.name);
    }
  };

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
    getFieldInfoTab(TAB_ID_LIST.customer, FIELD_BELONG.CUSTOMER);
    if (!props.isNewEmployee) {
      getFieldInfoTab(TAB_ID_LIST.businessCard, FIELD_BELONG.BUSINESS_CARD);
    }
    getFieldInfoTab(TAB_ID_LIST.tradingProduct, FIELD_BELONG.PRODUCT_TRADING);
    getFieldInfoTab(TAB_ID_LIST.task, FIELD_BELONG.TASK);
  }, []);

  const handleClosePopup = () => {
    setShowConditionDisplay(PopupConditionDisplay.None);
    executeDirtyCheck(() => {
      props.clearShowDetail();
      props.toggleClosePopupEmployeeDetail(false, isUpdateList);
      props.reset(props.id);
    });
  };

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

  const onOpenModalEmployee = (actionType, viewMode, employee) => {
    if (!openModalEmployee) {
      if (viewMode === EMPLOYEE_VIEW_MODES.EDITABLE) {
        executeDirtyCheck(() => {
          setOpenModalEmployee(true);
          setEmployeeActionType(actionType);
          setEmployeeViewMode(viewMode);
          setEmployeeId(employee);
          setEmployeeSuccessMsg(null);
          resetStateExecuteDirtyCheck()
        });
      } else {
        setOpenModalEmployee(true);
        setEmployeeActionType(actionType);
        setEmployeeViewMode(viewMode);
        setEmployeeId(employee);
        setEmployeeSuccessMsg(null);
      }

    }
  };

  const onCloseModalEmployee = param => {
    setOpenModalEmployee(false);
    if (param) {
      setEmployeeSuccessMsg(param.message);
      if (currentTab !== TAB_ID_LIST.summary) {
        handleInitData(currentEmployee, TAB_ID_LIST.summary);
      }
      handleInitData(currentEmployee, currentTab);
      setIsUpdateList(true);
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) || _.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD)) {
      props.toggleClosePopupEmployeeDetail();
    }
  };

  useEffect(() => {
    const bodyClassName = document.body.className;
    handleInitData(currentEmployee, currentTab);
    setShouldRender(true);
    if(currentEmployee && currentTab === TAB_ID_LIST.calendar){
      document.body.className = bodyClassName + " " + "wrap-calendar";
    }else{
      document.body.className = bodyClassName.replace('wrap-calendar', '');
    }
    return () => {
      setShowConditionDisplay(PopupConditionDisplay.None);
    };
  }, [currentEmployee, currentTab]);

  useEffect(() => {
    if (!currentEmployee) {
      setCurrentEmployee(props.employeeId);
    }
  }, [currentEmployee]);

  useEffect(() => {
    if (props.employee) {
      setEmployeeStatus(employeeDetail.data.employee_status);
    }
  }, [employeeStatus]);

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (currentEmployee !== screenMoveInfo.objectId) setCurrentEmployee(screenMoveInfo.objectId);
      if (currentTab !== TAB_ID_LIST.summary) setCurrentTab(TAB_ID_LIST.summary);
      handleInitData(screenMoveInfo.objectId, TAB_ID_LIST.summary);
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  const showConfirmChangeStatus = async type => {
    const result = await ConfirmDialog({
      title: <>{translate('employees.detail.title.popupChangeStatus')}</>,
      message: type === CHANGE_STATUS.disable ? translate('messages.WAR_EMP_0005') : translate('messages.WAR_EMP_0006'),
      confirmText: translate('employees.detail.label.button.confirm'),
      confirmClass: 'button-blue',
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    return result;
  };

  const showConfirmDelete = async () => {
    const itemName = `${employeeDetail.data.employeeSurname || ''}${employeeDetail.data.employeeName ? ' ' + employeeDetail.data.employeeName : ''}`;
    const result = await ConfirmDialog({
      title: <>{translate('employees.detail.title.popupErrorMessage.delete')}</>,
      message: translate('messages.WAR_COM_0001', { itemName }),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: 'button-red',
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    return result;
  };

  const executeChangeStatusDisable = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmChangeStatus(CHANGE_STATUS.disable);
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  };

  const executeChangeStatusActive = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmChangeStatus(CHANGE_STATUS.active);
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  };

  const executeDelete = async (action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete();
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  };

  const changeEmployeeStatusDisAble = () => {
    executeDirtyCheck(() => {
      executeChangeStatusDisable(() => {
        setEmployeeStatus(QUIT_WORK);
        props.handleInitChangeEmployeeStatus(props.id, currentEmployee, QUIT_WORK, employeeDetail.data.updatedDate);
      });
      resetStateExecuteDirtyCheck()
    })
  };

  const changeEmployeeStatusActive = () => {
    executeDirtyCheck(() => {
      executeChangeStatusActive(() => {
        setEmployeeStatus(WORKING);
        props.handleInitChangeEmployeeStatus(props.id, currentEmployee, WORKING, employeeDetail.data.updatedDate);
      });
      resetStateExecuteDirtyCheck()
    })
  };

  useEffect(() => {
    if (props.messageDeleteSuccess) {
      if (props.popout) {
        setForceCloseWindow(true);
      }
      handleClosePopup();
    }
  }, [props.messageDeleteSuccess]);

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false, screen: 'employeeDetail' }, window.location.origin);
    }
  };

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

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const openNewWindow = () => {
    setShowModal(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/employee-detail/${props.employeeId}`, '', style.toString());
    handleClosePopup();
  };

  const changeTab = clickedTabId => {
    setClickTab(true);
    setCurrentTab(clickedTabId);
  };

  const copyUrlEmployee = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/employee-detail/${currentEmployee}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

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

  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null })
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  };

  const onChangeCustomerFields = value => {
    setCustomerFields(_.cloneDeep(value));
  };

  const onchangeBusinessCardsFields = value => {
    setBusinessCardsFields(value);
  };

  const updateCustomFieldInfo = () => {
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
      employeeFieldUnavailable.forEach(field => {
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
        delete field.isMultiToSingle;
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

    const pickFieldNecessary = tabId => field => ({
      fieldId: field.fieldId,
      fieldOrder: field.fieldOrder,
      tabId,
      fieldInfoTabId: field.fieldInfoTabId
    })

    const fieldTaskTab = tabProductTradingFields.map(pickFieldNecessary(TAB_ID_LIST.task))
    const fieldProductTradingTab = tabProductTradingFields.map(pickFieldNecessary(TAB_ID_LIST.tradingProduct))
    const fieldCustomerTab = tabCustomerFields.map(pickFieldNecessary(TAB_ID_LIST.customer))
    const fieldBusinessCardTab = tabBusinessCardFields.map(pickFieldNecessary(TAB_ID_LIST.businessCard))

    const getDeleteTabIds = listFields => listFields.map(field => field.fieldInfoTabId)
    const getDeleteTabIdsNotNull = R.compose(
      filterDataNotNull,
      getDeleteTabIds
    )

    const deleteTabIdTaskFields = getDeleteTabIdsNotNull(deleteTabTaskFields)
    const deleteTabIdProductTradingFields = getDeleteTabIdsNotNull(deleteTabProductTradingFields)
    const deleteTabIdCustomerFields = getDeleteTabIdsNotNull(deleteTabCustomerFields)
    const deleteTabIdBusinessCardFields = getDeleteTabIdsNotNull(deleteTabBusinessCardFields)

    props.handleUpdateCustomFieldInfo(
      props.id,
      FIELD_BELONG.EMPLOYEE,
      deleteSummaryFieldTmp,
      fieldsUpdate,
      tabListUpdate,
      [...deleteTabIdTaskFields, ...deleteTabIdProductTradingFields, ...deleteTabIdCustomerFields, ...deleteTabIdBusinessCardFields],
      [...fieldProductTradingTab, ...fieldTaskTab, ...fieldCustomerTab, ...fieldBusinessCardTab]
    );
  };

  const onDelAddTab = (tabListDelAddAfter, tabListAfter) => {
    const tabArray = [];
    if (tabListDelAddAfter.length > 0) {
      setTabListShow(_.cloneDeep(tabListDelAddAfter));
      tabListDelAddAfter.map(it => {
        tabArray.push(it.tabId)
      })
    }
    let listTemp = tabListAfter.sort((a, b) => a.tabOrder - b.tabOrder);
    listTemp = listTemp.map((it, index) => {
      let obj = {}
      if (tabArray.includes(it.tabId)) {
        obj = Object.assign(it, { isDisplay: true, tabOrder: index + 1 })
      } else {

        obj = Object.assign(it, { isDisplay: false, tabOrder: tabListDelAddAfter.length + index + 1 })
      }
      return obj
    })
    setTabListUpdate(listTemp);
    setTabList(_.cloneDeep(tabListAfter));
  };

  const getIndexCurrentEmployee = () => {
    let index = null;
    listEmployeeId.forEach((id, idx) => {
      if (currentEmployee === id) {
        index = idx;
      }
    });
    return index;
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
    const fieldsUnAvailable = _.cloneDeep(employeeFieldUnavailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setEmployeeFieldUnavailable(fieldsUnAvailable);
    }
  };

  const destroySaveField = () => {
    setIsSaveField(false);
  };

  const getErrorMessage = errorCode => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  };

  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message, styleClass };
    objParams.type = type;
    objParams.message = [message];
    if (props.isMissingLicense && type === MessageType.Success) {
      if (props.isInvalidLicense) {
        objParams.message = ["update_employee_license"]
      } else {
        return
      }
    }
    objParams.styleClass = styleClass;
    setToastMessage(objParams);
    if (type === MessageType.Success || message === WAR_COM_0010 || message === WAR_COM_0013) {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const onShowMessage = (message, type) => {
    if (type === TypeMessage.downloadFileError) {
      setMessageDownloadFileError(message);
    } else if (type === TypeMessage.deleteWarning) {
      displayToastMessage(WAR_COM_0013, MessageType.Warning, 'block-feedback block-feedback-yellow text-left')
    }
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, TIMEOUT_TOAST_MESSAGE);
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
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutside = (e) => {
    if (actionTabRef.current && !actionTabRef.current.contains(e.target)) {
      setIsOpenMenuAddTab(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  useEffect(() => {
    displayToastMessage(employeeSuccessMsg, MessageType.Success, 'block-feedback block-feedback-green text-left')
  }, [employeeSuccessMsg])

  useEffect(() => {
    displayToastMessage(props.messageChangeStatusSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  }, [props.messageChangeStatusSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageChangeStatusFailed, MessageType.Error);
  }, [props.errorMessageChangeStatusFailed]);

  useEffect(() => {
    displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  }, [props.messageUpdateCustomFieldInfoSuccess]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, employeeFieldUnavailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setEmployeeFieldUnavailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
    }
  }, [props.messageUpdateCustomFieldInfoError]);

  const renderToastMessage = () => {
    if (toastMessage !== null) {
      return (
        <>
          <div className="message-area message-area-bottom position-absolute">
            {toastMessage.message.map((messsageParams, idx) => {
              return <BoxMessage key={idx} messageType={toastMessage.type} message={getErrorMessage(messsageParams)} styleClassMessage={toastMessage.styleClass} className=' ' />;
            })}
          </div>
        </>
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
              <React.Fragment key={idx}>
                {messsageParams.map((item, index) => {
                  return <BoxMessage key={index} messageType={normalMessage.type} message={getErrorMessage(item.errorCode)} />;
                })}
              </React.Fragment>
            )
          })}
        </>
      );
    }
  };

  // const revertFieldRelation = (field) => {
  //   field.fieldId = field.oldField.fieldId;
  //   field.relationData.fieldId = field.oldField.relationData.fieldId;
  //   field.relationField.fieldId = field.oldField.relationData.fieldId;
  //   field.relationField.relationData.fieldId = field.oldField.fieldId;
  //   return field;
  // }

  // const isMultiToSingle = (field, paramsEditField) => {
  //   return field.fieldId > 0 && ((!_.isNil(field.relationData) && (field.relationData.format === 2 && paramsEditField.relationData.format === 1))
  //     || (!_.isNil(field.relationField) && field.relationField.relationData.format === 2 && paramsEditField.relationField.relationData.format === 1))
  //     // || (_.isNil(field.relationField) && paramsEditField.relationField.relationData.format === 1)
  //     && _.isNil(field.copyField)
  // }

  // const processRelationselectOrganization = (listField, paramsEditField, deleteField) => {
  //   let newParamsEditField = _.cloneDeep(paramsEditField);
  //   listField.forEach((field, index) => {
  //     if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && field.fieldId === paramsEditField.fieldId) {
  //       // Multi -> Single
  //       if (isMultiToSingle(field, paramsEditField)) {
  //         const newParams = _.cloneDeep(newParamsEditField);
  //         const newFieldRelation = _.cloneDeep(field);
  //         newFieldRelation.fieldId = Math.round(Math.random() * 100000 * - 1);
  //         newParams.fieldId = newFieldRelation.fieldId;
  //         newParams.relationData.fieldId = Math.round(Math.random() * 100000 * - 1);
  //         newParams.relationField.fieldId = newParams.relationData.fieldId;
  //         newParams.relationField.relationData.fieldId = newParams.fieldId;
  //         const copyField1 = { from: paramsEditField.fieldId, to: newParams.fieldId };
  //         const copyField2 = { from: paramsEditField.relationField.fieldId, to: newParams.relationField.fieldId };
  //         newFieldRelation['copyField'] = copyField1;
  //         newParams.relationField['copyField'] = copyField2;
  //         newParamsEditField = newParams;
  //         deleteField.push(paramsEditField.fieldId)
  //         newFieldRelation["oldField"] = field;
  //         listField.splice(index, 1, newFieldRelation);
  //       } else if (field.fieldId < 0 && !_.isNil(field.oldField) && !_.isNil(field.relationData) && ((field.relationData.format === 2 && paramsEditField.relationData.format === 1 && paramsEditField.relationField.relationData.format === 1)
  //         || (field.relationField.relationData.format === 2 && paramsEditField.relationField.relationData.format === 1 && paramsEditField.relationData.format === 1)) && _.isNil(field.oldField)) {
  //         revertFieldRelation(field);
  //       } else if (field.fieldId < 0 && !_.isNil(field.relationData) && ((field.relationData.format === 1 && paramsEditField.relationData.format === 2 && paramsEditField.relationField.relationData.format === 2)
  //         || (field.relationField.relationData.format === 1 && paramsEditField.relationField.relationData.format === 2 && paramsEditField.relationData.format === 2)) && !_.isNil(field.oldField)) {
  //         revertFieldRelation(field);
  //         if (!_.isNil(field.copyField)) {
  //           delete field.copyField;
  //         }
  //         if (!_.isNil(field.relationField.copyField)) {
  //           delete field.relationField.copyField;
  //         }
  //       }
  //     } else if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION
  //       && field.fieldId === paramsEditField.fieldId) {
  //       if (field.fieldId > 0 && (_.toString(field.selectOrganizationData.format) === ORG_FORMATS.MULTI
  //         && _.toString(paramsEditField.selectOrganizationData.format) === ORG_FORMATS.SINGLE)) {
  //         const newParams = _.cloneDeep(newParamsEditField);
  //         const newFieldOganization = _.cloneDeep(field);
  //         newFieldOganization.fieldId = Math.round(Math.random() * 100000 * - 1);
  //         const copyField = { from: paramsEditField.fieldId, to: newFieldOganization.fieldId };
  //         newFieldOganization['copyField'] = copyField;
  //         newParams.fieldId = newFieldOganization.fieldId;
  //         newParamsEditField = newParams;
  //         newFieldOganization['oldField'] = field;
  //         deleteField.push(paramsEditField.fieldId)
  //         listField.splice(index, 1, newFieldOganization);
  //       } else if (field.fieldId > 0 && _.toString(field.selectOrganizationData.format) === ORG_FORMATS.SINGLE
  //         && _.toString(paramsEditField.selectOrganizationData.format) === ORG_FORMATS.MULTI && !_.isNil(field.oldField)) {
  //         field.fieldId = field.oldField.fieldId;
  //         if (!_.isNil(field.copyField)) {
  //           delete field.copyField;
  //         }
  //       }

  //     }
  //   })
  //   return { listField, newParamsEditField, deleteField };
  // }

  const onSaveField = (fields, paramsEditField, fieldInfoEdit) => {
    setCurrentFieldEdit(null);
    let deleteField = [];
    let listField = _.cloneDeep(fields);
    const resultProcess = processRelationselectOrganization(listField, paramsEditField, deleteField);
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
          const idx = employeeFieldUnavailable.findIndex(e => e.fieldId === field.fieldId)
          if (idx < 0) {
            employeeFieldUnavailable.push(field);
          } else {
            employeeFieldUnavailable[idx] = field;
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
          const idxUnAvailable = employeeFieldUnavailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            employeeFieldUnavailable.splice(idxUnAvailable, 1);
          }
        }
      }
    });

    for (let i = 0; i < listField.length; i++) {
      listField[i].fieldOrder = i + 1;
    }
    const ret = { listField: null, deleteFields: null };

    setFieldRelationTab(listField.filter(e => isFieldRelationAsTab(e)))

    ret.listField = listField;
    ret.deleteFields = deleteField;
    setFieldCallback(_.cloneDeep(ret));
    return ret;
  };

  const [isEditAvailableField, setIsEditAvailableField] = useState(false);

  const onExecuteAction = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(employeeDetail.fields, employeeFieldUnavailable, fieldInfo);
          if (summaryFields) {
            props.employee.fields.forEach((field) => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId)
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field)
              }
            })
          }
          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
          const arrFieldDel = _.cloneDeep(deleteFieldUnavailable)
          if (saveFieldResult.deleteFields.length > 0) {
            arrFieldDel.push(...saveFieldResult.deleteFields)
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
      case DynamicControlAction.CANCEL: {
        const summaryFieldsTmp = _.cloneDeep(summaryFields);
        if (summaryFieldsTmp) {
          const idx = summaryFieldsTmp.findIndex(e => e.fieldId === fieldInfo.fieldId);
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0) && !fieldInfo.copyField) {
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
              countSave[fieldInfo.fieldId] = 0;
              setCurrentFieldEdit(null)
            }
          } else if (fieldInfo.fieldId > 0 && fieldInfo.availableFlag === 0) {
            const idx2 = employeeFieldUnavailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              employeeFieldUnavailable.push(fieldInfo);
            }
            setCurrentFieldEdit(null)
          }
        }
        if (!_.isNil(summaryFields)) {
          setSummaryFields(summaryFieldsTmp);
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

  const getFullName = (surname, name) => {
    let fullName = '';
    if (surname) {
      fullName += surname;
    }
    if (name) {
      fullName += (fullName.length > 0) ? ` ${name}` : `${name}`;
    }
    return fullName;
  }

  const getFullNameKana = (surnameKana, nameKana) => {
    let fullNameKana = '';
    if (surnameKana) {
      fullNameKana += surnameKana;
    }
    if (nameKana) {
      fullNameKana += (fullNameKana.length > 0) ? ` ${nameKana}` : `${nameKana}`;
    }
    return fullNameKana;
  }

  const getCharacteristicsNumber = (name) => {
    try {
      let characteristicsNumber = 0;
      for (let i = 0; i < name.length; i++) {
        characteristicsNumber += name.charCodeAt(i);
      }
      return characteristicsNumber;
    } catch (err) {
      return 0
    }
  }

  const selectFieldTab = (listField, idTab) => {

    const tabInfo = objTabInfo[idTab]
    if (!tabInfo) return;
    tabInfo.setTab(listField);
    tabInfo.setDelete(prevState => prevState.filter(
      fieldId => !listField.find(f => f.fieldId === fieldId))
    )


    // switch (idTab) {
    //   case TAB_ID_LIST.tradingProduct:
    //     setTabProductTradingFields(listField);
    //     setDeleteTabProductTradingFields(
    //       deleteTabProductTradingFields.filter(
    //         fieldId => !listField.find(f => f.fieldId === fieldId))
    //     );
    //     break;
    //   case TAB_ID_LIST.task:
    //     setTabTaskFields(listField);
    //     setDeleteTabTaskFields(
    //       deleteTabTaskFields.filter(
    //         fieldId => !listField.find(f => f.fieldId === fieldId))
    //     );
    //     break;
    //   default:
    //     break;
    // }
  }

  const deleteFieldTab = (fieldDeleteId, idTab) => {
    const tabInfo = objTabInfo[idTab]
    if (!tabInfo) return;
    const field = tabInfo.stateTab.find(f => f.fieldId === fieldDeleteId);
    tabInfo.setDelete(prevState => [...prevState, field])
    // let field;
    // switch (idTab) {
    //   case TAB_ID_LIST.tradingProduct:
    //     field = tabProductTradingFields.find(f => f.fieldId === fieldDeleteId);
    //     setDeleteTabProductTradingFields([...deleteTabProductTradingFields, field]);
    //     break;
    //   case TAB_ID_LIST.task:
    //     field = tabTaskFields.find(f => f.fieldId === fieldDeleteId);
    //     setDeleteTabTaskFields([...deleteTabTaskFields, field]);
    //     break;
    //   default:
    //     break;
    // }
  }

  const renderDynamicSelectFields = () => {
    const tabInfo = objTabInfo[currentTab]
    if (tabInfo) {
      return <DynamicSelectFieldTab
        listFieldInfo={tabInfo.stateTab}
        tabType={currentTab}
        selectFieldTab={selectFieldTab}
        deleteFieldTab={deleteFieldTab}
      />
    }
    // if (currentTab === TAB_ID_LIST.task) {
    //   return <DynamicSelectFieldTab
    //     listFieldInfo={tabTaskFields}
    //     tabType={currentTab}
    //     selectFieldTab={selectFieldTab}
    //     deleteFieldTab={deleteFieldTab}
    //   />
    // } else if (currentTab === TAB_ID_LIST.tradingProduct) {
    //   return <DynamicSelectFieldTab
    //     listFieldInfo={tabProductTradingFields}
    //     tabType={currentTab}
    //     selectFieldTab={selectFieldTab}
    //     deleteFieldTab={deleteFieldTab}
    //   />
    // } else
    if (currentTab === TAB_ID_LIST.summary) {


      const listField = _.concat(summaryFields ? summaryFields : [], employeeFieldUnavailable);
      return (
        <DynamicSelectField
          onChangeSettingField={isChangeSettingField}
          fieldsUnVailable={employeeFieldUnavailable}
          currentSettingMode={popupSettingMode}
          fieldInfos={currentFieldEdit}
          listFieldInfo={listField}
          fieldNameExtension={'employee_data'}
          onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
          fieldBelong={FIELD_BELONG.EMPLOYEE}
          getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.employee && props.employee.fields, deleteFields: null }}
        />
      );
    }
  };

  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      resetStateExecuteDirtyCheck();
    });
  };

  const handleChangeScreenMode = () => {
    setTimeout(() => {
      props.changeScreenMode(props.id, true);
    }, 350);
  };

  const onNextEmployee = () => {
    let nextEmployeeId = null;
    const indexCurrentEmployee = getIndexCurrentEmployee();
    listEmployeeId.forEach((id, idx) => {
      if (idx === indexCurrentEmployee) {
        nextEmployeeId = listEmployeeId[idx + 1];
      }
    });
    executeDirtyCheck(() => {
      setCurrentEmployee(_.cloneDeep(nextEmployeeId));
      props.handleInitEmployeeDetail(props.id, nextEmployeeId);
      resetStateExecuteDirtyCheck()
    })
  };

  const onPrevEmployee = () => {
    let prevEmployeeId = null;
    const indexCurrentEmployee = getIndexCurrentEmployee();
    listEmployeeId.forEach((id, idx) => {
      if (idx === indexCurrentEmployee) {
        prevEmployeeId = listEmployeeId[idx - 1];
      }
    });
    executeDirtyCheck(() => {
      setCurrentEmployee(_.cloneDeep(prevEmployeeId));
      props.handleInitEmployeeDetail(props.id, prevEmployeeId);
      resetStateExecuteDirtyCheck()
    })
  };

  const [isNewEmployee, setIsNewEmployee] = useState(false);
  useEffect(() => {
    if (props.employeeId) {
      const index = props.listEmployeeId.findIndex(e => e === props.employeeId);
      if (index < 0) {
        setIsNewEmployee(true);
      }
    }
  }, [props.employeeId]);

  const onSelectDisplaySummary = editedItem => {
    const editItemIndex = tabList.findIndex(tab => tab.tabId === editedItem.tabId);
    const copyTabList = _.cloneDeep(tabList);
    copyTabList[editItemIndex] = { ...copyTabList[editItemIndex], ...editedItem };
    setTabListUpdate(_.cloneDeep(copyTabList));
    setTabList(_.cloneDeep(copyTabList));
  }

  const showOtherEmployeeDetail = (nextId, prevId) => {
    executeDirtyCheck(() => {
      props.handleOpenEmployeeDetailByItself(nextId, props.employeeId);
    })
  }

  const showAnyDetail = (objectId, type) => {
    if (objectId) {
      if (type === TYPE_DETAIL_MODAL.EMPLOYEE) {
        if (objectId !== employeeId) {
          const nextEmployeeId = objectId;
          const prevEmployeeId = employeeId;
          showOtherEmployeeDetail(nextEmployeeId, prevEmployeeId);
        }
      } else {
        props.handleShowDetail(objectId, type, `Employee_${employeeId}`);
      }
    }
  }

  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {employeeDetail && employeeDetail.tabsInfo && tabList && currentTab === TAB_ID_LIST.summary && (
          <ErrorBoundary>
            <TabSummary
              ref={tabSummaryRef}
              employee={employeeDetail}
              screenMode={screenMode}
              handleReorderField={(dragIdx, dropIdx) => props.handleReorderField(props.id, dragIdx, dropIdx)}
              onChangeFields={onChangeSummaryFields}
              editedFields={editedSummaryFields}
              onSelectDisplaySummary={onSelectDisplaySummary}
              summaryFields={summaryFields}
              openDynamicSelectFields={openDynamicSelectFields}
              tabList={tabList}
              isSaveField={isSaveField}
              destroySaveField={destroySaveField}
              fieldEdit={fieldEdit}
              paramsEdit={paramsEdit}
              onSaveField={onSaveField}
              onShowMessage={onShowMessage}
              employeeId={props.employeeId}
              countSave={countSave}
              employeeAllFields={props.employee}
              deletedFields={deletedSummaryFields}
              edittingField={currentFieldEdit}
              fieldsUnavailable={employeeFieldUnavailable}
              timeLineGroup={timeLineGroup}
            />
          </ErrorBoundary>

        )}
        {currentTab === TAB_ID_LIST.task && (
          <PopupDetailServiceTabTask
            typeTaskTab={TypeGetTaskByIdService.EmployeeId}
            fieldInfo={tabTaskFields}
            employeeIds={[currentEmployee]}
            showAnyDetail={showAnyDetail}
          // task={props.tabTasks}
          // taskFields={taskFields}
          // screenMode={props.screenMode}
          // onChangeFields={onChangeTaskFields}
          />)}
        {props.customers && currentTab === TAB_ID_LIST.customer && (
          <ErrorBoundary>
            <TabCustomer
              customers={props.customers}
              customerFields={tabCustomerFields}
              screenMode={screenMode}
              onChangeFields={onChangeCustomerFields}
              showAnyDetail={showAnyDetail}
              tenant={props.tenant}
              customerLayout={props.customerLayout}
              employeeId={currentEmployee}
            />
          </ErrorBoundary>
        )}
        {currentTab === TAB_ID_LIST.tradingProduct && (
          // <TabTradingProducts
          //   tradingProducts={props.tradingProducts}
          //   mode={screenMode}
          //   tradingProductsFields={tradingProductsFields}
          //   onChangeFields={onChangeTradingProductsFields}
          // />
          <DetailTabProductTrading
            customer={null}
            employeeId={currentEmployee}
            fieldInfo={tabProductTradingFields}
            showAnyDetail={showAnyDetail}
          />
        )}
        {currentTab === TAB_ID_LIST.businessCard && (
          <TabBusinessCards
            id={props.id}
            fieldInfo={tabBusinessCardFields}
            employeeId={currentEmployee}
            showAnyDetail={showAnyDetail}
          />
        )}
        {/* {props.groups && currentTab === TAB_ID_LIST.groups && ( */}
        {currentTab === TAB_ID_LIST.groups && (
          <TabGroups data={timeLineGroup} isFromModal={true} />
        )}
        {currentTab === TAB_ID_LIST.changeHistory && props.changeHistory && (
          <EmployeeTabChangeHistory
            idPopupEmployeeDetail={props.id}
            idPopupEmployeeEdit={employeeEditCtrlId[0]}
            employeeName={getFullName(employeeDetail.data.employeeSurname, employeeDetail.data.employeeName)} />
        )}
        {currentEmployee && currentTab === TAB_ID_LIST.calendar && <TabCalendar employeeId={currentEmployee} />}
        <RelationDisplayTab
          id="employeeRelationId"
          recordData={employeeDetail ? employeeDetail.data : null}
          fieldNameExtension="employeeData"
          isHeader={false}
          listFieldInfo={fieldRelationTab}
          currentTabId={currentTab}
        />
      </>
    );
  };

  const handleBackPopup = () => {
    if (screenMode === ScreenMode.DISPLAY && props.openFromModal) {
      return props.toggleClosePopupEmployeeDetail(true);
    }
    executeDirtyCheck(() => {
      props.changeScreenMode(props.id, false)
      resetStateExecuteDirtyCheck()
    })
  };

  const renderToolAlignRight = () => {
    return (
      <div className="popup-tool popup-tool-v2">
        {screenMode === ScreenMode.EDIT && (
          <a
            className="button-primary button-activity-registration content-left"
            onClick={() =>
              onOpenModalEmployee(EMPLOYEE_ACTION_TYPES.UPDATE, EMPLOYEE_VIEW_MODES.PREVIEW, currentEmployee)
            }>
            {translate('employees.detail.label.button.preview')}
          </a>
        )}
        <div className="message-area">
          {renderMessage()}
        </div>
        <div className="toolbox">
          {screenMode !== ScreenMode.EDIT && (
            <>
              {isAdmin && (
                <a
                  onClick={() => onOpenModalEmployee(EMPLOYEE_ACTION_TYPES.UPDATE, EMPLOYEE_VIEW_MODES.EDITABLE, currentEmployee)}
                  className="icon-small-primary icon-edit-small"
                />
              )}
              {employeeDetail && employeeDetail.data.employeeStatus === 1 ? (
                <>
                  {isAdmin && (
                    <a onClick={changeEmployeeStatusActive} className="icon-small-primary icon-person-arrow-prev-small" />
                  )}
                </>
              ) : (
                  <>
                    {isAdmin && (
                      <a onClick={changeEmployeeStatusDisAble} className="icon-small-primary icon-person-arrow-next" />
                    )}
                  </>
                )}
            </>
          )}
          {screenMode === ScreenMode.DISPLAY && (
            <>
              {isAdmin && (
                <a className="button-primary button-add-new" onClick={handleChangeScreenMode}>
                  {translate('employees.detail.label.button.edit')}
                </a>
              )}
            </>
          )}

          {screenMode === ScreenMode.EDIT && (
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
          {!isNewEmployee && (
            <>
              {listEmployeeId && currentEmployee !== listEmployeeId[0] ? (
                <a>
                  <i className="icon-small-primary icon-prev" onClick={onPrevEmployee} />
                </a>
              ) : (
                  <a>
                    <i className="icon-small-primary icon-prev disable" />
                  </a>
                )}
              {listEmployeeId && currentEmployee !== listEmployeeId[listEmployeeId.length - 1] ? (
                <a>
                  <i className="icon-small-primary icon-next" onClick={onNextEmployee} />
                </a>
              ) : (
                  <a>
                    <i className="icon-small-primary icon-next disable" />
                  </a>
                )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderAddTimeLine = () => {
    if(openAddTimeLine) {
      const employee = {
        targetType: TARGET_TYPE.EMPLOYEE,
        targetId: props.employeeId ? props.employeeId :'',
        targetName: employeeDetail?.data ? getFullName(employeeDetail.data.employeeSurname, employeeDetail.data.employeeName) : ''
      }
      return (
        <>
          <div className="wrap-timeline">
            <TimelineAddEdit defaultTagetCreateAdEdit={[employee]} closeModal={() => setOpenAddTimeLine(false)}/>
          </div>
        </>
      )
    }
    return <></>;
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

  const handleScroll = e => {
    if (
      props.changeHistory &&
      currentTab === TAB_ID_LIST.changeHistory &&
      scrollWrap.current.scrollHeight - scrollWrap.current.scrollTop === scrollWrap.current.clientHeight && !clickTab
    ) {
      props.handleInitChangeHistory(props.id, currentEmployee, currentPage + 1, 30, false);
      setCurrentPage(currentPage + 1);
    }
    if (scrollWrap.current.scrollHeight - scrollWrap.current.scrollTop === scrollWrap.current.clientHeight) {
      setClickTab(false);
    }
  };

  /**
 * Get random Avatar
 */
  const getAvatarName = (itemId) => {
    if (!itemId || itemId.length === 0) {
      return AvatarColor[0];
    }
    return itemId.length === 1 ? AvatarColor[itemId] : AvatarColor[itemId.toString().charAt(itemId.length - 1)];
  }

  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && props.screenMode === ScreenMode.EDIT) {
      return (
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option z-index-9">
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
        </div>
      )
    } else {
      return <></>
    }
  }

  const handleCloseModalEmployee = (toggleModal) => {
    if (toggleModal) {
      setOpenModalEmployee(false);
    }
  }

  const handleUserMouseDown = (event) => {
    if (tipListRef && tipListRef.current && !tipListRef.current.contains(event.target)) {
      setShowTipListSubordinates(false);
    }
  };
  useEventListener('mousedown', handleUserMouseDown);

  const renderTipListSubordinates = () => {
    return (
      <div className="drop-down h-auto z-index-999 width-300" ref={tipListRef}>
        <ul className="dropdown-item style-3 h-auto max-height-400">
          {employeeDetail.data.employeeSubordinates.map((subordinate, idx) => {
            return (
              <li key={idx}>
                <div className="item smooth mr-0 d-block">
                  <div className="item2">
                    {subordinate.employeeIcon && subordinate.employeeIcon['file_url'] ?
                      <div className="name">
                        <img className="border-0 align-baseline"
                        src={subordinate.employeeIcon['file_url']} alt="" />
                      </div> :
                      <div className={"name " + getAvatarName(idx)}>{getFirstCharacter(subordinate.employeeName)}</div>
                    }
                    <div className="content">
                      <div className="text text1 text-ellipsis font-size-12 color-666">{`${subordinate.departmentName || ''}${subordinate.positionName ? ' - ' + subordinate.positionName : ''}`}</div>
                      <a className="text text2 text-ellipsis text-blue"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${window.location.origin}/${props.tenant}/employee-detail/${subordinate.employeeId}`}
                      >{subordinate.employeeName}</a>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <div className="modal-open">
        {/* popup */}
        <div
          className="modal popup-esr popup-task popup-modal-common show popup-align-right ">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              {isDragging && !isScrollMin && <div className="box-common-drag-drop-success">
                <span>{translate('employees.detail.info.infoScroll')}</span>
              </div>}
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back ">
                    {screenMode === ScreenMode.EDIT || props.openFromModal ? (
                      <a className="icon-small-primary icon-return-small" onClick={handleBackPopup} />
                    ) : (
                        <a className="icon-small-primary icon-return-small disable" />
                      )}
                    {employeeDetail && (
                      <span className="text align-items-center">
                        <img className="icon-popup-big" src="../../../content/images/ic-popup-ttle-group-user.svg" />{' '}
                        {getFullName(employeeDetail.data.employeeSurname, employeeDetail.data.employeeName)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-share" onClick={url => copyUrlEmployee()} />
                  {showModal && (
                    <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}>
                      &nbsp;
                    </a>
                  )}
                  {showModal && <a onClick={handleClosePopup} className="icon-small-primary icon-close-up-small line"></a>}
                </div>
              </div>
              <div className="modal-body">
                <div className="popup-content style-3 v2">
                  {renderToolAlignRight()}
                  <div className="popup-content-common-wrap">
                    <div
                      className={
                        screenMode === ScreenMode.EDIT ? 'popup-content-common-left style-3 overflow-y-hover' : 'popup-content style-3 overflow-y-hover p-4 w-100'}
                      onScroll={handleScroll} ref={scrollWrap}>
                      <div className={`${props.screenMode === ScreenMode.EDIT ? 'pt-4 ml-4' : ''}`}>
                        <div className="popup-user">
                          <div className="popup-user-left d-flex">
                            {employeeDetail &&
                              <a className={`${employeeDetail.data.employeeIcon ? '' : 'green'} avatar`}>
                                {employeeDetail.data.employeeIcon ? (
                                  <img src={employeeDetail.data.employeeIcon.fileUrl} alt="" className="border-0" />
                                ) : (
                                    <div className={"name " + getAvatarName(getCharacteristicsNumber(employeeDetail.data.employeeSurname))}>
                                      {getFirstCharacter(getFullName(employeeDetail.data.employeeSurname, employeeDetail.data.employeeName))}
                                    </div>
                                  )}
                              </a>
                            }
                            <div className="user-info">
                              {employeeDetail && employeeDetail.data.employeeDepartments[0] && (
                                <>
                                  <span className="sales-dept">
                                    {employeeDetail.data.employeeDepartments[0].departmentName}
                                    {employeeDetail.data.employeeDepartments[0].departmentName ? '　' : ''}
                                    {employeeDetail.data.employeeDepartments[0].positionName}
                                  </span>
                                  <br />
                                </>
                              )}
                              {employeeDetail && (
                                <>
                                  <span className="sales-dept">
                                    {getFullNameKana(employeeDetail.data.employeeSurnameKana, employeeDetail.data.employeeNameKana)}
                                  </span>
                                  <br></br>
                                  <span className="sales-taro">
                                    {getFullName(employeeDetail.data.employeeSurname, employeeDetail.data.employeeName)}{' '}
                                  </span>
                                </>
                              )}
                              {employeeDetail && employeeDetail.data.employeePackages && employeeDetail.data.employeePackages.length > 0 && (
                                <a className="button-blue-small button-popup text-white pointer-none">
                                  {employeeDetail.data.employeePackages.map((item, idx) => (
                                    <React.Fragment key={idx}>{item.packagesName}{idx < employeeDetail.data.employeePackages.length - 1 && translate('commonCharacter.comma')}</React.Fragment>
                                  ))}
                                </a>)}
                              {employeeDetail && (
                                <>
                                  <br />
                                  <a className="email" href={'mailto:' + employeeDetail.data.email}>
                                    {employeeDetail.data.email}
                                  </a>
                                </>
                              )}
                              <br />
                              {employeeDetail && employeeDetail.data.telephoneNumber}
                            </div>
                          </div>
                          <div className="popup-user-right">
                            <div className="popup-user-right-content">
                              <a
                                title=""
                                className="icon-small-primary icon-edit-follow"
                                onClick={() => setOpenAddTimeLine(true)}>
                              </a>
                              {!props.isFollowed ? (
                                <a
                                  onClick={() => props.handleInitFollowEmployee(props.id, watchTargetType, currentEmployee)}
                                  className="button-primary button-activity-registration"
                                >
                                  {translate('employees.detail.label.button.follow')}
                                </a>
                              ) : (
                                  <a
                                    onClick={() => props.handleInitUnfollowEmployee(props.id, watchTargetType, currentEmployee)}
                                    className="button-primary button-activity-registration"
                                  >
                                    {translate('employees.detail.label.button.unfollow')}
                                  </a>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`popup-user-colleague ${props.screenMode === ScreenMode.EDIT ? 'ml-4' : ''}`}>
                        <div className="superior">
                          <label className="user-label">{translate('employees.detail.label.manager')}</label>
                          <div className="group-sticker">
                            {employeeDetail && employeeDetail.data.employeeManagers.length > 0 && employeeDetail.data.employeeManagers.map((manager, idx) => {
                              if (!manager.managerId && !manager.employeeId) {
                                return <></>
                              }
                              return (
                                <div key={idx} className="item-sticker">
                                  <div className="mission-wrap mb-0">
                                    <div className="item item2">
                                      {manager.employeeIcon && manager.employeeIcon['file_url'] ?
                                        <img className="user" src={manager.employeeIcon['file_url']} alt="" /> :
                                        <div className={"name " + getAvatarName(idx)}>{getFirstCharacter(manager.employeeName)}</div>
                                      }
                                      <a className="text-blue"
                                        title=""
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`${window.location.origin}/${props.tenant}/employee-detail/${manager.employeeId}`}
                                      >
                                        {manager.employeeName}
                                      </a>
                                    </div>
                                  </div>
                                  {!manager.managerId && <span className="d-inline-block align-middle">
                                    {translate('employees.detail.label.iconSubordinateInformation')}{manager.departmentName + translate('employees.detail.label.department.name')}
                                  </span>}
                                </div>
                              )
                            }
                            )}
                          </div>
                        </div>
                        <div className="lower-grade superior">
                          <label className="user-label mb-0">{translate('employees.detail.label.subordinate')}</label>
                          <div className="group-sticker">
                            {employeeDetail && employeeDetail.data.employeeSubordinates.length > 0 &&
                              employeeDetail.data.employeeSubordinates.slice(0, 2).map((subordinate, idx) => {
                                return (
                                  subordinate.employeeId &&
                                  <div key={idx} className="item-sticker">
                                    <div className="mission-wrap">
                                      <div className="item item2">
                                        {subordinate.employeeIcon && subordinate.employeeIcon['file_url'] ?
                                          <img className="user" src={subordinate.employeeIcon['file_url']} alt="" /> :
                                          <div className={"name " + getAvatarName(idx)}>{getFirstCharacter(subordinate.employeeName)}</div>
                                        }
                                        <a className="text-blue"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href={`${window.location.origin}/${props.tenant}/employee-detail/${subordinate.employeeId}`}
                                        >
                                          {subordinate.employeeName}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              )}
                            {employeeDetail && employeeDetail.data.employeeSubordinates.length > 2 &&
                              <div className="item-sticker">
                                <div className="mission-wrap">
                                  <div className="item item2 form-group position-relative">
                                    <a className="text-blue" onClick={() => setShowTipListSubordinates(true)}>
                                      {translate('employees.detail.label.remain', { count: employeeDetail.data.employeeSubordinates.length - 2 })}
                                    </a>
                                    {showTipListSubordinates && renderTipListSubordinates()}
                                  </div>
                                </div>
                              </div>}
                          </div>
                        </div>
                      </div>
                      <div className={`popup-content-common-content ${props.screenMode === ScreenMode.EDIT ? "pl-4" : ""}`}>
                        <div className="tab-detault">
                          <ul className={`nav nav-tabs sticky mb-0 ${props.screenMode === ScreenMode.EDIT ? "" : "v2"}`}>
                            {tabList && tabListShow && (
                              <TabList
                                onChangeTab={changeTab}
                                tabList={tabList}
                                tabListShow={tabListShow}
                                onDragDropTabList={onDragDropTabList}
                                deleteAddTab={onDelAddTab}
                                currentTab={currentTab}
                                screenMode={screenMode}
                              />
                            )}
                            <RelationDisplayTab
                              id="employeeRelationId"
                              isHeader={true}
                              listFieldInfo={fieldRelationTab}
                              currentTabId={currentTab}
                              onChangeTab={changeTab}
                            />
                            {renderActionTab()}
                          </ul>
                          <div className="tab-content min-height-200" onScroll={handleScrollIsDragging} ref={tableListRef}>{renderTabContents()}</div>
                        </div>
                      </div>
                    </div>
                    {screenMode === ScreenMode.EDIT && renderDynamicSelectFields()}
                  </div>
                </div>
                {renderAddTimeLine()}
                {/* <div className="message-area message-area-bottom position-absolute"> */}
                {renderToastMessage()}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* end popup */}
        {openModalEmployee && (
          <ModalCreateEditEmployee
            id={employeeEditCtrlId[0]}
            backdrop={false}
            toggleCloseModalEmployee={onCloseModalEmployee}
            iconFunction="ic-sidebar-employee.svg"
            employeeActionType={employeeActionType}
            employeeViewMode={employeeViewMode}
            employeeId={employeeId}
            listFieldPreview={summaryFields}
            isOpenedFromModal={true}
            toggleNewWindow={handleCloseModalEmployee}
          />
        )}
        <ShowDetail idCaller={`Employee_${employeeId}`} cleanClosePopup={true} />
      </div>
    );
  };

  if (showModal) {
    if (props.openFromMilestone) {
      document.body.className = 'wrap-employee modal-open';
    }
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-employee-detail" autoFocus={true} zIndex={props.openFromMilestone ? 9999 : 'auto'}>
          {renderComponent()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      document.body.className = 'body-full-width wrap-employee modal-open';
      return (
        <>
          {renderComponent()}
          {(document.body.className = document.body.className.replace('modal-open', ''))}
        </>
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ popupDetailTab, dataCalendarGrid, dynamicList, employeeDetail, authentication, applicationProfile, screenMoveState, employeeList }: IRootState, ownProps: any) => {
  const stateObject = {
    fieldInfos: [],
    customFieldInfos: [],
    fieldSearchInfos: null,
    customFieldSearchInfos: null,
    employee: null,
    actionType: null,
    errorMessageInList: null,
    errorItems: null,
    errorMessageChangeStatusFailed: null,
    employeesCheckList: [],
    screenMode: null,
    customers: null,
    customerLayout: null,
    task: null,
    tradingProducts: null,
    businessCards: null,
    groups: null,
    userLogin: null,
    listFavoriteGroup: null,
    authorities: authentication.account.authorities,
    tenant: applicationProfile.tenant,
    changeHistory: null,
    employeeLayout: null,
    employeeFieldsUnVailable: null,
    messageChangeStatusSuccess: null,
    messageDeleteSuccess: null,
    tabListShow: null,
    employeeFieldsAvailable: null,
    messageUpdateCustomFieldInfoSuccess: null,
    messageUpdateCustomFieldInfoError: null,
    action: null,
    screenMoveInfo: screenMoveState.screenMoveInfo,
    tabProductTradingFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.PRODUCT_TRADING}`)?.fieldInfos?.fieldInfoPersonals,
    tabTaskFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.TASK}`)?.fieldInfos?.fieldInfoPersonals,
    tabCustomerFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.CUSTOMER}`)?.fieldInfos?.fieldInfoPersonals,
    tabBusinessCardFieldsProps: dynamicList?.data?.get(`${CUSTOMER_GET_FIELD_TAB}${FIELD_BELONG.BUSINESS_CARD}`)?.fieldInfos?.fieldInfoPersonals,
    isFollowed: false,
    isMissingLicense: authentication.isMissingLicense,
    isInvalidLicense: employeeList.license.isInvalidLicense,
    badgesCalendar: dataCalendarGrid.badges,
    badgesTask: popupDetailTab.badgesTask,
    badgesProductTrading: popupDetailTab.badgesProductTrading
  };
  if (employeeDetail && employeeDetail.data.has(ownProps.id)) {
    stateObject.fieldInfos = employeeDetail.data.get(ownProps.id).fieldInfos;
    stateObject.customFieldInfos = employeeDetail.data.get(ownProps.id).customFieldInfos;
    stateObject.fieldSearchInfos = employeeDetail.data.get(ownProps.id).fieldSearchInfos;
    stateObject.customFieldSearchInfos = employeeDetail.data.get(ownProps.id).customFieldSearchInfos;
    stateObject.employee = employeeDetail.data.get(ownProps.id).employee;
    stateObject.actionType = employeeDetail.data.get(ownProps.id).action;
    stateObject.errorMessageInList = employeeDetail.data.get(ownProps.id).errorMessageInList;
    stateObject.errorItems = employeeDetail.data.get(ownProps.id).errorItems;
    stateObject.errorMessageChangeStatusFailed = employeeDetail.data.get(ownProps.id).errorMessageChangeStatusFailed;
    stateObject.employeesCheckList = employeeDetail.data.get(ownProps.id).employeesCheckList;
    stateObject.screenMode = employeeDetail.data.get(ownProps.id).screenMode;
    stateObject.customers = employeeDetail.data.get(ownProps.id).customers;
    stateObject.customerLayout = employeeDetail.data.get(ownProps.id).customerLayout;
    stateObject.task = employeeDetail.data.get(ownProps.id).task;
    stateObject.tradingProducts = employeeDetail.data.get(ownProps.id).tradingProducts;
    stateObject.businessCards = employeeDetail.data.get(ownProps.id).businessCards;
    stateObject.groups = employeeDetail.data.get(ownProps.id).groups;
    stateObject.userLogin = employeeDetail.data.get(ownProps.id).userLogin;
    stateObject.listFavoriteGroup = employeeDetail.data.get(ownProps.id).listFavoriteGroup;
    stateObject.changeHistory = employeeDetail.data.get(ownProps.id).changeHistory;
    stateObject.employeeLayout = employeeDetail.data.get(ownProps.id).employeeLayout;
    stateObject.employeeFieldsUnVailable = employeeDetail.data.get(ownProps.id).employeeFieldsUnVailable;
    stateObject.messageChangeStatusSuccess = employeeDetail.data.get(ownProps.id).messageChangeStatusSuccess;
    stateObject.messageDeleteSuccess = employeeDetail.data.get(ownProps.id).messageDeleteSuccess;
    stateObject.tabListShow = employeeDetail.data.get(ownProps.id).tabListShow;
    stateObject.employeeFieldsAvailable = employeeDetail.data.get(ownProps.id).employeeFieldsAvailable;
    stateObject.messageUpdateCustomFieldInfoSuccess = employeeDetail.data.get(ownProps.id).messageUpdateCustomFieldInfoSuccess;
    stateObject.messageUpdateCustomFieldInfoError = employeeDetail.data.get(ownProps.id).messageUpdateCustomFieldInfoError;
    stateObject.action = employeeDetail.data.get(ownProps.id).action;
    stateObject.isFollowed = employeeDetail.data.get(ownProps.id).isFollowed;
  }

  return stateObject;
};

const mapDispatchToProps = {
  handleInitChangeEmployeeStatus,
  handleReorderField,
  handleInitEmployeeDetail,
  handleInitFollowEmployee,
  handleInitUnfollowEmployee,
  handleInitGroups,
  handleInitlistFavoriteGroup,
  handleInitTradingProducts,
  handleInitCalendarMonth,
  changeScreenMode,
  handleInitCustomerTab,
  handleGetCustomerLayoutTab,
  handleInitTaskTab,
  handleInitChangeHistory,
  handleInitEmployeeLayout,
  handleInitUserLogin,
  reset,
  handleUpdateCustomFieldInfo,
  moveScreenReset,
  handleGetTimelineGroupsOfEmployeeForDetailEmp,
  getFieldInfoPersonals,
  handleGetFollowEmployee,
  handleShowDetail,
  clearShowDetail,
  handleGetListTimelineGroupsByIds
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupEmployeeDetail);
