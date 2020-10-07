import React, { useState, useEffect, useLayoutEffect } from "react";
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Clipboard
 } from "react-native";
import { CustomerDetailScreenStyles, ActionModalStyles } from "./customer-detail-style";
import { Icon } from "../../../shared/components/icon";
import {
  CustomerDetailResponse,
  getDetailCustomer,
  CustomerDetail,
  deleteCustomer,
  DeleteCustomerResponse,
  createFollow,
  deleteFollowed,
  getChildCustomerInfo,
  ChildCustomersResponse,
  CreateFollowedResponse,
  DeletedFollowedResponse
} from "./customer-detail-repository";
import { customerDetailActions } from "./customer-detail-reducer";
import { useDispatch, useSelector } from "react-redux";
import { isFollowSelector, customerIdsNavigationSelector } from "./customer-detail-selector";
import { ActionModal } from "./action-modal";
import Modal from 'react-native-modal';
import { theme } from "../../../config/constants";
import { FollowTargetType, TabsList } from "./enum";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-detail-messages";
import CustomerDetailTabNavigator from "./navigation/customer-detail-tab-navigator";
import { statusDeleteConfirmDialogSelector } from "./tabs/activity-history-information/activity-history-information-selector";
import { activityHistoryInformationActions } from "./tabs/activity-history-information/activity-history-information-reducer";
import { CustomerConfirmDialog } from "./shared/customer-confirm-dialog";
import { CommonButton } from "../../../shared/components/button-input/button";
import { STATUSBUTTON, TypeButton, ModeScreen } from "../../../config/constants/enum";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { CommonMessages } from "../../../shared/components/message/message";
import Toast from "react-native-tiny-toast";
import { responseMessages } from "../../../shared/messages/response-messages";
import { errorCode } from "../../../shared/components/message/message-constants";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { Ionicons } from '@expo/vector-icons';
import { ScreenName } from "../../../config/constants/screen-name";
import { AppBarCustomerStyles } from "../shared/styles/app-bar-customer-styles";
import { CustomerConfirmDelete } from "../modal/customer-confirm-delete-modal";
import { ListCount, countRelationCustomer } from "../list/customer-list-repository";
import { StackActions } from "@react-navigation/native";
import { customerListActions } from "../list/customer-list-reducer";
import { messagesComon } from "../../../shared/utils/common-messages";

interface CustomerDetailProps {
  //screen navigation 
  navigation: any;
  //screen route
  route: any
}

/**
 * Component for show detail information of customer
 * @param CustomerDetailProps 
 */
export const CustomDetailScreen: React.FC<CustomerDetailProps> = (
  {
    navigation,
    route
  }
) =>  {
  let customerId = route.params ? route.params.customerId : 0;
  const customerName = route.params ? route.params.customerName : "";
  const urlDetail = "https://remixms.softbrain.co.jp/{0}/employee/detail";
  const auth = useSelector(authorizationSelector);
  
  const statusDeleteConfirmDialog = useSelector(statusDeleteConfirmDialogSelector);
  const customerIdNavigationList = useSelector(customerIdsNavigationSelector);
  const [isModalVisible, setModalVisible] = useState(false);
  const [disableFollowBtn, setDisableFollowBtn] = useState(false);
  const [isVisibleConfirmDeleteModal, setIsVisibleConfirmDeleteModal] = useState(false);
  const dispatch = useDispatch();
  // const customerDetail = useSelector(CustomerDetailSelector);
  const isFollow = useSelector(isFollowSelector);
  let childCustomersList: any = "";
  const [isShowMessageError, setIsShowMessageError] = useState(false);
  const [responseError, setResponseError] = useState<any>("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<CustomerDetail>();
  // const [childCustomerDetail, setChildCustomerDetail] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePopupConfirmDeleteRelation, setVisiblePopupConfirmDeleteRelation] = useState(false);
  const [listRelation, setListRelation] = useState<ListCount>();
  const [isReload, setIsReload] = useState(false)
  
  /**
   * Use useLayoutEffect hook to show title navigation
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: !customerName ? "Customer Detail" : customerName,
    });
  }, [navigation, customerName]);

  /**
   * action handle hide/show dialog confirmation
   * @param isVisible get status isVisible of dialog confirmation
  */
  const handleIsDeleteConfirmDialog = (isVisible: boolean) => {
    dispatch(
      activityHistoryInformationActions.handleIsDeleteConfirmDialog({
        isModalVisible: isVisible
      })
    );
  }

  const handleCopyLinkCustomer = () => {
    
    const value = urlDetail.replace("{0}", auth.idToken) + "/" + customerId;
    Clipboard.setString(value);
  }
  
  /**
   * use useEffect hook to get customer detail info
   */
  useEffect(() => {
    if (customerIdNavigationList.length > 0) {
      customerId = customerIdNavigationList[customerIdNavigationList.length-1];
    }

    dispatch(customerDetailActions.setCustomerId(customerId));

    /**
     * get customer detail data async
     */
    async function getCustomerDetailData() {
      setIsLoading(true);
      const childCustomersResponse = await getChildCustomerInfo({
        customerId: customerId
      });

      if (childCustomersResponse) {
        handleResponseChildCustomers(childCustomersResponse);
      }
    }

    // get API customer
    getCustomerDetailData();
  }, [isReload])

  /**
   * show and hide action modal
   */
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  async function handleResponseChildCustomers (response: ChildCustomersResponse) {
    if(response.status === 200){
      const childCustomersData = response.data?.childCustomers;
      childCustomersList = childCustomersData.map((childCustomer) => {
        return childCustomer.customerId;
      });

      dispatch(customerDetailActions.setChildCustomersList(childCustomersList));
      const customerDetailResponse = await getDetailCustomer({
        mode: "detail",
        customerId: customerId,
        childCustomerIds: childCustomersList,
        isGetDataOfEmployee: true
      });

      if (customerDetailResponse) {
        handleResponseCustomerDetail(customerDetailResponse);
      }
    } else {
      setIsLoading(false);
      setIsShowMessageError(true);
      setResponseError(response);
    }
  }

  /**
   * Handle customer detail response 
   * 
   * @param response CustomerDetailResponse
   */
  const handleResponseCustomerDetail = (response: CustomerDetailResponse) => {
    if(response.status === 200){
      dispatch(customerDetailActions.getCustomerDetail({detail: response.data}));
      dispatch(customerDetailActions.getTabInfo({tabInfo: response.data?.tabsInfo}));

      if (response.data.dataWatchs) {
        dispatch(customerDetailActions.initFollowOrNot({detail: response.data}));
      }
        
      const dataTabs = response.data.dataTabs;
      dataTabs.forEach((item) => {
        let activityHistoryList = [];
        if (item.tabId === TabsList.ACTIVITY_HISTORY && item.data) {
          activityHistoryList = item.data;
        }
        dispatch(customerDetailActions.getActivityHistoryList({activityHistoryList: activityHistoryList}));

        let tradingProductData = {
          productTradings: []
        }
        if (item.tabId === TabsList.TRADING_PRODUCT && item.data) {
          tradingProductData = item.data;
          const productTradingBadges = item.data?.dataInfo?.taskBadge ? item.data?.dataInfo?.productTradingBadge : 0;
          dispatch(customerDetailActions.setTradingProductBadges(productTradingBadges));
        }
        dispatch(customerDetailActions.getTradingProducts(tradingProductData));

        let schedulesData = [];
        if (item.tabId === TabsList.SCHEDULE && item.data) {
          schedulesData = item.data;
        }
        dispatch(customerDetailActions.getSchedules({schedules: schedulesData}));
        dispatch(customerDetailActions.setExtendSchedule({schedules: schedulesData}));

        let tasksData = {
          tasks: []
        };
        if (item.tabId === TabsList.TASK && item.data) {
          tasksData = item.data;
          const taskBadges = item.data?.dataInfo?.taskBadge ? item.data?.dataInfo?.taskBadge : 0;
          dispatch(customerDetailActions.setTaskBadges(taskBadges));
        }
        dispatch(customerDetailActions.getTasks(tasksData));

        let scenarioData = {
          milestones: []
        }
        if (item.tabId === TabsList.SCENARIO && item.data?.scenarios) {
          scenarioData = item.data.scenarios;
        }
        dispatch(customerDetailActions.setScenarios(scenarioData));
      });

      setCustomerDetail(response.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsShowMessageError(true);
      setResponseError(response);
    }
  };
  
  /**
   * handle deleted customer response
   * 
   * @param response DeleteCustomerResponse
   */
  const handleResponseDeleteCustomer = (response: DeleteCustomerResponse) => {
    if(response.status === 200){
      const messageSuccessDelete = {
        toastMessage: translate(messagesComon.ERR_COM_0005),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccessDelete));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);

      navigation.navigate("customer-list");
    } else {
      setIsShowMessageError(true);
      setResponseError(response);
    }
  };
  
  /**
   * show confirmed delete alert
   */
  const confirmDeleteCustomer = () => {
    setVisiblePopupConfirmDeleteRelation(false);
    setIsVisibleConfirmDeleteModal(true);
  }

  /**
   * delete customer detail async
   */
  async function confirmDeleteRelation() {
    setIsShowMessageError(false);
    const resCountRelationCustomer = await countRelationCustomer({
      customerIds: [customerId]
    });
    if (resCountRelationCustomer.status === 200){
      setVisiblePopupConfirmDeleteRelation(true);
      setListRelation(resCountRelationCustomer.data);
    }
  }

  const closePopupConfirmDeleteRelation = () => {
    setIsVisibleConfirmDeleteModal(false);
    setVisiblePopupConfirmDeleteRelation(false);
  }
  const deleteCustomerDetail = async () => {
    setIsVisibleConfirmDeleteModal(false);
    const customerIds = [customerId];
    const resDeleteCustomer = await deleteCustomer({customerIds: customerIds});
    if (resDeleteCustomer) {
      handleResponseDeleteCustomer(resDeleteCustomer);
    }
  }

  /**
   * change follow state
   */
  const changeFollow = () => {
    setIsShowMessageError(false);
    setDisableFollowBtn(true);
    if(isFollow) {
      deleteFollowedCustomer();
    } else {
      createFollowCustomer();
    }
  }

  /**
   * create follow customer
   */
  async function createFollowCustomer() {
    //todo comment create follow customer api
    const resCreateFollow = await createFollow({
      followTargetType: FollowTargetType.CUSTOMER,
      followTargetId: customerId
    });

    if (resCreateFollow) {
      handleResponseCreateFollowed(resCreateFollow);
      setDisableFollowBtn(false);
    }
  }

  /**
   * delete follow customer
   */
  async function deleteFollowedCustomer() {
    //todo comment delete followed customer api
    const followed = [{
      followTargetType: FollowTargetType.CUSTOMER,
      followTargetId: customerId,
    }]
    const resDeleteFollowed = await deleteFollowed({
      followeds: followed
    });

    if (resDeleteFollowed) {
      handleResponseDeleteFolloweds(resDeleteFollowed);
      setDisableFollowBtn(false);
    }
  }

  /**
   * handle create followed response
   * 
   * @param response CreateFollowedResponse
   */
  const handleResponseCreateFollowed = (response: CreateFollowedResponse) => {
    const follow = {isFollow: true}
    if(response.status === 200){
      setMessageSuccess(translate(responseMessages[errorCode.infCom0003]));
      setShowMessageSuccess(true);
      if (response.data?.timelineFollowed) {
        dispatch(customerDetailActions.setFollowOrNot(follow));
      }

      setTimeout(() => {
        setShowMessageSuccess(false);
      }, 2000);
    } else {
      setIsShowMessageError(true);
      setResponseError(response);
    }
  };

   /**
   * handle delete followed response
   * 
   * @param response DeletedFollowedResponse
   */
  const handleResponseDeleteFolloweds = (response: DeletedFollowedResponse) => {
    const follow = {isFollow: false}
    if(response.status === 200){
      setMessageSuccess(translate(responseMessages[errorCode.infCom0005]));
      setShowMessageSuccess(true);
      if (response.data && response.data.followeds.length > 0 ) {
        dispatch(customerDetailActions.setFollowOrNot(follow));
      }

      setTimeout(() => {
        setShowMessageSuccess(false);
      }, 2000);
    } else {
      setIsShowMessageError(true);
      setResponseError(response);
    }
  };
  
  const openDrawerLeft = async () => {
    setCustomerDetail(undefined);
    dispatch(customerDetailActions.getCustomerDetail({detail: {}}));
    dispatch(customerDetailActions.getActivityHistoryList({activityHistoryList: []}));
    dispatch(customerDetailActions.getTradingProducts({}));
    dispatch(customerDetailActions.getSchedules({schedules: []}));
    dispatch(customerDetailActions.setExtendSchedule({schedules: []}));
    dispatch(customerDetailActions.getTasks({tasks: []}));
    dispatch(customerDetailActions.removeCustomerIdNavigation(route?.params?.customerId));
    setIsReload(!isReload);
    navigation.goBack();
  };

  return (
    <View style={[CustomerDetailScreenStyles.container, !customerDetail && CustomerDetailScreenStyles.backgroundWhite]}>
      <View style={[AppBarCustomerStyles.container, AppBarCustomerStyles.block]}>
          <TouchableOpacity
            style={AppBarCustomerStyles.iconButton}
            onPress={openDrawerLeft}
          >
            <Icon name="arrowBack" />
          </TouchableOpacity>
          <View style={AppBarCustomerStyles.titleWrapper}>
            <Text style={AppBarCustomerStyles.title} numberOfLines={1}>
              {customerName}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              AppBarCustomerStyles.iconButton,
              AppBarCustomerStyles.paddingLeftButton,
            ]}
          >
            <Ionicons
              name="md-search"
              style={AppBarCustomerStyles.iconGray}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity style={AppBarCustomerStyles.iconButton} onPress={() => { }}>
            <Ionicons
              name="ios-notifications"
              style={AppBarCustomerStyles.iconGray}
              size={30}
            />
          </TouchableOpacity>
        </View>
      {isLoading && <AppIndicator size={40} />}
          {
            showMessageSuccess &&
            <Toast
              visible={showMessageSuccess}
              position={Toast.position.BOTTOM}
              shadow={false}
              animation={false}
              textColor='#333333'
              imgStyle={{marginRight: 5}}
              imgSource={require("../../../../assets/icons/SUS.png")}
              containerStyle={CustomerDetailScreenStyles.viewToast}
            >
              <Text>{messageSuccess}</Text>
            </Toast>
          }
          {
            isShowMessageError && responseError !== "" &&
            <View style={CustomerDetailScreenStyles.messageStyle}>
              <CommonMessages response={responseError} />
            </View>
          }
          {customerDetail && 
            <View style={CustomerDetailScreenStyles.infoCustomer}>
            <View style={CustomerDetailScreenStyles.rightButtonBlock}>
                <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={() => Alert.alert("Notify", "link to timeline screen!")}>
                  <Icon style={CustomerDetailScreenStyles.iconTimeline} name="timeline" />
                </TouchableOpacity>
                <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={handleCopyLinkCustomer}>
                  <Icon style={CustomerDetailScreenStyles.iconShare} name="share" />
                </TouchableOpacity>
            </View>
            {customerDetail?.customer.customerLogo.fileUrl ?
            <Image
                style={CustomerDetailScreenStyles.logo}
                source={{
                  uri: customerDetail?.customer.customerLogo.fileUrl
                }}
            />
            : 
            <View style={CustomerDetailScreenStyles.textLogo}>
              <Text style={[CustomerDetailScreenStyles.bossAvatarText, {fontSize: 20}]}>
                {customerDetail?.customer.customerName ? customerDetail?.customer.customerName.charAt(0)
                : ""}
              </Text>
            </View>
            }
              <View style={CustomerDetailScreenStyles.contentInfo}>
                <TouchableOpacity onPress={() => {
                  if (customerDetail?.customer?.parentId) {
                    dispatch(customerDetailActions.addCustomerIdNavigation(customerDetail.customer.parentId));
                    navigation.dispatch(
                      StackActions.push('customer-detail', {customerId: customerDetail.customer.parentId, customerName: customerDetail.customer.parentName})
                    );
                  }
                }}>
                  <Text style={[CustomerDetailScreenStyles.textSmall]}>{customerDetail?.customer.parentName}</Text>
                </TouchableOpacity>
                <Text style={CustomerDetailScreenStyles.textBold}>{customerDetail?.customer.customerName}</Text>
                <Text style={[CustomerDetailScreenStyles.textSmall]}>{customerDetail?.customer.businessMainName} – {customerDetail?.customer.businessSubName}</Text>
                <View style={CustomerDetailScreenStyles.iconBlock}>
                  <CommonButton onPress= {changeFollow} status = {disableFollowBtn ? STATUSBUTTON.DISABLE : STATUSBUTTON.ENABLE} icon = "" textButton= {!isFollow ? translate(messages.isFollowing) : translate(messages.notFollowed)} typeButton = {TypeButton.MINI_BUTTON}></CommonButton>
                  <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={() => {
                      // Alert.alert("Notify", "link to customer edit page!")
                      navigation.navigate(ScreenName.CUSTOMER_ADD_EDIT, { mode: ModeScreen.EDIT, customerId })
                    }}>
                    <Icon style={CustomerDetailScreenStyles.iconEdit} name="edit" />
                  </TouchableOpacity>
                  <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={confirmDeleteCustomer}>
                    <Icon style={CustomerDetailScreenStyles.iconErase} name="erase" />
                  </TouchableOpacity>
                </View>
              </View>
          </View>}
            
          {customerDetail && <CustomerDetailTabNavigator />}
          <View>
            <Modal isVisible={isModalVisible}
              backdropColor={theme.colors.blackDeep}
              style={ActionModalStyles.containerModal}
              onBackdropPress={() => setModalVisible(false)}
            >
              <ActionModal></ActionModal>
            </Modal>
            
            <Modal isVisible={statusDeleteConfirmDialog} onBackdropPress={() => handleIsDeleteConfirmDialog(false)} backdropColor={"rgba(0, 0, 0, 0.8)"}>
              <CustomerConfirmDialog></CustomerConfirmDialog>
            </Modal>
            <Modal
              isVisible={isVisibleConfirmDeleteModal}
              backdropColor={theme.colors.blackDeep}
              onBackdropPress={() => setIsVisibleConfirmDeleteModal(false)}
            >
              <View style={CustomerDetailScreenStyles.modal}>
                <Text style={CustomerDetailScreenStyles.titleModal}>{translate(messages.recurringAppointment)}</Text>
                <Text style={CustomerDetailScreenStyles.modalContentConfirmMessage}>{translate(responseMessages.WAR_COM_0001).replace("{0}",customerDetail?.customer?.customerName || "")}</Text>
                <View style={CustomerDetailScreenStyles.footerModal}>
                  <CommonButton onPress= {() => setIsVisibleConfirmDeleteModal(false)} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {`${translate(messages.cancel)}`} typeButton = {TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
                  <CommonButton onPress= {confirmDeleteRelation} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {`${translate(messages.confirmDelete)}`} typeButton = {TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
                </View>
              </View>
              <Modal isVisible={visiblePopupConfirmDeleteRelation} onBackdropPress={() => closePopupConfirmDeleteRelation} backdropColor={"rgba(0, 0, 0, 0.8)"}>
                <CustomerConfirmDelete listRelation={listRelation} handleDelete={deleteCustomerDetail} closePopup={closePopupConfirmDeleteRelation}></CustomerConfirmDelete>
              </Modal>
            </Modal>
          </View>
          <TouchableOpacity onPress={() => toggleModal()} style={CustomerDetailScreenStyles.fab}>
            <Text style={CustomerDetailScreenStyles.fabIcon}>+</Text>
          </TouchableOpacity>
    </View>
  );
}