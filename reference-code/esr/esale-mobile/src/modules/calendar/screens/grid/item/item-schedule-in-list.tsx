import * as React from "react";
import { useSelector } from "react-redux";
import { localNavigationSelector } from "../../../calendar-selector";
import { DataOfSchedule, CalenderViewCommon } from "../../../api/common";
import { RenderSchedule } from "./render-schedule";
import { RenderTask } from "./render-task";
import { RenderMilestone } from "./render-milestone";
import { ItemTypeSchedule } from "../../../constants";
import moment from "moment";
// import { DummyDataOfSchedule } from "../../../assets/dummy-data-for-grid";
// import { Text } from 'react-native';

interface IItemCalendarInList {
    dataOfSchedule: DataOfSchedule
}

/**
 * render item calendar in list
 * @param props 
 */
export const ItemCalendarInList = React.memo((props: IItemCalendarInList) => {

    const localNavigation = useSelector(localNavigationSelector)

    // const localNavigation = new DummyDataOfSchedule().createLocalNavigation()

    /**
     * render schedule
     * @param schedule 
     * @param index 
     */
    const renderSchedule = (schedule: DataOfSchedule, index: number) => {
        if (schedule.itemType === ItemTypeSchedule.MILESTONE) {
            return (
                <RenderMilestone
                    prefixKey={index + '_' + 'item-milestone-view-more'}
                    key={index + '_' + schedule.uniqueId}
                    dataOfSchedule={schedule}
                    localNavigation={localNavigation}
                    modeInList = {true}
                />
            );
        }
        if (schedule.itemType === ItemTypeSchedule.TASK) {
            return (
                <RenderTask
                    prefixKey={index + '_' + 'item-task-view-more'}
                    key={index + '_' + schedule.uniqueId}
                    dataOfSchedule={schedule}
                    localNavigation={localNavigation}
                    modeInList = {true}

                />
            );
        }
        let formatOverDayStart = 'YYYY/MM/DD HH:mm';
        let formatOverDayEnd = 'YYYY/MM/DD HH:mm';
        if (schedule.isOverDay && CalenderViewCommon.compareDateByDay(moment(schedule.startDateSortMoment), moment(schedule.startDateMoment)) === 0) {
            formatOverDayStart = 'HH:mm';
        }
        if (schedule.isOverDay && CalenderViewCommon.compareDateByDay(moment(schedule.startDateSortMoment), moment(schedule.finishDateMoment)) === 0) {
            formatOverDayEnd = 'HH:mm';
        }
        if (schedule.itemType === ItemTypeSchedule.SCHEDULE) {
            return (
                <RenderSchedule
                    key={index + '_' + schedule.uniqueId}
                    prefixKey={0 + '_' + 'item-schedule-view-more'}
                    dataOfSchedule={props.dataOfSchedule}
                    localNavigation={localNavigation}
                    formatNormalStart={'HH:mm'}
                    formatNormalEnd={'HH:mm'}
                    formatOverDayStart={formatOverDayStart}
                    formatOverDayEnd={formatOverDayEnd}
                    modeInList = {true}
                />
            )

        }
        return (<></>)
    }

    return (
        <>
            {renderSchedule(props.dataOfSchedule, 0)}
        </>
    )
})