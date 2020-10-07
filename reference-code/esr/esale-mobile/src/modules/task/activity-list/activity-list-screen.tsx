import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { translate } from "../../../config/i18n";
import { messages } from "./activity-list-messages";
import { useNavigation } from "@react-navigation/native";
import { ActivityListStyles } from "./activity-list-style";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ControlType } from "../../../config/constants/enum";
import { ScreenName } from "../../../config/constants/screen-name";

/**
 * Component show activity list screen
 */
export const ActivityListScreen = () => {

  const navigation = useNavigation();

  /**
   * add milestone
   */
  const openAddMilestone = () => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, { type: ControlType.ADD });
  }

  /**
   * add task
   */
  const openAddTask = () => {
    navigation.navigate(ScreenName.CREATE_TASK, { type: ControlType.ADD });
  }

  return (
    <TouchableWithoutFeedback style={ActivityListStyles.containerBlack} onPress={() => {
      navigation.goBack();
    }}>
      <View style={ActivityListStyles.main} >
        <TouchableOpacity
          onPress={() => {
            openAddTask()
          }}
        >
          <Text style={ActivityListStyles.item}>{translate(messages.addTask)}</Text>
        </TouchableOpacity>
        <View style={ActivityListStyles.line} />
        <TouchableOpacity
          onPress={() => {
            openAddMilestone()
          }}
        >
          <Text style={ActivityListStyles.item}>{translate(messages.addMilestone)}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};