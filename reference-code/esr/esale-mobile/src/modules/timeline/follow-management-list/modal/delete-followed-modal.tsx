import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { messages } from "../follow-management-messages";
import { translate } from "../../../../config/i18n";
import { CommonModalStyles } from "../../../../shared/common-style";

export interface ModalProps {
  onCloseModal: Function;
  onClickDelete: Function;
}

export const DeleteFollowedModal: React.FunctionComponent<ModalProps> = ({
  onCloseModal = () => { },
  onClickDelete = () => { }
}) => {
  return (
    <View style={CommonModalStyles.mainModalContainer}>
      <View style={CommonModalStyles.container} >
        <Text style={CommonModalStyles.title18Left}>{translate(messages.deleteFollow)}</Text>
        <Text style={[CommonModalStyles.content18, CommonModalStyles.modalTitlePadding5]}>{translate(messages.deleteFollowTitle)}</Text>
        <View style={CommonModalStyles.wrapButton}>
          <TouchableOpacity
            onPress={() => { onCloseModal(); }}
            style={[CommonModalStyles.buttonCancel2]}>
            <Text style={CommonModalStyles.buttonTextCancel}>{translate(messages.cancel)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={CommonModalStyles.buttonDelete}
            onPress={() => { onClickDelete() }}>
            <Text style={CommonModalStyles.buttonTextDelete}>{translate(messages.delete)}</Text>
          </TouchableOpacity>
        </View >
      </View >
    </View >
  );
};
