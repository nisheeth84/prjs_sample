import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
} from 'react-native';
import { Style } from '../../../common';
import styles from './style';
import { Images } from '../../../config';
import { CalendarComponent } from '../item/calendar-component';
// import { DummyDataOfSchedule } from '../../../assets/dummy-data-for-grid';
import moment from 'moment';
import { calendarActions } from '../../../calendar-reducer';
import { useDispatch, useSelector } from 'react-redux';
import {
  CalenderViewWeekList,
  DataOfDetailWeek,
  HourOfDay,
  // CalenderViewCommon,
  DataHeader,
  DataOfResource,
  // DataOfDay
} from '../../../api/common';

import {
  dataCalendarByDaySelector,
  localNavigationSelector,
  dateShowSelector,
  tabFocusSelector,
} from '../../../calendar-selector';
import { ItemSchedule } from '../item/item-schedule';
import { InHourTdGridDay } from './in-hour-td-grid-day';
import {
  DEFAULT_HOUR,
  STATUS_LAYOUT,
  MAX_ITEM_FULL_DAY,
  CalendarView,
  TabFocus,
  HOUR_IN_DAY,
} from '../../../constants';
import {
  getDataApiOfDaySchedule,
  getDataApiOfDayResource,
} from '../../../calendar-repository';
import { translate } from '../../../../../config/i18n';
import { messages } from '../../../calendar-list-messages';
import GestureRecognizer from 'react-native-swipe-gestures';
import { ItemResource } from '../item/item-resource';
// import { checkResponse } from '../../../common/helper';
import { checkResponse, normalize } from '../../../common/helper';
/**
 * Calendar By Day Screen
 */
export const CalendarByDayScreen = React.memo(() => {
  const dispatch = useDispatch();
  const calendarByDay = useSelector(dataCalendarByDaySelector) || {};
  const calendarByDayHeader = calendarByDay.fullDaySchedule
    ? calendarByDay.fullDaySchedule[0].dataHeader
    : {};
  const calendarByDayResource = calendarByDay.fullDayResource
    ? calendarByDay.fullDayResource[0].dataHeader
    : {};
  const localNavigation = useSelector(localNavigationSelector || {});

  // console.log('1111111111', calendarByDayHeader)

  const dateShow = useSelector(dateShowSelector);
  const tabFocus = useSelector(tabFocusSelector);
  const [statusLayout, setStatusLayout] = useState({
    expanded: true,
    layout: STATUS_LAYOUT.LAYOUT,
    animation: new Animated.Value(STATUS_LAYOUT.ANIMATION),
    isVisible: false,
    icon_event: false,
    maxHeight: STATUS_LAYOUT.MAX_HEIGHT,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  // let listHour: HourOfDay[] = [];

  const checkData = calendarByDayHeader.itemList
    ? calendarByDayHeader.itemList.length 
    : {};
  // check swipe
  /**
   * get Data
   */
  const getData = (_date: string) => {
    const old: DataOfDetailWeek = {};
    // Data API
    setIsRefreshing(true);
    dispatch(calendarActions.setMessages({}));
    if (tabFocus === TabFocus.SCHEDULE)
     {
      getDataApiOfDaySchedule(moment(_date), localNavigation)
        .then((dataResponse) => {
          const dataCheck = checkResponse(dataResponse);
          if (dataCheck.result) {
            const data = 
             CalenderViewWeekList.buildScheduleOfCalendarDay(
                    old,
                    dataResponse?.data,
                    moment(),
                    DEFAULT_HOUR.S_HOUR,
                    DEFAULT_HOUR.E_HOUR
                  )
            dispatch(
              calendarActions.getDataCalendarByDay({ dataCalendarByDay: data })
            );
          } else {
            dispatch(
              calendarActions.setMessages({ messages: dataCheck.messages })
            );
          }
          setIsRefreshing(false);
        })
        .catch(() => {});
    } else {
      getDataApiOfDayResource(moment(_date), localNavigation)
        .then((dataResponse) => {
          const dataCheck = checkResponse(dataResponse);
          if (dataCheck.result) {
            const data = CalenderViewWeekList.buildResourceOfCalendarDay(
                              old,
                              dataResponse?.data,
                              moment(),
                              DEFAULT_HOUR.S_HOUR,
                              DEFAULT_HOUR.E_HOUR
                         );
               
            dispatch(
              calendarActions.getDataCalendarByDay({ dataCalendarByDay: data })
            );
          } else {
            dispatch(
              calendarActions.setMessages({ messages: dataCheck.messages })
            );
          }
          setIsRefreshing(false);
        })
        .catch(() => {});
    }
  };

  // Data Dummy
  //   const dummyData = tabFocus === TabFocus.SCHEDULE
  //       ? new DummyDataOfSchedule().createDataOfDay(moment())
  //       : new DummyDataOfSchedule().createDataOfDayResource(moment());
  //   const data = tabFocus === TabFocus.SCHEDULE
  //       ? CalenderViewWeekList.buildScheduleOfCalendarDay(
  //           old,
  //           dummyData,
  //           moment(),
  //           DEFAULT_HOUR.S_HOUR,
  //           DEFAULT_HOUR.E_HOUR
  //       )
  //       : CalenderViewWeekList.buildResourceOfCalendarDay(
  //           old,
  //           dummyData,
  //           moment(),
  //           DEFAULT_HOUR.S_HOUR,
  //           DEFAULT_HOUR.E_HOUR
  //       );
  //   dispatch(calendarActions.getDataCalendarByDay({ dataCalendarByDay: data }));
  //   setTimeout(() => {
  //       setIsRefreshing(false);
  //   }, 1000)
  // };

  useEffect(() => {
    getData(dateShow);
  }, [dateShow, tabFocus, localNavigation]);

  /**
   * Refresh List today
   */
  const onRefresh = (date: string) => {
    // const now = moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
    // getData(now);
    dispatch(
      calendarActions.onChangeDateShow({
        dateShow: date,
      })
    );
  };

  /**
   * on_eventPress
   */
  const on_eventPress = () => {
    setStatusLayout({ ...statusLayout, icon_event: !statusLayout.icon_event });
  };
  const nowDate = moment(new Date());
  const nowTime = nowDate.add(6, 'h').utc().format("HH:00")

  const renderCurrentLine = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: -normalize(3),
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: -normalize(5),
          marginBottom: -normalize(moment().minute() * 0.85),
          zIndex: 50
        }}
      >
        <View style={styles.lineActive}>
          <View style={[styles.dot, styles.dotActive]}></View>
        </View>
      </View>
    );
  };

  /**
   * render item hour
   * @param item
   * @param index
   */
  const renderHour = ({ item, index }: { item: HourOfDay; index: number }) => {
    return (
      <View style={[styles.itemHour, styles.item_v2]} key={index}>
        <View style={[styles.toolLeft, styles.toolLeft_v2]}>
          <View style={[styles.itemLeft, styles.mgt_4]}>
            <View style={[styles.item_left_v2]}>
              <Text style={[styles.txtDate, styles.txtDateTop]}>
                {0 <= index && index < HOUR_IN_DAY ? item.startHour : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.itemRight, styles.itemRight_v2]}>
          {item.listDay.map((item_: any, indexTd) => {
            return (
              <InHourTdGridDay
                key={'td_in_hour_' + index + '_' + indexTd}
                tdData={item_}
              />
            );
          })}
           {((moment().format('DD-MM').toString()) == `${calendarByDayHeader.dateByDay || calendarByDayResource.dateByDay}-${calendarByDayHeader.monthInYear || calendarByDayResource.monthInYear}` )  ?
            ( nowTime == item.startHour  ? renderCurrentLine() : <></>)
             :
          <></>
         }
        </View>
      </View>
    );
  };

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

  enum enum_day {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 0,
  }

  const renderLangDateName = (value: enum_day) => {
    switch (value) {
      case enum_day.MONDAY:
        return `${translate(messages.monday)}`;
      case enum_day.TUESDAY:
        return `${translate(messages.tuesday)}`;
      case enum_day.WEDNESDAY:
        return `${translate(messages.wednesday)}`;
      case enum_day.THURSDAY:
        return `${translate(messages.thursday)}`;
      case enum_day.FRIDAY:
        return `${translate(messages.friday)}`;
      case enum_day.SATURDAY:
        return `${translate(messages.saturday)}`;
      case enum_day.SUNDAY:
        return `${translate(messages.sunday)}`;
      default:
        return '';
    }
    // re
  };

  /**
   * reload data of grid
   */
  const handleReloadData = (date: string) => {
    dispatch(calendarActions.onChangeDateShow({ dateShow: date }));
  };
  // const [dateNow, setDateNow] = useState(moment());

  const styleColorHoliday =
    isHoliday(calendarByDayHeader) || isHoliday(calendarByDayResource)
      ? styles.colorRed
      : {};
  const styleColorWeekend =
    calendarByDayHeader.isWeekend || calendarByDayResource.isWeekend
      ? styles.colorRed
      : {};

  // const styleCurrent = CalenderViewCommon.compareDateByDay(moment(new Date()), moment(calendarByDayHeader.dateMoment)) === 1 ? { backgroundColor: '#0F6DB3', color: '#fff' } : {}
  const styleCurrent =
    `${calendarByDayHeader.dateByDay || calendarByDayResource.dateByDay}-${calendarByDayHeader.monthInYear || calendarByDayResource.monthInYear}` ===
    moment().format('DD-MM')
      ? { backgroundColor: '#0F6DB3', color: '#fff' }
      : {};
  const dateNameLang = renderLangDateName(moment(dateShow).day());

  const nameHoliday = calendarByDayHeader.companyHolidayName
    ? JSON.parse(calendarByDayHeader.companyHolidayName).ja_jp || JSON.parse(calendarByDayResource.companyHolidayName).ja_jp
    : '';
  const name_PerpetualCalendar =  calendarByDayHeader.perpetualCalendar || calendarByDayResource.perpetualCalendar ;
  const checkIconDown = calendarByDayHeader.itemList 
    ? calendarByDayHeader.itemList.length 
    : {};
  const covertData = () => {
    // var data: any = null;

    // data = {};

    //     var temp = {
    //         [moment(dateShow).format("YYYY-MM-DD")]: {
    //             isWeekend: false,
    //             // day: day,
    //             dots: [],
    //             selected: true,
    //         }
    //     }
    // data = Object.assign(data, temp);

    // var temp = {...data[dateShow], selected: true}
    // data = Object.assign(data, {[dateShow]:temp});
    // maker = Object.assign(maker, data);
    // return Object.assign({}, maker);
    return null;
  };
  return (
    <View style={Style.body}>
      <CalendarComponent
        markedDates={covertData()}
        getRefreshCallback={onRefresh}
        dateParam={dateShow ? moment(dateShow).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
      />
      <GestureRecognizer
        onSwipeLeft={() => {
          dispatch(
            calendarActions.onChangeDateShow({
              dateShow: moment(dateShow).add(1, 'days').format('YYYY-MM-DD'),
            })
          );
          // setDateNow(moment(dateShow).add(1, 'days'));
        }}
        onSwipeRight={() => {
          // console.log('right');
          
          dispatch(
            calendarActions.onChangeDateShow({
              dateShow: moment(dateShow).add(-1, 'days').format('YYYY-MM-DD'),
            })
          );
          // setDateNow(moment(dateShow).add(-1, 'days'));
        }}
      >
        {/* Render full day */}
        <View>
          <View
            style={[
              styles.item,
              Style.boxShadow,
              styles.pdt_3,
              styles.minHeight60,
            ]}
          >
            {/* Full day left */}
            <View style={styles.toolLeft}>
              <View style={styles.itemLeft}>
                <Text
                  style={[styles.txtDate, styles.txtDateTop, styleColorWeekend]}
                >
                  {dateNameLang}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      calendarActions.onChangeTypeShowGrid({
                        typeShowGrid: CalendarView.DAY,
                      })
                    );
                    handleReloadData(calendarByDayHeader.dateMoment);
                  }}
                >
                  <Text                 
                    style={[
                      styles.numDate,
                      styleColorHoliday,
                      styleCurrent,
                      styleColorWeekend,
                    ]}
                  >
                    {calendarByDayResource.dateByDay
                      ? calendarByDayResource.dateByDay
                      : calendarByDayHeader.dateByDay}             
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      // {width: calendarByDayHeader.perpetualCalendar ? normalize(35) : '100%'  },
                      styles.txtDate,
                      styleColorHoliday,
                    ]}
                  >
                    {!localNavigation.searchStatic?.isShowHoliday &&
                      `${
                        (nameHoliday || calendarByDayHeader.holidayName) ?? ''
                      }`}
                    {''}
                  </Text>
                 
                  {
                    nameHoliday && name_PerpetualCalendar ?
                    <Text  style={[
                      {paddingLeft:normalize(2)},
                      styles.txtDate,                                 
                    ]}>
                       ,
                     </Text>   
                     :
                     <></>
                  }
                  <Text numberOfLines ={1} style={[styles.txtDate]}>
                    {!localNavigation.searchStatic?.isShowPerpetualCalendar &&
                      calendarByDayHeader.perpetualCalendar || calendarByDayResource.perpetualCalendar}
                  </Text>
                </View>
              </View>
              {checkIconDown > 3 ? (
                <TouchableOpacity
                  style={[styles.button_down, styles.width_100]}
                  onPress={() => on_eventPress()}
                >
                  <Image
                    source={
                      !statusLayout.icon_event
                        ? Images.schedule.ic_down
                        : Images.schedule.ic_up
                    }
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {/* Full day right */}
            <View style={styles.itemRight}>
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.scroll_event}
              >
                {checkData <= 0 ? (
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ marginTop: 10 }}>データなし</Text>
                  </View>
                ) : (
                  <></>
                )}
                {tabFocus === TabFocus.SCHEDULE ? (
                  // Render Schedule
                  <>
                    {calendarByDay.fullDaySchedule &&
                      calendarByDay.fullDaySchedule.map(
                        (td: any, idx: number) => {
                          return (
                            <View key={idx}>
                              {/* show full */}
                              {statusLayout.icon_event &&
                                td.listSchedule.map((s: any, id: number) => {
                                  return (
                                    <View key={id}>
                                      <ItemSchedule
                                        key={s.uniqueId}
                                        localNavigation={localNavigation}
                                        dataOfSchedule={s}
                                        formatNormalStart={'HH:mm'}
                                        formatOverDayStart={'HH:mm'}
                                      />
                                    </View>
                                  );
                                })}
                              {/*  Show mini */}
                              {!statusLayout.icon_event &&
                                td.listSchedule.map((s: any, id: number) => {
                                  if (id < MAX_ITEM_FULL_DAY.MAX) {
                                    return (
                                      <View key={id}>
                                        <ItemSchedule
                                          key={s.uniqueId}
                                          localNavigation={localNavigation}
                                          dataOfSchedule={s}
                                          formatNormalStart={'HH:mm'}
                                          formatOverDayStart={'HH:mm'}
                                        />
                                      </View>
                                    );
                                  } else {
                                    return <View key={id + 'mini'}></View>;
                                  }
                                })}
                              {/* Load more */}
                              {!statusLayout.icon_event &&
                                td.listSchedule.length >
                                  MAX_ITEM_FULL_DAY.MAX && (                                                             
                                  <TouchableOpacity
                                    onPress={() => on_eventPress()}
                                  >
                                    <View
                                      style={[
                                        styles.text_bottom,
                                        styles.item_event,
                                      ]}
                                    >                           
                                       <Text
                                       numberOfLines={1}
                                       ellipsizeMode={'tail'}
                                       style={[styles.txtDt]}
                                     >
                                       {translate(
                                         messages.moreCalendarFullDay01
                                       )}
                                       { 
                                       td.listSchedule.length -
                                         MAX_ITEM_FULL_DAY.MAX
                                         }
                                       {translate(
                                         messages.moreCalendarFullDay02
                                       )}
                                     </Text>                           
                                    </View>
                                  </TouchableOpacity>                               
                                )}
                            </View>
                          );
                        }
                      )}
                  </>
                ) : (
                  // Render Resource
                  <>
                    {calendarByDay.fullDayResource &&
                      calendarByDay.fullDayResource.map(
                        (td: any, idx: number) => {
                          return (
                            <View key={idx}>
                              {/* show full */}
                              {statusLayout.icon_event &&
                                td.listResource.map(
                                  (s: DataOfResource, id: number) => {
                                    return (
                                      <View key={id}>
                                        <ItemResource
                                          prefixKey={'_' + 'item-Resource'}
                                          key={'_full' + id}
                                          dataOfResource={s}
                                          isShowStart={true}
                                          isShowEnd={true}
                                          showArrow={true}
                                        />
                                      </View>
                                    );
                                  }
                                )}
                              {/*  Show mini */}
                              {!statusLayout.icon_event &&
                                td.listResource.map(
                                  (s: DataOfResource, id: number) => {
                                    if (id < MAX_ITEM_FULL_DAY.MAX) {
                                      return (
                                        <View key={id}>
                                          <ItemResource
                                            prefixKey={'_' + 'item-Resource'}
                                            key={'_mini' + id}
                                            dataOfResource={s}
                                            isShowStart={true}
                                            isShowEnd={true}
                                            showArrow={true}
                                          />
                                        </View>
                                      );
                                    } else {
                                      return <View key={id + 'mini'}></View>;
                                    }
                                  }
                                )}
                              {/* Load more */}
                              {!statusLayout.icon_event &&
                                td.listResource.length >
                                  MAX_ITEM_FULL_DAY.MAX && (
                                  <TouchableOpacity
                                    onPress={() => on_eventPress()}
                                  >                                   
                                      <View
                                      style={[
                                        styles.text_bottom,
                                        styles.item_event,
                                      ]}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        style={[styles.txtDt]}
                                      >
                                        {translate(
                                          messages.moreCalendarFullDay01
                                        )}
                                        {td.listResource.length -
                                          MAX_ITEM_FULL_DAY.MAX}
                                        {translate(
                                          messages.moreCalendarFullDay02
                                        )}
                                      </Text>
                                    </View>                                                                                    
                                  </TouchableOpacity>
                                )}
                            </View>
                          );
                        }
                      )}
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        {/*
                    Render Hour 
                 */}
        <View style={styles.scroll}>
          <FlatList
            style={styles.pdt_10}
            data={
              tabFocus === TabFocus.SCHEDULE
                ? calendarByDay.listHourSchedule
                : calendarByDay.listHourResource
            }
            renderItem={renderHour}
            keyExtractor={(item, index) => {
              return `${item.startHour}${index}`;
            }}
            refreshing={isRefreshing}
            onRefresh={() => {
              getData(dateShow);
            }}
          />
        </View>
      </GestureRecognizer>
    </View>
  );
});
