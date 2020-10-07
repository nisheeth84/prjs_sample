import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TextInput, TouchableOpacity, FlatList, PanResponder, Animated, ActivityIndicator, RefreshControl } from 'react-native'
import CustomerSuggestStyles from '../customer-suggest-style';
import { translate } from '../../../../../config/i18n';
import { messages } from '../customer-suggest-messages';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { CustomerSuggest } from '../../interface/customer-suggest-interface';
import { Icon } from '../../../icon';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { saveSuggestionsChoice, getCustomersSuggestion } from '../../repository/customer-suggest-repositoty';
import { useDebounce } from '../../../../../config/utils/debounce';
import _ from 'lodash';

/**
 * Define CustomerSuggestModal props
 */
export interface ICustomerSuggestModalViewProps {
  typeSearch: number,
  fieldLabel: string,
  dataSelected: CustomerSuggest[],
  isRelation?: boolean,
  listIdChoice?: number[],
  selectData: (customer: CustomerSuggest) => void,
  closeModal: () => void,
  openDetailSearchModal: () => void
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
      listIdChoice
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
      setResponseApiCustomer([])
    }
    setRefreshData(false);
    setFooterIndicator(false);
  }

  /**
   * event click choose customer item in lits
   * @param customer customer
   */
  const handleClickCustomerItem = (customer: CustomerSuggest) => {
    props.selectData(customer);
    props.closeModal();
    if (!props.isRelation) {
      handleSaveSuggestionsChoice(customer);
    }
  }

  /**
   * save suggestions choice
   * @param itemSelected 
   */
  const handleSaveSuggestionsChoice = async (selected: CustomerSuggest) => {
    const response = await saveSuggestionsChoice({
      sugggestionsChoice: [
        {
          index: INDEX_CHOICE,
          idResult: selected.customerId
        }
      ]
    });
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (responseApiCustomer.length === 0) {
      return 1;
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
      <View style={[CustomerSuggestStyles.modalContent, { flex: getFlexNumber() }]}>
        <View style={CustomerSuggestStyles.inputContainer}>
          <View style={CustomerSuggestStyles.inputContent}>
            <TextInput style={CustomerSuggestStyles.inputSearchTextData} placeholder=
              {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
                : props.fieldLabel + translate(messages.placeholderMultiChoose)}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            <View style={CustomerSuggestStyles.textSearchContainer}>
              <TouchableOpacity
                onPress={() => {
                  props.openDetailSearchModal();
                }}
              >
                <Icon name="searchOption" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={CustomerSuggestStyles.cancel}
            onPress={() => setSearchValue(TEXT_EMPTY)}
          >
            <Text style={CustomerSuggestStyles.cancelText}>{translate(messages.cancelText)}</Text>
          </TouchableOpacity>
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
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        }
      </View>
      <TouchableOpacity onPress={() => alert('Open add customer screen')} style={CustomerSuggestStyles.fab}>
        <Text style={CustomerSuggestStyles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  )
}
