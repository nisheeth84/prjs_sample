import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { DataOfDay, CalenderViewMonthCommon } from '../common'
import { TabForcus, HIGHT_OF_TD_IN_HOUR_WEEK_VIEW, ID_FIELD_INFO } from '../../constants';
import ItemScheduleInDay from '../item/item-schedule-in-day';
import ItemResourceInDay from '../item/item-resource-in-day';

import { IRootState } from 'app/shared/reducers'
// import moment from 'moment';
import PopupListCreate from "../../common/popup-list-create";
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
// import moment from 'moment';

export interface IInHourTdGridWeekProp extends StateProps, DispatchProps {
    modeView: boolean,
    tdData: DataOfDay,
    widthOfTd: number
}

const InHourTdGridWeek = (props: IInHourTdGridWeekProp) => {
    const tdInHourRef = useRef(null);
    const nowDate = CalenderViewMonthCommon.nowDate();
    const [nowHourMinute, setNowHour] = useState([nowDate.hour(), nowDate.minute()])
    const [boundingOfTd, setBoundingOfTd] = useState([0, 0])

    const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
    
    const [dateHeader, setDateHeader] = useState(null);
    
    const [position, setPosition] = useState({
        
        left: 0,
        top: 0
    })

    let handleTimeout = null;
    function updateSize() {
        if (handleTimeout) {
            clearTimeout(handleTimeout);
        }
        handleTimeout = setTimeout(() => {
            if (tdInHourRef && tdInHourRef.current) {
                const cTblInfoBounding = tdInHourRef.current.getBoundingClientRect();
                if (cTblInfoBounding) {
                    setBoundingOfTd([cTblInfoBounding.width, cTblInfoBounding.height]);
                }
            }
        }, 250)
    }

    useEffect(() => {        
        const handleInterval = setInterval(() => {
            const mo = CalenderViewMonthCommon.nowDate();
            setNowHour([mo.hour(), mo.minute()])
        }, 60 * 1000);

        // scroll to now
        document.getElementsByClassName("calendar-week-tbody")[0].scrollTo(0,(Number(nowHourMinute[0]) * 60 + Number(nowHourMinute[1])) * (HIGHT_OF_TD_IN_HOUR_WEEK_VIEW/60) - HIGHT_OF_TD_IN_HOUR_WEEK_VIEW)

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
            if (handleInterval) clearInterval(handleInterval)
        }
    }, []);

    useEffect(() => {
        updateSize();
    }, [props.widthOfTd])

    
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
        return showPopupListCreate && !props.modeView && <PopupListCreate onClosePopup={closePopupCreateList} dateOnClick={dateHeader} position={position} />
    }
    const getPositon = (e, date) => {
        const classNameOfTd = e.target.className;
        if (tdInHourRef.current && (tdInHourRef.current === e.target || classNameOfTd.indexOf('d-flex') !== -1)) {
            setDateHeader(date)
            setPosition({
                left: e.clientX,
                top: e.clientY
            })
            setShowPopupListCreate(true);
        }
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

    const renderTdInDay = (dataOfDay: DataOfDay) => {
        const currentLine = () => {
            const checkDay = CalenderViewMonthCommon.compareDateByDay(nowDate, dataOfDay.dataHeader.dateMoment) === 0;
            const checkHour = nowHourMinute[0] === dataOfDay.dataHeader.dateMoment.hour();
            const sTop = ((HIGHT_OF_TD_IN_HOUR_WEEK_VIEW - 2) * nowHourMinute[1] / 60).toFixed(3) + 'px';
            if (checkDay) {
                const styleDiv = {
                    display: !checkHour ? 'none' : '',
                    top: sTop,
                    marginBottom: 0,
                    marginTop: 0,
                    zIndex:3,
                }
                return (
                    <div className="bar-red" style={styleDiv}><span></span></div>
                )
            }
        }
        return (
            <>
                {currentLine()}
                <div className="d-flex w100">
                    {props.localNavigation && props.localNavigation.tabFocus === TabForcus.Schedule ? (
                        dataOfDay.listSchedule && dataOfDay.listSchedule.map((s, index) => {
                            return (
                                <ItemScheduleInDay
                                    key={s.uniqueId}
                                    dataOfSchedule={s}
                                    localNavigation={props.localNavigation}
                                    widthOfTd={props.widthOfTd}
                                    heightOfTd={boundingOfTd[1]}
                                    modeView={props.modeView}
                                />)
                        })
                    ) : (
                            dataOfDay.listResource && dataOfDay.listResource.map((r, index) => {
                                return (
                                    <ItemResourceInDay
                                        key={r.uniqueId}
                                        dataOfResource={r}
                                        localNavigation={props.localNavigation}
                                        widthOfTd={props.widthOfTd}
                                        heightOfTd={boundingOfTd[1]}
                                        modeView={props.modeView}
                                    />)
                            })

                        )
                    }
                </div>
            </>
        )
    }

    return (<td style={{ width: props.widthOfTd }} className={'td-calendar-schedule-hour'} ref={tdInHourRef}   onClick={(e) => getPositon(e, props.tdData.dataHeader.dateMoment)}>
        {renderTdInDay(props.tdData)}
        
        {renderPopupCreateList()}
        {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
            toggleCloseModalTask={onCloseModalTask}
            iconFunction="ic-task-brown.svg"
            {...dataModalTask}
            canBack={false} />}
        {openModalCreateMilestone &&
            <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
                toggleCloseModalMiles={onModalCreateMilestoneClose} />}
    </td>)
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    localNavigation: dataCalendarGrid.localNavigation,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InHourTdGridWeek);
