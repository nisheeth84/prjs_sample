import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../icon";
import { theme } from "../../../config/constants";

const styles = StyleSheet.create({
  container: { margin: theme.space[3] },
  boxBorder: {
    flexDirection: "row",
    borderRadius: theme.borRadius.borderRadius12,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    marginTop: theme.space[2],
    padding: 10,
  },
  boxSelected: {
    borderColor: theme.colors.blue200,
    backgroundColor: theme.colors.blue100,
  },
  boxNormal: {
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
  },
  txtNormal: { color: theme.colors.gray300 },
  txtSelected: { color: theme.colors.blue200 },
});

interface DropdownProps {
  title: string;
  value: string;
  isSelected?: boolean;
  onSelect?: () => void;
  containerStyle?: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  value,
  isSelected,
  containerStyle,
  onSelect,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text>{title}</Text>
      <TouchableOpacity
        onPress={onSelect}
        style={[
          styles.boxBorder,
          isSelected ? styles.boxSelected : styles.boxNormal,
        ]}
      >
        <Text style={isSelected ? styles.txtSelected : styles.txtNormal}>
          {value}
        </Text>
        <Icon name={isSelected ? "arrowDownBlue" : "arrowDown"} />
      </TouchableOpacity>
    </View>
  );
};
