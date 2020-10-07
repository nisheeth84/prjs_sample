import { StyleSheet } from 'react-native';

const ProductSuggestResultSearchStyle = StyleSheet.create({
  suggestText: {
    color: '#666666',
    fontSize: 12,
  },
  productImageStyle: {
    width: 104,
    height: 60,
  },
  ResultViewMenu:
  {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
    borderBottomWidth: 1
  },
  FunctionStyle:
  {
    fontSize: 20
  },
  deleteIcon: {
    marginLeft: 10,
  },
  SumLabelStyle: {
    fontWeight: 'bold',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5'

  },
  addButtonStyleEnable: {
    backgroundColor: '#0F6DB5',
    borderColor: '#707070',
    width: 56,
    height: 38.56,
    borderRadius: 10,

  },
  addButtonStyleDisable: {
    backgroundColor: '#EDEDED',
    borderColor: '#707070',
    width: 56,
    height: 38.56,
    borderRadius: 10,

  },
  AddlabelStyle: {
    color: '#FFFFFF',
    fontSize: 15,
    padding: 8
  },
  dataModalStyle: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5'
  },
  Underline: {
    borderColor: '#EDEDED',
    borderWidth: 4
  },
  iconCheck: {
    marginRight: 10,
  },
  iconListDelete: {
    marginRight: 15,
    width: 24,
    height: 24
  },
  iconCheckView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 0.5,
    paddingLeft: 20
  },
  nameProductStyle: {
    fontWeight: 'bold',
    color: "#333333",
    fontSize: 14
  },
  contentContainerStyle: {
    paddingBottom: 50
  },
  dataSelectedStyle: {
    flex: 4,
    flexDirection: 'column',
    marginLeft: 15

  },
  iconProduct: {
    backgroundColor: '#8AC891',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataMessage: {
    marginTop: '20%',
    alignItems: 'center',
  },
  textNoData: {
    color: '#333333'
  },
  functionIcon: {
    height: 30,
    width: 30,
    marginBottom: 10
  }
});

export const AppbarStyles = StyleSheet.create({
  disableButton: {
    backgroundColor: '#E5E5E5'
  },
  barContainer: {
    height: 54,
    backgroundColor: '#FBFBFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 15
  },
  block: {
    height: 50,
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold'
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    width: 56,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F6DB5',
    margin: 5,
    borderRadius: 10,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  filterButton: {
    margin: 10,
    color: '#333333',
    borderRadius: 10,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
  }
});

export default ProductSuggestResultSearchStyle;