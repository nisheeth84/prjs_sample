import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { Icon } from "../../../../../shared/components/icon";
import { TradingProductItemData } from "../../customer-detail-repository";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../tabs/tab-trading-products/trading-product-messages";
import NumberUtils from "../../../../../shared/util/number-utils";
import { styles } from "../../tabs/tab-trading-products/trading-product-style";
import { TEXT_EMPTY } from "../../../../../config/constants/constants";

interface ProductItemProps {
  //data of trading product item
  data: TradingProductItemData;
  //screen navigation
  navigation: any
}

/**
 * Component for show trading product information item
 * @param ProductItemProps 
 */
export const TradingProductItem: React.FC<ProductItemProps> = ({
  data,
  navigation
}) => {

  /**
   * check undedined value
   * @param value 
   */
  const checkUndefined = (value: any) => {
    return (value === undefined || value === null) ? TEXT_EMPTY : value;
  }
  return (
    <TouchableOpacity onPress={() => navigation.navigate("trading-product-details-tab-info", { detail: data })}>
      <View style={styles.tradingItem}>
        <View style={styles.viewLeft}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[styles.txt, { flex: 10 }]} numberOfLines={1}>{checkUndefined(data?.customerName)}</Text>
            <Text style={[styles.txt, { flex: 3 }]} numberOfLines={1}>{`${checkUndefined(data?.progressName)}`}</Text>
          </View>
          <Text style={styles.txtProduct} numberOfLines={1}>{`${checkUndefined(data?.productName)}`}</Text>
          <Text style={[styles.txt]} numberOfLines={1}>{`${translate(messages.amount)} : ${translate(messages.currency)}${NumberUtils.autoFormatNumber(`${data?.price}`)}`}</Text>
          <Text style={[styles.txt]} numberOfLines={1}>{`${translate(messages.employeeName)} : ${checkUndefined(data?.employeeName)}`}</Text>
          <Text style={[styles.txt]} numberOfLines={1}>{`${translate(messages.completionDate)} : ${checkUndefined(data?.endPlanDate)}`}</Text>
        </View>
        <View style={styles.viewRight}>
          <Icon name="arrowRight" />
        </View>
      </View>
    </TouchableOpacity>
  )
}
