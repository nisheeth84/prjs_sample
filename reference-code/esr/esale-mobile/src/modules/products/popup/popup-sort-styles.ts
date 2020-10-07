import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const SortProductStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray200,
    },
    buttonRight: {
        backgroundColor: theme.colors.blue200,
    },
    spacePadding: {
        paddingHorizontal: theme.space[3],
        paddingVertical: theme.space[4],
        borderColor: theme.colors.gray100,
        borderBottomWidth: 1,
    },

    searchBg:
    {
        width: '100%',
        borderBottomWidth: 12,
        borderBottomColor: theme.colors.gray200
    },

    searchInput: {
        backgroundColor: theme.colors.white200,
        flex: 1,
        borderWidth: 0,
        borderRadius: theme.borderRadius
    },

    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    orderButton: {
        justifyContent: 'space-between',
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: theme.borderRadius,
        marginLeft: 5,
    },
    verticalView: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    orderSelect: {
        flexDirection: 'row',
        paddingVertical: theme.space[2] - 1,
        paddingLeft: theme.space[2],
        paddingRight: theme.space[3],
        marginLeft: theme.space[3],
        borderWidth: 1,
        borderRadius: theme.borderRadius,
        alignItems: 'center',
    },
    iconContainer: {
        paddingHorizontal: 5,
        marginRight: theme.space[3],
        borderWidth: 1,
    },
    inputContainer: {
        marginVertical: theme.space[4],
        borderRadius: theme.borderRadius,
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        borderWidth: 0.5,
        borderColor: theme.colors.gray100,
        paddingRight: theme.space[1]
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginLeft: theme.space[5],
    },
    checkActiveIcon: {
        width: 32,
        height: 32
    },
    bold: {
        fontWeight: "bold"
    }
});

export const SelectOrderSort = StyleSheet.create({
    activeOrderSelect: {
        backgroundColor: theme.colors.blue100,
        borderColor: theme.colors.blue200,
    },
    inactiveOrderSelect: {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.gray100,
    },
    activeText: {
        color: theme.colors.blue200,
    },
    inactiveText: {
        color: theme.colors.black,
    },
    activeIconContainer: {
        borderColor: theme.colors.blue400,
        backgroundColor: theme.colors.blue400,
    },
    inactiveIconContainer: {
        borderColor: theme.colors.gray,
        backgroundColor: theme.colors.white,
    }
})