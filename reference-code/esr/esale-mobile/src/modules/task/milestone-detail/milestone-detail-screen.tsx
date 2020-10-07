import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DeleteMilestoneModal } from "./modal/delete-milestone-modal";

import {
  statusSelector,
  milestoneDetailSelector,
} from "./milestone-detail-selector";
import { messages } from "./milestone-detail-messages";
import { translate } from "../../../config/i18n";
import { milestoneDetailActions } from "./milestone-detail-reducer";
import { MilestoneDetailTopInfo } from "./milestone-detail-top-info";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { MilestoneDetailStyles } from "./milestone-detail-style";
import { MilestoneGeneralInforTabScreen } from "./tab-general-info/milestone-general-infor-tab-screen";
import { EnumStatus } from "../../../config/constants/enum-status";
import {
  getMilestoneDetail,
  MilestoneDetailResponse,
  deleteMilestones,
  updateMilestoneStatus,
  Milestone,
} from "../task-repository";
import { getFirstItem, checkTasKOfMilestoneComplete } from "../utils";
import { MilestoneHistoryTabScreen } from "./tab-history/milestone-history-tab-screen";
import { CompleteMilestoneModal } from "./modal/complete-milestone-modal";
import { MilestoneDetailScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { CommonStyles } from "../../../shared/common-style";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { copyToClipboard } from "../../../shared/util/app-utils";
import {
  ControlType,
  UpdateTaskStatusFlag,
} from "../../../config/constants/enum";
import { appImages } from "../../../config/constants";
import { ScreenName } from "../../../config/constants/screen-name";

export enum MilestoneDetailDialog {
  deleteModal,
  completeModal,
}

export interface MilestoneModal {
  isOpen: boolean;
  type: MilestoneDetailDialog;
}

/**
 * Component show milestone detail screen
 */
export const MilestoneDetailScreen = () => {
  const milestoneDetails = useSelector(milestoneDetailSelector);
  const Tab = createMaterialTopTabNavigator();
  const milestoneDetail: Milestone = getFirstItem(milestoneDetails);
  const statusGetMilestone = useSelector(statusSelector);
  const route = useRoute<MilestoneDetailScreenRouteProp>();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [milestoneDetailModal, handleToggleModal] = useState<MilestoneModal>({
    isOpen: false,
    type: MilestoneDetailDialog.completeModal,
  });

  /**
   * close modal
   */
  const closeModal = () => {
    handleToggleModal({
      isOpen: false,
      type: milestoneDetailModal.type,
    });
  };

  /**
   * call api complete milestone
   */
  const completeMilestone = () => {
    async function callApiCompleteMilestone() {
      const params = {
        milestoneId: milestoneDetail?.milestoneId,
        statusMilestoneId: milestoneDetail?.isDone,
        updateFlg: UpdateTaskStatusFlag,
      };
      const milestoneDetailResponse = await updateMilestoneStatus(params, {});

      if (
        milestoneDetailResponse?.status == 200 &&
        milestoneDetailResponse?.data?.data?.updateMilestoneStatus != undefined
      ) {
        const milestoneDetailF = _.cloneDeep(milestoneDetail);
        milestoneDetailF.isDone = 1;
        dispatch(milestoneDetailActions.saveMilestoneDetail(milestoneDetailF));
      }
    }
    callApiCompleteMilestone();
  };

  /**
   * call api delete milestone
   */
  const deleteMilestone = () => {
    async function callApiDeleteMilestone() {
      const params = {
        milestoneId: milestoneDetail?.milestoneId,
      };
      const milestoneDetailResponse = await deleteMilestones(params, {});
      if (milestoneDetailResponse) {
        if (
          milestoneDetailResponse.status === 200 &&
          milestoneDetailResponse?.data?.data?.deleteMilestone !== undefined
        ) {
          navigation.goBack();
        }
      }
    }
    callApiDeleteMilestone();
  };

  /**
   * open delete milestone modal
   */
  const openDeleteMilestoneModal = () => {
    handleToggleModal({
      isOpen: true,
      type: MilestoneDetailDialog.deleteModal,
    });
  };

  /**
   * open complete milestone modal
   */
  const openCompleteMilestoneModal = () => {
    handleToggleModal({
      isOpen: true,
      type: MilestoneDetailDialog.completeModal,
    });
  };

  /**
   * copy milestone
   */
  const copyMilestone = () => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, {
      milestoneId: milestoneDetail?.milestoneId,
      type: ControlType.COPY,
    });
  };

  /**
   * timeline milestone
   */
  const timelineMilestone = () => {
    navigation.navigate(ScreenName.TIMELINE_SCREEN, {});
  };
  /**
   * edit milestone
   */
  const editMilestone = () => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, {
      milestoneId: milestoneDetail?.milestoneId,
      type: ControlType.EDIT,
    });
  };

  /**
   * open activity list screen
   */
  const openActivityListScreen = () => {
    navigation.navigate(ScreenName.ACTIVITY_LIST);
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getDataMilestoneDetail();
    });


    async function getDataMilestoneDetail() {
      const params = {
        milestoneId: route.params?.milestoneId,
      };

      const milestoneDetailResponse = await getMilestoneDetail(params, {});
      console.log("milestoneDetailResponse", milestoneDetailResponse);


      if (milestoneDetailResponse) {
        handleErrorGetMilestoneDetail(milestoneDetailResponse);
      }
    }
    getDataMilestoneDetail();
  }, []);

  /**
   * hand get milestone detail
   * @param response
   */
  const handleErrorGetMilestoneDetail = (response: MilestoneDetailResponse) => {
    switch (response.status) {
      case 400: {
        break;
      }
      case 500: {
        break;
      }
      case 403: {
        break;
      }
      case 200: {
        dispatch(milestoneDetailActions.getMilestoneDetail(response?.data));
        break;
      }
      default:
        break;
    }
  };

  /**
   * check and get modal type
   * @param type
   */
  const checkModalType = (type: MilestoneDetailDialog) => {
    switch (type) {
      case MilestoneDetailDialog.deleteModal:
        return (
          <DeleteMilestoneModal
            onClickDelete={() => {
              deleteMilestone();
            }}
            onCloseModal={() => {
              closeModal();
            }}
          />
        );
      case MilestoneDetailDialog.completeModal:
        return (
          <CompleteMilestoneModal
            onClickCompleteMilestone={() => {
              completeMilestone();
            }}
            onCloseModal={() => {
              closeModal();
            }}
          />
        );
      default:
        return;
    }
  };

  /**
   * check status get milestone
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    switch (status) {
      case EnumStatus.PENDING:
        return (
          <View style={MilestoneDetailStyles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      case EnumStatus.SUCCESS:
        if (milestoneDetail != undefined) {
          return (
            <View style={CommonStyles.flex1}>
              <MilestoneDetailTopInfo
                timelineMilestone={timelineMilestone}
                isCreatedUser={milestoneDetail.isCreatedUser}
                milestoneName={milestoneDetail?.milestoneName}
                endDate={milestoneDetail?.endDate}
                isDone={milestoneDetail?.isDone}
                isPublic={milestoneDetail?.isPublic}
                completeMilestone={() => {
                  checkTasKOfMilestoneComplete(milestoneDetail?.listTask)
                    ? completeMilestone()
                    : openCompleteMilestoneModal();
                }}
                copyMilestone={() => {
                  copyMilestone();
                }}
                editMilestone={() => {
                  editMilestone();
                }}
                deleteMilestone={() => {
                  openDeleteMilestoneModal();
                }}
                shareMilestone={() => {
                  copyToClipboard(milestoneDetail?.url);
                }}
              />
              <View style={CommonStyles.flex1}>
                <Tab.Navigator
                  lazy
                  tabBar={(props) => <TopTabbar count={[0, 0, 0]} {...props} />}
                >
                  <Tab.Screen
                    name={translate(messages.basicInfo)}
                    component={MilestoneGeneralInforTabScreen}
                  />
                  <Tab.Screen
                    name={translate(messages.changeLog)}
                    component={MilestoneHistoryTabScreen}
                  />
                </Tab.Navigator>
              </View>
            </View>
          );
        }
        return;

      default:
        return;
    }
  };

  return (
    <SafeAreaView style={[MilestoneDetailStyles.containerWhite]}>
      <AppBarMenu name={translate(messages.screenTitle)} hasBackButton />
      {checkStatus(statusGetMilestone)}
      <Modal
        visible={milestoneDetailModal.isOpen}
        animationType="fade"
        transparent
        onRequestClose={() => {
          closeModal();
        }}
      >
        {checkModalType(milestoneDetailModal.type)}
      </Modal>
      <TouchableOpacity
        onPress={() => {
          openActivityListScreen();
        }}
        style={MilestoneDetailStyles.floatButton}
      >
        <Image
          style={MilestoneDetailStyles.floatButtonImage}
          source={appImages.iconPlusGreen}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
