import DateTimePicker from '@react-native-community/datetimepicker';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Picker,
  Platform,
  ScrollView, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { APP_DATE_FORMAT_DATABASE, DATE_MODE, FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import {
  DefineFieldType,
  FilterModeDate,
  FormatYmd,
  PlatformOS, ValueSetDate
} from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import { formatDateDatabase, getDateBeforeAfter } from '../../../../util/date-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldSearchMessages, messages } from './field-search-messages';
import { FieldSearchDateStyles } from './field-search-styles';

// Define value props of FieldSearchDate component
type IFieldSearchDateProps = IDynamicFieldProps;

/**
 * Component for searching text fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchDate(props: IFieldSearchDateProps) {
  const { fieldInfo, languageCode,formatDate } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [formatMd, setFormatMd] = useState(TEXT_EMPTY);
  const [isSeletedCondition, setIsSeletedCondition] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModeDate, setSearchModeDate] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectSetData, setSelectSetData] = useState(-1);
  const [saveValueSetting, setSaveValueSetting] = useState(TEXT_EMPTY);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const numberRegExp = new RegExp('^[0-9]*$');
  const userFormatDate = formatDate ? formatDate : APP_DATE_FORMAT_DATABASE;

  // value option
  const [dateFrom, setDateFrom] = useState(TEXT_EMPTY);
  const [dateTo, setDateTo] = useState(TEXT_EMPTY);

  const [dayFrom, setDayFrom] = useState(0);
  const [dayTo, setDayTo] = useState(0);
  const [monthFrom, setMonthFrom] = useState(0);
  const [monthTo, setMonthTo] = useState(0);
  const [monthDayFrom, setMonthDayFrom] = useState(TEXT_EMPTY);
  const [monthDayTo, setMonthDayTo] = useState(TEXT_EMPTY);

  const [statusDayTodayBeforeReal, setStatusDayTodayBeforeReal] = useState(true);
  const [statusDayTodayAfterReal, setStatusDayTodayAfterReal] = useState(true);
  const [statusDayBeforeAfterReal, setStatusDayBeforeAfterReal] = useState(true);

  const [numberDateBeforeAfterFrom, setNumberDateBeforeAfterFrom] = useState(TEXT_EMPTY);
  const [numberDateBeforeAfterTo, setNumberDateBeforeAfterTo] = useState(TEXT_EMPTY);
  const [numberDateBeforeFrom, setNumberDateBeforeFrom] = useState(TEXT_EMPTY);
  const [numberDateBeforeTo, setNumberDateBeforeTo] = useState(TEXT_EMPTY);
  const [numberDateAfterFrom, setNumberDateAfterFrom] = useState(TEXT_EMPTY);
  const [numberDateAfterTo, setNumberDateAfterTo] = useState(TEXT_EMPTY);
  const [numberMonthBeforeAfterFrom, setNumberMonthBeforeAfterFrom] = useState(TEXT_EMPTY);
  const [numberMonthBeforeAfterTo, setNumberMonthBeforeAfterTo] = useState(TEXT_EMPTY);
  const [numberYearBeforeAfterFrom, setNumberYearBeforeAfterFrom] = useState(TEXT_EMPTY);
  const [numberYearBeforeAfterTo, setNumberYearBeforeAfterTo] = useState(TEXT_EMPTY);

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
    setFormatMd(getFormatMonthDay(userFormatDate));
  }, []);

  // define list option 
  const listModeSearch = [
    { id: FilterModeDate.PeriodYmd, name: translate(fieldSearchMessages.optionSearchDate) },
    { id: FilterModeDate.PeriodMd, name: translate(fieldSearchMessages.optionSearchTime) },
    { id: FilterModeDate.DayBeforeAfter, name: translate(fieldSearchMessages.optionSearchDayBeforeLater) },
    { id: FilterModeDate.TodayBefore, name: translate(fieldSearchMessages.optionSearchDateBeforeAgo) },
    { id: FilterModeDate.TodayAfter, name: translate(fieldSearchMessages.optionSearchAfterLater) },
    { id: FilterModeDate.MonthBeforeAfter, name: translate(fieldSearchMessages.optionSearchMonthAgoLater) },
    { id: FilterModeDate.YearBeforeAfter, name: translate(fieldSearchMessages.optionSearchYearAgoLater) },
    { id: FilterModeDate.None, name: translate(fieldSearchMessages.optionSearchNoDate) }];

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    // const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
    const searchBlank = props.elementStatus && props.elementStatus.isSearchBlank ? props.elementStatus.isSearchBlank : false;
    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.DATE,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: TEXT_EMPTY,
        isSearchBlank: searchBlank,
        searchModeDate: searchModeDate,
      };
      props.updateStateElement(fieldInfo, DefineFieldType.DATE, conditions);
    }
  };

  /**
   * set show dat picker and set value element show
   * init current mounth and date
   * @param value
   */
  const showDatepicker = (value: any) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    if (value === ValueSetDate.dateFrom && dateFrom !== TEXT_EMPTY) {
      setDate(moment(dateFrom, userFormatDate.toUpperCase()).toDate());
    } else {
      setDate(currentDate);
    }
    if (value === ValueSetDate.dateTo && dateTo !== TEXT_EMPTY) {
      setDate(moment(dateTo, userFormatDate.toUpperCase()).toDate());
    } else {
      setDate(currentDate);
    }
    if (value === ValueSetDate.monthFrom) {
      if (monthFrom === 0 && dayFrom === 0) {
        setMonthFrom(currentMonth);
        setDayFrom(currentDay);
        setFormatMonthDay(currentMonth, currentDay, ValueSetDate.monthFrom);
      }
    }
    if (value === ValueSetDate.monthTo) {
      if (monthTo === 0 && dayTo === 0) {
        setMonthTo(currentMonth);
        setDayTo(currentDay);
        setFormatMonthDay(currentMonth, currentDay, ValueSetDate.monthTo);
      }
    }
    setShow(true);
    setSelectSetData(value);
  };

  /**
   * set selected month and return date
   * @param month
   */
  const setValueMonthDay = (valueSelected: number, selectedType: number) => {
    const date = new Date();
    setSelectSetData(selectedType);
    const dateValid = new Date(date.getFullYear(), valueSelected, 0);
    switch (selectedType) {
      case ValueSetDate.monthFrom:
        setMonthFrom(valueSelected);
        if (dayFrom > dateValid.getDate()) {
          setDayFrom(1);
          setFormatMonthDay(valueSelected, 1, ValueSetDate.monthFrom);
        } else {
          setFormatMonthDay(valueSelected, dayFrom, ValueSetDate.monthFrom);
        }
        break;
      case ValueSetDate.dayFrom:
        setDayFrom(valueSelected);
        setFormatMonthDay(monthFrom, valueSelected, ValueSetDate.dayFrom);
        break;
      case ValueSetDate.monthTo:
        setMonthTo(valueSelected);
        if (dayTo > dateValid.getDate()) {
          setDayTo(1)
          setFormatMonthDay(valueSelected, 1, ValueSetDate.monthTo);
        } else {
          setFormatMonthDay(valueSelected, dayTo, ValueSetDate.monthTo);
        }
        break;
      case ValueSetDate.dayTo:
        setDayTo(valueSelected);
        setFormatMonthDay(monthTo, valueSelected, ValueSetDate.dayTo);
        break;
      default:
        break;
    }
  }

  /**
   *  set day based on the selected month
   * @param month
   */
  const numberDayInMonth = (month: number) => {
    if (month < 1) {
      return 31;
    }
    const date = new Date();
    const validDate = new Date(date.getFullYear(), month, 0);
    return validDate.getDate();
  }

  /**
   *  get format month day from format user setting
   * @param formatYmd
   */
  const getFormatMonthDay = (formatYmd: string) => {
    let formatMd = "MM-DD"
    if (formatYmd) {
      const upserFormatYmd = formatYmd.toUpperCase();
      switch (upserFormatYmd) {
        case FormatYmd.YYYYMMDD:
          formatMd = FormatYmd.YYYYMMDD.substr(5, 5);
          break;
        case FormatYmd.MMDDYYYY:
          formatMd = FormatYmd.MMDDYYYY.substr(0, 5);
          break;
        case FormatYmd.DDMMYYYY:
          formatMd = FormatYmd.DDMMYYYY.substr(0, 5);
          break;
        default:
          break;
      }
    }
    return formatMd;
  }

  /**
   *  format date when change date piker
   * @param event,@param selectedDate
   */
  const onChangeDate = (_event: any, selectedDate: any) => {
    setShow(Platform.OS === PlatformOS.IOS);
    if (selectSetData === ValueSetDate.dateFrom) {
      if (selectedDate) {
        setDate(selectedDate);
        setDateFrom(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()))
      }
    }
    if (selectSetData === ValueSetDate.dateTo) {
      if (selectedDate) {
        setDate(selectedDate);
        setDateTo(moment(selectedDate, userFormatDate.toUpperCase()).format(userFormatDate.toUpperCase()));
      }
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
        fieldType: fieldInfo.fieldType,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        isSearchBlank: isSearchBlank,
      };
      let viewSearchCondition = TEXT_EMPTY;
      let valFrom = '';
      let valTo = '';
      switch (searchModeDate) {
        case FilterModeDate.PeriodYmd:
          if (dateFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${dateFrom}${translate(fieldSearchMessages.placeholderDateBefore)}`
          }
          if (dateTo !== TEXT_EMPTY) {
            viewSearchCondition += `${dateTo}${translate(fieldSearchMessages.placeholderDateAfter)}`
          }
          //TODO set timezone
          valFrom = dateFrom ? formatDateDatabase(dateFrom, userFormatDate) : '';
          valTo = dateTo ? formatDateDatabase(dateTo, userFormatDate) : '';
          break;
        case FilterModeDate.PeriodMd:
          if (monthDayFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${monthDayFrom}${translate(fieldSearchMessages.placeholderDateBefore)}`
            valFrom = monthDayFrom.replace("-", TEXT_EMPTY);
          } else {
            valFrom ="";
          }
          if (monthDayTo !== TEXT_EMPTY) {
            viewSearchCondition += `${monthDayTo}${translate(fieldSearchMessages.placeholderDateAfter)}`
            valTo = monthDayTo.replace("-", TEXT_EMPTY);
          } else {
            valTo = "";
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
          } else {
            valFrom = getDateBeforeAfter(numberDateBeforeAfterFrom, DATE_MODE.DATE_BEFORE);
            valTo = getDateBeforeAfter(numberDateBeforeAfterTo, DATE_MODE.DATE_AFTER);
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
          } else {
            valFrom = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
            valTo = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
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
          } else {
            valFrom = getDateBeforeAfter(numberDateAfterFrom, DATE_MODE.DATE_AFTER);
            valTo = getDateBeforeAfter(numberDateAfterTo, DATE_MODE.DATE_AFTER);
          }
          break;
        case FilterModeDate.MonthBeforeAfter:
          if (numberMonthBeforeAfterFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${numberMonthBeforeAfterFrom}${translate(fieldSearchMessages.labelMonthBeforeAfterFrom)}`
          }
          if (numberMonthBeforeAfterTo !== TEXT_EMPTY) {
            viewSearchCondition += `${numberMonthBeforeAfterTo}${translate(fieldSearchMessages.labelMonthBeforeAfterTo)}`
          }
          valFrom = getDateBeforeAfter(numberMonthBeforeAfterFrom, DATE_MODE.MONTH_BEFORE);
          valTo = getDateBeforeAfter(numberMonthBeforeAfterTo, DATE_MODE.MONTH_AFTER);
          break;
        case FilterModeDate.YearBeforeAfter:
          if (numberYearBeforeAfterFrom !== TEXT_EMPTY) {
            viewSearchCondition = `${numberYearBeforeAfterFrom}${translate(fieldSearchMessages.labelYearBeforeAfterFrom)}`
          }
          if (numberYearBeforeAfterTo !== TEXT_EMPTY) {
            viewSearchCondition += `${numberYearBeforeAfterTo}${translate(fieldSearchMessages.labelYearBeforeAfterTo)}`
          }
          valFrom = getDateBeforeAfter(numberYearBeforeAfterFrom, DATE_MODE.YEAR_BEFORE);
          valTo = getDateBeforeAfter(numberYearBeforeAfterTo, DATE_MODE.YEAR_AFTER);
          break;
        default:
          viewSearchCondition = translate(fieldSearchMessages.optionSearchNoDate);
          break;
      }

      if ((valFrom && valFrom.length > 0) || (valTo && valTo.length > 0)) {
        if ((!statusDayBeforeAfterReal && searchModeDate === FilterModeDate.DayBeforeAfter)
          || (!statusDayTodayBeforeReal && searchModeDate === FilterModeDate.TodayBefore)
          || (!statusDayTodayAfterReal && searchModeDate === FilterModeDate.TodayAfter)) {
          conditions['fieldValue'] = { from: valFrom, to: valTo, filterModeDate: searchModeDate };
        } else {
          conditions['fieldValue'] = { from: valFrom, to: valTo };
        }
      }
      setSaveValueSetting(viewSearchCondition);
      props.updateStateElement(fieldInfo, DefineFieldType.DATE, conditions);
    }
  }

  /**
   * return format month day
   * @param valueMonth
   * @param valueDay
   * @param setType
   */
  const setFormatMonthDay = (valueMonth: number, valueDay: number, setType: number) => {
    const date = new Date();
    const selectMonthDay = new Date(date.getFullYear(), valueMonth - 1, valueDay);
    const valueMonthDay = moment(selectMonthDay).format(formatMd);
    if (setType === ValueSetDate.monthFrom || setType === ValueSetDate.dayFrom) {
      setMonthDayFrom(valueMonthDay);
    }
    if (setType === ValueSetDate.monthTo || setType === ValueSetDate.dayTo) {
      setMonthDayTo(valueMonthDay);
    }

  }
  /**
   * set value when item change value
   */
  const setTextNumberValue = (valueInput: string, modeDate: number) => {
    if (valueInput.trim().length === 0 || numberRegExp.test(valueInput)) {
      switch (modeDate) {
        case ValueSetDate.numberDateBeforeAfterFrom:
          setNumberDateBeforeAfterFrom(valueInput);
          break;
        case ValueSetDate.numberDateBeforeAfterTo:
          setNumberDateBeforeAfterTo(valueInput);
          break;
        case ValueSetDate.numberDateBeforeFrom:
          setNumberDateBeforeFrom(valueInput);
          break;
        case ValueSetDate.numberDateBeforeTo:
          setNumberDateBeforeTo(valueInput);
          break;
        case ValueSetDate.numberDateAfterFrom:
          setNumberDateAfterFrom(valueInput);
          break;
        case ValueSetDate.numberDateAfterTo:
          setNumberDateAfterTo(valueInput);
          break;
        case ValueSetDate.numberMonthBeforeAfterFrom:
          setNumberMonthBeforeAfterFrom(valueInput);
          break;
        case ValueSetDate.numberMonthBeforeAfterTo:
          setNumberMonthBeforeAfterTo(valueInput);
          break;
        case ValueSetDate.numberYearBeforeAfterFrom:
          setNumberYearBeforeAfterFrom(valueInput);
          break;
        case ValueSetDate.numberYearBeforeAfterTo:
          setNumberYearBeforeAfterTo(valueInput);
          break;
        default:
          break;
      }
    }

  }

  /*
   * Render view date search
   */
  const renderViewDateSearch = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={FieldSearchDateStyles.title}>{title}</Text>
          {saveValueSetting.length <= 0 && (
            <Text style={FieldSearchDateStyles.placeholder}
            >{translate(messages.common_119908_06_placeholderSearchDate)}</Text>)
          }

          {saveValueSetting.length > 0 && (
            <Text style={FieldSearchDateStyles.labelValue}
            >{saveValueSetting}</Text>)
          }
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldSearchDateStyles.modalContainer}>
            {/* Click touchableOpacity close popup */}
            <TouchableOpacity
              style={[FieldSearchDateStyles.modalHeader,{ flex: searchModeDate >= 0 ? 0.01 : 1 }]}
              onPress={() => {
                setModalVisible(!modalVisible)
              }} />
            <Image style={FieldSearchDateStyles.modalIcon} source={modalIcon} />
            {/* Modal content */}
            <View style={[FieldSearchDateStyles.modalContent, { flex: searchModeDate >= 0 ? 7 : 3 }]}>

              {/* render list option search */}
              {renderOptionModalSearch()}

              {/* check status button setting */}
              {searchModeDate >= 0 && (
                <TouchableOpacity style={FieldSearchDateStyles.modalButton} onPress={() => { setModalVisible(false); confirmSearch(); }}>
                  <Text style={FieldSearchDateStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
                </TouchableOpacity>)
              }
              {searchModeDate < 0 && (
                <TouchableOpacity style={FieldSearchDateStyles.modalButtonDisable} disabled>
                  <Text style={FieldSearchDateStyles.textButtonDisable}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
                </TouchableOpacity>)
              }
            </View>
          </View>
        </Modal >
      </View>
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
            <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setSearchModeDate(item.id); setIsSeletedCondition(true); setShow(false); }}>
              <Text style={FieldSearchDateStyles.labelSearch} allowFontScaling>{item.name}</Text>
              {isSeletedCondition && item.id === searchModeDate &&
                <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.PeriodYmd &&
              renderOptionSearchDate()
            }

            {/* PeriodMd */}
            {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.PeriodMd &&
              renderPeriodMd()
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

            {/* MonthBeforeAfter */}
            {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.MonthBeforeAfter &&
              renderMonthBeforeAfter()
            }

            {/* YearBeforeAfter */}
            {isSeletedCondition && item.id === searchModeDate && searchModeDate === FilterModeDate.YearBeforeAfter &&
              renderYearBeforeAfter()
            }
            <View style={FieldSearchDateStyles.modalDivider} />

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
        <Text style={dateFrom?.length > 0 ? FieldSearchDateStyles.labelValueDate : FieldSearchDateStyles.labelPlaceholderSearch} onPress={() => showDatepicker(ValueSetDate.dateFrom)}>
          {dateFrom?.length > 0 ? dateFrom : translate(fieldSearchMessages.placeholderDate)}
          <Text style={FieldSearchDateStyles.labelValue}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </Text>
        {
          show && selectSetData === ValueSetDate.dateFrom && (
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )
        }
        <Text style={dateTo?.length > 0 ? FieldSearchDateStyles.labelValueDate : FieldSearchDateStyles.labelPlaceholderSearch} onPress={() => showDatepicker(ValueSetDate.dateTo)}>
          {dateTo?.length ? dateTo : translate(fieldSearchMessages.placeholderDate)}
          <Text style={FieldSearchDateStyles.labelValue}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </Text>
        {
          show && selectSetData === ValueSetDate.dateTo && (
            <DateTimePicker
              minimumDate={new Date(1753, 0, 2)}
              maximumDate={new Date(9999, 11, 31)}
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )
        }
      </View>
    );
  }

  /**
   * render compnent search month day
   */
  const renderPeriodMd = () => {
    return (
      <View>
        <Text style={monthDayFrom.length > 0 ? FieldSearchDateStyles.labelValueDate : FieldSearchDateStyles.labelDetailSearch} onPress={() => showDatepicker(ValueSetDate.monthFrom)}>
          {monthDayFrom}
          {monthDayFrom.length > 0 ? translate(fieldSearchMessages.placeholderDateBefore)
            : translate(fieldSearchMessages.placeholderDate)}
        </Text>
        {show && (selectSetData === ValueSetDate.monthFrom || selectSetData === ValueSetDate.dayFrom) && (
          <View>
            <View style={FieldSearchDateStyles.pulldownMonthDay}>
              <Picker mode={"dropdown"} style={FieldSearchDateStyles.pickerWith20}
                selectedValue={monthFrom}
                onValueChange={(itemValue) => { setValueMonthDay(itemValue, ValueSetDate.monthFrom); }}
              >
                {_.range(12).map((_n, index) =>
                  <Picker.Item label={(index + 1).toString()} value={index + 1} key={index} />
                )}
              </Picker>
              <Picker mode={"dropdown"} style={FieldSearchDateStyles.pickerWith20}
                selectedValue={dayFrom}
                onValueChange={(itemValue) => { setValueMonthDay(itemValue, ValueSetDate.dayFrom); }}
              >
                {_.range(numberDayInMonth(monthFrom)).map((_n, index) =>
                  <Picker.Item label={(index + 1).toString()} value={index + 1} key={index} />
                )}
              </Picker>
            </View>
          </View>
        )}
        <Text style={monthDayTo.length > 0 ? FieldSearchDateStyles.labelValueDate :
          FieldSearchDateStyles.labelDetailSearch} onPress={() => showDatepicker(ValueSetDate.monthTo)}>
          {monthDayTo}
          {monthDayTo.length > 0 ? translate(fieldSearchMessages.placeholderDateAfter)
            : translate(fieldSearchMessages.placeholderDate)}
        </Text>
        {show && (selectSetData === ValueSetDate.monthTo || selectSetData === ValueSetDate.dayTo) && (
          <View style={FieldSearchDateStyles.pulldownMonthDay}>
            <Picker mode={"dropdown"} style={FieldSearchDateStyles.pickerWith20}
              selectedValue={monthTo}
              onValueChange={(itemValue) => { setValueMonthDay(itemValue, ValueSetDate.monthTo); }}
            >
              {_.range(12).map((_n, index) =>
                <Picker.Item label={(index + 1).toString()} value={index + 1} key={index} />
              )}
            </Picker>
            <Picker mode={"dropdown"} style={FieldSearchDateStyles.pickerWith20}
              selectedValue={dayTo}
              onValueChange={(itemValue) => { setValueMonthDay(itemValue, ValueSetDate.dayTo); }}
            >
              {_.range(numberDayInMonth(monthTo)).map((_n, index) =>
                <Picker.Item label={(index + 1).toString()} value={index + 1} key={index} />
              )}
            </Picker>
          </View>
        )}
      </View>
    )
  }

  /**
   * render compnent search day before after
   */
  const renderDayBeforeAfter = () => {
    return (
      <View>
        <View style={FieldSearchDateStyles.viewBoxFrom}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateBeforeAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateBeforeAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoDayBefore)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateStyles.viewBoxTo}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateBeforeAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateBeforeAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoDayAfter)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayBeforeAfterReal(true); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayBeforeAfterReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayBeforeAfterReal(false); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayBeforeAfterReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
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
        <View style={FieldSearchDateStyles.viewBoxFrom}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateBeforeFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateBeforeFrom)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateBeforeFrom)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateStyles.viewBoxTo}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateBeforeTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateBeforeTo)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateBeforeTo)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayTodayBeforeReal(true); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayTodayBeforeReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayTodayBeforeReal(false); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayTodayBeforeReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
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
        <View style={FieldSearchDateStyles.viewBoxFrom}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberDateAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateAfterFrom)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateStyles.viewBoxTo}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberDateAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberDateAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneDateAfterTo)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayTodayAfterReal(true); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelRealDay)}
          </Text>
          {statusDayTodayAfterReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={FieldSearchDateStyles.modalOption} onPress={() => { setStatusDayTodayAfterReal(false); }}>
          <Text style={[FieldSearchDateStyles.labelDetailSearchDay]}>
            {translate(fieldSearchMessages.labelBusinessDay)}
          </Text>
          {!statusDayTodayAfterReal &&
            <Image style={FieldSearchDateStyles.iconSelected} source={selectedIcon} />
          }
        </TouchableOpacity>

      </View>

    )
  }

  /**
   * render compnent search month before after
   */
  const renderMonthBeforeAfter = () => {
    return (
      <View>
        <View style={FieldSearchDateStyles.viewBoxFrom}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberMonthBeforeAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberMonthBeforeAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneMonthFrom)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateStyles.viewBoxTo}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberMonthBeforeAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberMonthBeforeAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneMonthTo)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

      </View>

    )
  }

  /**
   * render compnent search year before after
   */
  const renderYearBeforeAfter = () => {
    return (
      <View>
        <View style={FieldSearchDateStyles.viewBoxFrom}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              placeholder={"0"}
              maxLength={5}
              value={numberYearBeforeAfterFrom}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberYearBeforeAfterFrom)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneYearFrom)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateBefore)}</Text>
        </View>

        <View style={FieldSearchDateStyles.viewBoxTo}>
          <View style={FieldSearchDateStyles.viewBoxInput}>
            <TextInput
              keyboardType="numeric"
              style={FieldSearchDateStyles.inputText}
              maxLength={5}
              placeholder={"0"}
              value={numberYearBeforeAfterTo}
              onChangeText={(textValue) => setTextNumberValue(textValue, ValueSetDate.numberYearBeforeAfterTo)}
            ></TextInput>
            <Text style={FieldSearchDateStyles.labelDay}>{translate(fieldSearchMessages.labelNoneYearTo)}</Text>
          </View>
          <Text style={FieldSearchDateStyles.labelFromTo}>{translate(fieldSearchMessages.placeholderDateAfter)}</Text>
        </View>

      </View>

    )
  }


  /*
   * Render the date component 
   */
  const renderComponent = () => {
    return renderViewDateSearch();
  }
  return renderComponent();
}
