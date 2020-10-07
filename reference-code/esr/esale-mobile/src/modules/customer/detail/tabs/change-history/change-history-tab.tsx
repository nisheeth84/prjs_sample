import React, { FC, useState, useEffect } from "react";
import {
  SafeAreaView, FlatList, View
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { ChangeHistoryItem } from "./change-history-item";
import { ChangeHistoryStyles } from "./change-history-style";
import { getChangeHistory, ChangeHistoryResponse } from "./change-history-repository";
import { LimitRecord, MessageType } from "../../enum";
import { getCustomerIdSelector } from "../../customer-detail-selector";
import { changeHistoryActions } from "./change-history-reducer";
import { getChangeHistorySelector } from "./change-history-selector";
import { ActivityIndicatorLoading } from "../../shared/components/activity-indicator-loading";
import { translate } from "../../../../../config/i18n";
import {
  CommonMessages,
  CommonMessage,
  //CommonFilterMessage,
} from "../../../../../shared/components/message/message";
import { TypeMessage } from "../../../../../config/constants/enum";
import { messagesComon } from "../../../../../shared/utils/common-messages";
import { TEXT_EMPTY } from "../../../../../config/constants/constants";

export interface ChangeHistoryTabProp {
  //screen navigation
  navigation: any,
  route: any
}

/**
 * Component for show change history tab
 * @param ChangeHistoryTabProp 
 */
export const ChangeHistoryTab: FC<ChangeHistoryTabProp> = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const customerId = useSelector(getCustomerIdSelector);
  const changeHistoryList = useSelector(getChangeHistorySelector);
  const [isLoading, setIsLoading] = useState(false);
  const [responeCustomerDetailTab, setResponeCustomerDetailTab] = useState<any>(TEXT_EMPTY);
  const [isShowMessageError, setIsShowMessageError] = useState(MessageType.DEFAULT);

  async function getChangeHistoryData() {
    setResponeCustomerDetailTab(TEXT_EMPTY);
    const changeHistoryResponse = await getChangeHistory({ customerId: customerId, currentPage: currentPage, limit: LimitRecord.LIMIT_30 });
    setIsLoading(false);
    if (changeHistoryResponse) {
      handleChangeHistoryResponse(changeHistoryResponse);
    }
  }

  useEffect(() => {
    setIsShowMessageError(MessageType.DEFAULT);
    getChangeHistoryData();
    dispatch(changeHistoryActions.getChangeHistory({ list: changeHistoryList }));
  }, [])

  const handleChangeHistoryResponse = (response: ChangeHistoryResponse) => {
    setIsShowMessageError(MessageType.DEFAULT);
    if (response.status === 200) {
      const responseData = response.data;
      currentPage === 1
        ? dispatch(changeHistoryActions.getChangeHistory({ list: responseData }))
        : dispatch(changeHistoryActions.addItemChangeHistory({ list: responseData }));
      setCurrentPage(currentPage + responseData.customersHistory.length);
      if (responseData.customersHistory.length > 0) {
        setIsShowMessageError(MessageType.SUCCESS);
      } else {
        setIsShowMessageError(MessageType.NO_DATA);
      }
    } else {
      setIsShowMessageError(MessageType.ERROR);
      setResponeCustomerDetailTab(response);
    }
  };

  async function handleLoadMore() {
    setIsLoading(true);
    if (!isLoading) {
      await getChangeHistoryData();
    }
  }
  return (
    <SafeAreaView style={[ChangeHistoryStyles.container]}>
      {/* {!isSuccess && Message(translate(messages.errorConnectFailedMessage), "red", "ellipseBlue")} */}

      {
        isShowMessageError === MessageType.ERROR && responeCustomerDetailTab !== "" &&
        <View style={ChangeHistoryStyles.messageStyle}>
          <CommonMessages response={responeCustomerDetailTab} />
        </View>
      }
      {/* {
         isShowMessageError === MessageType.NO_DATA &&
         <View>
           <CommonFilterMessage
               iconName="employee"
               content={format(translate(responseMessages[errorCode.infoCom0020]), ...[translate(messages.changeHistoryTab)])}></CommonFilterMessage>
         </View>
	       } */}
      <FlatList
        data={changeHistoryList.customersHistory}
        renderItem={({ item, index }) => (
          <ChangeHistoryItem
            data={item}
            isLast={changeHistoryList.customersHistory.length - 1 === index}
          />
        )}
        ListFooterComponent={ActivityIndicatorLoading(isLoading)}
        keyExtractor={(item, index) => "key" + item.createdUserId + index}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      >
      </FlatList>
      {isShowMessageError === MessageType.SUCCESS &&
        <View style={ChangeHistoryStyles.messageStyle}>
          <CommonMessage content={translate(messagesComon.INF_COM_0001)} type={TypeMessage.SUCCESS} onPress={Object}></CommonMessage>
        </View>
      }
    </SafeAreaView >
  );
}
