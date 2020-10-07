import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, TextInput } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../../shared/components/icon";
import {
  DrawerLeftContentStyles,
} from "./drawer-left-style";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { drawerLeftActions } from "./drawer-left-reducer";
import { customerListActions, GetCustomerParam, GetMessage } from "../list/customer-list-reducer";
import { ListFavouriteFilterSelector, ListMyListFilterSelector, ListSharedFilterSelector, LengthListSelector, ParamCustomersSelector } from "../list/customer-list-selector";
import { ItemFavouriteList, ItemMyList, ItemSharedList, AddCustomersToAutoListResponse, updateList, createList, addCustomersToAutoList, CustomerListResponse, customerList, EditOrCreateListResponse } from "../list/customer-list-repository";
import { translate } from "../../../config/i18n";
import { messages } from "./drawer-left-messages";
import { SelectedTargetType, Parameters, ParticipantType, ActionListType, ListType, MagicNumberDrawerLeft, StatusConfirmType, MessageType, CustomerListApi } from "../list/customer-list-enum";
import { PARRICIPANT, LIST } from "./drawer-left-enum";
import { STATUSBUTTON, TypeButton, TypeActionListShareCustomer } from "../../../config/constants/enum";
import { CommonButton } from "../../../shared/components/button-input/button";
import { reloadLocalMenuSelector } from "./drawer-left-selector";
import { messagesComon } from "../../../shared/utils/common-messages";
import Modal from 'react-native-modal';
import { ModalConfirmUpdateAutoGroup } from "../modal/customer-modal-auto-group";

/**
 * Component for show drawer left of customer
*/

export const DrawerLeftContent = () => {

  const dispatch = useDispatch();

  // get data listFavouriteFilter
  const listFavouriteFilter: Array<ItemFavouriteList> = useSelector(ListFavouriteFilterSelector);
  // get data listMyListFilter
  const listMyListFilter: Array<ItemMyList> = useSelector(ListMyListFilterSelector);
  // get data listShareFilter
  const listShareListFilter: Array<ItemSharedList> = useSelector(ListSharedFilterSelector);
  // set text input search list
  const [searchTextList, setSearchTextList] = useState('');
  // set text input edit list
  const [editText, setEditText] = useState('');
  // set listId
  const [listIdLocalNavigation, setListId] = useState(0);
  // set isAutoList
  const [isAutoListRequest, setIsAutoListRequest] = useState(false);
  // set status disable in LocalNavigation
  const [disabledLocalNavigation, setDisabledLocalNavigation] = useState(false);
  // set status Action List
  const [statusActionList, setStatusActionList] = useState(0);
  // set status hide/show listFavourite
  const [statusShowOrHideListFavourite, setStatusShowOrHideListFavourite] = useState(true);
  // set status hide/show MyList
  const [statusShowOrHideMyList, setStatusShowOrHideMyList] = useState(true);
  // set status hide/show sharelist
  const [statusShowOrHideShareList, setStatusShowOrHideShareList] = useState(true);
  // check status Edit/EditComplete
  const [editComplete, setEditComplete] = useState(false);
  const navigation = useNavigation();
  // get count List
  const lengthList = useSelector(LengthListSelector);
  // get variable reload local menu
  const reloadLocalMenu = useSelector(reloadLocalMenuSelector);
  // handled in each specific case
  const paramCustomers = useSelector(ParamCustomersSelector);
  const [openModalUpdateAutoGroup, setOpenModalUpdateAutoGroup] = useState(false);
  // disable when update auto list
  const [disableUpdateAutoListButton, setDisableUpdateAutoListButton,] = useState(false);
  // List name when click update list
  const [listNameSelected, setListNameSelected] = useState("");
  // List id when click update list
  const [listIdSelected, setListIdSelected] = useState(-1);
  // isAutoList when click update list
  const [isAutoListSelected, setIsAutoListSelected] = useState(false);
  // index when click update list
  const [indexListSelected, setIndexSelected] = useState(-1);
  // list type when click update list
  const [listType, setListType] = useState("");
  // participant type when click update list
  const [participantType, setParticipantType] = useState(-1);
  // set visible modal change to share list
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);

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
      itemExplandStatusMyList.push({ id: 1, cate: translate(messages.myListDeleteList) })
    }
    //Subscribe to your favorites list
    if (!isFavoriteslist) {
      itemExplandStatusMyList.push({ id: 2, cate: translate(messages.myListSubscribeFavorites) })
    }
    //Remove from Favorites list
    if (isFavoriteslist) {
      itemExplandStatusMyList.push({ id: 6, cate: translate(messages.myListRemoveFavorites) })
    }
    // Edit list + Delete strike
    if ((participant_type === PARRICIPANT.NODATA && !isAutoList) || (!isAutoList && participant_type === PARRICIPANT.OWNER)) {
      itemExplandStatusMyList.push({ id: 3, cate: translate(messages.myListEditList) })
      itemExplandStatusMyList.push({ id: 4, cate: translate(messages.myListDeleteStrike) })

    }
    //Copy List
    if ((participant_type === PARRICIPANT.NODATA && !isAutoList) ||
      (!isAutoList && participant_type === PARRICIPANT.OWNER) ||
      (!isAutoList && participant_type === PARRICIPANT.MEMBER)) {
      itemExplandStatusMyList.push({ id: 5, cate: translate(messages.myListCopyList) })
    }
    //Change list to shared list
    if (!isFavoriteslist && participant_type === PARRICIPANT.NODATA) {
      itemExplandStatusMyList.push({ id: 7, cate: translate(messages.myListChangeSharedList) })
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
     itemActionListUser.push({ id: 1, itemModal: translate(messages.listUserDelete) });
    //Add to list
    itemActionListUser.push({ id: 2, itemModal: translate(messages.listUserAddList) });
    //Move list
    if ((list === LIST.MYLIST && !isAutoList && participant_type === PARRICIPANT.NODATA) ||
      (list === LIST.SHARELIST && !isAutoList && participant_type === PARRICIPANT.OWNER)) {
      itemActionListUser.push({ id: 3, itemModal: translate(messages.listUserMoveList) })
    }
    // Create my list
    itemActionListUser.push({ id: 5, itemModal: translate(messages.listUserCreateList) });
    //Create shared list
    itemActionListUser.push({ id: 6, itemModal: translate(messages.listUserCreateShareList) });
    //Remove from list
    if ((list === LIST.MYLIST) || (list === LIST.SHARELIST && participant_type === PARRICIPANT.OWNER)) {
      itemActionListUser.push({ id: 4, itemModal: translate(messages.listUserRemoveList) });
    }
    const connection = itemActionListUser;
    dispatch(
      customerListActions.handleExplandStatusListUser({
        connection
      })
    );
  }

  /**
   * action handle set status confirm delete
   * @param data get type confirm delete list and customer 
  */
  const handleStatusConfirm = (data: number) => {
    const connection = data;
    dispatch(
      customerListActions.handleStatusConfirm({
        connection
      })
    );
  }

  /**
   * action handle hide/show dialog confirmation
   * @param isVisible get status isVisible of dialog confirmation 
  */
  const handleIsDeleteConfirmDialog = (isVisible: boolean) => {
    const status = isVisible;
    dispatch(
      customerListActions.handleIsDeleteConfirmDialog({
        isModalVisible: status
      })
    );
  }

  /**
   * action handle open edit
  */
  const handleEdit = () => {
    setEditComplete(true);
    setDisabledLocalNavigation(true);
  };

  /**
   * call api EditList or CopyList
  */
  async function handleEditOrCopyListRequest(typeResquest: number) {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    const listParticipants: any[] = [];
    const searchConditions: any[] = [];
    const listMembers: number[] = [];
    if (typeResquest == ActionListType.Edit) {
      const resEditListRequest = await updateList({
        customerListId: listIdLocalNavigation,
        customerListName: editText,
        customerListType: ListType.MyList,
        isAutoList: isAutoListRequest,
        isOverWrite: true,
        updatedDate: "",
        listParticipants: listParticipants,
        searchConditions: searchConditions,
      });
      if (resEditListRequest) {
        handleResponseEditOrCreateList(resEditListRequest);
      }
    } else if (typeResquest == ActionListType.CopyOrCreate) {
      const resCreateListRequest = await createList({
        customerListName: editText,
        customerListType: ListType.MyList,
        isAutoList: isAutoListRequest,
        isOverWrite: true,
        listMembers: listMembers,
        listParticipants: listParticipants,
        searchConditions: searchConditions,
      });
      if (resCreateListRequest) {
        handleResponseEditOrCreateList(resCreateListRequest);
      }
    }
  }

  /**
   * action handle done edit
  */
  const handleDoneEdit = () => {
    setDisabledLocalNavigation(false);
    setEditComplete(false);
    setStatusActionList(ActionListType.NoAction);
    if (statusActionList === ActionListType.Edit) {
      handleEditOrCopyListRequest(ActionListType.Edit);
    } else if (statusActionList === ActionListType.CopyOrCreate) {
      handleEditOrCopyListRequest(ActionListType.CopyOrCreate);
    }
    setListId(0);
  };

  /**
   * action handle close edit/copy list
  */
  const hanldeCloseEditOrCopy = () => {
    setStatusActionList(ActionListType.NoAction);
    setListId(0);
  }

  /**
   * action handle setParamGetCustomers
   * @param param get param call api
  */
  // const setParamCustomers = (param: any) => {
  //   console.log("setParamCustomers draw", param);
  //   dispatch(
  //     customerListActions.setParamCustomers({
  //       param
  //     })
  //   );
  // }

  /**
   * action handle tap show customers in charge
   * @param titleList get title list customers
  */
  const handleListInCharge = (titleList: string) => () => {
    handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
    var param: GetCustomerParam = {
      selectedTargetId: Parameters.SelectedTargetId,
      selectedTargetType: SelectedTargetType.CustomerInCharge,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
    renderExplandStatusMyList(true, PARRICIPANT.NODATA, false);
    renderActionListUser(LIST.NODATA, true, PARRICIPANT.NODATA);
    handleSetTitleList(titleList);
    handleSetStatusShowLastUpdatedDate(false);
    handleSetStatusHideActionList();
    actionSetCustomerListType(LIST.NO_LIST_ID, LIST.NODATA, false, SelectedTargetType.CustomerInCharge, titleList);
    navigation.navigate("customer-list");
  }

  /**
   * action handle tap show full customers
   * @param titleList get title list customers
  */
  const handleListAll = (titleList: string) => () => {
    handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
    var param: GetCustomerParam = {
      selectedTargetId: Parameters.SelectedTargetId,
      selectedTargetType: SelectedTargetType.CustomerAll,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
    renderActionListUser(LIST.NODATA, true, PARRICIPANT.NODATA);
    handleSetTitleList(titleList);
    handleSetStatusShowLastUpdatedDate(false);
    handleSetStatusHideActionList();
    actionSetCustomerListType(LIST.NO_LIST_ID, LIST.NODATA, false, SelectedTargetType.CustomerAll, titleList);
    navigation.navigate("customer-list");
  }

  /**
   * action handle search List 
   * @param text get text input search
  */
  const handleSearchTextList = (text: string) => {
    setSearchTextList(text);
    getListItemCustomerSearch(text);
  };

  /**
   * action handle tap show customers Favouritelist
   * @param titleList get title list customers
   * @param index get index of item list Favourite
   * @param isAutoList get isAutoList of item list Favourite
   * @param listId get listId of item list Favourite
   * @param customerListType get type list of item list Favourite
  */
  const handleListFavouritelist = (titleList: string, index: number, isAutoList: boolean, listId: number, customerListType: number) => () => {

    handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
    handleSetExtendItemListCustomer(index, "favourite");
    handleSetTitleList(titleList);
    var param: GetCustomerParam = {
      selectedTargetId: listId,
      selectedTargetType: SelectedTargetType.CustomerFavouriteList,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
    handleSetStatusShowLastUpdatedDate(isAutoList);
    if (customerListType === ListType.MyList) {
      renderExplandStatusMyList(isAutoList, PARRICIPANT.NODATA, true);
      renderActionListUser(LIST.MYLIST, isAutoList, PARRICIPANT.NODATA);
    } else {
      listShareListFilter.forEach((item) => {
        if (item.listId === listId) {
          renderExplandStatusMyList(isAutoList, item.participantType, true);
          renderActionListUser(LIST.MYLIST, isAutoList, item.participantType);
        }

      })
    }
    actionSetCustomerListType(listId, customerListType, isAutoList, SelectedTargetType.CustomerFavouriteList, titleList);
    handleSetStatusShowActionList();
    navigation.navigate("customer-list");
  }

  /**
   * action handle tap show customers mylist
   * @param titleList get title list customers
   * @param index get index of item Mylist
   * @param isAutoList get isAutoList of item Mylist
   * @param listId get listId of item Mylist
   * @param customerListType get type list of item Mylist
  */
  const actionHanldeListMylist = (titleList: string, index: number, isAutoList: boolean, listId: number, customerListType: number) => () => {
    handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
    handleSetExtendItemListCustomer(index, "mylist");
    handleSetTitleList(titleList);
    var param: GetCustomerParam = {
      selectedTargetId: listId,
      selectedTargetType: SelectedTargetType.CustomerMyList,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
    handleSetStatusShowLastUpdatedDate(isAutoList);
    renderActionListUser(LIST.MYLIST, isAutoList, PARRICIPANT.NODATA);
    renderExplandStatusMyList(isAutoList, PARRICIPANT.NODATA, false);
    actionSetCustomerListType(listId, customerListType, isAutoList, SelectedTargetType.CustomerMyList, titleList);
    handleSetStatusShowActionList();
    navigation.navigate("customer-list");
  }

  /**
   * action handle tap show customers Sharelist
   * @param titleList get title list customers
   * @param index get index of item Sharelist
   * @param isAutoList get isAutoList of item Sharelist
   * @param listId get listId of item Sharelist
   * @param customerListType get type list of item Sharelist
   * @param participant_type get type owner and member of item Sharelist
  */
  const handleListSharelist = (titleList: string, index: number, isAutoList: boolean, listId: number, customerListType: number, participant_type: number) => () => {

    handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
    handleSetExtendItemListCustomer(index, "sharelist");
    handleSetTitleList(titleList);
    var param: GetCustomerParam = {
      selectedTargetId: listId,
      selectedTargetType: SelectedTargetType.CustomerShareList,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
      offset: 0,
      limit: paramCustomers.limit,
    }
    dispatch(customerListActions.setParamCustomers(param));
    handleSetStatusShowLastUpdatedDate(isAutoList);
    renderActionListUser(LIST.SHARELIST, isAutoList, participant_type);
    renderExplandStatusMyList(isAutoList, participant_type, false);
    actionSetCustomerListType(listId, customerListType, isAutoList, SelectedTargetType.CustomerShareList, titleList);
    handleSetStatusShowActionList();
    navigation.navigate("customer-list");
  }

  /**
   * call api update auto group
   * @param listId get listId of item list
  */
  const hanldeAddCustomersToAutoList = (
    listId: number,
    listName: string,
    isAutoList: boolean,
    index: number,
    listType: string,
    participantType: number
  ) => {
    setOpenModalUpdateAutoGroup(true);
    setListNameSelected(listName);
    setListIdSelected(listId);
    setIsAutoListSelected(isAutoList);
    setIndexSelected(index);
    setListType(listType);
    setParticipantType(participantType);
  }

  /**
   * action set text input
   * @param text get text of input
  */
  const changeTextEditTextList = (text: string) => {
    setEditText(text);
  };

  /**
   * action handle EditMyList
   * @param textInput get text of input
   * @param listIdMyList get listId of item MyList
   * @param isAutoList get isAutoList of item MyList
  */
  const handleEditMyList = (textInput: string, listIdMyList: number, isAutoList: boolean) => {
    setEditText(textInput);
    setListId(listIdMyList);
    setIsAutoListRequest(isAutoList);
    setStatusActionList(ActionListType.Edit);
  };

  /**
   * action handle CopyMyList
   * @param textInput get text of input
   * @param listIdMyList get listId of item MyList
   * @param isAutoList get isAutoList of item MyList
  */
  const handleCopyMyList = (textInput: string, listIdMyList: number, isAutoList: boolean) => {
    setEditText(textInput);
    setListId(listIdMyList);
    setIsAutoListRequest(isAutoList);
    setStatusActionList(ActionListType.CopyOrCreate);
  };

  /**
   * action handle EditShareList 
   * @param listId get listId of item ShareList 
  */
  const handleEditShareList = (listId: number) => {
    navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.EDIT, listId: listId });
  };

  /**
   * action handle CopyShareList 
   * @param listId get listId of item ShareList 
  */
  const handleCopyShareList = (listId: number) => {
    navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.COPY, listId: listId });
  };

  /**
   * action handle DeleteList
   * @param listId get listId of item List 
   * @param typeList get type list of item List 
   * @param isAutoList get isAutoList of item List
  */
  const handleDeleteList = (listId: number, typeList: number, isAutoList: boolean) => {
    actionSetCustomerListType(listId, typeList, isAutoList, SelectedTargetType.CustomerAll, "");
    handleStatusConfirm(StatusConfirmType.DeleteList);
    confirmDelete();
  };

  /**
   * action handle ChangeMylistToShareList
   * @param listIdMylist get listId of item Mylist 
  */
  const handleChangeMylistToShareList = (listIdMylist: number) => {
    setIsVisibleConfirmModal(false)
    navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.CHANGE_TO_SHARE_LIST, listId: listIdMylist });
  };

  /**
   * action show dialog confirm delete
  */
  const confirmDelete = () => {
    setTimeout(function () {
      handleIsDeleteConfirmDialog(true);
    }, 500)
  }

  /**
   * action handle open/close list Favourite
  */
  const hanldeShowOrHideFavouriteList = () => {
    setStatusShowOrHideListFavourite(!statusShowOrHideListFavourite);
  };

  /**
   * action handle open/close my list
  */
  const hanldeShowOrHideMyList = () => {
    setStatusShowOrHideMyList(!statusShowOrHideMyList);
  };

  /**
   * action handle open/close share list
  */
  const hanldeShowOrHideShareList = () => {
    setStatusShowOrHideShareList(!statusShowOrHideShareList);
  };

  /**
   * action handle hide Other
  */
  const handleSetStatusHideActionList = () => {
    dispatch(
      customerListActions.handleSetStatusHideActionList({
      })
    );
  }

  /**
   * action handle show Other
  */
  const handleSetStatusShowActionList = () => {
    dispatch(
      customerListActions.handleSetStatusShowActionList({
      })
    );
  }

  /**
   * action handle set status select
   * @param data get all initial state and select of customers
  */
  const handleExpland = (data: number) => {

    const connection = data;
    dispatch(
      customerListActions.handleExpland({
        connection
      })
    );
  }

  /**
   * action handle set value mylist/sharelist
   * @param listId get listId of item List 
   * @param typeList get type list of item List 
   * @param isAutoList get isAutoList of item List
   * @param selectedTargetType get target type local navigation
  */
  const actionSetCustomerListType = (listId: number, typeList: number, isAutoList: boolean, selectedTargetType: number, titleList: string) => {
    dispatch(
      customerListActions.actionSetCustomerListType({
        listId: listId,
        typeList: typeList,
        isAutoList: isAutoList,
        selectedTargetType: selectedTargetType,
        listName: titleList
      })
    );
  }

  /**
   * action handle show or hide LastUpdatedDate
   * @param isAutoList get isAutoList of item List
  */
  const handleSetStatusShowLastUpdatedDate = (isAutoList: boolean) => {
    dispatch(
      customerListActions.handleSetStatusShowLastUpdatedDate({
        status: isAutoList,
      })
    );
  }

  /**
   * action set TitleList
   * @param titleList get title list customers
  */
  const handleSetTitleList = (titleList: string) => {
    const title = titleList;
    dispatch(
      drawerLeftActions.handleSetTitleList({
        titleList: title,
      })
    );
  }

  /**
   * action handle search ListCustomer
   * @param textSearch get value text search
  */
  const getListItemCustomerSearch = (textSearch: string) => {
    dispatch(
      customerListActions.getListItemCustomerSearch({
        text: textSearch,
      })
    );
  }

  /**
   * action handle Extend ListCustomer
   * @param index get index of item list
   * @param cate get type of list
  */
  const handleSetExtendItemListCustomer = (index: number, cate: string) => () => {
    dispatch(
      customerListActions.handleSetExtendItemListCustomer({
        position: index,
        cate: cate,
      })
    );
  }

  /**
   * action handle SetIsSuccess
   * @param type get type message
  */
  const handleSetIsShowMessage = (type: number) => {
    dispatch(
      customerListActions.handleSetIsShowMessage({
        isMessage: type
      })
    );
  }

  /**
   * action handle show ScreenAddList mylist
  */
  const handleScreenAddListMyList = () => {
    navigation.navigate("customer-my-list-navigator", { status: true });
  };

  /**
   * action handle show ScreenAddList shareList
  */
  const handleScreenAddListShareList = () => {
    navigation.navigate("customer-share-list-navigator", { typeActionListShare: TypeActionListShareCustomer.ADD_FROM_LEFT_MENU });
  };

  useEffect(() => {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    getDataCustomerList();
  }, [reloadLocalMenu])

  /**
   * call api CustomerList async
  */
  async function getDataCustomerList() {
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    const resCustomerList = await customerList({
      mode: CustomerListApi.MODE_OWNER_AND_MEMBER,
      isFavourite: true,
    });

    if (resCustomerList) {
      handleResponseCustomerList(resCustomerList);
    }
  }

  /**
   * action handle respone AddCustomersToAutoList
   * @param response AddCustomersToAutoListResponse
  */
  const handleResponseAddCustomersToAutoList = (response: AddCustomersToAutoListResponse) => {
    if (response.status == 200) {
      var messageSuccess: GetMessage = {
        toastMessage: translate(messagesComon.INF_COM_0003),
        visible: true
      }
      dispatch(customerListActions.handleSetShowMessageSuccess(messageSuccess));
      setTimeout(() => {
        dispatch(customerListActions.handleSetShowMessageSuccess({}));
      }, 2000);
      handleExpland(MagicNumberDrawerLeft.StatusShowIconArrowRight);
      handleSetExtendItemListCustomer(indexListSelected, listType);
      handleSetTitleList(listNameSelected);
      var param: GetCustomerParam = {
        selectedTargetId: listIdSelected,
        selectedTargetType: listType === "mylist" ? SelectedTargetType.CustomerMyList : SelectedTargetType.CustomerShareList,
        isUpdateListView: false,
        searchConditions: [],
        filterConditions: [],
        localSearchKeyword: "",
        orderBy: [],
        offset: 0,
        limit: paramCustomers.limit,
      }
      dispatch(customerListActions.setParamCustomers(param));
      handleSetStatusShowLastUpdatedDate(isAutoListSelected);
      renderActionListUser(listType === "mylist" ? LIST.MYLIST : LIST.SHARELIST, isAutoListSelected, participantType);
      renderExplandStatusMyList(isAutoListSelected, participantType, false);
      actionSetCustomerListType(listIdSelected, listType === "mylist" ? LIST.MYLIST : LIST.SHARELIST, isAutoListSelected, listType === "mylist" ? SelectedTargetType.CustomerMyList : SelectedTargetType.CustomerShareList, listNameSelected);
      handleSetStatusShowActionList();
      navigation.navigate("customer-list");
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
    }
  };


  /**
   * action handle respone EditList
   * @param response UpdateListResponse
  */
  const handleResponseEditOrCreateList = (response: EditOrCreateListResponse) => {
    if (response.status == 200) {
      getDataCustomerList();
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
      navigation.navigate("customer-list");
    }
  };

  /**
   * action handle respone CustomerList
   * @param response CustomerListResponse
  */
  const handleResponseCustomerList = (response: CustomerListResponse) => {
    if (response.status == 200) {
      dispatch(customerListActions.getCustomerList(response.data));
    } else {
      handleSetIsShowMessage(MessageType.ERROR);
      dispatch(customerListActions.getResponseCustomer({ responseCustomer: response }));
    }
  };

  /**
   * function close modal update auto group
   */
  const handleCloseModalUpdateAutoGroup = () => {
    setOpenModalUpdateAutoGroup(false);
  };

  const handleUpdateAutoGroup = async () => {
    setDisableUpdateAutoListButton(true);
    handleSetIsShowMessage(MessageType.DEFAULT);
    dispatch(customerListActions.getResponseCustomer({ responseCustomer: "" }));
    async function addCustomersToAutoListRequest() {
      const resAddCustomersToAutoList = await addCustomersToAutoList({
        idOfList: listIdSelected,
      });

      if (resAddCustomersToAutoList) {
        setOpenModalUpdateAutoGroup(false);
        handleResponseAddCustomersToAutoList(resAddCustomersToAutoList);
      }
    }
    setDisableUpdateAutoListButton(false);
    addCustomersToAutoListRequest();
  }
  /**
   * return button type TouchableOpacity
   * @param text get text of rederTouchableOpacity
   * @param onPress get event onPress of rederTouchableOpacity
  */
  const rederTouchableOpacity = (
    text: string,
    onPress?: () => void) => {
    return (
      <CommonButton onPress={onPress} status={STATUSBUTTON.ENABLE} icon="" textButton={text} typeButton={TypeButton.BUTTON_NON_SUCCESS}></CommonButton>
    );
  }

  return (
    <SafeAreaView style={DrawerLeftContentStyles.container}>
      <ScrollView>
        <View style={DrawerLeftContentStyles.header}>
          <Text style={DrawerLeftContentStyles.titleHeader}>{translate(messages.leftTitleMenuCustomer)}</Text>
          {editComplete ? (
            <CommonButton onPress={() => handleDoneEdit()} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.rightDone)} typeButton={TypeButton.BUTTON_SUCCESS}></CommonButton>
          ) : (
              <TouchableOpacity
                onPress={() => handleEdit()}
              >
                <Icon style={DrawerLeftContentStyles.iconEdit} name="edit" />
              </TouchableOpacity>
            )}
        </View>
        <View style={DrawerLeftContentStyles.divide} />
        <View style={DrawerLeftContentStyles.header}>
          <TouchableOpacity style={[DrawerLeftContentStyles.headerTouchableOpacity]} onPress={handleListInCharge(translate(messages.customerInCharge))} disabled={disabledLocalNavigation}>
            <Text style={[DrawerLeftContentStyles.titleList, disabledLocalNavigation && DrawerLeftContentStyles.titleDisable]}>{translate(messages.customerInCharge)}</Text>
          </TouchableOpacity>
        </View>
        <View style={DrawerLeftContentStyles.divide} />
        <View style={DrawerLeftContentStyles.header}>
          <TouchableOpacity style={DrawerLeftContentStyles.headerTouchableOpacity} onPress={handleListAll(translate(messages.allCustomers))} disabled={disabledLocalNavigation}>
            <Text style={[DrawerLeftContentStyles.titleList, disabledLocalNavigation && DrawerLeftContentStyles.titleDisable]}>{translate(messages.allCustomers)}</Text>
          </TouchableOpacity>
        </View>
        <View style={DrawerLeftContentStyles.divide2} />
        <View style={DrawerLeftContentStyles.list}>
          <Text style={[DrawerLeftContentStyles.titleList, disabledLocalNavigation && DrawerLeftContentStyles.titleDisable]}>{translate(messages.titleSearch)}</Text>
          {lengthList > 5 &&
            <View style={DrawerLeftContentStyles.search} >
              <Icon name="search" />
              <TextInput editable={!disabledLocalNavigation}
                value={searchTextList}
                placeholder={translate(messages.searchPlaceholder)}
                placeholderTextColor={"#999999"}
                style={DrawerLeftContentStyles.inputStyle}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                onChangeText={handleSearchTextList}
              />
            </View>
          }
        </View>

        <View style={DrawerLeftContentStyles.divide}></View>

        <View style={DrawerLeftContentStyles.listItem}>
          <TouchableOpacity disabled={disabledLocalNavigation}
            onPress={hanldeShowOrHideFavouriteList}
            style={[DrawerLeftContentStyles.dropdownHeader, DrawerLeftContentStyles.dropdownHeaderSpaceBetween]}
          >
            <View style={DrawerLeftContentStyles.headerArrow}>
              {
                listFavouriteFilter.length > 0 &&
                <Icon
                  name={(statusShowOrHideListFavourite && listFavouriteFilter && listFavouriteFilter.length > 0) ? ("arrowUp") : ("arrowDown")}
                  style={DrawerLeftContentStyles.iconArrowDown}
                />
              }
              <Text style={[DrawerLeftContentStyles.titleList, disabledLocalNavigation && DrawerLeftContentStyles.titleDisable]}>{translate(messages.favoritesList)}</Text>
            </View>
          </TouchableOpacity>
          {statusShowOrHideListFavourite && listFavouriteFilter && (
            <View style={DrawerLeftContentStyles.viewItem}>
              {listFavouriteFilter.map((item, index) => {
                return (
                  <View key={item.listId}>
                    <View style={DrawerLeftContentStyles.viewItemListFlexRow}>
                      <TouchableOpacity disabled={disabledLocalNavigation}
                        onPress={handleListFavouritelist(item.listName, index, item.isAutoList, item.listId, item.customerListType)}
                        style={DrawerLeftContentStyles.childListWrapper}
                      >
                        <Text numberOfLines={1} style={[DrawerLeftContentStyles.childList, disabledLocalNavigation && DrawerLeftContentStyles.titleListDisable]}>{item.listName}</Text>
                      </TouchableOpacity>
                      {(item.isAutoList && item.customerListType === ListType.MyList) &&
                        <TouchableOpacity disabled={disabledLocalNavigation} style={DrawerLeftContentStyles.marginToprefresh}
                          onPress={() => hanldeAddCustomersToAutoList(
                            item.listId,
                            item.listName,
                            item.isAutoList,
                            index,
                            "mylist",
                            0)}>
                          <Icon name="refresh" />
                        </TouchableOpacity>
                      }
                      {listShareListFilter.map((itemShareList) => {
                        return (
                          (item.listId === itemShareList.listId && item.isAutoList && itemShareList.participantType === ParticipantType.Owner) &&
                          <TouchableOpacity disabled={disabledLocalNavigation} style={DrawerLeftContentStyles.marginToprefresh}
                            onPress={() => hanldeAddCustomersToAutoList(
                              item.listId,
                              item.listName,
                              item.isAutoList,
                              index,
                              "sharelist",
                              item.participantType)}>
                            <Icon name="refresh" />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={DrawerLeftContentStyles.divide} />

        <View style={DrawerLeftContentStyles.listItem}>
          <View style={DrawerLeftContentStyles.listItemHeader}>
            <View>
              <TouchableOpacity onPress={hanldeShowOrHideMyList} style={DrawerLeftContentStyles.dropdownHeader}>
                <View style={DrawerLeftContentStyles.headerArrow}>
                  {
                    listMyListFilter.length > 0 &&
                    <Icon
                      name={(statusShowOrHideMyList && listMyListFilter && listMyListFilter.length > 0) ? ("arrowUp") : ("arrowDown")}
                      style={DrawerLeftContentStyles.iconArrowDown}
                    />
                  }
                  <Text style={DrawerLeftContentStyles.titleList}>{translate(messages.myList)}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {!disabledLocalNavigation &&
              <View>
                <TouchableOpacity onPress={() => handleScreenAddListMyList()}>
                  <Icon name="addCircleOutline" style={DrawerLeftContentStyles.iconAddCircleOutline} />
                </TouchableOpacity>
              </View>
            }
          </View>
          {statusShowOrHideMyList && listMyListFilter && (
            <View style={DrawerLeftContentStyles.viewItem}>
              {listMyListFilter.map((item, index) => {
                return (
                  <View key={item.listId}>

                    {(item.isAutoList || statusActionList === ActionListType.NoAction || statusActionList === ActionListType.CopyOrCreate || listIdLocalNavigation != item.listId) && (
                      <View style={DrawerLeftContentStyles.viewItemListFlexRow}>
                        <TouchableOpacity disabled={((disabledLocalNavigation && item.isAutoList) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.CopyOrCreate) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.Edit)) && disabledLocalNavigation}
                          onPress={actionHanldeListMylist(item.listName, index, item.isAutoList, item.listId, ListType.MyList)}
                          style={DrawerLeftContentStyles.childListWrapper}
                        >
                          <Text numberOfLines={1} style={[DrawerLeftContentStyles.childList, ((disabledLocalNavigation && item.isAutoList) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.CopyOrCreate) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.Edit)) && DrawerLeftContentStyles.titleListDisable]}>{item.listName}</Text>
                        </TouchableOpacity>
                        {item.isAutoList &&
                          <TouchableOpacity style={DrawerLeftContentStyles.marginToprefresh}
                            onPress={() => hanldeAddCustomersToAutoList(
                              item.listId,
                              item.listName,
                              item.isAutoList,
                              index,
                              "mylist",
                              0)}
                            disabled={(disabledLocalNavigation && item.isAutoList) && disabledLocalNavigation}>
                            <Icon name="refresh" />
                          </TouchableOpacity>
                        }
                      </View>
                    )}

                    {(disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.Edit && listIdLocalNavigation === item.listId) && (
                      <View style={DrawerLeftContentStyles.viewIpuntEdit}>
                        <View style={DrawerLeftContentStyles.viewIpuntDesc}>
                          <TextInput
                            value={editText}
                            style={DrawerLeftContentStyles.inputEdit}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                            onChangeText={changeTextEditTextList}
                          />
                          <TouchableOpacity onPress={() => hanldeCloseEditOrCopy()}>
                            <Icon style={DrawerLeftContentStyles.iconClose} name="close" />
                          </TouchableOpacity>
                        </View>
                        <View style={DrawerLeftContentStyles.divideInputEdit} />
                      </View>
                    )}
                    {(disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.NoAction) && (
                      <View style={DrawerLeftContentStyles.elementChildWrapperMyList}>
                        <View style={[DrawerLeftContentStyles.viewItemListFlexRow, DrawerLeftContentStyles.viewItemListFlexRowMarginTop]}>
                          <View style={DrawerLeftContentStyles.elementChild}>
                            {rederTouchableOpacity(translate(messages.editList), () => handleEditMyList(item.listName, item.listId, item.isAutoList))}
                          </View>
                          <View style={DrawerLeftContentStyles.elementChild}>
                            {rederTouchableOpacity(translate(messages.copyList), () => handleCopyMyList(item.listName, item.listId, item.isAutoList))}
                          </View>
                          <View style={DrawerLeftContentStyles.elementChild}>
                            {rederTouchableOpacity(translate(messages.deleteList), () => handleDeleteList(item.listId, ListType.MyList, item.isAutoList))}
                          </View>
                        </View>
                        <View style={DrawerLeftContentStyles.viewItemListFlexRow}>
                          <View style={DrawerLeftContentStyles.elementChild}>
                            <CommonButton onPress={() => setIsVisibleConfirmModal(true)} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.changeList)} typeButton={TypeButton.BUTTON_CHANGE}></CommonButton>
                          </View>
                        </View>
                        <Modal
                          isVisible={isVisibleConfirmModal}
                          backdropColor="rgba(0, 0, 0, 0.75)"
                          onBackdropPress={() => setIsVisibleConfirmModal(false)}
                        >
                          <View style={DrawerLeftContentStyles.modal}>
                            <Text style={DrawerLeftContentStyles.titleModal}>{translate(messages.changeToShareListModalTitle)}</Text>
                            <View style={DrawerLeftContentStyles.modalConfirmContainer}>
                              <Text style={DrawerLeftContentStyles.modalContentConfirmMessage}>{translate(messages.messageConfirmChangeToShareList1)}</Text>
                              <Text style={DrawerLeftContentStyles.modalContentConfirmMessage}>{translate(messages.messageConfirmChangeToShareList2)}</Text>
                            </View>
                            <View style={DrawerLeftContentStyles.footerModal}>
                              <CommonButton onPress={() => setIsVisibleConfirmModal(false)} status={STATUSBUTTON.ENABLE} icon="" textButton={`${translate(messages.cancelConfirmChangeToShareList)}`} typeButton={TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
                              <CommonButton onPress={() => handleChangeMylistToShareList(item.listId)} status={STATUSBUTTON.ENABLE} icon="" textButton={`${translate(messages.confirmChangeToShareList)}`} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
                            </View>
                          </View>
                        </Modal>
                      </View>
                    )}
                  </View>
                );
              })}
              {(disabledLocalNavigation && statusActionList === ActionListType.CopyOrCreate) && (
                <View style={DrawerLeftContentStyles.viewIpuntCopy}>
                  <View style={DrawerLeftContentStyles.viewIpuntDesc}>
                    <TextInput
                      value={editText}
                      style={DrawerLeftContentStyles.inputEdit}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      autoCorrect={false}
                      onChangeText={changeTextEditTextList}
                    />
                    <TouchableOpacity onPress={() => hanldeCloseEditOrCopy()}>
                      <Icon style={DrawerLeftContentStyles.iconClose} name="close" />
                    </TouchableOpacity>

                  </View>
                  <View style={DrawerLeftContentStyles.divideInputEdit} />
                </View>
              )}

            </View>
          )}
        </View>

        <View style={DrawerLeftContentStyles.divide} />

        <View style={DrawerLeftContentStyles.listItem}>
          <View style={DrawerLeftContentStyles.listItemHeader}>
            <View>
              <TouchableOpacity onPress={hanldeShowOrHideShareList} style={DrawerLeftContentStyles.dropdownHeader} >
                <View style={DrawerLeftContentStyles.headerArrow}>
                  {
                    listShareListFilter.length > 0 &&
                    <Icon
                      name={(statusShowOrHideShareList && listShareListFilter && listShareListFilter.length > 0) ? ("arrowUp") : ("arrowDown")}
                      style={DrawerLeftContentStyles.iconArrowDown}
                    />
                  }
                  <Text style={DrawerLeftContentStyles.titleList}>{translate(messages.shareList)}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {!disabledLocalNavigation &&
              <View>
                <TouchableOpacity onPress={() => handleScreenAddListShareList()}>
                  <Icon name="addCircleOutline" style={DrawerLeftContentStyles.iconAddCircleOutline} />
                </TouchableOpacity>
              </View>
            }
          </View>

          {statusShowOrHideShareList && listShareListFilter && (
            <View style={DrawerLeftContentStyles.viewItem}>
              {listShareListFilter.map((item, index) => {
                return (
                  <View key={item.listId}>
                    <View style={DrawerLeftContentStyles.viewItemListFlexRow}>
                      <TouchableOpacity disabled={((disabledLocalNavigation && item.isAutoList) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.Edit) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.CopyOrCreate)) && disabledLocalNavigation}
                        onPress={handleListSharelist(item.listName, index, item.isAutoList, item.listId, ListType.ShareList, item.participantType)}
                        style={DrawerLeftContentStyles.childListWrapper}
                      >
                        <Text numberOfLines={1} style={[DrawerLeftContentStyles.childList, ((disabledLocalNavigation && item.isAutoList) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.Edit) || (disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.CopyOrCreate)) && DrawerLeftContentStyles.titleListDisable]}>{item.listName}</Text>
                      </TouchableOpacity>
                      {(item.isAutoList && item.participantType === ParticipantType.Owner) &&
                        <TouchableOpacity style={DrawerLeftContentStyles.marginToprefresh}
                          onPress={() => {
                            hanldeAddCustomersToAutoList(
                              item.listId,
                              item.listName,
                              item.isAutoList,
                              index,
                              "sharelist",
                              item.participantType)
                          }
                          }
                          disabled={(disabledLocalNavigation && item.isAutoList) && disabledLocalNavigation}>
                          <Icon name="refresh" />
                        </TouchableOpacity>
                      }
                    </View>
                    {(disabledLocalNavigation && !item.isAutoList && statusActionList === ActionListType.NoAction) && (
                      <View style={[DrawerLeftContentStyles.elementChildWrapper, DrawerLeftContentStyles.viewItemListFlexRowMarginTop]}>
                        {item.participantType === 2 &&
                          <View style={DrawerLeftContentStyles.elementChild}>
                            {rederTouchableOpacity(translate(messages.editList), () => handleEditShareList(item.listId))}
                          </View>
                        }
                        <View style={DrawerLeftContentStyles.elementChild}>
                          {rederTouchableOpacity(translate(messages.copyList), () => handleCopyShareList(item.listId))}
                        </View>
                        {item.participantType === 2 &&
                          <View style={DrawerLeftContentStyles.elementChild}>
                            {rederTouchableOpacity(translate(messages.deleteList), () => handleDeleteList(item.listId, ListType.ShareList, item.isAutoList))}
                          </View>
                        }
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <Modal
          isVisible={openModalUpdateAutoGroup}
          onBackdropPress={handleCloseModalUpdateAutoGroup}
          style={DrawerLeftContentStyles.centerView}
        >
          <ModalConfirmUpdateAutoGroup
            onCloseModal={handleCloseModalUpdateAutoGroup}
            onAcceptUpdateAutoGroup={handleUpdateAutoGroup}
            disableUpdateButton={disableUpdateAutoListButton}
            title={listNameSelected}
          />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};