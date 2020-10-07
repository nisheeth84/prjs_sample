import React, { useEffect, useState } from 'react';

import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import './global-tool.scss'
import {
  hiddenGlobalTool,
  getScheduleByList,
  nextAndPrevDateGlobalTool,
  updateScheduleStatus,
} from "app/modules/calendar/global-tool/global-tool-reducer";
// import { updateScheduleStatus } from "app/modules/calendar/modal/calendar-modal.reducer";
import { showModalDetail } from "app/modules/calendar/modal/calendar-modal.reducer";
import { connect } from "react-redux";
import { ACTION_TYPE, AttendanceDivisionType } from "app/modules/calendar/constants";
import { CONVERT_DATE_GLOBAL } from "app/modules/calendar/constants";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import moment from "moment";
import { Link } from "react-router-dom";
import { onChangeDateShow } from '../grid/calendar-grid.reducer';
import { CalenderViewMonthCommon } from '../grid/common';
import { CommonUtil } from 'app/modules/timeline/common/CommonUtil';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import { useId } from "react-id-generator";


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

const TYPE_ACTION = {
  ATTENDANCE: '01',
  ABSENTEEISM: '02'
}



/**
 * component global tool schedule
 * @param props
 * @constructor
 */
const GlobalToolSchedule = (props: StateProps & DispatchProps & {
  disableActive?: any
}) => {
  /**
   * status of component global tool
   */
  const [show, setShow] = useState({})
  const [showTips, setShowTips] = useState({})
  const [customerId, setCustomerId] = useState(0);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const [displayCustomerTab, setDisplayCustomerTab] = useState(false);
  const [showModalActivity, setShowModalActivity] = useState(false);
  const customerDetailCtrlId = useId(1, "globalToolScheduleCustomerDetailCtrlId_");
  /**
   * call api
   */
  useEffect(() => {
    if (props.showGlobalTool) {
      props.getScheduleByList(props.scheduleDay);
    }
  }, [props.scheduleDay])

  /**
   * truncate long text
   * @param str
   * @param length
   */
  const textTruncate = (str, length) => {
    const ending = '...';
    if (str && str.length > length) {
      return str.substring(0, length) + ending;
    } else {
      return str;
    }
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
      const element = <a key={`businessCard_${index}`} href={`${props.tenant}/customer/${relatedCustomer.businessCardId}`}>
        <span className="text-blue text-small">
          {(index > 0) ? ' , ' : ''} {relatedCustomer.businessCardName}
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
    setDisplayCustomerTab(false)
    document.body.className = 'wrap-calendar';
  }

  const onOpenModalCustomerDetail = (customerIdParam, boolean?) => {
    setCustomerId(customerIdParam);
    setShowCustomerDetail(true);
    setDisplayCustomerTab(true);
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
  /**
 * tool tip button
 */

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
      {customerIdShow && showTips[idx + '_' + customerIdShow] && (<div className="select-box text-center globa-tool-tip-show"
        onMouseLeave={() => { showCustomer(idx, customerIdShow, false); showTipsOfCustomer(idx, customerIdShow, false); }}>
        <div className="">
          <p className="">
            <a title=""
              className="button-primary button-activity-registration cl-black mb-2 font-size-small"
              onClick={() => customerIdShow && onClickOpenModalFormActivity(customerIdShow)}>
              {translate('calendars.modal.activeRegistration')}
            </a>
          </p>
          <p className="">
            <a title=""
              className="button-primary button-activity-registration cl-black font-size-small"
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
      if (entitySchedule['zipCode']) {
        fullAddress.push(" ")
      }
      fullAddress.push(entitySchedule['address'])
    }
    if (entitySchedule['buildingName']) {
      if (entitySchedule['zipCode'] || entitySchedule['address']) {
        fullAddress.push(" ")
      }
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
            <p className="text-date-wrap mt-top-10-px">{CONVERT_DATE_GLOBAL(schedule.startDate, schedule.finishDate)}
            </p>
            <h2 className="title-task-wrap global-tool-h2-name">
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
                <a title="" className="text-content-task-wrap" href={`http://maps.google.com/?q=${schedule['zipCode']} ${schedule.address} ${schedule['buildingName']}`}>
                  {renderFullAddress(schedule)}
                </a>
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
      const element = <div className="align-center font-size-small list-schedule-by-day">
        <div>{translate("messages.INF_COM_0020", { 0: translate('global-tool.messages.scheduleTitle') })}</div>
      </div>;
      listSchedule.push(element);
    }

    return listSchedule;
  }

  if (props.scheduleData && props.scheduleData.itemList) {
    return (
      <>
        <a title="" className="expand-control-right" onClick={() => { props.disableActive(''); props.hiddenGlobalTool() }}><i
          className="far fa-angle-right" /></a>
        <div className="sidebar-right content-modal-calendar-detail">
          <div className="sidebar-right-top">
            <div className="recent-task">
              {translate('calendars.modal.totalSchedule')} ({props.scheduleData.countSchedule} {translate('calendars.fieldsList.case')}）
              <a title="" className="icon-small-primary icon-close-up-small" onClick={() => {
                props.disableActive('');
                props.disableActive('');
                props.disableActive('');
                props.hiddenGlobalTool();
              }} />
            </div>
            <div className="button-shadow-add-select-wrap button-shadow-add-select-wrap-t font-weight-500">
              <Link to="/calendar/grid/schedule"
                className="button-shadow-v2"
                onClick={() => props.onChangeDateShow(CalenderViewMonthCommon.nowDate(), 0, props.typeShowGrid)}
              >{translate('calendars.modal.createSchedule')}</Link>
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
        {showCustomerDetail &&
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={customerId}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
            displayActivitiesTab={displayCustomerTab}
          />
        }
        {showModalActivity &&
          <ActivityModalForm popout={false}
            activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
            activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
            customerId={customerId}
            onCloseModalActivity={onClosePopupActivityDetail}
            isOpenFromAnotherModule={true}
          />
        }
      </>
    );
  }

  return (
    <>
      <a title="" className="expand-control-right" onClick={() => { props.disableActive(''); props.hiddenGlobalTool(); }}><i
        className="far fa-angle-right" /></a>
      <div className="sidebar-right">
        <div className="sidebar-right-top">
          <div className="recent-task">
            {translate('calendars.modal.totalSchedule')} (0 {translate('calendars.fieldsList.case')}）
            <a title="" className="icon-small-primary icon-close-up-small" onClick={() => {
              props.disableActive('');
              props.hiddenGlobalTool();
            }} />

          </div>
          <div className="button-shadow-add-select-wrap button-shadow-add-select-wrap-t font-weight-500">
            <Link to="/calendar/grid/schedule"
              className="button-shadow-v2"
              onClick={() => props.onChangeDateShow(CalenderViewMonthCommon.nowDate(), 0, props.typeShowGrid)}
            >{translate('calendars.modal.createSchedule')}</Link>
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
  showGlobalTool: dataGlobalToolSchedule.globalTool,
  tenant: applicationProfile.tenant,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
});

const mapDispatchToProps = {
  hiddenGlobalTool,
  getScheduleByList,
  nextAndPrevDateGlobalTool,
  showModalDetail,
  updateScheduleStatus,
  onChangeDateShow
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalToolSchedule);

