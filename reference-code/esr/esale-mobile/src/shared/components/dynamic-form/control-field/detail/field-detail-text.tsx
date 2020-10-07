import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailTextStyles } from './field-detail-styles';

// Define value props of FieldDetailText component
type IFieldDetailTextProps = IDynamicFieldProps;


/**
 * Component for show text fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailText(props: IFieldDetailTextProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Render the text component 
   */
  const renderComponent = () => {

    return (
      <View>
        <Text style={FieldDetailTextStyles.title}>{title}</Text>
        <Text style={FieldDetailTextStyles.value}>
          {props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue}
        </Text>
      </View>
    );
  }

  return renderComponent();
}

