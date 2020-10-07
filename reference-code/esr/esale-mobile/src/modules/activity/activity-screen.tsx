import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import { ActivityCreateEditScreen } from "./create-edit/activity-create-edit-screen"
import { TouchableOpacity, View, } from "react-native"
import Toast from 'react-native-toast-message'
import { ActivityDetailScreen } from './detail/activity-detail-screen'
import { StackScreen } from './constants'
import { CommonMessage } from '../../shared/components/message/message'
import { BusinessCardListScreen } from './list/business-card-list/business-card-list-screen'
import { ProductTradingListScreen } from './list/product-trading-list/product-trading-list-screen'
import { DetailScreen } from '../employees/detail'
import { CalendarDetailScreen } from '../calendar/screens/calendar-detail-screen'
import { TypeMessage } from '../../config/constants/enum'
import { ProductDetail } from '../products-manage/product-trading-detail-screen'
import { CustomerNavigator } from '../customer/customer-navigator/customer-navigator'
import { CustomDetailScreen } from '../customer/detail/customer-detail-screen'
import { TaskStack } from '../task/drawer/drawer-task-stack'
import { ProductTradingManagerStack } from '../products-manage/drawer/stack'
import { DrawerLeftActivity } from './drawer-activity'
import { BusinessCardStack } from '../business-card/navigators/business-card-drawer-navigator'
import { CalendarScreen } from '../calendar/calendar-screen'
import { TimelineStack } from '../timeline/timeline-navigator'
import { TaskDetailScreen } from '../task/task-detail/task-detail-screen'
import { MilestoneDetailScreen } from '../task/milestone-detail/milestone-detail-screen'
import { BusinessCardDetailScreen } from '../business-card/business-card-details/business-card-detail-screen'
const toastConfig = {
  'success': (internalState: any) => (
    <>
  <View style={{ alignItems: "center" }}>
    <TouchableOpacity>
      <CommonMessage content={internalState.text1} type={internalState.text2 || TypeMessage.INFO}></CommonMessage>
    </TouchableOpacity>
  </View>
    </>
  ),
  'error': () => { },
  'info': () => { },
  'any_custom_type': () => { }
}

const Stack = createStackNavigator()

export const ActivityScreen = () => {

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Stack.Navigator
        initialRouteName={StackScreen.DRAWER_ACTIVITY}
        headerMode="none"
        screenOptions={{ cardStyle: { backgroundColor: "#FBFBFB" } }
      }>
        <>
          <Stack.Screen name={StackScreen.DRAWER_ACTIVITY} component={DrawerLeftActivity} />
          <Stack.Screen name={StackScreen.ACTIVITY_CREATE_EDIT} component={ActivityCreateEditScreen} />
          <Stack.Screen name={StackScreen.ACTIVITY_DETAIL} component={ActivityDetailScreen} />
          <Stack.Screen name={StackScreen.BUSINESS_CARD_LIST} component={BusinessCardListScreen} />
          <Stack.Screen name={StackScreen.PRODUCT_TRADING_LIST} component={ProductTradingListScreen} />
          <Stack.Screen name={StackScreen.PRODUCT_TRADING_DETAIL} component={ProductDetail} />
          <Stack.Screen name={StackScreen.EMPLOYEE_DETAIL} component={DetailScreen} />
          <Stack.Screen name={StackScreen.CALENDAR_DETAILS} component={CalendarDetailScreen} />
          <Stack.Screen name={StackScreen.CUSTOMER_NAVIGATOR} component={CustomerNavigator} />
          <Stack.Screen name={StackScreen.CUSTOMER_DETAILS} component={CustomDetailScreen} />
          <Stack.Screen name={StackScreen.TASK_STACK} component={TaskStack} />
          <Stack.Screen name={StackScreen.PRODUCT_TRADING_MANAGER_STACK} component={ProductTradingManagerStack} />
          <Stack.Screen name={StackScreen.BUSINESS_CARD_STACK} component={BusinessCardStack} />
          <Stack.Screen name={StackScreen.CALENDAR_SCREEN} component={CalendarScreen} />
          <Stack.Screen name={StackScreen.TIME_LINE_STACK} component={TimelineStack} />
          <Stack.Screen name={StackScreen.TASK_DETAIL} component={TaskDetailScreen} />
          <Stack.Screen name={StackScreen.MILESTONE_DETAIL} component={MilestoneDetailScreen} />
          <Stack.Screen name={StackScreen.BUSINESS_CARD_DETAIL} component={BusinessCardDetailScreen} />
        </>
      </Stack.Navigator>
      <Toast config={toastConfig} ref={(ref: any) => Toast.setRef(ref)} />
    </View>
  );
};
