import {StyleSheet} from "react-native";
import {
  ScreenWidth,
  getHeight,
  normalize,
  getWidth
} from "../../../calendar/common";
import { theme } from "../../../../config/constants";

const ChangeHistoryStyles = StyleSheet.create({
  tabHistory: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getWidth(15),
    paddingBottom: getHeight(15),
    borderLeftWidth: 2,
    borderLeftColor: '#E5E5E5',
    position: 'relative',
    marginLeft: 10,
  },
  avatar: { width: getWidth(35), height: getHeight(35), resizeMode: "contain", alignItems: "center", borderRadius: 50},
  dotHistory: {
    position: 'absolute',
    width: getWidth(16),
    height: getWidth(16),
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0F6DB5',
    top: 0,
    left: getWidth(-9),
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  scroll: {
    height: getHeight(600),
    paddingVertical: getHeight(10),
    },
  contentsHistory: {
    backgroundColor: '#F9F9F9',
    padding: getWidth(10),
    borderRadius: 7,
    width: ScreenWidth - getWidth(60),
  },
  historyItem: {
    paddingVertical: getHeight(10),
  },
  historyTitle: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#333333',
    paddingBottom: getHeight(10),
  },
  historyText: {
    fontSize: normalize(12),
    color: '#333333',
    paddingTop: normalize(5)
  },
  blockUser: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: getWidth(15),
    marginVertical: getWidth(5),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconUser: {
    width: getWidth(24),
    height: getWidth(24),
    resizeMode: 'contain',
    marginRight: getWidth(5),
  },
  itemText: {
    fontSize: normalize(12),
    color: '#333333',
    fontWeight: 'bold',
  },
  time: {
    
  },
  mb15: {
    marginBottom: normalize(15),
  },
  topTitle: {
    marginLeft: getWidth(5),
    width: "95%",
  },
  changedContainerParent:
  {
    // paddingBottom: theme.space[8],
    flexDirection: "row",
    alignItems: "baseline"
  },
  changedLabel: {
    fontSize: theme.fontSizes[1],
    maxWidth: "50%",
    flex: 0.5
  },

  changedContent: {
    fontSize: theme.fontSizes[1],
    maxWidth: "45%"
  },
  flex1: {
    flex: 1,
  },
  changedContainer: {
    flexDirection: 'row',
    paddingVertical: theme.space[1],
    justifyContent: "center",
    alignItems: "center",
    overflow: 'visible'
  },
  arrowIcon: {
    width: 18,
    height: 12
  },
  black12: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[1],
  },
  rowInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataContent: { width: "100%" },
});
export default ChangeHistoryStyles;
