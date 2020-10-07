import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "./trading-product-detail-styles";
import { messages } from "../trading-products-messages";
import { translate } from "../../../../../config/i18n";
import { AppBarMenu } from "../../../../../shared/components/appbar/appbar-menu";
import { ListEmptyComponent } from "../../../../../shared/components/list-empty/list-empty";

interface ProductItemProps {
  data: any;
}

/**
 * Component for show product general info
 * name, price, image, category
 * @param props
 */

const params = {
  productsTradingsId: 0,
  customerId: 0,
  customerName: "",
  employeeId: 0,
  employeeName: "",
  productId: 0,
  productName: "",
  productTradingProgressId: 1,
  progressName: "",
  estimatedCompletionDate: "0",
  quantity: 1,
  price: 0,
  amount: 0,
  numeric1: 0,
  checkbox1: 0,
};

export const TradingProductionDetail: React.FC<ProductItemProps> = () => {
  const route = useRoute();
  const [data, setData] = React.useState<any>(params);
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params) {
      setData(route.params.data);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <AppBarMenu
        name={translate(messages.tradingDetailTitle)}
        hasBackButton
        hideSearch
      />
      {!data ? (
        <ListEmptyComponent />
      ) : (
          <>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.tradingProducts)}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("employee-detail")}
              >
                <Text style={styles.labelTxtLink}>{data.productName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.customerName)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxtLink}>{data.customerName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.contactPerson)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxtLink}>名刺A</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.personCharge)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxtLink}>{data.employeeName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.progress)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxt}>{data.progressName}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.completionDate)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxt}>
                  {data.estimatedCompletionDate}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.label}>
              <Text style={styles.labelTitle}>
                {translate(messages.amountMoney)}
              </Text>
              <TouchableOpacity>
                <Text style={styles.labelTxt}>
                  {`${data.price
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}円`}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
    </SafeAreaView>
  );
};
