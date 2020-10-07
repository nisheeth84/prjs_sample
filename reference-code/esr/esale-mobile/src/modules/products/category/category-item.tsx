import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { CategoryItemStyles } from "./category-item-style";
import {CommonStyles} from "../../../shared/common-style";

interface CategoryItemProps {
    // name
    name: string,
    // child
    child: Array<any>,
    // event
    onClick: Function
}

/**
 * Show Category Item
 * @param param0 
 */

export const CategoryItem: React.FC<CategoryItemProps> = ({
    name,
    child = [],
    onClick = () => { }
}) => {
    return (
        <View>
            <View style={CategoryItemStyles.divide} />
            <TouchableOpacity onPress={() => {
                onClick();
            }} style={CategoryItemStyles.categoryItem}>
                <Text numberOfLines={1} style={[CategoryItemStyles.titleList, CommonStyles.textBold]}>{name}</Text>
                {!!child && child.length > 0 ? <Icon name="arrowRight" /> : <View />}
            </TouchableOpacity>
        </View>
    );
};
