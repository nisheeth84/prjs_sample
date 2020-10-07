import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { width, height } = Dimensions.get("window");

export const CustomerModalStyles = StyleSheet.create({
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
  divider: {
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
    padding: theme.space[2],
    paddingVertical: theme.space[1],
  },
  txtInput: {
    fontSize: theme.fontSizes[3],
    width: "90%",
  },
  viewBtn: {
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
    paddingVertical: theme.space[4],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtDepartment: {
    fontSize: theme.fontSizes[2],
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
    fontSize: theme.fontSizes[3],
    color: theme.colors.white200,
  },
  icon: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
});

export const CustomerModalConfirmStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.blackDeep,
  },
  viewContent: {
    padding: theme.space[5],
    backgroundColor: theme.colors.white,
    marginHorizontal: width * 0.15,
    borderRadius: theme.borderRadius,
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtTitle: {
    fontSize: theme.fontSizes[4],
    fontWeight: "700",
    textAlign: "center",
  },
  txtConfirm: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.white,
  },
  btn: {
    flex: 1,
    alignItems: "center",
  },
  btnConfirm: {
    flex: 1,
    borderRadius: theme.borderRadius,
    alignItems: "center",
    backgroundColor: theme.colors.blue200,
    paddingVertical: theme.space[3],
  },
});

export const CustomerModalListEmployeesStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.blackDeep,
  },
  viewContent: {
    paddingTop: theme.space[3],
    backgroundColor: theme.colors.white,
    marginHorizontal: width * 0.15,
    borderRadius: theme.borRadius.borderRadius15,
  },
  viewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.space[3],
    borderTopWidth: 1,
    borderColor: theme.colors.gray100,
  },
  flatList: {
    maxHeight: height * 0.45,
  },
  txt: {
    fontSize: theme.fontSizes[3],
  },
  txtPosition: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.blue200,
  },
  img: {
    height: 30,
    borderRadius: 15,
    aspectRatio: 1,
    marginRight: theme.space[3],
  },
  viewBtn: {
    borderTopWidth: 1,
    borderColor: theme.colors.gray100,
    paddingVertical: theme.space[4],
    alignItems: "center",
  },
  btn: {
    paddingVertical: theme.space[3],
    width: "50%",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    alignItems: "center",
    borderRadius: theme.borderRadius,
  },
});

export const SelectOrderSortStyes = StyleSheet.create({
  activeOrderSelect: {
    backgroundColor: "#D6E3F3",
    borderColor: "#0F6DB5",
  },
  inactiveOrderSelect: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
  },
  activeText: {
    color: "#0F6DB5",
  },
  inactiveText: {
    color: "#333333",
  },
  bold: {
    fontWeight: "normal",
  },
  boldTextButton: {
    fontWeight: "normal",
    marginLeft: 10
  },
  checkActiveIcon: {
    width: 32,
    height: 32
  },
  orderSelect: {
    flexDirection: 'row',
    width: (Dimensions.get("window").width * 1 / 4) - 16,
    height: 32,
    marginRight: 14,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonTypeSort: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconSort: {
    marginLeft: 5,
  }
})
export const ModalUpdateAutoStyles = StyleSheet.create({
  container: {
    margin: 20,
    zIndex: 9999,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    fontSize: theme.fontSizes[3],
    justifyContent: "center",
  },
  content: {
    color: theme.colors.black,
    marginTop: theme.space[5],
  },
  wrapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 30,
  },
});
