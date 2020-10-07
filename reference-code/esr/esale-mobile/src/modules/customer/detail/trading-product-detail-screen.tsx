import * as React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native"
import { TradingProductItemData } from "./customer-detail-repository";
import { styles } from "../detail/tabs/tab-trading-products/list-detail/trading-product-detail-styles"
import { translate } from "../../../config/i18n";
import { messages } from "../detail/tabs/tab-trading-products/list-detail/trading-product-detail-messages";
import NumberUtils from "../../../shared/util/number-utils";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { ScreenName } from "../../../config/constants/screen-name";

interface TradingProductDetailProps {
  //route of navigation
  route: any,
  navigation: any,
}

/**
 * Component for show trading product detail screen
 * @param TradingProductDetailProps 
 */
export const TradingProductDetailScreen: React.FC<TradingProductDetailProps> = (
  {
    route,
    navigation
  }
) => {
  const data: TradingProductItemData = route.params.data;
  /**
   * check undedined value
   * @param value 
   */
  const checkUndefined = (value: any) => {
    return (value === undefined || value === null) ? TEXT_EMPTY : value;
  }
  
  return (
    <SafeAreaView style={styles.overview}>
     <AppbarCommon
      title={checkUndefined(data?.productName)}
      leftIcon="back"
    />
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailCustomerName)}`}</Text>
        <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.PRODUCT_DETAIL, {productId: data?.productId})
            }}>
          {/* todo detail product */}
          <Text style={styles.labelTxtLink} numberOfLines={1}>{checkUndefined(data?.customerName)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailmountPrice)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{`${NumberUtils.autoFormatNumber(`${checkUndefined(data?.amount)}`)}${translate(messages.currencyMoney)}`}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailProcess)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{checkUndefined(data?.progressName)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.personCharge)}`}</Text>
        <TouchableOpacity  onPress={() => {
          navigation.navigate("detail-employee", {
            id: checkUndefined(data?.employeeId),
          });
        }}>
          <Text style={styles.labelTxtLink} numberOfLines={1}>{checkUndefined(data?.employeeName)}</Text>
          {/* todo detail employee */}
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailCompletionDate)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{checkUndefined(data?.endPlanDate)}</Text>
      </View>
    </SafeAreaView>
  )
}