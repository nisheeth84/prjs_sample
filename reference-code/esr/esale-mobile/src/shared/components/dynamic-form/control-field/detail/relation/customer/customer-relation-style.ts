import { StyleSheet, Dimensions } from "react-native";

export const CustomerListStyles = StyleSheet.create({
  inforBlock: {
    backgroundColor: "#FFFFFF",
    // paddingHorizontal: 17,
    // paddingVertical: 21,
    // marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  listCard: {
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
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
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  }

});

export const CustomerListItemStyles = StyleSheet.create({
  inforCustomer: {
    backgroundColor: "#FFFFFF",
    // height: 100,
    width: Dimensions.get('window').width,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical:15
  },
  customerItem: {
    marginHorizontal: 10,
  },
  name: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold",
  },
  role: {
    fontSize: 12,
    color: "#666666",
  },
  address: {
    fontSize: 12,
    color: "#666666",
  },
  mainInforBlock: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 20,
    flex:0.95
  },
  iconArrowRight: {
    width: 8,
    height: 12,
    justifyContent: "center",
  },
  btnArrowRight: {
    // height: 100, 
    width:30, 
    justifyContent: "center", 
    alignItems: "center", 
    marginLeft:-27,
  },

});
