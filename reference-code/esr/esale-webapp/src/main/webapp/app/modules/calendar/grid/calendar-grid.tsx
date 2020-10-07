import React, { forwardRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import CalendarDay from './grid-day/calendar-day'
import CalendarWeek from './grid-week/calendar-week'
import CalendarMonth from './grid-month/calendar-month'
import { CalendarView } from '../constants';
import CalendarList from './grid-list/calendar-list';

export interface ICalendarProps  extends StateProps, DispatchProps {
  modeView?: boolean,
  classNameOfMonth?: string,
  classNameOfWeek?: string,
  classNameOfDay?: string,
  classNameOfList?: string,
}

const GridCalendar: React.FC<ICalendarProps> = forwardRef((props, ref) => {

  const renderCalendarMonth = () => {
    return (
      <CalendarMonth
        {...props}
      />
    );
  }

  const renderCalendarWeek = () => {
    return (
      <CalendarWeek
        {...props}
      />
    );
  }

  const renderCalendarDay = () => {
    return (
      <CalendarDay
        {...props}
      />
    );
  }

  const renderCalendarList = () => {
    return (
      <CalendarList
        {...props}
      />
    );
  }

  const renderComponent = () => {
    if (props.typeShowGrid === CalendarView.Day) {
      return renderCalendarDay();
    } else if (props.typeShowGrid === CalendarView.Week) {
      return renderCalendarWeek();
    } else if (props.typeShowGrid === CalendarView.Month) {
      return renderCalendarMonth()
    } else if (props.typeShowGrid === CalendarView.List) {
      return renderCalendarList()
    }
    return (
      <>
      </>
    );
  }

  return (
    <>
      {renderComponent()}
    </>
  );
});

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
  typeShowGrid: dataCalendarGrid.typeShowGrid,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridCalendar);
