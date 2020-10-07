import { StyleSheet } from 'react-native';
/**
 * Styles of components in folder milestone
 */
const MilestoneLisStyles = StyleSheet.create({
 suggestTouchable: {
    padding: 10,
    width:"85%"
  },
  suggestText: {
    color: '#666666',
    fontSize:12
  },
  suggestTextDate: {
    color: '#333333',
    fontSize:14
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    padding:5,
    borderBottomWidth: 1
  },
  touchableSelectNoData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:5,
  },labelInput: {
    borderWidth: 1,
    borderColor: "#666666",
    borderRadius: 10,
    padding: 10,
    color: "#666666"
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeeContainer: {
    flexDirection: 'row'
  },
  link: {
    color: '#0F6DB5',
  },
  employeeText: {
    color: '#0F6DB5'
  },
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  },
  iconArrowRight: {
    width: 8,
    height: 12,
    justifyContent: "center",
  },
  iconCheckView: {
    width: '10%',
    alignContent:"center",
    justifyContent:"center"
  },

});
export default MilestoneLisStyles;