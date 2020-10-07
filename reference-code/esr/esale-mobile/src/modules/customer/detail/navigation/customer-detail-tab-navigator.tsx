import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { InfoBasicTab } from '../tabs/info-basic/info-basic-tab';
import { TabBarCustomerDetail } from '../tab-bar-customer-detail';
import { useSelector } from 'react-redux';
import { tabInfoSelector } from '../customer-detail-selector';
import { TabsInfoData } from '../customer-detail-repository';
import { TabsList, TabName } from '../enum';
import { ChangeHistoryTab } from '../tabs/change-history/change-history-tab';
import { ActivityHistoryInformationTab } from '../tabs/activity-history-information/activity-history-information-tab';
import { NetworkBusinessCardTab } from '../tabs/network-business-card/network-business-card-tab';
import { ListTasks } from '../tabs/list-task/list-task';
import CalendarHome from '../tabs/calendar-customer/screens/calendar-screen';
import { TradingProduction } from '../tabs/tab-trading-products/trading-products-screen';

const Tab = createMaterialTopTabNavigator();

export default function CustomerDetailTabNavigator() {
  const tabInfo = useSelector(tabInfoSelector);

  /**
   * Get element tab by tabId
   * @param tab TabsInfoData
   */
  const getTab = (tab: TabsInfoData): any => {
    switch (tab.tabId) {
      case TabsList.BASIC_INFO: {
        return <Tab.Screen name={TabName.INFO_BASIC} component={InfoBasicTab} key={tab.tabId} />
      }
      // case TabsList.ACTIVITY_HISTORY: {
      //   return <Tab.Screen name={TabName.ACTIVITY_HISTORY} component={InfoBasicTab} key={tab.tabId} />
      // }
      case TabsList.CHANGE_HISTORY: {
        return <Tab.Screen name={TabName.CHANGE_HISTORY} component={ChangeHistoryTab} key={tab.tabId} />
      }
      case TabsList.TRADING_PRODUCT: {
        return <Tab.Screen name={TabName.TRADING_PRODUCT} component={TradingProduction} key={tab.tabId} />
      }
      case TabsList.CALENDAR: {
        return <Tab.Screen name={TabName.CALENDAR} component={CalendarHome} key={tab.tabId} />
      }
      case TabsList.TASK: {
        return <Tab.Screen name={TabName.TASK} component={ListTasks} key={tab.tabId} />
      }
      // case TabsList.MAIL: {
      //   return <Tab.Screen name={TabName.MAIL} component={InfoBasicTab} key={tab.tabId} />
      // }
      case TabsList.ACTIVITY_HISTORY_INFORMATION: {
        return <Tab.Screen name={TabName.ACTIVITY_HISTORY_INFORMATION} component={ActivityHistoryInformationTab} key={tab.tabId} />
      }
      case TabsList.NETWORK_BUSINESS_CARD: {
        return <Tab.Screen name={TabName.NETWORK_BUSINESS_CARD} component={NetworkBusinessCardTab} key={tab.tabId} />
      }
    }
  }

  return (
      <Tab.Navigator
        tabBar={props => <TabBarCustomerDetail {...props} />}>
        {
          tabInfo.map((tab) => {
            return getTab(tab)
          })
        }
      </Tab.Navigator>
  );
}
