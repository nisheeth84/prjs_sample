import React, { useState, useEffect, } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import ProductSuggestResultSearchStyle, { AppbarStyles } from './product-suggest-result-search-style';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { translate } from '../../../../../config/i18n';
import _, { isNil } from 'lodash';
import { messages } from '../product-suggest-messages';
import { IResultSearchProps, ProductSuggest } from '../../interface/product-suggest-interface';
import { getProducts, saveProductSuggestionsChoice } from '../../repository/product-suggest-repositoty';
import { Icon } from '../../../icon';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import StringUtils from '../../../../util/string-utils';
import { responseMessages } from '../../../../messages/response-messages';
import { LIMIT_RESULT_DETAIL_SEARCH, INDEX_CHOICE_PRODUCT, CATEGORY_LABEL } from '../product-contants';
import { searchConditionsSelector } from '../../../../../modules/search/search-selector';


/**
 * Result Search View
 * @param props 
 */
export function ProductSuggestResultSearchView(props: IResultSearchProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const [isNoData, setIsNoData] = useState(false);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const unCheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const [displayNoDataMessage, setDisplayNoDataMessage] = useState(false);
  //state click Product
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  //state item Product used to be Clicked
  const [stateProductBefore, setStateProductBefore] = useState(TEXT_EMPTY);
  //list data selected
  const [dataSelected, setDataSelected] = useState<ProductSuggest[]>([]);
  //List data show up on Screen
  const [viewDataSelect, setViewDataSelect] = useState<ProductSuggest[]>([]);
  //offset
  const [offset, setOffset] = useState(0);
  //totalRecords
  const [totalRecords, setTotalRecords] = useState(0);
  const searchConditions = useSelector(searchConditionsSelector);

  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (offset: number) => {
    setFooterIndicator(true);
    setIsNoData(true);
    const res = await getProducts({
      searchConditions: searchConditions ?? [],
      filterConditions: [],
      limit: LIMIT_RESULT_DETAIL_SEARCH,
      offset: offset
    })
    if (!_.isNil(res?.data?.dataInfo?.products)) {
      if (offset > 0) {
        setViewDataSelect(_.cloneDeep(viewDataSelect).concat(res.data.dataInfo.products))
      } else {
        setViewDataSelect(res.data.dataInfo.products);
      }
      setTotalRecords(res.data.totalCount);
      if (!_.isEmpty(res.data.dataInfo.products)) {
        setIsNoData(false);
      }
      else if (offset === 0) {
        setDisplayNoDataMessage(true);
      }
    } else {
      setTotalRecords(0);
      setViewDataSelect([]);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }

  // const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
  //   return !isSearchBlank && _.isEmpty(value);
  // };

  /**
   * Loadmore data everytime offset is changed
   */
  useEffect(() => {
    getDataFromAPI(offset);
  }, [offset]
  )

  /** 
   * set map state check view checkbox
   * @param product 
   */
  const handleViewCheckbox = (product: ProductSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${product.productId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeSelectSuggest.SINGLE == props.typeSearch) {
      if (stateProductBefore.length > 0) {
        newStateCheck.set(stateProductBefore, !statusSelectedItem.get(stateProductBefore));
      }
    }
    if (keyMap === stateProductBefore) {
      setStateProductBefore(TEXT_EMPTY);
    } else {
      setStateProductBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);
  }
  /**
   * handle add Product to list
   * @param product 
   * @param typeSearch 
   */
  const handleProductSelected = (product: ProductSuggest, typeSearch: number) => {
    const isExistProduct = dataSelected.filter(itemProduct => (itemProduct.productId === product.productId));
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistProduct?.length <= 0) {
        dataSelected.push(product);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistProduct?.length > 0) {
        let listDataSelected = dataSelected.filter(itemProduct => (itemProduct.productId !== product.productId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(product);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * call API saveProductSuggestionsChoice
   * @param dataSelected
   */
  const callSaveProductSuggestionsChoiceAPI = async (dataSelected: ProductSuggest[]) => {
    const response = await saveProductSuggestionsChoice({
      sugggestionsChoice: _.map(dataSelected, item => {
        return {
          index: INDEX_CHOICE_PRODUCT,
          idResult: item.productId
        }
      })
    })
    if (response.status !== 200) {
      props.exportError(response);
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
  * back to Result Selected Screen
  */
  const applyPress = () => {
    props.updateStateElement(dataSelected);
    props.closeModal();
    if (!props.isRelation) {
      callSaveProductSuggestionsChoiceAPI(dataSelected);
    }
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
  /**
   * handle click Product in list
   * @param Product
   */
  const handleClickEmloyeeItem = (product: ProductSuggest) => {
    handleViewCheckbox(product);
    handleProductSelected(product, props.typeSearch);

  }
  return (
    <View style={{ flex: 1 }}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          style={AppbarStyles.iconButton}
          onPress={props.closeModal}
        >
          <Icon name="close" />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{translate(messages.functionText)}</Text>
        </View>
        <TouchableOpacity
          style={dataSelected.length > 0
            ? AppbarStyles.applyButton
            : [AppbarStyles.applyButton, AppbarStyles.disableButton]}
          disabled={dataSelected.length === 0}
          onPress={applyPress}
        >
          <Text style={AppbarStyles.applyText}>{translate(messages.choiceText)}</Text>
        </TouchableOpacity>
      </View>
      <Text style={ProductSuggestResultSearchStyle.SumLabelStyle}>
        {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
      </Text>
      <View style={ProductSuggestResultSearchStyle.Underline}></View>
      <View style={{ flex: 1 }}>
        {
          !displayNoDataMessage ? (
            <FlatList
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                if (!isNoData) {
                  setOffset(offset + LIMIT_RESULT_DETAIL_SEARCH);
                  setFooterIndicator(true);
                }
              }}
              data={viewDataSelect}
              keyExtractor={item => item.productId.toString()}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setRefreshData(true);
                    setOffset(0);
                    setTimeout(() => {
                      setRefreshData(false);
                    }, 3000);
                  }}
                />
              }
              renderItem={({ item }) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        handleClickEmloyeeItem(item);
                      }}
                      style={ProductSuggestResultSearchStyle.dataModalStyle}>
                      <View >
                        {
                          isNil(item.productImagePath)
                            ?
                            <Icon style={ProductSuggestResultSearchStyle.productImageStyle} name="NoImage" />
                            :
                            < Image style={ProductSuggestResultSearchStyle.productImageStyle} source={{ uri: item.productImagePath }} />
                        }
                      </View>
                      <View style={ProductSuggestResultSearchStyle.dataSelectedStyle}>
                        <Text style={ProductSuggestResultSearchStyle.suggestText}>{StringUtils.getFieldLabel(item, CATEGORY_LABEL, languageCode)}</Text>
                        <Text style={ProductSuggestResultSearchStyle.nameProductStyle}>{item.productName}</Text>
                        <Text style={ProductSuggestResultSearchStyle.suggestText}>{item.unitPrice}{props.currencyUnit}</Text>
                      </View>
                      <View style={ProductSuggestResultSearchStyle.iconCheckView}>
                        {
                          statusSelectedItem.get(`${item.productId}`) &&
                          <Image style={ProductSuggestResultSearchStyle.iconCheck} source={checkedIcon} />
                        }
                        {
                          !statusSelectedItem.get(`${item.productId}`) &&
                          < Image style={ProductSuggestResultSearchStyle.iconCheck} source={unCheckedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }
              }
            />
          ) : (
              <View style={ProductSuggestResultSearchStyle.noDataMessage}>
                <Icon style={ProductSuggestResultSearchStyle.functionIcon} name="commodity"></Icon>
                <Text style={ProductSuggestResultSearchStyle.textNoData}>{translate(responseMessages.INF_COM_0020).replace('{0}', translate(messages.functionText))}</Text>
              </View>
            )
        }
      </View>
    </View >
  );
}


