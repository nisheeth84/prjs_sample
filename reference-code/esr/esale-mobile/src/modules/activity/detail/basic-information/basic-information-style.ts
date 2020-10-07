import { StyleSheet } from "react-native";
import { getHeight, normalize } from '../../common';

export const BasicInformationStyles = StyleSheet.create({
  colorBlue: {
    color: "#0F6DB5",
  },
  bold: {
    fontWeight: "bold",
  },
  textSmall: {
    color: "#666666",
    paddingVertical: normalize(2),
    fontSize: normalize(12),
  },
  contents: {
    paddingVertical: normalize(10),
    backgroundColor: "#EDEDED",
  },
  item: {
    flex: 1,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    marginBottom: normalize(1),
    backgroundColor: "#FFF",
    borderBottomWidth: normalize(1),
    borderBottomColor: "#E5E5E5",
    minHeight: getHeight( 60),
  },
  itemV2: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: normalize(14),
    paddingBottom: normalize(6),
  },
  table: {
    width: "50%",
    marginRight: normalize(1),
  },
  marginHorizontal6: {
    backgroundColor: "#EDEDED",
    marginHorizontal: normalize(16),
  },
  blueLine: {
    marginLeft: normalize(8),
    borderLeftWidth: 3,
    borderLeftColor: "#0F6DB5",
    paddingRight: normalize(5),
    marginVertical: normalize(2),
  },
  listTitle: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: normalize(10),
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    backgroundColor: "#FFF",
  },
  icon: {
    width: normalize(14),
    height: normalize(14),
    resizeMode: 'contain',
    marginRight: 2,
}
});
