import { StyleSheet, Platform, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

export const getScreenWidth = () => {
  return Dimensions.get("window").width;
};

export const ModalDetailStyles = StyleSheet.create({
  safe: {
    flex: 1,
    marginTop: Platform.OS !== "ios" ? 0 : 15,
  },
  titleHeader: { fontWeight: "400", color: "#333333" },
  appbarCommonStyle: {
    backgroundColor: theme.colors.white,
    height: 50,
  },
  scroll: { marginBottom: "30%" },
  txtCreate: { color: "#333333", fontSize: 13, flex: 1 },
  createTimeline: {
    width: 60,
    backgroundColor: "#EAEAEA",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  txtCreateTimeline: { color: "#969696" },
  createTimelineIn: {
    width: 60,
    backgroundColor: theme.colors.blue200,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  txtCreateTimelineIn: { color: theme.colors.white },
  create: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: "3%",
  },
  inputCreate: { flex: 1, paddingRight: 8 },
  createComment: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#F9F9F9",
  },
  reactionListModal: {
    width: getScreenWidth(),
    height: "100%",
  },
});
