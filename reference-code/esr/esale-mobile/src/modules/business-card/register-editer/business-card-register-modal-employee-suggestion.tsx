import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  // Alert as ShowError,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalSuggestionStyles } from "./business-card-register-style";
import {
  GetEmployeesSuggestionResponse,
  getEmployeesSuggestion,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import { dataGetEmployeesSuggestionDummy } from "./business-card-register-data-dummy";
import { translate } from "../../../config/i18n";
import { messages } from "./business-card-register-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { dataGetEmployeesSuggestionSelector } from "../business-card-selector";

const styles = ModalSuggestionStyles;

interface ModalEmployeeSuggestionProps {
  visible: boolean;
  onConfirm: (employee: object) => void;
}

export const ModalEmployeeSuggestion = ({
  visible = false,
  onConfirm = () => {},
}: ModalEmployeeSuggestionProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState("");
  const data = useSelector(dataGetEmployeesSuggestionSelector).employees;

  /**
   * handle error api suggestBusinessCardDepartment
   * @param response
   */

  const handleErrorGetEmployeesSuggestion = (
    response: GetEmployeesSuggestionResponse
  ) => {
    switch (response.status) {
      case 200: {
        dispatch(businessCardActions.getEmployeesSuggestion(response.data));
        break;
      }
      case 400: {
        alert("Bad request!");
        break;
      }
      case 500: {
        alert("Server Error!");
        break;
      }
      default: {
        // ShowError.alert("Notify", "Error!");
      }
    }
  };

  /**
   * call api getEmployeesSuggestion
   * @param param
   */

  const getEmployeesSuggestionFunc = async (param: {
    keyWords?: string;
    searchType?: number;
  }) => {
    const params = {
      keyWords: "",
      searchType: 2,
      ...param,
    };

    dispatch(
      businessCardActions.getEmployeesSuggestion(
        dataGetEmployeesSuggestionDummy
      )
    );
    const data = await getEmployeesSuggestion(params);

    if (data) {
      handleErrorGetEmployeesSuggestion(data);
    }
  };

  /**
   * call api search suggestion
   * @param text
   */

  const onSearch = (text: string) => {
    setTextSearch(text);
    getEmployeesSuggestionFunc({ keyWords: text });
  };

  useEffect(() => {
    getEmployeesSuggestionFunc({ keyWords: textSearch });
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.viewTop}>
          <View style={styles.view} />
        </View>
        <View style={styles.viewContent}>
          <View style={styles.viewInput}>
            <TextInput
              style={styles.txtInput}
              placeholder={
                translate(messages.receiver) + translate(messages.enter)
              }
              value={textSearch}
              onChangeText={(text) => onSearch(text)}
            />
            <TouchableOpacity
              style={styles.viewClose}
              hitSlop={CommonStyles.hitSlop}
              onPress={() => onSearch("")}
            >
              <Ionicons
                name="ios-close"
                color={theme.colors.white200}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.devider} />
          <FlatList
            data={data}
            keyExtractor={(item: any) => item.employeeId.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.btnItemEmp}
                  onPress={() => {
                    onSearch("");
                    onConfirm(item);
                  }}
                >
                  <Image
                    source={{
                      uri: item.employeePhoto.filePath,
                    }}
                    style={styles.image}
                  />
                  <Text style={styles.txt}>{item.employeeName}</Text>
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
        <TouchableOpacity style={styles.btnStyle} onPress={() => onConfirm({})}>
          <Text style={styles.txtBtn}>{translate(messages.close)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
