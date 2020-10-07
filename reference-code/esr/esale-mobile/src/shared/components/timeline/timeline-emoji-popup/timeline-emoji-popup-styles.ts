import { StyleSheet } from "react-native";

export const EmojiPopupStyles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    paddingLeft: "8%",
  },
  noLabel: {
    display: "none",
  },
  bubble: {
    backgroundColor: "white",
    marginBottom: 6,
    height: 30,
  },
  imgTab: { width: 15, height: 15, marginBottom: 12 },
  containerFace1: {
    width: "85%",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "3%",
  },
  txtEmojiHot: {
    fontSize: 14,
    color: "#333333",
    marginVertical: 10,
  },
  btnEmoji: {
    borderRadius: 8,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    marginVertical: 2,
  },
  btnEmojiIcon: { width: 22, height: 22 },
  emoji: {
    width: "85%",
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: "-2%",
  },
  tab: { backgroundColor: "#0F6EB4", height: 5 },
  tabContainer: { backgroundColor: "#E4E4E4", height: 40 },
  faceInput: { marginLeft: "3%", width: "80%" },
});