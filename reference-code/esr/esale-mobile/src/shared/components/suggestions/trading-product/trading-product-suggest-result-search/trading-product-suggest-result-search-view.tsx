import React, { useState, useEffect, } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { translate } from '../../../../../config/i18n';
import _ from 'lodash';
import { Icon } from '../../../icon';
import { responseMessages } from '../../../../messages/response-messages';
import { IResultSearchProps, ProductTradings } from '../../interface/trading-product-suggest-interface';
import { AppbarStyles } from '../trading-product-search-detail/search-detail-style';
import TradingProductSuggestResultSearchStyle from './trading-product-suggest-result-search-style';
//import { SearchConditions } from '../trading-product-search-detail/search-detail-interface';
import { saveTradingProductSuggestionsChoice, getTradingProducts } from '../../repository/trading-product-suggest-repositoty';
import { messages } from '../trading-product-suggest-messages';
import { LIMIT_RESULT_DETAIL_SEARCH, INDEX_CHOICE } from '../trading-product-contants'


/**
 * Result Search View
 * @param props 
 */
export function TradingProductSuggestResultSearchView(props: IResultSearchProps) {
  const [isNoData, setIsNoData] = useState(false);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const unCheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const [lastUpdateDate, setLastUpdateDate] = useState(TEXT_EMPTY);
  //state click Product
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  //state item Product used to be Clicked
  const [stateProductBefore, setStateProductBefore] = useState(TEXT_EMPTY);
  //list data selected
  const [dataSelected, setDataSelected] = useState<ProductTradings[]>([]);
  //List data show up on Screen
  const [viewDataSelect, setViewDataSelect] = useState<ProductTradings[]>([]);
  //offset
  const [offset, setOffset] = useState(0);
  //totalRecords
  const [totalRecords, setTotalRecords] = useState(0);
  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (offset: number) => {
    setIsNoData(true);
    const res = await getTradingProducts({
      searchConditions: [], //TODO convert
      filterConditions: [],
      limit: LIMIT_RESULT_DETAIL_SEARCH,
      offset: offset,
      isFirstLoad: true,
      isOnlyData: false,
      selectedTargetId: 0
    })
    if (!_.isNil(res.data.productTradings)) {
      if (offset > 0) {
        setViewDataSelect(_.cloneDeep(viewDataSelect).concat(res.data.productTradings))
      } else {
        setViewDataSelect(res.data.productTradings);
      }
      setTotalRecords(res.data.total);
      setLastUpdateDate(res.data.lastUpdateDate)
      if (!_.isEmpty(res.data.productTradings)) {
        setIsNoData(false);
      }
    } else {
      setTotalRecords(0);
      setViewDataSelect([]);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }

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
  const handleViewCheckbox = (product: ProductTradings) => {
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
  const handleProductSelected = (product: ProductTradings, typeSearch: number) => {
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
   * call API saveTradingProductSuggestionsChoice
   * @param dataSelected
   */
  const callSaveTradingProductSuggestionsChoiceAPI = async (dataSelected: ProductTradings[]) => {
    const response = await saveTradingProductSuggestionsChoice({
      suggestionsChoice: _.map(dataSelected, item => {
        return {
          index: INDEX_CHOICE,
          idResult: item.productId
        }
      })
    })
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * validate props 
   * convert FieldValue -> Blank if isSearchBlank === true
   */
  // const convertProps2SearchConditions = () => {
  //   const searchConditions = props.searchConditions;
  //   const listProductConverted: SearchConditions[] = [];
  //   for (let index = 0; index < searchConditions.length; index++) {
  //     const ProductItem = searchConditions[index];
  //     // convert object Product to view object
  //     let itemView = {
  //       fieldId: ProductItem.fieldId,
  //       fieldType: ProductItem.fieldType,
  //       isDefault: ProductItem.isDefault,
  //       fieldName: ProductItem.fieldName,
  //       fieldValue: ProductItem.isSearchBlank ? TEXT_EMPTY : ProductItem.fieldValue,
  //       searchType: ProductItem.searchType,
  //       searchOption: ProductItem.searchOption
  //     }
  //     listProductConverted.push(itemView);
  //   }
  //   return listProductConverted;
  // }
  /**
   * Render ActivityIndicator
   * @param animating 
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={TradingProductSuggestResultSearchStyle.activityIndicatorStyle} animating={animating} size="small" />
    )
  }

  /**
  * back to Result Selected Screen
  */
  const applyPress = () => {
    props.updateStateElement(dataSelected);
    props.closeModal();
    if (!props.isRelation) {
      callSaveTradingProductSuggestionsChoiceAPI(dataSelected);
    }
  }

  /**
  * Render separator flatlist
  */
  const renderItemSeparator = () => {
    return (
      <View
        style={TradingProductSuggestResultSearchStyle.separatorStyle}
      />
    )
  }
  /**
   * handle click Product in list
   * @param Product
   */
  const handleClickTradingProductItem = (product: ProductTradings) => {
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
      <View style={TradingProductSuggestResultSearchStyle.commonView}>
        <Text style={TradingProductSuggestResultSearchStyle.SumLabelStyle}>
          {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
        </Text>
        <Text>{`${translate(messages.lastUpdated)} : ${lastUpdateDate}`}</Text>
      </View>
      <View style={TradingProductSuggestResultSearchStyle.Underline}></View>
      <View style={{ flex: 1 }}>
        {
          viewDataSelect.length > 0 ? (
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
                        handleClickTradingProductItem(item);
                      }}
                      style={TradingProductSuggestResultSearchStyle.dataModalStyle}>
                      <View style={TradingProductSuggestResultSearchStyle.dataSelectedStyle}>
                        <View style={TradingProductSuggestResultSearchStyle.firstLineStyle}>
                          <Text style={TradingProductSuggestResultSearchStyle.suggestText}>{item.customerName}</Text>
                          <Text style={TradingProductSuggestResultSearchStyle.suggestText}>{item.progressName}</Text>
                        </View>
                        <Text style={TradingProductSuggestResultSearchStyle.nameProductStyle}>{item.productName}</Text>
                        <Text style={TradingProductSuggestResultSearchStyle.suggestText}>{`${translate(messages.amount)} : ${props.currencyUnit}${item.amount}`}</Text>
                        <Text style={TradingProductSuggestResultSearchStyle.suggestText}>{`${translate(messages.responsible)} : ${item.employeeName}`}</Text>
                        <Text style={TradingProductSuggestResultSearchStyle.completionDateStyle}>{`${translate(messages.completionDate)} : ${item.endPlanDate}`}</Text>

                      </View>
                      <View style={TradingProductSuggestResultSearchStyle.iconCheckView}>
                        {
                          statusSelectedItem.get(`${item.productId}`) &&
                          <Image style={TradingProductSuggestResultSearchStyle.iconCheck} source={checkedIcon} />
                        }
                        {
                          !statusSelectedItem.get(`${item.productId}`) &&
                          < Image style={TradingProductSuggestResultSearchStyle.iconCheck} source={unCheckedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }
              }
            />
          ) : (
              <View style={TradingProductSuggestResultSearchStyle.errorView}>
                <Text>{translate(responseMessages.ERR_COM_0019).replace('{0}', translate(messages.functionText))}</Text>
              </View>
            )
        }
      </View>
    </View >
  );
}

