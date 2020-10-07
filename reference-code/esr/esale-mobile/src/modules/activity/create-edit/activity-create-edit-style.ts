import { StyleSheet } from "react-native"
import { ScreenWidth, getHeight, getWidth, normalize } from "../common"
import { theme } from "../../../config/constants"

export const ActivityCreateEditStyle = StyleSheet.create({
  // style for top
  top: {
    backgroundColor: theme.colors.white100,
    height: 60,
    position: 'relative',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCenter: {
    position: 'absolute',
    transform: [{ translateX: ScreenWidth / 2 - normalize(50) }],
  },
  topLeft: {},
  ImagesClose: {
    width: getWidth(15),
    height: getHeight(15),
    resizeMode: 'contain',
  },
  centerText: {
    fontSize: normalize(18),
    color: theme.colors.black,
  },
  topRight: {
    borderColor: theme.colors.blue200,
    borderRadius: getWidth(8),
    borderWidth: 1,
    paddingVertical: normalize(7),
    paddingHorizontal: normalize(20),
  },
  ButtonActive: {
    backgroundColor: theme.colors.blue200,
  },
  topText: {
    color: theme.colors.black,
  },
  activeText: {
    color: theme.colors.white,
  },
  // style for row
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(5),
    width: '100%',
  },
  RowBottomNone: {
    paddingBottom: 0,
  },
  RowLeft: {
    fontSize: normalize(14),
    color: theme.colors.gray1,
  },
  RowRight: {
    fontSize: normalize(14),
    color: theme.colors.gray1,
  },
  color333: {
    color: theme.colors.black,
  },
  color666: {
    color: theme.colors.gray1,
  },
  color999: {
    color: theme.colors.gray,
  },
  ActivityButton: {},
  ActivityButtonText: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    textAlign: 'center',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  ActivityButtonActive: {},
  ActivityButtonActiveText: {
    borderColor: '#0F6EB5',
    color: '#0F6EB5',
  },
  FontWeight: {
    fontWeight: 'bold',
  },
  // style for Activity
  ActivityList: {},
  ActivityItem: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(16),
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
  },
  
  ActivityItemBottomNone: {
    borderBottomWidth: 0,
  },
  ActivityTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '70%',
    overflow: 'hidden',
    marginBottom: normalize(8),
  },
  ActivityTitle: {
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  ActivityLabel: {
    borderRadius: getWidth(5),
    overflow: 'hidden',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    marginLeft: normalize(10),
    fontSize: normalize(10),
    backgroundColor: '#FA5151',
    color: theme.colors.white,
  },
  ActivityContent: {
    fontSize: normalize(14),
    width: '100%',
    color: theme.colors.black,
  },
  ActivityInput: {
    borderRadius: getWidth(10),
    paddingVertical: normalize(5),
    height: getHeight(50),
    overflow: 'hidden',
    paddingTop: normalize(10)
  },
  // BoxChangeTime
  BoxChangeTime: {
    borderRadius: getWidth(10),
    backgroundColor: theme.colors.white,
    paddingVertical: normalize(10),
    overflow: 'hidden',
  },
  BoxTime: {
    width: 100,
    paddingTop: 10
  },
  BoxBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TimeStart: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: normalize(30),
  },
  TimeEnd: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    flex: 1,
    marginRight: normalize(30),
  },
  TimeCalculator: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    flex: 1,
  },
  TimeInput: {
    width: '100%',
    paddingTop: 0,
  },
  TimeLabel: {
    fontSize: normalize(14),
    color: theme.colors.black,
    position: 'absolute',
    right: getWidth(5),
    paddingTop: normalize(10)
  },
  TimeConnect: {
    fontSize: normalize(20),
    color: theme.colors.black,
    position: 'absolute',
    transform: [{ translateY: normalize(-10) }],
    right: normalize(20),
  },
  TimeText: {
    fontSize: normalize(14),
    color: theme.colors.gray1,
  },
  TimeTextV2: {
    fontSize: normalize(14),
    color: theme.colors.gray,
  },
  TimeNote: {
    flexDirection: 'row',
    width: '100%',
    marginTop: normalize(10),
    marginRight: normalize(10),
  },
  TimeNoteItem: {
    flexDirection: 'row',
  },
  NoteText: {
    fontSize: getWidth(14),
    flex: 1,
    color: theme.colors.black,
    marginLeft: normalize(10),
  },
  // select style
  ActivitySelect: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    position: 'relative',
  },
  ActivitySelectText: {
    fontSize: normalize(14),
    color: theme.colors.black,
    paddingRight: normalize(30),
  },
  ActivitySelectImage: {
    width: getWidth(20),
    height: getHeight(10),
    resizeMode: 'contain',
    position: 'absolute',
    transform: [{ translateY: getHeight(18) }],
    right: getWidth(10),
  },
  // style for box extends
  ActivityExtends: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingVertical: normalize(10),
    borderRadius: getWidth(10),
    position: 'relative',
    paddingBottom: normalize(20),
    marginRight: normalize(9)
  },
  CloseExtends: {
    position: 'absolute',
    right: normalize(-20),
    top: normalize(-23),
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(50),
    overflow: 'hidden',
    paddingHorizontal: normalize(4),
    paddingVertical: normalize(6),
    width: getWidth(25),
    height: getWidth(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    zIndex: 9999
  },
  CloseImages: {
    width: getWidth(12),
    height: getHeight(12),
    resizeMode: 'contain',
  },
  // style for card
  WrapCard: {
    marginTop: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  Card: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: getWidth(10),
    overflow: 'hidden',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    backgroundColor: '#EDEDED',
    position: 'relative',
    flexDirection: 'row',
    flex: 1,
    maxWidth: '50%',
    marginRight: normalize(10),
  },
  CardImage: {
    width: getWidth(30),
    height: getHeight(40),
    backgroundColor: '#FFD0A5',
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#FFD0A5',
    borderRadius: getWidth(50),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageDefault: {
    fontSize: normalize(14),
    color: theme.colors.white,
  },
  CardContent: {
    marginLeft: normalize(10),
  },
  CardName: {
    fontSize: normalize(12),
    color: theme.colors.gray,
  },
  CardPosition: {
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  ButtonClose: {
    position: 'absolute',
    right: getWidth(10),
    top: getHeight(10),
  },
  // add file button
  AddFileButton: {
    borderWidth: 2,
    borderColor: '#EDEDED',
    borderRadius: getWidth(10),
    overflow: 'hidden',
    borderStyle: 'dashed',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  AddFileImage: {
    width: getWidth(15),
    height: getHeight(15),
    resizeMode: 'contain',
  },
  AddFileText: {
    marginLeft: normalize(10),
    fontSize: normalize(11),
    color: theme.colors.gray,
  },
  // style for wrapCheckBox
  WrapCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: getWidth(10),
    overflow: 'hidden',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
  },
  CheckBoxText: {
    marginLeft: normalize(8),
    paddingRight: normalize(8),
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  red: {
    color: 'red',
  },
  // style for list customer
  ListCustomer: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    backgroundColor: '#F9F9F9',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  Customer: {
    backgroundColor: theme.colors.gray1,
    borderRadius: getWidth(50),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    paddingRight: normalize(30),
    position: 'relative',
    width: getWidth(130),
    marginRight: normalize(5),
    marginBottom: normalize(5),
  },
  CloseCustomer: {
    top: getHeight(12),
  },
  CustomerName: {
    fontSize: normalize(14),
    color: theme.colors.white,
  },

  // styles for List Pay
  ListPay: {
    paddingVertical: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  PayItem: {
    marginRight: normalize(25),
    flexDirection: 'row',
  },
  PayName: {
    marginRight: normalize(3),
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  PayValue: {
    fontSize: normalize(14),
    color: theme.colors.black,
  },

  // style for shopping
  Shopping: {
    backgroundColor: '#EDEDED',
    paddingTop: normalize(15),
    paddingBottom: normalize(8),
    paddingHorizontal: normalize(10),
    marginBottom: normalize(20),
    marginTop: normalize(10)
  },
  ShoppingTop: {
    flexDirection: 'row',
  },
  ShoppingImage: {
    width: '30%',
  },
  ImageCart: {
    width: '100%',
    height: getHeight(75),
    resizeMode: 'contain',
  },
  ShoppingInfo: {
    width: '70%',
    marginLeft: normalize(10),
  },
  ShoppingText: {
    fontSize: normalize(14),
    color: theme.colors.black,
    marginBottom: normalize(5),
  },
  ShoppingTextSmall: {
    fontSize: normalize(12),
    color: theme.colors.gray1,
  },
  ShoppingTextLarge: {
    fontSize: normalize(16),
  },
  ShoppingList: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(8),
  },
  ShoppingItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    flexDirection: 'row',
    paddingLeft: normalize(12),
    paddingRight: normalize(5),
    paddingVertical: normalize(5),
  },
  ShoppingItemNoFlexDirection: {
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.gray100,
    paddingLeft: normalize(12),
    paddingRight: normalize(5),
    paddingVertical: normalize(5),
  },
  ShoppingLeft: {
    flex: 45,
  },
  ShoppingName: {
    fontSize: normalize(14),
    color: theme.colors.black,
    // marginTop: normalize(12),
  },
  ShoppingRight: {
    flex: 55,
  },
  ShoppingInput: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    height: getHeight(50),
    overflow: 'hidden',
    textAlign: 'right',
    color: theme.colors.gray1,
    textAlignVertical: 'top',
  },
  ShoppingInputMultipleLine: {
    height: getHeight(120),
  },
  // AddFileText: {},
  // modal
  // modal: {
  //   paddingHorizontal: normalize(10),
  // },
  titleModal: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: normalize(10),
  },
  titleModalV2: {
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  textModal: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: normalize(45),
  },
  textModalV2: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    marginTop: normalize(5),
  },
  footerModalV1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: normalize(10),
  },
  footerModalV2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderTopStartRadius: 1,
    marginHorizontal: -2,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
  },
  buttonModal: {
    marginTop: normalize(20),
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: normalize(20),
    fontSize: 12,
    fontWeight: 'bold',
    padding: 18,
    borderRadius: normalize(10),
    overflow: 'hidden',
  },
  widthButton: { width: normalize(150) },
  buttonBorder: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  buttonRed: {
    borderWidth: 1,
    borderColor: '#F92525',
    backgroundColor: '#F92525',
    color: theme.colors.white,
  },
  itemModal: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  itemModalAct: {
    backgroundColor: theme.colors.gray100,
  },
  colorBlue: {
    color: theme.colors.blue200,
  },
  buttonModalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonModalAdd: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    overflow: 'hidden',
    alignItems: 'center',
  },

  btnSearchText: {
    paddingLeft: normalize(10),
    fontSize: normalize(14),
    width: getWidth(180),
    overflow: 'hidden',
  },
  btnAddText: {
    paddingLeft: normalize(10),
    fontSize: normalize(12),
  },
  plus: {
    fontSize: normalize(20),
    color: '#999999',
  },
  contentsModal: {
    paddingVertical: normalize(10),
  },
  // style modal from schedule

  footerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(20),
  },
  btnFooter: {
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    borderRadius: normalize(7),
    overflow: 'hidden',
    height: normalize(40),
    width: normalize(118),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFooterActive: {
    backgroundColor: '#F92525',
    borderColor: '#F92525',
  },
  colorWhite: {
    color: theme.colors.white,
  },
  btnProductTrading: {
    padding: theme.space[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtContentBtn: { color: theme.colors.gray1, fontSize: theme.fontSizes[1] },
  containerChooseProductTrading: {
    backgroundColor: theme.colors.gray100,
    padding: theme.space[2],
    flex: 1,
    borderRadius: theme.space[2],
    justifyContent: 'center',
    marginVertical: theme.space[2],
    flexDirection: 'row',
  },
  contentItemSelect: { flexDirection: 'row', justifyContent: 'space-between' },
  viewItemContent: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  viewRequired: {
    backgroundColor: theme.colors.red500,
    borderRadius: theme.space[1],
    marginLeft: theme.space[5],
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
    width: 36,
  },
  txtRequired: {
      color: theme.colors.white,
      fontSize: theme.fontSizes[0],
  },
  txtTime: {
    color: theme.colors.gray,
    fontSize: theme.fontSizes[1],
    marginTop: theme.space[3],
  },
  activitiesFormat: {
    fontSize: normalize(14),
    width: '100%',
    color: '#666',
  },
  colorActive: {
    color: "#0F6DB5",
  },
  ViewBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textRight: {
    fontSize: getHeight(12.86),
    color: "#0F6EB5",
    textAlign: "right",
  },
  textBorder: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: getWidth(15),
    padding: getWidth(8),
    color: "#333",
  },
  flex1: {
    flex: 1
  },
  flex3: {
    flex: 3
  },
  suggestionContainerData: {
    borderColor: '#E5E5E5',
    height: getHeight(550)
  },
  businessCardItem: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: getHeight(10)
  },
  businessCardItemFormat: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    flex: 1
  },
  itemText: {
    width: '85%',
    padding: 15
  },
  itemAction: {
    width: '10%',
    padding: 15
  },
  businessCardItemInfo: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(16),
    width: '85%'
  },
  businessCardContent: {
    flex: 1
    , flexDirection: 'row'
    , padding: normalize(10)
    , borderRadius: 10
    , backgroundColor: '#e6f2ff'
    , marginVertical: 5
  },
  width90: { 
    width: '90%'
  },
  buttonClose: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(50),
    overflow: 'hidden',
    width: getWidth(20),
    height: getWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    zIndex: 9999,
  }
})
