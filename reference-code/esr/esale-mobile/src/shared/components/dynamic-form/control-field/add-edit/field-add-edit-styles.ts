import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../../../config/constants";
import { PlatformOS } from "../../../../../config/constants/enum";

export const FieldAddEditTextStyles = StyleSheet.create({
  container: {
    width: theme.spacePercent.spacePercent100,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  }
})

export const FieldAddEditEmailStyles = StyleSheet.create({
  container: {
    width: theme.spacePercent.spacePercent100,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  }
})

export const FieldAddEditTextareaStyles = StyleSheet.create({
  container: {
    width: theme.spacePercent.spacePercent100,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  },
  textareaInput: {
    textAlignVertical: 'top',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
})
/**
 * Define link field styles in add-edit case
 */
export const FieldAddEditLinkStyles = StyleSheet.create({
  linkStyle: {
    paddingVertical: Platform.OS === PlatformOS.IOS ? 10 : 0
  },
  container: {
    width: theme.spacePercent.spacePercent100,
    justifyContent: "center",
  },
  titleInput: {
    color: '#333333',
  },
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewInput: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10
  },
  textbox: {
    paddingHorizontal: 10,
    paddingTop: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  link: {
    color: theme.colors.blue200,
  }
})

export const FieldAddEditNumericStyles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  inputView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  requiredText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 10
  },
  textInput: {
    flexGrow: 1,
    marginRight: 5
  },
  currencyUnit: {
    color: '#666666',
    alignSelf: 'center'
  }
});

/**
 * Define dynamic field add/edit radio button styles
 */
export const FieldAddEditRadioStyles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  requiredText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 10
  },
  placeholder: {
    color: "#999999",
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 3,
  },
  modalList: {
    flex: 4,
    backgroundColor: 'white',
    borderRadius: 36,
    paddingTop: 20,
    paddingBottom: 30
  },
  modalListItem: {
    flexDirection: 'row',
    padding: 8
  },
  modalButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomStartRadius: 36,
    borderBottomEndRadius: 36,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    position: 'absolute',
    bottom: 0,
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalButtonTitleDisable: {
    color: '#999999'
  },
  modalButtonDisable: {
    backgroundColor: '#E5E5E5'
  },
  iconCheckView: {
    width: '10%',
    alignContent: "center",
    justifyContent: "center"
  },
  modalListItemLabel: {
    width: '90%',
    padding: 10,
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  error: {
    backgroundColor: '#FED3D3',
  },
  optionText: {
    color: "#333333",
    fontWeight: "bold"
  }
});

/**
 * Define phone number field styles in add-edit case
 */
export const FieldAddEditPhoneNumberStyles = StyleSheet.create({
  container: {
    width: theme.spacePercent.spacePercent100,
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    paddingHorizontal: 10,
    fontSize: 10
  }
})

export const FieldAddEditPulldownSingleStyles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  requiredText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 10
  },

  placeholder: {
    color: "#999999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 3,
  },
  modalList: {
    flex: 4,
    backgroundColor: 'white',
    borderRadius: 36,
    paddingTop: 20,
    paddingBottom: 30
  },
  modalListItem: {
    flexDirection: 'row',
    padding: 8
  },
  modalButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomStartRadius: 36,
    borderBottomEndRadius: 36,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    position: 'absolute',
    bottom: 0,
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  modalListItemPulldown: {
    width: '90%',
    padding: 10,
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  disableButton: {
    backgroundColor: '#E5E5E5',
    color: '#999999'
  },
  textBtnDisable: {
    color: '#999999'
  },
  optionText: {
    color: "#333333",
    fontWeight: "bold"
  }
});

export const FieldAddEditPulldownMultiStyles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  requiredText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 10
  },
  placeholder: {
    color: "#999999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 3,
  },
  modalList: {
    flex: 4,
    backgroundColor: 'white',
    paddingTop: 20,
    borderTopStartRadius: 36,
    borderTopEndRadius: 36,
  },
  modalListItem: {
    flexDirection: 'row',
    padding: 8
  },
  modalButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomStartRadius: 36,
    borderBottomEndRadius: 36,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    position: 'absolute',
    bottom: 0,
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  modalListItemPulldown: {
    width: '90%',
    padding: 10,
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  disableButton: {
    backgroundColor: '#E5E5E5',
    color: '#999999'
  },
  textBtnDisable: {
    color: '#999999'
  },
  optionText: {
    color: "#333333",
    fontWeight: "bold"
  }
});

export const FieldAddEditCheckboxStyles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333',
  },
  inputContainer: {
    marginTop: 10
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  requiredText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 10
  },
  placeholder: {
    color: '#999999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 3,
  },
  modalList: {
    flex: 4,
    backgroundColor: 'white',
    paddingTop: 20,
    borderTopStartRadius: 36,
    borderTopEndRadius: 36,
  },
  modalListItem: {
    flexDirection: 'row',
    padding: 8
  },
  modalButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomStartRadius: 36,
    borderBottomEndRadius: 36,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    position: 'absolute',
    bottom: 0,
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  modalListItemCheckbox: {
    width: '90%',
    padding: 10,
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  optionText: {
    color: "#333333",
    fontWeight: "bold"
  }
});

export const FieldAddEditTitleStyles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  flexDirectionRow: {
    flexDirection: 'row'
  },
  tltleLeft: {
    borderLeftWidth: 2,
    borderColor: '#0F6DB5',
    marginRight: 7
  }
})

export const FieldAddEditTimeStyles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: "#FFFFFF",
    fontSize: 10,
    paddingHorizontal: 10
  },
  dateColor: {
    color: "#333333",
    marginTop: 10,
  },
  padding10: {
    padding: 10
  },
})

export const FieldAddEditTabStyles = StyleSheet.create({
  colorContainer: {
    width: 4,
    backgroundColor: '#0F6DB5',
    marginRight: 10
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    marginVertical: 15
  },
  tabData: {
    paddingHorizontal: theme.space[4],
  },
  tabLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: theme.space[4],
  },
  header: {
    backgroundColor: '#0F6DB5',
    paddingRight: 4,
    marginRight: 5
  },
  tabLabel: {
    color: '#333333',
    fontWeight: 'bold'
  },
  touchableContainer: {
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  infoContainer: {
    width: '95%',
    padding: 15
  },
  textLabel: {
    color: '#666666'
  },
  iconContainer: {
    alignContent: 'center',
    justifyContent: 'center'
  },
  labelField99: {
    fontWeight: 'bold', 
    color: '#333333'
  }
})
export const FieldAddEditFileStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    paddingHorizontal: 10,
    color: '#FFFFFF',
    fontSize: 10
  },
  scrollViewViewAll: {
    height: '80%'
  },
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  labelInput: {
    marginTop: 10,
    marginLeft: 25
  },
  textPlaceholder: {
    color: '#999999'
  },
  selectedMultiContainer: {
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  labelSelectedFile: {
    color: '#333333',
    textAlign: 'center'
  },
  textAreaSelectedContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 5,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  fileName: {
    paddingLeft: 10,
    width: '80%',
    color: '#333333',
  },
  iconFile: {
    width: '10%',
    alignContent: "center",
    justifyContent: "center"
  },
  iconDeleteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  buttonViewAll: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
  }
})

export const FieldAddEditLookupStyles = StyleSheet.create({
  stretchView: {
    flex: 1,
    paddingBottom: 20
  },
  mainViewContainer: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  },
  label: {
    color: '#333333',
    fontWeight: 'bold'
  },
  infoView: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingBottom: 10,
    borderRadius: 10,
  },
  dynamicComponent: {
    marginLeft: 10,
    marginTop: 10
  },
  inputContainer: {
    margin: 20,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    flex: 5
  },
  inputSearchText: {
    width: '80%',
  },
  inputSearchTextData: {
    width: '90%',
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  suggestTouchable: {
    padding: 10,
    flex: 7
  },
  suggestText: {
    color: '#666666',
    fontSize: 12,
    paddingLeft: 10
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 2,
    display: 'flex',
  },
  touchableSelect: {
    borderColor: '#E5E5E5',
    borderBottomWidth: 1
  },
  labelInputCorlor: {
    color: '#666666',
  },
  labelInputData: {
    marginTop: 10,
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    padding: 10,
  },
  holderColor: {
    color: '#999999'
  },
  iconDelete: {
    fontSize: 24,
    color: '#999999'
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
})

export const FieldAddEditDateTimeStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    paddingHorizontal: 10,
    color: '#FFFFFF',
    fontSize: 10
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})

export const FieldAddEditAddressStyles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleSub: {
    color: '#333333'
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  viewInput: {
    borderColor: '#E5E5E5',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10
  },
  divider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: "#FFFFFF",
    fontSize: 10,
    paddingHorizontal: 10
  },
  postalCode: {
    marginVertical: 15,
    marginHorizontal: 10
  },
  addressName: {
    marginTop: 15,
    marginHorizontal: 10
  },
  buildingName: {
    marginTop: 15,
    marginHorizontal: 10
  },
  stretchView: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF'
  },
  inputContainer: {
    margin: 20,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    flex: 4
  },
  suggestionContainerNoData: {
  },
  inputSearchText: {
    width: '80%',
  },
  inputSearchTextData: {
    width: '90%',
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  suggestTouchable: {
    width: '100%',
    padding: 15,
  },
  suggestText: {
    color: '#000000',
    fontSize: 12
  },
  suggestTextDate: {
    color: '#333333',
    fontSize: 14
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalSelected: {
    flex: theme.flex.flex3,
    backgroundColor: '#000000',
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 2,
    display: 'flex',
    flex: 3
  },
  modalButton: {
    backgroundColor: "#0F6DB5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 12,
    elevation: 2,
    padding: 15,
    margin: 20,
    position: 'absolute',
    bottom: 0,
    width: '40%',
  },
  textButton: {
    color: theme.colors.white
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
  },
  touchableSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginTop: 10
  },
  touchableSelectNoData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  iconCheck: {
    marginRight: 15,
  },
  iconListDelete: {
    marginRight: 15,
    width: 24,
    height: 24
  },
  iconCheckAvatar: {
    width: '68%'
  },
  iconDelAvatar: {
    width: '32%',
    marginBottom: 24
  },
  iconCheckView: {
    width: '10%',
    alignContent: "center",
    justifyContent: "center"
  },
  labelInput: {
    marginTop: 10,
  },
  labelInputCorlor: {
    color: "#666666",
  },
  labelInputData: {
    marginTop: 10,
    color: "#333333",
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
  },
  iconDelete: {
    fontSize: 24,
    color: "#999999"
  },
  iconEmployee: {
    backgroundColor: '#FFBEBE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  iconDepart: {
    backgroundColor: '#FDACFD',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  iconGroup: {
    backgroundColor: '#AFE6CB',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  listIconSelected: {
    margin: 6,
    width: 42,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: 32,
    height: 32
  },
  textTrunc: {
    fontSize: 9,
    color: "#333333",
    paddingLeft: 5
  },
  deleteIcon: {
    width: 16,
    height: 16
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
    height: '100%'
  },
  textColorGray: {
    color: "#999999",
    marginTop: 10
  },
  textColorDefault: {
    marginTop: 10
  },
  marginTop10: {
    marginTop: 10
  }
})

export const FieldAddEditDateStyles = StyleSheet.create({
  container: {
    // width: "100%",
    // justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  titleColor: {
    color: "#333333",
    fontWeight: "bold"
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    paddingHorizontal: 10,
    color: '#FFFFFF',
    fontSize: 10
  },
  dateColor: {
    color: "#333333",
  },
  datePlaceholderColor: {
    color: "#999999",
  }
})

export const FieldAddEditCalculationStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  }
})

export const FieldAddEditOrganizationStyles = StyleSheet.create({
  stretchView: {
    alignSelf: 'stretch',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    color: '#333333'
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    paddingHorizontal: 10,
    fontSize: 10
  },
  flatListViewAll: {
    height: '90%'
  },
  textColor: {
    color: '#333333',
    fontWeight: "bold",
  },
  inputContainer: {
    margin: 20,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    flex: 5
  },
  inputSearchText: {
    width: '80%',
  },
  inputSearchTextData: {
    width: '90%',
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  suggestAvatar: {
    padding: 10,
    flex: 1,
  },
  suggestTouchable: {
    padding: 10,
    flex: 7
  },
  suggestText: {
    color: '#666666',
    fontSize: 12
  },
  suggestTextInfo: {
    color: '#333333',
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 2,
    display: 'flex',
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    elevation: 2,
    padding: 15,
    margin: 20,
    position: 'absolute',
    bottom: 0,
    width: '40%',
  },
  textButton: {
    color: '#FFFFFF'
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1
  },
  touchableSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginTop: 10
  },
  iconCheck: {
    marginRight: 15,
  },
  iconListDelete: {
    marginRight: 15,
    padding: 13
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  labelInput: {
    marginTop: 10,
  },
  labelInputCorlor: {
    //color: "#666666",
    color: "#999999"
  },
  labelInputCorlorAfter: {
    color: "#333333",
  },
  labelInputData: {
    color: "#333333",
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,

  },
  iconDelete: {
    color: "#999999"
  },
  iconEmployee: {
    backgroundColor: '#FFBEBE',
    width: '90%',
    aspectRatio: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconDepart: {
    backgroundColor: '#FDACFD',
    width: '90%',
    aspectRatio: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconGroup: {
    backgroundColor: '#AFE6CB',
    width: '90%',
    aspectRatio: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  iconImage: {
    width: '90%',
    aspectRatio: 1,
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  buttonViewAll: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
  }
})