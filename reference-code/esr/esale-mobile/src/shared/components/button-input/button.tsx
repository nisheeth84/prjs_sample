import React, { useState } from "react";
import { StyleProp, ViewStyle, TextStyle, Text, TouchableHighlight, View, Platform } from "react-native";
import { StatusButton, TypeButton, PlatformOS } from "../../../config/constants/enum";
import { styles } from "./button-style";
import { Icon } from "../icon/icon";

/**
 * interface
 */
export interface ButtonProps {
  onPress?: () => void;
  status?: string;
  icon?: string;
  textButton?: string;
  typeButton?: number
  highlightOnPress?: boolean;
}

/**
 * 
 * @param param0 
 */
export function CommonButton(
  {
    onPress = Object,
    status = "",
    icon = "",
    textButton = "",
    typeButton = 0,
    highlightOnPress = false
  }: ButtonProps) {
  const [onPressButton, setOnPressButton] = useState(true);
  const buttonStyles: Array<StyleProp<ViewStyle>> = [styles.styleButton];
  const buttonStylesPress: Array<StyleProp<ViewStyle>> = [styles.styleButton];
  const textStyles: Array<StyleProp<TextStyle>> = [styles.styleText];
  const textStylesPress: Array<StyleProp<TextStyle>> = [styles.styleText];
  var underlayColors: any;
  var disable: any;

  /**
   * 
   * @param styleButton // style Button
   * @param styleButtonPress //style press Button
   * @param styleText // style Text
   * @param styleTextPress //style press text
   * @param styleDisable  // style Disable
   * @param underlayColor // color touch press
   */
  const checkTypeButton = (styleButton: any, styleButtonPress: any, styleText: any, styleTextPress: any, styleDisable: any, underlayColor: any, textPX: any) => {
    if (status === StatusButton.ENABLE) {
      buttonStyles.push(styleButton);
      buttonStylesPress.push(styleButton);
      buttonStylesPress.push(styleButtonPress);
      textStyles.push(styleText);
      textStyles.push(textPX);
      textStylesPress.push(styleTextPress);
      textStylesPress.push(textPX);
      underlayColors = underlayColor;
      disable = false;
    }
    if (status === StatusButton.DISABLE) {
      buttonStyles.push(styleDisable);
      textStyles.push(styles.textDisable);
      textStyles.push(textPX);
      onPress = Object;
      disable = true;
    }
  }
  // Check type Button
  switch (typeButton) {
    case TypeButton.BUTTON_SUCCESS:
      checkTypeButton(styles.success,
        styles.successPress,
        styles.textButtonSuccess,
        styles.textButtonSuccess,
        styles.disableSuccess, "#1c4476",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_NON_SUCCESS:
      checkTypeButton(
        styles.nonSuccess,
        styles.nonSuccessPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        styles.disableSuccess, "#d6e3f3",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_BIG_SUCCESS:
      checkTypeButton(
        styles.bigSuccess,
        styles.bigSuccessPress,
        styles.textButtonSuccess,
        styles.textButtonSuccess,
        styles.disableBigSucces, "#1c4476",
        styles.text10Px);
      break;
    case TypeButton.BUTTON_BIG_NO_SUCCESS:
      checkTypeButton(styles.bigNoSuccess,
        styles.bigSuccessNoPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        styles.disableBigSucces, "#d6e3f3",
        styles.text10Px);
      break;
    case TypeButton.BUTTON_MINI_MODAL_SUCCESS:
      checkTypeButton(
        styles.miniModalSuccess,
        styles.miniModalSuccessPress,
        styles.textButtonSuccess,
        styles.textButtonSuccess,
        styles.disableMiniModal, "#1c4476",
        styles.text10Px);
      break;
    case TypeButton.BUTTON_MINI_MODAL_NO_SUCCESS:
      checkTypeButton(
        styles.miniModalNoSuccess,
        styles.miniModalNoSuccessPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        styles.disableMiniModal, "#d6e3f3",
        styles.text10Px);
      break;
    case TypeButton.BUTTON_DIALOG_SUCCESS:
      checkTypeButton(styles.dialogSuccess,
        styles.dialogSuccessPress,
        styles.textButtonSuccess,
        styles.textButtonSuccess,
        styles.disableDialogSuccess, "#8c1515",
        styles.text10Px);
      break;
    case TypeButton.BUTTON_DIALOG_NO_SUCCESS:
      checkTypeButton(
        styles.dialogNoSuccess,
        styles.dialogNoSuccessPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        styles.disableDialogSuccess, "#d6e3f3",
        styles.text10Px);
      break;
    case TypeButton.MINI_BUTTON:
      checkTypeButton(
        styles.miniButton,
        styles.miniButtonPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress
        , styles.disableMiniButton, "#d6e3f3",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_TOTAL:
      checkTypeButton(
        styles.total,
        styles.totalPress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        "", "#d6e3f3",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_HISTORY:
      checkTypeButton(
        styles.history,
        styles.historyPrees,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        "", "#d6e3f3",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_CHANGE:
      checkTypeButton(
        styles.change,
        styles.changePress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccessPress,
        "", "#d6e3f3",
        styles.text5Px);
      break;
    case TypeButton.BUTTON_FAVOURITE:
      checkTypeButton(
        styles.favourite,
        styles.favouritePress,
        styles.textButtonNoSuccess,
        styles.textButtonNoSuccess,
        "", "#FBFBFB",
        styles.text5Px);
      break;
  }
  if (!onPressButton) {
    icon = icon + "_press";
  }
  return (
    <TouchableHighlight
      disabled={disable} // enable/disable button
      onHideUnderlay={() => setOnPressButton(true)} //Called immediately after the underlay is hidden.
      onShowUnderlay={() => setOnPressButton(false)} //Called immediately after the underlay is shown.
      style={[onPressButton ? buttonStyles : buttonStylesPress, highlightOnPress ? buttonStylesPress : buttonStyles]} //style
      underlayColor={underlayColors} //The color of the underlay that will show through when the touch is active.
      onPress={onPress}
      delayPressOut={Platform.OS === PlatformOS.IOS ? 80 : 1} //Delay in ms, from the release of the touch, before onPressOut is called.
    >
      <View style={styles.styleView}>
        {icon != "" && <Icon name={icon} style={styles.styleIcon} resizeMode="contain" />}
        <Text style={onPressButton ? textStyles : textStylesPress}>{textButton}</Text>
      </View>
    </TouchableHighlight>

  );
}

