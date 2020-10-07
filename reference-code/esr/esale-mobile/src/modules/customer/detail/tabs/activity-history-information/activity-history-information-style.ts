import { StyleSheet, Dimensions } from "react-native";

export const ActivityHistoryInformationStyles =  StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#E9E9E9",
  },
  messageStyle: {
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  ActivityAll: {
    backgroundColor: "#FFFFFF",
  },
  flexContent: {
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 10
  },
  alignFlexCenter: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { 
    width: 40, 
    height: 40,
    resizeMode: "contain", 
    alignItems: "center", 
    borderRadius: 50
  },
  topContent: {
    width: "90%",
    paddingVertical: 10,
    paddingLeft:7,
    flexDirection: "column",
  },
  justifyCenter: {
    flexDirection: "row",
  },
  colorActive: {
    color: "#0F6DB5",
  },
  fontBold: {
    fontWeight: "bold",
    fontSize: 12
  },
  fontSize12: {
    fontSize: 12
  },
  fontSize10: {
    fontSize: 10
  },
  viewFlexContent: {
    width: "65%",
    flexDirection: "column"
  },
  viewFlexContentTime: {
    flexDirection: "row",
  },
  viewPaddingRight5: {
    paddingRight: 5
  },
  viewContentCreatedDateEditDelete: {
    width: "35%",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  editIcon: {
    paddingLeft: 7,
  },
  eraseIcon: {
    paddingLeft: 7,
  },
  generalIcon: {
    resizeMode: "contain",
    tintColor: "#999",
  },
  flexContentView: {
    flexDirection: "row", 
    flexWrap: "wrap",
    textAlign: "center",
    justifyContent: "flex-start"
  },
  productList: {
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  titleProduct: {
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    width: "20%",
  },
  contentProduct: {
    justifyContent: "flex-start",
    paddingRight: 20,
    width: "80%",
  },
  pdBottom: {
    paddingBottom: 5,
  },
  labelIem: {
    fontWeight: "bold",
    fontSize: 12,
    paddingLeft: 10,
  },
  flexContentViewProduct:{
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconUserSmall: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 5,
    borderRadius: 50,
  },
  iconRun: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  flexContentViewProductBottom: {
    paddingHorizontal:10,
  },
  bottomActivity: {
    minHeight: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderTopColor: "#E4E4E4",
    borderTopWidth: 1,
  },
  flexDRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "10%",
    height: "50%",
    justifyContent: "center",
  },
  iconBottom: {
    width: 12,
    height: 12,
    resizeMode: "contain",
  },
  comment: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 12,
  },
  iconQuote:{
    width: 10.5,
    height: 9.5,
    resizeMode: "contain",
  },
  mrBottom: {
    marginBottom: 10,
  },

  // modal
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  titleModal: {
    alignSelf: "center",
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: "bold",
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
  btnCancel: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 150,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
  },
  btnConfirmDelete: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:"#F92525",
    backgroundColor:"#F92525",
  },
  textCancel: {
    fontSize: 12,
    color: "#333333",
    textAlign: "center",
  },
  textConfirmDelete: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  marginHorizontalTextIconNextSchedule: {
    marginHorizontal: 5,
  },
  iconLabelStyle: {
    backgroundColor: "#ffd633",
    paddingHorizontal: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  iconLabelStyleText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  iconLabelNormal: {
    marginHorizontal: 10,
    justifyContent: 'center',
  }
})

export const MessageErrorAndSuccessStyles =  StyleSheet.create({
  messageErrorBlock: {
    margin: 10,
    padding: 10,
  },
  messageErrorIcon: {
    width: Dimensions.get('window').width/2,
    height: Dimensions.get('window').height/6,
    alignSelf: "center",
  },
  messageErrorContent: {
    alignSelf: "center",
  },
  messageBlock: {
    flexDirection: "row",
    margin: 20,
    padding: 10,
    borderRadius: 10,
    bottom: 0,
  },
  messageIcon: {
    alignSelf: "center",
    marginRight: 10
  },
  messageContent: {
    marginRight: 30
  }
})