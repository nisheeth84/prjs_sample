import React from 'react';
import { Text, View } from 'react-native';
import {
  DataOfDay,
  DataOfSchedule,
  DataOfResource,
  DataHeader,
} from '../type';
import { CalenderViewCommon } from '../calendar-util';
import { styles } from './style';
import { ItemCalendarInList } from './item-schedule-in-list';
import moment from 'moment';
import { messages } from '../calendar-list-messages';
import { translate } from '../../../../../../config/i18n';

interface IItemList {
  dataOfDay: DataOfDay;
  preKey?: any;
}

/**
 * Component of item in grid list
 * @param props
 */
export const ItemList = (props: IItemList) => {
  const nowDate = moment(new Date());
  let isDrawCurrentLine = false;

  /**
   * check holiday
   * @param d
   */
  const isHoliday = (d: DataHeader) => {
    return !!d.isHoliday || !!d.isCompanyHoliday;
  };

  /**
   * render multi language date name
   * @param date
   */
  const renderLangDateName = (date: string) => {
    const dateMoment = moment(date);
    switch (dateMoment.weekday()) {
      case 0:
        return `${translate(messages.monday)}`;
      case 1:
        return `${translate(messages.tuesday)}`;
      case 2:
        return `${translate(messages.wednesday)}`;
      case 3:
        return `${translate(messages.thursday)}`;
      case 4:
        return `${translate(messages.friday)}`;
      case 5:
        return `${translate(messages.saturday)}`;
      case 6:
        return `${translate(messages.sunday)}`;
      default:
        return '';
    }
    // re
  };

  /**
   * render current line
   */
  const renderCurrentLine = () => {
    return (
      <View style={styles.eventActive}>
        <View style={styles.lineActive}> 
          <View style={[styles.dot, styles.dotActive]}></View>
        </View>
      </View>
    );
  };

  /**
   * check condition to draw current line
   * @param s
   */
  const checkDrawCurrentLine = (s?: DataOfSchedule | DataOfResource) => {
    if (
      CalenderViewCommon.compareDateByDay(
        nowDate,
        moment(props.dataOfDay.dataHeader.dateMoment)
      ) === 0
    ) {
      if (!!!s) return true; // last row
      const nowHour = nowDate.hour();
      const sHour = moment(s.startDateMoment).hour();
      if (sHour > nowHour && !isDrawCurrentLine) {
        isDrawCurrentLine = true;
        return true;
      }
    }
    return false;
  };

  /**
   * render header line of day which have data
   */
  const renderHeaderLine = () => {
    const styleColorHoliday = isHoliday(props.dataOfDay.dataHeader)
      ? styles.colorRed
      : {};
    const styleColorWeekend = props.dataOfDay.dataHeader.isWeekend
      ? styles.colorRed
      : {};
    const styleCurrent =
      CalenderViewCommon.compareDateByDay(
        nowDate,
        moment(props.dataOfDay.dataHeader.dateMoment)
      ) === 0
        ? { backgroundColor: '#0F6DB3' }
        : {};
    const styleTextCurrent =
      CalenderViewCommon.compareDateByDay(
        nowDate,
        moment(props.dataOfDay.dataHeader.dateMoment)
      ) === 0
        ? { color: '#fff' }
        : {};
    const dateNameLang = renderLangDateName(
      props.dataOfDay.dataHeader.dateMoment
    );

    return (
      <View style={styles.itemLeft}>
        <Text style={[styles.txtDate, styles.txtDateTop, styleColorWeekend]}>
          {dateNameLang}
        </Text>
        <View
          style={[styles.numDate, styleColorHoliday, styleCurrent]}
        >
          <Text style={[styles.date, styleTextCurrent]}>
            {moment(props.dataOfDay.dataHeader.dateMoment).format('DD')}
          </Text>
        </View>
        <Text style={[styles.txtDate]}>
          {
            props.dataOfDay.dataHeader.perpetualCalendar}
        </Text>
      </View>
    );
  };

  /**
   * render item calendar in list
   */
  const renderItemCalendarInList = () => {
    return (
      <>
        {props.dataOfDay.listSchedule &&
          props.dataOfDay.listSchedule.map(
            (data: DataOfSchedule, index: number) => {
              return (
                <View
                  style={styles.itemEventList}
                  key={`ItemCalendarInList${index}_${data.itemId}`}
                >
                  {checkDrawCurrentLine(data) && renderCurrentLine()}
                  <ItemCalendarInList dataOfSchedule={data} />
                </View>
              );
            }
          )}
        {!isDrawCurrentLine && checkDrawCurrentLine() && renderCurrentLine()}
      </>
    );
  };

  return (
    <View style={styles.item} key={props.preKey}>
      {(props.dataOfDay?.listSchedule &&
        props.dataOfDay.listSchedule.length > 0) ||
      (props.dataOfDay.listResource &&
        props.dataOfDay.listResource.length > 0) ? (
        renderHeaderLine()
      ) : (
        <></>
      )}
      <View style={styles.itemRight}>{renderItemCalendarInList()}</View>
    </View>
  );
};
