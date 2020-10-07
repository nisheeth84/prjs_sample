import { StyleSheet, Platform } from "react-native";
import { normalize } from "../../../../../../shared/util/helper";

export const Colors = {
  c1: "#ADE4C9",
  c2: "#333333",
  c3: "#E3E3E3",
  c4: "#0F6DB3",
};

export const styles = StyleSheet.create({
  
  itemEvent: {
    paddingLeft: 6,
    marginBottom: normalize(10),
    position: "relative",
  },
  itemEventCt: {
    flex: 1,
    borderWidth: 1,
    borderRadius: normalize(4),
    borderColor: Colors.c1,
    padding: normalize(7.6),
    paddingVertical: 17,
  },
  itemMilestone: {
    borderWidth: 1,
    borderRadius: normalize(4),
    borderColor: Colors.c1,
    padding: normalize(2),
    flexDirection: 'row',
  },
  itemEventCts: {
    flex: 1,
    borderWidth: 1,
    borderRadius: normalize(4),
    borderColor: Colors.c1,
    padding: normalize(7.6),
    marginRight: 20
  },
  lineThrough: {
    textDecorationLine: "line-through",
  },
  txtDt: {
    flex: 1,
    color: "#666666",
  },
  dt: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 20
  },
  icon: {
    width: normalize(14),
    height: normalize(14),
    resizeMode: "contain",
    marginRight: 2,
    marginTop: 2,
  },
  fBold: {
    fontWeight: "700",
  },
  itemRight_v2: {
    margin: normalize(1),
    borderRadius: normalize(7),
  },
  itemEventDay: {
    borderRadius: normalize(5),
    position: "relative",
    minHeight: normalize(54),
  },
  itemRight: {
    flex: 1,
    position: "relative",
  },
  // list
  eventActive: {
    position: "absolute",
    bottom: -normalize(5.5),
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  lineActive: {
    position: "relative",
    flex: 1,
    height: normalize(2),
    backgroundColor: "#F72525",
  },
  dotActive: {
    backgroundColor: "#F72525",
    position: "absolute",
    top: -normalize(2),
    left: 0,
  },
  itemLeft: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: Platform.OS === "ios" ? normalize(50) : normalize(60),
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
    justifyContent: "center",
    borderRadius: normalize(13),
    overflow: "hidden",
    alignItems: "center",
    marginVertical: 5,
  },
  date: {
    textAlign: "center",
    fontSize: normalize(14),
    color: "#333333",
  },
  itemEventList: {
    paddingLeft: 6,
    marginBottom: normalize(10),
    position: "relative",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  colorRed: {
    color: "#F92525",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ADE4C9",
  },
});
