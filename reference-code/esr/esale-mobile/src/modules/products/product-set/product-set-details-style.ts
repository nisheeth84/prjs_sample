import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

const swidth = Dimensions.get("window").width;

export const ProductSetDetailsStyles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },
  itemTitle: {
    color: '#333333',
    fontWeight: 'bold'
  },
  gray: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[3],
  },

  // Tab Trading Product

  totalPrice: {
    height: 75,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: theme.space[8],
    paddingHorizontal: theme.space[4],
    borderColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },
  tabContainer: {
    backgroundColor: theme.colors.white,
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

  productSetDetailSetIncludePrTitle: {
    height: 62,
    justifyContent: "center",
  },

  productSetDetailSetIncludeTitle: {
    paddingHorizontal: theme.space[4],
    fontWeight: "bold",
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

  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
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
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    right: theme.space[1]
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

  //Top tab style

  btnTabWrap: {
    flex: 1,
    flexDirection: "row",
  },
  btnTab: {
    flex: 1,
    borderBottomColor: "#E5E5E5",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  commonTab: {
    flex: 1,
    paddingVertical: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    height: theme.space[13],
  },
  btnTabActive: {
    flex: 1,
    backgroundColor: theme.colors.blue100,
    borderBottomColor: theme.colors.blue200,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: theme.space[8],
  },
  btnTxt: {
    color: "black",
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
  },
  btnTxtActive: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
    fontWeight: "bold",
  },
  countNoti: {
    backgroundColor: theme.colors.red,
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.space[2],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
    marginBottom: theme.space[4],
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
  },
});

export const TabHistoryStyles = StyleSheet.create({
  changedContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.space[1],
    marginLeft: theme.space[3],
  },
  container: {
    paddingVertical: theme.space[3],
  },
  arrowIcon: {
    width: 18,
    height: 12,
    marginHorizontal: theme.space[2],
  },
  labelContainer: { height: theme.space[9], justifyContent: "center" },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: theme.space[3],
  },
  timeLine: {
    alignItems: "center",
  },
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
  dataContent: { flexDirection: "row" },
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

export const ProductIncludeStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray200,
    paddingHorizontal: theme.space[3],
    paddingTop: theme.space[3],
    borderRadius: theme.space[4],
    overflow: "hidden",
    marginTop: theme.space[4],
  },

  image: {
    height: "100%",
  },

  extendData: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.space[4],
    overflow: "hidden",
    marginTop: theme.space[4],
  },

  extendDataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },

  extendDataItemVer: {
    flex: 1,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  extendDataItemIconUpDown: {
    padding: theme.space[6],
    justifyContent: "center",
    flexDirection: "row",
  },
});
