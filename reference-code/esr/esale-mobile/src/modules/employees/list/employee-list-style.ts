import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../config/constants';
import { StatusBar } from 'react-native';

export const EmployeeListItemStyles = StyleSheet.create({
  inforEmployee: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    paddingVertical: 15,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    marginHorizontal: 8,
    width: Dimensions.get('window').width - 120,
    marginRight: 15,
    alignItems: "flex-start"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  wrapAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  bossAvatarText: {
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  cellWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16
  },
  title: {
    color: '#666666',
    fontWeight: '400',
    fontSize: theme.fontSizes[3],
  },
  row: {
    flexDirection: 'row',
  },
  checkedIcon: {
    width: 20,
    height: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  inforEmployeeActionFist: {
    width: Dimensions.get('window').width / 3,
    height: 100,
    backgroundColor: "#F9F9F9",
    //paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  inforEmployeeActionSecond: {
    width: Dimensions.get('window').width / 2,
    height: 100,
    backgroundColor: "#F9F9F9",
    //paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  inforEmployeeDetail: {
    textAlign: "center",
  }
});

export const EmployeeListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray200,
  },
  inforBlock: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 17,
    paddingVertical: 21,
  },
  title: {
    fontSize: 19,
  },
  dateTitle: {
    fontSize: 12,
  },
  subTitle: {
    marginTop: 10,
    color: '#333333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  date: {
    flexDirection: 'row',
    fontSize: theme.fontSizes[0],
  },
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconEditButton: {
    marginHorizontal: 7,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFilterButton: {
    marginHorizontal: 7,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDescendingButton: {
    marginHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOtherButton: {
    marginLeft: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listEmployee: {
    marginTop: theme.space[3],
    marginBottom: 54 + 85,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: theme.colors.white,
    paddingBottom: 4,
    borderRadius: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  },
  contentContainerStyle: { paddingBottom: 120 },
  contentContainerEditStyle: { paddingBottom: 180 },
  fabIcon: {
    fontSize: 40,
    color: theme.colors.green2,
  },
  wrapBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.space[4],
    backgroundColor: theme.colors.white,
    elevation: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleBottom: {
    color: theme.colors.blue200,
  },
  titleBottomDisable: {
    color: theme.colors.gray,
  },
  bottomView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  modalInviteEmployee: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 16,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 20
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10
  },
  viewToast: {
    backgroundColor: '#D8F2E5',
    flexDirection: 'row',
    borderRadius: 12,
  }
});

export const EmployeeListSortStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight,
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: "row",
    alignItems: 'center',
    paddingBottom: 15
  },
  touchButtonClose: {
    paddingLeft: 14,
    width: '45%',
  },
  iconClose: {
    height: 21,
    width: 21,
    marginLeft: 14
  },
  sortTitle: {
    fontSize: 18,
    color: '#333333',
  },
  submitButton: {
    width: 56,
    height: 38.56,
    borderRadius: 8,
    backgroundColor: '#0F6DB5',
    alignItems: 'center',
    paddingTop: 10,
    marginLeft: '20%',
  },

  wrapGroupItem: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  contentStyle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  sortbar: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 14,
    paddingBottom: 15,
    alignItems: 'center'
  },
  sortIconCheck: {
    paddingLeft: 14
  },
  titleButtonSubmit: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  lableSort: {
    width: '50%',
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
  },
  touchOpacityAscHigh: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0F6DB5',
    backgroundColor: '#D6E3F3',
    height: 32, width: 76,
    alignItems: 'center',
  },
  boxArowUp: {
    backgroundColor: '#0F6EB5',
    borderRadius: 1,
    width: 16,
    height: 16,
    alignItems: 'center',
    marginLeft: 5,
  },
  textAsc: {
    marginLeft: 10,
  },
  touchOpacityDescDisable: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#707070',
    backgroundColor: '#E5E5E5',
    height: 32,
    width: 76,
    alignItems: 'center',
    marginLeft: 10,
  },
  boxDesc: {
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    width: 16,
    height: 16,
    borderColor: '#999999',
    alignItems: 'center',
    marginLeft: 5,
  },
  arow: {
    margin: 2,
  },
  dive: {
    height: 10,
    backgroundColor: '#EDEDED',
  },
});

export const SelectOrderSortStyes = StyleSheet.create({
  activeOrderSelect: {
    backgroundColor: "#D6E3F3",
    borderColor: "#0F6DB5",
  },
  inactiveOrderSelect: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
  },
  activeText: {
    color: "#0F6DB5",
  },
  inactiveText: {
    color: "#333333",
  },
  bold: {
    fontWeight: "normal",
  },
  boldTextButton: {
    fontWeight: "normal",
    marginLeft: 10
  },
  checkActiveIcon: {
    width: 32,
    height: 32
  },
  orderSelect: {
    flexDirection: 'row',
    width: (Dimensions.get("window").width * 1 / 4) - 16,
    height: 32,
    marginRight: 14,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonTypeSort: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconSort: {
    marginLeft: 5,
  }
})