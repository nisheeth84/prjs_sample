import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants";

/**
 * Styles of components in folder task
 */
const TaskSuggestStyles = StyleSheet.create({
  stretchView: {
    alignSelf: 'stretch'
  },
  titleLabel: {
    marginBottom: 5,
    color: '#333333'
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%'
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    flex: 1
  },
  suggestionContainerNoData: {
  },
  inputSearchText: {
    width: '80%',
  },
  inputSearchTextData:{
    width: '85%',
    borderColor: '#E5E5E5',
    borderRightWidth: 1,
    paddingLeft: 10
  },
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
    marginTop: 10,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 2,
    display: 'flex',
  },
  modalButton: {
    backgroundColor: "#0F6DB5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    elevation: 2,
    padding: 15,
    margin: 20,
    width: '40%',
    position: 'absolute',
    bottom: 0,
  },
  textButton: {
    color: "#FFFFFF"
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
  iconCheck: {
    marginRight: 15,
  },
  iconCheckView: {
    width: '10%',
    alignContent:"center",
    justifyContent:"center"
  },
  labelInput: {
    textAlign: "left",
    color: "#999999"
  },
  labelInputView: {
    margin: 10,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 15
  },
  iconDelete : {
    fontSize:24,
    color:"#999999"
  },
  boldText: {
    fontWeight: "bold"
  },
  strikeThroughText: {
    textDecorationLine: "line-through"
  },
  redText: {
    color: "#F92525"
  },
  deleteSelectedIcon: {    
    width: '15%',
    alignItems:"center",
    justifyContent:"center"
  },
  selectedItem: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginTop: 10
  },
  centerAlignItem: {
    alignItems: "center"
  },
  linkNextPage: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    height: '100%',
  },
  modalContentStyle: {
    flex: 1,
  },
  inputContent: {
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    width: '75%'
  },
  iconSearch: {
    marginHorizontal: 10,
  },
  cancel: {
    justifyContent: 'center',
    marginLeft: 20
  },
  cancelText: {
    color: '#0F6DB5',
    fontWeight: 'bold'
  },
  detailSearchContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  errorContent: {
    backgroundColor: '#FFDEDE',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
    shadowColor: "#E5E5E5",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  fabIcon: {
    fontSize: 40,
    color: '#38C07C',
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
  iconListDelete: {
    marginRight: 15,
    width: 24,
    height: 24
  },
});
export default TaskSuggestStyles;