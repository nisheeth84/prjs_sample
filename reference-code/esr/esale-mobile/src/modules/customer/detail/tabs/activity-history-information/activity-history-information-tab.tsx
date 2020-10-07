import React, { useEffect, useState, useCallback } from "react";
import { 
 View, FlatList, Text
 } from "react-native";
import { ActivityHistoryInformationStyles } from "./activity-history-information-style";
import { useDispatch, useSelector } from "react-redux";
import { activityHistoryInformationActions } from "./activity-history-information-reducer";
import { getActivitiesSelector, ResponeCustomerDetailTabSelector, IsShowMessageSelector, ParamActivitySelector } from "./activity-history-information-selector";
import { getActivityHistoryInformation, GetActivityResponse } from "./activity-history-information-repository";
import { ActivityIndicatorLoading } from "../../shared/components/activity-indicator-loading";
import { ActivityHistoryInformationItem } from "../../shared/components/activity-history-information-item";
import { MessageType } from "../../enum";
import { CommonMessages } from "../../../../../shared/components/message/message";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";
import Toast from "react-native-tiny-toast";
import { MessageSuccessSelector } from "../../../list/customer-list-selector";
import { getCustomerIdSelector, getChildCustomerListSelector } from "../../customer-detail-selector";
import { CustomerListEmpty } from "../../../shared/components/customer-list-empty";
import { useFocusEffect } from "@react-navigation/native";
import { AppIndicator } from "../../../../../shared/components/app-indicator/app-indicator";
import { CustomerListStyles } from "../../../list/customer-list-style";

/**
 * Component for show Activity history Information tab
 */
export const ActivityHistoryInformationTab = () => {

  const dispatch = useDispatch();
  const listActivities = useSelector(getActivitiesSelector);
  //get status type message
  const isShowMessage = useSelector(IsShowMessageSelector);
  // get respone of detail tab 
  const responeCustomerDetailTab = useSelector(ResponeCustomerDetailTabSelector);
  const message = useSelector(MessageSuccessSelector);
  // get status loading
  const [statusLoading, setStatusLoading] = useState(false);
  const customerIdView = useSelector(getCustomerIdSelector);
  const customerChild = useSelector(getChildCustomerListSelector);
  const getParamActivity = useSelector(ParamActivitySelector);
  const [isLoading, setIsLoading] = useState(true);
  /**
   * call api GetCustomers async
  */
  async function getDataActivities() {
    let listCustomerId: Array<number> = customerChild;
    listCustomerId = [customerIdView, ...listCustomerId];
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(activityHistoryInformationActions.getResponseCustomerDetailTab({responseCustomerDetailTab: ""}));
    const resActivitys = await getActivityHistoryInformation({
      listCustomerId: listCustomerId,
      searchConditions: getParamActivity.searchConditions,
      filterConditions: getParamActivity.filterConditions,
      selectedTargetType: getParamActivity.selectedTargetType,
      selectedTargetId: getParamActivity.selectedTargetId,
      offset: getParamActivity.offset,
      limit:getParamActivity.limit,
    });
    if (resActivitys) {
      handleGetActivitiesResponse(resActivitys);
    }
  }

  /**
   * use useEffect hook to get list Activities
  */
  useEffect(() => {
    setIsLoading(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataActivities();
    }, [getParamActivity])
  );

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
  // TODO
  /**
   * action handle scroll load listActivities 
  */
  // async function handleLoadMore () {
  //   if (getParamActivity.offset + getParamActivity.limit < listActivities.total) {
  //       dispatch(activityHistoryInformationActions.getStatusLoadmore({statusLoadmore: "appending"}));
  //       setStatusLoading(true);
  //       let setParam = Object.assign({}, getParamActivity);
  //       setParam.offset = getParamActivity.offset + getParamActivity.limit;
  //       console.log("handleLoadMore setParam", setParam);
  //       dispatch(activityHistoryInformationActions.setParamCustomers(setParam));
  //   }
  // }

  /**
   * action handle response GetActivities
   * @param response ActivityHistoryInformationResponse
  */
  const handleGetActivitiesResponse = (response: GetActivityResponse) => {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(activityHistoryInformationActions.getResponseCustomerDetailTab({responseCustomerDetailTab: ""}));
    if (response?.status == 200) {
      dispatch(activityHistoryInformationActions.getActivities(response.data));
      setStatusLoading(false);
      setIsLoading(false);
      if(response.data.total <= 0) {
        handleSetIsShowMessage(MessageType.NO_DATA);
      }
    }else{
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(activityHistoryInformationActions.getResponseCustomerDetailTab({responseCustomerDetailTab: response}));
    }
  };

  return(
    <View style={ActivityHistoryInformationStyles.container}>

        { isLoading &&
          <View style={{height: "100%"}}>
            <AppIndicator size={40} style={CustomerListStyles.containerF} />
          </View>
        }
        
        {
          isShowMessage === MessageType.ERROR && responeCustomerDetailTab !== "" &&
          <View style={ActivityHistoryInformationStyles.messageStyle}>
            <CommonMessages response={responeCustomerDetailTab} />
          </View>
        }
        {
          isShowMessage === MessageType.NO_DATA &&
          <CustomerListEmpty />
        }
        <FlatList 
          data={listActivities.activities}
          // onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={ActivityIndicatorLoading(statusLoading)}
          keyExtractor={(item, index)=> "key" + item.activityId + index}
          renderItem={({ item, index }) => (
            <ActivityHistoryInformationItem
              key={item.activityId}
              activity={item}
              styleActivityItem = {index === listActivities.activities.length - 1 ? {} : ActivityHistoryInformationStyles.mrBottom}
            />
          )}
        />
        { message.visible &&
        <Toast
          visible={message.visible}
          position={-65}
          shadow={false}
          animation={false}
          textColor='#333333'
          imgStyle={{marginRight: 5}}
          imgSource={require("../../../../../../assets/icons/SUS.png")}
          containerStyle={CustomerDetailScreenStyles.viewToast}
        >
          <Text>{message.toastMessage}</Text>
        </Toast>
        }
    </View>
  );
}