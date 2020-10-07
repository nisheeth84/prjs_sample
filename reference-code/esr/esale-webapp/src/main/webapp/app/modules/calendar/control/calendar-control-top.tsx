import React, { useEffect, useState } from 'react'
import { translate } from 'react-jhipster'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import _ from 'lodash';
import {
  showWeekGrid, showMonthGrid, showDayGrid, showListGrid, optionShowAll, optionShowHoliday,
  optionShowLunarDay, onChangeDateShow, updateDataTypeViewOfCalendar,
  handleReloadSearchDataOfListView,
  onChangeKeySearchListSchedules,
  handleResetSearchConditions,
  handleReloadData, setShowPopupSearchDetail
} from '../grid/calendar-grid.reducer'
import BeautyPullDown from '../control/beaty-pull-down'
import { CalendarView } from '../constants'
import moment from 'moment'
import { DataOfDetailWeek, CalenderViewMonthCommon } from '../grid/common'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AUTHORITIES, FIELD_BELONG } from 'app/config/constants'
import PopupFieldsSearchMulti from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search-multi';
import { ScheduleModalAction } from "app/modules/calendar/modal/calendar-modal.reducer";
import BoxMessage, { MessageType } from "app/shared/layout/common/box-message";
import PopupMenuSet from '../../setting/menu-setting';
import { handleSearchConditions } from "../grid/calendar-grid.reducer";
import { getInfoEmployeeCurrent, onChangeDateOnCick, onShowPopupCreate, resetDataForm } from '../popups/create-edit-schedule.reducer';

const convertDataTypeView = (data: any) => {
  return {
    type: '00',
    value: 1,
    fieldItems: data && data.itemList ? data.itemList : []
  }
}


interface IPropTopControl extends DispatchProps, StateProps {
  toggleOpenHelpPopup,
  toggleOpenCreateSchedulePopup: () => void
}

const CalendarControlTop = (props: IPropTopControl) => {
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [listData, setListData] = useState({});
  const [textDateHeader, setTextDateHeader] = useState(null);
  // const [keySearch, setKeySearch] = useState("");
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [localKeySearch, setLocalKeySearch] = useState('')
  /**
    * handle action open popup setting
    */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }

  useEffect(() => {
    const data = convertDataTypeView(props.listTypeViewOfCalendar);
    setListData(data)
    return;
  }, [props.listTypeViewOfCalendar, props.optionAll, props.optionLunarDay, props.optionHoliday])

  useEffect(() => {
    props.getInfoEmployeeCurrent();
  }, []);
  // useEffect(() => {
  //   keySearch
  // }, [keySearch])

  useEffect(() => {
    if (props.currentLocale) 
      props.handleReloadData()
  }, [props.currentLocale])

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
  const changeTime = (action) => {

    let amount = 1;
    if (action === "prev") {
      amount = -amount;
    }
    if (!action) {
      props.onChangeDateShow(CalenderViewMonthCommon.nowDate(), 0, props.typeShowGrid);
    } else {
      props.onChangeDateShow(props.dateShow, amount, props.typeShowGrid);
    }
  }


  const onChangeViewTypeData = (typeView, obj) => {
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
        props.showMonthGrid();
        break;
      case CalendarView.Week:
        props.showWeekGrid();
        break;
      case CalendarView.Day:
        props.showDayGrid();
        break;
      case CalendarView.List:
        props.showListGrid();
        break;
      default:
        props.showMonthGrid();
        break;
    }
  }

  const onChangeOptionViewData = (option, obj) => {
    switch (obj.itemId) {
      case CalendarView.OptionShowAll:
        props.optionShowAll(option.target.checked);
        break;
      case CalendarView.OptionShowLunarDay:
        props.optionShowLunarDay(option.target.checked);
        break;
      case CalendarView.OptionShowHoliday:
        props.optionShowHoliday(option.target.checked);
        break;
      default:
        break;
    }
    props.updateDataTypeViewOfCalendar(obj.itemId, option.target.checked ? "1" : "0", obj.updatedDate)
  }
  const onSearch = (obj) => {
    if (obj.charCode === 13) {
      props.onChangeKeySearchListSchedules(obj.target.value)
      props.handleReloadSearchDataOfListView(obj.target.value)
    }
  }

  useEffect(() => {
    showTime(props.dateShow.toDate(), props.dataOfDetailWeek)
  }, [props.dateShow, props.typeShowGrid, props.refreshDataFlag])

  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [showDescriptionSettingSearch, setShowDescriptionSettingSearch] = useState(false);
  useEffect(() => {
    if (props.showPopupSearchDetail !== conDisplaySearchDetail) {
      setConDisplaySearchDetail(props.showPopupSearchDetail)
    }
  }, [props.showPopupSearchDetail])


  // const handleClosePopupSearch = (scheduleSearchConditions, taskSearchConditions, milestoneSearchConditions) => {
  //   setConDisplaySearchDetail(false);
  // }

  // const handleSetConDisplaySearchDetail = (flag: boolean) => {
  //   setConDisplaySearchDetail(flag);
  //   setShowDescriptionSettingSearch(!flag);
  // }
  const handleSearchPopup = (condition) => {
    setConditionSearch(condition);
    const scheduleConditionSearchData = [];
    const taskConditionSearchData = [];
    const milestoneConditionSearchData = [];

    condition.map(val => {
      if(val.isSearchBlank || val.fieldValue){
      const isNotData = (_.isNil(val.fieldValue) || val.fieldValue.length === 0) && !val.isSearchBlank;
      if (!isNotData) {
        let jsonVal = val.fieldValue;
        let value;
          if (
            jsonVal && 
            jsonVal.length > 0 &&
            jsonVal[0] &&
            (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
              Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
          ) {
            jsonVal = jsonVal[0];
          value = JSON.stringify(jsonVal);
        } else {
          value = val.fieldValue ? val.fieldValue.toString() : null;
        }
        if (val.isSearchBlank) {
          value = '';
        }
        const data = {
          fieldId: val.fieldId,
          fieldName: val.fieldName,
          fieldType: val.fieldType,
          fieldValue: value,
          isDefault: val.isDefault?.toString(),
          searchType: val.searchType ? val.searchType : "1",
          searchOption: val.searchOption ? val.searchOption : '',
        };
        switch (val.fieldBelong) {
          case FIELD_BELONG.SCHEDULE:
  
            scheduleConditionSearchData.push(data);
            break;
          case FIELD_BELONG.TASK:
            taskConditionSearchData.push(data);
            break;
          case FIELD_BELONG.MILE_STONE:
            milestoneConditionSearchData.push(data);
            break;
          default:
            break;
        }
      }
      }
    })

    props.handleSearchConditions(
      {
        searchScheduleCondition: scheduleConditionSearchData,
        searchTaskCondition: taskConditionSearchData,
        searchMilestoneCondition: milestoneConditionSearchData,
        conditionsOri: condition
      },
      !!scheduleConditionSearchData.length,
      !!taskConditionSearchData.length,
      !!milestoneConditionSearchData.length
    );

    setConDisplaySearchDetail(false);
    setShowDescriptionSettingSearch(true);
  }
  /**
   *  show Popup Search
   */
  const showModalAdvancedSearch = () => {
    if (conDisplaySearchDetail) {
      // return <PopupFieldsSearch
      //   conDisplaySearchDetail={conDisplaySearchDetail}
      //   setConDisplaySearchDetail={handleSetConDisplaySearchDetail}
      //   iconFunction="ic-sidebar-calendar.svg"
      //   onCloseFieldsSearch={handleClosePopupSearch}
      // />
      return (
        <PopupFieldsSearchMulti
          listFieldBelong={[{ fieldBelong: FIELD_BELONG.SCHEDULE, isMain: true }, { fieldBelong: FIELD_BELONG.TASK, isMain: false }, { fieldBelong: FIELD_BELONG.MILE_STONE, isMain: false }]}
          orderByFieldBelong={true}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={(condition) => {
            setConDisplaySearchDetail(false)
            props.setShowPopupSearchDetail(false)
          }}
          onActionSearch={handleSearchPopup} // TODO: 
        />
      )
    }
  }

  return (
    <div className="control-top">
      <div className="left">
        <div className="button-shadow-add-select-wrap">
          <button type="button"
            className={`button-shadow-v2`}
            onClick={() => { 
              props.resetDataForm();
              props.onChangeDateOnCick(CalenderViewMonthCommon.nowDate()); 
              props.onShowPopupCreate(true)
            }}
          >{translate('calendars.controls.top.labels.register')}</button>
        </div>
        <a title="" className="button-primary button-today" onClick={() => changeTime(null)}>{translate('calendars.controls.top.labels.now')}</a>
        <div className="button-next-prev-wrap">
          <a title="" className="prev" onClick={() => changeTime("prev")} />
          <a title="" className="next" onClick={() => changeTime("next")} />
        </div>
        <span className="text-date test">{textDateHeader}</span>
      </div>
      <div className="right">
        {(
          (props.actionDetailType === ScheduleModalAction.Error || props.errorDetailMessage)
          && props.actionDetailType !== ScheduleModalAction.Request
        )
          && <BoxMessage messageType={MessageType.Error}
            message={props.errorDetailMessage} />
        }
        <BeautyPullDown value={props.typeShowGrid} data={listData} onChangeViewGrid={onChangeViewTypeData} onChangeOptionData={onChangeOptionViewData} />
        {/* Comment out icon map */}
        {/* {(props.typeShowGrid === CalendarView.Day) && (<a title="" className="icon-primary icon-map ml-2"></a>)} */}
        <div className="search-box-button-style">
          <button className="icon-search" onClick={() => {
            props.onChangeKeySearchListSchedules(localKeySearch)
            props.handleReloadSearchDataOfListView(localKeySearch)
          }}>
            <i className="far fa-search" />
          </button>
          <input type="text" placeholder={translate('calendars.controls.top.labels.placeholderTextSearch')} onChange={(obj) => { setLocalKeySearch(obj.target.value) }} onKeyPress={(e) => { onSearch(e) }} />
          <button className="icon-fil" onClick={() => {
            setConDisplaySearchDetail(true);
            // setShowDescriptionSettingSearch(false);
          }} />
          {showDescriptionSettingSearch &&
            <div className="tag">
              {translate('employees.top.place-holder.searching')}
              <button className="close" onClick={() => {
                setShowDescriptionSettingSearch(false);
                props.handleResetSearchConditions();
              }}>×</button>
            </div>
          }
        </div>
        <a onClick={props.toggleOpenHelpPopup} title="" className="icon-small-primary icon-help-small" />
        <a className={`icon-small-primary icon-setting-small ${isAdmin ? "" : "disable"} `} onClick={() => {isAdmin && handleOpenPopupSetting()}} />
        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}
      </div>
      {showModalAdvancedSearch()}
    </div>
  );
}

const mapStateToProps = ({ dataCalendarGrid, authentication, dataModalSchedule, locale }: IRootState) => ({
  listTypeViewOfCalendar: dataCalendarGrid.listTypeViewOfCalendar,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  dateShow: dataCalendarGrid.dateShow,
  optionAll: dataCalendarGrid.optionAll,
  optionLunarDay: dataCalendarGrid.optionLunarDay,
  optionHoliday: dataCalendarGrid.optionHoliday,
  dataOfDetailWeek: dataCalendarGrid.dataOfDetailWeek,
  refreshDataFlag: dataCalendarGrid.refreshDataFlag,
  showPopupSearchDetail: dataCalendarGrid.showPopupSearchDetail,
  authorities: authentication.account.authorities,
  actionDetailType: dataModalSchedule.action,
  errorDetailMessage: dataModalSchedule.errorMessage,
  currentLocale: locale.currentLocale
});

const mapDispatchToProps = {
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
  handleSearchConditions,
  getInfoEmployeeCurrent,
  onChangeDateOnCick,
  onShowPopupCreate,
  handleResetSearchConditions,
  handleReloadData,
  resetDataForm,
  setShowPopupSearchDetail
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarControlTop);
