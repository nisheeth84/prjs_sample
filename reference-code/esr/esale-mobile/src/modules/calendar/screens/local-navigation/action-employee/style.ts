
import { StyleSheet } from "react-native";
import { normalize, getWidth, getHeight } from "../../../common";

/**
 * styles Action
 */
export const stylesAction = StyleSheet.create({
    item: {
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(15),
        borderBottomColor: "#E5E5E5",
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    itemContent: {
        fontSize: normalize(14),
        color: "#333",
        fontWeight: "bold",
        padding: 2,
        paddingLeft: 10,
        marginBottom: 2
    },
    itemColor: {
        backgroundColor: "#ccc",
        width: 20,
        height: 20
    },
    BoxRight: {
        fontSize: normalize(14),
        color: "#666",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "absolute",
        right: 15,
        top: 18
    },
    BoxCheckBoxNoSelect: {
        width: getWidth(23),
        height: getHeight(25),
        borderRadius: getWidth(50),
        overflow: "hidden",
        marginLeft: normalize(10),
        borderColor: "#afafaf",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    BoxCheckBoxActive: {
        backgroundColor: "#0F6DB5",
    },
    BoxCheckBox: {
        width: getWidth(23),
        height: getHeight(25),
        borderRadius: getWidth(50),
        overflow: "hidden",
        marginLeft: normalize(10),
        borderColor: "#0F6DB5",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    BoxCheckBoxImage: {
      width: getWidth(15),
      height: getHeight(15),
      resizeMode: "contain",
    },
    ic_checkbox: {
      width: getWidth(17),
      height: getHeight(17),
      resizeMode: "contain",
      marginLeft: normalize(10),
    },
})