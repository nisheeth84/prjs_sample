import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

const swidth = Dimensions.get('window').width

export const TaskDetailStyles = StyleSheet.create({

  // common

  bold: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },

  gray: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[3],
  },

  black: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[3],
  },

  rowCenter: {
    flexDirection: "row",
    justifyContent: "center"
  },

  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },


  // Item info top
  taskIcon: {
    width: 24,
    height: 14,
    justifyContent: "center",
  },

  iconTimelineShare:
  {
    flexDirection: "row",
    alignSelf: "flex-end"
  },

  taskName: {
    marginLeft: theme.space[2],
    fontWeight: "bold",
    color: theme.colors.black,
    fontSize: theme.fontSizes[2]
  },

  timeRange: {
    color: theme.colors.gray1,
    fontSize: theme.fontSizes[1],
    marginVertical: theme.space[4]
  },

  topInfoButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.space[4],
    alignItems: "center"
  },

  topInfoIconCopy: {
    height: 32,
    width: 32,
    justifyContent: "center",
  },

  topInfoIconEditTask: {
    marginHorizontal: theme.space[4]
  },

  buttonCompleteTask: {
    height: 48,
  },

  textButtonCompleteTask: {
    fontWeight: "bold",
    paddingHorizontal: theme.space[1]
  },

  // Tab Trading Task

  prTotalPrice:
  {
    borderColor: theme.colors.gray200,
    borderTopWidth: 6,
    borderBottomWidth: 5
  },

  totalPrice: {
    height: 75,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: theme.space[8],
    paddingHorizontal: theme.space[4]
  },

  inforTask: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: theme.colors.gray100,
    borderTopWidth: 2
  },

  // Set include style
  inforTaskSetInClude: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inforTaskSetInCludeText: {
    marginLeft: theme.space[4],
  },

  // general info item
  generalInfoItem: {
    backgroundColor: theme.colors.white200,
    paddingVertical: theme.space[5],
    paddingHorizontal: theme.space[4],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: theme.colors.gray100,
    borderTopWidth: 1
  },

  image: {
    width: swidth * 0.28,
    height: 3 / 5 * swidth * 0.28,
    resizeMode: "cover",
    borderRadius: 5
  },

  productName: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
    color: theme.colors.black
  },

  productCategory: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray1
  },

  productPrice: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray1
  },

  iconArrowRight: {
    justifyContent: "center"
  },

  title: { fontWeight: "bold", fontSize: theme.fontSizes[3] },

  row: {
    flexDirection: "row",
  },

  container: {
    paddingTop: 0,
    backgroundColor: theme.colors.white100,
    flex: 1
  },

  //Top tab style

  btnTabWrap: {
    flex: 1,
    flexDirection: "row",
  },
  btnTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    flexDirection: "row",
  },

  btnTabActive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    backgroundColor: theme.colors.blue100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue200,
    flexDirection: "row",
  },
  btnTxt: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[2],
    fontWeight: "bold"
  },
  btnTxtActive: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
    fontWeight: "bold"
  },
  countNoti: {
    backgroundColor: theme.colors.red,
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.space[2],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
    marginBottom: theme.space[4]
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
  },
  commonTab: {
    flex: 1,
    paddingVertical: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    height: theme.space[13],
  },

  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: theme.space[8]
  },

  tabContainer: {
    backgroundColor: theme.colors.white
  },
});


export const TaskDetailModalStyle = StyleSheet.create({
  mainContainer:
  {
    backgroundColor: "#000000CC",
    height: "100%",
    justifyContent: "center",
    alignContent: "center"
  },
  container: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[6],
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: theme.colors.black,
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
  },
  content: {
    color: theme.colors.black,
    marginTop: theme.space[5],
    textAlign: "center"
  },

  contentConfirm: {
    color: theme.colors.black,
    textAlign: "center"
  },
  wrapButton: {
    flexDirection: "row",
    marginTop: theme.space[5],
  },
  wrapButtonVer: {
    marginTop: theme.space[5],
    width: "100%"
  },
  buttonCancel: {
    marginRight: theme.space[5],
    alignItems: "center",
    width: 100,
    paddingVertical: theme.space[3],
    fontWeight: "bold",
  },
  buttonDelete: {
    backgroundColor: theme.colors.red,
    alignItems: "center",
    paddingVertical: theme.space[3],
    borderRadius: theme.borderRadius,
    fontWeight: "bold",
    flex: 1
  },

  buttonCancelBorder: {
    marginRight: theme.space[5],
    alignItems: "center",
    flex: 1,
    paddingVertical: theme.space[3],
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray100
  },

  buttonDeleteTaskNotComplete: {
    backgroundColor: theme.colors.blue200,
    alignItems: "center",
    padding: theme.space[3],
    borderRadius: theme.borderRadius,
    marginTop: theme.space[3]
  },
  buttonTextCancel: {
    color: theme.colors.black,
    fontWeight: "bold",
  },
  buttonTextDelete: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
});

const cycle = theme.space[5];


export const TabHistoryStyles = StyleSheet.create({
  container: {
    // paddingTop: theme.space[4]
  },
  changedContainer: {
    flexDirection: 'row',
    paddingVertical: theme.space[1],
    marginLeft: 16
  },

  changedLabel: {
    fontSize: theme.fontSizes[1],
    maxWidth: "50%"
  },
  changedContainerParent: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  arrowIcon: {
    width: 18,
    height: 12,
    marginHorizontal: theme.space[2]
  },
  marginVerticalView: {
    marginVertical: 8,
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: theme.space[3]
  },
  timeLine: {
    alignItems: 'center'
  },
  labelContainer: { height: theme.space[9], justifyContent: 'center' },

  roundView: {
    width: cycle,
    height: cycle,
    borderColor: theme.colors.blue200,
    borderWidth: 2,
    borderRadius: cycle / 2
  },

  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.gray100
  },

  contentHistory: {
    justifyContent: 'center',
    paddingLeft: theme.space[5],
    flex: 1
  },

  historyLabel: {
    textAlignVertical: 'center',
    fontSize: theme.fontSizes[3],
    fontWeight: "bold"
  },

  dataContent: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
},

  propertyLabel: { paddingVertical: theme.space[1] },

  historyInfo: {
    flexDirection: 'row',
    paddingVertical: theme.space[3],
    alignItems: 'center'
  },

  userAvatar: {
    width: theme.space[6],
    height: theme.space[6]
  },
  userAvatarDefault: {
    width: theme.space[6],
    height: theme.space[6],
    borderRadius: theme.space[3],
    backgroundColor: theme.colors.green2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtUserName: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[1]
  },
  userName: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.blue400,
    marginLeft: theme.space[2]
  },

  dateChange: {
    fontSize: theme.fontSizes[1]
  },

  textInfo: {
    marginLeft: theme.space[6]
  }
})