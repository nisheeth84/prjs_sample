import { StyleSheet } from 'react-native';

const CustomerSuggestResultSearchStyle = StyleSheet.create({
  ResultViewMenu:
  {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    padding: 10,
    borderBottomWidth: 1,
  },
  FunctionStyle:
  {
    fontSize: 20
  },
  deleteIcon: {
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
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonStyleDisable: {
    backgroundColor: '#EDEDED',
    borderColor: '#707070',
    width: 56,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addlabelStyle: {
    color: '#FFFFFF',
    fontSize: 15,
    padding: 8,
  },
  dataModalStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  nameEmployeeStyle: {
    fontWeight: 'bold'
  },
  contentContainerStyle: {
    paddingBottom: 50
  },
  dataSelectedStyle: {
    flex: 4,
    // flexDirection: 'row'
  },
  iconEmployee: {
    backgroundColor: '#8AC891',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  suggestText: {
    color: '#666666',
    fontSize: 12
  },
  suggestMilestoneText: {
    color: '#333333',
    fontSize: 14
  },
});

export default CustomerSuggestResultSearchStyle;