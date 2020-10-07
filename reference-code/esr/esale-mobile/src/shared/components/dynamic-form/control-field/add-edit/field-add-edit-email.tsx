import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldAddEditEmailStyles } from './field-add-edit-styles';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { Text, TextInput, View } from 'react-native';
import { theme } from '../../../../../config/constants';
import { translate } from '../../../../../config/i18n';

// Define value props of FieldAddEditEmail component
type IFieldAddEditEmailProps = IDynamicFieldProps;

/**
 * Component for inputing email fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditEmail(props: IFieldAddEditEmailProps) {
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
  }
  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [value]);

  /**
   * Render the email component in add-edit case
   */
  const renderAddEditEmail = () => {
    return (
      <View
        style={FieldAddEditEmailStyles.container}>
        <View style={FieldAddEditEmailStyles.titleContainer}>
          <Text style={FieldAddEditEmailStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditEmailStyles.requiredContainer}>
              <Text style={FieldAddEditEmailStyles.textRequired}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <TextInput
          editable={!props.isDisabled}
          value={value}
          placeholder={`${title}${translate(fieldAddEditMessages.emailPlaceholder)}`}
          placeholderTextColor={theme.colors.gray}
          onChangeText={(text) => setValue(text)}
        />
      </View>
    );
  }

  return renderAddEditEmail();
}
