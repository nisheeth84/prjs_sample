import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../../../../config/constants';
import { PlatformOS } from '../../../../../config/constants/enum';

export const AppbarStyles = StyleSheet.create({
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
  },
  disableButton: {
    backgroundColor: '#E5E5E5'
  }
});

export const SearchDetailStyles = StyleSheet.create({
  rowBlank: {
    backgroundColor: '#E5E5E5',
    height: 11,
  },
  row: {
    margin: 10
  },
  fieldNameResponse: {
    marginLeft: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 15
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    height: 300,
    justifyContent: 'flex-end'
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    display: 'flex',
  },
  searchInput: {
    margin: 20,
    paddingHorizontal: 8,
    backgroundColor: '#F9F9F9',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
  },
  inputDataSearch: {
    width: '80%'
  },
  iconView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSearch: {
    marginRight: 10,
  },
  rowButton: {
    alignContent: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    flexDirection: 'row'
  },
  button: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5
  },
  disableButton: {
    backgroundColor: '#E5E5E5'
  },
  searchResponse: {
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  decisionButton: {
    backgroundColor: '#0F6DB5',
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
    padding: 15,
    marginVertical: 20,
    height: 48,
    width: 123,
    marginHorizontal: 20,
  },
  bottomButton: {
    justifyContent: 'flex-end',
  },
  searchContent: {
    flex: 1,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  textDisable: {
    color: '#000000'
  },
  textEnable: {
    color: '#FFFFFF'
  },
  rowBorder: {
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  selectedList: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    flex: 5
  },
  floatLeftButton: {
    position: 'absolute',
    left: 30,
    bottom: 10,
    shadowColor: "#E5E5E5",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  floatRightButton: {
    position: 'absolute',
    right: 30,
    bottom: 10,
    shadowColor: "#E5E5E5",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  searchModalContent: {
    flex: 1,
    marginTop: Platform.OS === PlatformOS.IOS ? 44 : 0,
  },
})