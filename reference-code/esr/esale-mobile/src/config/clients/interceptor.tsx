import AsyncStorage from "@react-native-community/async-storage";
import jwtDecode from "jwt-decode";
import { AxiosRequestConfig } from "axios";
import { ID_TOKEN, REFRESH_TOKEN, TIMEZONE_NAME } from "../constants/constants";
import { EMPLOYEES_API } from "../constants/api";

/**
 * Refresh id token
 * @param jwtData
 */
const onRefreshToken = async (jwtData: any) => {
  const refreshJwt = await AsyncStorage.getItem(REFRESH_TOKEN);
  if (jwtData && refreshJwt) {
    const jwtDataJson = JSON.parse(jwtData);
    fetch(jwtDataJson.iss, {
      headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1",
      },
      mode: "cors",
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify({
        ClientId: jwtDataJson.aud,
        AuthFlow: "REFRESH_TOKEN_AUTH",
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
      });
  }
};
/**
 * handle when send request success
 */
export const onRequestSuccess = async (config: AxiosRequestConfig) => {
  if (
    (config.url?.includes("api") &&
      !config.url?.includes("get-company-name")) ||
    config.url?.includes(EMPLOYEES_API.logoutUrl)
  ) {
    const jwt = await AsyncStorage.getItem(ID_TOKEN);
    if (jwt) {
      const jwtData = JSON.stringify(jwtDecode(jwt));
      const jwtDataJson = JSON.parse(jwtData);
      if (jwtDataJson.exp - 30 * 1000 < Date.now() / 1000) {
        onRefreshToken(jwtData);
      }
      const timezone = await AsyncStorage.getItem(TIMEZONE_NAME);
      const tokenId = await AsyncStorage.getItem(ID_TOKEN);
      config.headers = {
        Authorization: `bearer ${tokenId}`,
        timezone: `${timezone}`
      };
    } else {
      await AsyncStorage.removeItem(ID_TOKEN);
      await AsyncStorage.removeItem(REFRESH_TOKEN);
    }
  }
  return config;
};
