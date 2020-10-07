import React from "react";
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "../../../config/constants";
import { Icon } from "../icon";
import { CommonButton } from "../button-input/button";
import { STATUSBUTTON, TYPEBUTTON } from "../../../config/constants/enum";

interface HeaderProps {
  containerStyle?: StyleProp<ViewStyle>;
  disableLeft?: boolean;
  leftContainerStyle?: StyleProp<ViewStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ImageStyle>;
  leftIconName?: string;
  title?: string;
  titleSize?: number;
  nameButton?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  textBold?: boolean;
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.white100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    // elevation: 1,
    // zIndex: 5,
    // shadowColor: '#455B6314',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.6,
    // shadowRadius: 1,
  },
  titleWrap: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  titleStyle: {
    color: "black",
    fontSize: theme.fontSizes[5],
  },
  iconSize: {
    height: 20,
    aspectRatio: 1,
  },
  leftButton: {
    height: "80%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 3,
  },
  rightButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: theme.space[3],
    backgroundColor: theme.colors.blue200,
    padding: theme.space[2],
    paddingHorizontal: theme.space[4],
    borderRadius: theme.borderRadius,
    zIndex: 3,
  },
  txtButton: {
    color: theme.colors.white,
  },
  bold: {
    fontWeight: "bold",
  },
  viewButton: {
    right: 9,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 3,
  }
});

const HITSLOP = { top: 20, left: 20, right: 20, bottom: 20 };

export const Header: React.FunctionComponent<HeaderProps> = (
  props: HeaderProps
) => {
  const {
    disableLeft = false,
    containerStyle,
    leftContainerStyle,
    rightContainerStyle = {},
    leftIconStyle,
    leftIconName = "close",
    nameButton,
    onLeftPress = () => { },
    onRightPress = () => { },
    titleSize = 18,
    textBold = false
  } = props;
  const renderLeftContent = () => {
    if (disableLeft) {
      return <View style={styles.leftButton} />;
    }
    return (
      <TouchableOpacity
        hitSlop={HITSLOP}
        style={[styles.leftButton, leftContainerStyle]}
        onPress={onLeftPress}
      >
        <Icon
          name={leftIconName}
          style={[styles.iconSize, leftIconStyle]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderCenterContent = () => {
    const { title = "Title" } = props;
    return (
      <View style={styles.titleWrap}>
        <Text style={[styles.titleStyle,
        { fontSize: titleSize },
        textBold ? { fontWeight: "bold" } : {}
        ]}>
          {title}
        </Text>
      </View>
    );
  };

  const renderRightContent = () => {
    if (!nameButton) return null;
    return (
      <View style={[styles.viewButton]}>
        <CommonButton onPress={onRightPress} status={STATUSBUTTON.ENABLE} icon="" textButton={nameButton} typeButton={TYPEBUTTON.BUTTONSUCCESS}></CommonButton>
      </View>
    );
  };
  return (
    <View style={[styles.container, containerStyle]}>
      {renderLeftContent()}
      {renderCenterContent()}
      {renderRightContent()}
    </View>
  );
};
