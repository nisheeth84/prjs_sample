import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";
import { getScreenHeight } from "../utils";

export const ListTaskTabStyles = StyleSheet.create({
    commonButton: {
        flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: theme.borderRadius, borderWidth: 1, paddingVertical: theme.space[2], backgroundColor: theme.colors.white
    },
    disableButton: { backgroundColor: theme.colors.blue500, borderColor: theme.colors.blue200 },
    activeButton: { borderColor: theme.colors.gray200 },
    itemContainer: { padding: theme.space[4], borderWidth: 1, borderColor: theme.colors.gray100, borderRadius: theme.borderRadius, marginTop: theme.space[4] },
    taskName: { fontSize: theme.fontSizes[3], color: theme.colors.blue400 },
    iconView: { flexDirection: 'row', alignItems: 'flex-end' },
    iconItem: { marginRight: theme.space[3] },
    infoContainer: { flexDirection: 'row', paddingVertical: theme.space[2], alignItems: 'center', justifyContent: 'space-between' },
    employeeList: { flexDirection: 'row' },
    employeeItem: { marginRight: theme.space[3], width: theme.space[7], height: theme.space[7] },
    moreEmpoyee: {
        backgroundColor: theme.colors.blue200,
        width: theme.space[7],
        height: theme.space[7],
        borderRadius: theme.space[7] / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberMoreEmpoyees: { color: 'white', fontWeight: '700' },
    buttonContainer: { width: "100%", flexDirection: 'row', justifyContent: 'space-between' },
    loadingContainer: { paddingVertical: theme.space[9], alignItems: 'center' },
    dataContainer: { paddingHorizontal: theme.space[4], paddingBottom: theme.space[4] },
    floatButton: {
        width: theme.floatingButton,
        aspectRatio: 1,
        borderRadius: theme.floatingButton / 2,
        backgroundColor: theme.colors.white,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: "absolute",
        top: getScreenHeight() - theme.floatingButton - theme.space[18],
        right: theme.space[3],
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10
    },
    floatButtonImage: {
        width: theme.space[6],
        height: theme.space[6]
    },
    themeError: {
        backgroundColor: theme.colors.pink100,
        borderColor: theme.colors.pink200,
        borderWidth: theme.space[1]
    }
});

