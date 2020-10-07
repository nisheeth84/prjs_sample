import { StyleSheet, Dimensions, StatusBar } from "react-native";

export const DrawerLeftContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerBackgroundColor: {
    backgroundColor: "#E9F0F7",
  },
  removeHeaderBackgroundColor: {
    backgroundColor: "#FFFFFF",
  },
  divide: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  divide2: {
    height: 12,
    backgroundColor: "#EDEDED",
  },
  list: {
    padding: 16,
  },
  search: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 10
  },
  listItem: {
    padding: 16,
  },
  listItemHeader:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputStyle: {
    borderWidth: 0,
    borderRadius: 14,
    flex: 1,
    borderColor: "transparent",
    color:"#999999",
    fontSize: 14,
    paddingLeft: 20
  },
  inputEdit: {
    flex: 1,
    color: "#999999",
    fontSize: 14,
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  titleHeader: {
    fontWeight: "bold",
    fontSize: 18,
  },
  headerTouchableOpacity: {
    width: Dimensions.get("window").width,
  },
  titleList: {
    color: "#333333",
    fontWeight: "bold",
    fontSize: 14,
  },
  titleDisable: {
    color: "#999999",
    fontWeight: "bold",
    fontSize: 14,
  },
  titleListDisable: {
    color: "#999999",
    fontWeight: "600",
    fontSize: 14,
  },
  childListWrapper: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    width: 0.7*Dimensions.get("window").width
  },
  childList: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "600",
  },
  elementChildWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: 16,
  },
  elementChildWrapperMyList: {
    marginLeft: 16,
  },
  elementChild: {
    marginRight: 10,
    paddingVertical: 6,
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  iconEdit: {
    justifyContent: "center",
    width: 20,
    height: 20,
    marginHorizontal: 7,
  },
  iconRefresh:{
    justifyContent: "center",
    width: 21,
    height: 16,
    marginHorizontal: 40,
  },
  iconAddCircleOutline: {
    justifyContent: "center",
    width: 20,
    height: 20,
    marginHorizontal: 7,
  },
  dropdownHeader: {
    alignItems: "center",
  },
  dropdownHeaderSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconArrowDown: {
    marginRight: 16,
    width: 12,
    height: 8,
  },
  headerArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewItem: {
    marginLeft: 12,
  },
  viewItemList: {
    marginLeft: 16,
  },
  viewItemListFlexRow: {
    flexDirection: "row",
  },
  viewItemListFlexRowMarginTop: {
    marginTop: 5,
  },
  marginToprefresh: {
    marginTop: 20,
    paddingRight:5
  },
  viewIpuntEdit: {
    marginHorizontal:15,
    marginTop: 15,
  },
  viewIpuntDesc: {
    flexDirection: "row", 
    alignItems: "center",
  },
  iconClose: {
    width:14, 
    height:14,
  },
  divideInputEdit: {
    height: 1, 
    backgroundColor: "#E5E5E5", 
    marginRight:15,
    marginTop:0
  },
  viewIpuntCopy: {
    marginHorizontal:15, 
    marginTop: 20
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  titleModal: {
    color: "#333333",
    alignSelf: "center",
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalConfirmContainer: {
    flexDirection: "column"
  },
  modalContentConfirmMessage: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
  },
  footerModal: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});