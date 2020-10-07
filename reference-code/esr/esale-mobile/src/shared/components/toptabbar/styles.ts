import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

const { width: device_width } = Dimensions.get("window");
export const TabbarContainerStyle = StyleSheet.create({
  btnTabWrap: {
    // flex: 1,
    flexDirection: "row",
  },
});

export const TabbarItemStyle = StyleSheet.create({
  commonTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    height: theme.space[13],
    width: device_width / 3,
    height: 45,
  },

  btnTab: {
    flex: 1,
    borderBottomColor: "#E5E5E5",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
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
    paddingVertical: theme.space[2]
    // marginVertical: theme.space[1],
  },

  activeBorderTab: {
    borderRightWidth: 0,
  },
  borderTab: {
    borderRightWidth: 0.5,
    borderColor: theme.colors.gray100
  },
  btnTxt: {
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
    height: theme.space[5],
    width: theme.space[5],
    borderRadius: theme.space[5] / 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
    marginBottom: theme.space[4],
    position: "absolute",
    top: theme.space[1],
    right: theme.space[3],
  },

  countNoti2: {
    backgroundColor: theme.colors.gray,
    height: theme.space[5],
    borderRadius: theme.space[5] / 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
    marginBottom: theme.space[4],
    padding: theme.space[1],
    position: "absolute",
    right: theme.space[1],
    top: theme.space[1]
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
    fontWeight: "bold"
  },

  icon: {
    width: 24,
    height: 24,
  }
});
