import React, { useState } from "react"
import { View } from "react-native"
import { Style } from "../../common"
import { BusinessCard } from "../activity-list-reducer"
import { BusinessCardItem } from "./business-card-item"
import { AppBarBack } from "../../app-bar-back"
import { messages } from "../activity-list-messages"
import { translate } from "../../../../config/i18n"
export const BusinessCardListScreen = (
  { route }: any
) => {
  const [businessCards] = useState<BusinessCard[]>(route?.params?.businessCards)
  return (
    <View style={Style.body}>
      {/** Header BusinessCardList */}
      <AppBarBack title={translate(messages.businessCardListLabel)}></AppBarBack>
      {/** Body BusinessCardList */}
      { businessCards?.length > 0 &&
         businessCards?.map((item: BusinessCard, index: number) => {
          return (
            <View>
              <BusinessCardItem
                key={index}
                businessCard = {item}
              />
            </View>
          )
        })}
    </View>
  )
}