import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "../icon";
import { appBarHomeStyles } from "./styles";

interface Navigation {
  [navigation: string]: any;
}

interface AppBarProps {
  name: string;
  navigateSearch?: () => void;
}

export const AppBarHome: React.FunctionComponent<AppBarProps> = ({
  name,
  navigateSearch,
}) => {
  const navigation: Navigation = useNavigation();

  const _openDrawerLeft = () => {
    navigation.toggleDrawer();
  };
  const _openDrawerRight = () => {
    navigation.dangerouslyGetParent().toggleDrawer();
  };

  return (
    <View style={appBarHomeStyles.container}>
      <TouchableOpacity
        style={appBarHomeStyles.iconButton}
        onPress={_openDrawerLeft}
      >
        <Icon name="menuHeader" />
      </TouchableOpacity>
      <View style={appBarHomeStyles.titleWrapper}>
        <Text style={appBarHomeStyles.title}>{name}</Text>
      </View>
      <TouchableOpacity
        style={appBarHomeStyles.iconSearch}
        onPress={navigateSearch}
      >
        <Icon name="search" style={appBarHomeStyles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={appBarHomeStyles.iconButton}
        onPress={_openDrawerRight}
      >
        <Icon name="bell" style={appBarHomeStyles.icon} />
      </TouchableOpacity>
    </View>
  );
};
