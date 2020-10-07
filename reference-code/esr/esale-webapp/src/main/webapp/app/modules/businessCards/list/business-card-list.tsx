
import { FIELD_BELONG, ScreenMode, TIMEOUT_TOAST_MESSAGE, AUTHORITIES, ControlType, MAXIMUM_FILE_UPLOAD_MB } from "app/config/constants";
import {
  BUSINESS_CARD_DEF,
  BUSINESS_CARD_LIST_ID,
  FILTER_MODE,
  MODE_SEARCH_LIST,
  SEARCH_MODE,
  ICON_BAR_BUSINESSCARDS,
  MY_LIST_MODES,
  SHARE_LISTS_MODES,
  SHOW_MESSAGE,
  TYPE_LIST,
  BUSINESS_CARD_ACTION_TYPES,
  BUSINESS_CARD_VIEW_MODES,
  BUSINESS_SPECIAL_FIELD_NAMES,
  EDIT_SPECIAL_ITEM
} from "app/modules/businessCards/constants";
import { GROUP_TYPE } from 'app/shared/layout/dynamic-form/group/constants';
import { FieldInfoType, DEFINE_FIELD_TYPE, OVER_FLOW_MENU_TYPE } from "app/shared/layout/dynamic-form/constants";
import BusinessCardControlSidebar from "app/modules/businessCards/control/business-card-control-sidebar";
import BusinessCardControlTop from "app/modules/businessCards/control/business-card-control-top";
import BusinessCardDisplayCondition from "app/modules/businessCards/control/business-card-display-condition";
import ConfirmDialogCustom from 'app/modules/products/control/popup/dialog-custom/confirm-dialog';
import useEventListener from 'app/shared/util/use-event-listener';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import DynamicList from "app/shared/layout/dynamic-form/list/dynamic-list";
import SwitchFieldPanel from "app/shared/layout/dynamic-form/switch-display/switch-field-panel";
import PaginationList from 'app/shared/layout/paging/pagination-list';
import { IRootState } from 'app/shared/reducers';
import { RECORD_PER_PAGE_OPTIONS, } from 'app/shared/util/pagination.constants';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { RouteComponentProps } from 'react-router-dom';
import { Modal } from 'reactstrap';
import { isNullOrUndefined } from "util";
import BusinessCardDetail from "../business-card-detail/business-card-detail";
import BusinessCardListView from '../control/business-card-list-view';
import CreateEditBusinessCard from '../create-edit-business-card/create-edit-business-card';
import PopupMoveList from '../move-list/move-list';
import MergeBusinessCard from "../popup-merge-business-cards/merge-business-cards";
import BusinessCardMySharedListModal from 'app/modules/businessCards/my-shared-list/business-card-my-shared-list-modal';

// import ModalSharedList from '../shared-list/modal-shared-list';
// import AddEditMyBusinessCardModal from "app/modules/businessCards/my-list/add-edit-my-list-modal";
import PopupCreateShareList from './popup/popup-create-share-list';
import PopupCreateMyList from './popup/popup-create-my-list';

import {
  getSearchConditionInfoList,
  handleGetInitializeListInfo,
  changeScreenMode,
  getCustomFieldsInfo,
  handleGetBusinessCardList,
  handleInitBusinessCard,
  handleSearchBusinessCard,
  handleSearchBusinessCardView,
  handleUpdateBusinessCards,
  reset,
  handleDragDropBusinessCard,
  resetMessageList,
  handleUpdateBusinessCardsList,
  handleResetScreen
} from './business-card-list.reducer';
import PopupAddCardsToList from './popup/popup-add-cards-to-list';
import { handleRecordCheckItem, getFieldInfoPersonals } from '../../../shared/layout/dynamic-form/list/dynamic-list.reducer';
import { BusinessCardsAction } from './business-card-list.reducer';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import StringUtils, { decodeUserLogin } from 'app/shared/util/string-utils';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import Popover from 'app/shared/layout/common/Popover';
import PopupCustomerDetail from '../../customers/popup-detail/popup-customer-detail';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import PopupMenuSet from '../../setting/menu-setting';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import SlideShow from '../common/slide-show';
import PopupFieldsSearchMulti from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search-multi';
import { ACTIVITY_ACTION_TYPES } from 'app/modules/activity/constants';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import * as R from 'ramda';
import { handleGetCustomerHistoryAcivities } from '../../customers/list/customer-list.reducer';
import SpecailEditList from './special-render/special-edit-list';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import GlobalControlRight from 'app/modules/global/global-tool';
import { tryParseJson } from 'app/shared/util/string-utils';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';

export interface IBusinessCardListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  // fieldInfos list field Info
  fieldInfos: any;
  // customFieldInfos list custom Field Info
  customFieldInfos: any;
  // screenMode check action
  screenMode: any;
  // businessCardList data list
  businessCardList: any;
  handleGetBusinessCardList;
}

/**
 * Component Business Card List
 * @param props
 */
export const BusinessCardList = (props: IBusinessCardListProps) => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [view, setView] = useState(1)
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [listViewChecked, setListViewChecked] = useState([]);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conditionSearchTmp, setConditionSearchTmp] = useState(null);
  const [filterTmp, setFilterTmp] = useState(null);
  const [orderTmp, setOrderTmp] = useState(null);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);
  const [filterMode, setFilterMode] = useState(FILTER_MODE.OFF);
  const [selectedTargetType, setSelectedTargetType] = useState(TYPE_LIST.ALL_CARD);
  const [selectedTargetId, setSelectedTargetId] = useState(0);
  const [filterConditions, setFilterConditions] = useState([]);
  const [orderBy, setOrderBy] = useState([]);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [openPopupAddCardsToList, setOpenPopupAddCardsToList] = useState(false);
  const [openPopupMoveList, setOpenPopupMoveList] = useState(false);
  const [openPopupCreateMyList, setOpenPopupCreateMyList] = useState(false);
  const [openPopupCreateShareList, setOpenPopupCreateShareList] = useState(false);
  const [listIdChecked, setListIdChecked] = useState([]);
  const [openMergeBusinessCard, setOpenMergeBusinessCard] = useState(false);
  const [showModal,] = useState(true);
  const [businessCardListActive, setBusinessCardListActive] = useState(null);
  const [openPopupBusinessCardDetail, setOpenPopupBusinessCardDetail] = useState(false);
  const [groupMode, setGroupMode] = useState(SHARE_LISTS_MODES.MODE_CREATE_GROUP);
  const [listId, setListId] = useState();
  const [, setIsOwnerGroup] = useState();
  const [isAutoShareGroup, setIsAutoShareGroup] = useState(false);
  const [groupMember, setGroupMember] = useState([]);
  const [myListModalMode, setMyListModalMode] = useState(null);
  const [showMessage, setShowMessage] = useState(SHOW_MESSAGE.NONE);
  const [openCreateEditBusinessCard, setOpenCreateEditBusinessCard] = useState(false);
  const [openCreateEditBusinessCardModal, setOpenCreateEditBusinessCardModal] = useState(false);

  const { fieldInfos, customFieldInfos } = props;
  const tableListRef = useRef(null);

  const [businessCardId, setBusinessCardId] = useState(null);
  const [businessCardAddEditMsg, setBusinessCardAddEditMsg] = useState(null);
  const [openFromList, setOpenFromList] = useState(true);
  const [sidebarCurrentId, setSidebarCurrentId] = useState(null);
  const [, setTypeGroup] = useState(TYPE_LIST.MY_LIST);
  const [, setGroupName] = useState(null);

  const [businessCardActionType, setBusinessCardActionType] = useState(BUSINESS_CARD_ACTION_TYPES.UPDATE);
  const [businessCardViewMode, setBusinessCardViewMode] = useState(BUSINESS_CARD_VIEW_MODES.EDITABLE);
  const [orderView, setOrderView] = useState([]);
  const [targetType, setTargetType] = useState(TYPE_LIST.ALL_CARD);
  const [targetId, setTargetId] = useState(0);
  const [recordCheckList, setRecordCheckList] = useState([]);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [msgSuccess, setMsgSuccess] = useState(null);
  const [errorCodeList, setErrorCodeList] = useState([]);
  const { createBusinessCardsList } = props;
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  const [activeIcon, setActiveIcon] = useState(false);
  const [heightPosition, setHeightPosition] = useState(1);
  const [openOverFlow, setOpenOverFlow] = useState(null)

  const [activeIconCard, setActiveIconCard] = useState(false);
  const [heightPositionCard, setHeightPositionCard] = useState(1);
  const [openOverFlowCard, setOpenOverFlowCard] = useState(null)

  const [openPopupCustomerDetail, setOpenPopupCustomerDetail] = useState(false);
  const [customerIdDetail, setCustomerIdDetail] = useState();
  const [selectionBox, setSelectionBox] = useState('');

  const [fileUploads, setFileUploads] = useState({});
  const [showSlideImage, setShowSlideImage] = useState(false);
  const [lstImage, setLstImage] = useState([]);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [infoSearchConditionList, setInfoSearchConditionList] = useState([]);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]); // check user is admin or not

  const [openModalTaskCreate, setOpenModalTaskCreate] = useState(false);
  const [openModalCreateActivity, setOpenModalCreateActivity] = useState(false);
  const [openModalCreateCalendar, setOpenModalCreateCalendar] = useState(false);
  const [customerModalId, setCustomerModalId] = useState(null);
  const [customerModalName, setCustomerModalName] = useState(null);
  const [customerModalEmail, setCustomerModalEmail] = useState(null);
  const [customerModalEmailCard, setCustomerModalEmailCard] = useState(null);
  const [menuType, setMenuType] = useState(false);
  const [activities, setActivities] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [isOnDrag, setIsOnDrag] = useState(true);
  const [resetScreen, setResetScreen] = useState(false);
  const employeeDetailCtrlId = useId(1, "bussinessCardEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "businessCardListCustomerDetailCtrlId_");
  let totalRecords: number

  /**
   * State for BusinessCard my list
   */
  const defaultBusinessCardMyListData = {
    listMode: MY_LIST_MODES.MODE_CREATE_LIST,
    listId: null,
    isAutoList: false,
    listMembers: null
  }
  const [openBusinessCardMyList, setOpenBusinessCardMyList] = useState(false);
  const [businessCardMyListData, setBusinessCardMyListData] = useState(defaultBusinessCardMyListData);

  /**
   * State for BusinessCard shared list.
   */
  const defaultBusinessCardSharedListData = {
    listMode: SHARE_LISTS_MODES.MODE_CREATE_GROUP,
    listId: null,
    isOwnerList: false,
    isAutoList: false,
    listMembers: null
  }
  const [openBusinessCardSharedList, setOpenBusinessCardSharedList] = useState(false);
  const [businessCardSharedListData, setBusinessCardSharedListData] = useState(defaultBusinessCardSharedListData);


  let businessCardList = [];
  if (props.businessCardList && props.businessCardList.businessCards && props.businessCardList.businessCards.length > 0) {
    const tmpBusinessCardList = _.cloneDeep(props.businessCardList.businessCards);

    tmpBusinessCardList.forEach((e, index) => {
      const zipCode = tmpBusinessCardList[index].zip_code ? tmpBusinessCardList[index].zip_code : "";
      const building = tmpBusinessCardList[index].building ? tmpBusinessCardList[index].building : "";
      const address = tmpBusinessCardList[index].address ? tmpBusinessCardList[index].address : "";
      e['address'] = JSON.stringify({
        zipCode,
        address: zipCode + address + building,
        buildingName: building,
        addressName: address
      })
    })
    totalRecords = props.businessCardList.totalRecords;
    businessCardList = _.cloneDeep(tmpBusinessCardList);
  }

  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = fieldInfos.fieldInfoPersonals;
  }
  let customFields = [];
  if (customFieldInfos && customFieldInfos.customFieldsInfo) {
    customFields = customFieldInfos.customFieldsInfo;
  }

  useEffect(() => {
    document.body.className = "wrap-card";
    props.handleInitBusinessCard(offset, limit);
    props.getCustomFieldsInfo(BUSINESS_CARD_DEF.EXTENSION_BELONG_LIST);
    props.handleGetInitializeListInfo(FIELD_BELONG.BUSINESS_CARD);
    props.changeScreenMode(false);
    return () => {
      props.reset();
    }
  }, []);

  useEffect(() => {
    // open details employees from other screen
    const { state } = props.location;
    if (state && state.openDetail && state.recordId) {
      setOpenPopupBusinessCardDetail(true);
      setBusinessCardId(state.recordId);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);

  // useEffect(() => {
  //   if (showMessage !== 0) {
  //     setTimeout(() => setShowMessage(0), 5000)
  //   }
  // }, [showMessage])

  useEffect(() => {
    if (props.updateBusinessCardsList && props.updateBusinessCardsList.businessCardListDetailId && props.listBusinessCardList.length > 0) {
      const businessCardActive = props.listBusinessCardList.find(item => item.listId === props.updateBusinessCardsList.businessCardListDetailId);
      setBusinessCardListActive(businessCardActive);
    }
    else if (businessCardListActive && props.listBusinessCardList.length > 0) {
      const businessCardActive = props.listBusinessCardList.find(item => item.listId === businessCardListActive.listId);
      setBusinessCardListActive(businessCardActive);
    }
  }, [props.updateBusinessCardsList, props.listBusinessCardList])

  const reloadScreen = (isReloadNow?) => {
    let conditions = null;
    if (isReloadNow) {
      conditions = null;
    } else if (conditionSearch && conditionSearch.length > 0) {
      conditions = conditionSearch;
    } else {
      conditions = textSearch;
    }
    props.handleSearchBusinessCard(selectedTargetType, selectedTargetId, offset, limit, conditions);
    props.getFieldInfoPersonals(BUSINESS_CARD_LIST_ID, FIELD_BELONG.BUSINESS_CARD, 1, FieldInfoType.Personal, selectedTargetType, selectedTargetId);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  /**
   * Process search Business Card
   * @param offsetRecord
   * @param limitRecord
   * @param idOfListSearch
   * @param receiverIdSearch
   */
  const searchBusinessCardList = (selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord) => {
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      if (filterMode === FILTER_MODE.OFF) {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, textSearch, [], orderBy);
      } else {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, textSearch, filterTmp, orderTmp);
      }
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      if (filterMode === FILTER_MODE.OFF) {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, conditionSearchTmp, [], orderTmp);
      } else {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, conditionSearchTmp, filterTmp, orderTmp);
      }
    } else {
      if (filterMode === FILTER_MODE.OFF) {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, [], [], orderTmp);
      } else {
        props.handleSearchBusinessCard(selectedTargetTypeRecord, selectedTargetIdRecord, offsetRecord, limitRecord, [], filterTmp, orderTmp);
      }
    }
  }

  /**
   * Handle Search List View
   * @param order
   */
  const handleSearchListView = (order) => {
    if (searchMode === SEARCH_MODE.CONDITION) {
      props.handleSearchBusinessCardView(selectedTargetType, selectedTargetId, 0, limit, conditionSearch, order);
    } else {
      props.handleSearchBusinessCardView(selectedTargetType, selectedTargetId, 0, limit, textSearch, order);
    }
  }

  // useEffect(() => {
  //   setIsChanged(false);
  //   if (props.screenMode === ScreenMode.DISPLAY) {
  //     setSaveEditValues([])
  //   }
  // }, [props.screenMode])

  useEffect(() => {
    if (props.idOfListRefresh && businessCardListActive && props.idOfListRefresh === businessCardListActive.listId) {
      searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
    }
  }, [props.idOfListRefresh])

  useEffect(() => {
    if (props.mergeSuccess && props.mergeSuccess > 0) {
      if (view === 1 && tableListRef && tableListRef.current) {
        tableListRef.current && tableListRef.current.removeSelectedRecord();
        searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
      } else if (view === 2) {
        setListIdChecked([]);
        handleSearchListView(orderView)
      }
    }
  }, [props.mergeSuccess])
  useEffect(() => {
    if (showMessage === SHOW_MESSAGE.SUCCESS) {
      if (createBusinessCardsList && createBusinessCardsList.length > 0) {
        props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
      }
      if (view === 1) {
        tableListRef.current.removeSelectedRecord();
      } else {
        setListIdChecked([]);
      }
    }
    if (props.screenMode === ScreenMode.DISPLAY) {
      setTimeout(() => {
        setShowMessage(SHOW_MESSAGE.NONE);
        setErrorCodeList([]);
        props.resetMessageList();
      }, 5000)
    }
    setTimeout(() => {
      setMsgSuccess(null);
    }, TIMEOUT_TOAST_MESSAGE)
  }, [showMessage])

  useEffect(() => {
    if (props.addMyListSuccess !== null) {
      setSuccessMessage(props.addMyListSuccess)
    }
  }, [props.addMyListSuccess])
  useEffect(() => {
    if (successMessage !== null) {
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }, [successMessage])


  useEffect(() => {
    if (msgSuccess) {
      setTimeout(() => {
        setMsgSuccess(null);
      }, TIMEOUT_TOAST_MESSAGE)
    }
  }, [msgSuccess])

  useEffect(() => {
    if (props.errorCodeList && props.errorCodeList.length > 0) {
      setShowMessage(SHOW_MESSAGE.ERROR)
      setErrorCodeList(props.errorCodeList)
    } else if (props.errorItems && props.errorItems.length > 0) {
      if (props.errorItems[0].errorCode === 'ERR_COM_0050') {
        setShowMessage(SHOW_MESSAGE.ERROR_EXCLUSIVE)
      } else {
        setShowMessage(SHOW_MESSAGE.ERROR_LIST)
        setErrorCodeList(props.errorItems)
      }
    }
  }, [props.errorCodeList, props.errorItems])
  useEffect(() => {
    if (props.msgSuccess) {
      setMsgSuccess(props.msgSuccess)
      setShowMessage(SHOW_MESSAGE.SUCCESS)
    }
  }, [props.msgSuccess])

  useEffect(() => {
    if (props.updateList) {
      props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
    }
  }, [props.updateList])
  useEffect(() => {
    if (props.deleteList) {
      props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
      if (props.deleteList === selectedTargetId) {
        setSelectedTargetId(0);
        setSelectedTargetType(TYPE_LIST.ALL_CARD);
        searchBusinessCardList(TYPE_LIST.ALL_CARD, props.deleteList, offset, limit);
      }
    }
  }, [props.deleteList])

  useEffect(() => {
    if (props.addFavoriteList) {
      tableListRef.current && tableListRef.current.removeSelectedRecord();
      tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
      props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
    }
  }, [props.addFavoriteList])

  useEffect(() => {
    if (props.removeFavoriteList) {
      props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
    }
  }, [props.removeFavoriteList])

  useEffect(() => {
    if (props.errorMessage) {
      setShowMessage(SHOW_MESSAGE.ERROR);
      setErrorCodeList(props.errorMessage);
    }
  }, [props.errorMessage])

  useEffect(() => {
    setResetScreen(props.resetScreen)
  }, [props.resetScreen])

  useEffect(() => {
    if (props.deleteDetail && props.deleteDetail.listOfBusinessCardId && props.deleteDetail.listOfBusinessCardId.length > 0) {
      if (view === 1 && tableListRef && tableListRef.current) {
        tableListRef.current && tableListRef.current.removeSelectedRecord();
        searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
      } else if (view === 2) {
        setListIdChecked([]);
        handleSearchListView(orderView)
      }
    }
  }, [props.deleteDetail])

  useEffect(() => {
    if (props.BusinessCardsAction === BusinessCardsAction.DragDropSuccess
    ) {
      tableListRef.current && tableListRef.current.removeSelectedRecord();
      tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
      searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
    } else if (props.BusinessCardsAction === BusinessCardsAction.Error) {
      setShowMessage(SHOW_MESSAGE.ERROR)
    }
  }, [props.BusinessCardsAction]);

  useEffect(() => {
    if (props.action === BusinessCardsAction.DeleteSucess) {
      searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
    }
  }, [props.action])

  useEffect(() => {
    props.changeScreenMode(false);
  }, [sidebarCurrentId]);


  useEffect(() => {
    if (props.infoSearchConditionList) {
      if (props.infoSearchConditionList.length > 0) {
        const conditionSearchs = []
        props.infoSearchConditionList.forEach(e => {
          const isArray = Array.isArray(e.searchValue);
          let val;
          if (isArray) {
            val = [];
            e.fieldValue.forEach((element, idx) => {
              if (element['from']) {
                val.push({ from: element.from });
                val.push({ to: element.to });
              } else {
                val.push({ key: idx.toString(), value: element });
              }
            });
          } else {
            val = e.searchValue;
          }
          const condition = {
            fieldBelong: 4,
            fieldId: e.fieldId,
            fieldItems: e.fieldItems,
            fieldLabel: e.fieldLabel,
            fieldName: e.fieldName,
            fieldRelation: e.fieldRelation,
            fieldType: e.fieldType,
            fieldValue: val,
            isDefault: e.isDefault,
            isSearchBlank: e.isSearchBlank,
            relationFieldId: e.relationFieldId,
            searchOption: e.searchType,
            searchType: e.searchType,
          }
          conditionSearchs.push(condition);
        });
        setInfoSearchConditionList(conditionSearchs)
        reloadScreen(true);
      }
    }
  }, [props.infoSearchConditionList])

  /**
   * Process Filter Order
   * @param filter
   * @param order
   */
  const onActionFilterOrder = (filter, order) => {
    setOffset(0);
    setFilterConditions(filter);
    setOrderBy(order);
    if (filter.length <= 0) setFilterMode(FILTER_MODE.OFF);
    else {
      setFilterMode(filter.filter(x => x["fieldValue"]).length > 0 ? FILTER_MODE.ON : FILTER_MODE.OFF);
    }
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    const tmpSearchFilter = _.cloneDeep(filter);
    if (filter && filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        if (filter[i].fieldName === "is_working") {
          tmpSearchFilter[i].fieldType = 99;
          let tmpvalueFilterIsWorkingOne = null;
          let tmpvalueFilterIsWorkingTwo = null;
          const tmpItemFilterIsWorkingTwo = _.cloneDeep(tmpSearchFilter[i]);
          const valueFilterWorking = tryParseJson(filter[i].fieldValue)
          if (valueFilterWorking.length > 1) {
            tmpvalueFilterIsWorkingOne = valueFilterWorking[0] === "1" ? "true" : "false";
            tmpvalueFilterIsWorkingTwo = valueFilterWorking[1] === "1" ? "true" : "false";
            tmpItemFilterIsWorkingTwo.fieldValue = tmpvalueFilterIsWorkingTwo;
            tmpSearchFilter[i].fieldValue = tmpvalueFilterIsWorkingOne;
            tmpSearchFilter.push(tmpItemFilterIsWorkingTwo);
          } else if (valueFilterWorking.length === 1) {
            tmpvalueFilterIsWorkingOne = valueFilterWorking[0] === "1" ? "true" : "false";
            tmpSearchFilter[i].fieldValue = tmpvalueFilterIsWorkingOne;
          } else if (_.isEmpty(valueFilterWorking)) {
            tmpSearchFilter[i].fieldValue = null;
          }
        }
      }
    }
    const tmpFilterData = _.cloneDeep(tmpSearchFilter);
    tmpFilterData.length > 0 && tmpFilterData.forEach(e => {
      if (_.includes(e.fieldName, "first_name.")) {
        e.fieldType = DEFINE_FIELD_TYPE.OTHER;
        e.fieldName = _.cloneDeep(e.fieldName).replace("first_name", "company_name_business_card_name");
      }
      if (_.includes(e.fieldName, "department_name")) {
        e.fieldName = _.cloneDeep(e.fieldName).replace("department_name", "position_department_name");
      }
      if (_.includes(e.fieldName, "email_address")) {
        e.fieldName = _.cloneDeep(e.fieldName).replace("email_address", "email_address_mobile_number_phone_number");
      }
    })
    const tmpOrderData = _.cloneDeep(order);
    tmpOrderData.length > 0 && tmpOrderData.forEach(ele => {
      if (_.includes(ele.key, "first_name.")) {
        ele.key = "company_name_business_card_name";
      }
      if (_.includes(ele.key, "department_name")) {
        ele.key = "position_department_name";
      }
      if (_.includes(ele.key, "email_address")) {
        ele.key = "email_address_mobile_number_phone_number";
      }
    })
    setFilterTmp(tmpFilterData);
    setOrderTmp(tmpOrderData);
    if (searchMode === SEARCH_MODE.CONDITION) {
      props.handleSearchBusinessCard(selectedTargetType, selectedTargetId, 0, limit, conditionSearchTmp, tmpFilterData, tmpOrderData);
    } else {
      props.handleSearchBusinessCard(selectedTargetType, selectedTargetId, 0, limit, textSearch, tmpFilterData, tmpOrderData);
    }
  }

  const isEqualTextValue = (newValue, oldValue) => {
    let copyNewValue = _.cloneDeep(newValue);
    let copyOldValue = _.cloneDeep(oldValue);
    if (_.isNil(copyNewValue) || copyNewValue.length === 0) {
      copyNewValue = "";
    }
    if (_.isNil(copyOldValue)) {
      copyOldValue = "";
    }
    if (_.isEqual(copyNewValue.toString(), copyOldValue.toString())) {
      return true;
    }
    return false;
  }
  const compareBusinessCardImage = (newValue, oldValue) => {
    return false;
  }


  const compareFieldItem = (recordIdx, fieldName, newValue) => {
    const oldValue = businessCardList[recordIdx][fieldName];
    switch (fieldName) {
      case BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardFirstName:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardFirstNameKana:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardLastName:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardLastNameKana:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardDepartments:
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions:
      case BUSINESS_SPECIAL_FIELD_NAMES.customerName:
        return (!isEqualTextValue(newValue, oldValue));
      case BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath:
        return compareBusinessCardImage(newValue, oldValue);
      default:
        // Other fields
        if (!isEqualTextValue(newValue, oldValue)) {
          return true;
        }
        return false;
    }
  }
  const isChangeInputEdit = () => {
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || businessCardList.length <= 0 || fields.length <= 0) {
      return false;
    }
    const groupBusinessCard = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});
    for (const prd in groupBusinessCard) {
      if (!Object.prototype.hasOwnProperty.call(groupBusinessCard, prd)) {
        continue;
      }
      const recordIdx = businessCardList.findIndex(e => e['business_card_id'].toString() === prd.toString());
      if (recordIdx < 0) {
        return true;
      }
      for (let i = 0; i < groupBusinessCard[prd].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupBusinessCard[prd][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        const newValue = groupBusinessCard[prd][i].itemValue;
        const hasChange = compareFieldItem(recordIdx, fieldName, newValue);
        if (hasChange) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Update Field Value
   * @param itemData
   * @param type
   * @param itemEditValue
   */
  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    // setShowMessage(SHOW_MESSAGE.NONE);
    // setErrorCodeList([]);
    if (showMessage !== SHOW_MESSAGE.NONE) {
      setShowMessage(SHOW_MESSAGE.NONE);
    }
    if (errorCodeList.length > 0) {
      setErrorCodeList([]);
    }
    if (type.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return;
    }
    const index = saveEditValues.findIndex(e => _.toString(e.itemId) === _.toString(itemData.itemId) && _.toString(e.fieldId) === _.toString(itemData.fieldId));
    let itemEditValueCopy = _.cloneDeep(itemEditValue);
    const fieldInfo = props.fieldInfos && props.fieldInfos.fieldInfoPersonals && props.fieldInfos.fieldInfoPersonals.filter(field => field.fieldId.toString() === itemData.fieldId.toString());
    if (fieldInfo && fieldInfo.length > 0 && fieldInfo[0].fieldName === "business_card_image_path") {
      itemEditValueCopy = itemEditValueCopy.length
    }
    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy };
    }
    setIsDirty(isChangeInputEdit());
  }

  const onDragRow = async (sourceRow, targetList) => {
    if (targetList.listId !== sidebarCurrentId) {
      const result = await ConfirmDialogCustom({
        title: (<>{translate('global.title.confirm')}</>),
        message: translate('messages.WAR_BUS_0002', {
          1: targetList.listName,
          0: sourceRow.length
        }),
        confirmText: translate('global.dialog-dirtycheck.parttern2.confirm'),
        confirmClass: "button-blue",
        cancelText: translate('global.dialog-dirtycheck.parttern2.cancel'),
        cancelClass: "button-cancel"
      });
      if (result) {
        props.handleDragDropBusinessCard(sourceRow, targetList.listId, selectedTargetId);
      }
    }
  }

  const onReceiveMessage = (ev) => {
    if (StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      reloadScreen();
    }
  }

  useEventListener('message', onReceiveMessage);

  const parseValidateError = () => {
    let msgError = [];
    let firstErrorRowIndex = null;
    let firstErrorItem = null;
    let firstErrorBusinessCarrds = null
    const { errorItems } = props;
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || businessCardList.length <= 0) {
      msgError = [];
    } else {
      let count = 0;
      const lstError = _.cloneDeep(props.errorItems);
      for (let i = 0; i < errorItems.length; i++) {
        if (!errorItems[i].rowId) continue;
        const rowIndex = businessCardList.findIndex(e => e['business_card_id'].toString() === errorItems[i].rowId.toString());
        const fieldOrder = fieldInfos.fieldInfoPersonals.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === StringUtils.snakeCaseToCamelCase(errorItems[i].item))["fieldOrder"]
        lstError[i]['rowIndex'] = rowIndex;
        lstError[i]['order'] = fieldOrder;
        const fieldIndex = fields.findIndex(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item || e.fieldName === errorItems[i].item);
        if (rowIndex < 0 || fieldIndex < 0) {
          continue;
        }
        count++;
      }
      const msg = translate('messages.ERR_COM_0052', { count });
      msgError.push({ msg });
      if (lstError.length > 0) {
        const lstErrorSortByOrder = lstError.sort(function (a, b) {
          return a.rowIndex - b.rowIndex || a.order - b.order;
        });
        firstErrorRowIndex = lstErrorSortByOrder[0].rowIndex;
        firstErrorItem = lstErrorSortByOrder[0].item;
        firstErrorBusinessCarrds = lstErrorSortByOrder[0].rowId;
      }
    }
    return { msgError, firstErrorRowIndex, firstErrorItem, firstErrorBusinessCarrds };
  }

  const findFirstFocusEdit = () => {
    let firstBusinessCardShowInList = null;
    let firstItemFocus = null;
    // eslint-disable-next-line no-prototype-builtins
    if (props.businessCardList && props.businessCardList.hasOwnProperty("businesscards")) {
      firstBusinessCardShowInList = props.businessCardList.businesscards.length > 0 ? props.businessCardList.businesscards[0]['business_card_id'] : null;
    }
    if (props.customFieldInfos) {
      const lstFieldAfterSortByFieldOrder = props.customFieldInfos.customFieldsInfo;

      for (let i = 0; i < lstFieldAfterSortByFieldOrder.length; i++) {
        if (lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
          firstItemFocus = lstFieldAfterSortByFieldOrder[i].fieldName;
          break;
        }
      }
    }
    return { firstBusinessCardShowInList, firstItemFocus }
  }
  const validateMsg = parseValidateError().msgError;
  // Find first error item
  const firstErrorItemError = parseValidateError().firstErrorItem;
  // Find first employee error
  const firstBusinessCardError = parseValidateError().firstErrorBusinessCarrds;
  // Find first employee ficus when edit list
  const firstBusinessCardShowInListFocus = findFirstFocusEdit().firstBusinessCardShowInList;
  // Find first item ficus when edit list
  const firstItemInEditListFocus = findFirstFocusEdit().firstItemFocus;
  /**
   * Open Merge BusinessCard
   */
  const onOpenMergeBusinessCard = (id?: number) => {
    setOpenMergeBusinessCard(true);
  }

  /**
   * Select Switch Display Field
   * @param srcField
   * @param isSelected
   */
  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    tableListRef.current.handleChooseField(srcField, isSelected);
  }
  /**
   * Process Drag Field
   * @param fieldSrc
   * @param fieldTargetId
   */
  const onDragField = (fieldSrc, fieldTargetId) => {
    tableListRef.current.handleDragField(fieldSrc, fieldTargetId);
  }

  /**
   * handle close popup Help
   */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /*
   * handle action open popup help
   */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
   * change type view list mode
   * @param childData
   */
  const callbackFunction = (childData) => {
    setView(childData)
  }

  const onLeaveDirtyCheck = (action) => {
    props.resetMessageList();
    action();
  }

  /**
   * Execute Dirty Check
   * @param action
   * @param cancel
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, patternType?: number) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      onLeaveDirtyCheck(action);
    } else {
      const partternType = patternType || DIRTYCHECK_PARTTERN.PARTTERN1;
      if (isDirty) {
        await DialogDirtyCheck({ onLeave: () => onLeaveDirtyCheck(action), onStay: cancel, partternType });
      } else {
        onLeaveDirtyCheck(action);
      }
      setShowMessage(SHOW_MESSAGE.NONE)
      setErrorCodeList([])
    }
  }

  /**
   * Process Page Change
   * @param offsetRecord
   * @param limitRecord
   */
  const onPageChange = (offsetRecord, limitRecord) => {
    executeDirtyCheck(() => {
      setOffset(offsetRecord);
      setLimit(limitRecord);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      searchBusinessCardList(selectedTargetType, selectedTargetId, offsetRecord, limitRecord);
      // searchBusinessCardList(TYPE_LIST.ALL_CARD, 0, offsetRecord, limitRecord);
      tableListRef && tableListRef.current && tableListRef.current.onScrollTopTable();
    });
  }

  /**
   * Show Switch Display
   */
  const onShowSwitchDisplay = () => {
    if (!showSwitcher) {
      executeDirtyCheck(() => {
        props.getCustomFieldsInfo(BUSINESS_CARD_DEF.EXTENSION_BELONG_LIST);
        setShowSwitcher(true);
        setSaveEditValues([]);
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  }

  /**
   * Set List View Checked
   * @param list
   */
  const listChecked = (list) => {
    const lst = [];
    if (list && list.length > 0) {
      list.forEach(x => {
        const a = {
          businessCardId: x,
          isChecked: true
        }
        lst.push(a)
      })
    }
    setRecordCheckList(lst);
    setListViewChecked(lst);
  }

  /**
   * Open Popup Search
   */
  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      executeDirtyCheck(() => {
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setOpenPopupSearch(true);
        setTextSearch("");
      });
    }
  }

  /**
   * Close Popup Search
   * @param saveCondition
   */
  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      const tmpSearchCondition = _.cloneDeep(saveCondition);
      for (let j = 0; j < saveCondition.length; j++) {
        if (saveCondition[j].fieldName === "is_working") {
          tmpSearchCondition[j].fieldValue = _.isEmpty(saveCondition[j].fieldValue) ? ["1"] : [];
        }
      }
      setConditionSearch(tmpSearchCondition);
    }
  }

  /**
   * Handle Search Popup
   * @param condition
   */
  const handleSearchPopup = (condition) => {
    setOpenPopupSearch(false);
    const tmpSearchCondition = _.cloneDeep(condition);
    if (condition && condition.length > 0) {
      for (let i = 0; i < condition.length; i++) {
        if (condition[i].fieldName === "is_working") {
          tmpSearchCondition[i].fieldType = 99;
          let tmpvalueSearchIsWorkingOne = null;
          let tmpvalueSearchIsWorkingTwo = null;
          const tmpItemSearchIsWorkingTwo = _.cloneDeep(tmpSearchCondition[i]);
          if (condition[i].fieldValue.length > 1) {
            tmpvalueSearchIsWorkingOne = condition[i].fieldValue[0] === "1" ? "true" : "false";
            tmpvalueSearchIsWorkingTwo = condition[i].fieldValue[1] === "1" ? "true" : "false";
            tmpItemSearchIsWorkingTwo.fieldValue = tmpvalueSearchIsWorkingTwo;
            tmpSearchCondition[i].fieldValue = tmpvalueSearchIsWorkingOne;
            tmpSearchCondition.push(tmpItemSearchIsWorkingTwo);
          } else if (condition[i].fieldValue.length === 1) {
            tmpvalueSearchIsWorkingOne = condition[i].fieldValue[0] === "1" ? "true" : "false";
            tmpSearchCondition[i].fieldValue = tmpvalueSearchIsWorkingOne;
          } else {
            tmpSearchCondition[i].fieldValue = null;
          }
        }
        if (condition[i].fieldName === "employee_id.keyword") {
          tmpSearchCondition[i].fieldType = 99;
          tmpSearchCondition[i].fieldName = "employee_id";
        }
        if (condition[i].fieldName === "created_user.keyword") {
          tmpSearchCondition[i].fieldType = 99;
          tmpSearchCondition[i].fieldName = "created_user";
        }
        if (condition[i].fieldName === "updated_user.keyword") {
          tmpSearchCondition[i].fieldType = 99;
          tmpSearchCondition[i].fieldName = "updated_user";
        }
        if (condition[i].fieldName === "company_name.keyword") {
          tmpSearchCondition[i].fieldType = 99;
        }
      }
    }
    const search = tmpSearchCondition && tmpSearchCondition.filter(e => e.fieldName !== "activity_id");
    const inputSearch = search.filter(e => (e.isSearchBlank || !_.isEmpty(e.fieldValue) && (!e.isSearchBlank)));
    // const inputSearch = _.cloneDeep(tmpSearchCondition);

    setConditionSearch(condition);
    setConditionSearchTmp(inputSearch);
    setOffset(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    setSaveEditValues([]);
    setSelectedTargetId(0);
    setSelectedTargetType(TYPE_LIST.ALL_CARD);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    // if (filterMode === FILTER_MODE.OFF) {
    //   props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, inputSearch);
    // } else {
    //   props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, inputSearch, filterConditions, orderBy);
    // }
    setFilterConditions([]);
    setOrderBy([]);
    setFilterTmp([]);
    setOrderTmp([]);
    props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, inputSearch);
    setConDisplaySearchDetail(true);
    if (view === 1 && tableListRef && tableListRef.current) {
      tableListRef.current.resetState();
    }
  }
  /**
   * Check input Search
   * @param text
   */
  const enterSearchText = (text) => {
    executeDirtyCheck(() => {
      setTextSearch(text);
      setOffset(0);
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      // if (filterMode === FILTER_MODE.OFF) {
      //   props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, text);
      // } else {
      //   props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, text, filterConditions, orderBy);
      // }
      setConditionSearch(null);
      setConditionSearchTmp(null);
      setFilterConditions([]);
      setOrderBy([]);
      setFilterTmp([]);
      setOrderTmp([]);
      props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, 0, limit, text);
      setSelectedTargetId(0);
      setSelectedTargetType(TYPE_LIST.ALL_CARD);
      if (view === 1 && tableListRef && tableListRef.current) {
        tableListRef.current.resetState();
      }
    }, () => {
      setTextSearch("");
    });
  }

  /**
   * Open Popup Add Cards To List
   * @param lstIdChecked
   */
  const onOpenPopupAddCardsToList = (lstIdChecked) => {
    setOpenPopupAddCardsToList(true);
    const lstId = [];
    lstIdChecked.forEach(element => {
      lstId.push(element.businessCardId);
    });
    setListIdChecked(lstId);
  }

  /**
   * Open Popup Move List
   * @param lstIdChecked
   */
  const onOpenPopupMoveList = (lstIdChecked) => {
    setOpenPopupMoveList(true);
    const lstId = [];
    lstIdChecked.forEach(element => {
      lstId.push(element.businessCardId);
    });
    setListIdChecked(lstId);
  }
  /**
   * Open Popup Move List
   * @param lstIdChecked
   */
  const onOpenCreateEditBusinessCard = (businessCardAcT, businessCardVM, busCardId) => {
    setBusinessCardViewMode(businessCardVM);
    setBusinessCardActionType(businessCardAcT);
    if (businessCardAcT === BUSINESS_CARD_ACTION_TYPES.UPDATE) {
      setBusinessCardId(busCardId);
    } else {
      setBusinessCardId(null);
    }
    setOpenCreateEditBusinessCard(true);
  }
  /**
   * Open Popup Create My List
   * @param lstIdChecked
   */
  const onOpenPopupCreateMyList = lstIdChecked => {
    setListIdChecked(lstIdChecked);
    setOpenPopupCreateMyList(true);
  }

  /**
   * Open Popup Create Share List
   * @param lstIdChecked
   */
  const onOpenPopupCreateShareList = lstIdChecked => {
    setListIdChecked(lstIdChecked);
    setOpenPopupCreateShareList(true);
  }

  /**
   * Change Business Card List Active
   * @param obj
   * @param receiver
   */
  const onChangeBusinessCardListActive = (id, type, obj) => {
    setSelectedTargetType(type);
    setSelectedTargetId(id);
    setBusinessCardListActive(obj);
    setOrderBy([]);
    setConditionSearch(null);
    setConditionSearchTmp(null);
    setFilterConditions([]);
    setFilterTmp([]);
    setOrderTmp([]);
    setTextSearch("");
    if (view === 1 && tableListRef && tableListRef.current) {
      tableListRef.current.resetState();
    }
    // if(obj === null) {
    //   setSidebarCurrentId(null)
    // }
    props.handleSearchBusinessCard(type, id, offset, limit, []);
  }
  const getOwnerList = (paticipant) => {
    let result = [];
    const ownerPaticipant = paticipant.filter(y => y.participantType === 2)
    if (ownerPaticipant.length > 0) {
      ownerPaticipant.map(op => {
        if (op.departmentId && op.employeesDepartments.length > 0) {
          op.employeesDepartments.map(ed => {
            if (ed.employeeId) {
              result = result.concat(ed.employeeId.toString());
            }
          })
        } else if (op.employeeId) {
          result = result.concat(op.employeeId.toString())
        }
      })
    }
    result = result.filter((item, index) => result.indexOf(item) === index);
    return result;
  }

  const onUpdateBusinessCardsList = async (businessCard) => {
    const businessCardListDetailId = businessCard.listId;
    const businessCardListName = businessCard.listName;
    const listType = 2;
    const { listMode, isOverWrite, updatedDate } = businessCard;
    const searchConditions = [];
    const infoUserLogin = decodeUserLogin();
    const hasChangeFromMyList = true;
    const ownerUser = {
      employeeId: infoUserLogin['custom:employee_id'],
      employeeName: infoUserLogin['custom:employee_surname'],
      employeeSurname: infoUserLogin['custom:employee_surname'],
      participantType: 2,
    }
    const ownerList = getOwnerList([ownerUser]);
    const viewerList = null;
    const result = await ConfirmDialogCustom({
      title: (<>{translate('global.title.confirm')}</>),
      message: translate('sales.top.dialog.change-my-list-to-share-list'),
      confirmText: translate('global.button.confirm'),
      confirmClass: "button-red",
      cancelText: translate('global.button.cancel'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.handleUpdateBusinessCardsList(businessCardListDetailId,
        businessCardListName,
        listType,
        listMode,
        ownerList,
        viewerList,
        isOverWrite,
        searchConditions,
        updatedDate,
        hasChangeFromMyList
      );
    }
  }

  const toggleUpdateBusinessCardsList = (businessCard) => {
    onUpdateBusinessCardsList(businessCard)
  }
  const changeBusinessCardsList = () => {
    onUpdateBusinessCardsList(businessCardListActive)
  }

  /**
   * handle open business card detail
   * @param itemId 
   */
  const handleOpenBusinessCardDetail = (itemId) => {
    setOpenFromList(true);
    setBusinessCardAddEditMsg(null)
    if (!openPopupBusinessCardDetail) {
      executeDirtyCheck(() => {
        setBusinessCardId(itemId);
        setOpenPopupBusinessCardDetail(true);
      });
    }
  }

  /**
   * 
   * @param id open business card detail from other
   * @param isProductSet 
   */
  const openBusinessCardDetailFromOther = (id) => {
    setOpenFromList(false);
    setBusinessCardId(id);
    setOpenPopupBusinessCardDetail(true);
  }

  /**
   * Open Popup Business Card Detail
   * @param itemId
   * @param fieldId
   */
  const onOpenPopupBusinessCardDetail = (itemId, fieldId) => {
    if (!fieldId || props.screenMode === ScreenMode.EDIT) return;
    handleOpenBusinessCardDetail(itemId)
  }

  /**
   * Close Popup Business Card Detail
   */
  const onClosePopupBusinessCardDetail = (isCreateEdit?) => {
    // setBusinessCardId(null);
    if (isCreateEdit) {
      setSelectedTargetType(TYPE_LIST.ALL_CARD);
      setSelectedTargetId(0);
      setConditionSearch(null);
      setFilterConditions([]);
      setOrderBy([]);
      setTextSearch("");
      props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, offset, limit, []);
    }
    setOpenPopupBusinessCardDetail(false);
    setActivities(false);
  }

  /**
   * Close Mylist Modal
   * @param isUpdate
   * @param saveCondition
   */
  const handleCloseBusinessCardMyListModal = (isUpdate, saveCondition?, message?) => {
    if (message === "ERR_COM_0050") {
      setShowMessage(SHOW_MESSAGE.ERROR_EXCLUSIVE)
    }
    setOpenBusinessCardMyList(false);
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
    setBusinessCardMyListData(defaultBusinessCardMyListData);
  }

  /**
   * Close Sharelist Modal
   * @param isUpdate
   * @param saveCondition
   */
  const handleCloseBusinessCardSharedListModal = (isUpdate, saveCondition?, message?) => {
    if (message === "ERR_COM_0050") {
      setShowMessage(SHOW_MESSAGE.ERROR_EXCLUSIVE)
    }
    setOpenBusinessCardSharedList(false);
    setBusinessCardSharedListData(defaultBusinessCardSharedListData);
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
  }

  /**
   * Open Group Modal
   * @param grpMode
   * @param groupIdIn
   * @param isOwnerGroupIn
   * @param isAutoGroupIn
   * @param groupMemberIn
   */
  const onShowBusinessCardSharedList = (grpMode, groupIdIn, isOwnerGroupIn, isAutoGroupIn, groupMemberIn) => {
    if (!openBusinessCardSharedList) {
      setGroupMode(grpMode);
      setListId(groupIdIn);
      setIsAutoShareGroup(isAutoGroupIn);
      setIsOwnerGroup(isOwnerGroupIn);
      setGroupMember(groupMemberIn);
      setOpenBusinessCardSharedList(true);
      setBusinessCardSharedListData({ listMode: grpMode, listId: groupIdIn, isOwnerList: isOwnerGroupIn, isAutoList: isAutoGroupIn, listMembers: groupMemberIn })
    }
  }

  /**
   * Open Add Edit My BusinessCard Modal
   * @param modalMode
   * @param id
   */
  const onShowBusinessCardMyList = (modalMode, id, isAutoGroup, listMembersGroup) => {
    setListId(id);
    setMyListModalMode(modalMode);
    setOpenBusinessCardMyList(true);
    setBusinessCardMyListData({ listMode: modalMode, listId: id, isAutoList: isAutoGroup, listMembers: listMembersGroup })
  }

  /**
   * Show Error Message
   * @param errorCode
   */
  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }

    return errorMessage;
  }

  /**
   * Close Popup Move List
   * @param message
   */
  const closePopupMoveList = (message) => {
    if (message) {
      setShowMessage(message);
      setMsgSuccess(message);
    }
    searchBusinessCardList(selectedTargetType, selectedTargetId, offset, limit);
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
    setOpenPopupMoveList(false);
  }
  /**
   * Close Popup Move List
   * @param options
   */
  const closeCreateEditBusinessCard = (options, id = null) => {
    setOpenCreateEditBusinessCard(false);
    props.handleInitBusinessCard(offset, limit);
    setBusinessCardId(id);
    setActivities(false);
    setBusinessCardAddEditMsg(options.msg)
    if (id !== null) {
      openBusinessCardDetailFromOther(id);
    }
  }

  /**
   * Get List Business
   */
  const getListBusinessCardId = () => {
    const listBusinessCardId = [];
    if (!props.businessCardList || !props.businessCardList.businessCards) return listBusinessCardId;
    props.businessCardList.businessCards.map((businessCard) => {
      listBusinessCardId.push(businessCard.business_card_id);
    });
    return listBusinessCardId;
  }

  /**
   * Get group name from current active card
   * @param name
   */
  const getGroupName = (name) => {
    setGroupName(name);
  }

  /**
   * Close Create My List
   */
  const onSetOpenPopupCreateMyList = () => {
    setOpenPopupCreateMyList(false);
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
  }

  /**
   * Close Create share List
   */
  const onSetOpenPopupCreateShareList = () => {
    setOpenPopupCreateShareList(false);
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
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

  const onUpdateBusinessCards = () => {
    let conditions = null;
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      conditions = textSearch;
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      conditions = conditionSearch;
    } else {
      conditions = "";
    }
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setShowMessage(SHOW_MESSAGE.UPLOAD_FILE);
      return;
    }
    props.handleUpdateBusinessCards(BUSINESS_CARD_LIST_ID, saveEditValues, selectedTargetType, selectedTargetId, offset, limit, conditions, filterConditions, orderBy, files);
  }

  const getListImage = (lstData) => {
    const lstImg = []
    lstData.forEach(item => lstImg.push({ imageId: item['business_card_id'], imageName: item['business_card_image_name'], imagePath: item['business_card_image_path'] }))
    return lstImg;
  }

  const onOpenShowSlideImage = (id) => {
    setLstImage(getListImage(businessCardList));
    setCurrentImageId(id);
    setShowSlideImage(true);
  }


  const renderToastMessage = () => {
    if (msgSuccess) {
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage messageType={MessageType.Success}
            message={msgSuccess || successMessage}
            className=" "
            styleClassMessage="block-feedback block-feedback-green text-left"
            messages={_.map(validateMsg, 'msg')}
          />
        </div>
      );
    } else {
      return <></>
    }
  }

  const renderErrorMessage = () => {
    switch (showMessage) {
      case SHOW_MESSAGE.ERROR:
        return (
          <>
            {errorCodeList.map((error, index) => {
              return (
                <div key={index}>
                  <BoxMessage messageType={MessageType.Error} message={getErrorMessage(error)} />
                </div>
              );
            })}
          </>
        );

      case SHOW_MESSAGE.ERROR_LIST:
        return <BoxMessage messageType={MessageType.Error} messages={_.map(validateMsg, 'msg')} />;
      case SHOW_MESSAGE.ERROR_EXCLUSIVE:
        return <BoxMessage messageType={MessageType.Error} message={translate('messages.ERR_COM_0050')} />;
      case SHOW_MESSAGE.UPLOAD_FILE:
        return <BoxMessage messageType={MessageType.Error} message={translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB])} />;
      case SHOW_MESSAGE.NONE:
        return <></>
      default:
        if (messageDownloadFileError !== null) {
          return <BoxMessage messageType={MessageType.Error} message={messageDownloadFileError} />;
        }
        break;
    }
  }

  const showMessageDownloadFile = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, 5000);
  }

  const getSelectedRecord = (recordCheck) => {
    setRecordCheckList(recordCheck);
  }

  /**
   * Close Popup Employee Detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  /**
     * Filter employees by local menu
     * @param filter
     * @param selectedTargetTypeProp
     * @param listViewConditions
     */
  const updateFiltersLocalMenu = (filter, selectedTargetTypeProp, listViewConditions) => {
    // const department = filter.find(obj => obj.key === 'department_id');
    // // tableListRef.current.resetState();
    // if (department) {
    //   setDepartmentIdSelected(department.value);
    // }
    // let arrOrderby = [];
    // if (listViewConditions.orderBy) {
    //   arrOrderby = listViewConditions.orderBy
    // }
    // let defaultFilterConditions = [];
    // if (listViewConditions.filterConditions) {
    //   defaultFilterConditions = listViewConditions.filterConditions;
    //   defaultFilterConditions.forEach(e => {
    //     if (!isNullOrUndefined(e.fieldType)) {
    //       e.fieldType = parseInt(e.fieldType, 10);
    //     }
    //     delete e.searchValue;
    //   });
    // }
    // setSelectedTargetType(selectedTargetTypeProp);
    // setSelectTargetId(filter[0].value);
    // props.handleFilterEmployeeByMenu(offset, limit, conditionSearch, selectedTargetTypeProp, filter[0].value, false, defaultFilterConditions, arrOrderby);
    // if (arrOrderby.length > 0 || defaultFilterConditions.length > 0) {
    //   tableListRef.current.setFilterListView(arrOrderby, defaultFilterConditions, props.fields);
    // } else {
    //   tableListRef.current && tableListRef.current.resetState();
    // }
  }
  /**
   * Update menu type when clicking on sidebar records
   * @param iconType
   * @param isAutoGroup
   * @param isOwner
   */
  const updateListMenuType = (status) => {
    setMenuType(status)
  }

  const onClosePopupCreateMyList = () => {
    setOpenPopupCreateMyList(false);
    props.resetMessageList();
  }

  const resetConditionSearch = () => {
    setConDisplaySearchDetail(false);
    setConditionSearch("");
    setConditionSearchTmp("");
    props.handleSearchBusinessCard(TYPE_LIST.ALL_CARD, 0, offset, limit, []);
    // reloadScreen(true);
  }

  const changeSelectedSidebar = (obj) => {
    setTargetType(obj.type);
    setTargetId(obj.cardId);
    // tableListRef.current.changeTargetSidebar(obj.type, obj.cardId);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
    // reset state
    setConditionSearch("");
    setConditionSearchTmp("");
    setOffset(0);
    setLimit(RECORD_PER_PAGE_OPTIONS[1]);
    setConDisplaySearchDetail(false);
  }

  const actionSetSidebarId = (sidebarId: number) => {
    setSidebarCurrentId(sidebarId);
    setInfoSearchConditionList([])
  }

  const onSetTypeGroup = (type) => {
    setTypeGroup(type);
  }

  /**
* handle close popup settings
*/
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }


  /**
   * Open Employee Detail
   * @param employeeIdIn 
   */
  const onClickDetailEmployee = (employeeIdIn) => {
    setEmployeeId(employeeIdIn);
    setOpenPopupEmployeeDetail(true);
  }

  const handleClickPosition = (e) => {
    setHeightPosition(document.body.clientHeight - e.clientY);
  }
  const handleClickPositionCard = (e) => {
    setHeightPositionCard(document.body.clientHeight - e.clientY);
  }

  const onOpenPopupCustomerDetail = (paramId, fieldId) => {
    if (!openPopupCustomerDetail && fieldId !== null && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        setOpenPopupCustomerDetail(!openPopupCustomerDetail);
        setCustomerIdDetail(paramId);
      });
    }
  }
  const getListCustomerId = () => {
    const listCustomerId = [];
    // customerList && customerList.map((customer) => {
    //   listCustomerId.push(customer.customerId);
    // });
    return listCustomerId;
  }

  /**
  * event on click open modal detail customer
  * @param taskId
  */
  const onClosePopupCustomerDetail = () => {
    document.body.className = 'wrap-card';
    setOpenPopupCustomerDetail(false);
  }

  const getPositionString = (rowData) => {
    if (rowData.department_name && rowData.position) {
      let arr = [];
      const index = rowData.department_name.indexOf("兼");
      if (index < 0) {
        const idx = rowData.position.indexOf("兼");
        if (idx <= 0) {
          const idxBp = rowData.position.indexOf(rowData.department_name);
          if (idxBp >= 0) {
            const position = rowData.position.slice(idxBp).trim();
            if (position.length > 0) {
              arr = [position]
            }
          }
        }
      } else {
        const department = rowData.department_name.split('兼');
        const positions = rowData.position.split('兼');
        if (positions.length > 1) {
          if (department.length === positions.length) {
            const arrs = []
            department.forEach((e, idxP) => {
              const positionArr = positions[idxP].trim().split(" ");
              let string = '';
              for (let m = 0; m < positionArr.length - 1; m++) {
                string = string + " " + positionArr[m];
              }
              if (positionArr.length >= 2 && string.trim() === e.trim()) {
                arrs.push(positions[idxP])
              }
            });
            arr = arrs.length === department.length ? [...arrs] : [];
          }
        }
      }
      if (arr.length > 0) {
        return arr
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  const showDetailScreen = (currentCustomerId, listCustomerId) => {
    return (
      <>
        {
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={currentCustomerId}
            listCustomerId={listCustomerId}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
          />
        }
      </>
    )
  }

  const showCustomerDetail = (customerId) => {
    setOpenPopupCustomerDetail(true);
    setCustomerIdDetail(customerId);
  }

  const showBusinessCarrdDetail = (BusinessCardId) => {
    setBusinessCardId(BusinessCardId);
    setOpenPopupBusinessCardDetail(true);
  }

  const handleFilterTooltip = (e, rowData) => {
    props.handleGetCustomerHistoryAcivities({ customerId: rowData.customer_id });
    if (rowData) {
      const email = rowData.email_address;
      if (email && email.length > 0) {
        setCustomerModalEmail(email);
      } else {
        setCustomerModalEmail(null);
      }

    }
    setOpenOverFlow("customer" + rowData.business_card_id.toString());
    handleClickPosition(e);
    e.stopPropagation();
  }
  const handleFilterTooltipCard = (e, rowData) => {
    if (rowData) {
      const email = rowData.email_address;
      if (email && email.length > 0) {
        setCustomerModalEmailCard(email);
      } else {
        setCustomerModalEmailCard(null);
      }

    }
    setOpenOverFlowCard("businessCard" + rowData.business_card_id.toString());
    handleClickPositionCard(e);
    e.stopPropagation();
  }

  const onClickEmail = (email) => {
    window.location.href = `mailto:${email}`;
  }
  const checkEmail = (rowData) => {
    return rowData.email_address && rowData.email_address.length > 0;
  }


  const onClickOverFlowMenuCard = (idAction, param) => {
    setCustomerModalId(param.customer_id);
    setCustomerModalName(param.customer_name);
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_ACTIVITIES:
        setOpenModalCreateActivity(true);
        setBusinessCardId(param.business_card_id);
        break;
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.HISTORY_ACTIVITIES:
        setActivities(true);
        showBusinessCarrdDetail(param.business_card_id)
        break;
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_TASK:
        setOpenModalTaskCreate(true);
        break;
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.REGIST_SCHEDULES: {
        setOpenModalCreateCalendar(true);
        let businessCardName = '';
        if (param) {
          businessCardName = param.first_name;
          if (param.last_name) {
            businessCardName += ' ' + param.last_name;
          }
        }
        setScheduleData({
          customer: {
            customerId: param.customer_id || null,
            customerName: param.customer_name || null,
          },
          businessCards: [{
            customerName: param.customer_name ? param.customer_name : null,
            departmentName: param.department_name ? param.department_name : null,
            position: param.position ? param.position : null,
            businessCardName
          }]
        });
        break;
      }
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.POST_DATA:
        showBusinessCarrdDetail(param.business_card_id)
        break;
      case OVER_FLOW_MENU_TYPE.BUSINESS_CARD.CREATE_MAIL:
        if (param && param['email_address'] && param['email_address'].length > 0) {
          window.location.href = `mailto:${param['email_address']}`;
        }
        break;
      default:
        break;
    }
  }

  const onClickOverFlowMenu = (idAction, param) => {
    setCustomerModalId(param.customer_id);
    setCustomerModalName(param.customer_name);
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_BUSINESS_CARD:
        setOpenCreateEditBusinessCardModal(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.HISTORY_ACTIVITIES:
        showCustomerDetail(param.customer_id)
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_ACTIVITIES:
        setOpenModalCreateActivity(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_SCHEDULES:
        setOpenModalCreateCalendar(true);
        setScheduleData({
          customer: {
            customerId: param.customer_id,
            customerName: param.customer_name,
          }
        });
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.REGIST_TASK:
        setOpenModalTaskCreate(true);
        break;
      case OVER_FLOW_MENU_TYPE.CUSTOMER.POST_DATA:
        showCustomerDetail(param.customer_id)
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

  const onClosePopupCreate = typePopup => {
    document.body.className = 'wrap-card';
    setCustomerModalId(null);
    setCustomerModalName(null);
    switch (typePopup) {
      case "business-card": {
        setOpenCreateEditBusinessCardModal(false);
        break;
      }
      case "activity": {
        setOpenModalCreateActivity(false);
        setBusinessCardId(null);
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
      default:
        break;
    }
  }

  const renderModalToolTip = () => {
    return (
      <>
        {openModalCreateCalendar && <CreateEditSchedule
          onClosePopup={() => onClosePopupCreate('calendar')}
          scheduleDataParam={scheduleData}
        />}
        {openModalCreateActivity && <ActivityModalForm
          customerId={customerModalId}
          businessCardId={businessCardId}
          activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
          onCloseModalActivity={() => onClosePopupCreate('activity')}
          isOpenFromAnotherModule={true} />}
        {openCreateEditBusinessCardModal && <CreateEditBusinessCard
          customerId={customerModalId}
          customerName={customerModalName}
          closePopup={() => onClosePopupCreate('business-card')}
          iconFunction="ic-sidebar-business-card.svg"
          businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE} />}
        {openModalTaskCreate && <ModalCreateEditTask
          toggleCloseModalTask={() => onClosePopupCreate('task')}
          iconFunction="ic-task-brown.svg"
          taskActionType={TASK_ACTION_TYPES.CREATE}
          taskId={null}
          taskViewMode={TASK_VIEW_MODES.EDITABLE}
          canBack={true}
          customerId={customerModalId}
        />}
      </>
    );
  }

  const checkSaveMove = (id) => {
    const index = businessCardList.findIndex(e => e.business_card_id === id);
    if (index >= 0) {
      return (businessCardList[index]["save_mode"] !== 1);
    }
    return false;
  }

  const customHeaderField = (field) => {
    if (_.isArray(field)) {
      const idxCompanyName = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName);
      const idxPositions = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions);
      const idxEmail = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress);
      if (idxCompanyName) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.companyName")}</Popover>;
      }
      if (idxPositions) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.positionName")}</Popover>;
      }
      if (idxEmail) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.contactName")}</Popover>;
      }
    } else {
      if (field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.address) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.address")}</Popover>;
      }
    }
  }

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const getErrorInfos = (rowData) => {
    let isFocusFirstError = false;
    let isFocusFirstItemEdit = false;
    let errorInfos = null;
    if (props.errorItems && props.errorItems.length > 0) {
      const fieldNameList = fields.map(e => _.camelCase(e.fieldName));
      errorInfos = props.errorItems.filter(
        e =>
          e &&
          e.rowId.toString() === getValueProp(rowData, "businessCardId").toString() &&
          _.includes(fieldNameList, _.camelCase(e.item.toString()))
      );
    }
    if (errorInfos && errorInfos !== undefined && errorInfos.length > 0) {
      if (errorInfos[0]['rowId'] === firstBusinessCardError && errorInfos[0]['item'] === firstErrorItemError) {
        isFocusFirstError = true;
      }
    }
    if (rowData['business_card_id'] === firstBusinessCardShowInListFocus) {
      isFocusFirstItemEdit = true;
    }
    return {
      errorInfos, isFocusFirstError, isFocusFirstItemEdit
    }
  }

  const renderStringNotEdit = (typeSpecialEdit, rowData) => {
    if (typeSpecialEdit === BUSINESS_SPECIAL_FIELD_NAMES.createdUser) {
      return <a onClick={() => onClickDetailEmployee(rowData.created_user)}>
        <Popover x={-20} y={50} >
          <span>{rowData.created_user_info.employeeName}</span>
        </Popover>
      </a>;
    } else if (typeSpecialEdit === BUSINESS_SPECIAL_FIELD_NAMES.updatedUser) {
      return <a onClick={() => onClickDetailEmployee(rowData.updated_user)}>
        <Popover x={-20} y={50} >
          <span>{rowData.updated_user_info.employeeName}</span>
        </Popover>
      </a>;
    } else if (typeSpecialEdit === BUSINESS_SPECIAL_FIELD_NAMES.isWorking) {
      return rowData["is_working"] ? <>{translate("businesscards.list.isWorking.working")}</> : <>{translate("businesscards.list.isWorking.notWorking")}</>;
    } else if (typeSpecialEdit === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate) {
      return <>
        {
          rowData.business_cards_receives.map((e, index) =>
            <div key={index}><span className="mr-3">{utcToTz(e.receiveDate, DATE_TIME_FORMAT.User)}</span></div>
          )
        }
      </>
    } else {
      return <>
        {
          rowData.business_cards_receives.map((e, index) =>
            <div key={index}><span className="mr-3">{utcToTz(e.receivedLastContactDate, DATE_TIME_FORMAT.User)}</span></div>
          )
        }
      </>
    }
  }


  const isFieldSearchAvailable = (fieldBelong: number, field: any) => {
    if ((FIELD_BELONG.CUSTOMER === fieldBelong || FIELD_BELONG.ACTIVITY === fieldBelong || FIELD_BELONG.PRODUCT_TRADING === fieldBelong)
      && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    }
    return true
  }

  const renderCustomerView = (fieldColumn, rowData) => {
    if (rowData.customer_id) {
      const customerString = "customer" + rowData.business_card_id.toString();
      const activeClass = (activeIcon || openOverFlow === customerString) ? 'active' : '';
      return (
        <div className='overflow-menu' onMouseOut={(e) => { setActiveIcon(false) }}>
          <a className="d-inline-block text-ellipsis max-calc66 w-auto" title="" onClick={() => onOpenPopupCustomerDetail(rowData.customer_id, fieldColumn[0].fieldId)}>
            <Popover x={-20} y={50} >
              {rowData.customer_name ? rowData.customer_name : rowData.alternative_customer_name}
            </Popover>
          </a>
          <a title="" className="icon-small-primary icon-link-small overflow-menu-item" href={`${window.location.origin}/${props.tenant}/customer-detail/${rowData.customer_id}`} target="_blank" rel="noopener noreferrer"></a>
          <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`} onMouseLeave={(e) => setOpenOverFlow(null)}>
            <a id={rowData.business_card_id} title="" className={`icon-small-primary icon-sort-small ${activeClass}`}
              onMouseOver={(e) => { setActiveIcon(true); setActiveIconCard(false); }}
              onClick={(e) => handleFilterTooltip(e, rowData)}
              onMouseOut={(e) => e.stopPropagation()}>
            </a>
            {openOverFlow === customerString &&
              <OverFlowMenu
                setOpenOverFlow={setOpenOverFlow}
                fieldBelong={FIELD_BELONG.CUSTOMER}
                onClickOverFlowMenu={onClickOverFlowMenu}
                param={rowData}
                showTooltipActivity={props.historyActivities}
                showToolTipMail={customerModalEmail !== null}
              />}
          </div>
        </div>
      )
    } else if (rowData.alternative_customer_name) {
      return (
        <div className='overflow-menu'>
          <div className="d-inline-block text-ellipsis max-calc66 w-auto">
            <Popover x={-20} y={50} >
              {rowData.alternative_customer_name}
            </Popover>
          </div>
        </div>
      )
    }else {
      return null;
    }
  }

  const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    if (_.isArray(fieldColumn)) {
      const idxCompanyName = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName);
      const idxPositions = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions);
      const idxEmail = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress);
      if (mode === ScreenMode.DISPLAY) {
        if (idxCompanyName) {
          const businessCardString = "businessCard" + rowData.business_card_id.toString();
          const activeClassCard = (activeIconCard || openOverFlowCard === businessCardString) ? 'active' : '';
          const lastName = rowData.last_name ? rowData.last_name : "";
          return (
            <>
              {
                renderCustomerView(fieldColumn, rowData)
              }
              <div className='overflow-menu' onMouseOut={(e) => { setActiveIconCard(false) }}>
                <a className="d-inline-block text-ellipsis max-calc66 w-auto" title="" onClick={() => onOpenPopupBusinessCardDetail(rowData.business_card_id, fieldColumn[0].fieldId)} >
                  <Popover x={-20} y={50} >
                    {rowData.first_name + " " + lastName}
                  </Popover>
                </a>
                <a title="" className="icon-small-primary icon-link-small overflow-menu-item" href={`${window.location.origin}/${props.tenant}/business-card-detail/${rowData.business_card_id}`} target="_blank" rel="noopener noreferrer"></a>
                <div className={`d-inline position-relative overflow-menu-item ${heightPositionCard < 200 ? 'position-top' : ''}`} onMouseLeave={(e) => setOpenOverFlowCard(null)}>
                  <a id={rowData.business_card_id} title="" className={`icon-small-primary icon-sort-small ${activeClassCard}`}
                    onMouseOver={(e) => { setActiveIconCard(true); setActiveIcon(false); }}
                    onClick={(e) => handleFilterTooltipCard(e, rowData)}
                    onMouseOut={(e) => e.stopPropagation()}>
                  </a>
                  {openOverFlowCard === businessCardString &&
                    <OverFlowMenu
                      setOpenOverFlow={setOpenOverFlowCard}
                      fieldBelong={FIELD_BELONG.BUSINESS_CARD}
                      onClickOverFlowMenu={onClickOverFlowMenuCard}
                      param={rowData}
                      showToolTipMail={customerModalEmailCard !== null}
                      showTooltipActivity={rowData['has_activity'] !== null}
                    />}
                </div>
              </div>
              {
                checkSaveMove(rowData.business_card_id) &&
                <div className='overflow-menu'>
                  <a title="" className="button-wait save-mode-label">{translate("businesscards.list.saveMode")}</a>
                </div>
              }
            </>
          );
        }
        if (idxPositions) {
          const positionsArr = getPositionString(rowData);
          return (
            positionsArr ?
              <div>
                {
                  positionsArr.map((e, idx) => (
                    <div key={idx}>
                      <Popover x={-20} y={50} >
                        <span className="mr-3">{e}</span>
                      </Popover>
                    </div>
                  ))
                }
              </div> :
              <div>
                <Popover x={-20} y={50} >
                  <span className="mr-3">{rowData.department_name} {rowData.position}</span>
                </Popover>
              </div>
          )
        }
        if (idxEmail) {
          return (
            <>
              <div>{rowData.phone_number}</div>
              <div>{rowData.mobile_number}</div>
              {checkEmail(rowData) &&
                <div onClick={() => onClickEmail(rowData.email_address)}>
                  <a title="">
                    <Popover x={-20} y={50} >
                      <span className="mr-3">{rowData.email_address}</span>
                    </Popover>
                  </a>
                </div>
              }

            </>
          )
        }
      } else {
        let typeSpecialEdit;
        if (idxCompanyName) {
          typeSpecialEdit = EDIT_SPECIAL_ITEM.NAME;
        } else if (idxEmail) {
          typeSpecialEdit = EDIT_SPECIAL_ITEM.CONTACT;
        } else if (idxPositions) {
          typeSpecialEdit = EDIT_SPECIAL_ITEM.DEPARTMENT_NAME;
        }
        const errorInfos = getErrorInfos(rowData)
        return <SpecailEditList
          valueData={rowData}
          itemData={fieldColumn}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          typeSpecialEdit={typeSpecialEdit}
          businessCardViewMode={businessCardViewMode}
          updateFiles={updateFiles}
          errorInfos={errorInfos.errorInfos}
          isFocusFirst={errorInfos.errorInfos ? errorInfos.isFocusFirstError : errorInfos.isFocusFirstItemEdit}
          itemFirstFocus={errorInfos.errorInfos ? firstErrorItemError : firstItemInEditListFocus}
        />
      }
    } else {
      if (mode === ScreenMode.DISPLAY) {
        const fieldNameString = fieldColumn.fieldName.toString();
        if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.employeeId) {
          return <>
            {
              rowData.business_cards_receives.map((e, index) => {
                const employeeSurname = e.employeeSurname ? e.employeeSurname : "";
                const employeeName = e.employeeName ? e.employeeName : "";
                return (
                  <div key={index}>
                    <a className="task-of-milestone" onClick={() => onClickDetailEmployee(e.employeeId)}>
                      <Popover x={-20} y={50} >
                        <span>{employeeSurname}{' '}{employeeName}</span>
                      </Popover>
                    </a>
                  </div>
                )
              }
              )
            }
          </>
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.createdUser ||
          fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.updatedUser ||
          fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.isWorking ||
          fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate ||
          fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate
        ) {
          return renderStringNotEdit(fieldNameString, rowData);
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath) {
          const imgSrc = getValueProp(rowData, 'business_card_image_path');
          const imageId = getValueProp(rowData, 'business_card_id');
          return (
            <div id={imageId} className="text-over text-ellipsis width-200"
              onClick={() =>
                onOpenShowSlideImage(imageId)
              }
            >
              {imgSrc ? <a className="image_table" title="" ><img className="product-item" src={imgSrc} alt="" title="" /></a> :
                <a className="image_table no_image_table" title="" ><img className="product-item" src="../../content/images/noimage.png" alt="" title="" /></a>}
            </div>
          )
        }
      } else {
        const fieldNameString = fieldColumn.fieldName.toString();
        const errorInfosEdit = getErrorInfos(rowData)
        if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.createdUser) {
          return <a onClick={() => onClickDetailEmployee(rowData.created_user)}>{rowData.created_user_info.employeeName}</a>;
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.updatedUser) {
          return <a onClick={() => onClickDetailEmployee(rowData.updated_user)}>{rowData.updated_user_info.employeeName}</a>;
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.receivedLastContactDate) {
          return <>
            {
              rowData.business_cards_receives.map((e, index) =>
                <div className="row min-width-250" key={index} >
                  <div className="col-md-12 form-group mb-3"> <div className="DayPickerInput">
                    <div className="">
                      <div>
                        <input type="text" className="input-normal input-common2 one-item  disable" placeholder={translate("businesscards.popup.add-card-to-list.placeholder")} value={utcToTz(e.receivedLastContactDate, DATE_TIME_FORMAT.User)} />
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              )
            }
          </>
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.isWorking) {
          return <>
            <SpecailEditList
              valueData={rowData}
              itemData={fieldColumn}
              updateStateField={onUpdateFieldValue}
              nameKey={nameKey}
              typeSpecialEdit={EDIT_SPECIAL_ITEM.ISWOKING}
              businessCardViewMode={businessCardViewMode}
              updateFiles={updateFiles}
              errorInfos={errorInfosEdit.errorInfos}
            />
          </>
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath) {
          return <>
            <SpecailEditList
              valueData={rowData}
              itemData={fieldColumn}
              updateStateField={onUpdateFieldValue}
              nameKey={nameKey}
              typeSpecialEdit={EDIT_SPECIAL_ITEM.IMAGE}
              businessCardViewMode={businessCardViewMode}
              updateFiles={updateFiles}
              errorInfos={errorInfosEdit.errorInfos}
            />
          </>
        } else if (fieldNameString === BUSINESS_SPECIAL_FIELD_NAMES.employeeId) {
          return <>
            <SpecailEditList
              valueData={rowData}
              itemData={fieldColumn}
              updateStateField={onUpdateFieldValue}
              nameKey={nameKey}
              typeSpecialEdit={EDIT_SPECIAL_ITEM.EPLOYEE_ID}
              businessCardViewMode={businessCardViewMode}
              updateFiles={updateFiles}
              errorInfos={errorInfosEdit.errorInfos}
            />
          </>
        } else {
          return <>
            <SpecailEditList
              valueData={rowData}
              itemData={fieldColumn}
              updateStateField={onUpdateFieldValue}
              nameKey={nameKey}
              typeSpecialEdit={EDIT_SPECIAL_ITEM.RECEIVE_DATE}
              businessCardViewMode={businessCardViewMode}
              updateFiles={updateFiles}
              errorInfos={errorInfosEdit.errorInfos}
            />
          </>
        }
      }
    }
  }
  /* _________________Render_________________ */
  const renderSlideShowImage = () => {
    return (
      showSlideImage &&
      <SlideShow
        lstImage={lstImage}
        setShowSlideImage={setShowSlideImage}
        currentId={currentImageId}
        setCurrentBusinessCardId={setCurrentImageId}
      />
    )
  }

  /**
   * Render selection box
   */
  const renderSelectionBox = (html) => {
    setSelectionBox(html);
  }

  const changeEditMode = (isEdit: boolean) => {
    if (!isEdit) {
      executeDirtyCheck(() => {
        setSaveEditValues([]);
        setShowSwitcher(false);
        setIsDirty(true);
        setShowMessage(SHOW_MESSAGE.NONE)
        setErrorCodeList([])
        props.changeScreenMode(isEdit)
      }, null, DIRTYCHECK_PARTTERN.PARTTERN2);
    } else {
      if (!businessCardList || businessCardList.length < 1) {
        return;
      }
      setSaveEditValues([]);
      setShowSwitcher(false);
      props.changeScreenMode(isEdit)
    }
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  useEffect(() => {
    setSaveEditValues([]);
    setShowSwitcher(false);
    setShowMessage(SHOW_MESSAGE.NONE);
    setErrorCodeList([]);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }, [props.updateBusinessCards]);


  /**
   * Search ext filed belong Activities(), Sales(Product Trading), Customer()
   */
  const getFieldBelongSearchDetail = () => {
    const listFieldBelong = [];
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.CUSTOMER, isMain: false });
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.PRODUCT_TRADING, isMain: false });
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.ACTIVITY, isMain: false });
    listFieldBelong.push({ fieldBelong: FIELD_BELONG.BUSINESS_CARD, isMain: true });
    return listFieldBelong;
  }
  const getIsWorkingItem = () => {
    const publicItems = [];
    publicItems.push(
      {
        itemId: 1,
        itemLabel: translate("businesscards.create-edit.isWorking"),
        itemOrder: 1,
        isAvailable: true
      },
      {
        itemId: 0,
        itemLabel: translate("businesscards.create-edit.notWorking"),
        itemOrder: 2,
        isAvailable: true
      }
    )
    return publicItems;
  }

  const onClosePopupAddCardToList = () => {
    setOpenPopupAddCardsToList(false);
    props.resetMessageList();
  }

  const convertSpecialItemFilter = fieldInfo => {
    let data = null;
    fieldInfo.map(item => {
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardFirstName) {
        data = item;
        return;
      }
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardDepartments) {
        data = item;
        return;
      }
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress) {
        data = item;
        return;
      }
    });
    return data;
  };

  // const updateSearchCondtionGroup = (conditionGroup) => {
  //   setInfoSearchConditionList(conditionGroup);
  // }

  /**
   * Custom FieldInfo when view/edit/filter on list
   * FieldInfo type = 99
   */
  const customFieldsInfo = (field, type) => {
    const fieldCustom = _.cloneDeep(field);
    if (ControlType.FILTER_LIST === type) {
      if (_.isArray(fieldCustom)) {
        return convertSpecialItemFilter(fieldCustom);
      }
      if (field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.isWorking) {
        fieldCustom.fieldItems = getIsWorkingItem();
        fieldCustom.fieldType = DEFINE_FIELD_TYPE.CHECKBOX;
      }
      return fieldCustom;
    }
    return field;
  }
  return (
    <>
      <div className="control-esr page-employee resize-content page-business-card">
        <DndProvider backend={Backend}>
          <BusinessCardControlTop
            modeDisplay={props.screenMode}
            parentCallback={callbackFunction}
            toggleSwitchDisplay={onShowSwitchDisplay}
            toggleOpenPopupSearch={onOpenPopupSearch}
            view={view}
            toggleOpenMergeBusinessCard={onOpenMergeBusinessCard}
            toggleSwitchEditMode={changeEditMode}
            toggleUpdateInEditMode={onUpdateBusinessCards}
            recordCheckListView={listViewChecked}
            enterSearchText={enterSearchText}
            textSearch={textSearch}
            onOpenPopupAddCardsToList={onOpenPopupAddCardsToList}
            onOpenPopupMoveList={onOpenPopupMoveList}
            onOpenCreateEditBusinessCard={onOpenCreateEditBusinessCard}
            businessCardListActive={businessCardListActive}
            onOpenPopupCreateMyList={onOpenPopupCreateMyList}
            onOpenPopupCreateShareList={onOpenPopupCreateShareList}
            onShowBusinessCardSharedList={onShowBusinessCardSharedList}
            onShowBusinessCardMyList={onShowBusinessCardMyList}
            reloadScreen={reloadScreen}
            selectedTargetType={targetType}
            selectedTargetId={targetId}
            recordCheckList={recordCheckList}
            setConDisplaySearchDetail={resetConditionSearch}
            searchMode={searchMode}
            conDisplaySearchDetail={conDisplaySearchDetail}
            toggleOpenHelpPopup={handleOpenPopupHelp}
            toggleOpenPopupSetting={handleOpenPopupSetting}
            onUpdateBusinessCardsList={changeBusinessCardsList}
            menuType={menuType}
            openSwitchDisplay={showSwitcher}
            openPopupHelp={onOpenPopupHelp}
          />
          <div className="wrap-control-esr style-3">
            <div className="esr-content">

              <BusinessCardControlSidebar
                businessCardListActive={onChangeBusinessCardListActive}
                onShowBusinessCardSharedList={onShowBusinessCardSharedList}
                onShowBusinessCardMyList={onShowBusinessCardMyList}
                targetType={selectedTargetType}
                targetId={selectedTargetId}
                changeSelectedSidebar={changeSelectedSidebar}
                sidebarCurrentId={actionSetSidebarId}
                setTypeGroup={onSetTypeGroup}
                toggleShowFeaturesIcon={updateListMenuType}
                toggleOnDrag={setIsOnDrag}
                updateFiltersSearch={updateFiltersLocalMenu}
                getGroupName={getGroupName}
                handleGetInitializeListInfo={() => props.handleGetInitializeListInfo(FIELD_BELONG.BUSINESS_CARD)}
                onUpdateBusinessCardsList={toggleUpdateBusinessCardsList}
                dirtyCheck={executeDirtyCheck}
                isOnDrag={isOnDrag}
              />
              <div className={showSwitcher ? "esr-content-body esr-content-body2 overflow-hidden" : "esr-content-body overflow-hidden"}>
                <div className="esr-content-body-main mw-auto w-auto">
                  {renderErrorMessage()}
                  <div className="pagination-top">
                    <div className="esr-pagination">
                      <BusinessCardDisplayCondition
                        conditions={conditionSearch}
                        filters={filterConditions}
                        searchMode={searchMode}
                        infoSearchConditionList={infoSearchConditionList}
                        sidebarCurrentId={sidebarCurrentId}
                      />
                      {fieldInfos && totalRecords > 0 && props.businessCardList &&
                        <PaginationList offset={offset} limit={limit} totalRecords={totalRecords}
                          onPageChange={onPageChange} />
                      }
                    </div>
                  </div>
                  {view === 2 ? <BusinessCardListView
                    businessCardList={businessCardList}
                    businessCardListChecked={listChecked}
                    handleSearchListView={handleSearchListView}
                    setOrderView={setOrderView}
                    onDragRow={onDragRow}
                    renderSelectionBox={renderSelectionBox}
                    resetScreen={resetScreen}
                    handleResetScreen={props.handleResetScreen}
                    businessCardListActive={businessCardListActive}

                  /> :
                    <DynamicList ref={tableListRef} id={BUSINESS_CARD_LIST_ID}
                      records={businessCardList} mode={props.screenMode}
                      checkboxFirstColumn={true} keyRecordId={"businessCardId"}
                      belong={FIELD_BELONG.BUSINESS_CARD}
                      fieldInfoType={FieldInfoType.Personal}
                      errorRecords={props.errorItems}
                      onActionFilterOrder={onActionFilterOrder}
                      onUpdateFieldValue={onUpdateFieldValue}
                      onDragRow={onDragRow}
                      tableClass={"table-list table-card"}
                      updateFiles={updateFiles}
                      // onClickCell={onOpenPopupBusinessCardDetail}
                      totalRecords={totalRecords}
                      fieldNameExtension="business_card_data"
                      customContentField={customContentField}
                      getCustomFieldInfo={customFieldsInfo}
                      onSelectedRecord={getSelectedRecord}
                      targetType={targetType}
                      targetId={targetId}
                      showMessage={showMessageDownloadFile}
                      setShowSlideImage={onOpenShowSlideImage}
                      customHeaderField={customHeaderField}
                      firstFocus={props.errorItems ? { id: firstBusinessCardError, item: firstErrorItemError, nameId: 'business_card_id' } : { id: firstBusinessCardShowInListFocus, item: firstItemInEditListFocus, nameId: 'business_card_id' }}
                    />}
                </div>
                {selectionBox}
              </div>
              {showSwitcher && <SwitchFieldPanel dataSource={customFields}
                dataTarget={fields}
                onCloseSwitchDisplay={() => setShowSwitcher(false)}
                onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
                onDragField={onDragField}
                fieldBelong={FIELD_BELONG.BUSINESS_CARD}
                isAdmin={isAdmin}
              />}
            </div>
            <div className="business-card-list-mess">{renderToastMessage()}</div>
          </div>
          {openPopupSearch &&
            <PopupFieldsSearchMulti
              iconFunction="ic-sidebar-business-card.svg"
              listFieldBelong={getFieldBelongSearchDetail()}
              conditionSearch={conditionSearch}
              onCloseFieldsSearch={onClosePopupSearch}
              onActionSearch={handleSearchPopup}
              isFieldAvailable={isFieldSearchAvailable}
            />
          }
        </DndProvider>
        {openPopupAddCardsToList &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-add-cards-to-list" autoFocus={true} zIndex="auto">
            <PopupAddCardsToList
              setOpenPopupAddCardsToList={setOpenPopupAddCardsToList}
              onClosePopupAddCardToList={onClosePopupAddCardToList}
              listIdChecked={listIdChecked}
            />
          </Modal>
        }
        {openPopupMoveList &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-add-cards-to-list" autoFocus={true} zIndex="auto">
            <PopupMoveList
              idOfOldList={selectedTargetId}
              mode={2}
              closePopupMoveList={closePopupMoveList}
              listOfBusinessCardId={listIdChecked}
              reloadScreen={reloadScreen}
            />
          </Modal>
        }
        {openCreateEditBusinessCard &&
          <CreateEditBusinessCard
            businessCardId={businessCardId}
            closePopup={closeCreateEditBusinessCard}
            businessCardActionType={businessCardActionType}
            businessCardViewMode={businessCardViewMode}
          />
        }
        {openPopupBusinessCardDetail &&
          <BusinessCardDetail
            key={businessCardId}
            showModal={true}
            businessCardId={businessCardId}
            listBusinessCardId={getListBusinessCardId()}
            toggleClosePopupBusinessCardDetail={onClosePopupBusinessCardDetail}
            toggleOpenPopupBusinessCardEdit={onOpenCreateEditBusinessCard}
            isList={openFromList}
            businessCardList={props.businessCardList ? props.businessCardList.businessCards : []}
            openBusinessCardDetailFromOther={openBusinessCardDetailFromOther}
            businessCardAddEditMsg={businessCardAddEditMsg}
            resetSuccessMessage={() => { setBusinessCardAddEditMsg(null) }}
            activities={activities}
          />}
        {openMergeBusinessCard &&
          <MergeBusinessCard
            toggleClosePopup={() => {
              setOpenMergeBusinessCard(false);
              props.handleSearchBusinessCard(selectedTargetType, selectedTargetId, 0, limit, textSearch, filterConditions, orderBy)
            }}
            disableBack={true}
            showModal={showModal}
          />
        }

        {openBusinessCardMyList && businessCardMyListData &&
          <BusinessCardMySharedListModal
            iconFunction={ICON_BAR_BUSINESSCARDS}
            listMode={businessCardMyListData.listMode}
            listId={businessCardMyListData.listId}
            isAutoList={businessCardMyListData.isAutoList}
            listMembers={businessCardMyListData.listMembers}
            dataFieldLayout={customFields}
            handleCloseBusinessCardMySharedListModal={handleCloseBusinessCardMyListModal}
            listType={GROUP_TYPE.MY}
            classInfo={'wrap-my-share-list'}
            labelTranslate={'business-card-my-list-modal'}
            placeHolder={"global.group.business-card-shared-list-modal.placeholderOfSearch"}
          // updateSearchCondtionGroup={updateSearchCondtionGroup}
          />
        }
        {openBusinessCardSharedList && businessCardSharedListData &&
          <BusinessCardMySharedListModal
            iconFunction={ICON_BAR_BUSINESSCARDS}
            listMode={businessCardSharedListData.listMode}
            listId={businessCardSharedListData.listId}
            isAutoList={businessCardSharedListData.isAutoList}
            listMembers={businessCardSharedListData.listMembers}
            dataFieldLayout={customFields}
            handleCloseBusinessCardMySharedListModal={handleCloseBusinessCardSharedListModal}
            listType={GROUP_TYPE.SHARED}
            labelTranslate={'business-card-shared-list-modal'}
            placeHolder={"global.group.business-card-shared-list-modal.placeholderOfSearch"}
          />
        }

        {/* {openBusinessCardMyList &&
          <AddEditMyBusinessCardModal
            onCloseAddEditMyList={handleCloseBusinessCardMyListModal}
            sideBarCurrentId={listId}
            myListModalMode={myListModalMode}
            customFieldsInfo={customFields}
            popout={false}
          />
        }

        {openBusinessCardSharedList &&
          <ModalSharedList
            iconFunction="ic-sidebar-business-card.svg"
            onCloseModal={handleCloseBusinessCardSharedListModal}
            groupMode={groupMode}
            groupId={listId}
            isAutoGroup={isAutoShareGroup}
            groupMembers={groupMember}
            customFieldsInfo={customFields}
          />
        }*/}

        {openPopupCreateShareList &&
          <PopupCreateShareList
            listIdChecked={listIdChecked}
            setOpenPopupCreateShareList={onSetOpenPopupCreateShareList}
            popout={false}
            listId={1}
          />
        }
        {openPopupCreateMyList &&
          <Modal isOpen={true} fade={true} toggle={() => {
          }} backdrop={true} id="popup-create-my-list" autoFocus={true} zIndex="auto">
            <PopupCreateMyList
              listIdChecked={listIdChecked}
              setOpenPopupCreateMyList={onSetOpenPopupCreateMyList}
              onClosePopupCreateMyList={onClosePopupCreateMyList}
            />
          </Modal>
        }

        {openPopupEmployeeDetail &&
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            resetSuccessMessage={() => { }} />
        }
        {openPopupCustomerDetail && showDetailScreen(customerIdDetail, getListCustomerId())}
        {/* <BrowserDirtyCheck isDirty={isDirty && props.screenMode === ScreenMode.EDIT} /> */}
        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
        {renderSlideShowImage()}
        {renderModalToolTip()}
        <GlobalControlRight />
      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.businessCard} dismissDialog={dismissDialogHelp} />}
    </>
  );
};

/**
 * Map State To Props
 * @param param0
 */
const mapStateToProps = ({ businessCardList, dynamicList, authentication, mergeBusinessCard, businessCardDetail, applicationProfile, myListModalState, customerList }: IRootState) => ({
  authorities: authentication.account.authorities,
  fieldInfos: dynamicList.data.has(BUSINESS_CARD_LIST_ID) ? dynamicList.data.get(BUSINESS_CARD_LIST_ID).fieldInfos : {},
  recordCheckList: dynamicList.data.has(BUSINESS_CARD_LIST_ID) ? dynamicList.data.get(BUSINESS_CARD_LIST_ID).recordCheckList : [],
  customFieldInfos: businessCardList.customFieldInfos,
  screenMode: businessCardList.screenMode,
  errorItems: businessCardList.errorItems,
  businessCardList: businessCardList.businessCardList,
  errorCodeList: businessCardList.errorCodeList,
  createBusinessCardsList: businessCardList.createBusinessCardsList,
  updateBusinessCards: businessCardList.updateBusinessCards,
  deleteList: businessCardList.deleteList,
  addFavoriteList: businessCardList.addFavoriteList,
  removeFavoriteList: businessCardList.removeFavoriteList,
  mergeSuccess: mergeBusinessCard.mergeSuccess,
  deleteDetail: businessCardDetail.deleteBusinessCards,
  resetScreen: businessCardList.resetScreen,
  BusinessCardsAction: businessCardList.action,
  msgSuccess: businessCardList.msgSuccess,
  addMyListSuccess: myListModalState.successMessage,
  tenant: applicationProfile.tenant,
  errorMessage: businessCardList.errorMessage,
  updateList: businessCardList.updateBusinessCardsList,
  updateBusinessCardsList: businessCardList.updateBusinessCardsList,
  infoSearchConditionList: businessCardList.infoSearchConditionList,
  historyActivities: customerList.historyActivities,
  listBusinessCardList: businessCardList.listBusinessCardList,
  action: businessCardList.action,
  idOfListRefresh: businessCardList.idOfListRefresh
});

/**
 * Map Dispatch To Props
 */
const mapDispatchToProps = {
  changeScreenMode,
  getCustomFieldsInfo,
  handleSearchBusinessCard,
  handleGetBusinessCardList,
  handleSearchBusinessCardView,
  handleInitBusinessCard,
  handleUpdateBusinessCards,
  handleGetInitializeListInfo,
  reset,
  handleRecordCheckItem,
  handleDragDropBusinessCard,
  getFieldInfoPersonals,
  resetMessageList,
  handleUpdateBusinessCardsList,
  getSearchConditionInfoList,
  handleGetCustomerHistoryAcivities,
  handleResetScreen
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCardList);
