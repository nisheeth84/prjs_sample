import React, { useState } from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { messages } from "./person-reaction-list-messages";
import { translate } from "../../../config/i18n";
import { useSelector } from "react-redux";
import { CommonStyles } from "../../../shared/common-style";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { DUMMY_REACTION } from "./person-reaction-list-dummy-data";
import { PersonReactionItem } from "./person-reaction-item";
import { useRoute } from "@react-navigation/native";
import { PersonListReactionRouteProp } from "../../../config/constants/root-stack-param-list";
import { Line } from "../../../shared/components/line";
import { PersonReactionListStyles as styles } from "./person-reaction-list-style";
import { updateTimelineReaction } from "../timeline-repository";
import { queryUpdateTimelineReaction } from "./query";

/**
 * Component show reaction detail screen
 */

export const PersonReactionListScreen = () => {
  const employeeIdS = useSelector(authorizationSelector).employeeId;
  const [reload, setReload] = useState(false);
  const route = useRoute<PersonListReactionRouteProp>();
  const listReaction = DUMMY_REACTION.reactions;

  console.log("route?.params?.timelineId", route?.params?.timelineId);

  /**
   * call api delete reaction
   */

  const deleteReactionF = (reactionType: number) => {
    async function callApi() {
      let params = {
        employeeId: employeeIdS,
        timelineId: route?.params?.timelineId,
        reactionType,
      };
      const response = await updateTimelineReaction(
        queryUpdateTimelineReaction(params),
        {}
      );
      if (response) {
        if (
          response.status == 200 &&
          response?.data?.data?.updateTimelineReaction != undefined
        ) {
          setReload(!reload);
        }
      }
    }
    callApi();
  };

  /**
   * render list reaction
   */
  const renderList = () => {
    let list: Array<any> = [];
    let reaction = listReaction[route?.params?.index];
    let data = (reaction.employees || []).map((employee) => {
      return (
        <PersonReactionItem
          employeeName={employee.employeeName}
          employeeImagePath={employee.employeeImagePath}
          canDelete={employee.employeeId == employeeIdS}
          deleteReaction={() => {
            deleteReactionF(reaction.reactionType);
          }}
          key={employee.employeeId}
        />
      );
    });
    list.push(data);
    return (
      <View>
        <Text style={styles.numberPersonReaction}>
          {reaction.employees.length}
          {translate(messages.hasReaction)}
        </Text>
        <Line />
        <ScrollView>{list}</ScrollView>
      </View>
    );
  };

  return <View style={[CommonStyles.flex1]}>{renderList()}</View>;
};
