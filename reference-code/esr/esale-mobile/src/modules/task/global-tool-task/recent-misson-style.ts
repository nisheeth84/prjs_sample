import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

const { height } = Dimensions.get("window");

export const stylesRecent = StyleSheet.create({
    container: {
        height: height - 74,
        paddingHorizontal: theme.space[4],
        backgroundColor: theme.colors.white200
    },

    btnTabWrap: {
        flexDirection: "row",
        marginVertical: theme.space[6],
        height: 32,
    },
    btnTab: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    btnTabActive: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: theme.colors.blue100,
    },
    btnTxt: {
        color: "black",
        fontSize: theme.fontSizes[2],
    },
    btnTxtActive: {
        color: theme.colors.blue200,
        fontSize: theme.fontSizes[2],
    },
    fab: {
        position: "absolute",
        width: theme.space[14],
        height: theme.space[14],
        alignItems: "center",
        justifyContent: "center",
        right: theme.space[5],
        bottom: theme.space[5],
        backgroundColor: theme.colors.white,
        paddingBottom: 4,
        borderRadius: theme.space[7],
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    fabIcon: {
        fontSize: 40,
        color: "#00CCAF",
    },
    containerModal: {
        backgroundColor: "rgba(0,0,0,0.8)",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    contentModal: {
        width: "100%",
        height: 88,
        backgroundColor: "white",
        borderRadius: theme.space[4],
    },
    btnAddTask: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
        borderBottomColor: theme.colors.gray,
    },
    btnAddMilestone: {
        alignItems: 'center',
        flex: 1,
        justifyContent: "center",
        paddingLeft: 16,
    },
    btnTxtModal: {
        color: theme.colors.black,
        fontSize: 14,
        fontWeight: 'bold'
    },
    boxMessageSuccess: {
        width:"100%",
        alignItems: "center",
        position: "absolute",
        bottom: theme.space[20],
    },
});
