import './calendar.scss';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import _ from 'lodash';

import CalendarDay from './calendar-day'
import CalendarWeek from './calendar-week'
import CalendarMonth from './calendar-month'
import { CalendarView } from './constants';
import CalendarList from './calendar-list';

export interface ICalendarProps {
  view: CalendarView;
  events: any[] | any
  date?: Date;
  editable?: boolean;
  styleMonth?: {};
  styleWeek?: {};
  styleList?: {};
  styleDay?: {};
}

const Calendar: React.FC<ICalendarProps> = forwardRef((props, ref) => {

  useEffect(() => {
  }, []);

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
    if (props.view === CalendarView.Day) {
      return renderCalendarDay();
    } else if (props.view === CalendarView.Week) {
      return renderCalendarWeek();
    } else if (props.view === CalendarView.Month) {
      return renderCalendarMonth()
    } else if (props.view === CalendarView.List) {
      return renderCalendarList()
    }
  }

  return (
    <>
      {renderComponent()}
    </>
  );
});

Calendar.defaultProps = {
  styleMonth: {width: '100%', height: '400px'},
  styleWeek: {width: '100%', height: '400px'},
  styleDay: {width: '100%', height: '400px'},
  styleList: {width: '100%', height: '400px', overflow: 'auto'},
};

export default Calendar;
