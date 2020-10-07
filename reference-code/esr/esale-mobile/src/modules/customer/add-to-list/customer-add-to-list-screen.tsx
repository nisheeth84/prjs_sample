import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AddMoveToListScreen } from "../../../shared/components/common-create-list/add-move-to-list";
import { CUSTOMERS_API } from "../../../config/constants/api";
import { addCustomersToList } from "../customer-repository";

export const CustomerAddToListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  /**
   * call api add list
   */
  const addToList = async (idOfList: number) => {
    const params = {
      customerIds: route?.params?.listIdCustomer,
      customerListId: idOfList,
    };
    const response = await addCustomersToList(params);
    if (response) {
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
    }
  };

  const onRightPress = (data: any[]) => {
    addToList(data[0]?.customerListId);
  };

  return (
    <AddMoveToListScreen
      apiUrl={CUSTOMERS_API.getCustomerSuggestion}
      onRightPress={onRightPress}
      record={route?.params?.listIdCustomer.length}
      isCustomer
    />
  );
};
