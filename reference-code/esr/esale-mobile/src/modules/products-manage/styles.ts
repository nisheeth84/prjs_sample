import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../config/constants";
import { getScreenWidth } from "../../shared/util/app-utils";

const { width: screenWidth } = Dimensions.get("window");

export const headerStyles = StyleSheet.create({
  containerHeader: {
    backgroundColor: "white",
    // justifyContent: "space-between",
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[4],
    marginBottom: theme.space[2],
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
  },
  containerTitle: { justifyContent: "center" },
  title: { fontSize: theme.fontSizes[4], paddingTop: theme.space[2] },
  txtTime: {
    fontSize: theme.fontSizes[0],
    paddingVertical: theme.space[2],
  },
  containerIcon: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "red",
  },
  iconStyle: {
    resizeMode: "contain",
    padding: theme.space[1],
  },
});
export const itemTabStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    marginTop: theme.space[3],
    width: "100%",
    height: 46,
  },
  txtBlue: {
    textAlign: "center",
    color: theme.colors.blue200,
  },
  txtNumberOfProducts: {
    fontSize: theme.fontSizes[0]
  },
  txtBlack: {
    textAlign: "center",
    color: theme.colors.black,
  },
  boxTab: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
    marginTop: 0,
    backgroundColor: "transparent",
    marginLeft: -40,
    width: screenWidth / 2.5,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray100,
    zIndex: 49,
    bottom: 0,
    position: "absolute",
  },
  titleTab: {
    position: "absolute",
    zIndex: 50, marginLeft: "32%"
  },
  solidView: {
    height: 1,
    width: "80%",
    backgroundColor: theme.colors.blue200,
    zIndex: 50,
    bottom: 0,
    position: "absolute",
  },

  rectangleView: {
    width: "84%",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    borderColor: "black",
    zIndex: 2,
    borderTopColor: theme.colors.gray100,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  rectangleViewActive: {
    backgroundColor: theme.colors.blue100,
    borderBottomColor: theme.colors.blue200,
  },
  rectangleViewInactive: {
    backgroundColor: "white",
    borderBottomColor: theme.colors.gray100,
  },
  triangleView: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 21,
    borderRightWidth: 21,
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "90deg" }],
    margin: 0,
    marginLeft: -14,
    borderWidth: 0,
    zIndex: 2,
  },
  triangleViewInactive: {
    borderBottomColor: "white",
  },
  triangleViewActive: {
    borderBottomColor: theme.colors.blue100,
  },
  borderTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 23,
    borderRightWidth: 23,
    borderBottomWidth: 17,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: theme.colors.gray100,
    transform: [{ rotate: "90deg" }],
    margin: 0,
    zIndex: 1,
    marginLeft: -43,
    borderWidth: 0,
  },
  lastView: {
    zIndex: -1,
    position: "absolute",
    width: getScreenWidth(),
    height: 46,
    right: 0,
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderTopColor: theme.colors.gray100,
    marginLeft: -24
  },
});
export const listProductStyles = StyleSheet.create({
  containerProduct: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray100,
    paddingHorizontal: theme.space[5],
  },
  marginTabEditActive: {
    marginBottom: 62,
  },
  marginTabEdit: {
    marginBottom: 0,
  },
  boxText: {
    flex: 1,
    paddingVertical: theme.space[3],
    alignItems: "flex-start",
  },
  iconArrow: {
    resizeMode: "contain",
    marginVertical: theme.space[6],
  },
  checkBoxStyle: {
    borderColor: theme.colors.gray200,
  },
  txtCustomerName: {
    flex: 1,
    flexWrap: "wrap",
    color: theme.colors.blue200
  },
  txtProgressName: {
    paddingHorizontal: theme.space[6]
  },
  txtProductName: {
    color: theme.colors.black
  },
  txtProductsInfo: {
    color: theme.colors.gray1,
  },
  txtLink: {
    color: theme.colors.blue200,
  },
  txtProductNameBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  viewSwipe: {
    flex: 1,
    width: "100%",
  },
  viewSwipenull: {
    flex: 1,
    width: "0%",
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
});
export const tabEditStyles = StyleSheet.create({
  containerTabEdit: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "stretch",
    width: "100%",
    height: 62,
    position: "absolute",
    bottom: 20,
    borderTopWidth: 2,
    borderTopColor: theme.colors.gray200,
  },
  itemTabEditLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  itemTabEditRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  itemBetweenTabEdit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txtTabEdit: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[1],
    marginHorizontal: theme.space[3],
  },
});
export const ProductDetailStyle = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  itemStyle: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
  },
  txtTitle: {
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[5],
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
    color: theme.colors.black,
  },
  txtValue: {
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[2],
    paddingBottom: theme.space[5],
    fontSize: theme.fontSizes[2],
  },
  txtValueBlue: {
    color: theme.colors.blue200,
  },
  txtValueGray: {
    color: theme.colors.gray300,
  },
});
export const DrawerProductTradingStyles = StyleSheet.create({
  headerSearch: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.space[3],
    paddingVertical: theme.space[3],
  },
  showListTradingCustomerStyle: {
    marginRight: theme.space[3],
  },
  dropView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  btnTextSelected: {
    backgroundColor: theme.colors.blue100,
  },
  txtTitle: {
    fontSize: 18,
  },
  txtSelected: {
    color: theme.colors.blue200,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[4],
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
  },
  txtNormal: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[4],
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
  },
  boxTextInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    paddingHorizontal: theme.space[3],
    marginHorizontal: theme.space[3],
  },
  textInput: {
    flex: 1,
    borderColor: "white",
  },
  icon: {
    height: theme.space[5],
    width: theme.space[5],
    resizeMode: "contain",
  },
  hitSlop: {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
  },
  boxListTrading: {
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[3],
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
  },
  txtTradingName: {
    paddingTop: theme.space[4],
    paddingLeft: theme.space[5],
  },
  containerHeader: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
    justifyContent: "center",
    height: 55,
  },
});
export const CommonStyles = StyleSheet.create({
  boxRowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boxRowCenterVertical: {
    flexDirection: "row",
    alignItems: "center",
  },
});
