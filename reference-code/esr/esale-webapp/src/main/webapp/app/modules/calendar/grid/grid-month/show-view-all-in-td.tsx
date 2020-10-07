import React, { useEffect, useRef } from 'react'
import { DataOfDay, DataOfSchedule, DataOfResource } from '../common'
import { LocalNavigation, TabForcus, ItemTypeSchedule } from '../../constants';
import RenderSchedule from '../item/render-schedule'
import RenderTask from '../item/render-task'
import RenderMilestone from '../item/render-milestone'
import { RenderResource } from '../item/render-resource'

interface IShowViewAllInTD {
    modeView: boolean,
    dataOfDay: DataOfDay,
    showLunarText: boolean,
    localNavigation?: LocalNavigation,
    positionListMore?: any,
    closeDetail: (close: boolean) => void,
    onClickToHeader: (date: Date) => void,
}

const ShowViewAllInTD = (props: IShowViewAllInTD) => {

    const wrapperRef = useRef(null);
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            props.closeDetail(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false);
        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, []);

    const renderSchedule = (schedule: DataOfSchedule, index: number) => {
        if (schedule.itemType === ItemTypeSchedule.Milestone) {
            return (
                <RenderMilestone
                    prefixKey={index + '_' + 'item-milestone-view-more'}
                    key={index + '_' + schedule.uniqueId}
                    dataOfSchedule={schedule}
                    localNavigation={props.localNavigation}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    width={'100%'}
                    showArrow={false}
                    modeView={props.modeView}
                />
            );
        }
        if (schedule.itemType === ItemTypeSchedule.Task) {
            return (
                <RenderTask
                    prefixKey={index + '_' + 'item-task-view-more'}
                    key={index + '_' + schedule.uniqueId}
                    dataOfSchedule={schedule}
                    localNavigation={props.localNavigation}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    width={'100%'}
                    showArrow={false}
                    modeView={props.modeView}
                />
            );
        }
        return (
            <RenderSchedule
                prefixKey={index + '_' + 'item-schedule-view-more'}
                key={index + '_' + schedule.uniqueId}
                dataOfSchedule={schedule}
                localNavigation={props.localNavigation}
                className={'calendar-schedule calendar-schedule-in-list-view-more'}
                showArrow={false}
                width={'100%'}

                formatNormalStart={'HH:mm'}
                formatOverDayStart={'HH:mm'}
                modeView={props.modeView}
            />
        );
    }

    const renderListSchedule = () => {
        return (
            <>
                {props.dataOfDay && props.dataOfDay.listSchedule && props.dataOfDay.listSchedule.map((schedule, index) => {
                    return (
                        renderSchedule(schedule, index)
                    )
                })}
            </>
        )
    }

    const renderListResource = () => {

        const renderResource = (resource: DataOfResource, index: any) => {
            return (
                <RenderResource
                    prefixKey={index + '_' + 'item-Resource-view-more'}
                    key={index + '_' + resource.uniqueId}
                    dataOfResource={resource}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    isShowStart={true}
                    isShowEnd={false}
                    formatStart={'HH:mm'}
                    formatEnd={''}
                    width={'100%'}
                    showArrow={false}
                    modeView={props.modeView}
                />
            )
        }

        return (
            <>
                {props.dataOfDay && props.dataOfDay.listResource && props.dataOfDay.listResource.map((resource, index) => {
                    return (
                        renderResource(resource, index)
                    )
                })}
            </>
        )
    }

    const renderListObject = () => {
        if (props.localNavigation.tabFocus === TabForcus.Schedule) {
            return renderListSchedule();
        }
        return renderListResource();
    }
    return (
        <div className="box-select-option box-appointment-changed p-3 box-absolute z-index-global-1000" ref={wrapperRef} style={{ top: `${props.positionListMore < 350 ? 0 : -190}`}}>
            <button className="close z-index-global-2" onClick={() => props.closeDetail(false)}>×</button>
            <div className="date date-prev" onClick={() => props.onClickToHeader(props.dataOfDay.dataHeader.dateMoment.toDate())}>
                {props.dataOfDay.dataHeader.dateMoment.format("DD")}
                {props.showLunarText && (<span className="note">{props.dataOfDay.dataHeader.holidayName}</span>)}
            </div>
            <div className={"scroll-calendar"}>
                {renderListObject()}
            </div>
        </div>
    )
}
export default ShowViewAllInTD;