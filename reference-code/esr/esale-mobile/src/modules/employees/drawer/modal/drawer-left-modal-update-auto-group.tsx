import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ModalDeleteStyles } from '../drawer-left-style';
import { translate } from '../../../../config/i18n';
import { messages } from '../drawer-left-messages';
import { messagesComon } from '../../../../shared/utils/common-messages';

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
  onAcceptUpdateAutoGroup,
  disableUpdateButton,
  title,
}) => {
  return (
    <View style={ModalDeleteStyles.container}>
      <Text style={ModalDeleteStyles.title}>
        {translate(messages.drawerGoShareGroup)}
      </Text>
      <Text style={ModalDeleteStyles.content}>
        {translate(messagesComon.WAR_EMP_0004).replace("{0}", title)}
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
          disabled={disableUpdateButton}
          onPress={onAcceptUpdateAutoGroup}
          style={ModalDeleteStyles.buttonDelete}
        >
          <Text style={ModalDeleteStyles.buttonTextDelete}>
            {translate(messages.drawerChange)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
