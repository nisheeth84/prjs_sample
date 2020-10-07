import {  StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  price: {
    width: "100%",
    justifyContent: "center",
    height: 60,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    paddingHorizontal: "4%",
  },
  item: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  itemContent: { flex: 7, paddingLeft: "4%", justifyContent: "center" },
  txtPrice: { color: "#333333", fontSize: 14, fontWeight: "bold" },
  txtItem: {
    color: "#666666",
    fontSize: 12,
    marginVertical: 2,
  },
  nameItem: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: "5%",
  },
  icon: { width: 10, height: 20, resizeMode: "contain" },
});
