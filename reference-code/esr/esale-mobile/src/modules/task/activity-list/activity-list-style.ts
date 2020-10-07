import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const ActivityListStyles = StyleSheet.create({

  bold: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },

  gray: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[3],
  },

  black: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[3],
  },

  row: {
    flexDirection: "row",
  },

  container: {
    paddingTop: 0,
    backgroundColor: theme.colors.white100,
  },

  containerWhite: {
    paddingTop: 0,
    backgroundColor: theme.colors.white
  },

  containerBlack: {
    paddingTop: 0,
    backgroundColor: theme.colors.black,
    height: "100%",
    justifyContent: "flex-end",
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[4],
  },

  main: {
    paddingTop: 0,
    borderRadius: 36,
    backgroundColor: theme.colors.white,
    zIndex: 1
  },

  item: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[5],
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  line: {
    borderTopWidth: 1,
    borderColor: theme.colors.gray100
  }

});