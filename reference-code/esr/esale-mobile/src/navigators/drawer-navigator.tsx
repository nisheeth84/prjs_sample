import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";
import { TabNavigator } from "./tab-navigator";
import { DrawerRightContent } from "../modules/drawer/drawer-right/drawer-right-content";
import { CommonStyles } from "../shared/common-style";
import { SearchGlobal } from "../modules/search/search-screen";
import { DrawerLeftTaskNavigator } from "../modules/task/drawer/drawer-task-stack";
import { ScreenName } from "../config/constants/screen-name";
import { ProductDetailsScreen } from "../modules/products/details/product-details-screen";
import { DetailScreen } from "../modules/employees/detail";
import { DrawerLeftManageNavigator } from "../modules/products-manage/drawer/stack";
import { PortalNavigator } from "../modules/portal/portal-navigator"
import { useRoute } from "@react-navigation/native";
import { DrawerLeftTimelineNavigator } from '../modules/timeline/timeline-navigator';
import { DrawerLeftBusinessCardNavigator } from '../modules/business-card/navigators/business-card-drawer-navigator';
import { FeedbackStack } from '../modules/feedback/feedback-navigator';
const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();

interface NavigatorParams {
  isDisplayFirstScreen: boolean,
  isDisplayFeedBack: boolean
}

interface NavigatorRoute {
  key: string,
  name: string,
  params: NavigatorParams,
  state: any
}

export function DrawerRightNavigator() {
  const route : NavigatorRoute = useRoute();
  const [isDisplayFirstScreen, setIsDisplayFirstScreen] = useState(route?.params?.isDisplayFirstScreen);
  const [isDisplayFeedBack, setIsDisplayFeedBack] = useState(route?.params?.isDisplayFeedBack);

  const getPortalScreen = (navigator : any) => {
    return <PortalNavigator onClose={(custom? : () => void) => {
      if (isDisplayFirstScreen) {
        if (isDisplayFeedBack) {
          navigator.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: "feedback-navigator" }]
          }))
        } else {
          navigator.navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: "Tab" }]
          }))
        }
        setIsDisplayFirstScreen(false);
      } else if (!custom || typeof custom !== "function") {
        navigator.navigation.goBack();
      } else {
        custom();
      }
    }} />
  }

  const getFeedbackScreen = (navigator : any) => {
    return <FeedbackStack onClose={(custom? : () => void) => {
      if (isDisplayFeedBack) {
        navigator.navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{ name: "Tab" }]
        }))
        setIsDisplayFeedBack(false);
      } else if (!custom || typeof custom !== "function") {
        navigator.navigation.goBack();
      } else {
        custom();
      }
    }} />
  }

  const getInitialRouteName = () => {
    // If is display first screen flag from server is true -> show welcome screen
    if (route?.params?.isDisplayFirstScreen) {
      return "portal-navigator";
    }
    // If is display feedback flag from server is true -> show feedback screen
    else if (route?.params?.isDisplayFeedBack) {
      return "feedback-navigator";
    }
    // Otherwise show menu screen
    return "Tab";
  }

  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <Drawer.Navigator
        drawerPosition="right"
        drawerStyle={{ width: width - 50 }}
        drawerContent={() => <DrawerRightContent />}
        initialRouteName={getInitialRouteName()}
      >
        <Drawer.Screen name="Tab" component={TabNavigator} />
        <Drawer.Screen name="portal-navigator" component={getPortalScreen} />
        <Drawer.Screen name="feedback-navigator" component={getFeedbackScreen} />
        <Drawer.Screen
          name="Timeline"
          component={DrawerLeftTimelineNavigator}
        />
        <Drawer.Screen
          name={ScreenName.PRODUCT_DETAIL}
          component={ProductDetailsScreen}
        />
        <Drawer.Screen name="detail-employee" component={DetailScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}
