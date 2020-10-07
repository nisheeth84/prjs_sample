import { StyleSheet } from "react-native";
import {theme} from "../../../../config/constants";
import { getHeight, getWidth, normalize } from "../../common/index";

const style = StyleSheet.create({
  content: {
    backgroundColor: "#EDEDED",
    flex: 1,
  },
  numberL:{
    width : getWidth(170),
  },
  content_header: {
    flexDirection: "column",
  },
  //color
  color_active: {
    color: "#0F6DB5",
  },
  flexD_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  boxChild: {
    justifyContent: "space-between",
    paddingBottom: normalize(20),
  },
  //header
  box_header: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(15),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
  },
  text_header: {
    fontSize: normalize(18),
    color: "#333",
    flex: 1,
  },
  //content
  content_navigation: {
    marginTop: normalize(20),
  },
  tab: {
    flexDirection: "row",
    width: "100%",
  },
  tab_active: {
    backgroundColor: "#D6E3F3",
    borderBottomColor: "#0F6DB5",
    borderBottomWidth: 2,
  },
  titleTab: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    height: "100%",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 2,
    paddingVertical: normalize(20),
    backgroundColor: "#fff",
  },
  textFontSize: {
    fontSize: normalize(14),
    color: "#333",
  },
  content_checkbox: {
    backgroundColor: "#fff",
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(15),
  },
  ContentSmall: {
    marginLeft: normalize(25),
  },
  boxArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon_up_down: {
    width: getWidth(12),
    height: getHeight(8),
    resizeMode: "contain",
    tintColor: "#707070",
  },
  textBoxArrow: {
    marginLeft: normalize(10),
  },
  input: {
    height: getHeight(42),
    borderColor: "#E4E4E4",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    marginTop: normalize(20),
    marginBottom: normalize(10),
    paddingLeft: normalize(10),
  },
  // checkbox
  checkboxParent: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(15),
    width:getWidth(265),
  },
  
  textCheckBox: {
    paddingLeft: normalize(5),
  },
  checkBoxChild: {
    marginLeft: normalize(20),
  },
  marL: {
    marginLeft: normalize(10),
  },
  ic_checkbox: {
    width: getWidth(17),
    height: getHeight(17),
    resizeMode: "contain",
    marginLeft: normalize(10),
  },
  bottom: {
    backgroundColor: "#fff",
    marginTop: normalize(20),
    paddingVertical: normalize(20),
  },
  textBottom: {
    marginLeft: normalize(25),
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    display: 'flex',
    flex: 2
  },
  inputContainer: {
    // margin: 15,
    // padding: 10,
    flexDirection: 'row',
    height: getHeight(48),
    borderColor: "#E4E4E4",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    marginTop: normalize(20),
    marginBottom: normalize(10),
    paddingLeft: normalize(10),
  },
  textSearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  inputSearchTextData:{
    width: '90%',
    height:getHeight(48),
    fontSize:getHeight(13)
  },
  inputSearchText: {
    width: '80%',
    height:getHeight(48),
    fontSize:getHeight(13)

    // fontFamily: 'FontAwesome'
  },
  iconDelete : {
    fontSize: 18,
    color:"#999999",
  },
  suggestionContainer: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    // borderColor: '#E5E5E5',
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    borderBottomWidth:2,
    paddingBottom:getHeight(15),
    marginTop:getHeight(-15)
  },
  suggestText: {
    color: '#666666',
    padding: 10,
  },
  suggestTexted: {
    color: '#0F6DB4',
    padding: 10,
  },
  suggestTouchable: {
    padding: 10,
  },
  textSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    backgroundColor: '#CED0CE',
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
  },
  textNoSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderTopWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
  },
  errorMessage: {
    marginTop: 10,
    color: '#FA5151',
  },
 
});
export default style;
