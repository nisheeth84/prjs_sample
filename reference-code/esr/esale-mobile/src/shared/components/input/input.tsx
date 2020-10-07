import React, { useState, useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { InputStyles, errorStyle } from './input-styles';
import { theme } from '../../../config/constants';

export interface InputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  error?: boolean;
  placeholderColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * Component input form common for intergate other component
 *  @param label
 *  @param disabled
 *  @param style
 *  @param error
 *  @param placeholderColor
 *  @param inputProps
 *
 */

export const Input: React.FunctionComponent<InputProps> = React.memo(
  ({
    label,
    labelStyle = {},
    disabled,
    style,
    error,
    inputStyle,
    placeholderColor,
    ...inputProps
  }) => {

    const [editable, setEditable] = useState(false);

    useEffect(() => {
      setTimeout(() => { setEditable(true); }, 100);
    }, []);

    return (
      <View style={[InputStyles.container, style, error && errorStyle]}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <View style={InputStyles.textInputWrapper}>
          <TextInput
            editable={editable}
            style={[InputStyles.textInput, inputStyle]}
            {...inputProps}
            placeholderTextColor={
              error ? theme.colors.red600 : placeholderColor
            }
          />
          {disabled && (
            <View style={[StyleSheet.absoluteFill, InputStyles.disabledView]} />
          )}
        </View>
      </View>
    );
  }
);

Input.defaultProps = {
  placeholderColor: theme.colors.black,
};
