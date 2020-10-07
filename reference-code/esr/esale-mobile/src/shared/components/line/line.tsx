import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../common-style";

export interface LineProps {
  colorLine?: string;
  marginLine?: number;
  style?: StyleProp<ViewStyle>;
}

export function Line({
  colorLine = theme.colors.gray100,
  marginLine = 0,
  style
}: LineProps) {
  return (
    <View
      style={[
        CommonStyles.line,
        { margin: marginLine, borderColor: colorLine },
        style
      ]}
    />
  );
}
