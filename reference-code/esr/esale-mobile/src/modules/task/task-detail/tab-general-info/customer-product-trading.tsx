import * as React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../../config/constants";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY, LEFT_SLASH, COMMA_SPACE } from "../../../../config/constants/constants";
import { ScreenName } from "../../../../config/constants/screen-name";

interface ViewProps {
  //Label
  label: string,
  //Color of Value text
  colorValue: string,
  // customer id
  customerId: number,
  // customer name
  customerName?: string,
  //List value
  productTradings: Array<any>,
}

/**
 * Component show 
 * @param props 
 */

export const CustomerProductTrading: React.FC<ViewProps> = ({
  label,
  colorValue,
  customerId,
  productTradings = [],
}) => {

  const navigation = useNavigation();

  /*
  * Navigate to Customer Detail Screen
  */
  const openCustomerDetail = (id: number) => {
    navigation.navigate(ScreenName.CUSTOMER_DETAIL, { customerId: id });
  }

  return (
    <View
      style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[TaskDetailStyles.bold]}>{checkEmptyString(label) ? TEXT_EMPTY : label}</Text>
          <View style={TaskDetailStyles.row}>
            <TouchableWithoutFeedback onPress={() => {
              openCustomerDetail(customerId);
            }}>
              <Text style={[CommonStyles.flex1, TaskDetailStyles.gray, { color: colorValue }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {(productTradings || []).length > 0 ? LEFT_SLASH : TEXT_EMPTY}
                {
                  (productTradings || []).map((item: any, index: number) => {
                    return (
                      <Text key={item?.productId?.toString()}>
                        {checkEmptyString(item.productName)
                          ? TEXT_EMPTY
                          : (index == productTradings.length - 1
                            ? item.productName
                            : item.productName + COMMA_SPACE)}</Text>
                    );
                  })
                }
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View >
    </View >
  );
};
