import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditPhoneNumberStyles } from './field-add-edit-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { Text, TextInput, View } from 'react-native';
import { theme } from '../../../../../config/constants';
import { translate } from '../../../../../config/i18n';

// Define value props of FieldAddEditPhoneNumber component
type IFieldAddEditPhoneNumberProps = IDynamicFieldProps;

/**
 * Component for inputing phone number fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditPhoneNumber(props: IFieldAddEditPhoneNumberProps) {
  const { fieldInfo, languageCode } = props;
  const [value, setValue] = useState(props.elementStatus?.fieldValue || TEXT_EMPTY);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      keyObject.itemId = props.elementStatus?.key;
      props.updateStateElement(keyObject, fieldInfo.fieldType, value);
    }
  };
  /**
   * Resolve when change phone number
   * @param strvalue value input
   */
  const onChangeValue = (strvalue: string) => {
    if (StringUtils.isValidPhoneNumber(strvalue)) {
      setValue(strvalue);
    }
  }
  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [value]);

  /**
   * Render the phone number component in add-edit case
   */
  const renderAddEditPhoneNumber = () => {
    return (
      <View
        style={FieldAddEditPhoneNumberStyles.container}>
        <View style={FieldAddEditPhoneNumberStyles.titleContainer}>
          <Text style={FieldAddEditPhoneNumberStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditPhoneNumberStyles.requiredContainer}>
              <Text style={FieldAddEditPhoneNumberStyles.textRequired}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <TextInput
          editable={fieldInfo.modifyFlag !== ModifyFlag.READ_ONLY}
          value={value}
          placeholder={`${title}${translate(fieldAddEditMessages.phoneNumberPlaceholder)}`}
          placeholderTextColor={theme.colors.gray}
          onChangeText={(text) => onChangeValue(text)}
        />

      </View>

    );
  }
  return renderAddEditPhoneNumber();
}
