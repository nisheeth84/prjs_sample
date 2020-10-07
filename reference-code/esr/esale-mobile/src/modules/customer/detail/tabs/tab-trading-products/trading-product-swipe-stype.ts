import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
export const StyleSwipe = StyleSheet.create({
  inforBusinessCardActionFist: {
    width: Dimensions.get('window').width / 3,
    height: 0.17 * height,
    backgroundColor: "#F9F9F9",
    //paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  inforBusinessCardActionSecond: {
    width: width / 4,
    height: 0.155 * height,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  inforBusinessCardDetail: {
    textAlign: "center",
    fontSize: 12,
    color: "#333333"
  }
})