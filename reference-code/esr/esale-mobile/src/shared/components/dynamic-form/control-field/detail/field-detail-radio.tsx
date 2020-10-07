import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailRadioStyles } from './field-detail-styles';

// Define value props of FieldDetailRadio component
type IFieldDetailRadioProps = IDynamicFieldProps;

/**
 * Component for show radio button fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailRadio(props: IFieldDetailRadioProps) {
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);

  /**
   * Render radio button component 
   */
  const renderComponent = () => {
    let content = TEXT_EMPTY;
    const defaultValue = props?.elementStatus?.fieldValue;
    if (defaultValue) {
      content = `${StringUtils.getFieldLabel(fieldInfo.fieldItems.find((i: any) => i.itemId == defaultValue), ITEM_LABEL, language)}`;
    }
    return (
      <View>
        <Text style={FieldDetailRadioStyles.title}>{title}</Text>
        <Text style={FieldDetailRadioStyles.value}>{content}</Text>
      </View>
    );
  }

  return renderComponent();
}