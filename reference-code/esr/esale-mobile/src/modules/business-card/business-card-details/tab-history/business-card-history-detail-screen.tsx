import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, Text, Modal } from "react-native";

import {
  statusSelector,
  businessCardDetailSelector,
} from "../business-card-detail-selector";
import { messages } from "../business-card-detail-messages";
import { messages as prMessage } from "../../business-list-card/business-card-messages";
import { translate } from "../../../../config/i18n";
import { useSelector, useDispatch } from "react-redux";
import { businessCardDetailActions } from "../business-card-detail-reducer";
import { AppBarMenu } from "../../../../shared/components/appbar/appbar-menu";
import {
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { EnumStatus } from "../../../../config/constants/enum-status";
import {
  Follow,
  BusinessCardDetailDialog,
} from "../../../../config/constants/enum";
import {
  BusinessCard,
  getBusinessCardDetail,
  createFollowed,
  deleteFollowed,
} from "../business-card-repository";
import {
  getFirstItem,
  getFormatDateTaskDetail,
} from "../../../../shared/util/app-utils";
import { BusinessCardScreenRouteProp } from "../../../../config/constants/root-stack-param-list";
import { CommonStyles } from "../../../../shared/common-style";
import { BusinessCardDetailTopInfo } from "../business-card-detail-top-info";
import {
  queryCreateFollowed,
  queryDeleteFollowed,
} from "../query";
import { appImages } from "../../../../config/constants";
import { Button } from "../../../../shared/components/button";
import {
  HistoryUpdateDetailStyle,
  BusinessCardDetailStyle,
} from "../business-card-detail-style";
import { EnumFmDate } from "../../../../config/constants/enum-fm-date";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TopTabbar } from "../../../../shared/components/toptabbar/top-tabbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BusinessCardBasicInfoScreen } from "../tab-basic-info/business-card-basic-info-screen";
import { ShowImageModal } from "../modal/show-image-modal";
import _ from "lodash";
import { ListEmptyComponent } from "../../../../shared/components/list-empty/list-empty";

export interface BusinessCardModal {
  isOpen: boolean;
  type: BusinessCardDetailDialog;
}

/**
 * business card history update detail screen
 */

export const BusinessCardHistoryDetailScreen = () => {
  const businessCardDetails = useSelector(businessCardDetailSelector);
  let businessCardDetail: BusinessCard = getFirstItem(businessCardDetails);

  const statusGetBusinessCard = useSelector(statusSelector);
  const route = useRoute<BusinessCardScreenRouteProp>();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [businessCardDetailModal, handleToggleModal] = useState<
    BusinessCardModal
  >({
    isOpen: false,
    type: BusinessCardDetailDialog.SHOW_IMAGE_MODAL,
  });

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
   * open show image modal
   */
  const openShowImageModal = () => {
    handleToggleModal({
      isOpen: true,
      type: BusinessCardDetailDialog.SHOW_IMAGE_MODAL,
    });
  };

  /**
   * call api create followed
   */
  const createFollowedF = () => {
    async function callApi() {
      let params = {};
      let response = await createFollowed(queryCreateFollowed(params), {});
      if (
        response?.status == 200 &&
        response?.data?.data?.createFollowed != null
      ) {
        let businessCardDetailF = _.cloneDeep(businessCardDetail);
        businessCardDetailF.hasFollow = Follow.HAS_FOLLOW;
        dispatch(
          businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
        );
      }
    }
    callApi();
    let businessCardDetailF = _.cloneDeep(businessCardDetail);
    businessCardDetailF.hasFollow = Follow.HAS_FOLLOW;
    dispatch(
      businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
    );
  };

  /**
   * call api deleteFollowed
   */
  const deleteFollowedF = () => {
    async function callApi() {
      let params = {};
      let response = await deleteFollowed(queryDeleteFollowed(params), {});
      if (response?.status == 200 && response?.data?.data?.followeds != null) {
        let businessCardDetailF = _.cloneDeep(businessCardDetail);
        businessCardDetailF.hasFollow = Follow.NO_FOLLOW;
        dispatch(
          businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
        );
      }
    }
    callApi();
    let businessCardDetailF = _.cloneDeep(businessCardDetail);
    businessCardDetailF.hasFollow = Follow.NO_FOLLOW;
    dispatch(
      businessCardDetailActions.saveBusinessCardDetail(businessCardDetailF)
    );
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getDataBusinessCardDetail();
    });

    async function getDataBusinessCardDetail() {
      let params = {
        businessCardId: route.params?.businessCardId,
        businessCardHistoryId: route.params?.businessCardHistoryId,
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
  }, [
    route.params?.businessCardId,
    route.params?.businessCardHistoryId,
    route.params?.updatedDate,
  ]);

  const Tab = createMaterialTopTabNavigator();

  /**
   * check status get busniess card
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    switch (status) {
      case EnumStatus.PENDING:
        return (
          <View style={CommonStyles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      case EnumStatus.SUCCESS:
        return (
          businessCardDetail && (
            <View>
              <View style={HistoryUpdateDetailStyle.infoMessage}>
                <Image
                  source={appImages.icI}
                  style={[CommonStyles.imageSmall]}
                />
                <Text
                  style={[HistoryUpdateDetailStyle.messInfoHistoryUpdateDetail]}
                >
                  {`${translate(
                    messages.historyDetailMess1
                  )}${getFormatDateTaskDetail(
                    route.params?.updatedDate,
                    EnumFmDate.YEAR_MONTH_DAY_HM_NORMAL
                  )}${translate(messages.historyDetailMess2)}`}
                </Text>
                <View>
                  <Button
                    onPress={() => navigation.goBack()
                      // {openNewestInfo();}
                    }
                    variant={"incomplete"}
                  >
                    <Text>{translate(messages.openNewestInfo)}</Text>
                  </Button>
                </View>
              </View>
              <BusinessCardDetailTopInfo
                businessCardImageName={
                  businessCardDetail?.businessCardImageName
                }
                businessCardImagePath={
                  businessCardDetail?.businessCardImagePath
                }
                customerName={businessCardDetail?.customerName}
                customerId={businessCardDetail?.customerId}
                alternativeCustomerName={
                  businessCardDetail?.alternativeCustomerName
                }
                departmentName={businessCardDetail?.departmentName}
                position={businessCardDetail?.position}
                firstName={businessCardDetail?.firstName}
                lastName={businessCardDetail?.lastName}
                hasActivity={businessCardDetail?.hasActivity}
                lastContactDate={businessCardDetail?.lastContactDate}
                businessCardReceives={businessCardDetail?.businessCardReceives}
                hasFollow={businessCardDetail?.hasFollow}
                pressImage={() => {
                  openShowImageModal();
                }}
                follow={() => {
                  createFollowedF();
                }}
                unfollow={() => {
                  deleteFollowedF();
                }}
                openTimeline={() => { }}
                deleteBusinessCard={() => { }}
                editBusinessCard={() => { }}
                isHistory={true}
              />
            </View>
          )
        );
      default:
        return;
    }
  };

  return (
    <SafeAreaView style={CommonStyles.containerWhite}>
      <View>
        <View>
          <AppBarMenu
            name={translate(messages.screenTitle)}
            hasBackButton={true}
          />
        </View>
        {!route ? (
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
                <ShowImageModal
                  onCloseModal={() => {
                    closeModal();
                  }}
                  hasPrev={
                    route.params?.isShowPrevNext &&
                    !!route.params?.prevBusinessCardId
                  }
                  hasNext={
                    route.params?.isShowPrevNext &&
                    !!route.params?.nextBusinessCardId
                  }
                  imagePath={businessCardDetail?.businessCardImagePath}
                  onClickLeft={() => { }}
                  onClickRight={() => { }}
                />
              </Modal>
              <View style={CommonStyles.height100}>
                <View style={[BusinessCardDetailStyle.historyDetailTab]}>
                  <Tab.Navigator
                    lazy
                    tabBar={(props) => (
                      <TopTabbar
                        count={[0]}
                        {...props}
                      />
                    )}
                  >
                    <Tab.Screen
                      name={translate(prMessage.basicInfo)}
                      component={BusinessCardBasicInfoScreen}
                      initialParams={{
                        businessCardId: route?.params?.businessCardHistoryId,
                      }}
                    />

                  </Tab.Navigator>
                </View>
              </View>
            </>
          )}
      </View>
    </SafeAreaView>
  );
};
