import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const CategoryItemStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.space[4],
  },

  header2: {
    backgroundColor: theme.colors.gray200,
    fontWeight: "bold"
  },

  iconLeft:
  {
    width: 8,
    height: 12
  },


  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: theme.space[8] + 12,
    paddingRight: theme.space[4],
    paddingVertical: theme.space[4],
    fontWeight: "bold"
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
  },
  listItem: {
    padding: theme.space[4],
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  titleHeader: {
    fontWeight: "600",
    fontSize: theme.fontSizes[4],
  },
  titleList: {
    fontWeight: "600",
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
});
