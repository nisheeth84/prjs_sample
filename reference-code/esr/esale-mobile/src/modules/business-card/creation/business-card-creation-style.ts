import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height, width } = Dimensions.get("window");

export const BusinessCardCreationStyles = StyleSheet.create({
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
    fontSize: 14,
    color: theme.colors.black,
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
    padding: 2,
    borderRadius: 6,
    fontSize: 10,
  },
  warning: {
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.gray100,
    borderTopWidth: 1,
    marginBottom: theme.space[3],
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[5],
  },
  text: {
    fontSize: theme.fontSizes[3],
    marginLeft: theme.space[1],
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
    height: 50,
    marginHorizontal: theme.space[4]
  },
  textBtn: {
    fontSize: 15,
    color: theme.colors.black,
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
    borderRadius: theme.space[4],
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
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  viewer: {
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
  },
  iconSearch: {
    marginRight: theme.space[2],
  },
});
export const BusinessCardShareItemStyles = StyleSheet.create({
  viewInfo: {
    backgroundColor: theme.colors.white200,
    marginTop: theme.space[3],
    flexDirection: "row",
    padding: theme.space[3],
    borderRadius: theme.space[5],
    height: 60,
  },
  viewAva: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  viewBtn: {
    flex: 7,
    height: "100%",
    marginLeft: 15,
    flexDirection: "row",
  },
  viewTxt: { flexDirection: "column", flex: 1 },
  btn: {
    borderWidth: 1,
    alignItems: 'center',
    borderColor: "#E5E5E5",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 35,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[2],
  },
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  species: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avata: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
  },

  avatav1: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
  },

  avatav2: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFBEBE",
  },
  txtDepartment: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.black80,
    fontWeight: "bold",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  txtPosition: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.black,
  },
  txtSpecies: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.black,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export const createAddParticipantsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "flex-end",
  },
  viewContent: {
    marginTop: theme.space[5],
    backgroundColor: theme.colors.white,
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
    minHeight: 200,
    maxHeight: height * 0.6,
  },
  devider: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  viewInput: {
    backgroundColor: theme.colors.white200,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    marginVertical: theme.space[6],
    marginHorizontal: theme.space[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.space[3],
  },
  txtInput: {
    // color: theme.colors.gray,
    fontSize: theme.fontSizes[4],
    width: "90%",
  },
  viewBtn: {
    // backgroundColor: theme.colors.blue200,
    position: "absolute",
    zIndex: 1,
    bottom: theme.space[5],
    width: "100%",
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: theme.colors.blue200,
    borderRadius: theme.borderRadius,
    padding: theme.space[3],
    paddingHorizontal: theme.space[14],
  },
  txtBtn: {
    textAlignVertical: "center",
    color: theme.colors.white,
  },
  btnItem: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: theme.fontSizes[4],
  },
  txtDepartment: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray,
  },
  padding: {
    height: 70,
  },
  image: {
    height: 40,
    borderRadius: 20,
    aspectRatio: 1,
    marginRight: theme.space[3],
  },
  viewClose: {
    height: 26,
    aspectRatio: 1,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.gray1,
  },
  txtClose: {
    fontSize: theme.fontSizes[5],
    color: theme.colors.white200,
  },
  contentContainerStyle: {
    paddingVertical: theme.space[2],
  },
  cardWrap: {
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[1],
    flexDirection: "row-reverse",
  },
  listCardContainer: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[2],
  },
  circleView: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  iconCheck: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  nameWrap: {
    flex: 1,
    justifyContent: "center",
  },
  asCenter: {
    alignSelf: "center",
  },
});
