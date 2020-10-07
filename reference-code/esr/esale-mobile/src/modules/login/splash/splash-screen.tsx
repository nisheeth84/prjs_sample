import * as Linking from 'expo-linking';
import * as Url from 'url';
import React, { useEffect } from 'react';
import { Image, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TEXT_EMPTY, ID_TOKEN } from '../../../config/constants/constants';
import { SplashScreenStyles } from './splash-styles';
import AsyncStorage from '@react-native-community/async-storage';

export function SplashScreen() {
  const navigation = useNavigation();
  const handleLinking = async ({ url }: { url: string }) => {
    // const query = Url.parse(url).query?.split("&")
    let navigatorName = TEXT_EMPTY
    let screenName = TEXT_EMPTY
    let tenantId = TEXT_EMPTY
    let resetCode = TEXT_EMPTY
    if (url.includes('account/reset')) {
      const urlObj = Url.parse(url)
      const pathName = urlObj.pathname
      const pathNameArray = pathName?.split('/')
      if (pathNameArray && pathNameArray.length > 1) {
        tenantId = pathNameArray[1]
      }
      const query = urlObj.query?.split("&")
      if (query) {
        query.forEach(param => {
          const keyValueSplit = param.split("=")
          if (keyValueSplit[0] === "resetCode") {
            navigatorName = "login-navigator"
            screenName = "change-password"
            resetCode = keyValueSplit[1]
          }
        })
      }
    }
    else if (url.includes("id_token") && url.includes("access_token")) {
      const queryLogin = url.substr(url.indexOf("#")).split("&")
      queryLogin.forEach(async param => {
        const keyValueSplit = param.split("=")
        if (keyValueSplit[0] === "id_token") {
          navigatorName = TEXT_EMPTY
          screenName = "menu"
          await AsyncStorage.setItem(ID_TOKEN, keyValueSplit[1]);
        }
        // TODO: handle other case
      })
    }

    if (TEXT_EMPTY === navigatorName) {
      navigation.navigate(screenName)
    } else {
      if (navigatorName === "login-navigator" && screenName === "change-password") {
        navigation.navigate(navigatorName, { screen: screenName, params: { tenantId: tenantId, resetCode: resetCode } })
        return
      }
      navigation.navigate(navigatorName, { screen: screenName })
    }
  };

  const handleUrl = (initialURL: any) => {
    if (initialURL) {
      handleLinking({ url: initialURL });
    } else {
      navigation.navigate("login-navigator", { screen: "login" })
    }
  }

  useEffect(() => {
    async function getInitialURL() {
      if (Platform.OS === 'android') {
        const NativeLinking = require('react-native/Libraries/Linking/NativeLinking').default;
        NativeLinking.getInitialURL().then((url: any) => handleUrl(url));
      } else {
        Linking.getInitialURL().then(url => handleUrl(url));
      }
    }
    getInitialURL();
    Linking.addEventListener("url", handleLinking);
    return () => Linking.removeEventListener("url", handleLinking);
  }, []);

  const iconEsm = require("../../../../assets/icon.png");
  return (
    <View style={SplashScreenStyles.container}>
      <Image source={iconEsm} />
    </View>
  )
}