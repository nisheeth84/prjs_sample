import { StyleSheet } from "react-native";
import { normalize } from "../../../../../../../shared/util/helper";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  body: {
    backgroundColor: "#fff",
    flex: 1,
  },
  otherMonth: {
    backgroundColor: "#F7F7F7",
    height: normalize(60),
    flex: 1,
    marginVertical: 10,
  },
  titleOtherMonth: {
    backgroundColor: "transparent",
    fontWeight: "700",
  },
  titleMusty: {
    fontSize: normalize(10),
    color: "#979797",
    paddingLeft: normalize(66),
    marginBottom: normalize(22),
  },
  fBold: {
    fontWeight: "700",
  },
});
