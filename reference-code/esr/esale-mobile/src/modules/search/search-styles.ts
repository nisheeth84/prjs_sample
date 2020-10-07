import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../config/constants";

const { width } = Dimensions.get("window");

const RADIUS_OPTIONS = 12;

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  boxSearch: { flexDirection: "row", height: 40, width: "92%" },
  search: { flex: 4 },
  searchInput: {
    borderColor: "#E5E5E5",
    borderRadius: 15,
    borderWidth: 1,
    height: 40,
    width: "100%",
    paddingLeft: 38,
  },
  cancel: { flex: 1, justifyContent: "center", paddingLeft: 6 },
  txtCancel: { color: "#0F6DB5", fontSize: 13 },
  listResult: { width: "100%" },
  listResultAll: { width: "100%", marginBottom: 90 },
  btnOptionsLeft: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: RADIUS_OPTIONS,
    borderTopLeftRadius: RADIUS_OPTIONS,
  },
  contentContainerStyle: { paddingBottom: 90 },
  btnOptionsRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: RADIUS_OPTIONS,
    borderTopRightRadius: RADIUS_OPTIONS,
  },
  btnOptionsChoose: {
    backgroundColor: "#D6E3F3",
  },
  btnOptionsNotChoose: {
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  btnTxtNormal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
  },
  btnTxtNormalBlue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F6DB5",
  },
  txtContent: {
    fontSize: 12,
    color: "#666666",
  },
  searchContainer: { width, marginTop: 10 },
  line: { width, height: 1, backgroundColor: "#E5E5E5" },
  item: {
    width: "100%",
    height: 95,
    flexDirection: "row",
    paddingHorizontal: "1%",
    paddingVertical: "6%",
    paddingLeft: "1%",
  },
  imgContent: { flex: 1 },
  img: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  content: { flex: 6 },
  txtContent2: { color: "#333333", fontWeight: "bold" },
  iconContent: { flex: 0.5, alignItems: "flex-start" },
  options: { width: "92%", flexDirection: "row", height: 40, marginTop: 8 },
  icon: { position: "absolute", left: 10 },
  btnOptionsFilter: {
    position: "absolute",
    right: 4,
    width: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnLine: { height: 30, width: 1, backgroundColor: "#E5E5E5" },
  arrowRight: { marginTop: 10 },
  itemContent: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    height: 100,
  },
  btnOptionsMenu: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC"
  },
  fistScreen: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  viewEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  viewIcon: {
    width: 32,
    height: 32,
    marginVertical: 20
  },
  textEmpty: {
    fontWeight: "bold",
    fontSize: 16
  }
});

export const calendarStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    paddingLeft: "3%",
  },
  txt: {
    fontSize: 12,
    color: "#666666",
    marginVertical: 2,
  },
  leftContent: {
    flex: 5,
    justifyContent: "center",
  },
  rightContent: {
    flex: 0.5,
    justifyContent: "center",
  },
});

export const business = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    paddingLeft: "3%",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,

  },
  txt: {
    fontSize: 12,
    color: "#666666",
    marginVertical: 2,
  },
  icon: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 5,
    marginTop: 5,
    paddingLeft: "3%",
  },
  rightContent: {
    flex: 0.5,
    justifyContent: "center",
  },
  iconItem: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
  },
  avatar: { marginTop: 3 },
  avatarEmployee: { width: 50, height: 50, borderRadius: 25 },
  avatarDefault: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtAvatarDefault: {
    fontWeight: "bold",
    color: "#FFFFFF"
  }
});
