import { StyleSheet, NativeModules, Platform, Dimensions } from 'react-native';
import { theme } from '../../../config/constants';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

export const DetailScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: STATUSBAR_HEIGHT,
  },
  textGray: {
    color: theme.colors.gray1,
    fontWeight: "bold"
  },
  textBlackBold: {
    color: theme.colors.black,
    fontWeight: '700',
    marginVertical: 5,
  },
  employeeInfor: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  licenseBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    minHeight: 27
  },
  licenseContent: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#707070',
    backgroundColor: '#0F6EB5',
    padding: 3,
    maxWidth: Dimensions.get("window").width - 130,
    borderRadius: 5,
  },
  textWhite: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.white,
    borderWidth: 1,
    borderColor: '#707070',
    backgroundColor: '#0F6EB5',
    padding: 3,
    maxWidth: Dimensions.get("window").width - 130,
    borderRadius: 5,
  },
  listIcon: {
    marginLeft: 15,
    width: 24,
    height: 27,
  },
  inforContent: {
    flex: 1,
    marginLeft: 15,
  },
  bossInfor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bossAvatarText: {
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  bossTitle: {
    color: theme.colors.black,
    fontWeight: '700',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    backgroundColor: theme.colors.white,
  },
  bossContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  subOrDinateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    maxWidth: "34%",
    paddingRight: 10
  },
  twoSubOrDinateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    maxWidth: "38%",
    paddingRight: 10
  },
  onlySubOrDinateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingRight: 10
  },
  bossAvatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2
  },
  bossContact: {
    marginLeft: 10,
  },
  bossContactName: {
    color: '#0F6DB5',
    marginLeft: 5,
    marginRight: 10,
  },
  subContactName: {
    color: '#0F6DB5',
    marginLeft: 5,
    maxWidth: "65%"
  },
  onlysubContactName: {
    color: '#0F6DB5',
    marginLeft: 5,
    maxWidth: Dimensions.get("window").width - (Dimensions.get("window").width / 3)
  },
  fieldShowManager: {
    maxWidth: '72%'
  },
  bossContactContent: {
    fontSize: 11,
    color: '#666666',
    marginLeft: 5,
  },
  toFollow: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  toFollowActive: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: theme.colors.blue200,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  toFollowText: {
    fontSize: 12,
    color: theme.colors.black,
    textAlign: 'center',
    fontWeight: "bold"
  },
  toFollowTextActive: {
    fontSize: 12,
    color: theme.colors.blue200,
    textAlign: 'center',
  },
  actionsModify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  modifyButton: {
    marginLeft: 20,
  },
  iconShare: {
    paddingTop: 5
  },
  blockShare: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonShare: {
    justifyContent: "flex-end",
    width: 20,
    height: 20
  },
  wrapAvatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10
  },
  loadingView: {
    paddingVertical: 12,
  }
});

export const InforModalStyles = StyleSheet.create({
  modalBlock: {
    backgroundColor: '#fff',
    borderRadius: 30,
    maxHeight: Dimensions.get("window").height / 2
  },
  modalSubBlock: {
    position: 'relative',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  borderBottomStyles: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  icon: {
    height: 25,
    width: 25,
  },
  infor: {
    textAlign: "center",
    alignItems: 'center',
    color: '#333333',
    paddingLeft: 16,
    paddingRight: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  body: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  viewInfo: {
    alignItems: "center",
    flex: 1
  },

});

export const CustomerListItemStyles = StyleSheet.create({
  paddingRgiht15: {
    paddingRight: 15,
  },
  centerScreenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inforEmployee: {
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  customerBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 15,
  },
  name: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  customerName: { fontWeight: 'bold', fontSize: theme.fontSizes[3] },
  customerAddress: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
});

export const BusinessCardItemStyles = StyleSheet.create({
  inforEmployee: {
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  name: {
    marginHorizontal: 8,
  },
  mainInforBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageBlock: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  longPress: {
    backgroundColor: theme.colors.yellowDeep,
    borderWidth: 0.1,
    borderRadius: 7,
    borderColor: theme.colors.yellowDeep,
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginTop: 3,
  },
  longPressText: {
    fontSize: 12,
    color: theme.colors.white,
    textAlign: 'center',
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
  },
});

export const TaskItemStyles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  subtitle: {
    flexDirection: 'row',
  },
  textGray: {
    color: theme.colors.gray1,
  },
});

export const DetailTabBasicInformationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  inforBlock: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    backgroundColor: theme.colors.white,
  },
  marginTop15: {
    marginTop: 15,
  },
  bgcGray: {
    backgroundColor: theme.colors.gray100,
  },
  marginBottom30: {
    marginBottom: 30,
  },
  inforComponent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  inforComponentTab: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingTop: 20,
  },
  inforOnRow: {
    flex: 1, flexDirection: 'row'
  },
  inforTitle: {
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  calendarBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  jobContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  jobBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ADE4C9',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    borderRadius: 10,
  },
  title: {
    fontWeight: '700',
    marginTop: 5,
  },
  inforText: {
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  inforValue: {
    color: theme.colors.gray1,
  },
  inforEmail: {
    color: '#0F6DB5',
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  inforGroup: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  inforGroupComponent: {
    backgroundColor: theme.colors.gray200,
  },
  groupContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});

export const GroupItemStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  textWhite: {
    color: '#fff',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  groupNameBlock: {
    paddingTop: 25,
    paddingBottom: 35,
    borderWidth: 1,
    borderColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  groupNameText: {
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    paddingHorizontal: 30,
  },
  star: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  groupItemBlock: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 15,
  },
  postDate: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  imageList: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numOfMember: {
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#0F6DB5',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderColor: '#fff',
  },
  joinButton: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
  },
  notJoinButton: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#EDEDED',
  },
});

export const TabbarStyles = StyleSheet.create({
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 1,
    fontWeight: 'bold',
    width: 100,
    fontSize: 10,
    color: '#0F6DB5',
  },
  activeTitle: {
    color: '#0F6DB5',
    backgroundColor: '#D6E3F3',
    fontSize: 12,
  },
  noactive: {
    textAlign: 'center',
    backgroundColor: theme.colors.white,
    fontSize: 12,
  },
  borderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  noBorderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#D6E3F3',
  },
});

export const TradingProductStyles = StyleSheet.create({
  sumTitle: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const TimelineStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listview: {
    marginTop: 15,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#0F6DB5',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
  },
  details: {
    flexDirection: 'column',
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
  },
  detail: { paddingTop: 5, paddingBottom: 10 },
  actionName: {
    fontWeight: 'bold',
  },
  actionDesBlock: {
    marginVertical: 10,
  },
  actionDes: {
    fontSize: 13,
  },
  actionSubDes: {
    marginTop: 5,
    paddingLeft: 10,
  },
  paddingleft15: {
    paddingLeft: 20,
  },
  marginHorizontal10: {
    marginHorizontal: 10,
    color: '#0F6DB5',
  },
});

export const OtherEmployeeModalStyles = StyleSheet.create({
  modalBlock: {
    height: 515,
    backgroundColor: theme.colors.white,
    borderRadius: 30,
  },
  wrapAvatar: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBLock: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 25,
  },
  buttonBlock: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingVertical: 15,
    marginVertical: 20,
    width: 108,
    borderRadius: 10,
  },
  textButton: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  otherEmployeeBlock: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  imageBlock: {
    height: 32,
    width: 32,
    borderRadius: 16
  },
  inforBlock: {
    flexDirection: 'column',
    marginLeft: 10,
    maxWidth: Dimensions.get("screen").width - 170,
    paddingRight: 5
  },
  textGray: {
    fontSize: 12,
    color: theme.colors.gray1,
  },
  textBlue: {
    fontSize: 12,
    color: theme.colors.blue200,
  },
  avatar: {
    fontWeight: "bold",
    color: "#FFFFFF"
  }
});

