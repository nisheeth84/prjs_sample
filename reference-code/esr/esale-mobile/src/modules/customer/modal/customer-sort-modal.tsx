import React, { useState } from "react";
import { Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CustomerSortModalStyles } from "../list/customer-list-style";
import { Icon } from "../../../shared/components/icon";
// import { SafeAreaView } from "react-native-safe-area-context";
import { translate } from "../../../config/i18n";
import { messages } from "../list/customer-list-messages";
import { customerListActions, GetCustomerParam } from "../list/customer-list-reducer";
import { SortTypeDataListSelector, getValueCustomerListSelector, SortTypeAscOrDescSelector, ParamCustomersSelector } from "../list/customer-list-selector";
import { ItemSortTypeData, ValueCustomerList } from "../list/customer-list-repository";
import { CustomerSortModalItem } from "./customer-sort-modal-item";
import { CommonButton } from "../../../shared/components/button-input/button";
import { STATUSBUTTON, TypeButton } from "../../../config/constants/enum";
import { SortDataType } from "../list/customer-list-enum";
import { OrderSelect } from "./customer-sort-order-select";
import { SelectOrderSortStyes } from "./customer-modal-style";

/**
 * Component for show popup Manipulation List
*/

export function CustomerSortModal() {
  
  const dispatch = useDispatch();

  // get list sort type data
  const sortTypeDataList: Array<ItemSortTypeData>= useSelector(SortTypeDataListSelector); 
  // get status sort type Asc or Desc
  const statusSortTypeOption = useSelector(SortTypeAscOrDescSelector);
  // get sort ASC or DESC
  const [sortAscOrDesc, setSortAscOrDesc] = useState(statusSortTypeOption);
  // get value item type of CustomerAll, CustomerInCharge, CustomerFavouriteList, CustomerMyList, CustomerShareList
  const getValueCustomerList: ValueCustomerList = useSelector(getValueCustomerListSelector);
  // handled in each specific case
  const paramCustomers = useSelector(ParamCustomersSelector);

  /**
   * action handle hide/show screen Sort
   * @param isVisible get status isVisible of screen Sort
  */
  
  const handleIsVisibleSort = (isVisible: boolean) => {
    const status = isVisible;
    dispatch(
      customerListActions.handleIsVisibleSort({
        isModalVisible: status
      })
    );
  }

  /**
   * action handle set option Asc or Desc
   * @param typeSort type sort Asc or Desc
  */
  const handleOptionAscOrDesc = (typeSort: string) => {
    dispatch(
      customerListActions.handleOptionAscOrDesc({
        typeSort: typeSort
      })
    );
  }


  const handleSortClosed = () => {
    handleIsVisibleSort(false);
  }

  const handleSortFinish = () => {
    const selectedTargetType = getValueCustomerList.selectedTargetType;
    const selectedTargetId = getValueCustomerList.listId;
    let orderBy: Array<any> = [];
    let OrderByParam: any = {}
    sortTypeDataList.forEach((item) => {
      if(item.selected) {
        if(item.id === SortDataType.CUSTOMER_PARENT){
          OrderByParam.fieldType = 99;
          OrderByParam.key = "customer_parent";
        }else if (item.id === SortDataType.CUSTOMER_NAME){
          OrderByParam.fieldType = 9;
          OrderByParam.key = "customer_name";
        }else if (item.id === SortDataType.CUSTOMER_ADDRESS){
          OrderByParam.fieldType = 14;
          OrderByParam.key = "customer_address";
        }else if (item.id === SortDataType.CREATED_DATE){
          OrderByParam.fieldType = 7;
          OrderByParam.key = "created_date";
        }else if (item.id === SortDataType.UPDATED_DATE){
          OrderByParam.fieldType = 7;
          OrderByParam.key = "updated_date";
        }
        OrderByParam.value = sortAscOrDesc;
      }
    });
    if(Object.keys(OrderByParam).length) {
      handleOptionAscOrDesc(sortAscOrDesc);
      orderBy.push(OrderByParam)

      var param: GetCustomerParam = {
        selectedTargetId: selectedTargetId,
        selectedTargetType: selectedTargetType,
        isUpdateListView: paramCustomers.isUpdateListView,
        searchConditions: paramCustomers.searchConditions,
        filterConditions: paramCustomers.filterConditions,
        localSearchKeyword: "",
        orderBy: orderBy,
        offset: 0,
        limit: paramCustomers.limit,
      }
      dispatch(customerListActions.setParamCustomers(param));
      handleIsVisibleSort(false);
    }
  }

  return ( 
    <SafeAreaView style={CustomerSortModalStyles.modalContainerContentDelete}>
      <View style={CustomerSortModalStyles.viewContentHeader}>
        <TouchableOpacity style={CustomerSortModalStyles.viewContentButtonClose} onPress={handleSortClosed}>
          <Icon name="sortClose" />
        </TouchableOpacity>
        <View>
          <Text style={CustomerSortModalStyles.viewContentTitle}>{translate(messages.titleSort)}</Text>
        </View>
        <View>
            <CommonButton onPress= {handleSortFinish} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.rightDone)} typeButton = {TypeButton.BUTTON_SUCCESS}></CommonButton>
        </View>
      </View>

      <View style={CustomerSortModalStyles.viewContentSortAscAndDesc}>
        <View>
          <Text style={CustomerSortModalStyles.viewContentSortAscAndDescText}>{translate(messages.titleSortOrder)}</Text>
        </View>
        <View style={CustomerSortModalStyles.viewContentSortAscAndDescViewButton}>
          <OrderSelect
            active={sortAscOrDesc === "ASC"}
            text={`${translate(messages.titleSortAscOrder)}`}
            iconName="up"
            textStyle={[SelectOrderSortStyes.boldTextButton]}
            containerStyle={[SelectOrderSortStyes.orderSelect]}
            handleChooseOrder={() => setSortAscOrDesc("ASC")}
          />
          <OrderSelect
            active={sortAscOrDesc === "DESC"}
            text={`${translate(messages.titleSortDescOrder)}`}
            iconName="down"
            textStyle={[SelectOrderSortStyes.boldTextButton]}
            containerStyle={[SelectOrderSortStyes.orderSelect]}
            handleChooseOrder={() => setSortAscOrDesc("DESC")}
          />
        </View>
      </View>
      <View style={CustomerSortModalStyles.viewContentSortDivide}></View>
      {sortTypeDataList.map((item, index) =>  {
        return (
          <CustomerSortModalItem
            key={item.id}
            index={index}
            data={item}
          />
        );
      })}
    </SafeAreaView>
  );
}