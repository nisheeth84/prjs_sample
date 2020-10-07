import React, { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Icon as ImageIcon } from "../icon";
import { appImages, theme } from "../../../config/constants";
import { AppBarMenuStyles } from "./styles";
import { CommonStyles } from "../../common-style";

interface Navigation {
  [navigation: string]: any;
}

interface AppBarProps {
  name: string;
  hasBackButton: boolean;
  hideSearch?: boolean;
  hasLeftButton?: boolean;
  onPressLeft?: () => void;
  nameService?: string;
}

export const AppBarProducts: React.FunctionComponent<AppBarProps> = ({
  name,
  hasBackButton = false,
  hideSearch = false,
  hasLeftButton = true,
  onPressLeft = () => { },
}) => {
  const navigation: Navigation = useNavigation();

  const [backPress, setBackPress] = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setBackPress(false);
    });
  }, []);

  const _openDrawerLeft = () => {
    navigation.openDrawer();
    onPressLeft();
  };

  const onBackPress = () => {
    if (!backPress) {
      navigation.goBack();
      setBackPress(true);
    }
  };

  const _openDrawerRight = () => {
    navigation.dangerouslyGetParent().dangerouslyGetParent().toggleDrawer();
  };

  const openSearch = () => {
    navigation.navigate("search-stack", {
      screen: "search",
      params: { nameService: "products" },
    });
  };

  return (
    <View style={[AppBarMenuStyles.container]}>
      {hasLeftButton &&
        (hasBackButton ? (
          <TouchableOpacity
            style={AppBarMenuStyles.iconButton}
            onPress={onBackPress}
          >
            <Image
              style={AppBarMenuStyles.iconLeft}
              resizeMode="contain"
              source={appImages.iconLeft}
            />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity
              style={AppBarMenuStyles.iconButton}
              onPress={_openDrawerLeft}
            >
              <ImageIcon
                name="headerMenu"
                style={AppBarMenuStyles.menuStyles}
              />
            </TouchableOpacity>
          ))}

      <View style={AppBarMenuStyles.titleWrapper}>
        <Text style={[AppBarMenuStyles.title]}>{name}</Text>
      </View>
      <View style={CommonStyles.flex1} />
      {hideSearch || (
        <TouchableOpacity
          onPress={openSearch}
          style={AppBarMenuStyles.iconSearch}
        >
          <Icon name="md-search" color={theme.colors.gray} size={28} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={AppBarMenuStyles.iconButton}
        onPress={_openDrawerRight}
      >
        <Icon name="ios-notifications" color={theme.colors.gray} size={30} />
      </TouchableOpacity>
    </View>
  );
};
