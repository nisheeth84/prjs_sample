import React from "react"
import { Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { CalendarScreen } from "./calendar-screen"
import LocalNavigation from "./screens/local-navigation"
import GlobalToolSchedule from "./screens/global-tool-schedule"

const { width } = Dimensions.get("window")
const Drawer = createDrawerNavigator()

export function DrawerRightNavigator() {
  return (
    <Drawer.Navigator drawerPosition="right" 
                      drawerContent={() => <GlobalToolSchedule />} 
                      drawerStyle={{
                        width: width - 30
                      }}>
      <Drawer.Screen name="calendar-drawer" component={CalendarScreen} />
    </Drawer.Navigator>
  );
}

export function DrawerLeftCalendarNavigator() {
  return (
    <Drawer.Navigator
      key="calendar-drawer-left"
      drawerStyle={{
        width: width - 30,
      }}
      drawerContent={() => {
        return <LocalNavigation />
      }}
    >
      <Drawer.Screen name="calendar-drawer-right" component={DrawerRightNavigator} />
    </Drawer.Navigator>
  )
}