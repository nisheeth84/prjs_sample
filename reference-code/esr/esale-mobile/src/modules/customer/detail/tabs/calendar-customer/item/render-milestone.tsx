import React from 'react';
import { DataOfSchedule } from '../type';
import { ItemCalendar } from './item-calendar';
import { Image, Text, Alert } from 'react-native';
import { styles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskMilestone } from '../../../../../../config/constants/enum-calendar';

interface IRenderMilestone {
  dataOfSchedule: DataOfSchedule;
  localNavigation: any;
  className?: string;
  prefixKey: string;
  styleContainer?: object;
  top?: string;
  left?: string;
  width?: string;
  height?: string;

  showArrow?: boolean;
}

/**
 * component render common for milestone
 * @param props
 */
export const RenderMilestone = (props: IRenderMilestone) => {
  /**
   * render icon milestone
   * @param schedule
   */
  const renderMilestoneIcon = (schedule: DataOfSchedule) => {
    const MilestoneNormalIcon = require('../../../../../../../assets/icons/ic-flag-green.png');
    const MilestoneCompletedIcon = require('../../../../../../../assets/icons/ic-flag-completed.png');
    const MilestoneDeleteIcon = require('../../../../../../../assets/icons/ic-flag-red.png');
    let src = MilestoneNormalIcon;
    if (schedule.milestoneStatus === TaskMilestone.completed) {
      src = MilestoneCompletedIcon;
    }
    if (schedule.milestoneStatus === TaskMilestone.overdue) {
      src = MilestoneDeleteIcon;
    }

    return <Image style={styles.icon} source={src}></Image>;
  };

  /**
   * render title milestone
   * @param schedule
   */
  const renderMilestoneTitle = (schedule: DataOfSchedule) => {
    if (ItemCalendar.isViewDetailMilestone(schedule)) {
      const styleTitle = { color: '' };
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.txtDt, styles.fBold, styleTitle]}
        >
          {schedule.itemName}
        </Text>
      );
    } else {
      return;
    }
  };
  const isViewDetail: boolean = ItemCalendar.isViewDetailMilestone(
    props.dataOfSchedule
  );
  /**
   * render milestone
   * @param schedule
   */
  const renderMilestone = (schedule: DataOfSchedule) => {
    const styleSchedule = {
      width: props.width,
      height: props.height,
      zIndex: 1,
    };

    return (
      <TouchableOpacity
        onPress={() => {
          isViewDetail &&
            Alert.alert('Notify', `milestone_${schedule.itemName}`);
        }}
        style={[
          styles.itemMilestone,
          styles.itemEvent,
          styleSchedule,
          props.styleContainer,
        ]}
      >
        {renderMilestoneIcon(schedule)}
        {renderMilestoneTitle(schedule)}
      </TouchableOpacity>
    );
  };

  return renderMilestone(props.dataOfSchedule);
};
