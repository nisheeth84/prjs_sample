import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../../../../config/constants';

const { height,width } = Dimensions.get('window');

export const createAddParticipantsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: 'flex-end',
  },
  viewOutSide: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  viewTop: {
    height: 18,
    alignItems: 'center',
  },
  view: {
    backgroundColor: theme.colors.gray1,
    borderRadius: theme.borRadius.borderRadius10,
    height: 5,
    width: width * 0.12,
  },
  viewContent: {
    backgroundColor: theme.colors.white,
    borderTopRightRadius: theme.borderRadius,
    borderTopLeftRadius: theme.borderRadius,
    minHeight: '30%',
    maxHeight: height * 0.6,
  },
  devider: {
    height: theme.space[3],
    backgroundColor: theme.colors.gray200,
  },
  viewInput: {
    backgroundColor: theme.colors.white200,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.gray100,
    borderWidth: 1,
    marginVertical: theme.space[6],
    marginHorizontal: theme.space[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[3],
  },
  txtInput: {
    // color: theme.colors.gray,
    fontSize: theme.fontSizes[3],
    width: '90%',
    paddingVertical: theme.space[2],
  },
  viewBtn: {
    // backgroundColor: theme.colors.blue200,
    position: 'absolute',
    zIndex: 1,
    bottom: theme.space[5],
    width: '100%',
    alignItems: 'center',
  },
  btnStyle: {
    backgroundColor: theme.colors.blue200,
    borderRadius: theme.borderRadius,
    padding: theme.space[3],
    paddingHorizontal: theme.space[14],
  },
  txtBtn: {
    textAlignVertical: 'center',
    color: theme.colors.white,
  },
  btnItem: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
  },
  btnItemEmp: {
    padding: theme.space[3],
    borderColor: theme.colors.white200,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontSize: theme.fontSizes[4],
  },
  txtDepartment: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.gray,
  },
  padding: {
    height: 70,
  },
  image: {
    height: 40,
    borderRadius: 20,
    aspectRatio: 1,
    marginRight: theme.space[3],
  },
  viewClose: {
    height: 22,
    aspectRatio: 1,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray1,
  },
  txtClose: {
    fontSize: theme.fontSizes[5],
    color: theme.colors.white200,
  },
  contentContainerStyle: {
    paddingVertical: theme.space[2],
  },
  cardWrap: {
    flex: 1,
    paddingHorizontal: theme.space[3],
    paddingVertical: theme.space[1],
    flexDirection: 'row-reverse',
  },
  listCardContainer: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[2],
  },
  circleView: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  iconCheck: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  nameWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  asCenter: {
    alignSelf: 'center',
    flex: 0.1,
    alignItems: 'flex-end',
  },
  viewIndicator: {
    height: 70,
    justifyContent: 'center',
  },
  txtNoData: {
    color: theme.colors.red200,
  },
  txtEmployee: {
    fontSize: theme.fontSizes[1] / 1.2,
  },
});
