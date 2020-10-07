import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { CommonStyles } from "../../common-style";
import { Radio } from "./radio";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface RadioValue {
  title: string;
  value: number;
}

export interface RadioGroupProps {
  wrapStyle?: StyleProp<ViewStyle>;
  defaultSelect?: number;
  radioStyle?: StyleProp<ViewStyle>;
  data: Array<RadioValue>;
  onSelectedChange: Function;

}

export function RadioGroup({
  wrapStyle = CommonStyles.row,
  defaultSelect = 0,
  data = [],
  onSelectedChange = () => { },
  radioStyle = {}
}: RadioGroupProps) {

  let [selected, setSelected] = useState(defaultSelect >= data.length ? 0 : defaultSelect);

  return (
    <View
      style={[
        wrapStyle
      ]}
    >
      {
        data.map((radioValue) => {
          return (
            <TouchableOpacity onPress={() => {
              setSelected(radioValue.value);
              onSelectedChange(radioValue.value);
            }}
              key={radioValue.value.toString()}
            >
              <Radio title={radioValue.title} selected={selected == radioValue.value} radioStyle={radioStyle} />
            </TouchableOpacity>
          )
        })
      }
    </View>
  );
}
