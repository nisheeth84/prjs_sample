import AsyncStorage from '@react-native-community/async-storage';
import React, { useState } from 'react';
import { ID_TOKEN, REFRESH_TOKEN, TEXT_EMPTY } from '../../../config/constants/constants';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import { LoginFooter } from '../shared/login-footer';
import { messages } from './authorization-messages';
import { StackActions, useNavigation } from '@react-navigation/native';
import { translate } from '../../../config/i18n';
import { TrialExpiredStyles } from './authorization-styles';

/**
 * Component for view message when trial's expired
 */
export function TrialExpiredScreen() {
  // state control double click
  const [disableButton, setDisableButton] = useState(false);
  const iconEsm = require("../../../../assets/icon.png");
  const navigation = useNavigation();

  /**
   * handle when click button back to login screen
   */
  const handleReturn = async () => {
    setDisableButton(true)
    await AsyncStorage.setItem(ID_TOKEN, TEXT_EMPTY);
    await AsyncStorage.setItem(REFRESH_TOKEN, TEXT_EMPTY);
    navigation.dispatch(
      StackActions.replace("login")
    );
    setDisableButton(false)
  };
  /**
   * Render component for trial's expired screen
   */
  return (
    <View style={TrialExpiredStyles.container}>
      <View style={TrialExpiredStyles.topContainer}>
        <View style={TrialExpiredStyles.logoWrapper}>
          <Image source={iconEsm} style={TrialExpiredStyles.logo} />
        </View>
        <View style={TrialExpiredStyles.textResetWrapper}>
          <Text style={TrialExpiredStyles.textBlack}>
            {translate(messages.login_110001_systemWarning)}
          </Text>
        </View>
        <View style={TrialExpiredStyles.messageWrapper}>
          <Text style={TrialExpiredStyles.textMessage}>
            {translate(messages.login_110001_trialExpiredMessage_enviromentSuspended)}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={TrialExpiredStyles.textMessage}>
              {translate(messages.login_110001_trialExpiredMessage_faq_1)}
            </Text>
            <Text onPress={() => Linking.openURL('https://www.google.com/')} style={{ color: "#0F6DB5" }}>FAQ</Text>
            <Text style={TrialExpiredStyles.textMessage}>
              {translate(messages.login_110001_trialExpiredMessage_faq_2)}
            </Text>
          </View>
          <Text style={TrialExpiredStyles.textMessage}>
            {translate(messages.login_110001_trialExpiredMessage_checkContractorSite)}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={TrialExpiredStyles.returnTouchable} disabled={disableButton} onPress={() => handleReturn()}>
            <Text style={TrialExpiredStyles.textReturnTouchable}>{translate(messages.login_110001_return)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoginFooter />
    </View>
  );
}
