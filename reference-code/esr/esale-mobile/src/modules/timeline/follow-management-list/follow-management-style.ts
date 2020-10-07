import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const FollowMangementStyles = StyleSheet.create({

  prTotal: {
    padding: theme.space[5],
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 10
  },

  total: {
    fontSize: theme.fontSizes[2],
    fontWeight: "bold"
  },

  main: {
    paddingVertical: theme.space[5] / 2
  },

  prFollowItem: {
    paddingTop: theme.space[5] / 2,
    paddingHorizontal: theme.space[5],
    paddingBottom: theme.space[5] / 2,
  },

  titleIcon: {
    fontSize: theme.fontSizes[1],
    marginLeft: theme.space[1],
    fontWeight: "bold"
  },

  iconClose: {
    width: 26,
    height: 26,
  },

  iconClosePr: {
    position: "absolute",
    width: 26,
    height: 26,
    right: 8,
    top: 2,
  },

  followItem: {
    backgroundColor: theme.colors.gray200,
    padding: theme.space[4],
    borderRadius: theme.borRadius.borderRadius15
  },

  modalTitlePadding5: {
    paddingVertical: theme.space[8],
    paddingHorizontal: theme.space[2]
  },
  titleStyle:{
    fontSize: 18,
    color: theme.colors.black,
    fontWeight: 'bold'
  }
});