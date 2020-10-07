import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../../../config/constants';
import { PlatformOS } from '../../../../config/constants/enum';
const { width } = Dimensions.get('window');

/**
 * Styles of components in folder employee
 */
const CustomerSuggestStyles = StyleSheet.create({
  stretchView: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF'
  },
  title: {
    color: '#333333',
    fontWeight: 'bold'
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
    fontSize: 16
  },
  suggestTextDate: {
    color: '#333333',
    fontSize: 14
  },
  modalContainer: {
    flex: theme.flex.flex1,
    marginTop: Platform.OS === PlatformOS.IOS ? 44 : 0,
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
    marginBottom: 10
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
    justifyContent: 'center'
  },
  labelInput: {


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
    height: 32,
    borderRadius: 16
  },
  flatListViewAll: {
    height: '80%'
  },
  buttonViewAll: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
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
    marginTop: Platform.OS === PlatformOS.IOS ? 44 : 0,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  errorContent: {
    backgroundColor: '#FFDEDE',
  },
  touchContent: {
    paddingVertical: 12,
    marginBottom: 5
  }
});

export const AuthorizationModalStyles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 120,
  },
  title: {
    color: '#333333',
    fontWeight: '600',
    fontSize: theme.fontSizes[3],
  },

  wrapText: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 50,
  },
  divide1: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
});
export default CustomerSuggestStyles;