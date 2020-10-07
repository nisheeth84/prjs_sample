import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { Modal } from 'reactstrap';
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';
import DetailMilestoneModal from "app/modules/tasks/milestone/detail/detail-milestone-modal";
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";
import { TYPE_DETAIL_MODAL } from '../constants';
import { showModalDetail } from "app/modules/calendar/modal/calendar-modal.reducer";
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import ProductDetail from 'app/modules/products/product-detail/product-detail';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';
import { clearShowDetail } from 'app/modules/activity/list/activity-list-reducer';
import _ from 'lodash';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';

export interface IShowDetailProp extends StateProps, DispatchProps{
  idCaller: any;
  callFrom?: any;
  cleanClosePopup?: boolean
  popout?: boolean,
  customerIdOfBusinessCard?: number
}
/**
 * component for show detail
 * @param props
 */
const ShowDetail = (props: IShowDetailProp) => {
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [milestoneId, setMilestoneId] = useState(null);
  const [popoutParamsMilestone, setPopoutParamsMilestone] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [calendarId, setCalendarId] = useState(null);
  const [showCalendarDetail, setShowCalendarDetail] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [openPopupProductDetail, setOpenPopupProductDetail] = useState(false);
  const [productId, setProductId] = useState(null);
  const [openPopupBusinessCardDetail, setOpenPopupBusinessCardDetail] = useState(false);
  const [businessCardId, setBusinessCardId] = useState(null);
  const [canBack, setCanBack] = useState(false);
  const employeeDetailCtrlId = useId(1, "activityEmployeeDetailCtrlId_");
  const customerEditCtrlId = useId(1, "activityCustomerEditCtrlId_");
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false);

  const handleCloseDetail = (type) => {
    if(props.cleanClosePopup){
      props.clearShowDetail();
    }
    switch (type) {
      case TYPE_DETAIL_MODAL.TASK:
        setShowTaskDetails(false);
        break;
      case TYPE_DETAIL_MODAL.MILESTONE:
        setShowMilestoneDetails(false);
        break;
      case TYPE_DETAIL_MODAL.BUSINESS_CARD:
        setOpenPopupBusinessCardDetail(false);
        break;
      case TYPE_DETAIL_MODAL.SCHEDULE:
        setShowCalendarDetail(false);
        break;
      case TYPE_DETAIL_MODAL.EMPLOYEE:
        setShowEmployeeDetails(false);
        break;
      case TYPE_DETAIL_MODAL.CUSTOMER: {
          const className = document.body.className;
          if(!className.includes('wrap-activity')) {
            document.body.className = className + ' wrap-activity';
          }
          setShowCustomerDetail(false);
          break;
        }
      case TYPE_DETAIL_MODAL.PRODUCT:
        setOpenPopupProductDetail(false);
        break;
      default: break;
    }
  }


  /**
 * check and render modal milestone detail
 */
  const renderModalMilestoneDetail = () => {
    if (showMilestoneDetails) {
      return <DetailMilestoneModal
        // popout={props.popout}
        milestoneId={milestoneId}
        openFromModal={true}
        popoutParams={popoutParamsMilestone}
        toggleCloseModalMilesDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.MILESTONE)}
        milesActionType={MILES_ACTION_TYPES.UPDATE}
      />
    }
  }


  /**
 * check and render modal employee detail
 */
  const renderPopUpEmployeeDetails = () => {
    if (showEmployeeDetails) {
      return <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        popout={props.popout}
        showModal={true}
        openFromModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.EMPLOYEE)}
        resetSuccessMessage={() => { }} />
    }
  }

  const renderCustomerDetail = () => {
    return <>
      { showCustomerDetail && 
        <PopupCustomerDetail
          id={customerEditCtrlId[0]}
          popout={props.popout}
          showModal={true}
          openFromModal={true}
          customerId={customerId}
          listCustomerId={[customerId]}
          toggleClosePopupCustomerDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.CUSTOMER)}
          openFromOtherServices={false}
        />
      }
    </>
  }

  /**
 * check and render modal CalendarDetail
 */
  const renderModalCalendarDetail = () => {
    return <> {showCalendarDetail && 
      <CalendarDetail detailId={calendarId} onClosed={()=> handleCloseDetail(TYPE_DETAIL_MODAL.SCHEDULE)}/> } 
    </>;
  }

  /**
 * check render modal task detail
 */
  const renderModalTaskDetail = () => {
    if (showTaskDetails) {
      return <DetailTaskModal
        popout={props.popout}
        openFromModal={true}
        taskId={taskId}
        canBack={canBack}
        toggleCloseModalTaskDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.TASK)} />
    }
  }

  const onClickDetailPopup = (objectId, type) => {

    // if (props.displayedObjectIds.findIndex(i => i.detailObjectId === objectId && i.detailType === type) === -1) {
    //   props.handleRegisterDisplayedIds(objectId, type);
    // } else {
    //   return;
    // }

    switch (type) {
      case TYPE_DETAIL_MODAL.EMPLOYEE:
        setEmployeeId(objectId);
        setShowEmployeeDetails(true);
        break;
      case TYPE_DETAIL_MODAL.SCHEDULE:
        setCalendarId(objectId);
        setShowCalendarDetail(true);
        break;
      case TYPE_DETAIL_MODAL.TASK:
        setTaskId(objectId);
        setShowTaskDetails(true);
        break;
      case TYPE_DETAIL_MODAL.MILESTONE:
        setMilestoneId(objectId);
        setPopoutParamsMilestone({milestoneId: objectId});
        setShowMilestoneDetails(true);
        break;
      case TYPE_DETAIL_MODAL.CUSTOMER:
        setCustomerId(objectId);
        setShowCustomerDetail(true);
        break;
      case TYPE_DETAIL_MODAL.PRODUCT:
        setProductId(objectId);
        setOpenPopupProductDetail(true);
        break;
      case TYPE_DETAIL_MODAL.BUSINESS_CARD:
        setBusinessCardId(objectId);
        setOpenPopupBusinessCardDetail(true);
        break;
      default: break;
    }
  }

  useEffect(() => {
    if (props.showServiceDetail && _.get(props.showServiceDetail, 'idCaller') === props.idCaller) {
      onClickDetailPopup(props.detailObjectId, props.detailType);
      setCanBack(props.isFromModal);
    }
  }, [props.showServiceDetail])

  /**
   * renderProductDetail
   */
  const renderProductDetail = () => {
    return <>
      {openPopupProductDetail &&
        <ProductDetail
          popout={props.popout}
          key={productId}
          showModal={true}
          productId={productId}
          openFromModal={true}
          toggleClosePopupProductDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.PRODUCT)}
        />
      }
    </>
  }


  /**
   * renderBusinessCardDetail
   */
  const renderBusinessCardDetail = () => {
    const businessCardList = [
      {
        'business_card_id': businessCardId,
        'customer_id': props.customerIdOfBusinessCard
      }
    ]
    return <>
       {openPopupBusinessCardDetail &&
        <BusinessCardDetail
          popout={props.popout}
          key={businessCardId}
          showModal={true}
          openFromModal={true}
          businessCardId={businessCardId}
          listBusinessCardId={[businessCardId]}
          toggleClosePopupBusinessCardDetail={() => handleCloseDetail(TYPE_DETAIL_MODAL.BUSINESS_CARD)}
          businessCardList={businessCardList}
        ></BusinessCardDetail>}
    </>
  }

  useEffect(() => {
    setOpenCreateSchedule(props.isShowPopupCreate);
    if(props.isShowPopupCreate) {
      document?.body?.classList && document.body.classList.add("wrap-calendar");
    }
  }, [props.isShowPopupCreate])

  const onCloseModalCreateEditSchedule = () => {
    setOpenCreateSchedule(false);
    document.body.className = document.body.className.replace('wrap-calendar', '');
  }

  return <>
    {renderPopUpEmployeeDetails()}
    {renderCustomerDetail()}
    {renderProductDetail()}
    {renderBusinessCardDetail()}
    {showCalendarDetail &&
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-calendar-detail" autoFocus={true} zIndex="auto">
        <div className="wrap-calendar">
          {renderModalCalendarDetail()}
        </div>
      </Modal>
    }
    {renderModalMilestoneDetail()}
    {renderModalTaskDetail()}
    {openCreateSchedule && <CreateEditSchedule onClosePopup={onCloseModalCreateEditSchedule} openFromModal={canBack}/>}
  </>;
}

const mapStateToProps = ({ activityListReducerState, dataCreateEditSchedule }: IRootState) => ({
  detailObjectId: activityListReducerState.detailObjectId,
  detailType: activityListReducerState.detailType,
  showServiceDetail: activityListReducerState.showServiceDetail,
  isFromModal: activityListReducerState.isFromModal,
  displayedObjectIds: activityListReducerState.displayedObjectIds,
  isShowPopupCreate: dataCreateEditSchedule.onShowCreate
});

const mapDispatchToProps = {
  showModalDetail,
  clearShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowDetail);
