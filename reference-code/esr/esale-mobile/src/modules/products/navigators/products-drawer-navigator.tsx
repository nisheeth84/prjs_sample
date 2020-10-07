import React from "react";
import { Dimensions, SafeAreaView } from "react-native";
import {
  createDrawerNavigator,
  useIsDrawerOpen,
} from "@react-navigation/drawer";
import { DrawerProductLeftContent } from "../drawer/drawer-product-left-content";
import { ProductsNavigator } from "./products-navigator";
import { useDispatch } from "react-redux";
import { productActions } from "../drawer/product-drawer-reducer";
import { CommonStyles } from "../../../shared/common-style";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../../config/constants/screen-name";
import { ProductListScreen } from "../list/product-list-screen";
import { ProductSetDetailsScreen } from "../product-set/product-set-details-screen";
import { ProductDetailsScreen } from "../details/product-details-screen";
import { SearchNavigator } from "../../search/search-stack";
import { ProductTradingDetailScreen } from "../details/tab-trading/product-trading-detail-screen";
import { ProductSetTradingDetailScreen } from "../product-set/tab-trading/product-set-trading-detail-screen";
import { SortSelectionScreen } from "../popup/popup-sort-screen";
import { TradingProductionDetail } from "../details/tab-trading/list-detail/trading-product-detail";
import { ProductTradingSortScreen } from "../details/tab-trading/trading-product-sort";
// import { productActions } from "./product-drawer-reducer";
// import { useDispatch } from "react-redux";
// import { SafeAreaView } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const isDrawerOpen = useIsDrawerOpen();
  const dispatch = useDispatch();

  // Save left drawer status (open/close) to state
  dispatch(productActions.saveDrawerStatus(isDrawerOpen));
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={CommonStyles.drawerContainer}
      drawerContent={() => <DrawerProductLeftContent />}
    >
      {/* <Drawer.Screen name="drawer-right" component={ProductsNavigator} /> */}
      <Drawer.Screen name={ScreenName.PRODUCT} component={ProductsNavigator} />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();

export function DrawerLeftProductNavigator() {
  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="drawer-product" component={DrawerNavigator} />
        <Stack.Screen
          name={ScreenName.PRODUCT_SET_DETAIL}
          component={ProductSetDetailsScreen}
        />
        <Stack.Screen
          name={ScreenName.PRODUCT_DETAIL}
          component={ProductDetailsScreen}
        />
        <Stack.Screen
          name={ScreenName.PRODUCT_TRADING_DETAIL}
          component={ProductTradingDetailScreen}
        />
        <Stack.Screen
          name={ScreenName.PRODUCT_SET_TRADING_DETAIL}
          component={ProductSetTradingDetailScreen}
        />
        <Stack.Screen
          name={ScreenName.PRODUCT_SORT}
          component={SortSelectionScreen}
        />        
      <Stack.Screen name="search-stack" component={SearchNavigator} />
      <Stack.Screen name="trading-product-details-product" component={TradingProductionDetail} />
      <Stack.Screen name="trading-product-sort-product" component={ProductTradingSortScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
