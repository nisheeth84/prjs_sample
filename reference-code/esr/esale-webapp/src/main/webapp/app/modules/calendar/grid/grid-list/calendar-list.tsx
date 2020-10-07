import React, { useRef, useState } from 'react';
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers'
import { TabForcus, HIGHT_OF_SCHEDULE_IN_LIST_VIEW, PADDING_OF_SCHEDULE_IN_LIST_VIEW } from '../../constants';
import { DataOfDay, DataOfList, DataOfSchedule, DataOfResource } from '../common';
import moment from 'moment';
import { onChangeDateShow, showListGrid, showDayGrid, handleReloadDataNextOfListView, setShowPopupSearchDetail } from '../calendar-grid.reducer'
// import { DndProvider } from 'react-dnd'
// import { useDrop } from 'react-dnd'
// import Backend from 'react-dnd-html5-backend'
import TdCalendarList from './td-calendar-list'
// import DragLayerList from './drag-layer-list';
import ShowSearchCondition from "app/modules/calendar/search-advanced/show-search-condition";
// import PopupFieldsSearchMulti from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search-multi';
// import PopupFieldsSearch from "app/modules/calendar/search-advanced/pupup-fields-search";
import { DrapDropInList } from '../grid-drap-drop/grid-drap-drop-in-list';
// import { FIELD_BELONG } from 'app/config/constants';
// import { FIELD_BELONG } from '../../search-advanced/popup-fields-search.reducer';


export interface ICalendarListProps extends StateProps, DispatchProps {
  modeView?: boolean,
  classNameOfList?: string
}

const CalendarList = (props: ICalendarListProps) => {
  const [numDayNextSchedule, setNumDayNextSchedule] = useState(1);
  const [numDayNextResource, setNumDayNextResource] = useState(1);
  const [showSearchCondition, setShowSearchCondition] = useState(false)
  // const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);

  // reset 
  DrapDropInList.reset();


  let listDay: DataOfDay[] = [];
  let toDate: moment.Moment = null;

  let dataObject: DataOfList = null;
  let tabSchedule = true;
  if (props.localNavigation && props.localNavigation.tabFocus === TabForcus.Resource) {
    tabSchedule = false;
  }

  if (props.dataOfList && props.localNavigation) {

    dataObject = tabSchedule ? props.dataOfList.dataSchedule : props.dataOfList.dataResource;

    listDay = tabSchedule ? props.dataOfList.dataSchedule.listDay : props.dataOfList.dataResource.listDay;
    toDate = tabSchedule ? props.dataOfList.dataSchedule.dateToData : props.dataOfList.dataResource.dateToData;
  }

  const onclickLoadNextData = () => {
    if (tabSchedule) {
      toDate = props.dateShow.clone().add(numDayNextSchedule * 365, 'day');
      setNumDayNextSchedule(numDayNextSchedule + 1);
    } else {
      toDate = props.dateShow.clone().add(numDayNextResource * 365, 'day');
      setNumDayNextResource(numDayNextResource + 1);
    }
    props.handleReloadDataNextOfListView(null, null, toDate);
  }


  const toDateFormat = {
    year: toDate && toDate.year(),
    month: toDate && (toDate.month() + 1),
    day: toDate && toDate.date()
  }


  const rootRef = useRef();

  const getHeightOfTd = (d: DataOfDay) => {

    const listData: DataOfSchedule[] | DataOfResource[] = props.localNavigation.tabFocus === TabForcus.Schedule ? d?.listSchedule : d?.listResource;
    const heightOfSchedule = HIGHT_OF_SCHEDULE_IN_LIST_VIEW;
    let numOfSchedule = 0;
    if (listData) {
      listData.forEach((x: DataOfSchedule | DataOfResource) => {
        if (x.isShow) numOfSchedule++;
      })
    }
    return PADDING_OF_SCHEDULE_IN_LIST_VIEW * 2 + (numOfSchedule ? numOfSchedule * heightOfSchedule : heightOfSchedule);
  }

  const isShowSearchCondition = () : boolean => {
    return props.searchConditions && (props.searchConditions?.searchScheduleCondition || 
      props.searchConditions?.searchTaskCondition || 
      props.searchConditions?.searchMilestoneCondition);
  }

  return (
    <div onClick={() => showSearchCondition && setShowSearchCondition(false)} className={`esr-content-body style-3 ${props.classNameOfList}`}>
      <div className="esr-content-body-main">
        {!props.modeView && isShowSearchCondition() && <div className="pagination-top show-function-calender">
          <div className="button-activity-registration-wrap form-group">
            <a title="" className="button-primary button-activity-registration active mr-3"
              onClick={() => setShowSearchCondition(!showSearchCondition)}>{translate("calendars.grid.list.AdvancedSearchConditions")}</a>
            {showSearchCondition &&
              <ShowSearchCondition 
                openModalSearch={() => {
                  props.setShowPopupSearchDetail(true)
                }} 
                onMouseLeave={setShowSearchCondition} 
              />}
          </div>
        </div>}
        <div className="table-list-wrap style-3 table-list-display" ref={rootRef}>
          <table className="table-list schedule-list-drag w100">
            <tbody>
              {props.dataOfList && listDay && listDay.map((d, indexTr) => {
                return (
                  <tr key={'tr_' + indexTr} style={{ height: getHeightOfTd(d) }}>
                    <TdCalendarList
                      d={d}
                      indexTr={indexTr}
                      modeView={props.modeView}
                    />
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* {props.dataOfList && listDay && listDay.length === 0 && (
            < div className="box-center-bottom-text">
              {translate("calendars.grid.list.noDataLabel")}
            </div>
          )} */}
          {props.dataOfList && dataObject && dataObject.isGetMoreData && (
            <div className="text-center mt-4 font-size-12">
              <span>
                {translate("calendars.grid.list.toDataLabel", toDateFormat)}
                <a className="text-blue" onClick={() => onclickLoadNextData()}>{translate("calendars.grid.list.moreDataLabel")}</a>
              </span>
            </div>
          )}
        </div>
      </div>
      {/* {conDisplaySearchDetail && 
        <PopupFieldsSearchMulti
          listFieldBelong={[{fieldBelong: FIELD_BELONG.SCHEDULE, isMain: true}, {fieldBelong: FIELD_BELONG.TASK, isMain: false}, {fieldBelong: FIELD_BELONG.MILE_STONE, isMain: false}]}
          onCloseFieldsSearch={(condition) => setConDisplaySearchDetail(false)}
          onActionSearch={(condition) => {}} // TODO: 
        />
      } */}
    </div >
  )
}


const mapStateToProps = ({ dataCalendarGrid, dataCalendarSearch }: IRootState) => ({
  dataOfList: dataCalendarGrid.dataOfList,
  localNavigation: dataCalendarGrid.localNavigation,
  dateShow: dataCalendarGrid.dateShow,
  refreshDataFlag: dataCalendarGrid.refreshDataFlag,
  optionHoliday: dataCalendarGrid.optionHoliday,
  optionLunarDay: dataCalendarGrid.optionLunarDay,

  searchConditions: dataCalendarGrid.searchConditions
});
const mapDispatchToProps = {
  showListGrid,
  showDayGrid,
  onChangeDateShow,
  handleReloadDataNextOfListView,
  setShowPopupSearchDetail
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarList);
