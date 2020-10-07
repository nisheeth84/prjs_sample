import React, { useState } from 'react';
import { ChangePasswordSuccessStyles } from './login-styles';
import { messages } from './login-messages';
import { translate } from '../../../config/i18n';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

/**
 * Component for Notice of successful password change
 */
export function ChangePasswordSuccessScreen() {
  const navigation = useNavigation();
  const [isDisable, setIsDisable] = useState(false);

  return (
    <SafeAreaView style={ChangePasswordSuccessStyles.backGround}>
      <Image style={ChangePasswordSuccessStyles.logo} source={require('../../../../assets/icon.png')}></Image>
      <View>
        <Text style={ChangePasswordSuccessStyles.labelReset}>{translate(messages.lableReset)}</Text>
      </View>
      <View style={ChangePasswordSuccessStyles.messageBox}>
        <Text style={ChangePasswordSuccessStyles.textColor}>{translate(messages.lableChangePasswordSuccess1)}</Text>
        <Text style={ChangePasswordSuccessStyles.textColor}>{translate(messages.lableChangePasswordSuccess2)}</Text>
      </View>
      <View style={ChangePasswordSuccessStyles.viewButton}>
        <TouchableOpacity
          style={ChangePasswordSuccessStyles.button}
          onPress={() => {
            setIsDisable(true);
            // Back to Login Screen
            navigation.navigate("login");
          }
          }
          disabled={isDisable}
        >
          <Text style={ChangePasswordSuccessStyles.textColor}>{translate(messages.lableBackLogin)}</Text>
        </TouchableOpacity>
      </View>
      <View style={ChangePasswordSuccessStyles.footer}>
        <Text style={ChangePasswordSuccessStyles.footerText}>{translate(messages.copyRight)}</Text>
      </View>
    </SafeAreaView>
  );
}