import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ActionModalStyles } from "./customer-detail-style";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-detail-messages";
import { useNavigation } from "@react-navigation/native";

/**
 * Component for show action modal list
 */
export function ActionModal() {
  const [itemModal] = useState([
    {title: translate(messages.registerBusinessCard), route: ""},
    {title: translate(messages.registerActivity), route: ""},
    {title: translate(messages.registerSchedule), route: ""},
    {title: translate(messages.registerTask), route: ""},
    {title: translate(messages.sendMail), route: ""},
    {title: translate(messages.PostToTimeline), route: ""},
  ]);
  
  const navigation = useNavigation();

  return (
    <View>
      {itemModal.map((item, index) => {
        return (
          <TouchableOpacity style={[ActionModalStyles.item, index===itemModal.length-1 && ActionModalStyles.borderBottomNone]} 
            key={index}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
