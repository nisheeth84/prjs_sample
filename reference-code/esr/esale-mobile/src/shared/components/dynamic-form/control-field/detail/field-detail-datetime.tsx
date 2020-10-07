import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY, DEFAULT_TIMEZONE } from '../../../../../config/constants/constants';
import { FieldDetailDateTimeStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { utcToTz, DATE_TIME_FORMAT } from '../../../../util/date-utils';

// Define value props of FieldDetailDateTimecomponent
type IFieldDetailDateTimeProps = IDynamicFieldProps;

/**
 * Component for show datetime fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailDateTime(props: IFieldDetailDateTimeProps) {
  const { fieldInfo, languageCode,timezoneName,formatDate } = props;
  const value = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
  const datetimeDetail = utcToTz(value,timezoneName?? DEFAULT_TIMEZONE, formatDate,DATE_TIME_FORMAT.User);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY)

  /*
   * Render the datetime component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailDateTimeStyles.title}>{title}</Text>
        <Text style={FieldDetailDateTimeStyles.textColorDateTime}>{datetimeDetail}</Text>
      </View>
    );
  }

  return renderComponent();
}
