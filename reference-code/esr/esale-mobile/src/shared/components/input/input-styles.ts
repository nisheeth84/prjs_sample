import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants';

export const InputStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.space[5],
    borderWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  noneBorder: {
    borderWidth: 0,
    borderColor: theme.colors.white,
  },
  textInputWrapper: {
    position: 'relative',
  },
  disabledView: {},
  textInput: {
    height: 44,
  },
  colorRed: {
    color: theme.colors.red600,
  },
});

export const errorStyle = {
  borderColor: theme.colors.red600,
  backgroundColor: theme.colors.pink,
};
