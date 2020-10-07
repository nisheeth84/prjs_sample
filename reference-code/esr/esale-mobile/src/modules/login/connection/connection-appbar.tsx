import React from "react";
import { Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../../../shared/components/button";
import { AppBarStyles } from "./connection-style";
import PropTypes from "prop-types";

/**
 * Header screen
 * @param props
 */
export function AppBar(props: any) {
  const { title, buttonText, onPress, buttonType, buttonDisabled } = props;
  const { goBack } = useNavigation();
  const iconBack = require("../../../../assets/icons/back.png")
  return (
    <View style={AppBarStyles.container}>
      <View style={AppBarStyles.leftElement}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image source={iconBack} style={AppBarStyles.icon} />
        </TouchableOpacity>
      </View>
      <View style={AppBarStyles.centerElement}>
        <Text style={AppBarStyles.title} allowFontScaling>
          {title}
        </Text>
      </View>
      <View style={AppBarStyles.rightElement}>
        <Button
          onPress={onPress}
          block
          style={AppBarStyles.buttonStyle}
          variant={buttonType}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </View>
    </View>
  );
}

AppBar.propTypes = {
  title: PropTypes.string, // title header
  buttonText: PropTypes.string, // title button right
  onPress: PropTypes.func, // funtion button right
  buttonType: PropTypes.string, // type button right
  buttonDisabled: PropTypes.bool, // status of button
};
