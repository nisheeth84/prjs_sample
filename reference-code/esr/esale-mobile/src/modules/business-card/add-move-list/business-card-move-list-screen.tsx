import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AddMoveToListScreen } from '../../../shared/components/common-create-list/add-move-to-list';
import { BUSINESS_CARD_API } from '../../../config/constants/api';
import { useSelector, useDispatch } from 'react-redux';
import { drawerListSelectedSelector } from '../business-card-selector';
import { dragDropBusinessCard } from '../business-card-repository';
import { businessCardDrawerActions } from '../navigators/business-card-drawer-reducer';

let refresh = false;
export function BusinessCardMoveToListScreen() {
  const route: any = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const idOfOldList = useSelector(drawerListSelectedSelector).listId || 0;

  const dragDropBusinessCardFunc = async (idOfNewList: number) => {
    refresh = true;
    const params = {
      idOfNewList,
      idOfOldList,
      listOfBusinessCardId: route?.params?.recordIds,
    };
    const response = await dragDropBusinessCard(params);
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
        case 500:
          alert(response.data.parameters.extensions.errors[0].errorCode);
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
      dragDropBusinessCardFunc(data[0].listId);
    }
  };

  return (
    <AddMoveToListScreen
      isAddScreen={false}
      apiUrl={BUSINESS_CARD_API.getListSuggestions}
      onRightPress={onRightPress}
      record={route?.params?.totalRecords}
    />
  );
}
