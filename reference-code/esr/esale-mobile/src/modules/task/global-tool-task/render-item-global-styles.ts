import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const renderItemGlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: theme.space[4]
    },
    viewContent: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.space[3],
        paddingHorizontal: theme.space[4],
        paddingVertical: theme.space[4],
    },
    avatar: {
        height: theme.space[7],
        width: theme.space[7],
        marginVertical: theme.space[3],
        marginRight: theme.space[1],
        borderRadius:theme.space[4]
    },
    btnComplete: {
        height: theme.space[12],
        borderWidth: 1,
        borderRadius: theme.space[3],
        borderColor: theme.colors.gray100,
        alignItems: "center",
        justifyContent: "center",
    },
    btnInComplete: {
        height: theme.space[12],
        borderWidth: 1,
        borderRadius: theme.space[3],
        borderColor: theme.colors.gray100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:theme.colors.gray250
    },
    txtName: {
        fontSize: theme.fontSizes[2],
        paddingBottom: theme.space[1],
    },
    txtMisson: {
        fontSize: theme.fontSizes[2],
        color: theme.colors.blue200,
        paddingBottom: theme.space[1],

    },
    txtMissonComplete: {
        fontSize: theme.fontSizes[2],
        color: theme.colors.blue200,
        paddingBottom: theme.space[1],
        textDecorationLine: "line-through"
    },
    txtStyle: {
        fontSize: theme.fontSizes[2]
    },
    icon: {
        marginRight: theme.space[3]
    },
    viewIconMilestone: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.space[2],
        marginBottom: theme.space[4],
    },
    viewMoreAvatar: {
        backgroundColor: theme.colors.blue200,
        width: theme.space[7],
        height: theme.space[7],
        borderRadius: theme.space[7] / 2,
        alignItems: "center",
        justifyContent: "center",
    },
    txtMoreAvatar: { color: "white", fontWeight: "700" },
    userAvatarDefault: {
        width: theme.space[6],
        height: theme.space[6],
        borderRadius: theme.space[3],
        backgroundColor: theme.colors.green2,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: theme.space[3],
        marginRight: theme.space[1]
      },
      txtUserName: {
        color: theme.colors.white,
        fontSize: theme.fontSizes[1]
      },
});
