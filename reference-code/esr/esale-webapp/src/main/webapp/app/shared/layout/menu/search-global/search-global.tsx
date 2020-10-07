import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { useId } from "react-id-generator";
import { translate } from 'react-jhipster';
import { getJsonBName } from 'app/modules/setting/utils';
import { GLOBAL_SEARCH } from '../constants';
import { FIELD_BELONG } from 'app/config/constants';
import { reset, getEmployeeSuggestion, getProductSuggestion, getCalendarSuggestion, getSalesSuggestion, getTaskSuggestion } from './search-global.reducer';
import PopupEmployeeDetail from '../../../../modules/employees/popup-detail/popup-employee-detail';
import ProductDetail from '../../../../modules/products/product-detail/product-detail';
import CalendarDetail from '../../../../modules/calendar/modal/calendar-detail';
import DetailTaskModal from '../../../../modules/tasks/detail/detail-task-modal';
import PopupProductSetDetail from '../../../../modules/products/popup-product-set-detail/popup-product-set-detail';
import { Modal } from 'reactstrap';
import { dateTimeToStringUserDateFromat, dateTimeToStringUserDateTimeFromat } from 'app/shared/util/date-utils';

export interface SeacrchGlobalProps extends StateProps, DispatchProps {
  toggleModalSearch,
  lstServices
}

const MenuLeftSearchGlobal = (props: SeacrchGlobalProps) => {

  const [isSearching, setIsSearching] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSearchAll, setIsSearchAll] = useState(true);
  const [globalServicesId, setGlobalServicesId] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const [countAll, setCountAll] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit,] = useState(30);
  const [searchKeyword, setSearchKeyword] = useState('');
  const timerRef = useRef(null);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [listEmployeeId, setListEmployeeId] = useState([]);
  const [openPopupProductDetail, setOpenPopupProductDetail] = useState(false);
  const [openPopupProductSetDetail, setOpenPopupProductSetDetail] = useState(false);
  const [productId, setProductId] = useState(0);
  const [listProductId, setListProductId] = useState([]);

  const [openPopupCalendarDetail, setOpenPopupCalendarDetail] = useState(false);
  const [calendarId, setCalendarId] = useState(0);
  const [listCalendarId, setListCalendarId] = useState([]);
  const [openPopupSalesDetail, setOpenPopupSalesDetail] = useState(false);
  const [salesId, setSalesId] = useState(0);
  const [listSalesId, setListSalesId] = useState([]);
  const [openPopupTaskDetail, setOpenPopupTaskDetail] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [listTaskId, setListTaskId] = useState([]);
  const employeeDetailCtrlId = useId(1, "searchGlobalEmployeeDetail_")

  let theInputKeyword: HTMLInputElement = null;
  let theDivScroll: HTMLDivElement = null;

  const resetdata = () => {
    setSearchResults({});
  }

  useEffect(() => {
    props.reset();
    resetdata();
  }, []);

  const handleClosePopup = () => {
    props.reset();
    resetdata();
    props.toggleModalSearch();
  }

  /**
   * Close employee detail
   */
  const onClosePopupEmployeeDetail = (isBack?) => {
    setOpenPopupEmployeeDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open employee detail
   */
  const onOpenPopupEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setListEmployeeId([employeeIdParam]);
    setOpenPopupEmployeeDetail(true);
  }
  /**
   * Close product detail
   */
  const onClosePopupProductDetail = (isBack?) => {
    setOpenPopupProductDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open product detail
   */
  const onOpenPopupProductDetail = (productIdParam) => {
    setProductId(productIdParam);
    setListProductId([productIdParam]);
    setOpenPopupProductDetail(true);
  }
  /**
   * Close product set detail
   */
  const onClosePopupProductSetDetail = (isBack?) => {
    setOpenPopupProductSetDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open product set detail
   */
  const onOpenPopupProductSetDetail = (productIdParam) => {
    setProductId(productIdParam);
    setListProductId([productIdParam]);
    setOpenPopupProductSetDetail(true);
  }


  /**
   * Close calendar detail
   */
  const onClosePopupCalendarDetail = (isBack?) => {
    setOpenPopupCalendarDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open calendar detail
   */
  const onOpenPopupCalendarDetail = (calendarParam) => {
    setCalendarId(calendarParam);
    setListCalendarId([calendarParam]);
    setOpenPopupCalendarDetail(true);
  }

  /**
     * Close sales detail
     */
  const onClosePopupSalesDetail = (isBack?) => {
    setOpenPopupSalesDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open sales detail
   */
  const onOpenPopupSalesDetail = (salesParam) => {
    setSalesId(salesParam);
    setListSalesId([salesParam]);
    setOpenPopupSalesDetail(true);
  }

  /**
     * Close task detail
     */
  const onClosePopupTaskDetail = (isBack?) => {
    setOpenPopupTaskDetail(false);
    if (!isBack) {
      handleClosePopup();
    }
  };
  /**
   * Open task detail
   */
  const onOpenPopupTaskDetail = (salesParam) => {
    setTaskId(salesParam);
    setListTaskId([salesParam]);
    setOpenPopupTaskDetail(true);
  }


  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      theInputKeyword?.focus();
    }
  });

  const onOpenPopupDetail = (serviceId, dataRow) => {
    switch (serviceId) {
      case FIELD_BELONG.EMPLOYEE:
        return onOpenPopupEmployeeDetail(dataRow.employeeId);
      case FIELD_BELONG.PRODUCT:
        if (dataRow.isSet) {
          return onOpenPopupProductSetDetail(dataRow.productId);
        } else {
          return onOpenPopupProductDetail(dataRow.productId);
        }
      case FIELD_BELONG.SCHEDULE:
        return onOpenPopupCalendarDetail(dataRow.scheduleId);
      case FIELD_BELONG.PRODUCT_TRADING:
        return onOpenPopupSalesDetail(dataRow.productTradingId);
      case FIELD_BELONG.TASK:
        return onOpenPopupTaskDetail(dataRow.taskId);
      default:
        break;
    }
  }

  const changeGlobalService = (serviceId) => {
    if (serviceId === 1) {
      setIsSearchAll(true);
    } else {
      setIsSearchAll(false);
    }
    setGlobalServicesId(serviceId);
  }

  const createData = (serviceId, results, total, _offset) => {
    let count = 0;
    Object.keys(searchResults).forEach(key => {
      if (key !== '' + serviceId) {
        count += searchResults[key]['count'] ? searchResults[key]['count'] : 0;
      }
    })

    let _data = searchResults[serviceId];
    if (!_data || _offset === 0 || !isScrolling) {
      _data = { 'data': [], 'count': 0 };
    }
    results.map((record) => {
      _data['data'].push(record);
    });
    _data['count'] = total > 0 ? total : _data['count'];
    setSearchResults({ ...searchResults, [serviceId]: _data });
    setCountAll(count + _data['count']);
  }

  useEffect(() => {
    if (props.employeeSuggestion && props.employeeSuggestion.employees && props.employeeSuggestion.employees.length > 0) {
      createData(FIELD_BELONG.EMPLOYEE, props.employeeSuggestion.employees, props.employeeSuggestion.totalRecord, offset);
    }
    else {
      createData(FIELD_BELONG.EMPLOYEE, [], 0, offset);
    }
    setOffset(offset + limit);
    setIsSearching(false);
    setIsScrolling(false);
  }, [props.employeeSuggestion]);

  useEffect(() => {
    if (props.calendarSuggestion && props.calendarSuggestion.schedules && props.calendarSuggestion.schedules.length > 0) {
      createData(FIELD_BELONG.SCHEDULE, props.calendarSuggestion.schedules, props.calendarSuggestion.total, offset);
    }
    else {
      createData(FIELD_BELONG.SCHEDULE, [], 0, offset);
    }
    setOffset(offset + limit);
    setIsSearching(false);
    setIsScrolling(false);
  }, [props.calendarSuggestion]);

  useEffect(() => {
    if (props.salesSuggestion && props.salesSuggestion.productTradings && props.salesSuggestion.productTradings.length > 0) {
      createData(FIELD_BELONG.PRODUCT_TRADING, props.salesSuggestion.productTradings, props.salesSuggestion.totalRecord, offset);
    }
    else {
      createData(FIELD_BELONG.PRODUCT_TRADING, [], 0, offset);
    }
    setOffset(offset + limit);
    setIsSearching(false);
    setIsScrolling(false);
  }, [props.salesSuggestion]);

  useEffect(() => {
    if (props.taskSuggestion && props.taskSuggestion.tasks && props.taskSuggestion.tasks.length > 0) {
      createData(FIELD_BELONG.TASK, props.taskSuggestion.tasks, props.taskSuggestion.total, offset);
    }
    else {
      createData(FIELD_BELONG.TASK, [], 0, offset);
    }
    setOffset(offset + limit);
    setIsSearching(false);
    setIsScrolling(false);
  }, [props.taskSuggestion]);
    

  useEffect(() => {
    if (props.productSuggestion && props.productSuggestion.products && props.productSuggestion.products.length > 0) {
      createData(FIELD_BELONG.PRODUCT, props.productSuggestion.products, props.productSuggestion.totalRecord, offset);
    }
    else {
      createData(FIELD_BELONG.PRODUCT, [], 0, offset);
    }
    setOffset(offset + limit);
    setIsSearching(false);
    setIsScrolling(false);
  }, [props.productSuggestion]);

  const searchGlobal = (keyword, _offset, _isAll?, _serviceId?) => {
    if (keyword === undefined || keyword === null || keyword === '') {
      setIsSearching(false);
      return;
    }
    const serviceId = (_isAll === undefined && isSearchAll) ? 1 : (_serviceId === undefined ? globalServicesId : _serviceId);
    switch (serviceId) {
      case FIELD_BELONG.EMPLOYEE:
        if (!props.employeeSuggestion || _offset < props.employeeSuggestion?.totalRecord || props.employeeSuggestion?.totalRecord === 0) {
          setOffset(_offset);
          props.getEmployeeSuggestion({ searchValue: keyword, offset: _offset, limit });
        } else {
          setIsSearching(false);
          setIsScrolling(false);
        }
        break;
      case FIELD_BELONG.PRODUCT:
        if (!props.productSuggestion || _offset < props.productSuggestion.totalRecord || props.productSuggestion?.totalRecord === 0) {
          setOffset(_offset);
          props.getProductSuggestion({ searchValue: keyword, offset: _offset, limit });
        } else {
          setIsSearching(false);
          setIsScrolling(false);
        }
        break;
      case GLOBAL_SEARCH.ALL:
        props.getEmployeeSuggestion({ searchValue: keyword, offset: 0, limit: 5 });
        props.getProductSuggestion({ searchValue: keyword, offset: 0, limit: 5 });
        props.getCalendarSuggestion({ searchValue: keyword, offset: 0, limit: 5 });
        props.getSalesSuggestion({ searchValue: keyword, offset: 0, limit: 5 });
        props.getTaskSuggestion({ searchValue: keyword, offset: 0, limit: 5 });
        setOffset(0);
        break;
      case FIELD_BELONG.SCHEDULE:
        if (!props.calendarSuggestion || _offset < props.calendarSuggestion.total || props.calendarSuggestion?.total === 0) {
          setOffset(_offset);
          props.getCalendarSuggestion({ searchValue: keyword, offset: _offset, limit });
        } else {
          setIsSearching(false);
          setIsScrolling(false);
        }
        break;
      case FIELD_BELONG.PRODUCT_TRADING:
        if (!props.salesSuggestion || _offset < props.salesSuggestion.totalRecord || props.salesSuggestion?.totalRecord === 0) {
          setOffset(_offset);
          props.getSalesSuggestion({ searchValue: keyword, offset: _offset, limit });
        } else {
          setIsSearching(false);
          setIsScrolling(false);
        }
        break;
      case FIELD_BELONG.TASK:
        if (!props.taskSuggestion || _offset < props.taskSuggestion.total || props.taskSuggestion?.total === 0) {
          setOffset(_offset);
          props.getTaskSuggestion({ searchValue: keyword, offset: _offset, limit });
        } else {
          setIsSearching(false);
          setIsScrolling(false);
        }
        break;
      default:
        break;
    }
    setSearchKeyword(keyword);
  }

  const onChangeTextInput = (text, isAll?, serviceId?) => {
    props.reset();
    setOffset(0);
    resetdata();
    theDivScroll.scrollTop = 0;
    setSearchKeyword(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (text !== '') {
        if (isSearching) {
          return;
        }
        setIsSearching(true);
        searchGlobal(text, 0, isAll, serviceId);
      }
    }, 500);
  }

  const onChangeService = (isAll, serviceId) => {
    if (isSearching) {
      return;
    }
    changeGlobalService(serviceId);
    onChangeTextInput(searchKeyword, isAll, serviceId);
  }

  const genderEmployeeItem = (serviceId, data) => {
    return (
      <>
        {data.employeePhoto && data.employeePhoto.fileUrl
          ? (<img className="user" src={data.employeePhoto.fileUrl} onClick={() => onOpenPopupDetail(serviceId, data)} />)
          : (<a onClick={() => onOpenPopupDetail(serviceId, data)} className="no-avatar green"> {data.employeeSurname.charAt(0)} </a>)}
        <div className="detail-search" onClick={() => onOpenPopupDetail(serviceId, data)}>
          <span className="name">{data.employeeDepartments && data.employeeDepartments.length > 0 && data.employeeDepartments[0].departmentName}</span>
          <span className="name">{data.employeeSurname} {data.employeeName} {data.employeeDepartments && data.employeeDepartments.length > 0 && data.employeeDepartments[0].positionName}</span>
        </div>
      </>
    )
  }

  const getPrice = (data) => {
    const price = data.unitPrice ? data.unitPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : 0;
    const currencyUnit = data.currencyUnit ? data.currencyUnit : '';
    return data.typeUnit === 1 ? `${price}${currencyUnit}` : `${currencyUnit}${price}`;
  }

  const genderProductItem = (serviceId, data) => {
    return (
      <>
        {<img src={data.productImagePath ? data.productImagePath : '/content/images/product1.svg'} onClick={() => onOpenPopupDetail(serviceId, data)} />}
        <div className="detail-search" onClick={() => onOpenPopupDetail(serviceId, data)}>
          <span className="name">{getJsonBName(data.productCategoryName)}</span>
          <span className="name">{data.productName}</span>
          <span className="name">{getPrice(data)}</span>
        </div>
      </>
    )
  }

  const genderCalendarItem = (serviceId, data) => {
    return (
      <>
        <div className="detail-search" onClick={() => onOpenPopupDetail(serviceId, data)}>
          <span className="name">{data.scheduleName}</span>
          <span className="name">
            {data.startDate && dateTimeToStringUserDateTimeFromat(data.startDate)} ~ {data.finishDate && dateTimeToStringUserDateTimeFromat(data.finishDate)}
          </span>
        </div>
      </>
    )
  }

  const genderTaskItem = (serviceId, data) => {
    return (
      <>
        <div className="detail-search" onClick={() => onOpenPopupDetail(serviceId, data)}>
          <span className="name">{data.milestone && data.milestone.milestonename} ({data.customer && data.customer.customername}/{data.productTradings && data.productTradings.productTradingsName})</span>
          <span className="name">{data.taskName}{data.finishDate && `(${dateTimeToStringUserDateFromat(data.finishDate)})`})</span>
          <span className="name">{data.operatorNames && data.operatorNames.join(' ')}</span>
        </div>
      </>
    )
  }

  const genderSalesItem = (serviceId, data) => {
    return (
      <>
        {<img src={data.productImagePath ? data.productImagePath : '/content/images/product1.svg'} onClick={() => onOpenPopupDetail(serviceId, data)} />}
        <div className="detail-search" onClick={() => onOpenPopupDetail(serviceId, data)}>
          <span className="name">{data.customerName}</span>
          <span className="name">{data.productName}({getJsonBName(data.progressName)})</span>
          <span className="name">{data.employeeSurname} {data.employeeName}</span>
        </div>
      </>
    )
  }

  const genderItem = (serviceId, data) => {
    switch (serviceId) {
      case FIELD_BELONG.EMPLOYEE:
        return genderEmployeeItem(serviceId, data);
      case FIELD_BELONG.PRODUCT:
        return genderProductItem(serviceId, data);
      case FIELD_BELONG.SCHEDULE:
        return genderCalendarItem(serviceId, data);
      case FIELD_BELONG.TASK:
        return genderTaskItem(serviceId, data);
      case FIELD_BELONG.PRODUCT_TRADING:
        return genderSalesItem(serviceId, data);
      default:
        break;
    }
  }

  const handleScroll = (e) => {
    if (isSearchAll || theDivScroll.scrollTop === 0) {
      return;
    }
    const scrollPosition = e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop);
    if (scrollPosition === 0) {
      setIsSearching(true);
      setIsScrolling(true);
      searchGlobal(searchKeyword, offset);
    }
  }

  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right popup-fix-height show membership-dropdown" style={{ zIndex: 1050 }} id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-body style-3">
                <div className="popup-content style-3 none-scroll h-auto">
                  <div className="search-global-start">
                    <div className="title black d-flex align-items-center">
                      <div><i className="far fa-search font-size-18 color-999 mr-3"></i>{translate('searchGlobal.tittle')}</div>
                      <a tabIndex={0} onClick={handleClosePopup} className="icon-small-primary icon-close-up-small line"></a>
                    </div>
                    <div className="user-popup-form popup-task-form">
                      <div className="form-group common search search-global">
                        <div className="search-box-button-style">
                          <button tabIndex={2} className="icon-search" onClick={(e) => onChangeTextInput(searchKeyword)}><i className="far fa-search font-size-16 font-weight-bold" /></button>
                          <input ref={elem => (theInputKeyword = elem)} tabIndex={0} type="text" className="pl-3" placeholder={translate('searchGlobal.placehoder')} onChange={(e) => onChangeTextInput(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="search-global-wrap">
                      <ul className="tab-menu-left" style={{ height: 'calc(100vh - 245px)' }}>
                        <li tabIndex={0} key={1} className={isSearchAll ? "smooth active" : "smooth"} onClick={() => onChangeService(true, 1)}>
                          <p className="title text-ellipsis">{translate('searchGlobal.search-all')}</p>
                          <p className="number">{countAll}</p>
                        </li>
                        {props.lstServices.map((ser, index) => (
                          <li tabIndex={0} key={ser.serviceId} className={globalServicesId === ser.serviceId ? "smooth active" : "smooth"} onClick={() => onChangeService(false, ser.serviceId)}>
                            <p className="title text-ellipsis">{getJsonBName(ser.serviceName)}</p>
                            <p className="number">{(countAll && searchResults[ser.serviceId] && searchResults[ser.serviceId]['data']) ? searchResults[ser.serviceId]['count'] : 0}</p>
                          </li>
                        ))}
                      </ul>
                      <div ref={ele => (theDivScroll = ele)} onScroll={(e) => handleScroll(e)} className="search-global-content overflow-auto" style={{ height: 'calc(100vh - 245px)' }}>
                        {props.lstServices.map((ser, index) => (
                          (isSearchAll || ser.serviceId === globalServicesId) && searchResults[ser.serviceId]
                          && searchResults[ser.serviceId]['data'] && searchResults[ser.serviceId]['data'].length > 0 &&
                          <div className="item" key={ser.serviceId}>
                            <div className="header">
                              <div className="title">
                                {ser && ser.iconPath && (<img src={ser.iconPath} />)}
                                {ser && getJsonBName(ser.serviceName)}
                              </div>
                              {isSearchAll && <a title="" onClick={() => onChangeService(false, ser.serviceId)}>{translate('searchGlobal.more')}</a>}
                            </div>
                            {searchResults[ser.serviceId]['data'].map((item, itemIndex) => (
                              <div className="row-search-wrap" key={itemIndex}>
                                <div className="row-search w100">
                                  {genderItem(ser.serviceId, item)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {openPopupEmployeeDetail && (
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={false}
            backdrop={false}
            employeeId={employeeId}
            listEmployeeId={listEmployeeId}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            openFromModal={true}
            resetSuccessMessage={() => { }}
          />
        )}
        {openPopupProductDetail &&
          <ProductDetail
            showModal={false}
            backdrop={false}
            productId={productId}
            // listProductId={listProductId}
            toggleClosePopupProductDetail={onClosePopupProductDetail}
            openFromModal={true}
            resetSuccessMessage={() => { }}
          />
        }
        {openPopupProductSetDetail &&
          <PopupProductSetDetail
            showModal={false}
            backdrop={false}
            productId={productId}
            // listProductId={listProductId}
            toggleClosePopupProductSetDetail={onClosePopupProductSetDetail}
            resetSuccessMessage={() => { }}
          />
        }

        {openPopupCalendarDetail && (
          <CalendarDetail />
        )}

        {openPopupTaskDetail && (
          <DetailTaskModal
            taskId={taskId}
            toggleCloseModalTaskDetail={onClosePopupTaskDetail}
          />
        )}
      </>
    )
  };
  return (
    <>
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-employee-setting" className="wrap-membership" autoFocus={true} zIndex="auto">
        {renderComponent()}
      </Modal>
    </>
  );
};


const mapStateToProps = ({ searchGlobal }: IRootState) => ({
  employeeSuggestion: searchGlobal.employeeSuggestion,
  productSuggestion: searchGlobal.productSuggestion,
  calendarSuggestion: searchGlobal.calendarSuggestion,
  salesSuggestion: searchGlobal.salesSuggestion,
  taskSuggestion: searchGlobal.taskSuggestion
})
const mapDispatchToProps = {
  getEmployeeSuggestion,
  getProductSuggestion,
  getCalendarSuggestion,
  getSalesSuggestion,
  getTaskSuggestion,
  reset
}
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;



export default connect(mapStateToProps, mapDispatchToProps)(MenuLeftSearchGlobal);