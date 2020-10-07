import * as React from "react";
import { View } from "react-native";
import { ProductDetailsStyles } from "../product-details-style";

import { translate } from "../../../../config/i18n";
import { messages } from "../product-details-messages";
import { AppBarProducts } from "../../../../shared/components/appbar/appbar-products";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductGeneralInfoItem } from "../tab-general-info/product-general-info-item";
import { theme } from "../../../../config/constants";
import { getJapanPrice } from "../../utils";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ProductTradingDetailScreenRouteProp } from "../../../../config/constants/root-stack-param-list";
import { CommonStyles } from "../../../../shared/common-style";
import { ScreenName } from "../../../../config/constants/screen-name";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ProductTradingDetailProps {
  // customer's name
  customerName: string;
  // end plan date
  endPlanDate: string;
  // progress's name
  progressName: string;
  // amount
  amount: number;
}

/**
 * Component show product trading details
 * @param props
 */

export const ProductTradingDetailScreen: React.FC<ProductTradingDetailProps> = () => {
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
    <SafeAreaView style={ProductDetailsStyles.container}>
      <AppBarProducts
        name={translate(messages.tradingProduct)}
        hasBackButton={true}
      />
      <View>
        <View style={ProductDetailsStyles.rowCenter}>
          <View style={[CommonStyles.flex1]}>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.PRODUCT_DETAIL, { productId })
            }}>
              <ProductGeneralInfoItem
                label={translate(messages.productName)}
                value={productName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.CUSTOMER_DETAIL, { customerId })
            }}>
              <ProductGeneralInfoItem
                label={translate(messages.customerName)}
                value={customerName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { employeeId })
            }}>
              <ProductGeneralInfoItem
                label={translate(messages.personInChange)}
                value={employeeName}
                colorValue={theme.colors.blue200}
              />
            </TouchableOpacity>
            <ProductGeneralInfoItem
              label={translate(messages.progress)}
              value={progressName}
              colorValue={theme.colors.gray1}
            />
            <ProductGeneralInfoItem
              label={translate(messages.plannedCompletionDate)}
              value={endPlanDate}
              colorValue={theme.colors.gray1}
            />
            <ProductGeneralInfoItem
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
