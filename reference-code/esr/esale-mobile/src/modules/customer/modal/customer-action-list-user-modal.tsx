import React, {} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ModalStyles } from "../list/customer-list-style";
import { ListCustomersSelector, getValueCustomerListSelector, listFilterItemModalActionListUser } from "../list/customer-list-selector";
import { useSelector, useDispatch } from "react-redux";
import { customerListActions } from "../list/customer-list-reducer";
import { ValueCustomerList, TaskItemModalActionListUser } from "../list/customer-list-repository";
import { useNavigation } from "@react-navigation/native";
import { PopupActionValueCustomer, StatusConfirmType } from "../list/customer-list-enum";
import { TypeActionListShareCustomer } from "../../../config/constants/enum";

/**
 * Component for show popup list action customer
*/

export function CustomerActionListUser() {
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // get cate popup action ListCustomers
  const listFilterModalListUser: Array<TaskItemModalActionListUser> = useSelector(listFilterItemModalActionListUser);
  // get list Customers
  const listCustomers  = useSelector(ListCustomersSelector);
  // get value item of mylist/sharelist/listFavourite
  const getValueCustomerList:ValueCustomerList = useSelector(getValueCustomerListSelector);

  /**
     * action handle set status confirm delete
     * @param data get type confirm delete list and customer 
    */
  const handleStatusConfirm = (data: number) => {
    const connection = data;
    dispatch(
      customerListActions.handleStatusConfirm({
        connection
      })
    );
  }


  /**
   * action handle set status select
   * @param data get all initial state and select of customers
  */
  const handleExpland = (data: number) => {
    const connection = data;
    dispatch(
      customerListActions.handleExpland({
        connection
      })
    );
  }

  /**
   * action handle hide/show Categories of popup from local navigation
   * @param isVisible get status isVisible of popup from local navigation
  */
  const handleIsModalVisibleActionListUser = (isVisible: boolean) => {
    const status = isVisible;
    dispatch(
      customerListActions.handleIsModalVisibleActionListUser({
        isModalVisible: status
      })
    );
  }			
  
  /**
   * action handle hide/show dialog confirmation
   * @param isVisible get status isVisible of dialog confirmation
  */
  const handleIsDeleteConfirmDialog = (isVisible: boolean) => {
    const status = isVisible;
    dispatch(
      customerListActions.handleIsDeleteConfirmDialog({
        isModalVisible: status
      })
    );
  }

  /**
   * action Item handle action of modal with ListCustomers
   * @param data get status type handle of modal
  */
  const handleModalListUser = (data: number) => {
   
    var customerIds: number[] = [];
    listCustomers.customers.forEach((item) => {
      if(item.select) {
        customerIds.push(item.customerId);
      }
    });

    if(data === PopupActionValueCustomer.DeleteCustomer) {
      handleStatusConfirm(StatusConfirmType.DeleteCustomer);
      confirmDelete();
    }else if(data === PopupActionValueCustomer.AddList || data === PopupActionValueCustomer.MoveList) {
      let paramNavigation: any = {
        listId: getValueCustomerList.listId,
        typeList: getValueCustomerList.typeList,
        isAutoList: getValueCustomerList.isAutoList,
        status: true,
        listIdCustomer: customerIds,
        statusScreen: true
      };
      handleIsModalVisibleActionListUser(false);
      handleExpland(0);
      if (data === PopupActionValueCustomer.AddList) {
        return (       
          navigation.navigate("customer-add-to-list", paramNavigation) 
        )
      }else{
        return (        
          navigation.navigate("customer-move-to-list", paramNavigation)
        )
      }
    }else if(data === PopupActionValueCustomer.DeleteList) {
      handleStatusConfirm(StatusConfirmType.DeleteCustomerInList);
      confirmDelete();
    }else if(data === PopupActionValueCustomer.CreateMyList || data === PopupActionValueCustomer.CreateShareList) {
      let paramNavigation = {
        status: true,
        listIdCustomer: customerIds,
      };
      handleIsModalVisibleActionListUser(false);
      handleExpland(0);
      if (data === PopupActionValueCustomer.CreateMyList) {
        return (
          navigation.navigate("customer-my-list-navigator", paramNavigation)
        );
      }else{
        console.log("add",customerIds);
        return (
          navigation.navigate("customer-share-list-navigator", {typeActionListShare: TypeActionListShareCustomer.ADD, listCustomerPicked:[...customerIds] })
        );
      }
    }
  }

  /**
   * action show dialog confirm delete
  */
  const confirmDelete = () => {
    handleIsModalVisibleActionListUser(false);
    setTimeout(function(){
      handleIsDeleteConfirmDialog(true);
    },500)
  }

  /**
   * action handle SetIsSuccess
   * @param type get type message
  */
  // const handleSetIsShowMessage = (type: number) => {
  //   dispatch(
  //     customerListActions.handleSetIsShowMessage({
  //       isMessage : type
  //     })
  //   );
  // }

  /**
   * action handle response MoveCustomersToOtherList
   * @param response MoveCustomersToOtherListResponse
  */
  // const handleResponseMoveCustomersToOtherList = (response: MoveCustomersToOtherListResponse) => {
  //   handleSetIsShowMessage(MessageType.DEFAULT);
  //   dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
  //   if (response.status == 200) {
  //     dispatch(customerListActions.moveCustomersToOtherList(response.data?.data?.customerListMemberIds));
  //   }else{
  //     handleSetIsShowMessage(MessageType.ERROR);
  //     dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
  //   }
  // };
 
  return (
    <View>
      {listFilterModalListUser.map((item, index) => {
          return (
            <View style={[ModalStyles.viewModal, index === 0  && ModalStyles.viewModalRemoveBorderTop]} key={index}>
              <TouchableOpacity style={ModalStyles.viewModalTouchableOpacity} onPress={() => handleModalListUser(item.id)}>
                <Text style={ModalStyles.textButtonModal}>{item.itemModal}</Text>
              </TouchableOpacity>
            </View>
          );
      })}
    </View>
  );
}