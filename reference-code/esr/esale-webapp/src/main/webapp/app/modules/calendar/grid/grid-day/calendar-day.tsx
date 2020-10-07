import React, { useEffect, useState, useRef, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import BodyGridDay from './body-grid-day'

export interface ICalendarDayProps extends StateProps, DispatchProps {
  modeView?: boolean,
  classNameOfDay?: string
}

const CalendarDay = (props: ICalendarDayProps) => {
  return (
    <div className={`esr-content-body style-3 ${props.classNameOfDay}`} >
      <div className="esr-content-body-main">
        <div className="table-calendar-schedule-wrap">
          <BodyGridDay 
            modeView={props.modeView}/>
        </div>
      </div>
    </div>
  )
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
  dataOfDetailDay: dataCalendarGrid.dataOfDetailDay,
});
const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarDay);

