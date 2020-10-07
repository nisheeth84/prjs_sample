import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

export const DrawerProductStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.space[4],
  },
  divide: {
    height: 1,
    backgroundColor: theme.colors.gray100,
  },
  divide2: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  list: {
    padding: theme.space[4],
  },
  search: {
    marginTop: theme.space[4],
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingLeft: theme.space[3],
    borderRadius: theme.borderRadius,
    overflow: "hidden",
    backgroundColor: theme.colors.white200
  },
  listItem: {
    padding: theme.space[4],
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  inputSearch: {
    backgroundColor: "#F9F9F9"
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  titleHeader: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[4],
  },
  titleList: {
    fontWeight: "bold",
  },
  childListWrapper: {
    marginTop: theme.space[5],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childList: {
    marginLeft: theme.space[4],
  },
  elementChildWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: theme.space[4],
  },
  elementChild: {
    marginTop: 10,
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  iconEdit: {
    justifyContent: "center",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconArrowDown: {
    marginRight: theme.space[4],
  },
  headerArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkActiveIcon: {
    width: 32,
    height: 32
  },
  checkboxCategoryChild: {
    flexDirection: "row",
    alignItems: "center",
    margin: theme.space[4],
  }
});