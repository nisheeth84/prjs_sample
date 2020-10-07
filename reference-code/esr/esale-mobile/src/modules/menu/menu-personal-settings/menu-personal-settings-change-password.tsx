import React, { useState } from "react";
import { ScrollView, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Icon } from "../../../shared/components/icon";
import {
  changePasswordStyle,
  personalSettingStyles,
  NotificationSettingStyles,
} from "./menu-personal-settings-styles";
import { messages } from "./menu-personal-settings-messages";

import { translate } from "../../../config/i18n";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { FormInput } from "../../../shared/components/form-input";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { changePassword } from "../../login/login-relation/login-relation-repository";
import { CommonMessage } from "../../../shared/components/message/message";
import { TypeMessage } from "../../../config/constants/enum";
import { ModalCancel } from "../../../shared/components/modal-cancel";

/**
 * Component show change password
 */
export const ChangePassword = () => {
  const navigation = useNavigation();
  const { email } = useSelector(authorizationSelector);

  /**
   * text error message
   */
  const [message, setMessage] = useState({
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  });

  /**
   * textInput
   */
  const [currentPassword, setCurrentPassword] = useState(TEXT_EMPTY);
  const [newPassword, setNewPassword] = useState(TEXT_EMPTY);
  const [reNewPassword, setReNewPassword] = useState(TEXT_EMPTY);
  const [isShowDirtycheck, setShowDirtycheck] = useState(false);

  /**
   * call api change password
   */
  const changePasswordFunc = async () => {
    const params = {
      username: email,
      newPassword,
      oldPassword: currentPassword,
    };

    const data = await changePassword(params);
    if (data) {
      if (data.status == 200) {
        setMessage({
          content: translate(messages.INFO_COM_0004),
          type: TypeMessage.SUCCESS,
        });
        setTimeout(() => {
          setMessage({
            content: TEXT_EMPTY,
            type: TEXT_EMPTY,
          });
          navigation.goBack();
        }, 2000);

        setCurrentPassword(TEXT_EMPTY);
        setNewPassword(TEXT_EMPTY);
        setReNewPassword(TEXT_EMPTY);
        return;
      }

      switch (data.data.parameters.extensions.errors[0].errorCode) {
        case "ERR_LOG_0012":
          setMessage({
            content: translate(messages.ERR_LOG_0012),
            type: TypeMessage.ERROR,
          });
          break;
        case "ERR_LOG_001":
          setMessage({
            content: translate(messages.ERR_LOG_001),
            type: TypeMessage.ERROR,
          });
          break;
        case "ERR_COM_0038":
          setMessage({
            content: translate(messages.ERR_COM_0038),
            type: TypeMessage.ERROR,
          });
          break;
        case "ERR_LOG_0004":
          setMessage({
            content: translate(messages.ERR_LOG_0004),
            type: TypeMessage.ERROR,
          });
          break;
        default:
          setMessage({
            content: translate(messages.ERR_LOG_0009),
            type: TypeMessage.ERROR,
          });
          break;
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : undefined}
      style={personalSettingStyles.container}
    >
      <AppBarModal
        title={translate(messages.passwordSetting)}
        titleButtonCreate={translate(messages.save)}
        isEnableButtonCreate={
          !!currentPassword &&
          !!newPassword &&
          !!reNewPassword &&
          reNewPassword === newPassword
        }
        onCreate={changePasswordFunc}
        onClose={() =>
          !!currentPassword || !!newPassword || !!reNewPassword
            ? setShowDirtycheck(true)
            : navigation.goBack()
        }
      />
      <ScrollView>
        {message.type == TypeMessage.ERROR && (
          <View style={changePasswordStyle.boxMessage}>
            <CommonMessage content={message.content} type={message.type} />
          </View>
        )}

        <View style={changePasswordStyle.boxWarning}>
          <View style={changePasswordStyle.headerWarning}>
            <Icon name="WAR" style={changePasswordStyle.iconWarning} />
            <Text style={changePasswordStyle.titleWarning}>
              {translate(messages.titlePasswordWarning)}
            </Text>
          </View>
          <View style={changePasswordStyle.contentWarning}>
            <Text>{translate(messages.contentPasswordWarning)}</Text>
          </View>
        </View>
        <FormInput
          required
          secureTextEntry
          value={currentPassword}
          _onChangeText={(text) => setCurrentPassword(text)}
          containerStyle={changePasswordStyle.formInput}
          title={translate(messages.currentPassword)}
          placeholder={translate(messages.enterCurrentPassword)}
        />
        <FormInput
          secureTextEntry
          required
          value={newPassword}
          _onChangeText={(text) => setNewPassword(text)}
          containerStyle={changePasswordStyle.formInput}
          title={translate(messages.newPassword)}
          placeholder={translate(messages.enterNewPassword)}
        />
        <FormInput
          required
          secureTextEntry
          value={reNewPassword}
          _onChangeText={(text) => setReNewPassword(text)}
          containerStyle={changePasswordStyle.formLastInput}
          title={`${translate(messages.newPassword)}(${translate(
            messages.respect
          )})`}
          placeholder={translate(messages.enterReNewPassword)}
        />
      </ScrollView>
      {message.type == TypeMessage.SUCCESS && (
        <View style={changePasswordStyle.boxMessageSuccess}>
          <CommonMessage content={message.content} type={message.type} />
        </View>
      )}
      <ModalCancel
        visible={isShowDirtycheck}
        titleModal={translate(messages.confirmBack)}
        textBtnRight={translate(messages.ok)}
        textBtnLeft={translate(messages.cancel)}
        btnBlue
        onPress={() => navigation.goBack()}
        closeModal={() => setShowDirtycheck(!isShowDirtycheck)}
        contentModal={translate(messages.WAR_COM_0005)}
        containerStyle={NotificationSettingStyles.boxConfirm}
        textStyle={NotificationSettingStyles.txtContent}
      />
    </KeyboardAvoidingView>
  );
};
