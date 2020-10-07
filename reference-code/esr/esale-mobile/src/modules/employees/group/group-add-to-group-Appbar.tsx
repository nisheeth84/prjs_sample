import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ButtonVariant } from '../../../types';
import { TypeButton, StatusButton } from '../../../config/constants/enum';
import { AppbarCommonStyles } from './group-add-to-group-style-modal';
import { CommonButton } from '../../../shared/components/button-input/button';

/**
 * AppbarCommon
 */
interface AppbarCommon {
  title: string;
  buttonText: string;
  onPress?: () => void;
  buttonType?: ButtonVariant;
  buttonDisabled?: boolean;
  childrenLeft?: React.ReactChild;
  handleLeftPress?: () => void;
}

/**
 * Component navbar for all without home screen
 * @param title
 * @param buttonText
 * @function onPress
 * @function childrenLeft
 */
export function AppbarCommon({
  title,
  buttonText,
  buttonDisabled,
  onPress,
  childrenLeft,
  handleLeftPress
}: AppbarCommon) {
  return (
    <View style={AppbarCommonStyles.container}>
      <View style={AppbarCommonStyles.leftElement}>
        <TouchableOpacity onPress={handleLeftPress}>
          {childrenLeft}
        </TouchableOpacity>
      </View>
      <View style={AppbarCommonStyles.centerElement}>
        <Text style={AppbarCommonStyles.title}>{title}</Text>
      </View>
      <View style={AppbarCommonStyles.rightElement}>
        <CommonButton onPress={onPress} status={buttonDisabled ? StatusButton.ENABLE : StatusButton.DISABLE}
          textButton={buttonText} typeButton={TypeButton.BUTTON_SUCCESS} />
      </View>
    </View>
  );
}
