import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { DeleteFollowedModal } from "./modal/delete-followed-modal";

import {
  followedStatus,
  followedListSelector,
  totalFollowedItemSelector,
} from "./follow-management-selector";
import { messages } from "./follow-management-messages";
import { translate } from "../../../config/i18n";


import { EnumStatus } from "../../../config/constants/enum-status";
import { CommonStyles } from "../../../shared/common-style";
import { followedActions } from "./follow-management-reducer";
import { FollowManagerItem } from "./follow-manager-item";
import { FollowMangementStyles as styles } from "./follow-management-style";
import { deleteFollowed } from "../timeline-repository";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { getFollowedList } from "./follow-management-repository";

export enum FollowedListDialog {
  deleteModal,
}

export interface FollowedModal {
  isOpen: boolean;
  type: FollowedListDialog;
}

/**
 * Component show followed detail screen
 */

export const FollowedManagementScreen = () => {
  const followedList = useSelector(followedListSelector) || [];
  const total = useSelector(totalFollowedItemSelector) || 0;
  const statusGetFollowed = useSelector(followedStatus);
  // const [reload, setReload] = useState(false);
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const [followedDetailModal, handleToggleModal] = useState<FollowedModal>({
    isOpen: false,
    type: FollowedListDialog.deleteModal,
  });
  const [paramDelete, setParamDelete] = useState({
    followTargetType: 0,
    followTargetId: 0,
  });

  /**
   * close modal
   */

  const closeModal = () => {
    handleToggleModal({
      isOpen: false,
      type: followedDetailModal.type,
    });
  };

  /**
   * call api delete followed
   */

  const deleteFollowedF = () => {
    async function callApi() {
      const params = {
        followeds: [paramDelete], // followTargetType, followTargetId
      };
      const response = await deleteFollowed(params);

      if (
        response?.status === 200
        //    &&
        //   response?.data?.data?.followeds != undefined
      ) {
        closeModal();
        getData();
      } else {
        dispatch(followedActions.setErrors({}));
      }
    }
    callApi();
  };

  /**
   * open delete followed modal
   */
  const openDeleteFollowedModal = (value: any) => {
    setParamDelete({
      followTargetType: value.followTargetType,
      followTargetId: value.followTargetId,
    });
    handleToggleModal({
      isOpen: true,
      type: FollowedListDialog.deleteModal,
    });
  };

  useEffect(() => {
    // navigation.addListener("focus", () => {
    //   getData();
    // });
    getData();
  }, []);

  const getData = async () => {
    const params = {
      // limit: 30,
      // offset: 0,
      followTargetType: null,
      followTargetId: null,
    };

    // dispatch(followedActions.getFollowedList(DUMMY_FOLLOWED_RESPONSE.data));
    const response = await getFollowedList(params);
    if (response) {
      dispatch(followedActions.getFollowedList(response?.data));
    }
  };

  /**
   * check status get followed
   * @param status
   */
  const checkStatus = (status: any) => {
    switch (status) {
      case EnumStatus.PENDING:
        return (
          <View style={CommonStyles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      case EnumStatus.SUCCESS:
        if (!_.isEmpty(followedList)) {
          return (
            <View>
              <View style={styles.main}>
                {followedList.map((value) => {
                  return (
                    <FollowManagerItem
                      clickDelete={() => {
                        openDeleteFollowedModal(value);
                      }}
                      createdDate={value.createdDate}
                      followTargetName={value.followTargetName}
                      followTargetType={value.followTargetType}
                      key={value.followTargetId}
                    />
                  );
                })}
              </View>
            </View>
          );
        }
        return <View />;
      default:
    }
  };

  return (
    <View style={CommonStyles.flex1}>
      <AppbarCommon
        title={translate(messages.title)}
        styleTitle={styles.titleStyle}
      />
      <ScrollView>
        <View style={styles.prTotal}>
          <Text style={styles.total}>
            {`${translate(messages.follow)} (${total}${translate(
              messages.record
            )})`}
          </Text>
        </View>
        {checkStatus(statusGetFollowed)}
        <Modal
          visible={followedDetailModal.isOpen}
          animationType="fade"
          transparent
          onRequestClose={() => {
            closeModal();
          }}
        >
          <DeleteFollowedModal
            onClickDelete={() => {
              deleteFollowedF();
            }}
            onCloseModal={() => {
              closeModal();
            }}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};
