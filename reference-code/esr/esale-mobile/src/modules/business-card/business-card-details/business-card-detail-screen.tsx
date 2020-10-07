import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { messages as prMessage } from "../business-list-card/business-card-messages";
import {
  statusSelector,
  businessCardDetailSelector,
} from "./business-card-detail-selector";
import { messages } from "./business-card-detail-messages";
import { translate } from "../../../config/i18n";
import { useSelector, useDispatch } from "react-redux";
import { businessCardDetailActions } from "./business-card-detail-reducer";
// import {} from "../../products/products-repository";
// import {} from "../../../config/constants/query";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import {
  useRoute,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
// import { D_BUSINESS_CARD_DETAIL } from "./business-card-dummy-data";
import { appImages } from "../../../config/constants";
import { EnumStatus } from "../../../config/constants/enum-status";
import {
  DeleteBusinessCardProcessMode,
  DeleteBnCardModalType,
  Follow,
  BusinessCardDetailDialog,
} from "../../../config/constants/enum";
import {
  BusinessCard,
  // deleteBusinessCard,
  createFollowed,
  deleteFollowed,
  // getBusinessCardDetail,
  // BusinessCardDetailResponse,
  deleteBusinessCard,
  getBusinessCardDetail,
} from "./business-card-repository";
import { getFirstItem } from "../../../shared/util/app-utils";
import { BusinessCardScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { CommonStyles } from "../../../shared/common-style";
import { RegisterModal } from "./modal/register-modal";
import { BusinessCardDetailTopInfo } from "./business-card-detail-top-info";
import { DeleteBusinessCardModal } from "./modal/delete-business-card-modal";
import { ShowImageModal } from "./modal/show-image-modal";
import { BusinessCardHistoryTabScreen } from "./tab-history/business-card-history-tab";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { BusinessCardBasicInfoScreen } from "./tab-basic-info/business-card-basic-info-screen";
// import { TradingProduction } from "./tab-trading-products/trading-products-screen";
import { ActivityHistoryScreen } from "../business-card-details/activity-history/activity-history-screen";
import { businessCardSelector } from "../business-card-selector";
import _ from "lodash";
import { copyToClipboard } from "../../../shared/util/app-utils";
import { TabCalendarScreen } from "./../tab-calendar/tab-calendar-screen";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { ScreenName } from "../../../config/constants/screen-name";

/**
 * BusinessCard detail screen
 */

export interface BusinessCardModal {
  isOpen: boolean;
  type: BusinessCardDetailDialog;
}

export const BusinessCardDetailScreen = () => {
  const businessCardDetails = useSelector(businessCardDetailSelector);
  const businessCardDetail: BusinessCard = getFirstItem(businessCardDetails);
  const cards = useSelector(businessCardSelector);
  const statusGetBusinessCard = useSelector(statusSelector);
  const route = useRoute<BusinessCardScreenRouteProp>();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [businessCardDetailModal, handleToggleModal] = useState<
    BusinessCardModal
  >({
    isOpen: false,
    type: BusinessCardDetailDialog.REGISTER_MODAL,
  });
  const [dataImagePreview, setDataImagePreview] = useState<any>({});

  /**
   * close modal
   */
  const closeModal = () => {
    handleToggleModal({
      isOpen: false,
      type: businessCardDetailModal.type,
    });
  };

  /**
   * open delete BusinessCard modal
   */
  const openDeleteBusinessCardModal = () => {
    handleToggleModal({
      isOpen: true,
      type: BusinessCardDetailDialog.DELETE_CARD_MODAL,
    });
  };

  /**
   * open delete Last BusinessCard modal
   */
  const openDeleteLastBusinessCardModal = () => {
    handleToggleModal({
      isOpen: true,
      type: BusinessCardDetailDialog.DELETE_LAST_CARD_MODAL,
    });
  };

  /**
   * open Register BusinessCard modal
   */
  const openRegisterBusinessCardModal = () => {
    handleToggleModal({
      isOpen: true,
      type: BusinessCardDetailDialog.REGISTER_MODAL,
    });
  };

  /**
   * open show image modal
   */
  const openShowImageModal = () => {
    handleToggleModal({
      isOpen: true,
      type: BusinessCardDetailDialog.SHOW_IMAGE_MODAL,
    });
  };

  /**
   * openCard
   */
  const openCard = (index: number) => {
    if (index != undefined) {
      let data = {
        currentIndex: index,
        businessCardId: cards[index].businessCardId,
        prevBusinessCardId: cards[index - 1]?.businessCardId || undefined,
        nextBusinessCardId: cards[index + 1]?.businessCardId || undefined,
        isShowPrevNext: true,
      };
      const pushAction = StackActions.push("business-card-detail", data);
      setDataImagePreview(data);
      navigation.dispatch(pushAction);
    }
  };

  /**
   * open timeline screen
   */
  const openTimeline = () => {
    navigation.navigate("timeline", {});
  };

  /**
   * open register activity screen
   */
  const openRegisterActivityScreen = () => {
    closeModal();
    navigation.navigate("register-activity");
  };

  /**
   * open register schedule screen
   */
  const openRegisterScheduleScreen = () => {
    closeModal();
    navigation.navigate("register-schedule");
  };

  /**
   * create email
   */
  const createEmail = () => {
    // Todo create email - will be dealt with in phase 2
    closeModal();
  };

  /**
   * call api delete business card
   */
  const deleteBusinessCardF = (processMode: number) => {
    async function callApi() {
      let params = {
        businessCards: [
          {
            customerId: businessCardDetail?.customerId || 0,
            businessCardIds: [businessCardDetail?.businessCardId],
          },
        ],
        processMode: processMode,
      };
      let response = await deleteBusinessCard(params, {});

      let deleteBusinessCardR = response?.data;
      if (response?.status == 200) {
        switch (processMode) {
          case DeleteBusinessCardProcessMode.CHECK_STATUS:
            if (deleteBusinessCardR?.hasLastBusinessCard) {
              openDeleteLastBusinessCardModal();
            } else {
              openDeleteBusinessCardModal();
            }
            break;
          case DeleteBusinessCardProcessMode.DELETE_CARD:
            navigation.goBack();
            break;
          default:
            navigation.goBack();
            break;
        }
      }
    }
    callApi();
  };

  /**
   * check business card status and handle
   */
  const checkBusinessCardStatus = () => {
    deleteBusinessCardF(DeleteBusinessCardProcessMode.CHECK_STATUS);
  };

  /**
   * call api create followed
   */
  const createFollowedF = () => {
    async function callApi() {
      let params = {
        followTargetType: 2,
        followTargetId: businessCardDetail?.businessCardId || 0,
      };
      let response = await createFollowed(params, {});
      if (
        response?.status == 200 &&
        response?.data?.data?.createFollowed != null
      ) {
        let businessCardDetailFollowed = _.cloneDeep(businessCardDetail);
        businessCardDetailFollowed.hasFollow = Follow.HAS_FOLLOW;
        dispatch(
          businessCardDetailActions.saveBusinessCardDetail(
            businessCardDetailFollowed
          )
        );
      }
    }
    callApi();
  };

  /**
   * call api deleteFollowed
   */
  const deleteFollowedF = () => {
    async function callApi() {
      let params = {};
      let response = await deleteFollowed(params, {});
      if (response?.status == 200 && response?.data?.data?.followeds != null) {
        let businessCardDetailF = Object.assign({}, businessCardDetail);
        businessCardDetailF.hasFollow = Follow.NO_FOLLOW;
        dispatch(
          businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
        );
      }
    }
    callApi();
    let businessCardDetailF = Object.assign({}, businessCardDetail);
    businessCardDetailF.hasFollow = Follow.NO_FOLLOW;
    dispatch(
      businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
    );
  };

  /**
   * open edit business card screen
   * @param businessCardId
   */
  const editBusinessCard = (businessCardId: number) => {
    navigation.navigate(ScreenName.BUSINESS_CARD_REGISTER, {
      data: { screen: "Editer", businessCardId },
    });
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getDataBusinessCardDetail();
    });
    async function getDataBusinessCardDetail() {
      let params = {
        businessCardId: route.params?.businessCardId,
        // customerIds: [],
        // hasLoginUser: false,
        // hasTimeLine: false,
        mode: "detail",
      };

      const response = await getBusinessCardDetail(params, {});
      if (response && response.status == 200) {
        dispatch(
          businessCardDetailActions.getBusinessCardDetail(response?.data)
        );
      }
    }

    getDataBusinessCardDetail();
    let data = {
      currentIndex: route.params?.currentIndex,
      businessCardId: route.params?.businessCardId,
      prevBusinessCardId: route.params?.prevBusinessCardId,
      nextBusinessCardId: route.params?.nextBusinessCardId,
      isShowPrevNext: true,
    };
    setDataImagePreview(data);
  }, [route.params?.businessCardId]);

  const deleteCustomCard =()=>{
    deleteBusinessCardF(
      DeleteBusinessCardProcessMode.DELETE_CUSTOMER_CARD
    );
  }
  /**
   * check and get modal type
   * @param type
   */
  const checkModalType = (type: BusinessCardDetailDialog) => {
    switch (type) {
      case BusinessCardDetailDialog.DELETE_CARD_MODAL:
        return (
          <DeleteBusinessCardModal
            onCloseModal={() => {
              closeModal();
            }}
            onClickDeleteBusinessCard={() => {
              deleteBusinessCardF(DeleteBusinessCardProcessMode.DELETE_CARD);
            }}
            onClickDeleteCustomerAndBnCard={deleteCustomCard}
            type={DeleteBnCardModalType.DELETE_CARD_OTHER_MODAL}
          />
        );
      case BusinessCardDetailDialog.DELETE_LAST_CARD_MODAL:
        return (
          <DeleteBusinessCardModal
            onCloseModal={() => {
              closeModal();
            }}
            onClickDeleteBusinessCard={() => {
              deleteBusinessCardF(DeleteBusinessCardProcessMode.DELETE_CARD);
            }}
            onClickDeleteCustomerAndBnCard={deleteCustomCard}
            type={DeleteBnCardModalType.DELETE_LAST_MODAL}
          />
        );

      case BusinessCardDetailDialog.SHOW_IMAGE_MODAL:
        return (
          <ShowImageModal
            onCloseModal={() => {
              closeModal();
            }}
            hasPrev={
              dataImagePreview.isShowPrevNext &&
              dataImagePreview.prevBusinessCardId
            }
            hasNext={
              dataImagePreview.isShowPrevNext &&
              !!dataImagePreview.nextBusinessCardId
            }
            imagePath={businessCardDetail?.businessCardImagePath}
            onClickLeft={() => {
              openCard(dataImagePreview.currentIndex - 1);
            }}
            onClickRight={() => {
              openCard(dataImagePreview.currentIndex + 1);
            }}
          />
        );
      default:
        return (
          <RegisterModal
            onCloseModal={() => {
              closeModal();
            }}
            onClickRegisterSchedule={() => {
              openRegisterScheduleScreen();
            }}
            onClickRegisterActivity={() => {
              openRegisterActivityScreen();
            }}
            onClickCreateEmail={() => {
              createEmail();
            }}
          />
        );
    }
  };

  /**
   * check status get busniess card
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    switch (status) {
      case EnumStatus.PENDING:
        return <AppIndicator style={CommonStyles.backgroundTransparent} />;
      case EnumStatus.SUCCESS:
        return (
          businessCardDetail && (
            <View style={CommonStyles.padding4}>
              <BusinessCardDetailTopInfo
                businessCardImageName={businessCardDetail.businessCardImageName}
                businessCardImagePath={businessCardDetail.businessCardImagePath}
                customerName={businessCardDetail?.customerName}
                customerId={businessCardDetail.customerId}
                alternativeCustomerName={
                  businessCardDetail.alternativeCustomerName
                }
                departmentName={businessCardDetail.departmentName}
                position={businessCardDetail.position}
                firstName={businessCardDetail.firstName}
                lastName={businessCardDetail.lastName}
                hasActivity={businessCardDetail.hasActivity}
                lastContactDate={businessCardDetail?.lastContactDate || ""}
                businessCardReceives={businessCardDetail?.businessCardReceives}
                hasFollow={businessCardDetail.hasFollow}
                pressImage={() => {
                  openShowImageModal();
                }}
                follow={() => {
                  createFollowedF();
                }}
                unfollow={() => {
                  deleteFollowedF();
                }}
                openTimeline={() => {
                  openTimeline();
                }}
                deleteBusinessCard={() => {
                  checkBusinessCardStatus();
                }}
                editBusinessCard={() => {
                  editBusinessCard(businessCardDetail.businessCardId);
                }}
                isHistory={false}
                copyLink={() => {
                  copyToClipboard(businessCardDetail.url);
                }}
              />
            </View>
          )
        );
      default:
        return;
    }
  };

  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={CommonStyles.containerWhite}>
      <View style={[CommonStyles.height100]}>
        <AppBarMenu
          name={translate(messages.screenTitle)}
          hasBackButton={true}
        />

        {!businessCardDetail ? (
          <ListEmptyComponent />
        ) : (
          <>
            {checkStatus(statusGetBusinessCard)}
            <Modal
              visible={businessCardDetailModal.isOpen}
              animationType="fade"
              transparent
              onRequestClose={() => {
                closeModal();
              }}
            >
              {checkModalType(businessCardDetailModal.type)}
            </Modal>
            <View style={CommonStyles.flex1}>
              <Tab.Navigator
                lazy
                tabBar={(props) => (
                  <TopTabbar
                    count={[0, 1, 19, translate(messages.noPlan), 1, 100]}
                    {...props}
                  />
                )}
              >
                <Tab.Screen
                  name={translate(prMessage.basicInfo)}
                  component={BusinessCardBasicInfoScreen}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                />
                <Tab.Screen
                  name={translate(prMessage.history)}
                  component={ActivityHistoryScreen}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                />
                {/* <Tab.Screen
                  name={translate(prMessage.tradingProduct)}
                  component={TradingProduction}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                /> */}
                <Tab.Screen
                  name={translate(prMessage.calendar)}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                  component={TabCalendarScreen}
                />
                <Tab.Screen
                  name={translate(prMessage.email)}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                >
                  {() => (
                    <View style={CommonStyles.rowCenter}>
                      <Text>Email</Text>
                    </View>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name={translate(prMessage.changeHistory)}
                  component={BusinessCardHistoryTabScreen}
                  initialParams={{
                    businessCardId: route?.params?.businessCardId,
                  }}
                />
              </Tab.Navigator>
            </View>

            <TouchableOpacity
              onPress={() => {
                openRegisterBusinessCardModal();
              }}
              style={CommonStyles.floatButton}
            >
              <Image
                style={CommonStyles.floatButtonImage}
                source={appImages.iconPlusGreen}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
