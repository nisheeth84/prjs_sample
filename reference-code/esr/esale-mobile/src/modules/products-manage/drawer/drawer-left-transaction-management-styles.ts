import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";


const { width, height } = Dimensions.get("window");

export const drawerLeftTransactionManagementStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewLabel: {
    flexDirection: "row",
    height: 55,
    alignItems: "center",
    paddingHorizontal: theme.space[3],
    justifyContent: "space-between",
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 1,
  },
  viewList: {
    paddingVertical: theme.space[2],
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 1,
  },
  view: {
    padding: theme.space[3],
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 1,
  },
  viewSearch: {
    marginTop: theme.space[3],
    paddingHorizontal: theme.space[2],
    backgroundColor: theme.colors.white200,
    flexDirection: "row",
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray200,
    borderWidth: 0.89,
    alignItems: "center",
    height: 45
  },
  close: {
    paddingLeft: theme.space[3],
    paddingVertical: theme.space[1],
  },
  content: {
    // paddingLeft: theme.space[3],
    flex: 1,
  },
  icon: {
    height: theme.space[4],
    width: theme.space[4],
  },
  viewLine: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: theme.space[1] / 2,
    alignItems: "center",
    paddingHorizontal: theme.space[3],
  },
  viewContainerButton: {
    flexDirection: "row",
    paddingHorizontal: theme.space[3],
  },
  viewButton: {
    flexDirection: "row",
    paddingVertical: theme.space[1],
    // paddingHorizontal: theme.space[2],
  },
  txtLabel: {
    fontSize: theme.fontSizes[4],
    // fontWeight: theme.fontWeights[7],
    fontWeight: "700",
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtList: {
    fontSize: theme.fontSizes[3],
    marginVertical: theme.space[1],
  },
  txtSearch: {
    flex: 1,
    marginLeft: theme.space[3],
    fontSize: theme.fontSizes[3],
  },
  txtDone: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.white,
  },
  txtDisable: {
    color: theme.colors.gray,
  },
  txtActive: {
    color: theme.colors.blue200,
  },
  done: {
    backgroundColor: theme.colors.blue200,
    borderRadius: theme.borderRadius,
    padding: theme.space[2],
    paddingHorizontal: theme.space[4],
  },
  button: {
    borderRadius: theme.borderRadius,
    padding: theme.space[2],
    paddingHorizontal: theme.space[4],
    borderColor: theme.colors.gray200,
    borderWidth: 0.89,
    marginRight: theme.space[2],
  },
  edit: {
    paddingLeft: theme.space[6],
  },
  left: {
    flex: 1,
  },
  middle: {
    flex: 9,
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  modalContainer: {
    width,
    height,
    backgroundColor: theme.colors.blackDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    padding: theme.space[4],
    paddingVertical: theme.space[7],
    borderRadius: theme.borderRadius,
    alignItems: "center",
    width: width * 0.75,
  },
  padding: {
    height: theme.space[2],
  },
  viewOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonCancel: {
    borderRadius: theme.borderRadius,
    width: width * 0.3,
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: theme.space[2],
  },
  buttonConfirm: {
    borderRadius: theme.borderRadius,
    width: width * 0.3,
    alignItems: "center",
    paddingVertical: theme.space[2],
    backgroundColor: theme.colors.red600,
  },
  txtWhite: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.white,
  },
});
