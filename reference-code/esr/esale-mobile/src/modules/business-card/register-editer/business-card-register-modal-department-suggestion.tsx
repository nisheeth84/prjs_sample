import React, { useEffect, useState } from "react";
import {
  FlatList,
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
  SuggestBusinessCardDepartmentResponse,
  suggestBusinessCardDepartment,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import { dataSuggestBusinessCardDepartmentDummy } from "./business-card-register-data-dummy";
import { translate } from "../../../config/i18n";
import { messages } from "./business-card-register-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { dataSuggestBusinessCardDepartmentSelector } from "../business-card-selector";

const styles = ModalSuggestionStyles;

interface ModalDepartmentSuggestionProps {
  visible: boolean;
  value: string;
  onConfirm: (text: string) => void;
}

export const ModalDepartmentSuggestion = ({
  visible = false,
  value,
  onConfirm = () => {},
}: ModalDepartmentSuggestionProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState(value);
  const data = useSelector(dataSuggestBusinessCardDepartmentSelector);

  /**
   * handle error api suggestBusinessCardDepartment
   * @param response
   */

  const handleErrorSuggestBusinessCardDepartment = (
    response: SuggestBusinessCardDepartmentResponse
  ) => {
    switch (response.status) {
      case 200: {
        dispatch(
          businessCardActions.suggestBusinesCardDepartment(response.data)
        );
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
   * call api suggestBusinessCardDepartment
   */

  const suggestBusinessCardDepartmentFunc = async (param: {
    companyName?: number;
    departmentName?: string;
  }) => {
    const params = {
      companyName: 1,
      departmentName: "",
      ...param,
    };

    dispatch(
      businessCardActions.suggestBusinesCardDepartment(
        dataSuggestBusinessCardDepartmentDummy
      )
    );

    const data = await suggestBusinessCardDepartment(params);

    if (data) {
      handleErrorSuggestBusinessCardDepartment(data);
    }
  };

  /**
   * search department name
   * @param text
   */

  const onSearch = (text: string) => {
    setTextSearch(text);
    suggestBusinessCardDepartmentFunc({ departmentName: text });
  };

  useEffect(() => {
    onSearch("");
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
                translate(messages.departmentName) + translate(messages.enter)
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
            keyExtractor={(item: any) => item.departmentId.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.btnItem}
                  onPress={() => onSearch(item.departmentName)}
                >
                  <Text style={styles.txt}>{item.departmentName}</Text>
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
          onPress={() => onConfirm(textSearch)}
        >
          <Text style={styles.txtBtn}>{translate(messages.confirm)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
