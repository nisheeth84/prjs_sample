import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';

import { theme } from "../../../config/constants";
import { CommonStyles } from "../../common-style";

interface ModalOption {
  visible: boolean;
  titleModal: string;
  contentModal: string;
  contentBtnFirst: string;
  contentBtnSecond?: string;
  txtCancel?: string;
  closeModal: () => void;
  onPressFirst: () => void;
  onPressSecond?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 52,
  },
  content: {
    width: "100%",
    height: 270,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: theme.space[4],
  },
  btnFunc: {
    height: 40,
    backgroundColor: "#0F6DB5",
    width: 250,
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: theme.space[2],
  },
  btnCancel: {
    height: 40,
    width: 250,
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: theme.space[2],
    alignItems: "center",
  },
  txtTitle: { textAlign: "center", paddingBottom: theme.space[3] },
  txtContentBtn: { textAlign: "center", color: "white" },
});

export function ModalOption({
  visible,
  titleModal,
  contentModal,
  contentBtnFirst,
  contentBtnSecond,
  txtCancel,
  closeModal,
  onPressFirst,
  onPressSecond,
  contentStyle = {},
}: ModalOption) {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        style={styles.container}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.content, contentStyle]}
        >
          <Text style={styles.txtTitle}>{titleModal}</Text>
          <Text style={styles.txtTitle}>{contentModal}</Text>
          <View style={CommonStyles.padding2} />
          <TouchableOpacity style={styles.btnFunc} onPress={onPressFirst}>
            <Text style={styles.txtContentBtn}>{contentBtnFirst}</Text>
          </TouchableOpacity>
          {contentBtnSecond && (
            <TouchableOpacity style={styles.btnFunc} onPress={onPressSecond}>
              <Text style={styles.txtContentBtn}>{contentBtnSecond}</Text>
            </TouchableOpacity>
          )}
          {!!txtCancel && (
            <TouchableOpacity style={styles.btnCancel} onPress={closeModal}>
              <Text>{txtCancel}</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
