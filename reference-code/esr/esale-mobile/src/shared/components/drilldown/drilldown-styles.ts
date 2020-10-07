import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants';

export const DrilldownStyles = StyleSheet.create({
  container: {},
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
  itemTitle: {
    marginLeft: theme.space[4],
  },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.space[3],
    paddingHorizontal: theme.space[4],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
});
