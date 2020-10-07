import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const AppBarMenuStyles = StyleSheet.create({
    container: {
        height: 54,
        backgroundColor: theme.colors.white100,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        alignItems: "center",
        flexDirection: "row",
    },
    menuStyles: {
        width: 30,
        aspectRatio: 22 / 15,
        // height: 30,
    },
    title: {
        fontSize: 18,
        color: theme.colors.black,
        fontWeight: 'bold'
    },
    titleWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: theme.space[4],
    },
    titleWrapperLeft: {
        backgroundColor: "green",
    },

    titleWrapperRight: {
        backgroundColor: "blue",
    },

    iconButton: {
        padding: theme.space[3],
        justifyContent: "center",
        alignItems: "center",
    },

    iconLeft: {
        alignItems: "center",
        width: 12,
        height: 15,
    },

    iconSearch: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: theme.fontWeights[6],
    },
    viewUnreadNoti: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.red,
        position: "absolute",
        top: 9,
        right: 11,
        zIndex: 2,
    },
    titleWrapperCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.space[2],
    },
});

export const appBarMenuStyles = StyleSheet.create({
    container: {
        height: 54,
        backgroundColor: theme.colors.white100,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        alignItems: "center",
        flexDirection: "row",
    },
    title: {
        fontSize: 18,
        color: theme.colors.black,
    },
    titleWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: theme.space[4],
    },
    iconButton: {
        padding: theme.space[3],
        justifyContent: "center",
        alignItems: "center",
    },
    iconSearch: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: theme.fontWeights[6],
    },
    viewUnreadNoti: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.red,
        position: "absolute",
        top: 9,
        right: 11,
        zIndex: 2,
    },
});
export const appBarHomeStyles = StyleSheet.create({
    container: {
        height: 54,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        alignItems: "center",
        flexDirection: "row",
    },
    title: {
        fontSize: 18,
        color: theme.colors.black,
    },
    titleWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    iconSearch: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: theme.fontWeights[6],
    },
    icon: {
        height: theme.space[5],
        width: theme.space[5],
        resizeMode: "contain",
    },
});
