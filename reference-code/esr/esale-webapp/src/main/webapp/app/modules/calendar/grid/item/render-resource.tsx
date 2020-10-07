
import React from 'react'
import { DataOfResource } from '../common'
import moment from 'moment'
import { ItemCalendar } from './item-calendar'
import { getJsonBName } from '../../constants'


interface IRenderResource {
    modeView: boolean,
    dataOfResource: DataOfResource,
    className?: string,
    prefixKey: string,
    isShowStart: boolean,
    formatStart: string,
    isShowEnd: boolean,
    formatEnd: string

    top?: string,
    left?: string,
    width?: string,
    height?: string,
    showArrow?: boolean,
    modeInHour?: boolean

    startDateDragging?: moment.Moment
    endDateDragging?: moment.Moment
}

export const RenderResource = (props: IRenderResource) => {
    let className = props.className || 'calendar-schedule border-solid ';

    if (props.modeInHour) {
        className += ' calendar-schedule-time '
    }

    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfResource.isStartPrevious)) {
        className += ' has-arrow-left ';
    }
    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfResource.isEndNext)) {
        className += ' has-arrow-right ';
    }

    const background = '#d6e3f3'

    const renderArrowLeft = (schedule: DataOfResource) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious) {
            const styleBorder = {
                background,
                borderLeftColor: background,
                borderBottomColor: background,
            };
            return (
                <div className={'box-conner'}>
                    <span className="arrow-left" style={styleBorder}></span>
                </div>
            )
        }
    }

    const renderArrowRight = (schedule: DataOfResource) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isEndNext) {
            const styleBorder = {
                background,
                borderRightColor: background,
                borderTopColor: background,
            };
            return (
                <div className={'box-conner'}>
                    <span className="arrow-right" style={styleBorder}></span>
                </div>
            )
        }
    }

    const renderResourceTime = (schedule: DataOfResource) => {
        if (props.isShowStart || props.isShowEnd) {
            const startDate = props.startDateDragging ? props.startDateDragging : schedule.startDateMoment;
            const endDate = props.endDateDragging ? props.endDateDragging : schedule.finishDateMoment;
            return (
                <span className="time">
                    {props.isShowStart && startDate.format(props.formatStart || 'HH:mm')}
                    {props.isShowEnd && props.isShowStart && (<>〜</>)}
                    {props.isShowEnd && endDate.format(props.formatEnd || 'HH:mm')}
                </span>
            )
        }
    }

    const renderResourceTitle = (schedule: DataOfResource) => {
        const styleTitle = {
            zIndex: 2
        };
        return (
            <label className="title text-ellipsis" title={getJsonBName(schedule.resourceName)} style={styleTitle}>{getJsonBName(schedule.resourceName)}</label>
        )
    }


    const renderResource = (schedule: DataOfResource) => {
        const styleSchedule = {
            top: props.top || null,
            left: props.left || null,
            width: props.width || (ItemCalendar.getWidthOfObject(schedule) + '%'),
            height: props.height,
            zIndex: 1
        };
        const styleContent = {
            background,
            borderColor: background
        };

        if (!props.modeInHour) {
            return (
                <div className={className} style={styleSchedule}>
                    {renderArrowLeft(schedule)}
                    <div className={'content-schedule w100'} style={{...styleContent}}>
                        {renderResourceTime(schedule)}&nbsp;
                        {renderResourceTitle(schedule)}
                    </div>
                    {renderArrowRight(schedule)}
                </div>
            )
        } else {
            return (
                <div className={className} style={styleSchedule}>
                    <div className={'content-schedule d-block w100'} style={{...styleContent}}>
                        {renderResourceTime(schedule)}&nbsp;
                        {renderResourceTitle(schedule)}
                    </div>
                </div>
            )
        }
    }

    return (
        renderResource(props.dataOfResource)
    )
}