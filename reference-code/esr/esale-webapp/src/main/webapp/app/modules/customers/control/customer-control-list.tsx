import React, { useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import { TranslatorContext, Storage } from 'react-jhipster';
import CustomerControlListCard from './customer-control-list-card';
import {
  handleAddCustomersToAutoList
} from './customer-control-sidebar.reducer';
import { CUSTOMER_LIST_TYPE, CUSTOMER_MY_LIST_MODES, SHARE_LIST_MODES } from '../constants';
import { MY_GROUP_MODES } from 'app/modules/employees/constants';
import _ from 'lodash';
import CategoryDragLayer from 'app/shared/layout/menu/category-drag-layer';

export interface ICustomerControlListProps extends StateProps, DispatchProps {
  localMenuData: any,
  actionActiveCardList?: (typeList, cardList, listViewCondition) => void
  activeCardList?: any
  toggleOpenAddEditMyListModal?: (myListModalMode, currentGroupId, isAutoGroup) => void;
  openListModal?: (listMode, listId, isOwnerList, isAutoList, listMembers) => void;
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void,
  addListToFavouriteList?: (cardList) => void,
  removeListInFavourite?: (listId) => void,
  deleteList?: (listId) => void,
  addListToAutoList?: (list) => void;
  keyType: any;
  setKeyType: (keyType) => void;
}


/**
 * Customer Control List card
 * @param props
 */

const CustomerControlList = (props: ICustomerControlListProps) => {
  const [favouriteListDisplay, setFavouriteListDisplay] = useState([]);
  const [myListDisplay, setMyListDisplay] = useState([]);
  const [sharedListDisplay, setSharedListDisplay] = useState([]);
  const [isShowFavouriteList, setShowFavouriteList] = useState(true);
  const [isShowShareList, setShowShareList] = useState(true);
  const [isShowMyList, setShowMyList] = useState(true);

  const MAX_RECORD_DISPLAY = 5;

  const shareListDefault = {
    listId: 0,
    participantType: 2,
    customerListType: 2,
    listName: ' ',
    isAutoList: false
  }

  useEffect(() => {
    if (props.localMenuData) {
      setFavouriteListDisplay(props.localMenuData.favouriteList);
      setMyListDisplay(props.localMenuData.myList);
      if (props.localMenuData.sharedList.length > 0) {
        setSharedListDisplay(props.localMenuData.sharedList);
      } else {
        setSharedListDisplay([shareListDefault]);
      }
    }
  }, [props.localMenuData])


  const handleOpenMyListEdit = (listTypeIn, myListModalMode, currentListId, isOwnerList, isAutoList, listMembers) => {
    if (listTypeIn === CUSTOMER_LIST_TYPE.MY_LIST) {
      props.toggleOpenAddEditMyListModal(myListModalMode, currentListId, isAutoList);
    } else {
      props.openListModal(myListModalMode, currentListId, isOwnerList, isAutoList, listMembers)
    }
  }

  const onDragList = (sourceList, targetList) => {
    if(targetList.isFavorite) {
      props.addListToFavouriteList(sourceList)
    } else {
      handleOpenMyListEdit(
        CUSTOMER_LIST_TYPE.SHARED_LIST,
        SHARE_LIST_MODES.MODE_SWICH_LIST_TYPE,
        sourceList.listId,
        false,
        sourceList.isAutoList,
        null)
    }
  }

  const isMatchFilter = (list, textSearch) => {
    // const listName = JSON.parse(list.listName);
    return list.listName.includes(textSearch);
  }

  const showListSearch = (event) => {
    const fieldsFavourite = props.localMenuData.favouriteList.filter(e => isMatchFilter(e, event.target.value.trim()));
    const fieldsMyList = props.localMenuData.myList.filter(e => isMatchFilter(e, event.target.value.trim()));
    const fieldsSharedList = props.localMenuData.sharedList.filter(e => isMatchFilter(e, event.target.value.trim()));
    setFavouriteListDisplay(fieldsFavourite);
    setMyListDisplay(fieldsMyList);
    setSharedListDisplay(fieldsSharedList);
  }

  /**
   * Handle Open Shared Modal
   */
  const handleOpenListSharedModal = () => {
    props.openListModal(SHARE_LIST_MODES.MODE_CREATE_LIST, null, false, false, null)
  }

  return (
    <>
      {props.localMenuData &&
        (props.localMenuData.favouriteList.length + props.localMenuData.myList.length + props.localMenuData.sharedList.length) >= MAX_RECORD_DISPLAY &&
        <li>
          <div className="search-box-button-style">
            <button className="icon-search"><i className="far fa-search"></i></button>
            <input type="text" placeholder={translate('customers.list.place-holder.search')} onChange={(e) => showListSearch(e)} />
          </div>
        </li>
      }
      <ul className="list-group">
        <li className="category">
          {favouriteListDisplay && favouriteListDisplay.length >= MAX_RECORD_DISPLAY
            ? <i className={"fas " + (isShowFavouriteList ? "fa-sort-down" : "fa-caret-right")} onClick={() => setShowFavouriteList(!isShowFavouriteList)}></i> 
            : <></>}
          <CategoryDragLayer />
          <div className="d-flex">
            <a>{translate('customers.sidebar.title.favourite-list')}</a>
          </div>
          {props.localMenuData && props.localMenuData.favouriteList && props.localMenuData.favouriteList.length > 0 &&
            <>
              <ul className="list-group">
                {isShowFavouriteList && favouriteListDisplay && favouriteListDisplay.map((item, idx) => {
                  item.isFavorite = true;
                  return (
                    <CustomerControlListCard
                    typeList={CUSTOMER_LIST_TYPE.FAVORITE_LIST}
                    key={idx}
                    sourceList={item}
                    dragList={onDragList}
                    actionActiveCardList={props.actionActiveCardList}
                    activeCardList={props.activeCardList}
                    addListToAutoList={props.addListToAutoList}
                    keyType={props.keyType}
                    toggleOpenAddEditModal={handleOpenMyListEdit}
                    setKeyType={props.setKeyType}
                    initializeListInfo={props.initializeListInfo}
                    handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                    favouriteList={_.get(props.localMenuData, 'favouriteList')}
                    addListToFavouriteList={props.addListToFavouriteList}
                    removeListInFavourite={props.removeListInFavourite}
                    deleteList={props.deleteList}
                  />
                  )
                })}
              </ul>
            </>
          }
        </li>
      </ul>
      <ul className="list-group">
        <li className="category">
          {myListDisplay && myListDisplay.length >= MAX_RECORD_DISPLAY 
            ? <i className={"fas " + (isShowMyList ? "fa-sort-down" : "fa-caret-right")} onClick={() => setShowMyList(!isShowMyList)}></i> 
            : <></>}
          <div className="d-flex">
            <a>{translate('customers.sidebar.title.my-list')}</a>
            <span
              className="plus-blue"
              onClick={
                () => props.toggleOpenAddEditMyListModal(
                  CUSTOMER_MY_LIST_MODES.MODE_CREATE_LIST,
                  null,
                  false
                )
              }>
            </span>
          </div>
          {props.localMenuData && props.localMenuData.myList &&
            <>
              <ul className="list-group">
                {isShowMyList && myListDisplay && myListDisplay.map((item, idx) => (
                  // class => active when select
                  <CustomerControlListCard
                    typeList={CUSTOMER_LIST_TYPE.MY_LIST}
                    key={idx}
                    sourceList={item}
                    dragList={onDragList}
                    actionActiveCardList={props.actionActiveCardList}
                    activeCardList={props.activeCardList}
                    addListToAutoList={props.addListToAutoList}
                    keyType={props.keyType}
                    toggleOpenAddEditModal={handleOpenMyListEdit}
                    setKeyType={props.setKeyType}
                    initializeListInfo={props.initializeListInfo}
                    handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                    favouriteList={_.get(props.localMenuData, 'favouriteList')}
                    addListToFavouriteList={props.addListToFavouriteList}
                    removeListInFavourite={props.removeListInFavourite}
                    deleteList={props.deleteList}
                  />
                ))}
              </ul>
            </>
          }
        </li>
      </ul>
      <ul className="list-group">
        <li className="category">
          {sharedListDisplay && sharedListDisplay.length >= MAX_RECORD_DISPLAY 
            ? <i className={"fas " + (isShowShareList ? "fa-sort-down" : "fa-caret-right")} onClick={() => setShowShareList(!isShowShareList)}></i> 
            : <></>}
          <div className="d-flex">
            <a>{translate('customers.sidebar.title.shared-list')}</a>
            <span className="plus-blue" onClick={handleOpenListSharedModal}></span>
          </div>
          {props.localMenuData && props.localMenuData.sharedList &&
            <>
              <ul className="list-group">
                {isShowShareList && sharedListDisplay && sharedListDisplay.map((item, idx) => (
                  <CustomerControlListCard
                    typeList={CUSTOMER_LIST_TYPE.SHARED_LIST}
                    key={idx}
                    sourceList={item}
                    dragList={onDragList}
                    actionActiveCardList={props.actionActiveCardList}
                    activeCardList={props.activeCardList}
                    addListToAutoList={props.addListToAutoList}
                    toggleOpenAddEditModal={handleOpenMyListEdit}
                    keyType={props.keyType}
                    setKeyType={props.setKeyType}
                    initializeListInfo={props.initializeListInfo}
                    handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                    favouriteList={_.get(props.localMenuData, 'favouriteList')}
                    addListToFavouriteList={props.addListToFavouriteList}
                    removeListInFavourite={props.removeListInFavourite}
                    deleteList={props.deleteList}
                  />
                ))}
              </ul>
            </>
          }
        </li>
      </ul>
    </>
  )
}

const mapStateToProps = ({ customerControlSidebar }: IRootState) => ({
});

const mapDispatchToProps = {
  handleAddCustomersToAutoList,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerControlList);
