import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';

import {
  ACTION_TYPE,
  showModalConfirmDelete,
  hideModalDetail,
  showModalDelete,
  deleteSchedule
} from '../calendar-modal.reducer';
import {
  onShowPopupCreate,
  onSetScheduleIdForEdit
} from '../../popups/create-edit-schedule.reducer'

import { CalendarView, ItemTypeSchedule, MODAL_CALENDAR, LICENSE_IN_CALENDAR } from '../../constants';
import { IRootState } from 'app/shared/reducers';
import { setPreScheduleData } from '../../popups/create-edit-schedule.reducer';

/**
 * interface of modal top
 */
type ICalendarModalTopProps = StateProps & DispatchProps & {
  nextSchedule?: (scheduleId, type, isActivate) => {},
  prevSchedule?: (scheduleId, type, isActivate) => {}
}

/**
 * component modal top
 * @param props
 * @constructor
 */
const CalendarModalTop = (props: ICalendarModalTopProps) => {
  /**
   * next schedule item
   */
  const [nextScheduleItem, setNextScheduleItem] = useState({})
  /**
   * prev schedule item
   */
  const [prevScheduleItem, setPrevScheduleItem] = useState({})
  /**
   * data clone of schedule data
   */
  const [dataClone, setDataClone] = useState(props.schedule);
  const [showModalActivity, setShowModalActivity] = useState(false);

  /**
   * get next and prev schedule item
   */
  useEffect(() => {
    const next = props.nextSchedule && props.nextSchedule(props.schedule['scheduleId'], ItemTypeSchedule.Schedule, false);
    const prev = props.prevSchedule && props.prevSchedule(props.schedule['scheduleId'], ItemTypeSchedule.Schedule, false);
    setNextScheduleItem(next);
    setPrevScheduleItem(prev);
  }, [props.scheduleId])

  const onClickOpenModalFormActivity = () => {
    if (!showModalActivity) {
      setShowModalActivity(true);
    }
  }

  const onClosePopupActivityDetail = () => {
    setShowModalActivity(false)
    document.body.className = 'wrap-calendar';
  }

  /**
   * set data clone
   */
  useEffect(() => {
    if (!dataClone['scheduleType']) {
      const clone = {
        ...dataClone,
        scheduleType: {
          scheduleTypeId: 1
        },
      };
      setDataClone(clone);
    }
  }, [])

  return (
    <div className='popup-tool'>
      <div>
        {Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.ACTIVITY_LICENSE) &&
          <span className='icon-tool'>
            <img
              title=''
              src='../../../content/images/common/ic-bag.svg'
              alt=''
              onClick={() => onClickOpenModalFormActivity()}
            />
          </span>
        }
      </div>
      <div>
        <a title=''
          className='icon-small-primary icon-copy-small' 
          onClick={() => { props.onShowPopupCreate(true); setTimeout(() => props.setPreScheduleData(dataClone), 1000) }} />
        {props.schedule['canModify'] === MODAL_CALENDAR.CAN_MODIFY &&
          <>
            <a title=''
              // href={`/calendar/grid/schedule/${props.scheduleId}`}
              className='icon-small-primary icon-edit-small' 
              onClick={() => { props.onShowPopupCreate(true); props.onSetScheduleIdForEdit(props.scheduleId) }}
            />
            <a title=''
              className='icon-small-primary icon-erase-small'
              onClick={() => {
                props.schedule['isRepeated'] ? props.showModalDelete() : props.showModalConfirmDelete();
              }}
            />
          </>
        }
        {props.prevSchedule && <a title=''
          className={
            props.currentScreen === CalendarView.List
              && prevScheduleItem
              && prevScheduleItem['itemId']
              && !props.newWindowPopup
              ? 'icon-small-primary icon-prev'
              : 'icon-small-primary icon-prev disable'}
          onClick={() => {
            if (
              props.currentScreen === CalendarView.List
              && prevScheduleItem
              && prevScheduleItem['itemId']
              && props.hideModalDetail
              && props.prevSchedule
              && !props.newWindowPopup
            ) {
              props.hideModalDetail();
              props.prevSchedule(props.schedule['scheduleId'], prevScheduleItem['itemType'], true);
            }
          }}
        />}
        {props.nextSchedule && <a title=''
          className={
            props.currentScreen === CalendarView.List
              && nextScheduleItem
              && nextScheduleItem['itemId']
              && !props.newWindowPopup
              ? 'icon-small-primary icon-next'
              : 'icon-small-primary icon-next disable'}
          onClick={() => {
            if (
              props.currentScreen === CalendarView.List
              && nextScheduleItem
              && nextScheduleItem['itemId']
              && props.hideModalDetail
              && props.nextSchedule
              && !props.newWindowPopup
            ) {
              props.hideModalDetail();
              props.nextSchedule(props.schedule['scheduleId'], nextScheduleItem['itemType'], true);
            }
          }}
        />}
      </div>
      {showModalActivity &&
        <ActivityModalForm popout={false}
          activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
          activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
          scheduleId={props.scheduleId}
          onCloseModalActivity={onClosePopupActivityDetail}
          isOpenFromAnotherModule={true}
        />
      }
    </div>
  );
}

const mapStateToProps = ({ dataModalSchedule, dataCalendarGrid, authentication }: IRootState) => ({
  schedule: dataModalSchedule.dataSchedule,
  service: dataModalSchedule.service,
  currentScreen: dataCalendarGrid.typeShowGrid,
  scheduleId: dataModalSchedule.scheduleId,
  newWindowPopup: dataModalSchedule.newWindowPopup,
  listLicense: authentication.account.licenses
});

const mapDispatchToProps = {
  showModalConfirmDelete,
  setPreScheduleData,
  hideModalDetail,
  showModalDelete,
  deleteSchedule,
  onShowPopupCreate,
  onSetScheduleIdForEdit
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarModalTop);
