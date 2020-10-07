import React from "react";
import { View, Text } from "react-native";
import { CustomerListItemStyles } from "./customer-relation-style";

/**
 * Component for show View CustomerListItem
 * @param role string 
 * @param customerName string 
 * @param customerAddress any 
*/
export function CustomerListItemDescription(role: string, customerName: string, customerAddress: any) {
  let customerAddressOjbect = customerAddress ? JSON.parse(customerAddress) : "";

  return (
    <View style={CustomerListItemStyles.mainInforBlock}>
      <View style={CustomerListItemStyles.customerItem}>
      <Text style={CustomerListItemStyles.role} numberOfLines={1}>
        {role}
        </Text>
        <Text style={CustomerListItemStyles.name}>{customerName}</Text>
        <Text style={CustomerListItemStyles.address}>
          {customerAddressOjbect.buildingName}{customerAddressOjbect.address}
        </Text>
      </View>

    </View>
  );
}