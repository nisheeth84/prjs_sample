import React, {} from "react";
import { Text, View, ScrollView } from "react-native";
import { ListCountRelationCustomer, ListCustomersSelector, ParamCustomersSelector } from "../list/customer-list-selector";
import { useDispatch, useSelector } from "react-redux";
import { CustomerListStyles } from "../list/customer-list-style";
import { customerListActions, GetCustomerParam, GetMessage } from "../list/customer-list-reducer";
import { DeleteCustomersResponse, deleteCustomers, ListCount } from "../list/customer-list-repository";
import { translate } from "../../../config/i18n";
import { messages } from "../list/customer-list-messages";
import { CommonButton } from "../../../shared/components/button-input/button";
import { STATUSBUTTON, TypeButton } from "../../../config/constants/enum";
import { MessageType } from "../list/customer-list-enum";
import { messagesComon } from "../../../shared/utils/common-messages";

interface CustomerConfirmDeleteProp{
  listRelation?: ListCount;
  handleDelete?: () => void;
  closePopup?: () => void;
}
/*
 * Component for show popup confirm delete
*/

export function CustomerConfirmDelete({listRelation,handleDelete,closePopup}:CustomerConfirmDeleteProp) {

  const dispatch = useDispatch();
  // get list count relation customer
  const listCountRelationCustomer = useSelector(ListCountRelationCustomer);
  // get list Customers
  const listCustomers  = useSelector(ListCustomersSelector);
  // handled in each specific case
  const paramCustomers = useSelector(ParamCustomersSelector);
  /**
   * action handle cancel confirm delete
  */		
  const handleCancelConfirmDelete = () => {
    if (closePopup) {
      closePopup();
      return;
    }
    handleIsModalVisibleConfirmDelete(0);
    handleExpland(0);
  };
  
  /**
   * action handle confirm delete
  */	
  const handleConfirmDelete = async () => {
    if (handleDelete) {
      handleDelete();
      return;
    }
    var customerIds: number[] = [];
      listCustomers.customers.forEach((item) => {
        if(item.select) {
          customerIds.push(item.customerId);
        }
      })
    /**
     * call api deleteCustomers async
    */
    //async function deleteCustomersRequest() {
      handleSetIsShowMessage(MessageType.DEFAULT);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
      const resDeleteCustomers = await deleteCustomers({
        customerIds: [...customerIds]
      });
      if (resDeleteCustomers) {
        handleResponseDeleteCustomers(resDeleteCustomers);
      }
   // }
   // deleteCustomersRequest();
  };

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
  };

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
  };

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
   * action handle respone DeleteCustomers
   * @param response DeleteCustomersResponse
  */
  const handleResponseDeleteCustomers = (response: DeleteCustomersResponse) => {
    if (response.status == 200) {
      handleIsModalVisibleConfirmDelete(0);
      handleExpland(0);
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
      handleIsModalVisibleConfirmDelete(0);
      handleExpland(0);
    }
  };
  
  return (
    <View>
      <View style={CustomerListStyles.modalContainerContentDelete} >
        <View style={CustomerListStyles.modalContentConfirmDelete}>
            <View style={CustomerListStyles.modalContentConfirmDeleteTitle}>
                <Text style={CustomerListStyles.modalContentConfirmTitle}>{translate(messages.deleteConfirmTitleModal)}</Text>
                <Text style={CustomerListStyles.modalContentConfirmMessage}>{translate(messages.deleteConfirmTitleQuestion)}</Text>
            </View>
            <View style={CustomerListStyles.modalContentConfirmDeleteData}>
              <View style={CustomerListStyles.modalContentConfirmDeleteDataDesc}>
                <ScrollView>
                {(listRelation || listCountRelationCustomer).listCount.map((itemCountRelation) => {
                  return (
                    <View key={itemCountRelation.customerId}>
                      {listCustomers.customers.map((itemCustomer) => {
                        return (
                          itemCustomer.customerId === itemCountRelation.customerId ? 
                          <View style={[CustomerListStyles.modalContentConfirmDeleteDataDescItem, CustomerListStyles.modalContentConfirmDeleteDataDescItemPaddingTop]} key={itemCountRelation.customerId}>
                              <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescTitle}>{itemCustomer.customerName}</Text>
                              <View style={CustomerListStyles.modalContentConfirmDeleteDataDescCount}>
                                {(itemCountRelation.countBusinessCard != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.customerBusinessCards)} {itemCountRelation.countBusinessCard}{translate(messages.customerUnit)}</Text>
                                }
                                {(itemCountRelation.countActivities != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.tradingProducts)} {itemCountRelation.countActivities}</Text>
                                }
                                {(itemCountRelation.countSchedules != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.activities)} {itemCountRelation.countSchedules}{translate(messages.customerUnit)}</Text>
                                }
                                {(itemCountRelation.countTasks != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.schedules)} {itemCountRelation.countTasks}</Text>
                                }
                                {(itemCountRelation.countTimelines != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.tasks)} {itemCountRelation.countTimelines}</Text>
                                }
                                {(itemCountRelation.countEmail != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.posts)} {itemCountRelation.countEmail}</Text>
                                }
                                {(itemCountRelation.countProductTrading != 0 || itemCountRelation.countBusinessCard) &&
                                  <Text style={CustomerListStyles.modalContentConfirmDeleteDataDescCountText}>{translate(messages.emails)} {itemCountRelation.countProductTrading}</Text>
                                }
                              </View>
                          </View>
                          : null
                        );
                      })}
                    </View>
                  );
                })}
                </ScrollView>
              </View>
            </View>

            <View style={CustomerListStyles.modalContentConfirmDeleteButton}>
                <CommonButton onPress= {() => handleCancelConfirmDelete()} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.cancelDelete)} typeButton = {TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
                <CommonButton onPress= {handleConfirmDelete} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.confirmDelete)} typeButton = {TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
            </View>
        </View>
      </View>
    </View>
  );
}