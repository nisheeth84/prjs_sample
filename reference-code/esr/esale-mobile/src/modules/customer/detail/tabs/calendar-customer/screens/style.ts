import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#FFFF",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  lines: {
    width: "100%",
    height: 0.7,
    backgroundColor: "#CDCDCD",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomColor: "#CDCDCD",
    borderBottomWidth: 1,
  },
  buttonDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  listDisplay: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    paddingHorizontal: 7,
    borderRadius: 7,
    paddingVertical: 7,
    width: 110,
    justifyContent: "space-between",
  },
  buttonDayDisplay: {
    padding: 10,
    paddingVertical: 15,
  },
  format: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    paddingHorizontal: 20,
    borderRadius: 7,
    paddingVertical: 7,
  },
  titleDropdown: {
    marginRight: 15,
    fontWeight: "700",
  },
  txtDateTop: {
    color: "#333333",
  },
  todayTextColor: {
    backgroundColor: "#D5E2F2",
    color: "#333333",
  },
  calendar: {
    backgroundColor: "#000",
  },
});
