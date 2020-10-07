import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { CustomDetailScreen } from '../customer-detail-screen';
import { ContactHistoryInfoDetailScreen } from '../contact-history-info-detail-screen';
import { TradingProductDetailScreen } from '../trading-product-detail-screen';
import { translate } from "../../../../config/i18n";
import { messages } from "../customer-detail-messages";
import { BasicDetailBusinessCardScreen } from "../tabs/network-business-card/basic-detail-business-card-screen";
import { DeletedPositionDetailScreen } from "../tabs/network-business-card/deleted-position-detail-screen";
import { TradingProductionDetail } from "../tabs/tab-trading-products/list-detail/trading-product-detail";
//import { Test } from "../../../../shared/components/message/test";

const Stack = createStackNavigator();

export function CustomerDetailNavigator() {
  return (

    <Stack.Navigator>
            {/* <Stack.Screen 
        name="test"
        component={Test} 
      /> */}
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
        name="trading-product-detail"
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
    </Stack.Navigator>
  );
}
