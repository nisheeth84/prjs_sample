import { StyleSheet } from "react-native";

//const heights = Dimensions.get('window').height 
export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  styleWarning: {
    backgroundColor: "#fff1da"
  },
  styleSuccess: {
    backgroundColor: "#d8f2e5"
  },
  styleError: {
    backgroundColor: "#fed3d3",
    marginTop: 5,
  },
  styleDefault: {
    backgroundColor: "#d6e3f3"
  },
  viewIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  viewText: {
    justifyContent: "center",
    marginLeft: 9,
    marginRight: 2,
    flex: 10,
    fontSize: 14
  },
  viewButton: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    // width: 0.28*widths,
    // height: 0.04*heights,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15
  },
  txtButton: {
    margin: 5,
    fontSize: 12
  },
  txtFonsize: {
    fontSize: 14
  }
});

export const FilterMessageStyle = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  imageView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  icon: {
    height: '50%',
    width: '50%'
  },
  viewContent: {
    paddingTop: 10,
  },
  filterMessageFont: {
    fontSize: 16,
    fontWeight: 'bold',
  }
})