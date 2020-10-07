import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { translate } from "../../../../config/i18n";
import { messages } from "../product-set-details-messages";
import { productActions } from "../product-set-details-reducer";
import { productSetDetailTradingSelector } from "../product-set-details-selector";
import { ProductTradingList } from "./product-set-trading-list";
import { getJapanPrice } from "../../utils";
// import {
//   getProductDetailTrading /* ProductDetailTradingResponse */,
// } from "../../products-repository";
import { EnumTradingVersion } from "../../../../config/constants/enum";
import { DUMMY_TRADED_RESPONSE } from "./dummy";

/**
 * Component show product set trading tab screen
 * @param props
 */

export function ProductSetTradingTabScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      // const listProductDetailTrading = await getProductDetailTrading(
      //   params,
      //   {}
      // );
      // if (listProductDetailTrading) {
      // handleErrorGetProductDetail(listProductDetailTrading);
      // }
    };
    getData();
    dispatch(
      productActions.getproductDetailTrading(DUMMY_TRADED_RESPONSE?.data)
    );
  }, []);

  // Call this function when API work fine
  // const handleErrorGetProductDetail = (response: ProductDetailTradingResponse) => {
  //     switch (response.status) {
  //         case 400: {
  //             break;
  //         }
  //         case 500: {
  //             break;
  //         }
  //         case 403: {
  //             break;
  //         }
  //         case 200: {
  //             dispatch(productActions.getproductDetailTrading(response.data.data.productTradings.productTradings));
  //             break;
  //         }
  //         default: {
  //         }
  //     }
  // };

  const productSetDetailTrading: any = useSelector(
    productSetDetailTradingSelector
  );

  let totalProductTrading = productSetDetailTrading.reduce(
    (total: number, value: any) => {
      return (total += value.amount);
    },
    0
  );

  return (
    <ScrollView>
      <View style={ProductSetDetailsStyles.totalPrice}>
        <Text style={[ProductSetDetailsStyles.title]}>
          {`${translate(messages.total)} : ${getJapanPrice(
            totalProductTrading,
            false
          )}`}
        </Text>
      </View>
      {
        <ProductTradingList
          data={productSetDetailTrading}
          openCustomerDetail={false}
          version={EnumTradingVersion.DETAIL_TRADING_TAB}
        />
      }
    </ScrollView>
  );
}
