import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailEmailStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Linking, Text, View } from 'react-native';

// Define value props of FieldDetailEmail component
type IFieldDetailEmailProps = IDynamicFieldProps;


/**
 * Component for show email fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailEmail(props: IFieldDetailEmailProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const email = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
  /**
   * Render the email component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailEmailStyles.title}>{title}</Text>
        <Text onPress={() => Linking.openURL(`mailto:${email}`)} style={FieldDetailEmailStyles.email} >
          {email}
        </Text>
      </View>
    );
  }

  return renderComponent();
}

