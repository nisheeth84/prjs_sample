import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmployeeListItemStyles } from './employee-list-style';
import { Icon } from '../../../../../icon';
import { EmployeeItemProps } from './employees-types';

/**
 * Component for each employee
 * @params employeeId
 * @params avatarUrl
 * @params dataDisplay
 */
export const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employeeId,
  employeeName,
  avatarUrl,
  dataDisplay,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={EmployeeListItemStyles.inforEmployee}
      onPress={() => {
        navigation.navigate('detail-employee', { id: employeeId, title: employeeName});
      }}
    >
      <View style={EmployeeListItemStyles.cellWrapper}>
        <Image
          style={EmployeeListItemStyles.avatar}
          source={{
            uri:
              avatarUrl !== '' && avatarUrl !== null
                ? avatarUrl
                : 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
        <View style={EmployeeListItemStyles.name}>
          {dataDisplay.employeeDepartments.length !== 0 &&
            dataDisplay.employeeDepartments.map((item: any, index: number) => {
              return (
                <View style={EmployeeListItemStyles.row} key={index.toString()}>
                  <Text style={EmployeeListItemStyles.title}>
                    {item.departmentName ? item.departmentName : ''}
                  </Text>
                  {index < dataDisplay.employeeDepartments.length - 1 && (
                    <Text>,</Text>
                  )}
                </View>
              );
            })}
          <View style={EmployeeListItemStyles.row}>
            <Text>{`${dataDisplay.employeeSurname} ${dataDisplay.employeeName} `}</Text>
            {dataDisplay.employeeDepartments.map((item: any, index: number) => {
              return (
                <View style={EmployeeListItemStyles.row} key={index.toString()}>
                  <Text>{item.positionName ? item.positionName : ''}</Text>
                  {index < dataDisplay.employeeDepartments.length - 1 && (
                    <Text>,</Text>
                  )}
                </View>
              );
            })}
          </View>
          <View />
        </View>
      </View>
      <View style={EmployeeListItemStyles.iconArrowRight}>
        <Icon name="arrowRight" />
      </View>
    </TouchableOpacity>
  );
};
