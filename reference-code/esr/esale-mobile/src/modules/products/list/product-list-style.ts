import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const swidth = Dimensions.get("window").width;

export const ProductListItemStyles = StyleSheet.create({
  inforProduct: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.space[4],
  },
  content: {
    marginHorizontal: 8,
  },
  image: {
    width: swidth * 0.28,
    height: (3 / 5) * swidth * 0.28,
    resizeMode: "cover",
    borderRadius: 5,
  },

  productName: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
    color: "black",
  },

  productCategory: {
    fontSize: theme.fontSizes[3],
    color: "#666666",
  },

  productPrice: {
    fontSize: theme.fontSizes[3],
    color: "#666666",
  },

  iconArrowRight: {
    justifyContent: "flex-end",
  },
  title: { fontWeight: "bold", fontSize: theme.fontSizes[3] },
  row: {
    flexDirection: "row",
  },
  inforProductRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});

export const ProductListScreenStyles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray200,
  },
  loadingFooter: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: theme.space[2],
    backgroundColor: theme.colors.white,
  },
  infoBlock: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
  },
  title: {
    fontSize: 19,
  },
  firstRow: {
    // flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  date: {
    flexDirection: "row",
    fontSize: theme.fontSizes[0],
  },
  iconBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconEditButton: {
    marginHorizontal: 7,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconFilterButton: {
    marginHorizontal: 7,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconDescendingButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconOtherButton: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  listProduct: {
    flex: 1,
    marginTop: theme.space[3],
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#00CCAF",
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
  },
  fabIcon: {
    fontSize: 40,
    color: "white",
  },
  scrollView: {
    maxHeight: 104,
  },
  viewHeader: {
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  heightAppBar: {
    height: 54,
  },
});
