/* eslint-disable react/jsx-curly-newline */
import React, { } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';
import { ItemModal } from './employee-detail-modal-item';
import { OtherEmployeeModalStyles } from '../detail-style';

interface EmployeeSubordinate {
  employeeId: number;
  employeeIcon: any;
  departmentName: string;
  positionName: string;
  employeeName: string;
}

interface Props {
  otherEmpolyee: Array<EmployeeSubordinate>;
  toggleModalOther: () => void;
}

interface Navigation {
  [navigation: string]: any;
}

/**
 * Component for task item for detail employee screen
 * @param otherEmpolyee
 * @function toggleModalOther
 */
export const OtherEmployeeModal: React.FC<Props> = ({
  otherEmpolyee,
  toggleModalOther,
}) => {


  const navigation: Navigation = useNavigation();

  const itemTouch = (
    employeeId: number,
    employeeName: string
  ) => {
    toggleModalOther();
    setTimeout(() => {
      navigation.push('detail-employee', {
        id: employeeId,
        title: `${employeeName}`,
      });
    }, 300);
  };
  return (
    <View style={OtherEmployeeModalStyles.modalBlock}>
      <Text style={OtherEmployeeModalStyles.textBLock}>
        {translate(messages.subordinate)}
      </Text>
      <FlatList
        data={otherEmpolyee}
        renderItem={({ item }: { item: EmployeeSubordinate }) => (
          <TouchableOpacity
            onPress={() =>
              itemTouch(
                item.employeeId,
                item.employeeName
              )
            }
          >
            <ItemModal
              employeeId={item.employeeId}
              employeeIcon={item?.employeeIcon?.file_url}
              departmentName={item?.departmentName}
              positionName={item?.positionName}
              employeeName={item?.employeeName}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item: EmployeeSubordinate) => item.employeeId.toString()}
      />
      <View style={OtherEmployeeModalStyles.buttonBlock}>
        <TouchableOpacity
          onPress={toggleModalOther}
          style={OtherEmployeeModalStyles.button}
        >
          <Text style={OtherEmployeeModalStyles.textButton}>
            {translate(messages.close)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
