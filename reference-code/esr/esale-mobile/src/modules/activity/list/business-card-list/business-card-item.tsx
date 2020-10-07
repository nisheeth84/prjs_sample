import React from "react"
import { BusinessCard } from "../activity-list-reducer"
import { View, Image, Text } from "react-native"
import { SPACE_HALF_SIZE, TEXT_EMPTY } from "../../../../config/constants/constants"
import ActivityListStyle from "../activity-list-style"
import StringUtils from "../../../../shared/util/string-utils"
import { useSelector } from "react-redux"
import { authorizationSelector } from "../../../login/authorization/authorization-selector"
import { checkEmptyString } from "../../../../shared/util/app-utils"
import { appImages } from "../../../../config/constants"
export interface BusinessCardProps {
  businessCard: BusinessCard
}
export const BusinessCardItem: React.FC<BusinessCardProps> = ({
  businessCard
}) => {
  /**
  * languageCode
  */
 const authorizationState = useSelector(authorizationSelector);
 const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;
  return (
    <View style={ActivityListStyle.formatItem}>
      <View style={[ActivityListStyle.ShoppingTop]}>
        <View style={ActivityListStyle.ShoppingImage}>
          <Image
            style={ActivityListStyle.image}
            source={
              !checkEmptyString(businessCard?.businessCardImagePath)
                ? {
                    uri: businessCard?.businessCardImagePath,
                  }
                : appImages.iconNoImage
            }
          />
        </View>
        <View style={ActivityListStyle.ShoppingInfo}>
          <Text style={{}}>{businessCard?.customerName}{SPACE_HALF_SIZE}{businessCard?.position}</Text>
          <Text style={{fontWeight: "bold",}}>{businessCard?.firstName}{SPACE_HALF_SIZE}{businessCard?.lastName}{SPACE_HALF_SIZE}
            {StringUtils.getFieldLabel(businessCard, "departmentName", languageCode)}</Text>
        </View>
      </View>
    </View>
  )
}