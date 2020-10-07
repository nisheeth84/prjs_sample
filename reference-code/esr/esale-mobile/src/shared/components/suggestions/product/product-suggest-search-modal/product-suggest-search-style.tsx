import { StyleSheet } from 'react-native';

/**
 * Styles of components in folder employee
 */
const ProductSuggestSearchStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  colorStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  dataViewStyle: {
    flexDirection: "column",
    marginLeft: 15,
    paddingVertical: 15,
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,

  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 4,
    marginBottom: 10,
  },
  inputContent: {
    flexDirection: 'row',
    marginVertical: 5,
    // paddingVertical: 5,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    width: '75%'
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: '#F9F9F9',

  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    flex: 4
  },
  suggestionContainerNoData: {
  },
  inputSearchTextData: {
    width: '85%',
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    height: 40,
  },
  dividerContainer: {
    marginTop: 10,
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    borderTopWidth: 12,
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
    fontSize: 12
  },
  suggestName: {
    color: '#333333',
    fontSize: 14
  },
  suggestTextDate: {
    color: '#333333',
    fontSize: 14
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15,
    alignSelf: 'center'
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',

  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1
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
    height: 32
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

});

export default ProductSuggestSearchStyles;