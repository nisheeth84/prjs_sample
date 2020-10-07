import React, { useState } from 'react';
import { connect } from 'react-redux';
import { translate } from "react-jhipster";
import { hideModalDelete, deleteSchedule } from './calendar-modal.reducer';
import {IRootState} from "app/shared/reducers";
import {CalendarView} from '../constants';

/**
 * interface of component update status
 */
type ICalendarModalUpdateProps = StateProps & DispatchProps &{
    callbackOnOk: (value) => void
    callbackOnCancel: () => void
    isResource?: boolean;
    hideModeMonth?: boolean
}

/**
 * component update Status
 * @param props
 * @constructor
 */
const CalendarUpdate = (props: ICalendarModalUpdateProps) => {
  const [flag, setFlag] = useState(0);

  return (
    <div className='CalendarUpdate z-index-global-100'>
      <div className='popup-esr2' id='popup-esr2'>
        <div className='popup-esr2-content'>
          <div className='popup-esr2-body'>
          <div className='popup-esr2-title'>{props.isResource ? translate('calendars.modal.dragDropScheduleResource') : translate('calendars.modal.dragDropSchedule')}</div>
            <div className='wrap-check-radio'>
              <p className='radio-item'>
                <input type='radio'
                       id='radio1'
                       name='radio1'
                       onClick={() => setFlag(0)} checked={flag === 0}/>
                <label className="fontSize-14" htmlFor='radio1'>{props.isResource ? translate('calendars.modal.updateScheduleResource') : translate('calendars.modal.updateScheduleCurrent')}</label>
              </p>
              <p className='radio-item'>
                <input type='radio'
                       id='radio2'
                       name='radio2'
                       onClick={() => setFlag(1)} checked={flag === 1}/>
                <label className="fontSize-14" htmlFor='radio2'>{props.isResource ? translate('calendars.modal.updateScheduleCurrentAndRepeatResource') : translate('calendars.modal.updateScheduleCurrentAndRepeat')}</label>
              </p>
            {(props.typeShowGrid !== CalendarView.Month && !props.hideModeMonth) && 
              <p className='radio-item'>
                  <input type='radio'
                        id='radio3'
                        name='radio3'
                        onClick={() => setFlag(2)} checked={flag === 2}/>
                  <label className="fontSize-14" htmlFor='radio3'>{props.isResource ? translate('calendars.modal.updateAllScheduleResource') : translate('calendars.modal.updateAllSchedule')}</label>
              </p>
            } 
            </div>
          </div>
          <div className='popup-esr2-footer'>
            <a title='' className='button-cancel fontSize-14' onClick={props.callbackOnCancel}>{translate('calendars.modal.cancel')}</a>
            <a title='' className='button-blue fontSize-14' onClick={() => props.callbackOnOk(flag)}>{translate('calendars.form.save')}</a>
          </div>
        </div>
      </div>
      <div className='modal-backdrop show'/>
    </div>
  );
}

const mapStateToProps = ({ dataModalSchedule, dataCalendarGrid }: IRootState) => ({
  scheduleId: dataModalSchedule.scheduleId,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
});

const mapDispatchToProps = {
  hideModalDelete,
  deleteSchedule
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarUpdate);
