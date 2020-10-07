import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";

const { width: device_width, height: device_height } = Dimensions.get("window");

export const SelectWithSearchBoxStyles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
    flex: 1,
  },
  headerModal: {
    paddingHorizontal: theme.space[3],
    width: "100%",
  },
  modalView: {
    maxHeight: (device_height / 3) * 2,
    minHeight: device_height / 2,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: theme.space[2],
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  spaceView: {
    height: theme.space[3],
    width: "100%",
    backgroundColor: theme.colors.gray200,
  },
  commonButton: {
    marginHorizontal: theme.space[2],
    width: device_width / 2.5,
    paddingVertical: theme.space[4],
    borderRadius: theme.borRadius.borderRadius15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: theme.colors.blue200,
  },
  inActiveButton: {
    backgroundColor: theme.colors.gray200,
  },
  commonTextButton: {
    fontWeight: "600",
    fontSize: theme.fontSizes[3],
  },
  activeTextButton: {
    color: theme.colors.white,
  },
  inActiveTextButton: {
    color: "#999999",
  },
  listSearch: {
    height: device_height / 2.5,
  },
  selectItemContainer: {
    paddingTop: theme.space[1],
    alignItems: "center",
    paddingRight: theme.space[1],
    flexWrap: "wrap",
    marginTop: theme.space[3],
    marginRight: theme.space[3],
  },
  selectAvatar: {
    width: 40,
    height: 40,
  },
  deleteContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 999,
  },
  deleteIcon: {
    width: theme.space[4],
    height: theme.space[4],
  },
  inputNotification: {
    marginTop: theme.space[3],
    borderWidth: 0,
  },
  floatButtonContainer: {
    bottom: theme.space[5],
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
  },
});

export const SearchItemStyles = StyleSheet.create({
  searchItem: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[3],
    flexDirection: "row",
    justifyContent: "space-between",
    width: device_width,
    borderBottomWidth: 1,
    borderColor: theme.colors.gray100,
  },
  checkBoxStyle: {
    width: theme.space[5],
    height: theme.space[5],
  },
  avatarIcon: {
    width: theme.space[8],
    height: theme.space[8],
    marginRight: theme.space[2],
  },
  infoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameStyle: {
    color: "#666666",
    marginBottom: theme.space[1],
    fontSize: theme.fontSizes[1],
  },
  infoStyles: {
    color: theme.colors.black,
    fontWeight: "600",
  },
})