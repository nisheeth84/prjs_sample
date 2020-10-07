import React, { useState, useEffect, useCallback } from "react";
import { Text, TouchableOpacity, View, FlatList, ScrollView, RefreshControl } from "react-native";
import {
  CustomerListStyles, appBarMenuStyles,
} from "./customer-list-style";
import { Icon } from "../../../shared/components/icon";
import { CustomerItem } from "./customer-list-item";
import { useDispatch, useSelector } from "react-redux";
import { customerListActions, GetCustomerParam } from "./customer-list-reducer";
import { clickSelector, ListCustomersSelector, statusSelectedListCustomer, statusVisibleConfirmDelete, StatusShowActionSelector, StatusShowLastUpdatedDateSelector, statusModalActionMylistSelector, statusModalActionListUserSelector, statusIsVisibleSortSelector, SortTypeAscOrDescSelector, statusDeleteConfirmDialogSelector, ResponseCustomerSelector, IsShowMessageSelector, ParamCustomersSelector, MessageSuccessSelector, listFilterItemModal, getValueCustomerListSelector, ListFavouriteFilterSelector } from "./customer-list-selector";
import Modal from 'react-native-modal';
import { CustomerListResponse, getCustomers, ItemSortTypeData, customerList, GetCustomersResponse, TaskItemModal, ValueCustomerList, ItemFavouriteList } from "./customer-list-repository";
import { TitleListSelector } from "../drawer/drawer-left-selector";
import { CustomerConfirmDelete } from "../modal/customer-confirm-delete-modal";
import { CustomerActionListUser } from "../modal/customer-action-list-user-modal";
import { CustomerManipulation } from "../modal/customer-manipulation-modal";
import { CustomerConfirmDialog } from "../modal/customer-confirm-dialog";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-list-messages";
import { ActivityIndicatorLoading } from "../shared/activity-indicator-loading";
import { StatusCustomerType, StatusAllType, MessageType, CustomerListApi } from "./customer-list-enum";
import { CustomerSortModal } from "../modal/customer-sort-modal";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CommonMessages } from "../../../shared/components/message/message";
import { CommonUtil } from "../detail/tabs/activity-history-information/common-util-activity-history-information";
import { DATE_FORMAT } from "../../../config/constants/constants";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import Toast from "react-native-tiny-toast";
import { CustomerListEmpty } from "../shared/components/customer-list-empty";
import { ModeScreen } from "../../../config/constants/enum";
import { map as _map } from 'lodash';


/**
 * Component for show list of Customer
*/

export function CustomerListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // get status select
  const statusSelect = useSelector(clickSelector);
  // get status loading
  const [statusLoading, setStatusLoading] = useState(false);
  // get title list
  const titleList = useSelector(TitleListSelector);
  // get status selected
  const statusSelected = useSelector(statusSelectedListCustomer);
  // get status sort type Asc or Desc
  const statusSortTypeOption = useSelector(SortTypeAscOrDescSelector);
  // get status show/hide modal action list
  const statusModalActionMylist:boolean = useSelector(statusModalActionMylistSelector);
  // get status show/hide modal action list user
  const statusModalActionListUser:boolean = useSelector(statusModalActionListUserSelector);
  // get status show/hide modal confirm delete
  const statusPupopConfirmDelete = useSelector(statusVisibleConfirmDelete);
  // get status show/hide modal confirm dialog
  const statusDeleteConfirmDialog = useSelector(statusDeleteConfirmDialogSelector);
  // get status show/hide modal sort
  const statusIsVisibleSort = useSelector(statusIsVisibleSortSelector);
  // get status show/hide action list manipulation
  const statusShowAction = useSelector(StatusShowActionSelector);
  // get status show/hide last updated date
  const statusShowLastUpdatedDate = useSelector(StatusShowLastUpdatedDateSelector);
  // get list Customers
  const listCustomers  = useSelector(ListCustomersSelector);
  // get respone of customer 
  const responseCustomer = useSelector(ResponseCustomerSelector);
  //get status type message
  const isShowMessage = useSelector(IsShowMessageSelector);
  // handled in each specific case
  const paramCustomers = useSelector(ParamCustomersSelector);
  const message = useSelector(MessageSuccessSelector);
  // get data listFavouriteFilter
  const listFavouriteFilter: Array<ItemFavouriteList> = useSelector(ListFavouriteFilterSelector);
  const listFilterModal: Array<TaskItemModal> = useSelector(listFilterItemModal);
  const getValueCustomerList:ValueCustomerList = useSelector(getValueCustomerListSelector);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const arraySortTypeData: Array<ItemSortTypeData> = [
    {
      id: 1,
      name: translate(messages.customerParent),
      selected: false,
    },
    {
      id: 2,
      name: translate(messages.customerName),
      selected: false,
    },
    {
      id: 3,
      name: translate(messages.customerAddress),
      selected: false,
    },
    {
      id: 4,
      name: translate(messages.createdDate),
      selected: false,
    },
    {
      id: 5,
      name: translate(messages.updatedDate),
      selected: false,
    }
  ];

  /**
   * action handle set all select customers
   * @param data get all status select and selected of customers
  */
  const handleSetAllSelectCustomers = (data: number) => {
    const connection = data;
    dispatch(
      customerListActions.handleSetAllSelectCustomers({
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
   * action handle set hide/show pupop ActionMyList
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
   * call api GetCustomers async
  */
  async function getCustomersRequest() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    const resCustomerList = await getCustomers({
      searchConditions: paramCustomers.searchConditions,
      filterConditions: paramCustomers.filterConditions,
      localSearchKeyword: paramCustomers.localSearchKeyword,
      selectedTargetType: paramCustomers.selectedTargetType,
      selectedTargetId: paramCustomers.selectedTargetId,
      isUpdateListView: paramCustomers.isUpdateListView,
      orderBy: paramCustomers.orderBy,
      offset: paramCustomers.offset,
      limit: paramCustomers.limit
    });

    if (resCustomerList) {
      handleResponseListCustomers(resCustomerList);
    }
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

  useEffect(() => {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
    dispatch(customerListActions.getStatusLoadmore({statusLoadmore: "default"}));
    setIsLoading(true);
    getDataCustomerList();
    allCustomer();
    dispatch(customerListActions.getSortTypeDataList({arraySortTypeData: arraySortTypeData}));
    setStatusLoading(false);
  }, [])

  useFocusEffect(
    useCallback(() => {
      handleSetIsShowMessage(MessageType.DEFAULT);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: ""}));
      getCustomersRequest();
    }, [paramCustomers])
  );

  /**
   * action handle tap other
  */
  const toggleModalActionMylist = () => {
    listFavouriteFilter.forEach((item) => {
      if (item.listId === getValueCustomerList.listId) {
        let arrayNew = listFilterModal.filter(item => item.id !== 2);
        const connection = arrayNew;
        dispatch(
          customerListActions.handleExplandStatusMyList({
            connection
          })
        );
      }
    })
    handleIsModalVisibleActionMyList(true);
  };

  /**
   * action handle tap show pupop ActionListUser
  */
  const toggleModalActionListUser = () => {
    handleIsModalVisibleActionListUser(true);
  };

  /**
   * action handle show ListCustomers select
  */
  const eventShowListSelect = () => {
    if (statusSelect === StatusCustomerType.Current) {
      handleExpland(1);
    }else{
      handleExpland(0);
    }
    handleSetAllSelectCustomers(StatusAllType.SELECT);
  };

  /**
   * action handle show screen sort
  */
  const handleSortScreen = () => {
    handleIsVisibleSort(true);
  };

  /**
   * action handle show ListCustomers SelectedAll
  */
  const eventShowListSelectedAll = () => {
    handleSetAllSelectCustomers(StatusAllType.SELECTED);
  };

  /**
   * action handle show ListCustomers SelectAll
  */
  const eventShowListSelectAll = () => {
    handleSetAllSelectCustomers(StatusAllType.SELECT);
  };

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
   * action handle scroll load ListCustomers 
  */
  async function handleLoadMore (event: any) {
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    if(paramCustomers.offset + paramCustomers.limit < listCustomers.totalRecords && y + height >= contentHeight - 20){
      setStatusLoading(true);
      dispatch(customerListActions.getStatusLoadmore({statusLoadmore: "appending"}));
      var param: GetCustomerParam = {
        selectedTargetType: paramCustomers.selectedTargetType,
        selectedTargetId: paramCustomers.selectedTargetId,
        isUpdateListView: paramCustomers.isUpdateListView,
        searchConditions: paramCustomers.searchConditions,
        filterConditions: paramCustomers.filterConditions,
        localSearchKeyword: paramCustomers.localSearchKeyword,
        orderBy: paramCustomers.orderBy,
        offset: paramCustomers.offset + paramCustomers.limit,
        limit: paramCustomers.limit,
      }
      dispatch(customerListActions.setParamCustomers(param));
    }
  }

  /**
   *  Handle refresh when the list
  */
  const onRefresh = () => {
    if(!isRefresh){
      setIsRefresh(true);
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
    }
  }

  /**
   * action handle respone CustomerList
   * @param response CustomerListResponse
  */
  const handleResponseCustomerList = (response: CustomerListResponse) => {
    if (response.status == 200) {
      dispatch(customerListActions.getCustomerList(response.data));
    }else{
      // Set ressponse
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
    }
  };
  
  /**
   * action handle respone ListCustomers
   * @param response ListCustomersResponse
  */
  const handleResponseListCustomers = (response: GetCustomersResponse) => {
      setIsLoading(false);
      setIsRefresh(false);
      setStatusLoading(false);
    if (response.status == 200) {
      dispatch(customerListActions.getListCustomers(response.data));
      if(response.data.totalRecords <= 0) {
        handleSetIsShowMessage(MessageType.NO_DATA);
      }
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({responseCustomer: response}));
      
    }
  };

  const renderAppbar = (title: string) => {
    interface Navigation {
      [navigation: string]: any;
    }

    const navigation: Navigation = useNavigation();

    const _openDrawerLeft = () => {
      navigation?.dangerouslyGetParent()?.toggleDrawer();
    };
    // open drawer notification
    const _openDrawerRight = () => {
      navigation?.dangerouslyGetParent()?.dangerouslyGetParent()?.dangerouslyGetParent()?.toggleDrawer();
    };

    const openGlobalSearch = () => { 
      navigation.navigate("search-stack", {
        screen: "search",
        params: { nameService: "customers" },
      });
    };

    return (
      <View style={appBarMenuStyles.container}>
        <TouchableOpacity
          style={appBarMenuStyles.iconButton}
          onPress={_openDrawerLeft}
        >
          <Icon name="menuHeader" />
        </TouchableOpacity>
        <View style={appBarMenuStyles.titleWrapper}>
          <Text style={appBarMenuStyles.title}>{title}</Text>
        </View>
        <TouchableOpacity
          style={appBarMenuStyles.iconSearch}
          onPress={openGlobalSearch}
        >
          <Icon name="search" />
        </TouchableOpacity>
        <TouchableOpacity
          style={appBarMenuStyles.iconButton}
          onPress={_openDrawerRight}
        >
          <Icon name="bell" />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    
    <View style={isShowMessage !== MessageType.NO_DATA ? CustomerListStyles.containerED: CustomerListStyles.containerF}>
      {renderAppbar(translate(messages.customersListTitle))}
      <View style={CustomerListStyles.menuHeader}>
        {
          isShowMessage === MessageType.ERROR && responseCustomer !== "" &&
          <View style={CustomerListStyles.viewMessageStyle}>
            <CommonMessages response={responseCustomer} />
          </View>
        }
      
        {titleList == "" ? (
          <Text style={CustomerListStyles.title}>{translate(messages.allCustomers)} （{listCustomers.totalRecords}{translate(messages.person)}）</Text>
        ) : (
            <Text style={CustomerListStyles.title}>
              {titleList} （{listCustomers.totalRecords}{translate(messages.person)}）
            </Text>
          )}
        <View style={[CustomerListStyles.fristRow]}>
          {statusShowLastUpdatedDate ? (
            <Text style={CustomerListStyles.date}>
              {translate(messages.lastUpdate)} ：
              {CommonUtil.formatDateTime(listCustomers.lastUpdatedDate, DATE_FORMAT)}
            </Text>
          ) : (
              <Text style={CustomerListStyles.date}></Text>
            )}
          <View style={CustomerListStyles.iconBlock}>
            <TouchableOpacity onPress={() => eventShowListSelect()} style={CustomerListStyles.widthButtonStyle}>
              {statusSelect === StatusCustomerType.Current ? (
                <Icon style={CustomerListStyles.iconEditButton} name="edit" />
              ) : (
                  <Icon style={CustomerListStyles.iconEditSelectedButton} name="editSelected" />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={CustomerListStyles.widthButtonStyle} onPress={handleSortScreen}>
              <Icon name={statusSortTypeOption == "DESC" ? "descending" : "ascending"} />
            </TouchableOpacity>
            {statusShowAction &&
              <TouchableOpacity style={CustomerListStyles.widthButtonStyle} onPress={toggleModalActionMylist}>
                <Icon style={CustomerListStyles.iconOtherButton} name="other" />
              </TouchableOpacity>
            }

          </View>
        </View>
      </View>
      <View style={CustomerListStyles.menuDive}></View>
      { 
      isLoading ? <AppIndicator size={40} style={CustomerListStyles.containerF} />
      :
      
        isShowMessage === MessageType.NO_DATA ?
        <CustomerListEmpty />
        :
        
        <View style={CustomerListStyles.listCustomer}>
              {message.visible &&
                <Toast
                  visible={message.visible}
                  position={-65}
                  shadow={false}
                  animation={false}
                  textColor='#333333'
                  imgStyle={{ marginRight: 5 }}
                  imgSource={require("../../../../assets/icons/SUS.png")}
                  containerStyle={CustomerListStyles.viewToast}
                >
                  <Text>{message.toastMessage}</Text>
                </Toast>
              }
          <View style={CustomerListStyles.listCustomer}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isRefresh}
                  onRefresh={onRefresh}
                />
              }
              onScroll={handleLoadMore}
              scrollEventThrottle={30}
              
            >
              {_map(listCustomers.customers, (item, index) => {
                return (
                  <CustomerItem
                    key={item.customerId}
                    data={item}
                    index={index}
                  />
                )
              })}
              {ActivityIndicatorLoading(statusLoading)}
            </ScrollView>
          </View>
        </View>
      }

      {statusSelect === StatusCustomerType.Current &&
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('customer-create-or-update', {
              mode: ModeScreen.CREATE,
            })
          }}
          style={CustomerListStyles.fab}
        >
          <Text style={CustomerListStyles.fabIcon}>+</Text>
        </TouchableOpacity>
      }
      {(statusSelect === StatusCustomerType.Select || statusSelect === StatusCustomerType.Selected) && (
          <View style={CustomerListStyles.viewFooter}>
            <TouchableOpacity style={CustomerListStyles.buttonList} onPress={() => eventShowListSelectedAll()}>
              <Text style={CustomerListStyles.textButtonList}>{translate(messages.selectedAll)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={CustomerListStyles.buttonList} onPress={() => eventShowListSelectAll()}>
              <Text style={CustomerListStyles.textButtonList}>{translate(messages.cancelSelectedAll)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={CustomerListStyles.buttonList}
              onPress={toggleModalActionListUser} disabled={!statusSelected}
            >
              <Text style={[CustomerListStyles.textButtonListSelect, statusSelected && CustomerListStyles.textButtonList]}>{translate(messages.listOperation)}</Text>
            </TouchableOpacity>
          </View>
      )}

      <Modal isVisible={statusModalActionMylist} style={CustomerListStyles.modalContent} onBackdropPress={() => handleIsModalVisibleActionMyList(false)} backdropColor={"rgba(0, 0, 0, 0.8)"}>
       <CustomerManipulation onCloseModal={() => handleIsModalVisibleActionMyList(false)}/>
      </Modal>

      <Modal isVisible={statusModalActionListUser} style={CustomerListStyles.modalContent} onBackdropPress={() => handleIsModalVisibleActionListUser(false)} backdropColor={"rgba(0, 0, 0, 0.8)"}>
        <CustomerActionListUser></CustomerActionListUser>
      </Modal>
      <Modal isVisible={statusPupopConfirmDelete} onBackdropPress={() => handleIsModalVisibleConfirmDelete(0)} backdropColor={"rgba(0, 0, 0, 0.8)"}>
        <CustomerConfirmDelete></CustomerConfirmDelete>
      </Modal>
      
      <Modal isVisible={statusDeleteConfirmDialog} onBackdropPress={() => handleIsDeleteConfirmDialog(false)} backdropColor={"rgba(0, 0, 0, 0.8)"}>
        <CustomerConfirmDialog></CustomerConfirmDialog>
      </Modal>

      <Modal style={{margin:0}} isVisible={statusIsVisibleSort} onBackdropPress={() => handleIsVisibleSort(false)} backdropColor={"rgba(0, 0, 0, 0.1)"}>
        <CustomerSortModal></CustomerSortModal>
      </Modal>

    </View>
  );
}