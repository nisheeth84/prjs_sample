import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
import { Icon } from '../icon';
import { appBarHomeStyles } from './appbar-styles';

interface Navigation {
  [navigation: string]: any;
}

interface AppBarProps {
  name: string;
}

/**
 * Component for navbar for home screen
 * @param name
 */
export const AppBarEmployee: React.FunctionComponent<AppBarProps> = ({
  name,
}) => {
  const navigation: Navigation = useNavigation();

  // Tracking position to open drawer
  const openDrawerLeft = async () => {
    // get data intialize local menu
    navigation.goBack();
  };

  // const openDrawerRight = () => {
  //   navigation.toggleDrawer();
  // };

  return (
    <View style={[appBarHomeStyles.container, appBarHomeStyles.container]}>
      <TouchableOpacity
        style={appBarHomeStyles.iconButton}
        onPress={openDrawerLeft}
      >
        <Icon name="arrowBack" />
      </TouchableOpacity>
      <View style={appBarHomeStyles.titleWrapper}>
        <Text style={appBarHomeStyles.title}>{name}</Text>
      </View>
      <TouchableOpacity style={[appBarHomeStyles.iconButton]}>
        <Ionicons name="md-search" style={appBarHomeStyles.icon} size={30} />
      </TouchableOpacity>
      <TouchableOpacity style={appBarHomeStyles.iconButton} onPress={() => {}}>
        <Ionicons
          name="ios-notifications"
          style={appBarHomeStyles.icon}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
};
