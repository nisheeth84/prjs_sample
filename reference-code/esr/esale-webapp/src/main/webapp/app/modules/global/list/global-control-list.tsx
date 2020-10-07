import React, { useEffect, useState } from 'react';
import { useId } from "react-id-generator";
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import './global-tool.scss'
import {
  getScheduleByList,
  nextAndPrevDateGlobalTool,
  updateScheduleStatus,
  showGlobalTool
} from "app/modules/global/list/global-tool-reducer";
// import { updateScheduleStatus } from "app/modules/calendar/modal/calendar-modal.reducer";
import { showModalDetail } from "app/modules/calendar/modal/calendar-modal.reducer";
import { connect } from "react-redux";
import { ACTION_TYPE, AttendanceDivisionType, CONVERT_DATE_GLOBAL } from "app/modules/calendar/constants";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import moment from "moment";
import { Link } from "react-router-dom";
import { onChangeDateShow } from 'app/modules/calendar/grid/calendar-grid.reducer';
import { CalenderViewMonthCommon } from 'app/modules/calendar/grid/common.ts';
import { CommonUtil } from 'app/modules/timeline/common/CommonUtil';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import { onChangeDateOnCick, onShowPopupCreate, resetDataForm } from 'app/modules/calendar/popups/create-edit-schedule.reducer';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';



/**
 * tool tip button
 */
export const toolTip = (statusTooltip: boolean) => {
  return (
    <>
      {statusTooltip && (
        <div className="">
          <p className="">
            <a title=""
              className="button-primary button-activity-registration cl-black mb-2">
              {translate('calendars.modal.activeRegistration')}
            </a>
          </p>
          <p className="">
            <a title=""
              className="button-primary button-activity-registration cl-black">
              {translate('calendars.modal.historyActivities')}
            </a>
          </p>
        </div>)}
    </>
  );
}

export interface IGlobalScheduleProps extends StateProps, DispatchProps {
  onClose: () => void
}


const TYPE_ACTION = {
  ATTENDANCE: '01',
  ABSENTEEISM: '02'
}



/**
 * component global tool schedule
 * @param props
 * @constructor
 */
const GlobalControlList = (props: IGlobalScheduleProps & { disableActive?: any }) => {


  /**
   * status of component global tool
   */
  const [show, setShow] = useState({})
  const [showTips, setShowTips] = useState({})
  const [customerId, setCustomerId] = useState(0);
  const [showModalActivity, setShowModalActivity] = useState(false);
  const [openPopupBusinessCardDetail, setOpenPopupBusinessCardDetail] = useState(false);
  const [businessCardId, setBusinessCardId] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);
  const customerDetailCtrlId = useId(1, "globalCtrlListDetailCustomerDetailCtrlId_");

  useEffect(() => {
    props.showGlobalTool(props.dateShow);
  }, [])

  /**
   * call api
   */
  useEffect(() => {
    if (props.scheduleDay) {
      props.getScheduleByList(props.scheduleDay);
    }
  }, [props.scheduleDay])

  const onClosePopupBusinessCardDetail = () => {
    setOpenPopupBusinessCardDetail(false);
  }

  const onOpenModalBusinessCardDetail = (businessCardIdParam) => {
    setBusinessCardId(businessCardIdParam);
    setOpenPopupBusinessCardDetail(true);
  }

  /**
   * convert Date to format YYY-MM-DD
   */
  const showDay = () => {
    const date = moment(props.scheduleDay).format('YYYY-MM-DD').split('-');
    const activeDate = {
      year: date[0],
      month: date[1],
      day: date[2]
    };
    return (
      <span className="text-year-control-right">
        {translate('calendars.globalTool.formatActiveDate', activeDate)}
      </span>
    );
  }

  /**
   * render business cards
   */
  const listBusinessCards = (RelatedCustomers) => {
    const listRelatedCustomer = [];
    RelatedCustomers.forEach((relatedCustomer, index) => {
      const element = <a key={`businessCard_${index}`}>
        <span className="text-blue text-small" onClick={() => onOpenModalBusinessCardDetail(relatedCustomer.businessCardId)}>
          {(index > 0) ? <span className="text-dark">,</span> : ''} {relatedCustomer.businessCardName}
        </span>
      </a>
      listRelatedCustomer.push(element)
    })
    return (
      <div className="box-link-task-wrap">{listRelatedCustomer}</div>
    );
  }

  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(!showCustomerDetail);
    setDisplayActivitiesTab(false)
    document.body.className = 'wrap-calendar';
  }

  const onOpenModalCustomerDetail = (customerIdParam, showHistoriesTab: boolean) => {
    setCustomerId(customerIdParam);
    setShowCustomerDetail(true);
    setDisplayActivitiesTab(showHistoriesTab);
  }

  const onClosePopupActivityDetail = () => {
    setShowModalActivity(false)
    document.body.className = 'wrap-calendar';
  }

  const onClickOpenModalFormActivity = (customerIdParam) => {
    if (!showModalActivity) {
      setCustomerId(customerIdParam);
      setShowModalActivity(true);
    }
  }

  const renderCustomerName = (customers) => {
    const customerName = customers ? customers[0].customerName : '';
    // const parentCustomerName = customers ? customers[0].parentCustomerName : '';
    const aryResult = [];

    if (customerName) {
      aryResult.push(customerName)
    }
    // if (parentCustomerName) {
    //   if (customerName) {
    //     aryResult.push(" ")
    //   }
    //   aryResult.push(parentCustomerName)
    // }

    return aryResult.join('');
  }

  const showTipsOfCustomer = (idx, customerShowId, flg) => {
    const newShowTips = { ...showTips }
    newShowTips[idx + '_' + customerShowId] = flg;
    setShowTips(newShowTips);
  }

  const showCustomer = (idx, customerShowId, flg) => {
    const newShow = { ...show }
    newShow[idx + '_' + customerShowId] = flg;
    setShow(newShow);
  }


  /**
   * render customers
   */
  const listCustomers = (idx, customers, products) => {
    const customerName = renderCustomerName(customers);
    const customerIdShow = customers ? customers[0].customerId : '';
    const listProduct = [];

    if (customerName) {
      listProduct.push(customerName);
    }
    if (products) {
      const tmp = [];
      products.forEach((product) => {
        if (product.productName) tmp.push(product.productName);
      })
      if (customerName && tmp.length) {
        listProduct.push("／")
      }
      listProduct.push(tmp.join(","))
    }

    const textElement = listProduct.join('');
    const element = (customerIdShow || textElement) && <div className="box-link-task-wrap"
      onMouseLeave={() => {
        showCustomer(idx, customerIdShow, false); showTipsOfCustomer(idx, customerIdShow, false);
      }}
      onMouseOver={() => {
        showCustomer(idx, customerIdShow, true);
      }}
    >
      <a className="text-ellipsis w-75" title="" onClick={() => customerIdShow && onOpenModalCustomerDetail(customerIdShow, false)}>
        <span className="text-blue text-small">{textElement}</span>
      </a>
      {customerIdShow && show[idx + '_' + customerIdShow] &&
        (
          <div>
            <button className="button-icon-task-wrap" onClick={() => { showTipsOfCustomer(idx, customerIdShow, true) }}>
              <img src="../../../content/images/calendar/ic-button-gray.svg" title="" alt="" />
            </button>
          </div>
        )}
      {customerIdShow && showTips[idx + '_' + customerIdShow] && (<div className="select-box text-center activity-box"
        onMouseLeave={() => { showCustomer(idx, customerIdShow, false); showTipsOfCustomer(idx, customerIdShow, false); }}>
        <div className="">
          <p className="">
            <a title="" 
              className="button-primary button-activity-registration cl-black mb-2 font-size-12"
              onClick={() => customerIdShow && onClickOpenModalFormActivity(customerIdShow)}>
              {translate('calendars.modal.activeRegistration')}
            </a>
          </p>
          <p className="">
            <a title="" 
              className="button-primary button-activity-registration cl-black font-size-12"
              onClick={() => customerIdShow && onOpenModalCustomerDetail(customerIdShow, true)}>
              {translate('calendars.modal.historyActivities')}
            </a>
          </p>
        </div>
      </div>)}
    </div>
    return element;
  }

  const renderFullAddress = (entitySchedule) => {
    const fullAddress = []
    if (entitySchedule['zipCode'] || entitySchedule['address'] || entitySchedule['buildingName']) {
      fullAddress.push("〒")
    }
    if (entitySchedule['zipCode'])
      fullAddress.push(entitySchedule['zipCode'])

    if (entitySchedule['address']) {
      // if(entitySchedule['zipCode']){
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['address'])
    }
    if (entitySchedule['buildingName']) {
      // if(entitySchedule['zipCode'] || entitySchedule['address']){
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['buildingName'])
    }
    return fullAddress.join('')
  }

  /**
   * render list schedule
   */
  const listScheduleByDay = () => {
    const listSchedule = [];
    if (props.scheduleData.itemList.length > 0) {
      (props.scheduleData.itemList).forEach((schedule, idx) => {
        if (schedule.employeeIds[0]['employeeId'].toString() === CommonUtil.getUserLogin().employeeId.toString()) {
          const element = <div className="task-item task-item-white-small task-item-wrap-c" key={`schedule_${idx}`}>
            <p className="text-date-wrap margin-top-10">{CONVERT_DATE_GLOBAL(schedule.startDate, schedule.finishDate)}
            </p>
            <h2 className="title-task-wrap text-ellipsis">
              <a title="" onClick={() => props.showModalDetail(schedule.itemId)}>{schedule.itemName}</a>
            </h2>
            <div className="item-task-wrap ">
              <div className="iamge-item-task-wrap">
                <img src="../../../content/images/calendar/ic-calendar-person2.svg" title="" alt="" />&nbsp;&nbsp;
            <label htmlFor="">{translate('calendars.modal.customerProductTradings')}</label>
              </div>
              <div className="content-task-wrap">
                {schedule.customers?.length > 0 && listCustomers(idx, schedule.customers, schedule.productTradings)}
              </div>
            </div>
            <div className="item-task-wrap ">
              <div className="iamge-item-task-wrap">
                <img src="../../../content/images/calendar/ic-calendar-person3.svg" title="" alt="" />&nbsp;&nbsp;
            <label htmlFor="">{translate('calendars.modal.address')}</label>
              </div>
              <div className="content-task-wrap">
                {(schedule['zipCode'] || schedule.address || schedule['buildingName'])
                  ?
                  <>
                    <a title="" className="text-content-task-wrap text-ellipsis" href={`http://maps.google.com/?q=${schedule['zipCode']}${schedule.address}${schedule['buildingName']}`}>
                      {renderFullAddress(schedule)}
                    </a>
                  </>
                  : (
                    <></>
                  )
                }

              </div>
            </div>
            <div className="item-task-wrap ">
              <div className="iamge-item-task-wrap">
                <img src="../../../content/images/calendar/ic-calendar-person5.svg" title="" alt="" />&nbsp;&nbsp;
            <label htmlFor="">{translate('calendars.modal.businessCards')}</label>
              </div>
              <div className="content-task-wrap">
                {schedule.businessCards && listBusinessCards(schedule.businessCards)}
                <div className="popup-esr2-footer">
                  <a title="" className={
                    schedule.isParticipantUser && schedule.attendanceDivision === AttendanceDivisionType.Available
                      ? "button-primary active button-simple-edit button-simple-edit-t"
                      : "button-primary button-simple-edit button-simple-edit-t"
                  }
                    onClick={() => (schedule.isParticipantUser && schedule.attendanceDivision !== AttendanceDivisionType.Available)
                      && props.updateScheduleStatus(schedule.itemId, TYPE_ACTION.ATTENDANCE, schedule.updatedDate, props.scheduleDay)}><i
                      className="far fa-check" /><span>{translate('calendars.modal.attendance')}</span></a>
                  <a title="" className={
                    schedule.isParticipantUser && schedule.attendanceDivision === AttendanceDivisionType.Absent
                      ? "button-primary active button-simple-edit button-simple-edit-t"
                      : "button-primary button-simple-edit button-simple-edit-t"
                  }
                    onClick={() => (schedule.isParticipantUser && schedule.attendanceDivision !== AttendanceDivisionType.Absent)
                      && props.updateScheduleStatus(schedule.itemId, TYPE_ACTION.ABSENTEEISM, schedule.updatedDate, props.scheduleDay)}><i
                      className="far fa-times" /><span>{translate('calendars.modal.absenteeism')}</span></a>
                  <a title="" className={
                    schedule.participationDivision === ACTION_TYPE.SHARE
                      ? "button-primary active button-simple-edit button-simple-edit-t"
                      : "button-primary button-simple-edit button-simple-edit-t"
                  }
                    onClick={() => schedule.participationDivision !== ACTION_TYPE.SHARE
                      && props.updateScheduleStatus(schedule.itemId, AttendanceDivisionType.Share, schedule.updatedDate, props.scheduleDay)}><i
                      className="fas fa-share-alt" /><span>{translate('calendars.modal.share')}</span></a>
                </div>
              </div>
            </div>
          </div>
          listSchedule.push(element)
        }
      })
    } else {
      const element = <div className="align-center no-schedule">
        <div>{translate("messages.INF_COM_0020", { 0: translate('global-tool.messages.scheduleTitle') })}</div>
      </div>;
      listSchedule.push(element);
    }

    return listSchedule;
  }
  const setStateInitForCreateForm = () => {
    props.resetDataForm();
    props.onChangeDateOnCick(CalenderViewMonthCommon.nowDate());
    props.onShowPopupCreate(true)
  }

  if (props.scheduleData && props.scheduleData.itemList) {
    return (
      <>
        <div className="sidebar-right">
          <div className="sidebar-right-top">
            <div className="recent-task">
              {translate('calendars.modal.totalSchedule')} ({props.scheduleData.countSchedule} {translate('calendars.fieldsList.case')}）
              <a title="" className="icon-small-primary icon-close-up-small" onClick={() => {
                props.onClose();
              }} />
            </div>

            <div className="button-shadow-add-select-wrap">
              <button type="button"
                className={`button-shadow-v2 p-2 pr-3 pl-3 w-100`}
                onClick={setStateInitForCreateForm}
              >{translate('calendars.controls.top.labels.register')}</button>
            </div>
            <div className="box-year-control-right">
              <span className="button-arrow-year" onClick={() => props.nextAndPrevDateGlobalTool(ACTION_TYPE.PREV)}>
                <i className="far fa-chevron-left"></i>
              </span>
              {showDay()}
              <span className="button-arrow-year-right"
                onClick={() => props.nextAndPrevDateGlobalTool(ACTION_TYPE.NEXT)}>
                <i className="far fa-chevron-right"></i>
              </span>
            </div>
          </div>
          <div className="list-task-wrap-w">
            {listScheduleByDay()}
          </div>
        </div>
        {/* {renderCustomerDetail()} */}
        {showModalActivity &&
          <ActivityModalForm popout={false}
            activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
            activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
            customerId={customerId}
            onCloseModalActivity={onClosePopupActivityDetail}
            isOpenFromAnotherModule={true}
          />
        }
        {openPopupBusinessCardDetail &&
          <BusinessCardDetail
            key={businessCardId}
            showModal={true}
            businessCardId={businessCardId}
            listBusinessCardId={[]}
            toggleClosePopupBusinessCardDetail={onClosePopupBusinessCardDetail}
            businessCardList={[]}
          ></BusinessCardDetail>}
        {showCustomerDetail &&
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={customerId}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
            displayActivitiesTab={displayActivitiesTab}
          />
        }
      </>
    );
  }

  return (
    <>
      <div className="sidebar-right">
        <div className="sidebar-right-top">
          <div className="recent-task">
            {translate('calendars.modal.totalSchedule')} (0 {translate('calendars.fieldsList.case')}）
            <a title="" className="icon-small-primary icon-close-up-small" onClick={() => {
              props.onClose();
            }} />
          </div>

          <div className="button-shadow-add-select-wrap">
            <button type="button"
              className={`button-shadow-v2 p-2 pr-3 pl-3 w-100`}
              onClick={setStateInitForCreateForm}
            >{translate('calendars.controls.top.labels.register')}</button>
          </div>

          <div className="box-year-control-right">
            <span className="button-arrow-year" onClick={() => props.nextAndPrevDateGlobalTool(ACTION_TYPE.PREV)} />
            {showDay()}
            <span className="button-arrow-year button-arrow-year-right" onClick={() => props.nextAndPrevDateGlobalTool(ACTION_TYPE.NEXT)} />
          </div>
        </div>
      </div>
    </>
  );

}

const mapStateToProps = ({ dataGlobalToolSchedule, applicationProfile, dataCalendarGrid }: IRootState) => ({
  scheduleDay: dataGlobalToolSchedule.scheduleDay,
  scheduleData: dataGlobalToolSchedule.dataResponse,
  tenant: applicationProfile.tenant,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  dateShow: dataCalendarGrid.dateShow,
});

const mapDispatchToProps = {
  getScheduleByList,
  nextAndPrevDateGlobalTool,
  showModalDetail,
  updateScheduleStatus,
  onChangeDateShow,
  showGlobalTool,
  onChangeDateOnCick,
  onShowPopupCreate,
  resetDataForm
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalControlList);

