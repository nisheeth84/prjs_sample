import { StyleSheet, Platform, NativeModules } from 'react-native';
import { theme } from '../../../../config/constants';

const { StatusBarManager } = NativeModules;

export const CustomerListShareStyles = StyleSheet.create({
  paddingTop: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  wrapAlert: {
    paddingHorizontal: theme.space[3],
    paddingTop: 20,
    alignItems: "center"
  },

  labelText: {
    fontWeight: 'bold',
    color: '#333333'
  },
  divide1: {
    height: 1,
    backgroundColor: theme.colors.gray100,
  },
  wrapButton: {
    paddingHorizontal: theme.space[3],
    marginTop: theme.space[5],
  },
  labelHighlight: {
    marginLeft: theme.space[2],
    backgroundColor: theme.colors.red,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  labelTextHighlight: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.fontSizes[1],
  },
  wrapFormInput: {
    paddingTop: theme.space[6],
  },
  wrapFormInputError: {
    paddingTop: theme.space[6],
    backgroundColor: '#FFDEDE',
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  modalSuggetView: {
    paddingHorizontal: 12
  },

  labelName: {
    paddingHorizontal: theme.space[3],
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputName: {
    margin: theme.space[3],
    borderWidth: 0,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
})