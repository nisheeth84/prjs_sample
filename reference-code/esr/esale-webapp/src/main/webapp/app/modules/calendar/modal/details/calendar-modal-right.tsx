import React from 'react';
import {IRootState} from 'app/shared/reducers';
import {connect} from 'react-redux';
import {ACTION_TYPE} from '../calendar-modal.reducer';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import {TIMELINE_SERVICE_TYPES} from 'app/modules/timeline/common/constants';


/**
 * interface component modal right (timeline)
 */
type ICalenderModalRightProps = StateProps & {
  isShowComponentRight?: boolean,
  onChange?: () => void,
  scheduleId: number
}

/**
 * modal component right (timeline)
 * @param props
 * @constructor
 */
const CalendarModalRight = (props: ICalenderModalRightProps) => {
  /**
   * status of component
   */
  const isShow = props.isShowComponentRight;

  /**
   * handle show or close
   */
  const handleChange = () => {
    props.onChange();
  }
  return (
    <div className='popup-content-common-right background-col-F9 v2 wrap-timeline' style={!isShow ? {width: 'calc(100vw - 99vw)'} : null}>
      {props.service['timelines'] === ACTION_TYPE.ACTIVATE &&
        <>
          <div className='button'>
            <a title=''
               className={isShow ? 'icon-small-primary icon-next' : 'icon-small-primary icon-prev'}
               onClick={handleChange}/>
          </div>
          { isShow &&
             <TimelineCommonControl
             objectId={[props.scheduleId]}
             serviceType={TIMELINE_SERVICE_TYPES.SCHEDULE}
             hasLoginUser={false} />
          }
        </>
      }
    </div>
  );
}

const mapStateToProps = ({dataModalSchedule}: IRootState) => ({
  service: dataModalSchedule.service
});

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(CalendarModalRight);
