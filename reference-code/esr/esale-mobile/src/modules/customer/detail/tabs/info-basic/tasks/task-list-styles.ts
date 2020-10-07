import { StyleSheet } from "react-native";

export const TaskListStyles = StyleSheet.create({
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
    color: '#0F6CB5',
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
    backgroundColor: '#D5E2F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0F6CB5',
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
  },
  iconMemo: {
    height: 18
  },
});