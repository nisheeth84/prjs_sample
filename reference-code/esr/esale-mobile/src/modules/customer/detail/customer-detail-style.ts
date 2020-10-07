import { StyleSheet } from "react-native";
import { themeCusomer } from "./shared/components/theme-customer";

export const CustomerDetailScreenStyles =  StyleSheet.create({
  container: {
    backgroundColor: themeCusomer.colors.gray200,
    fontSize: 14,
    color: themeCusomer.colors.black,
    flex: themeCusomer.flex.flex1,
  },
  messageStyle: {
    backgroundColor: themeCusomer.colors.white, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingBottom:5
  },
  textGray: {
    color: themeCusomer.colors.gray1
  },
  textBlack: {
    color: themeCusomer.colors.black
  },
  textSmall: {
    fontSize: 12,
    color: themeCusomer.colors.gray1
  },
  textBold: {
    fontWeight: "bold"
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: themeCusomer.colors.gray100,
  },
  boildLabel: {
    fontSize: 14,
    fontWeight: "bold"
  },
  defaultRow: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginTop10: {
    marginTop: 10
  },
  marginRight8: {
    marginRight: 8
  },
  paddingLeft5: {
    paddingLeft: 5
  },
  paddingLeft10: {
    paddingLeft: 10
  },
  backgroundWhite: {
    backgroundColor: themeCusomer.colors.white,
  },
  textLink: {
    color: themeCusomer.colors.blue200
  },
  badgeBlock: {
    position: "absolute",
    right: 6,
    width: 16,
    height: 16,
    backgroundColor: "red",
    fontSize: 8,
    color: "white",
    borderRadius: 16/2,
    justifyContent: "center",
  },
  badgeIcon: {
    textAlign: "center",
    color: "white",
    fontSize: 8,
  },
  rowIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTextBlock: {
    flex: 0.9
  },
  arrowRightIcon: {
    width: 8,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconTimeline: {
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  iconShare: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoCustomer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: themeCusomer.colors.gray100,
    backgroundColor: themeCusomer.colors.gray2
  },
  rightButtonBlock: {
    position:"absolute",
    top: 10,
    right: 15,
    flexDirection: "row",
    zIndex: 2
  },
  logo: {
    maxWidth: 100,
    maxHeight: 100,
    resizeMode: "contain",
  },
  textLogo: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    paddingLeft: 15,
    marginBottom: 15,
    flex: 1,
  },
  iconBlock: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 15
  },
  buttonDefault: {
    backgroundColor: themeCusomer.colors.white,
    borderRadius: 8,
    height: 32,
    textAlign: "center",
    borderWidth: 1,
    borderColor: themeCusomer.colors.gray100,
    justifyContent: "center",
  },
  textButton: {
    fontSize: 12,
    color: themeCusomer.colors.black,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  iconEdit: {
    marginLeft: 15,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconErase: {
    width: 14,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTabsBlock: {
    backgroundColor: themeCusomer.colors.white,
    flexDirection: "row",
    height: 46,
    borderBottomWidth: 1,
    borderColor: themeCusomer.colors.gray100,
  },
  titleTabsBlockFixed: {
    backgroundColor: themeCusomer.colors.white,
    flexDirection: "row",
    height: 46,
    position: "absolute",
    top: 75,
    left: 0,
    elevation: 3
  },
  titleTabContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textTab: {
    paddingHorizontal: 28
  },
  divideTab: {
    height: 30,
    borderRightWidth: 1,
    borderColor: themeCusomer.colors.gray100,
  },
  activeTab: {
    backgroundColor: themeCusomer.colors.blue100,
    borderColor: themeCusomer.colors.blue200,
    borderBottomWidth: 1,
    fontSize: 14,
    fontWeight: "bold"
  },
  contentBasicTab: {
    backgroundColor: themeCusomer.colors.gray200,
    marginBottom: 10
  },
  contentBasic: {
    marginBottom: 10,
    backgroundColor: themeCusomer.colors.white,
  },
  imageActivityHistoryInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePersonActivityHistory: {
    width: 36,
    height: 36
  },
  textPersionActivityHistory: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 50
  },
  contentTradingProduct: {
    backgroundColor: themeCusomer.colors.white,
  },
  labelContentTradingProduct: {

  },
  contentContactHistory: {
    backgroundColor: themeCusomer.colors.white,
  },
  contentSchedules: {

  },
  titleSchedule: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleBlock: {
    marginBottom: 10
  },
  scheduleRow: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 5
  },
  schedule: {
    backgroundColor: themeCusomer.colors.green100,
    borderRadius: 4,
    padding: 5,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: themeCusomer.colors.white,
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
  },
  fabIcon: {
    fontSize: 40,
    color: themeCusomer.colors.green3,
  },
  iconArrowBlock: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconArrowUpAndDown: {
    width: 12,
    height: 8
  },
  fabBlock: {
    height: 80,
    backgroundColor: themeCusomer.colors.white
  },
  activityIndicatorBlock: {
    marginVertical: 10
  },
  messageBlock: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  messageIcon: {
    alignSelf: "center",
    marginRight: 10
  },
  messageContent: {
    marginRight: 30
  },
  tradingItem: {
    height: 120,
    width: "100%",
    flexDirection: "row",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  viewLeft: {
    flex: 8,
    paddingLeft: "4%",
    justifyContent: "center",
    flexDirection: "column"
  },
  txtCompany: {
    fontSize: 14,
    fontWeight: "700"
  },
  txt: {
    fontSize: 12,
    color :"#666666"
  },
  viewRight: {
    flex: 1.6,
    flexDirection: "column",
  },
  styleText :{
    marginTop: 18,
  },
  arrowRightIconTradingProduct: {
    marginTop: 15,
    marginLeft: 45,
  },
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
  viewToast: {
    backgroundColor: '#D8F2E5',
    flexDirection:'row',
    borderRadius: 12,
  },
  avatar: { 
    width: 40, 
    height: 40,
    resizeMode: "contain", 
    alignItems: "center", 
    borderRadius: 50
  },
  wrapAvatar: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  bossAvatarText: {
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  employeeBlock: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3
  },
  titleScenario: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imageEmployee: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center'
  },
  backgroundAvatar: {
    backgroundColor: '#8AC891'
  },
  imageName: {
    fontSize: 16,
    color: '#FFFFFF',
    
  },
  btnStatusTask: {
    // marginLeft: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: "#D6E3F3",
    borderRadius: 10,
    position: "absolute",
    right: 10,
    top: 0
  },
  txtName: {
    fontSize: 14,
    color: themeCusomer.colors.blue200,
    fontWeight: "700",
    marginLeft: 4,
  },
  viewItemTask: {
    borderRadius: themeCusomer.borRadius.borderRadius15,
    backgroundColor: themeCusomer.colors.white,
    paddingLeft: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },
  imageTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3
  },
  imgEmployees: {
    width: 32,
    aspectRatio: 1,
    borderRadius: 16,
    marginRight: 8,
  },
  iconActive: {
    width: 20,
    height: 20
  }
})

export const ActionModalStyles =  StyleSheet.create({
  containerModal: {
    position: "absolute",
    flex:1,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: themeCusomer.borRadius.borderRadius30,
    backgroundColor: themeCusomer.colors.white,
  },
  item: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    color: themeCusomer.colors.black,
    borderBottomWidth: 1,
    borderColor: themeCusomer.colors.gray100,
  },
  borderBottomNone: {
    borderBottomWidth: 0
  }
})

export const TaskItemStyle = StyleSheet.create({
  customerName: {
    fontSize: 12,
    color: '#333333',
    padding: 2
  },
  taskName: {
    fontSize: 14,
    color: '#0F6DB5',
    padding: 2
  },
  finishDate: {
    fontSize: 10,
    color: '#333333',
    padding: 2
  },
  iconItem: {
    marginRight: 10
  },
  fakeIconMileStone:{
    width: 21
  },
  fakeIconSubtask:{
    width: 18
  },
  avatarName: {
    fontSize: 10,
    color: '#FFFFFF'
  },
  avatar: {
    height: 26,
    width: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  backgroundAvatar: {
    backgroundColor: '#8AC891'
  },
  backgroundMoreDetail: {
    backgroundColor: '#0F6DB5'
  },
  numberMoreEmployees: {
    fontSize: 10,
    color: '#FFFFFF'
  },
  disableTextButton: {
    color: '#999999',
    fontSize: 12
  },
  enableTextButton: {
    color: '#333333',
    fontSize: 12
  },
  enableButton: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8,
  },
  disableButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8
  },
  button: {
    width: 100,
    height:40,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  itemContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    marginLeft: 15,
    marginRight: 15,
  },
  itemHover: {
    borderColor: '#FDA7A7',
    borderWidth: 4,
    backgroundColor: '#FFEDED'
  },
  itemNormal: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
  }
  ,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10
  },
  iconContainer: {
    flexDirection: 'row',
    width: '50%'
  },
  avatarContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'flex-end',
  },
  status: {
    width: '100%',
    textAlign: 'right',
    color: '#333333',
    fontSize: 12
  },
  statusAndCustomerContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  popupConfirmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  popupConfirmContent: {
    width: 270,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 15
  },
  confirmTaskTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5
  },
  confirmTaskMessage: {
    fontSize: 14,
    color: '#333333',
    textAlign: "center",
    marginBottom: 20
  },
  confirmButtonContainer: {
    backgroundColor: '#0F6DB5',
    borderRadius: 10,
    height: 40,
    width: 235,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 20
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 12
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12
  },
  deleteButtonContainer: {
    backgroundColor: '#F92525',
    borderRadius: 10,
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: "center",
    borderColor: '#E5E5E5'
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 12
  },
  cancelButtonContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: "center",
    borderColor: '#E5E5E5'
  },
  deleteTaskButtonContainer: {
    flexDirection:'row',
    justifyContent: 'space-evenly',
    width: 270,
  },
  deleteTaskMessage: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center'
  },
  deleteTaskTitle: {
    color: '#333333',
    fontSize: 16
  },
  deleteConfirmContent: {
    width: 270,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between'
  },
  deleteTaskConfirmContent: {
    width: 270,
    height: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between'
  },
  cancelTaskButtonContainer: {
    height: 40,
    width: 235,
    alignItems: 'center',
    justifyContent: "center",

  },
  listEmployeesContent: {
    width: 270,
    height: 470,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50
  },
  closeButtonText: {
    color: '#333333',
    fontSize: 12
  },
  closeButton: {
    height: 40,
    width: 100,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonContainer: {
    height: 70,
    width: '100%',
    borderTopColor:'#707070',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth:1
  },
  infoEmployeeContainer: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#707070',
    width: '100%',
  },
  imageEmployeeContainer: {
    width: '15%',
    alignItems: 'center',
    justifyContent: "center"
  },
  imageEmployee: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center'
  },
  imageName: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  infoEmployeeTextContainer: {
    width: '80%',
    justifyContent: 'space-between',
    padding: 10
  },
  positionNameText:{
    color: '#666666',
    fontSize: 12
  },
  employeeNameText:{
    color: '#0F6DB5',
    fontSize: 12
  },
  errorContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#FED3D3',
    flexDirection: 'row',
    
  },
  errorMessage: {
    fontSize: 14,
    color: '#333333'
  },
  iconWarningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  errorMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusContainer: {
    width: '25%'
  },
  customerNameContainer: {
    width: '75%'
  },
  finishDateExpire: {
    fontSize: 10,
    color: '#FF0000'
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100
  }
});