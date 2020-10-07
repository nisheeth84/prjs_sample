

import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { SelectOrderSort } from "./popup-sort-styles";
import { theme } from "../../../config/constants";


interface OrderSelectProps {
    active: boolean;
    text: string;
    iconName: string;
    containerStyle: Array<any>;
    iconViewStyle: Array<any>;
    textStyle: Array<any>;
    handleChooseOrder: () => void;
}

/**
 * Component OrderSelect
 * @param  
 */

export const OrderSelect: React.FC<OrderSelectProps> = ({
    text,
    textStyle,
    active,
    iconName,
    containerStyle,
    iconViewStyle,
    handleChooseOrder
}) => {
    /**
     * Check active for order sort
     */
    let iconColor;
    if (active) {
        textStyle.push(SelectOrderSort.activeText)
        containerStyle.push(SelectOrderSort.activeOrderSelect)
        iconViewStyle.push(SelectOrderSort.activeIconContainer)
        iconColor = theme.colors.white;
    } else {
        textStyle.push(SelectOrderSort.inactiveText)
        containerStyle.push(SelectOrderSort.inactiveOrderSelect)
        iconViewStyle.push(SelectOrderSort.inactiveIconContainer)
        iconColor = theme.colors.gray;

    }
    return (
        <TouchableOpacity
            onPress={handleChooseOrder}
            style={[containerStyle]}
        >
            <View style={iconViewStyle}>
                <Icon color={iconColor} name={iconName} size={20} />
            </View>
            <Text style={[textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
};


