import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const FilterScreen = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ECECEC"
  },
  titleHeader: { fontWeight: "400", color: "#333333" },
  appbarCommonStyle: {
    backgroundColor: theme.colors.gray400,
    height: 60,
  },
  scroll: {
    width: "100%",
  },
  unread: {
    width: "100%",
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: "3%",
    backgroundColor: "white",
  },
  txtUnread: { color: "#333333", fontSize: 14, flex: 1 },
  container: {
    marginTop: 10,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  options: {
    width: "100%",
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: "3%",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  optionsLeft: { flex: 1, paddingLeft: "1%" },
  optionsRight: { flex: 1, paddingLeft: "5%" },
  btnLeft: {
    height: 40,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: { fontSize: 14, color: "#333333", marginHorizontal: "10%" },
  btnRight: {
    height: 40,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    width: "100%",
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: "3%",
    backgroundColor: "white",
  },
  titleItem: { fontSize: 14, color: "#333333", flex: 1 },
  imgItem: { width: 25, height: 25, paddingLeft: "10%" },
});
