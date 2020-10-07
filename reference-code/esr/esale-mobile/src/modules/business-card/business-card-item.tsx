import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../shared/components/icon';
import { theme } from '../../config/constants';
import { messages } from './business-card-messages';
import { translate } from '../../config/i18n';
import { BusinessCardItemStyles } from './business-card-style';

interface BusinessCardProps {
  avatarUrl: any;
  name: string;
  role: string;
}

/**
 * Component for show bussines card item
 * @param avatarUrl
 * @param name
 * @param role
 */
export const BusinessCardItem: React.FC<BusinessCardProps> = ({
  avatarUrl,
  name,
  role,
}) => {
  const [longPress, setLongPress] = useState(false);

  /**
   * function handle long click
   */
  const handleLongClick = () => {
    setLongPress(!longPress);
  };

  /**
   * Tracking long press
   */
  const styleLongPress = longPress
    ? { backgroundColor: theme.colors.yellowSkin }
    : false;

  return (
    <TouchableOpacity
      style={[BusinessCardItemStyles.inforEmployee, styleLongPress]}
      onLongPress={handleLongClick}
    >
      <View style={BusinessCardItemStyles.mainInforBlock}>
        <Image source={avatarUrl} style={BusinessCardItemStyles.avatar} />
        <View style={BusinessCardItemStyles.name}>
          <Text style={{ color: theme.colors.gray1 }}>{name}</Text>
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
    </TouchableOpacity>
  );
};
