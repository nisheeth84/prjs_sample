import React, {} from "react";
import { Text, View } from "react-native";
import { CustomerConfirmDialogStyles } from "../list/customer-list-style";
import { translate } from "../../../config/i18n";
import { messages } from "../list/customer-list-messages";
import { useDispatch, useSelector } from "react-redux";
import { customerListActions, GetCustomerParam, GetMessage } from "../list/customer-list-reducer";
import { ListCustomersSelector, statusConfirmSelector, getValueCustomerListSelector, ListMyListSelector, ListSharedSelector, ParamCustomersSelector } from "../list/customer-list-selector";
import { DeleteCustomerOutOfListResponse, ValueCustomerList, DeleteListResponse, ItemMyList, ItemSharedList, RemoveFavouriteListResponse, removeFavouriteList, deleteList, CountRelationCustomerResponse, countRelationCustomer, deleteCustomerOutOfList, customerList, CustomerListResponse, ItemCustomer } from "../list/customer-list-repository";
import { StatusConfirmType, ListType, MessageType, CustomerListApi, SelectedTargetType, Parameters } from "../list/customer-list-enum";
import { drawerLeftActions } from "../drawer/drawer-left-reducer";
import { STATUSBUTTON, TypeButton } from "../../../config/constants/enum";
import { CommonButton } from "../../../shared/components/button-input/button";
import { messagesComon } from "../../../shared/utils/common-messages";
import { format } from "react-string-format";
import { useNavigation } from "@react-navigation/native";

/**
 * Component for show the confirmation dialog
*/

export function CustomerConfirmDialog() {
  
  const dispatch = useDispatch();

  // handled in each specific case
  const paramCustomers = useSelector(ParamCustomersSelector);
  // get list Customers
  const listCustomers  = useSelector(ListCustomersSelector);
  // get status confirm of dialog 
  const statusConfirm  = useSelector(statusConfirmSelector);
  // get value item of mylist/sharelist/listFavourite
  const getValueCustomerList: ValueCustomerList = useSelector(getValueCustomerListSelector);
  // get data listMyList
  const listMyList: Array<ItemMyList> = useSelector(ListMyListSelector);
  // get data listShare
  const navigation = useNavigation();
  const listShareList: Array<ItemSharedList> = useSelector(ListSharedSelector);
  const customers: Array<ItemCustomer> = [];
  const customerIds: number[] = [];
  listCustomers.customers.forEach((item: any) => {
    if(item.select) {
      customers.push(item);
      customerIds.push(item.customerId);
    }
  });
  console.log("customerIds", customerIds);
  let listName = "";
  if (statusConfirm === StatusConfirmType.DeleteList || statusConfirm === StatusConfirmType.DeleteListFavourite) {
    
    if(getValueCustomerList.typeList === ListType.MyList){
      var getIndexListMyList = listMyList.findIndex(obj => obj.listId === getValueCustomerList.listId);
      listName = listMyList[getIndexListMyList].listName;
    }else{
      var getIndexShareList = listShareList.findIndex(obj => obj.listId === getValueCustomerList.listId);
      listName = listShareList[getIndexShareList].listName;
    }
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
   * action handle hide/show ConfirmDelete
   * @param data get status isVisible of popup ConfirmDelete
  */
  const handleIsModalVisibleConfirmDelete = (data: number) => {
    const connection = data;
    dispatch(
      customerListActions.handleIsModalVisibleConfirmDelete({
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
   * action set TitleList
   * @param titleList get title list customers
  */
  const handleSetTitleList = (titleList: string) => {
    const title = titleList;
    dispatch(
      drawerLeftActions.handleSetTitleList({
        titleList: title,
      })
    );
  }

  /**
   * action handle show or hide LastUpdatedDate
   * @param isAutoList get isAutoList of item List
  */
  const handleSetStatusShowLastUpdatedDate = (isAutoList: boolean) => {
    dispatch(
      customerListActions.handleSetStatusShowLastUpdatedDate({
        status: isAutoList,
      })
    );
  }

  /**
   * action handle hide Other
  */
  const handleSetStatusHideActionList = () => {
    dispatch(
      customerListActions.handleSetStatusHideActionList({
      })
    );
  }

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
   * call api CustomerList async
  */
  async function getDataCustomerList() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    const resCustomerList = await customerList({
      mode: CustomerListApi.MODE_OWNER_AND_MEMBER,
      isFavourite: true,
    });
    
    if (resCustomerList) {
      handleResponseCustomerList(resCustomerList);
    }
  }

  /**
   * action handle call api All customers
   * @param selectedTargetType get value selectedTargetType 
  */
  const actionCustomersAll= (selectedTargetType: number) => {
    var param: GetCustomerParam = {
      selectedTargetId: Parameters.SelectedTargetId,
      selectedTargetType: selectedTargetType,
      isUpdateListView: paramCustomers.isUpdateListView,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
  };

  /**
   * action handle The case when manipulating allCustomer
  */
  const allCustomer =() =>{
    let itemActionListUser = [];
    itemActionListUser.push({ id: 1, itemModal: translate(messages.listUserDelete) });
    itemActionListUser.push({ id: 2, itemModal: translate(messages.listUserAddList) });
    itemActionListUser.push({ id: 5, itemModal: translate(messages.listUserCreateList) });
    itemActionListUser.push({ id: 6, itemModal: translate(messages.listUserCreateShareList) });
    const connection = itemActionListUser;
    dispatch(
      customerListActions.handleExplandStatusListUser({
        connection
      })
    );
  }

  /**
   * action handle tap show full customers
   * @param titleList get value titleList customer 
  */
  const actionListAll = (titleList: string) => {
    handleExpland(0);
    actionCustomersAll(SelectedTargetType.CustomerAll);
    allCustomer();
    handleSetTitleList(titleList);
    handleSetStatusShowLastUpdatedDate(false);
    handleSetStatusHideActionList();
  }

  /**
   * call api CountRelationCustomer async
  */
  async function countRelationCustomerRequest() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    const resCountRelationCustomer = await countRelationCustomer({
      customerIds: customerIds
    });
    if (resCountRelationCustomer) {
      handleResponseCountRelationCustomer(resCountRelationCustomer);
    }
  }

  /**
   * action handle delete customer
  */
  const handleDeleteCustomer = () => {
    handleIsDeleteConfirmDialog(false);
    countRelationCustomerRequest();
  }

  /**
   * call api deleteCustomerOutOfList async
  */
  async function deleteCustomerOutOfListRequest() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    const resDeleteCustomerOutOfList = await deleteCustomerOutOfList({
      customerListId: getValueCustomerList.listId,
      customerIds: customerIds,
    });
    if (resDeleteCustomerOutOfList) {
      handleResponseDeleteCustomerOutOfList(resDeleteCustomerOutOfList);
    }
  }

  /**
   * action handle delete customer in list
  */
  const handleDeleteCustomerInList = () => {
    handleIsDeleteConfirmDialog(false);
    deleteCustomerOutOfListRequest();
    handleExpland(0);
  }

  /**
   * call api deleteListRequest async
  */
  async function deleteListRequest() {
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    handleSetIsShowMessage(MessageType.DEFAULT);
    const resDeleteListRequest = await deleteList({
      customerListId: getValueCustomerList.listId
    });
    if (resDeleteListRequest) {
      handleResponseDeleteList(resDeleteListRequest);
    }
  }

  /**
   * action handle delete list
  */
  const handleDeleteList = () => {
    deleteListRequest();
    handleIsDeleteConfirmDialog(false);
    handleStatusConfirm(StatusConfirmType.NoManipulation);
    actionListAll(translate(messages.confirmDeleteTitleAllCustomers));
  }

  /**
   * call api removeFavouriteListRequest async
  */
  async function removeFavouriteListRequest() {
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    handleSetIsShowMessage(MessageType.DEFAULT);
    const resRemoveFavouriteListRequest = await removeFavouriteList({
      customerListId: getValueCustomerList.listId,
    });
    if (resRemoveFavouriteListRequest) {
      handleResponseRemoveFavouriteList(resRemoveFavouriteListRequest);
    }
  }

  /**
   * action handle delete list Favourite
  */
  const handleDeleteListFavourite = () => {
    handleIsDeleteConfirmDialog(false);
    removeFavouriteListRequest();
    handleStatusConfirm(StatusConfirmType.NoManipulation);
    actionListAll(translate(messages.confirmDeleteTitleAllCustomers));
  }

  /**
   * action handle cancel confirm
  */		
  const handleCancelConfirm = () => {
      handleIsDeleteConfirmDialog(false);
      handleExpland(0);
  };

  /**
   * action handle confirm 
  */	
  const handleConfirm = () => {
    if(statusConfirm === StatusConfirmType.DeleteCustomer){
      handleDeleteCustomer();
    }else if(statusConfirm === StatusConfirmType.DeleteCustomerInList) {
      console.log("handleConfirm handleDeleteCustomerInList");
      handleDeleteCustomerInList();
    }else if (statusConfirm === StatusConfirmType.DeleteList) {
      handleDeleteList();
    }else if(statusConfirm === StatusConfirmType.DeleteListFavourite) {
      handleDeleteListFavourite();
    }
  }

  /**
   * action handle SetIsSuccess
   * @param type get type message
  */
  const handleSetIsShowMessage = (type: number) => {
    dispatch(
      customerListActions.handleSetIsShowMessage({
        isMessage : type
      })
    );
  }

  /**
   * action handle response CountRelationCustomer
   * @param response CountRelationCustomerListResponse
  */
 const handleResponseCountRelationCustomer = (response: CountRelationCustomerResponse) => {
    if (response.status == 200) {
      if(response.data.listCount.length > 0){
        dispatch(customerListActions.getListCountRelationCustomer(response.data));
        handleIsModalVisibleConfirmDelete(1);
      }else{
        handleIsModalVisibleConfirmDelete(0);
      }
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
      handleIsModalVisibleConfirmDelete(0);
    }
  };

  /**
   * action handle response DeleteCustomerOutOfList
   * @param response DeleteCustomerOutOfListResponse
  */
  const handleResponseDeleteCustomerOutOfList = (response: DeleteCustomerOutOfListResponse) => {
    if (response.status == 200) {
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0005),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
      var param: GetCustomerParam = {
        selectedTargetId: paramCustomers.selectedTargetId,
        selectedTargetType: paramCustomers.selectedTargetType,
        isUpdateListView: paramCustomers.isUpdateListView,
        searchConditions: paramCustomers.searchConditions,
        filterConditions: paramCustomers.filterConditions,
        localSearchKeyword: paramCustomers.localSearchKeyword,
        orderBy: paramCustomers.orderBy,
        offset: 0,
        limit: paramCustomers.limit,
      }
      dispatch(customerListActions.setParamCustomers(param));
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
    }
  };

  /**
   * action handle respone DeleteList
   * @param response DeleteListResponse
  */
  const handleResponseDeleteList = (response: DeleteListResponse) => {
    if (response.status == 200) {
      getDataCustomerList();
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0005),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
      navigation.navigate("customer-list");
    }
  };

  /**
   * action handle respone RemoveFavouriteList
   * @param response RemoveFavouriteListResponse
  */
  const handleResponseRemoveFavouriteList = (response: RemoveFavouriteListResponse) => {
    if (response.status == 200) {
      getDataCustomerList();
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0005),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
    }
  };

  /**
   * action handle respone CustomerList
   * @param response CustomerListResponse
  */
  const handleResponseCustomerList = (response: CustomerListResponse) => {
    if (response.status == 200) {
      dispatch(customerListActions.getCustomerList(response.data));
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
    }
  };

  return (
    <View style={CustomerConfirmDialogStyles.viewModal}>
      <View style={CustomerConfirmDialogStyles.modalContentConfirmDelete}>
        <View style={CustomerConfirmDialogStyles.modalContentConfirmDeleteTitle}>
          <Text style={CustomerConfirmDialogStyles.modalContentConfirmTitle}>{translate(messages.deleteConfirmTitleModal)}</Text>
          {(statusConfirm === StatusConfirmType.DeleteCustomer || statusConfirm === StatusConfirmType.DeleteCustomerInList) ? (
            (customers.length === 1) ?
              <Text style={CustomerConfirmDialogStyles.modalContentConfirmMessage}> {format(translate(messagesComon.WAR_COM_0001), ...[customers[0].customerName])}</Text>
              :
              <Text style={CustomerConfirmDialogStyles.modalContentConfirmMessage}> {format(translate(messagesComon.WAR_COM_0002), ...[customers.length])}</Text>
          ) : (
              <Text style={CustomerConfirmDialogStyles.modalContentConfirmMessage}>{format(translate(messagesComon.WAR_COM_0001), ...[listName])}</Text>
            )
          }
        </View>
        <View style={CustomerConfirmDialogStyles.modalContentConfirmDeleteButton}>
          <CommonButton onPress={() => handleCancelConfirm()} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.cancelDelete)} typeButton={TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
          <CommonButton onPress={handleConfirm} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.confirmDelete)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
        </View>
      </View>
    </View>
  );
}