import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../../../config/constants';
import { CustomerListScreen } from '../list/customer-list-screen';
import { CustomDetailScreen } from '../detail/customer-detail-screen';
import { ContactHistoryInfoDetailScreen } from '../detail/contact-history-info-detail-screen';
import { TradingProductDetailScreen } from '../detail/trading-product-detail-screen';
import { BasicDetailBusinessCardScreen } from '../detail/tabs/network-business-card/basic-detail-business-card-screen';
import { DeletedPositionDetailScreen } from '../detail/tabs/network-business-card/deleted-position-detail-screen';
import { TradingProductionDetail } from '../detail/tabs/tab-trading-products/list-detail/trading-product-detail';
import { translate } from '../../../config/i18n';
import { messages } from '../detail/customer-detail-messages';
import { CustomerAddToListScreen } from '../add-to-list/customer-add-to-list-screen';
import CustomerListShare from '../customer-list/customer-list-share/customer-list-share-screen';
import { RegistrationEditScreen } from '../registration-edit/customer-registration-edit-screen';
import { CustomerEditMilestoneScreen } from '../registration-edit/customer-edit-milestone-screen';
import { CustomerMoveListScreen } from '../move-list/customer-move-list-screen';
import { CustomerMylistScreen } from '../modal/customer-my-list-screen';
import { ProductTradingSortScreen } from '../detail/tabs/tab-trading-products/trading-product-sort';
import { SearchNavigator } from "../../search/search-stack";
import { BusinessCardCreateAdd } from '../../business-card/creation/business-card-create-add-participants';
import { ActivityListScreen } from '../../activity/list/activity-list-screen';
import { StackScreen } from '../../activity/constants';
import { ActivityCreateEditScreen } from '../../activity/create-edit/activity-create-edit-screen';
import { StackScreenListCustomer } from '../list/customer-list-enum';
import { CreateScreen } from '../../calendar/screens/create-screen';
import { ScreenName } from '../../../config/constants/screen-name';
import { CreateTask } from '../../task/add-edit-task/create-task';
import { BusinessCardListScreen } from '../../activity/list/business-card-list/business-card-list-screen';
import { ProductTradingListScreen } from '../../activity/list/product-trading-list/product-trading-list-screen';
import { CalendarDetailScreen } from '../../calendar/screens/calendar-detail-screen';
import { TaskDetailScreen } from '../../task/task-detail/task-detail-screen';
import { MilestoneDetailScreen } from '../../task/milestone-detail/milestone-detail-screen';
import { BusinessCardDetailScreen } from '../../business-card/business-card-details/business-card-detail-screen';

const Stack = createStackNavigator();

export function CustomerNavigator() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
        <Stack.Screen name="customer-list" component={CustomerListScreen} />
        <Stack.Screen 
        name="customer-detail"
        component={CustomDetailScreen} 
      />
      <Stack.Screen
        name="contact-history-detail"
        component={ContactHistoryInfoDetailScreen}
        options={{
          title: translate(messages.contactHistoryTitle)
        }}
      />
      <Stack.Screen
        name="trading-product-details-tab-info" 
        component={TradingProductDetailScreen}
        options={{
          title: translate(messages.tradingProductTitle)
        }}
      />
      <Stack.Screen
        name="basic-detail-business-card"
        component={BasicDetailBusinessCardScreen}
        options={{
          title: translate(messages.networkMapTitle)
        }}
      />
      <Stack.Screen
        name="deleted-position-detail"
        component={DeletedPositionDetailScreen}
        options={{
          title: translate(messages.deleteScreenTitle)
        }}
      />
      <Stack.Screen
        name="trading-product-details"
        component={TradingProductionDetail}
        options={{
          title: translate(messages.tradingProductTitle)
        }}
      />
      <Stack.Screen
        name="customer-my-list-navigator"
        component={CustomerMylistScreen}
      />
      <Stack.Screen
        name="customer-share-list-navigator"
        component={CustomerListShare}
      />
      <Stack.Screen
        name="customer-create-or-update"
        component={RegistrationEditScreen}
      />
      <Stack.Screen
        name="customer-scenario"
        component={CustomerEditMilestoneScreen}
      />
      <Stack.Screen
        name="customer-add-to-list"
        component={CustomerAddToListScreen}
      />
      <Stack.Screen
        name="customer-move-to-list"
        component={CustomerMoveListScreen}
      />
      <Stack.Screen
        name="product-trading-list-sort"
        component={ProductTradingSortScreen}
      />
      <Stack.Screen name="search-stack" component={SearchNavigator} />
      <Stack.Screen 
        name={StackScreen.ACTIVITY_LIST} 
        component={ActivityListScreen} 
      />
      <Stack.Screen 
        name={StackScreen.ACTIVITY_CREATE_EDIT} 
        component={ActivityCreateEditScreen} 
      />
      <Stack.Screen 
        name={StackScreenListCustomer.REGISTER_SHEDULE} 
        component={CreateScreen} 
      />
      <Stack.Screen 
        name={ScreenName.CREATE_TASK} 
        component={CreateTask} 
      />
      <Stack.Screen
        name={StackScreenListCustomer.REGISTER_BUSINESS_CARD}
        component={BusinessCardCreateAdd}
      />
      <Stack.Screen name={StackScreen.BUSINESS_CARD_LIST} component={BusinessCardListScreen} />
      <Stack.Screen name={StackScreen.PRODUCT_TRADING_LIST} component={ProductTradingListScreen} />
      <Stack.Screen name={StackScreen.CALENDAR_DETAILS} component={CalendarDetailScreen} />
      <Stack.Screen name={StackScreen.TASK_DETAIL} component={TaskDetailScreen} />
      <Stack.Screen name={StackScreen.MILESTONE_DETAIL} component={MilestoneDetailScreen} />
      <Stack.Screen name={StackScreen.BUSINESS_CARD_DETAIL} component={BusinessCardDetailScreen} />
    </Stack.Navigator>
  );
}
