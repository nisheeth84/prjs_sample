import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../../config/constants";
import { Button } from "../button";
import { ButtonVariant } from "../../../types";

interface AppbarCommonProductProps {
  title: string;
  buttonText?: string;
  onPress?: () => void;
  buttonType?: ButtonVariant;
  buttonDisabled?: boolean;
  leftIcon?: string;
  leftIconColor?: string;
  handleLeftPress?: () => void;
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
  },
  title: {
    fontWeight: "700",
    fontSize: theme.fontSizes[4],
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
    fontWeight: "bold",
  },
  boldWhite: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
});

export function AppbarCommonProduct({
  title,
  buttonText,
  onPress,
  buttonType,
  buttonDisabled,
  leftIcon,
  handleLeftPress,
}: AppbarCommonProductProps) {
  const navigation = useNavigation();
  const onHandleBack = () => {
    if (!!handleLeftPress) {
      handleLeftPress();
    } else {
      navigation.goBack();
    }
  };
  const iconName = leftIcon || "md-arrow-back";
  return (
    <View style={styles.container}>
      <View style={styles.leftElement}>
        <TouchableOpacity onPress={onHandleBack}>
          <Icon name={iconName} size={32} color={theme.colors.gray} />
        </TouchableOpacity>
      </View>
      <View style={styles.centerElement}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightElement}>
        <Button
          onPress={onPress}
          block
          style={styles.buttonStyle}
          variant={buttonType}
          disabled={buttonDisabled}
        >
          <Text style={styles.boldWhite}>{buttonText}</Text>
        </Button>
      </View>
    </View>
  );
}
