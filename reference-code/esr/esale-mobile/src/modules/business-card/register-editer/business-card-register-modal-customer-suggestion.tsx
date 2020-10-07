import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
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
  GetCustomerSuggestionResponse,
  getCustomerSuggestion,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import { dataGetCustomerSuggestionDummy } from "./business-card-register-data-dummy";
import { translate } from "../../../config/i18n";
import { messages } from "./business-card-register-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { dataSuggestBusinessCardCustomerSelector } from "../business-card-selector";

const styles = ModalSuggestionStyles;

interface ModalCustomerSuggestionProps {
  visible: boolean;
  value: string;
  onConfirm: (text: string) => void;
}

export const ModalCustomerSuggestion = ({
  visible = false,
  value,
  onConfirm = () => {},
}: ModalCustomerSuggestionProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState(value);
  const data = useSelector(dataSuggestBusinessCardCustomerSelector);

  /**
   * handle error api suggestBusinessCardDepartment
   * @param response
   */

  const handleErrorGetCustomerSuggestion = (
    response: GetCustomerSuggestionResponse
  ) => {
    switch (response.status) {
      case 200: {
        dispatch(businessCardActions.getCustomerSuggestion(response.data));
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
   * call api getCustomerSuggestion
   */

  const getCustomerSuggestionFunc = async (param: {
    keyWords?: string;
    listIdChoice?: Array<number>;
  }) => {
    const params = {
      keyWords: "",
      offset: 1,
      listIdChoice: [],
      ...param,
    };

    dispatch(
      businessCardActions.getCustomerSuggestion(dataGetCustomerSuggestionDummy)
    );

    const data = await getCustomerSuggestion(
      params
    );

    if (data) {
      handleErrorGetCustomerSuggestion(data);
    }
  };

  /**
   * search customer suggestion
   * @param text
   */

  const onSearch = (text: string) => {
    setTextSearch(text);
    getCustomerSuggestionFunc({ keyWords: text });
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
                translate(messages.customerName) + translate(messages.enter)
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
            keyExtractor={(item: any) => item.customerId.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.btnItem}
                  onPress={() => onSearch(item?.customerName || "")}
                >
                  <Text style={styles.txt}>{item?.customerName || ""}</Text>
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
