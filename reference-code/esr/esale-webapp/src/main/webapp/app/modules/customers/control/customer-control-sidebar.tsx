import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect, Options } from 'react-redux';
import CustomerControlList from './customer-control-list';

import {
  handleInitLocalMenu
} from './customer-control-sidebar.reducer';
import { translate } from 'react-jhipster';
import { CUSTOMER_LIST_TYPE, SELECT_TARGET_TYPE } from '../constants';
import { Resizable } from 're-resizable';
import { FSActionTypeScreen } from '../my-shared-list/customer-my-shared-list-modal';
import useEventListener from 'app/shared/util/use-event-listener';

interface ICustomerControlSidebarDispatchProps {
  handleInitLocalMenu
}

interface ICustomerControlSidebarStateProps {
  localMenuData: any
  removeFavouriteCustomerId: any
  addFavouriteCustomerId: any
  customerListIdDelete: any
  updatedListId: any
}

interface ICustomerControlSidebarOwnProps {
  actionActiveCardList?: (typeList, cardList) => void
  activeCardList?: any
  toggleOpenAddEditMyListModal?: (myListModalMode, currentGroupId, isAutoGroup, listMembers) => void;
  openListModal?: (listMode, listId, isOwnerList, isAutoList, listMembers) => void;
  initializeListInfo?
  handleGetInitializeListInfo?: (fieldBelong) => void,
  addListToFavouriteList?: (cardList) => void,
  removeListInFavourite?: (listId) => void,
  deleteList?: (listId) => void,
  addListToAutoList?: (list) => void;
}

type ICustomerControlSiderbarProps = ICustomerControlSidebarDispatchProps & ICustomerControlSidebarOwnProps & ICustomerControlSidebarStateProps
/**
 * Control List Customer Sidebar
 * @param props
 */
const CustomerControlSidebar: React.FC<ICustomerControlSiderbarProps> = forwardRef((props, ref) => {
  const resizeRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [width, setWidth] = React.useState(216);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false)
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false)
  const [overflowY, setOverflowY] = useState<"auto" | "hidden">("hidden")
  const innerListRef = useRef(null);
  const [keyType, setKeyType] = useState(null);

  /**
   * Handle when opening add/edit my group modal in sidebar area
   * @param myGroupModalMode
   * @param currentGroupId
   */
  const onOpenMyGroupModal = (myGroupModalMode, currentGroupId, isAutoGroup) => {
    props.toggleOpenAddEditMyListModal(myGroupModalMode, currentGroupId, isAutoGroup, null);
  }

  useImperativeHandle(ref, () => ({
    resetSidebar() {
      props.actionActiveCardList(
        CUSTOMER_LIST_TYPE.ALL_LIST,
        {
          typeList: SELECT_TARGET_TYPE.ALL_LIST,
          listId: 0,
          isAutoList: false,
          customerListType: undefined,
          listName: null
        });
      setKeyType('');
    }
  }));

  useEffect(() => {
    if (!props.localMenuData) {
      props.handleInitLocalMenu(true);
    }
  }, [])

  const onReceiveMessage = (ev) => {
    if (ev && ev.data && ev.data.type === FSActionTypeScreen.CreatUpdateSuccess) {
      props.handleInitLocalMenu(true);
    }
  }
  useEventListener('message', onReceiveMessage);

  useEffect(() => {
    // MenuLocal Customer allways true
    if (props.removeFavouriteCustomerId || props.addFavouriteCustomerId || props.customerListIdDelete || props.updatedListId) {
      props.handleInitLocalMenu(true);
    }
    if (props.customerListIdDelete) {
      props.actionActiveCardList(CUSTOMER_LIST_TYPE.ALL_LIST, {
        typeList: SELECT_TARGET_TYPE.ALL_LIST,
        listId: 0,
        isAutoList: false,
        customerListType: undefined,
        listName: null
      });
      setKeyType('');
    }
  }, [props.removeFavouriteCustomerId, props.addFavouriteCustomerId, props.customerListIdDelete, props.updatedListId])

  const handleScroll = (event) => {
    const node = event.target;
    const { scrollHeight, scrollTop, clientHeight } = node
    const bottom = scrollHeight - scrollTop
    setShowShadowTop(scrollTop > 0)
    setShowShadowBottom(bottom > clientHeight)
  }

  const handleChangeOverFlow = (type: "auto" | "hidden") => (e) => {
    setOverflowY(type)
  }

  return (
    <>
      {showSidebar &&
        <Resizable
          ref={resizeRef}
          size={{ width, height: '100%' }}
          onResizeStop={(e, direction, refx, d) => {
            setWidth(width + d.width);
          }}
          onResize={(e, direction, refx, d) => {
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
          className={`resizeable-resize-wrap  esr-content-sidebar list-category style-3 overflow-hidden shadow-local-navigation-bottom-inset ${showShadowTop && "shadow-local-navigation-top"} ${showShadowBottom && "shadow-local-navigation-bottom-inset"}`}
        >
          <div className="esr-content-sidebar-outer list-category scroll-beauty w-100" ref={innerListRef} onScroll={handleScroll} style={{ overflowY }} onMouseEnter={handleChangeOverFlow("auto")} onMouseLeave={handleChangeOverFlow("hidden")}>
            <div className={`title-lf ${props.activeCardList.typeList === CUSTOMER_LIST_TYPE.CUSTOMER_IN_CHARGE ? 'active' : ''}`}>
              <a onClick={
                () => {
                  props.actionActiveCardList(
                    CUSTOMER_LIST_TYPE.CUSTOMER_IN_CHARGE,
                    {
                      typeList: SELECT_TARGET_TYPE.CUSTOMER_IN_CHARGE,
                      listId: 0,
                      isAutoList: false,
                      customerListType: undefined,
                      listName: null
                    }); setKeyType('');
                }}
              >{translate('customers.sidebar.title.customer-charge')}</a>
            </div>
            <div className="esr-content-sidebar-inner">
              <div className="list-group">
                <a
                  className={
                    props.activeCardList.typeList === CUSTOMER_LIST_TYPE.ALL_LIST ? 'active' : ''}
                  onClick={
                    () => {
                      props.actionActiveCardList(
                        CUSTOMER_LIST_TYPE.ALL_LIST,
                        {
                          typeList: CUSTOMER_LIST_TYPE.ALL_LIST,
                          listId: 0,
                          isAutoList: false,
                          customerListType: undefined,
                          listName: null
                        }); setKeyType('');
                    }}
                >
                  {translate('customers.sidebar.title.all-customer')}
                </a>
              </div>
              <li>
                <CustomerControlList
                  toggleOpenAddEditMyListModal={onOpenMyGroupModal}
                  localMenuData={props.localMenuData}
                  actionActiveCardList={props.actionActiveCardList}
                  activeCardList={props.activeCardList}
                  openListModal={props.openListModal}
                  initializeListInfo={props.initializeListInfo}
                  handleGetInitializeListInfo={props.handleGetInitializeListInfo}
                  addListToFavouriteList={props.addListToFavouriteList}
                  removeListInFavourite={props.removeListInFavourite}
                  deleteList={props.deleteList}
                  addListToAutoList={props.addListToAutoList}
                  keyType={keyType}
                  setKeyType={setKeyType}
                />
              </li>
            </div>
          </div>
        </Resizable>
      }
      <div className={`button-collapse-sidebar-product ${showShadowTop && showSidebar ? "shadow-local-navigation-top " : ""}`} onClick={() => setShowSidebar(!showSidebar)}>
        <a className="expand"><i className={`far ${showSidebar ? "fa-angle-left" : "fa-angle-right"}  `} /></a>
      </div>
    </>
  )
});

const mapStateToProps = ({ customerControlSidebar, customerList, customerMySharedListState }: IRootState, ownProps: ICustomerControlSidebarOwnProps) => {
  const stateObject = {
    localMenuData: null,
    removeFavouriteCustomerId: null,
    addFavouriteCustomerId: null,
    customerListIdDelete: null,
    updatedListId: null
  }
  stateObject.localMenuData = customerControlSidebar.localMenuData;
  stateObject.removeFavouriteCustomerId = customerList.removeFavouriteCustomerId;
  stateObject.addFavouriteCustomerId = customerList.addFavouriteCustomerId;
  stateObject.customerListIdDelete = customerList.customerListIdDelete;
  stateObject.updatedListId = customerMySharedListState.updatedListId;
  return stateObject;
};

const mapDispatchToProps = {
  handleInitLocalMenu
};

const options = { forwardRef: true };

export default connect<ICustomerControlSidebarStateProps, ICustomerControlSidebarDispatchProps, ICustomerControlSidebarOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(CustomerControlSidebar);