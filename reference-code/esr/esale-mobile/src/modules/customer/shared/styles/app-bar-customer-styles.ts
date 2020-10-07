import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants/theme";

export const AppBarCustomerStyles = StyleSheet.create({
  container: {
    height: 54,
    backgroundColor: theme.colors.white100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    alignItems: 'center',
    flexDirection: 'row',
  },
  block: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    color: theme.colors.black,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSearch: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: theme.fontWeights[6],
  },
  iconGray: {
    color: theme.colors.gray,
  },
  paddingLeftButton: {
    paddingLeft: 20,
  },
});