import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../config/constants";

const swidth = Dimensions.get('window').width

export const ProductGeneralStyles = StyleSheet.create({

  inforProduct: {
    backgroundColor: theme.colors.white,
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },

  inforProductRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: theme.space[4],
    flex: 1
   
 
  },
  image: {
    width: swidth * 0.28,
    height: 3 / 5 * swidth * 0.28,
    resizeMode: "contain",
    borderRadius: 5
  },

  productName: {
    fontWeight: "bold",
    fontSize: theme.fontSizes[3],
    color: 'black',
  },

  blue200: {
    color: theme.colors.blue200
  },

  productCategory: {
    fontSize: theme.fontSizes[3],
    color: '#666666'
  },

  productPrice: {
    fontSize: theme.fontSizes[3],
    color: '#666666'
  },
  row: {
    flexDirection: "row",
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  prIconShare: {
    alignSelf: "flex-start"
  },
  topInfoIconShare: {
    height: 22,
    width: 22,
    justifyContent: "center",
    marginTop: 7,
    marginRight: 7,
  },
  topInfoIconShareActive: {
    height: 36,
    width: 36,
    justifyContent: "center",
  },
});

