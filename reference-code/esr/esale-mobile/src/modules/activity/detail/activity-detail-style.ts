import { StyleSheet } from "react-native"
import {
  ScreenWidth,
  getHeight,
  normalize,
  getWidth,
} from "../../activity/common"
import { theme } from "../../../config/constants"

export const ActivityDetailStyles = StyleSheet.create({
  scroll: {
    height: getHeight(600),
    paddingVertical: getHeight(10),
  },
  container: {
    paddingHorizontal: 16,
  },
  br: {
    marginVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  name: {
    fontSize: normalize(12),
  },
  time: {
    fontSize: normalize(12),
    color: '#333',
  },
  colorBlue: {
    color: '#0F6DB5',
  },
  iconUserBlue: {
    width: normalize(60),
    height: normalize(60),
    margin: normalize(10),
    borderRadius: 100,
  },
  iconActivityHistories: {
    width: getWidth(23),
    height: getWidth(19),
  },
  iconSave: {
    width: getWidth(14),
    height: getWidth(16),
  },
  iconPencil: {
    width: getWidth(14),
    height: getWidth(14),
  },
  iconTimeLine: {
    width: getWidth(12),
    height: getWidth(14),
  },
  iconRecycleBin: {
    width: getWidth(12),
    height: getWidth(16),
  },
  tool: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolRight: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topContents: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: normalize(16)
  },
  topText: {
    position: 'relative',
  },
  iconShare: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  tabView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: ScreenWidth,
  },
  tabBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E4E4E4',
    borderRightColor: '#E4E4E4',
  },
  tabViewItem: {
    width: '50%',
    paddingVertical: getWidth(10),
    borderTopColor: '#E4E4E4',
    borderBottomColor: '#E4E4E4',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tabTitle: {
    fontSize: normalize(12),
    color: '#333',
    textAlign: 'center',
  },
  tabAct: {
    backgroundColor: '#D5E2F2',
    borderBottomColor: '#0F6DB4',
    color: '#0F6DB4',
  },
  textAct: {
    color: '#0F6DB4',
  },
  title: {
    fontSize: normalize(14),
    padding: normalize(2),
  },
  avatar: {
    width: getWidth(60),
    height: getHeight(60),
    resizeMode: 'contain',
    alignItems: 'center',
    borderRadius: 50
  },
  textSmall: {
    color: '#666666',
    paddingVertical: normalize(2),
    fontSize: normalize(12),
  },
  flexContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexContentCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 3
  },
  bold: {
    fontWeight: "bold",
  },
  alignItems: {
    alignItems: "center",
  },
  colorAvatar: {
    color: "#4B8A08",
  },
  content: {
    color: theme.colors.black,
    marginTop: theme.space[5],
  },
  iconLabelStyle: {
    backgroundColor: '#ffd633',
    paddingHorizontal: 8,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  activityDetail: {
    flex: 4,
    paddingHorizontal: 8,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  iconLabelStyleText: {
    fontSize: normalize(12),
    lineHeight: 18,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
})
