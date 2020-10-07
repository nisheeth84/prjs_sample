import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../../../config/constants";
import { PlatformOS } from "../../../../../config/constants/enum";

export const FieldSearchTextStyles = StyleSheet.create({
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: theme.colors.blackDeep,
  },
  textDefaultColor: {
    color: '#333333'
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaces.space15,
    paddingBottom: theme.spaces.space15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: theme.flex.flex1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: theme.flex.flex7,
    flexDirection: 'row',
    padding: theme.spaces.space5,
    borderRadius: theme.spaces.space10,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: theme.flex.flex3,
    paddingHorizontal: theme.spaces.space3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: theme.spaces.space1,
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    bottom: theme.spaces.space0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5"
  },
  textButton: {
    color: theme.colors.white
  },
  textButtonDisable: {
    color: '#999999'
  },
  inputTextSearch: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    width: theme.spacePercent.spacePercent95,
    alignSelf: 'center',
    marginBottom: theme.spaces.space10,
    padding: theme.spaces.space2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    marginBottom: theme.spaces.space10
  },
  fieldInputText: {
    flex: theme.flex.flex1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: theme.flex.flex2,
    justifyContent: 'center',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  fieldName: {
    paddingBottom: theme.spaces.space10,
    paddingTop: theme.spaces.space10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: theme.flex.flex5,
    justifyContent: 'flex-start',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  iconSelected: {
    marginHorizontal: theme.spaces.space10
  },
  labelOption: {
    padding: theme.spaces.space10,
    color: '#333333'
  },
  labelSearch: {
    padding: theme.spaces.space15,
    color: '#333333'
  },
  placeholderSearchText: {
    color: '#999999'
  }
})

export const FieldSearchEmailStyles = StyleSheet.create({
  placeholderSearchEmail: {
    color: '#999999'
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  textDefaultColor: {
    color: '#333333'
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: theme.colors.blackDeep,
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaces.space15,
    paddingBottom: theme.spaces.space15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: theme.flex.flex1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: theme.flex.flex7,
    flexDirection: 'row',
    padding: theme.spaces.space5,
    borderRadius: theme.spaces.space10,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: theme.flex.flex3,
    paddingHorizontal: theme.spaces.space3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: theme.spaces.space1,
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    bottom: theme.spaces.space0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5"
  },
  textButton: {
    color: theme.colors.white
  },
  textButtonDisable: {
    color: '#999999'
  },
  inputEmailSearch: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    width: theme.spacePercent.spacePercent95,
    alignSelf: 'center',
    marginBottom: theme.spaces.space10,
    padding: theme.spaces.space2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    marginBottom: theme.spaces.space10
  },
  fieldInputText: {
    flex: theme.flex.flex1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: theme.flex.flex2,
    justifyContent: 'center',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  fieldName: {
    paddingBottom: theme.spaces.space10,
    paddingTop: theme.spaces.space10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: theme.flex.flex5,
    justifyContent: 'flex-start',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  iconSelected: {
    marginHorizontal: theme.spaces.space10
  },
  labelOption: {
    padding: theme.spaces.space10,
    color: '#333333'
  },
  labelSearch: {
    padding: theme.spaces.space15,
    color: '#333333'
  }
});
/**
* Define textarea field styles in search case
*/
export const FieldSearchTextareaStyles = StyleSheet.create({
  placeholderSearchTextarea: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5
  },
  textDefaultColor: {
    color: '#333333',
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: theme.colors.blackDeep,
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: theme.spaces.space1,
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    bottom: theme.spaces.space0,
    position: 'absolute'
  },
  textButton: {
    color: theme.colors.white
  },
  inputTextareaSearch: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    width: theme.spacePercent.spacePercent95,
    alignSelf: 'center',
    marginBottom: theme.spaces.space10,
    padding: theme.spaces.space2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    marginBottom: theme.spaces.space10
  },
  fieldName: {
    paddingBottom: theme.spaces.space10,
    paddingTop: theme.spaces.space10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: theme.flex.flex5,
    justifyContent: 'flex-start',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  iconSelected: {
    marginHorizontal: theme.spaces.space10
  },
  labelOption: {
    padding: theme.spaces.space10,
    color: '#333333'
  },
  labelSearch: {
    padding: theme.spaces.space15,
    color: '#333333'
  },
})
/**
 * Define link field styles in search case
 */
export const FieldSearchLinkStyles = StyleSheet.create({
  placeholderSearchLink: {
    color: '#999999'
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: theme.colors.blackDeep,
  },
  textDefaultColor: {
    color: '#333333'
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaces.space15,
    paddingBottom: theme.spaces.space15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: theme.flex.flex1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: theme.flex.flex7,
    flexDirection: 'row',
    padding: theme.spaces.space5,
    borderRadius: theme.spaces.space10,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: theme.flex.flex3,
    paddingHorizontal: theme.spaces.space3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: theme.spaces.space1,
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    bottom: theme.spaces.space0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5"
  },
  textButton: {
    color: theme.colors.white
  },
  textButtonDisable: {
    color: '#999999'
  },
  modalSearchDetail: {
    flex: theme.flex.flex8,
  },
  inputLinkSearch: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    width: theme.spacePercent.spacePercent95,
    alignSelf: 'center',
    marginBottom: theme.spaces.space10,
    padding: theme.spaces.space2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    marginBottom: theme.spaces.space10
  },
  fieldInputLink: {
    flex: theme.flex.flex1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: theme.flex.flex2,
    justifyContent: 'center',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  fieldName: {
    paddingBottom: theme.spaces.space10,
    paddingTop: theme.spaces.space10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: theme.flex.flex5,
    justifyContent: 'flex-start',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  iconSelected: {
    marginHorizontal: theme.spaces.space10
  },
  labelOption: {
    padding: theme.spaces.space10,
    color: '#333333'
  },
  labelSearch: {
    padding: theme.spaces.space15,
    color: '#333333'
  }
})

export const FieldSearchNumericStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5
  },
  blackText: {
    color: '#333333'
  },
  placeholderSearchNumeric: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  },
  modalHeader: {
    flex: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionText: {
    padding: 15,
    color: '#333333'
  },
  modalOptionIcon: {
    marginHorizontal: 15
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: 7,
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingRight: 5
  },
  modalOptionCurrency: {
    paddingVertical:5,
    color: '#666666',
    alignContent: 'center',
    marginBottom: Platform.OS === PlatformOS.ANDROID ? 1 : 0,
  },
  modelOptionRangeLabel: {
    flex: 3,
    paddingHorizontal: 3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
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
    bottom: 0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: '#E5E5E5'
  },
  modalButtonTitleDisable: {
    color: '#999999'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalTextInput: {
    height: 40,
    flex: 1,
    textAlign: 'left'
  },
  currencyUnit: {
    flex: 1,
    paddingVertical: 10,
    textAlign: "right" 
  }
});

export const FieldSearchPhoneNumberStyles = StyleSheet.create({
  placeholderSearchPhoneNumber: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textTitle: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: theme.colors.blackDeep,
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaces.space15,
    paddingBottom: theme.spaces.space15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: theme.flex.flex1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: theme.flex.flex7,
    flexDirection: 'row',
    padding: theme.spaces.space5,
    borderRadius: theme.spaces.space10,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: theme.flex.flex3,
    paddingHorizontal: theme.spaces.space3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: theme.spaces.space1,
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    bottom: theme.spaces.space0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5"
  },
  textButton: {
    color: theme.colors.white
  },
  textButtonDisable: {
    color: '#999999'
  },
  inputPhoneNumberSearch: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    width: theme.spacePercent.spacePercent95,
    alignSelf: 'center',
    paddingLeft: theme.spaces.space10,
    marginBottom: theme.spaces.space10,
    padding: theme.spaces.space2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray100,
    borderWidth: theme.spaces.space1,
    marginBottom: theme.spaces.space10
  },
  fieldInputPhoneNumber: {
    flex: theme.flex.flex1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: theme.flex.flex2,
    justifyContent: 'center',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  fieldName: {
    paddingBottom: theme.spaces.space10,
    paddingTop: theme.spaces.space10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: theme.flex.flex5,
    justifyContent: 'flex-start',
    paddingLeft: theme.spaces.space10,
    paddingRight: theme.spaces.space10
  },
  iconSelected: {
    marginHorizontal: theme.spaces.space10
  },
  labelOption: {
    padding: theme.spaces.space10,
    color: '#333333'
  },
  labelSearch: {
    padding: theme.spaces.space15,
    color: '#333333'
  }
});

export const FieldSearchPulldownSingleStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  labelOption: {
    flex: 5
  },
  placeholderSearchPulldownSingle: {
    color: '#999999'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  },
  modalHeader: {
    flex: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionSearchType: {
    padding: 15,
    color: '#333333'
  },
  modalOptionIcon: {
    marginHorizontal: 15
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    bottom: 0,
    position: 'absolute'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalListButtonHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  modalViewBtnHeader: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15
  },
  modalBtnHeader: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10
  },
  textCenter: {
    textAlign: 'center'
  },
  modalContentSearchDetail: {
    flex: 4,
  },
  modalOptionSearchDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  modalListButtonFooter: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnBack: {
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnConfirm: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnDisable: {
    backgroundColor: '#E5E5E5'
  },
  textBtnDisable: {
    color: '#999999'
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
})

export const FieldSearchPulldownMultiStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5
  },
  labelOption: {
    flex: 5
  },
  blackText: {
    color: '#333333'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  placeholderSearchPulldownMulti: {
    color: '#999999'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2
  },
  modalContenOptionSearch: {
    flex: 2.5,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  modalHeader: {
    flex: 3,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleNOTOptionSearch: {
    paddingTop: 10,
    marginLeft: 10,
    color: '#333333'
  },
  modalOptionSearchType: {
    padding: 15,
    color: '#333333'
  },
  modalSearchOption: {
    padding: 10,
    color: '#333333'
  },
  titleModalOptionSearch: {
    paddingVertical: 10,
    color: '#333333'
  },
  modalListOptionSearch: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginHorizontal: 15
  },
  modalOptionIcon: {
    marginHorizontal: 10
  },
  modalOptionSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
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
    bottom: 0,
    position: 'absolute'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalListButtonHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  modalViewBtnHeader: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15
  },
  modalBtnHeader: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10
  },
  textCenter: {
    textAlign: 'center'
  },
  modalContentSearchDetail: {
    flex: 4,
  },
  modalOptionSearchDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  modalListButtonFooter: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnBack: {
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnConfirm: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnDisable: {
    backgroundColor: '#E5E5E5'
  },
  textBtnDisable: {
    color: '#999999'
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export const FieldSearchCheckboxStyles = StyleSheet.create({
  placeholderSearchCheckbox: {
    color: '#999999'
  },
  blackText: {
    color: '#333333',
  },
  labelOption: {
    flex: 5
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2
  },
  modalContenOptionSearch: {
    flex: 2.5,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  modalHeader: {
    flex: 3,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleNOTOptionSearch: {
    paddingTop: 10,
    marginLeft: 10,
    color: '#333333'
  },
  modalOptionSearchType: {
    padding: 15,
    color: '#333333'
  },
  modalSearchOption: {
    padding: 10,
    color: '#333333',
  },
  titleModalOptionSearch: {
    paddingVertical: 10
  },
  modalListOptionSearch: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginHorizontal: 15
  },
  modalOptionIcon: {
    marginHorizontal: 10
  },
  modalOptionSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    bottom: 0,
    position: 'absolute'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalListButtonHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  modalViewBtnHeader: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15
  },
  modalBtnHeader: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10
  },
  textCenter: {
    textAlign: 'center'
  },
  modalContentSearchDetail: {
    flex: 4,
  },
  modalOptionSearchDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  modalListButtonFooter: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnBack: {
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnConfirm: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnDisable: {
    backgroundColor: '#E5E5E5'
  },
  textBtnDisable: {
    color: '#999999'
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export const FieldSearchRadioStyles = StyleSheet.create({
  placeholderSearchRadio: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  labelOption: {
    flex: 5
  },
  title: {
    color: '#333333',
    fontWeight: 'bold'
  },
  blackText: {
    color: '#333333'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  },
  modalHeader: {
    flex: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionSearchType: {
    padding: 15,
    color: '#333333'
  },
  modalOptionIcon: {
    marginHorizontal: 15
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    bottom: 0,
    position: 'absolute'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalListButtonHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  modalViewBtnHeader: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15
  },
  modalBtnHeader: {
    backgroundColor: 'white',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    borderRadius: 10
  },
  textCenter: {
    textAlign: 'center'
  },
  modalContentSearchDetail: {
    flex: 4,
  },
  modalOptionSearchDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  modalListButtonFooter: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnBack: {
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnConfirm: {
    backgroundColor: '#0F6DB5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
  },
  btnDisable: {
    backgroundColor: '#E5E5E5'
  },
  textBtnDisable: {
    color: '#999999'
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
});

export const FieldSearchTimeStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold',
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 1,
  },
  placeholderLabel: {
    color: "#999999"
  },
  textLabel: {
    color: "#333333"
  },
  colorPlaceholder: {
    color: "#999999",
  },
  colorText: {
    color: "#333333",
  },
  modalContent: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionRange: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: "center",
  },
  modalTimeRangeFrom: {
    borderWidth: 1,
    borderRadius: 10,
    flex: 1.5,
    alignContent: 'flex-start',
    backgroundColor: "#F9F9F9",
    borderColor: "#E5E5E5",
    padding: 10,
    color: "#999999",
  },
  modalTimeRangeTo: {
    borderWidth: 1,
    borderRadius: 10,
    flex: 1.5,
    alignContent: 'flex-start',
    backgroundColor: "#F9F9F9",
    borderColor: "#E5E5E5",
    padding: 10,
    color: "#999999",
  },
  lableRange: {
    color: "#333333",
    flex: 1,
    textAlign: 'center',
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    bottom: 0,
    position: 'absolute'
  },
  modalSearchDetail: {
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  inputLinkSearch: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  borderOption: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  padding15: {
    padding: 15,
    color: '#333333'
  },
  marginHorizontal15: {
    marginHorizontal: 15
  },
  textButton: {
    marginHorizontal: 15,
    color: "white"
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    position: 'absolute',
    bottom: theme.spaces.space0,
  },
  textButtonDisable: {
    color: "#999999"
  },
  padding10: {
    padding: 10
  },
})

export const FieldSearchTitleStyles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: '#333333'
  }
})

export const FieldSearchCalculationStyles = StyleSheet.create({
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5
  },
  blackText: {
    color: '#333333'
  },
  placeholderSearchCalculation: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  },
  modalHeader: {
    flex: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalOptionText: {
    padding: 15,
    color: '#333333'
  },
  modalOptionIcon: {
    marginHorizontal: 15
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: 7,
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  modalOptionCurrency: {
    color: '#666666',
    alignContent: 'center',
  },
  modelOptionRangeLabel: {
    flex: 3,
    paddingHorizontal: 3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
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
    bottom: 0,
    position: 'absolute'
  },
  modalButtonTitle: {
    color: 'white'
  },
  modalTextInput: {
    height: 40,
    width: '100%'
  },
});
export const FieldSearchRelationStyles = StyleSheet.create({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconRelation: {
    width: 24,
    height: 24
  },
  itemRelation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center"
  },
  relationLabelContainer: {
    flexDirection: 'row',
    borderColor: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal:16,
    borderBottomWidth:1,
    borderBottomColor: "#E5E5E5",
  },
  colorContainer: {
    width: 4,
    backgroundColor: '#0F6DB5',
    marginRight: 10
  },
  relationLabel: {
    color: '#333333',
    fontWeight: 'bold',
  },
  relationItemSearch: {
    paddingLeft: 5,
    paddingVertical: 5,
  },
  placeholderColor: {
    color: '#999999'
  },
  textColor: {
    color: '#333333'
  },
  relationItem: {
    borderBottomWidth:1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 15,
    paddingHorizontal:16
  },
  relationDriver: {
    borderBottomWidth:10,
    borderBottomColor: "#E5E5E5",
  }
});

/**
 * Define date field styles in search case
 */
export const FieldSearchDateStyles = StyleSheet.create({
  placeholder: {
    color: "#999999",
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
  },
  blackText: {
    color: '#333333'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalHeader: {
    flex: 1,
  },
  modalContent: {
    flex: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 2,
    display: 'flex',
    justifyContent: 'space-between',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalDivider: {
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: "#0F6DB5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: "40%",
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: "40%",
  },
  textButtonDisable: {
    color: "#999999"
  },
  textButton: {
    color: "#FFFFFF"
  },
  iconSelected: {
    marginHorizontal: 10
  },
  labelOption: {
    padding: 10
  },
  labelSearch: {
    padding: 15,
    color: "#333333",
    fontSize: 14
  },
  labelDetailSearch: {
    paddingLeft: 15,
    color: "#999999",
    paddingTop: 5,
    paddingBottom: 5,
  },
  labelPlaceholderSearch: {
    paddingLeft: 15,
    color: "#999999",
    paddingBottom: 5,
  },
  labelValueDate: {
    paddingLeft: 15,
    color: "#333333",
    paddingBottom: 5,
  },
  labelDetailSearchDay: {
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 10,
    color: "#333333",
  },
  pulldownMonthDay: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  pickerWith20: {
    width: "20%",
  },
  mgTop10: {
    marginTop: 10,
  },
  labelValue: {
    color: "#333333",
  },
  pickerItem: {
    width: "100%",
    marginLeft: 8
  },
  viewBoxFrom: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    flex: 1
  },
  viewBoxTo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginTop: 10,
    marginBottom: 5
  },
  viewBoxInput: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#F9F9F9",
    minWidth: 90,
    justifyContent: "center",
    alignItems: "center"
  },
  inputText: {
    minWidth: 45,
    textAlign: "right",
    marginRight: -8,
    marginVertical: Platform.OS === "ios" ? 10 : -5,
  },
  labelDay: {
    marginHorizontal: 10,
    maxWidth: 50,
    color: "#333333",
  },
  labelFromTo: {
    marginLeft: 10,
    color: "#333333",
  },
})

export const FieldSearchDateTimeStyles = StyleSheet.create({
  placeholder: {
    color: "#999999",
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalContent: {
    flex: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 2,
    display: 'flex',
    justifyContent: 'space-between',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalDivider: {
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: "#0F6DB5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 15,
    width: "40%",
  },
  modalButtonDisable: {
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: "40%",
  },
  textButtonDisable: {
    color: "#999999"
  },
  textButton: {
    color: "#FFFFFF"
  },
  iconSelected: {
    marginHorizontal: 16
  },
  labelOption: {
    padding: 10
  },
  labelSearch: {
    padding: 15,
    color: "#333333",
    fontSize: 14
  },
  labelDetailSearch: {
    paddingLeft: 15,
    color: "#999999",
    paddingTop: 5,
    paddingBottom: 5,
  },
  labelPlaceholderSearch: {
    paddingLeft: 15,
    color: "#999999",
    paddingBottom: 5,
  },
  labelValueDate: {
    paddingLeft: 15,
    color: "#333333",
    paddingBottom: 5,
  },
  labelDetailSearchDay: {
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 10,
    color: "#333333",
  },
  pulldownMonthDay: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  pickerWith20: {
    width: "20%",
  },
  mgTop10: {
    marginTop: 10,
  },
  labelValue: {
    color: "#333333",
  },
  title: {
    color: '#333333',
    fontWeight: "bold",
  },
  pickerItem: {
    width: "100%",
    marginLeft: 8
  },
  viewBoxFrom: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    flex: 1
  },
  viewBoxTo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginTop: 10,
    marginBottom: 5
  },
  viewBoxInput: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#F9F9F9",
    minWidth: 90,
    alignItems: "center"
  },
  inputText: {
    minWidth: 45,
    textAlign: "right",
    marginRight: -8,
    marginVertical: Platform.OS === "ios" ? 10 : -5,
  },
  labelDay: {
    marginHorizontal: 10,
    maxWidth: 50,
    color: "#333333",
  },
  labelFromTo: {
    marginLeft: 10,
    color: "#333333",
  },
  placeholderLabel: {
    color: "#999999",
    marginTop: 10
  },
  textLabel: {
    color: "#333333",
    marginTop: 10
  },
  colorPlaceholder: {
    color: "#999999",
  },
  colorText: {
    color: "#333333",
  },
  modalOptionRangeDate: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOptionFlex1: {
    flex: 1.5,
  },
  modalOptionRangeTime: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOptionRange: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    display: 'flex'
  },
  modalTimeRangeFrom: {
    flex: 3,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    borderColor: "#E5E5E5",
    padding: 10,
    color: "#999999",
  },
  modalTimeRangeTo: {
    flex: 3,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    borderColor: "#E5E5E5",
    padding: 10,
    color: "#999999",
  },
  lableRange: {
    flex: 1,
    textAlign: 'center',
    color: "#333333",
  },
  lableRangeDate: {
    flex: 2,
    textAlign: 'center',
    color: "#333333",
  },
  lableRangeView: {
    flex: 1,
    textAlign: 'right',
    color: "#333333",
  },
  modalSearchDetail: {
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  paddingTop0: {
    paddingTop: 0
  },
  inputLinkSearch: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  borderOption: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  padding15: {
    padding: 15
  },
  marginHorizontal15: {
    marginHorizontal: 15
  },
})
export const FieldSearchFileStyles = StyleSheet.create({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelTitle: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  resultSearch: {
    color: '#333333',
    fontWeight: 'bold',
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: 7,
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: 3,
    paddingHorizontal: 3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
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
    bottom: 0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: '#E5E5E5'
  },
  textButton: {
    color: '#FFFFFF'
  },
  textButtonDisable: {
    color: '#999999'
  },
  inputFileSearch: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    padding: 2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 10
  },
  fieldInputFile: {
    flex: 1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  fieldName: {
    color: '#333333',
    paddingBottom: 10,
    paddingTop: 10
  },
  fieldSearchOption: {
    flex: 5,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  iconSelected: {
    marginHorizontal: 10
  },
  labelOption: {
    color: '#333333',
    padding: 10
  },
  labelSearch: {
    color: '#333333',
    padding: 15
  },
  placeholderSearchFile: {
    color: '#999999'
  }
})

export const FieldSearchAddressStyles = StyleSheet.create({
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  placeholderColor: {
    color: '#999999'
  },
  textColor: {
    color: '#333333'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionRange: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  modalOptionValueContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  modalOptionValueInput: {
    flex: 7,
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modelOptionRangeLabel: {
    flex: 3,
    paddingHorizontal: 3,
    alignItems: 'center'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
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
    bottom: 0,
    position: 'absolute'
  },
  modalButtonDisable: {
    backgroundColor: '#E5E5E5'
  },
  textButton: {
    color: '#FFFFFF',
  },
  textButtonDisable: {
    color: '#999999'
  },
  inputTextSearch: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: "95%",
    alignSelf: 'center',
    marginBottom: 10,
    padding: 3,
    backgroundColor: '#F9F9F9',
  },
  borderOption: {
    borderRadius: 12,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    marginBottom: 10
  },
  fieldInputText: {
    flex: 1,
    justifyContent: 'center'
  },
  fieldSearchType: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  fieldName: {
    paddingBottom: 10,
    paddingTop: 10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: 5,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  iconSelected: {
    marginHorizontal: 10
  },
  labelOption: {
    padding: 10,
    color: '#333333'
  },
  labelSearch: {
    padding: 15,
    color: '#333333'
  }
})

export const FieldSearchOrganizationStyles = StyleSheet.create({
  placeholderSearchOrganization: {
    color: '#999999'
  },
  modalIcon: {
    alignSelf: 'center',
    margin: 10
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textDefault: {
    color: '#333333',
    fontWeight: 'bold',
    flex: 5,
  },
  iconSearchOption: {
    alignSelf: 'flex-end'
  },
  resultSearch: {
    color: '#333333',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalHeader: {
    flex: 3,
  },
  modalHeaderChooseBlank: {
    flex: 4,
  },
  modalHeaderOptionSearch: {
    flex: 4.6,
  },
  modalContent: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalDivider: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  modalButton: {
    backgroundColor: '#0F6DB5',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    bottom: 0,
    position: 'absolute'
  },
  textButton: {
    color: '#FFFFFF'
  },
  inputOrganizationSearch: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    padding: 2,
    backgroundColor: '#F9F9F9'
  },
  borderOption: {
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 10
  },
  fieldSearchType: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  fieldName: {
    paddingBottom: 10,
    paddingTop: 10,
    color: '#333333'
  },
  fieldSearchOption: {
    flex: 2,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12
  },
  iconSelected: {
    marginHorizontal: 10
  },
  labelOption: {
    padding: 10,
    color: '#333333'
  },
  labelSearch: {
    padding: 15,
    color: '#333333'
  }
})