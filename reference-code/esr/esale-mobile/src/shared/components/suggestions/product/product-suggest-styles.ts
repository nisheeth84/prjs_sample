import { StyleSheet } from 'react-native';
import { theme } from "../../../../config/constants";

/**
 * Styles of components in folder employee
 */
const ProductSuggestStyles = StyleSheet.create({
  errorContent: {
    backgroundColor: '#FFDEDE',
  },
  labelName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  labelText: {
    fontWeight: 'bold',
    color: '#333333'
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
  productNameSingle: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold"
  },
  totalAmountStyle: {
    color: '#999999',
    fontSize: 14,
  },
  linkNextPage: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
  },
  ImageStyle: {
    height: 56,
    width: 98
  },
  viewSingleStyle: {
    flexDirection: 'row',
    justifyContent: "space-between",
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    paddingVertical: 10
  },
  extensionView: {
    flexDirection: 'column',
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 10,
  },
  flatListStyle: {
    paddingBottom: 70
  },
  defaulView: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,

  },
  boundImageAndDefaultText: {
    flexDirection: "row"
  },
  boundViewStyle: {
    backgroundColor: "#EDEDED",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  toucherCloseExtension: {
    alignItems: "center"
  },
  iconCloseExtensionStyle: {
    marginTop: 30
  },
  inputQuantumStyle: {
    fontSize: 14,
    color: "#999999",
    justifyContent: "flex-end",
    flex: 1,
    textAlign: "right",
    marginRight: -6,
  },
  rowExtensionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginHorizontal: 11,
    alignItems: "center",
    paddingVertical: 7,
  },
  columnExtensionStyle: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginHorizontal: 11,
  },
  extensionTextStyle: {
    fontSize: 14,
    color: '#333333',
    marginStart: 3
  },
  stretchView: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
  },
  suggestAvatar: {
    width: '15%',
    padding: 10,
  },
  suggestTouchable: {
    width: '40%',
    padding: 10,
  },
  suggestText: {
    color: '#666666',
    fontSize: 12
  },
  priceText: {
    color: '#333333',
    fontSize: 14
  },
  suggestTextDate: {
    color: '#333333',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,

  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1
  },
  toucherDelete: {
    position: 'absolute',
    right: -26,
    zIndex: 2,
    top: -9,
  },
  touchableSelected: {
    marginTop: 10,
    margin: 15
  },
  iconCheck: {
    marginRight: 10,
  },
  iconListDelete: {
    marginRight: 15,
    width: 26,
    height: 26,
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  labelInput: {
    marginTop: 0,
  },
  labelInputCorlor: {
    color: '#666666',
  },
  labelInputData: {
    marginTop: 10,
    color: '#333333',
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
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
  flatListViewAll: {
    height: '80%'
  },
  buttonViewAll: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15,
    fontWeight: "bold"
  },
  bottomView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  elementRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  openModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 6,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  buttonText: {
    flex: 1,
  },
  detailSearchContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  productName: {
    color: "#0F6DB5",
    fontSize: 16
  },
  iconProduct: {
    width: 98,
    height: 56
  }
});

export default ProductSuggestStyles;