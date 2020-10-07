import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSwipe } from "./trading-product-swipe-stype";

// case of customer display
export const ShowActionTradingProduct= {
    CustomerRegistration: 1,
    ActivityHistory: 2,
    ActivityRegistration: 3,
    ScheduleRegistration: 4,
}

interface TradingProduct {
  // name of CustomerDetail
  name: string;
  // index of CustomerDetail
  index: number;
}

/**
 * Component for show case list of customer list item 
 * @param EmployeeButton
*/

export const ProductTradingActionButton =({
  name,
  index,
}:TradingProduct) => {
  /**
   * action handle ItemCustomer
   * @param indexItem item of CustomerDetailProps
  */
  const actionItemEmployee = (indexItem: number) => () => {
    switch (indexItem) {
      case ShowActionTradingProduct.CustomerRegistration:
        alert('CustomerRegistration');
        // navigation.navigate('');
        break;
      case ShowActionTradingProduct.ActivityHistory:
        // navigation.navigate('');
        alert('ActivityHistory');
        break;
      case ShowActionTradingProduct.ActivityRegistration:
        // navigation.navigate('');
        alert('ActivityRegistration');
        break;
      case ShowActionTradingProduct.ScheduleRegistration:
        // navigation.navigate('');
        alert('ScheduleRegistration');
        break;
      default:
        break;
    }

  }

  return (
    <View>
      <TouchableOpacity style={(StyleSwipe.inforBusinessCardActionSecond)} onPress={actionItemEmployee(index)}>
        <Text style={StyleSwipe.inforBusinessCardDetail}>{name}</Text>
      </TouchableOpacity>

    </View>

  );
}