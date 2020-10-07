import React from 'react';
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import BodyGridWeek from './body-grid-week'

export interface ICalendarWeekProps extends StateProps, DispatchProps {
  modeView?: boolean,
  classNameOfWeek?: string
}

const CalendarWeek = (props: ICalendarWeekProps) => {

  return (
    <div className={`esr-content-body style-3 ${props.classNameOfWeek}`}>
      <div className="esr-content-body-main">
        <div className="table-calendar-schedule-wrap">
          <BodyGridWeek 
            modeView={props.modeView}/>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarWeek);