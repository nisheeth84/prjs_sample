import { StyleSheet } from "react-native";
import {
  normalize,
} from '..';
const styles = StyleSheet.create({
  modalContainer: {
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: '#fff'
  },
  headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: normalize(25.5),
      borderBottomColor: '#E5E5E5',
      borderBottomWidth: 1,
      paddingBottom: normalize(16),
      paddingTop: normalize(20),
      fontWeight:'700'
  },
  buttonClose: {
      position: "absolute",
      top: normalize(4),
      bottom: 0,
      zIndex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: normalize(20),
      paddingRight: normalize(15),
  },
  closeIcon: {
      width: normalize(11),
      height: normalize(18)
  },
  textTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      color: '#3E3E3E',
  },
  modalContent: {
  }
});

export default styles;
