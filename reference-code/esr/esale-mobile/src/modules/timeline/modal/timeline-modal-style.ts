import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height, width } = Dimensions.get("window");

export const TimelineModalSuggestionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "flex-end",
  },
  viewContent: {
    backgroundColor: theme.colors.white,
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
    minHeight: 200,
  },
  devider: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  viewInput: {
    backgroundColor: theme.colors.white200,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    marginVertical: theme.space[3],
    marginHorizontal: theme.space[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[3],
  },
  txtInput: {
    // color: theme.colors.gray,
    fontSize: theme.fontSizes[2],
    width: "80%",
  },
  viewBtn: {
    // backgroundColor: theme.colors.blue200,
    position: "absolute",
    zIndex: 1,
    flexDirection: "row",
    bottom: theme.space[5],
    width: "100%",
    justifyContent: "center",
  },
  btnStyle: {
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borderRadius,
    padding: theme.space[3],
    paddingHorizontal: theme.space[14],
    marginHorizontal: theme.space[2],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      zIndex: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 2,
  },
  btnActive: {
    backgroundColor: theme.colors.blue200,
  },
  txtBtn: {
    textAlignVertical: "center",
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray1,
  },
  txtBtnActive: {
    color: theme.colors.white,
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txt: {
    fontSize: theme.fontSizes[2],
    marginVertical: theme.space[1],
  },
  txtDepartment: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray1,
  },
  padding: {
    height: 70,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: theme.space[3],
  },
  viewClose: {
    height: 26,
    aspectRatio: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.gray1,
  },
  unSelected: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  viewTop: {
    height: 20,
    alignItems: "center",
  },
  view: {
    backgroundColor: theme.colors.gray1,
    borderRadius: theme.borRadius.borderRadius10,
    height: 5,
    width: width * 0.15,
  },
  txtTop: {
    fontSize: theme.fontSizes[2],
    width: width * 0.15,
  },
  btnCloseItem: {
    zIndex: 10,
    position: "absolute",
    top: theme.space[2],
    right: theme.space[5],
    backgroundColor: theme.colors.white,
    height: 20,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
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
  viewItemTop: {
    padding: theme.space[3],
    alignItems: "flex-end",
  },
  icon: {
    marginRight: theme.space[3],
  },
  rowAlignItemCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatlistHeight: {
    height: height * 0.45,
  },
  viewSendMail: {
    height: height * 0.6,
    padding: theme.space[4],
  },
});
