import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { MenuScreen } from './menu-screen';
import { CategorySetting } from './menu-personal-settings/menu-personal-settings-category';
import { LanguageAndTimeSetting } from './menu-personal-settings/menu-personal-settings-language-and-time';
import { ChangePassword } from './menu-personal-settings/menu-personal-settings-change-password';
import { NotificationSetting } from './menu-personal-settings/menu-personal-settings-notification';
import { DetailScreen } from '../employees/detail';
import { DrawerLeftEmployeesNavigator } from '../employees/navigators/employees-drawer-navigator';
import { DrawerLeftProductNavigator } from '../products/navigators/products-drawer-navigator';
import { ScreenName } from '../../config/constants/screen-name';
import { SearchGlobal } from '../search/search-screen';
import { SearchNavigator } from '../search/search-stack';
import { FeedbackCompletionScreen } from '../feedback/feedback-completion-screen';
import HelpScreen from './help/help-screen';
import { DrawerLeftTaskNavigator } from '../task/drawer/drawer-task-stack';
import { DrawerLeftTimelineNavigator } from '../timeline/timeline-navigator';
import { FeedbackStack } from '../feedback/feedback-navigator';
import { DrawerLeftCustomersNavigator } from '../customer/navigator/customers-drawer-navigator';
import { DrawerLeftBusinessCardNavigator } from '../business-card/navigators/business-card-drawer-navigator';


import { CreateTask } from "../task/add-edit-task/create-task";
import { TaskDetailScreen } from "../task/task-detail/task-detail-screen";
import { DrawerLeftManageNavigator } from '../products-manage/drawer/stack';
import { DrawerLeftCalendarNavigator } from '../calendar/calendar-drawer';
import { ActivityScreen } from '../activity/activity-screen';

const Stack = createStackNavigator();

export const DummyScreen = () => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text>Developing feature</Text>
    </View>
  );
};

export function StackMenu() {
  return (
    <Stack.Navigator
      headerMode="none"
      //   screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <Stack.Screen name="menu" component={MenuScreen} />
      <Stack.Screen name="setting" component={CategorySetting} />
      <Stack.Screen name="detail-employee" component={DetailScreen} />
      <Stack.Screen
        name="feedback-completion"
        component={FeedbackCompletionScreen}
      />
      <Stack.Screen name="search-stack" component={SearchNavigator} />
      <Stack.Screen name="help" component={HelpScreen} />
      <Stack.Screen
        name="language-and-time-setting"
        component={LanguageAndTimeSetting}
      />
      <Stack.Screen
        name="notification-setting"
        component={NotificationSetting}
      />

      <Stack.Screen name="change-normal-password" component={ChangePassword} />
      <Stack.Screen
        name={ScreenName.EMPLOYEE}
        component={DrawerLeftEmployeesNavigator}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT}
        component={DrawerLeftProductNavigator}
      />
      <Stack.Screen
        name={ScreenName.LIST_TASK}
        component={DrawerLeftTaskNavigator}
      />
      <Stack.Screen
        name={ScreenName.TIMELINE_SCREEN}
        component={DrawerLeftTimelineNavigator}
      />
      <Stack.Screen
        name={ScreenName.FEEDBACK_SCREEN}
        component={FeedbackStack}
      />
      <Stack.Screen
        name={ScreenName.CUSTOMER}
        component={DrawerLeftCustomersNavigator}
      />
      <Stack.Screen
        name={ScreenName.BUSINESS_CARD}
        component={DrawerLeftBusinessCardNavigator}
      />
      <Stack.Screen
        name={ScreenName.CREATE_TASK}
        component={CreateTask}
      />
      <Stack.Screen
        name={ScreenName.TASK_DETAIL}
        component={TaskDetailScreen}
      />
      <Stack.Screen
        name={ScreenName.PRODUCT_MANAGE}
        component={DrawerLeftManageNavigator}
      />
      <Stack.Screen
        name={ScreenName.CALENDAR}
        component={DrawerLeftCalendarNavigator}
      />
      <Stack.Screen
        name={ScreenName.ACTIVITY_LIST}
        component={ActivityScreen}
      />
    </Stack.Navigator>
  );
}
