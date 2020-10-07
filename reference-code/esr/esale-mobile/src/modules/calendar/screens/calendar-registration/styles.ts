import { StyleSheet } from "react-native";
import { getHeight, getWidth, ScreenWidth, normalize } from "../../common";
import {  hScale } from "../../common/PerfectPixel";
export const styles = StyleSheet.create({
  // style for top
  top: {
    backgroundColor: "#FBFBFB",
    height: 60,
    position: "relative",
  },
  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topCenter: {
    position: "absolute",
    transform: [{ translateX: ScreenWidth / 2 - normalize(100) }],
  },
  topLeft: {},
  ImagesClose: {
    width: getWidth(20),
    height: getHeight(20),
    resizeMode: "contain",
  },
  centerText: {
    fontSize: normalize(18),
    color: "#333",
  },
  topRight: {
    borderColor: "#0F6DB5",
    borderRadius: getWidth(8),
    borderWidth: 1,
    paddingVertical: normalize(7),
    paddingHorizontal: normalize(20),
  },
  ButtonActive: {
    backgroundColor: "#0F6DB5",
  },
  topText: {
    color: "#333",
  },
  activeText: {
    color: "#fff",
  },
  // style for row
  Row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: normalize(5),
    width: "100%",
  },
  Horizontal_15: {
    paddingHorizontal: normalize(15),
  },
  RowBottomNone: {
    paddingBottom: 0,
  },
  RowLeft: {
    fontSize: normalize(14),
    color: "#666",
  },
  RowRight: {
    fontSize: normalize(14),
    color: "#666",
  },
  color333: {
    color: "#333",
  },
  color666: {
    color: "#666",
  },
  color999: {
    color: "#999",
  },
  Switch: {},
  // style for Schedule
  ScheduleList: {},
  ScheduleItem: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(15),
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  ScheduleItemBottomNone: {
    borderBottomWidth: 0,
  },
  ScheduleTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    overflow: "hidden",
    // backgroundColor: 'red',
    marginBottom: normalize(8),
  },
  ScheduleTitle: {
    fontSize: normalize(14),
    color: "#333",
    fontWeight:'bold',
  },
  ScheduleLabel: {
    borderRadius: getWidth(5),
    overflow: 'hidden',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    marginLeft: normalize(10),
    fontSize: normalize(10),
    backgroundColor: "#FA5151",
    color: "#fff",
  },
  ScheduleContent: {
    fontSize: normalize(14),
    width: "100%",
    color: "#666",
  },
  // style for week
  ScheduleWeek: {
    flexDirection: "row",
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(10),
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: getWidth(12),
  },
  ScheduleDay: {
    width: hScale(34),
    height: hScale(34),
    borderRadius: hScale(34),
    overflow: "hidden",
    marginRight: normalize(15),
    borderColor: "#E5E5E5",
    borderWidth: 1,
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#333",
    fontSize: normalize(12),
  },
  ScheduleDayText: {
    color: "#333",
    fontSize: normalize(12),
  },
  ScheduleDayActive: {
    backgroundColor: "#0F6DB5",
  },
  ScheduleDayActiveText: {
    color: "#fff",
  },
  // style for extends area
  ScheduleExtends: {
    zIndex: 1,
  },
  // scroll picker
  wrapScroll: {
    flexDirection: "row",
  },
  // style for function repeat
  ScheduleRepeat: {},
  // style for schedule box
  ScheduleBox: {
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: getWidth(12),
    overflow: 'hidden'
  },
  BoxItem: {
    paddingTop: normalize(15),
    paddingBottom: normalize(10),
    paddingHorizontal: normalize(15),
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },
  BoxItemTop: {
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
  },
  BoxItemBottomNone: {
    borderBottomWidth: 0,
  },
  BoxTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: normalize(8),
  },
  BoxTitle: {
    fontSize: normalize(14),
    color: "#333",
    fontWeight: 'bold'
  },
  BoxLeft: {
    fontSize: normalize(14),
    color: "#333",
    fontWeight:'bold'
  },
  BoxRight: {
    fontSize: normalize(14),
    color: "#666",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  BoxDate: {
    color: "#666",
  },
  BoxDay: {
    fontSize: normalize(14),
    color: "#666",
  },
  BoxCheckBox: {
    width: normalize(23),
    height: normalize(23),
    borderRadius: normalize(23),
    overflow: "hidden",
    marginLeft: normalize(10),
    borderColor: "#0F6DB5",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BoxCheckBoxNoSelect: {
    width: getWidth(23),
    height: getHeight(23),
    borderRadius: getWidth(23),
    overflow: "hidden",
    marginLeft: normalize(10),
    borderColor: "#fff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BoxCheckBoxActive: {
    backgroundColor: "#0F6DB5",
  },
  BoxCheckBoxImage: {
    width: normalize(15),
    height: normalize(15),
    resizeMode: "contain",
  },
  text_center: {
    textAlign: 'center',
  },
  // modal
  modal: {padding: normalize(15),},
  text_modal: { fontSize: 18, fontWeight: 'bold'},
  button_modal: {
    marginTop: normalize(20),
    textAlign: 'center', 
    alignSelf: 'center',
    paddingHorizontal: normalize(40),
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: normalize(10),
  },
  time_modal: {
    paddingTop: normalize(10),
    fontSize: normalize(14),
  },
  radio_button: {
    marginTop: normalize(10)
  },
  text_radio: {
    fontSize: normalize(14),
    paddingLeft: normalize(5),
  },
  text_red: {
    color: '#FF0000',
    fontSize: normalize(14),
    marginTop: normalize(10),
  },
  footer_modal: {
    marginTop: normalize(10),
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button_blue: {
    backgroundColor: '#0F6EB5',
  },
  color_white: {
    color: '#FFF',
  }
});
