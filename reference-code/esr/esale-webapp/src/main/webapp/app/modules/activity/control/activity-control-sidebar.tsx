import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { MENU_TYPE } from '../constants';
import {
  handleGetActivities,
  handleUpdateActivityFromSearch,
  handInitBusinessCartList,
  handInitCustomerList,
  handleGetList,
  handleGetCustomers,
  handleGetBusinessCards,
  handleListGetProductTradings
} from '../list/activity-list-reducer';
import { translate } from 'react-jhipster';
import { ListInfoType } from '../models/get-business-card-list-type';
import { FavouriteListType } from '../models/get-customer-list-type';
import { SaleInfo } from '../models/get-list-sales';
import { Resizable } from 're-resizable';
import * as R from 'ramda';
type IActivityControlSidebarProp = StateProps & DispatchProps & {
  updateFiltersSearch?: (filters) => void;
  resetLocalNavigation?: number;
  onChangeLocalNavigation?: (card?: any) => void;
}

/**
 * component for show local navigation
 * @param props 
 */
const ActivityControlSidebar = (props: IActivityControlSidebarProp) => {

  const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_ACTIVITY, cardId: null , isSearch: false});
  const [dataMaster, setDataMaster] = useState(null)
  const [lstCustomerFavorites, setLstCustomerFavorites] = useState([]);
  const [lstBusinessCardFavorites, setBusinessCardFavorites] = useState([]);
  const [lstProductTradingFavorites, setProductTradingFavorites] = useState([]);
  const [toggleCustomer, setToggleCustomer] = useState(false);
  const [toggleBusinessCard, setToggleBusinessCard] = useState(false);
  const [toggleSale, setToggleSale] = useState(false);
  const [shadowTop, setShadowTop] = useState(false);
  const [shadowBottom, setShadowBottom] = useState(false);
  const scrollRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [totalNav, setTotalNav] = useState(0);
  const resizeRef = useRef(null);
  const [width, setWidth] = useState(216);
  const innerListRef = useRef(null);
  const [overflowY, setOverflowY] = useState<'auto' | 'hidden'>('hidden');
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    props.handInitBusinessCartList({ mode: 1 });
    props.handInitCustomerList({ isFavourite: true });
    props.handleGetList(1);
  }, []);

  const handleScroll = useCallback(
    (event: { target: any }) => {
      const node = event.target;
      const { scrollHeight, scrollTop, clientHeight } = node;
      const bottom = scrollHeight - scrollTop;
      setShadowTop(scrollTop > 0);
      setShadowBottom(bottom > clientHeight);
    },
    [setShadowTop, setShadowBottom]
  );

  useEffect(() => {
    showSidebar && setShadowTop(false);
  }, [showSidebar]);

  useEffect(() => {
    showSidebar && setShadowBottom(innerListRef.current.clientHeight < innerListRef.current.scrollHeight);
  }, [props.customerData, props.businessCartData, props.listSaleData, showSidebar]);

  useEffect(() => {
    const lstProduct = props.listSaleData?.data?.listInfo?.length > 0
      ? props.listSaleData?.data?.listInfo.filter(obj => { return obj.displayOrderOfFavoriteList !== null && obj.displayOrderOfFavoriteList > 0 }) : [];
    const lstBusinessCard = props.businessCartData?.listInfo?.length > 0
      ? props.businessCartData?.listInfo.filter(obj => { return obj.displayOrderOfFavoriteList !== null && obj.displayOrderOfFavoriteList > 0 }) : [];
    setDataMaster({
      lstCustomerFavorites: props.customerData?.favouriteList,
      lstBusinessCardFavorites: lstBusinessCard,
      lstProductTradingFavorites: lstProduct
    })
    setLstCustomerFavorites(props.customerData?.favouriteList);
    setBusinessCardFavorites(lstBusinessCard);
    setProductTradingFavorites(lstProduct);
    const numberCus = props.customerData?.favouriteList? props.customerData?.favouriteList.length: 0;
    const numberCard = lstBusinessCard? lstBusinessCard.length: 0;
    const numberTrad = lstProduct? lstProduct.length: 0;
    setTotalNav(numberCus + numberCard + numberTrad);
  }, [props.customerData, props.businessCartData, props.listSaleData])

  useEffect(() => {
    if (lstCustomerFavorites && lstCustomerFavorites.length > 0) {
      setToggleCustomer(true);
    }
  }, [lstCustomerFavorites]);

  useEffect(() => {
    if (lstBusinessCardFavorites && lstBusinessCardFavorites.length > 0) {
      setToggleBusinessCard(true);
    }
  }, [lstBusinessCardFavorites]);

  useEffect(() => {
    if (lstProductTradingFavorites && lstProductTradingFavorites.length > 0) {
      setToggleSale(true);
    }
  }, [lstProductTradingFavorites]);
  
  useEffect(() => {
    if (props.resetLocalNavigation) {
      setActiveCard({ type: MENU_TYPE.ALL_ACTIVITY, cardId: null, isSearch: false});
    }
  }, [props.resetLocalNavigation]);

  useEffect(() => {
    if (props.onChangeLocalNavigation) {
      props.onChangeLocalNavigation(activeCard);
    }
  }, [activeCard]);

  let timeout = null;
  const actionSearchFavorites = (event) => {
    const keyWord = event?.target?.value ? event.target.value : "";
    setTextValue(keyWord);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      dataMaster.lstCustomerFavorites && setLstCustomerFavorites(dataMaster.lstCustomerFavorites.filter(obj => { const text = obj.listName.toUpperCase(); return text.includes(keyWord.toUpperCase()) }));
      dataMaster.lstBusinessCardFavorites && setBusinessCardFavorites(dataMaster.lstBusinessCardFavorites.filter(obj => { const text = obj.listName.toUpperCase(); return text.includes(keyWord.toUpperCase()) }))
      dataMaster.lstProductTradingFavorites && setProductTradingFavorites(dataMaster.lstProductTradingFavorites.filter(obj => { const text = obj.listName.toUpperCase(); return text.includes(keyWord.toUpperCase()) }))
    }, 500);
  }

  useEffect(() => {
    if (props.downloadData) {
      // download file csv when api response an url
      window.open(props.downloadData);
    }
  }, [props.downloadData]);

  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar, setShowSidebar]);

  const sidebarStyle = useMemo(
    () => `button-collapse-sidebar-product ${shadowTop && showSidebar ? 'shadow-local-navigation-top ' : ''}`,
    [shadowTop, showSidebar]
  );

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
  const handleChangeOverFlow = useCallback(
    (type: 'auto' | 'hidden') => (e: any) => {
      setOverflowY(type);
    },
    [setOverflowY]
  );

  const resizableSize = useMemo(() => ({ width, height: '100%' }), []);

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
        className={`resizeable-resize-wrap esr-content-sidebar list-category style-3 mt-0 ${shadowTop &&
          'shadow-local-navigation-top'} ${shadowBottom && 'shadow-local-navigation-bottom-inset'}`}
        >
          <div 
            className="esr-content-sidebar-outer custom-sidebar overflow-y-hover custom-sidebar-product"
            ref={innerListRef}
            onScroll={handleScroll}
            style={{ overflowY }}
            onMouseEnter={handleChangeOverFlow('auto')}
            onMouseLeave={handleChangeOverFlow('hidden')}
          >
            <div className="esr-content-sidebar-inner">
              <div className="employee-sidebar-menu list-group">
                <div className="list-group">
                  <a className={(activeCard !== null && activeCard.type === MENU_TYPE.MY_ACTIVITY ? "active" : "")}
                    onClick={() => {
                      setActiveCard({ type: MENU_TYPE.MY_ACTIVITY, cardId: null, isSearch: true });
                    }}>{translate('activity.control.sidebar.my-activity')}</a>
                </div>
                <div className={"title-lf " + (activeCard !== null && activeCard.type === MENU_TYPE.ALL_ACTIVITY && activeCard.cardId === null ? "active" : "")}>
                  <a onClick={() => {
                    setActiveCard({ type: MENU_TYPE.ALL_ACTIVITY, cardId: null, isSearch: true });
                  }}>{translate('activity.control.sidebar.all-activity')} </a>
                </div>
                <div className="list-group">
                  <a className={(activeCard !== null && activeCard.type === MENU_TYPE.DRAFT_ACTIVITY ? "active" : "")}
                    onClick={() => {
                      setActiveCard({ type: MENU_TYPE.DRAFT_ACTIVITY, cardId: null, isSearch: true });
                    }}>{translate('activity.control.sidebar.draft-activity')}</a>
                </div>
                {
                  totalNav >= 5 &&
                  <div className="list-group custom-acitivity box-search">
                  <div className={`search-box-no-button-style input-common-wrap ${textValue && textValue.length > 0 ? 'delete' : ''}`}>
                    <button className="icon-search"><i className="far fa-search" /></button>
                    <input 
                      onChange={(e) => actionSearchFavorites(e)} 
                      type="text" 
                      value={textValue}
                      placeholder={translate('activity.control.sidebar.customer-activity-search')} 
                    />
                    {textValue && textValue.length > 0 &&
                      <span className="icon-delete cursor-pointer" onClick={actionSearchFavorites}  />
                    }
                  </div>
                  </div>
                }
                  <div className="list-group group">
                    <div className="tab-expand category" >
                      {lstCustomerFavorites && lstCustomerFavorites.length >= 5 &&
                        <a onClick={() => { setToggleCustomer(!toggleCustomer) }}
                          className={toggleCustomer ? "fas fa-sort-down" : "fas fa-caret-right"}></a>
                      }
                      <span className="group-title padding-left-15">{translate('activity.control.sidebar.customer-activity')}</span>
                    </div>
                  {lstCustomerFavorites && lstCustomerFavorites.length > 0 &&
                    <ul>
                      {toggleCustomer && lstCustomerFavorites.map((item: FavouriteListType, index: number) => {
                        return (
                          <li key={index} className={activeCard !== null && activeCard.type === MENU_TYPE.CUSTOMER_LIST && activeCard.cardId === item.listId ? 'active' : ''}>
                            <a className="text-truncate"
                              onClick={() => {
                                setActiveCard({ type: MENU_TYPE.CUSTOMER_LIST, cardId: item.listId, isSearch: true});
                                props.handleGetCustomers(item.listId);
                              }}>{item.listName}</a>
                          </li>
                        )
                      })}
                    </ul>
                  }
                  </div>
                  <div className="list-group group">
                    <div className="tab-expand category" >
                      {lstBusinessCardFavorites && lstBusinessCardFavorites.length >= 5 &&
                        <a onClick={() => { setToggleBusinessCard(!toggleBusinessCard) }}
                          className={toggleBusinessCard ? "fas fa-sort-down" : "fas fa-caret-right"}></a>
                      }
                      <span className="group-title padding-left-15">{translate('activity.control.sidebar.list-card')}</span>
                    </div>
                  {lstBusinessCardFavorites && lstBusinessCardFavorites.length > 0 &&
                    <ul>
                      {toggleBusinessCard && lstBusinessCardFavorites.map((item: ListInfoType, index) => {
                        return (
                          <li key={index} className={activeCard !== null && activeCard.type === MENU_TYPE.BUSINESS_CARD_LIST && activeCard.cardId === item.listId ? 'active' : ''}>
                            <a className="text-truncate"
                              onClick={() => {
                                setActiveCard({ type: MENU_TYPE.BUSINESS_CARD_LIST, cardId: item.listId,isSearch: true });
                                props.handleGetBusinessCards(item.listId);
                              }}>{item.listName}</a>
                          </li>
                        )
                      })}
                    </ul>
                  }
                  </div>
                  <div className="list-group group">
                    <div className="tab-expand category" >
                      {lstProductTradingFavorites && lstProductTradingFavorites.length >= 5 &&
                        <a onClick={() => { setToggleSale(!toggleSale) }}
                          className={toggleSale ? "fas fa-sort-down" : "fas fa-caret-right"}></a>
                      }
                      <span className="group-title padding-left-15">{translate('activity.control.sidebar.list-product')}</span>
                    </div>
                  {lstProductTradingFavorites && lstProductTradingFavorites.length > 0 &&
                    <ul>
                      {toggleSale && lstProductTradingFavorites.map((item: SaleInfo, index) => {
                        return (
                          <li key={`sales_${index}`} className={activeCard !== null && activeCard.type === MENU_TYPE.PRODUCT_LIST && activeCard.cardId === item.listId ? 'active' : ''}>
                            <a className="text-truncate"
                              onClick={() => {
                                setActiveCard({ type: MENU_TYPE.PRODUCT_LIST, cardId: item.listId,isSearch: true });
                                props.handleListGetProductTradings(item.listId);
                              }}>{item.listName}</a>
                          </li>
                        )
                      })}
                    </ul>
                  }
                  </div>
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

const mapStateToProps = ({ activityListReducerState }: IRootState) => ({
  activityFormSearch: activityListReducerState.activityFormSearch,
  businessCartData: activityListReducerState.businessCartData,
  customerData: activityListReducerState.customerData,
  listSaleData: activityListReducerState.listSaleData,
  downloadData: activityListReducerState.downloadData
});

const mapDispatchToProps = {
  handleGetActivities,
  handleUpdateActivityFromSearch,
  handInitBusinessCartList,
  handInitCustomerList,
  handleGetList,
  handleGetCustomers,
  handleGetBusinessCards,
  handleListGetProductTradings
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityControlSidebar);
