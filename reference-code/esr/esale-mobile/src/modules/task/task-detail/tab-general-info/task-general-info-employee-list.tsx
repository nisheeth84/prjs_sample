import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../../config/constants";
import { translate } from "../../../../config/i18n";
import { messages } from "../task-detail-messages";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY, COMMA_SPACE } from "../../../../config/constants/constants";
import { ScreenName } from "../../../../config/constants/screen-name";

interface TaskGeneralInfoEmployeeListProps {
  //Label
  label: string,
  //Color of Value text
  colorValue: string,
  //List value
  data: Array<any>
  //number employee
  countEmployee: number
}

/**
 * Component show employee list
 * @param props 
 */

export const TaskGeneralInfoEmployeeList: React.FC<TaskGeneralInfoEmployeeListProps> = ({
  label,
  colorValue,
  data = [],
  countEmployee = 0
}) => {

  const navigation = useNavigation();

  /*
  * Navigate to Employee Detail Screen 
  */
  const onClickItem = (employeeId: number, employeeName: string) => {
    navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { id: employeeId, title: employeeName });
  }

  return (
    <View style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[TaskDetailStyles.bold]}>{checkEmptyString(label) ? TEXT_EMPTY : label}</Text>
          <View style={CommonStyles.row}>
            <Text>
              {
                data.map((item: any, index: number) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => {
                      onClickItem(item.employeeId, item.employeeName);
                    }}
                      key={item?.employeeId?.toString()}
                    >
                      {
                        index < 2 ?
                          <Text style={[TaskDetailStyles.gray, { color: colorValue }]}>
                            {checkEmptyString(item.employeeName) ? TEXT_EMPTY : index == data.length - 1 ? item.employeeName : item.employeeName + COMMA_SPACE}
                          </Text>
                          : <Text />
                      }
                    </TouchableWithoutFeedback>
                  );
                })
              }
            </Text>
            {
              data.length > 2 ?
                <TouchableWithoutFeedback>
                  <Text style={[TaskDetailStyles.gray, { color: colorValue }]}>
                    {`${translate(messages.other)}${countEmployee - 2}${translate(messages.name)}`}
                  </Text>
                </TouchableWithoutFeedback>
                : <Text />
            }
          </View>
        </View>
      </View>
    </View >
  );
};
