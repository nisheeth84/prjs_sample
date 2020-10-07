import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../config/constants";
const { width } = Dimensions.get("window");
export const EmptyStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
    alignItems: "center",
  },
  txt: {
    fontSize: theme.fontSizes[4],
  },
  image: {
    width: (width * 4) / 5,
    aspectRatio: 1,
    marginBottom: theme.space[3],
  },
  imageSVG: {
    width: (width * 0.3),
    aspectRatio: 1,
    marginBottom: theme.space[3],
  },
});
