import { Platform, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const FileTimelineStyles = StyleSheet.create({
  item: {
    width: "100%",
    flexDirection: "row",
    height: 100,
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: "3%",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  safe: {
    flex: 1,
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 0 : 15,
  },
  itemIcon: { flex: 1, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 5 },
  itemName: { fontSize: 15, color: "#333333", marginBottom: 2 },
  txtItem: { color: "#666666", fontSize: 13 },
  container: { width: "100%" },
  titleHeader: { fontWeight: "400", color: "#333333" },
  appbarCommonStyle: {
    backgroundColor: theme.colors.gray400,
    height: 50,
  },
  icon: {
    flex: 1,
  },
  img: {
    width: "70%",
    height: "70%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalView: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    bottom: "5%",
    position: "absolute",
  },
  btnDialog: {
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  txtDialog: {
    fontSize: 16,
    color: "#333333",
  }
});
