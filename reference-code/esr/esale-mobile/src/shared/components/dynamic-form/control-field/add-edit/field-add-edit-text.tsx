import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditTextStyles } from './field-add-edit-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { Text, TextInput, View } from 'react-native';
import { theme } from '../../../../../config/constants';
import { translate } from '../../../../../config/i18n';
import _ from "lodash"

// Define value props of FieldAddEditText component
type IFieldAddEditTextProps = IDynamicFieldProps;

/**
 * Component for inputing text fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditText(props: IFieldAddEditTextProps) {
  const { fieldInfo, languageCode } = props;

  const defaultValue = props?.elementStatus?.fieldValue || TEXT_EMPTY;
  const [value, setValue] = useState(defaultValue ?? TEXT_EMPTY);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);


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
      props.updateStateElement(keyObject, fieldInfo.fieldType, value);
    }
  };
  /**
   * Handling after each rendering
   */
  useEffect(() => {

    initialize();
  }, [value]);

  /*
   * Render the text component in add-edit case
   */
  const renderAddEditText = () => {
    return (
      <View
        style={[
          FieldAddEditTextStyles.container,
          props?.errorInfo?.errorCode
            ? { backgroundColor: theme.colors.pink }
            : { backgroundColor: theme.colors.white },
        ]}
      >
        <View style={FieldAddEditTextStyles.titleContainer}>
          <Text style={FieldAddEditTextStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditTextStyles.requiredContainer}>
              <Text style={FieldAddEditTextStyles.textRequired}>
                {translate(fieldAddEditMessages.inputRequired)}
              </Text>
            </View>
          )}
        </View>
        <TextInput
          editable={!props.isDisabled}
          value={value}
          placeholder={title + translate(fieldAddEditMessages.textPlaceholder)}
          placeholderTextColor={theme.colors.gray}
          onChangeText={(text) => setValue(text)}
        />
      </View>
    );
  };

  /*
   * Render the text component
   */
  const renderComponent = () => {
    return renderAddEditText();
  };

  return renderComponent();
}
