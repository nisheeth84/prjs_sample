import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SelectOrderSortStyes } from "./employee-list-style";
import { Icon } from "../../../shared/components/icon";

/**
 * Props data
 */
interface OrderSelectProps {
    active: boolean;
    text: string;
    iconName: string;
    containerStyle: Array<any>;
    textStyle: Array<any>;
    handleChooseOrder: () => void;
}

/**
 * Component OrderSelect
 * @param  
 */

export const OrderSelect = ({
    text,
    textStyle,
    active,
    iconName,
    containerStyle,
    handleChooseOrder
}: OrderSelectProps) => {
    /**
     * Check active for order sort
     */
    let iconColor;
    if (active) {
        textStyle.push(SelectOrderSortStyes.activeText)
        containerStyle.push(SelectOrderSortStyes.activeOrderSelect)
        iconColor = iconName + "_press";
    } else {
        textStyle.push(SelectOrderSortStyes.inactiveText)
        containerStyle.push(SelectOrderSortStyes.inactiveOrderSelect)
        iconColor = iconName;
    }
    return (
      <TouchableOpacity
        onPress={handleChooseOrder}
        style={[containerStyle]}
      >
        <View style={SelectOrderSortStyes.buttonTypeSort}>
          <Icon name={iconColor} style={SelectOrderSortStyes.iconSort} />
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
};

