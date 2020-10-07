import { Platform, StyleSheet } from 'react-native';
import { PlatformOS } from '../../../../../../../config/constants/enum';
import { theme } from '../../../../../../../config/constants/theme';

/**
 * Styles of components in folder employee
 */
const EmployeeSuggestStyles = StyleSheet.create({
  container: {
    // width: theme.spacePercent.spacePercent100,
    // justifyContent: 'center',
  },
  stretchView: {
    alignSelf: 'stretch',
  },
  title: {
    color: '#333333',
    fontWeight:'bold'
  },
  suggestTouchable: {
    width: '88%',
    padding: 15,
  },
  suggestText: {
    color: '#666666'
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
  touchContentMulti: {
    paddingVertical: 12,
    marginBottom: 5,
    borderColor:'#E5E5E5',
    borderRadius:10,
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  requiredContainer: {
    marginHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 7,
    backgroundColor: "#FA5151",
  },
  textRequired: {
    color: theme.colors.white,
    fontSize: 10,
    paddingHorizontal: 10
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5
  },
});


export default EmployeeSuggestStyles;