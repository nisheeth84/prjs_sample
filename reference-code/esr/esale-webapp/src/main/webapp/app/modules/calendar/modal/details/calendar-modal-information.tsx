import React, { useState } from 'react'
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import { ACTION_TYPE } from '../calendar-modal.reducer';
import changeScreenMode from '../../../tasks/detail/detail-task.reducer';
import { AttendanceDivisionType, ItemTypeSchedule, LICENSE_IN_CALENDAR } from '../../constants';
import { isArray, isObject } from 'util';
import PopupEmployeeDetail from '../../../employees/popup-detail/popup-employee-detail';
// import { showModalSubDetail, hideModalSubDetail } from '../../modal/calendar-modal.reducer'
import DetailTaskModal from '../../../tasks/detail/detail-task-modal';
import DetailMilestoneModal from '../../../tasks/milestone/detail/detail-milestone-modal'
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";
import { CalenderViewMonthCommon } from '../../grid/common';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import moment from 'moment';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';

/**
 * interface modal info of component schedule detail
 */
type ICalendarModalInformationProps = StateProps & DispatchProps;
/**
 * truncate string if string too long
 * @param str
 * @param num
 */
export const truncateString = (str: string, num = 50) => {
  if (typeof str === 'string' && str !== null) {
    if (str.length <= num) {
      return str;
    }

    return str.slice(0, num) + '...';
  }
}
/**
 * component infomation of schedule detail
 * @param props
 * @constructor
 */
const CalendarModalInformation = (props: ICalendarModalInformationProps) => {
  /**
   * status of modal employee detail
   */
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  /**
   * employee id
   */
  const [employeeId, setEmployeeId] = useState(0);
  /**
   * status of modal task detail
   */
  const [showModalTaskDetail, setShowModalTaskDetail] = useState(false);
  /**
   * task id
   */
  const [taskId, setTaskId] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  /**
   * status of modal milestone detail
   */
  const [showModalMilestoneDetail, setShowModalMilestoneDetail] = useState(false);
  /**
   * milestone id
   */
  const [milestoneId, setMilestoneId] = useState(0);

  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const [displayActivitiesTab, setDisplayActivitiesTab] = useState(false);

  const [openPopupBusinessCardDetail, setOpenPopupBusinessCardDetail] = useState(false);

  const [businessCardId, setBusinessCardId] = useState(null);
  const employeeDetailCtrlId = useId(1, "calendarModalEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "calendaModalInfoCustomerDetailCtrlId_");

  /**
   * close popup employee detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
    document.body.className = 'wrap-calendar';
  }

  /**
   * open employeeId detail
   * @param employeeIdParam
   */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }


  const onClosePopupBusinessCardDetail = () => {
    setOpenPopupBusinessCardDetail(false);
    document.body.className = 'wrap-calendar';
  }

  const onOpenModalBusinessCardDetail = (businessCardIdParam) => {
    setBusinessCardId(businessCardIdParam);
    setOpenPopupBusinessCardDetail(true);
  }

  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(false);
    setDisplayActivitiesTab(false)
    document.body.className = 'wrap-calendar';
  }

  const onOpenModalCustomerDetail = (customerIdParam, detail) => {
    setCustomerId(customerIdParam);
    setShowCustomerDetail(true);
    setDisplayActivitiesTab(detail);
  }

  /**
   * close modal task detail
   */
  const closeModalTaskDetail = () => {
    setShowModalTaskDetail(false);
    document.body.className = 'wrap-calendar';
  }

  /**
   * open modal task detail
   */
  const openModalTaskDetail = (taskIdParam) => {
    setTaskId(taskIdParam);
    setShowModalTaskDetail(true);
  }

  /**
   * close modal milestone detail
   */
  const closeModalMilestoneDetail = () => {
    setShowModalMilestoneDetail(false);
    document.body.className = 'wrap-calendar';
  }

  /**
   * open modal milestone detail
   */
  const openModalMilestoneDetail = (milestoneIdParam) => {
    setMilestoneId(milestoneIdParam);
    setShowModalMilestoneDetail(true);
  }

  const renderFullAddress = (entitySchedule) => {
    const fullAddress = []
    if (entitySchedule['zipCode'] || entitySchedule['addressBelowPrefectures'] || entitySchedule['buildingName']) {
      fullAddress.push("〒")
    }
    if (entitySchedule['zipCode'])
      fullAddress.push(entitySchedule['zipCode'])

    if (entitySchedule['addressBelowPrefectures']) {
      // if (entitySchedule['zipCode']) {
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['addressBelowPrefectures'])
    }
    if (entitySchedule['buildingName']) {
      // if (entitySchedule['zipCode'] || entitySchedule['addressBelowPrefectures']) {
      //   fullAddress.push(" ")
      // }
      fullAddress.push(entitySchedule['buildingName'])
    }
    return fullAddress.join('')
  }

  /**
   * render employee
   * @param item
   * @param idx
   * @param keyPrefix
   */
  const renderEmployee = (item, idx, keyPrefix) => {
    let employeeNames = ""
    employeeNames = item.employeeName ? item.employeeName : item.employeeSurname
    return (<a className="text-ellipsis width-120-px margin-0-10-px" key={keyPrefix + '_' + idx} onClick={() => onOpenModalEmployeeDetail(item.employeeId)}>
      <img className={'user'}
        src={item.photoEmployeeImg ? item.photoEmployeeImg : '../../../content/images/ic-user1.svg'} alt='' title='' />
      <span className='text-blue'>{employeeNames}</span>
    </a>)
  }

  const renderAddress = () => {
    return (
      <>
        <div className='list-item'>
          <div className='img'><i className='fas fa-map-marker-alt' /></div>
          <div className={'w-100'}>
            <div className='text-content mb-1'>{translate('calendars.modal.address')}</div>
            <div className='item'><span
              className='text-blue text-small'>
              <a className="text-ellipsis" href={`http://maps.google.com/?q=${props.schedule['zipCode']}${props.schedule['addressBelowPrefectures']}${props.schedule['buildingName']}`}>
                {renderFullAddress(props.schedule)}
              </a></span>
            </div>
          </div>
        </div>
      </>
    )
  }

  /**
   * check expired milestone, task
   * @param date
   * @param status
   * @param type
   */
  const checkExpired = (date, status, type) => {
    let className = 'date';
    const checkDate = moment(date) < CalenderViewMonthCommon.nowDate()
    if (date && type === ItemTypeSchedule.Task) {
      if (checkDate && status) {
        if (status === 0 || status === 1 || status === 2) {
          className = 'date text-danger';
        }
      }
    } else {
      if (status === 0 && checkDate) {
        className = 'date text-danger';
      }
    }
    return className;
  }


  const renderCustomerName = (schedule) => {
    const customerName = schedule?.customer?.customerName;
    const parentCustomerName = schedule?.customer?.parentCustomerName;
    const aryResult = [];

    if (customerName) {
      aryResult.push(customerName)
    }
    if (parentCustomerName) {
      if (customerName) {
        aryResult.push(" ")
      }
      aryResult.push(parentCustomerName)
    }

    return aryResult.join('');
  }
  const renderProductTradings = (schedule) => {
    const customerName = renderCustomerName(schedule);
    const productTradings = schedule?.productTradings;
    const aryResult = [];

    if (productTradings && productTradings.length > 0) {

      const tmp = [];
      productTradings.forEach(element => {
        if (element?.productName) {
          if (element.productName) tmp.push(element.productName)
        }
      });
      if (customerName && tmp.length) {
        aryResult.push("／")
      }
      aryResult.push(tmp.join(","))
    }

    return aryResult.join('');
  }

  return (
    <div className='tab-pane active'>
      <div className='list-item-popup'>
        {(Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE) && props.listLicense.includes(LICENSE_IN_CALENDAR.SALES_LICENSE)) &&
          <div className='list-item'>
            <div className='img'><i className='fas fa-building' /></div>
            <div className="w100">
              <div className='text-content mb-1'>{translate('calendars.modal.customerProductTradings')}</div>
              {(props.schedule['customer']) &&
                <div className='item mb-1 d-flex'>
                  <a className='text-ellipsis w80' title=''
                    //  href={`${props.tenant}/customer/${props.schedule['customer']['customerId']}`}
                    onClick={() => { if (props.schedule['customer']['customerId']) onOpenModalCustomerDetail(props.schedule['customer']['customerId'], false) }}
                  >
                    <span className='text-blue text-small'>
                      {renderCustomerName(props.schedule)}
                      <span>
                        {renderProductTradings(props.schedule)}
                      </span>
                      {/* {props.schedule['customer']['customerName']} {props.schedule['customer']['parentCustomerName']}
                          {isArray(props.schedule['productTradings']) && props.schedule['productTradings'].length > 0 ? '/' : ''}
                          {
                            isArray(props.schedule['productTradings']) &&
                            props.schedule['productTradings'].map((product, idxProduct) => {
                              return <span key={'productTrading_' + idxProduct}>
                                &nbsp;{product.productTradingName}
                                {idxProduct < props.schedule['productTradings'].length - 1 ? ',' : ''}
                              </span>
                            })
                          } */}
                    </span>
                  </a>
                  {Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.ACTIVITY_LICENSE) && props.schedule['customer']['customerId'] &&
                    <a title=''
                      className='button-primary button-activity-registration ml-5 cl-black mb-0'
                      onClick={() => { if (props.schedule['customer']['customerId']) onOpenModalCustomerDetail(props.schedule['customer']['customerId'], true) }}>{translate('calendars.modal.historyActivities')}</a>
                  }
                </div>
              }
            </div>
          </div>
        }
        {(Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE)) &&
          <div className='list-item'>
            <div className='img'><i className='fas fa-building' /></div>
            <div className="w100">
              <div className='text-content mb-1'>{translate('calendars.modal.relatedCustomers')}</div>
              <div className='item mb-1 text-ellipsis'>
                {
                  isArray(props.schedule['relatedCustomers']) &&
                  props.schedule['relatedCustomers'].map((customer, idxCustomer) => {
                    return <a className="text-ellipsis" title='' key={'relatedCustomer' + idxCustomer}
                      // href={`${props.tenant}/customer/${customer.customerId}`}
                      onClick={() => { if (customer.customerId) onOpenModalCustomerDetail(customer.customerId, false) }}
                    >
                      <span className='text-blue text-small'>
                        &nbsp;{customer.customerName}
                        {idxCustomer < props.schedule['relatedCustomers'].length - 1 ? ',' : ''}
                      </span>
                    </a>
                  })
                }
              </div>
            </div>
          </div>
        }
        {renderAddress()}
        <div className='list-item'>
          <div className='img'><i className='fas fa-door-open' /></div>
          <div>
            <div className='text-content mb-1'>{translate('calendars.modal.equipments')}</div>
            <div className='item'>
              {isArray(props.schedule['equipments'])
                ? props.schedule['equipments'].map((item, idx) => {
                  const equipmentsNameJson = JSON.parse(item.equipmentName)
                  let equipmentsName = ""
                  if (equipmentsNameJson[`${props.account['languageCode']}`].length > 0) {
                    equipmentsName = equipmentsNameJson[`${props.account['languageCode']}`]
                  } else if (equipmentsNameJson[`ja_jp`].length > 0) {
                    equipmentsName = equipmentsNameJson[`ja_jp`]
                  } else if (equipmentsNameJson[`en_us`].length > 0) {
                    equipmentsName = equipmentsNameJson[`en_us`]
                  } else if (equipmentsNameJson[`zh_cn`].length > 0) {
                    equipmentsName = equipmentsNameJson[`zh_cn`]
                  }
                  return <div className='text-small' key={'equipment_' + idx}>{equipmentsName}</div>
                })
                : null
              }
            </div>
          </div>
        </div>
        {(Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.BUSINESS_CARD_LICENSE)) &&
          <div className='list-item'>
            <div className='img'><i className='fas fa-user' /></div>
            <div>
              <div className='text-content mb-1'>{translate('calendars.modal.businessCards')}</div>
              <div className='item'>
                {
                  isArray(props.schedule['businessCards']) &&
                  props.schedule['businessCards'].map((item, idx) => {
                    return <a title='' key={'businessCard_' + idx}>
                      <span className='text-blue text-small' onClick={() => onOpenModalBusinessCardDetail(item.businessCardId)}>
                        {item.businessCardName}{idx < props.schedule['businessCards'].length - 1 ? ',' : ''}
                      </span>
                    </a>
                  })
                }
              </div>
            </div>
          </div>
        }
        <div className='list-item'>
          <div className='img'><i className='fas fa-user' /></div>
          <div>
            <div className='text-content mb-1'>{translate('calendars.modal.participants')}</div>
            <div className='item item2 modal-detail-schedule'>
              {
                isObject(props.schedule['participants']) &&
                isArray(props.schedule['participants']['employees']) &&
                props.schedule['participants']['employees'].filter((item) => item.attendanceDivision === AttendanceDivisionType.Available)
                  .map((item, idx) => {
                    return renderEmployee(item, idx, 'participant');
                  })
              }
            </div>
            <div className='text-content mb-1'>{translate('calendars.modal.absentees')}</div>
            <div className='item item2 modal-detail-schedule'>
              {
                isObject(props.schedule['participants']) &&
                isArray(props.schedule['participants']['employees']) &&
                props.schedule['participants']['employees'].filter((item) => item.attendanceDivision === AttendanceDivisionType.Absent)
                  .map((item, idx) => {
                    return renderEmployee(item, idx, 'absentee')
                  })
              }
            </div>
            <div className=' text-content mb-1'>{translate('calendars.modal.unconfirmed')}</div>
            <div className='item item2 modal-detail-schedule'>
              {
                isObject(props.schedule['participants']) &&
                isArray(props.schedule['participants']['employees']) &&
                props.schedule['participants']['employees'].filter((item) => item.attendanceDivision === AttendanceDivisionType.NotConfirmed || item.attendanceDivision === null)
                  .map((item, idx) => {
                    return renderEmployee(item, idx, 'unconfirmed')
                  })
              }
            </div>
            <div className='text-content mb-1'>{translate('calendars.modal.sharers')}</div>
            <div className='item item2 modal-detail-schedule'>
              {
                isObject(props.schedule['sharers']) &&
                isArray(props.schedule['sharers']['employees']) &&
                props.schedule['sharers']['employees'].map((item, idx) => {
                  return renderEmployee(item, idx, 'sharers')
                })
              }
            </div>
          </div>
        </div>
        <div className='list-item'>
          <div className='img'><img title='' src='../../../content/images/task/ic-task.svg' alt='' /></div>
          <div>
            <div className='title'>{translate('calendars.modal.tasks')}</div>
            {
              isArray(props.schedule['tasks']) &&
              props.schedule['tasks'].map((task, idx) => {
                const endDate = CalenderViewMonthCommon.localToTimezoneOfConfig(task.endDate)
                return <div className='item d-flex' key={'task_' + idx}>
                  <span className={`${checkExpired(endDate, task.statusTaskId, ItemTypeSchedule.Task)}`}>{endDate.toDate().toLocaleDateString()}</span>
                  <a className='text-ellipsis' onClick={() => openModalTaskDetail(task.taskId)}
                    data-toggle='tooltip'
                    data-placement='bottom'
                    title={task.taskName}>
                    {/* {task.endDate}&nbsp; */}
                    <span className='text-blue'>{task.taskName}</span>
                  </a>
                  {/* {task.taskName && task.taskName.length > 50
                      ? (<a onClick={() => openModalTaskDetail(true)}
                        data-toggle='tooltip'
                        data-placement='bottom'
                        title={task.taskName}>
                        {task.endDate}&nbsp;
                        <span className='text-blue'>{truncateString(task.taskName)}</span>
                      </a>)
                      : (<a title='' onClick={() => openModalTaskDetail(true)}>
                        {task.endDate}&nbsp;
                        <span className='text-blue'>{task.taskName}</span>
                      </a>)
                    } */}
                </div>
              })
            }
          </div>
        </div>
        <div className='list-item'>
          <div className='img'><img title='' src='../../../content/images/task/ic-flag.svg' alt='' className="img-flag-style" /></div>
          <div>
            <div className='title'>{translate('calendars.modal.milestone')}</div>
            {
              isArray(props.schedule['milestones']) &&
              props.schedule['milestones'].map((milestone, idx) => {
                const endDate = CalenderViewMonthCommon.localToTimezoneOfConfig(milestone.milestoneTime ? milestone.milestoneTime : milestone.endDate)
                return <div className='item d-flex' key={'milestone' + idx}>
                  <span className={`${checkExpired(endDate, milestone?.isDone, ItemTypeSchedule.Milestone)}`}>{endDate.toDate().toLocaleDateString()}</span>
                  <a className='text-ellipsis' onClick={() => openModalMilestoneDetail(milestone.milestoneId)}
                    data-toggle='tooltip'
                    data-placement='bottom'
                    title={milestone.milestoneName}>
                    {/* {milestone['endDate']} */}
                    <span className='text-blue'>{milestone.milestoneName}</span>
                  </a>
                  {/* {milestone.milestoneName && milestone.milestoneName.length > 50
                      ? (<a onClick={() => openModalMilestoneDetail(milestone.milestoneId)}
                        data-toggle='tooltip'
                        data-placement='bottom'
                        title={milestone.milestoneName}>
                        {milestone['endDate']}
                        <span className='text-blue'>{truncateString(milestone.milestoneName)}</span>
                      </a>)
                      : (<a onClick={() => openModalMilestoneDetail(milestone.milestoneId)}>
                        {milestone['endDate']}
                        <span className='text-blue'>{milestone.milestoneName}</span>
                      </a>)
                    } */}
                </div>
              })
            }
          </div>
        </div>
        <div className='list-item'>
          <div className='img'><img className='style3' title='' src='../../../content/images/calendar/ic-link.svg'
            alt='' /></div>
          <div>
            <div className='title'>{translate('calendars.modal.file')}</div>
            <div className='name-long mt-2 mb-2'>
              {
                isArray(props.schedule['files']) &&
                props.schedule['files'].map((file, idx) => {
                  return <div key={'file_' + idx}>
                    <a title='' href={file.fileUrl} download target="blank" className='text-blue'>{file.fileName}</a>
                  </div>
                })
              }
            </div>
            <div className='item d-flex'>
              <span className='date'>{translate('calendars.modal.fileCreatedAt')} :</span>
              {CalenderViewMonthCommon.localToTimezoneOfConfig(props.schedule['createdDate']).toDate().toLocaleDateString()}
            </div>
            <div className='item d-flex'>
              <span className='date'>{translate('calendars.modal.fileCreatedBy')} :</span>
              <a className="text-ellipsis width-120-px" title='' onClick={() => onOpenModalEmployeeDetail(props.schedule['createdUser'])}>{props.schedule['createdUserSurName']} {props.schedule['createdUserName']}</a>
            </div>
            <div className='item d-flex'>
              <span className='date'>{translate('calendars.modal.fileLastUpdatedAt')} :</span>
              {CalenderViewMonthCommon.localToTimezoneOfConfig(props.schedule['updatedDate']).toDate().toLocaleDateString()}
            </div>
            <div className='item d-flex'>
              <span className='date'>{translate('calendars.modal.fileLastUpdatedBy')} :</span>
              <a className="text-ellipsis width-120-px" title='' onClick={() => onOpenModalEmployeeDetail(props.schedule['updatedUser'])}>{props.schedule['updatedUserSurName']} {props.schedule['updatedUserName']}</a>
            </div>
          </div>
        </div>
      </div>
      {openPopupEmployeeDetail &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }} />
      }
      {showModalTaskDetail &&
        <DetailTaskModal taskId={taskId}
          toggleCloseModalTaskDetail={closeModalTaskDetail} />}

      {showModalMilestoneDetail &&
        <DetailMilestoneModal
          toggleCloseModalMilesDetail={closeModalMilestoneDetail}
          milesActionType={MILES_ACTION_TYPES.UPDATE}
          milestoneId={milestoneId} />}

      {showCustomerDetail &&
        <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          showModal={true}
          customerId={customerId}
          listCustomerId={[]}
          toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
          openFromOtherServices={true}
          displayActivitiesTab={displayActivitiesTab} />}

      {openPopupBusinessCardDetail &&
        <BusinessCardDetail
          key={businessCardId}
          showModal={true}
          businessCardId={businessCardId}
          listBusinessCardId={[]}
          toggleClosePopupBusinessCardDetail={onClosePopupBusinessCardDetail}
          businessCardList={[]} />}
    </div>
  );
}


const mapStateToProps = ({ dataModalSchedule, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  schedule: dataModalSchedule.dataSchedule,
  // service: dataModalSchedule.service,
  account: authentication.account,
  listLicense: authentication.account.licenses
});

const mapDispatchToProps = {
  changeScreenMode
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalInformation);
