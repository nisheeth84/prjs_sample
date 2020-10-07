import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const FormInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  wrapContent: {
    flex: 1,
    paddingTop: theme.space[4],
  },
  titleWrapper: {
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    alignItems: 'center'
  },
  titleText: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.black
  },
  buttonWrapper: {
    marginHorizontal: theme.space[4],
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
    fontWeight: "600",
  },
  inputStyle: {
    borderWidth: 0,
    borderColor: theme.colors.white,
    color: theme.colors.gray,
  },
  urlStyle: {
    color: theme.colors.gray,
    paddingLeft: theme.space[4],
    paddingVertical: theme.space[2],
  },
  containerNoLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0,
    borderBottomColor: theme.colors.gray100,
  },

  prInputStyle: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderColor: theme.colors.white,
    color: theme.colors.gray,
  },

  disableInputStyle: {
    borderWidth: 0,
    borderColor: theme.colors.white,
    color: theme.colors.gray,
  },

  viewRequired: {
    backgroundColor: theme.colors.red500,
    borderRadius: theme.space[1],
    marginLeft: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 36,
  },
  txtRequired: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[0],
  },
  imageIconStyle: {
    marginRight: theme.space[2],
  },
  deleteIconStyle: {
    marginLeft: theme.space[2],
  },
  styleSwitchBox: { marginRight: theme.space[2] },
});
