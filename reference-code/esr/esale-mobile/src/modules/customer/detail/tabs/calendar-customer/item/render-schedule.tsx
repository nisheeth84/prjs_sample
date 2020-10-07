import React from 'react';
import { Text, View, Image, Alert } from 'react-native';
import { DataOfSchedule } from '../type';
import { ItemCalendar } from './item-calendar';
import { styles } from './style';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ViewPermission, TaskStatus } from '../../../../../../config/constants/enum-calendar';


interface RenderSchedule {
  dataOfSchedule: DataOfSchedule;
  localNavigation: object;
  prefixKey: string;
  className?: string;

  formatNormalStart?: string;
  formatNormalEnd?: string;

  formatFullDayStart?: string;
  formatFullDayEnd?: string;

  formatOverDayStart?: string;
  formatOverDayEnd?: string;

  top?: string;
  left?: string;
  width?: string;
  height?: string;

  showArrow?: boolean;

  modeInHour?: boolean;
}

/**
 * render component schedule common for view list and view day
 * @param props
 */
export const RenderSchedule = (props: RenderSchedule) => {
  const plan = ItemCalendar.getPlanOfSchedule(
    props.dataOfSchedule,
    props.modeInHour
  );
  const styleTitle = {
    color: '',
    textDecorationLine: {},
    backgroundColor: {},
  };

  // let classContent = 'calendar-schedule-content';
  if (plan.isDashLine === ViewPermission.Available) {
    styleTitle.textDecorationLine = styles.lineThrough;
  }

  if (props.dataOfSchedule.isReportActivity) {
    styleTitle.backgroundColor = '#EEEEEE';
  }
  /**
   * render title of schedule
   * @param schedule
   */
  const renderScheduleTitle = (schedule: DataOfSchedule) => {
    return (
      <Text
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={[
          styles.txtDt,
          {
            textDecorationLine:
              schedule.taskStatus === TaskStatus.overdue
                ? 'line-through'
                : 'none',
          },
        ]}
      >
        {schedule.itemName}
      </Text>
    );
  };
  const isViewDetail: boolean = ItemCalendar.isViewDetailSchedule(
    props.dataOfSchedule
  );

  /**
   * render time of schedule
   * @param schedule
   */
  const renderScheduleTime = (schedule: DataOfSchedule) => {
    const renderTime = (formatStart?: string, formatEnd?: string) => {
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.txtDt,
            {
              textDecorationLine:
                schedule.taskStatus === TaskStatus.overdue
                  ? 'line-through'
                  : 'none',
            },
          ]}
        >
          {formatStart &&
            moment(schedule.startDateMoment).format(formatStart || 'HH:mm')}
          {formatStart && formatEnd && <>〜</>}
          {formatEnd &&
            moment(schedule.finishDateMoment).format(formatEnd || 'HH:mm')}
        </Text>
      );
    };
    if (plan.isViewTime === ViewPermission.Available) {
      if (props.modeInHour) {
        return renderTime(props.formatNormalStart, props.formatNormalEnd);
      }
      if (schedule.isOverDay) {
        return renderTime(props.formatOverDayStart, props.formatOverDayEnd);
      } else if (schedule.isFullDay) {
        return renderTime(props.formatFullDayStart, props.formatFullDayEnd);
      }
      return renderTime(props.formatNormalStart, props.formatNormalEnd);
    } else {
      return <></>;
    }
  };

  /**
   * render icon of schedule
   * @param schedule
   */
  const renderScheduleIcon = (schedule: DataOfSchedule) => {
    return plan.isViewIcon === ViewPermission.Available && schedule.itemIcon ? (
      <Image style={styles.icon} source={schedule.itemIcon} />
    ) : null;
  };

  const renderModalTaskDetail = (item: DataOfSchedule) => {
    Alert.alert('Notify', `task_${item.itemName}`);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        isViewDetail && renderModalTaskDetail(props.dataOfSchedule);
      }}
    >
      <View style={styles.itemEventCts}>
        <View style={[styles.dt]}>
          {renderScheduleIcon(props.dataOfSchedule)}
          {renderScheduleTitle(props.dataOfSchedule)}
        </View>
        {renderScheduleTime(props.dataOfSchedule)}
      </View>
    </TouchableOpacity>
  );
};
