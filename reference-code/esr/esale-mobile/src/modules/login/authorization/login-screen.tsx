import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { format } from 'react-string-format';
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { authorizationActions } from './authorization-reducer';
import { authorizationMessages } from './authorization-messages';
import { authorizationSelector } from './authorization-selector';
import { CommonButton } from '../../../shared/components/button-input/button';
import { CommonMessage } from '../../../shared/components/message/message';
import { connectionsSelector } from '../connection/connection-selector';
import {
  ContractStatus,
  StatusButton,
  TypeButton,
  TypeMessage,
} from '../../../config/constants/enum';

import { getLanguages, getTimezones } from '../../../shared/api/api-repository';
import { getNotifications } from '../../notification/notification-reponsitory';
import {
  getStatusContract,
  login,
  updatePushNotification,
  verifyAfterLogin,
  verifyBeforeLogin,
} from './authorization-repository';
import { 
  getUnreadNotification, 
  getEmployeesByIds 
} from '../../menu/menu-feature-repository';
import {
  ID_TOKEN,
  REFRESH_TOKEN,
  TEXT_EMPTY,
  TIMEZONE_NAME,
} from '../../../config/constants/constants';
import { initializeFieldActions } from '../../../shared/api/api-reducer';
import { LoginFooter } from '../shared/login-footer';
import { LoginScreenStyles } from './authorization-styles';
import { menuActions } from '../../menu/menu-feature-reducer';
import { notificationActions } from '../../notification/notification-reducer';
import { responseMessages } from '../../../shared/messages/response-messages';
import { translate } from '../../../config/i18n';
import {
  getStatusOpenFeedback,
  getTenantStatusContract
} from '../../feedback/feedback-repository';

/**
 * Render login screen
 */
export function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authorizationState = useSelector(authorizationSelector);
  const connectionState = useSelector(connectionsSelector);
  const [email, setEmail] = useState(authorizationState?.email);
  const [password, setPassword] = useState(
    authorizationState?.rememberMe
      ? authorizationState?.currentPassword
      : TEXT_EMPTY
  );
  const [rememberMe, setRememberMe] = useState(authorizationState?.rememberMe);
  const [error, setError] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [deviceUniqueId, setDeviceUniqueId] = useState('');
  const earthIcon = require('../../../../assets/icons/earth.png');
  const personIcon = require('../../../../assets/icons/person.png');
  const lockIcon = require('../../../../assets/icons/lock.png');
  const checkboxChecked = require('../../../../assets/icons/checkboxChecked.png');
  const checkboxUnchecked = require('../../../../assets/icons/checkboxUnchecked.png');
  const logo = require('../../../../assets/icon.png');
  const arrowRight = require('../../../../assets/icons/icon_arrow_right.png');
  const selectedConnections =
    connectionState.selectedConnectionIndex == -1
      ? undefined
      : connectionState.connections[connectionState.selectedConnectionIndex];

  /**
   * Set value when first time render
   */
  useEffect(() => {
    handleGetDeviceToken();
    handleGetDeviceUniqueId();
    handleRememberedLogin();
  }, []);

  const handleError = (response: any) => {
    switch (response.status) {
      case 200: {
        dispatch(notificationActions.getMessages(response.data));
        break;
      }
      case 500: {
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    messaging().onMessage(async () => {
      async function getUnreadNotifi() {
        const unreadNotificationResponse = await getUnreadNotification(
          { employeeId: authorizationState.employeeId },
          {}
        );
        if (unreadNotificationResponse.status === 200) {
          dispatch(
            menuActions.getUnreadNotificationNumber(
              unreadNotificationResponse.data.unreadNotificationNumber
            )
          );
        }
      }
      getUnreadNotifi();
      const notificationResponse = await getNotifications(
        { textSearch: '' },
        {}
      );
      if (notificationResponse) {
        handleError(notificationResponse);
      }
    });
  }, []);

  const handleGetDeviceToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        console.log(token);
        setDeviceToken(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log(token);
    });
  };

  const handleGetDeviceUniqueId = () => {
    setDeviceUniqueId(DeviceInfo.getUniqueId());
  };

  const handleUpdatePushNotification = async (
    employeeId: number,
    tenantId: string
  ) => {
    await updatePushNotification({
      employeeId,
      deviceUniqueId,
      deviceToken,
      isLogged: true,
      tenantId,
    });
  };

  const handleRememberedLogin = async () => {
    await handleVerifyBeforeLogin();
    const jwt = await AsyncStorage.getItem(ID_TOKEN);
    const refreshJwt = await AsyncStorage.getItem(REFRESH_TOKEN);
    if (!rememberMe || jwt === '' || refreshJwt === '') {
      return;
    }
    if (jwt) {
      const jwtData = JSON.stringify(jwtDecode(jwt));
      const jwtDataJson = JSON.parse(jwtData);
      if (jwtDataJson.exp - 30 * 1000 < Date.now() / 1000) {
        if (jwtData && refreshJwt) {
          const jwtDataJson = JSON.parse(jwtData);
          fetch(jwtDataJson.iss, {
            headers: {
              'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
              'Content-Type': 'application/x-amz-json-1.1',
            },
            mode: 'cors',
            cache: 'no-cache',
            method: 'POST',
            body: JSON.stringify({
              ClientId: jwtDataJson.aud,
              AuthFlow: 'REFRESH_TOKEN_AUTH',
              AuthParameters: {
                REFRESH_TOKEN: refreshJwt,
              },
            }),
          })
            .then((res) => res.json())
            .then(async (jsonData) => {
              await AsyncStorage.setItem(
                ID_TOKEN,
                jsonData?.AuthenticationResult?.IdToken
              );
              await handleVerifyAfterLogin(authorizationState);
            });
        }
      }
    }
  };

  /**
   * fucntion handle normal login
   */
  const handleNormalLogin = async () => {
    const loginResult = await login(
      { email, password, rememberMe },
      {
        headers: {
          'X-TenantID': selectedConnections?.tenantId,
        },
      }
    );
    if (loginResult) {
      if (loginResult.status === 200) {
        const loginData = loginResult.data;
        dispatch(
          authorizationActions.setAuthorization({
            ...loginData,
            currentPassword: password,
            rememberMe,
          })
        );
        if (loginData.idToken) {
          await AsyncStorage.setItem(ID_TOKEN, loginData.idToken);
        }
        if (loginData.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN, loginData.refreshToken);
        }
        if (loginData.timezoneName) {
          await AsyncStorage.setItem(TIMEZONE_NAME, loginData.timezoneName);
        }
        const languageResult = await getLanguages();
        const timezoneResult = await getTimezones();
        if (timezoneResult && languageResult) {
          dispatch(
            initializeFieldActions.setInitializeField({
              timezones: timezoneResult.data?.timezones,
              languages: languageResult.data?.languagesDTOList,
            })
          );
        }
        setError('');
        await handleVerifyAfterLogin(loginData);
        // navigation.navigate('menu');
      } else {
        setError(translate(responseMessages.ERR_LOG_0006));
      }
    } else {
      alert('no response');
    }
  };

  const handleVerifyAfterLogin = async (loginData: any) => {
    // check first login or password expired
    if (loginData.newPasswordRequired) {
      navigation.navigate('change-password');
      return;
    }
    if (loginData.remainingDays <= 0) {
      navigation.navigate('change-password');
      return;
    }
    const verifyResult = await verifyAfterLogin();
    console.log(verifyResult);
    if (verifyResult && verifyResult.status === 200) {
      // TODO
    } else {
      return;
    }
    // check missing license
    if (verifyResult.data.isMissingLicense) {
      if (loginData.isAdmin) {
        setError(
          translate(
            authorizationMessages.login_110001_missingLicenseAdminMessage
          )
        );
      } else {
        setError(
          translate(
            authorizationMessages.login_110001_missingLicenseUserMessage
          )
        );
      }
    } else {
      const getContractResult = await getStatusContract();
      if (getContractResult?.status === 200) {
        const getContractData = getContractResult.data;
        if (
          getContractData.statusContract === ContractStatus.PAUSE ||
          (getContractData.statusContract === ContractStatus.READY &&
            getContractData.dayRemainTrial &&
            getContractData.dayRemainTrial <= 0)
        ) {
          navigation.navigate('trial-expired');
        } else if (getContractData.statusContract === ContractStatus.DELETE) {
          // TODO 404
          navigation.navigate('forbidden', { errorType: '404' });
        } else {
          handleUpdatePushNotification(
            loginData.employeeId,
            loginData.tenantId
          );

          const params = await handleShowPortalAndFeedback(loginData);

          if (!params.isDisplayFeedBack && !params.isDisplayFirstScreen) {
            navigation.dispatch(
              StackActions.replace("menu")
            )
          } else {  
            navigation.dispatch(
              StackActions.replace("menu", params)
            )
          }
        }
      }
    }
  };

  const handleShowPortalAndFeedback = async (loginData: any) => {
    const values = await Promise.all([
      getEmployeesByIds({ employeeIds: [loginData.employeeId] }),
      getStatusOpenFeedback({}, {})
    ]);
    const responseIsDisplayFirstScreen = values[0];
    const responseStatusOpenFeedback = values[1];
    let params = {
      isDisplayFirstScreen: false,
      isDisplayFeedBack: false
    }
    if (responseIsDisplayFirstScreen.status === 200 && responseIsDisplayFirstScreen?.data?.employees?.length) {
      let isDisplayFirstScreen = responseIsDisplayFirstScreen.data.employees[0].isDisplayFirstScreen
      params.isDisplayFirstScreen = isDisplayFirstScreen || isDisplayFirstScreen === null;
    }

    const responseTenantStatusContract = await getTenantStatusContract({
      tenantName: responseStatusOpenFeedback.data.tenantName
    });

    if (responseTenantStatusContract.data) {
      const sumTrialEndDate: any = new Date(responseTenantStatusContract.data.trialEndDate);
      sumTrialEndDate.setDate(sumTrialEndDate.getDate() - 30);

      const currentDate: any = new Date();

      const trialDate = Math.abs(currentDate - sumTrialEndDate);
      const diffDays = Math.ceil(trialDate / (1000 * 60 * 60 * 24));
      params.isDisplayFeedBack = diffDays > 7
    }
    
    return params;
  }

  /**
   * fucntion navigate to reset password screen
   */
  const handleResetPassword = () => {
    navigation.navigate('forgot-password');
  };

  /**
   * handle verify
   */
  const handleVerifyBeforeLogin = async () => {
    // TODO: check backend esms
    if (selectedConnections?.tenantId) {
      const verifyResult = await verifyBeforeLogin({
        site: 'esms',
        tenantId: selectedConnections?.tenantId,
        userAgent: Platform.OS,
      });
      if (verifyResult && verifyResult.status === 200) {
        const verifyData = verifyResult.data;
        // check ip address
        if (verifyData.isAccept === false) {
          navigation.navigate('forbidden', { errorType: '403' });
          return;
        }
        // TODO: control in next phase
        if (verifyData.isMissingLicense) {
          return;
        }
        if (verifyData.authenticated) {
          dispatch(StackActions.replace('menu'));
          return;
        }
        if (verifyData.signInUrl) {
          Linking.openURL(verifyData.signInUrl);
        }
      }
    }
  };

  return (
    <SafeAreaView style={LoginScreenStyles.container}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
      >
        <View>
          <View style={LoginScreenStyles.logoContainner}>
            <Image source={logo} style={LoginScreenStyles.logo} />
          </View>
          {error.length > 0 && (
            <View style={{ alignItems: 'center' }}>
              <CommonMessage
                content={error}
                type={TypeMessage.ERROR}
                onPress={Object}
              />
            </View>
          )}
          <View style={LoginScreenStyles.inputRegionContainer}>
            <TouchableOpacity
              style={[
                LoginScreenStyles.inputContainer,
                LoginScreenStyles.inputConnection,
              ]}
              onPress={() => navigation.navigate('pick-connection')}
            >
              <Image source={earthIcon} />
              {selectedConnections ? (
                <Text style={LoginScreenStyles.input}>
                  {format(
                    '【{0}】{1}',
                    selectedConnections.companyName,
                    selectedConnections.tenantId
                  )}
                </Text>
              ) : (
                  <Text style={LoginScreenStyles.inputPlaceholder}>
                    {translate(
                      authorizationMessages.login_authorization_url_placeholder
                    )}
                  </Text>
                )}
              <Image source={arrowRight} />
            </TouchableOpacity>

            <View style={LoginScreenStyles.inputContainer}>
              <Image source={personIcon} />
              <TextInput
                style={LoginScreenStyles.input}
                placeholder={translate(
                  authorizationMessages.login_authorization_email_placeholder
                )}
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View
              style={[
                LoginScreenStyles.inputContainer,
                { borderColor: '#E5E5E5', borderWidth: 1 },
              ]}
            >
              <Image source={lockIcon} />
              <TextInput
                style={LoginScreenStyles.input}
                placeholder={translate(
                  authorizationMessages.login_authorization_password_placeholder
                )}
                placeholderTextColor="#999999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
          {selectedConnections && selectedConnections?.tenantId?.length > 0 && (
            <View style={LoginScreenStyles.viewLink}>
              <TouchableOpacity onPress={() => handleResetPassword()}>
                <Text style={LoginScreenStyles.link}>
                  {translate(
                    authorizationMessages.login_authorization_forgot_password
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ alignItems: 'center', marginVertical: 15 }}>
            <CommonButton
              onPress={() => handleNormalLogin()}
              status={StatusButton.ENABLE}
              icon=""
              textButton={translate(
                authorizationMessages.login_authorization_login
              )}
              typeButton={TypeButton.BUTTON_BIG_SUCCESS}
            />
          </View>
          <View style={LoginScreenStyles.rememberMeContainer}>
            <TouchableOpacity
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                setRememberMe(!rememberMe);
              }}
            >
              {rememberMe ? (
                <Image source={checkboxChecked} />
              ) : (
                  <Image source={checkboxUnchecked} />
                )}
            </TouchableOpacity>
            <Text>
              {translate(authorizationMessages.login_authorization_remember_me)}
            </Text>
          </View>
        </View>
        <LoginFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
