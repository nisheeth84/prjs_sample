import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert as ShowError,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomerModalStyles } from "./customer-modal-style";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-modal-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { getMasterScenariosSelector } from "../customer-selector";
import {
  GetMasterScenariosDataDataResponse,
  getMasterScenarios,
} from "../customer-repository";
import { CustomerActions } from "../customer-reducer";
import { Icon } from "../../../shared/components/icon";

const styles = CustomerModalStyles;

/**
 * interface for CustomerModalScenario component
 */
interface CustomerModalScenarioProps {
  // check show modal or not
  visible: boolean;
  // handle press confirm
  onConfirm: (item: GetMasterScenariosDataDataResponse) => void;
}

export const CustomerModalScenario = ({
  visible = false,
  onConfirm = () => {},
}: CustomerModalScenarioProps) => {
  const dispatch = useDispatch();

  const [itemSelected, setItemSelected] = useState<
    GetMasterScenariosDataDataResponse
  >({ scenarioId: 0, scenarioName: "" });

  const data = useSelector(getMasterScenariosSelector);

  /**
   * call api to get master scenarios
   */
  const getMasterScenariosFunc = async () => {
    const response = await getMasterScenarios({});
    console.log("getMasterScenarios", getMasterScenarios);
    
    if (response) {
      if(response.status === 200){
        dispatch(CustomerActions.getMasterScenarios(response.data));
      } else {
        ShowError.alert("Error", "Retry!");
      }
    }
  };

  useEffect(() => {
    getMasterScenariosFunc();
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          hitSlop={CommonStyles.hitSlop}
          onPress={() => onConfirm({ scenarioId: 0, scenarioName: "" })}
        >
          <View style={styles.viewTop}>
            <View style={styles.view} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.viewContent}>
          <View style={styles.viewInput}>
            <TextInput
              style={styles.txtInput}
              placeholder={translate(messages.close)}
              onChangeText={() => {}}
            />
            <TouchableOpacity
              style={styles.viewClose}
              hitSlop={CommonStyles.hitSlop}
              onPress={() => {}}
            >
              <Ionicons
                name="ios-close"
                color={theme.colors.white200}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <FlatList
            data={data}
            keyExtractor={(item: GetMasterScenariosDataDataResponse) => {
              return item.scenarioId.toString();
            }}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.btnItem}
                  onPress={() => setItemSelected(item)}
                >
                  <Text style={styles.txt}>{item.scenarioName}</Text>
                  {itemSelected.scenarioId === item.scenarioId ? (
                    <Icon name="checkActive" style={styles.icon} />
                  ) : (
                    <View style={styles.icon} />
                  )}
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() => {
              return <View style={styles.padding} />;
            }}
          />
        </View>
      </SafeAreaView>
      <View style={styles.viewBtn}>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => {
            onConfirm(itemSelected);
            setItemSelected({ scenarioId: 0, scenarioName: "" });
          }}
        >
          <Text style={styles.txtBtn}>{translate(messages.close)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
