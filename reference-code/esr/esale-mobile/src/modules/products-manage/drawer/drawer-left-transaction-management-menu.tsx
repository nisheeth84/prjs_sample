import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  // Alert as ShowError,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { drawerLeftTransactionManagementStyles } from "./drawer-left-transaction-management-styles";
import { translate } from "../../../config/i18n";
import { messages } from "./drawer-left-transaction-messages";
import { Icon } from "../../../shared/components/icon";
import { messages as responseMessage } from "../../../shared/messages/response-messages"
import { CommonStyles } from "../../../shared/common-style";
import {
  ProductTradingActive,
  GetListMode,
  PlatformOS,
  ControlType,
  LIST_MODE,
  LIST_TYPE,
  TypeMessage,
} from "../../../config/constants/enum";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import {
  getProductManagerList,
  updateProductTradingsList,
  handleProductTradingList,
} from "../product-manage-repository";
import { productManageActions } from "../manage/product-manage-reducer";
import {
  dataGetProductTradingListSelector,
  tabbarProductTradingSelector,
  reloadDrawerSelector,
} from "../product-manage-selector";
import { ScreenName } from "../../../config/constants/screen-name";
import { getApiErrorMessage } from "../handle-error-message";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { SALES_API } from "../../../config/constants/api";
import { getCopyList } from "../utils";
import { AuthorizationState } from "../../login/authorization/authorization-reducer";
import { authorizationSelector } from "../../login/authorization/authorization-selector";

const styles = drawerLeftTransactionManagementStyles;
let elementSelected: any;

/**
 * Left Drawer in business card screen
 */

export const TransactionManagementMenu = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tab = useSelector(tabbarProductTradingSelector);
  const dataProductTradingList = useSelector(dataGetProductTradingListSelector);
  const { favorListBC, myListBC, sharedListBC } = dataProductTradingList;
  const authState: AuthorizationState = useSelector(authorizationSelector);

  const [modal, setModal] = useState(false);
  const [modalChangeToSharedList, setModalChangeToSharedList] = useState(false);
  const [active, setActive] = useState(ProductTradingActive.ALL_PRODUCT_TRADING);
  const [activeLine, setActiveLine] = useState(-1);
  const [editer, setEditer] = useState(false);
  const [listCollapse, setListCollapse] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [textSearch, setTextSearch] = useState("");
  const [favorList, setFavorList] = useState<any[]>([]);
  const [myList, setMyList] = useState<any[]>([]);
  const [sharedList, setSharedList] = useState<any[]>([]);
  const reloadDrawer = useSelector(reloadDrawerSelector);

  if (Platform.OS === PlatformOS.ANDROID) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const onToggleArrow = (type: number) => {
    const newCol = [...listCollapse];
    newCol[type] = !newCol[type];
    setListCollapse(newCol);
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  useEffect(() => {
    setFavorList(dataProductTradingList.favorListBC);
    setMyList(dataProductTradingList.myListBC);
    setSharedList(dataProductTradingList.sharedListBC);
  }, [dataProductTradingList]);

  useEffect(() => {
    getProductTradingListFunc({});
    setActive(ProductTradingActive.ALL_PRODUCT_TRADING)
    setTextSearch("")
  }, [reloadDrawer])

  /**
   * call api getProductTradingsList
   */
  async function getProductTradingListFunc(param: {
    idOfList?: number;
    mode?: number;
  }) {
    const params = {
      mode: GetListMode.GET_ALL,
      ...param,
    };
    const data = await getProductManagerList(params, {});
    if (data?.status === 200) {
      dispatch(productManageActions.getProductTradingList(data.data));
    }
  }

  /**
   * call api updateProductTradingsList
   */
  const callApiChangeToShareList = async () => {
    const params: any = {
      productTradingListDetailId: elementSelected.listId,
      productTradingList: {
        productTradingListName: elementSelected.listName,
        listType: LIST_TYPE.sharedList,
        listMode: elementSelected.listMode,
        ownerList: [authState.employeeId],
        viewerList: [],
        isOverWrite: 1
      },
    }
    const response = await updateProductTradingsList(params)
    if (response?.status == 200 && !!response?.data) {
      dispatch(productManageActions.reloadDrawer({}));
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
    setModalChangeToSharedList(false)
  };

  /**
   * toggle modal confirm delete
   */
  const onToggleModal = () => {
    setModal(!modal);
  };

  /**
   * toggle modal change to share list
   */
  const onToggleModalChangeToSharedList = () => {
    setModalChangeToSharedList(!modalChangeToSharedList);
  };

  /**
   * copy list
   * @param type
   * @param element
   */

  const copyList = (element: any) => {
    let params = {
      type: ControlType.COPY,
      listId: element.listId,
      recordIds: [],
      listName: getCopyList(elementSelected, myListBC.concat(sharedListBC))?.listName || TEXT_EMPTY
    }
    if (element.listType == LIST_TYPE.myList) {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, params)
    } else {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, params)
    }
  }

  /**
   * delete list
   */
  const callApiDeleteProductTradingList = async () => {
    const params = {
      idOfList: elementSelected.listId,
    };
    const response = await handleProductTradingList(SALES_API.deleteProductTradingList, params, {});
    if (response?.status == 200 && response?.data?.idOfList) {
      dispatch(productManageActions.reloadDrawer({}));
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
    setModal(false);
  }

  const createList = (type: number) => {
    let params = {
      type: ControlType.ADD,
      recordIds: []
    }
    setTextSearch("")
    if (type === ProductTradingActive.MY_LIST) {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, params);
    } else {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, params);
    }
  };

  const editList = (status: any, type: number, listId: number) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    dispatch(productManageActions.getTabbar(!status));
    setTextSearch("")
    let params = {
      type: ControlType.EDIT,
      listId,
      recordIds: []
    }
    if (type === ProductTradingActive.MY_LIST) {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_MY_LIST, params);
    } else {
      navigation.navigate(ScreenName.PRODUCT_MANAGE_CREATE_SHARE_LIST, params);
    }
  };

  /**
   * render name of list
   * @param type
   * @param content
   * @param disable
   * @param iconRight
   * @param iconLeft
   */
  const renderHeaderLine = (
    type: number,
    content: string,
    disable?: boolean,
    iconRight?: string,
    iconLeft?: string
  ) => {
    return (
      <View style={styles.viewLine}>
        <View style={CommonStyles.flex1}>
          <TouchableOpacity
            hitSlop={CommonStyles.hitSlop}
            onPress={() => onToggleArrow(type)}
          >
            <Icon name={iconLeft || TEXT_EMPTY} />
          </TouchableOpacity>
        </View>
        <View style={CommonStyles.flex9}>
          <TouchableOpacity onPress={() => onToggleArrow(type)}>
            <Text style={[styles.txtList, disable && styles.txtDisable]}>
              {content}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[CommonStyles.flex1, CommonStyles.alignEnd]}>
          {iconRight ? (
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              onPress={() => createList(type)}
            >
              <Icon name={iconRight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  /**
   * render list
   * @param type
   * @param element
   * @param index
   * @param disable
   * @param iconRight
   */
  const renderLine = (
    type: number,
    element: any,
    index: number,
    disable?: boolean,
    iconRight?: string
  ) => {
    return (
      <View key={index}>
        <View style={styles.viewLine}>
          <View style={styles.left} />
          <View style={styles.middle}>
            <TouchableOpacity
              onPress={() => {
                elementSelected = element;
                setActive(type);
                setActiveLine(index);
                if (!editer) {
                  dispatch(productManageActions.saveDrawerAllReceived({
                    selectedTargetType: type,
                    selectedTargetId: element.listId,
                    listMode: element.listMode,
                    displayOrderOfFavoriteList: element.displayOrderOfFavoriteList,
                    listId: elementSelected.listId,
                    listName: elementSelected.listName,
                    listType: elementSelected.listType,
                    ownerList: elementSelected.ownerList,
                    viewerList: elementSelected.viewerList
                  }));
                  navigation.dispatch(DrawerActions.closeDrawer());
                }
              }}
              disabled={disable}
            >
              <Text
                style={[
                  styles.txtList,
                  disable && styles.txtDisable,
                  active === type && activeLine === index && styles.txtActive,
                ]}
                numberOfLines={1}
              >
                {element.listName}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.right}>
            {iconRight ? (
              <TouchableOpacity
                hitSlop={CommonStyles.hitSlop}
                disabled={editer}
                onPress={() => {
                  if (elementSelected?.listId === element?.listId) {
                    dispatch(productManageActions.reloadAutoList({}));
                    navigation.dispatch(DrawerActions.closeDrawer());
                  }
                }}
              >
                <Icon name={iconRight} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {editer &&
          type !== ProductTradingActive.FAVORITE_LIST &&
          element.listMode === LIST_MODE.handwork &&
          active === type &&
          activeLine === index && (
            <View style={styles.viewContainerButton}>
              <View style={styles.left} />
              <View style={styles.middle}>
                <View style={styles.viewButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      editList(tab, type, element.listId);
                    }}
                  >
                    <Text>{translate(messages.edit)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => copyList(element)}
                  >
                    <Text>{translate(messages.reproduction)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      onToggleModal();
                    }}
                  >
                    <Text>{translate(messages.delete)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.right} />
            </View>
          )}
        {editer &&
          type === ProductTradingActive.MY_LIST &&
          element.listMode === LIST_MODE.handwork &&
          active === type &&
          activeLine === index && (
            <View style={styles.viewContainerButton}>
              <View style={CommonStyles.flex1} />
              <View style={CommonStyles.flex9}>
                <View style={styles.viewButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setModalChangeToSharedList(true);
                    }}
                  >
                    <Text>{translate(messages.changeToSharedList)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={CommonStyles.flex1} />
            </View>
          )}
      </View>
    );
  };

  const renderList = (type: number, listName: string, list: Array<any>) => {
    return (
      <View style={styles.viewList}>
        {renderHeaderLine(
          type,
          listName,
          editer && type === ProductTradingActive.FAVORITE_LIST,
          type === ProductTradingActive.FAVORITE_LIST
            ? TEXT_EMPTY
            : "addCircleOutline",
          listCollapse[type] ? "arrowDown" : "arrowUp"
        )}
        {listCollapse[type] &&
          list.map((el: any, index: number) => {
            return renderLine(
              type,
              el,
              index,
              (editer && type === ProductTradingActive.FAVORITE_LIST) ||
              (editer && el.listMode === LIST_MODE.auto),
              el.listMode === LIST_MODE.auto
                ? "refresh"
                : TEXT_EMPTY
            );
          })}
      </View>
    );
  };

  /**
   * search business card
   * @param text
   */

  const onSearch = (text: string) => {
    setTextSearch(text);
    const filterFunc = (el: any) => {
      return el.listName.includes(text.trim());
    };
    setFavorList(favorListBC.filter(filterFunc));
    setMyList(myListBC.filter(filterFunc));
    setSharedList(sharedListBC.filter(filterFunc));
  };

  /**
   * press editer
   */

  const onToggleEditer = () => {
    setEditer(!editer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewLabel}>
        <Text style={styles.txtLabel}>{translate(messages.label)}</Text>
        {!editer ? (
          <TouchableOpacity
            hitSlop={CommonStyles.hitSlop}
            style={styles.edit}
            onPress={onToggleEditer}
          >
            <Icon name="edit" />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              style={styles.done}
              onPress={onToggleEditer}
            >
              <Text style={styles.txtDone}>{translate(messages.done)}</Text>
            </TouchableOpacity>
          )}
      </View>
      <TouchableOpacity
        style={styles.viewLabel}
        disabled={editer}
        onPress={() => {
          setActive(ProductTradingActive.MY_PRODUCT_TRADING);
          dispatch(
            productManageActions.saveDrawerAllReceived({
              selectedTargetType: ProductTradingActive.MY_PRODUCT_TRADING
            })
          );
          navigation.dispatch(DrawerActions.closeDrawer());
        }}
      >
        <Text
          style={[
            styles.txt,
            editer && styles.txtDisable,
            active === ProductTradingActive.MY_PRODUCT_TRADING &&
            styles.txtActive,
          ]}
        >
          {translate(messages.myTradingProduct)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewLabel}
        disabled={editer}
        onPress={() => {
          setActive(ProductTradingActive.ALL_PRODUCT_TRADING);
          dispatch(
            productManageActions.saveDrawerAllReceived({
              selectedTargetType: ProductTradingActive.ALL_PRODUCT_TRADING
            })
          );
          navigation.dispatch(DrawerActions.closeDrawer());
        }}
      >
        <Text
          style={[
            styles.txt,
            editer && styles.txtDisable,
            active === ProductTradingActive.ALL_PRODUCT_TRADING && styles.txtActive,
          ]}
        >
          {translate(messages.allTradingProduct)}
        </Text>
      </TouchableOpacity>
      <View style={styles.view}>
        <Text style={[styles.txt, editer && styles.txtDisable]}>
          {translate(messages.list)}
        </Text>
        <View style={styles.viewSearch}>
          <Icon name="search" />
          <TextInput
            style={styles.txtSearch}
            value={textSearch}
            placeholder={translate(messages.searchList)}
            onChangeText={onSearch}
            editable={!editer}
          />
          {!editer && textSearch ? (
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              style={styles.close}
              onPress={() => onSearch("")}
            >
              <Icon name="close" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView>
        {renderList(
          ProductTradingActive.FAVORITE_LIST,
          translate(messages.favorList),
          favorList
        )}
        {renderList(
          ProductTradingActive.MY_LIST,
          translate(messages.myList),
          myList
        )}
        {renderList(
          ProductTradingActive.SHARE_LIST,
          translate(messages.sharedList),
          sharedList
        )}

        <ModalCancel
          visible={modal}
          closeModal={onToggleModal}
          titleModal={translate(messages.delete)}
          contentModal={translate(messages.confirmDelete)}
          textBtnLeft={translate(messages.cancel)}
          textBtnRight={translate(messages.confirm)}
          onPress={() => {
            callApiDeleteProductTradingList();
          }}
        />

        <ModalCancel
          visible={modalChangeToSharedList}
          closeModal={onToggleModalChangeToSharedList}
          titleModal={translate(messages.confirmChangeToSharedListTitle)}
          contentModal={translate(messages.confirmChangeToSharedList)}
          textBtnLeft={translate(messages.cancel)}
          textBtnRight={translate(messages.confirm)}
          onPress={() => {
            callApiChangeToShareList();
          }}
        />
      </ScrollView>
    </View>
  );
};
