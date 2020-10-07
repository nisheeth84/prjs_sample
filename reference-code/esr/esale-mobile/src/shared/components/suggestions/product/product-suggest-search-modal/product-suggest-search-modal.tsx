import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, TextInput, FlatList, Animated, PanResponder, RefreshControl, ActivityIndicator } from 'react-native'
import { translate } from '../../../../../config/i18n';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { useDebounce } from '../../../../../config/utils/debounce';
import { Icon } from '../../../icon';
import _ from 'lodash';
import { ProductSuggest } from '../../interface/product-suggest-interface';
import { saveProductSuggestionsChoice, getProductSuggestions } from '../../repository/product-suggest-repositoty';
import ProductSuggestSearchStyles from './product-suggest-search-style';
import { messages } from '../product-suggest-messages';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import StringUtils from '../../../../util/string-utils';
import { LIMIT_SEARCH, INDEX_CHOICE_PRODUCT, CATEGORY_LABEL } from '../product-contants';


/**
 * ProductSuggestSearchModalProps
 */
export interface ProductSuggestSearchModalProps {
  fieldLabel: string,
  typeSearch: number,
  dataSelected: ProductSuggest[],
  isRelation?: boolean,
  currencyUnit: string
  isCloseDetailSearchModal: boolean,
  setConditions: (cond: any[]) => void;
  selectedData: (Product: ProductSuggest, typeSearch: number) => void;
  closeModal: () => void;
  openDetailSearchModal: () => void;
  exportError: (err: any) => void;
}

/**
 * ProductSuggestSearchModal component
 * @param props 
 */
export function ProductSuggestSearchModal(props: ProductSuggestSearchModalProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const [resultSearch, setResultSearch] = useState<ProductSuggest[]>([]);
  const [isErrorCallAPI, setIsErrorCallAPI] = useState(false);
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const [offset, setOffset] = useState(0);
  const [y, setY] = useState(0);
  const debounceSearch = useDebounce(searchValue, 500);
  const pan = useRef(new Animated.ValueXY()).current;
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
   * @param offset start index search
   */
  const handleSearch = async (text: string, offset: number) => {
    setOffset(offset);
    setIsNoData(true);
    // Call api get suggest Product
    const payload = {
      searchValue: text,
      limit: LIMIT_SEARCH,
      offset,
      listIdChoice: props.typeSearch === TypeSelectSuggest.MULTI ? _.map(props.dataSelected, item => item.productId) : []
    };
    const response = await getProductSuggestions(payload);
    if (response.status === 200 && response.data) {
      if (offset > 0) {
        setResultSearch(resultSearch.concat(response.data.dataInfo));
      } else {
        setResultSearch(response.data.dataInfo);
      }
      if (!_.isEmpty(response.data.dataInfo)) {
        setIsNoData(false);
      }
      setIsErrorCallAPI(false);
    } else {
      setIsErrorCallAPI(true);
      setResultSearch([]);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }

  /**
   * event click choose Product item in list
   * @param number ProductIdid selected
   */
  const handleClickSelectProductItem = (product: ProductSuggest) => {
    props.selectedData(product, props.typeSearch);
    if (!props.isRelation) {
      callAPISuggestionsChoice(product);
    }
  }

  /**
   * save suggestions choice
   * @param itemSelected 
   */
  const callAPISuggestionsChoice = async (selected: ProductSuggest) => {
    const response = await saveProductSuggestionsChoice({
      sugggestionsChoice: [
        {
          index: INDEX_CHOICE_PRODUCT,
          idResult: selected.productId
        }
      ]
    })
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (resultSearch.length === 0) {
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
      <ActivityIndicator style={{ padding: 5 }} animating={animating} size="large" />
    )
  }

  /**
   * Render separator flatlist
   */
  const renderItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#E5E5E5' }}
      />
    )
  }

  return (
    <View style={ProductSuggestSearchStyles.modalContent}>
      <Animated.View
        style={{ flex: resultSearch.length > 0 ? 1 : 4, justifyContent: 'flex-end' }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={ProductSuggestSearchStyles.modalTouchable}
          onPress={() => props.closeModal()}
        >
          <View>
            <Icon style={ProductSuggestSearchStyles.modalIcon} name="iconModal" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <View style={[ProductSuggestSearchStyles.colorStyle, { flex: getFlexNumber() }]}>
        <View style={ProductSuggestSearchStyles.inputContainer}>
          <View style={ProductSuggestSearchStyles.inputContent}>
            <TextInput style={ProductSuggestSearchStyles.inputSearchTextData} placeholder=
              {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
                : props.fieldLabel + translate(messages.placeholderMultiChoose)}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            <View style={ProductSuggestSearchStyles.textSearchContainer}>
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
            style={ProductSuggestSearchStyles.cancel}
            onPress={() => {
              if (!_.isEmpty(searchValue)) {
                setRefreshData(true);
              }
              setSearchValue(TEXT_EMPTY);
            }}
          >
            <Text style={ProductSuggestSearchStyles.cancelText}>{translate(messages.cancelText)}</Text>
          </TouchableOpacity>
        </View>
        <View style={ProductSuggestSearchStyles.dividerContainer} />
        {
          isErrorCallAPI && (
            <Text style={ProductSuggestSearchStyles.errorMessage}>{translate(messages.errorCallAPI)}</Text>
          )
        }
        {!isErrorCallAPI &&
          <View style={[resultSearch.length > 0 ? ProductSuggestSearchStyles.suggestionContainer : ProductSuggestSearchStyles.suggestionContainerNoData]}>
            <FlatList
              data={resultSearch}
              keyExtractor={item => item.productId.toString()}
              onEndReached={() => {
                if (!isNoData) {
                  setFooterIndicator(true);
                  handleSearch(searchValue, offset + LIMIT_SEARCH);
                }
              }}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setFooterIndicator(true);
                    setRefreshData(true);
                    handleSearch(searchValue, 0);
                    setTimeout(() => {
                      setRefreshData(false);
                    }, 3000);
                  }}
                />
              }
              renderItem={({ item }) =>
                <View>
                  <TouchableOpacity style={resultSearch.length > 0 ? ProductSuggestSearchStyles.touchableSelect : ProductSuggestSearchStyles.touchableSelectNoData}
                    onPress={() => {
                      handleClickSelectProductItem(item);
                      props.closeModal();
                    }}>
                    <View style={ProductSuggestSearchStyles.dataViewStyle}>
                      <Text style={ProductSuggestSearchStyles.suggestText}>{StringUtils.getFieldLabel(item, CATEGORY_LABEL, languageCode)}</Text>
                      <Text style={ProductSuggestSearchStyles.suggestName}>{item.productName}</Text>
                      <Text style={ProductSuggestSearchStyles.suggestText}>{item.unitPrice.toString().concat(props.currencyUnit)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>}
      </View>
    </View>
  )
}
