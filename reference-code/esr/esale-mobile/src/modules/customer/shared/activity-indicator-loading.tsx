import React from "react";
import { View, ActivityIndicator } from "react-native";
import { ActivityIndicatorLoadingStyles } from "../list/customer-list-style";

/**
 * Component for show activity indicator
 * 
 * @param isLoading boolean
 * @returns <View> | null
 */
export function ActivityIndicatorLoading(isLoading: boolean) {
  if (!isLoading) return null;

  return (
    <View style={ActivityIndicatorLoadingStyles.activityIndicatorBlock}>
      <ActivityIndicator animating size="large" color={"#0F6DB5"}/>
    </View>
  );
}