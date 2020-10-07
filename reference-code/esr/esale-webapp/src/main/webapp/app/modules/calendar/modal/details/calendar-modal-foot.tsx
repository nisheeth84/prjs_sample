import React, { useEffect, useState } from 'react';
import {translate} from 'react-jhipster';
import {connect} from 'react-redux';

import {IRootState} from "app/shared/reducers";
import {AttendanceDivisionType} from '../../constants';
import {updateScheduleStatus} from '../calendar-modal.reducer';
import { resetShowMessage } from '../../popups/create-edit-schedule.reducer'
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

/**
 * interface component foot
 */
type ICalendarModalFootProps = StateProps & DispatchProps & {
  isShowComponentRight?: boolean
}



/**
 * component foot
 * @param props
 * @constructor
 */
const CalendarModalFoot = (props: ICalendarModalFootProps) => {
  const [hadShare, setHadShare] =  useState(false)

  useEffect(() => {
    if(props.schedule['attendanceDivision'] && props.schedule['attendanceDivision']==="1" || props.schedule['attendanceDivision']==="2"){
      setHadShare(false)
    }
    if(props.schedule['sharers'] && props.schedule['sharers']['employees'] && props.schedule['sharers']['employees'].length > 0){
      for(let i = 0; i < props.schedule['sharers']['employees'].length; i ++) {
        if(props.schedule['employeeLoginId'] && props.schedule['employeeLoginId'] === props.schedule['sharers']['employees'][i]['employeeId']){
          setHadShare(true)
          break
        }
      }
    }
  },[props.schedule])
  const [showMessage, setShowMessage] = useState(false);
  const [messageNotify, setMessageNotify] = useState('')

  useEffect(() => {
    if (props.successMessage && props.successMessage.length > 0){
      setShowMessage(true);
      setMessageNotify(props.successMessage)
    }   
  }, [props.successMessage])

  const displayMessage = () => {
    if (!messageNotify || messageNotify.length <= 0) {
      return <></>;
    }
    if(showMessage){
      setTimeout(() => {
        setShowMessage(false)
        props.resetShowMessage()
      }, 3000)
    }
    return showMessage && (
      <div className="box-message-in-calendar">
        <BoxMessage
          className="max-width-720 m-auto"
          messageType={MessageType.Success}
          message={messageNotify}
        />
      </div>
    )
  }

  return (
  <div className={`user-popup-form-bottom popup-calendar-bottom ${!props.isShowComponentRight && 'w-100'}`}>
      {displayMessage()}
      <div className="popup-esr2-footer">
        <a title=""
             className={
               props.schedule['isParticipant'] && props.schedule['attendanceDivision']==="1"
               ? "button-primary button-simple-edit ml-2 mr-2 active"
               : "button-primary button-simple-edit ml-2 mr-2"}
             onClick={() =>
              props.schedule['attendanceDivision']!=="1"
               ? props.updateScheduleStatus(props.schedule['scheduleId'], AttendanceDivisionType.Available, props.schedule['updatedDate'])
               : null
             }>
          <i className="far fa-check"/>
          <span className="pl-4">
            {translate('calendars.modal.attendance')}
          </span>
        </a>
        <a title=""
           className={
             props.schedule['isParticipant'] && props.schedule['attendanceDivision']==="2"
             ? "button-primary button-simple-edit ml-2 mr-2 active"
             : "button-primary button-simple-edit ml-2 mr-2"}
           onClick={() =>
             props.schedule['attendanceDivision']!=="2"
             ? props.updateScheduleStatus(props.schedule['scheduleId'], AttendanceDivisionType.Absent, props.schedule['updatedDate'])
             : null
           }>
          <i className="far fa-times"/>
          <span className="pl-4">{translate('calendars.modal.absenteeism')}</span>
        </a>
        <a title=""
             className={
              hadShare
              ? "button-primary button-simple-edit ml-2 mr-2 active"
              : "button-primary button-simple-edit ml-2 mr-2"}
             onClick={() => 
              !hadShare
              ? props.updateScheduleStatus(props.schedule['scheduleId'], AttendanceDivisionType.Share, props.schedule['updatedDate']) 
              : null
            }>
          <i className="fas fa-share-alt"/>
          <span className="pl-4">{translate('calendars.modal.share')}</span>
        </a>
      </div>
      
    </div>
  );
}

const mapStateToProps = ({dataModalSchedule, dataCreateEditSchedule}: IRootState) => ({
  schedule: dataModalSchedule.dataSchedule,
  successMessage: dataCreateEditSchedule.showSuccessMessage
})

const mapDispatchToProps = {
  updateScheduleStatus,
  resetShowMessage,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalFoot);


