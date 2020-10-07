import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import _ from "lodash"
import { TypeActionListShareCustomer, KeySearch, TypeMessage, TypeSelectSuggest, ActionType, NameControl } from "../../../../config/constants/enum";
import { CustomerListShareStyles } from './customer-list-share-style';
import { AppbarCommon } from '../../../../shared/components/appbar/appbar-common';
import { CommonMessage, CommonMessages } from '../../../../shared/components/message/message';
import { authorizationSelector } from '../../../login/authorization/authorization-selector';
import { TYPE_MEMBER } from '../../../../config/constants/query';
import { messages } from './customer-list-share-messages';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import { EmployeeDTO } from '../../../../shared/components/suggestions/interface/employee-suggest-interface';
import { translate } from '../../../../config/i18n';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from '../../../../shared/components/input';
import { EmployeeSuggestView } from '../../../../shared/components/suggestions/employee/employee-suggest-view';
import { ModalDirtycheckButtonBack } from '../../../../shared/components/modal/modal';
import { theme } from '../../../../config/constants';
import { initializeListModal, createList, updateList } from './customer-list-share-repository';
import { ListType, MagicNumberDrawerLeft, Parameters, SelectedTargetType } from '../../list/customer-list-enum';
import { ressponseStatus, } from '../../../../shared/components/message/message-constants';
import { drawerLeftActions } from '../../drawer/drawer-left-reducer';
import { customerListActions, GetCustomerParam } from '../../list/customer-list-reducer';
import { LIST, PARRICIPANT } from '../../drawer/drawer-left-enum';
import { messages as drawLeftMessages } from '../../drawer/drawer-left-messages';
import { ServiceFavoriteSelector, ServiceInfoSelector } from '../../../menu/menu-feature-selector';
import StringUtils from '../../../../shared/util/string-utils';


interface ListParticipantItem {
  employeeId?: number,
  departmentId?: number,
  groupId?: number,
  participantType: number
}

/**
 * Component show list share 
 * @param props see CustomerListShareProps
 */
export default function CustomerListShare() {
  const navigation = useNavigation();
  const route = useRoute();
  const typeActionList = (route?.params as any).typeActionListShare || TypeActionListShareCustomer.ADD_FROM_LEFT_MENU;
  const listCustomerPicked = (route?.params as any).listCustomerPicked || [];
  const listId = (route?.params as any).listId || -1;
  const dispatch = useDispatch();
  const [listName, setListName] = useState(TEXT_EMPTY);
  const [listNameInitial, setListNameInitial] = useState('');
  const [buttonActive, setActiveButton] = useState(true);
  const [updatedDate, setUpdatedDate] = useState('');
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceOther = useSelector(ServiceInfoSelector);
  // get employee filter from redux
  const [isVisibleDirtyCheck, setIsVisibleDirtyCheck] = useState(false);
  const [listParticipantsInitial, setListParticipantsInitial] = useState<EmployeeDTO[]>([]);
  const loginInfo = useSelector(authorizationSelector);
  const [listParticipant, setListParticipant] = useState<any[]>([]);
  const [suggestionsChoice, setSuggestionsChoice] = useState({
    departments: [], employees: [{
      employeeId: loginInfo.employeeId,
      participantType: TYPE_MEMBER.OWNER
    }], groups: []
  });
  const [responseError, setResponseError] = useState<any>("");
  const [isShowError, setIsShowError] = useState(false);
  const [isErrorInputlistName, setIsErrorInputListName] = useState(false);
  const [isErrorInputListParticipant, setIsErrorInputListParticipant] = useState(false);
  const [valueSelected, setValueSelected] = useState<EmployeeDTO[]>([]);
  let typeCreate = TEXT_EMPTY;
  // check the status in what mode
  useEffect(() => {
    if (typeActionList !== TypeActionListShareCustomer.ADD && typeActionList !== TypeActionListShareCustomer.ADD_FROM_LEFT_MENU) {
      setData();
    }
  }, []);
  useEffect(() => {
    if (listParticipant.length > 0 ? listParticipantsInitial.length < listParticipant.length : listParticipantsInitial.length === 0) {
      setListParticipantsInitial(_.cloneDeep(valueSelected));
    }
  }, [valueSelected])

  // get data for listName and ListParticipant from API INITIALIZE_SHARE_List_MODAL
  const setData = async () => {
    const listInfo = await initializeListModal(
      {
        customerListId: listId
      }
    )
    if (listInfo?.data?.list && listInfo?.data?.listParticipants) {
      // get data success
      setListName(listInfo.data.list.customerListName);
      setListNameInitial(listInfo.data.list.customerListName);
      setUpdatedDate(listInfo.data.list.updatedDate);
      let departments: any = [];
      let employees: any = [];
      let groups: any = [];
      listInfo.data.listParticipants.forEach((listParticipant: ListParticipantItem) => {
        if (listParticipant.employeeId) {
          employees.push({
            employeeId: listParticipant.employeeId,
            participantType: listParticipant.participantType
          })
        } else if (listParticipant.departmentId) {
          departments.push({
            departmentId: listParticipant.departmentId,
            participantType: listParticipant.participantType
          })
        } else if (listParticipant.groupId) {
          groups.push({
            groupId: listParticipant.groupId,
            participantType: listParticipant.participantType
          })
        }
      })
      setListParticipant(listInfo.data.listParticipants);
      setSuggestionsChoice({ departments, employees, groups });
    } else {
      setIsShowError(true);
      setResponseError(listInfo);
    }
  }

  function getFunctionTitle() {
    let service = serviceFavorite.find(item => item.serviceId === 5);
    !service && (service = serviceOther.find(item => item.serviceId === 5));
    return StringUtils.getFieldLabel(service, "serviceName", loginInfo.languageCode);

  }

  // function create/update share List
  const handleUpdateList = async () => {
    setActiveButton(false);
    let response = null;
    let listParticipants: ListParticipantItem[] = [];

    valueSelected.forEach((item) => {
      switch (item.groupSearch) {
        case (KeySearch.EMPLOYEE): {
          listParticipants.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            employeeId: item.itemId
          })
          break;
        }
        case (KeySearch.DEPARTMENT): {
          listParticipants.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            departmentId: item.itemId
          })
          break;
        }
        case (KeySearch.GROUP): {
          listParticipants.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            groupId: item.itemId
          })
          break;
        }
      }
    })
    switch (typeActionList) {
      case (TypeActionListShareCustomer.ADD):
      case (TypeActionListShareCustomer.ADD_FROM_LEFT_MENU):
      case (TypeActionListShareCustomer.COPY): {
        // call api create List
        response = await createList(
          {
            customerListName: listName,
            customerListType: ListType.ShareList,
            isAutoList: false,
            listMembers: [...listCustomerPicked],
            listParticipants: listParticipants
          }
        );
        typeCreate = ActionType.CREATE;
        break;
      }
      case (TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST):
      case (TypeActionListShareCustomer.EDIT):
        {
          response = await updateList(
            {
              customerListId: listId,
              customerListName: listName,
              customerListType: ListType.ShareList,
              isAutoList: false,
              updatedDate: updatedDate,
              listParticipants: listParticipants
            }
          );
          typeCreate = ActionType.UPDATE;
          break;
        }
    }
    // update or create success
    if (response?.status === ressponseStatus.statusSuccess) {
      // reload local menu
      dispatch(drawerLeftActions.reloadLocalMenu(undefined));
      // reload employee-list mode edit
      if (typeActionList === TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST || typeActionList === TypeActionListShareCustomer.EDIT) {
        let newParticipantType = -1;
        let indexLoginUser = listParticipants.findIndex((item: ListParticipantItem) => {
          if (item.employeeId && item.employeeId === loginInfo.employeeId) {
            newParticipantType = item.participantType;
            return true;
          }
          return false;
        })
        if (indexLoginUser === -1) {
          // userLogin not in List participant
          // load all customer
          dispatch(customerListActions.handleExpland({
            connection: MagicNumberDrawerLeft.StatusShowIconArrowRight
          })
          );
          var param: GetCustomerParam = {
            selectedTargetId: Parameters.SelectedTargetId,
            selectedTargetType: SelectedTargetType.CustomerAll,
            isUpdateListView: false,
            searchConditions: [],
            filterConditions: [],
            localSearchKeyword: "",
            orderBy: [],
            offset: 0,
            limit: 20,
          }
          dispatch(customerListActions.setParamCustomers(param));
          renderActionListUser(LIST.NODATA, true, PARRICIPANT.NODATA);
          dispatch(
            drawerLeftActions.handleSetTitleList({
              titleList: translate(drawLeftMessages.allCustomers),
            })
          );
          dispatch(
            customerListActions.handleSetStatusShowLastUpdatedDate({
              status: false,
            })
          );
          dispatch(
            customerListActions.handleSetStatusHideActionList({
            })
          );
          dispatch(
            customerListActions.actionSetCustomerListType({
              listId: LIST.NO_LIST_ID,
              typeList: LIST.NODATA,
              isAutoList: false,
              selectedTargetType: SelectedTargetType.CustomerAll,
            })
          );
        } else {
          // loginUser in List
          // update participant type
          dispatch(customerListActions.handleExpland({
            connection: MagicNumberDrawerLeft.StatusShowIconArrowRight
          })
          );
          dispatch(
            drawerLeftActions.handleSetTitleList({
              titleList: listName,
            })
          );
          var paramShareList: GetCustomerParam = {
            selectedTargetId: listId,
            selectedTargetType: SelectedTargetType.CustomerShareList,
            isUpdateListView: false,
            searchConditions: [],
            filterConditions: [],
            localSearchKeyword: "",
            orderBy: [],
            offset: 0,
            limit: 20,
          }
          dispatch(customerListActions.setParamCustomers(paramShareList));
          dispatch(
            customerListActions.handleSetStatusShowLastUpdatedDate({
              status: false,
            })
          );
          renderActionListUser(LIST.SHARELIST, false, newParticipantType === TYPE_MEMBER.MEMBER ? PARRICIPANT.MEMBER : PARRICIPANT.OWNER);
          renderExplandStatusMyList(false, newParticipantType === TYPE_MEMBER.MEMBER ? PARRICIPANT.MEMBER : PARRICIPANT.OWNER, false);
          dispatch(
            customerListActions.actionSetCustomerListType({
              listId: listId,
              typeList: ListType.ShareList,
              isAutoList: false,
              selectedTargetType: SelectedTargetType.CustomerShareList,
            })
          );
          dispatch(
            customerListActions.handleSetStatusShowActionList({
            })
          );
        }
      }
      if (typeActionList !== TypeActionListShareCustomer.ADD_FROM_LEFT_MENU) {
        // reload data list
      }
      // navigate back
      navigation.navigate("customer-list", { notify: typeCreate, isShow: true });
    } else {
      setActiveButton(true);
      let isErrorListName = false;
      let isErrorListParticipant = false;
      // TODO handle error
      response?.data?.parameters?.extensions?.errors.forEach((elementInfo: any) => {
        if (elementInfo.item === NameControl.customerListName) {
          isErrorListName = true;
        } else if (elementInfo.item === NameControl.listParticipants) {
          isErrorListName = true;
        }
      })
      setIsErrorInputListName(isErrorListName);
      setIsErrorInputListParticipant(isErrorListParticipant);
      setIsShowError(true);
      setResponseError(response);
    }
  }
  const dirtyCheck = () => {
    return (listName !== listNameInitial) || (!_.isEqual(valueSelected, listParticipantsInitial));
  }

  const onHandleBack = () => {
    if (dirtyCheck()) {
      setIsVisibleDirtyCheck(true);
    } else {
      navigation.navigate("customer-list");
    }
  };

  /**
   * Cases that show an overflow menu in Local navigation
   * @param isAutoList get value isAutoList
   * @param participant_type get type owner and member of list
   * @param isFavoriteslist get type Favoriteslist
  */
  const renderExplandStatusMyList = (isAutoList: boolean, participant_type: any, isFavoriteslist: boolean) => {
    let itemExplandStatusMyList = [];
    // Update list
    if ((isAutoList && participant_type === PARRICIPANT.NODATA) || (isAutoList && participant_type === PARRICIPANT.OWNER)) { //PARRICIPANT
      itemExplandStatusMyList.push({ id: 1, cate: translate(drawLeftMessages.myListDeleteList) })
    }
    //Subscribe to your favorites list
    if (!isFavoriteslist) {
      itemExplandStatusMyList.push({ id: 2, cate: translate(drawLeftMessages.myListSubscribeFavorites) })
    }
    //Remove from Favorites list
    if (isFavoriteslist) {
      itemExplandStatusMyList.push({ id: 6, cate: translate(drawLeftMessages.myListRemoveFavorites) })
    }
    // Edit list + Delete strike
    if ((participant_type === PARRICIPANT.NODATA && !isAutoList) || (!isAutoList && participant_type === PARRICIPANT.OWNER)) {
      itemExplandStatusMyList.push({ id: 3, cate: translate(drawLeftMessages.myListEditList) })
      itemExplandStatusMyList.push({ id: 4, cate: translate(drawLeftMessages.myListDeleteStrike) })

    }
    //Copy List
    if ((participant_type === PARRICIPANT.NODATA && !isAutoList) ||
      (!isAutoList && participant_type === PARRICIPANT.OWNER) ||
      (!isAutoList && participant_type === PARRICIPANT.MEMBER)) {
      itemExplandStatusMyList.push({ id: 5, cate: translate(drawLeftMessages.myListCopyList) })
    }
    //Change list to shared list
    if (!isFavoriteslist && !isAutoList && participant_type === PARRICIPANT.NODATA) {
      itemExplandStatusMyList.push({ id: 7, cate: translate(drawLeftMessages.myListChangeSharedList) })
    }
    const connection = itemExplandStatusMyList;
    dispatch(
      customerListActions.handleExplandStatusMyList({
        connection
      })
    );
  }

  /**
    * The case when manipulating customers
    * @param list get type of list
    * @param isAutoList get value isAutoList
    * @param participant_type get type owner and member of list
   */
  const renderActionListUser = (list: any, isAutoList: boolean, participant_type: any) => {
    let itemActionListUser = [];
    // Delete Customer
    itemActionListUser.push({ id: 1, itemModal: translate(drawLeftMessages.listUserDelete) });
    //Add to list
    itemActionListUser.push({ id: 2, itemModal: translate(drawLeftMessages.listUserAddList) });
    //Move list
    if ((list === LIST.MYLIST && !isAutoList && participant_type === PARRICIPANT.NODATA) ||
      (list === LIST.SHARELIST && !isAutoList && participant_type === PARRICIPANT.OWNER)) {
      itemActionListUser.push({ id: 3, itemModal: translate(drawLeftMessages.listUserMoveList) })
    }
    // Create my list
    itemActionListUser.push({ id: 5, itemModal: translate(drawLeftMessages.listUserCreateList) });
    //Create shared list
    itemActionListUser.push({ id: 6, itemModal: translate(drawLeftMessages.listUserCreateShareList) });
    //Remove from list
    if ((list === LIST.MYLIST) || (list === LIST.SHARELIST && participant_type === PARRICIPANT.OWNER)) {
      itemActionListUser.push({ id: 4, itemModal: translate(drawLeftMessages.listUserRemoveList) });
    }
    const connection = itemActionListUser;
    dispatch(
      customerListActions.handleExplandStatusListUser({
        connection
      })
    );
  }

  return (
    <SafeAreaView style={[CustomerListShareStyles.paddingTop, CustomerListShareStyles.container]}>
      <AppbarCommon
        title={
          typeActionList === TypeActionListShareCustomer.EDIT
            ? translate(messages.editShareList)
            : typeActionList === TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST
              ? translate(messages.changeToShareList)
              : translate(messages.creatShareList)
        }
        buttonText={translate(messages.createList)}
        buttonType="complete"
        leftIcon="close"
        handleLeftPress={onHandleBack}
        onPress={handleUpdateList}
        buttonDisabled={!buttonActive}
      />
      <ScrollView>
        {listCustomerPicked && listCustomerPicked.length !== 0 &&
          <View>
            <View style={CustomerListShareStyles.wrapAlert}>
              <CommonMessage
                type={TypeMessage.INFO}
                content={`${listCustomerPicked.length} ${translate(
                  messages.numberRecordCreateList
                )}`}
              ></CommonMessage>
            </View>
          </View>
        }
        <View>
          {
            isShowError && responseError !== TEXT_EMPTY &&
            <View style={CustomerListShareStyles.viewRegionErrorShow}>
              <CommonMessages response={responseError} />
            </View>
          }
        </View>
        {typeActionList !== TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST &&
          <View>
            <View style={isErrorInputlistName ? CustomerListShareStyles.wrapFormInputError : CustomerListShareStyles.wrapFormInput}>
              <View style={CustomerListShareStyles.labelName}>
                <Text style={CustomerListShareStyles.labelText}>
                  {translate(messages.listName)}
                </Text>
                <View style={CustomerListShareStyles.labelHighlight}>
                  <Text style={CustomerListShareStyles.labelTextHighlight}>
                    {translate(messages.listRequire)}
                  </Text>
                </View>
              </View>
              <Input
                placeholder={translate(messages.enterListName)}
                maxLength={50}
                style={CustomerListShareStyles.inputName}
                placeholderColor={theme.colors.gray1}
                value={listName}
                onChangeText={(text) => {
                  setListName(text);
                }}
              />
            </View>
          </View>
        }
        <View style={CustomerListShareStyles.divide1} />
        <View style={isErrorInputListParticipant ? { backgroundColor: '#FFDEDE' } : {}}>
          <View style={CustomerListShareStyles.wrapFormInput}>
            <View style={CustomerListShareStyles.labelName}>
              <Text style={CustomerListShareStyles.labelText}>
                {translate(messages.listParticipants)}
              </Text>
              <View style={CustomerListShareStyles.labelHighlight}>
                <Text style={CustomerListShareStyles.labelTextHighlight}>
                  {translate(messages.listRequire)}
                </Text>
              </View>
            </View>
          </View>
          <View style={CustomerListShareStyles.modalSuggetView}>
            <EmployeeSuggestView
              suggestionsChoice={suggestionsChoice}
              title={getFunctionTitle()}
              typeSearch={TypeSelectSuggest.MULTI}
              groupSearch={KeySearch.NONE}
              withAuthorization={true}
              fieldLabel={translate(messages.addListParticipants)} updateStateElement={setValueSelected}
              invisibleLabel={true}
              isError={isErrorInputListParticipant} // process error
            />
          </View>
        </View>
        <Modal isVisible={isVisibleDirtyCheck}>
          <ModalDirtycheckButtonBack
            onPress={() => { setIsVisibleDirtyCheck(false) }}
            onPressBack={() => { navigation.goBack() }}
          />
        </Modal>
      </ScrollView>
    </SafeAreaView >
  );
}
