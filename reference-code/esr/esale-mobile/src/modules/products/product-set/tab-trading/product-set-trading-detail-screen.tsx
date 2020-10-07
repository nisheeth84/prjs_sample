import * as React from "react";
import { View } from "react-native";
import { ProductSetDetailsStyles } from "../product-set-details-style";

import { translate } from "../../../../config/i18n";
import { messages } from "../product-set-details-messages";
import { AppBarProducts } from "../../../../shared/components/appbar/appbar-products";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductSetGeneralInfoItem } from "../tab-general-info/product-set-general-info-item";
import { theme } from "../../../../config/constants";
import { getJapanPrice } from "../../utils";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ProductTradingDetailScreenRouteProp } from "../../../../config/constants/root-stack-param-list";
import { CommonStyles } from "../../../../shared/common-style";
import { ScreenName } from "../../../../config/constants/screen-name";
import { TouchableOpacity } from "react-native-gesture-handler";

/**
 * Component show product set trading details
 * @param props
 */

export const ProductSetTradingDetailScreen: React.FC<any> = () => {
  const route = useRoute<ProductTradingDetailScreenRouteProp>();
  const customerName = route.params?.customerName;
  const customerId = route.params?.customerId;
  const endPlanDate = route.params?.endPlanDate;
  const progressName = route.params?.progressName;
  const amount = route.params?.amount;
  const productName = route.params?.productName;
  const productId = route.params?.productId;
  const employeeName = route.params?.employeeName;
  const employeeId = route.params?.employeeId;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={ProductSetDetailsStyles.container}>
      <AppBarProducts
        name={translate(messages.tradingProduct)}
        hasBackButton={true}
      />
      <View>
        <View style={ProductSetDetailsStyles.rowCenter}>
          <View style={[CommonStyles.flex1]}>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.PRODUCT_DETAIL, { productId })
            }}>
              <ProductSetGeneralInfoItem
                label={translate(messages.productNameTradingDetail)}
                value={productName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.CUSTOMER_DETAIL, { customerId })
            }}>
              <ProductSetGeneralInfoItem
                label={translate(messages.customerName)}
                value={customerName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { employeeId })
            }}>
              <ProductSetGeneralInfoItem
                label={translate(messages.personInChange)}
                value={employeeName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <ProductSetGeneralInfoItem
              label={translate(messages.progress)}
              value={progressName}
              colorValue={theme.colors.gray1}
            />
            <ProductSetGeneralInfoItem
              label={translate(messages.plannedCompletionDate)}
              value={endPlanDate}
              colorValue={theme.colors.gray1}
            />
            <ProductSetGeneralInfoItem
              label={translate(messages.amount)}
              value={getJapanPrice(amount, false)}
              colorValue={theme.colors.gray1}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
