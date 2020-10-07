import { StyleSheet } from 'react-native';
import { theme } from '../../../../../../../../config/constants/theme';

/**
 * Styles of components in folder employee
 */
const EmployeeSuggestSearchStyles = StyleSheet.create({
  inputContent: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderRadius: 10,
    width: '100%'
  },
  inputContainer: {
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 20,
    height: 50
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10
  },
  textSearchContainer: {
    alignItems:"flex-end",
    justifyContent: 'center',
    width: '10%',
    minWidth:20
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    flex: 5,
  },
  suggestionContainerNoData: {
  },
  inputSearchTextData: {
    width: '85%',
    marginLeft:10
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    borderColor: '#E5E5E5',
    borderTopWidth: 8,
  },
  suggestAvatar: {
    width: '15%',
    padding: 10,
  },
  suggestResponseText: {
    width: '70%',
    padding: 10,
  },
  suggestText: {
    color: '#666666',
    fontSize: 16
  },
  suggestTextDate: {
    color: '#333333',
    fontSize: 14
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    elevation: theme.elevation.elevation2,
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    display: 'flex',
    flex: 1
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  touchableSelectNoData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  iconEmployee: {
    backgroundColor: '#8AC891',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconImage: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  cancel: {
    justifyContent: 'center',
    marginLeft: 20
  },
  cancelText: {
    color: '#0F6DB5',
    fontWeight: 'bold'
  },
  busyWarningContent: {
    flexDirection: 'row'
  },
  busyText: {
    color: '#FF811F',
    fontSize: 14,
    justifyContent: 'center'
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center'
  },
  iconView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSearch: {
    marginHorizontal: 10,
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    height: '100%'
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
  textButton: {
    color: theme.colors.white
  },
  iconCheckView: {
    width: '10%',
    // flex: 0.5,
    paddingLeft: 10,
    marginRight: 10,
  },
  iconCheck: {
    marginRight: 10,
  },
  iconDelete: {
    // color: "#999999",
    // height:20,
    // width:20
  },
  deleteIcon: {
    width: 16,
    height: 16
  },
  listBottom: {
    paddingBottom: 75
  }
});

export default EmployeeSuggestSearchStyles;