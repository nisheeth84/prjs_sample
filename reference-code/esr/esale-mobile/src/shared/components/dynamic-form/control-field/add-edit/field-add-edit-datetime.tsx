import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY, TIME_FORMAT, DEFAULT_TIMEZONE, APP_DATE_FORMAT_DATABASE } from '../../../../../config/constants/constants';
import { FieldAddEditDateTimeStyles } from './field-add-edit-styles';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag, PlatformOS } from '../../../../../config/constants/enum';
import {
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { translate } from '../../../../../config/i18n';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { utcToTz, DATE_TIME_FORMAT, tzToUtc } from '../../../../util/date-utils';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';

// Define value props of FieldAddEditDateTime component
type IFieldAddEditDateTimeProps = IDynamicFieldProps;

/**
 * Component for inputing datetime fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditDateTime(props: IFieldAddEditDateTimeProps) {
  const { fieldInfo, languageCode, timezoneName, formatDate } = props;
  const value = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [viewDate, setViewDate] = useState(TEXT_EMPTY);
  const [showDate, setShowDate] = useState(false);
  const [viewTime, setViewTime] = useState(TEXT_EMPTY);
  const [showTime, setShowTime] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const valueDateTime = utcToTz(value, timezoneName ?? DEFAULT_TIMEZONE, formatDate, DATE_TIME_FORMAT.User);

  /**
   * Set view date when change 
   */
  const onChangeDate = (_event: any, selectedDate: any) => {
    setShowDate(Platform.OS === PlatformOS.IOS);
    if (selectedDate) {
      setDate(selectedDate);
      setViewDate(moment(selectedDate).format(formatDate.toUpperCase()))
    }
  };

  /**
   * Set view time when change 
   */
  const onChangeTime = (_event: any, selectedTime: any) => {
    setShowTime(Platform.OS === PlatformOS.IOS);
    if (selectedTime) {
      setTime(selectedTime);
      setViewTime(moment(selectedTime).format(TIME_FORMAT))
    }
  };

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      let hhMM;
      let valueDateTime;
      if (viewTime?.length > 0) {
        hhMM = ` ${viewTime}:00`
      } else {
        hhMM = " 00:00:00";
      }
      if (viewDate) {
        let dateConvert = moment(viewDate, formatDate.toUpperCase()).toDate()
        let dateTime = dateFnsFormat(dateConvert, APP_DATE_FORMAT_DATABASE);
        valueDateTime = tzToUtc(dateTime + hhMM, timezoneName, formatDate, DATE_TIME_FORMAT.Database);
      } else {
        valueDateTime = "";
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, valueDateTime);
    }
  };

  /**
   * set value at edit screen
   */
  useEffect(() => {
    if (valueDateTime) {
      setViewDate(moment(valueDateTime).format(formatDate.toUpperCase()))
      setViewTime(moment(valueDateTime).format(TIME_FORMAT))
    }
  }, [])
  /**
   * Handling after each rendering date or time
   */
  useEffect(() => {
    initialize();
  }, [viewDate, viewTime]);

  /*
   * Render the datetime component in add-edit case
   */
  const renderComponent = () => {
    return (
      <View>
        <View style={FieldAddEditDateTimeStyles.titleContainer}>
          <Text style={FieldAddEditDateTimeStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditDateTimeStyles.requiredContainer}>
              <Text style={FieldAddEditDateTimeStyles.textRequired}>{translate(fieldAddEditMessages.textRequired)}</Text>
            </View>
          )}
        </View>
        <View style={FieldAddEditDateTimeStyles.contentContainer}>
          <TouchableOpacity disabled={fieldInfo.configValue?.substring(0,1) === "1"}
            onPress={() => {
              setShowDate(!showDate)
              setShowTime(false)
            }}>
            <Text style={[viewDate?.length > 0 ? { color: '#333333' } : { color: "#999999" }]}>
              {viewDate?.length > 0 ? viewDate : `${translate(fieldAddEditMessages.dateLabel)}${translate(fieldAddEditMessages.datePlaceholder)}`}
            </Text>

          </TouchableOpacity>
          <TouchableOpacity disabled={fieldInfo.configValue?.substring(2,3) === "1"}
            onPress={() => {
              setShowTime(!showTime)
              setShowDate(false)
            }}>
            <Text style={[viewTime?.length > 0 ? { color: '#333333' } : { color: "#999999" }]}>
              {viewTime?.length > 0 ? viewTime : `${translate(fieldAddEditMessages.timeLabel)}${translate(fieldAddEditMessages.timePlaceholder)}`}
            </Text>

          </TouchableOpacity>
        </View>
        {showDate && (
          <DateTimePicker
            minimumDate={new Date(1753, 0, 2)}
            maximumDate={new Date(9999, 11, 31)}
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={time}
            mode="time"
            minuteInterval={5}
            is24Hour={false}
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View >
    );
  }

  return renderComponent();
}
