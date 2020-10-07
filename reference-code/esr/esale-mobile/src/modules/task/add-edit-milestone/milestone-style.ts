import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1
  },
  appBar: { fontWeight: "normal", color: "#333333" },
  containerDropdown: {
    backgroundColor: theme.colors.gray400,
    marginHorizontal: theme.space[4],
    borderRadius: theme.space[6],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    marginVertical: theme.space[3],
  },
  viewItemContent: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  btnAddStaff: {
    width: "100%",
    height: theme.space[12],
    borderRadius: theme.space[4],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.space[2],
  },
  viewStaffInfo: {
    width: "100%",
    height: theme.space[13],
    borderRadius: theme.space[4],
    backgroundColor: theme.colors.gray100,
    marginTop: theme.space[2],
    justifyContent: "space-between",
    paddingHorizontal: theme.space[2],
    flexDirection: "row",
    alignItems: "center",
  },
  avarStaff: {
    height: theme.space[8],
    width: theme.space[8],
    marginVertical: theme.space[3],
    marginRight: theme.space[2],
  },
  viewSubTask: {
    flexDirection: "row",
    width: "100%",
    height: theme.space[11],
    borderRadius: theme.space[4],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.space[2],
    paddingHorizontal: theme.space[2],
    backgroundColor: theme.colors.gray100,
  },
  btnAddFile: {
    flexDirection: "row",
    width: "100%",
    height: theme.space[12],
    borderRadius: theme.space[4],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.space[2],
    borderStyle: "dashed",
  },
  txtAddFile: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes[2],
    marginLeft: theme.space[2],
  },
  txtContentBtn: { color: theme.colors.gray1, fontSize: theme.fontSizes[1] },
  viewRequired: {
    backgroundColor: theme.colors.red500,
    borderRadius: theme.space[1],
    marginLeft: theme.space[5],
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 36,
  },
  txtRequired: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[0],
  },
  viewStatusTask: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.space[4],
    paddingTop: theme.space[4],
  },
  viewAddStaff: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: { color: theme.colors.black, height: 45 },
  txtTime: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes[2],
    marginTop: theme.space[3],
  },
  paddingView: {
    padding: 0,
  },
  paddingHoz: {
    paddingHorizontal: theme.space[4]
  },
  boxMessageSuccess: {
    width: "100%",
    paddingTop: theme.space[2],
    alignItems: "center",
    position: "absolute",
    bottom: theme.space[2],
  },
  boxMessage: {
    width: "100%",
    paddingTop: theme.space[2],
    alignItems: "center",
  },
  boxConfirm: {
    paddingTop: 32,
    height: 200,
    paddingHorizontal: 8,
    paddingVertical: theme.space[1],
  },
  txtContent: {
    paddingVertical: theme.space[2],
  },
});
