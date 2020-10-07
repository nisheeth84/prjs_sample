import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SortProductStyle } from "./popup-sort-styles";
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
        SortProductStyle.spacePadding,
        SortProductStyle.rowView,
        CommonStyles.width100,
      ]}
    >
      <View>
        <Text style={SortProductStyle.bold}>{text}</Text>
      </View>
      <View>
        {active ? (
          <Icon
            name="checkActive"
            style={SortProductStyle.checkActiveIcon}
          />
        ) : (
          <View style={SortProductStyle.checkActiveIcon}></View>
        )}
      </View>
    </TouchableOpacity>
  );
};
