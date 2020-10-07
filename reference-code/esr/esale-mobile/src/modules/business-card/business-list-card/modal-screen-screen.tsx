import React from "react";
import { Modal, Text, TouchableOpacity } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { translate } from "../../../config/i18n";
import { UploadImageModal } from "./business-card-style";
import { messages } from "./business-card-messages";

interface ModalImagePicker {
  /**
   * check show modal
   */
  visible: boolean;
  /**
   * close model
   */
  closeModal?: () => void;

  openCamera?: () => void;
  openAlbum?: () => void;
  onPress?: () => void;
  registerBusinessCard?: () => void;
}

/**
 * Component show image picker
 */
export function ModalImagePicker({
  visible,
  closeModal,
  openCamera,
  openAlbum,
  registerBusinessCard,
}: ModalImagePicker) {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        style={UploadImageModal.container}
      >
        <TouchableOpacity activeOpacity={1} style={UploadImageModal.content}>
          <Text style={UploadImageModal.txtTitle}>
            {translate(messages.registration)}
          </Text>
          <TouchableOpacity
            style={UploadImageModal.containerBtn}
            onPress={openCamera}
          >
            <Icon
              style={UploadImageModal.iconStyle}
              name="cameraCirclerBlue"
              resizeMode="contain"
            />
            <Text style={UploadImageModal.txtStyle}>
              {translate(messages.addFromCamera)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={UploadImageModal.containerBtn}
            onPress={openAlbum}
          >
            <Icon
              style={UploadImageModal.iconStyle}
              name="album"
              resizeMode="contain"
            />
            <Text style={UploadImageModal.txtStyle}>
              {translate(messages.addFromAlbum)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={UploadImageModal.containerBtn}
            onPress={registerBusinessCard}
          >
            <Icon
              style={UploadImageModal.iconStyle}
              name="editBlue"
              resizeMode="contain"
            />
            <Text style={UploadImageModal.txtStyle}>
              {translate(messages.addManually)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeModal}
            style={UploadImageModal.btnBorderBlue}
          >
            <Text style={UploadImageModal.txtBlue}>
              {translate(messages.close)}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
