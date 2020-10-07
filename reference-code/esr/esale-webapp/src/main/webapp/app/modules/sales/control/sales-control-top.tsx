import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SALES_LIST_ID,
  SEARCH_MODE,
  SHARE_GROUP_MODES,
  MENU_TYPE,
  LIST_MODE,
  LIST_TYPE,
  PARTICIPANT_TYPE,
  GROUP_TYPES
} from '../constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getJsonBName } from 'app/modules/sales/utils';
import _ from 'lodash';
import { handleRemoveProductTradingFromList } from '../sales-list/sales-list.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { AUTHORITIES, ScreenMode } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import useClickOutSide from '../hooks/useClickOutSide';
import DatePicker from 'app/shared/layout/common/date-picker';
import { decodeUserLogin, jsonParse, getFieldLabel } from 'app/shared/util/string-utils';
// import { handleSubmitGroupInfos } from '../shared-group/shared-group.reducer';
import { handleSubmitGroupInfos } from '../my-shared-list/sales-my-shared-list-modal.reducer';

interface IControlTopProps extends StateProps, DispatchProps {
  // handle open popup setting
  toggleOpenPopupSetting;
  // handle open switch display
  toggleSwitchDisplay;
  // handle open popup search detail
  toggleOpenPopupSearch;
  // handle update progress of records
  handleChooseProgress;
  // list recode
  listProductsTrading;
  // list progress
  listprogresses;
  // list progress for card,
  listProgressesForCard;
  // view mode
  view;
  // action set view mode
  setView;
  // text search old
  textSearchOld?: string;
  // text search
  textSearch?: string;
  // display mode
  modeDisplay?: ScreenMode;
  // search mode
  searchMode: any;
  // action set search mode
  setSearchMode;
  // search details condition
  conDisplaySearchDetail: any;
  // action search details condition
  setConDisplaySearchDetail: (boolean) => void;
  // action search text
  enterSearchText?: (text) => void;
  // action reload screen when clear search condition
  reloadScreenControlTop;
  // menu type
  menuType;
  // action switch edit mode
  toggleSwitchEditMode?: (isEdit: boolean) => void;
  // action update data
  toggleUpdateInEditMode?: () => void;
  // record checklist of cardview mode
  recordCheckListView;

  recordCheckLists: any[];

  selectedTargetType: number;
  selectedTargetId: number;
  reloadScreen?: () => void;
  openSwitchDisplay?: boolean;
  handleDeleteProductTradings;

  // ADD-MY-LIST
  toggleOpenAddEditMyGroupModal: (myGroupModalMode, groupId, isAutoGroup) => void;

  openSaleCreateShareGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;

  sidebarCurrentId?: any;

  listMenuType?;

  // handle change display feature
  toggleChangeDisplay?: () => void;

  // handle expand/collapse all trading detail
  handleCollapse?: any;
  onShowSwitchDisplayCard?: any;
  changeDisplayOn?: any;

  openSaleCreateMyGroupModal?: () => void;

  toggleOpenMoveToGroupModal?: () => void;

  toggleOpenAddToGroupModal?: () => void;

  collapseCardView?: () => void;

  expandCardView?: () => void;

  fieldInfoHint?: any;
  isCollapse: boolean;

  // handle date in left top corner
  setSettingDate?: (date) => void;
  settingDate?: any;
  // handle new action in top control
  handleUpdateAutoGroup?: any;
  handleAddToFavorite?: (id) => void;
  handleRemoveFromFavorite?: (id) => void;
  toggleOpenAddEditModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  handleDeleteGroup: (groupId) => void;
  handleReloadScreenLocalMenu: (type: any) => void;
  setMenuType: any;
  setSidebarCurrentId?: (id) => void;
  setActive?: (item) => void;
  setActiveCard?: (item) => void;
  // fix bug #17667
  showSwitcher: boolean;
  toggleOpenHelpPopup;
  handleAfterActionCard?: any;
}

interface IDynamicListStateProps {
  authorities;
}

type ISaleControlTopProps = IControlTopProps & IDynamicListStateProps;
/**
 * component of control top screen
 * @param props
 */
const SalesControlTop = (props: ISaleControlTopProps) => {
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);

  const [recordCheckList, setRecordCheckList] = useState([]);
  const optionRef = useRef(null);
  const optionRegisterRef = useRef(null);
  const dropDownCollapseRef = useRef(null);
  const [showRegistrationOption, setShowRegistrationOption] = useState(false);
  // const [openSalesCreateMyGroup, setOpenSaleCreateMyGroup] = useState(false); // ADD_TO_GROUP
  // const [openSalesCreateSharedGroup, setOpenSaleCreateShareGroup] = useState(false); // ADD_TO_GROUP
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCollapseExpand, setShowCollapseExpand] = useState(false);

  const { toggleOpenPopupSetting, toggleSwitchDisplay, sidebarCurrentId, listMenuType } = props;
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  // change new design
  const hintRef = useRef(null);
  const [showHint, setShowHint] = useState(false);
  const [actionType, setActionType] = useState("collapse")

  useClickOutSide(hintRef, () => setShowHint(false));

  // useCallback(() => {
  //   onDateChanged(date);
  // }, [date]);

  useEffect(() => {
    if (!props.textSearch) {
      setValueTextSearch("")
    }
  }, [props.textSearch])

  const toggle = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const checkDisable = () => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      return '';
    } else {
      return 'disable';
    }
  };

  const handleClickOutsideOption = e => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
    if (optionRegisterRef.current && !optionRegisterRef.current.contains(e.target)) {
      setShowRegistrationOption(false);
    }
    if (dropDownCollapseRef.current && !dropDownCollapseRef.current.contains(e.target)) {
      setShowCollapseExpand(false);
    }
  };

  useEventListener('click', handleClickOutsideOption);

  /**
   * Reload screen after leaving group/updating auto group/removing manager
   */
  useEffect(() => {
    if (props.leaveGroupProductTradingsId !== null || props.relatedProductTradingData !== null) {
      props.reloadScreen();
    }
  }, [props.leaveGroupProductTradingsId, props.relatedProductTradingData]);

  useEffect(() => {
    if (props.view === 1) {
      setRecordCheckList(props.recordCheckLists);
    }

    if (props.view === 2) {
      setRecordCheckList(props.recordCheckListView);
    }
  }, [props.recordCheckLists, props.recordCheckListView]);

  /**
   * Check having any record was checked or not
   */
  const hasRecordCheck = () => {
    if (props.view === 2) {
      return props.recordCheckListView && props.recordCheckListView.length > 0;
    }

    return props.recordCheckLists && props.recordCheckLists.length > 0 && props.recordCheckLists.filter(e => e.isChecked).length > 0;
  };

  /**
   * action switch view mode
   * @param type
   */
  const switchView = type => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      setRecordCheckList([]);
      props.setView(type);
    }
  };

  /**
   * action open switch display
   * @param event
   */
  const onClickSwitchDiaplay = event => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      toggleSwitchDisplay();
      event.preventDefault();
    }
  };

  /**
   * handle action open popup search details
   * @param event
   */
  const onClickOpenPopupSearch = event => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      props.toggleOpenPopupSearch();
      event.preventDefault();
    }
  };

  /**
   * get list record checked
   */
  const createListprtTradingId = () => {
    const prtTradingId = [];
    recordCheckList.forEach(prtTrading => {
      prtTradingId.push(prtTrading.productTradingId);
    });
    return prtTradingId;
  };

  /**
   * handle action update progress
   * @param productTradingProgressId
   */
  const handleUpdateProductsTrading = async productTradingProgressId => {
    setShowRegistrationOption(!showRegistrationOption);

    // show common confirm dialog
    const result = await ConfirmDialog({
      title: <>{translate('sales.top.title.popupChangeStatus')}</>,
      message: translate('messages.WAR_TRA_0001'),
      confirmText: translate('sales.top.dialog.confirm-change'),
      confirmClass: 'button-red',
      cancelText: translate('sales.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });

    if (result) {
      props.handleChooseProgress(productTradingProgressId);
    }
  };

  /**
   * handle action delete records
   */
  const handleDelete = async () => {
    const prtTradingId = createListprtTradingId();
    let objDelete = {};
    const count = prtTradingId.length;
    objDelete = _.find(props.listProductsTrading, function (chr) {
      return chr.product_trading_id === prtTradingId[0];
    });
    // show common confirm dialog
    const result = await ConfirmDialog({
      title: <>{translate('sales.top.dialog.title-delete-group')}</>,
      message:
        recordCheckList.length === 1
          ? translate('messages.WAR_COM_0001', { itemName: objDelete['product_name'] })
          : translate('messages.WAR_COM_0002', { 0: count }),
      confirmText: translate('sales.top.dialog.confirm-delete-group'),
      confirmClass: 'button-red',
      cancelText: translate('sales.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      props.handleDeleteProductTradings(prtTradingId);
    }
  };

  /**
   * get checked employees in list from recordCheckList
   */
  const getCheckedProductTradingsFromCheckList = () => {
    const listCheckedIds = [];
    const listUpdatedDates = [];
    if (props.view === 1) {
      props.recordCheckLists.forEach(e => {
        if (e.isChecked) {
          listCheckedIds.push(e.productTradingId);
          listUpdatedDates.push(e.updatedDate);
        }
      });
    } else {
      props.recordCheckListView.forEach(ele => {
        listCheckedIds.push(ele.productTradingId);
        listUpdatedDates.push(ele.updatedDate);
      })
    }
    return { listCheckedIds, listUpdatedDates };
  };


  /**
   * Show dialog to confirm update auto group
   */
  const showAutoGroupDialog = async () => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    const groupName = valueOfList[0].listName;
    const result = await ConfirmDialog({
      title: <>{translate('employees.top.dialog.title-auto-group')}</>,
      message: translate('messages.WAR_EMP_0004', { groupName }),
      confirmText: translate('employees.top.dialog.confirm-auto-group'),
      confirmClass: 'button-red',
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      props.handleUpdateAutoGroup(props.sidebarCurrentId).then(() => {
        if (props.view === 2) {
          props.handleAfterActionCard();
        }
      });
    }
  };

  const removeProductTradingsFromlist = async () => {
    const checkedLength = getCheckedProductTradingsFromCheckList().listCheckedIds.length;
    if (hasRecordCheck()) {
      const result = await ConfirmDialog({
        title: <>{translate('sales.top.dialog.title-leave-group')}</>,
        message: translate('sales.top.dialog.message-leave-list', { 0: checkedLength }),
        confirmText: translate('sales.top.dialog.confirm-leave-group'),
        confirmClass: 'button-red',
        cancelText: translate('sales.top.dialog.cancel-text'),
        cancelClass: 'button-cancel'
      });
      if (result) {
        const listCheckedIds = getCheckedProductTradingsFromCheckList().listCheckedIds;
        const number = 2
        props.handleRemoveProductTradingFromList(sidebarCurrentId, listCheckedIds).then(() => {
          if (props.view === number) {
            props.handleAfterActionCard();
          }
        });
      }
    }
  };

  /**
   * action unfocus textbox search
   * @param event
   */
  const onBlurTextSearch = event => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  };

  /**
   * handle event key press on textbox search
   * @param event
   */
  const handleKeyPress = event => {
    if (event.charCode === 13) {
      if (props.enterSearchText) {
        setValueTextSearchOld(valueTextSearch.trim());
        props.enterSearchText(valueTextSearch.trim());
      }
    }
  };

  /**
   * action cancel search details
   */
  const cancelSearchConditions = () => {
    props.setConDisplaySearchDetail(false);
    props.setSearchMode(SEARCH_MODE.NONE);
    props.reloadScreenControlTop(props.menuType);
  };

  /**
   * open dropdown select menu
   */
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleShowCollapseExpand = useCallback(() => {
    setShowCollapseExpand(!showCollapseExpand);
  }, [showCollapseExpand]);

  const onHandleCollapse = useCallback(
    action => () => {
      props.handleCollapse(action);
      setActionType(action)
      toggleShowCollapseExpand();
    },
    [showCollapseExpand]
  );

  /**
   * open modal create my group
   */
  const onOpenSaleCreateMyGroup = () => {
    toggleDropdown();
    props.openSaleCreateMyGroupModal();
  };

  /**
   * open modal create share group
   */
  const onOpenSaleCreateShareGroup = () => {
    toggleDropdown();
    props.openSaleCreateShareGroupModal(SHARE_GROUP_MODES.MODE_CREATE_GROUP, sidebarCurrentId, false, listMenuType.isAutoGroup, null);
  };
  const onClickOpenMoveToGroupModal = event => {
    props.toggleOpenMoveToGroupModal();
    event.preventDefault();
  };

  const onClickOpenAddToGroupModal = event => {
    props.toggleOpenAddToGroupModal();
    event.preventDefault();
  };

  const checkTypeOfSelectedList = () => {
    let favorite = false;
    let autoList = false;
    if (props.menuType === MENU_TYPE.SHARED_GROUP || props.menuType === MENU_TYPE.MY_GROUP || props.menuType === MENU_TYPE.FAVORITE_GROUP) {
      const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
      const newGroupData = [...myGroups, ...sharedGroups];
      const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
      if (!_.isEmpty(valueOfList)) {
        if (valueOfList[0].displayOrderOfFavoriteList) {
          favorite = true;
        }
        if (valueOfList[0].listMode === LIST_MODE.AUTO) {
          autoList = true;
        }
      }
    }
    return { favorite, autoList };
  };



  const checkOwner = () => {
    const infoUserLogin = decodeUserLogin();
    const myId = parseInt(infoUserLogin['custom:employee_id'], 10);
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    if (valueOfList && valueOfList[0]) {
      const ownerList = jsonParse(valueOfList[0].ownerList);
      if (_.includes(ownerList.employeeId, myId)) {
        return true;
      }
    }
    return false;
  };

  /**
   * remove from favorite
   */
  const handleFavoriteAction = () => {
    if (checkTypeOfSelectedList().favorite) {
      props.handleRemoveFromFavorite(props.sidebarCurrentId);
    } else {
      props.handleAddToFavorite(props.sidebarCurrentId);
    }
  };

  const handleEdit = () => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    if (valueOfList && valueOfList[0]) {
      valueOfList[0].listType === LIST_TYPE.SHARE_LIST
        ? props.openGroupModal(SHARE_GROUP_MODES.MODE_EDIT_GROUP, props.sidebarCurrentId, false, checkTypeOfSelectedList().autoList, null)
        : props.toggleOpenAddEditModal(
          SHARE_GROUP_MODES.MODE_EDIT_GROUP,
          props.sidebarCurrentId,
          false,
          checkTypeOfSelectedList().autoList,
          null
        );
    }
  };

  /**
   * Show dialog to confirm delete group
   * @param sourceGroup
   */
  const showDeleteGroupDialog = async sourceGroup => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    const groupName = valueOfList[0].listName;
    const result = await ConfirmDialog({
      title: <>{translate('sales.top.dialog.title-delete-group')}</>,
      message: translate('sales.top.dialog.message-delete-group', { groupName }),
      confirmText: translate('sales.top.dialog.confirm-delete-group'),
      confirmClass: 'button-red',
      cancelText: translate('sales.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      props.setMenuType(MENU_TYPE.ALL_PRODUCT_TRADING);
      props.setSidebarCurrentId(null);
      props.handleDeleteGroup(props.sidebarCurrentId);
    }
  };

  const handleCoppyList = () => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    if (valueOfList && valueOfList[0]) {
      valueOfList[0].listType === LIST_TYPE.SHARE_LIST
        ? props.openGroupModal(SHARE_GROUP_MODES.MODE_COPY_GROUP, props.sidebarCurrentId, false, checkTypeOfSelectedList().autoList, null)
        : props.toggleOpenAddEditModal(
          SHARE_GROUP_MODES.MODE_COPY_GROUP,
          props.sidebarCurrentId,
          false,
          checkTypeOfSelectedList().autoList,
          null
        );
    }
  };

  const getInitGroupParams = dataList => {
    const ownerList = jsonParse(dataList.ownerList);
    const viewerList = jsonParse(dataList.viewerList);
    const groupParticipants = [...ownerList.employeeId, ...viewerList.employeeId];
    return {
      groupId: dataList.listId,
      groupName: dataList.listName,
      groupType: GROUP_TYPES.SHARED_GROUP,
      isAutoGroup: dataList.listMode === LIST_MODE.AUTO,
      isOverWrite: dataList.isOverWrite,
      groupMembers: [],
      groupParticipants: groupParticipants.map(id => ({
        employeeId: id,
        participantType: PARTICIPANT_TYPE.OWNER
      })),
      searchConditions: []
    };
  };

  const handleChangeMyListToShareList = dataList => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    if (valueOfList && valueOfList[0]) {
      const initParam = getInitGroupParams(valueOfList[0]);
      const groupIdIn = initParam.groupId;
      // const groupNameIn = initParam.groupName;
      // const groupTypeIn = initParam.groupType;
      const isAutoGroupIn = initParam.isAutoGroup;
      // const isOverWriteIn = initParam.isOverWrite;
      const groupMembersIn = initParam.groupMembers;
      // const groupParticipantsIn = initParam.groupParticipants;
      // const searchConditionsIn = initParam.searchConditions;
      // let updatedDate = dataList.updatedDate;
      // if (!dataList) {
      //   updatedDate = new Date();
      // }
      props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, groupIdIn, true, isAutoGroupIn, groupMembersIn)
      // props.handleSubmitGroupInfos(
      //   groupIdIn,
      //   groupNameIn,
      //   groupTypeIn,
      //   isAutoGroupIn,
      //   isOverWriteIn,
      //   groupMembersIn,
      //   groupParticipantsIn,
      //   searchConditionsIn,
      //   updatedDate,
      //   SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE
      //   // null
      // );
    }
  };
  /**
   * Show dialog to confirm change my list to shared list
   * @param sourceGroup
   */
  const showChangeListDialog = async sourceGroup => {
    // const groupName = sourceGroup.listName;
    const result = await ConfirmDialog({
      title: <>{translate('employees.top.dialog.title-auto-group')}</>,
      message: translate('sales.top.dialog.change-my-list-to-share-list'),
      confirmText: translate('sales.top.dialog.confirm-change'),
      confirmClass: 'button-blue',
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });
    if (result) {
      handleChangeMyListToShareList(sourceGroup);
    }
  };

  const checkMyList = () => {
    const { myGroups, sharedGroups } = props.localMenu.initializeLocalMenu;
    const newGroupData = [...myGroups, ...sharedGroups];
    const valueOfList = newGroupData.filter(elm => _.toString(elm.listId) === _.toString(props.sidebarCurrentId));
    if (valueOfList && valueOfList[0]) {
      return valueOfList[0].listType === LIST_TYPE.MY_LIST;
    }
    return false;
  };

  // const checkShareListOwner = () => {
  //   if((checkMyList() === false && checkOwner() && checkTypeOfSelectedList().autoList === true) || 
  //   props.menuType === MENU_TYPE.FAVORITE_GROUP && checkMyList() === false && checkOwner() && checkTypeOfSelectedList().autoList === true){
  //     props.onlyShowShare(true);
  //   }
  // }

  const renderDropDownCheckList = () => {
    if (showDropdown) {
      return (
        <div className="box-select-option width-200 l-0">
          <ul>
            {checkTypeOfSelectedList().autoList && (checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && (
              <li>
                <a
                  onClick={() => {
                    setShowDropdown(false);
                    showAutoGroupDialog();
                  }}
                >
                  <span className="mr-2">
                    <img
                      src="../../../content/images/common/ic-content-paste.svg"
                      title=""
                      alt=""
                    />
                  </span>
                  {translate('sales.group-card.submenu.update-list')}
                </a>
              </li>
            )}
            <li>
              <a onClick={onClickOpenAddToGroupModal}>
                <span className="mr-2">
                  <img src="../../../content/images/common/ic-content-paste.svg" title="" alt="" />
                </span>
                <span>{translate('sales.top.title.add-to-group')}</span>
              </a>
            </li>
            {/* {(props.menuType === MENU_TYPE.MY_GROUP ||
              props.menuType === MENU_TYPE.SHARED_GROUP ||
              (props.menuType === MENU_TYPE.FAVORITE_GROUP && checkMyList())) &&
              checkOwner() && (
                <li>
                  <a onClick={onClickOpenMoveToGroupModal}>
                    <span className="mr-2">
                      <img
                        src="../../../content/images/common/ic-content-paste.svg"
                        title=""
                        alt=""
                      />
                    </span>
                    <span>{translate('sales.top.title.move-group')}</span>
                  </a>
                </li>
              )} */}
            {((checkMyList() && checkTypeOfSelectedList().autoList === false) ||
              (props.menuType === MENU_TYPE.FAVORITE_GROUP && checkMyList() && checkTypeOfSelectedList().autoList === false) ||
              // (checkMyList() === false && checkOwner() && checkTypeOfSelectedList().autoList === false))
              (checkMyList() === false && (checkOwner() || props.menuType === MENU_TYPE.MY_GROUP)))
              && (
                <li>
                  <a onClick={onClickOpenMoveToGroupModal}>
                    <span className="mr-2">
                      <img
                        src="../../../content/images/common/ic-content-paste.svg"
                        title=""
                        alt=""
                      />
                    </span>
                    <span>{translate('sales.top.title.move-group')}</span>
                  </a>
                </li>
              )}
            <li>
              <a onClick={onOpenSaleCreateMyGroup} title="">
                <span className="mr-2">
                  <img src="../../../content/images/common/ic-content-paste.svg" title="" alt="" />
                </span>
                {translate('sales.top.title.create-my-list')}
              </a>
            </li>
            <li>
              <a onClick={onOpenSaleCreateShareGroup} title="">
                <span className="mr-2">
                  <img src="../../../content/images/common/ic-content-paste.svg" title="" alt="" />
                </span>
                {translate('sales.top.title.create-share-list')}
              </a>
            </li>
            {(checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && (
              <li>
                <a
                  onClick={() => {
                    setShowDropdown(false);
                    removeProductTradingsFromlist();
                  }}
                >
                  <span className="mr-2">
                    <img
                      src="../../../content/images/common/ic-content-paste.svg"
                      title=""
                      alt=""
                    />
                  </span>
                  {translate('sales.top.title.leave-group')}
                </a>
              </li>
            )}
          </ul>
        </div>
      );
    }
    return null;
  };

  const renderActionRecordCheckList = () => {
    if (recordCheckList.length > 0) {
      return (
        <>
          <span className="p-2">{translate('sales.top.title.change-progress-title')}</span>
          <div className="form-group m-0 mr-2">
            <div className={`select-option bg-white ${checkDisable()} d-flex align-items-center`} ref={optionRegisterRef}>
              <span
                className={`select-text ${checkDisable()}`}
                onClick={() => !checkDisable() && setShowRegistrationOption(!showRegistrationOption)}
              >
                {translate('sales.top.title.change-progress-button')}
              </span>
              {showRegistrationOption && (
                <div className="drop-down drop-down2 show l-0">
                  {props.view === 1 ? (
                    <ul>
                      {props.listprogresses.length > 0 &&
                        props.listprogresses.map((progresses, index) => (
                          <li key={progresses.productTradingProgressId} className="item smooth">
                            <div
                              onClick={() =>
                                handleUpdateProductsTrading(progresses.productTradingProgressId)
                              }
                              className="text text2"
                            >
                              {getFieldLabel(progresses, 'progressName')}
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                      <ul>
                        {props.listProgressesForCard.length > 0 &&
                          props.listProgressesForCard.map((progresses, index) => (
                            <li key={progresses.productTradingProgressId} className="item smooth">
                              <div
                                onClick={() =>
                                  handleUpdateProductsTrading(progresses.productTradingProgressId)
                                }
                                className="text text2"
                              >
                                {getFieldLabel(progresses, 'progressName')}
                              </div>
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className={`button-pull-down-parent`} ref={optionRef}>
            <a onClick={!checkDisable() && toggleDropdown} title="" className={`button-pull-down ${checkDisable()}`}>
              {translate('sales.top.list-operation')}
            </a>
            {renderDropDownCheckList()}
          </div>
          <a className={`${checkDisable()} icon-primary icon-erase`} onClick={!checkDisable() && handleDelete}>
            <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-erase')}</span></label>
          </a>
        </>
      );
    }
    return null;
  };

  const renderLocalTool = () => {
    if (
      (props.menuType === MENU_TYPE.SHARED_GROUP ||
        props.menuType === MENU_TYPE.MY_GROUP ||
        props.menuType === MENU_TYPE.FAVORITE_GROUP) &&
      recordCheckList.length === 0
    ) {
      return (
        <>
          {checkTypeOfSelectedList().autoList && (checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && (
            <a
              title=""
              className={`icon-primary icon-update ${checkDisable()}`}
              onClick={!checkDisable() && showAutoGroupDialog}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-update')}</span></label>
            </a>
          )}
          <a
            title=""
            className={`${checkDisable()} icon-primary icon-add-favorites ${checkTypeOfSelectedList()
              .favorite && 'active'}`}
            onClick={!checkDisable() && handleFavoriteAction}
          >
            <label className="tooltip-common">
              {checkTypeOfSelectedList().favorite
                ? (<span>{translate('sales.top.label-tooltip.remove-from-favourite')}</span>)
                : (<span>{translate('sales.top.label-tooltip.add-to-favourite')}</span>)}
            </label>
          </a>
          {(checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && (
            <a
              title=""
              className={`icon-primary icon-content-paste ${checkDisable()}`}
              onClick={!checkDisable() && handleEdit}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-top-edit')}</span></label>
            </a>
          )}
          {(checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && (
            <a
              title=""
              className={`icon-primary icon-content-delete ${checkDisable()}`}
              onClick={!checkDisable() && showDeleteGroupDialog}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-top-delete')}</span></label>
            </a>
          )}
          <a
            title=""
            className={`icon-primary icon-content-group ${checkDisable()}`}
            onClick={!checkDisable() && handleCoppyList}
          >
            <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-top-dupplicate')}</span></label>
          </a>
          {(checkOwner() || props.menuType === MENU_TYPE.MY_GROUP) && checkMyList() && (
            <a
              title=""
              className={`icon-primary ic-convert-shared-list ${checkDisable()} `}
              onClick={!checkDisable() && showChangeListDialog}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-top-convert-sharelist')}</span></label>
            </a>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="control-top">
      <div className="left d-flex align-items-center">
        <div className="button-shadow-add-select-wrap">
          <a title="" className={`button-shadow-add-select ${checkDisable()}`}>
            {translate('sales.top.title.buttonText')}
          </a>
          <span className={`button-arrow ${checkDisable()}`}></span>
        </div>
        {(props.menuType === MENU_TYPE.ALL_PRODUCT_TRADING ||
          props.menuType === MENU_TYPE.MY_PRODUCT_TRADING) && recordCheckList.length === 0 && (
            <>
              <DatePicker
                // date={props.settingDate}
                isDisabled={props.modeDisplay === ScreenMode.EDIT}
                outerDivClass="sales-list-card__date-picker mr-2"
                inputClass="sales-list-card__date-picker-input button-primary button-simple-edit ml-2"
                onDateChanged={selectedDate => props.setSettingDate(selectedDate)}
                
              />
              <span className="mx-2">{translate('sales.top.title.fieldLabel')}</span>
              <span
                tabIndex={0}
                title=""
                className={`icon-small-primary icon-help-small ${showHint ? 'active' : ''}`}
                ref={hintRef}
                onClick={toggle}
              >
                {showHint && (
                  <div className="box-select-option box-highlight">
                    <ul>
                      {props.fieldInfoHint.length > 0 &&
                        props.fieldInfoHint.filter(info => info.fieldLabel).map(info => (
                          (info.forwardColor || info.backwardColor) && (
                          <li key={info.fieldId}>
                            <a className="color-picker box-select-color" title="">
                              <p>
                                {getFieldLabel(info, 'fieldLabel')}:
                              <span className={`box-color bg-${info.forwardColor || ''}`}></span>
                              </p>
                              <p>
                                {getFieldLabel(info, 'forwardText')}
                                <span className={`box-color bg-${info.backwardColor || ''}`}></span>
                                {getFieldLabel(info, 'backwardText')}
                              </p>
                            </a>
                          </li>
                          )
                        ))}
                    </ul>
                  </div>
                )}
              </span>
            </>
          )}
        {renderActionRecordCheckList()}
        {renderLocalTool()}
      </div>
      <div className="right">
        {props.view === 1 && (
          <>
            {/* fix bug #17667 */}
            <a onClick={onClickSwitchDiaplay} className={props.showSwitcher ? "icon-primary icon-switch-display active" : "icon-primary icon-switch-display"} >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.button-switch-display')}</span></label>
            </a>
            <a
              className="icon-primary ml-2 icon-six-block"
              onClick={e => {
                switchView(2);
              }}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.switch-view')}</span></label>
            </a>

          </>
        )}
        {props.view === 2 && (
          <>
            <div className="position-relative">
              <a
                title=""
                className={`icon-primary ${(actionType === 'collapse') ? 'ic-up-down-arrow' : 'custom-icon ic-down-up-arrow'} two-button ${
                  showCollapseExpand ? 'active' : ''
                  }`}
                onClick={toggleShowCollapseExpand}
                ref={dropDownCollapseRef}
              >
                <div className="click-down">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </a>
              {showCollapseExpand && (
                <div className="select-arrown">
                  <a
                    title=""
                    className={`icon-arrow ic-up-down-arrowv2 ${(actionType === 'collapse') && 'active'}`}
                    onClick={onHandleCollapse('collapse')}
                  />
                  <a
                    title=""
                    className={`icon-arrow ic-down-up-arrow3 ${(actionType === 'expand') && 'active'}`}
                    onClick={onHandleCollapse('expand')}
                  />
                </div>
              )}
            </div>
            <a
              title=""
              className={
                props.changeDisplayOn
                  ? `icon-primary ml-2 icon-check-door active`
                  : `icon-primary ml-2 icon-check-door`
              }
              onClick={props.onShowSwitchDisplayCard}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.board-view')}</span></label>
            </a>
            <a
              title=""
              className="icon-primary icon-list-view ml-2"
              onClick={() => {
                switchView(1);
              }}
            >
              <label className="tooltip-common"><span>{translate('sales.top.label-tooltip.list-view')}</span></label>
            </a>
          </>
        )}
        <div className="search-box-button-style">
          <button className="icon-search border-radius-10">
            <i className="far fa-search" />
          </button>
          <input
            type="text"
            placeholder={translate('sales.top.place-holder.search')}
            defaultValue={props.textSearch}
            value={valueTextSearch}
            onChange={e => setValueTextSearch(e.target.value)}
            onBlur={onBlurTextSearch}
            onKeyPress={handleKeyPress}
          />
          <button className={'icon-fil'} onClick={onClickOpenPopupSearch} />
          {props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail && (
            <div className="tag">
              {translate('sales.top.place-holder.searching')}
              <button className="close" onClick={cancelSearchConditions}>
                ×
              </button>
            </div>
          )}
        </div>
        {props.view === 1 && (
          <>
            {props.modeDisplay === ScreenMode.DISPLAY && isAdmin && (
              <a
                className="button-primary button-simple-edit ml-2 cursor-pointer"
                onClick={e => props.toggleSwitchEditMode(true)}
              >
                {translate('sales.top.title.btn-edit')}
              </a>
            )}
            {props.modeDisplay === ScreenMode.EDIT && (
              <button
                className="button-cancel"
                type="button"
                onClick={e => props.toggleSwitchEditMode(false)}
              >
                {translate('sales.top.title.btn-cancel')}
              </button>
            )}
            {props.modeDisplay === ScreenMode.EDIT && (
              <button
                className="button-save"
                type="button"
                onClick={e => props.toggleUpdateInEditMode()}
              >
                {translate('sales.top.title.btn-save')}
              </button>
            )}
          </>
        )}
        <a className="icon-small-primary icon-help-small" onClick={props.toggleOpenHelpPopup} />
        {isAdmin && (
          <a onClick={toggleOpenPopupSetting} className="icon-small-primary icon-setting-small" />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication, dynamicList, salesList, salesMySharedListState, salesControlSidebar }: IRootState) => ({
  fieldInfos: dynamicList.data.has(SALES_LIST_ID) ? dynamicList.data.get(SALES_LIST_ID).fieldInfos : {},
  recordCheckList: dynamicList.data.has(SALES_LIST_ID) ? dynamicList.data.get(SALES_LIST_ID).recordCheckList : [],
  authorities: authentication.account.authorities,
  productTradings: salesList.productTradings,
  // modalAction: salesMySharedListState.modalAction,
  leaveGroupProductTradingsId: salesList.leaveGroupProductTradingsId,
  relatedProductTradingData: salesList.relatedProductTradingData,
  localMenu: salesControlSidebar.localMenuData
});

const mapDispatchToProps = {
  handleRemoveProductTradingFromList,
  handleSubmitGroupInfos
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesControlTop);
