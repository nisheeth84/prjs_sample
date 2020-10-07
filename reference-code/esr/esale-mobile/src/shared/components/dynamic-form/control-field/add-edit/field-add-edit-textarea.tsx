import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditTextareaStyles } from './field-add-edit-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { Text, TextInput, View } from 'react-native';
import { theme } from '../../../../../config/constants';
import { translate } from '../../../../../config/i18n';

// Define value props of FieldAddEditTextarea component
type IFieldAddEditTextareaProps = IDynamicFieldProps;

/**
 * Component for inputing textarea fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditTextarea(props: IFieldAddEditTextareaProps) {
  const { fieldInfo, languageCode } = props;
  const [value, setValue] = useState(props.elementStatus?.fieldValue || TEXT_EMPTY);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, value);
    }
  };
  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [value]);

  /**
   * Render the textarea component in add-edit case
   */
  const renderAddEditTextarea = () => {
    return (
      <View
        style={FieldAddEditTextareaStyles.container}
      >
        <View style={FieldAddEditTextareaStyles.titleContainer}>
          <Text style={FieldAddEditTextareaStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditTextareaStyles.requiredContainer}>
              <Text style={FieldAddEditTextareaStyles.textRequired}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <TextInput
          editable={fieldInfo.modifyFlag !== ModifyFlag.READ_ONLY}
          multiline={true}
          value={value}
          placeholder={`${title}${translate(fieldAddEditMessages.textareaPlaceholder)}`}
          placeholderTextColor={theme.colors.gray}
          onChangeText={(text) => setValue(text)}
          style={FieldAddEditTextareaStyles.textareaInput}
        />
      </View>
    );
  }
  return renderAddEditTextarea();
}
