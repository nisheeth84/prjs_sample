import React, { useEffect, useState, useRef, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import { translate } from 'react-jhipster';

import { DataOfDay, DataOfSchedule, DataOfResource, CalenderViewMonthCommon, HourOfDay, DataHeader } from '../common'
import { TabForcus, MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK, HIGHT_OF_SCHEDULE, MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND, getJsonBName, ID_FIELD_INFO } from '../../constants';
import ItemSchedule from '../item/item-schedule';
import ItemResource from '../item/item-resource';
import InHourTdGridDay from './in-hour-td-grid-day';
import { DrapDropInHour } from '../grid-drap-drop/grid-drap-drop-in-hour';
import {
    optionShowAll
} from '../calendar-grid.reducer'
import PopupListCreate from "../../common/popup-list-create";
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';


interface IBodyGridDayProp extends StateProps, DispatchProps {
    modeView: boolean,
}

const BodyGridDay = (props: IBodyGridDayProp) => {
    const widthHourTdTime = 98;
    const divFullDayRef = useRef(null);
    const widthHourTd = 98;
    const nowDate = CalenderViewMonthCommon.nowDate();
    const tblInHourRef = useRef(null);
    const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
    const [openTipHoliday, setOpenTipHoliday] = useState(false);

    const [dateHeader, setDateHeader] = useState(null);

    const [position, setPosition] = useState({

        left: 0,
        top: 0
    })

    DrapDropInHour.setStartDateMonth(props.dataOfDetailDay.startDate);
    DrapDropInHour.setTblRefMonth(tblInHourRef);
    DrapDropInHour.setNumTd(1)

    const tdFullRef = useRef(null);
    const tableCalcWidtRef = useRef(null);
    const [boundingOfTd, setBoundingOfTd] = useState([0, 0])
    const [widthHourTable, setWidthHourTable] = useState(0);
    let handleTimeout = null;
    function updateSize() {
        if (handleTimeout) {
            clearTimeout(handleTimeout);
        }
        handleTimeout = setTimeout(() => {
            if (tableCalcWidtRef && tableCalcWidtRef.current) {
                const cTblInfoBounding = tableCalcWidtRef.current.getBoundingClientRect();
                if (cTblInfoBounding) {
                    setBoundingOfTd([cTblInfoBounding.width - widthHourTdTime, cTblInfoBounding.height]);
                    setWidthHourTable(cTblInfoBounding.width)
                }
            }
            if (divFullDayRef && divFullDayRef.current) {
                divFullDayRef.current.scrollTo(0, 0);
            }
            // DrapDropInHour.reinitialized();
        }, 250)
        // DrapDropInHour.reinitialized();
    }

    useEffect(() => {
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        updateSize();
    }, [props.refreshDataFlag, props.optionAll])

    /**
     * close popup list create and show popup create
     */
    const closePopupCreateList = (type: ID_FIELD_INFO) => {
        setShowPopupListCreate(false);
        // if (ID_FIELD_INFO.SCHEDULE === type) {
        //     setDataModalTask({
        //         ...dataModalTask,
        //         showModal: true
        //     });
        // }

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
    /**
     *  render popup
     */
    const renderPopupCreateList = () => {
        // get nowtime
        const newDate = CalenderViewMonthCommon.nowDate();
        // get set date = date click
        if (dateHeader) {
            newDate.year(dateHeader.year())
            newDate.month(dateHeader.month())
            newDate.date(dateHeader.date())
        }
        return showPopupListCreate && !props.modeView && <PopupListCreate onClosePopup={closePopupCreateList} dateOnClick={newDate} position={position} />
    }
    const getPositon = (e, date, refTdOnClick) => {
        setDateHeader(date)
        setPosition({
            left: e.clientX,
            top: e.clientY
        })

        const isClickOnTd = (refTdOnClick === null || refTdOnClick.current === e.target);
        setTimeout(() => {
            if (!isClickOnTd) {
                setShowPopupListCreate(false);
            } else {
                if (dateHeader && CalenderViewMonthCommon.compareDateByDay(date, dateHeader) === 0) {
                    setShowPopupListCreate(!showPopupListCreate);
                } else {
                    setShowPopupListCreate(true);
                }
            }
        }, 50);
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

    const setShowAllFullDay = (optionAll) => {
        props.optionShowAll(optionAll)
    }

    let listHour: HourOfDay[] = [];
    let fullDay: DataOfDay[] = [];
    if (props.dataOfDetailDay && props.localNavigation) {
        let tabSchedule = true;
        if (props.localNavigation.tabFocus === TabForcus.Resource) {
            tabSchedule = false;
        }
        listHour = tabSchedule ? props.dataOfDetailDay.listHourSchedule : props.dataOfDetailDay.listHourResource;
        fullDay = tabSchedule ? props.dataOfDetailDay.fullDaySchedule : props.dataOfDetailDay.fullDayResource;
    }

    const getListDataOfDay = (dataOfDay: DataOfDay): DataOfSchedule[] | DataOfResource[] => {
        let listData: DataOfSchedule[] | DataOfResource[] = [];
        if (props.localNavigation.tabFocus === TabForcus.Schedule && dataOfDay.listSchedule) {
            listData = dataOfDay.listSchedule;
        } else if (dataOfDay.listResource) {
            listData = dataOfDay.listResource;
        }
        return listData;
    }

    const getMaxSchedule = (): number => {
        let maxScheduleLocal = 0;
        fullDay && fullDay.forEach((day: DataOfDay) => {
            const listData = getListDataOfDay(day);
            maxScheduleLocal = Math.max(maxScheduleLocal, listData.length);
        });

        return maxScheduleLocal;
    }

    /**
     * Top : height: 88px
     * Date: 82
     */

    const heightOfControlTop = 88;
    const heightOfTableDate = 85;
    const marginOfTableDate = 24;
    const maxSchedule = getMaxSchedule();
    let heightCalcFullDay = heightOfControlTop + heightOfTableDate + marginOfTableDate;
    let heightFullDay = 0;

    // case collapse
    if (props.optionAll) {
        if (maxSchedule > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK) {
            heightFullDay += MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK * HIGHT_OF_SCHEDULE;
        } else {
            if (maxSchedule === 0) {
                heightFullDay += 41;
            } else {
                heightFullDay += maxSchedule * HIGHT_OF_SCHEDULE;
            }
        }
    } else {
        if (maxSchedule > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND) {
            heightFullDay += MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND * HIGHT_OF_SCHEDULE;
        } else {
            if (maxSchedule === 0) {
                heightFullDay += 41;
            } else {
                heightFullDay += maxSchedule * HIGHT_OF_SCHEDULE;
            }
        }
    }
    heightCalcFullDay += heightFullDay;

    const getFlagShowMore = (listData: DataOfSchedule[] | DataOfResource[]) => {
        if (listData.length === 0) return false;
        return listData[listData.length - 1].sort >= MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK;
    }

    const checkExceptionViewMore = (dataOfDay: DataOfDay, indexOfDay: number) => {
        /**
         * If the last element is isOverDay = true
         * And listData.length == maxShowSchedule
         * And listDayOfWeek[indexOfDay + n To n].length > maxShowSchedule
         * 
         * Then show more 1
         */
        const listData: DataOfSchedule[] | DataOfResource[] = getListDataOfDay(dataOfDay);

        if (listData.length === 0) return false;
        const lastSchedule = listData[listData.length - 1];
        if (lastSchedule.sort !== MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1) return false;
        if (!lastSchedule.isOverDay) return false;
        if (!fullDay || fullDay.length === 0) return false;
        const diffDay = CalenderViewMonthCommon.getDaysDiff(lastSchedule.finishDateSortMoment, lastSchedule.startDateSortMoment);

        for (let i = indexOfDay + 1; i < (indexOfDay + diffDay + 1) && i < fullDay.length; i++) {
            if (props.localNavigation.tabFocus === TabForcus.Schedule) {
                if (getFlagShowMore(fullDay[i].listSchedule)) return true;
            } else {
                if (getFlagShowMore(fullDay[i].listResource)) return true;
            }
        }
        return false;
    }

    const getMoreNumber = (dataOfDay: DataOfDay, indexOfDay: number) => {
        const listData: DataOfSchedule[] | DataOfResource[] = getListDataOfDay(dataOfDay);
        if (checkExceptionViewMore(dataOfDay, indexOfDay)) return 1;
        let count = 0;
        for (let i = 0; i < listData.length; i++) {
            if (listData[i].sort >= MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1) count++;
        }

        return count;
    }

    const renderMoreSchedule = (dataOfDay: DataOfDay, indexOfDay: number) => {
        if (!props.optionAll) return;
        const isExceptionViewMore = checkExceptionViewMore(dataOfDay, indexOfDay);

        if (props.optionAll && (getFlagShowMore(getListDataOfDay(dataOfDay)) || isExceptionViewMore) && MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK > 0) {
            // const bottomPx = '0px';

            let moreLang = { numMore: getMoreNumber(dataOfDay, indexOfDay) };
            if (isExceptionViewMore) {
                moreLang = { numMore: 1 };
            }
            return (
                <div onClick={() => { setShowAllFullDay(!props.optionAll) }} className="more text-left position-absolute" style={{
                    top: (MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1) * HIGHT_OF_SCHEDULE, 
                    height: HIGHT_OF_SCHEDULE + 'px'
                }}>
                    <a className="pl-2">{translate('calendars.commons.more', moreLang)}</a>
                </div>
            )
        }
    }

    const renderTdFullDay = (dataOfDay: DataOfDay, indexOfDay: number) => {

        const maxSort = getFlagShowMore(getListDataOfDay(dataOfDay)) || checkExceptionViewMore(dataOfDay, indexOfDay) ? MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1 : MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK;
        const conditionShow = (s: DataOfSchedule | DataOfResource) => { return !props.optionAll || (props.optionAll && s.sort < maxSort) };

        return (
            <>
                {props.localNavigation && props.localNavigation.tabFocus === TabForcus.Schedule ? (
                    dataOfDay.listSchedule && dataOfDay.listSchedule.map((s, index) => {
                        return (conditionShow(s) && <ItemSchedule
                            key={s.uniqueId}
                            dataOfSchedule={s}
                            optionAll={props.optionAll}
                            localNavigation={props.localNavigation}

                            formatNormalStart={'HH:mm'}
                            formatOverDayStart={'HH:mm'}

                            widthOfTd={boundingOfTd[0]}

                            heightOfDivDate={0}

                            disableDragging={true}
                            modeView={props.modeView}
                        />)
                    })
                ) : (

                        dataOfDay.listResource && dataOfDay.listResource.map((r, index) => {
                            return (conditionShow(r) &&
                                <ItemResource
                                    key={'td_full_day_Resource_' + indexOfDay + '_' + index}
                                    dataOfResource={r}
                                    optionAll={props.optionAll}
                                    isShowEnd={false}
                                    formatEnd={''}
                                    isShowStart={true}
                                    formatStart={'HH:mm'}

                                    widthOfTd={boundingOfTd[0]}
                                    heightOfTd={boundingOfTd[1]}

                                    heightOfDivDate={0}

                                    disableDragging={true}
                                    modeView={props.modeView}
                                />
                            )
                        })

                    )}
                {renderMoreSchedule(dataOfDay, indexOfDay)}
            </>
        )

    }

    const renderFullDay = () => {
        // const renderTimeTd = () => {
        //     const styleFullDay: CSSProperties = {
        //         top: props.optionAll ? '178px' : null,
        //         zIndex: 1000
        //     }
        //     return (
        //         <div className="calendar-week-thead-arrow" style={styleFullDay}>
        //             {getMaxSchedule() > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK &&
        //                 (
        //                     <div className="time" onClick={() => { setShowAllFullDay(!props.optionAll) }}>
        //                         <i className={`fas ${props.optionAll ? `fa-chevron-down` : `fa-chevron-up`} arrow-expand`}></i>
        //                     </div>
        //                 )}
        //         </div>
        //     )
        // }

        const renderHeaderTable = () => {

            const renderAllTdFullDay = () => {
                const isHoliday = (d: DataHeader) => {
                    return d.isHoliday || d.isCompanyHoliday || d.isNationalHoliday;
                }
                const classNameHoliday = (dataOfDay: DataOfDay) => { return props.optionHoliday && isHoliday(dataOfDay.dataHeader) ? ' color-red ' : ' ' };
                const renderHoliday = (dataOfDay: DataOfDay) => {
                    if ((props.optionHoliday && isHoliday(dataOfDay.dataHeader)) || dataOfDay.dataHeader.nationalHolidayName){
                        return  props.optionHoliday && getJsonBName(dataOfDay.dataHeader.companyHolidayName || dataOfDay.dataHeader.holidayName) 
                        ? getJsonBName(dataOfDay.dataHeader.companyHolidayName || dataOfDay.dataHeader.holidayName) 
                        : dataOfDay.dataHeader.nationalHolidayName
                    }
                }
                const renderLunarDay = (dataOfDay: DataOfDay) => {
                    if (props.optionLunarDay) {
                        return dataOfDay.dataHeader.perpetualCalendar;
                    }
                }
                const checkDay = (dataOfDay: DataOfDay) => { return CalenderViewMonthCommon.compareDateByDay(nowDate, dataOfDay.dataHeader.dateMoment) === 0; }
                const className = (dataOfDay: DataOfDay) => { return dataOfDay.dataHeader.isWeekend || (isHoliday(dataOfDay.dataHeader) && props.optionHoliday) || dataOfDay.dataHeader.nationalHolidayName ? 'color-red' : ''; }
                const dateNameLang = (dataOfDay: DataOfDay) => { return "calendars.commons.dayOfWeek." + dataOfDay.dataHeader.dateMoment.day(); }

                return (
                    <>
                        {props.dataOfDetailDay && fullDay.map((td, index) => {
                            console.log("dayyyy", td)
                            return (
                                <td key={index} onClick={(e) => getPositon(e, td.dataHeader.dateMoment, null)}>
                                    <div className={"day-width mb-2 " + className(td) + classNameHoliday(td)}>{translate(dateNameLang(td))}</div>
                                    <div className={'date text-list-day ' + className(td)} >
                                        <span
                                        onMouseLeave={() => {setOpenTipHoliday(false)}}
                                        onMouseOver={ () => {setOpenTipHoliday(true)}}
                                         className="note-left color-red text-right flex-op-1"> {renderHoliday(td)} &nbsp; </span>
                                        <span className={`mr-2 ml-2   ${checkDay(td) ? 'current-date' + classNameHoliday(td) : classNameHoliday(td)} ${className(td)}`}>{td.dataHeader.dateMoment.format('D')}</span>
                                        <span className="note text-left perpetual flex-op-1">&nbsp;{renderLunarDay(td)} </span>
                                        {openTipHoliday && (td.dataHeader.companyHolidayName || td.dataHeader.holidayName) && td.dataHeader.nationalHolidayName &&
                                            <div className="tip-holiday tip-holiday-gridDay">
                                            <p>{getJsonBName(td.dataHeader.companyHolidayName || td.dataHeader.holidayName)}</p>
                                            <p>{td.dataHeader.nationalHolidayName}</p>
                                        </div>
                                        }
                                    </div>
                                </td>
                            )
                        })}
                    </>
                )
            }
            return (
                <div className="calendar-week-thead-fixed">
                    <table className="table-default table-out-no-border table-schedule  table-calendar-schedule table-calendar-schedule-header" style={{width: widthHourTable}}>
                        <tbody>
                            <tr>
                                <td style={{ width: widthHourTdTime }}></td>
                                {renderAllTdFullDay()}
                            </tr>
                        </tbody>
                    </table>
                    {renderPopupCreateList()}
                    {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
                        toggleCloseModalTask={onCloseModalTask}
                        iconFunction="ic-task-brown.svg"
                        {...dataModalTask}
                        canBack={false} />}
                    {openModalCreateMilestone &&
                        <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
                            toggleCloseModalMiles={onModalCreateMilestoneClose} />}
                </div>
            )
        }


        // const maxSchedule = getMaxSchedule();
        const styleFullDay: CSSProperties = {
            overflowY: props.optionAll || maxSchedule <= MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK ? "hidden" : "auto",
            top: 0,
            height: heightFullDay + 'px',
        }

        // const hHeader = props.optionAll ? MIN_HIGHT_OF_TR_FULL_DAY_IN_WEEK_VIEW + 'px' : null;
        return (
            <>
                {/* {renderTimeTd()} */}
                {renderHeaderTable()}
                <div className="calendar-week-thead  style-3" style={styleFullDay} ref={divFullDayRef}>
                    <div className="table-calendar-schedule-wrap ">
                        <table className="table-default table-out-no-border table-schedule  table-calendar-schedule table-calendar-schedule-header h-99-9"
                            style={{ width: widthHourTable }}>
                            <tbody><tr>
                                <td style={{ width: widthHourTdTime, height: maxSchedule * HIGHT_OF_SCHEDULE }}></td>
                                {props.dataOfDetailDay && fullDay.map((td, index) => {
                                    return (
                                        <td key={'td_full_day' + index} ref={tdFullRef} onClick={(e) => getPositon(e, td.dataHeader.dateMoment, tdFullRef)}>
                                            {renderTdFullDay(td, index)}
                                        </td>
                                    )
                                })}
                            </tr></tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }


    const renderHour = (tr: HourOfDay, index: number) => {
        return (<>
            <td style={{ width: widthHourTdTime }} >
                <div className="time-wrap"><div className="time">
                    {(0 <= index && index < listHour.length - 1 ? (tr.endHour.clone().add(1, 'minute').format('HH:mm')) : (<></>))}
                </div></div>
            </td>
            {tr.listDay.map((td, indexTd) => {
                return (
                    <InHourTdGridDay
                        key={'td_in_hour_' + index + '_' + indexTd}
                        tdData={td}
                        widthOfTd={boundingOfTd[0]}
                        modeView={props.modeView}
                    />
                )
            })}
        </>);
    }

    return (
        <>
            {renderFullDay()}
            <div style={{ width: 'calc(100% - ' + (widthHourTdTime) + 'px)', marginLeft: widthHourTdTime }} className="line-calendar-thead">
                <div className="time-wrap">
                    <div className="time">
                        {getMaxSchedule() > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK &&
                            (
                                <i className={`fas ${props.optionAll ? `fa-chevron-down` : `fa-chevron-up`} arrow-expand`}
                                    onClick={() => { setShowAllFullDay(!props.optionAll) }}
                                ></i>
                            )}
                    GMT{CalenderViewMonthCommon.nowDate().format('Z')}
                    </div>
                </div>

            </div>
            <div className="calendar-week-tbody style-3" style={{ height: 'calc(100vh - ' + (heightCalcFullDay) + 'px)' }}>
                <div className="table-calendar-schedule-wrap "  ref={tableCalcWidtRef}>
                    <table className="table-default table-out-no-border table-schedule table-calendar-schedule list-hour table-calendar-schedule-hour" style={{width: widthHourTable}} ref={tblInHourRef}>
                        <tbody>
                            {props.dataOfDetailDay && listHour.map((tr, index) => {
                                return (
                                    <tr key={'tr_h_' + index}>
                                        {renderHour(tr, index)}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    dataOfDetailDay: dataCalendarGrid.dataOfDetailDay,
    localNavigation: dataCalendarGrid.localNavigation,
    refreshDataFlag: dataCalendarGrid.refreshDataFlag,
    optionAll: dataCalendarGrid.optionAll,
    optionHoliday: dataCalendarGrid.optionHoliday,
    optionLunarDay: dataCalendarGrid.optionLunarDay,
});

const mapDispatchToProps = {
    optionShowAll
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BodyGridDay);
