import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  showWeekGrid, showMonthGrid, showDayGrid, showListGrid, optionShowAll, optionShowHoliday,
  optionShowLunarDay, onChangeDateShow, updateDataTypeViewOfCalendar,
  handleReloadSearchDataOfListView,
  onChangeKeySearchListSchedules,
  handleInitData,
  onChangeLocalNavigation
} from 'app/modules/calendar/grid/calendar-grid.reducer';
import GridCalendar from 'app/modules/calendar/grid/calendar-grid';
import moment from 'moment';
import {
  ConditionRange,
  ConditionScope
} from 'app/shared/layout/popup-detail-service-tabs/constants';
import {
  CalendarView,
  LocalNavigation,
  TabForcus
} from 'app/modules/calendar/constants';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { CalenderViewMonthCommon, DataOfDetailWeek } from 'app/modules/calendar/grid/common';

export interface ITabCalendar extends DispatchProps, StateProps {
  customerId: any;
  customerChild?: any[];
  searchScope?: number;
  searchRange?: number;
  calendarModeGrid?: any;
  handleChangeModeViewGrid?: (calendarModeGridParam) => void;
}

const CustomersTabCalendar = (props: ITabCalendar) => {
  const [textDateHeader, setTextDateHeader] = useState(null);
  const [calendarModeGrid, setCalendarModeGrid] = useState(CalendarView.Month);
  const localNavigationTmp: LocalNavigation = {
    searchConditions: {
      searchStatic: {
        task: false,
        milestone: false
      },
      searchDynamic: {
        customerIds: [props.customerId]
      }
    },
    tabFocus: TabForcus.Schedule,
    loginFlag: false,
    limitLoadDataInListView: 40
  }
  const [localNavigation, setLocalNavigation] = useState(null);

  useEffect(() => {
    let customerIds = [props.customerId];
    let loginFlag = false;
    if (props.searchRange === ConditionRange.ThisAndChildren) {
      let customerChild = [];
      if (props.customerChild) {
        customerChild = props.customerChild.map(e => Number.isInteger(e) ? e : e.customerId);
      }
      customerIds = [props.customerId].concat(customerChild);
    }
    if (props.searchScope === ConditionScope.PersonInCharge) {
      loginFlag = true;
    }

    localNavigationTmp.searchConditions.searchDynamic.customerIds = customerIds;
    localNavigationTmp.loginFlag = loginFlag;
    setLocalNavigation(localNavigationTmp);
  }, [props.searchScope, props.searchRange]);

  useEffect(() => {
    props.optionShowAll(false);
    switch (props.calendarModeGrid) {
      case CalendarView.Week:
        setCalendarModeGrid(CalendarView.Week);
        props.showWeekGrid(true);
        break;
      case CalendarView.List:
        setCalendarModeGrid(CalendarView.List);
        props.showListGrid(true);
        break;
      default:
        setCalendarModeGrid(CalendarView.Month);
        props.showMonthGrid(true);
        break;
    }
    props.onChangeDateShow(
      CalenderViewMonthCommon.nowDate(),
      0,
      CalendarView.Month,
      true
    );
  }, []);

  useEffect(() => {
    if (localNavigation != null) {
      props.onChangeLocalNavigation(localNavigation, true);
    }
  }, [localNavigation]);

  const onChangeDropDown = (event) => {
    const { value } = event.target;
    const valueInt = Number.parseInt(value, 10);

    switch (valueInt) {
      case CalendarView.Week:
        setCalendarModeGrid(CalendarView.Week);
        props.handleChangeModeViewGrid
          && props.handleChangeModeViewGrid(CalendarView.Week);
        props.showWeekGrid();
        break;
      case CalendarView.Month:
        setCalendarModeGrid(CalendarView.Month);
        props.handleChangeModeViewGrid
          && props.handleChangeModeViewGrid(CalendarView.Month);
        props.showMonthGrid();
        break;
      case CalendarView.List:
        setCalendarModeGrid(CalendarView.List);
        props.handleChangeModeViewGrid
          && props.handleChangeModeViewGrid(CalendarView.List);
        props.showListGrid();
        break;
      default:
        break;
    }
  }

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
    showTime(props.dateShow.toDate(), props.dataOfDetailWeek);
  }, [props.dateShow, props.typeShowGrid, props.refreshDataFlag]);

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
        <div className="list-table style-3 right pr-2 wrap-calendar">
          <div className="control-top min-height-auto">
            <div className="left">
              <a className="button-primary button-today" onClick={e => changeTime(null)}>{translate('calendars.controls.top.labels.now')}</a>
              <div className="button-next-prev-wrap">
                <a className="prev" onClick={e => changeTime("prev")} /><a className="next" onClick={e => changeTime("next")} />
              </div>
            </div>
            <div className="text-date test center">
              {textDateHeader}
            </div>
            <div className="right">
              <div className="esr-pagination">
                <div className="select-option">
                  <select value={calendarModeGrid} onChange={onChangeDropDown} className="height-auto">
                    <option value={CalendarView.Month}>{translate('customers.detail.label.tab.calendarMonth')}</option>
                    <option value={CalendarView.Week}>{translate('customers.detail.label.tab.calendarWeek')}</option>
                    <option value={CalendarView.List}>{translate('customers.detail.label.tab.calendarList')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <GridCalendar classNameOfMonth="h-auto" modeView={true} />
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
  localNavigation: dataCalendarGrid.localNavigation,
});

const mapDispatchToProps = {
  handleInitData,
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
  onChangeLocalNavigation,
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersTabCalendar);
