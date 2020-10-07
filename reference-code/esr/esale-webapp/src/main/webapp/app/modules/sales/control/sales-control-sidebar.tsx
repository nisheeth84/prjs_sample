import React, { useState, useEffect, Fragment, useRef, useMemo, useCallback } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Storage } from 'react-jhipster';
import { MENU_TYPE, SHARE_GROUP_MODES, MY_GROUP_MODES, LIST_MODE, GROUP_TYPES, PARTICIPANT_TYPE, LIST_TYPE, SELECT_TARGET_TYPE, SHOW_MESSAGE_SUCCESS } from '../constants';
import {
  handleInitLocalMenu,
  handleUpdateAutoSalesGroup,
  handleDeleteSalesGroup,
  handleAddToFavoriteSalesGroup,
  handleRemoveFromFavoriteSalesGroup,
  handleGetDataEmployee,
  SalesSidebarAction,
  resetSidebar
} from './sales-control-sidebar-reducer';
// import { handleSubmitGroupInfos } from '../shared-group/shared-group.reducer';
import { handleSubmitGroupInfos } from '../my-shared-list/sales-my-shared-list-modal.reducer';
import SalesControlGroupCard from './sales-control-group-card';
import CategoryDragLayer from 'app/shared/layout/menu/category-drag-layer';
import { decodeUserLogin, jsonParse } from 'app/shared/util/string-utils';
import { Resizable } from 're-resizable';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';
import * as R from 'ramda';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

interface ISalesControlSidebarProps extends StateProps, DispatchProps {
  // action handle reload screen
  handleReloadScreenLocalMenu: (type: any) => void;
  // action set menutype of parent component
  setMenuType: any;
  // menu type of parent component
  addToGroup;
  moveToGroup;
  openAddEditMyGroupModal;
  menuType: number;
  toggleOpenModalCreateGroup;
  toggleOpenModalChangeGroupType;
  updateFiltersSearch?: (filters, selectedTargetType, listViewCondition) => void;
  toggleShowFeaturesIcon?: (types: number, isAutoGroup: boolean, isOwner: boolean) => void;
  toggleOpenAddEditMyGroupModal?: (myGroupModalMode, groupId, isAutoGroup, listMember?) => void;
  sidebarCurrentId: any,
  setTypeGroup;
  isChange?: boolean;
  openGroupModal?: (groupMode, groupId, isOwnerGroup, isAutoGroup, groupMember) => void;
  toggleOpenDepartmentPopup?;
  getGroupName?: (groupName) => any;
  initializeListInfo?;
  handleGetInitializeListInfo?: (fieldBelong) => void;
  changeSelectedSidebar?: ({ type, cardId }) => void;
  changeActiveCard?: {},
  targetId?
  resetFilter?
  reloadScreen?: (sidebarCurrentId) => void,
  popout?: boolean;
}

/**
 * component of control sidebar
 * @param props
 */
const SalesControlSidebar = (props: ISalesControlSidebarProps) => {
  const infoUserLogin = decodeUserLogin();
  // const [customers] = useState({});
  // const [businessCard] = useState({});
  const [active, setActive] = useState(props.menuType);
  const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null });
  const [showSidebar, setShowSidebar] = useState(true);

  // const [isShowMyGroup, setShowMyGroup] = useState(true); // ADD_TO_GROUP
  const [isShowMyGroup, setShowMyGroup] = useState(true);
  const [isShowShareGroup, setShowShareGroup] = useState(true);
  const [isShowFavorite, setShowFavorite] = useState(true);

  const MAX_RECORD_DISPLAY = 5;
  const [favoriteGroupDisplay, setFavoriteGroupDisplay] = useState([]);
  const [myGroupsDisplay, setMyGroupsDisplay] = useState([]);
  const [sharedGroupsDisplay, setSharedGroupsDisplay] = useState([]);
  // fix bug #17420
  const [allList, setAllList] = useState([]);


  const resizeRef = useRef(null);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false);
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false);
  const [width, setWidth] = useState(216);
  const innerListRef = useRef(null);
  const [overflowY, setOverflowY] = useState<'auto' | 'hidden'>('hidden');


  useEffect(() => {
    const employeeIdLogin = infoUserLogin['custom:employee_id'];
    props.handleGetDataEmployee({ employeeId: employeeIdLogin, mode: 'detail' });
    props.handleInitLocalMenu();
  }, []);

  // fix bug
  useEffect(() => {
    if(props.targetId === MENU_TYPE.ALL_PRODUCT_TRADING){
      setActive(MENU_TYPE.ALL_PRODUCT_TRADING)
      setActiveCard({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null })
    }
  },[props.targetId])

  useEffect(() => {
    props.resetFilter ()
  },[active, activeCard])

  const shareGroupDefault = {
    groupId: 0,
    groupName: " ",
    isAutoGroup: false,
    participantType: 2,
    type: 4,
    updatedUser: null,
  }

  useEffect(() => {
    if(props.updatedAutoGroupId){
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.resetSidebar();
      }
      props.reloadScreen(props.updatedAutoGroupId);
      event && event.preventDefault();
    }
  }, [props.updatedAutoGroupId]);

  

  useEffect(() => {
    if (props.localMenu && props.localMenu.initializeLocalMenu) {
      setFavoriteGroupDisplay(props.localMenu.initializeLocalMenu.favoriteGroup);
      setMyGroupsDisplay(props.localMenu.initializeLocalMenu.myGroups);
      if (props.localMenu.initializeLocalMenu.sharedGroups.length > 0) {
        setSharedGroupsDisplay(props.localMenu.initializeLocalMenu.sharedGroups);
      } 
      // else {
      //   setSharedGroupsDisplay([shareGroupDefault]);
      // }
      // fix bug #17420
      setAllList([...props.localMenu.initializeLocalMenu.myGroups, ...props.localMenu.initializeLocalMenu.sharedGroups])
      // setTextSearchMenu('');
    }
  }, [props.localMenu]);

  useEffect(() => {
    if (props.deletedGroupId) {
      setActive(MENU_TYPE.ALL_PRODUCT_TRADING);
      // props.setMenuType(MENU_TYPE.ALL_PRODUCT_TRADING);
      // props.sidebarCurrentId(null);
      setActiveCard({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null });
      // props.setMenuType
    }

    if ( props.deletedDepartmentId ||
      props.deletedGroupId ||
      props.updatedAutoGroupId ||
      props.addToFavoriteId ||
      // props.updatedGroupId ||
      // props.updateMyGroupId ||
      // props.createGroupTime ||
      props.removeListFromFavorite){
        props.handleInitLocalMenu();
      }
  }, [
    props.deletedDepartmentId,
    props.deletedGroupId,
    props.updatedAutoGroupId,
    props.addToFavoriteId,
    // props.updatedGroupId,
    // props.updateMyGroupId,
    // props.createGroupTime,
    props.removeListFromFavorite
  ]);

  /**
   * Filter data in list by menu
   * @param key
   * @param value
   */
  const handleDataFilter = (key, value, selectedTargetType, listViewCondition = []) => {
    const filters = [];
    filters.push({ key, value });
    props.updateFiltersSearch(filters, selectedTargetType, listViewCondition);
  };

  const onDragGroup = (sourceGroup, targetGroup?) => {
    if (targetGroup) {
      if (
        (sourceGroup.type === MENU_TYPE.FAVORITE_GROUP &&
          sourceGroup.listType === LIST_TYPE.MY_LIST &&
          targetGroup.listType === LIST_TYPE.SHARE_LIST) ||
        (sourceGroup.type === MENU_TYPE.MY_GROUP && targetGroup.type === MENU_TYPE.SHARED_GROUP) ||
        (sourceGroup.listType === LIST_TYPE.MY_LIST && targetGroup.listType === LIST_TYPE.SHARE_LIST)
      ) {
        props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, sourceGroup.listId, false, false, null);
      } else if (targetGroup.type === MENU_TYPE.FAVORITE_GROUP) {
        props.handleAddToFavoriteSalesGroup(sourceGroup.listId)
      }
    } else {
      props.openGroupModal(SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE, sourceGroup.listId, false, false, null);
    }
  };

  /**
   * Set active state when click to each sidebar element
   * @param type
   * @param id
   */
  const setCardState = (type, id = 0) => {
    setActiveCard({ type, cardId: id });
    setActive(type);
    props.changeSelectedSidebar({ type, cardId: id });
  };

  /**
   * Filter lists via the searchText
   * @param searchText searchText
   */
  const showListSearch = searchText => {
    const favorite = props.localMenu.initializeLocalMenu.favoriteGroup.filter(e => e.listName.includes(searchText));
    const myGroupsField = props.localMenu.initializeLocalMenu.myGroups.filter(e => e.listName.includes(searchText));
    const sharedGroupsField = props.localMenu.initializeLocalMenu.sharedGroups.filter(e => e.listName.includes(searchText));
    setFavoriteGroupDisplay(favorite);
    setMyGroupsDisplay(myGroupsField);
    setSharedGroupsDisplay(sharedGroupsField);
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
    const initParam = getInitGroupParams(dataList);
    const groupIdIn = initParam.groupId;
    const groupNameIn = initParam.groupName;
    const groupTypeIn = initParam.groupType;
    const isAutoGroupIn = initParam.isAutoGroup;
    const isOverWriteIn = initParam.isOverWrite;
    const groupMembersIn = initParam.groupMembers;
    const groupParticipantsIn = initParam.groupParticipants;
    const searchConditionsIn = initParam.searchConditions;
    let updatedDate = dataList.updatedDate;
    if (!dataList) {
      updatedDate = new Date();
    }
    props.handleSubmitGroupInfos(
      groupIdIn,
      groupNameIn,
      groupTypeIn,
      isAutoGroupIn,
      isOverWriteIn,
      groupMembersIn,
      groupParticipantsIn,
      searchConditionsIn,
      updatedDate,
      SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE,
      // null
    );
  };



  const resizableSize = useMemo(() => ({ width, height: '100%' }), []);
  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar, setShowSidebar]);
  const sidebarIconStyle = useMemo(() => `far ${showSidebar ? 'fa-angle-left' : 'fa-angle-right'}  `, [showSidebar]);

  const onResizeStop = useCallback(
    (e, direction, ref, d) =>
      R.compose(
        setWidth,
        R.add(width),
        R.prop('width')
      )(d),
    [setWidth, width]
  );
  const sidebarStyle = useMemo(
    () => `button-collapse-sidebar-product ${showShadowTop && showSidebar ? 'shadow-local-navigation-top ' : ''}`,
    [showShadowTop, showSidebar]
  );
  const handleScroll = useCallback(
    (event: { target: any }) => {
      const node = event.target;
      const { scrollHeight, scrollTop, clientHeight } = node;
      const bottom = scrollHeight - scrollTop;
      // shadow top: scrollTop > 0
      setShowShadowTop(scrollTop > 0);
      // shadow bottom: scrollHeight - scrollTop > clientHeight
      setShowShadowBottom(bottom > clientHeight);
    },
    [setShowShadowTop, setShowShadowBottom]
  );

  useEffect(() => {
    showSidebar && setShowShadowTop(false);
  }, [showSidebar]);

  useEffect(() => {
    showSidebar && setShowShadowBottom(innerListRef.current.clientHeight < innerListRef.current.scrollHeight);
  }, [showSidebar]);

  const handleChangeOverFlow = useCallback(
    (type: 'auto' | 'hidden') => (e: any) => {
      setOverflowY(type);
    },
    [setOverflowY]
  );

  const onOpenMyGroupModal = (myGroupModalMode, currentGroupId, isAutoGroup) => {
    if (currentGroupId) {
      props.sidebarCurrentId(currentGroupId);
    }
    props.toggleOpenAddEditMyGroupModal(myGroupModalMode, currentGroupId, isAutoGroup, []);
  }


  const handleaaa = () =>{
    props.reloadScreen(props.sidebarCurrentId)
  }

  return (
    <>
      {showSidebar && (
        <Resizable
          ref={resizeRef}
          size={resizableSize}
          onResizeStop={onResizeStop}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className={`resizeable-resize-wrap esr-content-sidebar list-category style-3 ${showShadowTop &&
            'shadow-local-navigation-top'} ${showShadowBottom && 'shadow-local-navigation-bottom-inset'}`}
        >
          <div className={"esr-content-sidebar-outer custom-sidebar custom-sidebar-product " + (overflowY === "auto"?"overflow-auto":"overflow-hidden")}
            ref={innerListRef}
            onScroll={handleScroll}
            // style={{ overflowY }}
            onMouseEnter={handleChangeOverFlow('auto')}
            onMouseLeave={handleChangeOverFlow('hidden')}
          >
            <div className={'title-lf ' + (active !== null && active === MENU_TYPE.ALL_PRODUCT_TRADING ? 'active' : '')}>
              <a
                onClick={() => {
                  setActive(MENU_TYPE.ALL_PRODUCT_TRADING);
                  props.handleReloadScreenLocalMenu(MENU_TYPE.ALL_PRODUCT_TRADING);
                  props.setMenuType(MENU_TYPE.ALL_PRODUCT_TRADING);
                  props.sidebarCurrentId('');
                  setActiveCard({ type: MENU_TYPE.ALL_PRODUCT_TRADING, cardId: null });
               
                }}
              >
                {translate('sales.sidebar.title.allProductTrading')}
              </a>
            </div>

            <div className={'title-lf ' + (active !== null && active === MENU_TYPE.MY_PRODUCT_TRADING ? 'active' : '')}>
              <a
                onClick={() => {
                  setActive(MENU_TYPE.MY_PRODUCT_TRADING);
                  props.sidebarCurrentId('');
                  props.handleReloadScreenLocalMenu(MENU_TYPE.MY_PRODUCT_TRADING);
                  props.toggleShowFeaturesIcon(MENU_TYPE.MY_PRODUCT_TRADING, false, false);
                  props.setMenuType(MENU_TYPE.MY_PRODUCT_TRADING);
                  setActiveCard({ type: MENU_TYPE.MY_PRODUCT_TRADING, cardId: null });
                  
                }}
              >
                {translate('sales.sidebar.title.myProductTrading')}
              </a>
            </div>

            <div className="esr-content-sidebar-inner">
              <div className="employee-sidebar-menu list-group">
                {!_.isEmpty(props.localMenu) &&
                  !_.isEmpty(props.localMenu.initializeLocalMenu) &&
                  props.localMenu.initializeLocalMenu.favoriteGroup.length +
                  props.localMenu.initializeLocalMenu.myGroups.length +
                  props.localMenu.initializeLocalMenu.sharedGroups.length >=
                  MAX_RECORD_DISPLAY && (
                    <li>
                      <div className="search-box-button-style">
                        <button className="icon-search">
                          <i className="far fa-search"></i>
                        </button>
                        <input
                          type="text"
                          placeholder={translate('sales.sidebar.search.placeholder')}
                          onChange={e => showListSearch(e.target.value.trim())}
                        />
                      </div>
                    </li>
                  )}
                <li>
                  <ul className="list-group">
                    <li className="category">
                        {favoriteGroupDisplay && favoriteGroupDisplay.length >= MAX_RECORD_DISPLAY ? (
                          <i
                            className={'fas ' + (isShowFavorite ? 'fa-sort-down' : 'fa-caret-right')}
                            onClick={() => setShowFavorite(!isShowFavorite)}
                          ></i>
                        ) : (
                            <></>
                          )}
                      <div className="d-flex">
                        <a>{translate('sales.sidebar.title.list-favorite')}</a>
                      </div>
                      <ul className="list-group">
                        {isShowFavorite &&
                          favoriteGroupDisplay &&
                          favoriteGroupDisplay.map((group, index) => {
                            group.type = MENU_TYPE.FAVORITE_GROUP;
                            return (
                              <Fragment key={index}>
                                <CategoryDragLayer />
                                <SalesControlGroupCard
                                  key={group.listId}
                                  sourceGroup={group}
                                  type={MENU_TYPE.FAVORITE_GROUP}
                                  toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                                  handleDataFilter={handleDataFilter}
                                  dragGroup={onDragGroup}
                                  sidebarCurrentId={props.sidebarCurrentId}
                                  setTypeGroup={props.setTypeGroup}
                                  setActiveCard={setCardState}
                                  activeCard={activeCard}
                                  openGroupModal={props.openGroupModal}
                                  handleUpdateAutoGroup={props.handleUpdateAutoSalesGroup}
                                  toggleOpenAddEditModal={onOpenMyGroupModal}
                                  handleDeleteGroup={props.handleDeleteSalesGroup}
                                  isChange={props.isChange}
                                  getGroupName={props.getGroupName}
                                  initializeListInfo={props.initializeListInfo}
                                  handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                                  handleAddToFavorite={props.handleAddToFavoriteSalesGroup}
                                  handleRemoveFromFavorite={props.handleRemoveFromFavoriteSalesGroup}
                                  handleConvertMyListToShareList={handleChangeMyListToShareList}
                                  handleReloadScreenLocalMenu={props.handleReloadScreenLocalMenu}
                                  setMenuType={props.setMenuType}
                                  menuType={props.menuType}
                                  favouriteList={_.get(props.localMenu.initializeLocalMenu, 'favoriteGroup')}
                                  // fix bug #17420
                                  allList={allList}
                                  reloadScreen={props.reloadScreen}
                                />
                              </Fragment>
                            )
                          })}
                      </ul>
                    </li>
                    <li className="category">
                      {myGroupsDisplay && myGroupsDisplay.length >= MAX_RECORD_DISPLAY ? (
                          <i
                            className={'fas ' + (isShowMyGroup ? 'fa-sort-down' : 'fa-caret-right')}
                            onClick={() => setShowMyGroup(!isShowMyGroup)}
                          ></i>
                        ) : (
                            <></>
                      )}
                      <div className="d-flex">
                        <a>{translate('sales.sidebar.title.my-group')}</a>
                        <span
                          className="plus-blue"
                          onClick={() => props.toggleOpenAddEditMyGroupModal(MY_GROUP_MODES.MODE_CREATE_GROUP, null, false, [])}
                        />
                      </div>
                      <ul className="list-group">
                        {isShowMyGroup &&
                          myGroupsDisplay &&
                          myGroupsDisplay.sort(function (a, b) { return a.displayOrder - b.displayOrder }).map((group, index) => (
                            <Fragment key={index}>
                              <CategoryDragLayer />
                              <SalesControlGroupCard
                                key={group.listId}
                                sourceGroup={group}
                                type={MENU_TYPE.MY_GROUP}
                                toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                                handleDataFilter={handleDataFilter}
                                dragGroup={onDragGroup}
                                sidebarCurrentId={props.sidebarCurrentId}
                                setTypeGroup={props.setTypeGroup}
                                setActiveCard={setCardState}
                                activeCard={activeCard}
                                handleUpdateAutoGroup={props.handleUpdateAutoSalesGroup}
                                toggleOpenAddEditModal={props.toggleOpenAddEditMyGroupModal}
                                handleDeleteGroup={props.handleDeleteSalesGroup}
                                isChange={props.isChange}
                                getGroupName={props.getGroupName}
                                initializeListInfo={props.initializeListInfo}
                                handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                                handleAddToFavorite={props.handleAddToFavoriteSalesGroup}
                                handleRemoveFromFavorite={props.handleRemoveFromFavoriteSalesGroup}
                                handleConvertMyListToShareList={handleChangeMyListToShareList}
                                handleReloadScreenLocalMenu={props.handleReloadScreenLocalMenu}
                                setMenuType={props.setMenuType}
                                menuType={props.menuType}
                                favouriteList={_.get(props.localMenu.initializeLocalMenu, 'favoriteGroup')}
                                // fix bug #17420
                                allList={allList}
                                reloadScreen={props.reloadScreen}
                              />
                            </Fragment>
                          ))}
                        </ul>
                    </li>
                  </ul>
                  <ul className="list-group">
                    <li className="category">
                        {sharedGroupsDisplay && sharedGroupsDisplay.length >= MAX_RECORD_DISPLAY ? (
                          <i
                            className={'fas ' + (isShowShareGroup ? 'fa-sort-down' : 'fa-caret-right')}
                            onClick={() => setShowShareGroup(!isShowShareGroup)}
                          ></i>
                        ) : (
                            <></>
                          )}
                      <div className="d-flex">
                        <a>{translate('sales.sidebar.title.shared-group')}</a>
                        <span
                          className="plus-blue"
                          onClick={() => props.openGroupModal(SHARE_GROUP_MODES.MODE_CREATE_GROUP, null, false, false, null)}
                        />
                      </div>
                      <ul className="list-group">
                        {isShowShareGroup &&
                          sharedGroupsDisplay &&
                          sharedGroupsDisplay.sort(function (a, b) { return a.displayOrder - b.displayOrder }).map((group, index) => (
                            <Fragment key={index}>
                              <CategoryDragLayer />
                              <SalesControlGroupCard
                                key={group.listId}
                                sourceGroup={group}
                                type={MENU_TYPE.SHARED_GROUP}
                                toggleShowFeaturesIcon={props.toggleShowFeaturesIcon}
                                handleDataFilter={handleDataFilter}
                                dragGroup={onDragGroup}
                                setActiveCard={setCardState}
                                activeCard={activeCard}
                                sidebarCurrentId={props.sidebarCurrentId}
                                setTypeGroup={props.setTypeGroup}
                                openGroupModal={props.openGroupModal}
                                handleUpdateAutoGroup={props.handleUpdateAutoSalesGroup}
                                handleDeleteGroup={props.handleDeleteSalesGroup}
                                isChange={props.isChange}
                                getGroupName={props.getGroupName}
                                initializeListInfo={props.initializeListInfo}
                                handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                                handleAddToFavorite={props.handleAddToFavoriteSalesGroup}
                                handleRemoveFromFavorite={props.handleRemoveFromFavoriteSalesGroup}
                                handleConvertMyListToShareList={handleChangeMyListToShareList}
                                handleReloadScreenLocalMenu={props.handleReloadScreenLocalMenu}
                                setMenuType={props.setMenuType}
                                menuType={props.menuType}
                                favouriteList={_.get(props.localMenu.initializeLocalMenu, 'favoriteGroup')}
                                // fix bug #17420
                                allList={allList}
                                reloadScreen={handleaaa}
                              />
                            </Fragment>
                          ))}
                        </ul>
                    </li>
                  </ul>
                </li>
              </div>
            </div>
          </div>

        </Resizable>
      )}
      <div className={sidebarStyle} onClick={toggleSidebar}>
        <a className="expand">
          <i className={sidebarIconStyle} />
        </a>
      </div>
    </>
  );
};
const mapStateToProps = ({ salesControlSidebar, salesMySharedListState }: IRootState) => ({
  localMenu: salesControlSidebar.localMenuData,
  deletedGroupId: salesControlSidebar.deletedGroupId,
  deleteGroupMsg: salesControlSidebar.deleteGroupMsg,
  deletedDepartmentId: salesControlSidebar.deletedDepartmentId,
  deleteDepartmentMsg: salesControlSidebar.deleteDepartmentMsg,
  updatedAutoGroupId: salesControlSidebar.updatedAutoGroupId,
  addToFavoriteId: salesControlSidebar.addToFavoriteId,
  // updatedGroupId: salesMySharedListState.updatedGroupId,
  // updateMyGroupId: salesGroupModal.updateMyGroupId,
  employeeDataLogin: salesControlSidebar.employeeDataLogin,
  // createGroupTime: salesGroupModal.timeUpdate,
  removeListFromFavorite: salesControlSidebar.removeListFromFavorite,
  action: salesControlSidebar.action,
  msgSuccess: salesControlSidebar.msgSuccess,
});

const mapDispatchToProps = {
  handleInitLocalMenu,
  handleUpdateAutoSalesGroup,
  handleDeleteSalesGroup,
  handleAddToFavoriteSalesGroup,
  handleRemoveFromFavoriteSalesGroup,
  handleGetDataEmployee,
  handleSubmitGroupInfos,
  resetSidebar
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesControlSidebar);
