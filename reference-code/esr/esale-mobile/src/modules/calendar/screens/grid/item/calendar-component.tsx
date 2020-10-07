import React, { useState, useEffect } from 'react';
import styles from '../grid-day/style';
import { Style } from '../../../common';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { CALENDAR_PICKER } from '../../../constants';
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated
} from 'react-native';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Images } from '../../../config';
import { STATUS_LAYOUT } from '../../../constants';
import { translate } from '../../../../../config/i18n';
import { messages } from '../../../calendar-list-messages';
// import { useDispatch, useSelector } from 'react-redux';
// import { calendarActions } from '../../../calendar-reducer';
// import { dateShowSelector } from '../../../calendar-selector';
import { calendarStyle } from './style';
// import Day from '../../../components/customCalendar/calendar/day/basic';
// import UnitDay from '../../../components/customCalendar/calendar/day/period';
import MultiDotDay from '../../../components/customCalendar/calendar/day/multi-dot';
// import MultiPeriodDay from '../../../components/customCalendar/calendar/day/multi-period';
// import SingleDay from '../../../components/customCalendar/calendar/day/custom';
// import CalendarHeader from '../../../components/customCalendar/calendar/header';
import {getHoliday} from "../../../calendar-repository";
LocaleConfig.locales['fr'] = {
  monthNames: CALENDAR_PICKER.MONTH_NAMES,
  monthNamesShort: CALENDAR_PICKER.MONTH_NAMES_SHORT,
  dayNames: CALENDAR_PICKER.DAY_NAMES,
  dayNamesShort: CALENDAR_PICKER.DAY_NAMES_SHORT,
  // today: CALENDAR_PICKER.TODAY
};
LocaleConfig.defaultLocale = CALENDAR_PICKER.DEFAULT_LOCALE;
const today = new Date().toJSON().slice(0, 10);
const markedDF: any = {};
markedDF[today] = {
  customStyles: {
    container: {
      backgroundColor: '#D5E2F2',
    },
  },
};
/**
 * calendar component interface
 */
type ICalendarComponent = {
  dateParam?: any;
  getRefreshCallback?: Function;
  markedDates?: any;
  dateScroll?: any
  // ref?: any;
};

/**
 * calendar component
 * @param getRefreshCallback data
 */
export const CalendarComponent = React.memo(({
  dateParam,
  getRefreshCallback,
  markedDates,
  dateScroll,
}: ICalendarComponent) => {
  // const dispatch = useDispatch();
  // const dateShow = useSelector(dateShowSelector);
  const [dateHeader, setDateHeader] = useState(moment())
  const [holidayData,setHoliday]= useState();
  useEffect(() => {
  //  console.log(holidayData);
  }, [holidayData]);
  useEffect(()=>{
    getHoliday().then((data:any)=>{
      if(data.data){
        setHoliday(data.data);
      }

    }).catch((error:any)=>{
      console.log(error)
    })
  },[])


  const [statusLayout, setStatusLayout] = useState({
    expanded: true,
    layout: STATUS_LAYOUT.LAYOUT,
    animation: new Animated.Value(STATUS_LAYOUT.ANIMATION),
    isVisible: false,
    icon_event: false,
    maxHeight: STATUS_LAYOUT.MAX_HEIGHT,
  });
  const [dateNow , setDateNow] = useState(moment());
  useEffect(() => {

    // if (getRefreshCallback) {
    //   getRefreshCallback(dateHeader.format("YYYY-MM-DD"));
    // }
  }, [dateHeader]);
  useEffect(() => {
    // if (dateNow.format('yyyy-MM-DD') != dateShow) {
    //   setTimeout(() => {
    //     dispatch(
    //       calendarActions.onChangeDateShow({
    //         dateShow: dateNow.format('yyyy-MM-DD'),
    //       })
    //     );
    //   }, 1000)

    // }
  }, [dateNow, dateScroll]);
  useEffect(() => {
    if (statusLayout.expanded) {
      setDateHeader(moment(dateParam))
    }
    // setDateNow(dateScroll.date(1))

  }, [dateParam]);
  /**
   * onDayPress
   * @param day
   */

  const onDayPress = (day: any) => {
    // setDateNow(moment(day.dateString));
    if (getRefreshCallback) {
      getRefreshCallback(day.dateString);
    }
  };

  /**
   * setMaxHeight
   */
  const setMaxHeight = (event: any) => {
    setStatusLayout({
      ...statusLayout,
      maxHeight: event.nativeEvent.layout.height,
    });
  };
  /**
   * toggle calendar
   */
  const toggle = () => {
    const minHeigh = STATUS_LAYOUT.MIN_HEIGHT;
    const initialValue = statusLayout.expanded
      ? statusLayout.maxHeight + minHeigh
      : minHeigh;
    const finalValue = statusLayout.expanded
      ? minHeigh
      : statusLayout.maxHeight + minHeigh;
    setStatusLayout({
      ...statusLayout,
      expanded: !statusLayout.expanded,
      animation: new Animated.Value(initialValue),
    });

    Animated.spring(statusLayout.animation, {
      toValue: finalValue,
      useNativeDriver: false,
    }).start();
  };

  // /**
  //  * format day to yyyy/MM/DD
  //  * @param day date obj
  //  */
  // const formatDay = (day: any) => {
  //   if (day) {
  //     return moment(day).format('yyyy/MM/DD');
  //   } else {
  //     return 'null';
  //   }
  // };

  const _onMonthChange = (date: any) => {
    if (date && date.length == 1) {
      const data = date[date.length - 1];
      if (moment(dateParam).months() != moment(data.dateString).months()) {
        setDateHeader(moment(data.dateString));
        if (getRefreshCallback) {
          getRefreshCallback(moment(data.dateString).date(1).format('YYYY-MM-DD'));
        }
      }


    }
  };
  const _onToDayPress = () => {
    setDateNow(moment());
    setDateHeader(moment())
    if (getRefreshCallback) {
      getRefreshCallback(moment().format('YYYY-MM-DD'));
    }
  };
  return (
    <View>
      <View style={[styles.top, Style.boxShadow]}>
        <Animated.View style={{ height: statusLayout.animation }}>
          <ScrollView scrollEnabled={false}>
            <View style={styles.topScreen}>
              <View style={[styles.flexRowBetween]}>
                <TouchableOpacity
                  onPress={toggle}
                  style={[styles.topLeft, styles.flexRowBetween]}
                >
                  <Text style={[styles.topDate, styles.topText,{fontSize: 14}]}>
                    {dateHeader ? dateHeader.year() : ""}
                    {translate(messages.year)} {dateHeader ? dateHeader.month() + 1 : ""}
                    {translate(messages.month)}
                  </Text>
                  <Image
                    source={
                      statusLayout.expanded
                        ? Images.schedule.ic_down
                        : Images.schedule.ic_up
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{...styles.topRight}}
                  onPress={_onToDayPress}
                >
                  <Text style={[styles.topText, {fontSize: 14}]}>
                    {translate(messages.refreshCalendarPicker)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              onLayout={(e) => {
                setMaxHeight(e);
              }}
            >
              <View style={{ height: 245 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: 5,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingBottom: 5,
                  }}
                >
                  {CALENDAR_PICKER.DAY_NAMES_SHORT.map(
                    (data: any, index: number) => {
                      return (
                        <View style={{ flex: 1 }} key={index}>
                          <Text
                            style={[
                              {
                                textAlign: 'center',
                                color: index >= 5 ? '#B91C1C' : 'black',
                                fontSize: 14
                              },
                            ]}
                          >
                            {data}
                          </Text>
                        </View>
                      );
                    }
                  )}
                </View>
                <CalendarList
                  pastScrollRange={30}
                  // Max amount of months allowed to scroll to the future. Default = 50
                  futureScrollRange={30}
                  // Enable or disable scrolling of calendar list
                  scrollEnabled={true}
                  current={dateParam}
                  // current ={moment("2020-04-01").format('YYYY-MM-DD')}
                  theme={calendarStyle}
                  horizontal={true}
                  pagingEnabled={true}
                  disableMonthChange={false}
                  firstDay={1}
                  hideExtraDays={true}
                  markedDates={markedDates ? markedDates : {
                    [dateParam]: {
                      dots: [],
                      selected: true,
                      isWeekend: false
                    }
                  }}
                  staticHeader={false}
                  hideDayNames={true}
                  dayComponent={MultiDotDay}
                  onDayPress={onDayPress}
                  onVisibleMonthsChange={_onMonthChange}
                />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
});
