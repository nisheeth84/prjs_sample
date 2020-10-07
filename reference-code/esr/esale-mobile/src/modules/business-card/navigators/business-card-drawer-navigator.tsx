import React from "react";
import { Dimensions, View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerBusinessCardLeftContent } from "../drawer/drawer-business-card-left-content";
import { BusinessCardRegisterScreen } from "../register-editer/business-card-register-screen";
import { CommonStyles } from "../../../shared/common-style";
import { TradingProductionDetail } from "../business-card-details/tab-trading-products/list-detail/trading-product-detail";
import { BusinessCardScreen } from "../business-list-card/business-card-screen";
import { BusinessCardDetailScreen } from "../business-card-details/business-card-detail-screen";
import { createStackNavigator } from "@react-navigation/stack";
import { BusinessCardHistoryDetailScreen } from "../business-card-details/tab-history/business-card-history-detail-screen";
import { BusinessCardCreateMyListScreen } from "../creation/business-card-create-my-list-screen";
import { BusinessCardCreateAdd } from "../creation/business-card-create-add-participants";
import { BusinessCardCreateSharedListScreen } from "../creation/business-card-create-shared-list-screen";
import { EmployeeListScreen } from "../business-card-details/employee-list/employee-list";
import { BusinessCardAddToListScreen } from "../add-move-list/business-card-add-list-screen";
import { BusinessCardMoveToListScreen } from "../add-move-list/business-card-move-list-screen";
import { DetailScreen } from "../../employees/detail";
import { CreateScreen } from "../../calendar/screens/create-screen";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export function DrawerLeftBusinessCardNavigator() {
  return (
    // <SafeAreaView style={CommonStyles.flex1}>
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={{
        width: width - 50,
      }}
      drawerContent={() => <DrawerBusinessCardLeftContent />}
    >
      <Drawer.Screen name="businesscard" component={BusinessCardStack} />
    </Drawer.Navigator>
    // </SafeAreaView>
  );
}

export function BusinessCardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="businesscard" component={BusinessCardScreen} />
      <Stack.Screen name="business-card-detail">
        {() => <BusinessCardDetailScreen />}
      </Stack.Screen>
      <Stack.Screen
        name="trading-products-detail"
        component={TradingProductionDetail}
      />
      <Stack.Screen name="customer-detail">
        {() => (
          <View style={CommonStyles.rowCenter}>
            <Text>customer detail</Text>
          </View>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="business-card-history-detail-screen"
        component={BusinessCardHistoryDetailScreen}
      />
      <Stack.Screen
        name="business-card-create-my-list"
        component={BusinessCardCreateMyListScreen}
      />
      <Stack.Screen
        name="business-card-register"
        component={BusinessCardRegisterScreen}
      />
      <Stack.Screen
        name="business-card-create-shared-list"
        component={BusinessCardCreateSharedListScreen}
      />
      <Stack.Screen
        name="business-card-add"
        component={BusinessCardCreateAdd}
      />
      <Stack.Screen
        name="employee-list-screen"
        component={EmployeeListScreen}
      />
      <Stack.Screen
        name="add-to-list"
        component={BusinessCardAddToListScreen}
      />
      <Stack.Screen
        name="move-to-list"
        component={BusinessCardMoveToListScreen}
      />

      <Stack.Screen name="timeline">
        {() => (
          <View style={CommonStyles.rowCenter}>
            <Text>Timeline</Text>
          </View>
        )}
      </Stack.Screen>

      <Stack.Screen name="employee-detail" component={DetailScreen} />

      <Stack.Screen name="register-schedule" component={CreateScreen} />

      <Stack.Screen name="activity-detail">
        {() => (
          <View style={CommonStyles.rowCenter}>
            <Text>Activity-detail</Text>
          </View>
        )}
      </Stack.Screen>

      {/* <Stack.Screen name="register-schedule" >
        {() => (
          <View style={CommonStyles.rowCenter}>
            <Text>Register Schedule</Text>
          </View>
        )}
      </Stack.Screen> */}

      <Stack.Screen name="register-activity">
        {() => (
          <View style={CommonStyles.rowCenter}>
            <Text>Register Activity</Text>
          </View>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
