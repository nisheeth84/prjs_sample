import React from 'react';
import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Icon } from '../../../shared/components/icon';
import { EmployeeListItemStyles } from './employee-list-style';
import { EmployeeActionButton } from './employee-list-action';
import { ShowActionEmployee } from './employee-list-enum';
import { messages } from './employee-list-messages';
import { translate } from "../../../config/i18n";

interface EmployeeItem {
  title: string;
  type: string;
}
interface EmployeeItemProps {
  employeeId: number;
  avatarUrl: any;
  dataDisplay: any;
  editMode?: boolean;
  selected?: boolean;
  onItemClick: (employeeId: number) => void;
}

const getPathTreeName = (str: string) => {
  const trimStr = str.replace(/\\|"|{|}/g, '');
  const oStr = trimStr.lastIndexOf(',');
  const str1 = trimStr.substr(0, oStr);
  const str2 = trimStr.substr(oStr + 1, trimStr.length);
  if (!str1) {
    return str2.trim();
  }
  return str2.trim() + ' (' + str1.replace(/,/g, ' - ') + ')';
}
/**
 * Component for each employee
 * @params employeeId
 * @params avatarUrl
 * @params dataDisplay
 * @params editMode
 * @params selected
 * @function onItemClick
 */
export const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employeeId,
  avatarUrl,
  dataDisplay,
  editMode,
  selected,
  onItemClick,
}) => {
  const ListAction = {
    data: [
      { id: ShowActionEmployee.HISTORY, name: translate(messages.employeesActionHistory) },
      { id: ShowActionEmployee.SCHEDULE, name: translate(messages.employeesActionSchedule) },
      { id: ShowActionEmployee.TASK, name: translate(messages.employeesActionTask) },
      { id: ShowActionEmployee.POST, name: translate(messages.employeesActionPost) },
      { id: ShowActionEmployee.MAIL, name: translate(messages.employeesActionMail) }
    ]
  }

  const {
    employeeDepartments,
    employeeSurname,
    employeeName,
  } = dataDisplay.employee;

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
      <TouchableOpacity
        style={EmployeeListItemStyles.inforEmployee}
        onPress={() => onItemClick(employeeId)}
      >
        <View style={EmployeeListItemStyles.cellWrapper}>

          {avatarUrl && avatarUrl !== "" ? (
            <Image
              source={{ uri: avatarUrl }}
              style={EmployeeListItemStyles.avatar}
            />
          ) : (
              <View style={EmployeeListItemStyles.wrapAvatar}>
                <Text style={EmployeeListItemStyles.bossAvatarText}>
                  {employeeSurname ? employeeSurname.charAt(0) : (employeeName ? employeeName.charAt(0) : "")}
                </Text>
              </View>
            )
          }
          <View style={EmployeeListItemStyles.name}>
            <View>
              <Text style={EmployeeListItemStyles.title} numberOfLines={1}>
                {employeeDepartments[0]?.pathTreeName ? getPathTreeName(employeeDepartments[0]?.pathTreeName) : ""}
              </Text>
            </View>

            <View style={EmployeeListItemStyles.row}>
              <Text numberOfLines={1}>{employeeSurname || ""} {employeeName || ""} {employeeDepartments[0]?.positionName || ""}</Text>
            </View>
            <View />
          </View>
        </View>
        {editMode ? (
          <View style={EmployeeListItemStyles.iconArrowRight}>
            {selected ? (
              <Icon
                name="checkedGroupItem"
                style={EmployeeListItemStyles.checkedIcon}
              />
            ) : (
                <View style={EmployeeListItemStyles.radio} />
              )}
          </View>
        ) : (
            <View style={EmployeeListItemStyles.iconArrowRight}>
              <Icon name="arrowRight" />
            </View>
          )}
      </TouchableOpacity>
      {ListAction.data.map((item, index: number) => {
        return (
          <EmployeeActionButton
            key={index}
            name={item.name}
            index={item.id}
            email={dataDisplay.employee.email}
          />
        );
      })}
    </ScrollView>
  );
};
