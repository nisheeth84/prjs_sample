import React from "react";
import { View, ActivityIndicator } from "react-native";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";
import { theme } from "../../../../../config/constants/theme";

/**
 * Component for show activity indicator
 * 
 * @param isLoading boolean
 * @returns <View> | null
 */
export function ActivityIndicatorLoading(isLoading: boolean) {
  if (!isLoading) return null;

  return (
    <View style={CustomerDetailScreenStyles.activityIndicatorBlock}>
      <ActivityIndicator animating size="large" color={theme.colors.blue200}/>
    </View>
  );
}