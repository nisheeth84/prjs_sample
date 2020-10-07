import { Dimensions, StyleSheet, NativeModules, Platform } from 'react-native';
import { theme } from '../../../config/constants';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

const { width } = Dimensions.get('window');

export const DrawerLeftContentStyles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.space[4],
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.space[4],
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.space[6],
    paddingVertical: theme.space[3],
  },
  departmentChildItem: {
    paddingLeft: theme.space[6],
  },
  divide: {
    height: 1,
    backgroundColor: theme.colors.gray100,
  },
  divide2: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  list: {
    padding: theme.space[4],
  },
  search: {
    marginTop: theme.space[4],
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingLeft: theme.space[3],
    borderRadius: theme.borderRadius,
  },
  listItem: {
    padding: theme.space[4],
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
  },
  titleHeader: {
    fontWeight: '600',
    fontSize: theme.fontSizes[3],
  },
  titleList: {
    fontWeight: '600',
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    justifyContent: 'flex-end',
    paddingBottom: theme.space[4],
  },
  iconEdit: {
    justifyContent: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconArrowDown: {
    marginRight: theme.space[4],
  },
  headerArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formBack: {
    flexDirection: 'row',
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[4],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  iconBack: {
    marginRight: theme.space[4],
  },
  wrapTitle: {
    backgroundColor: theme.colors.gray100,
    paddingVertical: theme.space[2],
    paddingHorizontal: theme.space[4],
  },
  wrapGroupTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formResultSearch: {
    backgroundColor: 'white',
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 10,
  },
  searchItem: { padding: 10 },
  viewRegionErrorShow: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
  },
  viewToast: {
    backgroundColor: '#D8F2E5',
    flexDirection:'row',
    borderRadius: 12,
  },
});

export const ManipulationGroupStyles = StyleSheet.create({
  manipulationWrapper: {
    paddingLeft: 15,
  },
  childListWrapper: {
    flex: 1,
    marginTop: theme.space[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  childList: {
    marginLeft: theme.space[4],
  },
  elementChildWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginLeft: theme.space[6],
  },
  elementChild: {
    marginTop: 10,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
  },
  inputStyle: {
    borderWidth: 0,
    flex: 1,
    paddingLeft: 0,
    marginLeft: theme.space[3],
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 1,
  },
  iconRemove: {
    width: 10,
    height: 10,
  },
  otherLanguageButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    width: 120,
    marginLeft: theme.space[6],
    marginTop: theme.space[3],
  },
});

export const ModalDeleteStyles = StyleSheet.create({
  container: {
    margin: 20,
    zIndex: 9999,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: theme.colors.black,
    fontWeight: 'bold',
    fontSize: theme.fontSizes[3],
    justifyContent: "center",
  },
  content: {
    color: theme.colors.black,
    marginTop: theme.space[5],
  },
  wrapButton: {
    flexDirection: 'row',
    marginTop: theme.space[5],
  },
  buttonCancel: {
    marginRight: theme.space[5],
    alignItems: 'center',
    width: 100,
    paddingVertical: 10,
  },
  buttonDelete: {
    backgroundColor: theme.colors.red,
    width: 100,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  buttonTextCancel: {
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  buttonTextDelete: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});

export const GroupActivityModalStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width - theme.space[10],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 0,
  },
  title: {
    color: theme.colors.black,
    fontWeight: '600',
    fontSize: theme.fontSizes[3],
  },
  wrapItem: {
    paddingHorizontal: theme.space[16],
    paddingVertical: theme.space[6],
    zIndex: 999,
  },
  divide: {
    height: 1,
    width: width - theme.space[10],
    backgroundColor: theme.colors.gray200,
  },
  alignCenter: {
    alignItems: 'center',
  },
});
