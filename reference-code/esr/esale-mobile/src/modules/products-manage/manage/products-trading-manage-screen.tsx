import React, { useEffect, useState } from "react";
import {
  View
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderProductsManagement } from "./header-products-trading-management";
import {
  productTradingSelector,
  drawerListSelectedSelector,
  listScreenWarningMessageSelector,
  selectRecordSelector,
  reloadAutoListSelector,
  dataGetProductTradingListSelector,
  refreshListSelector
} from "../product-manage-selector";
import { productManageActions } from "./product-manage-reducer";
import { ProgressTab } from "./progress-tab";
import { ListProduct } from "./list-products-trading";
import { TabEditProducts } from "./tab-edit-products";
import { ProductTrading } from "../product-type";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { messages } from "../products-manage-messages";
import { translate } from "../../../config/i18n";
import {
  SortType,
  ProductTradingActive,
  LIST_MODE,
  ControlType,
  ProductTradingManagerModal,
  TypeMessage,
  LIST_TYPE,
} from "../../../config/constants/enum";
import { ScreenName } from "../../../config/constants/screen-name";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import {
  handleProductTradingList,
  updateProductTradingsList,
  removeProductTradingsFromList,
  deleteProductTrading
} from "../product-manage-repository";
import { ModalBottomOption } from "../../../shared/components/modal-bottom-option/modal-bottom-option";
import { getProductTradingsByProgress } from "../product-manage-repository";
import { CommonMessage } from "../../../shared/components/message/message";
import { CommonStyles } from "../../../shared/common-style";
import { messages as responseMessage } from "../../../shared/messages/response-messages"
import { PARAMS_0, TEXT_EMPTY } from "../../../config/constants/constants";
import { SALES_API } from "../../../config/constants/api";
import { getApiErrorMessage } from "../handle-error-message";
import { resultSortSelector } from "../../../shared/components/popup-sort/popup-sort-selector";
import { getCopyList, checkOwner } from "../utils";
import { AuthorizationState } from "../../login/authorization/authorization-reducer";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { EnumFmDate } from "../../../config/constants/enum-fm-date";
import { formatDate } from "../../../shared/util/app-utils";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";

const DEFAULT_SORT = [{
  "key": "customer_id",
  "value": "ASC",
  "fieldType": 9
}];

let isFirstLoad = true;

const fieldTypeSort = [
  { key: "customer_id", fieldType: 9, name: "customer id" }
]

export function ProductManagers() {
  const authData = useSelector(authorizationSelector);
  const productTradings = useSelector(productTradingSelector);
  const drawerListSelected = useSelector(drawerListSelectedSelector);
  const messageWarning = useSelector(listScreenWarningMessageSelector);
  const dataProductTradingList = useSelector(dataGetProductTradingListSelector);
  const { myListBC, sharedListBC } = dataProductTradingList;

  const selectRecord = useSelector(selectRecordSelector);
  const [edit, setEdit] = useState(selectRecord);
  const reloadAutoList = useSelector(reloadAutoListSelector);
  const refreshList = useSelector(refreshListSelector);
  const [selectAll, setSelectAll] = useState(false);
  const [modalCancel, setModalCancel] = useState<any>({
    type: ProductTradingManagerModal.DELETE_RECORD_FROM_LIST,
    isShow: false
  });

  const [showLocalTool, setShowLocalTool] = useState(false);
  const [sort, setSort] = useState(SortType.ASC);
  const [selectedTab, setSelectedTab] = useState(0);

  const [listProductTrading, setListProductTrading] = useState<any>(productTradings);
  // const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const sortSelector = useSelector(resultSortSelector)
  const authState: AuthorizationState = useSelector(authorizationSelector);
  const [isGetList, setGetList] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setEdit(false);
    setSelectAll(false);
    // setSelectedRecordIds([]);
  }, [selectRecord])

  useEffect(() => {
    if (drawerListSelected.listMode === LIST_MODE.auto) {
      reloadList();
    }
  }, [reloadAutoList])

  useEffect(() => {
    reloadList();
  }, [refreshList]);

  if (messageWarning.isShow
    // && messageWarning.type === TypeMessage.SUCCESS
  ) {
    setTimeout(() => {
      dispatch(productManageActions.closeMessageWarning({}));
    }, 3000)
  }

  useEffect(() => {
    setListProductTrading(productTradings);
  }, [productTradings]);

  /**
   *  get data for the first time
   */

  useEffect(() => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (isFirstLoad) {
      getDataProductTradings({
        selectedTargetType: 0,
        selectedTargetId: 0,
        orders: DEFAULT_SORT
      });
      isFirstLoad = false;
    } else {
      reloadList();
    }
  }, [drawerListSelected]);

  const reloadList = () => {
    getDataProductTradings({
      selectedTargetType: drawerListSelected.selectedTargetType,
      selectedTargetId: drawerListSelected.selectedTargetId ? drawerListSelected.selectedTargetId : 0,
      orders: DEFAULT_SORT
    })
  }

  /**
   * call api get data product trading
   * @param payload 
   */
  async function getDataProductTradings(payload: any) {
    setListProductTrading({})
    setGetList(true)
    let params = {
      isOnlyData: false,
      orders: sortSelector,
      offset: 0,
      limit: 10,
      isFirstLoad: false,
      ...payload
    }
    const response = await getProductTradingsByProgress(params, {});
    setGetList(false);
    if (response.status === 200) {
      dispatch(
        productManageActions.getProductTrading({
          listProductTrading: {
            ...response.data,
            // productTradingsByProgress: listProductTradingDUMMY.productTradingsByProgress
          },
        })
      );
    } else {
      let error = getApiErrorMessage(response);
      dispatch(productManageActions.showMessageWarning(
        {
          content: error.content,
          type: error.type
        }
      ))
    }
  }

  /**
   * call api handle list
   */
  const callApiHandleList = async (url: string) => {
    const params: any = {
      idOfList: drawerListSelected.listId || 0,
    };
    const response = await handleProductTradingList(url, params, {});
    setShowLocalTool(false)
    if (response?.status == 200 && response?.data) {
      if (url === SALES_API.refreshAutoList) {
        reloadList();
      } else {
        dispatch(productManageActions.reloadDrawer({}));
        dispatch(productManageActions.showMessageWarning(
          {
            content: translate(responseMessage.INF_COM_0004),
            type: TypeMessage.SUCCESS
          }
        ))
      }
    } else {
      let error = getApiErrorMessage(response);
      dispatch(productManageActions.showMessageWarning(
        {
          content: error.content,
          type: error.type
        }
      ))
    }
  }

  /**
   * call api remove from favorite
   */
  const callApiRemoveFromFavorite = async () => {
    callApiHandleList(SALES_API.removeListFromFavorite);
  }

  /**
   * call api add to favorite
   */
  const callApiAddToFavorite = () => {
    callApiHandleList(SALES_API.addListToFavorite);
  }

  /**
   * call api delete list
   */
  const callApiDeleteList = () => {
    callApiHandleList(SALES_API.deleteProductTradingList);
  }

  /**
   * call api change to share list
   */
  const callApiChangeToShareList = async () => {
    const params: any = {
      productTradingListDetailId: drawerListSelected.listId,
      productTradingList: {
        productTradingListName: drawerListSelected.listName,
        listType: LIST_TYPE.sharedList,
        listMode: drawerListSelected.listMode,
        ownerList: [authState.employeeId],
        viewerList: [],
        isOverWrite: 1
      },
    }
    const response = await updateProductTradingsList(params)
    closeModalCancel()
    if (response?.status == 200 && !!response?.data) {
      dispatch(productManageActions.reloadDrawer({}))
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessage.INF_COM_0004),
          type: TypeMessage.SUCCESS
        }
      ))
    } else {
      let error = getApiErrorMessage(response);
      dispatch(productManageActions.showMessageWarning(
        {
          content: error.content,
          type: error.type
        }
      ))
    }
  }

  /**
   * call api refresh auto list
   */
  const callApiRefreshAutoList = async () => {
    callApiHandleList(SALES_API.refreshAutoList);
  }

  /**
   * call api remove from list
   */
  const callApiRemoveFromList = async () => {
    const params: any = {
      listOfProductTradingId: getSelectedRecordIds(),
      idOfList: drawerListSelected.listId
    }
    const response = await removeProductTradingsFromList(params)
    if (response?.status == 200 && !!response?.data) {
      reloadList();
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessage.INF_COM_0005),
          type: TypeMessage.SUCCESS
        }
      ))
    } else {
      let error = getApiErrorMessage(response);
      dispatch(productManageActions.showMessageWarning(
        {
          content: error.content,
          type: error.type
        }
      ))
    }
    closeModalCancel();
  }

  /**
   * call api delete product trading
   */
  const callApiDeleteProductTrading = async () => {
    const params: any = {
      productTradingIds: getSelectedRecordIds()
    }
    const response = await deleteProductTrading(params)
    if (response?.status == 200 && !!response?.data) {
      dispatch(productManageActions.reloadDrawer({}))
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessage.INF_COM_0005),
          type: TypeMessage.SUCCESS
        }
      ))
      onDeleteSuccess()
    } else {
      let error = getApiErrorMessage(response);
      dispatch(productManageActions.showMessageWarning(
        {
          content: error.content,
          type: error.type
        }
      ))
      closeModalCancel()
    }
  }

  /**
   * get local tools layout
   */
  const getLocalTools = () => {
    const isAllOrMyListSelected =
      drawerListSelected.selectedTargetType === ProductTradingActive.MY_PRODUCT_TRADING
      || drawerListSelected.selectedTargetType === ProductTradingActive.ALL_PRODUCT_TRADING;
    const isFavorListSelected = !!drawerListSelected.displayOrderOfFavoriteList;
    const isMyListOrShareListSelected =
      drawerListSelected.listType === LIST_TYPE.myList
      || drawerListSelected.listType === LIST_TYPE.sharedList;

    const localTools = [
      {
        name: translate(messages.updateList),
        onPress: () => {
          callApiRefreshAutoList()
        },
        visible: () =>
          !edit && drawerListSelected.listMode === LIST_MODE.auto
      },
      {
        name: translate(messages.removeFromFavorite),
        onPress: () => {
          callApiRemoveFromFavorite();
        },
        visible: () => isFavorListSelected && !edit
      },
      {
        name: translate(messages.addToFavorite),
        onPress: () => {
          callApiAddToFavorite();
        },
        visible: () => !isFavorListSelected && !edit
      },
      {
        name: translate(messages.editList),
        onPress: () => {
          let params = {
            type: ControlType.EDIT,
            listId: drawerListSelected.listId,
            recordIds: []
          }
          if (drawerListSelected.selectedTargetType === ProductTradingActive.MY_LIST) {
            navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, params);
          } else {
            navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, params);
          }
        },
        visible: () =>
          !edit && drawerListSelected.listMode !== LIST_MODE.auto
          && checkOwner(drawerListSelected.ownerList, authState.employeeId, drawerListSelected.listType === LIST_TYPE.myList)
      },
      {
        name: translate(messages.deleteList),
        onPress: () => {
          callApiDeleteList();
        },
        visible: () =>
          !edit && drawerListSelected.listMode !== LIST_MODE.auto
          && checkOwner(drawerListSelected.ownerList, authState.employeeId, drawerListSelected.listType === LIST_TYPE.myList)
      },
      {
        name: translate(messages.copyList),
        onPress: () => {
          let params = {
            type: ControlType.COPY,
            listId: drawerListSelected.listId,
            recordIds: [],
            listName: getCopyList(drawerListSelected, myListBC.concat(sharedListBC))?.listName || TEXT_EMPTY
          }
          if (drawerListSelected.listType == LIST_TYPE.myList) {
            navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, params)
          } else {
            navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, params)
          }
        },
        visible: () =>
          !edit && drawerListSelected.listMode !== LIST_MODE.auto
      },
      {
        name: translate(messages.changeToShareList),
        onPress: () => {
          openModalCancel(ProductTradingManagerModal.MYLIST_TO_SHARE_LIST)
        },
        visible: () =>
          !edit && drawerListSelected.listType === LIST_TYPE.myList
      },
      {
        name: translate(messages.delete),
        onPress: () => {
          openModalCancel(ProductTradingManagerModal.DELETE_RECORD)
        },
        visible: () =>
          (isAllOrMyListSelected || isMyListOrShareListSelected) && edit
      },
      {
        name: translate(messages.updateList),
        onPress: () => {
          callApiRefreshAutoList();
        },
        visible: () =>
          isMyListOrShareListSelected && drawerListSelected.listMode === LIST_MODE.auto && edit
      },
      {
        name: translate(messages.addToList),
        onPress: () => {
          navigation.navigate(ScreenName.PRODUCT_MANAGE_ADD_TO_LIST, {
            recordIds: getSelectedRecordIds(),
          });
        },
        visible: () =>
          (isAllOrMyListSelected || isMyListOrShareListSelected) && edit
      },
      {
        name: translate(messages.moveToList),
        onPress: () => {
          navigation.navigate(ScreenName.PRODUCT_MANAGE_MOVE_TO_LIST, {
            recordIds: getSelectedRecordIds(),
            idOfOldList: drawerListSelected.listId
          });
        },
        visible: () =>
          ((drawerListSelected.selectedTargetType === ProductTradingActive.MY_LIST
            && drawerListSelected.listMode === LIST_MODE.handwork)
            || (drawerListSelected.selectedTargetType === ProductTradingActive.SHARE_LIST
              && drawerListSelected.listMode === LIST_MODE.handwork
              && checkOwner(drawerListSelected.ownerList, authState.employeeId, drawerListSelected.listType === LIST_TYPE.myList)
            ))
          && edit
      },
      {
        name: translate(messages.createMyList),
        onPress: () => {
          navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, {
            type: ControlType.ADD,
            recordIds: getSelectedRecordIds()
          });
        },
        visible: () =>
          (isAllOrMyListSelected || isMyListOrShareListSelected) && edit
      },
      {
        name: translate(messages.createShareList),
        onPress: () => {
          navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, {
            type: ControlType.ADD,
            recordIds: getSelectedRecordIds()
          });
        },
        visible: () =>
          (isAllOrMyListSelected || isMyListOrShareListSelected) && edit
      },
      {
        name: translate(messages.removeFromList),
        onPress: () => {
          openModalCancel(ProductTradingManagerModal.DELETE_RECORD_FROM_LIST);
        },
        visible: () =>
          (isAllOrMyListSelected || isMyListOrShareListSelected) && edit
      }
    ]
    return localTools;
  }

  /**
   * Select all product
   * @param check
   */
  const onPressAll = (isSelectedAll: boolean) => {
    // let recordIds: any[] = [];
    const newListProductTrading = {
      ...listProductTrading,
      productTradingsByProgress: (listProductTrading?.productTradingsByProgress || []).map((item: any, index: number) => ({
        ...item,
        productTradings: index === selectedTab ? (item?.productTradings || []).map((subItem: any) => {
          // recordIds.push(item.productTradingId);
          return {
            ...subItem,
            check: isSelectedAll
          }
        }) : item?.productTradings
      }))
    };
    setSelectAll(isSelectedAll);
    setListProductTrading(newListProductTrading);
    // if (isSelectedAll) {
    //   setSelectedRecordIds(recordIds);
    // } else {
    //   setSelectedRecordIds([]);
    // }
  };

  /**
   * Select single product
   * @param check
   */
  const onSelect = (selectedIndex: number) => {
    // let recordIds: any[] = _.cloneDeep(selectedRecordIds);
    const newListProductTrading = {
      ...listProductTrading,
      productTradingsByProgress: (listProductTrading?.productTradingsByProgress || []).map((item: any, index: number) => ({
        ...item,
        productTradings: index === selectedTab ? (item?.productTradings || []).map((subItem: any, subIndex: number) => {
          return {
            ...subItem,
            check: selectedIndex === subIndex ? !subItem.check : subItem.check
          }
        }) : item?.productTradings
      }))
    };
    // if (selectedItem.check) {
    //   let index = selectedRecordIds.indexOf(selectedItem.productTradingId)
    //   recordIds.splice(index, 1)
    // } else {
    //   recordIds.push(selectedItem.productTradingId)
    // }
    // setSelectedRecordIds(recordIds);
    setSelectAll(!newListProductTrading?.productTradingsByProgress[selectedTab]?.productTradings.some((item: any) => !item.check));
    setListProductTrading(newListProductTrading);
  };

  /**
   * show edit screen when click icon edit
   */
  const onEdit = () => {
    const getParent = navigation.dangerouslyGetParent();
    getParent?.setOptions({ tabBarVisible: edit });
    setEdit(!edit);
    setSelectAll(false);
    const newListProductTrading = {
      ...listProductTrading,
      productTradingsByProgress: (listProductTrading?.productTradingsByProgress || []).map((item: any) => ({
        ...item,
        productTradings: (item?.productTradings || []).map((subItem: any) => ({
          ...subItem,
          check: false
        }))
      }))
    };
    setListProductTrading(newListProductTrading);
  };

  /**
   * Select single product
   * @param check
   */
  const onCancel = () => {
    const newListProductTrading = {
      ...listProductTrading,
      productTradingsByProgress: (listProductTrading?.productTradingsByProgress || []).map((item: any) => ({
        ...item,
        productTradings: (item?.productTradings || []).map((subItem: any) => ({
          ...subItem,
          check: false
        }))
      }))
    };
    dispatch(
      productManageActions.getProductTrading({
        listProductTrading: newListProductTrading,
      })
    );
    onEdit();
  };

  /**
   * handle when call api delete success
   */
  const onDeleteSuccess = () => {
    const newListProductTrading = {
      ...listProductTrading,
      productTradingsByProgress: (listProductTrading?.productTradingsByProgress || []).map((item: any, index: any) => ({
        ...item,
        productTradings: index === selectedTab ? item?.productTradings?.filter((subItem: any) => !subItem.check) : item?.productTradings
      }))
    };
    dispatch(
      productManageActions.getProductTrading({
        listProductTrading: newListProductTrading,
      })
    );
    closeModalCancel();
  };

  /**
   * get selected list item
   */
  const getSelectedItem = () => {
    return ((listProductTrading?.productTradingsByProgress || [])[selectedTab] || { productTradings: [] })
      .productTradings?.filter((item: any) => item.check) || [];
  }

  /**
   * get selected records ids
   */
  const getSelectedRecordIds = () => {
    return (getSelectedItem() || []).map((item: any) => item.productTradingId) || []
  }

  /**
   * handle language at content modal
   */
  const checkContent = () => {
    const newListProductTrading = getSelectedItem();
    if (newListProductTrading.length === 1) {
      return authData && authData.languageCode === "ja_jp"
        ? `${newListProductTrading[0].productName}${translate(
          messages.productsManageConfirmDelete
        )}？`
        : `${translate(messages.productsManageConfirmDelete)} ${
        newListProductTrading[0].productName
        } ?`;
    }
    return authData && authData.languageCode === "ja_jp"
      ? `${newListProductTrading.length}${translate(
        messages.productsManageConfirmDeleteItems
      )}？`
      : `${translate(messages.productsManageConfirmDeleteItems)} ${
      newListProductTrading.length
      } item ?`;
  };

  const closeModalCancel = () => {
    setModalCancel({
      type: modalCancel.type,
      isShow: false
    })
  }

  const openModalCancel = (type: ProductTradingManagerModal) => {
    setModalCancel({
      type,
      isShow: true
    })
    setShowLocalTool(false)
  }

  const checkShowConfirmModal = () => {
    switch (modalCancel.type) {
      case ProductTradingManagerModal.DELETE_RECORD:
        return (
          <ModalCancel
            visible={modalCancel.isShow}
            titleModal={translate(messages.productsManageDelete)}
            contentModal={checkContent()}
            textBtnLeft={translate(messages.productsManageCancel)}
            textBtnRight={translate(messages.productsManageDelete)}
            onPress={() => { callApiDeleteProductTrading() }}
            closeModal={() => closeModalCancel()}
          />
        )
      case ProductTradingManagerModal.DELETE_RECORD_FROM_LIST:
        return (
          <ModalCancel
            visible={modalCancel.isShow}
            titleModal={translate(messages.productsManageDelete)}
            contentModal={translate(responseMessage.WAR_TRA_0002).replace(PARAMS_0, `${getSelectedRecordIds().length}`)}
            textBtnLeft={translate(messages.productsManageCancel)}
            textBtnRight={translate(messages.productsManageDelete)}
            onPress={() => { callApiRemoveFromList() }}
            closeModal={() => closeModalCancel()}
          />)

      case ProductTradingManagerModal.MYLIST_TO_SHARE_LIST:
        return (
          <ModalCancel
            visible={modalCancel.isShow}
            closeModal={() => closeModalCancel()}
            titleModal={translate(messages.confirmChangeToSharedListTitle)}
            contentModal={translate(messages.confirmChangeToSharedList)}
            textBtnLeft={translate(messages.productsManageCancel)}
            textBtnRight={translate(messages.confirm)}
            onPress={() => {
              callApiChangeToShareList();
            }}
          />)
      default:
        return;
    }
  }

  /**
   * Call api sort when click icon sort
   */
  const onSort = () => {
    navigation.navigate(ScreenName.POPUP_SORT_SCREEN, { data: fieldTypeSort })
  };

  useEffect(() => {
    setSort(sortSelector?.value);
  }, [sortSelector])

  /**
   * call api get record id and navigate to add to list screen, move to list screen, ...
   * use if api getRecordIds work
   */

  // const callApiAndNavigateScreen = (navigateScreenName: string) => {
  //   let deselectedRecordIds = listProductTrading?.filter((item: any) => {
  //     return !item?.selected
  //   }).map((value: any) => {
  //     return value.check
  //   });
  //   const callApi = async () => {
  //     let params = {
  //       deselectedRecordIds
  //     }
  //     const response = await getRecordIds(params, {})
  //     if (response?.status == 200 && response?.data) {
  //       navigation.navigate(navigateScreenName,
  //         {
  //           totalRecords: response.data.totalRecords,
  //           recordIds: response.data.recordIds
  //         })
  //     }
  //   }
  //   callApi()
  // }

  /**
   * 
   * @param index 
   */
  const onChooseTab = (index: number) => {
    onPressAll(false);
    setSelectedTab(index || 0);
  }

  /**
   * check show icon other
   */
  const checkShowIconOther = () => {
    if (drawerListSelected.selectedTargetType === ProductTradingActive.ALL_PRODUCT_TRADING && !edit) {
      return false;
    }
    if (drawerListSelected.selectedTargetType === ProductTradingActive.MY_PRODUCT_TRADING && !edit) {
      return false;
    }
    return true;
  }

  return (
    <>
      <AppBarMenu name={translate(messages.tradingProduct)} nameService={"productTrading"} />
      {messageWarning.isShow && (
        <View style={messageWarning.type === TypeMessage.SUCCESS
          ? CommonStyles.messageWarning
          : CommonStyles.messageWarningTop
        }>
          <CommonMessage content={messageWarning.content} type={messageWarning.type} />
        </View>
      )}
      <HeaderProductsManagement
        date={
          formatDate(listProductTrading?.lastUpdateDate,
            EnumFmDate.YEAR_MONTH_DAY_HM_DASH,
            true
          ) || TEXT_EMPTY
        }
        count={(listProductTrading?.productTradingsByProgress || [])
          .map((item: any) => item?.productTradings?.length)
          .reduce((item: any, total: any) => item + total, 0)}
        onSort={onSort}
        onEdit={onEdit}
        onOpenLocalTool={() => { setShowLocalTool(true) }}
        edit={edit}
        sort={sort}
        listName={drawerListSelected.listName ? drawerListSelected.listName : (
          drawerListSelected.selectedTargetType === ProductTradingActive.ALL_PRODUCT_TRADING ?
            translate(
              messages.productsManageAllTradingProducts
            ) :
            translate(
              messages.myTradingProduct
            )
        )
        }
        isShowIconOther={checkShowIconOther()}
      />
      {isGetList
        ? <AppIndicator size={40} style={CommonStyles.flex1} />
        :
        <>
          <ProgressTab
            items={listProductTrading?.productTradingsByProgress}
            onChooseTab={(index: number) => { onChooseTab(index) }}
          />
          <ListProduct
            onCheck={(_item: ProductTrading, index: number) => { onSelect(index) }}
            onPressEmployeesDetail={(item: ProductTrading) =>
              navigation.navigate(ScreenName.CUSTOMER_DETAIL, {
                employeeInfo: item,
              })
            }
            edit={edit}
            listProduct={((listProductTrading?.productTradingsByProgress || [])[selectedTab] || { productTradings: [] }).productTradings}
            onPullToRefresh={() => {
              reloadList();
            }}
          />
        </>
      }
      <TabEditProducts
        onCancel={() => onCancel()}
        onDeselect={() => onPressAll(false)}
        onSelectAll={() => onPressAll(true)}
        edit={edit}
        selectAll={selectAll}
        onEdit={() => {
          openModalCancel(ProductTradingManagerModal.DELETE_RECORD)
        }
        }
      />
      {
        checkShowConfirmModal()
      }
      <ModalBottomOption
        isVisible={showLocalTool}
        fieldName={"name"}
        dataOption={getLocalTools().filter((item) => item.visible())}
        onSelected={(item, index) => {
          let currentTab = listProductTrading?.productTradingsByProgress || []
          if (currentTab.length > 0) {
            item.onPress(item, index, currentTab[selectedTab])
          } else {
            item.onPress(item, index, [])
          }
        }}
        closeModal={() => { setShowLocalTool(false) }}
      />
    </>
  );
}
