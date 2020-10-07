import React, {} from "react";
import { Text, View } from "react-native";
import { ActivityHistoryInformationStyles } from "../tabs/activity-history-information/activity-history-information-style";
import { translate } from "../../../../config/i18n";
import { messages } from "../tabs/activity-history-information/activity-history-information-messages";
import { activityHistoryInformationActions } from "../tabs/activity-history-information/activity-history-information-reducer";
import { useDispatch, useSelector } from "react-redux";
import { GetActivityIdSelector, ParamActivitySelector } from "../tabs/activity-history-information/activity-history-information-selector";
import { deleteActivities, DeleteActivitiesResponse } from "../tabs/activity-history-information/activity-history-information-repository";
import { CommonButton } from "../../../../shared/components/button-input/button";
import { STATUSBUTTON, TypeButton } from "../../../../config/constants/enum";
import { MessageType } from "../enum";
import { GetMessage, customerListActions } from "../../list/customer-list-reducer";
import { messagesComon } from "../../../../shared/utils/common-messages";

/**
 * Component for show the confirmation dialog
*/
export function CustomerConfirmDialog() {
  const dispatch = useDispatch();
  const idActivity = useSelector(GetActivityIdSelector);
  const getParamActivity = useSelector(ParamActivitySelector);
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

  /**
   * action handle SetIsSuccess
   * @param type get type message
  */
  const handleSetIsShowMessage = (type: number) => {
    dispatch(
      activityHistoryInformationActions.handleSetIsShowMessage({
        isMessage : type
      })
    );
  }
  
  /**
   * action handle DeleteActivity
  */
  async function handleDeleteActivity () {
    handleIsDeleteConfirmDialog(false);
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(activityHistoryInformationActions.getResponseCustomerDetailTab({responseCustomerDetailTab: ""}));
    const resDeleteActivitysRequest = await deleteActivities({
      activityIds: [idActivity]
    });
    if (resDeleteActivitysRequest) {
      handleDeleteActivityResponse(resDeleteActivitysRequest);
    }
  }

  /**
   * action handle respone DeleteActivity
   * @param response DeleteActivitiesResponse
  */
  const handleDeleteActivityResponse = (response: DeleteActivitiesResponse) => {
    if (response.status == 200) {
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0005),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
      let setParam = Object.assign({}, getParamActivity);
      setParam.offset = 0;
      dispatch(activityHistoryInformationActions.setParamCustomers(setParam));
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(activityHistoryInformationActions.getResponseCustomerDetailTab({responseCustomerDetailTab: response}));
    }
  };

  return (
    <View style={ActivityHistoryInformationStyles.modal}>
      <Text style={ActivityHistoryInformationStyles.titleModal}>{translate(messages.recurringAppointment)}</Text>
      <Text style={ActivityHistoryInformationStyles.modalContentConfirmMessage}>{translate(messages.confirmDeleteOneItem)}</Text>
      <View style={ActivityHistoryInformationStyles.footerModal}>
        <CommonButton onPress= {() => handleIsDeleteConfirmDialog(false)} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {`${translate(messages.cancel)}`} typeButton = {TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
        <CommonButton onPress= {handleDeleteActivity} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {`${translate(messages.confirmDelete)}`} typeButton = {TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
      </View>
    </View>
  );
}