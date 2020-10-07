import * as React from "react";
import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CommonStyles } from "../../../shared/common-style";
import { appImages, theme } from "../../../config/constants";

interface Props {
  onNavigate?: () => void;
}
const { height } = Dimensions.get("window");
export const AddButton: React.FC<Props> = (props) => {
  return <TouchableOpacity onPress={props.onNavigate} style={styles.addButton}>
     <Image
          style={CommonStyles.floatButtonImage}
          source={appImages.iconPlusGreen}
        />
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  addButton: {
    width: theme.floatingButton,
    aspectRatio: 1,
    borderRadius: theme.floatingButton / 2,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    right: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    bottom: height * 0.05
  }
});