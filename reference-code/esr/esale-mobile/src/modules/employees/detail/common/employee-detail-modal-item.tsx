import React from 'react';
import { View, Image, Text } from 'react-native';
import { OtherEmployeeModalStyles } from '../detail-style';
import { TEXT_EMPTY } from '../../../../config/constants/constants';

interface ItemModalProps {
  employeeId: number;
  employeeIcon: string;
  departmentName: string;
  positionName: string;
  employeeName: string;
}

/**
 * @param positionName
 * @param employeeName
 * @param employeeIcon
 * @param departmentName
 */
export const ItemModal: React.FC<ItemModalProps> = ({
  departmentName,
  employeeIcon,
  employeeName,
  positionName
}) => {
  return (
    <View style={OtherEmployeeModalStyles.otherEmployeeBlock}>
      {employeeIcon && employeeIcon !== '' ? (
        <Image
          source={{ uri: employeeIcon }}
          style={OtherEmployeeModalStyles.imageBlock}
        />
      ) : (
          <View style={OtherEmployeeModalStyles.wrapAvatar}>
            <Text style={OtherEmployeeModalStyles.avatar}>
              {employeeName ? employeeName.charAt(0) : TEXT_EMPTY}
            </Text>
          </View>
        )}
      <View style={OtherEmployeeModalStyles.inforBlock}>
        <Text style={OtherEmployeeModalStyles.textGray} numberOfLines={1}>
          {departmentName} {departmentName && positionName ? "–" : TEXT_EMPTY} {positionName}
        </Text>
        <Text style={OtherEmployeeModalStyles.textBlue} numberOfLines={1}>
          {employeeName}
        </Text>
      </View>
    </View>
  );
};
