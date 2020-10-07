import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { messages } from "./login-messages";
import { translate } from "../../../config/i18n";
import { LoginSendMailStyles } from "./login-styles";

/**
 * Component for view message when send mail success
 */
export function SendMailSuccessScreen() {
  // state control double click
  const [disableButton, setDisableButton] = useState(false);
  const iconEsm = require("../../../../assets/icon.png");
  const navigation = useNavigation();

  /**
   * handle when click button back to login screen
   */
  const handleReturn = () => {
    setDisableButton(true);
    navigation.dispatch(StackActions.replace("login"));
  };
  /**
   * Render component for send mail success screen
   */
  return (
    <View style={LoginSendMailStyles.container}>
      <View style={LoginSendMailStyles.topContainer}>
        <View style={LoginSendMailStyles.logoWrapper}>
          <Image source={iconEsm} style={LoginSendMailStyles.logo} />
        </View>
        <View style={LoginSendMailStyles.textResetWrapper}>
          <Text style={LoginSendMailStyles.textBlack}>
            {translate(messages.sendMail)}
          </Text>
        </View>
        <View style={LoginSendMailStyles.messageWrapper}>
          <Text style={LoginSendMailStyles.textMessage}>
            {translate(messages.emailTransmissionNotify)}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={LoginSendMailStyles.returnTouchable}
            disabled={disableButton}
            onPress={() => handleReturn()}
          >
            <Text style={LoginSendMailStyles.textReturnTouchable}>
              {translate(messages.return)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={LoginSendMailStyles.footer}>
        <Text style={LoginSendMailStyles.copyright}>
          {translate(messages.copyright)}
        </Text>
      </View>
    </View>
  );
}
