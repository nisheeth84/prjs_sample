import { View, Text } from "react-native"
import ActivityListStyle from "./activity-list-style"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ProductTrading } from "./activity-list-reducer"
import * as React from "react"
import { translate } from "../../../config/i18n"
import { messages } from "./activity-list-messages"
import { useNavigation } from "@react-navigation/native"
import { CommonUtil } from "../common/common-util"
import { TEXT_EMPTY, SPACE_HALF_SIZE } from "../../../config/constants/constants"
import { authorizationSelector } from "../../login/authorization/authorization-selector"
import { useSelector } from "react-redux"
import StringUtils from "../../../shared/util/string-utils"
import { DefaultAvatar } from "../common/avatar"


interface ProductItemProps {
  product: ProductTrading
}
export const ProductItem : React.FC<ProductItemProps> = (
  productItem,
) => {
  const navigation = useNavigation()
  
  /**
  * languageCode
  */
  const authorizationState = useSelector(authorizationSelector)
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY
  const formatDate = authorizationState?.formatDate ?? TEXT_EMPTY

  /**
   * Go to employee detail screen
   * @param employeeId Id of employee
   */
  const goToEmployeeDetailScreen = (employee: any) => {
    navigation.navigate("detail-employee", {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    });
  }
  return (
    <View style={ActivityListStyle.product}>
      <View style={ActivityListStyle.titleProduct}>
        <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{productItem?.product?.productName}</Text>
        <Text style={ActivityListStyle.fontSize12}>{productItem?.product?.progressName ? "(" + StringUtils.getFieldLabel(productItem?.product, "progressName", languageCode) + ")" : TEXT_EMPTY}</Text>
      </View>
      <View style={ActivityListStyle.contentProduct}>
        <View style={[ActivityListStyle.flexContent, ActivityListStyle.pdBottom]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.orderPlanDate)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{CommonUtil.formatDateTime(productItem?.product?.orderPlanDate, formatDate.toUpperCase())}</Text>
          <Text style={[ActivityListStyle.labelIem, ActivityListStyle.colorBold]}>{`${translate(messages.endPlanDate)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{CommonUtil.formatDateTime(productItem?.product?.endPlanDate, formatDate.toUpperCase())}</Text>
        </View>
        <View style={[ActivityListStyle.flexContent, ActivityListStyle.pdBottom]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.price)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{CommonUtil.formatNumber(productItem?.product?.price)}</Text>
          <Text style={[ActivityListStyle.labelIem, ActivityListStyle.colorBold]}>{`${translate(messages.quantity)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{productItem?.product?.quantity}</Text>
          <Text style={[ActivityListStyle.labelIem, ActivityListStyle.colorBold]}>{`${translate(messages.amount)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{CommonUtil.formatNumber(productItem?.product?.amount)}</Text>
        </View>
        <View style={[ActivityListStyle.flexContent, ActivityListStyle.pdBottom]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.personInCharge)}`} : </Text>
          <DefaultAvatar
            imgPath={productItem?.product?.employee?.employeePhoto?.fileUrl}
            userName={productItem?.product?.employee?.employeeSurname}
            style={ActivityListStyle.sizeImageSmall}
          /> 
          <TouchableOpacity onPress={() => goToEmployeeDetailScreen(productItem?.product?.employee)} >
            <Text style={[ActivityListStyle.colorActive, ActivityListStyle.fontBold]}>
            {SPACE_HALF_SIZE}{!productItem?.product?.employee?.employeeSurname ? productItem?.product?.employee?.employeeName : `${productItem?.product?.employee?.employeeSurname} ${productItem?.product?.employee?.employeeName}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[ActivityListStyle.flexContent, ActivityListStyle.pdBottom]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.memo)}`} : </Text>
          <Text style={ActivityListStyle.fontSize12}>{productItem?.product?.memo}</Text>
        </View>
      </View>
    </View>
  )
}