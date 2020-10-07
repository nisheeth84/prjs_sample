import React from "react";
import { Switch, Text, View } from "react-native";
import { theme } from "../../../config/constants";

interface ItemSwitchProps {
  isEnabled: boolean;
  toggleSwitch: () => void;
  content: string;
}

export const ItemSwitch: React.FC<ItemSwitchProps> = ({
  isEnabled,
  toggleSwitch,
  content,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: theme.space[1],
        width: "100%",
      }}
    >
      <Text numberOfLines={2} style={{ width: "80%" }}>
        {content}
      </Text>
      <Switch
        trackColor={{ false: theme.colors.gray100, true: theme.colors.blue200 }}
        thumbColor={theme.colors.white}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};
