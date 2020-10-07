import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  showWeekGrid, showMonthGrid, showDayGrid, showListGrid, optionShowAll, optionShowHoliday,
  optionShowLunarDay, onChangeDateShow, updateDataTypeViewOfCalendar,
  handleReloadSearchDataOfListView,
  onChangeKeySearchListSchedules,
  getViewCalendar,
  onChangeLocalNavigation
} from 'app/modules/calendar/grid/calendar-grid.reducer';
import {
  TabForcus, CalendarView, VIEW_TYPE_CALENDAR
} from 'app/modules/calendar/constants';
import BeautyPullDown from '../../../calendar/control/beaty-pull-down'
import GridCalendar from 'app/modules/calendar/grid/calendar-grid';
import moment from 'moment';
import { translate } from 'react-jhipster';
import { CalenderViewMonthCommon, DataOfDetailWeek } from 'app/modules/calendar/grid/common';

export interface ITabCalendar extends DispatchProps, StateProps {
  businessCardId?: number,
  businessCardDetailBy?: object
  customerIds?: number[],
  hasLoginUser?: boolean,
  calendarView?,
  updateCalendarView?,
}

const convertDataTypeView = (data: any) => {
  return {
    type: '00',
    value: 1,
    fieldItems: data && data.itemList ? data.itemList.filter(e => e.itemType === VIEW_TYPE_CALENDAR.OptionSelect && e.itemId !== 13) : []
  }
}

const TabCalendar = (props: ITabCalendar) => {
  const [calendarView, setCalendarView] = useState('month');
  const [textDateHeader, setTextDateHeader] = useState(null);
  const [listData, setListData] = useState({});

  const showTime = (date: moment.Moment | Date, dataOfDetailWeek: DataOfDetailWeek) => {
    const dateMoment = moment(date);
    switch (props.typeShowGrid) {
      case CalendarView.Month: {
        const dataFormat = {
          year: dateMoment.year(),
          month: dateMoment.month() + 1,
        };
        const text = translate('calendars.controls.top.formatDateHeaderOfList.month', dataFormat);
        setTextDateHeader(text);
        break;
      }
      case CalendarView.Week: {
        let text = '';
        if (dataOfDetailWeek.startDate) {
          const fromMomentWeek = moment(dataOfDetailWeek.startDate).clone();
          const toDateMomentWeek = moment(dataOfDetailWeek.endDate).clone();
          const dataFormat = {
            fromYear: fromMomentWeek.year(),
            fromMonth: fromMomentWeek.month() + 1,
            fromDay: fromMomentWeek.date(),
            toMonth: toDateMomentWeek.month() + 1,
            toDay: toDateMomentWeek.date(),
          };
          text = translate('calendars.controls.top.formatDateHeaderOfList.week', dataFormat);
        }
        setTextDateHeader(text);
        break;
      }
      case CalendarView.Day: {
        const dataFormat = {
          year: dateMoment.year(),
          month: dateMoment.month() + 1,
        };
        const text = translate('calendars.controls.top.formatDateHeaderOfList.day', dataFormat);
        setTextDateHeader(text);
        break;
      }
      case CalendarView.List: {
        const dataFormat = {
          year: dateMoment.year(),
          month: dateMoment.month() + 1,
        };
        const text = translate('calendars.controls.top.formatDateHeaderOfList.list', dataFormat);
        setTextDateHeader(text);
        break;
      }
      default:
    }
  }

  useEffect(() => {
    showTime(props.dateShow.toDate(), props.dataOfDetailWeek)
  }, [props.dateShow, props.typeShowGrid, props.refreshDataFlag])

  useEffect(() => {
    if (props.customerIds || (props.hasLoginUser !== null && props.hasLoginUser !== undefined)) {
      const localNavigation = {}
      localNavigation['searchConditions'] = {
        searchStatic: {
          task: false,
          milestone: false
        },
        searchDynamic: {
          customerIds: props.customerIds,
          businessCardIds: [props.businessCardId],
        }
      }
      localNavigation['tabFocus'] = TabForcus.Schedule
      localNavigation['loginFlag'] = props.hasLoginUser
      localNavigation['limitLoadDataInListView'] = 40
      props.optionShowAll(true);
      props.showMonthGrid(true);
      props.onChangeDateShow(
        CalenderViewMonthCommon.nowDate(),
        0,
        CalendarView.Month,
        true
      );

      props.onChangeLocalNavigation(localNavigation, true);
    }
  }, [props.customerIds, props.hasLoginUser]);

  const onChangeDropDown = (typeView, obj) => {

    if (props.typeShowGrid !== typeView) {
      props.listTypeViewOfCalendar['itemList'].forEach(e => {
        if (e.itemId === props.typeShowGrid) {
          props.updateDataTypeViewOfCalendar(props.typeShowGrid, "0", e.updatedDate)
        }
      });
      props.updateDataTypeViewOfCalendar(typeView, "1", obj.updatedDate)
    }

    switch (typeView) {
      case CalendarView.Month:
        setCalendarView('month');
        props.showMonthGrid();
        props.updateCalendarView('month');
        break;
      case CalendarView.Week:
        setCalendarView('week');
        props.showWeekGrid();
        props.updateCalendarView('week');
        break;
      case CalendarView.List:
        setCalendarView('list');
        props.showListGrid();
        props.updateCalendarView('list');
        break;
      default:
        props.showWeekGrid();
        break;
    }
  }

  useEffect(() => {
    const data = convertDataTypeView(props.listTypeViewOfCalendar);
    setListData(data);
    return;
  }, [props.listTypeViewOfCalendar])

  useEffect(() => {
    props.getViewCalendar();

    if (props.calendarView && props.calendarView !== calendarView) {
      // onChangeDropDown({ target: { value: props.calendarView } });
    }
  }, [])

  const changeTime = (action) => {

    let amount = 1;
    if (action === "prev") {
      amount = -amount;
    }
    if (!action) {
      props.onChangeDateShow(moment(new Date), 0, props.typeShowGrid);
    } else {
      props.onChangeDateShow(props.dateShow, amount, props.typeShowGrid);
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-pane active">
        <div className="list-table style-3 right pr-2 height-auto">
          <div className="calendar-business-card control-top z-index-4">
            <div className="left">
              <a className="button-primary button-today" onClick={e => changeTime(null)}>{translate('businesscards.calendarTab.now')}</a>
              <div className="button-next-prev-wrap">
                <a className="prev" onClick={e => changeTime("prev")} /><a className="next" onClick={e => changeTime("next")} />
              </div>
            </div>
            <div className="text-date ">{textDateHeader}</div>

            <div className="right">
              <BeautyPullDown value={props.typeShowGrid} data={listData} onChangeViewGrid={onChangeDropDown} fromOtherServices={true} />
            </div>
          </div>
          <GridCalendar
            modeView={true}
            classNameOfWeek="businesscard-calendar-week"
            classNameOfMonth="businesscard-calendar-month"
            classNameOfList="businesscard-calendar-list"
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ dataCalendarGrid, authentication, dataModalSchedule }: IRootState) => ({
  listTypeViewOfCalendar: dataCalendarGrid.listTypeViewOfCalendar,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  dateShow: dataCalendarGrid.dateShow,
  optionAll: dataCalendarGrid.optionAll,
  optionLunarDay: dataCalendarGrid.optionLunarDay,
  optionHoliday: dataCalendarGrid.optionHoliday,
  dataOfDetailWeek: dataCalendarGrid.dataOfDetailWeek,
  refreshDataFlag: dataCalendarGrid.refreshDataFlag,
  authorities: authentication.account.authorities,
  actionDetailType: dataModalSchedule.action,
  errorDetailMessage: dataModalSchedule.errorMessage,
});

const mapDispatchToProps = {
  getViewCalendar,
  showWeekGrid,
  showMonthGrid,
  showDayGrid,
  showListGrid,
  optionShowAll,
  optionShowHoliday,
  optionShowLunarDay,
  onChangeDateShow,
  updateDataTypeViewOfCalendar,
  handleReloadSearchDataOfListView,
  onChangeKeySearchListSchedules,
  onChangeLocalNavigation
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabCalendar);