import React from "react"
import { Dimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { DrawerLeftActivityContent } from "./drawer-activity-content"
import { ActivityScreen } from "../activity-screen"

const { width } = Dimensions.get("window")
const Drawer = createDrawerNavigator()

export function DrawerLeftActivityNavigator() {
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={{
        width: width - 50,
      }}
      drawerContent={() => {
        return <DrawerLeftActivityContent />
      }}
    >
      <Drawer.Screen name="activity-stack" component={ActivityScreen} />
    </Drawer.Navigator>
  )
}