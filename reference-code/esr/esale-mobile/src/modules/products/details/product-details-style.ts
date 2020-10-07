import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

const deviceWidth = Dimensions.get("window").width;

export const ProductDetailsStyles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },
  itemTitle: {
    color: '#333333',
    fontWeight: 'bold'
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
  },

  gray: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[3],
  },

  loadingView: {
    paddingVertical: theme.space[3],
  },

  // Tab Trading Product
  totalPrice: {
    height: 75,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: theme.space[8],
    paddingHorizontal: theme.space[4],
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray100,
  },

  inforProduct: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },

  tradingItem: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    borderColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },

  tabContainer: {
    backgroundColor: theme.colors.white,
  },
  // Set include style
  inforProductSetInClude: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inforProductSetInCludeText: {
    marginLeft: theme.space[4],
  },
  // general info item
  generalInfoItem: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[4],
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },
  blueName: {
    color: "#0F6BB2",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
  },

  image: {
    width: deviceWidth * 0.28,
    height: (3 / 5) * deviceWidth * 0.28,
    resizeMode: "contain",
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
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    right: theme.space[1],
  },

  title: { fontWeight: "bold", fontSize: theme.fontSizes[3] },

  row: {
    flexDirection: "row",
  },

  container: {
    paddingTop: 0,
    backgroundColor: theme.colors.white100,
    flex: 1,
  },
  setIncludeBg: { backgroundColor: "white" },
  setIncludePrTitle: { height: 62, justifyContent: "center" },
  setIncludeTitle: { paddingHorizontal: theme.space[4], fontWeight: "bold" },
  flexWrap: { width: deviceWidth * 0.60 },
  scrollView: {
    maxHeight: 104
  }
});

export const TabHistoryStyles = StyleSheet.create({
  changedContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.space[1],
    flexWrap: "wrap",
  },
  noHistoryField: {
    textAlign: "center",
    paddingTop: theme.space[5],
  },
  arrowIcon: {
    width: 18,
    height: 12,
    marginHorizontal: theme.space[2],
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: theme.space[3],
  },
  timeLine: {
    alignItems: "center",
  },
  labelContainer: { height: theme.space[9], justifyContent: "center" },
  roundView: {
    width: theme.space[9],
    height: theme.space[9],
    borderColor: theme.colors.gray300,
    borderWidth: 1,
    borderRadius: theme.space[9] / 2,
  },
  verticalLine: { width: 0.5, flex: 1, backgroundColor: theme.colors.gray300 },
  contentHistory: {
    justifyContent: "center",
    paddingLeft: theme.space[5],
    flex: 1,
  },
  historyLabel: {
    textAlignVertical: "center",
    fontSize: theme.fontSizes[3],
  },
  dataContent: { flex: 1 },
  propertyLabel: { paddingVertical: theme.space[1] },
  historyInfo: {
    flexDirection: "row",
    paddingVertical: theme.space[3],
    alignItems: "center",
  },
  userAvatar: { width: theme.space[6], height: theme.space[6] },
  userName: { fontSize: theme.fontSizes[1], color: theme.colors.blue400 },
  dateChange: { fontSize: theme.fontSizes[1] },
  textInfo: {
    marginLeft: theme.space[6],
  },
});
