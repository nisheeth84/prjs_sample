import React, { useState } from "react";
import { Text, View } from "react-native";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../common-style";
import { handleEmptyString } from "../../util/app-utils";

interface LabelProps {
  // background color
  bgColor?: string;
  // text color
  textColor?: string;
  // size
  size?: number,
  // content
  content?: string,
  // style
  labelStyle?: any;
}

export function CommonLabel({
  bgColor = theme.colors.blue200,
  textColor = theme.colors.white,
  size = theme.fontSizes[2],
  content = "",
  labelStyle
}: LabelProps) {

  const [textWidth, setTextWidth] = useState(0);

  return (
    <View style={[CommonStyles.commonPrLabel,
    {
      width: textWidth + theme.space[1] * 2,
      backgroundColor: bgColor
    },
    { ...labelStyle }]} >
      <Text
        onLayout={(e) => {
          setTextWidth(e.nativeEvent.layout.width);
        }}
        style={[CommonStyles.commonLabel, { color: textColor, fontSize: size }]} >
        {handleEmptyString(content)}
      </Text>
    </View>
  );
}
