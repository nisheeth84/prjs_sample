import { StyleSheet } from "react-native";
import { theme } from "../../../../../config/constants";
/**
 * style product screen detail
 */
export const styles = StyleSheet.create({
  label: {
    width: "100%",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 18
  },
  labelTitle: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  labelTxtLink: { color: "#0F6DB5", fontSize: 14 },
  labelTxt: { color: "#666666", fontSize: 14, fontWeight: '300' },
  overview: { flex: 1, backgroundColor: "white" }
});
export const AppbarHomeStyles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: theme.colors.white100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    alignItems: 'center',
    flexDirection: 'row',
  },
  block: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: theme.fontWeights[6],
  },
  iconGray: {
    color: theme.colors.gray,
  },
  paddingLeftButton: {
    paddingLeft: 20,
  },
});