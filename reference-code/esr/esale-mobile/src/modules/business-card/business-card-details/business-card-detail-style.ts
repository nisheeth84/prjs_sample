import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";
import { getScreenWidth, getScreenHeight } from "../../../shared/util/app-utils";

const cycle = theme.space[4];

export const BusinessCardDetailStyle = StyleSheet.create({
  main: {
    paddingTop: 10,
    flex: 1,
    paddingBottom: 10,
  },

  topInfoGroupName: {
    paddingHorizontal: theme.space[2],
  },

  labelHasActivity: {
    marginTop: theme.space[2],
  },

  lastContactDate: {
    paddingTop: theme.space[2],
  },

  listEmployeeName: {
    paddingBottom: theme.space[3],
    marginLeft: theme.space[2],
    flexDirection: "row",
    alignItems: "center",
  },

  buttonFollow: {
    height: 45,
    marginLeft: theme.space[2],
  },

  buttonCopy: {
    height: 24,
    width: 24,
    padding: theme.space[2],
    justifyContent: "center",
    marginHorizontal: theme.space[1],
  },
  topGrButton: {
    marginTop: theme.space[3],
  },
  iconEmployee: {
    width: 24,
    height: 24,
    marginRight: theme.space[1],
  },

  iconEmployeePlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.blue200,
    justifyContent: "center",
    alignItems: "center",
  },

  topGrButtonRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  topGrButtonCopyEdit: {
    height: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "green",
  },
  contentModalDeleteBusinessCard: {
    color: theme.colors.black,
    paddingVertical: theme.space[12],
    textAlign: "center",
    fontSize: theme.fontSizes[2],
    paddingHorizontal: theme.space[2],
  },

  historyDetailTab: {
    flex: 1,
    height: "100%",
    paddingBottom: getScreenHeight(),
  },

  imagePreviewStyle: {
    width: getScreenWidth(),
    height: getScreenWidth() * 0.66,
  },
});

export const HistoryUpdateDetailStyle = StyleSheet.create({
  messInfoHistoryUpdateDetail: {
    margin: theme.space[2],
    fontSize: theme.fontSizes[2],
    flex: 1,
  },

  infoMessage: {
    backgroundColor: theme.colors.blue100,
    borderRadius: theme.borRadius.borderRadius12,
    height: 100,
    margin: theme.space[4],
    borderWidth: 1,
    borderColor: theme.colors.blue100,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.space[1],
  },
});

export const TabHistoryStyles = StyleSheet.create({
  changedContainer: {
    flexDirection: "row",
    paddingVertical: theme.space[1],
    justifyContent: "center",
    alignItems: "center",
  },

  changedContainerVer: {
    paddingVertical: theme.space[1],
  },

  changedLabel: {
    fontSize: theme.fontSizes[1],
    maxWidth: "50%",
  },

  changedContent: {
    fontSize: theme.fontSizes[1],
    maxWidth: "45%",
  },

  changedContainerParent: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  arrowIcon: {
    width: 18,
    height: 12,
  },
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: theme.space[3],
  },
  timeLine: {
    alignItems: "center",
  },
  labelContainer: { justifyContent: "center" },

  roundView: {
    width: cycle,
    height: cycle,
    borderColor: theme.colors.blue200,
    borderWidth: 2,
    borderRadius: cycle / 2,
  },

  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.gray100,
  },

  contentHistory: {
    justifyContent: "center",
    paddingLeft: theme.space[5],
    flex: 1,
  },

  historyLabel: {
    textAlignVertical: "center",
    fontSize: theme.fontSizes[2],
  },

  dataContent: { width: "100%", backgroundColor: theme.colors.white200, paddingHorizontal: theme.space[2], paddingVertical: theme.space[3], borderRadius: theme.space[3], marginBottom: theme.space[6] },

  propertyLabel: { paddingVertical: theme.space[1] },

  historyInfo: {
    flexDirection: "row",
    paddingVertical: theme.space[3],
    alignItems: "center",
  },

  userAvatar: {
    width: theme.space[6],
    height: theme.space[6],
  },
  userAvatarDefault: {
    width: theme.space[6],
    height: theme.space[6],
    borderRadius: theme.space[3],
    backgroundColor: theme.colors.green2,
    justifyContent: 'center',
    alignItems: 'center'

  },
  txtUserNameDefault: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.white,
  },
  userName: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.blue400,
    marginLeft: theme.space[2],
  },

  userName2: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.blue400,
    marginRight: theme.space[2],
    fontWeight: "bold",
  },

  link: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.blue400,
    marginRight: theme.space[2],
  },

  dateChange: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.blue200,
  },

  textInfo: {
    marginLeft: theme.space[6],
  },

  mergedBusinessCard: {
    flexDirection: "row",
    marginLeft: theme.space[3],
  },
  textContent: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.black
  }
});
