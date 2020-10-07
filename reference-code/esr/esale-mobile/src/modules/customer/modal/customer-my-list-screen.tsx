import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { myListStyles } from "./customer-my-list-styles";
import { initializeListModalSuggestion, createMyListSuggestion, updateMyListSuggestion } from "./customer-my-list-repository";
import {
  ListCustomer,
  InitializeListModalResspone,
  ValueCustomerList
} from "./customer-my-list-ressponse-interfaces";
import {
  CreateMyListDataRessponse,
  UpdateMyListDataRessponse
} from "./customer-my-list-create-update-interfaces"

import { translate } from "../../../config/i18n";
import { messages } from "./custormer-my-list-messages";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from '@react-navigation/native';

import { ListType } from "../list/customer-list-enum";
import { TEXT_EMPTY } from "../../../shared/components/message/message-constants";
import { CommonMessages, CommonMessage } from "../../../shared/components/message/message";
import { customerListActions, GetMessage } from "../list/customer-list-reducer";
import { useDispatch } from "react-redux";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { SafeAreaView } from "react-native-safe-area-context";
import { drawerLeftActions } from "../drawer/drawer-left-reducer";
import { TypeMessage } from "../../../config/constants/enum";
import { messagesComon } from "../../../shared/utils/common-messages";
import Modal from "react-native-modal";
import { ModalDirtycheckButtonBack } from "../../../shared/components/modal/modal";

/**
 * Screen create or update my list
 */
export function CustomerMylistScreen() {
  const dispatch = useDispatch();
  const [ressponseListCustomer, setRessponseListCustomer] = useState<ListCustomer>({ customerListId: 0, customerListName: "", customerListType: 0, isAutoList: false, isOverWrite: false });
  const [myListName, setMyListName] = useState("");
  const navigation = useNavigation();
  // Disable button save
  const [isDisable, setIsDisable] = useState(false);
  // Visible region error and change backgound my list input
  const [isError, setIsError] = useState(false);
  const [responseError, setResponseError] = useState<any>("");
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  // Define value params
  type RootStackParamList = {
    valueListCustomer: ValueCustomerList;
  };
  type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'valueListCustomer'>;
  const route = useRoute<ProfileScreenRouteProp>();
  const valueListCustomer: ValueCustomerList = route.params;

  /**
   * Function use ressponse from ressponse call API createList
   * @param ressponse 
   */
  const handleResponseCreateList = (ressponse: CreateMyListDataRessponse) => {
    // Do some thing there
    if (ressponse?.status === 200) {
      // Check ressponse return
      dispatch(drawerLeftActions.reloadLocalMenu(undefined));
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0003),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
      navigation.goBack();
    } else {
      // Enable button Save
      setIsDisable(false);
      setResponseError(ressponse);
      // color controll when error
      ressponse.data?.parameters?.extensions?.errors?.forEach((elementInfo: any) => {
        if (elementInfo.item === "customerListName") {
          setIsError(true);
        }
      })
    }

  }

  /**
   * Function use ressponse from ressponse call API updateList
   * @param ressponse 
   */
  const handleRessponseUpdateList = (ressponse: UpdateMyListDataRessponse) => {
    setIsDisable(false);
    // Do some thing there
    if (ressponse.status === 200) {
      dispatch(drawerLeftActions.reloadLocalMenu(undefined));
      dispatch(
        drawerLeftActions.handleSetTitleList({
          titleList: myListName,
        })
      );
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0004),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
      navigation.goBack();
      // TODO: handle Error
    } else {
      setIsError(true);
      setResponseError(ressponse);
      // color controll when error
      ressponse.data?.parameters?.extensions?.errors?.forEach((elementError: any) => {
        if (elementError.item === "customerListName") {
          setIsError(true);
        }
      })
    }
  }

  /**
   * Set value for ListParams and RessponseListCustomer
   * @param ressponse 
   */
  const handlingListCustomer = (ressponse: InitializeListModalResspone) => {
    if (ressponse?.data?.list) {
      const ressListCustomer: ListCustomer = ressponse.data.list;
      // Set data for listParams
      if (ressListCustomer) {
        setRessponseListCustomer(ressponse.data.list);
      } else {// Ressponse no data return, create new my list
        ressponseListCustomer.customerListName = myListName;
        setRessponseListCustomer(ressponseListCustomer);
      }
    }
  }

  /**
   * Function set data from ressponse, when call API initializeListModal
   * @param ressponse 
   */
  const handleErrInitializeListModal = (ressponse: InitializeListModalResspone) => {
    handlingListCustomer(ressponse);
  }

  /**
   * Call API createList
   */
  const handleCreateMyList = async () => {
    // Call API createList
    const responseCreate = await createMyListSuggestion(
      {
        customerListName: myListName,
        customerListType: ListType.MyList,
        isAutoList: false,
        listMembers: valueListCustomer?.listIdCustomer ? valueListCustomer.listIdCustomer : [],
      });
    handleResponseCreateList(responseCreate);
  }

  /**
   *  Call API updateList
   */
  const handleUpdateMyList = async () => {
    // Call API updateList
    const responseUpdate = await updateMyListSuggestion({
      customerListId: valueListCustomer.listId,
      customerListName: myListName,
      customerListType: ListType.MyList,
      isAutoList: valueListCustomer.isAutoList,
      updatedDate: "",
    }
    );
    handleRessponseUpdateList(responseUpdate);
  }

  /**
   * Handling click button save
   */
  const clickButtonSave = async () => {
    setIsDisable(true);
    // Check actoins call API createList
    if (valueListCustomer.status) {
      await handleCreateMyList();
    } else { // Update My List
      await handleUpdateMyList();
    }
  }
  /**
   * Dirty check
   */
  const dirtycheck = () => {
    return myListName !== TEXT_EMPTY;
  }
  /**
   * Handle back
   */
  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.navigate("customer-list");
    }
  };
  /**
   * Call API InitializeListModal
   */
  useEffect(() => {
    const handleGetInitializeListModal = async () => {
      setResponseError("");
      let response: InitializeListModalResspone;
      // Call API initializeListModal
      if (valueListCustomer?.listId) {
        response = await initializeListModalSuggestion({ customerListId: valueListCustomer.listId });
      } else {
        response = await initializeListModalSuggestion({})
      }
      if (response.status === 200) {
        handleErrInitializeListModal(response);
      } else {
        setResponseError(response);
      }
    }
    handleGetInitializeListModal();
  }, [valueListCustomer]
  );

  return (
    <SafeAreaView style={myListStyles.container}>
      <AppbarCommon
        title={translate(messages.title)}
        buttonText={translate(messages.buttonSave)}
        buttonType="complete"
        leftIcon="close"
        onPress={() => { clickButtonSave() }}
        handleLeftPress={onHandleBack}
        buttonDisabled={isDisable}
      />
      <ScrollView>
      {
        valueListCustomer?.listIdCustomer &&
        <View style={[myListStyles.viewCountListUserId, { paddingBottom: responseError !== TEXT_EMPTY ? 0 : 20 }]}>
          <CommonMessage
            type={TypeMessage.INFO}
            content={`${valueListCustomer?.listIdCustomer?.length} ${translate(messages.lableListN)}`}
          ></CommonMessage>
        </View>
      }
      {
        responseError !== TEXT_EMPTY &&
        <View style={myListStyles.viewRegionErrorShow}>
          <CommonMessages response={responseError} />
        </View>
      }
      <View style={valueListCustomer?.listIdCustomer ? myListStyles.viewLine : myListStyles.viewLineNone}>
      </View>
      <View style={isError ? { backgroundColor: '#FFDEDE' } : myListStyles.viewInput}>
        <View style={myListStyles.viewListName}>
          <Text>{translate(messages.lableMyListName)}</Text>
          <View style={myListStyles.viewRequired}>
            <Text style={myListStyles.labelRequired}>{translate(messages.lableRequire)}</Text>
          </View>
        </View>
        <View>
          <TextInput
            placeholderTextColor={'#999999'}
            placeholder={translate(messages.inputMyListName)} style={myListStyles.inputListName}
            // Get name of my list
            onChangeText={(myListName) => setMyListName(myListName)}
            maxLength={50}
          >{ressponseListCustomer?.customerListName}</TextInput>
        </View>
      </View>
      </ScrollView>
      <Modal isVisible={isVisibleDirtycheck}>
        <ModalDirtycheckButtonBack
          onPress={() => { setIsVisibleDirtycheck(false) }}
          onPressBack={() => { navigation.goBack() }}
        />
      </Modal>
    </SafeAreaView>
  )
}