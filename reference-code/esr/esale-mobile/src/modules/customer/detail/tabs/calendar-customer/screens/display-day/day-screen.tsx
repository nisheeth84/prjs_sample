import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator
} from 'react-native';
import { styles } from './style';
import moment from 'moment';
import { calendarActions } from '../../calendar-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { DataOfDetailWeek, HourOfDay } from '../../type';
import { CalenderViewWeekList } from '../../calendar-util';
import { dataCalendarByDaySelector } from '../../calendar-selector';
import { ItemSchedule } from '../../item/item-schedule';
import { InHourTdGridDay } from '../../item/item-hour-day';
import AsyncStorage from "@react-native-community/async-storage";
import { images } from '../../../../../../../../assets/icons';
import { MAX_ITEM_FULL_DAY, STATUS_LAYOUT, DEFAULT_HOUR } from '../../../../../../../config/constants/calendar';
import { messages } from '../../../../../../menu/menu-messages';
import { translate } from '../../../../../../../config/i18n';
import { ID_TOKEN } from '../../../../../../../config/constants/constants';
import { getDataApiForByDay } from '../../api';

/**
 * Calendar By Day Screen
 */
export const CalendarByDayScreen = () => {
  const dispatch = useDispatch();
  const calendarByDay = useSelector(dataCalendarByDaySelector) || {};
  const calendarByDayHeader = calendarByDay.fullDaySchedule
    ? calendarByDay.fullDaySchedule[0].dataHeader
    : {};
  const [statusLayout, setStatusLayout] = useState({
    expanded: true,
    layout: STATUS_LAYOUT.LAYOUT,
    animation: new Animated.Value(STATUS_LAYOUT.ANIMATION),
    isVisible: false,
    icon_event: false,
    maxHeight: STATUS_LAYOUT.MAX_HEIGHT,
  });
  const [loading, setLoading] = useState(false);
  /**
   * get Data
   */
  const getData = async () => {
    setLoading(true);
    const old: DataOfDetailWeek = {};
    const paramFromDate = moment.utc(new Date()).format();
    const param = {
      date: paramFromDate,
    }
    const token: any = await AsyncStorage.getItem(ID_TOKEN);
    const response = await getDataApiForByDay(token, param);
    if(response.status === 200) {
      const data = CalenderViewWeekList.buildScheduleOfCalendarDay(
        old, 
        response.data,
        moment(),
        DEFAULT_HOUR.S_HOUR,
        DEFAULT_HOUR.E_HOUR
      );
      dispatch(calendarActions.getDataCalendarByDay({ dataCalendarByDay: data }));
      setLoading(false);
    }else {
      /**
       * show error
       */
    }
  };

  useEffect(() => {
   
    getData();
  }, []);

  /**
   * on_eventPress
   */
  const on_eventPress = () => {
    setStatusLayout({ ...statusLayout, icon_event: !statusLayout.icon_event });
  };

  /**
   * render item hour
   * @param item
   * @param index
   */
  const renderHour = ({ item, index }: { item: HourOfDay; index: number }) => {
    return (
      <View
        style={[
          styles.itemHour,
          { borderTopWidth: index === 0 ? 0 : 1, borderTopColor: '#E4E4E4' },
        ]}
        key={index}
      >
        <View style={[styles.toolLeft, styles.toolLeft_v2]}>
          <View style={[styles.itemLeft, { marginTop: 4 }]}>
            <View style={[styles.item_left_v2]}>
              <Text style={[styles.txtDate, styles.txtDateTop]}>
                {0 < index && index < calendarByDay.listHourSchedule.length
                  ? item.startHour
                  : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.itemRight, styles.itemRight_v2]}>
          {0 < index &&
            item.listDay.map((itemx, indexTd) => {
              return (
                <InHourTdGridDay
                  key={'td_in_hour_' + index + '_' + indexTd}
                  tdData={itemx}
                />
              );
            })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <View>
        {/* Render full day */}
        <View>
          <View
            style={[
              styles.item,
              styles.boxShadow,
              { paddingBottom: 3 },
              styles.minHeight60,
            ]}
          >
            {/* Full day left */}
            <View style={styles.toolLeft}>
              <View style={[styles.itemLeft, styles.item_more]}>
                <Text style={[styles.txtDate, styles.txtDateTop]}>
                  {calendarByDayHeader.dayName}
                </Text>
                <Text style={[styles.numDate]}>
                  {moment(calendarByDay.dateByDay).date()}
                </Text>
                <Text style={styles.txtDate}>
                  {[
                    <Text
                      key={1}
                      style={[styles.txtDate, { color: '#B91C1C' }]}
                    >
                      {calendarByDayHeader.companyHolidayName
                        ? calendarByDayHeader.companyHolidayName
                        : calendarByDayHeader.holidayName}
                    </Text>,
                    ',',
                  ]}
                  {calendarByDayHeader.perpetualCalendar}
                </Text>
              </View>
              {
                calendarByDay?.listHourSchedule?.lenght >= 2 ? ( <TouchableOpacity
                  style={[styles.button_down, { width: '100%' }]}
                  onPress={() => on_eventPress()}
                >
                  <Image
                    source={!statusLayout.icon_event ? images.ic_arrow_down : images.ic_arrow_up}
                  />
                </TouchableOpacity>) : null
              }
              
            </View>
            {/* Full day right */}
            <View style={styles.itemRight}>
              {calendarByDay.fullDaySchedule &&
                calendarByDay.fullDaySchedule.map((td: any, idx: number) => {
                  return (
                    <View key={idx} style={{ marginTop: 10 }}>
                      {/* show full */}
                      {statusLayout.icon_event &&
                        td.listSchedule.map((s: any) => {
                          return (
                            <ItemSchedule
                              key={s.uniqueId}
                              dataOfSchedule={s}
                              formatNormalStart={'HH:mm'}
                              formatOverDayStart={'HH:mm'}
                            />
                          );
                        })}
                      {/*  Show mini */}
                      {!statusLayout.icon_event &&
                        td.listSchedule.map((s: any, idx1: any) => {
                          if (idx1 < MAX_ITEM_FULL_DAY.MAX) {
                            return (
                              <ItemSchedule
                                key={s.uniqueId}
                                dataOfSchedule={s}
                                formatNormalStart={'HH:mm'}
                                formatOverDayStart={'HH:mm'}
                              />
                            );
                          } else {
                            return <></>;
                          }
                        })}
                      {!statusLayout.icon_event &&
                        td.listSchedule.length > MAX_ITEM_FULL_DAY.MAX && (
                          <TouchableOpacity onPress={() => on_eventPress()}>
                            <View style={[styles.text_bottom]}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={[styles.txtDt]}
                              >
                                {translate(messages.moreCalendarFullDay01)}
                                {td.listSchedule.length - MAX_ITEM_FULL_DAY.MAX}
                                {translate(messages.moreCalendarFullDay02)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
        {/* Render Hour */}
        {calendarByDay.listHourSchedule && (
          <FlatList
            data={calendarByDay.listHourSchedule}
            renderItem={renderHour}
            keyExtractor={(item, index) => {
              return `${item.startHour}${index}`;
            }}
            style={{ marginBottom: 100 }}
          />
        )}
      </View>
      {
        loading ? (
          <View style={{width: "100%", height: "100%", justifyContent: 'center', position: "absolute"}}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    </View>
  );
};
