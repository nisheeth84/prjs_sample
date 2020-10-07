import { StyleSheet } from 'react-native';
import { theme } from '../../../../../config/constants';

/**
 * Styles of components in folder employee
 */
const EmployeeSuggestSearchStyles = StyleSheet.create({
  inputContent: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    width: '75%'
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    height: 50,
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    flex: 5
  },
  suggestionContainerNoData: {
  },
  inputSearchTextData: {
    width: '85%',
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    paddingLeft: 10
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    borderColor: '#E5E5E5',
    borderTopWidth: 10,
  },
  suggestAvatar: {
    width: '15%',
    padding: 10,
  },
  suggestResponseText: {
    width: '85%',
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
  iconDepart: {
    backgroundColor: '#77BDD1',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconGroup: {
    backgroundColor: '#AFE6CB',
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
});

export default EmployeeSuggestSearchStyles;