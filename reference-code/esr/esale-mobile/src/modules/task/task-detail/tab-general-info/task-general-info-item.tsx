import * as React from "react";
import { View, Text } from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { theme } from "../../../../config/constants";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY } from "../../../../config/constants/constants";

interface TaskItemProps {
  //Label
  label: string,
  //Value
  value: string,
  //Color of Value text
  colorValue: string
}

/**
 * Component show task general information item
 * @param props 
 */

export const TaskGeneralInfoItem: React.FC<TaskItemProps> = ({
  label,
  value,
  colorValue
}) => {

  return (
    <View style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
      <View style={[TaskDetailStyles.rowCenter]}>
        <View style={CommonStyles.flex1} >
          <Text style={[TaskDetailStyles.bold]}>{checkEmptyString(label) ? TEXT_EMPTY : label}</Text>
          <Text style={[TaskDetailStyles.gray, { color: colorValue }]}>{checkEmptyString(value) ? TEXT_EMPTY : value}</Text>
        </View>
      </View>
    </View>
  );
};
