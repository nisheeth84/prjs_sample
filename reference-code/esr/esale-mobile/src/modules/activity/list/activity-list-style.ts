import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../config/constants/theme';
import { getHeight, getWidth, normalize } from '../../calendar/common';

const sWidth = Dimensions.get('window').width
export const ActivityListStyle = StyleSheet.create({
  content: {
    backgroundColor: '#EDEDED',
    // flex: 1,
  },
  contentHeader: {
    flexDirection: 'column',
  },
  ActivityAll: {
    backgroundColor: '#fff',
  },
  // color
  colorActive: {
    color: '#0F6DB5',
  },
  colorBold: {
    color: theme.colors.black,
  },
  flexDRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxChild: {
    justifyContent: 'space-between',
    paddingBottom: normalize(20),
  },
  // header
  boxHeader: {
    paddingHorizontal: normalize(15),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#E4E4E4',
    borderTopWidth: 1,
    minHeight: 64,
  },
  boxHeaderOther: {
    paddingVertical: normalize(20),
    paddingLeft: normalize(15),
    backgroundColor: '#fff',
    borderTopColor: '#E4E4E4',
    borderTopWidth: 1,
  },
  textHeader: {
    fontSize: normalize(18),
    color: '#333',
    flex: 1,
  },
  boxText: {
    marginLeft: normalize(15),
  },
  boxTextTitle: {
    padding: normalize(10),
    borderTopLeftRadius: getWidth(7),
    borderBottomLeftRadius: getWidth(7),
    marginTop: normalize(5),
    overflow: 'hidden',
  },
  // content
  textFontSize: {
    fontSize: normalize(14),
    color: '#333',
  },
  boxArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //
  generalIcon: {
    width: getWidth(16),
    height: getHeight(16),
    resizeMode: 'contain',
    tintColor: '#999',
  },
  iconUpDown: {
    width: getWidth(12),
    height: getHeight(8),
    resizeMode: 'contain',
    tintColor: '#999',
  },
  icSearchAdvance: {
    width: getWidth(16),
    height: getHeight(10),
    resizeMode: 'contain',
    tintColor: '#999',
  },
  textLeft: {
    marginLeft: normalize(10),
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: getHeight(50),
    flex: 1,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: getWidth(10),
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  ImageStyle: {
    margin: normalize(5),
  },
  // top content
  topActivity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: normalize(10),
    flex: 1,
  },
  topActivityLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topActivityCenter: {
    width: '50%',
  },
  topActivityRight: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  avatar: {
    width: getWidth(48),
    height: getHeight(48),
    resizeMode: 'contain',
    alignItems: 'center',
    borderRadius: 24,
  },
  textSize: {
    fontSize: normalize(12),
    color: '#333',
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    lineHeight: 20
  },
  labelIem: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    paddingLeft: normalize(10),
    lineHeight: 20
  },

  // content
  worked: {
    width: '100%',
    paddingVertical: normalize(5),
  },
  productList: {
    paddingVertical: normalize(5),
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: normalize(10),
  },
  titleProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  contentProduct: {
    justifyContent: 'flex-start',
    paddingRight: normalize(20),
    flex: 8,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconUserSmall: {
    width: getWidth(24),
    height: getHeight(24),
    resizeMode: 'contain',
    marginHorizontal: normalize(5),
    borderRadius: 50,
  },
  pdBottom: {
    paddingBottom: normalize(5),
  },
  pdLeft: {
    marginLeft: getWidth(15),
  },
  titleProductOther: {
    paddingLeft: normalize(40),
    paddingBottom: normalize(10),
  },
  iconRun: {
    width: getWidth(14),
    height: getHeight(14),
    resizeMode: 'contain',
    marginHorizontal: normalize(5),
  },
  // bottom
  bottomActivity: {
    minHeight: getHeight(50),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopColor: '#E4E4E4',
    borderTopWidth: 1,
    paddingVertical: normalize(15),
  },
  comment: {
    fontSize: normalize(12),
    color: '#333',
    marginLeft: normalize(5),
  },
  iconBottom: {
    width: getWidth(12),
    height: getHeight(12),
    resizeMode: 'contain',
  },
  iconQuote: {
    width: getWidth(10.5),
    height: getHeight(9.5),
    resizeMode: 'contain',
  },
  mrTop: {
    marginTop: normalize(20),
  },
  mrBottom: {
    marginBottom: normalize(10),
    flex: 1,
  },
  btn: {
    width: getWidth(50),
    height: getHeight(50),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  // form Search
  headerSearch: {
    minHeight: getHeight(60),
    backgroundColor: '#F8F8F8',
    paddingVertical: normalize(10),
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
  },
  SearchLeft: {
    width: '75%',
  },
  SearchRight: {
    width: '25%',
    alignItems: 'center',
  },
  // search advance
  headerDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeaderDetails: {
    fontSize: normalize(18),
    color: '#333',
  },
  contactDate: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'red',
  },
  textDetails: {
    fontSize: normalize(12),
    color: '#fff',
  },
  buttonSearch: {
    minWidth: getWidth(56),
    minHeight: getHeight(32),
    backgroundColor: '#0F6DB5',
    borderRadius: getWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonClose: {
    minWidth: getWidth(56),
    minHeight: getHeight(32),
    borderRadius: getWidth(5),
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  ActivityItem: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(15),
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  ActivityTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    overflow: 'hidden',
    marginBottom: normalize(8),
  },
  ActivityTitle: {
    fontSize: normalize(14),
    color: '#333',
  },
  ActivityContent: {
    fontSize: normalize(14),
    width: '100%',
    color: '#333',
  },
  ActivitySelect: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: getWidth(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    position: 'relative',
    overflow: 'hidden',
    height: getHeight(50),
    alignItems: 'center',
    flexDirection: 'row',
  },
  ActivitySelectText: {
    fontSize: normalize(14),
    color: '#333',
  },
  ActivitySelectImage: {
    width: getWidth(20),
    height: getHeight(10),
    resizeMode: 'contain',
    position: 'absolute',
    // transform: [{ translateY: getHeight(10) }],
    right: getWidth(10),
  },
  BoxChangeTime: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: getWidth(10),
    backgroundColor: '#fff',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    overflow: 'hidden',
  },
  BoxBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SelectDate: {
    width: '45%',
  },
  TimeConnect: {
    fontSize: normalize(20),
    color: '#333',
  },
  ActivityInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: getWidth(10),
    backgroundColor: '#F9F9F9',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    overflow: 'hidden',
    height: getHeight(50),
  },
  selectAll: {
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    borderRadius: getWidth(10),
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginRight: normalize(10),
  },
  checkboxParent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  textCheckBox: {
    paddingLeft: normalize(5),
  },
  centerActivity: {},
  ActivityTopLeft: {
    flexDirection: 'row',
    
  },
  ActivityTopInfoCom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  ActivityDateContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  ActivityBottomContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: normalize(20),
    paddingLeft: normalize(10),
  },
  ActivityDateContentItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  time: {
    fontSize: normalize(12),
    color: '#333',
  },
  textBigSize: {
    fontSize: normalize(20),
  },
  alignFlexCenter: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: normalize(8),
  },
  justifyCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flex1: {
    flex: 5,
  },
  topContent: {
    flex: 5,
    paddingVertical: getHeight(25),
  },
  flex10: {
    flex: 10,
    marginTop: 5
  },
  flex35: {
    flex: 35,
  },
  flex65: {
    flex: 65,
  },
  activityDetail: {
    flex: 4,
    justifyContent: 'center',
  },
  toolBox: {
    flexDirection: 'row',
  },
  toolItem: {
    marginLeft: normalize(10),
  },
  editIcon: {
    // flex: 1,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  flexContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fontSize12: {
    fontSize: normalize(12),
    lineHeight: 20
  },
  contentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flex85: {
    flex: 85,
    paddingLeft: normalize(10),
  },
  styleEmployeePhoto: {
    flex: 15,
  },
  formatItem: {
    paddingVertical: 10,
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
    paddingRight: '5%',
  },
  ShoppingImage: {
    width: '30%',
    marginLeft: 16,
  },
  ShoppingTop: {
    flexDirection: 'row',
  },
  imageFormatItem: {
    flex: 1,
    borderRadius: 5,
  },
  ShoppingInfo: {
    width: '70%',
    marginLeft: normalize(5),
    paddingHorizontal: 10,
    marginRight: normalize(5),
  },
  iconEmp: {
    width: getWidth(18),
    height: getHeight(18),
    resizeMode: 'contain',
    marginHorizontal: normalize(5),
  },
  modalWrap: {
    zIndex: 3,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterBoxWrap: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
    zIndex: 3,
    position: 'absolute',
    top: normalize(104),
    right: normalize(12),
    backgroundColor: '#FFF',
    borderRadius: normalize(10),
  },
  filterBoxButton: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(4),
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: normalize(18),
  },
  buttonArea: {
    flex: 1,
    flexDirection: 'row',
    marginTop: normalize(16),
    alignItems: 'stretch',
  },
  filterInput: {
    flex: 1,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
    borderColor: '#E5E5E5',
    borderWidth: 1,
    height:40
  },
  openFilterButton: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: normalize(18),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topArea: {
    zIndex: 1,
    height: normalize(50),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  scrollView: {
    zIndex: 1,
    // overflow: 'hidden',
  },
  tabStyleCustom: {
    height: 46,
    padding: 0,
    margin: 0,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#0F6DB5'
  },
  activeTitle: {
    color: '#0F6DB5',
    backgroundColor: '#D6E3F3',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 1,
    height: normalize(46)
  },
  noActiveTitle: {
    textAlign: 'center',
    backgroundColor: theme.colors.white,
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 1,
    height: normalize(46)
  },
  noBorderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#D6E3F3',
  },
  borderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  customWidth1000: {
    width: 1000
  },
  alignItems: {
    alignItems: "center",
  },
  noDataMessage: {
    marginTop: '20%',
    alignItems: 'center',
  },
  textNoData: {
    color: '#333333'
  },
  functionIcon: {
    height: 30,
    width: 30,
    marginBottom: 10
  },
  colorBlue: {
    color: "#0F6DB5",
  },
  title: {
    fontSize: normalize(14),
    paddingBottom: normalize(6),
  },
  iconLabelTop: {
    flexDirection: 'row'
  },
  iconLabelStyle: {
    backgroundColor: '#ffd633',
    paddingHorizontal: 2,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  iconLabelStyleText: {
    fontSize: normalize(12),
    lineHeight: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  iconLabelNormal: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  sizeImageSmall: {
    width: normalize(20), 
    height: normalize(20)
  },
  backgroundTransparent: { backgroundColor: "transparent" },
  image: {
    width: sWidth * 0.28,
    height: 3 / 5 * sWidth * 0.28,
    resizeMode: "contain",
    borderRadius: 5
  }
});

export default ActivityListStyle;
