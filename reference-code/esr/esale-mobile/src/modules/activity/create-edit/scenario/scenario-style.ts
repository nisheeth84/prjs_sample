import { StyleSheet } from "react-native";
import { getHeight, getWidth, normalize } from "../../../calendar/common";

export const ScenarioStyle = StyleSheet.create({
  ViewBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textRight: {
    fontSize: getHeight(13.86),
    color: "#0F6EB5",
    textAlign: "right",
  },
  textBorder: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: getWidth(12),
    padding: getWidth(5),
    color: "#333",
  },
  marginTop30: {
    marginTop: normalize(30)
  },
  paddingBottom30: {
    paddingBottom: normalize(30)
  },
  tabHistory: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: getWidth(20),
    paddingRight: getWidth(5),
    // paddingBottom: getHeight(15),
    position: "relative",
    marginLeft: getWidth(10),
  },
  borderLeft: {
    borderLeftWidth: 2,
    borderLeftColor: "#E5E5E5",
  },
  tabHistoryOther: {
    borderLeftColor: "transparent",
    paddingLeft: getWidth(20),
  },
  dotHistory: {
    position: "absolute",
    width: getWidth(16),
    height: getWidth(16),
    // borderRadius: 100,
    // borderWidth: 2,
    // borderColor: "#0F6DB5",
    left: getWidth(-8),
    backgroundColor: "#FFF",
    zIndex: 1,
  },
  ViewScenario: {
    backgroundColor: "#EDEDED",
    borderRadius: getWidth(12),
    width: "100%",
    paddingLeft: getWidth(15),
    paddingRight: getWidth(15),
  },
  ViewScenarioOther: {
    backgroundColor: "#EDEDED",
    borderRadius: getWidth(12),
    width: "100%",
    paddingHorizontal: getWidth(15),
  },
  ViewBoxSce: {
    paddingTop: getHeight(15),
  },
  borderBottom: {
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  borderTop: {
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  flex_D: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgTitle: {
    width: getWidth(20),
    height: getWidth(22),
    resizeMode: "contain",
  },
  titleSce: {
    fontSize: normalize(14),
    color: "#0F6DB5",
    marginLeft: getWidth(10),
    fontWeight: "bold"
  },
  desSce: {
    fontSize: normalize(10),
    paddingTop: getHeight(5),
    color: "#333333",
  },
  redText: {
    color: "#ff4d4d",
  },
  desScenario: {
    fontSize: normalize(12),
    paddingVertical: getHeight(10),
    color: "#333333",
  },
  viewImg: {
    justifyContent: "flex-end",
    marginRight: getWidth(10),
    paddingVertical: getHeight(15),
  },
  imagePerson: {
    width: getWidth(26),
    height: getWidth(26),
    resizeMode: "contain",
    marginRight: getWidth(10),
    // marginHorizontal:normalize(5),
    borderRadius: 50
  },
  count: {
    width: getWidth(26),
    height: getWidth(26),
    backgroundColor: "#0F6DB5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: getWidth(26) / 2,
  },
  textCount: {
    fontSize: normalize(10),
    color: "#fff",
  },
  ViewImageRow: {
    paddingVertical: getHeight(10),
    justifyContent: "center",
    alignItems: "center",
  },
  tab_history: {
    // marginVertical: getWidth(15),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getWidth(10),
    paddingBottom: getHeight(15),
    borderLeftWidth: 2,
    borderLeftColor: "#E5E5E5",
    position: "relative",
    marginLeft: getWidth(10),
  },
  tab_historyOther: {
    borderLeftColor: "transparent",
    paddingLeft: getWidth(20),
  },
  ViewBoxSceOther: { 
    padding: getWidth(10),
    borderRadius: getWidth(8)
  },
  bgWhite: {
    backgroundColor: "#fff",
    marginBottom: getHeight(15),
  },
  imgCheckList: {
    width: getWidth(18.47),
    height: getWidth(13.76),
    resizeMode: "contain",
  },
  bgPink: {
    backgroundColor: "#FFEDED",
    borderColor: "#FDA7A7",
    borderWidth: 3,
    marginBottom: getHeight(15),
  },
  errorMessage: {
    marginTop: 20,
    color: '#FA5151',
    paddingLeft: 15
  },
})