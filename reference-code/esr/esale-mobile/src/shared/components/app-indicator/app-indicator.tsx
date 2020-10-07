import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BallIndicator } from "react-native-indicators";
import { theme } from "../../../config/constants";

interface AppIndicatorProps {
  color?: string;
  visible?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: theme.space[2],
    backgroundColor: theme.colors.white,
  },
});

export const AppIndicator: React.FC<AppIndicatorProps> = ({
  color = theme.colors.blackDeep,
  visible = true,
  size = 30,
  style = {},
}) => {
  return visible ? (
    <View style={[styles.container, style]}>
      <BallIndicator color={color} size={size} />
    </View>
  ) : null;
};
