import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../config/constants";

const { height, width } = Dimensions.get("window");

export const AddMoveToListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
  },
  viewFragment: {
    flex: 1,
    borderColor: theme.colors.gray100,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.white,
  },
  paddingTxtInput: { padding: theme.space[3] },
  txt: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.black,
  },
  bold: {    
    fontWeight: '700',
  },
  viewPlaceholder: {
    flexDirection: "row",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: theme.borderRadius,
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[4],
    alignItems: "center",
  },
  padding: {
    height: theme.space[2],
  },
  directionRow: {
    flexDirection: "row",
  },
  txtRequired: {
    paddingHorizontal: theme.space[2],
    marginLeft: theme.space[1],
    marginTop: theme.space[1],
    backgroundColor: theme.colors.red600,
    color: theme.colors.white,
    borderRadius: theme.borderRadius,
  },
  warning: {
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.gray100,
    borderTopWidth: 1,
    marginBottom: theme.space[3],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[3],
    paddingBottom: theme.space[3] + 10,
  },
  text: {
    fontSize: theme.fontSizes[2],
    marginLeft: theme.space[1],
    color: theme.colors.black
  },
  viewWarming: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.blue100,
    padding: theme.space[3],
    borderRadius: 15,
  },
  input: {
    height: 36,
  },
  view: {
    borderColor: theme.colors.gray100,
    borderBottomWidth: 1,
    padding: theme.space[3],
  },
  body: {
    padding: theme.space[3],
  },
  btn: {
    borderRadius: theme.space[5],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    padding: theme.space[4],
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.space[4],
  },
  textBtn: {
    fontSize: theme.fontSizes[3],
  },
  viewInfo: {
    backgroundColor: theme.colors.white200,
    marginTop: theme.space[3],
    flexDirection: "row",
    padding: theme.space[3],
    borderRadius: theme.space[5],
  },
  viewItem: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    padding: theme.space[3],
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 2,
  },
  modal: {
    backgroundColor: theme.colors.blackDeep,
    flex: 1,
    justifyContent: "flex-end",
    height,
    width,
    alignItems: "center",
  },
  bgModal: {
    flex: 1,
    justifyContent: "flex-end",
    height,
    width,
  },
  separator: {
    backgroundColor: "#E5E5E5",
    height: 2,
    width: "100%",
  },
  textInput: {
    borderRadius: theme.space[3],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingVertical: theme.space[0],
    alignItems: "flex-start",
    paddingHorizontal: theme.space[2],
    marginTop: theme.space[4],
  },
  textAvatar: { flex: 1, height: "100%" },
  required: { marginLeft: 10 },
  viewModal: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    borderRadius: 32,
    position: "absolute",
    bottom: 10,
  },
  owver: {
    borderBottomWidth: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#E5E5E5",
  },
  viewer: {
    borderBottomWidth: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
  },
  viewHead: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  bgBody: { backgroundColor: "#fff", flex: 1 },
  viewFlatist: {
    padding: 10,
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
  },
  viewManager: {
    flex: 7,
    height: "100%",
    marginLeft: 15,
    flexDirection: "row",
  },
  txtManager: { flexDirection: "column", flex: 1 },
  btnCheck: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyBot: {
    marginRight: 10,
    width: 50,
  },
  btnIcon: { position: "absolute", top: -1, left: 25 },
  icon: {
    height: 16,
    width: 16,
  },
  bgAvata: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  bgAvatav1: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
  },

  bgAvatav2: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFBEBE",
  },

  avataBot: {
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  avataBotv1: {
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
  },

  avataBotv2: {
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFBEBE",
  },
  paddingBtn: {
    paddingVertical: theme.space[3],
    flexDirection: "row",
    alignItems: "center",
  },
  txtPlaceholder: {
    color: theme.colors.gray2,
    fontSize: theme.fontSizes[2]
  },
  iconSearch: {
    marginRight: theme.space[2],
  },
  viewItemSelected: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.space[3],
    marginBottom: theme.space[3],
    marginHorizontal: theme.space[3],
    borderRadius: theme.borderRadius,
    justifyContent: "space-between",
  },
  viewIcon: {
    height: 26,
    aspectRatio: 1,
    borderRadius: 13,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: {
    height: 13,
  },
  modalOption: {
    height: undefined,
  }
});
