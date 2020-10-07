import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants";

/**
 * Styles of components in folder Milestone
 */
const MilestoneSuggestStyles = StyleSheet.create({
  selectedItem: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginTop: 10
  },
  errorContent: {
    backgroundColor: '#FFDEDE',
  },
  colorStyle: {
    backgroundColor: '#FFFFFF'
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
  stretchView: {
    alignSelf: 'stretch'
  },
  marginB5: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: '#F9F9F9',
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
  inputSearchTextData: {
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
    width: '90%',
    padding: 10,
  },
  suggestText: {
    color: '#666666',
    fontSize: 12
  },
  suggestMilestoneText: {
    color: '#333333',
    fontSize: 14
  },
  errorMessage: {
    marginTop: 10,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    display: 'flex',
  },
  modalButton: {
    backgroundColor: theme.colors.blue200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    padding: theme.spaces.space15,
    margin: theme.spaces.space20,
    width: theme.spacePercent.spacePercent40,
    position: 'absolute',
    bottom: theme.spaces.space0,
  },
  textButton: {
    color: theme.colors.white
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: '#E5E5E5',
    // borderBottomWidth: 1
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
    alignContent: "center",
    justifyContent: "center"
  },
  labelInput: {
    textAlign: "left",
    color: "#999999"
  },
  labelInputCorlor: {
    color: "#666666"
  },
  iconDelete: {
    fontSize: 24,
    color: "#999999"
  },
  labelInputData: {
    marginBottom: 15
  },
  iconListDelete: {
    marginRight: 15,
    width: 24,
    height: 24
  },
  inputContent: {
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    width: '75%'
  },
  iconView: {
    width: '10%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContentStyle: {
    flex: 1,
  },
  modalIcon: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalTouchable: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    height: '100%'
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
  detailSearchContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  buttonViewAll: {
    textAlign: 'center',
    color: '#0F6DB5',
    paddingTop: 15
  },
  flatListViewAll: {
    height: '80%'
  },
});
export default MilestoneSuggestStyles;