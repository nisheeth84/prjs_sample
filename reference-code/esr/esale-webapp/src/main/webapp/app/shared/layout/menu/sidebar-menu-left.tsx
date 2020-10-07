import { IRootState } from 'app/shared/reducers';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import EmployeeDetailSetting from './employee-detail/employee-detail-setting';
import MenuLeftMore from './more/more';
import MenuLeftNotification from './notification/notification';
import MenuLeftNotificationDetail from './notification/notification-detail';
import MenuLeftSearchGlobal from './search-global/search-global';
import PopupMenuSet from 'app/modules/setting/menu-setting';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import $ from 'jquery';
import {
  reset,
  getCountNotification,
  getCompanyName,
  getServicesInfo,
  setExpandMenu,
  getStatusContract,
  getStatusOpenFeedback,
  getServiceOrder,
  getEmployeeById,
  resetEmployeeId

} from './sidebar-menu-left.reducer';
import { translate } from 'react-jhipster';
import MenuItems from './menu-items';
import FeedbackModal from './feedback/feedback';
import FeedbackSuccessModal from './feedback/feedback-success';
import { AUTH_TOKEN_KEY, USER_ICON_PATH } from 'app/config/constants';
import { Storage } from 'react-jhipster';
import jwtDecode from 'jwt-decode';
import PopupEmployeeDetail from '../../../modules/employees/popup-detail/popup-employee-detail';
import useEventListener from 'app/shared/util/use-event-listener';
import StringUtils from 'app/shared/util/string-utils';
import { WindowActionMessage } from './constants';
import _ from 'lodash';
import Portal from 'app/shared/layout/menu/portal/portal';
import ActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import TimelineDetail from 'app/modules/timeline/control/timeline-content/timeline-detail';
import { showModalDetail } from 'app/modules/calendar/modal/calendar-modal.reducer';
import CalendarDetail from 'app/modules/calendar/modal/calendar-detail';
import { useLocation } from 'react-router';




export interface ISidebarMenuLeftProps extends StateProps, DispatchProps {
  componentDisplay: string;
}

const SidebarMenuLeft = (props: ISidebarMenuLeftProps) => {
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [listEmployeeId, setListEmployeeId] = useState([]);

  const [toggleModalEmployee, setToggleModalEmployee] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState(false);
  const [expand, setExpand] = useState(true);
  const [employeName, setEmployeName] = useState(null);
  const [toggleFeedbackModal, setToggleFeedbackModal] = useState(false);
  const [toggleFeedbackSuccessModal, setToggleFeedbackSuccessModal] = useState(false);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [onOpenPopupDetailTask, setOnOpenPopupDetailTask] = useState(false);
  const [onOpenModalDetailSubTask, setOnOpenModalDetailSubTask] = useState(false);
  const [onOpenPopupDetailMilestone, setOnOpenPopupDetailMilestone] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [openPortalPopup, setOpenPortalPopup] = useState(false);
  const [displayType, setDisplayType] = useState(true)
  const bellRef = useRef(null);
  const node = useRef(null);
  const timerRef = useRef(null);
  const [openPopup, setOpenPopup] = useState(true);
  const [statusPortalData, setStatusPortalData] = useState(true);
  const [openPopupActivity, setOpenPopupActivity] = useState(false);
  const [openPopupBusinessCard, setOpenPopupBusinessCard] = useState(false);
  const [openPopupCustomer, setOpenPopupCustomer] = useState(false);
  const [openPopupTimeline, setOpenPopupTimeline] = useState(false);
  const [openPopupDetailSchedule, setOpenPopupDetailSchedule] = useState(false);
  const employeeDetailCtrlId = useId(1, "sidebarMenuLeftEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "sidebarMenuLeftCustomerDetailCtrlId_");

  const buttonToogle = useRef(null);

const location = useLocation();
  const [menuSettingActive,setMenuSettingActive] = useState(false);

  useEffect(() => {
    props.getStatusOpenFeedback();
    setSelectedTargetId({});
    props.getServicesInfo();
    props.getCountNotification();

    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      props.getCompanyName(jwtData['custom:tenant_id']);
      setEmployeName(
        jwtData['custom:employee_surname'] +
        ' ' +
        (jwtData['custom:employee_name'] !== null && jwtData['custom:employee_name'] !== undefined ? jwtData['custom:employee_name'] : '')
      );
      setIsAdmin(jwtData['custom:is_admin']);
      setAvatarImg(Storage.session.get(USER_ICON_PATH, 'default icon'));
      props.getEmployeeById({ employeeIds: [parseInt(jwtData['custom:employee_id'], 10)] })
    }
  }, [statusPortalData]);

  useEffect(() => {
    if (props.loadnotification)
      props.getCountNotification();

  }, [props.loadnotification]);

  useEffect(() => {
    if (!_.isEmpty(props.servicesInfo)) {
      props.getServiceOrder(null, props.servicesInfo);
    }
  }, [props.servicesInfo, props.changeSuccessId]);

  const onReceiveMessage = (ev) => {
    if (StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadServiceSideBar) {
      props.getServicesInfo();
    }
  }

  useEventListener('message', onReceiveMessage);

  clearInterval(timerRef.current);
  timerRef.current = setInterval(props.getCountNotification, 120000);

  const toggleNotificationDetail = () => {
    setShowNoti(!showNoti);
    setShowNotiModal(!showNotiModal);
  };

  const toggleModalNoti = () => {
    setShowNotiModal(false);
  };
  const toggleModalSearch = () => {
    setSearchGlobal(false);
  };

  const togglePopupEmployee = () => {
    if (showMore) setShowMore(!showMore);
    setToggleModalEmployee(!toggleModalEmployee);
  };

  /**
   * Close employee detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  };

  /**
   * Open employee detail
   */
  const onOpenPopupEmployeeDetail = () => {
    setShowMore(!showMore);
    let jwt = Storage.local.get(AUTH_TOKEN_KEY);
    if (!jwt) {
      jwt = Storage.session.get(AUTH_TOKEN_KEY);
    }
    let userUpdateId = 0;
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      userUpdateId = jwtData['custom:employee_id'] ? jwtData['custom:employee_id'] : 0;
    }
    if (userUpdateId > 0) {
      const lstEmployeeId = [];
      lstEmployeeId.push(userUpdateId);
      setListEmployeeId(lstEmployeeId);
      setEmployeeId(userUpdateId);
      setOpenPopupEmployeeDetail(true);
    }
    event.preventDefault();
  };

  useEffect(() => {
    if (!props.dataStatusOpenFeedback) {

      const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
      if (jwt) {
        const jwtData = jwtDecode(jwt);
        props.getStatusContract(jwtData['custom:tenant_id']);
      }
    }
  }, [props.dataStatusOpenFeedback]);


  useEffect(() => {
    if (props.dataStatusContract) {
      const sumTrialEndDate: any = new Date(props.dataStatusContract.trialEndDate);
      sumTrialEndDate.setDate(sumTrialEndDate.getDate() - 30);

      const currentDate: any = new Date();

      const trialDate = Math.abs(currentDate - sumTrialEndDate);
      const diffDays = Math.ceil(trialDate / (1000 * 60 * 60 * 24));
      if (diffDays > 7 && props.dataStatusOpenFeedback === null) {
        setToggleFeedbackModal(true);
        setDisplayType(false)
      }
    }
  }, [props.dataStatusContract]);

  const handleFeedbackModal = e => {
    setToggleFeedbackModal(!toggleFeedbackModal);
    props.resetEmployeeId()
    if (e === true) {
      setToggleFeedbackSuccessModal(true);
    }
  };

  const handleFeedbackSuccessModal = () => {
    setToggleFeedbackSuccessModal(false);
  };

  const switchPopup = more => {
    if (more) {
      setShowMore(!showMore);
      setShowNoti(false);
    } else {
      setShowNoti(!showNoti);
      setShowMore(false);
    }
  };

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    $(".active").removeClass();
    setOnOpenPopupSetting(false);
    const urlCurrent = location.pathname.split('/')[1];
    if(urlCurrent){
      $("#"+urlCurrent).addClass("active");
    }
  };

  const handleClickOutside = event => {
    if (bellRef.current && !bellRef.current.contains(event.target)) {
      setShowNoti(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleClickOutsideMore = event => {
    if (node.current && !node.current.contains(event.target)) {
      setShowMore(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideMore, false);
    return () => {
      document.removeEventListener('click', handleClickOutsideMore, false);
    };
  }, []);

  const dialogSetting = () => {
    setShowNotiModal(!showNotiModal);
    setOnOpenPopupSetting(true)
  }

  const onClickDetailActivity = (activityId) => {
    selectedTargetId[activityId] = null;
    setSelectedTargetId({ ...selectedTargetId, activityId });
    setOpenPopupActivity(true);
  }

  const onClickDetailBusinessCard = (businessCardId) => {
    selectedTargetId[businessCardId] = null;
    setSelectedTargetId({ ...selectedTargetId, businessCardId });
    setOpenPopupBusinessCard(true);
  }

  const onClickDetailCustomer = (customerId) => {
    selectedTargetId[customerId] = null;
    setSelectedTargetId({ ...selectedTargetId, customerId });
    setOpenPopupCustomer(true);
  }

  const onClickDetailTimeline = (timelineId) => {
    selectedTargetId[timelineId] = null;
    setSelectedTargetId({ ...selectedTargetId, timelineId });
    setOpenPopupTimeline(true);
  }

  const onClickDetailTask = (taskId) => {
    selectedTargetId[taskId] = null;
    setSelectedTargetId({ ...selectedTargetId, taskId });
    setOnOpenPopupDetailTask(true);
  }
  const onClickDetailSubTask = (subTaskId) => {
    selectedTargetId[subTaskId] = null;
    setSelectedTargetId({ ...selectedTargetId, subTaskId });
    setOnOpenModalDetailSubTask(true);
  }
  const onClickDetailMilestone = (milestoneId) => {
    selectedTargetId[milestoneId] = null;
    setSelectedTargetId({ ...selectedTargetId, milestoneId });
    setOnOpenPopupDetailMilestone(true);
  }
  const onClickDetailSchedule = (scheduleId) => {
    selectedTargetId[scheduleId] = null;
    setSelectedTargetId({ ...selectedTargetId, scheduleId });
    setOpenPopupDetailSchedule(true)
  }
  const toggleCloseModalTaskDetail = () => {
    setOnOpenPopupDetailTask(false);
  }
  const toggleCloseModalSubTaskDetail = () => {
    setOnOpenModalDetailSubTask(false);
  }
  const toggleCloseModalMilesDetail = () => {
    setOnOpenPopupDetailMilestone(false);
  }
  const toggleCloseModalActivityDetail = () => {
    setOpenPopupActivity(false);
  }
  const toggleCloseModalBusinessDetail = () => {
    setOpenPopupBusinessCard(false);
  }
  const toggleCloseModalCustomerDetail = () => {
    setOpenPopupCustomer(false);
  }
  const toggleCloseModalTimelineDetail = () => {
    setOpenPopupTimeline(false);
  }

  const toggleCloseModalScheduleDetail = () => {
    setOpenPopupDetailSchedule(false)
  }


  const onOpenModalTargetDetail = (notifi) => {
    if (!notifi) {
      return;
    }
    if (notifi.taskId > 0) {
      onClickDetailTask(notifi.taskId);
    } else if (notifi.milestoneId > 0) {
      onClickDetailMilestone(notifi.milestoneId);
    } else if (notifi.activityId > 0) {
      onClickDetailActivity(notifi.activityId)
    } else if (notifi.businessCardId > 0) {
      onClickDetailBusinessCard(notifi.businessCardId)
    } else if (notifi.customerId > 0) {
      onClickDetailCustomer(notifi.customerId)
    } else if (notifi.timelineId > 0) {
      onClickDetailTimeline(notifi.timelineId)
    } else if (notifi.scheduleId > 0) {
      onClickDetailSchedule(notifi.scheduleId)
    }
  }

  const renderPopupDetailForNotice = () => {
    const list = [[], [], []];
    const listToDetail = [...list[STATUS_TASK.NOT_STARTED - 1], ...list[STATUS_TASK.WORKING - 1], ...list[STATUS_TASK.COMPLETED - 1]];
    return (
      <>
        {onOpenPopupDetailTask && <DetailTaskModal key={selectedTargetId.taskId} iconFunction="ic-task-brown.svg"
          taskId={selectedTargetId?.taskId}
          toggleCloseModalTaskDetail={toggleCloseModalTaskDetail}
          listTask={listToDetail}
          canBack={false}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask} />}

        {onOpenModalDetailSubTask && <DetailTaskModal iconFunction="ic-task-brown.svg"
          taskId={selectedTargetId.subTaskId}
          toggleCloseModalTaskDetail={toggleCloseModalSubTaskDetail}
          listTask={listToDetail}
          canBack={false}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask} />}

        {onOpenPopupDetailMilestone && <DetailMilestoneModal
          milesActionType={null}
          milestoneId={selectedTargetId.milestoneId}
          toggleCloseModalMilesDetail={toggleCloseModalMilesDetail} />}


        {openPopupActivity && <ActivityDetail
          activityId={selectedTargetId.activityId}
          listActivityId={[]}
          onCloseActivityDetail={toggleCloseModalActivityDetail} />}

        {openPopupBusinessCard && <BusinessCardDetail
          showModal={true}
          listBusinessCardId={[]}
          businessCardList={[]}
          businessCardId={selectedTargetId.businessCardId}
          toggleClosePopupBusinessCardDetail={toggleCloseModalBusinessDetail}

        />}

        {openPopupCustomer && <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          customerId={selectedTargetId.customerId}
          showModal={true}
          listCustomerId={[]}
          toggleClosePopupCustomerDetail={toggleCloseModalCustomerDetail}

        />}

        {openPopupTimeline && <TimelineDetail
          data={selectedTargetId.customerId}
          isCommon={true}
          closeModal={toggleCloseModalTimelineDetail}

        />}


        {openPopupActivity && <ActivityDetail
          activityId={selectedTargetId.activityId}
          listActivityId={[]}
          onCloseActivityDetail={toggleCloseModalActivityDetail} />}

        {openPopupBusinessCard && <BusinessCardDetail
          showModal={true}
          listBusinessCardId={[]}
          businessCardList={[]}
          businessCardId={selectedTargetId.businessCardId}
          toggleClosePopupBusinessCardDetail={toggleCloseModalBusinessDetail}

        />}

        { openPopupCustomer && <PopupCustomerDetail
        id={customerDetailCtrlId[0]}
        customerId = {selectedTargetId.customerId}
        showModal = {true}
        listCustomerId ={[]}
        toggleClosePopupCustomerDetail ={toggleCloseModalCustomerDetail}

        />}

        {openPopupTimeline && <TimelineDetail
          data={selectedTargetId.customerId}
          isCommon={true}
          closeModal={toggleCloseModalTimelineDetail}

        />}

        {openPopupDetailSchedule && <CalendarDetail
          detailId={selectedTargetId.scheduleId}
          onClosed={toggleCloseModalScheduleDetail}
        />}
      </>
    );
  }

  const closePortalPopup = () => {
    setOpenPortalPopup(false);
  }

  const changeStatusPopup = () => {
    setOpenPopup(false);
    setOpenPortalPopup(true);
  }

  const setFalseStatus = () => {
    setOpenPopup(false);
  }

  const changeStatusPortalData = () => {
    setStatusPortalData(!statusPortalData)
  }

  const openDialogSetting = () =>{
    $(".active").removeClass();
    setOnOpenPopupSetting(true);
    setMenuSettingActive(true);
  }

  const renderComponent = () => {
    return (
      <>
        <div className="wrap-membership">
          <div className={expand ? '' : 'sidebar-left-mini'}>
            <div className={expand ? 'sidebar-left d-flex flex-column' : 'sidebar-left sidebar-left-v2 d-flex flex-column'}>
              <div className="sidebar-top">
                <div className={expand ? 'account-info' : 'account-info menuship-acc-w30'}>
                  {avatarImg ? (<img className="avatar" src={avatarImg} />) : (<a className="avatar"> {employeName ? employeName.charAt(0) : ''} </a>)}
                  <div className="info">
                    <span className="name member-ship-text-transform-none text-break">{employeName}</span>
                    <span className="if text-break">{props.companyName}</span>
                    <a className="icon-down" onClick={() => switchPopup(true)} ref={node}>
                      <i className="far fa-angle-down" />
                    </a>
                  </div>
                  <a className="icon-bell" onClick={() => switchPopup(false)} ref={bellRef}>
                    <img src="/content/images/ic-bell.svg" />
                    {props.notificationNumber > 0 ? (
                      <span className="noiti-bell">{props.notificationNumber > 99 ? '99+' : props.notificationNumber}</span>
                    ) : (
                        ''
                      )}
                  </a>
                </div>
                {showMore && <MenuLeftMore togglePopupEmployee={togglePopupEmployee} togglePopupEmployeeDetail={onOpenPopupEmployeeDetail} />}
                {openPopupEmployeeDetail && (
                  <PopupEmployeeDetail
                    id={employeeDetailCtrlId[0]}
                    showModal={true}
                    employeeId={employeeId}
                    listEmployeeId={listEmployeeId}
                    toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
                    resetSuccessMessage={() => { }}
                  />
                )}
                {toggleModalEmployee && <EmployeeDetailSetting togglePopupEmployee={togglePopupEmployee} />}
                {showNoti && <MenuLeftNotification
                  getCountNotification={props.getCountNotification}
                  toggleOpenModalTargetDetail={onOpenModalTargetDetail}
                  toggleModalNoti={toggleNotificationDetail} isExpand={expand} />}
                {showNotiModal && (
                  <MenuLeftNotificationDetail
                    getCountNotification={props.getCountNotification}
                    toggleOpenModalTargetDetail={onOpenModalTargetDetail}
                    toggleModalNoti={toggleModalNoti}
                    toggleNotificationDetail={toggleNotificationDetail}
                    dialogSetting={() => dialogSetting()} />
                )}


                {searchGlobal && <MenuLeftSearchGlobal toggleModalSearch={toggleModalSearch} lstServices={props.servicesInfo} />}
                {expand && props.msgContract && props.msgContract.length > 0 && (
                  <div className="form-group error">
                    <span className="icon">
                      <img src="/content/images/ic-note.svg" />
                    </span>
                    <span className="font-size-10" style={{ color: 'white' }}>
                      {props.dayRemainTrial > 0
                        ? translate('messages.' + props.msgContract, { 0: props.dayRemainTrial })
                        : translate('messages.' + props.msgContract)}
                    </span>
                  </div>
                )}
                <a className="sedebar-search" onClick={() => setSearchGlobal(!searchGlobal)}>
                  <i className="far fa-search" />
                  {translate('nav.searchGlobal')}
                </a>
              </div>
              <div className="sidebar-menu-outer mw-100 flex-fill">
                <div className="sidebar-menu-inner h-100">
                  <div className="scrollbar-gray overflow-auto h-100">
                    <ul className="sidebar-menu h-auto w-100">
                      <MenuItems componentDisplay={props.componentDisplay} />
                      {isAdmin === 'true' && (
                        <li>
                          <a tabIndex={0} onClick={() => openDialogSetting()} className={menuSettingActive===true ? 'alert-link false active' : 'alert-link false'}>
                            <span className="icon">
                              <img src="content/images/setting/icon-gear.svg" />
                            </span>
                            <span className="text">{translate('nav.setting')}</span>
                          </a>
                        </li>
                      )}

                      <li className="last"></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={expand ? 'sidebar-control position-static' : 'sidebar-control show-menu-bottom position-static'}>
                <ul className="sidebar-control-list">
                  <li>
                    <a onClick={e => setOpenPortalPopup(true)}>
                      <span className="icon">
                        <img src="../../../content/images/ic-new-user.svg" />
                      </span>
                      <span className="text" >{translate('nav.userNew')}</span>
                      {((props.isDisplayFirstScreen && openPopup && props.loading === true) || (props.isDisplayFirstScreen === null && openPopup && props.loading) || openPortalPopup) && <Portal
                        closePortalPopupPortal={closePortalPopup}
                        changeStatusPopup={changeStatusPopup}
                        setFalseStatus={setFalseStatus}
                        changeStatusPortalData={changeStatusPortalData}
                      />}
                    </a>
                  </li>
                  {toggleFeedbackModal && <FeedbackModal togglePopup={handleFeedbackModal} displayType={displayType} />}
                  {toggleFeedbackSuccessModal && <FeedbackSuccessModal togglePopup={handleFeedbackSuccessModal} />}
                  <li>
                    <a onClick={handleFeedbackModal}>
                      <span className="icon">
                        <img src="../../../content/images/ic-feedback.svg" />
                      </span>
                      <span className="text">{translate('nav.feedback')}</span>
                    </a>
                  </li>
                </ul>
                <a className="sidebar-control-list-expand" />
                <a
                  className="expand"
                  onClick={() => {
                    setExpand(!expand);
                    props.setExpandMenu(!expand);
                  }}
                >
                  <i className="far fa-angle-left" />
                </a>
              </div>
            </div>
          </div>

          {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
        </div>
        {renderPopupDetailForNotice()}
      </>
    );
  }

  return (
    <>
      {renderComponent()}
    </>
  );
};
const mapStateToProps = ({ menuLeft, authentication, notification, dataModalSchedule }: IRootState) => ({
  notificationNumber: menuLeft.notificationNumber,
  companyName: menuLeft.companyName,
  servicesInfo: menuLeft.servicesInfo,
  dayRemainTrial: authentication.dayRemainTrial,
  msgContract: authentication.msgContract,
  account: authentication.account,
  dataStatusOpenFeedback: menuLeft.employeeId,
  dataStatusContract: menuLeft.statusContract,
  servicesInfoOrder: menuLeft.servicesOrder,
  changeSuccessId: menuLeft.changeSuccessId,
  isDisplayFirstScreen: menuLeft.isDisplayFirstScreen,
  loading: menuLeft.loading,
  loadnotification: notification.idUpdate,
  openCalendarDetail: dataModalSchedule.scheduleId
});

const mapDispatchToProps = {
  reset,
  getCountNotification,
  getCompanyName,
  getServicesInfo,
  setExpandMenu,
  getStatusContract,
  getStatusOpenFeedback,
  getServiceOrder,
  getEmployeeById,
  showModalDetail,
  resetEmployeeId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarMenuLeft);
