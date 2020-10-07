import { StyleSheet } from "react-native";
import { getHeight, getWidth } from "../../common/index";
const style = StyleSheet.create({
  checkBox: {
    width: getWidth(15),
    height: getHeight(20),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
});
export default style;
