import React from 'react';
import { ItemCalendar } from './item-calendar';
import { View, Text, } from 'react-native';
import styles from '../../../calendar-style';
import { DataOfResource } from '../../../api/common';
import moment from 'moment';
import { HIGHT_OF_TD_IN_HOUR_WEEK_VIEW, STRING_TRUNCATE_LENGTH } from '../../../constants';
import { truncateString } from '../../../common/helper';
import { stylesRenderResource } from './style';
import { normalize } from '../../../../calendar/common/index';


interface IRenderResource {
    dataOfResource: DataOfResource,
    className?: string,
    prefixKey: string,
    isShowStart: boolean,
    formatStart: string,
    isShowEnd: boolean,
    formatEnd: string,

    top?: string,
    left?: string,
    width?: string,
    height?: string,
    showArrow?: boolean,
    modeInHour?: boolean
}

export const RenderResource = React.memo((props: IRenderResource) => {
    const background = '#DAE3F3'
    
    const sTop = (HIGHT_OF_TD_IN_HOUR_WEEK_VIEW / 60) * moment(props.dataOfResource.startDateSortMoment).minute() ;
    const sHeight = (HIGHT_OF_TD_IN_HOUR_WEEK_VIEW / 60) * (props.dataOfResource.height || 0);
    
    const renderArrowLeft = (schedule: DataOfResource) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious) {
            const styleBorder = {
                background,
                borderLeftColor: background,
                borderBottomColor: background,
            };
            return (
                <View>
                    <Text style={styleBorder}></Text>
                </View>
            )
        }
        return 
    }
    const renderArrowRight = (schedule: DataOfResource) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isEndNext) {
            const styleBorder = {
                background,
                borderRightColor: background,
                borderTopColor: background,
            };
            return (
                <View>
                    <Text style={styleBorder}></Text>
                </View>
            )
        }
        return 
    }

    const render_Height = (schedule: DataOfResource) => {
        const startTime =  (moment(schedule.startDateMoment))
        const endTime = (moment(schedule.finishDateMoment))
        const result = moment.duration(endTime.diff(startTime))
        return result.as('minutes').valueOf() * 0.9  ;
     }    
    const renderResourceTime = (schedule: DataOfResource) => {
        if (props.isShowStart || props.isShowEnd) {
            return (
                <Text style={[styles.txtDt]}>
                    {props.isShowStart && moment(schedule.startDateMoment).format(props.formatStart || 'HH:mm')}
                    {props.isShowEnd && props.isShowStart && (<>〜</>)}
                    {props.isShowEnd && moment(schedule.finishDateMoment).format(props.formatEnd || 'HH:mm')}
                </Text>
            )
        }
        return 
    }
    const renderResourceTitle = (schedule: DataOfResource) => {
       return (
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.txtDt, styles.fBold]}>
                {truncateString(JSON.parse(schedule.resourceName).ja_jp, STRING_TRUNCATE_LENGTH.LENGTH_60)}
            </Text>
        )
    }
    const renderResource = (schedule: DataOfResource) => {
        if (!props.modeInHour) {
            return (
                <View style={[stylesRenderResource.styleSchedule]}>
                    {renderArrowLeft(schedule)}
                    <View style={[stylesRenderResource.styleContent]}>
                        {renderResourceTime(schedule)}
                        {renderResourceTitle(schedule)}
                    </View>
                    {renderArrowRight(schedule)}
                </View>
            )
        } else {
            const styleSchedule = {
                top: sTop,
                left: (props.dataOfResource?.left || 0) + '%',
                width: schedule.width  + '%' || ItemCalendar.getWidthOfObject(schedule) + '%',
                height: sHeight,
                zIndex: 1,
                
            };
            return (
                <View style={[{position: "absolute" }, styleSchedule,]}>
                    <View style={[stylesRenderResource.styleContent, {height: normalize(render_Height(schedule))}]}>
                        {renderResourceTime(schedule)}
                        {renderResourceTitle(schedule)}
                    </View>
                </View>
            )
        }
    }

    return (
        renderResource(props.dataOfResource)
    )
})