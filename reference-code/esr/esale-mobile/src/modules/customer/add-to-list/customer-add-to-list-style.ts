import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const CustomerAddToListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  viewNotification: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.space[3],
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.blue100,
  },
  icon: {
    width: 20,
    aspectRatio: 1,
    marginRight: theme.space[2],
  },
  divider: {
    padding: theme.space[2],
    backgroundColor: theme.colors.gray200,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  txt: {
    fontSize: theme.fontSizes[4],
  },
  txtLabelList: {
    fontWeight: "700",
    fontSize: theme.fontSizes[4],
    marginVertical: theme.space[1],
  },
  txtInput: {
    padding: theme.space[2],
    paddingHorizontal: theme.space[3],
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    marginTop: theme.space[2],
    backgroundColor: theme.colors.white200,
    fontSize: theme.fontSizes[4],
  },
  scrollView: {
    paddingHorizontal: theme.space[3],
  },
  viewItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.space[6],
    paddingVertical: theme.space[2],
    justifyContent: "space-between",
  },
  unSelected: {
    width: 26,
    aspectRatio: 1,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  collapse: {
    width: 14,
    aspectRatio: 1,
    borderRadius: 7,
    marginRight: theme.space[2],
  },
});
