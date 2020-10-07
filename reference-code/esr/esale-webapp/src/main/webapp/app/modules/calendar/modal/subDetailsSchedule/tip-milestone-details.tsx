import React from 'react';
import { connect } from "react-redux";
import {
  hideModalSubDetail,
  showModalDelete,
  setItemId
} from "app/modules/calendar/modal/calendar-modal.reducer";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import { setPreScheduleData } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import moment from "moment";
import { ItemTypeSchedule } from "app/modules/calendar/constants";

/**
 * interface of tip milestone
 */
type ICalendarTipMilestoneProps = StateProps & DispatchProps & {
  service?: {
    businessCards?: boolean,
    activities?: boolean,
    customer?: boolean,
    customerSales?: boolean,
  }
}

/**
 * convert Date to format YYY-MM-DD
 * @param date
 */
const setDate = (date) => {
  if (date) {
    date = moment.utc(date).format('YYYY-MM-DD').split('-');
    return (
      <div>{
        date[0]}{translate('calendars.commons.typeView.label.year')}
        {date[1]}{translate('calendars.commons.typeView.label.month')}
        {date[2]}{translate('calendars.commons.typeView.label.day')}
        {/* ({moment.utc(date).format('ddd')}) */}
        </div>
    )
  }
}

/**
 * component tip milestone
 * @param props
 * @constructor
 */
const TipMilestone = (props: ICalendarTipMilestoneProps) => {
  return (
    <>
      {
        props.dataMilestone &&
        (<div className="list-item-popup">
          <div className="list-item mb-4">
            <div className="img"><img className="icon-flag" title="" src="../../../content/images/task/ic-flag-brown.svg" alt="" /></div>
            <div>
              <div><a title="">{props.dataMilestone['milestoneName']}</a></div>
              {setDate(props.dataMilestone['endDate'])}
              <div>{props.dataMilestone['memo']}</div>
            </div>
          </div>
          <div className="list-item">
            <div className="img"><img title="" src="../../../content/images/task/ic-task.svg" alt="" /></div>
            <div>
              <div>{translate('calendars.modal.tasks')}</div>{props.dataMilestone['listTask'] && props.dataMilestone['listTask'].map((task, taskIdx) => {
                return (
                  <div className="item" key={'task-' + taskIdx}><span className="date text">{task && moment(task.finishDate).format("YYYY/MM/DD")}</span>
                    <a title=""><span className="text-blue" onClick={() => props.setItemId(task.taskId, ItemTypeSchedule.Task)}>{task && task.taskName}</span></a></div>
                )
              })}
            </div>
          </div>
        </div>)
      }
    </>
  )
}

const mapStateToProps = ({ dataModalSchedule }: IRootState) => ({
  service: dataModalSchedule.service,
  dataMilestone: dataModalSchedule.dataMilestone,
});

const mapDispatchToProps = {
  hideModalSubDetail,
  showModalDelete,
  setPreScheduleData,
  setItemId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TipMilestone);
