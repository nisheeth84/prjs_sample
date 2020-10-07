import React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { styles } from "./modal-style"
import { translate } from "../../../config/i18n"
import { messages } from "./modal-messages"
interface ModalProps {
  onPress: () => void
  onPressBack: () => void
}

export function ModalDirtyCheck(
  {
    onPress = Object,
    onPressBack = Object
  }: ModalProps
) {
  return (
    <View style={styles.modalContainerContent} >
      <View style={styles.modalContentConfirm}>
        <View style={styles.modalContentConfirmDirtyCheckTitle}>
          <Text style={styles.modalContentConfirmTitle}>{translate(messages.titleButtonBack)}</Text>
          <Text style={styles.modalContentConfirmMessage}>{translate(messages.WAR_COM_0007)}</Text>
        </View>

        <View style={styles.modalContentConfirmViewTouchableOpacity}>
          <TouchableOpacity style={[styles.modalContentConfirmTouchableOpacity,
          styles.modalContentConfirmOKTouchableOpacityColor]} onPress={() => onPress()}>
            <Text style={styles.modalContentConfirmOKText}>{translate(messages.buttonStayOnThisPage)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContentConfirmViewTouchableOpacity}>
          <TouchableOpacity style={[styles.modalContentConfirmTouchableOpacity,
          styles.modalContentConfirmOKTouchableOpacityColor]} onPress={() => onPressBack()}>
            <Text style={styles.modalContentConfirmOKText}>{translate(messages.buttonLeaveThisPage)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}