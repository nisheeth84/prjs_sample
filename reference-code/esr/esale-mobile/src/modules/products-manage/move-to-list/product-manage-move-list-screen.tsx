import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddMoveToListScreen } from '../../../shared/components/common-create-list/add-move-to-list';
import { SALES_API } from '../../../config/constants/api';
import { dragDropProductTrading } from '../product-manage-repository';
import { AddMoveToListRouteProp } from "../../../config/constants/root-stack-param-list";
import { TypeMessage } from "../../../config/constants/enum";
import { messages } from "../products-manage-messages"
import { translate } from "../../../config/i18n";
import { getApiErrorMessage } from "../handle-error-message";
import { productManageActions } from "../manage/product-manage-reducer";
import { useDispatch } from "react-redux";
import { responseMessages } from "../../../shared/messages/response-messages";

let refresh = false;

/**
 * Component show move product trading to new list screen
 */
export function ProductManageMoveToListScreen() {
  const route = useRoute<AddMoveToListRouteProp>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [messageWarning, setMessageWarning] = useState<any>({
    contentMessage: `${route?.params?.recordIds?.length} ${translate(
      messages.moveToListMessage
    )}`,
    typeMessage: TypeMessage.INFO,
    isShowMessage: false,
  });

  /**
   * call api dragDropProductTrading to move product tradings to list
   */
  const callApiDragDropProductTradingFunc = async (idOfNewList: number) => {
    const params = {
      listOfProductTradingId: route?.params?.recordIds,
      idOfNewList,
      idOfOldList: route?.params?.idOfOldList,
    };
    const response = await dragDropProductTrading(params);
    if (response?.status && response?.data?.newIds) {
      dispatch(
        productManageActions.showMessageWarning({
          content: translate(responseMessages.INF_TRA_0001).replace(
            '{0}',
            route?.params?.recordIds?.length.toString()
          ),
          type: TypeMessage.SUCCESS,
        })
      );
      dispatch(productManageActions.refreshListReducer({}));
      navigation.goBack();
    } else {
      let error = getApiErrorMessage(response);
      setMessageWarning({
        contentMessage: error.content,
        typeMessage: error.type,
        isShowMessage: true,
      });
    }
    refresh = false;
  };

  const onRightPress = (data: any[]) => {
    if (refresh) {
      return;
    }
    refresh = true;
    const idOfNewList = data.length === 0 ? 0 : data[0].listId;
    callApiDragDropProductTradingFunc(idOfNewList);
  };

  return (
    <AddMoveToListScreen
      apiUrl={SALES_API.getListSuggestions}
      onRightPress={onRightPress}
      isAddScreen={false}
      contentMessage={messageWarning.contentMessage}
      isShowMessage={messageWarning.isShowMessage}
      typeMessage={messageWarning.typeMessage}
      record={route?.params?.recordIds?.length}
    />
  );
}
