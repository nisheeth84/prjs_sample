import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants/theme';

export const ButtonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: theme.borderRadius,
  },
  containerNatural: {
    alignSelf: 'flex-start',
  },
  buttonCompleteDisabled: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  textCompleteDisabled: {
    color: theme.colors.gray200,
  },
  buttonCompleteActive: {
    backgroundColor: theme.colors.blue300,
    borderColor: theme.colors.blue300,
  },
  buttonComplete: {
    backgroundColor: theme.colors.blue200,
    borderColor: theme.colors.blue200,
  },
  textWhite: {
    color: theme.colors.white,
  },
  buttonInCompleteDisabled: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  textInCompleteDisabled: {
    color: theme.colors.gray200,
  },
  buttonInCompleteActive: {
    backgroundColor: theme.colors.blue100,
    borderColor: theme.colors.blue200,
  },
  textInCompleteActive: {
    color: theme.colors.blue200,
  },
  buttonInComplete: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray100,
  },
  textInComplete: {
    color: theme.colors.black,
  },

  buttonDeleteDisabled: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  textDeleteDisabled: {
    color: theme.colors.gray200,
  },
  buttonDeleteActive: {
    backgroundColor: theme.colors.red200,
    borderColor: theme.colors.red200,
  },
  textDeleteActive: {
    color: theme.colors.white,
  },
  buttonDelete: {
    backgroundColor: theme.colors.red,
    borderColor: theme.colors.red,
  },
  textDelete: {
    color: theme.colors.white,
  },
  loadingIndicator: {
    marginLeft: 10,
    color: theme.colors.gray200,
  },
});
