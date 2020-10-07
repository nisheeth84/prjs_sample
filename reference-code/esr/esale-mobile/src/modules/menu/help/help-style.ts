import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: {
    flex: 1, 
    backgroundColor: "#FFFF",
  },
  container: { backgroundColor: "#F9F9F9", flex: 1 },
  contaierSuggest: {
    marginHorizontal: 20,
    zIndex: 100,
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    marginTop: -13,
    height: 170,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFF",
  },
  titleHeader: { fontWeight: "bold", fontSize: 18, color: "#333333" },
  containerItemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
    position: "relative",
  },
  containerItemSearchSugget: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  containerSearch: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#FFFF",
  },
  containerFooter: {
    backgroundColor: "#FFFF",
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    paddingLeft: 20,
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
  },
  textFooter: { paddingRight: 20, color: "#0F6EB5" },
  containerContentNull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerSearcgContentNull: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#FFFF',
    zIndex: 2,
    position: 'absolute',
    alignSelf: 'center', 
    paddingHorizontal: '25%',
    paddingVertical: '2%',
    borderRadius: 10,
    marginTop: -13
  },
  containerContent: { flex: 1, backgroundColor: "#FFFF" },
  inputSearch: { flex: 1, height: 40 },
  modal: {
    backgroundColor: "#FFFF",
    marginTop: "40%",
     marginBottom: "32%",
    marginHorizontal: 0,
  },
  loading: {position: "absolute", width: '100%', height: '80%', alignItems: 'center', justifyContent: 'center'},
  boxModal: { alignItems: 'center', paddingHorizontal: 10 }
});

export default styles;
