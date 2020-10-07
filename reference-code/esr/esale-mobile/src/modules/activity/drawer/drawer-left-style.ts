import { StyleSheet } from "react-native"
import { getHeight, getWidth, normalize } from "../../calendar/common"
import { theme } from "../../../config/constants"

const DrawerLeftStyles = StyleSheet.create({
  content: {
    backgroundColor: "#EDEDED",
  },
  contentHeader: {
    flexDirection: "column",
  },
  hasSelected: {
    backgroundColor: "#E7EEF5",
    color: "#0F6DB5"
  },
  boxTextTitle: {
    padding:normalize(10),
    borderTopLeftRadius: getWidth(7),
    borderBottomLeftRadius: getWidth(7),
    marginTop: normalize(5),
    overflow:'hidden'
  },
  //content
  textFontSize: {
    fontSize: normalize(14),
    color: "#333",
  },
  container: {
    flex: 1,
    // paddingHorizontal: 15,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: normalize(8)
  },
  btn: {
    width: getWidth(50),
    height: getHeight(50),
    justifyContent: "center",
    alignItems: "flex-end",
  },
  headerArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mrTopK: {
    marginTop: normalize(5),
  },
  padBot: {
    paddingBottom: normalize(15),
  },
  //header
  boxHeader: {
    paddingHorizontal: normalize(15),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#E4E4E4",
    borderTopWidth: 1,
    minHeight: 64,
  },
  boxHeaderOther: {
    paddingVertical: normalize(20),
    paddingLeft: normalize(15),
    backgroundColor: "#fff",
    borderTopColor: "#E4E4E4",
    borderTopWidth: 1,
  },
  boxHeaderSearch: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(15),
    backgroundColor: "#fff",
    borderTopColor: "#E4E4E4",
    borderTopWidth: 1,
  },
  textHeader: {
    fontSize: normalize(18),
    color: "#333",
    flex: 1,
  },
  boxText: {
    marginLeft: normalize(15),
  },
  generalIcon: {
    width: getWidth(16),
    height: getHeight(16),
    resizeMode: "contain",
    tintColor: "#999",
  },
  iconUpDown: {
    width: getWidth(12),
    height: getHeight(8),
    resizeMode: "contain",
    tintColor: "#999",
  },
  textLeft: {
    marginLeft: normalize(10),
  },
  sectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: getHeight(54),
    flex: 1,
    borderColor: "#E2E2E2",
    borderWidth: 1,
    borderRadius: getWidth(10),
    backgroundColor: "#F9F9F9",
    overflow:'hidden'
  },
  imageStyle: {
    margin: normalize(10),
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  inputSearch: {
    backgroundColor: "#F9F9F9"
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  search: {
    marginTop: theme.space[4],
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingLeft: theme.space[3],
    borderRadius: theme.borderRadius,
    overflow: "hidden",
    backgroundColor: theme.colors.white200
  },
})

export default DrawerLeftStyles
