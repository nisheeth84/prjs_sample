import React from "react";
import { View, ActivityIndicator } from "react-native";
/**
 * Component for show activity indicator
 * 
 * @param isLoading boolean
 * @returns <View> | null
 */
export function ActivityIndicatorLoading(isLoading: boolean) {
  if (!isLoading) return null;

  return (
    <View>
      <ActivityIndicator animating size="large"/>
    </View>
  );
}