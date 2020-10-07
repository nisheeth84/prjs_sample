import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LoginUrlExpiredStyles } from './login-styles';
import { messages } from './login-messages';
import { StackActions, useNavigation } from '@react-navigation/native';
import { translate } from '../../../config/i18n';

/**
 * Component for view message when url's expired
 */
export function UrlExpiredScreen() {
  // state control double click
  const [disableButton, setDisableButton] = useState(false);
  const iconEsm = require("../../../../assets/icon.png");
  const navigation = useNavigation();

  /**
   * handle when click button back to login screen
   */
  const handleReturn = () => {
    setDisableButton(true)
    navigation.dispatch(
      StackActions.replace("login")
    );
    setDisableButton(false)
  };
  /**
   * Render component for url's expired screen
   */
  return (
    <View style={LoginUrlExpiredStyles.container}>
      <View style={LoginUrlExpiredStyles.topContainer}>
        <View style={LoginUrlExpiredStyles.logoWrapper}>
          <Image source={iconEsm} style={LoginUrlExpiredStyles.logo} />
        </View>
        <View style={LoginUrlExpiredStyles.textResetWrapper}>
          <Text style={LoginUrlExpiredStyles.textBlack}>
            {translate(messages.urlExpired)}
          </Text>
        </View>
        <View style={LoginUrlExpiredStyles.messageWrapper}>
          <Text style={LoginUrlExpiredStyles.textMessage}>
            {translate(messages.urlExpiredMessage1)}
          </Text>
          <Text style={LoginUrlExpiredStyles.textMessage}>
            {translate(messages.urlExpiredMessage2)}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={LoginUrlExpiredStyles.returnTouchable} disabled={disableButton} onPress={() => handleReturn()}>
            <Text style={LoginUrlExpiredStyles.textReturnTouchable}>{translate(messages.return)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={LoginUrlExpiredStyles.footer}>
        <Text style={LoginUrlExpiredStyles.copyright}>{translate(messages.copyright)}</Text>
      </View>
    </View>
  );
}
