import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomerModalListEmployeesStyles } from "../../../modal/customer-modal-style";
import { CommonStyles } from "../../../../../shared/common-style";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";


const styles = CustomerModalListEmployeesStyles;

interface EmployeesListModalInterface {
  data: Array<any>;
  visible: boolean;
  onClose: () => void;
}

export const EmployeesListModal = ({
  data = [],
  visible = false,
  onClose = () => {},
}: EmployeesListModalInterface) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.viewContent}>
          <View style={CommonStyles.padding4} />
          <FlatList
            data={data}
            style={styles.flatList}
            keyExtractor={(item: any) => item.employeeId.toString()}
            renderItem={({ item }) => {
              const { employeeName, employeePosition, fileUrl } = item;
              return (
                <View style={styles.viewItem}>
                  {fileUrl ? <Image source={{
                      uri:
                      fileUrl
                    }}
                    style={styles.img}
                  />
                : <View style={[CustomerDetailScreenStyles.imageEmployee, CustomerDetailScreenStyles.backgroundAvatar]}>
                    <Text style={CustomerDetailScreenStyles.imageName}>{employeeName.charAt(0)}</Text>
                  </View>}
                  
                  <View>
                    {employeePosition && <Text style={styles.txt}>{employeePosition}</Text>}
                    <Text style={[CustomerDetailScreenStyles.textLink]} numberOfLines={1}>{employeeName}</Text>
                    
                  </View>
                </View>
              );
            }}
          />
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.btn} onPress={() => onClose()}>
              <Text style={styles.txt}>{translate(messages.closeListEmployee)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
