import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { width, height } = Dimensions.get("window");

export const BusinessCardRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  viewFragment: {
    borderColor: theme.colors.gray100,
    borderBottomWidth: 1,
    padding: theme.space[3],
  },
  txt: {
    fontSize: theme.fontSizes[2],
  },
  txtImage: {
    fontSize: theme.fontSizes[3],
  },
  viewPlaceholder: {
    flexDirection: "row",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[4],
    alignItems: "center",
  },
  viewTxtImg: {
    width: width * 0.6,
  },
  viewTxtPlaceholder: {
    width: width * 0.8,
  },
  viewBtnImage: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.white200,
    padding: theme.space[3],
  },
  viewImage: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    zIndex: 2,
    borderRadius: theme.borderRadius,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  txtPlaceholder: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes[2],
  },
  viewIcon: {
    paddingRight: theme.space[4],
  },
  icon: {
    marginRight: theme.space[3],
  },
  directionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewSwitch: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtRequired: {
    paddingHorizontal: theme.space[2],
    marginLeft: theme.space[1],
    marginTop: theme.space[1],
    backgroundColor: theme.colors.red600,
    color: theme.colors.white,
    borderRadius: theme.borderRadius,
  },
  padding: {
    height: theme.space[2],
  },
  viewHeader: {
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
  },
  viewBody: {
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  viewFooter: {
    borderWidth: 1,
    borderTopWidth: 0.5,
    borderBottomRightRadius: theme.borderRadius,
    borderBottomLeftRadius: theme.borderRadius,
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: theme.borderRadius,
    padding: theme.space[2],
    alignItems: "center",
  },
  txtButton: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray1,
  },
  viewHint: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 2,
    backgroundColor: "white",
    maxHeight: 100,
  },
  hitslop: {
    bottom: 20,
    top: 20,
    right: 20,
    left: 20,
  },
  btnClose: {
    height: theme.space[8],
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.space[4],
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.colors.gray100,
    borderWidth: 1,
  },
  image: {
    height: 185,
    width: "90%",
    marginTop: theme.space[2],
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white200,
    borderRadius: theme.borderRadius,
    justifyContent: "space-between",
  },
  viewItemSelected: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.space[3],
    marginBottom: theme.space[3],
    // marginHorizontal: theme.space[3],
    borderRadius: theme.borderRadius,
    justifyContent: "space-between",
    marginTop: theme.space[3]
  },
});

export const ModalSuggestionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "flex-end",
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
  viewContent: {
    backgroundColor: theme.colors.white,
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
    minHeight: 200,
    maxHeight: height * 0.6,
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
    marginVertical: theme.space[6],
    marginHorizontal: theme.space[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.space[3],
  },
  txtInput: {
    // color: theme.colors.gray,
    fontSize: theme.fontSizes[4],
    width: "90%",
  },
  viewBtn: {
    // backgroundColor: theme.colors.blue200,
    position: "absolute",
    zIndex: 1,
    bottom: theme.space[5],
    width: "100%",
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: theme.colors.blue200,
    borderRadius: theme.borderRadius,
    padding: theme.space[3],
    paddingHorizontal: theme.space[14],
  },
  txtBtn: {
    textAlignVertical: "center",
    color: theme.colors.white,
  },
  btnItem: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: theme.fontSizes[4],
  },
  txtDepartment: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray,
  },
  padding: {
    height: 70,
  },
  image: {
    height: 40,
    borderRadius: 20,
    aspectRatio: 1,
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
  txtClose: {
    fontSize: theme.fontSizes[5],
    color: theme.colors.white200,
  },
});
