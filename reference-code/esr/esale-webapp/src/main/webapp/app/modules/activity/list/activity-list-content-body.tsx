import React, { useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { ActivityInfoType } from '../models/get-activity-type';
import { translate } from 'react-jhipster';
import { TYPE_DETAIL_MODAL } from '../constants';
import { CommonUtil } from '../common/common-util';
import BusinessCardItemList from './item-list/business-item-list';
import ProductTradingItemList from './item-list/product-item-list';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import dateFnsFormat from 'date-fns/format';
import EmployeeName from 'app/shared/layout/common/EmployeeName';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { isMouseOnRef } from 'app/shared/util/utils';
import TooltipProductTrading from './item-list/tooltip-product-trading';

type IActivityListContentBodyProp = StateProps & DispatchProps & {
  data: ActivityInfoType,
  index: number;
  onClickDetailPopup: (objectId, type) => void
  deactiveId?: any;
  isTabCustomer?: boolean;
  isDraft?: boolean
}

/**
 * component for show body content activity detail
 * @param props
 */
const ActivityListContentBody = (props: IActivityListContentBodyProp) => {

  const [showTipProduct, setShowTipProduct] = useState<boolean>(false);
  const [showTipBizzCard, setShowTipBizzCard] = useState<boolean>(false);
  const bizzCardRef = useRef(null);
  const productRef = useRef(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const customerDetailCtrlId = useId(1, "activityListContentCustomerDetailCtrlId_");

  const handleClickOutside = (e) => {
    if (!isMouseOnRef(bizzCardRef, e)) {
      setShowTipBizzCard(false);
    }
    if (!isMouseOnRef(productRef, e)) {
      setShowTipProduct(false);
    }
  }
  useEventListener('mousedown', handleClickOutside);

  const onClickDetailPopup = (objectId, type) => {
    if (props.onClickDetailPopup && objectId) {
      props.onClickDetailPopup(objectId, type);
    }
  }

  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(!showCustomerDetail);
    document.body.className = 'wrap-activity modal-open'
  }

  const renderScheduleTaskMilestone = () => {
    let objectId, type, textValue;
    if (props.data?.schedule?.scheduleId) {
      objectId = props.data?.schedule?.scheduleId;
      textValue = props.data?.schedule?.scheduleName;
      type = TYPE_DETAIL_MODAL.SCHEDULE;
    } else if (props.data?.task?.taskId) {
      objectId = props.data?.task?.taskId;
      textValue = props.data?.task?.taskName;
      type = TYPE_DETAIL_MODAL.TASK;
    } else {
      objectId = props.data?.milestone?.milestoneId;
      textValue = props.data?.milestone?.milestoneName;
      type = TYPE_DETAIL_MODAL.MILESTONE
    }

    return (<>
      <a className="text-blue"
        onClick={() => { onClickDetailPopup(objectId, type) }}>
        {textValue}
      </a>
      {(textValue?.length > 0) && <span>&nbsp;{translate('activity.list.body.about')}</span>}
    </>
    )
  }

  const onClickCustomerHistory = () => {
    const _customerId = props.data?.customer?.customerId;
    if(props.isTabCustomer){
      onClickDetailPopup(_customerId, TYPE_DETAIL_MODAL.CUSTOMER);
      return
    }
    setCustomerId(_customerId);
    setShowCustomerDetail(true);
  }

  const renderBusinessCard = (item) => {
    if (!_.isNil(item.businessCardId)) {
      return (<a onClick={() => { onClickDetailPopup(item.businessCardId, TYPE_DETAIL_MODAL.BUSINESS_CARD) }}
        className="text-blue">{(item.firstName || "") + " " + (item.lastName || "")}</a>)
    } else {
      return (<span >{item.firstName}</span>)
    }
  }

  const listInterview = useMemo(() => {
    let res = [];
    if (props.data?.businessCards?.length > 0) {
      res = props.data?.businessCards;
    }
    if (props.data?.interviewers?.length > 0) {
      props.data?.interviewers.forEach(e => {
        res.push({
          businessCardId: null,
          departmentName: "",
          firstName: e,
          position: "",
          customerName: ""
        })
      })
    }
    return res;
  }, [props.data]);

  const getIconPath = (scheduleType) => {
    if (!_.isNil(scheduleType)) {
      if (scheduleType.iconType === 0 || (scheduleType.iconPath && scheduleType.iconPath.includes('http'))) {
        return `${scheduleType.iconPath}`
      } else {
        return `../../../../content/images/common/calendar/${scheduleType.iconName}`
      }
    }
    return "";
  }

  const renderNextSchedule = () => {
    const nextSchedule = props.data?.nextSchedule;
    const customerName = nextSchedule?.customers?.customerName;
    let productTradingName = null;
    if(nextSchedule?.productTradings?.length > 0){
      const names = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(nextSchedule?.productTradings, 'productTradingName');
      productTradingName = _.join(names, ",");
    }
    const isHasOne = !_.isNil(customerName) || !_.isNil(productTradingName);
    const isHasAll = !_.isNil(customerName) && !_.isNil(productTradingName);
    return <>
      {(!props.isDraft && props.data?.nextSchedule?.scheduleId) && <>
        <a className="ml-3 text-blue" onClick={() => { onClickDetailPopup(props.data.nextSchedule.scheduleId, TYPE_DETAIL_MODAL.SCHEDULE) }}>{CommonUtil.convertToDate(props.data.nextSchedule.startDate)}</a>
        <img className="icon-calendar-person ml-1" src={getIconPath(props.data.nextSchedule.scheduleType)} alt=""/>
        <a className="text-blue" onClick={() => { onClickDetailPopup(props.data.nextSchedule.scheduleId, TYPE_DETAIL_MODAL.SCHEDULE) }}>
          {nextSchedule.scheduleName} {isHasOne ? `(${customerName || ''}` : ''}
          {`${isHasAll ? '／' : ''}`}
          <TooltipProductTrading data={nextSchedule?.productTradings} idCaller={`ActivityList`}/>
          {`${isHasOne ? ')' : ''}`}
          {/* {nextSchedule.scheduleName} {isHasOne ? `(${customerName || ''}${isHasAll ? '／' : ''}${productTradingName || ''})` : '' } */}
        </a>
      </>
      }
      {(props.isDraft && (props.data?.nextSchedule?.scheduleId || props.data?.nextSchedule?.activityDraftId)) && <>
        <span className="ml-3" >{CommonUtil.convertToDate(props.data.nextSchedule.startDate)}</span>
        <img className="icon-calendar-person ml-1" src={getIconPath(props.data.nextSchedule.scheduleType)} alt=""/>
        <span >
          {nextSchedule.scheduleName} {isHasOne ? `(${customerName || ''}` : ''}
          {`${isHasAll ? '／' : ''}`}
          <TooltipProductTrading data={nextSchedule?.productTradings} idCaller={`ActivityList`}/>
          {`${isHasOne ? ')' : ''}`}
          {/* {nextSchedule.scheduleName} {isHasOne ? `(${customerName || ''}${isHasAll ? '／' : ''}${productTradingName || ''})` : '' } */}
        </span>
      </>
      }
    </>
  }

  return <>

    <div className="activity-info-body font-size-12" key={`activity_${props.data?.activityId}`}>
      <div className="mt-3 color-333">
        {renderScheduleTaskMilestone()}
        {listInterview?.length === 1 &&
          <>
            {renderBusinessCard(listInterview[0])}
            &nbsp;{translate('activity.list.body.san')}&nbsp;
          </>
        }
        {listInterview?.length > 1 &&
          <>
            {renderBusinessCard(listInterview[0])}
            &nbsp;{translate('activity.list.body.san')}&nbsp;
            <div ref={bizzCardRef} onClick={() => setShowTipBizzCard(!showTipBizzCard)} className="text-blue show-list-item-activity">{translate('activity.list.body.business-card-amount', { amount: listInterview?.length - 1 })}&nbsp;
              {showTipBizzCard &&
                <div className="form-group width-450">
                  <ul className="drop-down drop-down2 height-unset">
                    {
                      listInterview.map((e, idx) => {
                        if (idx !== 0) {
                          return <BusinessCardItemList onClick={() => { onClickDetailPopup(e.businessCardId, TYPE_DETAIL_MODAL.BUSINESS_CARD) }}
                            businessCard={e} key={`businessCard_${props.data?.activityId}_${e.businessCardId}_${idx}`} />
                        }
                      })
                    }
                  </ul>
                </div>
              }
            </div>
          </>
        }
        {listInterview?.length > 0 && props.data?.customer?.customerId && translate('activity.list.body.to')}&nbsp;
        {props.data?.customer?.customerId && props.data?.customer?.customerId === props.deactiveId
          ? <span>{props.data?.customer?.customerName}</span>
          : <a className="text-blue" onClick={onClickCustomerHistory}>{props.data?.customer?.customerName}</a>
        }
        {props.data?.productTradings?.length === 1 &&
          <>
            <span>&nbsp;／&nbsp;</span>
            {props.data?.productTradings[0].productName} {translate('activity.list.body.related_activities')}
          </>
        }
        {props.data?.productTradings?.length > 1 &&
          <>
            <span>&nbsp;／&nbsp;</span>
            {props.data?.productTradings[0].productName} <a  ref={productRef} onClick = {() => {setShowTipProduct(!showTipProduct)}} className="text-blue show-list-item-activity">&nbsp;{translate('activity.list.body.product-amount', { amount: props.data?.productTradings?.length - 1 })}&nbsp;
              { showTipProduct &&
              <div className="form-group width-450">
                <div className="drop-down drop-down2 ">
                  <ul className="dropdown-item dropdown-item-v2 height-unset overflow-unset">
                    {
                      props.data.productTradings.map((e, idx) => {
                        if (idx !== 0) {
                          return <ProductTradingItemList onClick={() => onClickDetailPopup(e.productId, TYPE_DETAIL_MODAL.PRODUCT)}
                            productTrading={e} key={`product_${props.data?.activityId}_${e.productTradingId}_${idx}`} />
                        }
                      })
                    }
                  </ul>
                </div>
              </div>
              }
            </a>
            {translate('activity.list.body.related_activities')}
          </>
        }

      </div>
      <div className="color-333">
        {translate('activity.list.body.product-trading')}
      </div>
      {props.data?.productTradings?.length > 0 && props.data?.productTradings.map((item, idx) => {
        return <div className="d-flex flag-wrap reduce-space align-items-center mt-3 pl-3 color-333" key={`productTradings_${props.data?.activityId}_${idx}`}>
          <div className="w10 min-width-100">
            <span className="d-block font-weight-bold word-break-all  mr-2">{item.productName}</span>
            {item.progressName && <span className="d-block word-break-all  mr-2">({getFieldLabel(item, 'progressName')})</span>}
          </div>
          <div className="w90">
            <div>
              <span><span className="font-weight-bold">{translate('activity.list.body.order-plan-date')}：</span>{item.orderPlanDate ? dateFnsFormat(item.orderPlanDate, CommonUtil.getUseFormatDate()) : ""}</span>
              <span className="ml-5"><span className="font-weight-bold font-weight-bold">{translate('activity.list.body.end-plan-date')}：</span>{item.endPlanDate ? dateFnsFormat(item.endPlanDate, CommonUtil.getUseFormatDate()) : ""}</span>
            </div>
            <div className="mt-1">
              <span><span className="font-weight-bold">{translate('activity.list.body.price')}：</span>{StringUtils.numberFormat(item.price)}</span>
              <span className="ml-5"><span className="font-weight-bold">{translate('activity.list.body.quantity')}：</span>{StringUtils.numberFormat(item.quantity)}</span>
              <span className="ml-5"><span className="font-weight-bold">{translate('activity.list.body.amount')}：</span>{StringUtils.numberFormat(item.amount)}</span>
              <span className="ml-5 d-inline-flex align-items-center">
                <span className="font-weight-bold">{translate('activity.list.body.employee-name')}：</span>
                <EmployeeName
                  userName={(item.employee?.employeeSurname || "") + " " + (item.employee?.employeeName || "")}
                  userImage={item.employee?.employeePhoto?.fileUrl}
                  employeeId={item.employee?.employeeId}
                  sizeAvatar={30}
                  backdrop={true}
                ></EmployeeName>
              </span>
            </div>
            <div className="mt-1">
              <span><span className="font-weight-bold">{translate('activity.list.body.memo-name')}：</span>{item.memo}</span>
            </div>
          </div>
        </div>
      })
      }

      <div className="color-333 mt-2 pl-3">
        {translate('activity.list.body.memo-name')}：{props.data?.memo}
      </div>
      <div className="color-333 mt-2 pl-3">
        <span className="font-weight-bold">{translate('activity.list.body.next-schedule')}： </span>{renderNextSchedule()}
      </div>
      <div className="color-333 mt-2 pl-3 d-flex flag-wrap reduce-space">
        <div className="item_seti d-flex align-items-center">
          <span className="font-weight-bold">
            {translate('activity.list.body.create-date')}：
          </span>
          {CommonUtil.convertToDate(props.data?.createdDate)}
        </div>
        <div className="item_seti d-flex align-items-center">
          <span className="font-weight-bold">{translate('activity.list.body.create-user-name')}</span>
          <EmployeeName
            userName={(props.data?.createdUser?.employeeSurname || "") + " " + (props.data?.createdUser?.employeeName || "")}
            userImage={props.data?.createdUser?.employeePhoto?.fileUrl}
            employeeId={props.data?.createdUser?.employeeId}
            sizeAvatar={30}
            backdrop={true}
          ></EmployeeName>
        </div>
      </div>
      <div className="color-333 mt-2 pl-3 d-flex flag-wrap reduce-space">
        <div className="item_seti d-flex align-items-center">
          <span className="font-weight-bold">
            {translate('activity.list.body.updated-date')}：
          </span>
          {CommonUtil.convertToDate(props.data?.updatedDate)}
        </div>
        <div className="item_seti d-flex align-items-center">
          <span className="font-weight-bold">{translate('activity.list.body.updated-user-name')}</span>
          <EmployeeName
            userName={(props.data?.updatedUser?.employeeSurname || "") + " " + (props.data?.updatedUser?.employeeName || "")}
            userImage={props.data?.updatedUser?.employeePhoto?.fileUrl}
            employeeId={props.data?.updatedUser?.employeeId}
            sizeAvatar={30}
            backdrop={true}
          ></EmployeeName>
        </div>
      </div>
    </div>
    {/* {props.data?.activities && (props.data.isDraft === 'false' || props.data.isDraft === false) &&
      <div className="activity-info-bot">
        <a className="icon-small-primary icon-comment mr-2" />
        <a className="icon-small-primary icon-quote mr-2" />
        <a className="icon-small-primary icon-share mr-2" />
        <a className="icon-small-primary icon-face-smile-noba mr-2" />
        <a className="icon-small-primary icon-start mr-2" />
      </div>
    } */}
    {
      showCustomerDetail &&
      <PopupCustomerDetail
        id={customerDetailCtrlId[0]}
        openFromModal={true}
        showModal={true}
        customerId={customerId}
        listCustomerId={[]}
        toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
        openFromOtherServices={false}
      />
    }

  </>
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityListContentBody);
