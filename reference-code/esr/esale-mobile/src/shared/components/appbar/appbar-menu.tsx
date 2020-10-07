import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon as ImageIcon } from '../icon';
import { appImages, theme } from '../../../config/constants';
import { AppBarMenuStyles } from './styles';
import { Position } from '../../../config/constants/enum';
import { messages } from './appbar-messages';
import { translate } from '../../../config/i18n';

interface Navigation {
  [navigation: string]: any;
}

interface AppBarProps {
  name: string;
  hasBackButton?: boolean;
  hideSearch?: boolean;
  hasLeftButton?: boolean;
  onPressLeft?: () => void;
  position?: Position;
  isMenu?: boolean;
  nameService?: string;
}

export const AppBarMenu: React.FunctionComponent<AppBarProps> = ({
  name,
  hasBackButton = false,
  hideSearch = false,
  onPressLeft = () => {},
  position,
  isMenu,
  nameService,
}) => {
  const navigation: Navigation = useNavigation();

  const [backPress, setBackPress] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setBackPress(false);
    });
  }, []);

  const _openDrawerLeft = () => {
    navigation.toggleDrawer();
    onPressLeft();
  };

  const onBackPress = () => {
    if (!backPress) {
      navigation.goBack();
      setBackPress(true);
    }
  };

  const _openDrawerRight = () => {
    try {
      navigation.dangerouslyGetParent().dangerouslyGetParent().toggleDrawer();
    } catch {
      // do smt
    }
  };

  const openGlobalSearch = () => {
    navigation.navigate('search-stack', {
      screen: 'search',
      params: nameService ? { nameService } : { nameService: 'menu' },
    });
  };

  const getTitle = () => {
    try {
      return translate(messages[name]);
    } catch {
      return name;
    }
  };

  return (
    <View style={[AppBarMenuStyles.container]}>
      {!isMenu &&
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
            <ImageIcon name="headerMenu" style={AppBarMenuStyles.menuStyles} />
          </TouchableOpacity>
        ))}

      <View
        style={[
          position === Position.CENTER ? AppBarMenuStyles.titleWrapperCenter : AppBarMenuStyles.titleWrapper,
        ]}
      >
        <Text style={[AppBarMenuStyles.title]}>{getTitle()}</Text>
      </View>
      {hideSearch || (
        <TouchableOpacity
          onPress={openGlobalSearch}
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
