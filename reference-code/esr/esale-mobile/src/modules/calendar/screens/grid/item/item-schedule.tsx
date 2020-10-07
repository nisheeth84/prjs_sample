import React from 'react'
import { View } from "react-native";
import { DataOfSchedule } from '../../../api/common'
import { LocalNavigation, ItemTypeSchedule } from '../../../constants'
import { dateShowSelector } from "../../../calendar-selector";
import { useSelector } from "react-redux";


import { RenderMilestone } from './render-milestone'
import { RenderTask } from './render-task'
import { RenderSchedule } from './render-schedule'
import moment from 'moment'


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
export const ItemSchedule = React.memo((props: IItemScheduleProp) => {

  const dateShow =  useSelector(dateShowSelector)
  const renderObject = (schedule: DataOfSchedule) => {
    // const onOkUpdateSchedule = (flagUpdate) => {
    //   schedule.updateFlag = flagUpdate
    //   props.updateSchedule(schedule);
    //   props.handleReloadData(props.typeShowGrid, schedule)
    //   setShowPopupConfirm(false)
    // }
    // const onOkUpdateTask = (flagUpdate) => {
    //   schedule.updateFlag = flagUpdate
    //   props.updateTask(schedule);
    //   props.handleReloadData(props.typeShowGrid, schedule)
    //   setShowPopupConfirm(false)
    // }
    // const onOkUpdateMileStone = (flagUpdate) => {
    //   schedule.updateFlag = flagUpdate
    //   props.updateMileStone(schedule);
    //   props.handleReloadData(props.typeShowGrid, schedule)
    //   setShowPopupConfirm(false)
    // }
    if (schedule.itemType === ItemTypeSchedule.MILESTONE &&  moment(schedule.finishDate).format("DD") === moment(dateShow).format("DD") ) {
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
            />
        </>
      );
    }

    if (schedule.itemType === ItemTypeSchedule.TASK) {
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
    if (schedule.itemType === ItemTypeSchedule.SCHEDULE) {
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

/**
 * Render blank layout
 */
  const renderBlankObject = () => {
    return (
      <View>
      </View>
    )
  }

  return (
    <>
      {
        props.dataOfSchedule.isShow ?
          (
            renderObject(props.dataOfSchedule)
          )
          :
          (renderBlankObject())
      }
    </>
  )
})


