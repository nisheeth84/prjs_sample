import { Dimensions, StyleSheet, Platform, NativeModules } from 'react-native';
import { theme } from '../../../config/constants';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const { StatusBarManager } = NativeModules;

export const GroupCommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10
  },
  buttonDisable: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  textButtonDisable: {
    color: '#999999',
  },
  button: {
    backgroundColor: '#0F6DB5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  textButton: {
    color: '#FFFFFF'
  },
  groupPadding: {
    paddingBottom: 20
  },
  wrapAlert: {
    paddingHorizontal: theme.space[3],
    paddingTop: 20,
    alignItems: "center"
  },
  iconStyle: {
    marginRight: theme.space[3],
  },
  divide20: {
    height: 20,
    backgroundColor: theme.colors.gray100,
  },
  messagesError: {
    marginTop: 10
  },
  titleGroupMove: {
    fontSize: theme.fontSizes[2],
    fontWeight: 'bold',
    marginTop: theme.space[3],
    marginLeft: theme.space[3],
    color: "#333333",
  },
  titleSelectGroupMove: {
    fontSize: theme.fontSizes[2],
    marginVertical: theme.space[1],
    marginLeft: theme.space[3],
    textAlign: "left"
  },
  ButtonSearchToMove: {
    marginTop: 10,
    color: '#333333',
    borderRadius: 13,
    borderColor: '#E5E5E5',
    backgroundColor: '#FBFBFB',
    marginHorizontal: theme.space[3],
    borderWidth: 1,
    paddingVertical: 8,
    paddingLeft: 3,
  },
  wrapGroup: {
    paddingHorizontal: theme.space[5],
    paddingVertical: theme.space[3],

  },
  wrapGroupItem: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapGroupItemOnly: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[5],
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapGroupItemLast: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[5],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.colors.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBorderTop: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 0,
  },
  itemBorderBottom: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 0,
  },
  labelText: {
    fontWeight: 'bold',
    color: '#333333'
  },
  divide1: {
    height: 1,
    backgroundColor: theme.colors.gray100,
  },
  wrapButton: {
    paddingHorizontal: theme.space[3],
    marginTop: theme.space[5],
  },
  labelHighlight: {
    marginLeft: theme.space[2],
    backgroundColor: theme.colors.red,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  labelTextHighlight: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.fontSizes[1],
  },
  wrapFormInput: {
    paddingTop: theme.space[6],
  },
  wrapFormInputError: {
    paddingTop: theme.space[6],
    backgroundColor: '#FFDEDE',
  },
  wrapFlex: {
    flex: 1,
  },
  wrapText: {
    flex: 1,
  },
  paddingTop: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT,
  },
  buttonSearch: {
    width: "94%",
    height: 0.062 * height,
    backgroundColor: "#fbfbfb",
    borderRadius: 8,
    marginTop: 12,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    justifyContent: "center"
  },
  textButtonSearch: {
    fontSize: 14,
    marginLeft: 10
  },
  viewDetailData: {
    alignSelf: "center",
    flexDirection: "row",
    borderColor: "#707070",
    borderRadius: 8,
    justifyContent: "space-between",
    marginTop: 18,
    alignItems: "center",
    paddingLeft:8,
  },
  textDataDetail: {
    marginLeft: 10
  },
  iconDeleteGroup: {
    marginRight: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flex: 4,
  },
  modalHeaderResult: {
    flex: 0.7,
  },
  modalContent: {
    flex: 1.5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  inputSearchTextData: {
    width: '90%',
  },
  inputSearchText: {
    width: '80%',
  },
  inputContainer: {
    margin: 15,
    backgroundColor: "#E5E5E5",
    paddingLeft: 10,
    borderColor: "#CDCDCD",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row'
  },
  itemResult: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkedIcon: {
    width: 20,
    height: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  titleGroup: {
    marginLeft: 15,
    marginVertical: 10
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  buttonConfirm: {
    alignItems: "center",
    backgroundColor: "#1F63EB",
    marginHorizontal: ((Dimensions.get('window').width / 2) - 70),
    marginTop: 15,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  buttonConfirmDisable: {
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    marginHorizontal: ((Dimensions.get('window').width / 2) - 70),
    marginTop: 15,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  iconListDelete: {
    marginRight: 15,
    width: 24,
    height: 24
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  wrapGroupSelected: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[7],
    paddingVertical: theme.space[5],
  },
  iconModal: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10
  },
  errorModal: {
    marginHorizontal: 15,
    color: "red",
    marginTop: 15
  },
  mainButton: {
    justifyContent: "center",
    alignItems: "center"
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  modalSuggetView: {
    paddingHorizontal: 12
  },
  viewTextGroup: {
    flex:8
  },
  viewIconDelete: {
    flex:1,
    paddingLeft:3,
    justifyContent:"center"
  }
});

export const GroupAddListMemberStyles = StyleSheet.create({
  title: {
    fontSize: theme.fontSizes[3],
    fontWeight: 'bold',
    margin: theme.space[3],
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingLeft: theme.space[3],
    borderRadius: theme.borderRadius,
    margin: theme.space[3],
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  divide: {
    height: 10,
    backgroundColor: theme.colors.gray100,
  },
  wrapSelectedItem: {
    paddingHorizontal: theme.space[2],
    paddingTop: theme.space[3],
    paddingBottom: theme.space[2],
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    position: 'absolute',
    bottom: 0,
    width,
    elevation: 4,
  }
});

export const AddToGroupStyles = StyleSheet.create({
  contentStyle: {
    fontWeight: 'bold',
  },
});

export const GroupCreateGroupStyles = StyleSheet.create({
  wrapInput: {
    padding: theme.space[3],
  },
  inputName: {
    marginTop: theme.space[2],
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
});

export const GroupCreateMyGroupStyles = StyleSheet.create({
  wrapFormInput: {
    paddingHorizontal: theme.space[3],
    paddingTop: theme.space[6],
  },
  labelName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewError: {
    backgroundColor: '#FFDEDE',
  },
  inputName: {
    marginTop: theme.space[2],
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
    padding: theme.space[3],
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paddingTop0: {
    paddingTop: 0,
  },
  loadingView: {
    paddingVertical:12
  }
});

export const GroupCreateShareGroupStyles = StyleSheet.create({
  wrapButton: {
    paddingHorizontal: theme.space[3],
    marginVertical: theme.space[5],
  },

  labelName: {
    paddingHorizontal: theme.space[3],
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputName: {
    margin: theme.space[3],
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
  inputNameError: {
    margin: theme.space[3],
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: '#FFDEDE',
  },
  wrapListParticipants: {
    marginHorizontal: theme.space[3],
  },
  bottomView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: theme.space[2],
  },
  suggestContent: {
    marginLeft: theme.space[3],
    marginTop: 10,
    marginBottom: 10,
  }
});

const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
  Math.random() * 256
)},${Math.floor(Math.random() * 256)})`;

export const GroupSelectedItemStyles = StyleSheet.create({
  container: {
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.space[2],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 5,
  },
  nameAvatar: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  removeIconWrapper: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    top: 0,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRemove: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    width: 6.5,
    height: 6.5,
  },
});

export const GroupMemberItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[4],
    marginBottom: theme.space[3],
    borderRadius: theme.borderRadius,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  elementLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color,
  },
  nameAvatar: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  contentWrapper: {
    marginLeft: theme.space[2],
  },
  titleText: {
    color: theme.colors.gray1,
  },
  contentText: {
    color: theme.colors.black,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  checkIcon: {
    width: 24,
    height: 24,
  },
});

export const GroupMoveToGroupStyles = StyleSheet.create({});
