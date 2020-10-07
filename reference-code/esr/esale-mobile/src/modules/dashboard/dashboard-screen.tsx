import * as React from 'react';
import { Text, View } from 'react-native';
import { DashboardStyles } from './dashboard-style';

export function DashboardScreen() {
  return (
    <View style={DashboardStyles.container}>
      <Text>Dashboard Screen</Text>
    </View>
  );
}
