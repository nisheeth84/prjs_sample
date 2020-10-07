import React from "react"
import { Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { DrawerLeftActivityContent } from "./drawer/drawer-activity-content"
import { ActivityListScreen } from "./list/activity-list-screen"
import { StackScreen } from "./constants"

const { width } = Dimensions.get("window")
const Drawer = createDrawerNavigator()
export function DrawerLeftActivity() {
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={{
        width: width - 50,
      }}
      drawerContent={() => <DrawerLeftActivityContent />}
    >
      <Drawer.Screen name={StackScreen.ACTIVITY_LIST} component={ActivityListScreen} />
    </Drawer.Navigator>
  )
}