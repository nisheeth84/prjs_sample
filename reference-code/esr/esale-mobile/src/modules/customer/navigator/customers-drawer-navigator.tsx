import React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerLeftContent } from "../drawer/drawer-left-content";
import { CustomerNavigator } from "../customer-navigator/customer-navigator";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();

export function DrawerLeftCustomersNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Drawer.Navigator
        key="drawer-left"
        drawerStyle={{
          width: width - 50,
        }}
        drawerContent={() => <DrawerLeftContent />}
      >
        <Drawer.Screen name="Tab" component={CustomerNavigator} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}