import moment from 'moment';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal, FlatList, Platform
} from "react-native";


import { PlatformOS, ControlType, DefineFieldType, ModifyFlag } from '../../../../config/constants/enum';
import ScrollPicker from "../../common/scroll-picker";
import { normalize } from "../../common";
import { Images } from "../../config";
import { styles } from "./styles";
import { Calendar } from "../../api/get-schedule-type";
import {
  // SCHEDULE_TYPES,
  ARR_WEEK,
  LIST_REPEAT_CYCLE,
  MONTHS,
  YEARS,
  LIST_REPEAT_TYPE,
  LIST_NUMBER_REPEAT,
  LIST_REPEAT_TYPE_CONVERT,
  DEFAULT_CRU,
  LIST_DAY_OF_MONTH
} from "../../constants";
import { getSchedule, getScheduleTypes, getEquipmentTypes } from "../../calendar-repository";
import { messages } from "../../calendar-list-messages";
import { translate } from "../../../../config/i18n";
import { DynamicControlField } from '../../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import { CustomerSuggestView } from '../../../../shared/components/suggestions/customer/customer-suggest-view';
import { EmployeeSuggestView } from '../../../../shared/components/suggestions/employee/employee-suggest-view';
import { MilestoneSuggestView } from '../../../../shared/components/suggestions/milestone/milestone-suggest-view';
import { TaskSuggestView } from '../../../../shared/components/suggestions/task/task-suggest-view';
import { ProductSuggestView } from '../../../../shared/components/suggestions/product/product-suggest-view';

import DateTimePicker from '@react-native-community/datetimepicker';
import { vScale, hScale } from '../../common/PerfectPixel';





/**
 * type props CalendarRegistration
 */
type ICalendarRegistration = {
  calendar?: Calendar;
  callbackFunction: (calendar: Calendar) => void;
  isCheckScheduleType: boolean;
  isCheckScheduleName: boolean;
  isCheckScheduleTime: boolean;
  typeScreen?: number;
}
/**
 * CalendarRegistration component
 * @param calendar transfer data to props
 * @param callbackFunction function transfer data to parent component
 */
export const CalendarRegistration = React.memo(({ calendar, callbackFunction, isCheckScheduleType, isCheckScheduleName, isCheckScheduleTime, typeScreen }: ICalendarRegistration) => {
  // const scheduleTypes = SCHEDULE_TYPES();
  const now = moment();
  const date = new Date();
  const arrWeek = ARR_WEEK();

  /**
   * replaceAt
   * @param index 
   * @param str 
   * @param replacement 
   */
  const replaceAt = (index: number, str: string, replacement: string) => {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
  }
  /**
  * format day to yyyy/MM/DD
  * @param day date obj
  */
  const formatDay = (day: any) => {
    if (day) {
      return moment(day).format("yyyy/MM/DD")
    } else {
      return "null";
    }

  }
  /**
  * formatHour day to yyyy/MM/DD
  * @param day date obj
  * @isEndTime is End TIme
  */
  const formatHour = (day: any, isEndTime?: any, roundCheck?: boolean) => {
    if (day) {
      let currentTime = moment(day);
      let hour = currentTime.hour();
      let min = currentTime.minute();
      if (roundCheck) {
        if (min > 30) {
          hour = hour + 1;
          min = 0;
        } else {
          min = 0;
        }
      }
      if (isEndTime) {
        currentTime.hour(hour + 1);
        currentTime.minute(min);
      }
      else {
        currentTime.hour(hour);
        currentTime.minute(min);
      }
      return currentTime.format("HH:mm")
    } else {
      return "null";
    }

  }


  const getIndexYear = () => {
    return years.indexOf(moment(calendarData.repeatEndDate).year())
  }
  const getIndexMonth = () => {
    return months.indexOf(moment(calendarData.repeatEndDate).month() + 1)
  }
  const getIndexDay = () => {
    return LIST_DAY_OF_MONTH(moment(calendarData.repeatEndDate).year(), moment(calendarData.repeatEndDate).month()).indexOf(moment(calendarData.repeatEndDate).date())
  }
  // const getDayOfWeek = () => {
  //   var day = new Date(calendarData.startDay);
  //   return day.getDay();
  // }
  const getWeekOfMonth = () => {
    var d = calendarData.startDay;

    var day = d.slice(-2);
    var weekOfMonth: number;
    if (day % 7 == 0) {
      weekOfMonth = day / 7;
    }
    else {
      weekOfMonth = (day + 7) / 7;
    }
    return weekOfMonth;

  }

  /**
* state 
*/
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dayOrTime, setDayOrTime] = useState<any>('date');
  const [checkDayTime, setCheckDayTime] = useState(0);
  const [startDay, setStartDay] = useState(formatDay(calendar?.startDate ?? moment()));
  const [endDay, setEndDay] = useState(formatDay(calendar?.finishDate ?? moment()));
  const [startTime, setStartTime] = useState(formatHour(calendar?.startDate ?? moment(), false, true));
  const [endTime, setEndTime] = useState(formatHour(calendar?.finishDate ?? moment(), !calendar?.finishDate, true));
  const [checkChange, setChange] = useState(true);
  const [checkFullDay, setCheckFullDay] = useState(calendar?.isFullDay ?? false);
  const [regularDayOfMonth, setRegularDayOfMonth] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [isCheckLocationDateTime, setCheckLocationDateTime] = useState(false);


  const [calendarData, setCalendarData] = useState({
    ...calendar,
    isFullDay: calendar?.isFullDay ?? false,
    isRepeated: calendar?.isRepeated ?? false,
    isAllAttended: calendar?.isAllAttended ?? false,
    scheduleType: calendar?.scheduleType ?? {
      scheduleTypeId: 99
    },
    scheduleName:  calendar ?  calendar.scheduleName : '' ,
    repeatCycle: calendar?.repeatCycle ?? DEFAULT_CRU.REPEAT_CYCLE,
    repeatType: calendar?.repeatType ?? DEFAULT_CRU.REPEAT_TYPE,
    regularDayOfWeek: calendar?.regularDayOfWeek ?? replaceAt(date.getDay() - 1, DEFAULT_CRU.REGULAR_DAY_OG_WEEK, DEFAULT_CRU.REGULAR_DAY_OG_WEEK_SELECTED),
    repeatEndType: calendar?.repeatEndType ?? DEFAULT_CRU.REPEAT_END_TYPE_FALSE,
    repeatNumber: calendar?.repeatNumber ?? DEFAULT_CRU.REPEAT_NUMBER,
    regularDayOfMonth: calendar?.regularDayOfMonth ?? now.date(),
    startDay: startDay == '' ? calendar?.startDate ?? moment() : startDay,
    endDay: endDay == '' ? calendar?.finishDate ?? moment().add(1, "h") : endDay,
    startTime: startTime == '' ? calendar?.startDate ?? moment() : startTime,
    endTime: endTime == '' ? calendar?.startDate ?? moment() : endTime,
    repeatEndDate: moment(),
    scheduleTypes: [],
    equipmentsTypes: [],
    selectedWeek: "",
    selectedDay: "",
  });
  const [scheduleTypeName, setScheduleTypeName] = useState(calendarData.scheduleType?.scheduleTypeName ? JSON.parse(calendarData.scheduleType.scheduleTypeName).ja_jp : '');
  const [selectCustomer, setSelectCustomer] = useState(Array());
  const [selectMeeting, setSelectMeeting] = useState(false);
  const [meeting, setMeeting] = useState('');


  const Customer = (_Value: any) => {
    setSelectCustomer([..._Value]);
    // console.log('aaaa', selectCustomer.length, selectCustomer);
  }

  const showDatePickerDay = () => {
    setDatePickerVisibility(true);
    setDayOrTime('date');
    // setChangeDay(1);
  };
  const showDatePickerTime = () => {
    setDatePickerVisibility(true);
    setDayOrTime('time');
  };


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDatePickerVisibility(Platform.OS === PlatformOS.IOS);
    hideDatePicker();
    switch (checkDayTime) {
      case 1:
        setStartDay(formatDay(moment(currentDate)));
        setCalendarData({ ...calendarData, startDay: formatDay(moment(currentDate)) });
        setRegularDayOfMonth(false);
        setChange(!checkChange);
        break;
      case 2:
        setStartTime(formatHour(moment(currentDate), false, false));
        setCalendarData({ ...calendarData, startTime: formatHour(moment(currentDate), false, false) });
        setChange(!checkChange);
        break;
      case 3:
        setEndDay(formatDay(moment(currentDate)));
        setCalendarData({ ...calendarData, endDay: formatDay(moment(currentDate)) });
        setChange(!checkChange);
        break;
      case 4:
        setEndTime(formatHour(moment(currentDate), false, false));
        setCalendarData({ ...calendarData, endTime: formatHour(moment(currentDate), false, false) });
        setChange(!checkChange);
        break;
      default:
    }
  };

  useEffect(() => {
    callbackFunction(calendarData);
  }, [checkChange]);
  const navigation = useNavigation();
 
  

  const callApi = async () => {
    const scheduleTypes = await getScheduleTypes();
    const equipmentType = await getEquipmentTypes(false);
    if (calendar?.scheduleId) {
      const id: number = calendar.scheduleId;
      const get_Schedule = await getSchedule(id);
      if (get_Schedule) {
        const calendarResponse: Calendar = get_Schedule?.data;
        // Check exist data 
        if (!calendarResponse) {
          alert('Schedule has been deleted');
          navigation.goBack();
        }
        // Check Permission
        if (!calendarResponse.isPublic && !calendarResponse.participants?.employees?.find(item => item.employeeId == calendarResponse.employeeLoginId)) {
          navigation.goBack();
          alert('You are not permission')
        }
        setCalendarData({ ...calendarData, ...calendarResponse, equipmentsTypes: equipmentType.data.equipmentTypes, scheduleTypes: scheduleTypes.data.scheduleTypes })
        setChange(!checkChange);
      }
    } else {
      setCalendarData({ ...calendarData, equipmentsTypes: equipmentType.data.equipmentTypes, scheduleTypes: scheduleTypes.data.scheduleTypes })
      setChange(!checkChange);
    }
  }
  useEffect(() => {
    callApi();
  }, []);



  const listRepeatCyCle = LIST_REPEAT_CYCLE();
  const listNumberRepeat = LIST_NUMBER_REPEAT(100);
  // const numbers = ["第1", "第2", "第3", "第4", "第5"];
  const listRepeatTypeConvert = LIST_REPEAT_TYPE_CONVERT();
  /* 
  * convert changeRepeatType
  */
  const changeRepeatType = (repeatType: string) => {
    const type = listRepeatTypeConvert.filter((item) => item.value == repeatType);
    const keyType = type[0].key;
    let repeatNumber: number = DEFAULT_CRU.REPEAT_NUMBER_DAY;
    let repeatEndDate = moment();
    switch (keyType) {
      case 0:
        repeatNumber = DEFAULT_CRU.REPEAT_NUMBER_DAY;
        repeatEndDate = moment(calendarData.startDay).add(30, "d");
        break;
      case 1:
        repeatNumber = DEFAULT_CRU.REPEAT_NUMBER_WEEK;
        repeatEndDate = moment(calendarData.startDay).add(60, "d")
        break;
      case 2:
        repeatNumber = DEFAULT_CRU.REPEAT_NUMBER_MONTH;
        repeatEndDate = moment(calendarData.startDay).add(1, "y")
        break;
    }
    setCalendarData({ ...calendarData, repeatType: keyType, repeatNumber: repeatNumber, repeatEndDate: repeatEndDate });
    setChange(!checkChange);
  }
  const address = (_item: any, _type: any, _val: any) => {
    // console.log("_val");

    // console.log('_val', JSON.parse(_val).zip_code);
    // const temp = JSON.parse(_val?_val:"{}");

    //   zipCode?: any;
    // prefecturesId?: any;
    // prefecturesName?: any;
    // addressBelowPrefectures?: any;
    // buildingName?: any;
    // setCalendarData({ ...calendarData, zipCode: temp.zip_code, buildingName: temp.building_name, addressBelowPrefectures: temp.address_name})
    // setChange(!checkChange);
  }
  // useEffect(() => {
  //   console.log('calendarData',calendarData);
  // }, [calendarData])

  const Participant = (_searchValue: any) => {
  }


  /**
   * render item Scroll Repeat Number
   * @param _repeatNumber 
   */
  const renderScrollRepeatNumber = (_repeatNumber: number) => {
    const defauldPick = () => {
      switch (calendarData.repeatType) {
        case 0:
          return 29;
          break;
        case 1:
          return 12;
          break;
        case 2:
          return 11;
          break;
        default:
          return null;
      }
    }
    return (
      <ScrollPicker
        styleItem={{ textAlign: "center", width: "100%" }}
        ref={() => {
        }}
        dataSource={listNumberRepeat}
        selectedIndex={defauldPick()}
        itemHeight={40}
        wrapperHeight={120}
        wrapperColor={"#fff"}
        highlightColor={"#E5E5E5"}
        onValueChange={(data: any) => {
          setCalendarData({ ...calendarData, repeatNumber: data })
        }}
      />
    )
  }

  const listRepeatType = LIST_REPEAT_TYPE();
  const years = YEARS();
  const months = MONTHS();

  const getRegularDayWeek = () => {
    // if (calendarData.selectedWeek && calendarData.selectedDay) {

    return calendarData.startDay;
    // } else {
    //   return "";
    // }

  }


  /**
   * Render Show Repeat EndDate
   */
  const showRepeatEndDate = () => {

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ flex: 0.15, flexDirection: 'column' }}>
          <View style={{ height: normalize(40.5), borderBottomColor: '#E5E5E5', borderBottomWidth: 0.5 }} />
          <View style={{ height: normalize(39.5), borderBottomColor: '#E5E5E5', borderBottomWidth: 0.5 }} />
        </View>
        <ScrollPicker
          styleItem={{ textAlign: "right", width: "100%" }}
          ref={() => {
          }}
          dataSource={years}
          selectedIndex={getIndexYear()}
          itemHeight={40}
          wrapperHeight={120}
          wrapperColor={"#fff"}
          highlightColor={"#E5E5E5"}
          onValueChange={(value: number) => {
            setCalendarData({ ...calendarData, repeatEndDate: calendarData.repeatEndDate.year(value) })
            setChange(!checkChange);
          }}
        />
        <ScrollPicker
          styleItem={{ textAlign: "center", width: '100%' }}
          ref={() => {
          }}
          dataSource={months}
          selectedIndex={getIndexMonth()}
          itemHeight={40}
          wrapperHeight={120}
          wrapperColor={"#fff"}
          highlightColor={"#E5E5E5"}
          onValueChange={(value: number) => {
            setCalendarData({ ...calendarData, repeatEndDate: calendarData.repeatEndDate.month(value - 1) })
            setChange(!checkChange);
          }}
        />
        <ScrollPicker
          style={{ marginLeft: 10 }}
          styleItem={{ textAlign: "left", width: "100%" }}
          ref={() => {
          }}
          dataSource={LIST_DAY_OF_MONTH(moment(calendarData.repeatEndDate).year(), moment(calendarData.repeatEndDate).month())}
          selectedIndex={getIndexDay()}
          itemHeight={40}
          wrapperHeight={120}
          wrapperColor={"#fff"}
          highlightColor={"#E5E5E5"}
          onValueChange={(value: number) => {
            setCalendarData({ ...calendarData, repeatEndDate: calendarData.repeatEndDate.date(value) })
            setChange(!checkChange);
          }}
        />
      </View>
    );
  }


  /**
   * Render Item Week
   */
  const itemWeek = (item: any, idx: number) => {
    // var id: number;
    // if (idx == 6) { id = 6 } else { id = idx + 1 }
    return (
      <TouchableOpacity onPress={() => clickItemWeek(idx)} key={idx}>
        <View style={[styles.ScheduleDay, calendarData.regularDayOfWeek?.charAt(idx) == DEFAULT_CRU.REGULAR_DAY_OG_WEEK_SELECTED && styles.ScheduleDayActive]}>
          <Text
            style={[
              styles.ScheduleDayText,
              calendarData.regularDayOfWeek?.charAt(idx) == DEFAULT_CRU.REGULAR_DAY_OG_WEEK_SELECTED && styles.ScheduleDayActiveText,
            ]}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  /**
  * Process logic click week
  * @param idx 
  */
  const clickItemWeek = (idx: number) => {
    let regularDayOfWeekCP = calendarData.regularDayOfWeek;
    const count = (calendarData.regularDayOfWeek.match(/1/g) || []).length;
    if (calendarData.regularDayOfWeek?.charAt(idx) == DEFAULT_CRU.REGULAR_DAY_OG_WEEK_SELECTED) {
      if (count > 1) {
        setCalendarData({ ...calendarData, regularDayOfWeek: replaceAt(idx, regularDayOfWeekCP, DEFAULT_CRU.REGULAR_DAY_OG_WEEK_UNSELECTED) });
        setChange(!checkChange);
      }
    } else {
      setCalendarData({ ...calendarData, regularDayOfWeek: replaceAt(idx, regularDayOfWeekCP, DEFAULT_CRU.REGULAR_DAY_OG_WEEK_SELECTED) });
      setChange(!checkChange);
    }
  }

  /**
   * repeatCycle item render
   */
  const repeatCycleScroll = () => {
    if (calendarData.isRepeated) {
      return (
        <View style={[styles.ScheduleRepeat]}>
          <View style={[styles.Row, styles.Horizontal_15]}>
            <Text style={{ ...styles.RowLeft, fontWeight: 'bold', color: '#333' }}>{translate(messages.repeatCondition)}</Text>
            <Text style={[styles.RowRight, styles.color666]}>{calendarData.repeatCycle} {listRepeatType[calendarData.repeatType]}</Text>
          </View>
          <View style={[styles.wrapScroll]}>
            <ScrollPicker
              styleItem={{
                textAlign: "right",
                width: "100%",
                paddingRight: normalize(10),
              }}
              ref={() => {
              }}
              dataSource={listRepeatCyCle}
              selectedIndex={calendarData.repeatCycle - 1}
              itemHeight={40}
              wrapperHeight={120}
              wrapperColor={"#fff"}
              highlightColor={"#E5E5E5"}
              onValueChange={(repeatCycle: any) => {
                setCalendarData({ ...calendarData, repeatCycle: repeatCycle })
                setChange(!checkChange);
              }}
            />
            <ScrollPicker
              styleItem={{
                textAlign: "left",
                width: "100%",
                paddingLeft: normalize(10),
              }}
              ref={() => {
              }}
              dataSource={listRepeatType}
              selectedIndex={calendarData.repeatType}
              itemHeight={40}
              wrapperHeight={120}
              wrapperColor={"#fff"}
              highlightColor={"#E5E5E5"}
              onValueChange={(repeatType: any) => changeRepeatType(repeatType)}
            />
          </View>
          {calendarData.repeatType == DEFAULT_CRU.REPEAT_TYPE_WEEK &&
            <View style={[styles.ScheduleItem]}>
              <View style={[styles.ScheduleTop]}>
                <Text style={[styles.ScheduleTitle]}>{translate(messages.dayOfWeek)}</Text>
              </View>
              <View style={[styles.ScheduleContent]}>
                <View style={[styles.ScheduleWeek]}>
                  {
                    Array.isArray(arrWeek) &&
                    arrWeek.map((item, idx) => {
                      return itemWeek(item, idx);
                    })
                  }
                </View>
              </View>
            </View>
          }

          <View style={[styles.ScheduleItem, styles.ScheduleItemBottomNone]}>
            {
              calendarData.repeatType == DEFAULT_CRU.REPEAT_TYPE_MONTH &&
              <View style={[styles.ScheduleTop]}>
                <Text style={[styles.ScheduleTitle]}>{translate(messages.scheduleTitle)}</Text>
              </View>
            }
            {
              calendarData.repeatType == DEFAULT_CRU.REPEAT_TYPE_MONTH &&
              <View style={[styles.ScheduleContent]}>
                <View style={[styles.ScheduleBox]}>
                  <TouchableOpacity
                    style={{ borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}
                    onPress={() => {
                      setCalendarData({ ...calendarData, regularDayOfMonth: now.date(), regularWeekOfMonth: null, regularEndOfMonth: false });
                      setChange(!checkChange);
                    }}
                  >
                    <View style={[styles.BoxItem, styles.BoxItemBottomNone]}>
                      <View style={[styles.BoxTop]}>
                        <Text style={[styles.BoxLeft]}>{translate(messages.monthly)}{regularDayOfMonth ? calendarData.regularDayOfMonth : calendarData.startDay.substr(8, 2)}{translate(messages.day)}</Text>
                        <View style={[styles.BoxRight]}>
                          {calendarData.regularDayOfMonth
                            ?
                            <>
                              <Text style={[styles.BoxDay]}>{regularDayOfMonth ? calendarData.regularDayOfMonth : calendarData.startDay.substr(8, 2)}{translate(messages.day)}</Text>
                              <View
                                style={[
                                  styles.BoxCheckBox,
                                  styles.BoxCheckBoxActive,
                                ]}
                              >
                                <Image
                                  style={[styles.BoxCheckBoxImage]}
                                  source={Images.scheduleRegistration.ic_check}
                                ></Image>
                              </View>
                            </>
                            :
                            <>
                              <Text style={[styles.BoxDay]}>{regularDayOfMonth ? calendarData.regularDayOfMonth : calendarData.startDay.substr(8, 2)}{translate(messages.day)}</Text>
                              <View
                                style={[
                                  styles.BoxCheckBoxNoSelect,
                                ]}
                              >
                              </View>
                            </>
                          }
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* {calendarData.regularDayOfMonth && regularDay()} */}
                  <TouchableOpacity
                    style={{ borderBottomWidth: 0.5, borderBottomColor: '#E5E5E5' }}
                    onPress={() => {
                      setCalendarData({ ...calendarData, regularDayOfMonth: null, regularWeekOfMonth: getWeekOfMonth(), regularEndOfMonth: false });
                      setChange(!checkChange);
                    }}>
                    <View style={[styles.BoxItem, styles.BoxItemBottomNone]}>
                      <View style={[styles.BoxTop]}>
                        <Text style={[styles.BoxLeft]}>{translate(messages.boxItemBottomLabel,
                          {
                            week: Math.ceil(moment(getRegularDayWeek()).date() / 7),
                            day: moment(getRegularDayWeek()).format('dddd')
                          })}
                        </Text>
                        <View style={[styles.BoxRight]}>
                          {calendarData.regularWeekOfMonth
                            ? <>
                              <Text style={[styles.BoxDay]}>{getRegularDayWeek()}</Text>
                              <View style={[styles.BoxCheckBox, styles.BoxCheckBoxActive,]}>
                                <Image
                                  style={[styles.BoxCheckBoxImage]}
                                  source={Images.scheduleRegistration.ic_check}
                                />
                              </View>
                            </>
                            : <>
                              <Text style={[styles.BoxDay]}>{getRegularDayWeek()}</Text>
                              <View
                                style={[
                                  styles.BoxCheckBoxNoSelect,
                                ]}
                              >
                              </View>
                            </>
                          }
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* {calendarData.regularWeekOfMonth && regularDayWeek()} */}
                  {/* <TouchableOpacity onPress={() => { setCalendarData({ ...calendarData, regularDayOfMonth: null, regularWeekOfMonth: null, regularEndOfMonth: true }), setChange(!checkChange) }}>
                    <View style={[styles.BoxItem, styles.BoxItemBottomNone]}>
                      <View style={[styles.BoxTop]}>
                        <Text style={[styles.BoxLeft]}>{translate(messages.endOfEveryMonth)}</Text>
                        <View style={[styles.BoxRight]}>
                          {calendarData.regularEndOfMonth
                            ?
                            <>
                              <View style={[styles.BoxCheckBox, styles.BoxCheckBoxActive,]}>
                                <Image
                                  style={[styles.BoxCheckBoxImage]}
                                  source={Images.scheduleRegistration.ic_check}
                                />
                              </View>
                            </>
                            :
                            <>
                              <View
                                style={[
                                  styles.BoxCheckBoxNoSelect,
                                ]}
                              >
                              </View>
                            </>
                          }
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity> */}
                </View>
              </View>
            }
          </View>
          <View style={[styles.ScheduleItem,]}>
            <View style={[styles.ScheduleTop]}>
              <Text style={[styles.ScheduleTitle]}>{translate(messages.endDate)}</Text>
            </View>
            <View style={[styles.ScheduleContent]}>
              <View style={[styles.ScheduleBox]}>
                <TouchableOpacity onPress={() => {
                  setCalendarData({ ...calendarData, repeatEndType: DEFAULT_CRU.REPEAT_END_TYPE_FALSE, repeatNumber: DEFAULT_CRU.REPEAT_NUMBER_MAX })
                  setChange(!checkChange)
                }}>
                  <View style={[styles.BoxItem]} >
                    <View style={[styles.BoxTop]}>
                      <Text style={[styles.BoxTitle]}>
                        {translate(messages.endDate)} {translate(messages.none)}
                      </Text>
                      {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_FALSE
                        ?
                        <View style={[styles.BoxRight]}>

                          <View style={[styles.BoxCheckBox, styles.BoxCheckBoxActive,]}>
                            <Image
                              style={[styles.BoxCheckBoxImage]}
                              source={Images.scheduleRegistration.ic_check}
                            />
                          </View>
                        </View>
                        :
                        <View style={[styles.BoxRight]}>

                          <View style={[styles.BoxCheckBoxNoSelect]} />
                        </View>
                      }
                    </View>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setCalendarData({ ...calendarData, repeatEndType: DEFAULT_CRU.REPEAT_END_TYPE_TRUE })
                  setChange(!checkChange);
                }}>

                  <View style={[styles.BoxItem, calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_TRUE && styles.BoxItemBottomNone]}>
                    <View style={{ ...styles.BoxTop }}>
                      <Text style={[styles.BoxTitle]}>
                        {translate(messages.boxTitle)}
                      </Text>
                      {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_TRUE && <Text style={{ ...styles.BoxTitle, marginLeft: normalize(120), fontWeight: 'normal' }}>{formatDay(calendarData.repeatEndDate)}</Text>}
                      {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_TRUE
                        ?
                        <View style={[styles.BoxRight]}>
                          <View
                            style={[
                              styles.BoxCheckBox,
                              calendarData.repeatEndType && styles.BoxCheckBoxActive,
                            ]}
                          >
                            <Image
                              style={[styles.BoxCheckBoxImage]}
                              source={Images.scheduleRegistration.ic_check}
                            />
                          </View>
                        </View>
                        :
                        <View style={[styles.BoxRight]}>

                          <View
                            style={[
                              styles.BoxCheckBoxNoSelect,
                            ]}
                          >
                          </View>
                        </View>
                      }
                    </View>
                  </View>
                </TouchableOpacity>
                {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_TRUE &&
                  showRepeatEndDate()
                }
                {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_TRUE && <View style={{ width: '100%', borderBottomColor: '#ebebeb', borderBottomWidth: 1 }} />}
                <TouchableOpacity onPress={() => {
                  setCalendarData({ ...calendarData, repeatEndType: DEFAULT_CRU.REPEAT_END_TYPE_NONE, repeatNumber: calendarData.repeatType === 0 ? 30 : calendarData.repeatType === 1 ? 13 : 12 });
                  setChange(!checkChange);
                }}>
                  <View style={[styles.BoxItem, calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_NONE && styles.BoxItemBottomNone]}>
                    <View style={[styles.BoxTop]}>
                      <Text style={{ ...styles.BoxLeft, fontWeight: 'bold' }}>
                        {translate(messages.boxRightTitle)}
                      </Text>

                      {calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_NONE
                        ? <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 13 }}>{calendarData.repeatNumber}</Text>
                          <View style={[styles.BoxRight]}>
                            <View
                              style={[
                                styles.BoxCheckBox,
                                styles.BoxCheckBoxActive,
                              ]}
                            >
                              <Image
                                style={[styles.BoxCheckBoxImage]}
                                source={Images.scheduleRegistration.ic_check}
                              />
                            </View>
                          </View>
                        </View>
                        :
                        <View style={[styles.BoxRight]}>

                          <View
                            style={[
                              styles.BoxCheckBoxNoSelect,
                            ]}
                          >
                          </View>

                        </View>
                      }
                    </View>
                  </View>
                </TouchableOpacity>
                {
                  calendarData.repeatEndType == DEFAULT_CRU.REPEAT_END_TYPE_NONE &&
                  <View style={[styles.wrapScroll]}>
                    {renderScrollRepeatNumber(calendarData.repeatNumber)}
                  </View>
                }
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  /**
   * render Item Schedule Type
   * @param item 
   * @param idx 
   */

  var listScheduleType = calendarData?.scheduleTypes?.map((item: any) => ({
    ...item
  }))
  var listEquipmentsType = calendarData?.equipmentsTypes?.map((item: any) => ({
    ...item
  }))


  const renderSchedule = (item: any) => {
    const imageSchedule = (type: any) => {
      switch (type) {
        case 0:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={{ uri: item.item.iconPath }} />);
        case 1:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-1.png')} />);
        case 2:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-2.png')} />);
        case 3:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-3.png')} />);
        case 4:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-4.png')} />);
        case 5:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-5.png')} />);
        case 6:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-6.png')} />);
        case 7:
          return (<Image style={{ marginTop: vScale(5), width: hScale(10), height: vScale(10) }} source={require('../../assets/images/scheduleType/type-7.png')} />);
        default:
          return null;
      }
    }

    return (
      <View style={{ height: normalize(50), borderBottomWidth: 1, borderBottomColor: "#cdcdcd", width: '100%', justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setScheduleModal(false);
            setCalendarData({ ...calendarData, scheduleType: { scheduleTypeId: item.item.scheduleTypeId } });
            setChange(!checkChange);
            setScheduleTypeName(JSON.parse(item.item.scheduleTypeName).ja_jp != '' ? JSON.parse(item.item.scheduleTypeName).ja_jp : JSON.parse(item.item.scheduleTypeName).en_us != '' ? JSON.parse(item.item.scheduleTypeName).en_us : JSON.parse(item.item.scheduleTypeName).zh_cn);
          }}
        >
          <View style={{ flexDirection: 'row', paddingHorizontal: normalize(15), width: '90%' }}>
            {imageSchedule(item.item.iconType)}
            <Text numberOfLines={1} style={{ marginLeft: normalize(10) }} >{JSON.parse(item.item.scheduleTypeName).ja_jp != '' ? JSON.parse(item.item.scheduleTypeName).ja_jp : JSON.parse(item.item.scheduleTypeName).en_us != '' ? JSON.parse(item.item.scheduleTypeName).en_us : JSON.parse(item.item.scheduleTypeName).zh_cn}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  };

  const renderMeeting = (item: any) => {
    return (
      <View style={{ height: normalize(50), borderBottomWidth: 1, borderBottomColor: "#cdcdcd", width: '100%', justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setSelectMeeting(false);
            // setCalendarData({ ...calendarData, scheduleType: { scheduleTypeId: item.item.scheduleTypeId } });
            setChange(!checkChange);
            setMeeting(JSON.parse(item.item.equipmentTypeName).ja_jp != '' ? JSON.parse(item.item.equipmentTypeName).ja_jp : JSON.parse(item.item.equipmentTypeName).en_us);
          }}
        >
          <View style={{ flexDirection: 'row', paddingHorizontal: normalize(15), width: '90%' }}>
            <Text numberOfLines={1} style={{ marginLeft: vScale(10) }} >{JSON.parse(item.item.equipmentTypeName).ja_jp != '' ? JSON.parse(item.item.equipmentTypeName).ja_jp : JSON.parse(item.item.equipmentTypeName).en_us}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  };


  return (
    <View style={[styles.ScheduleList]}>
      <View style={{ ...styles.ScheduleItem, backgroundColor: isCheckScheduleType ? '#FED3D3' : '#fff' }}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.type)}</Text>
          <Text style={[styles.ScheduleLabel]}>{translate(messages.required)}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => setScheduleModal(true)}>
            <Text numberOfLines={1} style={[styles.ScheduleContent, styles.color999]}>{scheduleTypeName != '' ? scheduleTypeName : translate(messages.selectType)}</Text>
          </TouchableOpacity>
        </View>
        <Modal
          onDismiss={() => setScheduleModal(false)}
          animationType="fade"
          transparent={true}
          visible={scheduleModal}
        >
          <View style={{ width: '100%', height: "100%" }}>
            <TouchableOpacity onPress={() => { setScheduleModal(false) }}>
              <View style={{ backgroundColor: '#000', opacity: 0.9, width: '100%', height: '100%' }}>
              </View>
            </TouchableOpacity >
            <View style={{ position: 'absolute', bottom: vScale(30), width: '100%', flexDirection: 'column', maxHeight: '70%', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { setScheduleModal(false) }}>
                <View style={{ width: hScale(50), height: vScale(3), borderRadius: normalize(3), backgroundColor: '#cdcdcd', marginVertical: hScale(10) }} />
              </TouchableOpacity>
              <View style={{ width: '100%', height: vScale(20), borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#fff' }} />
              <View style={{ width: "100%", backgroundColor: '#fff', flexDirection: 'row', maxHeight: '85%' }}>
                <FlatList
                  data={listScheduleType}
                  renderItem={item => renderSchedule(item)}
                  keyExtractor={item => item.scheduleTypeId}
                />
              </View>
              <View style={{ width: '100%', height: vScale(20), borderBottomLeftRadius: 30, borderBottomRightRadius: 30, backgroundColor: '#fff' }} />
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ ...styles.ScheduleItem, backgroundColor: isCheckScheduleName ? "#FED3D3" : '#fff' }}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.schedule_name)} </Text>
          <Text style={[styles.ScheduleLabel]}>{translate(messages.required)}</Text>
        </View>
        <TextInput
          style={[styles.ScheduleContent]}
          onChangeText={(scheduleName) => { setCalendarData({ ...calendarData, scheduleName: scheduleName }); setChange(!checkChange); }}
          value={calendarData.scheduleName}
          placeholder={translate(messages.enterSubject)}
        />
      </View>

      <View
        style={{
          ...styles.ScheduleItem,
          ...calendarData.isRepeated && styles.ScheduleItemBottomNone,
          backgroundColor: isCheckScheduleTime ? "#FED3D3" : '#fff',
          borderBottomWidth: 0
        }}
      >
        {/* Date Time */}
        <View style={{ backgroundColor: isCheckScheduleTime ? "#FED3D3" : '#fff' }}>
          <View style={{ ...styles.ScheduleTop, }}>
            <Text style={[styles.ScheduleTitle]}>{translate(messages.dateAndTime)}</Text>
            <Text style={[styles.ScheduleLabel]}>{translate(messages.required)}</Text>
          </View>
          <View style={[styles.ScheduleContent]}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => { setCheckDayTime(1); showDatePickerDay(); setCheckLocationDateTime(false); }}
                >
                  <Text style={{ color: '#999999' }}>{startDay}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                {checkFullDay ? null
                  : <TouchableOpacity style={{ flex: 1, }} onPress={() => { setCheckDayTime(2); showDatePickerTime(); setCheckLocationDateTime(false); }}>
                    <Text style={{ textAlign: 'right', color: '#999999' }}>{startTime}</Text>
                  </TouchableOpacity>
                }
              </View>
              {isCheckLocationDateTime ? null : <View>
                {isDatePickerVisible &&
                  (<DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={dayOrTime}
                    is24Hour={false}
                    display="default"
                    onChange={handleConfirm} />)
                }
              </View>}
              <View style={{ flexDirection: 'row', marginTop: vScale(10) }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { setCheckDayTime(3); showDatePickerDay(); setCheckLocationDateTime(true); }}>
                  <Text style={{ color: '#999999' }}>{endDay}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                {checkFullDay ? null
                  : <TouchableOpacity style={{ flex: 1 }} onPress={() => { setCheckDayTime(4); showDatePickerTime(); setCheckLocationDateTime(true); }}>
                    <Text style={{ textAlign: 'right', color: '#999999' }}>{endTime}</Text>
                  </TouchableOpacity>
                }
              </View>
              {/* <DynamicControlField
                controlType={ControlType.ADD_EDIT}
                fieldInfo={{
                  fieldType: DefineFieldType.DATE_TIME,
                  fieldLabel: '{"ja_jp":"住所","en_us":"Street address","zh_cn":"街道地址"}',
                  modifyFlag: ModifyFlag.OPTIONAL_INPUT,
                }}
                elementStatus={{ fieldValue: '{"zipCode": "", "addressName": "", "buildingName": ""}'}}
                updateStateElement={()=>{}}
              /> */}
            </View>
          </View>
        </View>
      </View>
      {isCheckLocationDateTime ? <View>
        {isDatePickerVisible &&
          (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={dayOrTime}
            is24Hour={false}
            display="default"
            onChange={handleConfirm} />)
        }
      </View> : null}
      <View style={[styles.ScheduleContent]}>


        <View
          style={{
            ...styles.ScheduleItem,
            ...calendarData.isRepeated && styles.ScheduleItemBottomNone,
            marginTop: -vScale(20)
          }}
        >
          <View style={[styles.Row]}>
            <Text style={{ ...styles.RowLeft, fontSize: normalize(15), paddingTop: normalize(3) }}>{translate(messages.textFullDay)}</Text>
            <View>
              {calendarData.isFullDay ?
                <TouchableOpacity
                  onPress={() => {
                    setCheckFullDay(false);
                    setCalendarData({ ...calendarData, isFullDay: false, startTime: startTime, endTime: endTime });
                    setChange(!checkChange);
                  }}
                >
                  <View>
                    <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/selected.png')} />
                  </View>
                </TouchableOpacity>
                : <TouchableOpacity
                  onPress={() => {
                    setCheckFullDay(true);
                    setCalendarData({ ...calendarData, isFullDay: true, startTime: '00:00', endTime: '23:59' })
                    setChange(!checkChange);
                  }}
                >
                  <View>
                    <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/unselect.png')} />
                  </View>
                </TouchableOpacity>
              }
            </View>
          </View>
          <View style={[styles.Row, styles.RowBottomNone]}>
            <Text style={{ ...styles.RowLeft, fontSize: normalize(15), paddingTop: normalize(3) }}>{translate(messages.repeat)}</Text>
            <View>
              {calendarData.isRepeated ?
                <TouchableOpacity
                  onPress={() => {
                    setCalendarData({ ...calendarData, isRepeated: false });
                    setChange(!checkChange);
                  }}
                >
                  <View>
                    <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/selected.png')} />
                  </View>
                </TouchableOpacity>
                : <TouchableOpacity
                  onPress={() => {
                    setCalendarData({ ...calendarData, isRepeated: true });
                    setChange(!checkChange);

                  }}
                >
                  <View>
                    <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/unselect.png')} />
                  </View>
                </TouchableOpacity>
              }
            </View>

          </View>
        </View>
      </View>

      <View style={[styles.ScheduleExtends]}>{repeatCycleScroll()}</View>
      {/* Khach Hang */}
      <View style={[styles.ScheduleItem]}>
        <CustomerSuggestView
          typeSearch={0}
          fieldLabel={translate(messages.customer)}
          updateStateElement={Customer}
        />
      </View>
      {selectCustomer.length > 0 && <View style={[styles.ScheduleItem]}>
      <ProductSuggestView
          typeSearch={1}
          fieldLabel={translate(messages.customerProductTradings)}
          updateStateElement={()=>{}}
        />
      </View>}
      <View style={[styles.ScheduleItem]}>
        {/* <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.relatedCustomer)}</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.ScheduleContent, styles.color999]}>{translate(messages.selectRelatedCustomers)}</Text>
        </TouchableOpacity> */}
        <CustomerSuggestView
          typeSearch={1}
          fieldLabel={translate(messages.relatedCustomer)}
          updateStateElement={()=>{}}
        />
      </View>
      {/* dia chi  */}

      <View style={[styles.ScheduleItem]}>
        <DynamicControlField
          controlType={ControlType.ADD_EDIT}
          fieldInfo={{
            fieldType: DefineFieldType.ADDRESS,
            fieldLabel: '{"ja_jp":"住所","en_us":"Street address","zh_cn":"街道地址"}',
            modifyFlag: ModifyFlag.OPTIONAL_INPUT,
          }}
          elementStatus={{ fieldValue: JSON.stringify({ zipCode: calendarData.zipCode ? calendarData.zipCode : "", addressName: calendarData.addressBelowPrefectures ? calendarData.addressBelowPrefectures : "", buildingName: calendarData.buildingName ? calendarData.buildingName : "" }) }}
          updateStateElement={address} />
      </View>
      {/* Ng tham gia ben ngoai */}
      <View style={[styles.ScheduleItem]}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.outsideParticipant)}</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.ScheduleContent, styles.color999]}>
            {translate(messages.addOutsideParticipant)}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Nguoi tham gia */}
      <View style={[styles.ScheduleItem]}>
        <EmployeeSuggestView
          typeSearch={2}
          fieldLabel={translate(messages.participant)}
          updateStateElement={Participant}
        />
        <View style={{ ...styles.Row, ...styles.RowBottomNone }}>
          <Text numberOfLines={2} style={{ fontSize: normalize(15), paddingTop: vScale(3), color: '#666666'}}>
            {translate(messages.allParticipantInvolve)}
          </Text>
          <View>
            {calendarData.isAllAttended ?
              <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, isAllAttended: false });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/selected.png')} />
                </View>
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, isAllAttended: true });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: hScale(40), height: vScale(25) }} source={require('../../assets/images/icon_common/unselect.png')} />
                </View>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
      <View style={[styles.ScheduleItem]}>
        <EmployeeSuggestView
          typeSearch={2}
          fieldLabel={translate(messages.sharer)}
          updateStateElement={Participant}
        />
      </View>
      <View style={[styles.ScheduleItem]}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.equipments)}</Text>
        </View>
        <View style={{ height: normalize(160), borderRadius: normalize(10), borderWidth: 1, borderColor: '#cdcdcd', flexDirection: 'column' }}>
          <View style={{ height: normalize(80), borderBottomWidth: 1, borderBottomColor: '#cdcdcd', width: '100%', }}>
            <Text style={{ ...styles.ScheduleTitle, paddingLeft: normalize(10), paddingVertical: normalize(15) }}>{translate(messages.category)}</Text>
            <TouchableOpacity onPress={() => { setSelectMeeting(true) }} style={{ marginTop: vScale(-5) }}>
              <Text numberOfLines={1} style={{ ...styles.ScheduleContent, ...styles.color999, paddingLeft: normalize(10) }}>{meeting != '' ? meeting : translate(messages.selectCategory)}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: normalize(80), width: '100%' }}>
            <Text style={{ ...styles.ScheduleTitle, paddingLeft: hScale(10), paddingVertical: normalize(15) }}>{translate(messages.equipments)}</Text>
            {/* <TextInput
              style={{ ...styles.ScheduleContent, marginTop: vScale(-20), paddingLeft: hScale(10) }}
              multiline={true}
              numberOfLines={1}
              onChangeText={() => { setCalendarData({ ...calendarData }); setChange(!checkChange); }}
              placeholder={translate(messages.addMeetingRoomAndEquipment)}
            // value={}
            /> */}

            <TouchableOpacity onPress={() => { setSelectMeeting(true) }} style={{ marginTop: vScale(-5) }}>
              <Text numberOfLines={1} style={{ ...styles.ScheduleContent, ...styles.color999, paddingLeft: normalize(10) }}>{meeting != '' ? meeting : translate(messages.selectCategory)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={selectMeeting}
        >
          
          <View style={{ width: '100%', height: "100%" }}>
            <TouchableOpacity onPress={() => { setSelectMeeting(false) }}>
              <View style={{ backgroundColor: '#000', opacity: 0.9, width: '100%', height: '100%' }}>
              </View>
            </TouchableOpacity >
            <View style={{ position: 'absolute', bottom: 50, alignItems: 'center', width: '100%' }}>
              <TouchableOpacity onPress={() => { setSelectMeeting(false) }}>
                <View style={{ width: normalize(50), height: normalize(3), borderRadius: normalize(3), backgroundColor: '#cdcdcd', marginVertical: 10 }} />
              </TouchableOpacity>
              <View style={{ width: "100%", backgroundColor: '#fff', borderRadius: normalize(20), height: '95%', flexDirection: 'row' }}>
                <FlatList
                  data={listEquipmentsType}
                  renderItem={item => renderMeeting(item)}
                  keyExtractor={item => item.equipmentTypeId}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* <Modal 
          visible={false}
        >
         <View style={{ width: '100%', height: "100%" }}>
            <TouchableOpacity onPress={() => { setSelectMeeting(false) }}>
              <View style={{ backgroundColor: '#000', opacity: 0.9, width: '100%', height: '100%' }}>
              </View>
            </TouchableOpacity >
            <View style={{ position: 'absolute',bottom: 0, width: '100%', flexDirection: 'column', maxHeight: '90%', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { setSelectMeeting(false) }}>
                <View style={{ width: hScale(50), height: vScale(3), borderRadius: normalize(3), backgroundColor: '#cdcdcd', marginVertical: hScale(10) }} />
              </TouchableOpacity>
              <View style={{ width: '100%', height: vScale(10), borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#fff' }} />
              <View style={{ height: vScale(50), width: '100%', paddingHorizontal: hScale(10r), backgroundColor: '#fff',}}>
                    <TextInput 
                      style={{backgroundColor: 'red',}}
                    />
              </View>
              <View style={{ width: "100%", backgroundColor: '#fff', flexDirection: 'row', height: vScale(400) }}>
                <FlatList
                  data={listScheduleType}
                  renderItem={item => renderSchedule(item)}
                  keyExtractor={item => item.scheduleTypeId}
                />
              </View>
            </View>
          </View>
        </Modal> */}
      </View>
      <View style={[styles.ScheduleItem]}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.note)}</Text>
        </View>
        <TextInput
          style={[styles.ScheduleContent]}
          multiline={true}
          // numberOfLines={1}
          onChangeText={(note) => { setCalendarData({ ...calendarData, note: note }); setChange(!checkChange); }}
          placeholder={translate(messages.enterNote)}
          value={calendarData.note}
        />
      </View>
      <View style={[styles.ScheduleItem]}>
        <DynamicControlField
          controlType={ControlType.ADD_EDIT}
          fieldInfo={{
            fieldType: DefineFieldType.FILE,
            fieldLabel: '{"ja_jp":"添付ファイル","en_us":"添付ファイル","zh_cn":"添付ファイル"}',
            modifyFlag: ModifyFlag.REQUIRED_INPUT
          }}
          // elementStatus={{ fieldValue: {} }}
          updateStateElement={(
            // keyElement: string | any,
            // type: string | any,
            objEditValue: string | any) => { console.log(objEditValue) }} />
      </View>
      <View style={[styles.ScheduleItem]}>
        <MilestoneSuggestView
          typeSearch={1}// type search (SINGLE or MULTI)
          fieldLabel={translate(messages.milestone)}
          updateStateElement={() => { }}
        />
      </View>
      <View style={[styles.ScheduleItem]}>
        <TaskSuggestView
          typeSearch={1}// type search (SINGLE or MULTI)
          fieldLabel={translate(messages.task)}
          updateStateElement={() => { }}
        />
      </View>
      <View style={[styles.ScheduleItem]}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.publishingSetting)}</Text>
        </View>
        <View style={[styles.Row, styles.RowBottomNone]}>
          <Text style={{ ...styles.RowLeft, fontSize: normalize(15), paddingTop: normalize(3), color: '#999999' }}>{translate(messages.public)}</Text>
          <View>
            {calendarData.isPublic ?
              <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, isPublic: false });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: normalize(50), height: normalize(30) }} source={require('../../assets/images/icon_common/selected.png')} />
                </View>
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, isPublic: true });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: normalize(50), height: normalize(30) }} source={require('../../assets/images/icon_common/unselect.png')} />
                </View>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
      <View style={[styles.ScheduleItem]}>
        <View style={[styles.ScheduleTop]}>
          <Text style={[styles.ScheduleTitle]}>{translate(messages.editableSetting)}</Text>
        </View>
        <View style={[styles.Row, styles.RowBottomNone]}>
          <Text style={{ ...styles.RowLeft, fontSize: normalize(15), paddingTop: normalize(3) }}>
            {translate(messages.doNotAllowToEdit)}
          </Text>
          <View>
            {calendarData.canModify ?
              <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, canModify: false });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: normalize(50), height: normalize(30) }} source={require('../../assets/images/icon_common/selected.png')} />
                </View>
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={() => {
                  setCalendarData({ ...calendarData, canModify: true });
                  setChange(!checkChange);
                }}
              >
                <View>
                  <Image style={{ width: normalize(50), height: normalize(30) }} source={require('../../assets/images/icon_common/unselect.png')} />
                </View>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
      {typeScreen == 1 ? <View>
        <View style={[styles.ScheduleItem]}>
          <View style={[styles.ScheduleTop]}>
            <Text style={[styles.ScheduleTitle]}>{translate(messages.registrationDate)}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.ScheduleContent, styles.color999]}>
              {translate(messages.registrationDate)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.ScheduleItem]}>
          <View style={[styles.ScheduleTop]}>
            <Text style={[styles.ScheduleTitle]}>{translate(messages.registeredPeople)}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.ScheduleContent, styles.color999]}>
              {translate(messages.registeredPeople)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.ScheduleItem]}>
          <View style={[styles.ScheduleTop]}>
            <Text style={[styles.ScheduleTitle]}>{translate(messages.lastUpdatedDate)}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.ScheduleContent, styles.color999]}>
              {translate(messages.lastUpdatedDate)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.ScheduleItem]}>
          <View style={[styles.ScheduleTop]}>
            <Text style={[styles.ScheduleTitle]}>{translate(messages.finalUpdater)}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.ScheduleContent, styles.color999]}>
              {translate(messages.finalUpdater)}
            </Text>
          </TouchableOpacity>
        </View>
      </View> : null}
    </View>
  );
})
