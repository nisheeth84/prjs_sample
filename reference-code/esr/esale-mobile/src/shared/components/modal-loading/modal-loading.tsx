import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  isFetchingData: boolean;
  hasBackdrop?: boolean
}
export const ModalLoading: React.FC<Props> = (props) => {
  const { isFetchingData = false, hasBackdrop = true } = props;
  return (
    <Modal hasBackdrop={hasBackdrop} animationType="slide" transparent isVisible={isFetchingData}>
      <ActivityIndicator />
    </Modal>
  );
};
