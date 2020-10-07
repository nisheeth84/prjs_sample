import React, { useState, CSSProperties, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import { translate } from 'react-jhipster';

import moment from 'moment'

import { DataOfDay, DataHeader, DataOfSchedule, DataOfResource, CalenderViewMonthCommon } from '../common'
import { HIGHT_OF_SCHEDULE, TabForcus, HIGHT_OF_TH_HEADER, HIGHT_OF_DIV_DATE_IN_MONTH_VIEW, ID_FIELD_INFO, getJsonBName } from '../../constants';
import { CalendarView } from '../../constants'
import { onChangeDateShow, showDayGrid } from '../calendar-grid.reducer'
import ItemSchedule from '../item/item-schedule';
import ItemResource from '../item/item-resource';
import ShowViewAllInTD from './show-view-all-in-td'
import PopupListCreate from "../../common/popup-list-create";
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from "app/modules/tasks/constants";
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";

type ITdGridMonth = StateProps & DispatchProps & {
    modeView: boolean,
    dataOfDay: DataOfDay,
    key: number,
    listDayOfWeek?: DataOfDay[],
    indexOfDay?: number,
    maxShowSchedule: number,
    widthOfTd: number
}

const TdGridMonth = (props: ITdGridMonth) => {

    const tdInHourRef = useRef(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
    const [openTipHoliday, setOpenTipHoliday] = useState(false);
    const [positionListMore, setPositionListMore] = useState(0);
    const [position, setPosition] = useState({
        left: 0,
        top: 0
    })
    const [positionV2, setPositionV2] = useState({
        left: 0,
        top: 0
    })

    const minHeight = props.optionAll ? null : (HIGHT_OF_TH_HEADER + HIGHT_OF_SCHEDULE);
    const height = props.maxShowSchedule ? (props.maxShowSchedule * HIGHT_OF_SCHEDULE) : (HIGHT_OF_SCHEDULE);
    const styleTd: CSSProperties = {
        minHeight,
        height: HIGHT_OF_TH_HEADER + height - 0.5,
        width: props.widthOfTd
    }
    const getPositonV2 = (e) => {
        setPositionV2({
            left: e.clientX,
            top: e.clientY
        })
    }
    const getListData = (): DataOfSchedule[] | DataOfResource[] => {
        let listData: DataOfSchedule[] | DataOfResource[] = [];
        if (props.localNavigation.tabFocus === TabForcus.Schedule && props.dataOfDay.listSchedule) {
            listData = props.dataOfDay.listSchedule;
        } else if (props.dataOfDay.listResource) {
            listData = props.dataOfDay.listResource;
        }
        return listData;
    }

    const getFlagShowMore = (listData: DataOfSchedule[] | DataOfResource[]) => {
        if (listData.length === 0) return false;
        return listData[listData.length - 1].sort >= props.maxShowSchedule;
    }

    const showDetailInTypeShowDay = (date: Date) => {
        if (!props.modeView) {
            props.showDayGrid(true);
            props.onChangeDateShow(moment(date), 0, CalendarView.Day)
        }
    }

    const checkExceptionViewMore = () => {
        /**
         * If the last element is isOverDay = true
         * And listData.length == maxShowSchedule
         * And listDayOfWeek[indexOfDay + n To n].length > maxShowSchedule
         *
         * Then show more 1
         */
        const listData: DataOfSchedule[] | DataOfResource[] = getListData();

        if (listData.length === 0) return false;
        const lastSchedule = listData[listData.length - 1];
        if (lastSchedule.sort !== props.maxShowSchedule - 1) return false;
        if (!lastSchedule.isOverDay) return false;
        if (!props.listDayOfWeek || props.listDayOfWeek.length === 0) return false;
        const diffDay = CalenderViewMonthCommon.getDaysDiff(lastSchedule.finishDateSortMoment, lastSchedule.startDateSortMoment);

        for (let i = props.indexOfDay + 1; (i < props.indexOfDay + diffDay + 1) && i < props.listDayOfWeek.length; i++) {
            if (props.localNavigation.tabFocus === TabForcus.Schedule) {
                if (getFlagShowMore(props.listDayOfWeek[i].listSchedule)) return true;
            } else {
                if (getFlagShowMore(props.listDayOfWeek[i].listResource)) return true;
            }
        }
        return false;
    }

    const renderHeader = (data: DataHeader) => {
        const isHoliday = (d: DataHeader) => {
            return d.isHoliday || d.isCompanyHoliday || d.isNationalHoliday;
        }
        // Get information from header
        let classDate = "date";
        let classDateCurrent = '';
        if (CalenderViewMonthCommon.compareDateByDay(props.dataOfDay.dataHeader.dateMoment, CalenderViewMonthCommon.nowDate()) === 0) {
            classDateCurrent = "current-date";
        }
        if (props.dataOfDay.dataHeader.dateMoment.month() !== props.dateShow.month()) {
            classDate += ' date-prev';
        }
        if (props.optionHoliday && isHoliday(data) || data.isWeekend || data.isNationalHoliday) {
            classDateCurrent += ' color-red'
        }

        return (
            <div className={classDate} >
                {((props.optionHoliday && isHoliday(data)) || data.nationalHolidayName) && (
                <span 
                onMouseLeave={() => {setOpenTipHoliday(false)}}
                onMouseOver={ (e) => {setOpenTipHoliday(true); getPositonV2(e)}}
                className="note-left color-red text-ellipsis position-absolute w40 top-0-px fontHoliday" >
                     {props.optionHoliday && getJsonBName(data.companyHolidayName || data.holidayName) ? getJsonBName(data.companyHolidayName || data.holidayName) : data.nationalHolidayName }
                </span>)}
                <span
                    className={classDateCurrent + ' cursor-pointer'}
                    onClick={() => showDetailInTypeShowDay(data.dateMoment.toDate())}>{data.dateMoment.format('D')}</span>

                {props.optionLunarDay && (<span className="note perpetual">{data.perpetualCalendar}</span>)}
                
                {props.optionHoliday && isHoliday(data) && data.nationalHolidayName && openTipHoliday &&
                <div className={`tip-holiday ${positionV2.left > 1650 && "moveLeft"}`}>
                    <p>{getJsonBName(data.companyHolidayName || data.holidayName)}</p>
                    <p>{data.nationalHolidayName}</p>
                </div>}
            </div>
        )
    }

    const getMoreNumber = () => {
        const listData: DataOfSchedule[] | DataOfResource[] = getListData();
        if (checkExceptionViewMore()) return 1;
        let count = 0;
        for (let i = 0; i < listData.length; i++) {
            if (listData[i].sort >= props.maxShowSchedule - 1) count++;
        }

        return count;
    }

    const maxSort = getFlagShowMore(getListData()) || checkExceptionViewMore() ? props.maxShowSchedule - 1 : props.maxShowSchedule;
    const renderSchedule = (s: DataOfSchedule, index: any) => {
        if (!props.optionAll || (props.optionAll && s.sort < maxSort)) {
            return (
                <ItemSchedule
                    key={index + '_' + s.uniqueId}
                    dataOfSchedule={s}
                    optionAll={props.optionAll}
                    localNavigation={props.localNavigation}

                    formatNormalStart={'HH:mm'}
                    formatOverDayStart={'HH:mm'}

                    widthOfTd={props.widthOfTd}
                    heightOfDivDate={HIGHT_OF_DIV_DATE_IN_MONTH_VIEW}
                    modeView={props.modeView}
                />
            )
        }
    }

    const renderResource = (r: DataOfResource, index: any) => {
        // const maxSort = getFlagShowMore(getListData()) || checkExceptionViewMore() ? props.maxShowSchedule - 1 : props.maxShowSchedule;
        if (!props.optionAll || (props.optionAll && r.sort < maxSort)) {
            return (
                <ItemResource
                    key={index + '_' + r.uniqueId}
                    dataOfResource={r}
                    optionAll={props.optionAll}
                    isShowStart={true}
                    isShowEnd={false}
                    formatStart={'HH:mm'}
                    formatEnd={''}

                    widthOfTd={props.widthOfTd}
                    heightOfDivDate={HIGHT_OF_DIV_DATE_IN_MONTH_VIEW}
                    modeView={props.modeView}
                />
            )
        }
    }

    const renderMoreSchedule = () => {
        if (!props.optionAll) return;
        const isExceptionViewMore = checkExceptionViewMore();
        if (props.optionAll && (getFlagShowMore(getListData()) || isExceptionViewMore) && props.maxShowSchedule > 0) {
            let moreLang = { numMore: getMoreNumber() };
            if (isExceptionViewMore) {
                moreLang = { numMore: 1 };
            }
            return (
                <div className="more render-more-schedule"
                onClick={(e) => setPositionListMore(e.clientY)}>
                    <a onClick={() => { setShowDetail(!showDetail) }} className="more">
                        {translate('calendars.commons.more', moreLang)}
                    </a>
                </div>
            )
        }
    }

    /**
     * close popup list create and show popup create
     */
    const closePopupCreateList = (type: ID_FIELD_INFO) => {
        setShowPopupListCreate(false);

        if (ID_FIELD_INFO.TASK === type) {
            setDataModalTask({
                ...dataModalTask,
                showModal: true
            });
        }
        if (ID_FIELD_INFO.MILESTONE === type) {
            setOpenModalCreateMilestone(true);
        }
    }

    const getPositon = (e) => {
      if(e.target.clientHeight + e.clientY > e.screenY){
        setPosition({
            left: e.clientX,
            top: e.clientY - 150
        })
      } else {
        setPosition({
            left: e.clientX,
            top: e.clientY
        })
    }
    }
    /**
     *  render popup
     */
    const renderPopupCreateList = () => {
        const headerDate = props.dataOfDay.dataHeader.dateMoment;
        // get nowtime
        const newDate = CalenderViewMonthCommon.nowDate();
        // get set date = date click
        newDate.year(headerDate.year())
        newDate.month(headerDate.month())
        newDate.date(headerDate.date())

        return showPopupListCreate && !props.modeView && <PopupListCreate onClosePopup={closePopupCreateList} dateOnClick={newDate} position={position} />
    }

    /**
     * event create milestone popup close
     * @param code
     */
    const onModalCreateMilestoneClose = (code) => {
        document.body.className = 'wrap-calendar'
        setOpenModalCreateMilestone(false)
    }

    /**
     * close modal create task
     * @param actionStatus
     */
    const onCloseModalTask = (actionStatus) => {
        document.body.className = 'wrap-calendar'
        setDataModalTask({
            ...dataModalTask,
            showModal: false
        });
    }

    useEffect(() => {
        /**
         * if clicked on inside of element
         */
        function handleClickInside(event) {
            if (tdInHourRef.current && tdInHourRef.current === event.target) {
                setShowPopupListCreate(true);
            }
        }

        // Bind the event listener
        document.addEventListener("click", handleClickInside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickInside);
        };
    }, [tdInHourRef]);
    
    return (
        <td key={'td' + props.key} ref={tdInHourRef} style={styleTd} onClick={(e) => getPositon(e)}>
            {renderHeader(props.dataOfDay.dataHeader)}
            {showDetail && props.optionAll && (
                <ShowViewAllInTD dataOfDay={props.dataOfDay}
                    closeDetail={() => setShowDetail(false)}
                    showLunarText={props.optionLunarDay}
                    onClickToHeader={showDetailInTypeShowDay}
                    localNavigation={props.localNavigation}
                    positionListMore={positionListMore}
                    modeView={props.modeView}
                />
            )}
            {props.localNavigation && props.localNavigation.tabFocus === TabForcus.Schedule ? (
                props.dataOfDay.listSchedule && props.dataOfDay.listSchedule.map((s, index) => {
                    return (
                        renderSchedule(s, index)
                    )
                })
            )
                :
                (
                    props.dataOfDay.listResource && props.dataOfDay.listResource.map((r, index) => {
                        return (
                            renderResource(r, index)
                        )
                    })
                )}
            {renderMoreSchedule()}
            {renderPopupCreateList()}
            {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
                toggleCloseModalTask={onCloseModalTask}
                iconFunction="ic-task-brown.svg"
                {...dataModalTask}
                canBack={false} />}
            {openModalCreateMilestone &&
                <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
                    toggleCloseModalMiles={onModalCreateMilestoneClose} />}
        </td>
    );
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    optionAll: dataCalendarGrid.optionAll,
    optionLunarDay: dataCalendarGrid.optionLunarDay,
    optionHoliday: dataCalendarGrid.optionHoliday,
    localNavigation: dataCalendarGrid.localNavigation,
    dateShow: dataCalendarGrid.dateShow,
    refreshDataFlag: dataCalendarGrid.refreshDataFlag,
});

const mapDispatchToProps = {
    onChangeDateShow,
    showDayGrid
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TdGridMonth);
