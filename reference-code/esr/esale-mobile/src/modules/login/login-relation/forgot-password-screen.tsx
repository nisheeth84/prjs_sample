import React, { useState } from 'react';
import { apiUrl } from '../../../config/constants/api';
import { CommonMessage } from '../../../shared/components/message/message';
import { connectionsSelector } from '../connection/connection-selector';
import { ForgotPassStyles } from './login-styles';
import { forgotPassword } from './login-relation-repository';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { messages } from './login-messages';
import { responseMessages } from '../../../shared/messages/response-messages';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { translate } from '../../../config/i18n';
import { TypeMessage } from '../../../config/constants/enum';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

/**
 * Component send mail to user
 */
export function ForgotPasswordScreen() {
  // state userId
  const [email, setEmail] = useState(TEXT_EMPTY);
  // state control double click
  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const navigation = useNavigation();
  const iconEsm = require("../../../../assets/icon.png");
  const connectionState = useSelector(connectionsSelector);
  const selectedConnections = connectionState.selectedConnectionIndex == -1 ? undefined : connectionState.connections[connectionState.selectedConnectionIndex]

  /**
   * handle when click button back
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * handle when click submit
   */
  const handleSendMail = async () => {
    // Set Disable button
    if (email.trim() === "") {
      setErrorMessage(translate(responseMessages.ERR_COM_0013));
      return
    }
    setDisableButton(true);
    // Call API fogot
    const response = await forgotPassword(
      { url: apiUrl, email },
      {
        "headers": {
          ['Content-Type']: 'application/json',
          ["X-TenantID"]: selectedConnections?.tenantId,
        },
      });
    if (response?.data === true) {
      // Go to send mail success screen
      navigation.navigate("send-email-success");
    } else {
      if (response?.data?.parameters?.extensions?.errors?.length > 0) {
        const error = response?.data?.parameters?.extensions?.errors[0].errorCode
        if (responseMessages[error]) {
          setErrorMessage(translate(responseMessages[error]));
        }
      }
    }
    // Set Enable button
    setDisableButton(false);
  };

  /**
   * Render send mail component
   */
  return (
    <SafeAreaView style={ForgotPassStyles.container}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={ForgotPassStyles.topContainer}>
          <View style={ForgotPassStyles.logoWrapper}>
            <Image source={iconEsm} style={ForgotPassStyles.logo} />
          </View>
          <View style={ForgotPassStyles.alertWrapper}>
            <Text style={ForgotPassStyles.textBlack}>
              {translate(messages.resetPassword)}
            </Text>
          </View>
          <View style={ForgotPassStyles.messageWrapper}>
            <Text style={ForgotPassStyles.textMessage}>
              {translate(messages.sendEmailResetPassword)}
            </Text>
          </View>
          {TEXT_EMPTY !== errorMessage && (
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <CommonMessage content={errorMessage} type={TypeMessage.ERROR} onPress={Object} />
            </View>
          )}
          <View style={ForgotPassStyles.inputUser}>
            <TextInput
              placeholder={translate(messages.email)}
              placeholderTextColor={"#333333"}
              maxLength={50}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={ForgotPassStyles.sendTouchable}
              disabled={disableButton}
              onPress={() => handleSendMail()}
            >
              <Text style={ForgotPassStyles.textSendTouchable}>
                {translate(messages.submitSendMail)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ForgotPassStyles.returnTouchable}
              onPress={() => handleBack()}
            >
              <Text style={ForgotPassStyles.textReturnTouchable}>
                {translate(messages.return)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={ForgotPassStyles.footer}>
          <Text style={ForgotPassStyles.copyright}>
            {translate(messages.copyright)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
