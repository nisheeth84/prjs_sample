import { StyleSheet, Dimensions } from "react-native";

export const CustomerListStyles = StyleSheet.create({
  containerED: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  
  containerF: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inforBlock: {
    paddingHorizontal: 17,
    paddingBottom: 21,
    // marginBottom: 12,
  },
  viewMessageStyle: {
    alignItems:"center",
    paddingBottom: 21
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  fristRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight:-7
  },
  date: {
    flexDirection: "row",
    fontSize: 10,
    color: "#333333",
  },
  iconBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconAddressButton: {
    marginHorizontal: 7,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEditButton: {
    width: 20,
    height: 20,
  },
  iconEditSelectedButton: {
    width: 28,
    height: 28,
  },
  iconFilterButton: {
    marginHorizontal: 7,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconDescendingButton: {
    width: 14,
    height: 20,
  },
  widthButtonStyle: {
    marginLeft: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOtherButton: {
    width: 20,
    height: 4,
  },
  listCard: {
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#FFFFFF",
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  },
  fabIcon: {
    fontSize: 40,
    color: "#38C07C",
  },

  viewFooter: {
    position: "absolute",
    flex:0.1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    flexDirection:"row",
    height:50,
  },
  buttonList: {
    width: Dimensions.get("window").width /3,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonList: {
    textAlign: "center",
    color: "#0F6DB5",
    fontSize: 14,
  },
  textButtonListSelect: {
    textAlign: "center",
    color: "#999999",
    fontSize: 14,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    position: "absolute",
    flex:1,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: "#FFFFFF",
    width: Dimensions.get("window").width - 50,
    borderRadius: 15,
  },
  heightModelContent411:{
    height: 411,
  },
  heightModelContent176:{
    height: 176.08,
  },
  modalContainerContentDelete: {
    alignItems: "center",
    justifyContent: "center", 
    flex: 1,
  },
  modalContentConfirmDelete: {
    width: Dimensions.get("window").width /1.2,
    height: Dimensions.get("window").height /1.5,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  modalContentConfirmDeleteTitle: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center", 
  },
  modalContentConfirmTitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom:15,
  },
  modalContentConfirmMessage: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  modalContentConfirmDeleteData: {
    flex: 5,
  },
  modalContentConfirmDeleteDataDesc: {
    flex: 5,
    backgroundColor: "#EDEDED",
    marginHorizontal: 10,
    borderRadius: 12,
  },
  modalContentConfirmDeleteDataDescItem: {
    flex: 2.5,
    paddingHorizontal: 15,
    
  },
  modalContentConfirmDeleteDataDescItemPaddingTop: {
    paddingTop: 10,
  },
  modalContentConfirmDeleteDataDescTitle: {
    color: "#333333",
    fontSize: 14,
  },
  modalContentConfirmDeleteDataDescCount: {
    paddingLeft: 20,
  },
  modalContentConfirmDeleteDataDescCountText: {
    color: "#333333",
    fontSize: 14,
    marginTop:5,
  },
  modalContentConfirmDeleteButton: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal:20
  },
  modalContentConfirmDeleteTouchableOpacity: {
    width: 118,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
  },
  modalContentConfirmDeleteTouchableOpacityBackgroundColor: {
    backgroundColor: "#F92525",
  },
  listCustomer: {
    flex: 1
  },
  contentContainerStyle: { paddingBottom: 118 },
  contentContainerEditStyle: { paddingBottom: 177 },
  viewToast: {
    backgroundColor: '#D8F2E5',
    flexDirection:'row',
    borderRadius: 12,
  },
  menuHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  menuDive: {
    backgroundColor: '#EDEDED',
    height: 10,
    width: '100%',
  }
});

export const CustomerListItemStyles = StyleSheet.create({
  inforCustomer: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: Dimensions.get('window').width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerItem: {
    marginHorizontal: 10,
  },
  name: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666666",
  },
  address: {
    fontSize: 12,
    color: "#666666",
  },
  mainInforBlock: {
    flexDirection: "row",
    width: Dimensions.get('window').width - Dimensions.get('window').width/6,
    alignItems: "center",
    paddingLeft: 12,
  },
  iconArrowRight: {
    width: 8,
    height: 12,
    justifyContent: "center",
  },
  iconUnchecked: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  inforCustomerIcon: {
    height: 100, 
    width: Dimensions.get('window').width/6, 
    justifyContent: "center", 
    alignItems: "center", 
  },
});

export const CustomerDetailStyles = StyleSheet.create({
  inforCustomerDetail: {
    width: Dimensions.get('window').width /4,
    height: 100,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  inforTextCustomerDetail: {
    textAlign: "center",
  }
});

export const CustomerConfirmDialogStyles = StyleSheet.create({
  viewModal: {
    alignItems:"center"
  },
  modalContentConfirmDelete: {
    paddingHorizontal:20,
    paddingVertical:25,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    width: "75%",
  },
  modalContentConfirmDeleteTitle: {
    marginTop: 5
  },
  modalContentConfirmTitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContentConfirmMessage: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 10
  },
  modalContentConfirmDeleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 30
  },
  modalContentConfirmDeleteTouchableOpacity: {
    width: 118,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
  },
  modalContentConfirmDeleteTouchableOpacityBackgroundColor: {
    backgroundColor: "#F92525",
  },
});

export const ModalStyles = StyleSheet.create({
  viewModal: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    height:57,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  viewModalRemoveBorderTop: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    height:57,
    borderTopWidth: 0,
    borderTopColor: "#E5E5E5",
  },
  viewModalTouchableOpacity:{
    height: 57, 
    width: Dimensions.get("window").width - 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonModal: {
    color: "#333333",
    fontSize: 16,
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
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

export const MessageErrorStyles = StyleSheet.create({
  messageBlock: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  messageIcon: {
    alignSelf: "center",
    marginRight: 10
  },
  messageContent: {
    marginRight: 30
  }
});

export const ActivityIndicatorLoadingStyles = StyleSheet.create({
  activityIndicatorBlock: {
    marginVertical: 10
  },
});

export const CustomerSortModalStyles = StyleSheet.create({
  modalContainerContentDelete: {
    flex:1,
    backgroundColor: "#FFFFFF",
  },
  viewContentHeader: {
    backgroundColor: "#FBFBFB",
    height: 55, 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  viewContentTitle: {
    color: "#333333",
    fontSize: 18,
  },
  viewContentButtonClose: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewContentSortAscAndDesc: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row", 
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  viewContentSortAscAndDescText: {
    color: "#333333",
    fontSize: 14,
  },
  viewContentSortAscAndDescViewButton: {
    flexDirection: "row", 
    alignItems: "center",
    width: "48%",
    justifyContent: "space-between",

  },
  viewContentSortAscAndDescIcon: {
    marginRight: 10
  },
  viewContentSortDivide: {
    height: 10,
    backgroundColor: "#EDEDED",
  },
  viewContentSortTypeData: {
    flexDirection: "row", 
  },
  viewContentSortTypeDataButton: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    height: 65,
    justifyContent: "space-between",
  },
  viewContentSortTypeDataText: {
    marginLeft: 10,
  }
});

export const appBarMenuStyles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: "#FBFBFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    color: "#333333",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconSearch: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
  },
});