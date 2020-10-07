import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, PanResponder, RefreshControl, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TEXT_EMPTY } from '../../../../../../../../config/constants/constants';
import { TypeRelationSuggest, PlatformOS } from '../../../../../../../../config/constants/enum';
import { translate } from '../../../../../../../../config/i18n';
import { useDebounce } from '../../../../../../../../config/utils/debounce';
import { Icon } from '../../../../../../icon';
import { CustomerSuggest } from '../customer-suggest-interface';
import { messages } from '../../relation-suggest-messages';
import CustomerSuggestStyles from '../customer-suggest-style';
import { getCustomersSuggestion } from '../../relation-suggest-repository';
/**
 * Define CustomerSuggestModal props
 */
export interface ICustomerSuggestModalViewProps {
  typeSearch: number,
  fieldLabel: string,
  dataSelected: any[],
  fieldInfo?: any,
  listIdChoice?: number[],
  selectData: (customers: CustomerSuggest[]) => void,
  closeModal: () => void,
  exportError: (err: any) => void;
}

// save index
const INDEX_CHOICE = 'customer';
// limit
const LIMIT = 10;

/**
 * Component search customer suggestion
 * @param props ICustomerSuggestModalViewProps
 */
export function CustomerSuggestModalView(props: ICustomerSuggestModalViewProps) {
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [isShowSuggestion, setShowSuggestion] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [responseApiCustomer, setResponseApiCustomer] = useState<CustomerSuggest[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [offset, setOffset] = useState(0);
  const [y, setY] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const debounceSearch = useDebounce(searchValue, 500);
  const [isNoData, setIsNoData] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [stateCustomerBefore, setStateCustomerBefore] = useState(TEXT_EMPTY);
  const [dataSelected, setDataSelected] = useState<CustomerSuggest[]>([]);
  const [isDisplayKeyboard, setIsDisplayKeyboard] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        setY(gestureState.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  /**
   * Change value search
   */
  useEffect(() => {
    if (debounceSearch) {
      handleSearch(searchValue, 0);
    } else {
      handleSearch(TEXT_EMPTY, 0);
    }
  }, [debounceSearch]);

  /**
   * handle text input to show suggestion
   * @param text text from input
   */
  const handleSearch = async (text: string, offset: number) => {
    setIsNoData(true);
    setShowSuggestion(true);
    setErrorMessage(TEXT_EMPTY);
    setFooterIndicator(true);
    let listIdChoice = _.map(props.dataSelected, customer => customer.customerId);
    if (props.listIdChoice) {
      listIdChoice = listIdChoice.concat(props.listIdChoice);
    }
    // Call api get suggest customer
    const response = await getCustomersSuggestion({
      keyWords: text,
      offset,
      // limit: LIMIT,
      listIdChoice,
      relationFieldId:props?.fieldInfo.fieldId
    });
    if (response.status === 200 && response.data) {
      if (offset > 0) {
        setResponseApiCustomer(responseApiCustomer.concat(response.data.customers || []));
      } else {
        setResponseApiCustomer(response.data.customers || []);
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
      setShowSuggestion(false);
      setResponseApiCustomer([]);
    }
    setRefreshData(false);
    setFooterIndicator(false);
  }

  /** 
   * set map state check view checkbox
   * @param customer 
   */
  const handleViewCheckbox = (customer: CustomerSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${customer.customerId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeRelationSuggest.SINGLE === props.typeSearch) {
      if (stateCustomerBefore.length > 0) {
        newStateCheck.set(stateCustomerBefore, !statusSelectedItem.get(stateCustomerBefore));
      }
    }
    if (keyMap === stateCustomerBefore) {
      setStateCustomerBefore(TEXT_EMPTY);
    } else {
      setStateCustomerBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);
  }


  /**
 * handle add customer to list
 * @param customer 
 * @param typeSearch 
 */
  const handleCustomerSelected = (customer: CustomerSuggest) => {
    const isExistCustomer = dataSelected.filter(item => (item.customerId === customer.customerId));
    if (props.typeSearch === TypeRelationSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistCustomer?.length <= 0) {
        dataSelected.push(customer);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistCustomer?.length > 0) {
        let listDataSelected = dataSelected.filter(item => (item.customerId !== customer.customerId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(customer);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * event click choose customer item in lits
   * @param customer customer
   */
  const handleClickCustomerItem = (customer: CustomerSuggest) => {
    handleViewCheckbox(customer);
    handleCustomerSelected(customer);
  }

  const confirmSearch = (data: CustomerSuggest[]) => {
    setDisableConfirm(true);
    if (props.selectData) {
      props.selectData(data);
    }
    props.closeModal();
    setDisableConfirm(false);
  }


  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (responseApiCustomer.length === 0) {
      return 2;
    } else if (y < 0) {
      return 10;
    } else {
      return 2;
    }
  }

  /**
   * Render ActivityIndicator
   * @param animating 
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={CustomerSuggestStyles.activityIndicator} animating={animating} size="large" />
    )
  }

  /**
   * Render separator flatlist
   */
  const renderItemSeparator = () => {
    return (
      <View
        style={CustomerSuggestStyles.listSeparator}
      />
    )
  }

  return (
    <View style={CustomerSuggestStyles.modalContainer}>
      <Animated.View
        style={[{ flex: responseApiCustomer.length > 0 ? 1 : 4 }, CustomerSuggestStyles.flexEnd]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={CustomerSuggestStyles.modalTouchable}
          onPress={() => props.closeModal()}
        >
          <View>
            <Icon style={CustomerSuggestStyles.modalIcon} name="iconModal" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <KeyboardAvoidingView
        style={[CustomerSuggestStyles.modalContent, { flex: getFlexNumber() }]}
        behavior={Platform.OS === PlatformOS.IOS ? "padding" : undefined}
      >
        <View style={CustomerSuggestStyles.inputContainer}>
          <TextInput style={CustomerSuggestStyles.inputSearchTextData} placeholder=
            {props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            onFocus={() => setIsDisplayKeyboard(true)}
            onBlur={() => setIsDisplayKeyboard(false)}
          />
          <View style={CustomerSuggestStyles.textSearchContainer}>
            {searchValue.length > 0 && (
              <TouchableOpacity onPress={() => setSearchValue(TEXT_EMPTY)}>
                <AntDesign size={18} name="closecircle" style={CustomerSuggestStyles.iconDelete} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={CustomerSuggestStyles.dividerContainer} />
        {
          !isShowSuggestion && (
            <Text style={CustomerSuggestStyles.errorMessage}>{errorMessage}</Text>
          )
        }
        {isShowSuggestion &&
          <View style={[responseApiCustomer.length > 0 ? CustomerSuggestStyles.suggestionContainer : CustomerSuggestStyles.suggestionContainerNoData]}>
            <FlatList
              data={responseApiCustomer}
              keyExtractor={item => item.customerId.toString()}
              onEndReached={() => {
                if (!isNoData) {
                  handleSearch(searchValue, offset + LIMIT);
                  setOffset(offset + LIMIT);
                }
              }}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              contentContainerStyle={CustomerSuggestStyles.listBottom}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setRefreshData(true);
                    handleSearch(TEXT_EMPTY, 0);
                  }}
                />
              }
              renderItem={({ item }) =>
                <View>
                  <TouchableOpacity style={responseApiCustomer.length > 0 ? CustomerSuggestStyles.touchableSelect : CustomerSuggestStyles.touchableSelectNoData}
                    onPress={() => {
                      handleClickCustomerItem(item);
                    }}>
                    <View style={CustomerSuggestStyles.suggestTouchable}>
                      <Text numberOfLines={1} style={CustomerSuggestStyles.suggestText}>{item.parentCustomerName}</Text>
                      <Text numberOfLines={1} style={CustomerSuggestStyles.fontBold}>{item.customerName}</Text>
                      <Text numberOfLines={1} style={CustomerSuggestStyles.suggestText}>{item.address}</Text>
                    </View>
                    <View style={CustomerSuggestStyles.iconCheckView}>
                      {
                        statusSelectedItem.get(`${item.customerId}`) &&
                        <Icon name={"checkedIcon"}
                          style={CustomerSuggestStyles.iconCheck} />
                      }
                      {
                        !statusSelectedItem.get(`${item.customerId}`) &&
                        TypeRelationSuggest.MULTI === props.typeSearch &&
                        <Icon name={"unCheckedIcon"}
                          style={CustomerSuggestStyles.iconCheck} />
                      }
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        }
        {!(isDisplayKeyboard && _.isEmpty(responseApiCustomer)) &&
          <TouchableOpacity style={CustomerSuggestStyles.modalButton} disabled={disableConfirm} onPress={() => { confirmSearch(dataSelected); }}>
            <Text style={CustomerSuggestStyles.textButton}>{translate(messages.confirm)}</Text>
          </TouchableOpacity>
        }
      </KeyboardAvoidingView>

    </View>
  )
}
