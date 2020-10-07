import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { APP_DATE_FORMAT_ES, FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { ModifyFlag, PlatformOS } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import { formatDateDatabase } from '../../../../util/date-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditDateStyles } from './field-add-edit-styles';

// Define value props of FieldAddEditDate component
type IFieldAddEditDateProps = IDynamicFieldProps;

/**
 * Component for inputing text fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditDate(props: IFieldAddEditDateProps) {
  const { fieldInfo, languageCode, formatDate } = props;
  const userFormatDate = formatDate ? formatDate.toUpperCase() : APP_DATE_FORMAT_ES;
  const valueDate = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const [date, setDate] = useState(new Date());
  const [viewDate, setViewDate] = useState("");
  const [showDate, setShowDate] = useState(false);


  /**
   * Set view date when change 
   */
  const onChange = (_event: any, selectedDate: any) => {
    setShowDate(Platform.OS === PlatformOS.IOS);
    const currentDate = selectedDate || date;
    if (selectedDate) {
      setDate(currentDate);
      setViewDate(moment(currentDate).format(userFormatDate))
    }
  };

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (!props.updateStateElement && props.isDisabled) {
      return;
    }
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      const valueDateDB = viewDate ? formatDateDatabase(viewDate, userFormatDate) : "";

      props.updateStateElement(keyObject, fieldInfo.fieldType, valueDateDB);
    }
  };

  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [viewDate]);

  /**
   * set value at edit screen
   */
  useEffect(() => {
    if (valueDate && valueDate?.length > 0) {
      setViewDate(moment(valueDate).format(userFormatDate))
    }
  }, [])

  /*
   * Render the text component in add-edit case
   */
  const renderAddEditDate = () => {

    return (
      <View
        style={FieldAddEditDateStyles.container}
      >
      <TouchableOpacity disabled={fieldInfo.configValue === "1"}
          onPress={() =>setShowDate(!showDate)}>
        <View style={FieldAddEditDateStyles.titleContainer}>
          <Text style={FieldAddEditDateStyles.titleColor}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditDateStyles.requiredContainer}>
              <Text style={FieldAddEditDateStyles.textRequired}>{translate(fieldAddEditMessages.textRequired)}</Text>
            </View>
          )}
        </View>

          <Text style={viewDate?.length > 0 && fieldInfo.configValue !== "1" ? FieldAddEditDateStyles.dateColor : FieldAddEditDateStyles.datePlaceholderColor} >
            {viewDate?.length > 0 ? viewDate : title + translate(fieldAddEditMessages.datePlaceholder)}
          </Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            minimumDate={new Date(1753, 0, 2)}
            maximumDate={new Date(9999, 11, 31)}
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    );
  }

  /*
   * Render the text component 
   */
  const renderComponent = () => {
    return renderAddEditDate();
  }

  return renderComponent();
}
