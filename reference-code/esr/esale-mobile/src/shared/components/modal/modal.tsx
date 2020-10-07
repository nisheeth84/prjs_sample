import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from "react-native";
import { styles } from "./modal-style";
import { translate } from "../../../config/i18n";
import { responseMessages } from "../../messages/response-messages";
import { messages } from "./modal-messages";
import { EnumPositionModal } from "../../../config/constants/enum";

interface ModalProps {
  onPress: () => void;
  onPressBack: () => void;
}

export function ModalDirtycheckButtonBack(
  {
    onPress = Object,
    onPressBack = Object
  }: ModalProps
) {
  return (
    <View style={styles.modalContainerContent} >
      <View style={styles.modalContentConfirm}>
        <View style={styles.modalContentConfirmDirtycheckTitle}>
          <Text style={styles.modalContentConfirmTitle}>{translate(messages.titleDirtycheckButtonBack)}</Text>
          <Text style={styles.modalContentConfirmMessage}>{translate(responseMessages.WAR_COM_0005)}</Text>
        </View>
        <View style={styles.modalContentConfirmCancelButton}>
          <View style={styles.modalContentConfirmViewTouchableOpacity}>
            <TouchableOpacity style={[styles.modalContentConfirmTouchableOpacityButtonBack,
            styles.modalContentConfirmCancelTouchableOpacityColor]}
              onPress={() => onPress()}>
              <Text>{translate(messages.buttonClose)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContentConfirmViewTouchableOpacity}>
            <TouchableHighlight style={[styles.modalContentConfirmTouchableOpacityButtonBack,
            styles.modalContentConfirmOKTouchableOpacityColor]}
              underlayColor='#1C4476'
              onPress={() => onPressBack()}>
              <Text style={styles.modalContentConfirmOKText}>{translate(messages.buttonOk)}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </View>
  );
}

export function ModalDirtycheck(
  {
    onPress = Object,
    onPressBack = Object
  }: ModalProps
) {
  return (
    <View style={styles.modalContainerContent} >
      <View style={styles.modalContentConfirm}>
        <View style={styles.modalContentConfirmDirtycheckTitle}>
          <Text style={styles.modalContentConfirmTitle}>{translate(messages.titleButtonBack)}</Text>
          <Text style={styles.modalContentConfirmMessage}>{translate(responseMessages.WAR_COM_0007)}</Text>
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


interface ModalCommonProps {
  visible: boolean;
  children: any;
  position: EnumPositionModal;
  closeModal?: () => void;
}
const stylesCommon = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    alignItems: "center",
    zIndex: 90,
    paddingHorizontal: 49,
  },
  positionTop: {
    justifyContent: "flex-start",
  },
  positionBottom: {
    justifyContent: "flex-end",
  },
  positionCenter: {
    justifyContent: "center",
  },
});
export function ModalCommon({
  visible,
  closeModal,
  children,
  position,
}: ModalCommonProps) {
  const checkPositionStyle = (position: EnumPositionModal) => {
    switch (position) {
      case EnumPositionModal.bottom:
        return stylesCommon.positionBottom;
      case EnumPositionModal.top:
        return stylesCommon.positionTop;
      default:
        return stylesCommon.positionCenter;
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      {position === EnumPositionModal.total ? (
        children
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={[stylesCommon.container, checkPositionStyle(position)]}
        >
          {children}
        </TouchableOpacity>
      )}
    </Modal>
  );
}

