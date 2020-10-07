import React from "react";
import { View, Text } from "react-native";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";
import { Icon } from "../../../../../shared/components/icon";

export function Message(content: string, bgColor: string, iconName: string) {

  return (
    <View style={[CustomerDetailScreenStyles.messageBlock, {backgroundColor: bgColor}]}>
      <Icon name={iconName} style={CustomerDetailScreenStyles.messageIcon}/>
      <Text style={CustomerDetailScreenStyles.messageContent}>{content}</Text>
    </View>
  );
}