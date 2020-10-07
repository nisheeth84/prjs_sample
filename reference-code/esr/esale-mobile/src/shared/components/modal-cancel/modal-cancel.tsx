import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../config/constants";

interface ModalCancel {
  visible: boolean;
  closeModal: () => void;
  titleModal: string;
  contentModal: any;
  textBtnLeft: string;
  textBtnRight: string;
  onPress: () => void;
  btnBlue?: boolean;
  containerStyle?: any;
  textStyle?: any;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 90,
    paddingHorizontal: 49,
  },
  content: {
    width: "100%",
    height: 182,
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
    zIndex: 99,
    // paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: theme.space[4],
  },
  containerBtn: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "flex-end",
    flex: 1,
  },
  btnLeft: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: theme.space[3],
    justifyContent: "center",
    margin: theme.space[2],
    alignItems: "center",
  },
  btnRight: {
    height: 40,
    flex: 1,
    margin: theme.space[2],
    backgroundColor: theme.colors.red,
    borderRadius: theme.space[3],
    justifyContent: "center",
    alignItems: "center",
  },
  themeBlue: {
    backgroundColor: theme.colors.blue200,
  },
  txtTitle: {
    paddingBottom: theme.space[2],
    fontSize: theme.fontSizes[3],
  },
  txtContent: {
    textAlign: "center",
    paddingBottom: theme.space[2],
    paddingHorizontal: theme.space[2],
  },
  txtRight: {
    color: theme.colors.white,
    fontSize: theme.fontSizes[1],
    fontWeight: "bold",
  },
});
export function ModalCancel({
  visible,
  closeModal,
  titleModal,
  contentModal,
  textBtnLeft,
  textBtnRight,
  onPress,
  btnBlue,
  containerStyle,
  textStyle,
}: ModalCancel) {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        style={styles.container}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.content, containerStyle]}
        >
          <Text style={styles.txtTitle}>{titleModal}</Text>
          <Text style={[styles.txtContent, textStyle]}>{contentModal}</Text>
          <View style={styles.containerBtn}>
            <TouchableOpacity onPress={closeModal} style={styles.btnLeft}>
              <Text
                style={{
                  fontSize: theme.fontSizes[1],
                }}
              >
                {textBtnLeft}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPress}
              style={[styles.btnRight, btnBlue && styles.themeBlue]}
            >
              <Text style={styles.txtRight}>{textBtnRight}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
