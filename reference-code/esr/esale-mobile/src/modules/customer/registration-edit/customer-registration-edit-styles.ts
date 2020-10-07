import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { width } = Dimensions.get("window");

export const CustomerRegistrationEditStyle = StyleSheet.create({
  scroll: { width: "100%" },
  view: { height: theme.space[20] },
  containerItem: {
    padding: theme.space[4],
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  viewTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.space[2],
  },
  title: { fontSize: theme.fontSizes[4], fontWeight: "900" },
  placeholder: { fontSize: theme.fontSizes[4], color: "#999999" },
  body: { flexDirection: "row", alignItems: "center" },
  txtInput: { fontSize: theme.fontSizes[3] },
  viewPicker: {
    flex: 1,
    alignItems: "flex-end",
    borderRadius: 12,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  viewTxtInput: { flex: 1, marginRight: theme.space[5] },
  warning: {
    backgroundColor: "red",
    paddingHorizontal: theme.space[3],
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.space[1],
    marginLeft: theme.space[4],
  },
  textWarning: { color: theme.colors.white },
  txtCompany: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[4],
  },
  avatar: {
    backgroundColor: "#FFBEBE",
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginRight: theme.space[4],
  },
  deploy: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  responsible: {
    padding: theme.space[3],
    borderRadius: 12,
    backgroundColor: theme.colors.gray200,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  viewNameImg: {
    flex: 1,
    backgroundColor: theme.colors.gray200,
    borderRadius: 16,
    paddingLeft: theme.space[5],
    paddingVertical: theme.space[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nameImg: {
    fontSize: theme.fontSizes[4],
    color: "#999999",
    marginRight: 10,
    flex: 7,
  },
  industry: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  industryItemTop: {
    borderBottomWidth: 1,
    padding: theme.space[3],
    borderBottomColor: "#E5E5E5",
  },
  industryItemBottom: {
    padding: theme.space[3],
  },
  textGray: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes[3],
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    marginBottom: 10,
  },
});
export const CustomerEditMilestoneStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtFontSize1: {
    fontSize: theme.fontSizes[1],
  },
  bold: {
    fontWeight: "700",
  },
  touchSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borRadius.borderRadius15,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    padding: theme.space[2],
  },
  iconArrow: {
    marginLeft: theme.space[5],
  },
  flatList: {
    paddingTop: theme.space[5],
  },
  viewTop: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[5],
  },
  btnRegistration: {
    padding: theme.space[3],
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    borderColor: "#E5E5E5",
    marginBottom: theme.space[4],
  },
  divider: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  colorRed: {
    backgroundColor: theme.colors.red600,
  },
});

export const CustomerItemMilestoneStyles = StyleSheet.create({
  container: {
    paddingBottom: theme.space[3],
    marginLeft: theme.space[6],
    borderLeftWidth: 2,
    paddingHorizontal: theme.space[4],
    borderColor: theme.colors.gray200,
    flex: 1,
  },
  removeBorder: {
    borderColor: theme.colors.white,
  },
  content: {
    borderRadius: theme.borRadius.borderRadius15,
    backgroundColor: theme.colors.gray200,
    padding: theme.space[3],
  },
  iconFlag: {
    height: 20,
    aspectRatio: 1,
  },
  icon: {
    height: 20,
    aspectRatio: 1,
    marginRight: theme.space[3],
  },
  btnContent: {
    padding: theme.space[1],
    paddingHorizontal: theme.space[4],
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius,
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtName: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.blue200,
    width: width * 0.39,
    fontWeight: "700",
    marginLeft: theme.space[1],
  },
  txtContent: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray,
  },
  imgEmployees: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    marginRight: theme.space[2],
  },
  viewImgEmployees: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: theme.colors.blue200,
    alignItems: "center",
    justifyContent: "center",
  },
  txtImg: {
    color: theme.colors.white,
  },
  line: {
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray250,
  },
  viewTasks: {},
  btnAddTask: {
    backgroundColor: theme.colors.white,
    flex: 1,
    padding: theme.space[3],
    alignItems: "center",
    borderRadius: theme.borRadius.borderRadius10,
    marginBottom: theme.space[6],
  },
  viewItemTask: {
    borderRadius: theme.borRadius.borderRadius15,
    backgroundColor: theme.colors.white,
    padding: theme.space[3],
    marginBottom: theme.space[6],
  },
  itemTaskActive: {
    backgroundColor: theme.colors.white300,
    borderColor: theme.colors.pink400,
    borderWidth: 3,
  },
  btnNotStart: {
    width: "30%",
    paddingVertical: theme.space[2],
    borderRadius: theme.borderRadius,
    alignItems: "center",
    backgroundColor: theme.colors.gray200,
  },
  btnView: {
    width: "32%",
    paddingVertical: theme.space[2],
    borderRadius: theme.borderRadius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
  },
  viewArrow: {
    alignItems: "center",
  },
  viewDot: {
    position: "absolute",
    zIndex: 2,
    left: -11,
    top: 0,
  },
  viewIconDot: {
    height: 20,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.blue200,
    backgroundColor: theme.colors.white,
  },
  colorRed: {
    color: theme.colors.red600,
  },
  iconDone: {
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    right: 0,
    height: 10,
    width: 10,
  },
});
