import React, { useEffect, useState } from 'react'
import BaseModal from '../common/modal'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../screens/calendar-details/style';
import { translate } from '../../../config/i18n';
import { messages } from '../calendar-list-messages';
import { ControlType } from '../../../config/constants/enum';
interface  IModalTypeCreateSchedule {
    showBtnAdd: boolean,
    showModalAdd: boolean,
    onBackdropPress: (ishow: boolean) => void
}

/**
 * type create calendar 
 */
enum TYPE_CALENDAR_CREATE {
    SCHEDULE,
    TASK,
    MILESTONE
}

/**
 * modal show option to create
 * @param props 
 */
export const ModalTypeCreateSchedule = (props : IModalTypeCreateSchedule) => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false)

    useEffect(()=> {
        setShowModal(props.showModalAdd)
    }, [props.showModalAdd])

    /* 
    Go to Create Screen 
    */
    const goToCreateScreen = (type: number) => {
        setShowModal(false);
      // setShowBtnAdd(false);
      switch (type) {
        case TYPE_CALENDAR_CREATE.SCHEDULE:
          navigation.navigate("create-screen", {typeScreen: 0});
          break;
        case TYPE_CALENDAR_CREATE.TASK:
          navigation.navigate("register-task",{ type: ControlType.ADD });
          break;
        case TYPE_CALENDAR_CREATE.MILESTONE:
          navigation.navigate("register-milestone", { type: ControlType.ADD });
          break;
  
      }
      props.onBackdropPress(false)
    };
    
    return (
        <BaseModal
        isVisible={showModal}
        onBackdropPress={props.onBackdropPress}
      >
        <View style={styles.modal}>
          <View>
            <TouchableOpacity style={styles.text_modal_item} onPress={() => goToCreateScreen(TYPE_CALENDAR_CREATE.SCHEDULE)}>
              <Text style={[styles.modal_text, { textAlign: 'center', borderTopWidth: 0 }]}>
                {translate(messages.regisSchedule)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToCreateScreen(TYPE_CALENDAR_CREATE.TASK)}>
              <Text style={[styles.modal_text, { textAlign: 'center' }]}>
                {translate(messages.regisTask)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToCreateScreen(TYPE_CALENDAR_CREATE.MILESTONE)}>
              <Text style={[styles.modal_text, { textAlign: 'center' }]}>
                {translate(messages.regisMilestone)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseModal>
    )
}