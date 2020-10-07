import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants";

export const EmployeeListStyles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: theme.space[2]
  },
  itemList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.space[2]
  },
  itemName: {
    marginLeft: theme.space[2],
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
  },
  iconEmployee: {
    width: 32,
    height: 32,
  },

});