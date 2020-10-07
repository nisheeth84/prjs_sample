import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { messages } from "./appbar-messages";
import { translate } from "../../../config/i18n";
import { Icon } from "../icon";
import { appBarMenuStyles } from "./styles";

interface Navigation {
  [navigation: string]: any;
}

interface AppBarProps {
  name: string;
}

export const AppBarMenu: React.FunctionComponent<AppBarProps> = ({ name }) => {
  const navigation: Navigation = useNavigation();

  const _openDrawerLeft = () => {
    navigation.dangerouslyGetParent().toggleDrawer();
  };
  // open drawer notification
  const _openDrawerRight = () => {
    navigation.toggleDrawer();
  };

  const openGlobalSearch = () => {
    navigation.navigate("search");
  };

  return (
    <View style={appBarMenuStyles.container}>
      <TouchableOpacity
        style={appBarMenuStyles.iconButton}
        onPress={_openDrawerLeft}
      >
        <Icon name="menuHeader" />
      </TouchableOpacity>
      <View style={appBarMenuStyles.titleWrapper}>
        <Text style={appBarMenuStyles.title}>{translate(messages[name])}</Text>
      </View>
      <TouchableOpacity
        style={appBarMenuStyles.iconSearch}
        onPress={openGlobalSearch}
      >
        <Icon name="search" />
      </TouchableOpacity>
      <TouchableOpacity
        style={appBarMenuStyles.iconButton}
        onPress={_openDrawerRight}
      >
        <Icon name="bell" />
      </TouchableOpacity>
    </View>
  );
};
