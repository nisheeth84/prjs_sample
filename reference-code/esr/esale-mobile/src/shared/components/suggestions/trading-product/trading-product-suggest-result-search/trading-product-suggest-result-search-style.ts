import { StyleSheet } from 'react-native';

const TradingProductSuggestResultSearchStyle = StyleSheet.create({
  activityIndicatorStyle: {
    padding: 5
  },
  separatorStyle: {
    height: 1,
    backgroundColor: '#E5E5E5'
  },
  errorView: {
    marginTop: 10,
    alignItems: 'center'
  },
  commonView: {
    padding: 15
  },
  completionDateStyle: {
    color: '#F92525',
    fontSize: 12
  },
  firstLineStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
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
    borderTopColor: '#E5E5E5',
    color: '#333333',
    fontSize: 16,
    paddingBottom: 10
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
    color: "#333333",
    fontSize: 14
  },
  contentContainerStyle: {
    paddingBottom: 50
  },
  dataSelectedStyle: {
    flex: 6,
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
});

export default TradingProductSuggestResultSearchStyle;