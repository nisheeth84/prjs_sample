import { StyleSheet } from "react-native";
import {
  ScreenWidth,
  getHeight,
  normalize,
  getWidth,
} from '../../common';
import { theme } from "../../../../config/constants";

export const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "white",
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
  },
  fabIcon: {
    fontSize: 40,
    color: "#00CCAF",
  },
  container: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
  },
  bg_main: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  scroll: {
    height: getHeight(545),
    paddingVertical: getHeight(10),
  },
  tab_item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: getHeight(10),
  },
  top_contents: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: getHeight(25),
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 100,
    backgroundColor: "#87D8AF",
    borderWidth: 4,
    borderColor: "#F8F8F8",
  },
  //  top title
  avatar: {
    position: 'absolute',
    top: 15,
  },
  top_Text: {
    position: "relative",
  },
  top_title: {
    marginLeft: getWidth(5),
    width: "95%",
  },
  time: {
    color: "#666666",
    fontSize: 12,
    justifyContent:'center'
  },
  time_red: {
    color: "red",
    fontSize: 12,
    justifyContent:'center'
  },
  date: {
    color: "#666666",
    fontSize: 12,
    marginVertical: 10,
    width:getWidth(80)
  },
  date_red: {
    color: "red",
    fontSize: 12,
    marginVertical: 10,
    width:getWidth(80)
  },
  icon_share: {
    position: "absolute",
    top: 5,
    right: 0,
  },
  icon_timeline:
  {
    position: "absolute",
    top: 5,
    right: 30,
  },
  // button
  edit_button: {
    flexDirection: "row",
    alignItems: "center",
  },
  tool: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tool_button: {
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: '#fff',
    height : getHeight(35)
  },
  act_tool_button: {
    borderColor: '#0F6DB4',
    backgroundColor: '#D5E2F2',
  },
  buttonEnable: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray100,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue200,
  },
  textEnable: {
    color: theme.colors.black,
  },
  // icon
  act_icon: {
    tintColor: "#0F6DB4",
  },
  text_button: {
    fontSize: normalize(12),
    color: theme.colors.gray,
    paddingLeft: 10,
  },
  icon_card_visit: {
    width: getWidth(17),
    height: getWidth(11),
    resizeMode: 'contain',
  },
  icon_flag: {
    width: getWidth(14),
    height: getWidth(12),
    resizeMode: 'contain',
  },
  icon_tag_file: {
    width: getWidth(15),
    height: getWidth(14),
    resizeMode: 'contain',
  },


  icon_check: {
    width: getWidth(12),
    height: getWidth(12),
    tintColor: "#999999",
    resizeMode:'contain'
  },
  icon_checked: {
    width: getWidth(12),
    height: getWidth(12),
    tintColor: theme.colors.blue200,
    resizeMode:'contain'

  },
  icon_location: {
    width: getWidth(12),
    height: getWidth(20),
    resizeMode: 'contain',
  },

  icon_close: {
    width: getWidth(12),
    height: getWidth(12),
    tintColor: "#999999",
  },
  icon_shared: {
    width: getWidth(12),
    height: getWidth(14),
    tintColor: "#999999",
    resizeMode: 'contain',
  },
  icon_closed: {
    width: getWidth(12),
    height: getWidth(12),
    tintColor: theme.colors.blue200,
  },
  ic_share: {
    width: getWidth(12),
    height: getWidth(12),
  },
  icon_save: {
    width: getWidth(15),
    height: getWidth(18),
  },
  icon_building: {
    width: getWidth(12),
    height: getWidth(15),
    resizeMode: 'contain',
  },
  icon_door: {
    width: getWidth(12),
    height: getWidth(15),
    resizeMode: 'contain',
  },
  icon_user: {
    width: getWidth(24),
    height: getWidth(24),
    resizeMode: 'contain',
    marginRight: getWidth(5),
  },


  icon_pencil: {
    width: getWidth(18),
    height: getWidth(18),
  },
  icon_recycle_bin: {
    width: getWidth(16),
    height: getWidth(22),
  },

  tool_right: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "30%",
    paddingLeft: getWidth(10),
  },

  //tab_view
  tab_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: ScreenWidth,
  },
  tab_border: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E4E4E4',
    borderRightColor: '#E4E4E4',
  },
  tab_view_item: {
    width: '50%',
    paddingVertical: getWidth(10),
    borderTopColor: '#E4E4E4',
    borderBottomColor: '#E4E4E4',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tab_title: {
    fontSize: normalize(12),
    color: '#333',
    textAlign: 'center',


  },

  tab_act: {
    backgroundColor: '#D5E2F2',
    borderBottomColor: '#0F6DB4',
    color: '#0F6DB4',
  },
  text_act: {
    color: '#0F6DB4',
  },
  // comment
  item: {
    flexDirection: 'row',
    // width: '100%'
  },
  title_item: {
    fontSize: normalize(14),
    paddingBottom: getHeight(5),
  },
  button: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#333",
    fontSize: normalize(12),
  },
  block_user: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: getWidth(15),
    marginVertical: getWidth(5),
    width:getWidth(100),
    flexDirection:'row'
  },
  // Basic_detail_information
  detail_information: {
    marginLeft: getWidth(15),
    marginBottom:getHeight(80)
    // height:300,
  },
  detail_item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail_title: {
    minWidth: getWidth(80),
  },
  item_text: {
    fontSize: normalize(12),
    color: '#333333',
    paddingVertical: getHeight(5),
  },
  detail_icon: {
    marginTop: 5,
  },
  // Change_history
  tab_history: {
    // marginVertical: getWidth(15),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getWidth(10),
    paddingBottom: getHeight(15),
    borderLeftWidth: 2,
    borderLeftColor: '#E5E5E5',
    position: 'relative',
    marginLeft: 10,
  },
  dot_history: {
    position: 'absolute',
    width: getWidth(16),
    height: getWidth(16),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#0F6DB5',
    top: 0,
    left: getWidth(-9),
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  contents_history: {
    backgroundColor: '#F9F9F9',
    padding: getWidth(10),
    borderRadius: 7,
    width: '110%',
  },
  history_item: {
    paddingVertical: getHeight(10),
  },
  history_title: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#333333',
    paddingBottom: getHeight(10),
  },
  history_text: {
    fontSize: normalize(12),
    color: '#333333',
  },
  // comment box
  box_comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: getHeight(20),
  },
  input_type: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: getWidth(15),
    borderWidth: 1,
    borderColor: '#F6F6F6',
  },
  comment_button: {
    color: '#FFF',
    fontSize: normalize(12),
    backgroundColor: '#0F6DB5',
    fontWeight: 'bold',
    padding: getWidth(5),
    borderRadius: 10,
    minWidth: getWidth(60),
    textAlign: 'center',
  },
  tool_comment: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    width: ScreenWidth,
    paddingVertical: getWidth(10),
  },
  // emotion
  comment: {
    marginLeft: getWidth(30),
    marginVertical: getHeight(20),
  },
  emotion: {
    flexDirection: 'row',
  },
  emotion_item: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#E3E3E3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginRight: 10,
  },
  user_comment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main_comment: {
    marginVertical: 10,
  },
  comment_time: {
    color: '#959595',
    fontSize: 10,
  },
  emotion_icon: {
    width: getWidth(24),
    height: getWidth(24),
  },
  emotion_nbr: {
    fontSize: normalize(14),
    color: '#666666',
    marginLeft: 5,
  },
  // modal
  modal: {
    width: ScreenWidth - 30,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modal_2: {
    overflow: 'hidden',
  },
  title_modal: {
    alignSelf: 'center',
    paddingVertical: getHeight(20),
    fontSize: normalize(16),
  },
  text_modal_item: {
    position: 'relative',
  },
  check_text: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F6DB5',
    width: normalize(26),
    height: normalize(26),
    position: 'absolute',
    borderRadius: 100,
    top: '25%',
    right: normalize(20),
  }
  , modal_text: {
    fontSize: normalize(14),
    padding: normalize(20),
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,

  },
  button_modal: {
    fontSize: normalize(12),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    width: getWidth(150),
    textAlign: 'center',
    borderRadius: 10,
  },
  footer_modal: {
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    padding: getHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
});
export default styles;
