import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ModalStyles } from "../list/customer-list-style";
import { listFilterItemModal, getValueCustomerListSelector, ParamCustomersSelector } from "../list/customer-list-selector";
import { useSelector, useDispatch } from "react-redux";
import { TaskItemModal, AddToListFavouriteResponse, ValueCustomerList, AddCustomersToAutoListResponse, addToListFavourite, addCustomersToAutoList, customerList, CustomerListResponse } from "../list/customer-list-repository";
import { customerListActions, GetMessage, GetCustomerParam } from "../list/customer-list-reducer";
import { PopupValueMenu, StatusConfirmType, MessageType, CustomerListApi, ListType } from "../list/customer-list-enum";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../../config/i18n";
import { messagesComon } from "../../../shared/utils/common-messages";
import { TypeActionListShareCustomer, STATUSBUTTON, TypeButton } from "../../../config/constants/enum";
import Modal from 'react-native-modal';
import { messages } from "../drawer/drawer-left-messages";
import { ModalConfirmUpdateAutoGroup } from "./customer-modal-auto-group";
import { CommonButton } from "../../../shared/components/button-input/button";

interface CustomerManipulationProps {
  onCloseModal: () => void;
}

/**
 * Component for show popup Manipulation List
*/
export function CustomerManipulation(props: CustomerManipulationProps) {
  const { onCloseModal } = props;
  const dispatch = useDispatch();
  const paramCustomers = useSelector(ParamCustomersSelector);
  const listFilterModal: Array<TaskItemModal> = useSelector(listFilterItemModal);
  const getValueCustomerList: ValueCustomerList = useSelector(getValueCustomerListSelector);
  // set visible modal change to share list
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const navigation = useNavigation();
  // disable when update auto list
  const [disableUpdateAutoListButton, setDisableUpdateAutoListButton,] = useState(false);
  const [openModalUpdateAutoGroup, setOpenModalUpdateAutoGroup] = useState(false);
  /**
   * action handle open/closed 
   * @param isVisible get status isVisible of pupop ActionMyList
  */
  const handleIsModalVisibleActionMyList = (isVisible: boolean) => {
    const status = isVisible;
    dispatch(
      customerListActions.handleIsModalVisibleActionMyList({
        isModalVisible: status
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
   * call api addToListFavourite
  */
  async function addToListFavouriteRequest() {
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    handleSetIsShowMessage(MessageType.DEFAULT);
    const resAddToListFavouriteRequest = await addToListFavourite({
      customerListId: getValueCustomerList.listId,
    });
    if (resAddToListFavouriteRequest) {
      handleResponseAddToListFavourite(resAddToListFavouriteRequest);
    }
  }

  /**
   * handle action in ModalList
   * @param data get status type handle of modal
  */
  const handleModalList = (data: number) => {

    if (data === PopupValueMenu.UpdateList) {
      setOpenModalUpdateAutoGroup(true);
    } else if (data === PopupValueMenu.AddFavorite) {
      addToListFavouriteRequest();
      handleIsModalVisibleActionMyList(false);
    } else if (data === PopupValueMenu.EditList) {
      // TODO Edit list

      if (getValueCustomerList.typeList === ListType.MyList) {
        handleIsModalVisibleActionMyList(false);
        let paramNavigation = {
          listId: getValueCustomerList.listId,
          isAutoList: getValueCustomerList.isAutoList,
          status: false,
        };
        navigation.navigate("customer-my-list-navigator", paramNavigation);

      } else {
        handleIsModalVisibleActionMyList(false);
        navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.EDIT, listId: getValueCustomerList.listId });
      }
    } else if (data === PopupValueMenu.DeleteList) {
      // Delete list
      handleStatusConfirm(StatusConfirmType.DeleteList);
      confirmDelete();
    } else if (data === PopupValueMenu.CopyList) {
      // TODO Copy list
      if (getValueCustomerList.typeList === ListType.MyList) {
        handleIsModalVisibleActionMyList(false);
        let paramNavigation = {
          listId: getValueCustomerList.listId,
          isAutoList: getValueCustomerList.isAutoList,
          status: true,
        };
        navigation.navigate("customer-my-list-navigator", paramNavigation);
      } else {
        handleIsModalVisibleActionMyList(false);
        navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.COPY, listId: getValueCustomerList.listId });
      }
    } else if (data === PopupValueMenu.RemoveFavorite) {
      // お気に入りリストから削除 Remove from favorites list
      handleStatusConfirm(StatusConfirmType.DeleteListFavourite);
      confirmDelete();
    } else if (data === PopupValueMenu.ChangeMylistToShareList) {
      setIsVisibleConfirmModal(true);
      return;
    }
  }

  const handleChangeMylistToShareList = () => {
    handleIsModalVisibleActionMyList(false);
    navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST, listId: getValueCustomerList.listId });
  }

  /**
   * action show dialog confirm delete
  */
  const confirmDelete = () => {
    handleIsModalVisibleActionMyList(false);
    setTimeout(function () {
      handleIsDeleteConfirmDialog(true);
    }, 500)
  }

  /**
   * action handle SetIsSuccess
   * @param type get type message
  */
  const handleSetIsShowMessage = (type: number) => {
    dispatch(
      customerListActions.handleSetIsShowMessage({
        isMessage: type
      })
    );
  }

  /**
   * call api CustomerList async
  */
  async function getDataCustomerList() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    const resCustomerList = await customerList({
      mode: CustomerListApi.MODE_OWNER_AND_MEMBER,
      isFavourite: true,
    });

    if (resCustomerList) {
      handleResponseCustomerList(resCustomerList);
    }
  }

  /**
   * action handle respone AddToListFavourite
   * @param response AddToListFavouriteResponse
  */
  const handleResponseAddToListFavourite = (response: AddToListFavouriteResponse) => {
    if (response.status == 200) {
      getDataCustomerList();
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0003),
        visible: true
      }
      let arrayNew = listFilterModal.filter(item => item.id !== 2);
      arrayNew.push({ id: 6, cate: translate(messages.myListRemoveFavorites) })
      const connection = arrayNew;
      dispatch(
        customerListActions.handleExplandStatusMyList({
          connection
        })
      );
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
    }
  };

  /**
   * action handle respone AddCustomersToAutoList
   * @param response AddCustomersToAutoListResponse
  */
  const handleResponseAddCustomersToAutoList = (response: AddCustomersToAutoListResponse) => {
    if (response.status == 200) {
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0003),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      var param: GetCustomerParam = {
        selectedTargetType: paramCustomers.selectedTargetType,
        selectedTargetId: paramCustomers.selectedTargetId,
        isUpdateListView: paramCustomers.isUpdateListView,
        searchConditions: [],
        filterConditions: [],
        localSearchKeyword: "",
        orderBy: [],
        offset: 0,
        limit: paramCustomers.limit,
      }
      dispatch(customerListActions.setParamCustomers(param));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
    }
  };

  /**
   * action handle respone CustomerList
   * @param response CustomerListResponse
  */
  const handleResponseCustomerList = (response: CustomerListResponse) => {
    if (response.status == 200) {
      dispatch(customerListActions.getCustomerList(response.data));
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
    }
  };

  /**
   * Handle update auto list
   */
  const handleUpdateAutoGroup = async () => {
    setDisableUpdateAutoListButton(true);
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    async function addCustomersToAutoListRequest() {
      const resAddCustomersToAutoList = await addCustomersToAutoList({
        idOfList: getValueCustomerList.listId,
      });
      if (resAddCustomersToAutoList.status === 200) {
        setOpenModalUpdateAutoGroup(false);
        onCloseModal();
        handleResponseAddCustomersToAutoList(resAddCustomersToAutoList);
      }
    }

    setDisableUpdateAutoListButton(false);
    addCustomersToAutoListRequest();
  }

  /**
   * function close modal update auto group
   */
  const handleCloseModalUpdateAutoGroup = () => {
    setOpenModalUpdateAutoGroup(false);
  };

  return (
    <View>
      {listFilterModal.map((item: TaskItemModal, index: number) => {
        return (
          <View style={[ModalStyles.viewModal, index === 0 && ModalStyles.viewModalRemoveBorderTop]} key={item.id}>
            <TouchableOpacity style={ModalStyles.viewModalTouchableOpacity} onPress={() => handleModalList(item.id)}>
              <Text style={ModalStyles.textButtonModal}>{item.cate}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      <Modal
        isVisible={openModalUpdateAutoGroup}
        onBackdropPress={handleCloseModalUpdateAutoGroup}
        style={ModalStyles.centerView}
      >
        <ModalConfirmUpdateAutoGroup
          onCloseModal={handleCloseModalUpdateAutoGroup}
          onAcceptUpdateAutoGroup={handleUpdateAutoGroup}
          disableUpdateButton={disableUpdateAutoListButton}
          title={getValueCustomerList.listName}
        />
      </Modal>
      <Modal
        isVisible={isVisibleConfirmModal}
        backdropColor="rgba(0, 0, 0, 0.75)"
        onBackdropPress={() => setIsVisibleConfirmModal(false)}
      >
        <View style={ModalStyles.modal}>
          <Text style={ModalStyles.titleModal}>{translate(messages.changeToShareListModalTitle)}</Text>
          <View style={ModalStyles.modalConfirmContainer}>
            <Text style={ModalStyles.modalContentConfirmMessage}>{translate(messages.messageConfirmChangeToShareList1)}</Text>
            <Text style={ModalStyles.modalContentConfirmMessage}>{translate(messages.messageConfirmChangeToShareList2)}</Text>
          </View>
          <View style={ModalStyles.footerModal}>
            <CommonButton onPress={() => setIsVisibleConfirmModal(false)} status={STATUSBUTTON.ENABLE} icon="" textButton={`${translate(messages.cancelConfirmChangeToShareList)}`} typeButton={TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
            <CommonButton onPress={() => handleChangeMylistToShareList()} status={STATUSBUTTON.ENABLE} icon="" textButton={`${translate(messages.confirmChangeToShareList)}`} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
          </View>
        </View>
      </Modal>
    </View>

  );
}