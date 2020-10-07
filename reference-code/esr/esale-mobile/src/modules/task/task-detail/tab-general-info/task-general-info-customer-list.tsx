import * as React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { useNavigation } from "@react-navigation/native";
import { Customer } from "../../task-repository";
import { theme } from "../../../../config/constants";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY, COMMA_SPACE } from "../../../../config/constants/constants";
import { ScreenName } from "../../../../config/constants/screen-name";

interface TaskGeneralInfoCustomerListProps {
  //Label
  label: string,
  //Color of Value text
  colorValue: string,
  //List value
  data: Array<any>,
}

/**
 * Component show customer list
 * @param props 
 */

export const TaskGeneralInfoCustomerList: React.FC<TaskGeneralInfoCustomerListProps> = ({
  label,
  colorValue,
  data = [],
}) => {

  const navigation = useNavigation();

  /*
  * Navigate to Customer Detail Screen
  */
  const onClickItem = (id: number) => {
    navigation.navigate(ScreenName.CUSTOMER_DETAIL, { customerId: id });
  }

  return (
    <View
      style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[TaskDetailStyles.bold]}>{checkEmptyString(label) ? TEXT_EMPTY : label}</Text>
          <View style={TaskDetailStyles.row}>
            <Text style={CommonStyles.flex1} numberOfLines={1} ellipsizeMode="tail">
              {
                data.map((item: Customer, index: number) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => {
                      onClickItem(item.customerId);
                    }}
                      key={item?.customerId?.toString()}
                    >
                      <Text style={[TaskDetailStyles.gray, { color: colorValue }]}>{checkEmptyString(item.customerName) ? TEXT_EMPTY
                        : index == data.length - 1 ? item.customerName : item.customerName + COMMA_SPACE}</Text>
                    </TouchableWithoutFeedback>
                  );
                })
              }
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
};
