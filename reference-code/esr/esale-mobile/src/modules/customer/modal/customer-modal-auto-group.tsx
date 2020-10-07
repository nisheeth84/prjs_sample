import React from 'react';
import { Text, View } from 'react-native';
import { ModalUpdateAutoStyles } from './customer-modal-style';
import { translate } from '../../../config/i18n';
import { messages } from './customer-modal-messages';
import { messagesComon } from '../../../shared/utils/common-messages';
import { CommonButton } from "../../../shared/components/button-input/button";
import { STATUSBUTTON, TypeButton } from "../../../config/constants/enum";
export interface ModalProps {
  onCloseModal: () => void;
  onAcceptUpdateAutoGroup: () => void;
  disableUpdateButton: boolean;
  title: string;
}

/**
 * Drawer left modal update auto group
 * @function onCloseModal
 * @function onAcceptUpdateAutoGroup
 * @param disableUpdateButton
 */
export const ModalConfirmUpdateAutoGroup: React.FunctionComponent<ModalProps> = ({
  onCloseModal,
  onAcceptUpdateAutoGroup = Object,
  disableUpdateButton,
  title,
}) => {
  return (
    <View style={ModalUpdateAutoStyles.container}>
      <Text style={ModalUpdateAutoStyles.title}>
        {translate(messages.updateListConfirm)}
      </Text>
      <Text style={ModalUpdateAutoStyles.content}>
        {translate(messagesComon.WAR_CUS_0002).replace("{0}", title)}
      </Text>
      <View style={ModalUpdateAutoStyles.wrapButton}>
        <CommonButton onPress={onCloseModal} status={disableUpdateButton ? STATUSBUTTON.DISABLE : STATUSBUTTON.ENABLE} textButton={translate(messages.updateListCancel)} typeButton={TypeButton.BUTTON_DIALOG_NO_SUCCESS}/>
        <CommonButton onPress={onAcceptUpdateAutoGroup} status={disableUpdateButton ? STATUSBUTTON.DISABLE : STATUSBUTTON.ENABLE} textButton={translate(messages.listChange)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS} />
      </View>
    </View>
  );
};
