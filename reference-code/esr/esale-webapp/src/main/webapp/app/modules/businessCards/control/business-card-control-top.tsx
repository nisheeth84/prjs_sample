import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { AUTHORITIES, ScreenMode } from "app/config/constants";
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import useEventListener from 'app/shared/util/use-event-listener';
import { MY_LISTS_MODES, TYPE_OF_LIST, BUSINESS_CARD_VIEW_MODES, BUSINESS_CARD_ACTION_TYPES, OPTION_DELETE, SEARCH_MODE } from '../constants';
import {
  refreshAutoList, addToFavoriteList, removeListFromFavorite, handleGetBusinessCardList,
  deleteList,
  deleteBusinessCard,
  removeBusinessCardsFromList,
  handleExportBusinessCards,
  BusinessCardAction,
  handleRefreshAutoList
} from "../list/business-card-list.reducer"
import {
  SHARE_LISTS_MODES
} from '../constants'
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { startExecuting } from 'app/shared/reducers/action-executing';
import {CommonUtil} from 'app/modules/activity/common/common-util';

interface IControlTopProps extends StateProps, DispatchProps {
  toggleSwitchDisplay,
  modeDisplay?: ScreenMode,
  toggleOpenPopupSearch,
  parentCallback,
  view,
  recordCheckListView,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleOpenMergeBusinessCard: any,
  toggleUpdateInEditMode?: () => void,
  textSearch?: string,
  enterSearchText?: (text) => void,
  onOpenPopupAddCardsToList,
  onOpenPopupMoveList,
  businessCardListActive,
  onOpenPopupCreateMyList,
  onOpenPopupCreateShareList,
  onShowBusinessCardSharedList,
  onOpenCreateEditBusinessCard,
  onShowBusinessCardMyList?: (myListModalMode, id, isAutoGroup, listMembers) => void
  reloadScreen,
  selectedTargetType: any;
  selectedTargetId: any;
  recordCheckList: any,
  setConDisplaySearchDetail: () => void,
  conDisplaySearchDetail: any,
  searchMode: any,
  toggleOpenHelpPopup,
  toggleOpenPopupSetting,
  onUpdateBusinessCardsList,
  menuType: any,
  openSwitchDisplay?: boolean,
  openPopupHelp?: boolean,
}

interface IDynamicListStateProps {
  authorities,
}

type IBusinessCardControlTopProps = IControlTopProps & IDynamicListStateProps;

const BusinessCardControlTop = (props: IBusinessCardControlTopProps) => {
  const [showRegistrationOption, setShowRegistrationOption] = useState(false);
  const [listAction, setListAction] = useState(false);
  const [type, setType] = useState(1);
  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);
  const [isFavorit, setIsFavorit] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const popupRef = useRef(null);
  const refModal = useRef();
  const [checkDeleteBusinessCard, setCheckDeleteBusinessCard] = useState(false);
  const [checkDeleteLastBusinessCard, setCheckDeleteLastBusinessCard] = useState(false);
  const [recordCheckList, setRecordCheckList] = useState([]);
  const [businessCardList, setBusinessCardList] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const handleMouseDownRegistration = (e) => {
    if (!popupRef || !popupRef.current || (popupRef.current && popupRef.current.contains(e.target))) {
      return;
    }
    setShowRegistrationOption(false);
  }

  const onClickOpenMergeBusinessCard = () => {
    props.toggleOpenMergeBusinessCard();
  };


  const switchView = () => {
    if (type === 1) {
      setType(2);
      props.parentCallback(2);
    } else if (type === 2) {
      setType(1);
      props.parentCallback(1);
    }
  };

  function useOnClickOutside(ref, handler) {
    useEffect(() => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }, [ref, handler]);
  }

  useOnClickOutside(refModal, () => setListAction(false));

  const checkOwner = (item) => {
    if(item.listType === 2) {
      const employeeId = CommonUtil.getUserLogin().employeeId;
      const listOwner = JSON.parse(item.ownerList)['employeeId'];
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

  useEffect(() => {
    if (props.businessCardListActive) {
      setIsOwner(checkOwner(props.businessCardListActive));
      setIsFavorit(props.businessCardListActive && props.businessCardListActive.displayOrderOfFavoriteList);
    }
  }, [props.businessCardListActive]);

  const onClickSwitchDisplay = (event) => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      props.toggleSwitchDisplay();
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (props.view === 1) {
      setRecordCheckList(props.recordCheckList)
    }
  }, [props.recordCheckList]);

  useEffect(() => {
    if (props.businessCardList) {
      setBusinessCardList(props.businessCardList.businessCards)
    }
  }, [props.businessCardList]);

  useEffect(() => {
    if (props.view === 2) {
      setRecordCheckList(props.recordCheckListView)
    }
  }, [props.recordCheckListView]);

  const isShow = (checkEdit) => checkEdit === ScreenMode.EDIT

  const hasRecordCheck = () => {
    return recordCheckList && recordCheckList.length > 0 && recordCheckList.filter(e => e.isChecked).length > 0;
  }

  const onClickOpenPopupSearch = (event) => {
    props.toggleOpenPopupSearch();
    event.preventDefault();
  };

  const getCheckedIds = () => {
    const listCheckedIds = [];
    if (hasRecordCheck()) {
      recordCheckList.forEach(e => {
        if (e.isChecked) {
          listCheckedIds.push(e)
        }
      });
    }
    return listCheckedIds;
  }

  const onOpenPopupAddCardsToList = () => {
    const lstIdChecked = getCheckedIds();
    props.onOpenPopupAddCardsToList(lstIdChecked);
  }

  const onOpenPopupMoveList = () => {
    const lstIdChecked = getCheckedIds();
    props.onOpenPopupMoveList(lstIdChecked);
  }

  useEventListener('mousedown', handleMouseDownRegistration);

  const onBlurTextSearch = (event) => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }

  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      if (props.enterSearchText) {
        setValueTextSearchOld(valueTextSearch.trim());
        props.enterSearchText(valueTextSearch.trim());
      }
    }
  }

  const favoriteList = (item) => {
    if (!isFavorit) {
      props.addToFavoriteList(item.listId)
      setIsFavorit(true)
    } else {
      props.removeListFromFavorite(item.listId)
      setIsFavorit(false)
    }
  }

  const onOpenPopupCreateMyList = () => {
    const lstIdChecked = getCheckedIds().map(x => { return x.businessCardId });
    props.onOpenPopupCreateMyList(lstIdChecked);
  }

  const onOpenPopupCreateShareList = () => {
    const lstIdChecked = getCheckedIds().map(x => { return x.businessCardId });
    props.onOpenPopupCreateShareList(lstIdChecked);
  }

  const onDeleteList = async () => {
    const result = await ConfirmDialog({
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message: translate("messages.WAR_COM_0001", { itemName: props.businessCardListActive.listName }),
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.deleteList(props.businessCardListActive.listId)
    }
  }

  const deleteBusinessCards = option => {
    const businessCards = [];
    const mapRecordCheckList = [];
    props.recordCheckList.forEach(item => {
      let businessCard = businessCardList[businessCardList.findIndex(e => e.business_card_id === item.businessCardId)];
      businessCard = { ...businessCard, businessCardId: item.businessCardId };
      mapRecordCheckList.push(businessCard);
    });
    const data = mapRecordCheckList.reduce(function (results, org) {
      const lastName = org.last_name ? org.last_name : '';
      (results[org.customer_id] = results[org.customer_id] || []).push({ businessCardId: org.business_card_id, businessCardName: org.first_name + " " + lastName });
      return results;
    }, {});
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const businessCardIds = [];
      const businessCardNames = [];
      for (let j = 0; j < data[keys[i]].length; j++) {
        businessCardIds.push(data[keys[i]][j].businessCardId);
        businessCardNames.push(data[keys[i]][j].businessCardName);
      }
      businessCards.push({ customerId: keys[i], businessCardIds, businessCardNames });
    }
    props.deleteBusinessCard(businessCards, option)
  }

  const onDeleteBusinessCard = () => {
    deleteBusinessCards(OPTION_DELETE.checkDelete)
  }
  const getIsOverWrite = (isOverWrite) => isOverWrite === 0

  const getListMode = (isListMode) => isListMode === 2

  const onOpenAddEditMyBusinessCardModal = (myListModalMode, id, isAutoGroup) => {
    props.onShowBusinessCardMyList(myListModalMode, id, isAutoGroup, null);
  }

  const onRemoveBusinessCardsFromList = async () => {
    const arrayId = []
    props.recordCheckList.map(x => {
      arrayId.push(x.businessCardId)
    })
    const result = await ConfirmDialog({
      title: (<>{translate('products.top.dialog.title-delete-products')}</>),
      message: translate("messages.WAR_BUS_0003", { 0: arrayId.length }),
      confirmText: translate('products.top.dialog.confirm-delete-products'),
      confirmClass: "button-red",
      cancelText: translate('products.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.removeBusinessCardsFromList(arrayId, props.businessCardListActive.listId)
    }
  }

  const getCheckedBusinessCardsFromCheckList = () => {
    const listCheckedIds = [];
    const listUpdatedDates = [];
    props.recordCheckList.forEach(e => {
      if (e.isChecked) {
        listCheckedIds.push(e.businessCardId);
        listUpdatedDates.push(e.updatedDate);
      }
    });
    return { listCheckedIds, listUpdatedDates };
  }

  const exportBusinessCards = () => {
    if (hasRecordCheck()) {
      const listCheckedIds = getCheckedBusinessCardsFromCheckList().listCheckedIds;
      props.handleExportBusinessCards(listCheckedIds);
    }
  }

  const onClickClosePopupDelete = () => {
    setCheckDeleteBusinessCard(false);
    setCheckDeleteLastBusinessCard(false);
  }

  const onClickConfirmPopupDelete = () => {
    deleteBusinessCards(OPTION_DELETE.deleteOnly);
    onClickClosePopupDelete();
  }

  const onClickConfirmPopupDeleteMulti = () => {
    deleteBusinessCards(OPTION_DELETE.deleteMulti);
    onClickClosePopupDelete();
  }

  useEffect(() => {
    if (props.urlBusinessCardDownload) {
      // download file csv when api response an url
      window.open(props.urlBusinessCardDownload);
    }
  }, [props.urlBusinessCardDownload]);

  useEffect(() => {
    if (props.deleteBusinessCards && props.actionDelete === BusinessCardAction.Success) {
      if (props.deleteBusinessCards && props.deleteBusinessCards.listOfBusinessCardId.length > 0) {
        setCheckDeleteLastBusinessCard(false);
        setCheckDeleteBusinessCard(false);
        props.reloadScreen();
      } else {
        if (props.deleteBusinessCards.hasLastBusinessCard) {
          setCheckDeleteLastBusinessCard(true);
        } else {
          setCheckDeleteBusinessCard(true);
        }
      }
    }
  }, [props.deleteBusinessCards])

  const onDuplicateMyBusinessCard = () => {
    if (props.businessCardListActive.listType === 1) {
      onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_COPY_MY_LIST, props.businessCardListActive.listId, props.businessCardListActive.isAutoList);
    }
    if (props.businessCardListActive.listType === 2) {
      props.onShowBusinessCardSharedList(
        SHARE_LISTS_MODES.MODE_COPY_GROUP,
        props.businessCardListActive.listId,
        getIsOverWrite(props.businessCardListActive.isOverWrite),
        getListMode(props.businessCardListActive.listMode),
        null)
    }
  }

  const onMyListToShareList = () => {
    props.onUpdateBusinessCardsList();
  }

  const onRefreshList = (id) => {
    if(id) {
      props.handleRefreshAutoList(id);
    }
  }

  const renderDeleteLastBusinessCard = () => {
    return (
      checkDeleteLastBusinessCard &&
      <>
        <div className="popup-esr2 popup-esr3 popup-product" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-esr2-body">
              <a className="icon-small-primary icon-close-up-small" onClick={onClickClosePopupDelete} />
              <div className="popup-esr2-title">
                {translate('businesscards.detail.label.title.delete')}
              </div>
              <div>{props.deleteBusinessCards ? props.deleteBusinessCards.messageWarning : ''}</div>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-blue" onClick={onClickConfirmPopupDeleteMulti}>{translate('businesscards.detail.label.button.confirmMulti')}</a>
              <a className="button-blue" onClick={onClickConfirmPopupDelete}>{translate('businesscards.detail.label.button.confirmOnly')}</a>
              <a className="button-cancel" onClick={onClickClosePopupDelete}>{translate('businesscards.detail.label.button.cancel')}</a>
            </div>
          </div>

        </div>
        <div className="modal-backdrop show" />
      </>
    )
  }

  const renderDeleteBusinessCard = () => {
    return (
      checkDeleteBusinessCard &&
      <>
        <div className="popup-esr2 popup-esr3 popup-product" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-esr2-body">
              <a className="icon-small-primary icon-close-up-small" onClick={onClickClosePopupDelete} />
              <div className="popup-esr2-title">
                {translate('businesscards.detail.label.title.delete')}
              </div>
              <div>{props.deleteBusinessCards ? props.deleteBusinessCards.messageWarning : ''}</div>
            </div>
            <div className="popup-esr2-footer justify-content-center">
              <a className="button-blue" onClick={onClickConfirmPopupDelete}>{translate('businesscards.detail.label.button.confirm')}</a>
              <a className="button-cancel" onClick={onClickClosePopupDelete}>{translate('businesscards.detail.label.button.cancel')}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>
    )
  }

  const createBusinessCardList = () => {
    if (props.businessCardListActive.listType === 2) {
      props.onShowBusinessCardSharedList(
        SHARE_LISTS_MODES.MODE_EDIT_GROUP,
        props.businessCardListActive.listId,
        getIsOverWrite(props.businessCardListActive.isOverWrite),
        getListMode(props.businessCardListActive.listMode),
        null)
    } else {
      onOpenAddEditMyBusinessCardModal(MY_LISTS_MODES.MODE_EDIT_MY_LIST, props.businessCardListActive.listId, props.businessCardListActive.isAutoList);
    }
  }

  const checkShowRemove = (businessCardListActive) => {
    return businessCardListActive && (businessCardListActive.listType === 1 || (businessCardListActive.listType === 2 && isOwner))
  }

  const checkShowUpdate = (businessCardListActive) => {
    // return businessCardListActive && businessCardListActive.listMode === TYPE_OF_LIST.AUTO && isAdmin 
    return businessCardListActive && businessCardListActive.listMode === TYPE_OF_LIST.AUTO && (businessCardListActive.listType === 1 || (businessCardListActive.listType === 2 && isOwner))
  }
  const checkShowMove = (businessCardListActive) => {
    return businessCardListActive && (businessCardListActive.listMode === TYPE_OF_LIST.MANUAL && businessCardListActive.listType === 1) || isOwner
  }

  const getActiveButton = (active: boolean) => {
    return active ? ' active' : '';
  }

  const checkRefresh = (list) => {
    return list.listMode === 2 && (checkOwner(list) || !checkViewer(list));
  }

  return (
    <div className="control-top">
      <div className="left">
        <div className={"button-shadow-add-select-wrap custom"}>
          <a
            title=""
            className={"button-shadow-add-select" + ((!isAdmin || props.modeDisplay === ScreenMode.EDIT) ? " disable" : "")}
            onClick={(event) => { if (isAdmin && props.modeDisplay === ScreenMode.DISPLAY) { props.onOpenCreateEditBusinessCard(BUSINESS_CARD_ACTION_TYPES.CREATE, BUSINESS_CARD_VIEW_MODES.EDITABLE); event.preventDefault(); } }}
          >{translate('businesscards.top.title.btn-registration')}</a>
          <span
            className={"button-arrow" + ((!isAdmin || props.modeDisplay === ScreenMode.EDIT) ? " disable" : "") + (showRegistrationOption ? " active" : "")}
            onClick={() => setShowRegistrationOption(!showRegistrationOption)}
          ></span>
          {showRegistrationOption &&
            <div className="box-select-option" ref={popupRef}>
              <ul>
                <li>
                  <a href="javascript:;"
                    onClick={(event) => { if (isAdmin && props.modeDisplay === ScreenMode.DISPLAY) { props.onOpenCreateEditBusinessCard(BUSINESS_CARD_ACTION_TYPES.CREATE, BUSINESS_CARD_VIEW_MODES.EDITABLE); event.preventDefault(); } }}
                  >
                    {translate('businesscards.top.title.btn-registration')}
                  </a>
                </li>
                <li><a href="javascript:;">{translate('businesscards.top.title.btn-import')}</a></li>
              </ul>
            </div>}
        </div>
        {hasRecordCheck() && !isShow(props.modeDisplay) &&
          <>
            <div className="button-pull-down-parent" onClick={() => setListAction(!listAction)} ref={refModal}>
              <a title="" className={"button-pull-down" + (listAction ? " active" : "")}>
                {translate('businesscards.top.title.btn-operation')}
              </a>
              {listAction &&
                <div className="box-select-option">
                  <ul>
                    {checkShowUpdate(props.businessCardListActive) &&
                      <li onClick={() => onRefreshList(props.businessCardListActive?.listId)}>
                        <a title="">
                          <img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                          {translate('businesscards.top.title.btn-update-list')}
                        </a>
                      </li>
                    }
                    <li onClick={onOpenPopupAddCardsToList}>
                      <a title="">
                        <img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                        {translate('businesscards.top.title.btn-add-to-list')}
                      </a>
                    </li>
                    {checkShowMove(props.businessCardListActive) &&
                      <li onClick={onOpenPopupMoveList}>
                        <a title="">
                          <img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                          {translate('businesscards.top.title.btn-move-list')}
                        </a>
                      </li>
                    }
                    <li onClick={onOpenPopupCreateMyList}>
                      <a title="">
                        <img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                        {translate('businesscards.top.title.btn-create-my-list')}
                      </a>
                    </li>
                    <li onClick={onOpenPopupCreateShareList}>
                      <a title="">
                        <img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                        {translate('businesscards.top.title.btn-create-shared-list')}
                      </a>
                    </li>
                    {checkShowRemove(props.businessCardListActive) &&
                      <li onClick={() => { onRemoveBusinessCardsFromList() }}>
                        <a title=""><img className="icon" src="../../../content/images/common/ic-content-paste.svg" alt="" />
                          {translate('businesscards.top.title.btn-remove-from-list')}
                        </a>
                      </li>
                    }
                  </ul>
                </div>}
            </div>
            {isAdmin && <>
              <a className="icon-primary icon-integration" onClick={(event) => { onClickOpenMergeBusinessCard(); event.preventDefault(); }}></a>
              <a className="icon-primary icon-erase" onClick={(event) => { onDeleteBusinessCard(); event.preventDefault(); }}></a>
            </>}
            <a className="icon-primary icon-import" onClick={exportBusinessCards}></a>
          </>
        }
        {!hasRecordCheck() && !isShow(props.modeDisplay) && props.businessCardListActive &&
          <>
            {checkRefresh(props.businessCardListActive) && <a
              className="icon-primary icon-update"
              onClick={() => props.refreshAutoList(props.businessCardListActive.listId)}
            />}
            <a className={"icon-primary icon-add-favorites" + (isFavorit ? " active" : "")}
              onClick={() => favoriteList(props.businessCardListActive)}
            />
            {
              (isOwner || props.businessCardListActive.listType === 1) &&
              <>
                <a
                  className="icon-primary icon-content-paste"
                  onClick={() => createBusinessCardList()}
                />
                <a className="icon-primary icon-content-delete" onClick={onDeleteList} />
              </>
            }
            <a className="icon-primary icon-content-group" onClick={onDuplicateMyBusinessCard} />
            {
              props.businessCardListActive.listType === 1 && <a className="icon-primary ic-convert-shared-list" onClick={onMyListToShareList} />
            }
          </>
        }
      </div>
      <div className="right">
        {!(hasRecordCheck() && props.modeDisplay === ScreenMode.EDIT) &&
          <>
            {
              !props.menuType && <a onClick={onClickSwitchDisplay} title="" className={"icon-primary icon-switch-display" + (props.modeDisplay === ScreenMode.EDIT ? " disable" : "") + getActiveButton(props.openSwitchDisplay)}></a>
            }
            <a
              onClick={(event) => { if (isAdmin && props.modeDisplay === ScreenMode.DISPLAY) { switchView(); event.preventDefault(); } }}
              title="" className={`icon-primary ml-2 ${props.view === 1 ? "icon-board-view" : 'icon-list-view'}` + (props.modeDisplay === ScreenMode.EDIT && isAdmin ? " disable" : "")}
            ></a>
            <a title="" className="icon-primary icon-map  ml-2"></a>
          </>
        }
        {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) ? (
          <div className="search-box-button-style">
            <button className="icon-search"><i className="far fa-search" /></button>
            <input type="text" placeholder={translate('businesscards.top.place-holder.search')} />
            <button className="icon-fil" onClick={onClickOpenPopupSearch} />
            <div className="tag">
              {translate('employees.top.place-holder.searching')}
              <button className="close" onClick={() => { setValueTextSearch(''); props.setConDisplaySearchDetail() }}>×</button>
            </div>
          </div>
        ) : (
            <div className="search-box-button-style">
              <button className="icon-search"><i className="far fa-search"></i></button>
              <input
                type="text"
                placeholder={translate('businesscards.top.place-holder.search')} value={valueTextSearch}
                onChange={(e) => setValueTextSearch(e.target.value)} onBlur={onBlurTextSearch} onKeyPress={handleKeyPress}
              />
              <button id="open-popup-window" className="icon-fil" data-toggle="modal" onClick={onClickOpenPopupSearch}></button>
            </div>
          )}
        {props.modeDisplay === ScreenMode.DISPLAY && isAdmin &&
          <a
            title=""
            className="button-primary button-simple-edit ml-2"
            onClick={(e) => props.toggleSwitchEditMode(true)}
          >{translate('businesscards.top.title.btn-edit')}</a>}
        {props.modeDisplay === ScreenMode.DISPLAY && !isAdmin &&
          <a title="" className="button-primary button-simple-edit ml-2">{translate('businesscards.top.title.btn-edit')}</a>}
        {props.modeDisplay === ScreenMode.EDIT &&
          <button className="button-cancel" type="button" onClick={(e) => props.toggleSwitchEditMode(false)}>{translate('businesscards.top.title.btn-cancel')}</button>}
        {props.modeDisplay === ScreenMode.EDIT &&
          <button className="button-save" type="button" onClick={(e) => props.toggleUpdateInEditMode()}>{translate('businesscards.top.title.btn-save')}</button>}
        <a onClick={props.toggleOpenHelpPopup} title="" className={"icon-small-primary icon-help-small" + getActiveButton(props.openPopupHelp)}></a>
        {isAdmin && <a onClick={props.toggleOpenPopupSetting} title="" className="icon-small-primary icon-setting-small"></a>}
      </div>
      {renderDeleteLastBusinessCard()}
      {renderDeleteBusinessCard()}
    </div>
  )
}

const mapStateToProps = ({ authentication, dynamicList, businessCardList }: IRootState) => ({
  authorities: authentication.account.authorities,
  urlBusinessCardDownload: businessCardList.businessCardInfo,
  actionDelete: businessCardList.actionDelete,
  deleteBusinessCards: businessCardList.deleteBusinessCards,
  businessCardList: businessCardList.businessCardList
});

const mapDispatchToProps = {
  refreshAutoList,
  addToFavoriteList,
  removeListFromFavorite,
  handleGetBusinessCardList,
  deleteList,
  startExecuting,
  removeBusinessCardsFromList,
  deleteBusinessCard,
  handleExportBusinessCards,
  handleRefreshAutoList
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCardControlTop)
