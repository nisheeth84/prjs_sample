import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { EmployeeListSortStyles, SelectOrderSortStyes } from "./employee-list-style";
import { Icon } from '../../../shared/components/icon';
import { messages } from './employee-list-messages';
import { translate } from '../../../config/i18n';
import { useNavigation } from "@react-navigation/native";
import { conditionSelector, filterSelector } from "./employee-list-selector";
import { useSelector, useDispatch } from "react-redux";
import { Order } from "../employees-repository";
import {
  filterEmployee,
} from '../../../shared/utils/common-api';
import { KEY_SORT, FIELD_TYPE, TYPE_SORT, TYPE_SORT_NUMBER, INDEX_SORT } from "./employee-list-constants";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { OrderSelect } from "./button-sort";
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
 * Sort screen
 */
export const EmployeeListSortScreen = () => {
  const dispatch = useDispatch();
  const conditonEmployeeSelector = useSelector(conditionSelector);
  const [selectSort, setSelectSort] = useState(TYPE_SORT_NUMBER.TYPE_ASC);
  const [itemChecked, setItemChecked] = useState(INDEX_SORT.NONE_SORT);
  const navigator = useNavigation();
  const employeesFilter = useSelector(filterSelector);

  // Initialize listItem
  const [listItem] = useState<ListItem[]>(
    [
      {
        itemName: translate(messages.employeeNameSortScreen)
      },
      {
        itemName: translate(messages.employeeCreateDateSortScreen)
      },
      {
        itemName: translate(messages.employeeLastUpdateSortScreen)
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
    let orderBy: Order[] = [];
    let sort = selectSort === TYPE_SORT_NUMBER.TYPE_ASC ? TYPE_SORT.TYPE_ASC : TYPE_SORT.TYPE_DESC
    switch (itemChecked) {
      case INDEX_SORT.SORT_NAME:
        orderBy.push({
          key: KEY_SORT.SORT_NAME,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_EMPLOYEE_NAME
        })
        break;
      case INDEX_SORT.SORT_CREATE_DATE:
        orderBy.push({
          key: KEY_SORT.SORT_CREATE_DATE,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_DATE
        })
        break;
      case INDEX_SORT.SORT_UPDATE_DATE:
        orderBy.push({
          key: KEY_SORT.SORT_UPDATE_DATE,
          value: sort,
          fieldType: FIELD_TYPE.FIELD_TYPE_DATE
        })
        break;
      default:
        break;
    }
    setItemChecked(INDEX_SORT.NONE_SORT);
    // Call back employee
    filterEmployee(conditonEmployeeSelector.selectedTargetType,
      conditonEmployeeSelector.selectedTargetId,
      conditonEmployeeSelector.isUpdateListView,
      conditonEmployeeSelector.searchConditions,
      conditonEmployeeSelector.filterConditions,
      conditonEmployeeSelector.localSearchKeyword,
      orderBy,
      dispatch,
      {
        offset: 0,
        limit: employeesFilter.limit,
        filterType: employeesFilter.filterType
      }
    )
    // back list employee screen
    navigator.goBack();
  }
  useEffect(() => {
    if (conditonEmployeeSelector?.orderBy !== []) {
      switch (conditonEmployeeSelector.orderBy[0]?.key) {
        case KEY_SORT.SORT_NAME:
          setItemChecked(INDEX_SORT.SORT_NAME);
          break;
        case KEY_SORT.SORT_CREATE_DATE:
          setItemChecked(INDEX_SORT.SORT_CREATE_DATE);
          break;
        case KEY_SORT.SORT_UPDATE_DATE:
          setItemChecked(INDEX_SORT.SORT_UPDATE_DATE);
          break;
        default:
          break;
      }
      if (conditonEmployeeSelector.orderBy[0]?.value.toUpperCase() === TYPE_SORT.TYPE_ASC) {
        setSelectSort(TYPE_SORT_NUMBER.TYPE_ASC);
      } else {
        setSelectSort(TYPE_SORT_NUMBER.TYPE_DESC);
      }
    }
  }, []);
  return (
    <SafeAreaView style={EmployeeListSortStyles.container}>
      <AppbarCommon
      title={translate(messages.employeeSortTitle)}
      buttonText={translate(messages.employeeSortApplyButton)}
      buttonType="complete"
      leftIcon="sortClose"
      handleLeftPress={() => navigator.goBack()}
      onPress={hanldeApplySort}
    />

      <View style={EmployeeListSortStyles.sortbar}>
        <Text style={EmployeeListSortStyles.lableSort}>{translate(messages.employeeSortOrderTitle)}</Text>
        <OrderSelect
          active={selectSort === TYPE_SORT_NUMBER.TYPE_ASC}
          text={`${translate(messages.employeeAscendOrder)}`}
          iconName="up"
          textStyle={[SelectOrderSortStyes.boldTextButton]}
          containerStyle={[SelectOrderSortStyes.orderSelect]}
          handleChooseOrder={() => hanldSelectSort(TYPE_SORT_NUMBER.TYPE_ASC)}
        />
        <OrderSelect
          active={selectSort === TYPE_SORT_NUMBER.TYPE_DESC}
          text={`${translate(messages.employeeDescendOrder)}`}
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
              {itemChecked === index ? <Icon name="checkedGroupItem" style={EmployeeListSortStyles.sortIconCheck} /> :
                <Icon name="unCheckGroupItem" style={EmployeeListSortStyles.sortIconCheck} />}
            </TouchableOpacity>
          ))
        }
      </View>
    </SafeAreaView>
  )
}