import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants';

export const CheckboxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  indicator: {
    width: 20,
    aspectRatio: 1,
    borderWidth: 1,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 12,
    aspectRatio: 1
  },
  circleIndicator: {
    borderRadius: 10,
  },
  checkedIndicator: {
    backgroundColor: theme.colors.blue200,
  },
});
