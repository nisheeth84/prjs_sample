import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const PersonReactionListStyles = StyleSheet.create({
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
    marginLeft: theme.space[2]
  },
  iconEmployee: {
    width: 24,
    height: 24,
  },

  iconDelete: {
    width: 16,
    height: 16,
  },

  numberPersonReaction: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[4]
  }

});