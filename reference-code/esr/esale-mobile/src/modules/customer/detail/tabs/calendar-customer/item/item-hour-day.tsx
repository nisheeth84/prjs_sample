import React from 'react';
import { DataOfDay, DataOfSchedule } from '../type';
import { ItemScheduleInDay } from './item-schedule-in-day';
import { View } from 'react-native';
import { styles } from './style';

/**
 * item in hour
 * @param props data from props
 */
export const InHourTdGridDay = (props: any) => {
  /**
   * render Item In Day
   * @param dataOfDay
   */
  const renderTdInDay = (dataOfDay: DataOfDay) => {
    return (
      <>
        {dataOfDay.listSchedule &&
          dataOfDay.listSchedule.map((s: DataOfSchedule) => {
            return <ItemScheduleInDay key={s.uniqueId} dataOfSchedule={s} />;
          })}
      </>
    );
  };
  return (
    <View style={[styles.itemRight, styles.itemRight_v2]}>
      {props.tdData && renderTdInDay(props.tdData)}
      <View style={[styles.itemRight, styles.itemRight_v2]}>
        <View style={styles.itemEventDay} />
      </View>
    </View>
  );
};
