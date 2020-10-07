import React from "react";
import { useSelector } from "react-redux";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { messages } from "./products-manage-messages";
import { translate } from "../../config/i18n";
import { ProductDetailStyle } from "./styles";
import { AppBarMenu } from "../../shared/components/appbar/appbar-menu";
import { ScreenName } from "../../config/constants/screen-name";
import { formatLabel, formatDate, getJapanPrice } from "../../shared/util/app-utils";
import { AuthorizationState } from "../login/authorization/authorization-reducer";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../config/constants/constants";
/**
 * product trading detail screen
 */
export const ProductDetail = () => {
  const route = useRoute<any>();
  const authState: AuthorizationState = useSelector(authorizationSelector);
  const navigation = useNavigation();
  const data = route.params?.data;

  /**
   * data common item product
   * @param title
   * @param value
   * @param isLink
   */
  const itemDetail = (title: string, value: string, isLink: boolean, onPress: Function = () => { }) => {
    return (
      <View style={ProductDetailStyle.itemStyle}>
        <Text style={ProductDetailStyle.txtTitle}>{title}</Text>
        {isLink ? (
          <TouchableOpacity
            onPress={() =>
              onPress()
            }
          >
            <Text
              style={[
                ProductDetailStyle.txtValueBlue,
                ProductDetailStyle.txtValue,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ) : (
            <Text
              style={[
                ProductDetailStyle.txtValueGray,
                ProductDetailStyle.txtValue,
              ]}
            >
              {value}
            </Text>
          )}
      </View>
    );
  };

  return (
    <>
      <AppBarMenu
        name={translate(messages.tradingProduct)}
        hasBackButton={true}
        nameService={"productTrading"}
      />
      <ScrollView style={ProductDetailStyle.flex1}>
        {itemDetail(
          translate(messages.productsManageCustomerName),
          data?.customerName || TEXT_EMPTY,
          true,
          () => {
            if (data?.customerId) {
              navigation.navigate(ScreenName.CUSTOMER_DETAIL, data?.customerId)
            }
          }
        )}
        {itemDetail(
          translate(messages.productsManageAmount),
          `${getJapanPrice(data?.amount || 0, false)}`,
          false
        )}
        {itemDetail(
          translate(messages.productDetailProgress),
          formatLabel(data?.progressName, authState.languageCode),
          false
        )}
        {itemDetail(
          translate(messages.productsManageResponsible),
          data?.employee?.employeeName || TEXT_EMPTY,
          true,
          () => {
            navigation.navigate(ScreenName.EMPLOYEE_DETAIL, data?.employee?.employeeId)
          }
        )}
        {itemDetail(
          translate(messages.productsManageCompletionDate),
          formatDate(data?.endPlanDate, authState.formatDate),
          false
        )}
      </ScrollView>
    </>
  );
};
