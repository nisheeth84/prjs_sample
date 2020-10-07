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
  GetAddressesFromZipCodeResponse,
  getAddressesFromZipCode,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import { dataGetAddressesFromZipCodeDummy } from "./business-card-register-data-dummy";
import { translate } from "../../../config/i18n";
import { messages } from "./business-card-register-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { dataGetAddressesFromZipCodeSelector } from "../business-card-selector";

const styles = ModalSuggestionStyles;

interface ModalAddressSuggestionProps {
  visible: boolean;
  onConfirm: (text: string) => void;
}

export const ModalAddressSuggestion = ({
  visible = false,
  onConfirm = () => {},
}: ModalAddressSuggestionProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState("");
  const data = useSelector(dataGetAddressesFromZipCodeSelector);

  /**
   * handle error api GetAddressesFromZipCode
   * @param response
   */

  const handleErrorGetAddressesFromZipCode = (
    response: GetAddressesFromZipCodeResponse
  ) => {
    switch (response.status) {
      case 200: {
        dispatch(businessCardActions.getAddressesFromZipCode(response.data));
        break;
      }
      case 500: {
        alert('Sever Error')
        break;
      }
      default: {
        // ShowError.alert("Notify", "Error!");
      }
    }
  };

  /**
   * call api GetAddressesFromZipCode
   */

  const getAddressesFromZipCodeFunc = async (param: {
    zipCode?: string;
    offset?: number;
    limit?: number;
  }) => {
    const params = {
      zipCode: "",
      offset: 1,
      limit: 20,
      ...param,
    };

    dispatch(
      businessCardActions.getAddressesFromZipCode(
        dataGetAddressesFromZipCodeDummy
      )
    );

    const data = await getAddressesFromZipCode(params);

    if (data) {
      handleErrorGetAddressesFromZipCode(data);
    }
  };

  /**
   * search address
   * @param text
   */

  const onSearch = (text: string) => {
    setTextSearch(text);
    getAddressesFromZipCodeFunc({ zipCode: text });
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
            keyExtractor={(item: any) => item.zipCode.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              const name = `〒${
                item.zipCode +
                item.prefectureName +
                item.cityName +
                item.areaName
              }`;
              return (
                <TouchableOpacity
                  style={styles.btnItem}
                  onPress={() => onConfirm(name)}
                >
                  <Text style={styles.txt}>{name}</Text>
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
        <TouchableOpacity style={styles.btnStyle} onPress={() => onConfirm("")}>
          <Text style={styles.txtBtn}>{translate(messages.confirm)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
