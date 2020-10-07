import { StyleSheet } from "react-native";

/**
 * Styles of components in folder task
 */
const TaskSuggestStyles = StyleSheet.create({
  dividerContainer: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  suggestTouchable: {
    width: '85%',
    padding: 10,
  },
  suggestText: {
    color: '#666666'
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
    borderBottomWidth: 1
  },
  touchableSelectNoData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCheckView: {
    width: '10%',
    alignContent:"center",
    justifyContent:"center"
  },
  boldText: {
    fontWeight: "bold",
  },
  strikeThroughText: {
    textDecorationLine: "line-through"
  },
  redText: {
    color: "#F92525"
  },
  iconArrowRight: {
    width: 8,
    height: 12,
    justifyContent: "center",
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
  }
});
export default TaskSuggestStyles;