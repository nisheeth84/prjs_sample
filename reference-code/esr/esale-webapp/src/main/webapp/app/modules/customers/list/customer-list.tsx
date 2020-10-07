import React, { useEffect, useState, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import CustomerControlTop from '../control/customer-control-top';
import CustomerControlSidebar from '../control/customer-control-sidebar';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search'
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import * as R from 'ramda';
import {
  CUSTOMER_LIST_ID,
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_LIST_TYPE,
  CUSTOMER_VIEW_MODES,
  SHARE_LIST_MODES,
  CUSTOMER_SPECIAL_LIST_FIELD,
  SHOW_MESSAGE_SUCCESS,
  SELECT_TARGET_TYPE,
  CUSTOMER_MY_LIST_MODES
} from '../constants';
import { ScreenMode, FIELD_BELONG, TIMEOUT_TOAST_MESSAGE, SCREEN_TYPES, AUTHORITIES, DATETIME_FORMAT, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import _ from 'lodash';
import CustomerMap from '../map/map';
import { FieldInfoType, OVER_FLOW_MENU_TYPE, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import GlobalControlRight from 'app/modules/global/global-tool';
import PopupCustomerDetail from '../popup-detail/popup-customer-detail';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import AddToList from '../list-operation/add-to-list';
import MoveToList from '../list-operation/move-to-list';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import StringUtils from 'app/shared/util/string-utils';
import { isNullOrUndefined } from 'util';
import PopupMenuSet from '../../setting/menu-setting';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import { Modal } from 'reactstrap';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";
import CustomerIntegrationModal from "app/modules/customers/customer-integration/customer-integration"

import {
  handleGetCustomerList,
  handleGetCustomersHasCondition,
  handleGetCustomFieldInfo,
  changeScreenMode,
  handleRemoveFavouriteList,
  handleDeleteList,
  handleDownloadCustomers,
  handleDeleteCustomerOutOfList,
  handleAddCustomersToFavouriteList,
  handleMoveCustomersToOtherList,
  handleCountRelationCustomers,
  handleDeleteCustomers,
  handleUpdateCustomers,
  handleGetCustomerLayout,
  handleAddCustomersToList,
  reset,
  resetList,
  resetMessageSuccess,
  handleGetSearchConditionInfoList,
  handleGetCustomerHistoryAcivities,
  CustomerAction
} from './customer-list.reducer';
import {
  getFieldInfoPersonals
} from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import CreateEditCustomerModal from '../create-edit-customer/create-edit-customer-modal';
import { CustomerAction as CreateEditCustomerAction } from '../create-edit-customer/create-edit-customer.reducer';
import {
  handleAddCustomersToAutoList,
  handleGetInitializeListInfo
} from './../control/customer-control-sidebar.reducer'

import SwitchFieldPanel from 'app/shared/layout/dynamic-form/switch-display/switch-field-panel';
import { SEARCH_MODE } from 'app/modules/employees/constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import PopupDeleteCustomer from '../control/popup/popup-delete-customer';
import { handleInitLocalMenu } from '../control/customer-control-sidebar.reducer';
import Popover from 'app/shared/layout/common/Popover';
import { customFieldsInfo, customHeaderField, renderItemNotEdit, getExtensionsCustomer } from './special-render/special-render';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import SpecialEditList from './special-render/special-edit-list';
import { getPhotoFilePath } from 'app/shared/util/entity-utils';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { BUSINESS_CARD_ACTION_TYPES } from 'app/modules/businessCards/constants';
import { ACTIVITY_ACTION_TYPES } from 'app/modules/activity/constants';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import CustomerMySharedListModal, { FSActionTypeScreen } from 'app/modules/customers/my-shared-list/customer-my-shared-list-modal';
import { GROUP_TYPE } from 'app/shared/layout/dynamic-form/group/constants';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import { MODAL_CALENDAR } from 'app/modules/calendar/constants';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import BrowserDirtyCheck from 'app/shared/layout/common/browser-dirty-check';
import DynamicDisplayConditionList from 'app/shared/layout/dynamic-form/list/dynamic-display-condition-list';
import employee from 'app/modules/setting/employee/employee';
import useEventListener from 'app/shared/util/use-event-listener';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';

export interface ICustomerListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  screenMode: any;
  fieldInfos: any;
  customFieldInfos: any;
  customers: any;
  actionType: any;
  errorMessage: any;
  errorItems: any;
  checkboxFirstColumn: any;
  categories: any;
  category: any,
  isShowMap: boolean,
}

const iconYellow = {
  path: 'M21 22h2v2h-22v-2h2v-22h18v22zm-10-3h-2v4h2v-4zm4 0h-2v4h2v-4zm4-17h-14v20h2v-5h10v5h2v-20zm-12 11h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z',
  fillColor: 'yellow',
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: 'transparent',
  strokeWeight: 1
};

const iconRed = {
  path: 'M21 22h2v2h-22v-2h2v-22h18v22zm-10-3h-2v4h2v-4zm4 0h-2v4h2v-4zm4-17h-14v20h2v-5h10v5h2v-20zm-12 11h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z',
  fillColor: 'red',
  fillOpacity: 0.8,
  scale: 1,
  strokeColor: 'transparent',
  strokeWeight: 1
};

const customerListResult = [
  // new google.maps.Marker({ position: { lat: 21.0418627, lng: 105.7708316 }, title: "Ronaldo", icon: iconYellow }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.0337121, 105.7862958), title: "Messi", icon: iconYellow }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.0294082, 105.7773169), title: "Ricardo KaKa'", icon: iconRed }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.0372205, 105.7809929), title: "Zidane", icon: iconRed }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.036705, 105.779578), title: "Sir Alex", icon: iconRed }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.037688, 105.778577), title: "Neymar", icon: iconYellow }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.036061, 105.777852), title: "Pogba", icon: iconYellow }),
  // new google.maps.Marker({ position: new google.maps.LatLng(21.037881, 105.782322), title: "Ronaldinho", icon: iconRed }),
]

export const ICON_FUNCION_CUSTOMERS = "ic-sidebar-customer.svg";

/**
 * Display Customer List
 * @param props
 */
export const CustomerList = (props: ICustomerListProps) => {
  const { customers, errorItems } = props;
  const [openMapCustom, setOpenMapCustom] = useState(false);
  const tableListRef = useRef(null);
  const sidebarRef = useRef(null);
  const { fieldInfos, customFieldInfos } = props;
  // const [customerActionType, setCustomerActionType] = useState(CUSTOMER_ACTION_TYPES.VIEW_POPUP_DEMO);

  const [openModalNetworkCustomer, setOpenModalNetworkCustomer] = useState(false);
  // const [openDepartmentPopup, setOpenDepartmentPopup] = useState(false);
  // const [isRegistDepartment, setIsRegistDepartment] = useState(true);
  // const [departmentIdSelected, setDepartmentIdSelected] = useState(0);

  const [showSwitcher, setShowSwitcher] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);

  const [saveEditValues, setSaveEditValues] = useState([]);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);

  const [searchConditions, setSearchConditions] = useState([]);
  const [searchLocal, setSearchLocal] = useState('');
  const [filterItemConditions, setFilterItemConditions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [orderBy, setOrderBy] = useState([]);
  const [selectedTargetType, setSelectedTargetType] = useState(0);
  const [selectedTargetId, setSelectTargetId] = useState(0);
  const [isUpdateListView, setIsUpdateListView] = useState(false);
  // isUpdateListView : will set value for params

  const [showCreateEditCustomerModal, setShowCreateEditCustomerModal] = useState(null);
  const [customerActionType, setCustomerActionType] = useState(CUSTOMER_ACTION_TYPES.CREATE);
  const [customerViewMode, setCustomerViewMode] = useState(CUSTOMER_VIEW_MODES.EDITABLE);
  // const [customerId, setCustomerId] = useState(null);
  const [customerSuccessMessage, setCustomerSuccessMessage] = useState(null);
  const [openPopupCustomerDetail, setOpenPopupCustomerDetail] = useState(false);
  const [customerIdDetail, setCustomerIdDetail] = useState();
  const [prevCustomerIds, setPrevCustomerIds] = useState([]);
  const [isOpenCustomerDetailNotFromList, setIsOpenCustomerDetailNotFromList] = useState(false);
  // const [openNetworkMapModeTable, setOpenNetworkMapModeTable] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(SHOW_MESSAGE_SUCCESS.NONE);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);

  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [msgErrorBox, setMsgErrorBox] = useState(null);
  const [isShowRelationCustomers, setShowRelationCustomers] = useState(false);
  const [activeCardList, setActiveCardList] = useState({ typeList: CUSTOMER_LIST_TYPE.ALL_LIST, listId: 0, isAutoList: false, customerListType: undefined, listName: null, participantType: null });
  const [openAddToListPopup, setOpenAddToListPopup] = useState(false);
  const [openMoveToListPopup, setOpenMoveToListPopup] = useState(false);
  const [openCustomerIntegration, setOpenCustomerIntegration] = useState(null);
  const [activeIcon, setActiveIcon] = useState(false);
  const [heightPosition, setHeightPosition] = useState(1);
  const [openOverFlow, setOpenOverFlow] = useState(false);
  const [fileUploads, setFileUploads] = useState({});
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const [employeeSuccessMessage, setEmployeeSuccessMessage] = useState(null);
  const [infoSearchConditionList, setInfoSearchConditionList] = useState([]);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  const { screenMoveInfo } = props;
  const [openModalTaskCreate, setOpenModalTaskCreate] = useState(false);
  const [openCreateBusinessCard, setOpenCreateBusinessCard] = useState(false);
  const [openModalCreateActivity, setOpenModalCreateActivity] = useState(false);
  const [openModalCreateCalendar, setOpenModalCreateCalendar] = useState(false);
  const [openModalSubCustomer, setOpenModalSubCustomer] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [modalName, setModalName] = useState(null);
  const [customerModalEmail, setCustomerModalEmail] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [openPopupDetailSchedule, setOpenPopupDetailSchedule] = useState(false);
  const [detailScheduleId, setDetailScheduleId] = useState(null);
  const [view, setView] = useState(1)
  const formId = "customer-list-edit-simple-mode";
  const [isChanged, setIsChanged] = useDetectFormChange(formId, [view]);
  const [isReloadCustomers, setIsReloadCustomers] = useState(false);
  const employeeDetailCtrlId = useId(1, "customerListEmployeeDetail_")
  const customerEditCtrlId = useId(1, "listCustomerEdit_")
  const customerDetailCtrlId = useId(1, "customerListCustomerDetailCtrlId_");
  const [openFromOtherServices, setOpenFromOtherServices] = useState(false);
  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);
  useEffect(() => {
    setIsChanged(false)
  }, [view])

  /**
   * State for customer my list
   */
  const defaultCustomerMyListData = {
    listMode: CUSTOMER_MY_LIST_MODES.MODE_CREATE_LIST,
    listId: null,
    isAutoList: false,
    listMembers: null
  }
  const [openCustomerMyList, setOpenCustomerMyList] = useState(false);
  const [customerMyListData, setCustomerMyListData] = useState(defaultCustomerMyListData);

  /**
   * State for customer shared list.
   */
  const defaultCustomerSharedListData = {
    listMode: SHARE_LIST_MODES.MODE_CREATE_LIST,
    listId: null,
    isOwnerList: false,
    isAutoList: false,
    listMembers: null
  }
  const [openCustomerSharedList, setOpenCustomerSharedList] = useState(false);
  const [customerSharedListData, setCustomerSharedListData] = useState(defaultCustomerSharedListData);

  let customerList = [];
  if (customers && customers.customers) {
    customerList = customers.customers;
  }

  let customerLayout = [];
  if (props.customerLayout) {
    customerLayout = props.customerLayout;
  }

  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = fieldInfos.fieldInfoPersonals;
  }

  let customFields = [];
  if (customFieldInfos && customFieldInfos.customFieldsInfo) {
    customFields = customFieldInfos.customFieldsInfo;
  }

  /**
   * Detele list customer select
   */
  const deleteCustomers = () => {
    if (props.recordCheckList.length > 0) {
      // get data relation
      const arrCustomerId = props.recordCheckList.map((item) => {
        return item.customerId
      })
      props.handleDeleteCustomers(arrCustomerId);
      setShowRelationCustomers(false);
    }
  }

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
    // return props.relationCustomerData && props.relationCustomerData.length > 0 && props.relationCustomerData.filter(e => e.countActivities || e.countBusinessCard || e.countEmail || e.countProductTrading
    //   || e.countSchedules || e.countTasks || e.countTimelines).length > 0;
    return countRelation(props.relationCustomerData) > 0;
  }

  useEffect(() => {
    if (props.infoSearchConditionList) {
      setInfoSearchConditionList(props.infoSearchConditionList)
    }
  }, [props.infoSearchConditionList])

  useEffect(() => {
    if (props.modalDetail === MODAL_CALENDAR.HIDE) {
      document.body.className = "wrap-customer";
    }
  }, [props.modalDetail])


  useEffect(() => {
    document.body.className = "wrap-customer";
    props.handleGetCustomerList(offset, limit);
    props.handleGetCustomerLayout();
    setIsUpdateListView(false);
    setSelectedTargetType(0);
    return () => {
      document.body.className = "";
      props.reset();
    }
  }, []);

  useEffect(() => {
    if (props.customersMsgGetSuccess) {
      props.handleGetInitializeListInfo(FIELD_BELONG.CUSTOMER);
    }
  }, [props.customersMsgGetSuccess])

  useEffect(() => {
    if(props.searchConditionsParam && (activeCardList.typeList !== CUSTOMER_LIST_TYPE.ALL_LIST || activeCardList.typeList !== CUSTOMER_LIST_TYPE.CUSTOMER_IN_CHARGE)) {
      setInfoSearchConditionList(props.searchConditionsParam);
    }
  }, [props.searchConditionsParam])

  useEffect(() => {
    if (props.customerDeleteFails && props.customerDeleteFails.length > 0) {
      setMsgErrorBox(translate(`messages.${props.customerDeleteFails[0].errorCodes[0]}`));
    }
  }, [props.customerDeleteFails])

  useEffect(() => {
    if (props.moveToCustomerId) {
      tableListRef.current.changeRecordCheckList([]);
      props.handleGetCustomersHasCondition(offset, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
    }
  }, [props.moveToCustomerId])

  useEffect(() => {
    if (props.msgRemoveFavouriteList) {
      if (props.removeFavouriteCustomerId === activeCardList.listId && activeCardList.typeList === CUSTOMER_LIST_TYPE.FAVORITE_LIST) {
        tableListRef && tableListRef.current && tableListRef.current.resetState();
        sidebarRef && sidebarRef.current && sidebarRef.current.resetSidebar();
      }
    }
  }, [props.msgRemoveFavouriteList])

  useEffect(() => {
    if (props.relationCustomerData) {
      if (hasRelationData()) {
        setShowRelationCustomers(true);
      } else {
        deleteCustomers();
      }
    }
  }, [props.relationCustomerData])

  /**
   * After deleting customer, show all customers
   */
  useEffect(() => {
    if (props.messageDeleteSuccess !== null) {
      props.handleGetCustomerList(offset, limit);
    }
  }, [props.messageDeleteSuccess]);

  useEffect(() => {
    // open details customer from other screen
    const { state } = props.location;
    if (state && state.openDetail && state.recordId) {
      setOpenPopupCustomerDetail(true);
      setCustomerIdDetail(state.recordId);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);

  useEffect(() => {
    if (props.actionType ===  CustomerAction.Success) {
      setFileUploads({});
    }
  }, [props.actionType]);

  const reloadScreen = (isReloadNow?) => {
    setMsgErrorBox('');
    let _searchConditions = null;
    let _searchLocal = null;
    if (!isReloadNow) {
      if (searchConditions && searchConditions.length > 0) {
        _searchConditions = searchConditions;
      } else {
        _searchLocal = searchLocal;
      }
    }
    props.resetList();
    props.handleGetCustomersHasCondition(
      offset,
      limit,
      _searchLocal,
      selectedTargetType,
      selectedTargetId,
      false,
      filterItemConditions,
      orderBy,
      _searchConditions);
    props.getFieldInfoPersonals(CUSTOMER_LIST_ID, FIELD_BELONG.CUSTOMER, 1, FieldInfoType.Personal, selectedTargetType, selectedTargetId);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  useEffect(() => {
    if (props.msgSuccesUpdateCustomers && props.msgSuccesUpdateCustomers.successId === SHOW_MESSAGE_SUCCESS.UPDATE) {
      props.handleGetCustomersHasCondition(
        offset,
        limit,
        searchLocal,
        selectedTargetType,
        selectedTargetId,
        isUpdateListView,
        filterItemConditions,
        orderBy,
        searchConditions);
      setMsgSuccess(props.msgSuccesUpdateCustomers.successId);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
        props.resetMessageSuccess();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }, [props.msgSuccesUpdateCustomers])

  // useEffect(() => {
  //   if (props.customerEditData.has(customerEditCtrlId[0]) && (props.customerEditData.get(customerEditCtrlId[0]).action === CreateEditCustomerAction.CreateCustomerSuccess ||
  //   props.customerEditData.get(customerEditCtrlId[0]).action === CreateEditCustomerAction.UpdateCustomerSuccess
  //   )) {
  //     setTimeout(function () {
  //       reloadScreen();
  //     }, 50);
  //   }
  // }, [props.customerEditData])

  useEffect(() => {
    // set record check list.
    if(props.customerIdsDeleteSuccess || props.customerDeleteOutOfList) {
      tableListRef.current.changeRecordCheckList([]);
    }
  }, [props.customerIdsDeleteSuccess, props.customerDeleteOutOfList ])

  /**
   * Show toast message in timeout
   * @param msgSuccessParam
   */
  const checkBoxMesSuccess = (msgSuccessParam) => {
    if (msgSuccessParam && msgSuccessParam.successId !== SHOW_MESSAGE_SUCCESS.NONE) {
      if (msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.CREATE) {
        props.handleInitLocalMenu(true);
      } else if (msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.DELETE) {
        props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
      }
      setMsgSuccess(msgSuccessParam.successId);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
        props.resetMessageSuccess();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }

  /**
  * Reload list when integration
  * @param msgSuccessParam
  */
  const checkboxMsgSuccessChangeCustomer = (msgSuccessParam, screen: string) => {
    if (msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.UPDATE && screen === 'list' && isReloadCustomers) {
      setIsReloadCustomers(false);
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
    } else if (screen === 'create-edit' && (msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.UPDATE || msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.CREATE)) {
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
    } else if (screen === 'integration' && msgSuccessParam?.successId === SHOW_MESSAGE_SUCCESS.UPDATE) {
      tableListRef.current.changeRecordCheckList([]);
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);  
      setMsgSuccess(msgSuccessParam.successId);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
        props.resetMessageSuccess();
      }, TIMEOUT_TOAST_MESSAGE);
    } else if (screen === 'detail' && msgSuccessParam === 'INF_COM_0004') {
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
      props.getFieldInfoPersonals(CUSTOMER_LIST_ID, FIELD_BELONG.CUSTOMER, 1, FieldInfoType.Personal, selectedTargetType, selectedTargetId);
    } 
  }


  /**
   * To create or update Success display Toast message
   */
  useEffect(() => { checkBoxMesSuccess(props.msgSuccessList) }, [props.msgSuccessList]);
  useEffect(() => { checkBoxMesSuccess(props.msgSuccessCustomerSharedList) }, [props.msgSuccessCustomerSharedList]);
  useEffect(() => {
    checkboxMsgSuccessChangeCustomer(props.msgSuccessCustomerIntegration, 'integration')
  }, [props.msgSuccessCustomerIntegration]);
  useEffect(() => { checkBoxMesSuccess(props.msgSuccessCustomerControlSidebar) }, [props.msgSuccessCustomerControlSidebar]);
  useEffect(() => { checkBoxMesSuccess(props.msgSuccessListOperation) }, [props.msgSuccessListOperation]);

  // useEffect(() => {
  //   checkboxMsgSuccessChangeCustomer(props.customerEditData.has(customerEditCtrlId[0]) ? props.customerEditData.get(customerEditCtrlId[0]).successMessage : null, 'create-edit') 
  // }, [props.customerEditData]);
  useEffect(() => {checkboxMsgSuccessChangeCustomer(props.msgUpdateFieldInfoSuccess, 'detail') }, [props.msgUpdateFieldInfoSuccess]);
  useEffect(() => {checkboxMsgSuccessChangeCustomer(props.msgSuccessRefeshList, 'list') }, [props.msgSuccessRefeshList]);
  

  /**
   * Excute dirtycheck if have action
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, typeCancel?: any) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      action();
    } else {
      if (isChanged) {
        const partternType = (typeCancel && typeCancel === 'CANCEL') ? DIRTYCHECK_PARTTERN.PARTTERN2 : DIRTYCHECK_PARTTERN.PARTTERN1;
        await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType });
      } else {
        action();
      }
    }
  }

  /**
   * Open popup search
   */
  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      executeDirtyCheck(() => {
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setOpenPopupSearch(true);
        setSearchLocal("");
      });
    }
  }

  /**
   * Handle open modal create edit customer
   */
  const onOpenModalCustomer = (cusActionType, cusViewMode, cusId = null) => {
    if (!showCreateEditCustomerModal) {
      executeDirtyCheck(() => {
        setMsgErrorBox('');
        setShowCreateEditCustomerModal(true);
        setCustomerActionType(cusActionType);
        setCustomerViewMode(cusViewMode);
        // setCustomerId(customerId);
      });
    }
  }

  /**
   * Open detail customer after create customer success
   * @param param infomation 'customerId' will open and 'message' show dialog
   */
  const gotoCustomerDetail = (param) => {
    setCustomerSuccessMessage(param.message)
    setCustomerIdDetail(param.customerId);
    setIsOpenCustomerDetailNotFromList(true);
    setOpenPopupCustomerDetail(true);
  }

  /**
   * Open detail customer by itself
   * (parent customer/customer in tab of this customer)
   * @param nextCustomerId next customer will go to
   * @param prevCustomerId this customer push to prevCustomerIds
   */
  const handleOpenCustomerDetailByItself = (nextCustomerId, prevCustomerId) => {
    setCustomerIdDetail(nextCustomerId);
    const prev = _.concat(prevCustomerIds, prevCustomerId);
    setPrevCustomerIds(prev);
    setOpenPopupCustomerDetail(true);
  }

  /**
   * Open detail customer from customer list
   * @param paramId customerId will open detail customer
   * @param fieldId fieldId column in customer list
   */
  const onOpenPopupCustomerDetail = (paramId, fieldId) => {
    if (!openPopupCustomerDetail && fieldId !== null && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        setCustomerIdDetail(paramId);
        setOpenPopupCustomerDetail(!openPopupCustomerDetail);
      });
    }
  }

  /**
   * Open detail customer not from customer list
   * @param customerId customer will open not from list
   */
  const showCustomerDetailNotFromList = (customerId) => {
    setCustomerIdDetail(customerId);
    setIsOpenCustomerDetailNotFromList(true);
    setOpenPopupCustomerDetail(true);
  }

  /**
   * Close detail customer.
   * If have prevCustomerIds, open old detail from list.
   * If not have prevCustomerIds but this customer open not from list, back this screen.
   */
  const handleClosePopupCustomerDetail = (hasUpdated) => {
    setOpenFromOtherServices(false);
    setDisplayActivitiesTab(false);
    if (hasUpdated) {
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
    }
    setOpenPopupCustomerDetail(false);
    const prevCustomerIdsTmp = _.cloneDeep(prevCustomerIds)
    if (prevCustomerIdsTmp.length > 0) {
      setCustomerIdDetail(_.last(prevCustomerIdsTmp));
      const prev = _.dropRight(prevCustomerIdsTmp);
      setPrevCustomerIds(prev);
      setOpenPopupCustomerDetail(true);
    }
    if (prevCustomerIdsTmp.length === 0 && isOpenCustomerDetailNotFromList) {
      setIsOpenCustomerDetailNotFromList(false)
    }
  }

  const gotoEmployeeDetail = (param) => {
    setEmployeeIdDetail(param.employeeId);
    setOpenPopupEmployeeDetail(true);
  }

  useEffect(() => {
    if (screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (screenMoveInfo.fieldBelong === FIELD_BELONG.EMPLOYEE) {
        gotoEmployeeDetail({ employeeId: screenMoveInfo.objectId });
      } else {
        gotoCustomerDetail({ customerId: screenMoveInfo.objectId });
      }
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) && !openPopupCustomerDetail && !showCreateEditCustomerModal) {
      onOpenPopupSearch();
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD) && !openPopupCustomerDetail && !showCreateEditCustomerModal) {
      onOpenModalCustomer(CUSTOMER_ACTION_TYPES.CREATE, CUSTOMER_VIEW_MODES.EDITABLE);
      props.moveScreenReset();
    }
  }, [screenMoveInfo])

  const getListCustomerId = () => {
    const listCustomerId = [];
    customerList && customerList.map((customer) => {
      listCustomerId.push(customer.customer_id);
    });
    return listCustomerId;
  }

  const onOpenMapCustom = (event) => {
    setOpenMapCustom(event);
  }

  const onOpenModalNetworkCustomer = () => {
    if (!openModalNetworkCustomer && props.screenMode === ScreenMode.DISPLAY) {
      setOpenModalNetworkCustomer(true);
    }
  }

  // const closePopupCustomer = () => {
  //   setOpenModalNetworkCustomer(false);
  // }

  // const closeDepartmentPopup = () => {
  //   setOpenDepartmentPopup(false);
  //   setOpenModalNetworkCustomer(true);
  // }

  const showDetailScreen = (currentCustomerId, listCustomerId) => {
    return (
      <>
        {
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={currentCustomerId}
            listCustomerId={listCustomerId}
            onOpenModalCreateEditCustomer={onOpenModalCustomer}
            customerSuccessMessage={customerSuccessMessage}
            resetSuccessMessage={() => { setCustomerSuccessMessage(null) }}
            iconFunction={ICON_FUNCION_CUSTOMERS}
            handleOpenCustomerDetailByItself={handleOpenCustomerDetailByItself}
            toggleClosePopupCustomerDetail={handleClosePopupCustomerDetail}
            isOpenCustomerDetailNotFromList={isOpenCustomerDetailNotFromList}
            prevCustomerIds={prevCustomerIds}
            openFromOtherServices={openFromOtherServices}
            displayActivitiesTab={displayActivitiesTab}
          />
        }
      </>
    )
  }

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  const onOpenPopupDetail = (paramId, fieldId, popupType) => {
    if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER || popupType === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER) {
      if (!openPopupEmployeeDetail && fieldId !== null && props.screenMode === ScreenMode.DISPLAY) {
        executeDirtyCheck(() => {
          setOpenPopupEmployeeDetail(!openPopupEmployeeDetail);
          setEmployeeIdDetail(paramId);
          setMsgErrorBox('');
        });
      } else if (!openPopupEmployeeDetail && fieldId !== null && props.screenMode === ScreenMode.EDIT) {
        executeDirtyCheck(() => {
          setEmployeeIdDetail(paramId);
          setOpenPopupEmployeeDetail(!openPopupEmployeeDetail);
          props.changeScreenMode(false);
        });
      }
    } else if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT) {
      document.body.className = 'wrap-calendar';
      setDetailScheduleId(paramId);
      setOpenPopupDetailSchedule(true);
    } else if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT) {
      setModalId(paramId);
      setShowTaskDetails(true);
    }
  }

  const showDetailEmployee = (currentEmployeeId, listEmployeeId) => {
    return (
      <>
        {<PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          key={currentEmployeeId}
          showModal={true}
          employeeId={currentEmployeeId}
          listEmployeeId={listEmployeeId}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          employeeSuccessMessage={employeeSuccessMessage}
          resetSuccessMessage={() => { setEmployeeSuccessMessage(null) }}
        />
        }
      </>
    )
  }

  /**
   * Change mode display in screen
   */
  const onShowSwitchDisplay = () => {
    if (!showSwitcher) {
      executeDirtyCheck(() => {
        props.handleGetCustomFieldInfo();
        setShowSwitcher(true);
        setSaveEditValues([]);
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  }

  /**
   * Select when switch display
   * @param srcField
   * @param isSelected
   */
  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    tableListRef.current.handleChooseField(srcField, isSelected);
  }

  /**
   * Drag field to field , change position
   * @param fieldSrc
   * @param fieldTargetId
   */
  const onDragField = (fieldSrc, fieldTargetId) => {
    tableListRef.current.handleDragField(fieldSrc, fieldTargetId);
  }


  const getfileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }


  /**
   * Filter list on header table
   * @param filter
   * @param order
   */
  const onActionFilterOrder = (filter: [], order: []) => {
    setOffset(0);
    setFilterItemConditions(filter);
    setOrderBy(order);
    setSaveEditValues([]);
    props.handleGetInitializeListInfo(FIELD_BELONG.CUSTOMER);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, true, filter, order, searchConditions);
  }

  /**
   * Keep data update to update Customers
   * @param itemData
   * @param type
   * @param itemEditValue
   */
  const onUpdateFieldValue = (itemData, type, itemEditValue) => {
    if (type.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return;
    }
    const index = saveEditValues.findIndex(e => e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString());

    const itemEditValueCopy = _.cloneDeep(itemEditValue);

    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy };
    }
    // setIsDirty(isChangeInputEdit());
  }

  /**
   * Drag row data to list (sidebar)
   * @param sourceRow
   * @param targetList
   */
  const onDragRow = async (sourceRow, targetList) => {

    let messageWarningMove = StringUtils.translateSpecial('messages.WAR_CUS_0003', { 0: sourceRow.length, 1: targetList.listName });
    if (activeCardList.listId !== 0) {
      messageWarningMove = StringUtils.translateSpecial('messages.WAR_CUS_0004', { 0: sourceRow.length, 1: activeCardList.listName, 2: targetList.listName });
    }
    const result = await ConfirmDialog({
      title: (<>{translate('global.title.confirm')}</>),
      message: messageWarningMove,
      confirmText: translate('global.dialog-dirtycheck.parttern2.confirm'),
      confirmClass: "button-blue",
      cancelText: translate('global.dialog-dirtycheck.parttern2.cancel'),
      cancelClass: "button-cancel"
    });
    if (result) {
      const listCustomerId = [];
      sourceRow.map(item => {
        if (item.customerId) {
          listCustomerId.push(item.customerId);
        }
        if (item.customer_id) {
          listCustomerId.push(item.customer_id);
        }
      })
      if (activeCardList.listId !== 0) {
        props.handleMoveCustomersToOtherList(activeCardList.listId, targetList.listId, listCustomerId)
      } else {
        props.handleAddCustomersToList(targetList.listId, listCustomerId);
      }
    }
  }
  /**
   * Get data use text search in local
   */
  const enterSearchText = (localSearch) => {
    executeDirtyCheck(() => {
      setSearchLocal(localSearch);
      setOrderBy([]);
      setFilterItemConditions([]);
      setSearchConditions([]);
      setActiveCardList(
        { typeList: CUSTOMER_LIST_TYPE.ALL_LIST, listId: 0, isAutoList: false, customerListType: undefined, listName: null, participantType: null }
      );
      setOffset(0);
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      tableListRef.current && tableListRef.current.resetState();
      props.handleGetCustomersHasCondition(0, limit, localSearch, null, null, null, null, null, null);
    });
  }

  const onCloseCustomerModal = (param) => {
    setShowCreateEditCustomerModal(false);
    if (param) {
      props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
      gotoCustomerDetail(param);
    }
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.SEARCH) {
      onOpenPopupSearch();
    }
  }

  /**
   * on close popup seach
   * @param saveCondition
   */
  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      setSearchConditions(saveCondition);
    }
  }

  /**
   * Action seacrh data with field
   * @param condition
   */
  const handleSearchPopup = (condition) => {
    setActiveCardList(
      { typeList: CUSTOMER_LIST_TYPE.ALL_LIST, listId: 0, isAutoList: false, customerListType: undefined, listName: null, participantType: null }
    );
    setOpenPopupSearch(false);
    setSearchConditions(condition);
    setSearchLocal('');
    setOrderBy([]);
    setFilterItemConditions([]);
    setOffset(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    tableListRef.current && tableListRef.current.resetState();
    props.handleGetCustomersHasCondition(0, limit, null, 0, 0, false, [], [], condition);
  }

  /**
   * Change mode edit (view <=> edit)
   */
  const changeEditMode = (isEdit: boolean) => {
    if (!isEdit) {
      executeDirtyCheck(() => {
        setView(1);
        setMsgErrorBox('');
        setSaveEditValues([]);
        setShowSwitcher(false);
        // setIsDirty(true);
        props.changeScreenMode(isEdit)
      }, null, 'CANCEL');
    } else {
      setSaveEditValues([]);
      setShowSwitcher(false);
      props.changeScreenMode(isEdit)
    }
  }

  /**
   * Update customers
   */
  const updateCustomers = () => {
    setMsgErrorBox('');
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setMsgErrorBox(translate('messages.ERR_COM_0033', [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    }
    props.handleUpdateCustomers(saveEditValues, files);
  }

  /**
   * Get customers when next or previous page
   * @param offsetRecord
   * @param limitRecord
   */
  const nextPageChange = (offsetRecord, limitRecord) => {
    executeDirtyCheck(() => {
      setOffset(offsetRecord);
      setLimit(limitRecord);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleGetCustomersHasCondition(offsetRecord, limitRecord, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
    });
  }

  /**
   * Onclick one item in menu left
   * @param type
   * @param cardList
   */
  const actionActiveCardListd = (type, cardList, listViewConditions?) => {
    if (cardList.listId !== 0 && cardList.listId === activeCardList.listId && cardList.typeList === activeCardList.typeList) {
      return;
    }
    executeDirtyCheck(() => {
      let targetType = 0;
      switch (type) {
        case CUSTOMER_LIST_TYPE.ALL_LIST:
          targetType = SELECT_TARGET_TYPE.ALL_LIST;
          break;
        case CUSTOMER_LIST_TYPE.CUSTOMER_IN_CHARGE:
          targetType = SELECT_TARGET_TYPE.CUSTOMER_IN_CHARGE;
          break;
        case CUSTOMER_LIST_TYPE.MY_LIST:
          targetType = SELECT_TARGET_TYPE.MY_LIST
          break;
        case CUSTOMER_LIST_TYPE.SHARED_LIST:
          targetType = SELECT_TARGET_TYPE.SHARED_LIST
          break;
        case CUSTOMER_LIST_TYPE.FAVORITE_LIST:
          if (cardList.customerListType === 1) {
            targetType = SELECT_TARGET_TYPE.MY_LIST
          }
          if (cardList.customerListType === 2) {
            targetType = SELECT_TARGET_TYPE.SHARED_LIST
          }
          break;
        default:
          break;
      }
      setSelectedTargetType(targetType);
      if (cardList) {
        setSelectTargetId(cardList.listId);
      }
      tableListRef && tableListRef.current.changeTargetSidebar(targetType, cardList ? cardList.listId : 0);
      setActiveCardList({
        typeList: type,
        listId: cardList.listId,
        isAutoList: cardList.isAutoList,
        customerListType: cardList.customerListType,
        listName: cardList.listName,
        participantType: cardList.participantType
      });
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }

      let arrOrderby = [];
      if (listViewConditions && listViewConditions.orderBy) {
        arrOrderby = listViewConditions.orderBy
      }
      let defaultFilterConditions = [];
      let filters = [];
      if (listViewConditions && listViewConditions.filterConditions) {
        defaultFilterConditions = listViewConditions.filterConditions;
        filters = _.cloneDeep(defaultFilterConditions);
        defaultFilterConditions.forEach((e, idx) => {
          if (!isNullOrUndefined(e.fieldType)) {
            e.fieldType = parseInt(e.fieldType, 10);
            filters[idx].fieldType = parseInt(e.fieldType, 10);
            const fieldMap = props.fields.find(elm => elm.fieldId === e.fieldId);
            filters[idx].fieldLabel = fieldMap.fieldLabel;
          }
          if (_.isEmpty(e.fieldValue)) {
            e['isSearchBlank'] = true;
            filters[idx]['isSearchBlank'] = true;
          }
          delete e.searchValue;
        });
      }
      if (defaultFilterConditions) {
        setFilterItemConditions(filters);
      } else {
        setFilterItemConditions([]);
      }

      setSearchConditions([]);
      setSearchLocal('');
      setOffset(0);
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
      props.handleGetCustomersHasCondition(0, limit, '', targetType, cardList.listId, true, defaultFilterConditions, arrOrderby, []);
      if (cardList && cardList.isAutoList) {
        props.handleGetSearchConditionInfoList(cardList.listId);
      } else {
        setInfoSearchConditionList([]);
      }

      if (arrOrderby.length > 0 || defaultFilterConditions.length > 0) {
        tableListRef.current.setFilterListView(arrOrderby, defaultFilterConditions, props.fields);
      } else {
        tableListRef.current && tableListRef.current.resetState();
      }
    });
  }

  const getCustomerName = (id) => {
    let rs = '';
    const propsEmployeesList = props.customers && props.customers.customers;
    propsEmployeesList && propsEmployeesList.map(item => {
      if (item.customer_id === id) {
        rs = `${item.customer_name}`;
      }
    })
    return rs;
  }

  /**
   * Add list to favorite list
   * @param listId
   */
  const addListToFavouriteList = async (cardList) => {
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.dialog.title-add-list-to-favourite-list')}</>),
      message: StringUtils.translateSpecial('messages.WAR_CUS_0006', { 0: cardList.listName }),
      confirmText: translate('customers.top.dialog.title-add-list-to-favourite-list'),
      confirmClass: "button-blue",
      cancelText: translate('customers.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      const listId = _.get(cardList, 'listId')
      props.handleAddCustomersToFavouriteList(listId);
    }
  }

  /**
   * Remove list in favourite list
   * @param listId
   */
  const removeListInFavourite = async (list) => {
    // show common confirm dialog
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.dialog.title-remove-favourite-list')}</>),
      message: StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName: _.toString(list.listName) }),
      confirmText: translate('customers.top.dialog.confirm-remove-favourite-list'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      // in case did not check any record
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleRemoveFavouriteList(list.listId);
    }
  }

  /**
   * Delete list
   * @param listId
   */
  const deleteList = async (list) => {
    // show common confirm dialog
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.dialog.title-delete-list')}</>),
      message: StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName: list.listName }),
      confirmText: translate('customers.top.dialog.confirm-delete-list'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      // in case did not check any record
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleDeleteList(list.listId);
    }
  }

  /**
   * Add lits to auto list
   * @param listId
   */
  const addListToAutoList = async (list) => {
    if (list.listId === activeCardList.listId) {
      setIsReloadCustomers(true);
    }
    // show common confirm dialog
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.dialog.title-add-customers-to-auto-list')}</>),
      message: StringUtils.translateSpecial('messages.WAR_CUS_0002', { listName: list.listName }),
      confirmText: translate('customers.top.dialog.confirm-add-customers-to-auto-list'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      // in case did not check any record
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleAddCustomersToAutoList(list.listId);
    }
  }
  const onOpenAddToListPopup = () => {
    setOpenAddToListPopup(true);
  }
  const onOpenMoveToListPopup = () => {
    setOpenMoveToListPopup(true);
  }

  /**
   * Download info customers
   */
  const downloadCustomers = () => {
    const listCustomerDownload = props.recordCheckList.map((customer) => {
      return customer.customerId
    });
    const listOderBy = orderBy.map(order => {
      // return Object.assign({order.key : order})
      const objNew = {}
      objNew[`${order.key}`] = order.value;
      return objNew
    })
    props.handleDownloadCustomers(listCustomerDownload, listOderBy, selectedTargetType, selectedTargetId);
  }

  /**
   * Delete customer out of list
   * @param listId
   */
  const deleteOutOfList = async (listId) => {
    const listCustomerDelete = props.recordCheckList.map((customer) => {
      return customer.customerId
    });
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.dialog.title-delete-list')}</>),
      message: listCustomerDelete.length > 1
        ? StringUtils.translateSpecial('messages.WAR_COM_0002', { 0: listCustomerDelete.length })
        : StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName: getCustomerName(listCustomerDelete[0]) }),
      confirmText: translate('customers.top.dialog.confirm-delete-list'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      // in case did not check any record
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleDeleteCustomerOutOfList(listId, listCustomerDelete);
    }
  }


  /**
   * Handle open customer create or edit my list
   */
  const handleOpenCustomerMyListModal = (
    listMode,
    listId,
    isAutoList,
    listMembers
  ) => {
    if (!openCustomerMyList) {
      setMsgErrorBox('');
      setCustomerMyListData({
        listMode,
        listId,
        isAutoList,
        listMembers
      });
      setOpenCustomerMyList(true);
    }
  };

  /**
   * Handle close customer create or edit my list
   */
  const handleCloseCustomerMyListModal = (isSubmitSucess: boolean) => {
    setOpenCustomerMyList(false);
    setCustomerMyListData(defaultCustomerMyListData);
    if (isSubmitSucess) {
      props.handleGetSearchConditionInfoList(activeCardList.listId);
    }
  }

  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }


  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
   * Handle open customer create or edit shared list
   */
  const handleOpenCustomerSharedListModal = (
    listMode,
    listId,
    isOwnerList,
    isAutoList,
    listMembers
  ) => {
    if (!openCustomerSharedList) {
      setMsgErrorBox('');
      setCustomerSharedListData({
        listMode,
        listId,
        isOwnerList,
        isAutoList,
        listMembers
      })
      setOpenCustomerSharedList(true);
    }
  }

  /**
   * Handle close customer create or edit shared list
   */
  const handleCloseCustomerSharedListModal = (isSubmitSucess: boolean) => {
    setOpenCustomerSharedList(false);
    setCustomerSharedListData(defaultCustomerSharedListData);
    if (isSubmitSucess) {
      props.handleGetSearchConditionInfoList(activeCardList.listId);
    }
  }

  const onReceiveMessage = (ev) => {
    if (ev && ev.data && ev.data.type === FSActionTypeScreen.CreatUpdateSuccess) {
      handleCloseCustomerSharedListModal(true);
    }
    if ((StringUtils.tryGetAttribute(ev, "data.type") === FSActionTypeScreen.CloseWindow && StringUtils.tryGetAttribute(ev, "data.screen") === 'customerDetail')
      || StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      reloadScreen();
    }
  }
  useEventListener('message', onReceiveMessage);

  const showDeleteConfirmDialog = (msg) => {
    return ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: msg,
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
  }
  /**
   * Get info relation list customer
   */
  const getRelationCustomers = async () => {
    if (props.recordCheckList.length > 0) {
      let msg = '';
      if (props.recordCheckList.length === 1) {
        const itemName = getCustomerName(props.recordCheckList[0].customerId);
        msg = StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName });
      }
      if (props.recordCheckList.length > 1) {
        msg = StringUtils.translateSpecial('messages.WAR_COM_0002', { 0: props.recordCheckList.length });
      }
      const result = await showDeleteConfirmDialog(msg);
      if (result) {
        // get data relation
        const arrCustomerId = props.recordCheckList.map((item) => {
          return item.customerId
        })
        props.handleCountRelationCustomers(arrCustomerId);
      }
    }
  }

  /**
   * handle action open popup setting
   */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true);
  }

  /**
* handle close popup settings
*/
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

  /**
   * Get error message code from API
   * @param errorCode
   */
  const getErrorMessage = (errorCode, param?) => {
    if (!isNullOrUndefined(errorCode)) {
      return translate('messages.' + errorCode);
    }
    if (errorCode === 'ERR_EMP_0006' || errorCode === 'ERR_EMP_0007') {
      return translate(`messages.${errorCode}`);
    }
    if (param) {
      return translate('messages.' + errorCode, param);
    } else {
      return translate('messages.' + errorCode);
    }
  }

  // const renderMessage = () => {
  //   if (props.localMenuMsg) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={props.localMenuMsg} />
  //     )
  //   }
  //   if (props.addFavouriteMsg && props.addFavouriteMsg[0]) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={getErrorMessage(props.addFavouriteMsg[0].errorCode)} />
  //     )
  //   }
  //   if (props.removeFavouriteMsg && props.removeFavouriteMsg[0]) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={getErrorMessage(props.removeFavouriteMsg[0].errorCode)} />
  //     )
  //   }
  //   if (props.moveToCustomertMsg && props.moveToCustomertMsg[0]) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={getErrorMessage(props.moveToCustomertMsg[0].errorCode)} />
  //     )
  //   }
  //   if (props.downloadCustomersMsg && props.downloadCustomersMsg[0]) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={getErrorMessage(props.downloadCustomersMsg[0].errorCode)} />
  //     )
  //   }
  //   if (props.sidebarErrorMessage) {
  //     return (
  //       <BoxMessage messageType={MessageType.Error}
  //         message={props.sidebarErrorMessage} />
  //     )
  //   }
  //   if (props.messageDeleteSuccess !== null) {
  //     return (
  //       <BoxMessage messageType={MessageType.Success}
  //         message={getErrorMessage(props.messageDeleteSuccess)} />
  //     )
  //   }
  // }

  const getParam = () => {
    if (props.errorItems && props.errorItems[0] && props.errorItems[0].errorCode === 'ERR_EMP_0037') {
      // TODO More option
      return null;
    }
    return null;
  }

  // msg error code
  useEffect(() => {
    setMsgErrorBox('');
    if (errorItems && errorItems[0]) {
      setMsgErrorBox(getErrorMessage(errorItems[0].errorCode, getParam()));
    } else if (_.isNil(props.responseStatus) || props.responseStatus === 200) {
      setMsgErrorBox('');
    } else if (props.responseStatus !== 200) {
      setMsgErrorBox(translate('messages.ERR_COM_0001'));
    }

  }, [errorItems, props.responseStatus])


  const renderToastMessage = () => {
    if (msgSuccess !== SHOW_MESSAGE_SUCCESS.NONE) {
      let msgInfoSuccess = '';
      if (msgSuccess === SHOW_MESSAGE_SUCCESS.CREATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0003")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.UPDATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0004")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.DELETE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0005")}`;
      }
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage messageType={MessageType.Success}
            message={msgInfoSuccess}
            styleClassMessage="block-feedback block-feedback-green text-left"
            className=" " />
        </div>
      )
    }
  }

  const parseValidateError = () => {
    const msgError = [];
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || customerList.length <= 0) {
      return msgError;
    }
    let count = 0;
    for (let i = 0; i < errorItems.length; i++) {
      const rowIndex = customerList.findIndex(e => e['customer_id'].toString() === (errorItems[i].rowId && errorItems[i].rowId.toString()));
      const fieldIndex = fields.findIndex(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item || e.fieldName === errorItems[i].item);
      if (rowIndex < 0 || fieldIndex < 0) {
        // continue;
      }
      count++;
    }
    let msg = translate('messages.ERR_COM_0052', { count });
    if (props.errorItems && props.errorItems[0] && props.errorItems[0].errorCode && props.errorItems[0].errorCode === 'ERR_COM_0050') {
      msg = translate('messages.ERR_COM_0050');
    }
    msgError.push({ msg })
    return msgError;
  }

  const validateMsg = parseValidateError();

  const renderErrorBox = () => {
    if (validateMsg.length > 0) {
      return <BoxMessage messageType={MessageType.Error}
        messages={_.map(validateMsg, 'msg')}
      />
    }
    return (
      <BoxMessage messageType={MessageType.Error} message={msgErrorBox} />
    )
  }
  /**
   * Open Customer Integration Modal
   */
  const handleOpenCustomerIntegration = () => {
    if (props.recordCheckList && props.recordCheckList.length >= 2) {
      setOpenCustomerIntegration(true);
    }
  }

  /**
   * Close Customer Integration Modal
   * @param reloadFlag
   */
  const handleCloseCustomerIntegration = () => {
    setOpenCustomerIntegration(false);
    // props.handleGetCustomerList(offset, limit);
  }

  const customFieldsInfoData = (field, type) => {
    return customFieldsInfo(field, type, customerLayout)
  }

  const handleClickPosition = (e) => {
    setHeightPosition(document.body.clientHeight - e.clientY);
  }

  const onClickOverFlowMenu = (idAction, param) => {
    setModalId(param.customer_id);
    setModalName(param.customer_name);
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_BUSINESS_CARD:
        setOpenCreateBusinessCard(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.HISTORY_ACTIVITIES: {
        setOpenFromOtherServices(true);
        setDisplayActivitiesTab(true)
        showCustomerDetailNotFromList(param.customer_id)
        break;
      }
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_ACTIVITIES:
        setOpenModalCreateActivity(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_SCHEDULES: {
        setOpenModalCreateCalendar(true);
        setScheduleData({
          customer: {
            customerId: param.customer_id,
            customerName: param.customer_name,
          }
        });
        break;
      }
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_TASK:
        setOpenModalTaskCreate(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.POST_DATA:
        showCustomerDetailNotFromList(param.customer_id)
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_CUSTOMER_CHILD:
        setOpenModalSubCustomer(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.CREATE_MAIL: {
        if (customerModalEmail) {
          window.location.href = `mailto:${customerModalEmail}`;
        }
        break;
      }
      default:
        break;
    }
  }


  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const handleFilterTooltip = (e, rowData) => {
    props.handleGetCustomerHistoryAcivities({ customerId: rowData.customer_id });
    if (rowData) {
      let email = null;
      const dataJson = R.compose(
        R.pipe(JSON.parse),
        R.path(['customer_data_string'])
      )(rowData);
      Object.keys(dataJson).forEach(key => {
        if (key.toString().startsWith('email')) {
          email = dataJson[key];
        }
      });
      if (email && email.length > 0) {
        setCustomerModalEmail(email);
      } else {
        setCustomerModalEmail(null);
      }

    }
    setOpenOverFlow(rowData.customer_id);
    handleClickPosition(e);
    e.stopPropagation();
  }

  useEffect(() => {
    if (isShowRelationCustomers) {
      document.body.className = 'wrap-customer modal-open';
    }
  }, [isShowRelationCustomers])

  const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_DATE ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_DATE) {
      return renderItemNotEdit(fieldColumn, rowData, props.tenant, onOpenPopupDetail);
    }

    if (props.screenMode === ScreenMode.DISPLAY) {
      if (_.isArray(fieldColumn)) {
        const businessMainName = fieldColumn.find(item => item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID);
        if (businessMainName && businessMainName.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
          return <div className="text-ellipsis text-over">
            <Popover x={-20} y={50}>
              {
                R.path(['business', 'businessMainName'], rowData) + translate("customers.list.dot") + R.path(['business', 'businessSubname'], rowData)
              }
            </Popover>
          </div>;
        }
      }
      if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT) {
        return <div className="text-ellipsis text-over">
          <Popover x={-20} y={25}>
            {
              R.path(['customer_parent', 'pathTreeId'], rowData) && R.path(['customer_parent', 'pathTreeId'], rowData).map((item, idx) => {
                const length = R.path(['customer_parent', 'pathTreeId'], rowData).length;
                return <a onClick={() => onOpenPopupCustomerDetail(R.path(['customer_parent', 'pathTreeId', idx], rowData), fieldColumn.fieldId)} key={idx}>
                  {(idx === 1 && idx !== length) ? translate('commonCharacter.left-parenthesis') : ''}
                  {R.path(['customer_parent', 'pathTreeName', idx], rowData)}
                  {(idx > 0 && idx < length - 1) ? translate('commonCharacter.minus') : ''}
                  {(idx === length - 1 && idx !== 0) ? translate('commonCharacter.right-parenthesis') : ''}
                </a>;
              })
            }
          </Popover>
        </div>;
      }

      if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME) {
        const activeClass = (activeIcon || openOverFlow === rowData.customer_id) ? 'active' : '';
        return <div className='overflow-menu text-over' onMouseOut={(e) => { setActiveIcon(false) }}>
          <a className="d-inline-block text-ellipsis max-calc66 w-auto" onClick={() => onOpenPopupCustomerDetail(rowData.customer_id, fieldColumn.fieldId)}>
            <Popover x={-20} y={25}>
              {rowData.customer_name ? rowData.customer_name : ''}
            </Popover>
          </a>
          <a title="" className="icon-small-primary icon-link-small overflow-menu-item" href={`${window.location.origin}/${props.tenant}/customer-detail/${rowData.customer_id}`} target="_blank" rel="noopener noreferrer"></a>
          <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`} onMouseLeave={(e) => setOpenOverFlow(null)}>
            <a id={rowData.customer_id} title="" className={`icon-small-primary icon-sort-small ${activeClass}`}
              onMouseOver={(e) => setActiveIcon(true)}
              onClick={(e) => handleFilterTooltip(e, rowData)}
              onMouseOut={(e) => e.stopPropagation()}>
            </a>
            {openOverFlow === rowData.customer_id &&
              <OverFlowMenu
                param={rowData}
                setOpenOverFlow={setOpenOverFlow}
                fieldBelong={FIELD_BELONG.CUSTOMER}
                onClickOverFlowMenu={onClickOverFlowMenu}
                showTooltipActivity={props.historyActivities}
                showToolTipMail={customerModalEmail !== null}
              />}
          </div>
        </div>
      }
      if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO) {
        const photoFilePath = getPhotoFilePath(fieldColumn.fieldName)
        const imgSrc = R.path([fieldColumn.fieldName, photoFilePath], rowData);
        return (
          <div className="text-over">
            {imgSrc ? <a className="image_table d-inline-block" title="" ><img className="no-image" src={imgSrc} alt="" title="" /></a> :
              <a className="image_table no_image_table d-inline-block" title="" ><img className="no-image" src="../../content/images/noimage.png" alt="" title="" /></a>}
          </div>
        )
      }
    } else {
      return <SpecialEditList
        valueData={rowData}
        itemData={fieldColumn}
        extensionsData={getExtensionsCustomer(customerLayout)}
        updateStateField={onUpdateFieldValue}
        errorInfos={props.errorItems}
        nameKey={nameKey}
        updateFiles={updateFiles}
      />
    }
  }


  const resetConditionSearch = () => {
    setConDisplaySearchDetail(false);
    setSearchConditions([]);
    setFilterItemConditions([]);
    setInfoSearchConditionList([]);
    props.handleGetCustomersHasCondition(offset, limit, null, null, null, null, null, null, null);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef.current && tableListRef.current.setFilterListView([], [], customFields);
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  const onClosePopupCreate = (typePopup, param) => {
    setModalId(null);
    setModalName(null);
    switch (typePopup) {
      case "business-card": {
        setOpenCreateBusinessCard(false);
        break;
      }
      case "activity": {
        setOpenModalCreateActivity(false);
        break;
      }
      case "calendar": {
        setOpenModalCreateCalendar(false);
        break;
      }
      case "task": {
        setOpenModalTaskCreate(false);
        break;
      }
      case "sub-customer": {
        setOpenModalSubCustomer(false);
        if (param) {
          props.handleGetCustomersHasCondition(0, limit, searchLocal, selectedTargetType, selectedTargetId, isUpdateListView, filterItemConditions, orderBy, searchConditions);
        }
        break;
      }
      case "task-detail": {
        setShowTaskDetails(false);
        break;
      }
      default:
        break;
    }
  }

  const renderModalToolTip = () => {
    return (
      <>
        {openModalCreateActivity && <ActivityModalForm
          customerId={modalId}
          activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
          canBack={true}
          onCloseModalActivity={() => onClosePopupCreate('activity', null)} />}
        {openCreateBusinessCard && <CreateEditBusinessCard
          customerId={modalId}
          customerName={modalName}
          isOpenedFromModal={true}
          closePopup={() => onClosePopupCreate('business-card', null)}
          iconFunction="ic-sidebar-business-card.svg"
          businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE} />}
        {openModalTaskCreate && <ModalCreateEditTask
          toggleCloseModalTask={() => onClosePopupCreate('task', null)}
          iconFunction="ic-task-brown.svg"
          taskActionType={TASK_ACTION_TYPES.CREATE}
          taskId={null}
          taskViewMode={TASK_VIEW_MODES.EDITABLE}
          canBack={true}
          customerId={modalId}
        />}
        {openModalCreateCalendar && <CreateEditSchedule
          onClosePopup={() => onClosePopupCreate('calendar', null)}
          scheduleDataParam={scheduleData}
        />}
        {openModalSubCustomer && <CreateEditCustomerModal
          id={customerEditCtrlId[0]}
          toggleCloseModalCustomer={(param) => onClosePopupCreate('sub-customer', param)}
          customerActionType={customerActionType}
          customerViewMode={customerViewMode}
          isOpenedFromModal={true}
          parent={{ parentId: modalId, parentName: modalName }}
        />}
      </>
    );
  }

  const renderModalTaskDetail = () => {
    if (showTaskDetails) {
      return <DetailTaskModal
        taskId={modalId}
        canBack={true}
        toggleCloseModalTaskDetail={() => onClosePopupCreate('task-detail', null)} />
    }
  }

  const customFieldValue = (rowData, fieldColumn, mode) => {
  }
  return (
    <>
      <div className="control-esr page-customer resize-content">
        <CustomerControlTop
          toggleOpenMapCustom={onOpenMapCustom}
          toggleOpenModalNetworkCustomer={onOpenModalNetworkCustomer}
          isShowMap={openMapCustom}
          toggleOpenPopupSearch={onOpenPopupSearch}
          modeDisplay={props.screenMode}
          toggleSwitchDisplay={onShowSwitchDisplay}
          textSearch={searchLocal}
          enterSearchText={enterSearchText}
          toggleSwitchEditMode={changeEditMode}
          toggleUpdateInEditMode={updateCustomers}
          activeCardList={activeCardList}
          removeListInFavourite={removeListInFavourite}
          deleteList={deleteList}
          addListToFavouriteList={addListToFavouriteList}
          addListToAutoList={addListToAutoList}
          downloadCustomers={downloadCustomers}
          deleteOutOfList={deleteOutOfList}
          deleteCustomers={getRelationCustomers}
          searchMode={searchMode}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={resetConditionSearch}
          favouriteList={_.get(props.localMenuData, 'favouriteList')}
          handleOpenCustomerIntegration={handleOpenCustomerIntegration}
          toggleOpenAddToListPopup={onOpenAddToListPopup}
          toggleOpenMoveToListPopup={onOpenMoveToListPopup}
          toggleOpenCustomerMyListModal={handleOpenCustomerMyListModal}
          toggleOpenCustomerSharedListModal={handleOpenCustomerSharedListModal}
          toggleOpenPopupSetting={handleOpenPopupSetting}
          toggleOpenModalCreateCustomer={onOpenModalCustomer}
          toggleOpenHelpPopup={handleOpenPopupHelp}
          isDisableEdit={_.isEmpty(customerList)}
        />
        <div className="wrap-control-esr style-3">
          <div className="esr-content">
            <CustomerControlSidebar
              ref={sidebarRef}
              toggleOpenAddEditMyListModal={handleOpenCustomerMyListModal}
              actionActiveCardList={actionActiveCardListd}
              activeCardList={activeCardList}
              openListModal={handleOpenCustomerSharedListModal}
              initializeListInfo={props.initializeListInfo}
              handleGetInitializeListInfo={() => props.handleGetInitializeListInfo(FIELD_BELONG.CUSTOMER)}
              addListToFavouriteList={addListToFavouriteList}
              removeListInFavourite={removeListInFavourite}
              deleteList={deleteList}
              addListToAutoList={addListToAutoList}
            />
            <div className={openMapCustom ? "esr-content-body esr-content-body2 col-lg-5" : "esr-content-body esr-content-body2"}>
              <div className="esr-content-body-main" id={formId} >
                <div className="pagination-top d-block">
                  <div className="text-left">
                    {msgErrorBox && renderErrorBox()}
                    {/* {(props.actionType === CustomerAction.Error || ((props.errorMessage || validateMsg.length > 0) && props.actionType !== CustomerAction.Request))
                      && <BoxMessage messageType={MessageType.Error}
                        messages={_.map(validateMsg, 'msg')}
                      />
                    } */}
                  </div>
                  {/* {renderDepartmentInfo()} */}
                  <div>
                    <DynamicDisplayConditionList
                      conditions={searchConditions}
                      filters={filterItemConditions}
                      searchMode={searchMode}
                      siderbarActiveId={activeCardList.listId}
                      infoSearchConditionList={infoSearchConditionList}
                      layoutData={customerLayout}
                      fieldBelong={FIELD_BELONG.CUSTOMER}
                    />
                    {fieldInfos && customers && customers.totalRecords > 0 &&
                      <PaginationList offset={offset} limit={limit} totalRecords={customers.totalRecords} onPageChange={nextPageChange} />
                    }
                  </div>
                </div>
                {/* {renderMessage()} */}
                {fieldInfos && customers &&
                  <DynamicList ref={tableListRef}
                    id={CUSTOMER_LIST_ID}
                    records={customerList} mode={props.screenMode}
                    totalRecords={customers.totalRecords}
                    checkboxFirstColumn={true} keyRecordId={"customerId"}
                    belong={FIELD_BELONG.CUSTOMER}
                    fieldInfoType={FieldInfoType.Personal}
                    extensionsData={getExtensionsCustomer(customerLayout)}
                    errorRecords={errorItems}
                    onActionFilterOrder={onActionFilterOrder}
                    onUpdateFieldValue={onUpdateFieldValue}
                    customContentField={customContentField}
                    getCustomFieldValue={customFieldValue}
                    getCustomFieldInfo={customFieldsInfoData}
                    customHeaderField={customHeaderField}
                    onDragRow={onDragRow}
                    fieldNameExtension="customer_data"
                    // sidebarCurrentId={activeCardList.listId}
                    tableClass={"table-list table-customer table-drop-down"}
                    // onClickCell={onOpenPopupCustomerDetail}
                    updateFiles={updateFiles}
                    targetType={selectedTargetType}
                    targetId={selectedTargetId}
                    typeMsgEmpty={customers && customers.typeMsgEmpty}
                  />
                }
                {showCreateEditCustomerModal &&
                  <CreateEditCustomerModal
                    id={customerEditCtrlId[0]}
                    toggleCloseModalCustomer={onCloseCustomerModal}
                    customerActionType={customerActionType}
                    customerViewMode={customerViewMode} />}
              </div>
            </div>
            {showSwitcher &&
              <SwitchFieldPanel
                dataSource={customFields}
                dataTarget={fields}
                onCloseSwitchDisplay={() => setShowSwitcher(false)}
                onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
                onDragField={onDragField}
                fieldBelong={FIELD_BELONG.CUSTOMER}
                isAdmin={isAdmin}
                dismissDialog={dismissDialog}
              />}
            {renderToastMessage()}
            {openMapCustom && <CustomerMap customerListResult={customerListResult} />}
          </div>
          {renderModalToolTip()}
          {openPopupCustomerDetail && showDetailScreen(customerIdDetail, getListCustomerId())}
          {openPopupEmployeeDetail && showDetailEmployee(employeeIdDetail, openPopupEmployeeDetail ? [customerIdDetail] : [])}
          {openPopupSearch &&
            <PopupFieldsSearch
              iconFunction="ic-sidebar-customer.svg"
              fieldBelong={FIELD_BELONG.CUSTOMER}
              conditionSearch={searchConditions}
              onCloseFieldsSearch={onClosePopupSearch}
              onActionSearch={handleSearchPopup}
              conDisplaySearchDetail={conDisplaySearchDetail}
              setConDisplaySearchDetail={setConDisplaySearchDetail}
              layoutData={customerLayout}
              selectedTargetType={selectedTargetType}
              selectedTargetId={selectedTargetId}
              fieldNameExtension="customer_data"
            />
          }
          {openCustomerMyList && customerMyListData &&
            <CustomerMySharedListModal
              iconFunction={ICON_FUNCION_CUSTOMERS}
              listMode={customerMyListData.listMode}
              listId={customerMyListData.listId}
              isAutoList={customerMyListData.isAutoList}
              listMembers={customerMyListData.listMembers}
              customerLayout={customerLayout}
              handleCloseCustomerMySharedListModal={handleCloseCustomerMyListModal}
              listType={GROUP_TYPE.MY}
              labelTranslate={'customer-my-list-modal'}
            />
          }
          {openCustomerSharedList && customerSharedListData &&
            <CustomerMySharedListModal
              iconFunction={ICON_FUNCION_CUSTOMERS}
              listMode={customerSharedListData.listMode}
              listId={customerSharedListData.listId}
              isAutoList={customerSharedListData.isAutoList}
              listMembers={customerSharedListData.listMembers}
              customerLayout={customerLayout}
              handleCloseCustomerMySharedListModal={handleCloseCustomerSharedListModal}
              listType={GROUP_TYPE.SHARED}
              labelTranslate={'customer-shared-list-modal'}
            />
          }
          {openMoveToListPopup && <MoveToList
            iconFunction={ICON_FUNCION_CUSTOMERS}
            customerIds={props.recordCheckList.map(item => item.customerId)}
            sourceListId={activeCardList.listId}
            closeMoveToListPopup={() => setOpenMoveToListPopup(false)}
            reloadCustomerList={() => { nextPageChange(offset, limit) }} />
          }
          {/* creatDepartment employee */}
          {/* {openDepartmentPopup &&
                    <DepartmentRegistEdit
                        isRegist={isRegistDepartment}
                        departmentId={isRegistDepartment ? null : departmentIdSelected}
                        toggleClosePopupDepartmentRegistEdit={closeDepartmentPopup} />
                } */}

        </div>
        {/* <CustomerCard /> */}
        {/* mode */}
        <GlobalControlRight />
        {openAddToListPopup && <AddToList
          iconFunction={ICON_FUNCION_CUSTOMERS}
          customerIds={props.recordCheckList.map(item => item.customerId)}
          closeAddToListPopup={() => setOpenAddToListPopup(false)}
          reloadCustomerList={() => { nextPageChange(offset, limit) }} />
        }
        <BrowserDirtyCheck isDirty={isChanged && props.screenMode === ScreenMode.EDIT} />
        {isShowRelationCustomers && !props.errorCountRelation && props.relationCustomerData &&
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} autoFocus={true} zIndex="auto">
            <PopupDeleteCustomer
              setShowRelationCustomers={setShowRelationCustomers}
              customerList={customerList}
              deleteCustomers={deleteCustomers}
            />
          </Modal>}
        {openCustomerIntegration && (
          <CustomerIntegrationModal
            iconFunction={ICON_FUNCION_CUSTOMERS}
            handleCloseCusIntegration={handleCloseCustomerIntegration}
            customerIds={props.recordCheckList.map(customer => {
              return customer.customerId;
            })}
            showCustomerDetail={showCustomerDetailNotFromList}
          />
        )}
        <div className="wrap-calendar">
          {openPopupDetailSchedule &&
            <CalendarDetail
              detailId={detailScheduleId}
              onClosed={() => setOpenPopupDetailSchedule(false)}
            />}
          {renderModalTaskDetail()}
        </div>
        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.customer} dismissDialog={dismissDialogHelp} />}

    </>
  )
}

const mapStateToProps = ({
  customerList,
  dynamicList,
  customerControlSidebar,
  customerDetail,
  applicationProfile,
  customerMySharedListState,
  customerModal,
  screenMoveState,
  listOperation,
  authentication,
  dataModalSchedule
}: IRootState) => ({
  fieldInfos: dynamicList.data.has(CUSTOMER_LIST_ID) ? dynamicList.data.get(CUSTOMER_LIST_ID).fieldInfos : {},
  customFieldInfos: customerList.customFieldInfos,
  customers: customerList.customers,
  actionType: customerList.action,
  recordCheckList: dynamicList.data.has(CUSTOMER_LIST_ID) ? dynamicList.data.get(CUSTOMER_LIST_ID).recordCheckList : [],
  errorMessage: customerList.errorMessage,
  errorItems: customerList.errorItems,
  responseStatus: customerList.responseStatus,
  sidebarErrorMessage: customerControlSidebar.errorMessage,
  localMenuMsg: customerControlSidebar.localMenuMsg,
  screenMode: customerList.screenMode,
  downloadCustomersMsg: customerList.downloadCustomersMsg,
  moveToCustomertMsg: customerList.moveToCustomertMsg,
  addFavouriteMsg: customerList.addFavouriteMsg,
  removeFavouriteMsg: customerList.removeFavouriteMsg,
  messageDeleteSuccess: customerDetail.messageDeleteSuccess,
  localMenuData: customerControlSidebar.localMenuData,
  errorCountRelation: customerList.errorCountRelation,
  customerIdsDeleteSuccess: customerList.customerIdsDeleteSuccess,
  customerDeleteFails: customerList.customerDeleteFails,
  customerListIdDelete: customerList.customerListIdDelete,
  customerDeleteOutOfList: customerList.customerDeleteOutOfList,
  listIdAddToAutoList: customerControlSidebar.listIdAddToAutoList,
  initializeListInfo: customerControlSidebar.initializeListInfo,
  fields: customerControlSidebar.fields,
  removeFavouriteCustomerId: customerList.removeFavouriteCustomerId,
  addFavouriteCustomerId: customerList.addFavouriteCustomerId,
  deleteCustomersId: customerList.deleteCustomerId,
  moveToCustomerId: customerList.moveToCustomerId,
  relationCustomerData: customerList.relationCustomerData,
  tenant: applicationProfile.tenant,
  customerLayout: customerList.customerLayout,
  msgSuccessList: customerList.msgSuccess,
  msgSuccessCustomerSharedList: customerMySharedListState.msgSuccess,
  searchConditionsParam: customerMySharedListState.searchConditionsParam,
  msgSuccessCustomerIntegration: customerModal.msgSuccess,
  msgSuccessCustomerControlSidebar: customerControlSidebar.msgSuccess,
  msgSuccessListOperation: listOperation.msgSuccess,
  // createEditCustomerAction: customerInfo.action,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  infoSearchConditionList: customerList.infoSearchConditionList,
  msgSuccesUpdateCustomers: customerList.msgSuccesUpdateCustomers,
  authorities: authentication.account.authorities,
  customersMsgGetSuccess: customerList.customersMsgGetSuccess,
  historyActivities: customerList.historyActivities,
  msgRemoveFavouriteList: customerList.msgRemoveFavouriteList,
  modalDetail: dataModalSchedule.modalDetailCalendar,
  // msgSuccessCreateUpdateCustomer: customerInfo.successMessage,
  msgUpdateFieldInfoSuccess: customerDetail.messageUpdateCustomFieldInfoSuccess,
  msgSuccessRefeshList: customerControlSidebar.msgSuccess,
  customerIdIntegrated: customerModal.customerId
});

const mapDispatchToProps = {
  reset,
  resetList,
  changeScreenMode,
  handleGetCustomerList,
  handleGetCustomersHasCondition,
  handleGetCustomFieldInfo,
  handleRemoveFavouriteList,
  handleDeleteList,
  handleAddCustomersToAutoList,
  handleDownloadCustomers,
  handleDeleteCustomerOutOfList,
  handleAddCustomersToFavouriteList,
  handleMoveCustomersToOtherList,
  handleCountRelationCustomers,
  handleDeleteCustomers,
  handleUpdateCustomers,
  handleInitLocalMenu,
  handleGetCustomerLayout,
  getFieldInfoPersonals,
  resetMessageSuccess,
  handleGetInitializeListInfo,
  handleAddCustomersToList,
  moveScreenReset,
  handleGetSearchConditionInfoList,
  handleGetCustomerHistoryAcivities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerList);
