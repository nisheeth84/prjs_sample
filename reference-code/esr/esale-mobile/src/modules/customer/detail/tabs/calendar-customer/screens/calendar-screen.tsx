import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ListScreen } from './display-list/list-screen';
import { CalendarByDayScreen } from './display-day/day-screen';
import moment from 'moment';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { styles } from './style';
import { messages } from '../calendar-list-messages';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import { calendarListSelector } from '../calendar-selector';
import { calendarActions } from "../calendar-reducer";
import { CalenderViewWeekList } from '../calendar-util';
import { DataOfViewList } from '../type';
import { getDataApiForByList } from '../api';
import { translate } from '../../../../../../config/i18n';
import { CALENDAR_PICKER } from '../../../../../../config/constants/calendar';
import AsyncStorage from "@react-native-community/async-storage";
import { ID_TOKEN } from '../../../../../../config/constants/constants';
import {images} from "../../../../../../../assets/icons";

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

function CalendarHome() {
  const dispatch = useDispatch();
  const [option, setOption] = useState({
    value: false,
    title: messages.listDisplay,
  });
  const dataCalendarForList = useSelector(calendarListSelector);
  const dateCurrent = moment().format('YYYY-MM-DD');
  const [obj, setObj] = useState({});
  const [listDisplay, setListDisplay] = useState(true);
  const [dateOption, setDateOption] = useState(false);
  const [yearMonth, setYearMonth] = useState({
    year: moment().year(),
    month: moment().month() + 1,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const a: any = {};
    if (dataCalendarForList
      && dataCalendarForList.dataSchedule
      && dataCalendarForList.dataSchedule.listDay) {
        dataCalendarForList.dataSchedule.listDay.forEach((values) => {
            const date = moment(values.dataHeader.date).format("YYYY-MM-DD");
      if(values.listSchedule && values.listSchedule.length > 0 ){
        a[date] = { marked: true };
        if(date === dateCurrent){
          a[date] = { selected: true, marked: true, selectedColor: "#0F6DB3" };
        }
      } 
        })
    }
    setObj(a);
  }, [dataCalendarForList])

  const getDataCalendarOfList = async (dateFrom: any) => {
    const old: DataOfViewList = {
      dataSchedule: {},
      dataResource: {},
    };
    
    const param = {
      isGetDateInfo: true,
      dateFrom: dateFrom,
      isSearchSchedule: true,
      isSearchTask: true,
      isSearchMilestone: true,
    };
    const token: any = await AsyncStorage.getItem(ID_TOKEN);
    const response = await getDataApiForByList(token, param)
    if(response.status === 200 ){
      const data = CalenderViewWeekList.buildScheduleOfCalendarList(old, response.data);
      dispatch(
        calendarActions.setDataCalendarOfList({ dataCalendarOfList: data })
      );
    }else{
      /**
       * show error
       */
    }
  };

  // render calendar
  const renderCalendarCustomer = () => {
    return (
      <View style={{ height: 300, backgroundColor: '#FFFF' }}>
        <View style={{ flexDirection: 'row', padding: 15 }}>
          {CALENDAR_PICKER.DAY_NAMES_SHORT.map((data: any, index: number) => {
            return (
              <View style={{ flex: 1 }} key={index}>
                <Text
                  style={[
                    {
                      textAlign: 'center',
                      color: index >= 5 ? '#B91C1C' : 'black',
                    },
                  ]}
                >
                  {data}
                </Text>
              </View>
            );
          })}
        </View>

        <CalendarList
          theme={calendarStyle}
          horizontal={true}
          pagingEnabled={true}
          disableMonthChange={true}
          firstDay={1}
          style={[styles.calendar, { height: 300 }]}
          hideExtraDays
          hideDayNames={true}
          markedDates={{
            ...markedDF,
            ...obj,
          }}
          onVisibleMonthsChange={(date: any) => {
            if (date && date.length == 1) {
              const data = date[date.length - 1];
              setYearMonth({
                year: data.year,
                month: data.month,
              });
            }
          }}
          onDayPress={(day) => {
            let dateSelect = moment.utc(day.timestamp).format();
            getDataCalendarOfList(dateSelect)
          }}
        />
      </View>
    );
  };
  // set value dropdown
  const setValueOption = (messages: any) => {
    setOption({ title: messages, value: false });
    setListDisplay(!listDisplay);
  };

  /**
   * Close modal
   */
  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.buttonDate}
          onPress={() => setDateOption(!dateOption)}
        >
          <Text style={{ marginRight: 15, fontWeight: '700' }}>{`${
            yearMonth.year
          } ${translate(messages.year)} ${yearMonth.month} ${translate(
            messages.month
          )}`}</Text>
          <Image source={dateOption ? images.ic_arrow_up : images.ic_arrow_down} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          style={styles.listDisplay}
        >
          <Text style={styles.titleDropdown}>{translate(option.title)}</Text>
          <Image source={isVisible ? images.ic_arrow_up : images.ic_arrow_down} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setValueOption(messages.listDisplay);
            setListDisplay(true)
          }}
          style={styles.format}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {translate(messages.refreshCalendarPicker)}
          </Text>
        </TouchableOpacity>
      </View>

      {dateOption ? renderCalendarCustomer() : null}

      {listDisplay ? <ListScreen /> : <CalendarByDayScreen />}

      <Modal
        isVisible={isVisible}
        style={{ margin: 20, justifyContent: 'flex-end', marginTop: 20 }}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={() => {
              setValueOption(messages.listDisplay);
              setIsVisible(!isVisible);
            }}
            style={styles.buttonDayDisplay}
          >
            <Text>{translate(messages.listDisplay)}</Text>
          </TouchableOpacity>
          <View style={styles.lines} />
          <TouchableOpacity
            onPress={() => {
              setValueOption(messages.dayDisplay);
              setIsVisible(!isVisible);
            }}
            style={styles.buttonDayDisplay}
          >
            <Text>{translate(messages.dayDisplay)}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default CalendarHome;

const calendarStyle = {
  'stylesheet.calendar.header': {
    header: {
      height: 0,
    },
  },
  todayTextColor: '#333333',
  dayTextColor: '#333333',
  textSectionTitleColor: '#333333',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 14,
  textDisabledColor: '#989898',
};
