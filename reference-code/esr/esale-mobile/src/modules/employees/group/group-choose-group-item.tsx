import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon';
import { GroupCommonStyles } from './group-style';
import { GroupType } from '../../../config/constants/enum';

export interface GroupChooseGroupItem {
  handleSelectItem: (groupId: number, position: number) => void;
  employeeName: string;
  groupName: string;
  groupId: number;
  groupType: number;
  checked: boolean;
  position: number;
}

/**
 * Choose group common component
 * @param groupType
 * @param groupName
 * @param groupId
 * @param checked
 * @param position
 * @function handleSelectItem
 */
export const GroupChooseGroupItem = ({
  handleSelectItem,
  groupName,
  employeeName,
  groupId,
  groupType,
  checked,
  position,
}: GroupChooseGroupItem) => {

  /**
   * function action select item
   */
  const selectItem = () => {
    handleSelectItem(groupId, position);
  };

  return (
    <View>
      <TouchableOpacity
        style={GroupCommonStyles.wrapGroupItem}
        onPress={selectItem} >
        <View>
          <Text style={GroupCommonStyles.wrapText}>{groupName}</Text>
          {groupType == GroupType.SHARE_GROUP && (
            <Text>{employeeName}</Text>)}
        </View>
        {checked ? <Icon name="checkedGroupItem" /> : <Icon name="uncheckedGroupItem" />}
      </TouchableOpacity>
    </View>
  );
};
