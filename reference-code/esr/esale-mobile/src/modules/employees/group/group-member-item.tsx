import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../../../shared/components/icon';
import { GroupMemberItemStyles } from './group-style';
import { Employee, EmployeeDepartment } from './group-add-list-member';
import { EmployeeListItemStyles } from '../list/employee-list-style';

export interface EmployeeIcon {
  fileName: string;
  filePath: string;
}
export interface GroupMemberItem {
  employeeId: number;
  employeeName: string;
  employeeNameKana: string;
  employeeSurname: string;
  employeeSurnameKana: string;
  employeeIcon: EmployeeIcon;
  employeeDepartments: Array<EmployeeDepartment>;
  handleAddMember: (item: Employee, checked: boolean) => void;
  check: boolean;
}

/**
 * Group member item common component
 * @param employeeId
 * @param employeeName
 * @param employeeNameKana
 * @param employeeSurname
 * @param employeeSurnameKana
 * @function handleAddMember
 * @param photoFileName
 * @param photoFilePath
 * @param check
 */
export const GroupMemberItem = ({
  employeeId,
  employeeName,
  employeeNameKana,
  handleAddMember,
  employeeSurname,
  employeeSurnameKana,
  employeeIcon,
  employeeDepartments,
  check,
}: GroupMemberItem) => {
  /**
   * function handle action select item
   */
  const handleSelectItem = () => {
    const data = {
      employeeId,
      employeeName,
      employeeNameKana,
      employeeSurname,
      employeeSurnameKana,
      employeeIcon,
      employeeDepartments,
      check,
    };
    handleAddMember(data, !check);
  };

  return (
    <TouchableOpacity
      style={GroupMemberItemStyles.container}
      onPress={handleSelectItem}
    >
      <View style={GroupMemberItemStyles.elementLeft}>
        <View style={GroupMemberItemStyles.avatar}>
          <Text style={GroupMemberItemStyles.nameAvatar}>社</Text>
        </View>
        <View style={GroupMemberItemStyles.contentWrapper}>
          <View style={EmployeeListItemStyles.row}>
            {employeeDepartments.map(
              (ed: EmployeeDepartment, index: number) => {
                return (
                  <View
                    style={EmployeeListItemStyles.row}
                    key={index.toString()}
                  >
                    <Text style={GroupMemberItemStyles.titleText}>
                      {ed.departmentName}
                    </Text>
                    {index < employeeDepartments.length - 1 && <Text>,</Text>}
                  </View>
                );
              }
            )}
          </View>
          <View style={EmployeeListItemStyles.row}>
            <Text style={GroupMemberItemStyles.contentText}>
              {employeeName} {employeeSurname}{' '}
            </Text>
            <View style={EmployeeListItemStyles.row}>
              {employeeDepartments.map(
                (ed: EmployeeDepartment, index: number) => {
                  return (
                    <View
                      style={EmployeeListItemStyles.row}
                      key={index.toString()}
                    >
                      <Text style={GroupMemberItemStyles.contentText}>
                        {ed.positionName}
                      </Text>
                      {index < employeeDepartments.length - 1 && <Text>,</Text>}
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={GroupMemberItemStyles.elementRight}>
        {check ? (
          <Icon
            name="checkedGroupItem"
            style={GroupMemberItemStyles.checkIcon}
          />
        ) : (
          <View style={GroupMemberItemStyles.radio} />
        )}
      </View>
    </TouchableOpacity>
  );
};
