import React from "react";
import { Dimensions, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerLeftContent } from "../drawer/drawer-left-content";
import { EmployeeNavigator } from "../employee-navigator/employee-navigator";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();

export function DrawerLeftEmployeesNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        key="drawer-left"
        drawerStyle={{
          width: width - 50,
        }}
        drawerContent={() => <DrawerLeftContent />}
      >
        <Drawer.Screen name="Tab" component={EmployeeNavigator} />
      </Drawer.Navigator>
    </View>
  );
}