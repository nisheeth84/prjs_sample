import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ModalDeleteStyles } from '../drawer-left-style';
import { translate } from '../../../../config/i18n';
import { messages } from '../drawer-left-messages';

export interface ModalProps {
  onCloseModal: () => void;
  onAccept: () => void;
  disableButton: boolean;
}

/**
 * Drawer left modal delete
 * @function onCloseModal
 * @function onAcceptDeleteGroup
 * @param disableDeleteButton
 */
export const ModalMoveToGroupShare: React.FunctionComponent<ModalProps> = ({
  onCloseModal,
  onAccept,
  disableButton,
}) => {
  return (
    <View style={ModalDeleteStyles.container}>
      <Text style={ModalDeleteStyles.title}>
        {translate(messages.drawerMoveShareGroupLine1)}
      </Text>
      <Text style={ModalDeleteStyles.title}>
        {translate(messages.drawerMoveShareGroupLine2)}
      </Text>
      <View style={ModalDeleteStyles.wrapButton}>
        <TouchableOpacity
          onPress={onCloseModal}
          style={ModalDeleteStyles.buttonCancel}
        >
          <Text style={ModalDeleteStyles.buttonTextCancel}>
            {translate(messages.drawerDeleteCancel)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={disableButton}
          onPress={onAccept}
          style={ModalDeleteStyles.buttonDelete}
        >
          <Text style={ModalDeleteStyles.buttonTextDelete}>
            {translate(messages.drawerGoShareGroup)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
