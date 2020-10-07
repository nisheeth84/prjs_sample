import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { CustomerDetailScreenStyles } from "./customer-detail-style";
import React from 'react';
import { useSelector } from "react-redux";
import { tabInfoSelector, badgesSelector } from "./customer-detail-selector";
import { TabsList, TabName } from "./enum";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import StringUtils from "../../../shared/util/string-utils";

export interface TabsListProp {
  //state of navigation
  state: any,
  //screen navigation
  navigation: any,
}

/**
 * Component for show tabs list
 * @param TabsListProp 
 */
export const TabBarCustomerDetail: React.FC<TabsListProp> = ({
  state,
  navigation
}) => {
  const routes = state.routes;
  const tabInfo = useSelector(tabInfoSelector);
  const badges = useSelector(badgesSelector);
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;

  /**
   * Handle active tab when click tab label
   * 
   * @param isFocused boolean
   * @param route any
   */
  const handleActiveTab = (isFocused: boolean, route: any) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }

  const showTabName = (name: string) => {
    let tabId = 0;
    let tabName = "";

    switch(name) {
      case TabName.INFO_BASIC: {
        tabId = TabsList.BASIC_INFO;
        break;
      }
      case TabName.ACTIVITY_HISTORY: {
        tabId = TabsList.ACTIVITY_HISTORY;
        break;
      }
      case TabName.CHANGE_HISTORY: {
        tabId = TabsList.CHANGE_HISTORY;
        break;
      }
      case TabName.TRADING_PRODUCT: {
        tabId = TabsList.TRADING_PRODUCT;
        break;
      }
      case TabName.CALENDAR: {
        tabId = TabsList.CALENDAR;
        break;
      }
      case TabName.TASK: {
        tabId = TabsList.TASK;
        break;
      }
      case TabName.MAIL: {
        tabId = TabsList.MAIL;
        break;
      }
      case TabName.ACTIVITY_HISTORY_INFORMATION: {
        tabId = TabsList.ACTIVITY_HISTORY_INFORMATION;
        break;
      }
      case TabName.NETWORK_BUSINESS_CARD: {
        tabId = TabsList.NETWORK_BUSINESS_CARD;
        break;
      }
    }

    const tabData = tabInfo.filter(item => item.tabId === tabId);

    if (tabData.length > 0) {
      tabName = StringUtils.getFieldLabel(tabData[0], "tabLabel", languageCode)
    }

    return tabName;
  }

  const displayBadge = (tabId: number) => {
    switch (tabId) {
      case TabsList.TRADING_PRODUCT: {
        return <View style={[CustomerDetailScreenStyles.badgeBlock]}>
          <Text style={CustomerDetailScreenStyles.badgeIcon}>{badges.tradingProduct > 99 ? "+99" : badges.tradingProduct}</Text>
        </View>
      }
      case TabsList.TASK: {
        return <View style={[CustomerDetailScreenStyles.badgeBlock]}>
          <Text style={CustomerDetailScreenStyles.badgeIcon}>{badges.task > 99 ? "+99" : badges.task}</Text>
        </View>
      }
      case TabsList.MAIL: {
        return <View style={[CustomerDetailScreenStyles.badgeBlock]}>
          <Text style={CustomerDetailScreenStyles.badgeIcon}>{badges.mail > 99 ? "+99" : badges.mail}</Text>
        </View>
      }
      case TabsList.CALENDAR: {
        return <View style={[CustomerDetailScreenStyles.badgeBlock]}>
          <Text style={CustomerDetailScreenStyles.badgeIcon}>{badges.calendar > 99 ? "+99" : badges.calendar}</Text>
        </View>
      }
      default:
        return null;
    }
  }

  return (
    <View style={CustomerDetailScreenStyles.titleTabsBlock}>
      <ScrollView horizontal={true} 
        showsHorizontalScrollIndicator={false}
      >
        {routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          return (<TouchableOpacity style={[
            CustomerDetailScreenStyles.titleTabContent,
            isFocused ? CustomerDetailScreenStyles.activeTab : null
            ]}
            onPress={() => handleActiveTab(isFocused, route)}
            key={route.key}
            >
            {/* <Text style={[CustomerDetailScreenStyles.textTab, isFocused ? CustomerDetailScreenStyles.textLink : null]}>{tabInfo[index].tabLabel}</Text> */}
            <Text style={[CustomerDetailScreenStyles.textTab,
              isFocused ? CustomerDetailScreenStyles.textLink : null]}>
                {showTabName(route.name)}
            </Text>
            {
              displayBadge(tabInfo[index].tabId)
            }
            {state.index-1 !== index && <Text style={CustomerDetailScreenStyles.divideTab}></Text>}
          </TouchableOpacity>);
          })}
      </ScrollView>
    </View>
  );
}


