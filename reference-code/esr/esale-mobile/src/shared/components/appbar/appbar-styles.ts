import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const appBarMenuStyles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: theme.colors.white100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  iconButton: {
    padding: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
  },
  iconSearch: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: theme.fontWeights[6],
  },
});
export const appBarHomeStyles = StyleSheet.create({
  container: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    alignItems: "center",
    flexDirection: "row",
  },
  paddingLeftButton: {
    paddingLeft: 20,
  },
  iconGray: {
    color: theme.colors.gray,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  block: {
    paddingVertical: 15,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconSearch: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: theme.fontWeights[6],
  },
  icon: {
    height: theme.space[5],
    width: theme.space[5],
    resizeMode: "contain",
  },
});

export const AppBarMenuStyles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: theme.colors.white100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    alignItems: "center",
    flexDirection: "row",
  },
  menuStyles: {
    width: 30,
    aspectRatio: 22 / 15,
    // height: 30,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
    fontWeight: 'bold'
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
  },
  titleWrapperLeft: {
    backgroundColor: "green",
  },

  titleWrapperRight: {
    backgroundColor: "blue",
  },

  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100
  },

  iconLeft: {
    alignItems: "center",
    width: 12,
    height: 15,
  },

  iconSearch: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: theme.fontWeights[6],
    zIndex: 100
  },
});

