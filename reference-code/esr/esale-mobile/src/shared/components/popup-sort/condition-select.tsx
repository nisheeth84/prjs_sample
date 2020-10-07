import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PopupSortStyle } from "./popup-sort-styles";
import { Icon } from "../../../shared/components/icon";
import { CommonStyles } from "../../../shared/common-style";

interface ConditionSelectProps {
  active: boolean;
  text: string;
  handleSelectCondition: () => void;
}

/**
 * Component Condition Select
 * @param param0
 */

export const ConditionSelect: React.FC<ConditionSelectProps> = ({
  text,
  active,
  handleSelectCondition,
}) => {
  return (
    <TouchableOpacity
      onPress={handleSelectCondition}
      style={[
        PopupSortStyle.spacePadding,
        CommonStyles.flex1,
        CommonStyles.rowInline
      ]}
    >
      <Text style={[CommonStyles.flex1, PopupSortStyle.itemName]}>{text}</Text>
      {active ? (
        <Icon
          name="checkActive"
          style={PopupSortStyle.checkActiveIcon}
        />
      ) : (
          <View style={PopupSortStyle.checkActiveIcon} />
        )}
    </TouchableOpacity>
  );
};
