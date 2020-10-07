import { StyleSheet, Dimensions, PixelRatio } from "react-native";
const widths = Dimensions.get('window').width;
const heights = Dimensions.get('window').height
/**
 * stype Button
 */
export const styles = StyleSheet.create({
  styleButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 0.7,
    borderRadius: 8,
  },
  styleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  textDisable: {
    color: "#999999",
  },
  text5Px: {
    paddingHorizontal: 5 / PixelRatio.get(),
    paddingVertical: 5 / PixelRatio.get(),
  },
  text10Px: {
    paddingHorizontal: 10 / PixelRatio.get(),
    paddingVertical: 10 / PixelRatio.get(),
  },
  textButtonSuccess: {
    color: "#ffffff",
  },
  textButtonNoSuccess: {
    color: "#333333"
  },
  textButtonNoSuccessPress: {
    color: "#0f6db5",
    fontWeight: "bold"
  },
  disableSuccess: {
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
    width: 0.15 * widths,
    height: 0.05 * heights
  },
  disableBigSucces: {
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
    width: 0.8 * widths,
    height: 0.06 * heights
  },
  disableMiniModal: {
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
    width: 0.4 * widths,
    height: 0.07 * heights
  },
  disableDialogSuccess: {
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
    width: 0.25 * widths,
    height: 0.05 * heights
  },
  disableMiniButton: {
    backgroundColor: "#EDEDED",
    borderColor: "#EDEDED",
    width: 0.29 * widths,
    height: 0.04 * heights
  },
  success: {
    backgroundColor: "#0f6db5",
    borderColor: "#707070",
    width: 0.15 * widths,
    height: 0.05 * heights,
  },
  successPress: {
    borderColor: "#707070",
  },
  nonSuccess: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.15 * widths,
    height: 0.05 * heights,
  },
  nonSuccessPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  bigSuccess: {
    backgroundColor: "#0f6db5",
    borderColor: "#707070",
    width: 0.8 * widths,
    height: 0.06 * heights
  },
  bigSuccessPress: {
    borderColor: "#707070",
  },
  bigNoSuccess: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.8 * widths,
    height: 0.06 * heights
  },
  bigSuccessNoPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  miniModalSuccess: {
    backgroundColor: "#0f6db5",
    borderColor: "#707070",
    width: 0.4 * widths,
    height: 0.07 * heights
  },
  miniModalSuccessPress: {
    borderColor: "#707070",
  },
  miniModalNoSuccess: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.4 * widths,
    height: 0.07 * heights
  },
  miniModalNoSuccessPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  dialogSuccess: {
    backgroundColor: "#f92525",
    borderColor: "#707070",
    width: 0.25 * widths,
    height: 0.05 * heights
  },
  dialogSuccessPress: {
    borderColor: "#707070",
  },
  dialogNoSuccess: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.25 * widths,
    height: 0.05 * heights
  },
  dialogNoSuccessPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  miniButton: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    paddingHorizontal: 7,
    height: 0.04 * heights
  },
  miniButtonPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  total: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.23 * widths,
    height: 0.062 * heights
  },
  totalPress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  history: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.2 * widths,
    height: 0.041 * heights
  },
  historyPrees: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  change: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.34 * widths,
    height: 0.041 * heights,
  },
  changePress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  favourite: {
    backgroundColor: "#FBFBFB",
    borderColor: "#707070",
    width: 0.45 * widths,
    height: 0.062 * heights,
  },
  favouritePress: {
    borderColor: "#0f6db5",
    borderWidth: 1.5
  },
  styleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  styleIcon: {
    marginRight: 15,
    width: 20,
    height: 20
  }
})