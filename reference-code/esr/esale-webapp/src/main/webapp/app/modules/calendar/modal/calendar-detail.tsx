import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import CalendarModalHeader from './details/calendar-modal-header';
import CalendarModalFoot from './details/calendar-modal-foot';
import CalendarModalTop from './details/calendar-modal-top';
import CalendarModalLeft from './details/calendar-modal-left';
import CalendarModalRight from './details/calendar-modal-right';
import {IRootState} from "app/shared/reducers";
import {
  getScheduleById,
  hideModalDetail,
  setSchedulePopupNewWindow
} from '../modal/calendar-modal.reducer';
import {ItemTypeSchedule, LICENSE_IN_CALENDAR} from '../constants';
import {Storage} from 'react-jhipster';

/**
 * interface calendar detail
 */
type ICalendarDetailProps = StateProps & DispatchProps & {
  nextSchedule?: (scheduleId: number, type: ItemTypeSchedule, isActivate: boolean) => {},
  prevSchedule?: (scheduleId: number, type: ItemTypeSchedule, isActivate: boolean) => {},
  onClosed?: () => void,
  detailId?: number
}
/**
 * calendar detail
 * @param props
 * @constructor
 */
const CalendarDetail = (props: ICalendarDetailProps) => {
  /**
   * status show and hidden component right
   */
  const [isShowComponentRight, setShowComponentRight] = useState(true);

  /**
   * call api getSchedule
   */
  useEffect(function() {
    if (props.scheduleId || props.detailId) {
      props.getScheduleById(props.detailId || props.scheduleId);
    }
  }, [props.scheduleId, props.detailId]);

  /**
   * open or close component right (timeline)
   */
  const toggleComponentRight = () => {
    const flag = !isShowComponentRight;
    setShowComponentRight(flag);
  }

  /**
   * check employee current have join schedule
   * @param employeeId
   * @param participants
   */
  const checkEmployeeInParticipants = (employeeId, participants) => {
    if (participants && participants.employees) {
      const flag = participants.employees.filter(item => item.employeeId === employeeId).length;
      if (flag > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * check employee have the right to view schedule
   */
  const checkInvalid = () => {
    if (
        (Object.keys(props.dataSchedule).length !== 0 && props.dataSchedule['isPublic'])
        || (Object.keys(props.dataSchedule).length !== 0
            && checkEmployeeInParticipants(props.dataSchedule['employeeLoginId'], props.dataSchedule['participants']))
    ) {
      return true;
    }
    return false;
  }

  /**
   * render component if employee invalid
   */
  const render = () => {
    if (checkInvalid()) {
      return <div className='modal-body style-3'>
        <div className='popup-content popup-task-no-padding style-3'>
          <CalendarModalTop
            prevSchedule={props.prevSchedule}
            nextSchedule={props.nextSchedule}/>
          <div className='popup-content-task-wrap layout-date overflow-hidden'>
            <CalendarModalLeft isShowComponentRight={isShowComponentRight}/>
            {
              Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.TIMELINE_LICENSE) &&
              <CalendarModalRight scheduleId={props.scheduleId} isShowComponentRight={isShowComponentRight} onChange={toggleComponentRight}/> 
            }
          </div>
        </div>
        <CalendarModalFoot isShowComponentRight={isShowComponentRight}/>
      </div>
    }
  }

  /**
   * set storage
   */
  useEffect(() => {
    if (Storage.local.get('calendar/detailSchedule') && !Object.keys(props.dataSchedule).length) {
      document.body.className = 'wrap-calendar';
      props.setSchedulePopupNewWindow(Storage.local.get('calendar/detailSchedule'));
      setTimeout(() => {
        Storage.local.remove('calendar/detailSchedule');
      }, 1000);
    }
  }, [])

  return (
    <>
      <div className='CalendarDetail'>
        <div className='modal popup-esr popup-card user-popup-page popup-align-right show popup-task  popup-calendar-5'
             id='popup-esr'
             aria-hidden='true'>
          <div className={'modal-dialog form-popup'}>
            <div className='modal-content'>
              <CalendarModalHeader onClosed={props.onClosed}/>
              {render()}
            </div>
          </div>
        </div>
        <div className='modal-backdrop show'/>
      </div>
    </>
  );
}

const mapStateToProps = ({dataModalSchedule, authentication}: IRootState) => ({
  scheduleId: dataModalSchedule.scheduleId,
  dataSchedule: dataModalSchedule.dataSchedule,
  listLicense: authentication.account.licenses
});

const mapDispatchToProps = {
  getScheduleById,
  hideModalDetail,
  setSchedulePopupNewWindow
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarDetail);

