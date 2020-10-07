import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants';

export const ButtonInputStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.space[5],
    borderWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  buttonInputWrapper: {
    position: 'relative',
    alignItems: 'center',
    height: 44,
    flexDirection: 'row',
  },
  textStyle: {
    color: theme.colors.black,
  },
  labelStyle: {
    color: theme.colors.gray1,
  },
  leftIcon: {
    marginRight: theme.space[2],
  },
});

export const errorStyle = {
  borderColor: theme.colors.red600,
  backgroundColor: theme.colors.pink,
  color: theme.colors.red600,
};
