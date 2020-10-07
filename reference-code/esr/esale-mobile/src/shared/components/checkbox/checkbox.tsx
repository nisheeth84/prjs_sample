import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Icon } from '../icon';
import { CheckboxStyles } from './checkbox-styles';

export interface CheckboxProps {
  onChange?: () => void;
  checked?: boolean;
  children?: string | React.ReactNode;
  square?: boolean;
  styleContainer?: ViewStyle;
  styleIndicator?: ViewStyle;
  checkBoxStyle?: any;
  containerCheckBox?: any;
  icCheckBoxSize?: number;
}

/**
 * Component common checkbox
 * @param checked
 * @param children
 * @param checked
 * @param square
 * @function onChange
 */
export const CheckBox: React.FunctionComponent<CheckboxProps> = ({
  onChange,
  checked,
  children,
  square,
  styleContainer,
  styleIndicator,
  checkBoxStyle,
  icCheckBoxSize = 20
}) => {
  const indicatorStyles: StyleProp<ViewStyle> = [
    CheckboxStyles.indicator,
    styleIndicator,
  ];
  if (!square) {
    indicatorStyles.push(CheckboxStyles.circleIndicator);
    indicatorStyles.push({
      borderRadius: icCheckBoxSize / 2
    });
  }
  if (checked) {
    indicatorStyles.push(CheckboxStyles.checkedIndicator);
  }

  let node = children;
  if (typeof children === 'string') {
    node = <Text>{children}</Text>;
  }

  return (
    <TouchableOpacity
      style={[CheckboxStyles.container, styleContainer]}
      onPress={onChange}
    >
      <View style={[indicatorStyles, checkBoxStyle, {
        width: icCheckBoxSize,
      }]}>
        {checked && <Icon name="checkv2" resizeMode="contain" style={{
          width: icCheckBoxSize * 0.5,
        }} />}
      </View>
      {node}
    </TouchableOpacity >
  );
};

CheckBox.defaultProps = {
  checked: false,
  square: true,
};
