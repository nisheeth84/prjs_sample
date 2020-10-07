import React, { useState } from "react"
import { View, ScrollView } from "react-native"
import { Style } from "../../common"
import { ProductTrading } from "../activity-list-reducer"
import { AppBarBack } from "../../app-bar-back"
import { messages } from "../activity-list-messages"
import { translate } from "../../../../config/i18n"
import { ProductTradingItem } from "./product-trading-item"
export const ProductTradingListScreen = (
  { route }: any
) => {
  const [productTradings] = useState<ProductTrading[]>(route?.params?.productTradings)
  return (
    <View style={Style.body}>
      {/** Header productTradingList */}
      <AppBarBack title={translate(messages.productTradingListLabel)}></AppBarBack>
      {/** Body productTradingList */}
      <ScrollView>
        {
          productTradings.length > 0 &&
          productTradings?.map((item: ProductTrading) => {
            return (
              <View key={item.productTradingId}>
                <ProductTradingItem
                  productTrading = {item}
                ></ProductTradingItem>
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}