import { StyleSheet } from "react-native";
import {getHeight, getWidth, normalize, ScreenWidth} from "../../common/index";
import { theme } from "../../../../config/constants";
const style = StyleSheet.create({
  content: {
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  //color
  color_black: { color: "#333" },
  color_active: {
    color: theme.colors.black100,
  },
  // button
  btnSchedule: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: getWidth(10),
  },
  textButton: {
    fontSize: normalize(12),
    color: "#333",
  },
  btnTicked: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: getWidth(10),
    borderWidth: 2,
    minWidth:getWidth(86),
    minHeight:getHeight(48),
    borderColor: theme.colors.blue200,
    backgroundColor: theme.colors.blue100
  },
  btnImaged: {
    width: getWidth(14),
    height: getHeight(12),
    resizeMode: "contain",
    tintColor : theme.colors.blue200
  },
  btnTick: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: getWidth(10),
    borderWidth: 2,
    minWidth:getWidth(86),
    minHeight:getHeight(48),
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.white
  },
  btnImage: {
    width: getWidth(14),
    height: getHeight(12),
    resizeMode: "contain",
    tintColor : theme.colors.gray
  },
  textButtonTick: {
    fontSize: normalize(14),
    color: "#333",
    marginLeft: normalize(5),
  },
  btn_down_up: {
    alignItems: "center",
    paddingVertical: normalize(20),
  },
  //
  flexD_row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: normalize(20),
  },
  //header
  content_header: {
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
  },
  textTitleTab: {
    fontSize: normalize(14),
  },
  notification: {
    width: getWidth(16),
    height: getHeight(16),
    backgroundColor: "#F92525",
    borderRadius: getWidth(50),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: normalize(5),
  },
  textNotification: {
    color: "#fff",
    fontSize: normalize(10),
  },
  //content
  content_Schedule: {
    backgroundColor: "#fff",
    borderRadius: getWidth(15),
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(25),
    marginTop: normalize(10),
  },
  datepicker: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: normalize(10),
  },
  text_datepicker: {
    fontSize: normalize(17),
    color: "#333333",
  },
  boxSchedule: {
    paddingBottom: normalize(20),
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  boxScheduleShort: {
    paddingBottom: normalize(1),
  },
  text_boxSchedule: {
    fontSize: normalize(14),
    flex: 1,
  },
  infoSchedule: {
    paddingTop: 10,
  },
  textInfoSchedule: {
    fontSize: normalize(14),
    color: "#333",
  },
  info_flexD: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: normalize(5),
  },

  border_active: {
    borderColor: "#0F6DB5",
    backgroundColor: "#b8d3e8"
  },
  imageActive: {
    tintColor: "#0F6DB5",
  },
  flexD_Btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pdTB: {
    paddingVertical: normalize(20),
  },
  // icon
  icon_down_up: {
    width: getWidth(16),
    height: getHeight(10),
    resizeMode: "contain",
  },
  general_icon: {
    width: getWidth(14),
    height: getHeight(14),
    resizeMode: "contain",
    marginRight:normalize(5)
  },
  ic_person_red: {
    width: getWidth(18),
    height: getHeight(18),
    resizeMode: "contain",
    marginRight:normalize(5)
  },
  ic_location: {
    width: getWidth(12),
    height: getHeight(20),
    resizeMode: "contain",
    marginRight:normalize(5)
  },
  ic_building:{
    width: getWidth(12),
    height: getHeight(15),
    resizeMode: "contain",
    marginRight:normalize(5)
  },
  textInfoBox: {},
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
  // modal
  modal: {
    width: ScreenWidth - 30,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  text_modal_item: {
    position: 'relative',
  },
  modal_text: {
    fontSize: normalize(14),
    padding: normalize(20),
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
  },
});
export default style;
