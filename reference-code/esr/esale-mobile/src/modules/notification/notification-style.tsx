import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../config/constants";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    height: height - 55,
    paddingHorizontal: theme.space[4],
    backgroundColor: "#F9F9F9",
    paddingTop: 6,
    paddingBottom: theme.space[10],
  },
  btnWhite: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    paddingHorizontal: "3%",
    marginVertical: 7,
    backgroundColor: "#e5e5e5",
  },
  btnGray: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    paddingHorizontal: "3%",
    marginVertical: 7,
    backgroundColor: "#fff",
  },
  topContent: {
    width: "100%",
    height: 35,
    flexDirection: "row",
    marginVertical: 6,
  },
  info: { flex: 2, flexDirection: "row", alignItems: "center" },
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: "absolute",
  },
  txtSender: { color: "#333333", fontSize: 14, marginLeft: 8, maxWidth: "70%" },
  date: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: "0.5%",
  },
  txtCreateDate: { color: "#333333", fontSize: 10 },
  txtMessage: { color: "#333333", fontSize: 14 },
  loading: { marginTop: "30%" },
  image: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.green2,
  },
  txtAvatar: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[1],
    fontWeight: "bold",
  },
});
