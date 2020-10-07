import * as React from 'react';
import { DataOfSchedule } from '../type';
import { CalenderViewCommon } from '../calendar-util';
import { RenderSchedule } from './render-schedule';
import { RenderTask } from './render-task';
import { RenderMilestone } from './render-milestone';
import moment from 'moment';
import { DummyDataOfSchedule } from '../api/dummy-data-for-grid';
import { ItemTypeSchedule } from '../../../../../../config/constants/calendar';

interface IItemCalendarInList {
  dataOfSchedule: DataOfSchedule;
}

/**
 * render item calendar in list
 * @param props
 */
export const ItemCalendarInList = (props: IItemCalendarInList) => {
  // const localNavigation = useSelector(localNavigationSelector)

  const localNavigation = new DummyDataOfSchedule().createLocalNavigation();

  /**
   * render schedule
   * @param schedule
   * @param index
   */
  const renderSchedule = (schedule: DataOfSchedule, index: number) => {
    let formatOverDayStart = 'YYYY/MM/DD HH:mm';
    let formatOverDayEnd = 'YYYY/MM/DD HH:mm';
    if (
      schedule.isOverDay &&
      CalenderViewCommon.compareDateByDay(
        moment(schedule.startDateSortMoment),
        moment(schedule.startDateMoment)
      ) === 0
    ) {
      formatOverDayStart = 'HH:mm';
    }
    if (
      schedule.isOverDay &&
      CalenderViewCommon.compareDateByDay(
        moment(schedule.startDateSortMoment),
        moment(schedule.finishDateMoment)
      ) === 0
    ) {
      formatOverDayEnd = 'HH:mm';
    }
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <RenderMilestone
          prefixKey={index + '_' + 'item-milestone-view-more'}
          key={index + '_' + schedule.uniqueId}
          dataOfSchedule={schedule}
          localNavigation={localNavigation}
        />
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Task) {
      return (
        <RenderTask
          prefixKey={index + '_' + 'item-task-view-more'}
          key={index + '_' + schedule.uniqueId}
          dataOfSchedule={schedule}
          localNavigation={localNavigation}
        />
      );
    }

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
      />
    );
  };

  return <>{renderSchedule(props.dataOfSchedule, 0)}</>;
};
