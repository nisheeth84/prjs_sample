import { StyleSheet } from 'react-native';
import { theme } from '../../config/constants';

export const BusinessCardStyles = StyleSheet.create({
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
  fristRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  listCard: {
    marginTop: theme.space[3],
  },
});

export const BusinessCardItemStyles = StyleSheet.create({
  inforEmployee: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    marginHorizontal: 8,
  },
  mainInforBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {},
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
});
