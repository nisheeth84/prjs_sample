import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../../config/constants';

export interface AlertProps {
  iconLeft?: React.ReactChild;
  content: React.ReactChild | string;
  type: 'warning' | 'danger' | 'normal' | 'primary' | 'notify';
}

const styles = StyleSheet.create({
  container: {
    padding: theme.space[4],
    borderRadius: theme.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBackground: {
    backgroundColor: theme.colors.yellow,
  },
  dangerBackground: {
    backgroundColor: theme.colors.pink,
  },
  normalBackground: {
    backgroundColor: theme.colors.white,
  },
  primaryBackground: {
    backgroundColor: theme.colors.primary,
  },
  notificationBackground: {
    backgroundColor: theme.colors.green,
  },
  textColor: {
    color: theme.colors.black,
    flex: 1,
  },
});

/**
 * Component common for Alert
 * @param content
 * @param type
 * @param iconLeft
 */
export const Alert: React.FunctionComponent<AlertProps> = React.memo(
  ({ content, type, iconLeft }) => {
    const containerStyles: Array<StyleProp<ViewStyle>> = [styles.container];
    // Tracking type of alert
    switch (type) {
      case 'danger':
        containerStyles.push(styles.dangerBackground);
        break;
      case 'warning':
        containerStyles.push(styles.warningBackground);
        break;
      case 'normal':
        containerStyles.push(styles.normalBackground);
        break;
      case 'primary':
        containerStyles.push(styles.primaryBackground);
        break;
      case 'notify':
        containerStyles.push(styles.notificationBackground);
        break;
      default:
        break;
    }
    let node = content;
    if (typeof content === 'string') {
      node = <Text style={styles.textColor}>{content}</Text>;
    }
    return (
      <View style={containerStyles}>
        {iconLeft}
        {node}
      </View>
    );
  }
);
