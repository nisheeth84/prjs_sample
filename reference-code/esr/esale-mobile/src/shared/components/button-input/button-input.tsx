import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AvailableIcons } from '../icon/icon-map';
import { Icon } from '../icon';
import { ButtonInputStyles, errorStyle } from './button-input-styles';

export interface ButtonInputProps {
  value: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  onPress: () => void;
  leftIcon?: AvailableIcons;
  rightIcon?: AvailableIcons;
  label?: string;
}

/**
 * Component common for button input form
 * @param style
 * @param leftIcon
 * @param error
 * @param value
 * @param label
 * @function onPress
 * @param buttonInputProps
 */
export const ButtonInput: React.FunctionComponent<ButtonInputProps> = React.memo(
  ({ style, leftIcon, error, value, label, onPress, ...buttonInputProps }) => {
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        style={[ButtonInputStyles.container, style, error && errorStyle]}
        {...buttonInputProps}
      >
        <View style={ButtonInputStyles.buttonInputWrapper}>
          {leftIcon && (
            <Icon name={leftIcon} style={ButtonInputStyles.leftIcon} />
          )}
          <Text style={[ButtonInputStyles.textStyle, error && errorStyle]} numberOfLines={1}>
            {value}
          </Text>
          {value === '' && (
            <Text style={ButtonInputStyles.labelStyle}>{label}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
);
