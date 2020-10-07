import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const AuthorityStyle = StyleSheet.create({

  group: {
    backgroundColor: "#AFE6CB"
  },

  department: {
    backgroundColor: "#FDACFD"
  },

  firstTextIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },

  firstText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: theme.fontSizes[2],
  },

  title: {
    marginLeft: theme.space[2],
    color: "#989898",
    fontSize: theme.fontSizes[1]
  },

  content: {
    marginLeft: theme.space[2],
    color: "black",
    fontSize: theme.fontSizes[2]
  },

  authoritySelected: {
    backgroundColor: "white",
    borderRadius: theme.borRadius.borderRadius4,
    marginRight: theme.space[2],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },

  arrowDown: {
    marginLeft: theme.space[1]
  },

  iconUser: {
    width: 50,
    height: 50,
  }
});