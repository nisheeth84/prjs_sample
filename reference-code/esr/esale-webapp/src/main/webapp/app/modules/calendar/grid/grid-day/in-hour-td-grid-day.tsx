import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import moment from 'moment';

import { DataOfDay, CalenderViewMonthCommon } from '../common'
import { TabForcus, HIGHT_OF_TD_IN_HOUR_WEEK_VIEW, ID_FIELD_INFO } from '../../constants';

import ItemScheduleInDay from '../item/item-schedule-in-day';
import ItemResourceInDay from '../item/item-resource-in-day';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import PopupListCreate from "../../common/popup-list-create";
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import ModalCreateEditTask from '../../../tasks/create-edit-task/modal-create-edit-task';
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";


interface IInHourTdGridDayProp extends StateProps, DispatchProps {
    modeView: boolean,
    tdData: DataOfDay,
    widthOfTd: number
}

const InHourTdGridDay = (props: IInHourTdGridDayProp) => {
    const tdInHourRef = useRef(null);
    const nowDate = CalenderViewMonthCommon.nowDate();
    const [nowHourMinute, setNowHour] = useState([nowDate.hour(), nowDate.minute()])
    const [boundingOfTd, setBoundingOfTd] = useState([0, 0])


    const [position, setPosition] = useState(null)
    const [showPopupList, setShowPopupList] = useState(false)
    // const [showPopupListCreate, setShowPopupListCreate] = useState(false);
    const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
    const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
    const getPositon = (e) => {
        const classNameOfTd = e.target.className;
        if (tdInHourRef.current && (tdInHourRef.current === e.target || classNameOfTd.indexOf('d-flex') !== -1)) {
            setShowPopupList(true);
            setPosition({
                left: e.clientX,
                top: e.clientY
            })
        }
    }

    const closePopupCreateList = (type: ID_FIELD_INFO) => {
        setShowPopupList(false);
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
                    zIndex: 3,
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
                    {showPopupList && !props.modeView && <PopupListCreate onClosePopup={closePopupCreateList} dateOnClick={dataOfDay.dataHeader.dateMoment} position={position} />}


                    {props.localNavigation && props.localNavigation.tabFocus === TabForcus.Schedule ? (
                        dataOfDay.listSchedule && dataOfDay.listSchedule.map((s, index) => {
                            return (
                                <ItemScheduleInDay
                                    key={s.uniqueId}
                                    dataOfSchedule={s}
                                    localNavigation={props.localNavigation}
                                    widthOfTd={boundingOfTd[0]}
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
                                        widthOfTd={boundingOfTd[0]}
                                        heightOfTd={boundingOfTd[1]}
                                        modeView={props.modeView}
                                    />)
                            })

                        )}
                </div>

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

    return (<td ref={tdInHourRef} style={{width: props.widthOfTd}} className={'td-calendar-schedule-hour'} onClick={(e) => getPositon(e)}>{renderTdInDay(props.tdData)}</td>)
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    localNavigation: dataCalendarGrid.localNavigation,
    refreshDataFlag: dataCalendarGrid.refreshDataFlag,
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InHourTdGridDay);
