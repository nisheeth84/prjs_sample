import React from "react";
import { View, StyleProp, ViewStyle, Text, TextStyle } from "react-native";
import { CommonStyles } from "../../common-style";
import { Icon } from "../icon";

export interface RadioProps {
  selected: boolean;
  title: string;
  textStyle?: StyleProp<TextStyle>;
  radioStyle?: StyleProp<ViewStyle>;
}

export function Radio({
  selected = true,
  radioStyle,
  title = "",
  textStyle
}: RadioProps) {

  return (
    <View style={[CommonStyles.rowInline, radioStyle]}>
      {selected ?
        <Icon name="radioSelected" resizeMode="contain" style={[
          CommonStyles.radio,

        ]} />
        : <Icon name="radioUnSelected" resizeMode="contain" style={[
          CommonStyles.radio
        ]} />}
      <Text style={[CommonStyles.radioTitle, textStyle]}>{title}</Text>
    </View>
  );
}
