import { StyleSheet, Dimensions } from "react-native";
export const styles = StyleSheet.create({
  modalContainerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalContentConfirm: {
    width: Dimensions.get("window").width / 1.2,
    height: Dimensions.get("window").height / 3,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  modalContentConfirmDirtyCheckTitle: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  modalContentConfirmTitle: {
    color: "#333333",
    fontSize: 16,
    marginBottom: 15,
  },
  modalContentConfirmMessage: {
    color: "#333333",
    fontSize: 14,
    paddingHorizontal: 20,

  },
  modalContentConfirmCancelButton: {
    flex: 1.5,
    flexDirection: "row",
  },
  modalContentConfirmViewTouchableOpacity: {
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContentConfirmTouchableOpacityButtonBack: {
    width: 118,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  modalContentConfirmTouchableOpacity: {
    width: Dimensions.get("window").width / 1.2 - 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  modalContentConfirmCancelTouchableOpacityColor: {
    backgroundColor: "transparent",
  },
  modalContentConfirmOKTouchableOpacityColor: {
    backgroundColor: "#0F6DB5"
  },
  modalContentConfirmOKText: {
    color: "#FFFFFF"
  }
});