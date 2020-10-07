import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from '../../../../shared/components/icon';
import { useDispatch, useSelector } from "react-redux";
import { createAddParticipantsStyles } from "./styles";
import { CommonStyles } from "../../../common-style";
import { translate } from "../../../../config/i18n";
import { messages } from "./modal-business-card-search-messages";
import { ModalSuggestionItem } from "./suggestion-item";
import { getListSuggestions } from "../../../../modules/menu/menu-feature-repository";
import { menuActions } from "../../../../modules/menu/menu-feature-reducer";
import { ListInfoSelector } from "../../../../modules/menu/menu-feature-selector";
import { AppIndicator } from "../../app-indicator/app-indicator";
import { PlatformOS } from '../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../config/constants/constants';

const styles = createAddParticipantsStyles;

let text = '';
interface ModalBusinessCardSearchProps {
  visible: boolean;
  onConfirm: (listSelected?: any[]) => void;
  apiUrl: string;
  isCustomer?: boolean;
  list: any[];
  placeholder: string;
}

let timeout: any;
export const ModalBusinessCardSearch = ({
  visible = false,
  onConfirm,
  apiUrl = TEXT_EMPTY,
  isCustomer = false,
  list = [],
  placeholder = TEXT_EMPTY,
}: ModalBusinessCardSearchProps) => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState(TEXT_EMPTY);
  const [refreshing, setRefreshing] = useState(false);
  // const [checkItem, setCheckItem] = useState(false);
  const [listSelected, setListSelected] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setListSelected(list);
  }, [list]);

  const dataBusinessCardSuggestionList = useSelector(ListInfoSelector);
  const {
    favorListBC,
    myListBC,
    sharedListBC,
  } = dataBusinessCardSuggestionList;

  /**
   * handle error api getListSuggestions
   * @param response
   */

  const handleErrorGetListSuggestions = (response: any) => {
    if (response.status === 200) {
      isCustomer
        ? dispatch(menuActions.getListSuggestionsCustomer(response.data))
        : dispatch(menuActions.getListSuggestions(response.data));
    } else {
      setError(true);
    }
  };

  /**
   * call api getListSuggestions
   */
  const getListSuggestionsFunc = async (param: { searchValue: string }) => {
    const data = await getListSuggestions(apiUrl, param);
    console.log('getListSuggestionsFunc', data);

    setRefreshing(false);
    if (data) {
      setRefreshing(false);
      handleErrorGetListSuggestions(data);
    }
  };

  const onSearch = (text: string) => {
    setRefreshing(true);
    if (error) {
      setError(false);
    }
    if (timeout) clearTimeout(timeout);
    setTextSearch(text);
    if (text === TEXT_EMPTY) {
      setRefreshing(false);
      isCustomer
        ? dispatch(menuActions.getListSuggestionsCustomer({ lisInfo: null }))
        : dispatch(menuActions.getListSuggestions({ lisInfo: null }));
      return;
    }
    timeout = setTimeout(() => {
      getListSuggestionsFunc({ searchValue: text });
    }, 200);
  };

  /**
   *
   * @param item
   * save item selected
   */
  const toggleCheckItem = (item: any) => {
    setListSelected([item]);
  };

  /**
   * render list
   * @param data
   * @param type
   * render list card
   */
  const _renderList = (data: any[], title: string) => {
    return data.length > 0 ? (
      <View style={styles.listCardContainer}>
        <Text>{title}</Text>
        <FlatList
          data={data}
          extraData={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <ModalSuggestionItem
                key={isCustomer ? item.customerListId : item.listId}
                item={item}
                onToggle={toggleCheckItem}
                selectedListItem={listSelected}
                isCustomer={isCustomer}
              />
            );
          }}
        />
      </View>
    ) : null;
  };

  /**
   * press confirm
   */
  const onPressConfirm = () => {
    onConfirm(listSelected);
    text = textSearch;
  };

  /**
   * press close
   */
  const onPressClose = () => {
    onConfirm();
    onSearch(text);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onPressClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior="height"
        keyboardVerticalOffset={
          Platform.OS === PlatformOS.IOS ? -200 : undefined
        }
      >
        <View style={styles.viewOutSide} onTouchStart={onPressClose}>
          <View style={styles.viewTop}>
            <View style={styles.view} />
          </View>
        </View>
        <View style={styles.viewContent}>
          <View style={styles.viewInput}>
            <TextInput
              style={styles.txtInput}
              placeholder={placeholder}
              value={textSearch}
              onChangeText={(text) => onSearch(text)}
            />
            {!!textSearch && (
              <TouchableOpacity
                hitSlop={CommonStyles.hitSlop}
                onPress={() => onSearch(TEXT_EMPTY)}
              >
                <Icon name="closeSearch" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.devider} />
          {refreshing && (
            <View style={styles.viewIndicator}>
              <AppIndicator visible />
            </View>
          )}
          {error ? (
            <View style={styles.viewIndicator}>
              <Text style={styles.txtNoData}>{translate(messages.empty)}</Text>
            </View>
          ) : !refreshing && !!textSearch ? (
            <ScrollView
              contentContainerStyle={styles.contentContainerStyle}
              showsVerticalScrollIndicator={false}
            >
              {_renderList(favorListBC, translate(messages.favoriteList))}
              {_renderList(myListBC, translate(messages.myList))}
              {_renderList(sharedListBC, translate(messages.shareList))}
            </ScrollView>
          ) : (
            <View />
          )}
          <View style={styles.padding} />
        </View>
        <View style={styles.viewBtn} onTouchStart={() => Keyboard.dismiss()}>
          <TouchableOpacity style={styles.btnStyle} onPress={onPressConfirm}>
            <Text style={styles.txtBtn}>{translate(messages.confirm)}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
