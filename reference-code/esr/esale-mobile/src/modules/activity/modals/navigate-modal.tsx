import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BaseModal from '../../calendar/common/modal';
import { normalize, Style } from '../common';
import { messages } from './navigate-modal-messages';
import { translate } from "../../../config/i18n"
import { Icon } from '../../../shared/components/icon';
import { IconTargetReport } from '../constants';

interface Props {
  isVisible: boolean;
  setIsVisible: any;
  goToRegisterSchedule: () => void;
  goToRegisterTask: () => void;
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1
  },
  positionModal: {
    position: 'absolute',
    bottom: 0
  },
  textButton: {
    fontWeight: 'bold'
  },
  leftContent: {
    flex: 2,
    marginHorizontal: 10
  },
  centerContent: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const NavigationModal: React.FC<Props> = (props) => {
  return (
    <BaseModal
      isVisible={props.isVisible}
      onBackdropPress={() => props.setIsVisible(false)}
      styleContent={styles.positionModal}>
      <View style={Style.modal}>
        <TouchableOpacity
          style={[styles.button, {flexDirection: 'row', justifyContent: 'space-between'}]}
          onPress={props.goToRegisterSchedule}>
          <View style={styles.leftContent}><Icon name={IconTargetReport.ACTIVITY_CALENDAR}></Icon></View>
          <View style={styles.centerContent}><Text style={[styles.textButton]}>{translate(messages.labelBasicInfo)}</Text></View>
          <View style={{flex: 2}}></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {flexDirection: 'row', justifyContent: 'space-around'}]} onPress={props.goToRegisterTask}>
          <View style={styles.leftContent}><Icon name={IconTargetReport.ACTIVITY_TASK}></Icon></View>
          <View style={styles.centerContent}><Text style={[styles.textButton]}>{translate(messages.labelChangeHistories)}</Text></View>
          <View style={{flex: 2}}></View>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};
