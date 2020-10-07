import React from "react";
import { View, Text } from "react-native";
import { CustomerListItemStyles } from "./customer-list-style";

/**
 * Component for show View CustomerListItem
 * @param role get customer parent of item customer
 * @param customerName get customerName of item customer
 * @param buildingName get buildingName of item customer
 * @param address get address of item customer
*/

export function CustomerListItemDescription(role: string, customerName: string, buildingName: string, address: string) {
  return (
    <View style={CustomerListItemStyles.mainInforBlock}>
      <View style={CustomerListItemStyles.customerItem}>
        <Text style={CustomerListItemStyles.role} numberOfLines={1}>
        {role}
        </Text>
        <Text style={CustomerListItemStyles.name} numberOfLines={1}>{customerName}</Text>
        <Text style={CustomerListItemStyles.address} numberOfLines={1}>
          {buildingName} {address}
        </Text>
      </View>
    </View>
  );
}