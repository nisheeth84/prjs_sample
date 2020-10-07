import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height, width } = Dimensions.get("window");

export const TimelinePageGroupStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewSearch: {
    padding: theme.space[3],
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray150,
  },
  viewTxtInput: {
    flexDirection: "row",
    paddingHorizontal: theme.space[3],
    borderWidth: 1,
    borderColor: theme.colors.gray150,
    alignItems: "center",
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.white150,
    width: "90%",
    height: 50,
  },
  txtInput: {
    fontSize: theme.fontSizes[4],
    width: "90%",
  },
  icon: {
    height: 18,
    aspectRatio: 1,
    marginRight: theme.space[3],
  },
  btnDown: {
    padding: theme.space[4],
  },
  viewTop: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray150,
    padding: theme.space[1],
  },
  viewTxtTop: {
    padding: theme.space[3],
    backgroundColor: theme.colors.blue100,
    borderRadius: theme.borderRadius,
    alignItems: "center",
  },
  requestTxtTop: {
    padding: theme.space[3],
    backgroundColor: theme.colors.blue100,
    borderRadius: theme.borderRadius,
    // alignItems: "center",
  },
  txt: {
    fontSize: theme.fontSizes[3],
    marginBottom: theme.space[2],
  },
  txtIcon: {
    fontSize: theme.fontSizes[2],
    marginBottom: theme.space[2],
    color: theme.colors.white,
    lineHeight: theme.fontSizes[2],
  },
  bgImg: {
    width: "100%",
    aspectRatio: 1.7,
  },
  viewBgImg: {
    flex: 1,
    flexDirection: "row",
    padding: "4%",
  },
  channelImg: {
    width: width * 0.3,
    aspectRatio: 1.7,
  },
  viewGroupName: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  txtChannel: {
    fontSize: theme.fontSizes[4],
    color: theme.colors.white,
    fontWeight: "700",
  },
  content: {
    width: width * 0.58,
    marginLeft: "4%",
  },
  border: {
    borderRadius: theme.borderRadius,
  },
  txtGroupName: {
    fontSize: theme.fontSizes[4],
    fontWeight: "700",
  },
  iconMember: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.space[1],
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "center"
  },
  member: {
    paddingBottom: theme.space[2],
  },
  start: {
    marginRight: theme.space[2],
    height: 22,
    width: 18,
  },
  btn: {
    padding: theme.space[2],
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: theme.colors.gray100,
    alignItems: "center",
    width: "70%",
    borderRadius: 8,
    marginRight: theme.space[2],
  },
  txtBtn: {
    fontSize: theme.fontSizes[1],
  },

  confirmRequest: {
    color: "blue",
    textDecorationLine: "underline"
  },
  iconBusiness: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.space[1],
  },
});
export const TimelinePageGroupModalStyles = StyleSheet.create({
  modalItem: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: "35%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 30,
    position: "absolute",
    top: height * 0.3,
    right: width * 0.1,
    padding: theme.space[5],
  },
  title: { fontSize: theme.fontSizes[4] },
  viewContent: {
    padding: theme.space[3],
    flex: 1,
    justifyContent: "center",
    marginBottom: 10,
  },
  textContent: { fontSize: theme.fontSizes[3], color: theme.colors.gray },
  btnClose: {
    flex: 1,
    padding: theme.space[3],
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  txtClose: {
    fontSize: theme.fontSizes[3],
    color: "#000",
  },
  btnConfirm: {
    flex: 1,
    padding: theme.space[3],
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  txtConfirm: {
    fontSize: theme.fontSizes[3],
    color: "#fff",
  },
});
