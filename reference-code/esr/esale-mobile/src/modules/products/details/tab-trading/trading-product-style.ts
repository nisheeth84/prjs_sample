import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
/**
 * Style product screen
 */
export const styles = StyleSheet.create({
  tradingItem: {
    height: 0.17 * height,
    flexDirection: "row",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    width: width,
  },
  viewLeft: {
    flex: 8,
    paddingLeft: "4%",
    justifyContent: "center",
    flexDirection: "column",
  },
  viewRight: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  price: {
    height: 53,
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    paddingLeft: 15
  },
  txtPrice: {
    color: "#333333",
    fontSize: 14,
    marginLeft: 15,
    fontWeight: "700",
  },
  txtApproach: {
    flex: 1,
    justifyContent: "center"
  },
  viewIconDetail: {
    flex: 1,
    alignItems: "center",
    marginLeft: 15
  },
  txtCompany: {
    fontSize: 14,
    fontWeight: "700"
  },
  txt: {
    fontSize: 12,
  },
  txtProduct: {
    fontSize: 14,
    color :"#333333"
  },
  viewSwipe: {
    width: "100%",
  },
  btnSwipe: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnDrop: {
    width: 0.25 * width,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: "100%",
    borderColor: "#E5E5E5",
    paddingHorizontal: 5,
  },
  textBtn: {
    fontSize: 10,
    textAlign: "center",
  },
  textTotal: {
    fontSize: 14,
    color :"#333333",
    fontWeight: "bold"
  },
  txtProcessName: {
    fontSize: 12,
    paddingBottom: 10,
    paddingTop:30
  },
  iconArrowRight: {
    flex: 2,
    marginLeft: 40
  }
});