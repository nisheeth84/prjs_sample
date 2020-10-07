import React from 'react';
import { hideModalDetail } from '../calendar-modal.reducer';
import { connect } from "react-redux";
import { IRootState } from "app/shared/reducers";
import { CalendarView, CONVERT_DATE } from '../../constants';
import { Storage } from 'react-jhipster';

/**
 * interface component header
 */
type ICalendarModalHeaderProps = StateProps & DispatchProps & {
  onClosed?: () => void,
  openFromModal?: boolean,
}

/**
 * component header
 * @param props
 * @constructor
 */
const CalendarModalHeader = (props: ICalendarModalHeaderProps) => {
  /**
   * popout new window
   */
  const openNewWindow = () => {
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    Storage.local.set('calendar/detailSchedule', props.schedule);
    window.open(`${props.tenant}/detail-schedule/${props.schedule['scheduleId']}`, '', style.toString());
    props.hideModalDetail();
  }


  /**
   * check status button back
   * @param screen
   */
  const checkDisableButtonBack = (screen) => {
    if (
      screen === CalendarView.List
      || screen === CalendarView.Month
      || screen === CalendarView.Day
      || screen === CalendarView.Week
    ) {
      return true;
    }
    return false;
  }

  return (
    <div className='modal-header'>
      <div className='left'>
        <div className='popup-button-back'>
          <a title=''
            className={
              !props.openFromModal && (checkDisableButtonBack(props.currentScreen) || props.newWindowPopup)
                ? 'icon-small-primary icon-return-small disable'
                : 'icon-small-primary icon-return-small'}
            onClick={() => {
              if (!checkDisableButtonBack(props.currentScreen) && !props.newWindowPopup || props.openFromModal) {
                props.hideModalDetail();
              }
              if (props.onClosed) {
                props.onClosed();
              }
            }
            } /><span
              className='text'><img className='icon-popup-big w_21' title='' src='../../../content/images/icon-calendar.svg'
                alt='' />{props.schedule['scheduleName'] && props.schedule['scheduleName'].length > 60 ? props.schedule['scheduleName'].substring(0,60) + '...' : props.schedule['scheduleName']}</span><span className='pl-4'>{CONVERT_DATE(props.schedule['startDate'], props.schedule['finishDate'])}</span>
        </div>
      </div>

      <div className='right'>
        {
          !props.newWindowPopup && <>
            <a title='' className='icon-small-primary icon-share' onClick={() => navigator.clipboard.writeText(window.location.href)} />
            <a title='' className='icon-small-primary icon-link-small' onClick={openNewWindow} />
            <a title='' className='icon-small-primary icon-close-up-small line' onClick={() => {
              if (props.onClosed) {
                props.onClosed();
              } else {
                props.hideModalDetail()
              }
            }} />
          </>
        }
      </div>
    </div>
  );
}

const mapStateToProps = ({ dataModalSchedule, dataCalendarGrid, applicationProfile }: IRootState) => ({
  schedule: dataModalSchedule.dataSchedule,
  currentScreen: dataCalendarGrid.typeShowGrid,
  tenant: applicationProfile.tenant,
  newWindowPopup: dataModalSchedule.newWindowPopup
});

const mapDispatchToProps = {
  hideModalDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalHeader);
