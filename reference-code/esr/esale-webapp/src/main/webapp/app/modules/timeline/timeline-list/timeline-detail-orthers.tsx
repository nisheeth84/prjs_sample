import React, { useState, useEffect } from 'react';
import { TYPE_DETAIL_MODAL_HEADER } from '../common/constants';
import { IRootState } from 'app/shared/reducers';
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail'
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail'
import { ObjectDetail } from '../models/get-followeds-model';
import { Modal } from 'reactstrap';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';
import { showModalDetail } from "app/modules/calendar/modal/calendar-modal.reducer";
import ActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import ProductDetail from 'app/modules/products/product-detail/product-detail';

type ITimelineDetailOthersProp = StateProps & DispatchProps & {
  dataPopupDetail: ObjectDetail
  classBodyCurrent?: string
  popout?: boolean
}

export const TimelineDetailOthers = (props: ITimelineDetailOthersProp) => {
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showMileStoneDetail, setShowMileStoneDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const [customerId, setCustomerId] = useState();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardId, setCardId] = useState();
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [showCalendarDetails, setShowCalendarDetails] = useState(false);
  const employeeDetailCtrlId = useId(1, "timelineDetailOtherEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "timelineDetailOtherCustomerDetailCtrlId_");
  const [openPopupProductDetail, setOpenPopupProductDetail] = useState(false);

  const openPopUpEmployeeDetails = (itemId) => {
    setShowEmployeeDetails(true);
    setEmployeeId(itemId);
  }
  const onClosePopupDetail = () => {
    setShowEmployeeDetails(false);
  }

  const renderPopUpEmployeeDetails = () => {
    if (showEmployeeDetails) {
      return <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        openFromModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupDetail}
        resetSuccessMessage={() => { }} />
    }
  }
  
  const resetClassAfterCloseModal = () => {
    document.body.className = props.classBodyCurrent? props.classBodyCurrent: 'wrap-timeline';
  }

  // Details Customer
  const openPopUpCustomerDetails = (itemId) => {
    setShowCustomerDetails(true)
    setCustomerId(itemId)
  }
  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetails(false)
    resetClassAfterCloseModal()
  }

  const renderPopUpCustomerDetails = () => {
    if (showCustomerDetails) {
      return <PopupCustomerDetail
      id={customerDetailCtrlId[0]}
      showModal={true}
      customerId={customerId}
      listCustomerId={[]}
      toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
      openFromOtherServices={true}
    />
    }
  }
  // Màn Card
  const openPopUpCardDetails = (itemId) => {
    setShowCardDetails(true);
    setCardId(itemId);
  }
  const onClosePopupCardDetail = () => {
    setShowCardDetails(false);
    resetClassAfterCloseModal()
  }
  const renderPopUpCardDetails = () => {
    if (showCardDetails) {
      return <BusinessCardDetail
        key={cardId}
        showModal={true}
        businessCardId={cardId}
        listBusinessCardId={[cardId]}
        businessCardList={[]}
        toggleClosePopupBusinessCardDetail={onClosePopupCardDetail}
      />
    }
  }

  // Customer end
  const onClickDetailPopup = (objectId, type) => {
    switch (type) {
      case TYPE_DETAIL_MODAL_HEADER.EMPLOYEE:
        openPopUpEmployeeDetails(objectId);
        break;
      case TYPE_DETAIL_MODAL_HEADER.CUSTOMER:
        openPopUpCustomerDetails(objectId)
        break;
      case TYPE_DETAIL_MODAL_HEADER.CARD:
        openPopUpCardDetails(objectId);
        break;
      case TYPE_DETAIL_MODAL_HEADER.SCHEDULE:
        setShowCalendarDetails(true);
        break;
      case TYPE_DETAIL_MODAL_HEADER.TASK:
        setShowTaskDetails(true);
        break;
      case TYPE_DETAIL_MODAL_HEADER.MILESTONE:
        setShowMileStoneDetail(true);
        break;
      case TYPE_DETAIL_MODAL_HEADER.ACTIVITY:
        setShowActivityDetails(true);
        break;
      case TYPE_DETAIL_MODAL_HEADER.PRODUCT:
        setOpenPopupProductDetail(false);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if(props.dataPopupDetail){
      onClickDetailPopup(props.dataPopupDetail.objectId, props.dataPopupDetail.objectType);
    }
  }, [props.dataPopupDetail] )

   /**
   * renderProductDetail
   */
  const renderProductDetail = () => {
    return <>
      {openPopupProductDetail &&
        <ProductDetail
          popout={props.popout}
          key={props.dataPopupDetail.objectId}
          showModal={true}
          productId={props.dataPopupDetail.objectId}
          openFromModal={true}
          toggleClosePopupProductDetail={() => {setOpenPopupProductDetail(false); resetClassAfterCloseModal()}}
        />
      }
    </>
  }

  /**
  * check and render modal milestone detail
  */
  const renderModalMilestoneDetail = () => {
    if (showMileStoneDetail) {
      return <DetailMilestoneModal
        milestoneId={props.dataPopupDetail.objectId}
        popoutParams={true}
        // canBack={canBack}
        toggleCloseModalMilesDetail={() => {setShowMileStoneDetail(false); resetClassAfterCloseModal()}}
        milesActionType={MILES_ACTION_TYPES.UPDATE}
      />
    }
  }

  /**
   * check render modal task detail
   */
  const renderModalTaskDetail = () => {
    if (showTaskDetails) {
      return <DetailTaskModal
        taskId={props.dataPopupDetail.objectId}
        canBack={true}
        openFromModal={true}
        toggleCloseModalTaskDetail={() => {setShowTaskDetails(false); resetClassAfterCloseModal()}} />
    }
  }

  /**
   * check render modal activity detail
  */
  const renderModalActivityDetail = () => {
    if (showActivityDetails) {
      return <ActivityDetail popout={false}
            activityId={props.dataPopupDetail.objectId}
            onDeleleSuccess={() => setShowActivityDetails(false)}
            canBack={true}
            onCloseActivityDetail={() => {setShowActivityDetails(false); resetClassAfterCloseModal()}}/>
    }
  }

  /**
    * check and render modal CalendarDetail
  */
  const renderModalCalendarDetail = () => {
    if (showCalendarDetails) {
        return <CalendarDetail
        detailId = {props.dataPopupDetail.objectId}
        onClosed = {()=> {setShowCalendarDetails(false); resetClassAfterCloseModal()}}/>
    }
  }

  return (
    <>
      {renderPopUpEmployeeDetails()}
      {renderPopUpCustomerDetails()}
      {renderPopUpCardDetails()}
      {renderModalActivityDetail()}
      {renderProductDetail()}
      {(showCalendarDetails || showMileStoneDetail || showTaskDetails) &&
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-employee-detail" autoFocus={true} zIndex="auto">
        <div className="wrap-calendar">
          {renderModalCalendarDetail()}
          {renderModalMilestoneDetail()}
          {renderModalTaskDetail()}
        </div>
      </Modal>
      }
    </>
  )
}

const mapStateToProps = ({ timelineReducerState, dataModalSchedule }: IRootState) => ({
  showDetailModalOther: timelineReducerState.showDetailModalOther,
  modalDetail: dataModalSchedule.modalDetailCalendar
});

const mapDispatchToProps = {
  showModalDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineDetailOthers);
