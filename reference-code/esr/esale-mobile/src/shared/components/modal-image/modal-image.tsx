import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../common-style";
import { Ionicons as Icon } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";

interface ModalImageProps {
  visible: boolean;
  imageUrl: string;
  closeModal: () => void;
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black100,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "98%",
    height,
  },
  btn: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    right: theme.space[4],
  },
  icon: {
    color: theme.colors.white,
  },
});

export const ModalImage = ({
  imageUrl = "",
  visible = false,
  closeModal = () => {},
}: ModalImageProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        <TouchableOpacity
          hitSlop={CommonStyles.hitSlop}
          style={styles.btn}
          onPress={closeModal}
        >
          <Icon name="ios-close" style={styles.icon} size={60} />
        </TouchableOpacity>
        <ImageViewer
          renderIndicator={() => <></>}
          style={styles.image}
          imageUrls={[
            {
              url: imageUrl,
              props: {
                source: !imageUrl && require("../../../../assets/no_image.png"),
              },
            },
          ]}
        />
      </View>
    </Modal>
  );
};
