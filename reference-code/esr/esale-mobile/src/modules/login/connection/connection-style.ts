import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  input: {
    marginTop: 20,
  },
  wrapButton: {
    paddingHorizontal: theme.space[4],
    margin: theme.space[4],
  },
});

export const ConnectionPickStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  companeyNameStyle: {
    borderWidth: 0,
    borderColor: theme.colors.white,
    color: theme.colors.blackDeep,
    paddingLeft: theme.space[4],
    fontWeight: "bold",
  },
  tenantStyle: {
    color: theme.colors.gray,
    paddingLeft: theme.space[4],
    paddingVertical: theme.space[2],
  },
  titleText: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },
  buttonWrapper: {
    marginHorizontal: theme.space[4],
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
    fontWeight: "bold",
  },
  containerButton: {
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
});

export const AppBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    elevation: 1,
  },
  leftElement: {
    flex: 1,
  },
  centerElement: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  rightElement: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  icon: {
    margin: 4,
  },
});
