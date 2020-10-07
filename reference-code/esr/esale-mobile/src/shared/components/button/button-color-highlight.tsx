import React from "react";
import { Dimensions, StyleSheet, Text, TouchableHighlight } from "react-native";
import { theme } from "../../../config/constants";
import {
  EnumButtonStatus,
  EnumButtonType,
} from "../../../config/constants/enum";

interface ButtonColorHighlightProps {
  title: string;
  isShadow?: boolean;
  onPress: () => void;
  type: EnumButtonType;
  disable?: boolean;
  isSelect?: boolean;
  status: EnumButtonStatus;
}
const { width } = Dimensions.get("window");
const WIDTH80 = width * 0.8;
const WIDTH40 = width * 0.4;
const WIDTH25 = width * 0.25;
const WIDTH20 = width * 0.17;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    margin: theme.space[1],
    borderRadius: theme.borRadius.borderRadius8,
  },
  buttonWith20: {
    width: WIDTH20,
    borderRadius: theme.borRadius.borderRadius8,
  },
  buttonWith25: {
    width: WIDTH25,
    borderRadius: theme.borRadius.borderRadius10,
  },
  buttonWith80: {
    width: WIDTH80,
    borderRadius: theme.borRadius.borderRadius12,
  },
  buttonWith40: {
    width: WIDTH40,
    borderRadius: theme.borRadius.borderRadius12,
  },
  themeSky: {
    backgroundColor: theme.colors.blue100,
  },
  themeBorderBlue: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue200,
    borderWidth: 1,
  },
  themeRed: {
    backgroundColor: theme.colors.red,
  },
  themeBlue: {
    backgroundColor: theme.colors.blue200,
  },

  themeBorderGray: {
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    backgroundColor: "white",
  },
  themeGray: {
    backgroundColor: theme.colors.gray200,
  },
  txtWhite: {
    color: theme.colors.white,
  },
  txtGray: {
    color: theme.colors.gray,
  },
  txtBlack: {
    color: theme.colors.black,
  },
  txtPadding5: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontSize: theme.fontSizes[1],
  },
  txtPadding10: {
    paddingVertical: 10,
    fontSize: theme.fontSizes[1],
  },
  txtPadding20: {
    paddingVertical: 10,
    fontSize: theme.fontSizes[2],
  },
  txtPadding510: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    fontSize: theme.fontSizes[1],
  },
  txtBlue: {
    color: theme.colors.blue200,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
});
export const ButtonColorHighlight: React.FC<ButtonColorHighlightProps> = ({
  isShadow,
  type,
  title,
  status,
  onPress,
}) => {
  const checkUnderlayColor = () => {
    if (type === EnumButtonType.dialog && status === EnumButtonStatus.normal) {
      return theme.colors.red200;
    }
    if (status === EnumButtonStatus.normal) {
      return theme.colors.blue300;
    }
    return "";
  };

  const renderButton = (buttonStyle: any, textStyle: any) => {
    return (
      <TouchableHighlight
        style={[styles.button, isShadow && styles.shadow, ...buttonStyle]}
        disabled={status === EnumButtonStatus.disable}
        underlayColor={checkUnderlayColor()}
        onPress={onPress}
      >
        <Text style={textStyle}>{title}</Text>
      </TouchableHighlight>
    );
  };
  const textStatusStyle = (status: EnumButtonStatus) => {
    switch (status) {
      case EnumButtonStatus.active:
        return styles.txtBlue;
      case EnumButtonStatus.disable:
        return styles.txtGray;
      case EnumButtonStatus.inactive:
        return styles.txtBlack;
      default:
        return styles.txtWhite;
    }
  };

  const buttonStatusStyle = (
    status: EnumButtonStatus,
    type?: EnumButtonType
  ) => {
    switch (status) {
      case EnumButtonStatus.active:
        return type === EnumButtonType.dialog
          ? styles.themeSky
          : styles.themeBorderBlue;
      case EnumButtonStatus.disable:
        return styles.themeGray;
      case EnumButtonStatus.inactive:
        return styles.themeBorderGray;
      default:
        return type === EnumButtonType.dialog
          ? styles.themeRed
          : styles.themeBlue;
    }
  };

  const checkType = (type: EnumButtonType) => {
    switch (type) {
      case EnumButtonType.mini:
        return renderButton(
          [buttonStatusStyle(status, type)],
          [styles.txtPadding510, textStatusStyle(status)]
        );
      case EnumButtonType.dialog:
        return renderButton(
          [styles.buttonWith25, buttonStatusStyle(status, type)],
          [styles.txtPadding10, textStatusStyle(status)]
        );
      case EnumButtonType.large:
        return renderButton(
          [styles.buttonWith80, buttonStatusStyle(status, type)],
          [styles.txtPadding20, textStatusStyle(status)]
        );
      case EnumButtonType.miniModal:
        return renderButton(
          [styles.buttonWith40, buttonStatusStyle(status, type)],
          [styles.txtPadding20, textStatusStyle(status)]
        );
      default:
        return renderButton(
          [styles.buttonWith20, buttonStatusStyle(status, type)],
          [styles.txtPadding5, textStatusStyle(status)]
        );
    }
  };

  return checkType(type);
};
