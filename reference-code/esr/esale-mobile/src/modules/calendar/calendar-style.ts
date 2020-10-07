import { StyleSheet, Platform } from 'react-native';
import { normalize, Colors } from './common';

export const styles = StyleSheet.create({
    top: {
        backgroundColor: '#fff',
    },
    ct: {

    },
    topScreen: {
        padding: 15
    },
    flexRowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topLeft: {
        minWidth: normalize(80),

    },
    topDate: {
        fontSize: normalize(14),
        marginRight: 8
    },
    topRight: {
        borderColor: Colors.c3,
        borderRadius: normalize(8),
        borderWidth: 1,
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(24)
    },
    topText: {
        color: Colors.c2
    },
    // Begin item
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    itemLeft: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Platform.OS === 'ios' ? normalize(50) : normalize(60)
    },
    txtDate: {
        textAlign: 'center',
        fontSize: normalize(10),
        color: '#979797',
    },

    txtDateTop: {
        color: '#333333'
    },
    numDate: {
        width: normalize(26),
        height: normalize(26),
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: normalize(13),
        overflow: 'hidden',
        fontSize: normalize(16),
        color: Colors.c2,
        marginVertical: 5
    },
    itemRight: {
        marginBottom: normalize(12.4),
        flex: 1,
        position: "relative",
    },
    itemEvent: {
        // paddingLeft: 6,
        // marginBottom: normalize(10),
        position: "relative",
    },
    itemEventCt: {
        flex: 1,
        borderWidth: 1,
        borderRadius: normalize(4),
        borderColor: '#85ACDC',
        paddingLeft: normalize(7.6),
    },
    lineThrough: {
        textDecorationLine: "line-through"
    },
    txtDt: {
        // flex: 1,
        marginLeft: normalize(5),
        marginRight: normalize(5),
        color: '#666666',
        fontSize: normalize(12)
    },
    txtDtBefore: {
        color: '#666666',
        marginRight: 3,
    },
    dt: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.c1
    },
    iconSmall: {
        minWidth: 8,
        minHeight: 8,
        marginRight: 2
    },

    icon: {
        width: normalize(14),
        height: normalize(14),
        resizeMode: 'contain',
        marginRight: 2,
    },
    fBold: {
        fontWeight: "700"
    },
    eventActive: {
        position: "absolute",
        bottom: -normalize(5.5),
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dotActive: {
        backgroundColor: '#F72525',
        position: 'absolute',
        top: -normalize(2),
        left: 0
    },
    lineActive: {
        position: "relative",
        flex: 1,
        height: normalize(2),
        backgroundColor: '#F72525'
    },
    borderDash: {
        borderStyle: "dashed"
    },
    colorRed: {
        color: '#F92525'
    },
    colorOrange: {
        color: '#FF801F'
    },
    bg1: {
        backgroundColor: Colors.c1
    },
    bg2: {
        backgroundColor: '#E3E3E3'
    },
    bg3: {
        backgroundColor: '#DEC6C6'
    },
    bg4: {
        backgroundColor: '#EAFFD0'
    },
    bg5: {
        backgroundColor: '#EEEEEE'
    },
    // end Item
    otherMonth: {
        backgroundColor: '#F7F7F7',
        height: normalize(60),
        flex: 1,

    },
    titleOtherMonth: {
        backgroundColor: "transparent",
        fontWeight: '700'
    },
    titleMusty: {
        fontSize: normalize(10),
        color: '#979797',
        paddingLeft: normalize(66),
        marginBottom: normalize(22)
    },

    /// Style calendar
    todayTextColor: {
        backgroundColor: '#D5E2F2',
        color: Colors.c2
    },
    calendar: {
        backgroundColor: '#000',

    }
})
export default styles;
export const CalendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
