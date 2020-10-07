import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { tradingProductsSelector, sortData, fieldInfoProductData } from "./trading-production-selector";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { styles } from "../tab-trading-products/trading-product-style";
import { messages } from "./trading-product-messages";
import { translate } from "../../../../../config/i18n";
import { Icon } from "../../../../../shared/components/icon";
import { TradingActions } from "./trading-products-reducer";
import NumberUtils from "../../../../../shared/util/number-utils";
import { ActivityIndicatorLoading } from "./activity-insicator-loading";
import { ProductTradingActionButton } from "./trading-product-swipe";
import { getTradingProducts, getFieldInfors } from "./trading-production-repository";
import { getCustomerIdSelector, getChildCustomerListSelector } from "../../customer-detail-selector";
import { TEXT_EMPTY } from "../../../../../shared/components/message/message-constants";
import { authorizationSelector } from "../../../../login/authorization/authorization-selector";
import StringUtils from "../../../../../shared/util/string-utils";

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
  // get customer view detail
  const customerID = useSelector(getCustomerIdSelector);
  // get child CustomersList
  const childCustomersList =  useSelector(getChildCustomerListSelector);
  // get fieldInfoProductTranding
  const fieldInfoProductTranding = useSelector(fieldInfoProductData);
  const sort = useSelector(sortData);
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : TEXT_EMPTY;
  // set currentPage
  const [offset, setOffset] = useState(0);
  // set icon loding more data
  const [isLoading, setIsLoading] = useState(false)
  // set message erro
  const [errMessage, setErrMessage] = useState(false);
  const [fieldInfor,setFieldInfor] = useState<FieldInfo[]>([]);
  // limit = 20
  const LIMIT = 20;
  const FieldBelong = 16;
  let arrayCustomer = childCustomersList.concat(customerID);
  // order by default 
  const orderBy = [{
      key: "customer_id",
      value: "ASC",
      fieldType: 99
  }]
  // case of customer display
  const ShowActionTradingProduct = {
    CustomerRegistration: 1,
    ActivityHistory: 2,
    ActivityRegistration: 3,
    ScheduleRegistration: 4,
  }
  /**
   * check color item
   * @param value 
   * @param valueHistory 
   * @param lable 
   */
  const checkColorField = (value: any, valueHistory: string, lable: any) => {
    return fieldInfoProductTranding.filter((item) => {
      if ((StringUtils.getFieldLabel(item, "fieldLabel", languageCode) === lable) && (value > valueHistory)
        && (valueHistory.length > 0) && (checkUndefined(item.forwardColor) != TEXT_EMPTY)) {
        return item.forwardColor;
      } else {
        if ((StringUtils.getFieldLabel(item, "fieldLabel", languageCode) === lable) && (value < valueHistory)
          && (valueHistory != TEXT_EMPTY) && (checkUndefined(item.backwardColor) != TEXT_EMPTY)) {
          return item.backwardColor;
        }
      }
      return "#666666"
    })
  }

  /**
   * 
   * @param value Check label show screen
   */
  const checkFieldLabel =(lable : any, value: any, valueHistory: any) =>{
    return (
        fieldInfor.filter((item)=> StringUtils.getFieldLabel(item,"fieldLabel",languageCode) === lable) ?
        <Text style={[styles.txt,{color: checkColorField(value,valueHistory,lable).toString()}]} numberOfLines={1}>{`${lable} : ${value}`}</Text> : null
    );
  }

  /**
   * swipe item
   */
  const ListAction = {
    data: [
      { id: ShowActionTradingProduct.CustomerRegistration, name: translate(messages.customerRegistration)},
      { id: ShowActionTradingProduct.ActivityHistory, name: translate(messages.activityHistory)},
      { id: ShowActionTradingProduct.ActivityRegistration, name: translate(messages.activityRegistration)},
      { id: ShowActionTradingProduct.ScheduleRegistration, name: translate(messages.scheduleRegistration)},
    ]
  }
  const getFielInfo = async () =>{
    const param: any = {
      fieldBelong: FieldBelong
    };
    const response = await getFieldInfors(param,{});
    if (response) {
      checkResponseFieldInfo(response);
    }
  }
  /**
   * call API getProductTradingTab
   */
  const getTradingProductsNavigation = async (offsets: any) => {
    const param: any = {
      orders: sort.length > 0 ? sort : orderBy,
      offset: offsets,
      limit: LIMIT,
      isOnlyData: true,
      isFirstLoad: true,
      selectedTargetId: 0,
      selectedTargetType: 0,
      customerIdFilters: arrayCustomer
    };
    const dataResponse = await getTradingProducts(param, {});
    setIsLoading(false);
    if (dataResponse) {
      checkResponseData(dataResponse,offsets);
    }
  }

  useEffect(() => {
    //to do call API
    getFielInfo();
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
   * check response from api Field Info
   * @param response data from api
   */
  const checkResponseFieldInfo = (response: any) => {
    if(response?.status === 200){
      setFieldInfor(response.data.fields)
      setErrMessage(false);
    } else {
      setErrMessage(true);
    }
  }

  /**
   * check response from api Data Product Trading
   * @param response data from api
   */
  const checkResponseData = (response: any,offsets: any) => {
    if(response?.status === 200){
      offset === 0 ?
      dispatch(TradingActions.getDataTradingProducts(response.data)) :
      dispatch(TradingActions.addItemLoadmoreProduct(response.data));
      setOffset(offsets + response.data.productTradings.length);
      setErrMessage(false);
    } else {
      setErrMessage(true);
    }
  }
  
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

  /**
   * export data trading product
   * @param item  data detail
   */
  const renderItem = (item: any) => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
        <TouchableOpacity onPress={() => navigation.navigate("trading-product-details", { detail: item })}>
          <View style={styles.tradingItem}>
            <View style={styles.viewLeft}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[styles.txt, { flex: 10 }]} numberOfLines={1}>{checkUndefined(item?.customerName)}</Text>
                <Text style={[styles.txt, { flex: 3 }]} numberOfLines={1}>{`${StringUtils.getFieldLabel(item,"progressName",languageCode)}`}</Text>
              </View>
              <Text style={styles.txtProduct} numberOfLines={1}>{`${checkUndefined(item?.productName)}`}</Text>
              {
                checkFieldLabel(translate(messages.amount),
                (translate(messages.currency)+NumberUtils.autoFormatNumber(`${item?.price}`).toString()),
                checkUndefined(item?.productTradingHistories[0]?.price))
              }
              {
                checkFieldLabel(translate(messages.employeeName), checkUndefined(item?.employee?.employeeName + item?.employee?.employeeSurname), TEXT_EMPTY)
              }
              {
                checkFieldLabel(translate(messages.completionDate),checkUndefined(item?.endPlanDate),checkUndefined(item?.productTradingHistories[0]?.endPlanDate))
              }
            </View>
            <View style={styles.viewRight}>
              <Icon name="arrowRight"/>
            </View>
          </View>
        </TouchableOpacity>
        {ListAction.data.map((item, index: number) => {
          return (
            <ProductTradingActionButton
              key={index}
              name={item.name}
              index={item.id}
            />
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View>
      <View style={styles.price}>
        <TouchableOpacity onPress={()=>navigation.navigate("product-trading-list-sort")}>
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