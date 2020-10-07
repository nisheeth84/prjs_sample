import React, { } from "react";
import { View, TouchableOpacity, Text} from "react-native"
import { ActivityHistoryInformationStyles } from "../../tabs/activity-history-information/activity-history-information-style";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../tabs/activity-history-information/activity-history-information-messages";
import { ProductTrading } from "../../tabs/activity-history-information/activity-history-information-repository";
import { useNavigation } from "@react-navigation/native";
import { CommonUtil } from "../../tabs/activity-history-information/common-util-activity-history-information";
import { StackScreen } from "../../tabs/activity-history-information/enum-activity-history-information";
import { TEXT_EMPTY, SPACE } from "../../../../../config/constants/constants";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../../login/authorization/authorization-selector";
import StringUtils from "../../../../../shared/util/string-utils";
import { DefaultAvatar } from "../../tabs/activity-history-information/avatar";

/**
* interface use for ActivityHistoryInformationItemProductTrading
* @param productItem data of an ProductTrading
*/
interface ProductItemProps {
  product: ProductTrading
}

/**
 * Component for ProductItem
 * @param productItem data of an productItem
*/

export const ActivityHistoryInformationItemProductTrading: React.FC<ProductItemProps> = (
  productItem,
) => {
  const navigation = useNavigation()
  /**
  * languageCode
  */
 const authorizationState = useSelector(authorizationSelector)
 const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY
  /**
   * Go to employee detail screen
   * @param employeeId Id of employee
  */
  const goToEmployeeDetailScreen = (employee: any) => {
    navigation.navigate(StackScreen.EMPLOYEE_DETAIL, {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    });
  }

  return (
    <View style={ActivityHistoryInformationStyles.product}>

      <View style={ActivityHistoryInformationStyles.titleProduct}>
        <Text style={ActivityHistoryInformationStyles.fontBold}>{productItem?.product?.productName}</Text>
        <Text style={ActivityHistoryInformationStyles.fontSize12}>
        {productItem?.product?.progressName ? "(" + StringUtils.getFieldLabel(productItem?.product, "progressName", languageCode) + ")" : TEXT_EMPTY}
        </Text>
      </View>
      <View style={ActivityHistoryInformationStyles.contentProduct}>
        <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
          <Text style={ActivityHistoryInformationStyles.fontBold}>{`${translate(messages.orderPlanDate)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{CommonUtil.formatDateTime(productItem?.product?.orderPlanDate)}</Text>
          <Text style={ActivityHistoryInformationStyles.labelIem}>{`${translate(messages.endPlanDate)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{CommonUtil.formatDateTime(productItem?.product?.endPlanDate)}</Text>
        </View>

        <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
          <Text style={ActivityHistoryInformationStyles.fontBold}>{`${translate(messages.price)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{CommonUtil.formatNumber(productItem?.product?.price)}</Text>
          <Text style={ActivityHistoryInformationStyles.labelIem}>{`${translate(messages.quantity)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{productItem?.product?.quantity}</Text>
          <Text style={ActivityHistoryInformationStyles.labelIem}>{`${translate(messages.amount)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{CommonUtil.formatNumber(productItem?.product?.amount)}</Text>
        </View>

        <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
          <Text style={[ActivityHistoryInformationStyles.fontBold, {paddingTop: 5}]}>{`${translate(messages.personInCharge)}`} : </Text>
          <DefaultAvatar imgPath={productItem?.product?.employee?.employeePhoto?.filePath} userName={productItem?.product?.employee?.employeeName} type={2} /> 
          <TouchableOpacity onPress={() => goToEmployeeDetailScreen(productItem?.product?.employee)} >
            <Text style={[ActivityHistoryInformationStyles.colorActive, ActivityHistoryInformationStyles.fontBold, {paddingTop: 5}]}>
            {SPACE}{!productItem?.product?.employee?.employeeSurname ? productItem?.product?.employee?.employeeName : `${productItem?.product?.employee?.employeeSurname} ${productItem?.product?.employee?.employeeName}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
          <Text style={ActivityHistoryInformationStyles.fontBold}>{`${translate(messages.memo)}`} : </Text>
          <Text style={ActivityHistoryInformationStyles.fontSize12}>{productItem?.product?.memo}</Text>
        </View>

      </View>
    </View>
  )
}