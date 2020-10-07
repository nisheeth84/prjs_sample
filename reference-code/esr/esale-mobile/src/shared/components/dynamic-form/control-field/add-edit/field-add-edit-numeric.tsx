import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { ModifyFlag, TypeUnit } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import NumberUtils from '../../../../util/number-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditNumericStyles } from './field-add-edit-styles';

// define type of FieldAddEditNumeric's props
type IFieldAddEditNumericProps = IDynamicFieldProps;

/**
 * Component add/edit numeric form
 * @param props 
 */
export function FieldAddEditNumeric(props: IFieldAddEditNumericProps) {
  const { fieldInfo, languageCode } = props;
  const [value, setValue] = useState(TEXT_EMPTY);
  const [valueView, setValueView] = useState(TEXT_EMPTY);
  const [isEndEditing, setIsEndEditing] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const currencyUnit = fieldInfo.currencyUnit ?? TEXT_EMPTY;
  const decimalPlace = props?.fieldInfo?.decimalPlace || 0;
  /**
   * validate when user input 
   * @param text 
   */
  const onFocusValueEdit = () => {
    setValueView(value)
    setIsEndEditing(false);
  }

  /**
   * validate when user input 
   * @param text 
   */
  const onBlurValueEdit = () => {
    setValueView(NumberUtils.autoFormatNumeric(value, decimalPlace));
    if (value?.length > 0) {
      setIsEndEditing(true);
    }
  }

  /**
   * validate when user input 
   * @param text 
   */
  const onChangeValueEdit = (text: string) => {
    if (text === TEXT_EMPTY || NumberUtils.isValidNumber(text, decimalPlace)) {
      setValueView(text);
      setValue(text);
    }
  }

  /**
   * Set form's default vale
   */
  const initialize = () => {
    const defaultVal = props.elementStatus?.fieldValue || TEXT_EMPTY;
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, defaultVal);
    }
    if (defaultVal?.length > 0) {
      setIsEndEditing(true);
    }
    setValue(defaultVal)
    setValueView(NumberUtils.autoFormatNumeric(defaultVal, decimalPlace));
  };

  /**
   * run useEffect only once when init component
   */
  useEffect(() => {
    initialize();
  }, []);

  /**
   * run useEffect when textInput's value changed
   */
  useEffect(() => {
    if (!props.updateStateElement || props.isDisabled) {
      return;
    }
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    props.updateStateElement(keyObject, fieldInfo.fieldType, value);
  }, [value]);

  /**
   * render add/edit numeric form
   */
  const renderConponent = () => {
    return (
      <View style={FieldAddEditNumericStyles.container}>
        <View style={FieldAddEditNumericStyles.titleContainer}>
          <Text style={FieldAddEditNumericStyles.title}>{title}</Text>
          {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditNumericStyles.requiredContainer}>
              <Text style={FieldAddEditNumericStyles.requiredText}>{translate(fieldAddEditMessages.inputRequired)}</Text>
            </View>
          )}
        </View>
        <View style={FieldAddEditNumericStyles.inputView}>
          {fieldInfo.typeUnit === TypeUnit.SYMBOL &&
            (<Text style={FieldAddEditNumericStyles.currencyUnit}>{currencyUnit}</Text>)}
          <TextInput
            style={[FieldAddEditNumericStyles.textInput, { textAlign: isEndEditing ? 'right' : 'left' }]}
            editable={!props.isDisabled}
            value={valueView}
            placeholder={`${title}${translate(fieldAddEditMessages.numericPlaceholder)}`}
            placeholderTextColor="#999999"
            onFocus={onFocusValueEdit}
            onChangeText={(text: string) => onChangeValueEdit(text)}
            keyboardType="numeric"
            onBlur={onBlurValueEdit} />
          {fieldInfo.typeUnit === TypeUnit.UNIT &&
            (<Text style={FieldAddEditNumericStyles.currencyUnit}>{currencyUnit}</Text>)}
        </View>
      </View>
    );
  }

  return renderConponent();
}

