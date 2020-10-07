import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from '../../../../shared/components/icon';
import { theme } from '../../../../config/constants';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';
import { BusinessCardItemStyles } from '../detail-style';

interface BusinessCardProps {
  avatarUrl: any;
  name: string;
  role: string;
}
/**
 * Component for show list bussines card item for detail screen
 * @param role
 * @param name
 * @param avatarUrl
 */
export const BusinessCardItem: React.FC<BusinessCardProps> = ({
  avatarUrl,
  name,
  role,
}) => {
  const [longPress, setLongPress] = useState(false);

  /**
   * Handle on user event long press touch
   */
  const handlerLongClick = () => {
    setLongPress(!longPress);
  };

  /**
   * Tracking long press
   */
  const styleLongPress = longPress
    ? { backgroundColor: theme.colors.yellowSkin }
    : false;

  const [openModal, setOpenModal] = useState(false);

  /**
   * Catch open/close infor modal
   */
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <View>
      <View style={[BusinessCardItemStyles.inforEmployee, styleLongPress]}>
        <View style={BusinessCardItemStyles.mainInforBlock}>
          <TouchableOpacity onPress={() => toggleModal()}>
            <Image source={avatarUrl} />
          </TouchableOpacity>
          <View style={BusinessCardItemStyles.name}>
            <TouchableOpacity onPress={() => {}} onLongPress={handlerLongClick}>
              <Text style={{ color: theme.colors.gray1 }}>{name}</Text>
            </TouchableOpacity>
            <Text>{role}</Text>
            {longPress && (
              <TouchableOpacity style={BusinessCardItemStyles.longPress}>
                <Text style={BusinessCardItemStyles.longPressText}>
                  {translate(messages.waitingForUpdate)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity style={BusinessCardItemStyles.iconArrowRight}>
          <Icon name="arrowRight" />
        </TouchableOpacity>
      </View>
      <View>
        <Modal
          isVisible={openModal}
          onBackdropPress={toggleModal}
          style={{ justifyContent: 'center', marginHorizontal: 10 }}
        >
          <View style={BusinessCardItemStyles.modalImageBlock}>
            <Image style={{ width: 300, height: 200 }} source={avatarUrl} />
          </View>
        </Modal>
      </View>
    </View>
  );
};
