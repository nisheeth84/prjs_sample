import { StyleSheet } from "react-native";
import { theme } from "../../config/constants";

export const MenuFeatureOtherStyles = StyleSheet.create({
  iconStyle: {
    width: 20,
    resizeMode: "contain",
  },
  iconArrowStyle: {
    width: 20,
    resizeMode: "contain",
    marginRight: theme.space[1],
  },
  titleStyle: {
    marginLeft: theme.space[3],
  },
  txtFeatureOther: {
    marginLeft: theme.space[1],
  },
  scopeSelect: {
    bottom: 40,
    top: 40,
    right: 40,
    left: 40,
  },
  iconDescriptionStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: theme.space[3],
  },
  wrapHeader: {
    paddingTop: theme.space[4],
    paddingBottom: theme.space[4],
    marginHorizontal: theme.space[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapMenuItem: {
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[4],
    marginHorizontal: theme.space[2],
    position: "relative",
    marginBottom: theme.space[10],
  },
  wrapMenuItemDisable: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: theme.borderRadius,
    zIndex: 9,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 0.8,
  },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.space[3],
  },
});

export const MenuFeaturePopularStyles = StyleSheet.create({
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  iconDescriptionStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: theme.space[3],
  },
  titleFeatureStyle: {
    marginLeft: theme.space[3],
  },

  wrapHeader: {
    paddingTop: theme.space[4],
    paddingBottom: theme.space[2],
    marginHorizontal: theme.space[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapMenuItem: {
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[4],
    marginHorizontal: theme.space[2],
    justifyContent: "center",
  },
  wrapTitle: {
    flexDirection: "row",
    paddingLeft: theme.space[1],
    alignItems: "center",
  },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.space[3],
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: theme.borderRadius,
  },
  limitTitleText: {
    color: theme.colors.gray,
    marginLeft: theme.space[2],
  },
});

export const MenuFeatureStyles = StyleSheet.create({
  wrapMenuItem: {
    marginTop: theme.space[1],
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },
  titleStyle: {
    marginLeft: theme.space[3],
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.space[3],
  },
});

export const MenuInfoStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[3],
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: theme.colors.gray200,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.green2,
  },
  txtAvatar: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[4],
    fontWeight: "bold",
  },
  wrapContent: {
    marginLeft: theme.space[3],
    maxWidth: "90%",
  },
  companyTitle: {
    fontSize: theme.fontSizes[4],
    maxWidth: 200,
  },
  jobTitle: {
    fontSize: theme.fontSizes[1],
    maxWidth: 200,
  },
  infoUser: {
    flexDirection: "row",
  },
  iconStyle: {
    width: 20,
    resizeMode: "contain",
  },
  avatarDefaul: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.green2,
    alignItems: "center",
    justifyContent: "center",
  },
  scopeSelect: {
    bottom: 20,
    top: 20,
    right: 20,
    left: 20,
  },
});

export const MenuScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
