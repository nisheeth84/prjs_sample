import React from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonStyles } from "../../../shared/common-style";
import { translate } from "../../../config/i18n";
import { messages } from "./timeline-page-group-messages";
import { TimelinePageGroupModalStyles } from "./timeline-page-group-style";

interface ModalPageGroup {
  /**
   * visible modal
   */
  visible: boolean;
  /**
   * toggle modal
   */
  closeModal: () => void;
  /**
   * content modal
   */
  content: string;
  /**
   * title modal
   */
  title: string;
  onPressConfirm?: () => void;
}
const styles = TimelinePageGroupModalStyles;

export function ModalPageGroup({
  /**
   * visible modal
   */
  visible,
  /**
   * toggle modal
   */
  closeModal,
  /**
   * content modal
   */
  content,
  /**
   * title modal
   */
  title,
  onPressConfirm,
}: ModalPageGroup) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={closeModal}
    >
      <TouchableHighlight onPress={closeModal} style={styles.modalItem}>
        <View style={CommonStyles.flex1} />
      </TouchableHighlight>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.viewContent}>
          <Text style={styles.textContent}>{content}</Text>
        </View>
        <View style={CommonStyles.row}>
          <TouchableOpacity style={styles.btnClose} onPress={closeModal}>
            <Text style={styles.txtClose}>{translate(messages.cancelBtn)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnConfirm} onPress={onPressConfirm}>
            <Text style={styles.txtConfirm}>{translate(messages.shunBtn)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
