import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddMoveToListScreen } from '../../../shared/components/common-create-list/add-move-to-list';
import { CUSTOMERS_API } from '../../../config/constants/api';
import { moveCustomersToOtherList } from '../customer-repository';

export interface CustomerMoveListScreenPrms {
  sourceListId: number;
}

/**
 * Customer move list screen
 */
export const CustomerMoveListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  /**
   * call api add list
   */
  const moveToList = async (idOfList: number) => {
    const params = {
      sourceListId: route?.params?.listId,
      destListId: idOfList,
      customerIds: route?.params?.listIdCustomer,
    };
    const response = await moveCustomersToOtherList(params);
    switch (response.status) {
      case 200:
        navigation.goBack();
        break;
      case 400:
        alert('Bad Request');
        break;
      default:
        alert('Server Error');
        break;
    }
  };

  const onRightPress = (data: any[]) => {
    moveToList(data[0]?.customerListId);
  };

  return (
    <AddMoveToListScreen
      isAddScreen={false}
      apiUrl={CUSTOMERS_API.getCustomerSuggestion}
      onRightPress={onRightPress}
      record={route?.params?.listIdCustomer.length}
      isCustomer
    />
  );
};
