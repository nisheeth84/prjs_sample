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
import { TimelineModalParticipantStyles } from "./timeline-group-participant-style";

interface ModalParticipant {
  // visible modal
  visible: boolean;
  // toggle modal
  closeModal: () => void;
  // content modal
  content: string;
  // check is show two button
  errBtn: boolean;
  // press confirm change authority
  pressConfirmChange?: () => void;
}
const styles = TimelineModalParticipantStyles;

export function ModalParticipant({
  visible,
  closeModal,
  content,
  errBtn,
  pressConfirmChange = () => { }
}: ModalParticipant) {
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
        <View style={styles.viewContent}>
          <Text style={styles.textContent}>{content}</Text>
        </View>
        {errBtn ? (
          <View style={CommonStyles.row}>
            <TouchableOpacity style={styles.btnClose} onPress={() => { closeModal() }}>
              <Text style={styles.txtClose}>
                {translate(messages.btnCancel)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={() => { pressConfirmChange() }}>
              <Text style={styles.txtConfirm}>
                {translate(messages.btnDelete)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
            <View style={styles.viewErr}>
              <TouchableOpacity style={styles.btnOK} onPress={() => { closeModal() }}>
                <Text style={styles.txtConfirm}>
                  {translate(messages.ok)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    </Modal>
  );
}