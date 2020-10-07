import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants";
import { getWidth, getHeight, normalize } from "../../common";

/**
 * Styles of components in folder product
 */
const ProductSuggestStyles = StyleSheet.create({
  stretchView: {
    alignSelf: 'stretch'
  },
  marginB5: {
    marginBottom: 5,
  },
  inputContainer: {
    margin: 15,
    paddingHorizontal: 5,
    backgroundColor: '#F9F9F9',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    height: normalize(45),
    width: '90%',
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  suggestionContainer: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    height: getHeight(400)
  },
  suggestionContainerNoData: {
  },
  inputSearchText: {
    width: '80%',
    // fontFamily: 'FontAwesome'
  },
  inputSearchTextData: {
    width: '90%',
    paddingLeft: normalize(10)
  },
  dividerContainer: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  suggestTouchable: {
    width: '85%',
    // padding: 10,
    paddingLeft: normalize(27)
  },
  suggestText: {
    color: '#666666'
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
  modalContainer: {
    flex: theme.flex.flex1,
    backgroundColor: 'rgba(51, 51, 51, 0.5)',
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
    // padding: theme.spaces.space15,
    margin: theme.spaces.space10,
    width: theme.spacePercent.spacePercent40,
    position: 'absolute',
    bottom: theme.spaces.space0,
  },
  textButton: {
    color: theme.colors.white
  },
  textHolder: {
    color: theme.colors.gray
  },
  touchableSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: "#666666",
    borderRadius: 10,
    padding: 10,
    color: "#666666"
  },
  iconDelete: {
    fontSize: 24,
    color: "#999999"
  },
  ViewModal: {
    paddingTop: getWidth(15),
  },
  line: { borderBottomColor: '#EDEDED', borderBottomWidth: 15 },
  ViewCustom: {
    paddingHorizontal: getWidth(15),
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: getHeight(50),
    flex: 1,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: getWidth(10),
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  ImageStyle: {
    margin: normalize(5),
  },
  ic_searchAdvance: {
    width: getWidth(16),
    height: getWidth(16),
    resizeMode: "contain",
    tintColor: "#999",
  },
  input: {
    flex: 1,
    paddingLeft: 15,
  },
  ic_general: {
    width: getWidth(20),
    height: getWidth(20),
    resizeMode: "contain",
  },
  titleModal: {
    fontSize: normalize(14),
    color: "#666666",
    marginLeft: getWidth(5),
  },
  viewDes: {
    marginLeft: getWidth(25),
    marginBottom: 10
  },
  des1: {
    fontSize: normalize(12),
    color: "#666666",
    marginTop: getHeight(5),
  },
  des2: {
    fontSize: normalize(14),
    color: "#333333",
    marginTop: getHeight(5),
  },
  flex_D: {
    flexDirection: "row",
    alignItems: "center",
  },
  borderProduct: {
    borderColor: '#E5E5E5',
    borderTopWidth: 1
  },
  marginItemSearch: {
    marginTop: 5,
    marginBottom: 10
  },
  TextInputMemoProduct: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    marginRight: normalize(5),
    height: getHeight(50),
    overflow: 'hidden',
    color: theme.colors.gray1,
    textAlignVertical: 'top',
  },
  ExpandButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(10)
  },
  paddingTitle: {
    paddingTop: 10,
    paddingBottom: 10
  }
});
export default ProductSuggestStyles;