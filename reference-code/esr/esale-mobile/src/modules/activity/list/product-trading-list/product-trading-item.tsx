import React from "react"
import { ProductTrading } from "../activity-list-reducer"
import { View, Image, Text } from "react-native"
import { SPACE_HALF_SIZE, TEXT_EMPTY, TEXT_SPACE } from "../../../../config/constants/constants"
import ActivityListStyle from "../activity-list-style"
import StringUtils from "../../../../shared/util/string-utils"
import { useSelector } from "react-redux"
import { authorizationSelector } from "../../../login/authorization/authorization-selector"
import { checkEmptyString } from "../../../../shared/util/app-utils"
import { appImages } from "../../../../config/constants"
import { DefaultAvatar } from "../../common/avatar"
export interface ProductTradingProps {
  productTrading: ProductTrading
}
export const ProductTradingItem: React.FC<ProductTradingProps> = ({
  productTrading
}) => {
  /**
  * languageCode
  */
 const authorizationState = useSelector(authorizationSelector)
 const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY
  return (
    <View style={ActivityListStyle.formatItem}>
      <View style={[ActivityListStyle.ShoppingTop]}>
        <View style={ActivityListStyle.ShoppingImage}>
          <Image
            style={ActivityListStyle.image}
            source={
              !checkEmptyString(productTrading?.productImagePath)
                ? {
                    uri: productTrading?.productImagePath,
                  }
                : appImages.iconNoImage
            }
          />
        </View>
        <View style={ActivityListStyle.ShoppingInfo}>
          <Text style={{}}>{productTrading?.customerName}</Text>
          <Text style={ActivityListStyle.fontBold}>{productTrading?.productName}{SPACE_HALF_SIZE}{StringUtils.getFieldLabel(productTrading, "progressName", languageCode)}</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <DefaultAvatar
            imgPath={productTrading?.employee?.employeePhoto?.fileUrl}
            userName={productTrading?.employee?.employeeSurname}
            style={ActivityListStyle.sizeImageSmall}
            />
            <Text>{TEXT_SPACE}</Text>
            <Text style={{}}>{productTrading?.employee?.employeeSurname}</Text>
            <Text>{SPACE_HALF_SIZE}{productTrading?.employee?.employeeName}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}