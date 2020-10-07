import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ProductDetailsStyles } from "../product-details-style";
import { translate } from "../../../../config/i18n";
import { messages } from "../product-details-messages";
import { productActions } from "../product-details-reducer";
import { productDetailTradingSelector } from "../product-details-selector";
import { ProductTradingList } from "./product-trading-list";
import { getJapanPrice } from "../../utils";
import {
  getProductDetailTrading,
  ProductDetailTradingResponse,
} from "../../products-repository";
import { queryProductDetailTrading } from "../../product-query";
import { EnumTradingVersion } from "../../../../config/constants/enum";

const DUMMY_TRADED_RESPONSE = {
  data: [
    {
      productTradingId: 1,
      customerName: "顧客A",
      endPlanDate: "2019/10/10",
      progressName: "アプローチ",
      amount: 50000,
      employeeName: "従業員名A",
      productName: "商品名A",
    },
    {
      productTradingId: 2,
      customerName: "顧客B",
      endPlanDate: "2019/10/10",
      progressName: "アプローチ",
      amount: 51000,
      employeeName: "従業員名A",
      productName: "商品名A",
    },
  ],
};

/**
 * Component show product trading tab screen
 */

export function ProductTradingTabScreen() {
  const dispatch = useDispatch();

  const productDetailTrading: any = useSelector(productDetailTradingSelector);

  useEffect(() => {
    const getData = async () => {

      // const listProductDetailTrading = await getProductDetailTrading(
      //   params,
      //   {}
      // );
      // if (listProductDetailTrading) {
      //   handleErrorGetProductDetail(listProductDetailTrading);
      // }
    };
    getData();
    dispatch(
      productActions.getproductDetailTrading(DUMMY_TRADED_RESPONSE?.data)
    );
  }, []);

  let totalProductTrading = productDetailTrading.reduce(
    (total: number, value: any) => {
      return (total += value.amount);
    },
    0
  );

  // Call this function when API work fine
  // const handleErrorGetProductDetail = (
  //   response: ProductDetailTradingResponse
  // ) => {
  //   switch (response.status) {
  //     case 400: {
  //       break;
  //     }
  //     case 500: {
  //       break;
  //     }
  //     case 403: {
  //       break;
  //     }
  //     case 200: {
  //       dispatch(
  //         productActions.getproductDetailTrading(
  //           response.data.data.productTradings.productTradings
  //         )
  //       );
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  // };

  return (
    <ScrollView>
      <View style={ProductDetailsStyles.totalPrice}>
        <Text style={[ProductDetailsStyles.title]}>
          {`${translate(messages.total)} : ${getJapanPrice(
            totalProductTrading,
            false
          )}`}
        </Text>
      </View>
      {
        <ProductTradingList
          data={productDetailTrading}
          openCustomerDetail={false}
          version={EnumTradingVersion.DETAIL_TRADING_TAB}
        />
      }
    </ScrollView>
  );
}
