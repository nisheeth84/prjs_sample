import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerRightNavigator } from './drawer-navigator';
import { LoginNavigator } from '../modules/login/navigators/login-navigator';
import { SplashScreen } from '../modules/login/splash/splash-screen';
import { theme } from '../config/constants';
import { ScreenName } from '../config/constants/screen-name';
import { PopupSortScreen } from '../shared/components/popup-sort/popup-sort-screen';
import { DrawerLeftManageNavigator } from '../modules/products-manage/drawer/stack';
import { SearchNavigator } from '../modules/search/search-stack';
import { DrawerLeftTaskNavigator } from '../modules/task/drawer/drawer-task-stack';
import {DrawerLeftCalendarNavigator} from '../modules/calendar/calendar-drawer';





const Stack = createStackNavigator();

export function MainNavigator() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.white100 },
      }}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="login-navigator" component={LoginNavigator} />
      <Stack.Screen name="menu" component={DrawerRightNavigator} />
      {/* <Stack.Screen name="menu" component={DrawerLeftManageNavigator} /> */}
      <Stack.Screen name="popup-sort-screen" component={PopupSortScreen} />
      <Stack.Screen name="search-stack" component={SearchNavigator} />
    </Stack.Navigator>
  );
}


