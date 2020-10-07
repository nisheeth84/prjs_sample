import * as React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "../../../../shared/components/icon";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { useNavigation } from "@react-navigation/native";

import { translate } from "../../../../config/i18n";
import { messages } from "../product-set-details-messages";
import { ScreenName } from "../../../../config/constants/screen-name";
import { getJapanPrice } from "../../utils";
import { CommonStyles } from "../../../../shared/common-style";
import { EnumTradingVersion } from "../../../../config/constants/enum";

interface ProductSetTradingItemProps {
  //customer's name
  customerName: string;
  //customer's id
  customerId: number;
  //endPlanDate
  endPlanDate: string;
  //progress's name
  progressName: string;
  //amount
  amount: number;
  // is allow open customer detail
  openCustomerDetail: boolean;
  // use in tab general infomation or use in tab trading
  version: number;
  // product's name
  productName: string;
  // product 's id
  productId: number;
  // employee's name
  employeeName: string;
  // employee's id
  employeeId: number;
}

/**
 * Component show product set trading item
 * @param props
 */

export const ProductSetTradingItem: React.FC<ProductSetTradingItemProps> = ({
  customerName,
  customerId,
  endPlanDate,
  progressName,
  amount,
  openCustomerDetail = false,
  version = EnumTradingVersion.DETAIL_GENERAL_INFO,
  productName,
  productId,
  employeeName,
  employeeId,
}) => {
  const navigation = useNavigation();

  /*
   * Navigate to Product Details Screen
   */
  const onClickItem = () => {
    navigation.navigate(ScreenName.PRODUCT_SET_TRADING_DETAIL, {
      customerName,
      customerId,
      endPlanDate,
      progressName,
      amount,
      productName,
      productId,
      employeeName,
      employeeId,
    });
  };

  /*
   * Navigate to Customer Details Screen
   */
  const onClickCustomerName = () => {
    navigation.navigate(ScreenName.CUSTOMER_DETAIL);
  };

  return (
    <TouchableOpacity
      style={ProductSetDetailsStyles.inforProduct}
      onPress={onClickItem}
    >
      <View style={ProductSetDetailsStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <View style={CommonStyles.rowSpaceBetween}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (openCustomerDetail) {
                  onClickCustomerName();
                } else {
                  onClickItem();
                }
              }}
            >
              <Text style={[ProductSetDetailsStyles.bold]}>{customerName}</Text>
            </TouchableWithoutFeedback>
            {version == EnumTradingVersion.DETAIL_TRADING_TAB && (
              <Text
                style={[ProductSetDetailsStyles.gray]}
              >{`${progressName}`}</Text>
            )}
          </View>
          <Text style={[ProductSetDetailsStyles.gray]}>{`${translate(
            messages.plannedCompletionDate
          )} : ${endPlanDate}`}</Text>
          {version == EnumTradingVersion.DETAIL_GENERAL_INFO && (
            <Text style={[ProductSetDetailsStyles.gray]}>{`${translate(
              messages.progress
            )} : ${progressName}`}</Text>
          )}
          <Text style={[ProductSetDetailsStyles.gray]}>{`${translate(
            messages.total
          )} : ${getJapanPrice(amount, false, true)}`}</Text>
        </View>
        <View style={[ProductSetDetailsStyles.iconArrowRight]}>
          <Icon name="arrowRight" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
