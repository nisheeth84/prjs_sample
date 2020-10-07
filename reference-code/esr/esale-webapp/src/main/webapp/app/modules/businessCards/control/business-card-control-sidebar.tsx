import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { handleGetBusinessCardList, removeListFromFavorite, addToFavoriteList, deleteList, handleRefreshAutoList, getSearchConditionInfoList } from "app/modules/businessCards/list/business-card-list.reducer"
import BusinessCardListCard from "./business-card-list-card"
import { hasAnyAuthority } from "app/shared/auth/private-route";
import { AUTHORITIES } from "app/config/constants";
import { translate } from 'react-jhipster';
import { MENU_TYPE, MY_LISTS_MODES, TYPE_LIST, MODE_SEARCH_LIST, SHARE_LISTS_MODES } from "../constants";
import { Resizable } from "re-resizable";
import "./style.scss";
import {CommonUtil} from 'app/modules/activity/common/common-util';
// import BusinessCardDragLayer from '../../../shared/layout/menu/business-card-drag-layer';

export interface IBusinessCardControlSidebarProps extends StateProps, DispatchProps {
  businessCardListActive: (type, id, obj) => void;
  onShowBusinessCardSharedList?
  onShowBusinessCardMyList?: (myListModalMode, id, isAutoGroup, listMembers) => void,
  targetType: number,
  targetId: number,
  getGroupName?: (groupName) => any;
  changeSelectedSidebar?: ({ type, cardId }) => void;
  sidebarCurrentId;
  setTypeGroup;
  toggleShowFeaturesIcon: (listId) => void
  updateFiltersSearch?: (filters, selectedTargetType, listViewCondition) => void
  handleGetInitializeListInfo?: (fieldBelong) => void
  onUpdateBusinessCardsList: (list) => void
  dirtyCheck?: any;
  toggleOnDrag: (isOnDrag: boolean) => void,
  isOnDrag?: boolean;
}

const BusinessCardControlSidebar = (props: IBusinessCardControlSidebarProps) => {
  const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_BUSINESS_CARD, cardId: null});
  const [favoriteList, setFavoriteList] = useState([]);
  const [myList, setMyList] = useState([]);
  const resizeRef = useRef(null);
  const [shareList, setShareList] = useState([]);
  const [width, setWidth] = useState(216);
  const [idActive, setIdActive] = useState({ id: null, type: TYPE_LIST.ALL_CARD });
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false);

  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [overflowY, setOverflowY] = useState<"auto" | "hidden">("hidden")
  const innerListRef = useRef(null)
  const [isShowFavoriteList, setIsShowFavoriteList] = useState(true);
  const [isShowMyList, setIsShowMyList] = useState(true);
  const [isShowShareList, setIsShowShareList] = useState(true);
  const [isSearchLocall, setIsSearchLocall] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const MAX_RECORD_DISPLAY = 5;

  const handleScroll = useCallback(
    (event: { target: any }) => {
      const node = event.target;
      const { scrollHeight, scrollTop, clientHeight } = node;
      const bottom = scrollHeight - scrollTop;
      setShowShadowTop(scrollTop > 0);
      setShowShadowBottom(bottom > clientHeight);
    },
    [setShowShadowTop, setShowShadowBottom]
  );


  const handleChangeOverFlow = (type: "auto" | "hidden") => (e) => {
    setOverflowY(type)
  }

  useEffect(() => {
    props.handleGetBusinessCardList(null, MODE_SEARCH_LIST.OWNER);
  }, []);

  useEffect(() => {
    const obj = { id: props.targetId, type: props.targetType };
    setIdActive({ ...obj });
    setActiveCard({ type: props.targetType, cardId: props.targetId});
  }, [props.targetId, props.targetType]);

  useEffect(() => {
    if (props.listBusinessCardList && props.listBusinessCardList.length >= 0) {
      setFavoriteList(props.listBusinessCardList.filter(x => x.displayOrderOfFavoriteList !== null).sort((a, b) => {
        return a.displayOrderOfFavoriteList - b.displayOrderOfFavoriteList;
      }))
      setMyList(props.listBusinessCardList.filter(x => x.listType === 1));
      const shareLists = props.listBusinessCardList.filter(x => x.listType === 2);
      setShareList(shareLists)
    }
    setIdActive({ id: props.targetId, type: props.targetType });
  }, [props.listBusinessCardList]);

  useEffect(() => {
    showSidebar && setShowShadowTop(false);
  }, [showSidebar]);

  const setIdActiveFuntion = (obj) => {
    setIdActive(obj)
  }
  const onOpenAddEditMyBusinessCardModal = (myListModalMode, id, isAutoGroup) => {
    props.onShowBusinessCardMyList(myListModalMode, id, isAutoGroup, null);
  }
  // remove from favorite list
  const removeFormFavoriteList = (id) => {
    props.removeListFromFavorite(id)
  }

  const addListToFavorite = id => {
    props.addToFavoriteList(id)
  }

  const onDeleteList = (id) => {
    props.deleteList(id)
  }
  /**
   * Filter lists via the searchText
   * @param searchText searchText
   */
  const showListSearch = (searchText) => {
    if (searchText === '') {
      setIsSearchLocall(false);
    } else {
      setIsSearchLocall(true);
    }
    const favoriteLists = props.listBusinessCardList.filter(x => x.displayOrderOfFavoriteList !== null).sort((a, b) => {
      return a.displayOrderOfFavoriteList - b.displayOrderOfFavoriteList;
    });
    const favoriteSearchText = favoriteLists.filter(e => e.listName.includes(searchText));
    const myLists = props.listBusinessCardList.filter(e => e.listName.includes(searchText) && e.listType === 1);
    const shareLists = props.listBusinessCardList.filter(e => e.listName.includes(searchText) && e.listType === 2);
    setFavoriteList(favoriteSearchText);
    setMyList(myLists);
    setShareList(shareLists);
  }

  // const onBusinessCardList = (sourceBusinessCardList, targetBusinessCardList) => {
  //   if (sourceBusinessCardList.type === MENU_TYPE.MY_LIST && targetBusinessCardList.type === MENU_TYPE.SHARE_LIST) {
  //     props.onShowBusinessCardSharedList(SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE, sourceBusinessCardList.listId, false, false, null)
  //   }
  // }

  /**
   * Set active state when click to each sidebar element
   * @param type
   * @param id
   */
  const setCardState = (type, id = 0) => {
    setActiveCard({ type, cardId: id});
    // save target card
    props.changeSelectedSidebar({ type, cardId: id });
  }

  /**
   * Filter data in list by menu
   * @param key
   * @param value
   */
  const handleDataFilter = (key, value, selectedTargetType, listViewCondition = []) => {
    const filters = [];
    filters.push({ key, value });
    props.updateFiltersSearch(filters, selectedTargetType, listViewCondition);
  }

  const onRefreshAutoList = (id) => {
    props.handleRefreshAutoList(id);
    props.getSearchConditionInfoList(id);
  }

  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar, setShowSidebar]);

  const sidebarStyle = useMemo(
    () => `button-collapse-sidebar-product ${showShadowTop && showSidebar ? 'shadow-local-navigation-top ' : ''}`,
    [showShadowTop, showSidebar]
  );

  const sidebarIconStyle = useMemo(() => `far ${showSidebar ? 'fa-angle-left' : 'fa-angle-right'}  `, [showSidebar]);

  const checkOwner = (list) => {
    if(list.listType === 2) {
      const employeeId = CommonUtil.getUserLogin().employeeId;
      const listOwner = JSON.parse(list.ownerList)['employeeId'];
      if(listOwner && listOwner.includes(employeeId.toString())) {
        return true;
      }
      return false;
    }
  }

  const checkViewer = (list) => {
    const employeeId = CommonUtil.getUserLogin().employeeId;
    if (list.listType === 2) {
      const listViewer = JSON.parse(list.viewerList)['employeeId'];
      if (listViewer && listViewer.includes(employeeId.toString())) {
        return true;
      }
      return false;
    }
  }

  const onToggleShowFeaturesIcon = (listId) => {
    const index = props.listBusinessCardList.findIndex(e => e.listId === listId);
    const list = props.listBusinessCardList[index];
    props.toggleShowFeaturesIcon(checkViewer(list));
    props.toggleOnDrag((list.listMode === 2 && checkOwner(list)) || list.listMode === 1);
  }
  return (
    <>
      {showSidebar && (
        <Resizable
          ref={resizeRef}
          size={{ width, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setWidth(width + d.width);
          }}
          onResize={(e, direction, ref, d) => {
          }}
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
          className={`resizeable-resize-wrap  esr-content-sidebar list-category style-3 height-calc-130 shadow-local-navigation-bottom-inset ${showShadowTop && "shadow-local-navigation-top"} ${showShadowBottom && "shadow-local-navigation-bottom-inset"}`}
        >
          <div className="bussines-card-sidebar-outer esr-content-sidebar-outer custom-sidebar-product" ref={innerListRef} onScroll={handleScroll} style={{ overflowY }} onMouseEnter={handleChangeOverFlow("auto")} onMouseLeave={handleChangeOverFlow("hidden")}>
            <div className="esr-content-sidebar-inner">
              <div className="list-group">
                <a className={(idActive && idActive.type === TYPE_LIST.RECEIVER ? "active" : "")} title=""
                  onClick={() => props.dirtyCheck(() => {
                    setIdActiveFuntion({ id: null, type: TYPE_LIST.RECEIVER });
                    props.businessCardListActive(0, TYPE_LIST.RECEIVER, null)
                    setCardState(MENU_TYPE.ALL_BUSINESS_CARD);
                    props.toggleShowFeaturesIcon(false)
                    props.toggleOnDrag(true);
                    props.sidebarCurrentId(null);
                  })}
                >{translate('businesscards.sidebar.title.receiver')}</a>
              </div>
              <div className="list-group">
                <a title="" className={(idActive && idActive.type === TYPE_LIST.ALL_CARD ? "active" : "")}
                  onClick={() => props.dirtyCheck(() => {
                    setIdActiveFuntion({ id: null, type: TYPE_LIST.ALL_CARD });
                    props.businessCardListActive(0, TYPE_LIST.ALL_CARD, null)
                    setCardState(MENU_TYPE.ALL_BUSINESS_CARD);
                    props.sidebarCurrentId(null);
                    props.toggleOnDrag(true);
                    props.toggleShowFeaturesIcon(false)
                  })}
                >{translate('businesscards.sidebar.title.all-cards')}</a>
              </div>
            </div>
            <div className="esr-content-sidebar-inner">
              <div className="employee-sidebar-menu list-group">
                {
                  (((favoriteList.length + shareList.length + myList.length) >= MAX_RECORD_DISPLAY && !isSearchLocall) || isSearchLocall) &&
                  <li>
                    <div className="search-box-no-button-style">
                      <button className="icon-search"><i className="far fa-search"></i></button>
                      <input type="text" placeholder={translate('businesscards.sidebar.place-holder.search')} onChange={e => showListSearch(e.target.value.trim())} />
                    </div>
                  </li>
                }
                <li>
                  <ul className="list-group group">
                    <li className="category">
                      {favoriteList && favoriteList.length >= MAX_RECORD_DISPLAY
                        ? <i className={"icon-expand fas " + (isShowFavoriteList ? "fa-chevron-down" : "fa-chevron-right")} onClick={() => props.dirtyCheck(() => setIsShowFavoriteList(!isShowFavoriteList))}></i>
                        : <></>
                      }
                      <div className="d-flex">
                        <a>{translate('businesscards.sidebar.title.favorite-list')}</a>
                      </div>
                      {isShowFavoriteList && favoriteList && favoriteList.map((item, index) => (
                        <div key={index}>
                          {/* <BusinessCardDragLayer /> */}
                          <BusinessCardListCard
                            key={index}
                            sourceBusinessCardList={item}
                            isAdmin={isAdmin}
                            onClick={setIdActiveFuntion}
                            idActive={idActive}
                            type={TYPE_LIST.FAVORITE}
                            businessCardListActive={props.businessCardListActive}
                            removeFormFavoriteList={removeFormFavoriteList}
                            deleteList={onDeleteList}
                            // dragBusinessCardList={onBusinessCardList}
                            activeCard={activeCard}
                            getGroupName={props.getGroupName}
                            setActiveCard={setCardState}
                            sidebarCurrentId={props.sidebarCurrentId}
                            setTypeGroup={props.setTypeGroup}
                            toggleShowFeaturesIcon={onToggleShowFeaturesIcon}
                            handleDataFilter={handleDataFilter}
                            handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                            handleUpdateAutoList={onRefreshAutoList}
                            onOpenAddEditMyBusinessCardModal={() => onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_EDIT_MY_LIST, item.listId, true)}
                            onDuplicateMyBusinessCardModal={() => onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_COPY_MY_LIST, item.listId, false)}
                            openGroupModal={props.onShowBusinessCardSharedList}
                            onMyListToShareList={props.onUpdateBusinessCardsList}
                            dirtyCheck={props.dirtyCheck}
                            isOnDrag={props.isOnDrag}
                          ></BusinessCardListCard>
                        </div>
                      ))}
                    </li>
                  </ul>
                </li>
                <li>
                  <ul className="list-group group">
                    <li className="category">
                      {myList && myList.length >= MAX_RECORD_DISPLAY
                        ? <i className={"icon-expand fas " + (isShowMyList ? "fa-chevron-down" : "fa-chevron-right")} onClick={() => props.dirtyCheck(() => setIsShowMyList(!isShowMyList))}></i>
                        : <></>
                      }
                      <div className="d-flex">
                        <a>{translate('businesscards.sidebar.title.my-list')}</a>
                        <span className="plus-blue" onClick={() => props.dirtyCheck(() => onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_CREATE_MY_LIST, null, false))} />
                      </div>
                      {isShowMyList && myList && myList.map((item, index) => (
                        <div key={index}>
                          {/* <BusinessCardDragLayer /> */}
                          <BusinessCardListCard
                            key={index}
                            sourceBusinessCardList={item}
                            isAdmin={isAdmin}
                            onClick={setIdActiveFuntion}
                            idActive={idActive}
                            type={TYPE_LIST.MY_LIST}
                            businessCardListActive={props.businessCardListActive}
                            onOpenAddEditMyBusinessCardModal={() => onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_EDIT_MY_LIST, item.listId, true)}
                            onDuplicateMyBusinessCardModal={() => onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_COPY_MY_LIST, item.listId, false)}
                            removeFormFavoriteList={removeFormFavoriteList}
                            addListToFavorite={addListToFavorite}
                            deleteList={onDeleteList}
                            // dragBusinessCardList={onBusinessCardList}
                            activeCard={activeCard}
                            getGroupName={props.getGroupName}
                            setActiveCard={setCardState}
                            sidebarCurrentId={props.sidebarCurrentId}
                            setTypeGroup={props.setTypeGroup}
                            toggleShowFeaturesIcon={onToggleShowFeaturesIcon}
                            handleDataFilter={handleDataFilter}
                            handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                            handleUpdateAutoList={onRefreshAutoList}
                            onMyListToShareList={props.onUpdateBusinessCardsList}
                            dirtyCheck={props.dirtyCheck}
                            isOnDrag={props.isOnDrag}
                          ></BusinessCardListCard>
                        </div>
                      ))}
                    </li>
                  </ul>
                </li>
                <li>
                  <ul className="list-group group">
                    <li className="category">
                      {shareList && shareList.length >= MAX_RECORD_DISPLAY
                        ? <i className={"icon-expand fas " + (isShowShareList ? "fa-chevron-down" : "fa-chevron-right")} onClick={() => props.dirtyCheck(() => setIsShowShareList(!isShowShareList))}></i>
                        : <></>
                      }
                      <div className="d-flex">
                        <a>{translate('businesscards.sidebar.title.shared-list')}</a>
                        <span className="plus-blue" onClick={() => props.dirtyCheck(() => props.onShowBusinessCardSharedList(SHARE_LISTS_MODES.MODE_CREATE_GROUP, null, false, false, []))} />
                      </div>
                      {isShowShareList && shareList && shareList.map((item, index) => (
                        <div key={index}>
                          {/* <BusinessCardDragLayer /> */}
                          <BusinessCardListCard
                            key={index}
                            sourceBusinessCardList={item}
                            isAdmin={isAdmin}
                            onClick={setIdActiveFuntion}
                            idActive={idActive}
                            type={TYPE_LIST.SHARED_LIST}
                            businessCardListActive={props.businessCardListActive}
                            openGroupModal={props.onShowBusinessCardSharedList}
                            removeFormFavoriteList={removeFormFavoriteList}
                            addListToFavorite={addListToFavorite}
                            deleteList={onDeleteList}
                            // dragBusinessCardList={onBusinessCardList}
                            activeCard={activeCard}
                            getGroupName={props.getGroupName}
                            setActiveCard={setCardState}
                            sidebarCurrentId={props.sidebarCurrentId}
                            setTypeGroup={props.setTypeGroup}
                            toggleShowFeaturesIcon={onToggleShowFeaturesIcon}
                            handleDataFilter={handleDataFilter}
                            handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                            handleUpdateAutoList={onRefreshAutoList}
                            dirtyCheck={props.dirtyCheck}
                            isOnDrag={props.isOnDrag}
                          ></BusinessCardListCard>
                        </div>
                      ))}
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
}

const mapStateToProps = ({ businessCardList, authentication }: IRootState) => ({
  listBusinessCardList: businessCardList.listBusinessCardList,
  authorities: authentication.account.authorities
});

const mapDispatchToProps = {
  handleGetBusinessCardList,
  removeListFromFavorite,
  addToFavoriteList,
  deleteList,
  handleRefreshAutoList,
  getSearchConditionInfoList
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCardControlSidebar);
