import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import {
  hideModalDelete,
  deleteSchedule,
  showModalConfirmDelete,
  FLAG_DELETE,
  setFlagDelete} from './calendar-modal.reducer';
import {IRootState} from 'app/shared/reducers';

/**
 * interface of modal delete
 */
type ICalendarModalDeleteProps = StateProps & DispatchProps

/**
 * component delete
 * @param props
 * @constructor
 */
const CalendarDelete = (props: ICalendarModalDeleteProps) => {

  return (
    <>
      <div className='CalendarDelete'>
        <div className='popup-esr2' id='popup-esr2'>
          <div className='popup-esr2-content'>
            <div className='popup-esr2-body'>
              <div className='popup-esr2-title'>{translate('calendars.modal.deleteScheduleTitle')}</div>
              <div className='wrap-check-radio'>
                <p className='radio-item'>
                  <input type='radio'
                         id='radio1'
                         name='radio1'
                         onClick={() => props.setFlagDelete(FLAG_DELETE.CURRENT)} defaultChecked={props.flagDelete === FLAG_DELETE.CURRENT}/>
                  <label htmlFor='radio1'>{translate('calendars.modal.deleteScheduleCurrent')}</label>
                </p>
                <p className='radio-item'>
                  <input type='radio'
                         id='radio'
                         name='radio1'
                         onClick={() => props.setFlagDelete(FLAG_DELETE.REPEAT)} defaultChecked={props.flagDelete === FLAG_DELETE.REPEAT}/>
                  <label htmlFor='radio'>{translate('calendars.modal.deleteScheduleCurrentAndRepeat')}</label>
                </p>
                <p className='radio-item'>
                  <input type='radio'
                         id='radio2'
                         name='radio1'
                         onClick={() => props.setFlagDelete(FLAG_DELETE.ALL)} defaultChecked={props.flagDelete === FLAG_DELETE.ALL}/>
                  <label htmlFor='radio2'>{translate('calendars.modal.deleteAllSchedule')}</label>
                </p>
              </div>
            </div>
            <div className='popup-esr2-footer'>
              <a title='' className='button-cancel' onClick={() => {
                props.hideModalDelete()
              }}>{translate('calendars.modal.cancel')}</a>
              <a title='' className='button-red' onClick={props.showModalConfirmDelete}>{translate('calendars.modal.delete')}</a>
            </div>
          </div>
        </div>
        <div className='modal-backdrop show'/>
      </div>
    </>
  );
}

const mapStateToProps = ({ dataModalSchedule }: IRootState) => ({
  scheduleId: dataModalSchedule.scheduleId,
  flagDelete: dataModalSchedule.flagDelete
});

const mapDispatchToProps = {
  hideModalDelete,
  deleteSchedule,
  showModalConfirmDelete,
  setFlagDelete
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarDelete);
