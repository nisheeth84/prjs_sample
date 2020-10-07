import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ModalDeleteStyles } from '../drawer-left-style';
import { translate } from '../../../../config/i18n';
import { messages } from '../drawer-left-messages';

export interface ModalProps {
  onCloseModal: () => void;
  onAcceptDeleteGroup: () => void;
  disableDeleteButton: boolean;
  title: string;
}

/**
 * Drawer left modal delete
 * @function onCloseModal
 * @function onAcceptDeleteGroup
 * @param disableDeleteButton
 */
export const ModalDelete: React.FunctionComponent<ModalProps> = ({
  onCloseModal,
  onAcceptDeleteGroup,
  disableDeleteButton,
  title,
}) => {
  return (
    <View style={ModalDeleteStyles.container}>
      <Text style={ModalDeleteStyles.title}>
        {translate(messages.drawerDelete)}
      </Text>
      <Text style={ModalDeleteStyles.content}>{title}</Text>
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
          disabled={disableDeleteButton}
          onPress={onAcceptDeleteGroup}
          style={ModalDeleteStyles.buttonDelete}
        >
          <Text style={ModalDeleteStyles.buttonTextDelete}>
            {translate(messages.drawerDelete)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
