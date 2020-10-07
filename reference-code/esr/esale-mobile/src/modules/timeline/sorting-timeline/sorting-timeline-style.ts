import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const SortingStyles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "100%",
    flexDirection: "row",
    height: 60,
    borderBottomColor: "#E4E4E4",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: "3%",
  },
  txtTitle: { flex: 1 },
  option: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  selected: {
    flexDirection: "row",
    width: 80,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0F6DB4",
    backgroundColor: "#D5E2F2",
    alignItems: "center",
    paddingTop: 1,
    paddingLeft: "7%",
    marginHorizontal: "3%",
  },
  notSelected: {
    flexDirection: "row",
    width: 80,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 1,
    paddingLeft: "7%",
    marginHorizontal: "3%",
  },
  icon: { width: 16, height: 16 },
  txtSelected: { color: "#0F6DB4", fontSize: 12, marginLeft: "15%" },
  txtNotSelected: { color: "#333333", fontSize: 12, marginLeft: "15%" },
  titleHeader: { fontWeight: "400", color: "#333333" },
  appbarCommonStyle: {
    backgroundColor: theme.colors.gray400,
    height: 50,
  },
});
