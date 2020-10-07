import React from 'react';
import { ColorType, ColorValue } from './constant';
import { ItemCalendar } from './item-calendar';
import { DataOfSchedule } from '../../../api/common';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Images } from '../../../config';
import styles from '../../../calendar-style';
import { GetLocalNavigation } from '../../../api/get-local-navigation-type';
import { truncateString, normalize } from '../../../common/helper';
import { STRING_TRUNCATE_LENGTH } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { TaskStatus } from '../../grid/item/constant';

interface IRenderTask {
  dataOfSchedule: DataOfSchedule;
  localNavigation: GetLocalNavigation;
  className?: string;
  prefixKey: string;

  top?: string;
  left?: string;
  width?: string;
  height?: string;
  showArrow?: boolean;
  modeInList?: boolean;
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
export const RenderTask = React.memo((props: IRenderTask) => {
  const styleTitleOfTask = { color: '', fontWeight: 'normal' };
  const styleViewOfTask = { backgroundColor: '' };
  const navigation = useNavigation();

  if (props.dataOfSchedule.taskStatus === TaskStatus.completed) {
    styleTitleOfTask.color = StyleTitle.taskCompletedTextColor;
    styleTitleOfTask.fontWeight = StyleTitle.fontWeightText;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundCompletedViewColor;
  } else if (props.dataOfSchedule?.taskStatus === TaskStatus.overdue) {
    styleTitleOfTask.color = StyleTitle.taskOverTextColor;
    styleTitleOfTask.fontWeight = StyleTitle.fontWeightText;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundOverViewColor;
  } else {
    styleTitleOfTask.color = StyleTitle.taskCompletedTextColor;
    styleViewOfTask.backgroundColor = StyleTitle.backgroundNomalViewColor;
  }

  let bgColor = '';
  // const borderColor = ItemCalendar.getColor(ColorType.Auto, props.dataOfSchedule, props.localNavigation);
  if (props.dataOfSchedule?.isReportActivity) {
    bgColor = ColorValue.Grey;
    styleViewOfTask.backgroundColor = ColorValue.Grey;
  } else {
    bgColor = ItemCalendar.getColor(
      ColorType.Auto,
      props.dataOfSchedule,
      props.localNavigation
    );
  }

  /**
   * render icon task
   * @param schedule
   */
  const renderTaskIcon = (schedule: DataOfSchedule) => {
    const taskNormalIcon = Images.schedule.ic_type_task;
    const taskCompletedIcon = Images.schedule.ic_type_task_complete;
    const taskDeleteIcon = Images.schedule.ic_type_task_expired;
    let src = taskNormalIcon;
    if (schedule.taskStatus === TaskStatus.completed) {
      src = taskCompletedIcon;
    }
    if (schedule.taskStatus === TaskStatus.overdue) {
      src = taskDeleteIcon;
    }
    return <Image style={styles.icon} source={src}></Image>;
  };

  /**
   * render title task
   * @param schedule
   */
  const renderTaskTitle = (schedule: DataOfSchedule) => {
    if (ItemCalendar.isViewDetailTask(schedule)) {
      const styleTitle = { color: '' };

      {
        schedule.taskStatus == '02'
          ? (styleTitle.color = ItemCalendar.getColor(
              ColorType.Red,
              schedule,
              props.localNavigation
            ))
          : (styleTitle.color = ItemCalendar.getColor(
              ColorType.Black,
              schedule,
              props.localNavigation
            ));
      }
      return (
        <Text
          style={[styles.txtDt, styles.fBold, styleTitle, styleTitleOfTask]}
        >
          {truncateString(schedule.itemName, STRING_TRUNCATE_LENGTH.LENGTH_60)}
        </Text>
      );
    }
    return <></>;
  };

  /**
   * check render modal task detail
   */
  const renderModalTaskDetail = (item: DataOfSchedule) => {
    // Alert.alert("Notify", `task_${item.itemName}`)
    navigation.navigate('task-detail', { taskId: item.itemId });
  };

  const isViewDetail: boolean = ItemCalendar.isViewDetailSchedule(
    props.dataOfSchedule
  );

  /**
   * render task
   * @param schedule
   */
  const renderTask = (schedule: DataOfSchedule) => {
    const styleSchedule = {
      // top: props.top || '',
      // left: props.left || '',
      width: props.width || ItemCalendar.getWidthOfObject(schedule) + '%',
      height: props.height,
      zIndex: 1,
    };
    const styleContent = {
      backgroundColor: bgColor,
    };

    return (
      <TouchableOpacity
        onPress={() => {
          isViewDetail && renderModalTaskDetail(props.dataOfSchedule);
        }}
      >
        {props.modeInList ? (
          <View
            style={[
              styles.itemEventCt,
              styleSchedule,
              { height: normalize(27), marginTop: normalize(5)},
              styleContent,
            ]}
          >
            <View style={[styles.dt]}>
              {renderTaskIcon(schedule)}
              {renderTaskTitle(schedule)}
            </View>
          </View>
        ) : (
          <View
            style={[
              { height: normalize(20) },
              styles.itemEventCt,
              styleSchedule,
              styleContent,
            ]}
          >
            <View style={[styles.dt]}>
              {renderTaskIcon(schedule)}
              {renderTaskTitle(schedule)}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  return renderTask(props.dataOfSchedule);
});
