import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height, width } = Dimensions.get("window");

export const TimelineParticipantStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white150,
  },
  body: {
    flex: 1,
  },
  tab: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.green,
  },

  themeGreen200: {
    backgroundColor: theme.colors.green200,
  },
  themeBlue: {
    backgroundColor: theme.colors.blue1,
  },
  themeGreen100: {
    backgroundColor: theme.colors.green100,
  },
  viewBtn: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    padding: theme.space[3],
  },
  txtAdd: { fontSize: theme.fontSizes[3] },
  btnAdd: {
    padding: theme.space[3],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 12,
    alignItems: "center",
  },
  tabMemberOff: {
    flex: 1,
    paddingVertical: theme.space[4],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    backgroundColor: theme.colors.blue100,
    borderBottomColor: theme.colors.blue200,
  },
  tabMemberOn: {
    flex: 1,
    paddingVertical: theme.space[4],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.gray100,
  },
  txtTabOff: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.black,
  },
  txtIcon: { fontSize: theme.fontSizes[1], color: "white" },
  txtTabOn: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.blue200,
  },
  tabRequestOff: {
    flex: 1,
    paddingVertical: theme.space[4],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    backgroundColor: theme.colors.blue100,
    borderBottomColor: theme.colors.blue200,
  },
  tabRequestOn: {
    flex: 1,
    paddingVertical: theme.space[4],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.gray100,
  },
  viewItem: {
    flexDirection: "row",
    paddingVertical: theme.space[3],
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: theme.space[4],
  },
  flex4: { flex: 4 },
  txtNameGroup: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.blue200,
    paddingHorizontal: theme.space[2],
  },
  viewBtnConfirm: {
    flex: 3,
    flexDirection: "row",
  },
  approval: {
    padding: theme.space[3],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemParticipate: {
    flexDirection: "row",
    paddingVertical: theme.space[3],
    borderColor: theme.colors.gray100,
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: theme.space[4],
  },
  viewBtnAuthority: {
    padding: theme.space[3],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 8,
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: { width: theme.space[2] },
  icon: { height: 10, width: 20 },
  viewMember: { alignItems: "flex-start", flex: 1 },
  viewOwner: {
    padding: theme.space[2],
    borderRadius: 8,
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.blue400,
  },
  owner: { flex: 1, alignItems: "center" },
  txtOwner: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[3],
  },
  viewPicker: {
    paddingHorizontal: theme.space[5],
    paddingVertical: theme.space[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btnRemove: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[2],
  },
  textPicker: {
    fontSize: theme.fontSizes[2],
    marginRight: theme.space[2],
  }
});

export const TimelineModalParticipantStyles = StyleSheet.create({
  modalItem: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: "35%",
    width: "80%",
    backgroundColor: theme.colors.white,
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
  textContent: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.black
  },
  btnClose: {
    flex: 1,
    padding: theme.space[3],
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  txtClose: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.black,
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
    color: theme.colors.white,
  },
  viewErr: {
    alignItems: "center",
  },
  btnErr: {
    width: "50%",
    padding: theme.space[3],
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  btnOK: {
    width: "50%",
    padding: theme.space[3],
    backgroundColor: theme.colors.blue200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  }
});

export const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  inputAndroid: {
    color: theme.colors.black,
  },
  placeholderColor: theme.colors.black,
  underline: { borderTopWidth: 0 },
  icon: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 5,
    borderTopColor: "#00000099",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
};

export const TimelineModalPermissionStyles = StyleSheet.create({
  modalItem: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    position: "absolute",
    bottom: 0,
    width: "94%",
    right: "3%",
  },
  text: { fontSize: theme.fontSizes[3] },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.space[3],
  },
  line: {
    width: "100%",
    backgroundColor: theme.colors.gray100,
    height: 1,
  },
});