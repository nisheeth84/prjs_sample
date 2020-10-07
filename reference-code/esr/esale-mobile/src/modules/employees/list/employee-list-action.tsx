import * as React from "react";
import { Text, TouchableOpacity, View, Linking } from "react-native";
import { EmployeeListItemStyles } from "./employee-list-style";
import { ShowActionEmployee } from "./employee-list-enum";
import { useNavigation } from '@react-navigation/native';
interface EmployeeButton {
  // name of CustomerDetail
  name: string;
  // index of CustomerDetail
  index: number;
  email?: string;
}

/**
 * Component for show case list of customer list item 
 * @param EmployeeButton
*/

export const EmployeeActionButton: React.FC<EmployeeButton> = ({
  name,
  index,
  email,
}) => {
  const navigation = useNavigation()
  /**
   * action handle ItemCustomer
   * @param indexItem item of CustomerDetailProps
  */
  const actionItemEmployee = (indexItem: number) => () => {
    switch (indexItem) {
      case ShowActionEmployee.HISTORY:
        navigation.navigate('history-log');
        break;
      case ShowActionEmployee.SCHEDULE:
        navigation.navigate('schedule');
        break;
      case ShowActionEmployee.TASK:
        navigation.navigate('task');
        break;
      case ShowActionEmployee.POST:
        navigation.navigate('post');
        break;
      case ShowActionEmployee.MAIL:
        Linking.openURL('mailto:' + email);
        break;
      default:
        break;
    }

  }

  return (
    <View>
      <TouchableOpacity style={index < 4 ? (EmployeeListItemStyles.inforEmployeeActionFist)
        : (EmployeeListItemStyles.inforEmployeeActionSecond)} onPress={actionItemEmployee(index)}>
        <Text style={EmployeeListItemStyles.inforEmployeeDetail}>{name}</Text>
      </TouchableOpacity>

    </View>

  );
}