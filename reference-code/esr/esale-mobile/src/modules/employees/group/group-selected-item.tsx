import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../../../shared/components/icon';
import { GroupSelectedItemStyles } from './group-style';

export interface GroupSelectedItem {
  title: string;
  content?: string;
  handleRemoveMember: (title: string) => void;
}

/**
 * Group selected item common component
 * @param title
 * @function handleRemoveMember
 */
export const GroupSelectedItem = ({
  title,
  handleRemoveMember,
}: GroupSelectedItem) => {
  /**
   * funtion hanlde action remove item
   */
  const handleRemoveItem = () => {
    handleRemoveMember(title);
  };

  return (
    <View style={GroupSelectedItemStyles.container}>
      <View style={GroupSelectedItemStyles.avatar}>
        <Text style={GroupSelectedItemStyles.nameAvatar}>社</Text>
        <View style={GroupSelectedItemStyles.removeIconWrapper}>
          <TouchableOpacity
            style={GroupSelectedItemStyles.buttonRemove}
            onPress={handleRemoveItem}
          >
            <Icon name="close" style={GroupSelectedItemStyles.removeIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={GroupSelectedItemStyles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};
