import * as React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Task } from "../../task-repository";
import { theme } from "../../../../config/constants";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY, COMMA_SPACE } from "../../../../config/constants/constants";

interface TaskGeneralInfoSubtaskListProps {
  //Label
  label: string,
  //Color of Value text
  colorValue: string,
  //List subtask
  data: Array<any>
}

/**
 * Component show subtask list
 */

export const TaskGeneralInfoSubtaskList: React.FC<TaskGeneralInfoSubtaskListProps> = ({
  label,
  colorValue,
  data = [],
}) => {

  const navigation = useNavigation();

  /*
  * Navigate to Subtask Detail Screen 
  */
  const onClickItem = (id: number) => {
    let pushAction = StackActions.push("task-detail", { taskId: id });
    navigation.dispatch(pushAction);
  }

  return (
    <View style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[TaskDetailStyles.bold]}>{checkEmptyString(label) ? TEXT_EMPTY : label}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {
              data.map((item: Task, index: number) => {
                return (
                  <TouchableWithoutFeedback onPress={() => {
                    onClickItem(item.taskId);
                  }}
                    key={item?.taskId?.toString()}
                  >
                    <Text style={[TaskDetailStyles.gray, { color: colorValue }]}>{checkEmptyString(item.taskName) ? TEXT_EMPTY
                      : index == data.length - 1 ? item.taskName : item.taskName + COMMA_SPACE}</Text>
                  </TouchableWithoutFeedback>
                );
              })
            }
          </Text>

        </View>
      </View>
    </View>
  );
};
