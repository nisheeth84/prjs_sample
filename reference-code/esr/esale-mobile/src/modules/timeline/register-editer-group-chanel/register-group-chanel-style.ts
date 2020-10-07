import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const RegisterGroupChanelStyles = StyleSheet.create({
  main: {
    backgroundColor: theme.colors.white,
  },

  labelRequire: {
    marginLeft: theme.space[2],
    paddingHorizontal: theme.space[2],
    paddingVertical: 1
  },

  textInput: {
    borderRadius: 12,
    backgroundColor: theme.colors.white200,
    paddingHorizontal: 0,
    borderWidth: 0,
  },

  parentTextInputStyle: {
    marginTop: theme.space[2],
    borderRadius: 12,
    backgroundColor: theme.colors.white200,
    marginHorizontal: theme.space[4],
    paddingHorizontal: theme.space[2]
  },

  wrapContent: {
    flex: 1,
    paddingTop: theme.space[4],
  },

  titleWrapper: {
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    alignItems: "center",
  },

  titleText: {
    fontWeight: "500",
    fontSize: theme.fontSizes[3],
  },

  groupColor: {
    marginTop: theme.space[2],
    width: 50,
    height: 50,
    marginHorizontal: theme.space[4],
    borderRadius: 10
  },

  groupRadio: {
    marginTop: theme.space[2],
    borderRadius: 12,
    borderColor: theme.colors.white200,
    borderWidth: 2,
    marginHorizontal: theme.space[4],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[3]
  },

  prGroupAuthority: {
    paddingBottom: theme.space[5],
  },

  groupAuthority: {
    marginTop: theme.space[2],
    borderRadius: 12,
    marginHorizontal: theme.space[4],
    padding: theme.space[2],
    backgroundColor: "#ECECEC",
  },

  radio: {
    marginLeft: theme.space[4]
  },

  colorItem: {
    padding: theme.space[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100
  },

  squareColor: {
    width: 14,
    height: 14
  },

  colorName: {
    marginLeft: theme.space[2],
    fontSize: theme.fontSizes[2]
  },
  add: {
    padding: theme.space[4]
  }
});