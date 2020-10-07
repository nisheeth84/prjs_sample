import { StyleSheet } from "react-native";

export const ListProductStyles = StyleSheet.create({
  containerProduct: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#E5E5E5",
  },
  marginTabEditActive: {
    marginBottom: 62,
  },
  marginTabEdit: {
    marginBottom: 0,
  },
  boxText: {
    padding: 12,
  },
  iconArrow: {
    resizeMode: "contain",
    margin: 20,
  },
  checkBoxStyle: {
    borderColor: "#EDEDED",
  },
  txtProductsName: {
    color: "#333333",
  },
  txtProductsInfo: {
    color: "#666666",
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeeContainer: {
    flexDirection: 'row'
  },
  link: {
    color: '#0F6DB5',
  },
  employeeText: {
    color: '#0F6DB5'
  },
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  }
});


