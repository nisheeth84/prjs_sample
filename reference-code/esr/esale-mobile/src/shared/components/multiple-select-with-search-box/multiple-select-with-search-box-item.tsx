import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../config/constants";
import { Icon } from "../icon";
import { CheckBox } from "../checkbox";
import { SearchItemStyles } from "./styles";

/**
 * interface for props of MultipleSelectWithSearchBoxItem
 */
interface ItemParams {
  item: any;
  handlePressItem: (item: any) => void;
}

/**
 * Component display search result item
 * @param props
 */
export function MultipleSelectWithSearchBoxItem({
  item,
  handlePressItem = () => {},
}: ItemParams) {
  return (
    <TouchableOpacity
      onPress={() => handlePressItem(item)}
      style={SearchItemStyles.searchItem}
    >
      <View style={SearchItemStyles.infoView}>
        <View>
          <Text style={SearchItemStyles.infoStyles}>{item.departmentName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
