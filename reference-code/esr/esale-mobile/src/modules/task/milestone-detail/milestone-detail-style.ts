import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";
import { getScreenHeight } from "../utils";

// const width = Dimensions.get('window').width

const cycle = theme.space[5];
const cycleIsPublic = theme.space[3];

export const MilestoneDetailStyles = StyleSheet.create({

    // common

    bold: {
        fontWeight: "bold",
        fontSize: theme.fontSizes[3],
    },

    gray: {
        color: theme.colors.gray1,
        fontSize: theme.fontSizes[3],
    },

    black: {
        color: theme.colors.black,
        fontSize: theme.fontSizes[3],
    },

    row: {
        flexDirection: "row",
    },

    container: {
        paddingTop: 0,
        backgroundColor: theme.colors.white100,
    },

    containerWhite: {
        paddingTop: 0,
        backgroundColor: theme.colors.white,
        flex: 1
    },

    rowCenter: {
        flexDirection: "row",
        justifyContent: "center"
    },

    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    rowSpaceAround: {
        flexDirection: "row",
        justifyContent: "space-around",
    },


    prRowCustomer: {
        marginBottom: theme.space[4],
    },

    rowCustomer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    // Item info top

    roundViewPublic: {
        width: cycleIsPublic,
        height: cycleIsPublic,
        backgroundColor: "#88D9B0",
        borderRadius: cycleIsPublic / 2
    },

    roundViewNotPublic: {
        width: cycleIsPublic,
        height: cycleIsPublic,
        backgroundColor: theme.colors.gray,
        borderRadius: cycleIsPublic / 2
    },

    mileGrpParentName: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },

    mileGrpName: {
        flexDirection: "row",
        alignItems: "center"
    },

    milestoneIcon: {
        width: 24,
        height: 14
    },

    prClientIcon: {
        height: 19,
        width: 24
    },

    clientIcon: {
        height: 19,
        width: 14,
        justifyContent: "flex-start",
    },

    milestoneName: {
        marginLeft: theme.space[2],
        fontWeight: "bold"
    },

    timeRange: {
        color: theme.colors.gray1,
        fontSize: theme.fontSizes[2],
        marginVertical: theme.space[2],
        marginLeft: theme.space[4]
    },

    outOfDate: {
        color: theme.colors.red
    },

    topInfoButtonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: theme.space[4],
        alignItems: "center"
    },

    topInfoIconCopy: {
        height: 26,
        width: 26,
        justifyContent: "center",
    },

    topInfoIconShare: {
        height: 20,
        width: 20,
        justifyContent: "center",
        marginLeft: theme.space[2]
    },

    buttonCompleteMilestone: {
        height: 48,
    },

    textButtonCompleteMilestone: {
        fontWeight: "bold",
        paddingHorizontal: theme.space[2],
        fontSize: theme.fontSizes[2]
    },

    // general info item
    generalInfoItem: {
        backgroundColor: theme.colors.white200,
        paddingVertical: theme.space[5],
        paddingHorizontal: theme.space[4],
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopColor: theme.colors.gray100,
        borderTopWidth: 1
    },

    milestoneDetailContainer: {
        padding: theme.space[4],
        backgroundColor: theme.colors.white,
    },

    milestoneDetailMemo: {
        paddingVertical: theme.space[4],
        color: theme.colors.gray1
    },

    imageTitle: {
        flexDirection: "row",
        alignItems: "center",
    },

    milestoneDetailListTask: {
        marginVertical: theme.space[2],
        marginHorizontal: theme.space[9],
        flexDirection: "row"
    },

    taskName: {
        marginLeft: theme.space[4],
        color: "#0F6DB2"
    },

    milestoneDetailListTaskLabel: {
        marginHorizontal: theme.space[2],
        fontSize: theme.fontSizes[2],
    },

    milestoneDetailUser: {
        color: "#0F6DB2"
    },

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

    //Top tab style

    btnTabWrap: {
        flex: 1,
        flexDirection: "row",
    },
    btnTab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: theme.space[13],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray100,
        flexDirection: "row",
    },

    btnTabActive: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: theme.space[13],
        backgroundColor: theme.colors.blue100,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.blue200,
        flexDirection: "row",
    },
    btnTxt: {
        color: theme.colors.black,
        fontSize: theme.fontSizes[2],
        fontWeight: "bold"
    },
    btnTxtActive: {
        color: theme.colors.blue200,
        fontSize: theme.fontSizes[2],
        fontWeight: "bold"
    },
    countNoti: {
        backgroundColor: theme.colors.red,
        height: theme.space[4],
        width: theme.space[4],
        borderRadius: theme.space[2],
        justifyContent: "center",
        alignItems: "center",
        marginLeft: theme.space[1],
        marginBottom: theme.space[4]
    },
    txtCountNoti: {
        color: theme.colors.white,
        fontSize: 8,
    },
    commonTab: {
        flex: 1,
        paddingVertical: theme.space[3],
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        height: theme.space[13],
    },

    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: theme.space[8]
    },

    tabContainer: {
        backgroundColor: theme.colors.white
    },
});


export const MilestoneDetailModalStyle = StyleSheet.create({
    mainContainer:
    {
        backgroundColor: "#000000CC",
        height: "100%",
        justifyContent: "center",
        alignContent: "center"
    },
    container: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: theme.space[4],
        paddingVertical: theme.space[6],
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontWeight: "bold",
        fontSize: theme.fontSizes[3],
    },
    content: {
        color: theme.colors.black,
        marginTop: theme.space[5],
        textAlign: "center"
    },

    contentDelete: {
        color: theme.colors.black,
        marginTop: theme.space[5],
        textAlign: "center"
    },

    contentDelete2: {
        color: theme.colors.black,
        textAlign: "center"
    },

    contentConfirm: {
        color: theme.colors.black,
        textAlign: "center"
    },
    wrapButton: {
        flexDirection: "row",
        marginTop: theme.space[5],
    },
    wrapButtonVer: {
        marginTop: theme.space[5],
        width: "100%"
    },
    buttonCancel: {
        marginRight: theme.space[5],
        alignItems: "center",
        width: 100,
        paddingVertical: theme.space[3],
        fontWeight: "bold",
    },
    buttonDelete: {
        backgroundColor: theme.colors.red,
        alignItems: "center",
        paddingVertical: theme.space[3],
        borderRadius: theme.borderRadius,
        fontWeight: "bold",
        flex: 1
    },

    buttonCancelBorder: {
        marginRight: theme.space[5],
        alignItems: "center",
        flex: 1,
        paddingVertical: theme.space[3],
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: theme.borderRadius,
        borderColor: theme.colors.gray100
    },

    buttonDeleteMilestoneNotComplete: {
        backgroundColor: theme.colors.blue200,
        alignItems: "center",
        padding: theme.space[3],
        borderRadius: theme.borderRadius,
        marginTop: theme.space[3]
    },
    buttonTextCancel: {
        color: theme.colors.black,
        fontWeight: "bold",
    },
    buttonTextDelete: {
        color: theme.colors.white,
        fontWeight: "bold",
    },
});


export const TabHistoryStyles = StyleSheet.create({
    container: {
        paddingTop: theme.space[4]
    },
    changedContainer: {
        flexDirection: 'row',
        paddingVertical: theme.space[1],
    },

    changedContainerVer: {
        paddingVertical: theme.space[1],
    },

    changedLabel: {
        fontSize: theme.fontSizes[1],
        maxWidth: "50%"
    },
    changedContainerParent:
    {
        flexDirection: "row",
        alignItems: "baseline"
    },
    arrowIcon: {
        width: 18,
        height: 12,
        marginHorizontal: theme.space[2]
    },
    itemContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: theme.space[3]
    },
    timeLine: {
        alignItems: 'center'
    },
    labelContainer: { height: theme.space[9], justifyContent: 'center' },

    roundView: {
        width: cycle,
        height: cycle,
        borderColor: theme.colors.blue200,
        borderWidth: 2,
        borderRadius: cycle / 2
    },

    verticalLine: {
        width: 2,
        flex: 1,
        backgroundColor: theme.colors.gray100
    },

    contentHistory: {
        justifyContent: 'center',
        paddingLeft: theme.space[5],
        flex: 1
    },

    historyLabel: {
        textAlignVertical: 'center',
        fontSize: theme.fontSizes[2],
        fontWeight: "bold"
    },

    dataContent: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        marginBottom: 8,
    },

    propertyLabel: { paddingVertical: theme.space[1] },

    historyInfo: {
        flexDirection: 'row',
        paddingVertical: theme.space[3],
        alignItems: 'center'
    },

    userAvatar: {
        width: theme.space[6],
        height: theme.space[6]
    },

    userName: {
        fontSize: theme.fontSizes[1],
        color: theme.colors.blue400,
        marginLeft: theme.space[2]
    },

    dateChange: {
        fontSize: theme.fontSizes[1]
    },

    textInfo: {
        marginLeft: theme.space[6]
    },
    userAvatarDefault: {
        width: theme.space[6],
        height: theme.space[6],
        borderRadius: theme.space[3],
        backgroundColor: theme.colors.green2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtUserName: {
        color: theme.colors.white,
        fontSize: theme.fontSizes[1]
    },
})