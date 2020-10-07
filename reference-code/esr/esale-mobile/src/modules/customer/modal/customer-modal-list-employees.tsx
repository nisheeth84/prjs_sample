import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomerModalListEmployeesStyles } from "./customer-modal-style";
import { CommonStyles } from "../../../shared/common-style";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-modal-messages";

const styles = CustomerModalListEmployeesStyles;

interface CustomerModalListEmployeesInterface {
  data: Array<any>;
  visible: boolean;
  onClose: () => void;
}

export const CustomerModalListEmployees = ({
  data = [],
  visible = false,
  onClose = () => {},
}: CustomerModalListEmployeesInterface) => {
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
              const { employeeName, employeePosition, photoEmployeeImg } = item;
              return (
                <View style={styles.viewItem}>
                  <Image
                    source={{
                      uri:
                        photoEmployeeImg ||
                        "https://cdn1.iconfinder.com/data/icons/office-and-internet-3/49/248-512.png",
                    }}
                    style={styles.img}
                  />
                  <View>
                    <Text style={styles.txt}>{employeeName}</Text>
                    <Text style={styles.txtPosition}>{employeePosition}</Text>
                  </View>
                </View>
              );
            }}
          />
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.btn} onPress={() => onClose()}>
              <Text style={styles.txt}>{translate(messages.close)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
