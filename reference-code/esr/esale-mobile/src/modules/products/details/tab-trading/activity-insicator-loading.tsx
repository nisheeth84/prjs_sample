import React from "react";
import { View, ActivityIndicator } from "react-native";
// import { Chase } from 'react-native-animated-spinkit'


/**
 * Component for show activity indicator
 * 
 * @param isLoading boolean
 * @returns <View> | null
 */
export function ActivityIndicatorLoading(isLoading: boolean) {
  if (!isLoading) return null;

  return (
    <View style={{}}>
      {/* <Chase size={48} color="#0F6DB5" style={{justifyContent:"center",alignItems:"center"}} /> */}
      <ActivityIndicator animating size="large" color="#0F6DB5"/>
    </View>
  );
}