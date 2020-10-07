import React, { useState, useEffect } from 'react';
import { authorizationSelector } from '../authorization/authorization-selector';
import { changePassword, confirmPassword, resetPassword } from './login-relation-repository';
import { CommonMessage } from '../../../shared/components/message/message';
import { connectionsSelector } from '../connection/connection-selector';
import { format } from 'react-string-format';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LoginChangePassStyles } from './login-styles';
import { messages } from './login-messages';
import { responseMessages } from '../../../shared/messages/response-messages';
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { translate } from '../../../config/i18n';
import { TypeMessage } from '../../../config/constants/enum';
import { useSelector } from 'react-redux';
import { authorizationMessages } from '../authorization/authorization-messages';

/**
 * Component for change password screen
 */
export function ChangePasswordScreen() {
  // Define value params
  type ParamPropType = {
    isResetPassword: {
      tenantId: string,
      resetCode: string
    }
  };
  type GetParamProp = RouteProp<ParamPropType, "isResetPassword">;
  const route = useRoute<GetParamProp>();
  // Get userInfo from store
  const getInfoUserLogin = useSelector(authorizationSelector);
  const connectionState = useSelector(connectionsSelector);
  const [disableButton, setDisableButton] = useState(false);
  const resetPasswordParams: { tenantId: string, resetCode: string } = route?.params;
  const [isResetPassword, setIsResetPassword] = useState(false);
  const iconEsm = require("../../../../assets/icon.png");
  const iconInfo = require("../../../../assets/icons/info.png");
  const lockIcon = require("../../../../assets/icons/lock.png");
  const personIcon = require("../../../../assets/icons/person.png");
  const navigation = useNavigation();
  const selectedConnections = connectionState.selectedConnectionIndex == -1 ? undefined : connectionState.connections[connectionState.selectedConnectionIndex]
  const [formState, setFormState] = useState({
    email: TEXT_EMPTY,
    newPassword: TEXT_EMPTY,
    reNewPassword: TEXT_EMPTY,
    verifyCode: TEXT_EMPTY
  })
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  useEffect(() => {
    if (route?.params) {
      const resetPasswordParams: { tenantId: string, resetCode: string } = route?.params;
      if (resetPasswordParams.tenantId && resetPasswordParams.resetCode && resetPasswordParams.tenantId !== '' && resetPasswordParams.resetCode !== '') {
        setIsResetPassword(true)
      }
    }
  }, [])

  /**
   * The first login call API confirm
   */
  const handleConfirmpassword = async () => {
    const response = await confirmPassword(
      { username: getInfoUserLogin.email, oldPassword: getInfoUserLogin.currentPassword, newPassword: formState.newPassword },
      {
        "headers": {
          ["X-TenantID"]: selectedConnections?.tenantId,
        },
      })
    console.log(response)
    if (response?.data === true) {
      navigation.dispatch(
        StackActions.replace("change-password-success")
      );
    } else {
      handleError(response)
    }
  }

  /**
   * Call API reset-password
   */
  const handleResetpassword = async () => {
    const response = await resetPassword(
      { username: formState.email, resetCode: resetPasswordParams.resetCode, newPassword: formState.newPassword },
      {
        "headers": {
          ["X-TenantID"]: resetPasswordParams.tenantId
        },
      })
    if (response?.data.success === true) {
      navigation.dispatch(
        StackActions.replace("change-password-success")
      );
    } else if (response?.data.success === false) {
      navigation.dispatch(
        StackActions.replace("url-expired")
      );
    } else {
      handleError(response)
    }
  }

  /**
   * Call API change password
   */
  const handleChangePass = async () => {
    const response = await changePassword({ username: getInfoUserLogin.email, oldPassword: getInfoUserLogin.currentPassword, newPassword: formState.newPassword })
    if (response?.data === true) {
      navigation.dispatch(
        StackActions.replace("change-password-success")
      );
    } else {
      handleError(response)
    }
  }

  const handleError = (response: any) => {
    if (response?.data?.parameters?.extensions?.errors?.length > 0) {
      const error = response?.data?.parameters?.extensions?.errors[0].errorCode
      if (responseMessages[error]) {
        setErrorMessage(translate(responseMessages[error]));
      }
    }
  }

  /**
   * handle when click button confirm
   */
  const handleConfirm = async () => {
    if ((isResetPassword && formState.email === TEXT_EMPTY) || formState.newPassword === TEXT_EMPTY || formState.reNewPassword === TEXT_EMPTY) {
      setErrorMessage(translate(responseMessages.ERR_COM_0013));
      return
    }
    if (formState.newPassword !== formState.reNewPassword) {
      setErrorMessage(translate(responseMessages.ERR_LOG_0013));
      return
    }
    if (isResetPassword && !emailRegex.test(formState.email)) {
      setErrorMessage(translate(responseMessages.ERR_LOG_0002));
      return
    }
    if (isResetPassword && formState.email === formState.newPassword) {
      setErrorMessage(translate(responseMessages.ERR_LOG_0004));
      return
    }
    if (formState.newPassword.length < 8 || formState.newPassword.length > 32) {
      setErrorMessage(format(translate(responseMessages.ERR_COM_0038), "8", "32"));
      return
    }
    setDisableButton(true)
    if (isResetPassword) {
      await handleResetpassword()
    } else if (getInfoUserLogin.newPasswordRequired) {
      await handleConfirmpassword()
    } else {
      await handleChangePass()
    }
    setDisableButton(false)
  };

  /**
   * Render component for send mail success screen
   */
  return (
    <SafeAreaView style={LoginChangePassStyles.container}>
      <ScrollView>
        <View style={LoginChangePassStyles.topContainer}>
          <View style={LoginChangePassStyles.logoWrapper}>
            <Image source={iconEsm} style={LoginChangePassStyles.logo} />
          </View>
          <View style={LoginChangePassStyles.textResetWrapper}>
            <Text style={LoginChangePassStyles.textBlack}>
              {translate(messages.resetPassword)}
            </Text>
          </View>
          <View style={LoginChangePassStyles.messageWrapper}>
            <Text style={LoginChangePassStyles.textMessage}>{translate(messages.setNewPassword)}</Text>
            <Text style={LoginChangePassStyles.textConditionMessage}>{translate(messages.conditionalPassword)}</Text>
            <Text style={LoginChangePassStyles.textCondition}>{translate(messages.expirationPassword)}</Text>
            <Text style={LoginChangePassStyles.textCondition}>{translate(messages.charactersPassword)}</Text>
            <Text style={LoginChangePassStyles.textCondition}>{translate(messages.kindCharactersPassword)}</Text>
            <Text style={LoginChangePassStyles.textCondition}>{translate(messages.idEmployeeCharactersPassword)}</Text>
          </View>
          {
            getInfoUserLogin.remainingDays <= 0 && !isResetPassword &&
            <View style={LoginChangePassStyles.infoWrapper}>
              {<Image source={iconInfo} />}
              <View style={LoginChangePassStyles.infoMessageWrap}>
                <Text style={LoginChangePassStyles.textCondition}>{translate(messages.loginPasswordExpired)}</Text>
                <Text style={LoginChangePassStyles.textCondition}>{translate(messages.loginSuggestNewPassword)}</Text>
              </View>
            </View>
          }
          {TEXT_EMPTY !== errorMessage && (
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <CommonMessage content={errorMessage} type={TypeMessage.ERROR} onPress={Object} />
            </View>
          )}
          <View style={LoginChangePassStyles.inputWrapper}>
            {isResetPassword &&
              <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 5 }}>
                <Image source={personIcon} />
                <TextInput style={LoginChangePassStyles.inputPass} placeholder={translate(authorizationMessages.login_authorization_email_placeholder)} placeholderTextColor="#999999"
                  maxLength={50} onChangeText={(text) => setFormState({ ...formState, email: text })} />
              </View>
            }
            <View style={{ backgroundColor: '#E9F0F7', height: 2, }} />
            <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 5 }}>
              <Image source={lockIcon} />
              <TextInput style={LoginChangePassStyles.inputPass} placeholder={translate(messages.newPassword)} placeholderTextColor="#999999"
                maxLength={32} secureTextEntry={true}
                onChangeText={(text) => {
                  setFormState({ ...formState, newPassword: text })
                }}
              />
            </View>
            <View style={{ backgroundColor: '#E9F0F7', height: 2, }} />
            <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 5 }}>
              <Image source={lockIcon} />
              <TextInput style={LoginChangePassStyles.inputPass} placeholder={translate(messages.reNewPassword)} placeholderTextColor="#999999"
                maxLength={32} secureTextEntry={true}
                onChangeText={(text) => {
                  setFormState({ ...formState, reNewPassword: text })
                }} />
            </View>
          </View>
          <View>
            <TouchableOpacity style={LoginChangePassStyles.submitTouchable}
              disabled={disableButton}
              onPress={() => {
                handleConfirm()
              }}>
              <Text style={LoginChangePassStyles.textSubmitTouchable}>{translate(messages.submitChangePass)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={LoginChangePassStyles.copyright}>{translate(messages.copyRight)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
