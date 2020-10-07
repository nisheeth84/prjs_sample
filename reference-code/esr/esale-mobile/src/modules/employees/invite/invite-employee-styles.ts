import { StyleSheet, StatusBar, Dimensions } from "react-native";

export const InviteEmployeeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: StatusBar.currentHeight
  },
  wrapAlert: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 10,
  },
  iconStyle: {
    marginRight: 12,
  },
  iconErrorStyle: {
    marginRight: 5,
    marginLeft: 10
  },
  wrapButton: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  bottomView: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',

  },
  boldText: {
    fontWeight: 'bold',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
  },
  inviteMessageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6E3F3',
    borderRadius: 10,
    flex: 1,
  },
  imageMessageBox: {
    width: '10%',
    paddingLeft: 10,
  },
  viewContentMessageBox: {
    paddingRight: '11%',
    paddingTop: 10,
    paddingBottom: 30,
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  viewRegionErrorHidden: {
    display: 'none'
  },
  textMessageError: {
    margin: 5
  },
  iconLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  buttonPress: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10, 
    borderColor: "#0F6DB5",
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  textPress: {
    color: "#0f6db5",
    fontSize: 14,
    fontWeight: "bold"
  },
  viewButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems : "center",
    paddingVertical: 20
  }
});

export const InviteEmployeePackageModalStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  divide: {
    height: 10,
    backgroundColor: '#E5E5E5',
  },
  contentStyle: {
    fontWeight: 'bold',
  },
  wrapGroup: {
    paddingVertical: 12,
  },
  wrapGroupItem: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 12,
    margin: 12,
    marginTop: 24,
    borderRadius: 8,
  },
  wrapButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
  button: {
    paddingHorizontal: 70

  },
});

export const InviteEmployeeFormInviteStyles = StyleSheet.create({
  wrapFormInvite: {
    padding: 12,
    margin: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  formInvite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  wrapName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelHighlight: {
    marginLeft: 8,
    backgroundColor: '#F92525',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  firstName: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  firstNameEror: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFDEDE',
  },
  labelName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontWeight: 'bold',
  },
  labelTextHighlight: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lastName: {
    flex: 1,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inputName: {
    marginTop: 8,
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
  inputNameError: {
    marginTop: 8,
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: '#FFDEDE',
  },
  inputPlaceholderColor: {
    color: '#666666'
  },
  expandForm: {
    alignSelf: 'center',
    marginTop: 12,
    paddingTop: 5,
    height: 20,
    width: 20
  },
  divide: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  wrapInput: {
    padding: 12,
    paddingTop: 24,
  },
  wrapInputEror: {
    padding: 12,
    paddingTop: 24,
    backgroundColor: '#FFDEDE',
  },
  wrapCloseButton: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: -8,
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClose: {
    width: 10,
    height: 10,
  },
  viewRegionErrorHiden: {
    display: 'none'
  },
  viewRegionErrorShow: {
    backgroundColor: '#FFDEDE',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  }
});

export const InviteEmployeeDepartmentModalStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  divide: {
    height: 10,
    backgroundColor: '#E5E5E5',
  },
  contentStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    maxWidth: Dimensions.get("window").width - 80,
    margin: 10
  },
  wrapGroup: {
    paddingVertical: 12,
  },
  wrapGroupItem: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 12,
    margin: 12,
    marginTop: 24,
    borderRadius: 8,
  },
  wrapButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
});

export const InviteEmployeeConfirmStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: StatusBar.currentHeight,
  },
  wrapAlert: {
    alignItems: 'center',
    paddingVertical: 10
  },
  iconStyle: {
    marginRight: 12,
  },
  divide: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 20,
  },
  divideVisible: {
    display: 'none',
    backgroundColor: 'red',
  },
  divideTop: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,
    marginBottom: 12,
    marginTop: 15
  },
  labelText: {
    fontWeight: 'bold',
    color: '#333333',
    paddingLeft: 12,
    paddingTop: 24,
  },
  inputName: {
    marginTop: 4,
    borderWidth: 0,
    paddingLeft: 12,
    backgroundColor: 'transparent',
    color: '#666666',
  },
  buttonWrapper: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: '#FFFFFF',
    width: 160,
    borderRadius: 6,
  },
  button: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentMessage: {
    width: 155,
  }
});
