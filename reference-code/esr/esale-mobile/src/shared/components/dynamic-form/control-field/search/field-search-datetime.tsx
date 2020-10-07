import DateTimePicker from '@react-native-community/datetimepicker';
import dateFnsFormat from 'date-fns/format';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { APP_DATE_FORMAT_DATABASE, DATE_MODE, FIELD_LABLE, TEXT_EMPTY, TIME_FORMAT } from '../../../../../config/constants/constants';
import {
  DefineFieldType,
  FilterModeDate,
  PlatformOS, ValueSetDateTime
} from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import { DATE_TIME_FORMAT, DEFAULT_TIME, getDateBeforeAfter, getTimezonesOffset, tzDateToDateTimeUtc, tzToUtc } from '../../../../util/date-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldSearchMessages, messages } from './field-search-messages';
import { FieldSearchDateTimeStyles } from './field-search-styles';

// Define value props of FieldSearchDate component
type IFieldSearchDateTimeProps = IDynamicFieldProps;

/**
 * Component for searching datetime fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchDateTime(props: IFieldSearchDateTimeProps) {
  const { fieldInfo, languageCode, formatDate, timezoneName } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png")
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [isSeletedCondition, setIsSeletedCondition] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModeDate, setSearchModeDate] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectSetData, setSelectSetData] = useState(-1);
  const [saveValueSetting, setSaveValueSetting] = useState("");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const numberRegExp = new RegExp('^[0-9]*$');
  const userFormatDate = formatDate ? formatDate : APP_DATE_FORMAT_DATABASE;
  const DEFAULT_TIME_FROM = '00:00';
  const DEFAULT_TIME_TO = '23:59';

  // value option
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  const [singleTimeFrom, setSingleTimeFrom] = useState("");
  const [singleTimeTo, setSingleTimeTo] = useState("");
  const [singleDateFrom, setSingleDateFrom] = useState("");
  const [singleDateTo, setSingleDateTo] = useState("");

  const [statusDayBeforeAfterReal, setStatusDayBeforeAfterReal] = useState(true);
  const [statusDayTodayBeforeReal, setStatusDayTodayBeforeReal] = useState(true);
  const [statusDayTodayAfterReal, setStatusDayTodayAfterReal] = useState(true);

  const [numberDateBeforeAfterFrom, setNumberDateBeforeAfterFrom] = useState("");
  const [numberDateBeforeAfterTo, setNumberDateBeforeAfterTo] = useState("");
  const [numberDateBeforeFrom, setNumberDateBeforeFrom] = useState("");
  const [numberDateBeforeTo, setNumberDateBeforeTo] = useState("");
  const [numberDateAfterFrom, setNumberDateAfterFrom] = useState("");
  const [numberDateAfterTo, setNumberDateAfterTo] = useState("");

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
  }, []);

  // define list option 
  const listModeSearch = [
    { id: FilterModeDate.PeriodYmdHm, name: translate(fieldSearchMessages.optionFilterDateTime) },
    { id: FilterModeDate.PeriodHm, name: translate(fieldSearchMessages.optionFilterTime) },
    { id: FilterModeDate.PeriodYmd, name: translate(fieldSearchMessages.optionFilterDate) },
    { id: FilterModeDate.DayBeforeAfter, name: translate(fieldSearchMessages.optionFilterDayBeforeAfter) },
    { id: FilterModeDate.TodayBefore, name: translate(fieldSearchMessages.optionFilterTodayBefore) },
    { id: FilterModeDate.TodayAfter, name: translate(fieldSearchMessages.optionFilterTodayAfter) },
    { id: FilterModeDate.None, name: translate(fieldSearchMessages.optionFilterNone) }];

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    // const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
    const searchBlank = props.elementStatus && props.elementStatus.isSearchBlank ? props.elementStatus.isSearchBlank : false;

    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.DATE_TIME,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: [],
        isSearchBlank: searchBlank,
        searchModeDate: searchModeDate,

      };
      props.updateStateElement(fieldInfo, DefineFieldType.DATE_TIME, conditions);
    }
  };

  /**
   * set show dat picker and set value element show
   * init current mounth and date
   * @param value
   */
  const showDateTimepicker = (value: any) => {
    let currentDate = new Date();
    let chosenTime: any[] = [];
    switch (value) {
      case ValueSetDateTime.dateFrom:
        if (dateFrom !== TEXT_EMPTY) {
          setDate(moment(dateFrom, userFormatDate.toUpperCase()).toDate());
        } else {
          setDate(currentDate);
        }
        break;
      case ValueSetDateTime.dateTo:
        if (dateTo !== TEXT_EMPTY) {
          setDate(moment(dateTo, userFormatDate.toUpperCase()).toDate());
        } else {
          setDate(currentDate);
        }
        break;
      case ValueSetDateTime.singleDateFrom:
        if (singleDateFrom !== TEXT_EMPTY) {
          setDate(moment(singleDateFrom, userFormatDate.toUpperCase()).toDate());
        } else {
          setDate(currentDate);
        }
        break;
      case ValueSetDateTime.singleDateTo:
        if (singleDateTo !== TEXT_EMPTY) {
          setDate(moment(singleDateTo, userFormatDate.toUpperCase()).toDate());
        } else {
          setDate(currentDate);
        }
        break;
      case ValueSetDateTime.timeFrom:
        if (timeFrom?.length > 0) {
          chosenTime = timeFrom.split(':');
        }
        if (chosenTime.length == 2) {
          currentDate.setHours(parseInt(chosenTime[0]))
          currentDate.setMinutes(parseInt(chosenTime[1]))
        }
        setDate(currentDate);
        break;
      case ValueSetDateTime.timeTo:
        if (timeTo?.length > 0) {
          chosenTime = timeTo.split(':');
        }
        if (chosenTime.length == 2) {
          currentDate.setHours(parseInt(chosenTime[0]))
          currentDate.setMinutes(parseInt(chosenTime[1]))
        }
        setDate(currentDate);
        break;
      case ValueSetDateTime.singleTimeFrom:
        if (singleTimeFrom?.length > 0) {
          chosenTime = singleTimeFrom.split(':');
        }
        if (chosenTime.length == 2) {
          currentDate.setHours(parseInt(chosenTime[0]))
          currentDate.setMinutes(parseInt(chosenTime[1]))
        }
        setDate(currentDate);
        break;
      case ValueSetDateTime.singleTimeTo:
        if (singleTimeTo?.length > 0) {
          chosenTime = singleTimeTo.split(':');
        }
        if (chosenTime.length == 2) {
          currentDate.setHours(parseInt(chosenTime[0]))
          currentDate.setMinutes(parseInt(chosenTime[1]))
        }
        setDate(currentDate);
        break;
      default:
        break;
    }

    setShow(true);
    setSelectSetData(value);
  };

  /**
   *  format date when change date piker
   * @param event,@param selectedDate
   */
  const onChangeDateTime = (_event: any, selectedDate: any) => {
    setShow(Platform.OS === PlatformOS.IOS);
    if (selectedDate) {
      setDate(selectedDate);
    }
    switch (selectSetData) {
      case ValueSetDateTime.dateFrom:
        if (selectedDate) {
          setDateFrom(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()));
        }
        break;
      case ValueSetDateTime.timeFrom:
        if (selectedDate) {
          setTimeFrom(moment(selectedDate, TIME_FORMAT).format(TIME_FORMAT));
        }
        break;
      case ValueSetDateTime.dateTo:
        if (selectedDate) {
          setDateTo(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()));
        }
        break;
      case ValueSetDateTime.timeTo:
        if (selectedDate) {
          setTimeTo(moment(selectedDate, TIME_FORMAT).format(TIME_FORMAT));
        }
        break;
      case ValueSetDateTime.singleTimeFrom:
        if (selectedDate) {
          setSingleTimeFrom(moment(selectedDate, TIME_FORMAT).format(TIME_FORMAT));
        }
        break;
      case ValueSetDateTime.singleTimeTo:
        if (selectedDate) {
          setSingleTimeTo(moment(selectedDate, TIME_FORMAT).format(TIME_FORMAT));
        }
        break;
      case ValueSetDateTime.singleDateFrom:
        if (selectedDate) {
          setSingleDateFrom(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()));
        }
        break;
      case ValueSetDateTime.singleDateTo:
        if (selectedDate) {
          setSingleDateTo(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()));
        }
        break;

      default:
        break;
    }

  };


  /**
   * Resolve when click button confirm
   */
  const confirmSearch = () => {
    let isSearchBlank = searchModeDate === FilterModeDate.None;
    if (props.updateStateElement && !props.isDisabled) {
      const conditions: any = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.DATE_TIME,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        isSearchBlank: isSearchBlank,
        searchModeDate: searchModeDate,
      };
      let viewSearchCondition = TEXT_EMPTY;
      let valFrom = TEXT_EMPTY;
      let valTo = TEXT_EMPTY;
      let timeZoneOffset;
      switch (searchModeDate) {
        case FilterModeDate.PeriodYmdHm:

          if (dateFrom !== TEXT_EMPTY || timeFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${dateFrom} ${timeFrom}${translate(fieldSearchMessages.placeholderDateBefore)}`
          }
          if (dateTo !== TEXT_EMPTY || timeTo !== TEXT_EMPTY) {
            viewSearchCondition += `${dateTo} ${timeTo}${translate(fieldSearchMessages.placeholderDateAfter)}`
          }
          let hhMMFrom;
          let hhMMTo;
          if (timeFrom?.length > 0) {
            hhMMFrom = ` ${timeFrom}:00`
          } else {
            hhMMFrom = "00:00:00";
          }
          if (timeTo?.length > 0) {
            hhMMTo = ` ${timeTo}:59`
          } else {
            hhMMTo = " 23:59:59"
          }
          if (dateFrom) {
            let dateConvert = moment(dateFrom, userFormatDate.toUpperCase()).toDate()
            valFrom = tzToUtc(dateFnsFormat(dateConvert, APP_DATE_FORMAT_DATABASE) + hhMMFrom, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database);
          } else {
            valFrom = "";
          }
          if (dateTo) {
            let dateConvert = moment(dateTo, userFormatDate.toUpperCase()).toDate()
            valTo = tzToUtc(dateFnsFormat(dateConvert, APP_DATE_FORMAT_DATABASE) + hhMMTo, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database);
          } else {
            valTo = "";
          }
          break;
        case FilterModeDate.PeriodHm:
          if (singleTimeFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${singleTimeFrom}${translate(fieldSearchMessages.placeholderDateBefore)}`
            valFrom = singleTimeFrom;
          }
          else {
            valFrom = DEFAULT_TIME_FROM;
          }
          if (singleTimeTo !== TEXT_EMPTY || timeTo !== TEXT_EMPTY) {
            viewSearchCondition += `${singleTimeTo}${translate(fieldSearchMessages.placeholderDateAfter)}`
            valTo = singleTimeTo;
          }
          else {
            valTo = DEFAULT_TIME_TO;
          }
          break;
        case FilterModeDate.PeriodYmd:
          if (singleDateFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${singleDateFrom}${translate(fieldSearchMessages.placeholderDateBefore)}`
            let dateConvert = moment(singleDateFrom, userFormatDate.toUpperCase()).toDate()
            valFrom = singleDateFrom ? tzDateToDateTimeUtc(dateFnsFormat(dateConvert, APP_DATE_FORMAT_DATABASE), timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM) : "";
          } else {
            valFrom = '';
          }
          if (singleDateTo !== TEXT_EMPTY) {
            let dateConvert = moment(singleDateTo, userFormatDate.toUpperCase()).toDate()
            viewSearchCondition += `${singleDateTo}${translate(fieldSearchMessages.placeholderDateAfter)}`
            valTo = singleDateTo ? tzDateToDateTimeUtc(dateFnsFormat(dateConvert, APP_DATE_FORMAT_DATABASE), timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO) : "";
          } else {
            valTo = '';
          }
          break;
        case FilterModeDate.DayBeforeAfter:
          if (numberDateBeforeAfterFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${numberDateBeforeAfterFrom}${translate(fieldSearchMessages.labelDayBefore)}`
          }
          if (numberDateBeforeAfterTo !== TEXT_EMPTY) {
            viewSearchCondition += `${numberDateBeforeAfterTo}${translate(fieldSearchMessages.labelDayAfter)}`
          }
          if (!statusDayBeforeAfterReal) {
            valFrom = numberDateBeforeAfterFrom;
            valTo = numberDateBeforeAfterTo;
            timeZoneOffset = getTimezonesOffset(timezoneName);
          } else {
            valFrom = getDateBeforeAfter(numberDateBeforeAfterFrom, DATE_MODE.DATE_BEFORE);
            valTo = getDateBeforeAfter(numberDateBeforeAfterTo, DATE_MODE.DATE_AFTER);
            if (valFrom && valTo && valFrom.localeCompare(valTo) > 0) {
              valFrom = '';
              valTo = '';
            } else {
              valFrom = `${valFrom ? `${tzDateToDateTimeUtc(valFrom, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
              valTo = `${valTo ? `${tzDateToDateTimeUtc(valTo, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
            }
          }
          break;
        case FilterModeDate.TodayBefore:
          if (numberDateBeforeFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${numberDateBeforeFrom}${translate(fieldSearchMessages.labelDateBeforeFrom)}`
          }
          if (numberDateBeforeTo !== TEXT_EMPTY) {
            viewSearchCondition += `${numberDateBeforeTo}${translate(fieldSearchMessages.labelDateBeforeTo)}`
          }
          if (!statusDayTodayBeforeReal) {
            valFrom = numberDateBeforeFrom;
            valTo = numberDateBeforeTo;
            timeZoneOffset = getTimezonesOffset(timezoneName);
          } else {
            valFrom = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
            valTo = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
            if (valFrom && valTo && valFrom.localeCompare(valTo) > 0) {
              valFrom = '';
              valTo = '';
            } else {
              valFrom = `${valFrom ? `${tzDateToDateTimeUtc(valFrom, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
              valTo = `${valTo ? `${tzDateToDateTimeUtc(valTo, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
            }
          }
          break;
        case FilterModeDate.TodayAfter:
          if (numberDateAfterFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${numberDateAfterFrom}${translate(fieldSearchMessages.labelDateAfterFrom)}`
          }
          if (numberDateAfterTo !== TEXT_EMPTY) {
            viewSearchCondition += `${numberDateAfterTo}${translate(fieldSearchMessages.labelDateAfterTo)}`
          }
          if (!statusDayTodayAfterReal) {
            valFrom = numberDateAfterFrom;
            valTo = numberDateAfterTo;
            timeZoneOffset = getTimezonesOffset(timezoneName);
          } else {
            valFrom = getDateBeforeAfter(numberDateAfterFrom, DATE_MODE.DATE_AFTER);
            valTo = getDateBeforeAfter(numberDateAfterTo, DATE_MODE.DATE_AFTER);
            if (valFrom && valTo && valFrom.localeCompare(valTo) > 0) {
              valFrom = '';
              valTo = '';
            } else {
              valFrom = `${valFrom ? `${tzDateToDateTimeUtc(valFrom, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
              valTo = `${valTo ? `${tzDateToDateTimeUtc(valTo, timezoneName, userFormatDate, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
            }
          }
          break;
        default:
          viewSearchCondition = translate(fieldSearchMessages.optionFilterNone);
          break;
      }

      if ((valFrom && valFrom.length > 0) || (valTo && valTo.length > 0)) {
        if ((!statusDayBeforeAfterReal && searchModeDate === FilterModeDate.DayBeforeAfter)
          || (!statusDayTodayBeforeReal && searchModeDate === FilterModeDate.TodayBefore)
          || (!statusDayTodayAfterReal && searchModeDate === FilterModeDate.TodayAfter)) {
          conditions['fieldValue'] = { from: valFrom, to: valTo, filterModeDate: searchModeDate };
          conditions['timeZoneOffset'] = timeZoneOffset;
        } else {
          conditions['fieldValue'] = { from: valFrom, to: valTo };
        }
      }
      setSaveValueSetting(viewSearchCondition);
      props.updateStateElement(fieldInfo, DefineFieldType.DATE_TIME, conditions);
    }
  }

  /**
   * set value when item change value
   */
  const setTextNumberValue = (valueInput: string, modeDate: number) => {
    if (valueInput.trim().length === 0 || numberRegExp.test(valueInput)) {
      switch (modeDate) {
        case ValueSetDateTime.numberDateBeforeAfterFrom:
          setNumberDateBeforeAfterFrom(valueInput);
          break;
        case ValueSetDateTime.numberDateBeforeAfterTo:
          setNumberDateBeforeAfterTo(valueInput);
          break;
        case ValueSetDateTime.numberDateBeforeFrom:
          setNumberDateBeforeFrom(valueInput);
          break;
        case ValueSetDateTime.numberDateBeforeTo:
          setNumberDateBeforeTo(valueInput);
          break;
        case ValueSetDateTime.numberDateAfterFrom:
          setNumberDateAfterFrom(valueInput);
          break;
        case ValueSetDateTime.numberDateAfterTo:
          setNumberDateAfterTo(valueInput);
          break;
        default:
          break;
      }
    }

  }

  /*
   * Render view date search
   */
  const renderViewDateTimeSearch = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={FieldSearchDateTimeStyles.title}>{title}</Text>
          {saveValueSetting.length <= 0 && (
            <Text style={FieldSearchDateTimeStyles.placeholder}
            >{translate(messages.common_119908_08_placeholderSearchDateTime)}</Text>)
          }
          {saveValueSetting.length > 0 && (
            <Text style={FieldSearchDateTimeStyles.labelValue}
            >{saveValueSetting}</Text>)
          }
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={FieldSearchDateTimeStyles.modalContainer}>
            {/* Click touchableOpacity close popup */}
            <TouchableOpacity
              style={{ flex: searchModeDate >= 0 ? 0.5 : 1.4 }}
              onPress={() => {
                setModalVisible(!modalVisible)
              }} />
            <Image style={FieldSearchDateTimeStyles.modalIcon} source={modalIcon} />
            {/* Modal content */}
            <View style={[FieldSearchDateTimeStyles.modalContent, { flex: searchModeDate >= 0 ? 6 : 3 }]}>
              {/* render list option search */}
              {renderOptionModalSearch()}

              {/* check status button setting */}
              {searchModeDate >= 0 && (
                <TouchableOpacity style={FieldSearchDateTimeStyles.modalButton} onPress={() => { setModalVisible(false); confirmSearch(); }}>
                  <Text style={FieldSearchDateTimeStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
                </TouchableOpacity>)
              }
              {searchModeDate < 0 && (
                <TouchableOpacity style={FieldSearchDateTimeStyles.modalButtonDisable} disabled>
                  <Text style={FieldSearchDateTimeStyles.textButtonDisable}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
                </TouchableOpacity>)
              }
            </View>
          </View>
        </Modal>
      </View >
    );
  }

  /*
   * Render the text component in add-edit case
   */
  const renderOptionModalSearch = () => {
    return (
      <ScrollView>
        <FlatList
          data={listModeSearch}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) =>
            <View>
              <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption}
                onPress={() => { setSearchModeDate(item.id); setIsSeletedCondition(true); setShow(false); }}>
                <Text style={FieldSearchDateTimeStyles.labelSearch} allowFontScaling>{item.name}</Text>
                {isSeletedCondition && item.id === searchModeDate &&
                  <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
                }
              </TouchableOpacity>
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.PeriodYmdHm &&
                renderOptionSearchDateTime()
              }

              {/* PeriodYmd */}
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.PeriodHm &&
                renderOptionSearchTime()
              }

              {/* PeriodYmd */}
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.PeriodYmd &&
                renderOptionSearchDate()
              }

              {/* DayBeforeAfter */}
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.DayBeforeAfter &&
                renderDayBeforeAfter()
              }

              {/* TodayBefore */}
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.TodayBefore &&
                renderTodayBefore()
              }

              {/* TodayAfter */}
              {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.TodayAfter &&
                renderTodayAfter()
              }

              <View style={FieldSearchDateTimeStyles.modalDivider} />

            </View>
          }
        />
      </ScrollView>
    )
  }

  /**
   * render compnent search date
   */
  const renderOptionSearchDate = () => {
    return (
      <View>
        <Text style={singleDateFrom?.length > 0 ? FieldSearchDateTimeStyles.labelValueDate : FieldSearchDateTimeStyles.labelPlaceholderSearch}
          onPress={() => showDateTimepicker(ValueSetDateTime.singleDateFrom)}>
          {singleDateFrom?.length > 0 ? singleDateFrom : translate(fieldSearchMessages.placeholderDate)}
          <Text style={FieldSearchDateTimeStyles.labelValue}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </Text>
        {
          show && selectSetData === ValueSetDateTime.singleDateFrom && (
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDateTime}
            />
          )
        }
        <Text style={singleDateTo?.length > 0 ? FieldSearchDateTimeStyles.labelValueDate : FieldSearchDateTimeStyles.labelPlaceholderSearch}
          onPress={() => showDateTimepicker(ValueSetDateTime.singleDateTo)}>
          {singleDateTo?.length ? singleDateTo : translate(fieldSearchMessages.placeholderDate)}
          <Text style={FieldSearchDateTimeStyles.labelValue}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </Text>
        {
          show && selectSetData === ValueSetDateTime.singleDateTo && (
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDateTime}
            />
          )
        }
      </View>
    );
  }

  /**
  * render compnent search date time
  */
  const renderOptionSearchDateTime = () => {
    return (

      <View>
        <View style={[FieldSearchDateTimeStyles.modalSearchDetail, FieldSearchDateTimeStyles.paddingTop0]}>
          <View style={FieldSearchDateTimeStyles.modalOptionRangeDate}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.dateFrom)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeFrom,
              dateFrom?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {dateFrom?.length > 0 ? dateFrom : `${translate(fieldSearchMessages.dateLabel)}${translate(fieldSearchMessages.datePlaceholder)}`}
            </Text>
          </View>
          <View style={FieldSearchDateTimeStyles.modalOptionFlex1}></View>
          <View style={FieldSearchDateTimeStyles.modalOptionRangeTime}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.timeFrom)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeTo,
              timeFrom?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {timeFrom?.length > 0 ? timeFrom : `${translate(fieldSearchMessages.timeLabel)}${translate(fieldSearchMessages.timePlaceholder)}`}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.lableRangeView}>{translate(fieldSearchMessages.lableSearchBeforeTime)}</Text>
        </View>
        <View>
          {show && selectSetData === ValueSetDateTime.dateFrom &&
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              display="default"
              minuteInterval={5}
              onChange={onChangeDateTime}
            />
          }
        </View>
        <View>
          {show && selectSetData === ValueSetDateTime.timeFrom &&
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onChangeDateTime}
            />
          }
        </View>
        <View style={[FieldSearchDateTimeStyles.modalSearchDetail, FieldSearchDateTimeStyles.paddingTop0]}>
          <View style={FieldSearchDateTimeStyles.modalOptionRangeDate}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.dateTo)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeFrom,
              dateTo?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {dateTo?.length > 0 ? dateTo : `${translate(fieldSearchMessages.dateLabel)}${translate(fieldSearchMessages.datePlaceholder)}`}
            </Text>
          </View>
          <View style={FieldSearchDateTimeStyles.modalOptionFlex1}></View>
          <View style={FieldSearchDateTimeStyles.modalOptionRangeTime}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.timeTo)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeTo,
              timeTo?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {timeTo?.length > 0 ? timeTo : `${translate(fieldSearchMessages.timeLabel)}${translate(fieldSearchMessages.timePlaceholder)}`}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.lableRangeView}>{translate(fieldSearchMessages.lableSearchAfterTime)}</Text>
        </View>
        <View>
          {show && selectSetData === ValueSetDateTime.dateTo &&
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDateTime}
            />
          }
        </View>
        <View>
          {show && selectSetData === ValueSetDateTime.timeTo &&
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={false}
              display="default"
              minuteInterval={5}
              onChange={onChangeDateTime}
            />
          }
        </View>
      </View>
    );
  }

  /**
   * render compnent search time
   */
  const renderOptionSearchTime = () => {
    return (
      <View>
        <View style={[FieldSearchDateTimeStyles.modalSearchDetail, FieldSearchDateTimeStyles.paddingTop0]}>
          <View style={FieldSearchDateTimeStyles.modalOptionRange}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.singleTimeFrom)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeFrom,
              singleTimeFrom?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {singleTimeFrom?.length > 0 ? singleTimeFrom : translate(fieldSearchMessages.placeholderTimeChoose)}</Text>
            <Text style={FieldSearchDateTimeStyles.lableRange}>{translate(fieldSearchMessages.lableSearchBeforeTime)}</Text>
          </View>
          <View style={FieldSearchDateTimeStyles.modalOptionRange}>
            <Text
              onPress={() => showDateTimepicker(ValueSetDateTime.singleTimeTo)}
              style={[FieldSearchDateTimeStyles.modalTimeRangeTo,
              singleTimeTo?.length > 0 ? FieldSearchDateTimeStyles.colorText : FieldSearchDateTimeStyles.colorPlaceholder]}>
              {singleTimeTo?.length > 0 ? singleTimeTo : translate(fieldSearchMessages.placeholderTimeChoose)}</Text>
            <Text style={FieldSearchDateTimeStyles.lableRange}>{translate(fieldSearchMessages.lableSearchAfterTime)}</Text>
          </View>
        </View>
        <View>
          {show && (selectSetData === ValueSetDateTime.singleTimeFrom || selectSetData === ValueSetDateTime.singleTimeTo) &&
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              is24Hour={false}
              minuteInterval={5}
              onChange={onChangeDateTime}
            />
          }
        </View>
      </View>
    );
  }

  /**
   * render compnent search day before after
   */
  const renderDayBeforeAfter = () => {
    return (
      <View>
        <View style={FieldSearchDateTimeStyles.viewBoxFrom}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateBeforeAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateBeforeAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoDayBefore)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateTimeStyles.viewBoxTo}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateBeforeAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateBeforeAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoDayAfter)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayBeforeAfterReal(true); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayBeforeAfterReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayBeforeAfterReal(false); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayBeforeAfterReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>
      </View>

    )
  }

  /**
   * render compnent search today before
   */
  const renderTodayBefore = () => {
    return (
      <View>
        <View style={FieldSearchDateTimeStyles.viewBoxFrom}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateBeforeFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateBeforeFrom)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateBeforeFrom)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateTimeStyles.viewBoxTo}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateBeforeTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateBeforeTo)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateBeforeTo)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayTodayBeforeReal(true); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayTodayBeforeReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayTodayBeforeReal(false); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayTodayBeforeReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

      </View>

    )
  }

  /**
   * render compnent search today before
   */
  const renderTodayAfter = () => {
    return (
      <View>
        <View style={FieldSearchDateTimeStyles.viewBoxFrom}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateAfterFrom)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateTimeStyles.viewBoxTo}>
          <View style={FieldSearchDateTimeStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateTimeStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDateTime.numberDateAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateTimeStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateAfterTo)}</Text>
          </View>
          <Text style={FieldSearchDateTimeStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayTodayAfterReal(true); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayTodayAfterReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateTimeStyles.modalOption} onPress={() => { setStatusDayTodayAfterReal(false); }}>
          <Text style={[FieldSearchDateTimeStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayTodayAfterReal &&
            <Image style={FieldSearchDateTimeStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

      </View>

    )
  }


  /*
   * Render the date component 
   */
  const renderComponent = () => {
    return renderViewDateTimeSearch();
  }
  return renderComponent();
}

