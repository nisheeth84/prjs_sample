import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../../config/constants";
import { ButtonVariant } from "../../../types";
import { CommonButton } from "../button-input/button";
import { StatusButton, TypeButton } from "../../../config/constants/enum";


interface AppbarCommon {
  title?: string;
  buttonText?: string;
  onPress?: () => void;
  buttonType?: ButtonVariant;
  buttonDisabled?: boolean;
  leftIcon?: string;
  handleLeftPress?: () => void;
  styleTitle?: object;
  containerStyle?: object;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    elevation: 1,
  },
  leftElement: {
    flex: 1,
  },
  centerElement: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  rightElement: {
    flex: 1,
    alignItems: "center",
    marginLeft:20
  },
  title: {
    fontWeight: "700",
    fontSize: theme.fontSizes[4],
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  btnTxt: { fontSize: 14, fontWeight: "bold", color: "white" },
});

export function AppbarCommon({
  title,
  buttonText,
  onPress,
  buttonDisabled,
  leftIcon,
  handleLeftPress,
  styleTitle,
  containerStyle,
}: AppbarCommon) {
  const navigation = useNavigation();
  const onHandleBack = () => {
    if (handleLeftPress) {
      handleLeftPress();
    } else {
      navigation.goBack();
    }
  };
  const iconName = leftIcon || "md-arrow-back";
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftElement}>
        <TouchableOpacity
          onPress={handleLeftPress ? handleLeftPress : onHandleBack}
        >
          <Icon name={iconName}/>
        </TouchableOpacity>
      </View>
      <View style={styles.centerElement}>
        <Text style={[styles.title, styleTitle]}>{title}</Text>
      </View>
      <View style={styles.rightElement}>
        {buttonText ? (
          <CommonButton onPress={onPress}  status = {buttonDisabled ? StatusButton.DISABLE : StatusButton.ENABLE} icon = "" textButton= {buttonText} typeButton = {TypeButton.BUTTON_SUCCESS}/>
        ) : null}
      </View>
    </View>
  );
}
