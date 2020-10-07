/* eslint-disable no-alert */
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Icon } from "../../../shared/components/icon";
import { BusinessCardItem } from "./business-card-item";
import {
  tabbarBusinessCardSelector,
  dataGetBusinessCardsSelector,
  refreshSelector,
  drawerListSelectedSelector,
} from "../business-card-selector";
import { businessCardDrawerSelector, refreshListSelector } from "../navigators/business-card-drawer-selector";
import { messages } from "./business-card-messages";
import { translate } from "../../../config/i18n";
import {
  BusinessCardItemStyles,
  BusinessCardStyles,
} from "./business-card-style";
import { businessCardActions } from "../business-card-reducer";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { BusinessCardModal } from "./business-card-modal";
import { CommonStyles } from "../../../shared/common-style";
import { appImages } from "../../../config/constants";
import {
  BusinessCardsDataDataResponse,
  getBusinessCards,
  removeBusinessCardsFromList,
  handleListBusinessCards,
  updateBusinessCardsList,
} from "../business-card-repository";
import {
  PlatformOS,
  BUSINESS_CARD_SELECTED_TARGET_TYPE,
  BUSINESS_CARD_LIST,
  // LIST_TYPE,
  BUSINESS_CARD_LIST_MODE,
  SortType,
} from "../../../config/constants/enum";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { fieldTypeSort } from "../utils";
import { resultSortSelector } from "../../../shared/components/popup-sort/popup-sort-selector";
import { ScreenName } from "../../../config/constants/screen-name";
// import { DUMMY_DATA_GET_BUSINESS_CARDS } from "../drawer/list-business-card-dummy";
import { BUSINESS_CARD_API } from "../../../config/constants/api";
import { BusinessCardListModal } from "../../../config/constants/enum";
import { formatDate } from "../../../shared/util/app-utils";
import { EnumFmDate } from "../../../config/constants/enum-fm-date";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { ModalImagePicker } from "./modal-screen-screen";
import * as ImagePicker from "expo-image-picker";

const { height } = Dimensions.get("window");

let offset = 1;

interface BusinessCardModal {
  isOpen: boolean;
  type: BusinessCardListModal;
}

export function BusinessCardScreen() {
  const favoriteList = [
    {
      id: 1,
      name: translate(messages.updateList),
    },
    {
      id: 2,
      name: translate(messages.removeFavorites),
    },
    {
      id: 3,
      name: translate(messages.editList),
    },
    {
      id: 4,
      name: translate(messages.removeList),
    },
    {
      id: 5,
      name: translate(messages.listDuplicate),
    },
    {
      id: 6,
      name: translate(messages.changeToShareList),
    },
  ];
  const notYetInFavoriteList = [
    {
      id: 1,
      name: translate(messages.updateList),
    },
    {
      id: 2,
      name: translate(messages.addToFavorite),
    },
    {
      id: 3,
      name: translate(messages.editList),
    },
    {
      id: 4,
      name: translate(messages.removeList),
    },
    {
      id: 5,
      name: translate(messages.listDuplicate),
    },
    {
      id: 6,
      name: translate(messages.changeToShareList),
    },
  ];
  const recordAllReceived = [
    {
      id: 1,
      name: translate(messages.remove),
    },
    {
      id: 2,
      name: translate(messages.addToList),
    },
    {
      id: 3,
      name: translate(messages.createMyList),
    },
    {
      id: 4,
      name: translate(messages.createListShare),
    },
  ];
  const recordHandworkList = [
    {
      id: 1,
      name: translate(messages.remove),
    },
    {
      id: 2,
      name: translate(messages.addToList),
    },
    {
      id: 3,
      name: translate(messages.moveToList),
    },
    {
      id: 4,
      name: translate(messages.createMyList),
    },
    {
      id: 5,
      name: translate(messages.createListShare),
    },
    {
      id: 6,
      name: translate(messages.removeFromList),
    },
  ];
  const recordAutoList = [
    {
      id: 1,
      name: translate(messages.remove),
    },
    {
      id: 2,
      name: translate(messages.updateList),
    },
    {
      id: 3,
      name: translate(messages.addToList),
    },
    {
      id: 4,
      name: translate(messages.moveToList),
    },
    {
      id: 5,
      name: translate(messages.createMyList),
    },
    {
      id: 6,
      name: translate(messages.createListShare),
    },
    {
      id: 7,
      name: translate(messages.removeFromList),
    },
  ];

  const tab = useSelector(tabbarBusinessCardSelector);
  const [edit, onEdit] = useState(tab);
  const [indexImg, setIndexImg] = useState(-1);
  const [dataListBusinessCards, setDataListBusinessCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dataSelector = useSelector(dataGetBusinessCardsSelector);
  const drawerSelector = useSelector(businessCardDrawerSelector);
  const refreshing = useSelector(refreshSelector);
  const [pressSelectAll, setPressSelectAll] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const sortSelector = useSelector(resultSortSelector);
  const drawerListSelected = useSelector(drawerListSelectedSelector);
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const refreshList = useSelector(refreshListSelector);

  let isFirstTime = false;

  useEffect(() => {
    getBusinessCardsFunc({
      selectedTargetId: drawerListSelected.selectedTargetId,
      selectedTargetType: drawerListSelected.selectedTargetType,
    });
  }, [drawerListSelected]);

  const [businessCardModal, handleToggleModal] = useState<BusinessCardModal>({
    isOpen: false,
    type: BusinessCardListModal.PREVIEW_IMAGE,
  });

  /**
   * close modal
   */
  const closeModal = () => {
    handleToggleModal({
      isOpen: false,
      type: businessCardModal.type,
    });
  };

  /**
   * open modal
   */
  const openModal = (type: BusinessCardListModal) => {
    handleToggleModal({
      isOpen: true,
      type,
    });
  };

  /**
   * render preview image modal
   */
  const renderPreviewImageModal = () => {
    return (
      <Modal
        visible={businessCardModal.isOpen}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
        onDismiss={closeModal}
      >
        <View style={BusinessCardItemStyles.modal}>
          <TouchableWithoutFeedback>
            <View style={BusinessCardStyles.bgShadow}>
              <TouchableOpacity
                onPress={closeModal}
                style={BusinessCardItemStyles.btnClose}
              >
                <Icon name="closer" style={BusinessCardStyles.iconClose} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
          <View style={BusinessCardItemStyles.body}>
            <TouchableOpacity
              style={BusinessCardItemStyles.btn}
              onPress={() => setIndexImg(indexImg - 1)}
              disabled={indexImg === 0}
            >
              {indexImg > 0 && <Icon name="back" />}
            </TouchableOpacity>
            <View style={BusinessCardItemStyles.card}>
              <Image
                source={{
                  uri:
                    indexImg > -1
                      ? dataListBusinessCards[indexImg].businessCardImagePath
                      : "",
                }}
                style={BusinessCardStyles.cardImg}
              />
            </View>
            <TouchableOpacity
              style={BusinessCardItemStyles.btn}
              onPress={() => setIndexImg(indexImg + 1)}
              disabled={indexImg === dataListBusinessCards?.length - 1}
            >
              {indexImg < dataListBusinessCards?.length - 1 && (
                <Icon name="next" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  let selectedBusinessCardId = dataListBusinessCards
  ?.filter((item: BusinessCardsDataDataResponse) => {
    return item?.selected;
  })
  .map((value: BusinessCardsDataDataResponse) => {
    return value.businessCardId;
  });

let deselectedBusinessCardId = dataListBusinessCards
  ?.filter((item: BusinessCardsDataDataResponse) => {
    return !item?.selected;
  })
  .map((value: BusinessCardsDataDataResponse) => {
    return value.businessCardId;
  });

  const remove =()=>{
    setModalCancel(!modalCancel)
  }
  const onChangeRemove =()=>{
    setModalCancel(false);
    callApiRemoveBusinessCardsFromList();
  }
  /**
   * check and show local tools modal
   */
  const renderLocalToolsModal = () => {
    let data: any[] = [];
    switch (businessCardModal.type) {
      case BusinessCardListModal.LIST_HAS_IN_FAVORITE:
        data = favoriteList;
        break;
      case BusinessCardListModal.LIST_NOT_YET_IN_FAVORITE:
        data = notYetInFavoriteList;
        break;
      case BusinessCardListModal.RECORD_ALL_RECEIVED:
        data = recordAllReceived;
        break;
      case BusinessCardListModal.RECORD_HAND_WORD:
        data = recordHandworkList;
        break;
      case BusinessCardListModal.RECORD_AUTO:
        data = recordAutoList;
        break;
      default:
        break;
    }
    return (
      <BusinessCardModal
        data={data}
        openModal={businessCardModal.isOpen}
        onPress={() => {
          closeModal();
        }}
        selectedBusinessCard={selectedBusinessCardId}
        deselectedBusinessCard={deselectedBusinessCardId}
        hasPressSelectAll={pressSelectAll}
        removeFromFavorite={() => {
          callApiRemoveListFromFavorite();
        }}
        deleteList={remove}
        copyList={() => {
          const newList = { ...drawerListSelected.listCard };
          newList.listName = drawerListSelected.listName;
          if (drawerListSelected?.listCard?.listType === 1) {
            navigation.navigate("business-card-create-my-list", {
              list: newList,
            });
          } else {
            navigation.navigate("business-card-create-shared-list", {
              list: newList,
            });
          }
          // navigation.navigate("business-card-add");
        }}
        addToFavorite={() => {
          callApiAddListToFavorite();
        }}
        refreshList={() => {}}
        changeToShareList={() => {
          callApiChangeToShareList();
        }}
        deleteBusinessCard={() => {}}
        removeRecordFromList={() => {
          callApiRemoveBusinessCardsFromList();
        }}
      />
    );
  };

  const renderModal = () => {
    switch (businessCardModal.type) {
      case BusinessCardListModal.PREVIEW_IMAGE:
        return renderPreviewImageModal();
      case BusinessCardListModal.DELETE_LIST:
        return (
          <ModalCancel
            visible={businessCardModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
            titleModal={translate(messages.delete)}
            contentModal={translate(messages.confirmDelete)}
            textBtnLeft={translate(messages.cancel)}
            textBtnRight={translate(messages.confirm)}
            onPress={() => {
              callApiDeleteList();
            }}
          />
        );
      case BusinessCardListModal.CHANGE_TO_SHARE_LIST:
        return (
          <ModalCancel
            visible={businessCardModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
            titleModal={translate(messages.delete)}
            contentModal={translate(messages.confirmDelete)}
            textBtnLeft={translate(messages.cancel)}
            textBtnRight={translate(messages.confirm)}
            onPress={() => {
              callApiChangeToShareList();
            }}
          />
        );
      default:
        return renderLocalToolsModal();
    }
  };

  useEffect(() => {
    const { businessCards } = dataSelector;
    const data = businessCards?.map((el: any) => {
      return {
        ...el,
        selected: false,
      };
    });
    setDataListBusinessCards(data);
  }, [dataSelector]);

  useEffect(() => {
    navigation.dispatch(DrawerActions.closeDrawer());
  }, [drawerSelector]);

  useEffect(() => {
    onEdit(tab);
  }, [tab]);

  /**
   * call api getBusinessCards
   * @param param
   */
  const getBusinessCardsFunc = async () => {
    const params = {
      filterConditions: [],
      isFirstLoad: !isFirstTime,
      limit: 500,
      offset: 0,
      orderBy: [],
      searchConditions: [],
      searchLocal: null,
      selectedTargetId: drawerListSelected?.selectedTargetId || null,
      selectedTargetType: drawerListSelected?.selectedTargetType || 0,
    };
    const response = await getBusinessCards(params);
    if (loading) {
      setLoading(false);
    }
    if (refreshing) {
      dispatch(businessCardActions.refresh(false));
    }
    if (response.status === 200) {
      isFirstTime = true;
      dispatch(businessCardActions.getBusinessCards(response.data));
    }
  };
  const callApiRemoveBusinessCardsFromList = async () => {
    const params = {
      listOfBusinessCardId: [1],
      idOfList: 1,
    };
    const response = await removeBusinessCardsFromList(params);
    if (response?.status == 200 && response?.data?.listOfBusinessCardId) {
      return;
    }
  };

  const callApiRemoveListFromFavorite = async () => {
    const params = {
      idOfList: drawerListSelected.listId,
    };

    const response = await handleListBusinessCards(
      BUSINESS_CARD_API.removeListFromFavorite,
      params,
    );
    if (response?.status == 200 && response?.data?.idOfList) {
      // do smt
    }
  };

  const callApiAddListToFavorite = async () => {
    const params = {
      idOfList: drawerListSelected.listId,
    };

    const response = await handleListBusinessCards(
      BUSINESS_CARD_API.addListToFavorite,
      params,
    );

    if (response?.status == 200 && response?.data?.idOfList) {
      // do smt
    }
  };

  /**
   * call api to change list to share list
   */
  const callApiChangeToShareList = async () => {
    // dispatch(businessCardActions.changeToSharedList(elementSelected));
    const params = {
      businessCardListDetailId: drawerListSelected.listId || 0,
      businessCardList: {
        businessCardListName: drawerListSelected.listName || "",
        listType: BUSINESS_CARD_LIST.SHARED_LIST,
      },
    };
    const response = await updateBusinessCardsList(params);
    if (response?.status == 200 && response?.data?.businessCardListDetailId) {
      // do smt
    }
  };

  /**
   * call api refreshAutoList
   * @param element
   */
  // const callApiRefreshAutoList = async () => {
  //   const params = {
  //     idOfList: drawerListSelected.listId || 0,
  //   };
  //   const response = await handleListBusinessCards(
  //     BUSINESS_CARD_API.refreshAutoList,
  //     params,
  //     {}
  //   );
  //   if (response?.status == 200 && response?.data?.idOfList) {
  //     // do smt
  //   }
  // };

  /**
   * call api delete list
   */
  const callApiDeleteList = async () => {
    const params = {
      idOfList: drawerListSelected.listId || 0,
    };
    const response = await handleListBusinessCards(
      BUSINESS_CARD_API.deleteBusinessCardList,
      params,
      {}
    );
    if (response?.status == 200 && response?.data?.idOfList) {
      // do smt
    }
  };

  const getListName = () => {
    if (
      drawerListSelected.selectedTargetType ==
      BUSINESS_CARD_SELECTED_TARGET_TYPE.allBusinessCard
    ) {
      return translate(messages.allBusinessCard);
    } else if (
      drawerListSelected.selectedTargetType ==
      BUSINESS_CARD_SELECTED_TARGET_TYPE.receiveBusinessCard
    ) {
      return translate(messages.receiveBusinessCard);
    } else {
      return drawerListSelected.listName;
    }
  };

  /**
   * show tab bar
   * @param edit
   */
  const pressEdit = (editValue: boolean) => {
    onEdit(editValue);
    dispatch(businessCardActions.getTabbar(editValue));
  };

  /**
   * press select all
   */
  const pressSelected = () => {
    setPressSelectAll(true);
    const arr = [...dataListBusinessCards];
    arr.forEach(function func(el) {
      el.selected = true;
    });
    setDataListBusinessCards(arr);
  };

  /**
   *  cancel select all
   */
  const cancel = () => {
    const arr = [...dataListBusinessCards];
    arr.forEach(function func(el) {
      el.selected = false;
    });
    setDataListBusinessCards(arr);
    onEdit(true);
    dispatch(businessCardActions.getTabbar(true));
  };

  /**
   * press image business card
   * @param index
   */
  const pressImageBusinessCard = (index: number) => {
    openModal(BusinessCardListModal.PREVIEW_IMAGE);
    setIndexImg(index);
  };

  /**
   * open register business card screen
   */
  const registerBusiness = () => {
    setModalImagePicker(false);
    navigation.navigate(ScreenName.BUSINESS_CARD_REGISTER, {
      data: { screen: "Register" },
    });
  };

  /**
   * navigation sort
   */
  const sort = () => {
    navigation.navigate(ScreenName.POPUP_SORT_SCREEN, { data: fieldTypeSort });
  };

  /**
   * select card
   * @param index
   */
  const onSelected = (index: number) => {
    const arr = [...dataListBusinessCards];
    arr[index].selected = !arr[index].selected;
    setDataListBusinessCards(arr);
  };

  /**
   * render Empty
   */
  const emptyBusinessCard = () => {
    return !refreshing ? (
      <View style={BusinessCardStyles.viewEmpty}>
        <Icon name="warning" style={BusinessCardStyles.iconWarning} />
        <Text style={BusinessCardStyles.empty}>
          {translate(messages.empty)}
        </Text>
      </View>
    ) : null;
  };

  /**
   * refresh list
   */
  const onRefresh = () => {
    const { selectedTargetType = 0, selectedTargetId = null } =
      drawerListSelected || {};
    const param = {
      selectedTargetType,
      selectedTargetId,
    };
    offset = 1;
    dispatch(businessCardActions.refresh(true));
    getBusinessCardsFunc(param);
  };
  
  /**
   * catch action refresh list
   */
  useEffect(() => {
    onRefresh();
  }, [refreshList]);

  const onEndReached = () => {
    const { businessCards, totalRecords } = dataSelector;
    const { selectedTargetType = 0, selectedTargetId = null } =
      drawerListSelected || {};
    if (businessCards?.length >= totalRecords) {
      return;
    }
    const param = {
      selectedTargetType,
      selectedTargetId,
    };
    setLoading(true);
    offset += 1;
    getBusinessCardsFunc(param);
  };

  const uploadFromCamera = () => {
    setModalImagePicker(false);
    ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
  };

  const uploadFromAlbum = () => {
    setModalImagePicker(false);
    ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
    });
  };

  const onToggleModalCancel =()=>{
    setModalCancel(!modalCancel);
  }
  return (
    <View>
      <AppBarMenu name={translate(messages.title)} hasBackButton={false} />
      <View style={BusinessCardStyles.bg}>
        <View style={BusinessCardStyles.container}>
          <View style={BusinessCardStyles.inforBlock}>
            <Text style={BusinessCardStyles.title}>
              {`${getListName()}（${dataSelector.totalRecords}${translate(
                messages.name
              )}）`}
            </Text>
            <View style={BusinessCardStyles.fristRow}>
              <Text style={BusinessCardStyles.date}>
                {`${translate(messages.date)}: ${formatDate(
                  dataSelector.lastUpdateDate,
                  EnumFmDate.YEAR_MONTH_DAY_HM_DASH
                )}`}
              </Text>
              <View style={BusinessCardStyles.iconBlock}>
                <TouchableOpacity
                  style={BusinessCardStyles.iconEditButton}
                  onPress={() => {
                    pressEdit(!edit);
                  }}
                  hitSlop={BusinessCardStyles.hitslop}
                >
                  {edit ? <Icon name="edit" /> : <Icon name="editActive" />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={sort}
                  hitSlop={BusinessCardStyles.hitslop}
                >
                  <Icon
                    name={
                      sortSelector?.value == SortType.ASC
                        ? "ascending"
                        : "descending"
                    }
                    style={BusinessCardStyles.iconDescendingButton}
                  />
                </TouchableOpacity>
                {drawerListSelected.selectedTargetType !=
                  BUSINESS_CARD_SELECTED_TARGET_TYPE.allBusinessCard &&
                  drawerListSelected.selectedTargetType !=
                    BUSINESS_CARD_SELECTED_TARGET_TYPE.receiveBusinessCard && (
                    <TouchableOpacity
                      onPress={() => {
                        if (drawerListSelected.displayOrderFavoriteList) {
                          openModal(BusinessCardListModal.LIST_HAS_IN_FAVORITE);
                        } else {
                          openModal(
                            BusinessCardListModal.LIST_NOT_YET_IN_FAVORITE
                          );
                        }
                      }}
                      hitSlop={BusinessCardStyles.hitslop}
                    >
                      <Icon
                        name="other"
                        style={BusinessCardStyles.iconOtherButton}
                      />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </View>
          <View style={BusinessCardStyles.listCard}>
            <FlatList
              data={dataListBusinessCards}
              extraData={dataListBusinessCards}
              keyExtractor={(item: BusinessCardsDataDataResponse) =>
                item.businessCardId.toString()
              }
              refreshing={Platform.OS === PlatformOS.IOS && refreshing}
              onRefresh={onRefresh}
              ListHeaderComponent={
                <AppIndicator
                  visible={Platform.OS === PlatformOS.ANDROID && refreshing}
                />
              }
              ListFooterComponent={<AppIndicator visible={loading} />}
              ListEmptyComponent={emptyBusinessCard}
              renderItem={({ item, index }) => (
                <BusinessCardItem
                  handlePressItem={() => {
                    navigation.navigate("business-card-detail", {
                      data: item,
                      currentIndex: index,
                      businessCardId: item.businessCardId,
                      isShowPrevNext: true,
                      prevBusinessCardId:
                        dataListBusinessCards[index - 1]?.businessCardId ||
                        undefined,
                      // index - 1 >= 0
                      //   ? cards[index - 1].businessCardId
                      //   : undefined,
                      nextBusinessCardId:
                        dataListBusinessCards[index + 1]?.businessCardId ||
                        undefined,
                      // index + 1 < cards.length
                      //   ? cards[index + 1].businessCardId
                      //   : undefined,
                    });
                  }}
                  avatarUrl={item.businessCardImagePath}
                  name={item.firstName + item.lastName}
                  role={item.position}
                  edit={edit}
                  show={businessCardModal.isOpen}
                  onPress={() => pressImageBusinessCard(index)}
                  selected={item.selected}
                  onSelected={() => {
                    onSelected(index);
                  }}
                  label={item.saveMode}
                />
              )}
              onEndReached={onEndReached}
              onEndReachedThreshold={
                Platform.OS == PlatformOS.ANDROID ? 0.1 : 0
              }
            />
            {!edit ? (
              <View style={BusinessCardStyles.tabbar}>
                <TouchableOpacity
                  style={BusinessCardStyles.btnTabbar}
                  onPress={() => pressSelected()}
                >
                  <Text style={BusinessCardStyles.textTabbar}>
                    {translate(messages.selectAll)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={BusinessCardStyles.btnTabbar}
                  onPress={() => cancel()}
                >
                  <Text style={BusinessCardStyles.textTabbar}>
                    {translate(messages.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={BusinessCardStyles.btnTabbar}
                  onPress={() => {
                    if (
                      drawerListSelected.selectedTargetType ==
                        BUSINESS_CARD_SELECTED_TARGET_TYPE.allBusinessCard ||
                      drawerListSelected.selectedTargetType ==
                        BUSINESS_CARD_SELECTED_TARGET_TYPE.receiveBusinessCard
                    ) {
                      openModal(BusinessCardListModal.RECORD_ALL_RECEIVED);
                    } else {
                      if (
                        drawerListSelected.listMode ==
                        BUSINESS_CARD_LIST_MODE.auto
                      ) {
                        openModal(BusinessCardListModal.RECORD_AUTO);
                      } else {
                        openModal(BusinessCardListModal.RECORD_HAND_WORD);
                      }
                    }
                  }}
                  disabled={!dataListBusinessCards?.some((el) => el.selected)}
                >
                  <Text
                    style={
                      dataListBusinessCards?.some((el) => el.selected)
                        ? BusinessCardStyles.btnDisRecord
                        : BusinessCardStyles.btnRecord
                    }
                  >
                    {translate(messages.operation)}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
          </View>
          {renderModal()}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setModalImagePicker(true)}
        style={[
          CommonStyles.floatButtonV2,
          { bottom: edit ? height * 0.15 : height * 0.225 },
        ]}
      >
        <Image
          style={CommonStyles.floatButtonImage}
          source={appImages.iconPlusGreen}
        />
      </TouchableOpacity>
      <ModalImagePicker
        visible={modalImagePicker}
        closeModal={() => setModalImagePicker(false)}
        openCamera={() => uploadFromCamera()}
        openAlbum={() => uploadFromAlbum()}
        registerBusinessCard={() => registerBusiness()}
      />
      <ModalCancel
          visible={modalCancel}
          closeModal={onToggleModalCancel}
          titleModal="削除"
          contentModal="個の名刺をリストから外します。よろしいですか？"
          textBtnLeft="キャンセル"
          textBtnRight="削除"
          onPress={onChangeRemove}
        />
    </View>
  );
}
