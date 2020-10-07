import * as React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "../../../../shared/components/icon";
import { ProductDetailsStyles } from "../product-details-style";
import { useNavigation } from "@react-navigation/native";

import { translate } from "../../../../config/i18n";
import { messages } from "../product-details-messages";
import { ScreenName } from "../../../../config/constants/screen-name";
import { getJapanPrice } from "../../utils";
import { CommonStyles } from "../../../../shared/common-style";
import { EnumTradingVersion } from "../../../../config/constants/enum";

interface ProductItemProps {
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
 * Component show product trading item
 * @param props
 */

export const ProductTradingItem: React.FC<ProductItemProps> = ({
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
    navigation.navigate(ScreenName.PRODUCT_TRADING_DETAIL, {
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
      style={ProductDetailsStyles.inforProduct}
      onPress={onClickItem}
    >
      <View style={ProductDetailsStyles.rowCenter}>
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
              <Text style={[ProductDetailsStyles.bold]}>{customerName}</Text>
            </TouchableWithoutFeedback>
            {version == EnumTradingVersion.DETAIL_TRADING_TAB && (
              <Text
                style={[ProductDetailsStyles.gray]}
              >{`${progressName}`}</Text>
            )}
          </View>
          <Text style={[ProductDetailsStyles.gray]}>{`${translate(
            messages.plannedCompletionDate
          )} : ${endPlanDate}`}</Text>
          {version == EnumTradingVersion.DETAIL_GENERAL_INFO && (
            <Text style={[ProductDetailsStyles.gray]}>{`${translate(
              messages.progress
            )} : ${progressName}`}</Text>
          )}
          <Text style={[ProductDetailsStyles.gray]}>{`${translate(
            messages.total
          )} : ${getJapanPrice(amount, false, true)}`}</Text>
        </View>
        <View style={[ProductDetailsStyles.iconArrowRight]}>
          <Icon name="arrowRight" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
