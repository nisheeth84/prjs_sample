import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailPhoneNumberStyles } from './field-detail-styles';

// Define value props of FieldDetailPhoneNumber component
type IFieldDetailPhoneNumberProps = IDynamicFieldProps;


/**
 * Component for show phone number fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailPhoneNumber(props: IFieldDetailPhoneNumberProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Render the phone number component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailPhoneNumberStyles.title}>{title}</Text>
        <Text style={FieldDetailPhoneNumberStyles.value}>{props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue}</Text>
      </View>
    );
  }

  return renderComponent();
}

