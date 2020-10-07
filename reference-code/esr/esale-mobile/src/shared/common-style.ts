import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../config/constants";
import { getScreenWidth } from "./util/app-utils";
import { getScreenHeight } from "./util/utils";

const cycleIsPublic = theme.space[3];
const { width } = Dimensions.get("window");
export const CommonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  textBlack: {
    color: theme.colors.black,
  },
  flex9: {
    flex: 9,
  },
  flex2: {
    flex: 2,
  },
  padding2: {
    padding: theme.space[2],
  },
  padding4: {
    padding: theme.space[4],
  },

  bgWhite: {
    backgroundColor: theme.colors.white,
  },
  containerGray: {
    paddingTop: 0,
    backgroundColor: theme.colors.gray200,
    flex: 1,
  },
  imageSmall: {
    width: 24,
    height: 24
  },
  width100: {
    width: "100%",
  },

  width100center: {
    width: "100%",
    justifyContent: "center",
  },

  height100: {
    height: "100%",
  },

  full: {
    width: "100%",
    height: "100%",
  },

  font12: {
    fontSize: theme.fontSizes[1],
  },

  font14: {
    fontSize: theme.fontSizes[2],
  },

  font16: {
    fontSize: theme.fontSizes[3],
  },

  bold12: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[1],
  },

  bold14: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[2],
  },

  bold16: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },

  bold10: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[0],
  },

  bold18: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[4],
  },

  gray12: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[1],
  },

  gray14: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[2],
  },

  gray16: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[3],
  },

  black10: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[0],
  },

  black12: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[1],
  },

  black14: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[2],
  },

  black16: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[3],
  },

  blue12: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[1],
  },

  blue14: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
  },

  blue16: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[3],
  },

  white10: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[0],
  },

  white12: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[1],
  },

  white14: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[2],
  },

  white16: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[3],
  },

  row: {
    flexDirection: "row",
  },

  wrapContent: {
    alignSelf: "baseline",
  },

  hideIcon: {
    width: 30,
    height: 30,
  },

  rowAlignContentCenter: {
    flexDirection: "row",
    alignContent: "center",
  },

  rowAlignItemCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowJustifyContentCenter: {
    flexDirection: "row",
    justifyContent: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  messageWarningTop: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: theme.space[2]
  },

  messageWarning: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: theme.space[3],
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10000
  },

  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  activityIndicator: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: theme.space[4],
  },

  topInfoIconCopy: {
    height: 32,
    width: 32,
    justifyContent: "center",
  },

  textButton: {
    padding: theme.space[3],
  },

  commonButton: {
    height: 48,
  },

  imageInfo: {
    width: getScreenWidth() * 0.28,
    height: (3 / 5) * getScreenWidth() * 0.28,
    resizeMode: "cover",
    borderRadius: 5,
  },

  container: {
    paddingTop: 0,
    backgroundColor: theme.colors.white100,
  },

  containerWhite: {
    paddingTop: 0,
    backgroundColor: theme.colors.white,
  },

  roundViewPublic: {
    width: cycleIsPublic,
    height: cycleIsPublic,
    backgroundColor: "#88D9B0",
    borderRadius: cycleIsPublic / 2,
  },

  roundViewNotPublic: {
    width: cycleIsPublic,
    height: cycleIsPublic,
    backgroundColor: theme.colors.gray,
    borderRadius: cycleIsPublic / 2,
  },

  imageTitle: {
    flexDirection: "row",
    alignItems: "center",
  },

  floatButton: {
    width: theme.floatingButton,
    aspectRatio: 1,
    borderRadius: theme.floatingButton / 2,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: getScreenHeight() - theme.floatingButton - theme.space[18],
    right: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  floatButtonV2: {
    width: theme.floatingButton,
    aspectRatio: 1,
    borderRadius: theme.floatingButton / 2,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    right: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  drawerContainer: {
    width: width - 50,
  },
  floatButtonImage: {
    width: theme.space[6],
    height: theme.space[6],
  },
  textBold: {
    fontWeight: "bold",
  },
  generalInfoItem: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },
  backgroundTransparent: { backgroundColor: "transparent" },
  noPaddingLeft: { paddingLeft: 0 },

  //Top tab style

  btnTabWrap: {
    flex: 1,
    flexDirection: "row",
  },
  btnTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    flexDirection: "row",
    maxWidth: getScreenWidth() / 3,
  },

  btnTabActive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    backgroundColor: theme.colors.blue100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue200,
    flexDirection: "row",
    maxWidth: getScreenWidth() / 3,
  },

  btnTxt: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
  },
  btnTxtActive: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
  },
  countNoti: {
    backgroundColor: theme.colors.red,
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.space[2],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
    marginBottom: theme.space[4],
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
  },
  commonTab: {
    flex: 1,
    paddingVertical: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    height: theme.space[13],
  },

  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: theme.space[8],
  },

  tabContainer: {
    backgroundColor: theme.colors.white,
  },

  line: {
    borderBottomWidth: 1,
    width: "100%",
  },

  generalInfoItemV2: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  generalInfoItemPr: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  rowInlineEnd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  alignEnd: { alignItems: "flex-end" },

  rowInlineSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  commonLabel: {
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
  },
  radio: {
    width: 20,
    height: 20,
  },

  radioTitle: {
    marginHorizontal: theme.space[2],
  },

  commonPrLabel: {
    borderRadius: theme.borRadius.borderRadius4,
    padding: theme.space[1],
    flexWrap: "wrap",
  },

  hitSlop: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },

  topInfoIconShare: {
    height: 22,
    width: 22,
    justifyContent: "center",
    marginTop: 7,
    marginRight: 7,
  },
  topInfoIconShareActive: {
    height: 36,
    width: 36,
    justifyContent: "center",
  },

  headerIconLeft: {
    width: 12,
    height: 12,
  }
});

export const CommonModalStyles = StyleSheet.create({
  mainModalContainer: {
    backgroundColor: "#000000CC",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },

  mainModalContainerBottom: {
    backgroundColor: "#000000CC",
    height: "100%",
    justifyContent: "flex-end",
  },

  container: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[6],
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  containerNoPadding: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  title: {
    color: theme.colors.black,
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },

  title18: {
    color: theme.colors.black,
    fontWeight: "bold",
    fontSize: theme.fontSizes[4],
  },

  title18Left: {
    color: theme.colors.black,
    fontWeight: "bold",
    fontSize: theme.fontSizes[4],
    width: "100%",
  },

  titleGrayLeft: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[3],
  },

  titleGrayLeftBold: {
    color: theme.colors.gray1,
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },

  prTitleGrayLeft: {
    margin: theme.space[5],
    width: "100%",
    paddingHorizontal: theme.space[6],
  },

  content: {
    color: theme.colors.black,
    marginTop: theme.space[5],
    textAlign: "center",
    fontSize: theme.fontSizes[2],
  },

  content18: {
    color: theme.colors.black,
    marginTop: theme.space[5],
    textAlign: "center",
    fontSize: theme.fontSizes[4],
  },

  contentBold: {
    color: theme.colors.black,
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[2],
    textAlign: "center",
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
    borderTopColor: theme.colors.gray200,
    borderTopWidth: 1,
    width: "100%",
  },

  contentNormal: {
    color: theme.colors.black,
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[2],
    textAlign: "center",
    fontSize: theme.fontSizes[2],
    borderTopColor: theme.colors.gray200,
    borderTopWidth: 1,
    width: "100%",
  },

  contentNoMargin: {
    color: theme.colors.black,
    textAlign: "center",
    fontSize: theme.fontSizes[2],
  },

  contentConfirm: {
    color: theme.colors.black,
    textAlign: "center",
    fontSize: theme.fontSizes[2],
  },

  wrapButton: {
    flexDirection: "row",
    marginTop: theme.space[5],
  },

  wrapButtonVer: {
    marginTop: theme.space[5],
  },

  buttonCancel: {
    marginRight: theme.space[5],
    alignItems: "center",
    width: 100,
    paddingVertical: theme.space[3],
    fontWeight: "bold",
  },

  buttonCancel2: {
    marginRight: theme.space[5],
    alignItems: "center",
    paddingVertical: theme.space[3],
    fontWeight: "bold",
    flex: 1,
    justifyContent: "center",
  },

  touchableText: {
    marginRight: theme.space[3],
    alignItems: "center",
    paddingVertical: theme.space[3],
    fontWeight: "bold",
    fontSize: theme.fontSizes[2],
  },

  touchableTextPadding5: {
    marginRight: theme.space[3],
    alignItems: "center",
    paddingVertical: theme.space[5],
    fontWeight: "bold",
    fontSize: theme.fontSizes[2],
  },

  buttonDelete: {
    backgroundColor: theme.colors.red,
    alignItems: "center",
    paddingVertical: theme.space[3],
    borderRadius: theme.borderRadius,
    fontWeight: "bold",
    flex: 1,
  },

  buttonCancelBorder: {
    marginRight: theme.space[5],
    alignItems: "center",
    flex: 1,
    paddingVertical: theme.space[3],
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray100,
  },

  buttonDeleteMilestoneNotComplete: {
    backgroundColor: theme.colors.blue200,
    alignItems: "center",
    padding: theme.space[3],
    borderRadius: theme.borderRadius,
    marginTop: theme.space[3],
  },

  buttonTextCancel: {
    color: theme.colors.black,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },

  buttonTextCancelCenter: {
    color: theme.colors.black,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  buttonTextDelete: {
    color: theme.colors.white,
    fontWeight: "bold",
  },

  iconClose: {
    width: 24,
    height: 24,
    margin: theme.space[4],
  },
  modalTitlePadding5: {
    paddingVertical: theme.space[8],
    paddingHorizontal: theme.space[2],
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

export const ModalBoxStyles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
  },
  scroll: {
    marginBottom: 50,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998",
  },

  modal3: {
    height: 300,
    width: 300,
  },

  modal4: {
    height: getScreenHeight() / 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent",
  },

  text: {
    color: "black",
    fontSize: 22,
  },

});
