import React, {useState} from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers'
import { TabForcus, CalendarView, HIGHT_OF_SCHEDULE_IN_LIST_VIEW, getJsonBName } from '../../constants';
import ItemScheduleInList from '../item/item-schedule-in-list';
import ItemResourceInList from '../item/item-resource-in-list';
import { DataOfSchedule, DataOfResource, DataOfDay, CalenderViewMonthCommon, DataHeader } from '../common';
import moment from 'moment';
import { onChangeDateShow, showListGrid, showDayGrid, handleReloadDataNextOfListView } from '../calendar-grid.reducer'
import { DrapDropInList } from '../grid-drap-drop/grid-drap-drop-in-list';


export interface ITdCalendarListProps extends StateProps, DispatchProps {
  modeView: boolean,
  d: DataOfDay, indexTr: number
}

const TdCalendarList = (props: ITdCalendarListProps) => {
  const nowDate = CalenderViewMonthCommon.nowDate();
  const [openTipHoliday, setOpenTipHoliday] = useState("");

  const listData: DataOfSchedule[] | DataOfResource[] = props.localNavigation.tabFocus === TabForcus.Schedule ? props?.d?.listSchedule : props?.d?.listResource;
  const heightOfSchedule = HIGHT_OF_SCHEDULE_IN_LIST_VIEW;
  let numOfSchedule = 0;
  if (listData) {
    listData.forEach((x: DataOfSchedule | DataOfResource) => {
      if (x.isShow) numOfSchedule++;
    })
  }
  const heightOfTd = numOfSchedule ? numOfSchedule * heightOfSchedule : heightOfSchedule;

  const gotoDate = (date: moment.Moment) => {
    if (!props.modeView) {
      props.showDayGrid(true);
      props.onChangeDateShow(date, 0, CalendarView.Day);
    }
  }

  const isHoliday = (d: DataHeader) => {
    return d.isHoliday || d.isCompanyHoliday || d.isNationalHoliday;
  }

  const rendTdLine = (d: DataOfDay) => {
    const classNameWeekend = d.dataHeader.isWeekend ? 'color-red' : '';
    const classNameHoliday = (props.optionHoliday && isHoliday(d.dataHeader) || d.dataHeader.nationalHolidayName ) ? 'color-red' : '';
    const dateNameLang = "calendars.commons.dayOfWeek." + d.dataHeader.dateMoment.day();
    const dateNameMonth = "calendars.commons.typeView.label.month";
    const classCurrentDate = CalenderViewMonthCommon.compareDateByDay(nowDate, d.dataHeader.dateMoment) === 0 ? "current-date" : '';
    
    return (
      <>
        <td className={classNameHoliday + ' td-style-list'} onClick={() => gotoDate(d.dataHeader.dateMoment)}>
          <div className={classCurrentDate + ' ' + classNameHoliday + classNameWeekend}><span>{d.dataHeader.dateMoment.format('D')}</span></div>
        </td>
        <td className="width-100-px">
          <div className="font-size-12">{d.dataHeader.dateMoment.format('M')}{translate(dateNameMonth)},<span className={classNameWeekend + ' ' + classNameHoliday}>{translate(dateNameLang)}</span></div>
          <div className="color-999 perpetual"
          onMouseLeave={() => {setOpenTipHoliday("")}}
          onMouseOver={ () => {setOpenTipHoliday(d.dataHeader.nationalHolidayName)}}
          >
            {((props.optionHoliday && isHoliday(d.dataHeader)) || d.dataHeader.nationalHolidayName ) && (
            <span className={classNameHoliday}>
              {
                props.optionHoliday && getJsonBName(d.dataHeader.companyHolidayName || d.dataHeader.holidayName) 
                ? getJsonBName(d.dataHeader.companyHolidayName || d.dataHeader.holidayName) 
                : d.dataHeader.nationalHolidayName
              }
            </span>)}
            {props.optionLunarDay && (<span>
              {props.optionHoliday && isHoliday(d.dataHeader) && props.optionLunarDay && d.dataHeader?.perpetualCalendar && (',')}
              {getJsonBName(d.dataHeader.perpetualCalendar)}</span>
            )}
          </div>
          {(d.dataHeader.companyHolidayName || d.dataHeader.holidayName) && openTipHoliday === d.dataHeader.nationalHolidayName && d.dataHeader.nationalHolidayName &&
            <div className="tip-holiday top-8">
              <span className="d-block">{getJsonBName(d.dataHeader.companyHolidayName || d.dataHeader.holidayName)}</span>
              <span className="d-block">{d.dataHeader.nationalHolidayName}</span>
          </div>
          }
        </td>
      </>
    )
  }

  const renderCurrentLine = (d: DataOfDay) => {
    if (CalenderViewMonthCommon.compareDateByDay(nowDate, d.dataHeader.dateMoment) === 0) {
      let sortIndex = null;
      listData?.forEach((x: DataOfSchedule | DataOfResource, index: number) => {
        if (CalenderViewMonthCommon.compareDateByHour(nowDate, x.startDateMoment) > 0) sortIndex = index;
      })
      let yPos = HIGHT_OF_SCHEDULE_IN_LIST_VIEW * sortIndex;
      if (sortIndex !== null) {
        yPos += HIGHT_OF_SCHEDULE_IN_LIST_VIEW
      }
      return (<div
        className="calendar-line position-absolute"
        style={{
          top: yPos
        }}
      ></div>)
    }
  }

  const renderTr = (d: DataOfDay, indexTr: number) => {

    return (
      <>
        {rendTdLine(d)}
        <td className="position-relative vertical-align-top"
            style={{ height: heightOfTd }} ref={c => { DrapDropInList.addRef(c, d.dataHeader.dateMoment); }}>
          {renderCurrentLine(d)}
          {props.localNavigation.tabFocus === TabForcus.Schedule ? (
            <>
              {d.listSchedule.map((s: DataOfSchedule, index: number) => {
                return (
                  <ItemScheduleInList
                    key={'schedule_' + indexTr + '_' + index}
                    dataOfSchedule={s}
                    localNavigation={props.localNavigation}
                    heightOfSchedule={heightOfSchedule}
                    heightOfTd={heightOfTd}
                    sortIndex={index}
                    modeView={props.modeView}
                  />
                )
              })}
            </>
          ) : (
              <>
                {d.listResource.map((r: DataOfResource, index: number) => {
                  return (
                    <ItemResourceInList
                      key={'resource_' + indexTr + '_' + index}
                      dataOfResource={r}

                      heightOfSchedule={heightOfSchedule}
                      heightOfTd={heightOfTd}
                      sortIndex={index}
                      modeView={props.modeView}
                    />
                  )
                })}
              </>
            )}
        </td>
      </>
    )
  }

  return (
    renderTr(props.d, props.indexTr)
  )
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
  localNavigation: dataCalendarGrid.localNavigation,
  refreshDataFlag: dataCalendarGrid.refreshDataFlag,
  optionHoliday: dataCalendarGrid.optionHoliday,
  optionLunarDay: dataCalendarGrid.optionLunarDay,
});
const mapDispatchToProps = {
  showListGrid,
  showDayGrid,
  onChangeDateShow,
  handleReloadDataNextOfListView
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TdCalendarList);
