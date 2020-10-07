import React from "react"
import { DataOfDay, DataOfSchedule, DataOfResource, CalenderViewCommon } from "../../../api/common"
import { ItemScheduleInDay } from "../item/item-schedule-in-day"
import { View } from "react-native"
import styles from "./style"
import { RenderResource } from "../item/render-resource"
import { TabFocus } from "../../../constants"
import { useSelector } from "react-redux"
import { tabFocusSelector } from "../../../calendar-selector"
import moment from 'moment'

/**
 * Interface In Hour Grid Day Prop
 */
type IInHourTdGridDayProp = {
    tdData: DataOfDay
}
/**
 * item in hour
 * @param props data from props
 */
export const InHourTdGridDay = React.memo((props: IInHourTdGridDayProp) => {
    
    const tabFocus = useSelector(tabFocusSelector);
    /**
     * render Item In Day
     * @param dataOfDay 
     */
    const renderTdInDay = (dataOfDay: DataOfDay) => {
        return (
            <>
                {tabFocus === TabFocus.SCHEDULE ? (
                    dataOfDay.listSchedule && dataOfDay.listSchedule.map((s: DataOfSchedule) => {
                        return (
                            <ItemScheduleInDay
                                key={s.uniqueId}
                                dataOfSchedule={s} 
                            />
                        )
                    })) : (
                        dataOfDay.listResource && dataOfDay.listResource.map((s: DataOfResource) => {
                        let sFormatStart =s.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
                        let sFormatEnd =s.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
                        if (s.isOverDay && CalenderViewCommon.compareDateByDay(moment(s.startDateSortMoment), moment(s.startDateMoment)) === 0) {
                            sFormatStart = 'HH:mm';
                        }
                        if (s.isOverDay && CalenderViewCommon.compareDateByDay(moment(s.startDateSortMoment), moment(s.finishDateMoment)) === 0) {
                            sFormatEnd = 'HH:mm';
                        }
                        return (<RenderResource
                            prefixKey={'_' + 'item-Resource'}
                            key={'_' + s.uniqueId}
                            dataOfResource={s}
                            isShowStart={true}
                            isShowEnd={true}
                            formatStart={sFormatStart}
                            formatEnd={sFormatEnd}
                            modeInHour={true}
                        />)
                    }))
                }
            </>
        )
    }

    return (
        <View style={[styles.itemRight, styles.itemRight_v2]}>
            {props.tdData &&
                renderTdInDay(props.tdData)
            }           
                <View style={styles.itemEvent}>
                </View>            
        </View>
    )
})
