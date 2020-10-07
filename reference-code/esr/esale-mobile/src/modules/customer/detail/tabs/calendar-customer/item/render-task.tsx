import React from 'react';
import { ItemCalendar } from './item-calendar';
import { DataOfSchedule } from '../type';
import { View, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { styles } from './style';
import { TaskStatus } from '../../../../../../config/constants/enum-calendar';

interface IRenderTask {
  dataOfSchedule: DataOfSchedule;
  localNavigation: object;
  className?: string;
  prefixKey: string;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  showArrow?: boolean;
}

enum StyleTitle {
  taskCompletedTextColor = '#666666',
  fontWeightText = '700',
  backgroundCompletedViewColor = '#EEEEEE',
  backgroundOverViewColor = '#EAFFD0',
  backgroundNomalViewColor = '#DEC6C6',
  taskOverTextColor = '#F92525',
}

/**
 * render component of task
 * @param props
 */
export const RenderTask = (props: IRenderTask) => {
  const styleTitleOfTask: any = { color: '', fontWeight: 'normal' };
  const styleViewOfTask = { backgroundColor: '' };

  if (props.dataOfSchedule.taskStatus === TaskStatus.completed) {
    styleTitleOfTask.color = StyleTitle.taskCompletedTextColor;
    styleTitleOfTask.fontWeight = StyleTitle.fontWeightText;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundCompletedViewColor;
  } else if (props.dataOfSchedule?.taskStatus === TaskStatus.overdue) {
    styleTitleOfTask.color = StyleTitle.taskOverTextColor;
    styleTitleOfTask.fontWeight = StyleTitle.fontWeightText;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundOverViewColor;
  } else {
    styleTitleOfTask.color = StyleTitle.taskOverTextColor;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundNomalViewColor;
  }

  /**
   * render title task
   * @param schedule
   */
  const renderTaskTitle = (schedule: DataOfSchedule) => {
    if (schedule.isParticipantUser || schedule.isPublic) {
      return (
        <Text
          style={[styles.txtDt, styles.fBold, styleTitleOfTask]}
          numberOfLines={1}
        >
          {schedule.itemName}
        </Text>
      );
    }
    return <></>;
  };

  /**
   * check render modal task detail
   */
  const renderModalTaskDetail = (item: DataOfSchedule) => {
    Alert.alert('Notify', `task_${item.itemName}`);
  };

  const isViewDetail: boolean = ItemCalendar.isViewDetailSchedule(
    props.dataOfSchedule
  );

  /**
   * render task
   * @param schedule
   */
  const renderTask = (schedule: DataOfSchedule) => {
    const taskNormalIcon = require('../../../../../../../assets/icons/ic-type-task.png');
    const taskCompletedIcon = require('../../../../../../../assets/icons/ic-type-task-complete.png');
    const taskDeleteIcon = require('../../../../../../../assets/icons/ic-type-task-expired.png');

    const styleSchedule = {
      width: '94%',
      height: props.height,
      zIndex: 1,
    };

    if (schedule.taskStatus === TaskStatus.completed) {
      return (
        <TouchableOpacity
          onPress={() => {
            isViewDetail && renderModalTaskDetail(props.dataOfSchedule);
          }}
          style={[
            styles.itemEventCt,
            styleSchedule,
            { backgroundColor: '#E3E3E3' },
          ]}
        >
          <View style={styles.dt}>
            <Image style={styles.icon} source={taskCompletedIcon}></Image>
            {renderTaskTitle(schedule)}
          </View>
        </TouchableOpacity>
      );
    }
    if (schedule.taskStatus === TaskStatus.overdue) {
      return (
        <TouchableOpacity
          onPress={() => {
            isViewDetail && renderModalTaskDetail(props.dataOfSchedule);
          }}
          style={[styles.itemEventCt, styleSchedule]}
        >
          <View style={styles.dt}>
            <Image style={styles.icon} source={taskDeleteIcon}></Image>
            {renderTaskTitle(schedule)}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => {
          isViewDetail && renderModalTaskDetail(props.dataOfSchedule);
        }}
        style={[
          styles.itemEventCt,
          styleSchedule,
          { backgroundColor: '#ADE4C9' },
        ]}
      >
        <View style={styles.dt}>
          <Image style={styles.icon} source={taskNormalIcon}></Image>
          {renderTaskTitle(schedule)}
        </View>
      </TouchableOpacity>
    );
  };

  return renderTask(props.dataOfSchedule);
};
