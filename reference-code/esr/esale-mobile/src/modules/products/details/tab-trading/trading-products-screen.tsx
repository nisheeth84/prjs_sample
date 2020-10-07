import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { tradingProductsSelector, sortData } from "./trading-production-selector";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "./trading-product-style";
import { messages } from "./trading-product-messages";
import { translate } from "../../../../config/i18n";
import { Icon } from "../../../../shared/components/icon";
import { TradingActions } from "./trading-products-reducer";
import NumberUtils from "../../../../shared/util/number-utils";
import { ActivityIndicatorLoading } from "./activity-insicator-loading";
import { getTradingProducts } from "./trading-production-repository";
import StringUtils from "../../../../shared/util/string-utils";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import { getProductID } from "../../list/product-list-selector";

export interface FieldInfo {
  fieldId: any;
  fieldName: any;
  fieldType: any;
  fieldOrder: any;
  fieldLabel: any;
  isDefault: any;
}
/**
 * Function Tab Trading Product
 */
export const TradingProduction = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // get Data 
  const data = useSelector(tradingProductsSelector);
  // get fieldInfoProductTranding
  const sort = useSelector(sortData);
  //get product ID
  const productID = useSelector(getProductID);
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : TEXT_EMPTY;
  // set currentPage
  const [offset, setOffset] = useState(0);
  // set icon loding more data
  const [isLoading, setIsLoading] = useState(false)
  // set message erro
  const [errMessage, setErrMessage] = useState(false);
  // limit = 20
  const LIMIT = 20;


  /**
   * call API getProductTradingTab
   */
  const getTradingProductsNavigation = async (offsets: any) => {
    const param: any = {
      orders: sort,
      offset: offsets,
      limit: LIMIT,
      isOnlyData: true,
      isFirstLoad: true,
      selectedTargetId: 0,
      selectedTargetType: 0,
      productIdFilters:[{productID}]
    };
    const dataResponse = await getTradingProducts(param, {});
    setIsLoading(false);
    if (dataResponse) {
      checkResponseData(dataResponse,offsets);
    }
  }

  useEffect(() => {
    //to do call API
    getTradingProductsNavigation(0);
    
  }, [sort]);

  /**
   * check undedined value
   * @param value 
   */
  const checkUndefined =(value:any)=>{
    return (value===undefined || value===null) ? TEXT_EMPTY : value;
  }

  /**
   * check response from api Data Product Trading
   * @param response data from api
   */
  const checkResponseData = (response: any, offsets: any) => {
    if (response?.status === 200) {
      offset === 0 ?
      dispatch(TradingActions.getDataTradingProducts(response.data)) :
      dispatch(TradingActions.addItemLoadmoreProduct(response.data));
      setOffset(offsets + response.data.productTradings.length);
      setErrMessage(false);
    } else {
      setErrMessage(true);
    }
  };

  /**
   * action load more flatlist
   */
  const handleLoadMore = () => {
    setIsLoading(true);
    if (!isLoading) {
      //todo load more API
      setTimeout(() => {
        getTradingProductsNavigation(offset);
        setIsLoading(false);
      }, 1000);
    }
  }

  // sum total amount price
  let sum = data.reduce(function (prev, curent) {
    return prev + curent.price

  }, 0);

  /**
   * export data trading product
   * @param item  data detail
   */
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("trading-product-details-product", { detail: item })}>
        <View style={styles.tradingItem}>
          <View style={styles.viewLeft}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.textTotal, { flex: 10 }]} numberOfLines={1}>{checkUndefined(item?.customerName)}</Text>
            </View>
            <Text style={styles.txt} numberOfLines={1}>{`${translate(messages.completionDate)} : ${checkUndefined(item.endPlanDate)}`}</Text>
            <Text style={styles.txt} numberOfLines={1}>{`${translate(messages.amount)} : ${NumberUtils.autoFormatNumber(`${item.price}`)}${translate(messages.currencyMoney)}`}</Text>
          </View>
          <View style={styles.viewRight}>
            <Text style={styles.txtProcessName} numberOfLines={1}>{`${StringUtils.getFieldLabel(item, "progressName", languageCode)}`}</Text>
            <View style={styles.iconArrowRight} >
              <Icon name="arrowRight" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <View style={styles.price}>
        <Text style={styles.textTotal} numberOfLines={1}>{`${translate(messages.total)} : ${sum}`}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("trading-product-sort-product")}>
          <Icon name="descending"></Icon>
        </TouchableOpacity>
      </View >
      {errMessage &&
        <Text style={styles.txtPrice}>{translate(messages.messagesErr)}</Text>}
      <View>
        <FlatList
          data={data}
          ListFooterComponent={ActivityIndicatorLoading(isLoading)}
          renderItem={(pram) => renderItem(pram.item)}
          keyExtractor={(pram, index) => `${pram.productsTradingsId}` + index}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1} 
          removeClippedSubviews ={false}/>
      </View>
    </View>
  );
}