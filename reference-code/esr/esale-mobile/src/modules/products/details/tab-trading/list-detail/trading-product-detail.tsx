import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styles } from "./trading-product-detail-styles";
import { messages } from "./trading-product-detail-messages";
import { translate } from "../../../../../config/i18n";
import NumberUtils from "../../../../../shared/util/number-utils";
import { AppbarCommon } from "../../../../../shared/components/appbar/appbar-common";
import { TEXT_EMPTY } from "../../../../../config/constants/constants";
import StringUtils from "../../../../../shared/util/string-utils";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../../login/authorization/authorization-selector";
import { ScreenName } from "../../../../../config/constants/screen-name";
/**
 * interface get data product screen
 */
interface Route {
  [route: string]: any;
}
/**
 * Component for show product general info
 * name, price, image, category
 * @param props
 */

const params = {
  productsTradingsId: 0,
  customerId: 0,
  customerName: null,
  employee: {employeeId: 0, employeeName: "", employeeSurname: ""},
  productId: 0,
  productName: null,
  productTradingProgressId: 1,
  progressName: null,
  endPlanDate: "",
  quantity: 1,
  price: 0,
  amount: 0,
  numeric1: 0,
  checkbox1: 0,
};

/**
 * Function tab tranding product detail
 */
export const TradingProductionDetail = () => {
  // get props
  const route: Route = useRoute();
  const navigator = useNavigation();
  const [data, setData] = useState(params);
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : TEXT_EMPTY;
  const navigation = useNavigation();
  // set title layout detail
  useLayoutEffect(() => {
    navigator.setOptions({
      title: route.params?.detail.productName
    });
  })
  // set props params
  useEffect(() => {
    if (route?.params) {
      setData(route.params?.detail);
    }
  }, []);
   /**
   * check undedined value
   * @param value 
   */
  const checkUndefined =(value:any)=>{
    return (value===undefined || value===null) ? TEXT_EMPTY : value;
  }

  return (
    <SafeAreaView style={styles.overview}>
     <AppbarCommon
      title={checkUndefined(data.productName)}
      leftIcon="back"
    />
    <View style={styles.label}>
        <Text style={styles.labelTitle}  numberOfLines={1}>{`${translate(messages.detailCustomerName)}`}</Text>
        <TouchableOpacity  onPress={() => {
              navigation.navigate(ScreenName.PRODUCT_DETAIL, {productId: data.productId})
            }}>
          <Text style={styles.labelTxtLink} numberOfLines={1}>{checkUndefined(data?.productName)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailCustomerName)}`}</Text>
        <TouchableOpacity onPress={() => {
          let paramCustomer = {
            customerId: data.customerId,
            customerName: data.customerName,
          };
          navigation.navigate("customer-detail", paramCustomer)
        }}>
          {/* todo detail product */}
          <Text style={styles.labelTxtLink} numberOfLines={1}>{checkUndefined(data?.customerName)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.personCharge)}`}</Text>
        <TouchableOpacity onPress={() => {
          navigation.navigate("detail-employee", {
            id: checkUndefined(data.employee.employeeId),
            title: `${checkUndefined(data?.employee?.employeeSurname)} ${checkUndefined(data?.employee?.employeeName) || ""}`,
          });
        }}>
          <Text style={styles.labelTxtLink} numberOfLines={1}>{checkUndefined(data?.employee?.employeeName)}</Text>
          {/* todo detail employee */}
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailProcess)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{StringUtils.getFieldLabel(data,"progressName",languageCode)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailCompletionDate)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{checkUndefined(data?.endPlanDate)}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>{`${translate(messages.detailmountPrice)}`}</Text>
        <Text style={styles.labelTxt} numberOfLines={1}>{`${NumberUtils.autoFormatNumber(`${checkUndefined(data?.amount)}`)}${translate(messages.currencyMoney)}`}</Text>
      </View>
    </SafeAreaView>
  );
};
