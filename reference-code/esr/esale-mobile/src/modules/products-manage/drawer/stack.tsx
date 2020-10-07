import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SearchNavigator } from "../../search/search-stack";
import { CommonStyles } from "../../../shared/common-style";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TransactionManagementMenu } from "./drawer-left-transaction-management-menu";
import { ProductManagers } from "../manage/products-trading-manage-screen";
import { ProductDetail } from "../product-trading-detail-screen";
import { ScreenName } from "../../../config/constants/screen-name";
import { ProductManageMoveToListScreen } from "../move-to-list/product-manage-move-list-screen";
import { ProductManageAddToListScreen } from "../add-to-list/product-manage-add-to-list-screen";
import { CreateEditShareListScreen } from "../create-edit-share-list/create-edit-share-list-screen";
import { ProductManageCreateMyListScreen } from "../create-my-list/product-manage-create-my-list-screen";
import { SearchGlobal } from "../../search/search-screen";
import { ActivityCreateEditScreen } from "../../activity/create-edit/activity-create-edit-screen";
import { CreateTask } from "../../task/add-edit-task/create-task";
import {CreateMilestone} from "../../task/add-edit-milestone/create-milestone-screen";
import { CustomDetailScreen } from "../../customer/detail/customer-detail-screen";
import { DetailScreen } from "../../employees/detail";
import { CreateScreen } from "../../calendar/screens/create-screen";

const Drawer = createDrawerNavigator();
export const DrawerLeftManageNavigator = () => {
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={CommonStyles.drawerContainer}
      drawerContent={() => <TransactionManagementMenu />}
    >
      <Drawer.Screen name={ScreenName.PRODUCT_TRADING_MANAGE} component={ProductTradingManagerStack} />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();
export const ProductTradingManagerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE}
        component={ProductManagers}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE_MOVE_TO_LIST}
        component={ProductManageMoveToListScreen}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE_ADD_TO_LIST}
        component={ProductManageAddToListScreen}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST}
        component={ProductManageCreateMyListScreen}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST}
        component={CreateEditShareListScreen}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_TRADING_DETAIL}
        component={ProductDetail}
      />
      <Stack.Screen name={ScreenName.SEARCH} component={SearchGlobal} />
      <Stack.Screen
        name={ScreenName.EMPLOYEE_DETAIL}
        component={DetailScreen}
      />
      <Stack.Screen
        name={ScreenName.CUSTOMER_DETAIL}
        component={CustomDetailScreen}
      />
      <Stack.Screen
        name={ScreenName.REGISTER_ACTIVITY}
        component={ActivityCreateEditScreen}
      />
      <Stack.Screen
        name={ScreenName.REGISTER_SALE}
      >
        {() =>
          <View>
            <Text>
              Register Sale
            </Text>
          </View>
        }
      </Stack.Screen>
      <Stack.Screen
        name={ScreenName.REGISTER_TASK}
        component={CreateTask}
      />
      <Stack.Screen
        name={ScreenName.REGISTER_SCHEDULE}
        component={CreateScreen}
      />
        <Stack.Screen
        name={ScreenName.REGISTER_MILESTONE}
        component={CreateMilestone}
      />
      <Stack.Screen name="search-stack" component={SearchNavigator} />
    </Stack.Navigator>
  );
}
