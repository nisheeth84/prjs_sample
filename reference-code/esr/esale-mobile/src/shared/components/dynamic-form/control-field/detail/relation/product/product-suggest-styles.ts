import { StyleSheet } from "react-native";

/**
 * Styles of components in folder product
 */
const ProductListStyles = StyleSheet.create({
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },
  inforProduct: {
    backgroundColor: "#FFFFFF",
    marginBottom: 2,
    paddingVertical: 15,
    paddingLeft:12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E5E5',
    borderBottomWidth: 1
  },
  name: {
    paddingHorizontal:15,
    flex:0.9
  },
  avatar: {
    width: 104,
    height: 60,
    resizeMode: 'contain',
  },
  productCategoryName: {
    color: '#666666',
    fontSize:12,
    marginTop:4
  },
  productName: {
    color: '#333333',
    fontSize:14,
    marginTop:4,
    fontWeight:"bold"
  },
  productPrice: {
    fontSize:12,
    marginVertical:4,
    color: '#666666',
  },
  mainInforBlock: {
    flexDirection: 'row',
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeeContainer: {
    flexDirection: 'row'
  },
  link: {
    color: '#0F6DB5',
  },
  employeeText: {
    color: '#0F6DB5'
  },
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  }
});
export default ProductListStyles;