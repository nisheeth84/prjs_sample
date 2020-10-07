import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../config/constants";
import { getScreenWidth } from "../../../shared/util/app-utils";

const { height, width } = Dimensions.get("window");
const HEIGHT_CONTENT = height - 90;
const DEVICE_WIDTH = width;

export const TimelineListStyle = StyleSheet.create({
  boxModalCreateTimeline: {
    height: HEIGHT_CONTENT,
    width: DEVICE_WIDTH,
  },
  reactionListModal: {
    width: getScreenWidth(),
    height: "100%",
  },
  txtBold: {
    fontWeight: "bold",
  },
  txtItalic: {
    fontStyle: "italic",
  },
  txtUnderLine: {
    textDecorationLine: "underline",
  },
  txtStrikeThrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  txtNormal: {
    fontStyle: "normal",
  },
  safe: { flex: 1 },
  btnFloat: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
    bottom: "20%",
    right: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  btnFloatIcon: { width: 25, height: 25 },
  tab: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
    borderTopColor: "#F9F9F9",
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: theme.space[4],
    paddingRight: '8%'
  },
  rowView: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
    borderTopColor: "#F9F9F9",
    borderTopWidth: 1,
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  create: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
    borderTopColor: "#F9F9F9",
    borderTopWidth: 1,
    height: 43,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: theme.space[4],
  },
  createTimeline: {
    width: 60,
    backgroundColor: "#EAEAEA",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  txtCreateTimeline: { color: "#969696" },
  createTimelineIn: {
    width: 60,
    backgroundColor: theme.colors.blue200,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  txtCreateTimelineIn: { color: theme.colors.white },
  txtNameReply: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[2],
    paddingHorizontal: theme.space[1],
  },
  txtCreate: {
    color: theme.colors.black,
    fontSize: theme.fontSizes[1],
    flex: 1,
    paddingHorizontal: theme.space[1],
  },
  inputCreate: {
    borderColor: theme.colors.transparent,
    paddingHorizontal: theme.space[1],
    flexDirection: "row",
    textAlignVertical: "top",
    flex: 1,
  },
  inputContent: {
    borderColor: theme.colors.transparent,
    marginHorizontal: theme.space[3],
    flex: 1,
    textAlignVertical: "top",
    width: "100%",
  },
  titleHeader: { fontWeight: "400", color: theme.colors.black },
  appbarCommonStyle: {
    backgroundColor: theme.colors.gray400,
    height: 50,
  },
  icon: {
    height: 24,
    marginHorizontal: theme.space[2],
  },
  tagName: {
    backgroundColor: theme.colors.gray1,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 2,
    flexDirection: 'row',
    marginRight: 10
  },
  iconClose: {
    height: 10,
    width: 10,
    paddingHorizontal: 6
  },
  scroll: {
    marginBottom: 80,
  },
  blackView: {
    backgroundColor: "rgba(0,0,0,0.8)",
    width: "100%",
    height: 60,
  },
  headerShare: {
    backgroundColor: theme.colors.white,
    width: "100%",
    height: 60,
    borderBottomColor: "#f9f9f9",
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  createTimelineContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white

  },
  createTimelineModal: {
    width: "100%",
    position: "absolute",
    top: 0,
    justifyContent: "space-between",
    backgroundColor: theme.colors.white
  },
  chooseChannel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: '100%',
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  containerDiaLog: { 
    width: '100%',position: "absolute", height: '100%',
    top: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end"
  },
  dialog: { 
    backgroundColor: '#f3f3f3',
    width: '100%', 
    height: 300,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    },
  searchDialog: { backgroundColor: '#fff', height: 75, width: '100%',
  borderTopLeftRadius: 15, borderTopRightRadius: 15, alignItems: 'center', justifyContent: 'center' },
  inputSearch: { borderWidth: 0.5, borderRadius: 10, width: "85%", height: 40, borderColor: theme.colors.gray, },
  listResultDialLog: { backgroundColor: theme.colors.white, marginTop: 12, width: '100%', height: '100%' },
  itemResultDiaLog: { borderBottomWidth: 0.5, height: 60,  
    borderColor: '#333', flexDirection: 'row', alignItems: 'center', paddingHorizontal: '5%'},
  imageDialogContainer: { flex: 1 },
  imageDialog: { backgroundColor: theme.colors.gray100, width: 40, height: 40, borderRadius: 20 },
  txtResultDialog: { flex: 5, fontSize: theme.fontSizes[3], color: theme.colors.blue200, paddingLeft: 10 },
  txtResultGroup: { fontSize: theme.fontSizes[2], color: theme.colors.gray4 },
  txtResultGroupName: { fontSize: theme.fontSizes[3], color: theme.colors.black, fontWeight: 'bold' },
  file: {
    width: "90%",
    height: 38,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: '3%'
  },
  fileIcon: {
    marginLeft: 10,
    width: 20,
  },
  fileTxt: {
    color: "#666666",
    fontSize: 14,
    marginLeft: 8,
  },
  optionShare: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
    borderTopColor: "#F9F9F9",
    borderTopWidth: 1,
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    position: 'absolute',
    bottom: 0
  }
  }
);

