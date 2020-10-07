import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

// const { height, width } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    // flexDirection: "row",
  },
  hitSlop: {
    top: 10,
    right: 10,
    left: 10,
    bottom: 10,
  },
  boxItemDrawer: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  boxItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  boxItemDrawerNoBorder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    backgroundColor: theme.colors.white,
  },
  boxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconLeft: {
    resizeMode: "contain",
    marginRight: theme.space[3],
  },
  iconRight: {
    resizeMode: "contain",
    marginLeft: theme.space[3],
  },
  itemCircle: {
    backgroundColor: "red",
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.borRadius.borderRadius8,
    alignItems: "center",
    justifyContent: "center",
  },
  txtItemCircle: { color: theme.colors.white, fontSize: 8 },
  boxTextInput: {
    marginHorizontal: theme.space[4],
    marginVertical: theme.space[3],
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borRadius.borderRadius12,
    backgroundColor: theme.colors.gray400,
  },
  textInput: { height: 40, flex: 1, marginHorizontal: theme.space[3] },
  headerModal: {
    height: 40,
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  boxClose: {
    position: "absolute",
    left: theme.space[3],
  },
  spaceView: {
    width: "100%",
    height: theme.spaces.space10,
  },
  boxList: {
    backgroundColor: theme.colors.white,
    paddingLeft: theme.space[8],
    maxHeight: 200,
  },
  boxItemDrawerNoBorderPaddingLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    backgroundColor: theme.colors.white,
    paddingLeft: theme.space[4],
  },
  searchContainer: {
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.gray200,
    paddingBottom: theme.space[2],
    borderBottomWidth: 1,
  },
  txtHeader: { fontSize: 18 },
});
