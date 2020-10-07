import React, { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddMoveToListScreen } from '../../../shared/components/common-create-list/add-move-to-list';
import { SALES_API } from '../../../config/constants/api';
import { addProductTradingsToList } from '../product-manage-repository';
import { AddMoveToListRouteProp } from "../../../config/constants/root-stack-param-list";
import { getApiErrorMessage } from "../handle-error-message";
import { TypeMessage } from "../../../config/constants/enum";
import { translate } from "../../../config/i18n";
import { messages } from "../products-manage-messages";
import { useDispatch } from "react-redux";
import { productManageActions } from "../manage/product-manage-reducer";
import { responseMessages } from "../../../shared/messages/response-messages";

let refresh = false;

/**
 * Component show Add Product Trading To List Screen
 */
export function ProductManageAddToListScreen() {
  const navigation = useNavigation();
  const route = useRoute<AddMoveToListRouteProp>();
  const dispatch = useDispatch();

  const [messageWarning, setMessageWarning] = useState<any>({
    contentMessage: `${route?.params?.recordIds?.length} ${translate(messages.addToListMessage)}`,
    typeMessage: TypeMessage.INFO,
    isShowMessage: false
  });
  
  /**
   * call api addProductTradingsToList
   */
  const addProductTradingsToListFunc = async (idOfList: number) => {
    const params = {
      listOfProductTradingId: route?.params?.recordIds,
      idOfList,
    };
    const response = await addProductTradingsToList(params);
    if (response?.status == 200 && response?.data?.listOfProductTradingId) {
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessages.INF_TRA_0001).replace(
            '{0}',
            route?.params?.recordIds?.length.toString()
          ),
          type: TypeMessage.SUCCESS,
        }
      ));
      dispatch(productManageActions.refreshListReducer({}));
      navigation.isFocused() && navigation.goBack();
    } else {
      let error = getApiErrorMessage(response);
      setMessageWarning({
        contentMessage: error.content,
        typeMessage: error.type,
        isShowMessage: true
      })
    }
    refresh = false;
  };

  /**
   * on press confirm button
   */
  const onRightPress = (data: any[]) => {
    if (refresh) {
      return;
    }
    refresh = true;
    const idOfList = data.length === 0 ? 0 : data[0].listId;
    addProductTradingsToListFunc(idOfList);
  };

  return (
    <AddMoveToListScreen
      apiUrl={SALES_API.getListSuggestions}
      onRightPress={onRightPress}
      contentMessage={messageWarning.contentMessage}
      isShowMessage={messageWarning.isShowMessage}
      typeMessage={messageWarning.typeMessage}
      record={route?.params?.recordIds?.length}
    />
  );
}
