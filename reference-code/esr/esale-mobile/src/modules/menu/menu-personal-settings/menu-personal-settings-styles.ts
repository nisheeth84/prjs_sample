import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { theme } from "../../../config/constants";

export const personalSettingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCategorySelected: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius: theme.borRadius.borderRadius12,
    backgroundColor: theme.colors.blue100,
    marginVertical: theme.space[2],
    marginHorizontal: "20%",
  },
  iconCategory: {
    marginBottom: theme.space[6],
    marginTop: theme.space[3],
    marginHorizontal: 70,
    height: "45%",
    resizeMode: "contain",
  },
  boxCategory: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius: theme.borRadius.borderRadius12,
    marginVertical: theme.space[2],
  },
  txtCategory: {
    color: theme.colors.gray4,
    fontSize: RFPercentage(4),
  },
  txtCategorySelected: {
    color: theme.colors.blue200,
    fontSize: RFPercentage(4),
  },
});

export const changePasswordStyle = StyleSheet.create({
  boxWarning: {
    backgroundColor: theme.colors.yellow,
    marginVertical: theme.space[3],
    marginHorizontal: theme.space[1],
    borderRadius: theme.borRadius.borderRadius12,
  },
  boxMessage: {
    width: "100%",
    paddingVertical: theme.space[2],
    alignItems: "center",
  },
  boxMessageSuccess: {
    width: "100%",
    paddingTop: theme.space[2],
    alignItems: "center",
    position: "absolute",
    bottom: theme.space[2],
  },
  headerWarning: {
    flexDirection: "row",
    marginTop: theme.space[7],
    marginBottom: theme.space[2],
    marginHorizontal: theme.space[3],
    alignItems: "flex-start",
  },
  contentWarning: {
    marginHorizontal: theme.space[3],
    marginBottom: theme.space[7],
    alignItems: "flex-start",
    color: theme.colors.black,
  },
  titleWarning: {
    // alignItems: "flex-start",
    flex: 1,
    textAlign: "center",
    paddingHorizontal: theme.space[4],
  },

  iconWarning: {
    marginRight: theme.space[1],
  },
  formInput: { marginVertical: theme.space[3] },
  formLastInput: { marginBottom: 40 }
});

export const LanguageAndTimeSettingStyles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white, flex: 1 },
  spaceVertical: { marginVertical: theme.space[7] },
});

export const NotificationSettingStyles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white, flex: 1 },
  containerContent: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
  },
  notificationDaily: {
    alignItems: "center",
    marginVertical: theme.space[4],
    paddingHorizontal: theme.space[7],
    paddingVertical: theme.space[2],
    borderRadius: theme.borRadius.borderRadius12,
    borderColor: theme.colors.gray200,
    borderWidth: 1,
  },
  chooseNotificationTimeView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  btnChooseNotificationTime: {
    paddingHorizontal: theme.space[4],
    backgroundColor: theme.colors.gray200,
    paddingVertical: theme.space[2],
    borderRadius: theme.borRadius.borderRadius12,
    marginHorizontal: theme.space[1],
  },
  txtChooseNotificationTime: { color: theme.colors.gray },
  spaceTop30: { marginTop: 30 },
  spaceTop50: { marginTop: 50 },

  listEmail: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[1],
  },
  boxContentNewEmail: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    justifyContent: "space-between",
  },
  iconClose: {
    height: 12,
    resizeMode: "contain",
  },
  boxTextEmail: {
    marginTop: theme.space[2],
    backgroundColor: theme.colors.gray200,
    borderRadius: theme.borRadius.borderRadius12,
  },
  boxAddEmail: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
    marginVertical: theme.space[7],
  },
  txtEmail: {
    width: "90%",
    fontSize: theme.fontSizes[1],
  },
  boxConfirm: {
    paddingTop: 32,
    height: 200,
    paddingHorizontal: 8,
    paddingVertical: theme.space[1],
  },
  txtContent: {
    paddingVertical: theme.space[2],
  },
  themeError: {
    backgroundColor: theme.colors.pink,
  },
});
