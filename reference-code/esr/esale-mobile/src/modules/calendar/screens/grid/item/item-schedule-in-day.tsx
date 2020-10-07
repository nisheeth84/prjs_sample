import React from 'react'
import { useSelector } from "react-redux";
import { localNavigationSelector } from "../../../calendar-selector";

import { DataOfSchedule } from '../../../api/common'
import { ItemTypeSchedule, HIGHT_OF_TD_IN_HOUR_WEEK_VIEW } from '../../../constants'
import { RenderMilestone } from './render-milestone'
import { RenderTask } from './render-task'
import { RenderSchedule } from './render-schedule'
import { View } from 'react-native'
import moment from 'moment'
// import { DummyDataOfSchedule } from '../../../assets/dummy-data-for-grid'
/**
 *  type ItemScheduleInDayProp
 */
type IItemScheduleInDayProp = {
  dataOfSchedule?: DataOfSchedule,
  key: any,
  source?: any,
  drag?: any,
}

/**
 * render component item schedule in day
 * @param props 
 */
export const ItemScheduleInDay = React.memo((props: IItemScheduleInDayProp) => {
  const localNavigation = useSelector(localNavigationSelector)
  // const localNavigation = new DummyDataOfSchedule().createLocalNavigation()
  const sTop = (HIGHT_OF_TD_IN_HOUR_WEEK_VIEW / 60) * moment(props.dataOfSchedule!.startDateSortMoment).minute() ;
  // const sHeight = (HIGHT_OF_TD_IN_HOUR_WEEK_VIEW / 60) * (props.dataOfSchedule!.height || 0);

  const styleSchedule = {
    top: sTop,
    // left: (props.dataOfSchedule!.left || 0) + '%',
    width: (props.dataOfSchedule!.width || 0) + '%',
    height: 50,
    zIndex: 2,
   
  };
/**
 * render item Milestone, Task, Schedule
 * @param schedule 
 */
  const renderObject = (schedule: DataOfSchedule) => {
    if (schedule.itemType === ItemTypeSchedule.MILESTONE) {
      return (
        <>
          <RenderMilestone
            dataOfSchedule={schedule}
            prefixKey={'item-Milestone'}
            localNavigation={localNavigation}

            width={'100%'}
            left={'0%'}
            top={'0'}
            height={'100%'}
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
            localNavigation={localNavigation}

            width={'100%'}
            left={'0%'}
            top={'0'}
            height={'100%'}
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
          localNavigation={localNavigation}

          formatNormalStart={'HH:mm'}
          formatNormalEnd={'HH:mm'}

          width={'100%'}
          left={'0%'}
          top={'0'}
          height={'100%'}

          modeInHour={true}
        />
      </>  
    );
    }
    return(<></>)
  }
  return (
    <View style={[{}, styleSchedule]} >
      {renderObject(props.dataOfSchedule ? props.dataOfSchedule : {})}
    </View>
  )
})
