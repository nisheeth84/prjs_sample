import * as React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import { messages } from "./menu-messages";
import { Icon } from "../../shared/components/icon";
import { translate } from "../../config/i18n";
import { Feature } from "./menu-type";
import { MenuFeatureStyles } from "./menu-style";
import { normalLogout } from "./menu-feature-repository";
import { authorizationActions } from "../login/authorization/authorization-reducer";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import { updatePushNotification } from "../login/authorization/authorization-repository";
import { connectionActions } from "../login/connection/connection-reducer";
import { menuSettingActions } from "./menu-personal-settings/menu-settings-reducer";
import { TEXT_EMPTY } from "../../shared/components/message/message-constants";

export function MenuFeature() {
  const authorizationState = useSelector(authorizationSelector);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const features: Feature[] = [
    {
      title: translate(messages.appSetting),
      icon: "configuration",
      active: true,
      handler: () => navigation.navigate("setting"),
    },
    {
      title: translate(messages.help),
      icon: "help",
      active: true,
      handler: () => navigation.navigate("help"),
    },
    {
      title: translate(messages.beginnerPerson),
      icon: "beginnerPerson",
      active: true,
      handler: () => {
        navigation.navigate("portal-navigator", { screen: "first-login" });
      },
    },
    {
      title: translate(messages.response),
      icon: "response",
      active: true,
      handler: () => {
        navigation.navigate("feedback-navigator", { screen: "feed-back" });
      },
    },
    {
      title: translate(messages.logout),
      icon: "logout",
      active: true,
      handler: async () => {
        const normalLogoutResponse = await normalLogout({}, {});
        if (normalLogoutResponse) {
          switch (normalLogoutResponse.status) {
            case 400: {
              alert("Bad request!");
              break;
            }
            case 500: {
              alert("Server error!");
              break;
            }
            case 403: {
              alert("You have not permission get Field Info Personals!");
              break;
            }
            case 204: {
              await updatePushNotification({
                employeeId: authorizationState.employeeId,
                deviceUniqueId: "",
                deviceToken: "",
                isLogged: false,
                tenantId: authorizationState.tenantId,
              });
              dispatch(authorizationActions.setEmptyUserData(undefined));
              dispatch(
                connectionActions.setSelectedConnectionIndex({ position: -1 })
              );
              dispatch(
                menuSettingActions.getNotificationSettings({
                  dataNotificationSettings: {
                    employeeId: 0,
                    email: TEXT_EMPTY,
                    notificationTime: 0,
                    data: [],
                  },
                })
              );
              navigation.navigate("login-navigator");
              break;
            }
            default:
              alert("Error");
              break;
          }
        }
      },
    },
  ];

  return (
    <View style={MenuFeatureStyles.wrapMenuItem}>
      {features.map((item: Feature) => {
        return (
          <TouchableOpacity
            style={MenuFeatureStyles.itemMenu}
            key={item.icon}
            disabled={!item.active}
            onPress={item.handler}
          >
            {item.icon ? (
              <Icon name={item.icon} style={MenuFeatureStyles.iconStyle} />
            ) : (
              <View style={MenuFeatureStyles.iconStyle} />
            )}
            <Text style={MenuFeatureStyles.titleStyle}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
