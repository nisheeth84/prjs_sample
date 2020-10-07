import DateTimePicker from '@react-native-community/datetimepicker';
import momment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FIELD_LABLE, TEXT_EMPTY, TIME_FORMAT } from '../../../../../config/constants/constants';
import { ModifyFlag, PlatformOS } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import { timeTzToUtc, timeUtcToTz } from '../../../../util/date-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditTimeStyles } from './field-add-edit-styles';

// Define value props of FieldAddEditTime component
type IFieldAddEditTimeProps = IDynamicFieldProps;

/**
 * Component for inputing time fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditTime(props: IFieldAddEditTimeProps) {
  const { fieldInfo, languageCode,formatDate,timezoneName } = props;

  const [date, setDate] = useState(new Date());

  const [showTime, setShowTime] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const value = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
  const timeView = timeUtcToTz(value, timezoneName,formatDate);
  const [viewTime, setViewTime] = useState(timeView ? timeView: TEXT_EMPTY);

  /**
   * Set view date when change 
   */
  const onChange = (_event: any, selectedTime: any) => {
    setShowTime(Platform.OS === PlatformOS.IOS);
    if (selectedTime) {
      setDate(selectedTime);
      setViewTime(momment(selectedTime).format(TIME_FORMAT))
    }
  };

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: props?.elementStatus?.key, fieldId: fieldInfo.fieldId };
      let timeConvert = timeTzToUtc(viewTime,timezoneName,formatDate, false) 
      props.updateStateElement(keyObject, fieldInfo.fieldType, timeConvert);
    }
  };

  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [viewTime]);


  /*
   * Render the time component in add-edit case
   */
  const renderAddEditTime = () => {
    return (
      <TouchableOpacity style={FieldAddEditTimeStyles.container}
        disabled={fieldInfo.configValue === "1"}
        onPress={() => setShowTime(!showTime)}>
        <View style={FieldAddEditTimeStyles.titleContainer}>
          <Text style={FieldAddEditTimeStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditTimeStyles.requiredContainer}>
              <Text style={FieldAddEditTimeStyles.textRequired}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={fieldInfo.configValue !== "1" && viewTime?.length ? FieldAddEditTimeStyles.dateColor : {color: "#999999"}}>
            {viewTime?.length > 0 ? viewTime : title + translate(fieldAddEditMessages.timePlaceholder)}
          </Text>
          {showTime && (
            <DateTimePicker
              value={date}
              mode="time"
              minuteInterval={5}
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return renderAddEditTime();
}
