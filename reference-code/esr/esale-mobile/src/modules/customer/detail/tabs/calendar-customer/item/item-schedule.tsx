import React from 'react'
import { View } from "react-native";
import { DataOfSchedule } from '../type'
import { RenderMilestone } from './render-milestone'
import { RenderTask } from './render-task'
import { RenderSchedule } from './render-schedule'
import { LocalNavigation, ItemTypeSchedule } from '../../../../../../config/constants/calendar';

interface IItemScheduleProp {
  dataOfSchedule: DataOfSchedule,
  key: string,
  localNavigation?: LocalNavigation,
  source?: any,
  drag?: any,
  optionAll?: boolean,
  formatNormalStart?: string,
  formatNormalEnd?: string,
  formatFullDayStart?: string,
  formatFullDayEnd?: string,
  formatOverDayStart?: string,
  formatOverDayEnd?: string,
  top?: string,
  left?: string,
  width?: string,
  height?: string,

}
/**
 * Item schedule Component
 * @param props 
 */
export const ItemSchedule = (props: IItemScheduleProp) => {
  const renderObject = (schedule: DataOfSchedule) => {
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <>
            <RenderMilestone
              dataOfSchedule={schedule}
              prefixKey={'item-Milestone'}
              localNavigation={props.localNavigation || {}}
              top={props.top}
              left={props.left}
              width={props.width}
              height={props.height}
              showArrow={true}
              styleContainer={{backgroundColor: '#ADE4C9'}}
            />
        </>
      );
    }

    if (schedule.itemType === ItemTypeSchedule.Task) {
      return (
        <>
          <RenderTask
            dataOfSchedule={schedule}
            prefixKey={'item-Task'}
            localNavigation={props.localNavigation || {}}
            top={props.top}
            left={props.left}
            width={props.width}
            height={props.height}
            showArrow={true}
          />
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Schedule) {
      return (
        <>
          <RenderSchedule
            dataOfSchedule={schedule}
            prefixKey={'item-schedule'}
            localNavigation={props.localNavigation || {}}
            formatNormalStart={props.formatNormalStart}
            formatNormalEnd={props.formatNormalEnd}
            formatFullDayStart={props.formatFullDayStart}
            formatFullDayEnd={props.formatFullDayEnd}
            formatOverDayStart={props.formatOverDayStart}
            formatOverDayEnd={props.formatOverDayEnd}
            top={props.top}
            left={props.left}
            width={props.width}
            height={props.height}
            showArrow={true}
          />
        </>
      );
    }
    return <></>
  }

  return (
    <>
      {
        props.dataOfSchedule.isShow ?
          (
            renderObject(props.dataOfSchedule)
          )
          :
          (<View />)
      }
    </>
  )
}


