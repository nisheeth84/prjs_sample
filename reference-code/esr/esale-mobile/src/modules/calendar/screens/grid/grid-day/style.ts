import { StyleSheet, Platform } from 'react-native';
import { getHeight, normalize, Colors } from '../../../common';

export const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flexCenter: {
    alignItems: 'center',
  },

  borderHead: {
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 0.5,
  },
  label: {
    marginBottom: 5,
  },
  boxShadow: {
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  top: {
    backgroundColor: '#fff',
    marginBottom: 3
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
    backgroundColor: '#FFF',
    // marginBottom: normalize(3)
  },
  itemHour: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 0
    // marginBottom: normalize(3)
  },
  minHeight60: {
    minHeight: 60,
  },
  scroll_event: {
    maxHeight: normalize(getHeight(140)),
  },
  item_more: {
    paddingBottom: normalize(20),
  },
  toolLeft: {
    height: '100%',
    marginRight: 1,
    zIndex: 0,
    borderRightWidth: 1,
    borderRightColor: '#cdcdcd',
  },

  itemLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Platform.OS === 'ios' ? normalize(50) : normalize(60),
    position: 'relative',
    flex: 1,
  },
  //icon down event
  button_down: {
    alignItems: 'center',
  },
  txtDate: {
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
    borderRadius: normalize(26),
    overflow: 'hidden',
    fontSize: normalize(16),
    color: Colors.c2,
    marginVertical: 0
  },
  itemRight: {
    // marginBottom: normalize(12.4),
    flexDirection:'row',
    flex: 1,
    position: "relative",
  },
  itemEvent: {
    // marginBottom: normalize(10),
    borderRadius: normalize(5),
    // overflow: 'hidden',
    position: "relative",
    minHeight: normalize(54),
  },
  itemEventCt: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: Colors.c1,
    borderRadius: normalize(4),
    padding: normalize(7.6),
  },
  lineThrough: {
    textDecorationLine: "line-through"
  },
  txtDt: {
    // flex: 1,
    color: '#333333',
    marginRight: normalize(15),
  },
  txtDtBefore: {
    color: '#666666',
    marginRight: 3,
  },
  dt: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.c1,
    position:'absolute',
  },
  iconSmall: {
    minWidth: 8,
    minHeight: 8,
    marginRight: 2
  },
  text_bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: normalize(20),
  },
  icon: {
    width: normalize(14),
    height: normalize(14),
    resizeMode: 'contain',
    marginRight: 2,
  },
  mg_5: {
    marginHorizontal: normalize(5),
  },
  fBold: {
    fontWeight: "700"
  },
  eventActive: {
    position: "absolute",
    bottom: -normalize(4.5),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(6)
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
    height: 2,
    backgroundColor: '#F72525',
    zIndex:3 
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

  },
  item_event: {
    marginVertical: normalize(1),
    marginHorizontal: normalize(3),
    overflow: 'hidden',
    borderRadius: normalize(5),
    height: normalize(26),
  },
  text_time: {
    fontSize: normalize(12),
  },
  // item v2
  item_v2: {
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    // position: 'relative',
  },
  right_active: {
    borderTopWidth: 2,
    borderTopColor: '#F82525',
    position: 'absolute',
    width: `${normalize(85)}%`,
    top: -1,
    right: 0,
    zIndex: 1,
  },
  red_dot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: 100,
    backgroundColor: '#F82525',
    position: 'absolute',
    left: normalize(-6),
    top: normalize(-5),
  },
  itemRight_v2: {
    // margin: normalize(1),
    borderRadius: normalize(7),
    zIndex:0
  },
  item_left_v2: {
    backgroundColor: '#FFF',
    transform: [{ translateX: - normalize(10) }],
    height: '100%',
    width: '100%',
    alignItems: 'flex-end',
    top: normalize(-8),
    paddingRight: normalize(3),


  },

  toolLeft_v2: {
    borderRightWidth: 1,
    borderColor: '#E4E4E4',
  },
  mt_10: {
    marginTop: normalize(10),
  },
  scroll: {
    marginBottom: normalize(200),
  },
  itemEvent_v2: {
    position: 'absolute',
    width: '100%',
    paddingBottom: normalize(56),
    zIndex: 2,
    top: -55,
  },
  // more option
  border_green: {
    borderWidth: 1,
    borderColor: Colors.c1,
  },
  border_dash: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.c1,
  },
  line_through: { textDecorationLine: 'line-through' },
  text_event: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  pdt_10: {
    paddingTop: 10,
    paddingBottom: normalize(100),
  },
  mgt_4: {
    marginTop: 4
  },
  pdt_3: {
    paddingBottom: 3
  },
  width_100: {
    width: '100%'
  }
})
export default styles;