import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height, width } = Dimensions.get("window");

export const BusinessCardStyles = StyleSheet.create({
  bg: { height: "100%" },
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray200,
  },
  inforBlock: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 21,
  },
  title: {
    fontSize: 19,
  },
  textModal: {
    fontSize: theme.fontSizes[4],
    textAlign: "center",
  },
  fristRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    flexDirection: "row",
    fontSize: theme.fontSizes[0],
  },
  empty: {
    fontSize: theme.fontSizes[3],
    marginRight: theme.space[4],
    lineHeight: theme.fontSizes[3],
  },
  iconBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconEditButton: {
    marginHorizontal: 7,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconFilterButton: {
    marginHorizontal: 7,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconDescendingButton: {
    marginHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOtherButton: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  listCard: {
    flex: 1,
    marginTop: theme.space[3],
    marginBottom: 100,
    paddingBottom: 10,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  viewFab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#ffff",
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
  },
  fab: { fontSize: 40, color: "#00CCAF" },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    width: width * 0.9,
  },
  tabbar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#b9b9b9",
  },
  btnTabbar: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
    justifyContent: "flex-end",
    height,
    width,
    alignItems: "center",
  },
  bgModal: {
    flex: 1,
    justifyContent: "flex-end",
    height,
    width,
  },
  bodyModal: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    borderRadius: 32,
    position: "absolute",
    bottom: 30,
  },
  separator: {
    backgroundColor: "#E5E5E5",
    height: 2,
    width: "100%",
  },
  btnRecord: {
    color: theme.colors.gray,
    fontSize: 18,
    lineHeight: 18,
  },
  btnDisRecord: {
    color: "blue",
    fontSize: 18,
    lineHeight: 18,
  },
  viewEmpty: {
    padding: theme.space[3],
    backgroundColor: theme.colors.blue100,
    marginHorizontal: theme.space[2],
    borderRadius: theme.space[4],
    flexDirection: "row",
  },
  iconWarning: { marginRight: 5 },
  textTabbar: {
    color: "blue",
    fontSize: 18,
    lineHeight: 18,
  },
  bgShadow: {
    flex: 1,
    height,
    width,
  },
  cardImg: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  iconClose: { margin: 15 },
  fabContainer: {
    width: "100%",
    position: "absolute",
    alignItems: "flex-end",
    right: theme.space[5],
  },
  hitslop: { top: 10, left: 10, right: 10, bottom: 10 },
});

export const BusinessCardItemStyles = StyleSheet.create({
  inforEmployee: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: theme.space[3],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    marginHorizontal: 10,
    flex: 1,
  },
  mainInforBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.15,
  },
  longPress: {
    backgroundColor: theme.colors.yellowDeep,
    borderWidth: 0.1,
    borderRadius: 7,
    borderColor: theme.colors.yellowDeep,
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginTop: 3,
    width: width/3.25
  },
  longPressText: {
    fontSize: 12,
    color: theme.colors.white,
    textAlign: "center",
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
    justifyContent: "flex-end",
    height,
    width,
    alignItems: "center",
  },
  btnClose: {
    justifyContent: "flex-end",
    width: "100%",
    position: "absolute",
    flexDirection: "row",
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    height: "25%",
    bottom: height * 0.37,
    flexDirection: "row",
  },
  btn: {
    height: " 100%",
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: " 100%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSwipe: {
    flexDirection: "row",
    flex: 1,
  },
  btnDrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: "100%",
    borderColor: theme.colors.gray100,
    paddingHorizontal: 5,
  },
  textBtn: {
    fontSize: theme.fontSizes[3],
    textAlign: "center",
  },
  viewSwipe: {
    width: "100%",
  },
  viewSwipenull: {
    width: "0%",
  },
  nameColor: { color: theme.colors.gray1 },
  txtRole: { fontWeight: "900" },
});

export const tabsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white100,
  },

  btnTabWrap: {
    flex: 1,
    flexDirection: "row",
  },
  btnTab: {
    padding: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    width: 110,
  },
  btnTabActive: {
    padding: theme.space[3],
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[11],
    backgroundColor: theme.colors.blue100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue200,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    flexDirection: "row",
  },
  btnTxt: {
    color: "black",
    fontSize: theme.fontSizes[1],
    textAlign: "center",
    paddingHorizontal: theme.space[2],
  },
  btnTxtActive: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[1],
    textAlign: "center",

    paddingHorizontal: theme.space[2],
  },
  countNoti: {
    top: theme.space[2],
    right: theme.space[2],
    backgroundColor: theme.colors.red,
    position: "absolute",
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.space[2],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
  },
  lineGray: {
    height: 30,
    width: 1,
    backgroundColor: theme.colors.gray200,
    position: "absolute",
    right: 0,
  },
});

export const activityHistoryStyle = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
  },
  containerList: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
  },
  boxHistory: {
    borderColor: theme.colors.gray200,
    borderWidth: 1,
  },
  boxHorizontal: {
    flexDirection: "row",
    paddingVertical: theme.space[5],
    paddingHorizontal: theme.space[4],
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxHorizontal2: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxHorizontal3: {
    flexDirection: "row",
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[4],
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerContent: {
    paddingVertical: theme.space[5],
    paddingHorizontal: theme.space[4],
  },
});
export const UploadImageModal = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 90,
    paddingHorizontal: 29,
  },
  btnBorderBlue: {
    borderColor: theme.colors.blue200,
    borderWidth: 1,
    borderRadius: theme.borRadius.borderRadius12,
    padding: theme.space[3],
    width: "60%",
    marginTop: 20,
    alignItems: "center",
  },
  txtBlue: {
    color: theme.colors.blue200,
  },
  txtStyle: {
    flex: 2,
    color: theme.colors.blue200,
  },
  iconStyle: { flex: 1 },
  containerBtn: {
    flexDirection: "row",
    paddingVertical: theme.space[4],
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: theme.colors.gray200,
  },
  txtTitle: {
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[7],
    fontSize: theme.fontSizes[3],
    textAlign: "left",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  content: {
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
    zIndex: 99,
    paddingVertical: 20,
    borderRadius: 5,
  },
});
