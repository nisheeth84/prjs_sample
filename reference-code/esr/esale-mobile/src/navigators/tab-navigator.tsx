/* eslint-disable dot-notation */
import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackNavigationOptions } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { SvgCssUri } from "react-native-svg";
import { ServiceFavoriteSelector } from "../modules/menu/menu-feature-selector";
import { StackMenu, DummyScreen } from "../modules/menu/stack";
import { theme } from "../config/constants";
import { DrawerLeftEmployeesNavigator } from "../modules/employees/navigators/employees-drawer-navigator";
import { messages } from "./tab-navigator-messages";
import { translate, useI18N } from "../config/i18n";
import { Icon as IconComponent } from "../shared/components/icon";
import { authorizationSelector } from "../modules/login/authorization/authorization-selector";
import { DrawerLeftProductNavigator } from "../modules/products/navigators/products-drawer-navigator";
import { DrawerLeftCustomersNavigator } from "../modules/customer/navigator/customers-drawer-navigator";
import { DrawerLeftTimelineNavigator } from "../modules/timeline/timeline-navigator";
import { apiUrl } from "../config/constants/api";
import { DrawerLeftCalendarNavigator } from "../modules/calendar/calendar-drawer";
import { DrawerLeftManageNavigator } from "../modules/products-manage/drawer/stack";
import { DrawerLeftTaskNavigator } from "../modules/task/drawer/drawer-task-stack";
import { DrawerLeftBusinessCardNavigator } from "../modules/business-card/navigators/business-card-drawer-navigator";
import { FeedbackStack } from "../modules/feedback/feedback-navigator";
import { ActivityScreen } from "../modules/activity/activity-screen";

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  wrapTabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarItemLabel: {
    fontSize: 12,
  },
  icon: {
    marginTop: 5,
  },
  iconDescriptionStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export function TabNavigator() {
  const authState = useSelector(authorizationSelector);
  const serviceFavorite = useSelector(ServiceFavoriteSelector);

  const i18n = useI18N();
  useEffect(() => {
    if (authState && authState.languageCode) {
      const languageCode = authState.languageCode.replace("_", "-");
      i18n.changeLocale(languageCode);
    }
  }, [authState]);
  const handleScreen = (serviceId: number): FunctionComponent => {
    switch (serviceId) {
      case 1:
        return DrawerLeftEmployeesNavigator;
      case 2:
        return DrawerLeftCalendarNavigator;
      case 3:
        return DrawerLeftTimelineNavigator;
      case 4:
        return DrawerLeftBusinessCardNavigator;
      case 5:
        return DrawerLeftCustomersNavigator;
      case 6:
        return ActivityScreen;
      case 8:
        return DrawerLeftEmployeesNavigator;
      case 14:
        return DrawerLeftProductNavigator;
      case 15:
        return DrawerLeftTaskNavigator;
      case 16:
        return DrawerLeftManageNavigator;
      case 17:
        return FeedbackStack;
      case 31:
        return DummyScreen;
      default:
        return DummyScreen;
    }
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="menu"
        tabBarOptions={{
          activeTintColor: "#62dba9",
          inactiveTintColor: "#bbb",
          inactiveBackgroundColor: theme.colors.white100,
          style: {
            height: 61
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            const { params = {} }: any = route;
            const { icon = "menu" } = params;
            return (
              <View style={styles.wrapTabBarItem}>
                {icon == "menu" ? (
                  <IconComponent name={icon} style={styles.icon} />
                ) : (
                    <View style={styles.iconDescriptionStyle}>
                      <SvgCssUri
                        uri={`${apiUrl}${icon}`}
                        width="100%"
                        height="100%"
                      />
                    </View>
                  )}
              </View>
            );
          },
          tabBarLabel: () => {
            const { params = {} }: any = route;
            const { label = translate(messages.menu) } = params;
            return (
              <Text style={styles.tabBarItemLabel} numberOfLines={1}>
                {label}
              </Text>
            );
          },
        })}
      >
        {serviceFavorite.length > 0 &&
          serviceFavorite.map((eml) => {
            return (
              <Tab.Screen
                name={JSON.parse(eml.serviceName)["en_us"]}
                key={eml.serviceId}
                initialParams={{
                  icon: eml.iconPath,
                  label: JSON.parse(eml.serviceName)[
                    (authState && authState.languageCode) || "ja_jp"
                  ],
                }}
                component={handleScreen(eml.serviceId || 0)}
              />
            );
          })}
        <Tab.Screen name="menu" component={StackMenu} />
      </Tab.Navigator>
    </View>
  );
}

TabNavigator.navigationOptions = {
  headerShown: true,
} as StackNavigationOptions;
