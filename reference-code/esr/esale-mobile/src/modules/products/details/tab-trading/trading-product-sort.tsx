import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Icon } from '../../../../shared/components/icon';
import { translate } from '../../../../config/i18n';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AppbarCommon } from "../../../../shared/components/appbar/appbar-common";
import { TYPE_SORT_NUMBER, TYPE_SORT } from "../../../employees/list/employee-list-constants";
import { OrderSelect } from "../../../employees/list/button-sort";
import { TradingActions } from "./trading-products-reducer";
import { EmployeeListSortStyles, SelectOrderSortStyes } from "../../../employees/list/employee-list-style";
import { messages } from "./trading-product-messages";
/**
 * Define interface ListItem
 */
export interface ListItem {
  itemName: string;
}
export interface ListSort {
  sortName: string;
}

/**
 * Define key sort
 */
export const KEY_SORT = {
  SORT_NAME: "customer_Id",
  SORT_CREATE_USER: "created_user",
  SORT_UPDATE_USER: "updated_user",
  PRODUCT_ID:"product_id",
  PRODUCT_TRADING_PROCESS_ID: "product_trading_progress_id",
  EMPLOYEE_ID: "employee_id"
}
   /**
   * Define key sort
   */
  export const INDEX_SORT = {
    NONE_SORT: -1,
    SORT_NAME: 0,
    PRODUCT_ID:1,
    PRODUCT_TRADING_PROCESS_ID:2,
    EMPLOYEE_ID: 3,
    SORT_CREATE_USER: 4,
    SORT_UPDATE_USER: 5
  }
/**
* Define field type
*/
export const FIELD_TYPE = {
    FIELD_TYPE_CUSTOMER_NAME: 9,
    FIELD_TYPE_DATE: 7,
    FIELD_TYPE_PRODUCT: 1
  }
/**
 * Sort screen
 */
export const ProductTradingSortScreen = () => {
  const dispatch = useDispatch();
  const [selectSort, setSelectSort] = useState(TYPE_SORT_NUMBER.TYPE_ASC);
  const [itemChecked, setItemChecked] = useState(INDEX_SORT.NONE_SORT);
  const navigator = useNavigation();

  // Initialize listItem
  const [listItem] = useState<ListItem[]>(
    [
      {
        itemName: translate(messages.customerName)
      },
      {
        itemName: translate(messages.customerProductID)
      },
      {
        itemName: translate(messages.customerProductTradingProcess)
      },
      {
        itemName: translate(messages.customerEmployeeID)
      },
      {
        itemName: translate(messages.customerCreateUser)
      },
      {
        itemName: translate(messages.customerUpdateUser)
      }
    ]
  )
  /**
   *  Click button ASC or DESC
   * @param buttonSort
   */
  const hanldSelectSort = (buttonSort: number) => {
    setSelectSort(buttonSort);
  }
  /**
   * Add position selected to itemChecked
   * @param position 
   */
  const handleSelect = (position: number) => {
    itemChecked === position ? setItemChecked(-1) : setItemChecked(position);
  }
  /**
   * Proccessing button Apply
   */
  const hanldeApplySort = () => {
    let sort = selectSort === TYPE_SORT_NUMBER.TYPE_ASC ? TYPE_SORT.TYPE_ASC : TYPE_SORT.TYPE_DESC
    switch (itemChecked) {
      case INDEX_SORT.SORT_NAME:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.SORT_NAME,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_CUSTOMER_NAME
        }]))
        break;
      case INDEX_SORT.PRODUCT_ID:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.PRODUCT_ID,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_CUSTOMER_NAME
        }]))
        break;
      case INDEX_SORT.PRODUCT_TRADING_PROCESS_ID:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.PRODUCT_TRADING_PROCESS_ID,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_PRODUCT
        }]))
        break;
      case INDEX_SORT.EMPLOYEE_ID:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.EMPLOYEE_ID,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_CUSTOMER_NAME
        }]))
        break;
      case INDEX_SORT.SORT_CREATE_USER:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.SORT_CREATE_USER,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_CUSTOMER_NAME
        }]))
        break;
      case INDEX_SORT.SORT_UPDATE_USER:
        dispatch(TradingActions.getSortData([{
          key: KEY_SORT.SORT_UPDATE_USER,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_CUSTOMER_NAME
        }]))
        break;
      default:
        break;
    }
    setItemChecked(INDEX_SORT.NONE_SORT);
    // back list employee screen
    navigator.goBack();
  }

  return (
    <SafeAreaView style={EmployeeListSortStyles.container}>
      <AppbarCommon
        title={translate(messages.customerSortTitle)}
        buttonText={translate(messages.customerSortApplyButton)}
        buttonType="complete"
        leftIcon="sortClose"
        handleLeftPress={() => navigator.goBack()}
        onPress={hanldeApplySort}
      />

      <View style={EmployeeListSortStyles.sortbar}>
        <Text style={EmployeeListSortStyles.lableSort}>{translate(messages.customerSortOrderTitle)}</Text>
        <OrderSelect
          active={selectSort === TYPE_SORT_NUMBER.TYPE_ASC}
          text={`${translate(messages.customerAscendOrder)}`}
          iconName="up"
          textStyle={[SelectOrderSortStyes.boldTextButton]}
          containerStyle={[SelectOrderSortStyes.orderSelect]}
          handleChooseOrder={() => hanldSelectSort(TYPE_SORT_NUMBER.TYPE_ASC)}
        />
        <OrderSelect
          active={selectSort === TYPE_SORT_NUMBER.TYPE_DESC}
          text={`${translate(messages.customerDescendOrder)}`}
          iconName="down"
          textStyle={[SelectOrderSortStyes.boldTextButton]}
          containerStyle={[SelectOrderSortStyes.orderSelect]}
          handleChooseOrder={() => hanldSelectSort(TYPE_SORT_NUMBER.TYPE_DESC)}
        />
      </View>
      <View style={EmployeeListSortStyles.dive}></View>
      <View>
        {
          listItem.map((itemSelect: ListItem, index: number) => (
            <TouchableOpacity
              onPress={() => handleSelect(index)}
              style={EmployeeListSortStyles.wrapGroupItem}>
              <Text style={EmployeeListSortStyles.contentStyle}>
                {itemSelect.itemName}
              </Text>
              {itemChecked === index ? <Icon key ={index} name="checkedGroupItem" style={EmployeeListSortStyles.sortIconCheck} /> :
                <Icon key ={index} name="unCheckGroupItem" style={EmployeeListSortStyles.sortIconCheck} />}
            </TouchableOpacity>
          ))
        }
      </View>
    </SafeAreaView>
  )
}