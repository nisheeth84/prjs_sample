import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { SortProductSelection } from "./group-add-to-group-style-modal";

/**
 * Props data
 */
interface ConditionSelectProps {
  active: boolean;
  text: string;
  handleSelectCondition: () => void;
}

/**
 * Component Condition Select
 * @param param0
 */
export const SelectOption = ({
  text,
  active,
  handleSelectCondition,
}: ConditionSelectProps) => {
  return (
    <TouchableOpacity
      onPress={handleSelectCondition}
      style={[
        SortProductSelection.spacePadding,
        SortProductSelection.rowView,
        SortProductSelection.width100,
      ]}
    >
      <View>
        <Text style={SortProductSelection.bold}>{text}</Text>
      </View>
      <View>
        <Icon
          name={active ? "selected" : "unchecked"}
        />
      </View>
    </TouchableOpacity>
  );
};
