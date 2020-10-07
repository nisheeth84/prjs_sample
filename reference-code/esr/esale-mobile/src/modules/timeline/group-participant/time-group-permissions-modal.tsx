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
import { messages } from "./timeline-group-participant-messages";
import { TimelineModalPermissionStyles } from "./timeline-group-participant-style";

interface ModalPermissions {
  /**
   * visible modal
   */
  visible: boolean;
  /**
   * toggle modal
   */
  closeModal: () => void;
  //   member
  member: () => void;
  //   owner
  owner: () => void;
}
const styles = TimelineModalPermissionStyles;

export function ModalPermissions({
  /**
   * visible modal
   */
  visible,
  /**
   * toggle modal
   */
  closeModal,
  member,
  owner,
}: ModalPermissions) {
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
        <TouchableOpacity style={styles.btn} onPress={() => member()}>
          <Text style={styles.text}>{translate(messages.member)}</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.btn} onPress={() => owner()}>
          <Text style={styles.text}>{translate(messages.owner)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
