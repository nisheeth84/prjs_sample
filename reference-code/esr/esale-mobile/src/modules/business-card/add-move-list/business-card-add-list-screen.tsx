import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AddMoveToListScreen } from '../../../shared/components/common-create-list/add-move-to-list';
import { BUSINESS_CARD_API } from '../../../config/constants/api';
import { addBusinessCardsToList } from '../business-card-repository';
import { businessCardDrawerActions } from '../navigators/business-card-drawer-reducer';
import { useDispatch } from 'react-redux';

let refresh = false;
export function BusinessCardAddToListScreen() {
  const route: any = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addBusinessCardsToListFunc = async (idOfList: number) => {
    refresh = true;
    const params = {
      idOfList,
      listOfBusinessCardId: route?.params?.recordIds,
    };
    const response = await addBusinessCardsToList(params);
    refresh = false;
    if (response) {
      switch (response.status) {
        case 200:
          dispatch(businessCardDrawerActions.refreshList({}));
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
    if (data.length === 0) {
      return;
    }
    if (!refresh) {
      addBusinessCardsToListFunc(data[0].listId);
    }
  };

  return (
    <AddMoveToListScreen
      apiUrl={BUSINESS_CARD_API.getListSuggestions}
      onRightPress={onRightPress}
      record={route?.params?.totalRecords}
    />
  );
}
