import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ProductListScreen } from "../list/product-list-screen";
import { ScreenName } from "../../../config/constants/screen-name";

const Stack = createStackNavigator();

export function ProductsNavigator() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ScreenName.PRODUCT} component={ProductListScreen} />
      <Stack.Screen name={ScreenName.CUSTOMER_DETAIL}>
        {() => (
          <View>
            <Text>Customer Details</Text>
          </View>
        )}
      </Stack.Screen>
      <Stack.Screen name={ScreenName.EMPLOYEE_DETAIL}>
        {() => (
          <View>
            <Text>Employee Details</Text>
          </View>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
