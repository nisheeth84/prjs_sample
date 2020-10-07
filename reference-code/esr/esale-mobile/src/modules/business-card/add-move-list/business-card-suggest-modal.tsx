import React, { useEffect, useState } from "react";
import {
  Modal,
  // Alert as ShowError,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import _ from "lodash";
import { createAddParticipantsStyles } from "./business-card-creation-style";
import {
  SuggestBusinessCardDepartmentResponse,
  suggestBusinessCardDepartment,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import { translate } from "../../../config/i18n";
import { messages } from "../register-editer/business-card-register-messages";
import { messages as messages2 } from "./business-card-add-move-list-messages";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { listBusinessCardSuggestionSelector } from "../business-card-selector";
import BusinessCardModalSuggestionItem, {
  BusinessItem,
} from "./business-card-modal-suggestion-item";

const styles = createAddParticipantsStyles;

interface ModalBusinessCardSearchProps {
  visible: boolean;
  onConfirm: (listSelected: BusinessItem[]) => void;
}

export const ModalBusinessCardSearch = ({
  visible = false,
  onConfirm,
}: ModalBusinessCardSearchProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState("");
  // const [checkItem, setCheckItem] = useState(false);
  const [listSelected, setListSelected] = useState<BusinessItem[]>([]);
  const dataSuggestionList = useSelector(listBusinessCardSuggestionSelector);
  const [dataBusinessCardSuggestionList, setData] = useState(
    dataSuggestionList
  );
  const {
    favorListBC,
    myListBC,
    sharedListBC,
  } = dataBusinessCardSuggestionList;
  // const timeout = 0;

  /**
   * handle error api suggestBusinessCardDepartment
   * @param response
   */

  const handleErrorSuggestBusinessCardSuggestion = (
    response: SuggestBusinessCardDepartmentResponse
  ) => {
    switch (response.status) {
      case 200: {
        dispatch(
          businessCardActions.getBusinessCardSuggestionList(response.data)
        );
        setData(dataSuggestionList);
        // dispatch(
        //   businessCardActions.getBusinessCardSuggestionList(
        //     dataGetBusinessCardsSuggestionDummy
        //   )
        // );
        break;
      }
      case 500: {
          alert('Sever Error!')
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

  const suggestBusinessCardSuggestionFunc = async (text:string) => {
    const params = {
      searchValue: text,
    };

    // dispatch(
    //   businessCardActions.getBusinessCardSuggestionList(
    //     dataGetBusinessCardsSuggestionDummy
    //   )
    // );

    const data = await suggestBusinessCardDepartment(params);

    if (data) {
      handleErrorSuggestBusinessCardSuggestion(data);
    }
  };

  const onSearch = (text: string) => {
    // if (timeout) clearTimeout(timeout);
    setTextSearch(text);
    // timeout = setTimeout(() => {
    suggestBusinessCardSuggestionFunc(text);
    // }, 500);
  };

  useEffect(() => {
    onSearch("");
  }, []);
  /**
   *
   * @param item
   * Lưu lại các item đã được chọn
   */
  const toggleCheckItem = (item: BusinessItem) => {
    let newDataArray = [];
    const findItem = listSelected?.some(
      (elm: BusinessItem) => item.listId === elm.listId
    );

    if (findItem) {
      newDataArray = listSelected.filter(
        (elm: BusinessItem) => elm.listId !== item.listId
      );
    } else {
      newDataArray = [...listSelected, item];
    }
    setListSelected(newDataArray);
  };
  /**
   *
   * @param data
   * @param type
   * render list card
   */
  const _renderList = (data: BusinessItem[], title: string) => {
    return (
      <View style={styles.listCardContainer}>
        <Text>{title}</Text>
        {data.map((elm: BusinessItem) => (
          <BusinessCardModalSuggestionItem
            key={elm.listId}
            item={elm}
            title={title}
            onToggle={toggleCheckItem}
            selectedListItem={listSelected}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.container}>
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
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            {_renderList(favorListBC, translate(messages2.favoriteList))}
            {_renderList(myListBC, translate(messages2.myList))}
            {_renderList(sharedListBC, translate(messages2.shareList))}
          </ScrollView>
        </View>
      </SafeAreaView>
      <View style={styles.viewBtn}>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => onConfirm(listSelected)}
        >
          <Text style={styles.txtBtn}>{translate(messages.confirm)}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
