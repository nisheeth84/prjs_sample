import { StyleSheet, Platform } from "react-native";
import { normalize } from "../../../../../../../shared/util/helper";

export const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15, 
  },
  boxShadow: {
    shadowColor: "#707070",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
  },
  itemHour: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  minHeight60: {
    minHeight: 60,
  },
  item_more: {
    paddingBottom: normalize(20),
  },
  toolLeft: {
    height: "100%",
    marginRight: 1,
    borderRightColor: "#CDCDCD",
    borderRightWidth: 1,
  },
  itemLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Platform.OS === "ios" ? normalize(50) : normalize(60),
    position: "relative",
    flex: 1,
  },
  //icon down event
  button_down: {
    alignItems: "center",
    marginBottom: normalize(5),
  },
  txtDate: {
    fontSize: normalize(10),
    color: "#979797",
  },
  txtDateTop: {
    color: "#333333",
  },
  numDate: {
    width: normalize(26),
    height: normalize(26),
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: normalize(13),
    overflow: "hidden",
    fontSize: normalize(16),
    color: "#333333",
    marginVertical: 0,
  },
  itemRight: {
    flex: 1,
    position: "relative",
  },
  itemEvent: {
    borderRadius: normalize(5),
    position: "relative",
    minHeight: normalize(54),
  },
  txtDt: {
    color: "#333333",
    marginRight: normalize(15),
  },
  text_bottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: normalize(20),
  },
  // item v2
  itemRight_v2: {
    margin: normalize(1),
    borderRadius: normalize(7),
  },
  item_left_v2: {
    backgroundColor: "#FFF",
    transform: [{ translateX: -normalize(10) }],
    height: "150%",
    width: "100%",
    alignItems: "flex-end",
    top: normalize(-8),
    paddingRight: normalize(3),
  },
  toolLeft_v2: {
    borderRightWidth: 1,
    borderColor: "#E4E4E4",
  },
});
