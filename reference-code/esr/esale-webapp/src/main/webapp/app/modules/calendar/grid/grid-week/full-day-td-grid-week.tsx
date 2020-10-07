import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';

import { DataOfDay, DataOfSchedule, DataOfResource, CalenderViewMonthCommon } from '../common'
import { TabForcus, MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK, HIGHT_OF_SCHEDULE, ID_FIELD_INFO } from '../../constants';
import ItemSchedule from '../item/item-schedule';
import ItemResource from '../item/item-resource';
import PopupListCreate from "../../common/popup-list-create";
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from "app/modules/tasks/constants";
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";

import { IRootState } from 'app/shared/reducers'
// import moment from 'moment';
// import { useDrop } from 'react-dnd'
// import { DrapDropInMonth } from '../grid-drap-drop/grid-drap-drop-month';
import {
    optionShowAll
} from '../calendar-grid.reducer'
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';

export interface IFullDayTdGridWeek extends StateProps, DispatchProps {
    modeView: boolean,
    indexOfDay: number
    tdData: DataOfDay,
    widthOfTd: number
}

const FullDayTdGridWeek = (props: IFullDayTdGridWeek) => {
    const tdFullRef = useRef(null);
    const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [position, setPosition] = useState({
        left: 0,
        top: 0
    })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
    // const [boundingOfTd, setBoundingOfTd] = useState([0, 0])
    // let handleTimeout = null;
    // function updateSize() {
    //     if (handleTimeout) {
    //         clearTimeout(handleTimeout);
    //     }
    //     handleTimeout = setTimeout(() => {
    //         if (tdFullRef && tdFullRef.current) {
    //             const cTblInfoBounding = tdFullRef.current.getBoundingClientRect();
    //             if (cTblInfoBounding) {
    //                 setBoundingOfTd([cTblInfoBounding.width, cTblInfoBounding.height]);
    //             }
    //         }
            
    //         // DrapDropInMonth.reinitialized();
    //     }, 250)
    // }

    // useEffect(() => {
    //     updateSize();
    //     window.addEventListener('resize', updateSize);
    //     return () => window.removeEventListener('resize', updateSize);
    // }, []);

    const setShowAllFullDay = (optionAll) => {
        props.optionShowAll(optionAll)
    }

    let fullDay: DataOfDay[] = [];
    if (props.dataOfDetailWeek && props.localNavigation) {
        let tabSchedule = false;
        if (props.localNavigation.tabFocus === TabForcus.Schedule) tabSchedule = true;
        fullDay = tabSchedule ? props.dataOfDetailWeek.fullDaySchedule : props.dataOfDetailWeek.fullDayResource;
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
                <div onClick={() => { setShowAllFullDay(!props.optionAll) }} className="more text-left pl-2 position-absolute" style={{ 
                    top: (MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1) * HIGHT_OF_SCHEDULE, height: HIGHT_OF_SCHEDULE + 'px'
                }}>
                    <a className="w100">
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
        setPosition({
            left: e.clientX,
            top: e.clientY
        })
    }
    /**
     *  render popup
     */
    const renderPopupCreateList = () => {
        const headerDate = props.tdData.dataHeader.dateMoment;
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

    const renderTdFullDay = (dataOfDay: DataOfDay, indexOfDay: number) => {
        const maxSort = getFlagShowMore(getListDataOfDay(dataOfDay)) || checkExceptionViewMore(dataOfDay, indexOfDay) ? MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK - 1 : MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK;
        const conditionShow = (s: DataOfSchedule | DataOfResource) => { return !props.optionAll || (props.optionAll && s.sort < maxSort) };
// console.log("dataOfDay", dataOfDay)
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

                            widthOfTd={props.widthOfTd}

                            heightOfDivDate={0}
                            modeView={props.modeView}
                        />)
                    })
                ) : (

                        dataOfDay.listResource && dataOfDay.listResource.map((r, index) => {
                            return (conditionShow(r) &&
                                <ItemResource
                                    key={'Resource_' + r.uniqueId}
                                    dataOfResource={r}
                                    optionAll={props.optionAll}
                                    isShowEnd={false}
                                    formatEnd={''}
                                    isShowStart={true}
                                    formatStart={'HH:mm'}

                                    widthOfTd={props.widthOfTd}

                                    heightOfDivDate={0}
                                    modeView={props.modeView}
                                />
                            )
                        })

                    )}
                {renderMoreSchedule(dataOfDay, indexOfDay)}
            {renderPopupCreateList()}
            {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
                toggleCloseModalTask={onCloseModalTask}
                iconFunction="ic-task-brown.svg"
                {...dataModalTask}
                canBack={false} />}
            {openModalCreateMilestone &&
                <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
                    toggleCloseModalMiles={onModalCreateMilestoneClose} />}
            </>
        )

    }

    useEffect(() => {
        /**
         * if clicked on inside of element
         */
        function handleClickInside(event) {
            if (tdFullRef.current && tdFullRef.current === event.target) {
                setShowPopupListCreate(true);
            }
        }

        // Bind the event listener
        document.addEventListener("click", handleClickInside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickInside);
        };
    }, [tdFullRef]);
    return (
        <td style={{ width: props.widthOfTd }} ref={tdFullRef} onClick={(e) => getPositon(e)}>
            {renderTdFullDay(props.tdData, props.indexOfDay)}
        </td>
    )
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    dataOfDetailWeek: dataCalendarGrid.dataOfDetailWeek,
    localNavigation: dataCalendarGrid.localNavigation,
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
)(FullDayTdGridWeek);
