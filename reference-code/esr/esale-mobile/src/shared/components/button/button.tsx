import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { ButtonVariant } from "../../../types";
import { theme } from "../../../config/constants/theme";

export interface ButtonProps {
  children: React.ReactChild;
  onPress?: () => void;
  block?: boolean; // 大ボタンの横幅は、画面サイズに応じて、可変します
  variant?: ButtonVariant;
  disabled?: boolean;
  active?: boolean; // プレス&カレント
  inactive?: boolean;
  style?: StyleProp<ViewStyle>;
  pressColor?: string;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: theme.borderRadius,
  },
  containerNatural: {
    alignSelf: "flex-start",
  },
  buttonCompleteDisabled: {
    backgroundColor: theme.colors.gray200,
    borderColor: theme.colors.gray200,
  },
  textCompleteDisabled: {
    color: theme.colors.gray,
  },
  buttonCompleteActive: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue200,
  },
  textCompleteActive: {
    color: theme.colors.blue200,
  },
  buttonComplete: {
    backgroundColor: theme.colors.blue200,
    borderColor: theme.colors.blue200,
  },
  textWhite: {
    color: theme.colors.white,
  },
  buttonInCompleteDisabled: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  textInCompleteDisabled: {
    color: theme.colors.gray200,
  },
  buttonInCompleteActive: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue200,
  },
  textInCompleteActive: {
    color: theme.colors.blue200,
  },
  buttonInComplete: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray100,
  },
  textInComplete: {
    color: theme.colors.black,
  },

  buttonDeleteDisabled: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  textDeleteDisabled: {
    color: theme.colors.gray200,
  },
  buttonDeleteActive: {
    backgroundColor: theme.colors.red200,
    borderColor: theme.colors.red200,
  },
  textDeleteActive: {
    color: theme.colors.white,
  },
  buttonDelete: {
    backgroundColor: theme.colors.red,
    borderColor: theme.colors.red,
  },
  textDelete: {
    color: theme.colors.white,
  },
  buttonCompleteInactive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray100,
  },
  textCompleteInactive: {
    color: theme.colors.black,
  },
  // miniModal
  buttonMiniModalNormal: {
    backgroundColor: theme.colors.blue200,
    borderColor: theme.colors.blue200,
  },
  textMiniModalNormal: {
    color: theme.colors.white,
  },
  buttonMiniModalActive: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue100,
  },
  textMiniModalActive: {
    color: theme.colors.blue200,
  },
  buttonMiniModalInactive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
  },
  textMiniModalInactive: {
    color: theme.colors.black,
  },
  buttonMiniModalDisable: {
    backgroundColor: theme.colors.gray200,
    borderColor: theme.colors.gray200,
  },
  textMiniModalDisable: {
    color: theme.colors.gray,
  },
  // dialog
  buttonDialogNormal: {
    backgroundColor: theme.colors.red,
    borderColor: theme.colors.red,
  },
  textDialogNormal: {
    color: theme.colors.white,
  },
  buttonDialogActive: {
    backgroundColor: theme.colors.blue200,
    borderColor: theme.colors.blue200,
  },
  textDialogActive: {
    color: theme.colors.white,
  },
  buttonDialogDisable: {
    backgroundColor: theme.colors.blue200,
    borderColor: theme.colors.blue200,
  },
  textDialogDisable: {
    color: theme.colors.white,
  },
});

export const Button: React.FunctionComponent<ButtonProps> = React.memo(
  ({
    onPress,
    disabled,
    children,
    variant,
    block,
    active,
    style,
    pressColor,
    inactive,
  }) => {
    const buttonStyles: Array<StyleProp<ViewStyle>> = [styles.button, style];
    const textStyles: Array<StyleProp<TextStyle>> = [];
    switch (variant) {
      case "complete":
        if (disabled) {
          buttonStyles.push(styles.buttonCompleteDisabled);
          textStyles.push(styles.textCompleteDisabled);
        } else if (active) {
          buttonStyles.push(styles.buttonCompleteActive);
          textStyles.push(styles.textCompleteActive);
        } else if (inactive) {
          buttonStyles.push(styles.buttonCompleteInactive);
          textStyles.push(styles.textCompleteInactive);
        } else {
          buttonStyles.push(styles.buttonComplete);
          textStyles.push(styles.textWhite);
        }
        break;
      case "incomplete":
        if (disabled) {
          buttonStyles.push(styles.buttonInCompleteDisabled);
          textStyles.push(styles.textInCompleteDisabled);
        } else if (active) {
          buttonStyles.push(styles.buttonInCompleteActive);
          textStyles.push(styles.textInCompleteActive);
        } else {
          buttonStyles.push(styles.buttonInComplete);
          textStyles.push(styles.textInComplete);
        }
        break;
      case "delete":
        if (disabled) {
          buttonStyles.push(styles.buttonDeleteDisabled);
          textStyles.push(styles.textDeleteDisabled);
        } else if (active) {
          buttonStyles.push(styles.buttonDeleteActive);
          textStyles.push(styles.textDeleteActive);
        } else {
          buttonStyles.push(styles.buttonDelete);
          textStyles.push(styles.textDelete);
        }
        break;
      case "miniModal":
        if (disabled) {
          buttonStyles.push(styles.buttonMiniModalDisable);
          textStyles.push(styles.textMiniModalDisable);
        } else if (active) {
          buttonStyles.push(styles.buttonMiniModalActive);
          textStyles.push(styles.textMiniModalActive);
        } else if (inactive) {
          buttonStyles.push(styles.buttonMiniModalInactive);
          textStyles.push(styles.textMiniModalInactive);
        } else {
          buttonStyles.push(styles.buttonMiniModalNormal);
          textStyles.push(styles.textMiniModalNormal);
        }
        break;
      case "dialog":
        if (disabled) {
          buttonStyles.push(styles.buttonDialogDisable);
          textStyles.push(styles.textDialogDisable);
        } else if (active) {
          buttonStyles.push(styles.buttonDialogActive);
          textStyles.push(styles.textDialogActive);
        } else {
          buttonStyles.push(styles.buttonDialogNormal);
          textStyles.push(styles.textDialogNormal);
        }
        break;
      default:
        break;
    }
    if (!block) {
      buttonStyles.push(styles.containerNatural);
    }

    let node;
    if (typeof children === "string") {
      node = <Text style={textStyles}>{children}</Text>;
    } else {
      node = children;
    }
    if (disabled || !onPress) {
      return <View style={buttonStyles}>{node}</View>;
    }
    return pressColor ? (
      <TouchableHighlight
        underlayColor={pressColor}
        onPress={onPress}
        style={buttonStyles}
      >
        {node}
      </TouchableHighlight>
    ) : (
      <TouchableOpacity onPress={onPress} style={buttonStyles}>
        {node}
      </TouchableOpacity>
    );
  }
);

Button.defaultProps = {
  variant: "complete",
  disabled: false,
  active: false,
  block: false,
};

