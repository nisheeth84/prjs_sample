import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';

import { DataOfDay, HourOfDay, DataOfSchedule, DataOfResource, CalenderViewMonthCommon, DataHeader } from '../common'
import { TabForcus, MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK, MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND, HIGHT_OF_SCHEDULE, CalendarView, ItemTypeSchedule, getJsonBName, ID_FIELD_INFO } from '../../constants';

import { IRootState } from 'app/shared/reducers'
// import { DndProvider } from 'react-dnd'
// import Backend from 'react-dnd-html5-backend'
import { DrapDropInMonth } from '../grid-drap-drop/grid-drap-drop-month';
// import DragLayerMonth from '../grid-month/drag-layer-month';
import FullDayTdGridWeek from './full-day-td-grid-week';
import { DrapDropInHour } from '../grid-drap-drop/grid-drap-drop-in-hour';
// import DragLayerInHour from './drag-layer-in-hour';
import InHourTdGridWeek from './in-hour-td-grid-week';
import moment from 'moment';
import {
    optionShowAll, showDayGrid, onChangeDateShow
} from '../calendar-grid.reducer'
import RenderSchedule from '../item/render-schedule'
import RenderTask from '../item/render-task'
import RenderMilestone from '../item/render-milestone'
import { RenderResource } from '../item/render-resource'
import PopupListCreate from "../../common/popup-list-create";
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';


export interface IBodyGridWeekProp extends StateProps, DispatchProps {
    modeView: boolean,
}

const BodyGridWeek = (props: IBodyGridWeekProp) => {
    const nowDate = CalenderViewMonthCommon.nowDate();
    const widthHourTdTime = 98;
    const tblFullDayRef = useRef(null);
    const tblInHourRef = useRef(null);
    const divFullDayRef = useRef(null);
    const [openTipHoliday, setOpenTipHoliday] = useState("");

    // const [tblInfoBounding, setTblInfoBounding] = useState([0, 0]);
    const [widthHourTd, setWidthHourTd] = useState(0);
    const [widthHourTable, setWidthHourTable] = useState(0);
    const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);

    const [dateHeader, setDateHeader] = useState(null);

    const [position, setPosition] = useState({

        left: 0,
        top: 0
    })

    DrapDropInMonth.setStartDateMonth(props.dataOfDetailWeek.startDate);
    DrapDropInMonth.setTblRefMonth(tblFullDayRef);

    DrapDropInHour.setStartDateMonth(props.dataOfDetailWeek.startDate);
    DrapDropInHour.setTblRefMonth(tblInHourRef);
    DrapDropInHour.setNumTd(7);

    // useEffect(() => {
    //     // DrapDropInMonth.reinitialized();
    //     // DrapDropInHour.reinitialized();
    // }, [props.refreshDataFlag])

    let handleTimeout = null;
    function updateSize(s) {
        if (handleTimeout) {
            clearTimeout(handleTimeout);
        }
        handleTimeout = setTimeout(() => {
            if (tblInHourRef && tblInHourRef.current) {
                const cTblInfoBounding = tblInHourRef.current.getBoundingClientRect();
                if (cTblInfoBounding) {
                    // setTblInfoBounding([cTblInfoBounding.width, cTblInfoBounding.height]);
                    setWidthHourTd(Math.floor((cTblInfoBounding.width - widthHourTdTime) / 7))
                    setWidthHourTable(cTblInfoBounding.width)
                }
            }
            if (divFullDayRef && divFullDayRef.current) {
                divFullDayRef.current.scrollTo(0, 0);
            }
            // DrapDropInMonth.reinitialized();
            // DrapDropInHour.reinitialized();
        }, 50)
        // DrapDropInMonth.reinitialized();
        // DrapDropInHour.reinitialized();
    }

    useEffect(() => {
        updateSize('useEffect');
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        updateSize('useEffect');
    }, [props.optionAll])

    useEffect(() => {
        updateSize('useEffect');
    }, [props.refreshDataFlag])


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
    const getPositon = (e, date) => {
        setDateHeader(date)
        setPosition({
            left: e.clientX,
            top: e.clientY
        })
        setTimeout(() => {
            if (dateHeader && CalenderViewMonthCommon.compareDateByDay(date, dateHeader) === 0) {
                setShowPopupListCreate(!showPopupListCreate);
            } else {
                setShowPopupListCreate(true);
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

    const gotoDate = (date: moment.Moment) => {
        if (!props.modeView) {
            props.showDayGrid(true);
            props.onChangeDateShow(date, 0, CalendarView.Day);
        }
    }

    const setShowAllFullDay = (optionAll) => {
        props.optionShowAll(optionAll)
    }

    let listHour: HourOfDay[] = [];
    let fullDay: DataOfDay[] = [];
    if (props.dataOfDetailWeek && props.localNavigation) {
        let tabSchedule = false;
        if (props.localNavigation.tabFocus === TabForcus.Schedule) tabSchedule = true;
        listHour = tabSchedule ? props.dataOfDetailWeek.listHourSchedule : props.dataOfDetailWeek.listHourResource;
        fullDay = tabSchedule ? props.dataOfDetailWeek.fullDaySchedule : props.dataOfDetailWeek.fullDayResource;
    }

    // let minHightOfTrFullDay = '100%';
    // if (props.optionAll) {
    //     minHightOfTrFullDay = MIN_HIGHT_OF_TR_FULL_DAY_IN_WEEK_VIEW + 'px';
    // }

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

    const renderObject = (schedule: DataOfSchedule | DataOfResource) => {
        if (schedule['itemType'] === ItemTypeSchedule.Milestone) {
            return (
                <RenderMilestone
                    dataOfSchedule={schedule}
                    prefixKey={'item-Milestone'}
                    localNavigation={props.localNavigation}

                    width={'100%'}

                    showArrow={true}
                    modeView={props.modeView}
                />
            );
        }
        if (schedule['itemType'] === ItemTypeSchedule.Task) {
            return (
                <RenderTask
                    dataOfSchedule={schedule}
                    prefixKey={'item-Task'}
                    localNavigation={props.localNavigation}

                    width={'100%'}

                    showArrow={true}
                    modeView={props.modeView}
                />
            );
        }
        if (schedule['itemType'] === ItemTypeSchedule.Schedule) {
            return (
                <RenderSchedule
                    dataOfSchedule={schedule}
                    prefixKey={'item-schedule'}
                    localNavigation={props.localNavigation}

                    formatNormalStart={'HH:mm'}
                    formatOverDayStart={'HH:mm'}

                    width={'100%'}

                    showArrow={true}
                    modeView={props.modeView}

                />
            );
        }
        return (

            <RenderResource
                dataOfResource={schedule}
                prefixKey={'item-resource'}
                isShowStart={true}
                isShowEnd={false}
                formatStart={'HH:mm'}
                formatEnd={''}

                width={'100%'}

                showArrow={true}
                modeView={props.modeView}
            />
        )
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

    const renderFullDay = () => {
        // const renderTimeTd = () => {
        //     const styleFullDay = {
        //         top: props.optionAll ? '178px' : null,
        //         zIndex: 1000
        //     }
        //     return (
        //         <div className="calendar-week-thead-arrow" style={styleFullDay}>
        //             {/* {getMaxSchedule() > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK &&
        //                 (
        //                     <div className="time" onClick={() => { setShowAllFullDay(!props.optionAll) }}>
        //                         <i className={`fas ${props.optionAll ? `fa-chevron-down` : `fa-chevron-up`} arrow-expand`}></i>
        //                     </div>
        //                 )} */}
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
                    if ((props.optionHoliday && isHoliday(dataOfDay.dataHeader)) || dataOfDay.dataHeader.nationalHolidayName) {
                        return (<span
                            onMouseLeave={() => {setOpenTipHoliday("")}}
                            onMouseOver={ () => {setOpenTipHoliday(dataOfDay.dataHeader.nationalHolidayName)}}
                            className="note-left color-red text-ellipsis w40">
                                {
                                    props.optionHoliday && getJsonBName(dataOfDay.dataHeader.companyHolidayName || dataOfDay.dataHeader.holidayName) 
                                    ? getJsonBName(dataOfDay.dataHeader.companyHolidayName || dataOfDay.dataHeader.holidayName) 
                                    : dataOfDay.dataHeader.nationalHolidayName
                                }
                            </span>);
                    }
                }
                const renderLunarDay = (dataOfDay: DataOfDay) => {
                    if (props.optionLunarDay) {
                        return (<span className="note perpetual mr-2"  >{dataOfDay.dataHeader.perpetualCalendar}</span>);
                    }
                }
                const checkDay = (dataOfDay: DataOfDay) => { return CalenderViewMonthCommon.compareDateByDay(nowDate, dataOfDay.dataHeader.dateMoment) === 0; }
                const className = (dataOfDay: DataOfDay) => { return dataOfDay.dataHeader.isWeekend || (isHoliday(dataOfDay.dataHeader) && props.optionHoliday) || dataOfDay.dataHeader.nationalHolidayName ? 'color-red' : ''; }
                const dateNameLang = (dataOfDay: DataOfDay) => { return "calendars.commons.dayOfWeek." + dataOfDay.dataHeader.dateMoment.day(); }
                
                return (
                    <>
                        {props.dataOfDetailWeek && fullDay.map((td, index) => {
                            return (
                                <td style={{ width: widthHourTd }} key={index} onClick={(e) => getPositon(e, td.dataHeader.dateMoment)}>
                                    <div className={"day-width text-dark " + className(td)} >{translate(dateNameLang(td))}</div>
                                    <div className={'date cursor-pointer ' + className(td)}>
                                        {renderHoliday(td)}
                                        <span className={`${checkDay(td) ? 'current-date' + classNameHoliday(td) : classNameHoliday(td)} ${className(td)}`} onClick={() => gotoDate(td.dataHeader.dateMoment)} >{td.dataHeader.dateMoment.format('D')}</span>
                                        {renderLunarDay(td)}
                                        {getJsonBName(td.dataHeader.companyHolidayName || td.dataHeader.holidayName) && openTipHoliday === td.dataHeader.nationalHolidayName && td.dataHeader.nationalHolidayName &&
                                        <div className={`tip-holiday ${fullDay.length - 1 === index && "moveLeft"}`}>
                                            <p>{getJsonBName(td.dataHeader.companyHolidayName || td.dataHeader.holidayName)}</p>
                                            <p>{td.dataHeader.nationalHolidayName}</p>
                                        </div>}
                                    </div>
                                </td>
                            )
                        })}
                    </>
                )
            }
            return (
                <div className="calendar-week-thead-fixed">
                    <div className="table-calendar-schedule-wrap ">
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
                </div>
            )
        }

        // const maxSchedule = getMaxSchedule();
        // const styleFullDay: CSSProperties = {
        //     display: null
        // }
        const styleFullDay: CSSProperties = {
            overflowY: props.optionAll || maxSchedule <= MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK ? "hidden" : "auto",
            top: 0,
            height: heightFullDay + 'px',
            // borderBottom: '1px solid #e5e5e5'
        }

        const styleSchedule: CSSProperties = {
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: HIGHT_OF_SCHEDULE,
            zIndex: 10
        };

        return (
            <>
                {/* {renderTimeTd()} */}
                {renderHeaderTable()}
                <div className="calendar-week-thead  style-3" style={styleFullDay} ref={divFullDayRef}>
                    <div className="table-calendar-schedule-wrap ">

                        {props.aryDraggingItem && props.aryDraggingItem.map((e, index) => {
                            if (e.itemDrag.isShow)
                                return (
                                    <div style={{
                                        ...styleSchedule,
                                        top: e.y + HIGHT_OF_SCHEDULE * e.itemDrag.sort,
                                        left: 1 + e.x,
                                        width: e.width
                                    }}
                                        className={'calendar-schedule-drag opacity-1'}
                                        key={index}
                                    >
                                        {
                                            renderObject({ ...e.itemDrag })
                                        }
                                    </div>
                                )
                        })}
                        <table className="table-default table-out-no-border table-schedule  table-calendar-schedule table-calendar-schedule-header h-99-9"
                            style={{ width: widthHourTable }}
                            ref={tblFullDayRef}>
                            <tbody>
                                <tr>
                                    <td style={{ width: widthHourTdTime, height: maxSchedule * HIGHT_OF_SCHEDULE }}></td>
                                    {props.dataOfDetailWeek && fullDay.map((td, index) => {
                                        return (
                                            <FullDayTdGridWeek
                                                key={'td_full_day' + index}
                                                tdData={td}
                                                indexOfDay={index}
                                                widthOfTd={widthHourTd}
                                                modeView={props.modeView}
                                            />
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
                {/* </DndProvider> */}
            </>
        )
    }


    const renderHour = (tr: HourOfDay, index: number) => {
        return (<>
            <td style={{ width: widthHourTdTime }} className="td-calendar-schedule-hour-time-wrap">
                <div className="time-wrap"><div className="time">
                    {(0 <= index && index < listHour.length - 1 ? (tr.endHour.clone().add(1, 'minute').format('HH:mm')) : (<></>))}
                </div></div>
            </td>
            {tr.listDay.map((td, indexOfDay) => {
                return (
                    <InHourTdGridWeek
                        key={'td_in_hour' + index + '_' + indexOfDay}
                        tdData={td}
                        widthOfTd={widthHourTd}
                        modeView={props.modeView}
                    />)
            })}
        </>);
    }

    return (
        <>
            {renderFullDay()}
            <div style={{ width: 'calc(100% - ' + (widthHourTdTime) + 'px)', marginLeft: widthHourTdTime }} className="line-calendar-thead">
                <div className="time-wrap"><div className="time">
                    {getMaxSchedule() > MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK &&
                        (
                            <i className={`fas ${props.optionAll ? `fa-chevron-down` : `fa-chevron-up`} arrow-expand`} onClick={() => { setShowAllFullDay(!props.optionAll) }}></i>
                        )}
                                GMT{CalenderViewMonthCommon.nowDate().format('Z')}
                </div>
                </div>

            </div>
            <div className="calendar-week-tbody style-3" style={{ height: 'calc(100vh - ' + (heightCalcFullDay + 1) + 'px)' }}>
                <div className="table-calendar-schedule-wrap " ref={tblInHourRef}>
                    <table className="table-default table-out-no-border table-schedule table-calendar-schedule table-calendar-schedule-header table-calendar-schedule-hour" style={{width: widthHourTable}}>
                        <tbody>
                            {props.dataOfDetailWeek && listHour.map((tr, index) => {
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
    dataOfDetailWeek: dataCalendarGrid.dataOfDetailWeek,
    localNavigation: dataCalendarGrid.localNavigation,
    refreshDataFlag: dataCalendarGrid.refreshDataFlag,
    optionAll: dataCalendarGrid.optionAll,
    optionHoliday: dataCalendarGrid.optionHoliday,
    optionLunarDay: dataCalendarGrid.optionLunarDay,
    aryDraggingItem: dataCalendarGrid.aryDraggingItem
});

const mapDispatchToProps = {
    optionShowAll,
    showDayGrid,
    onChangeDateShow
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BodyGridWeek);
