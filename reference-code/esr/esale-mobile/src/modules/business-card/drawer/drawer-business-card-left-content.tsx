import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Alert as ShowError,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DrawerBusinessCardStyles } from "./drawer-business-card-style";
import { translate } from "../../../config/i18n";
import { messages } from "./drawer-left-messages";
import { Icon } from "../../../shared/components/icon";
import {
  getBusinessCardList,
  handleListBusinessCards,
  updateBusinessCardsList,
} from "../business-card-repository";
import { businessCardActions } from "../business-card-reducer";
import {
  dataGetBusinessCardListSelector,
} from "../business-card-selector";
import { CommonStyles } from "../../../shared/common-style";
import {
  GetBnCardListMode,
  BUSINESS_CARD_ACTIVE,
  BUSINESS_CARD_LIST,
  BUSINESS_CARD_LIST_MODE,
} from "../../../config/constants/enum";
import { businessCardDrawerActions } from "../navigators/business-card-drawer-reducer";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { BUSINESS_CARD_API } from "../../../config/constants/api";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { authorizationSelector } from "../../login/authorization/authorization-selector";

const styles = DrawerBusinessCardStyles;

let typeSelected = 0;
let elementSelected: any;

/**
 * Left Drawer in business card screen
 */

export const DrawerBusinessCardLeftContent = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authorization = useSelector(authorizationSelector);
  const dataBusinessCardList = useSelector(dataGetBusinessCardListSelector);
  const { favorListBC, myListBC, sharedListBC } = dataBusinessCardList;
  const [modal, setModal] = useState(false);
  const [modalChangeToSharedList, setModalChangeToSharedList] = useState(false);
  const [active, setActive] = useState(BUSINESS_CARD_ACTIVE.allBusinessCard);
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
  const onToggleArrow = (type: number) => {
    const newCol = [...listCollapse];
    newCol[type] = !newCol[type];
    setListCollapse(newCol);
  };

  useEffect(() => {
    const { favorListBC, myListBC, sharedListBC } = dataBusinessCardList;
    setFavorList(favorListBC);
    setMyList(myListBC);
    setSharedList(sharedListBC);
  }, [dataBusinessCardList]);

  // const handleErrorGetBusinessCardList = (
  //   response: BusinessCardListResponse
  // ) => {
  //   switch (response.status) {
  //     case 200: {
  //       dispatch(businessCardActions.getBusinessCardList(response.data));
  //       break;
  //     }
  //     default: {
  //       // ShowError.alert("Notify", "Error!");
  //       break;
  //     }
  //   }
  // };

  /**
   * call api getBusinessCardsList
   */
  async function getBusinessCardListFunc(param: {
    employeeTd?: number;
    idOfList?: number;
    mode?: number;
  }) {
    // dispatch(
    //   businessCardActions.getBusinessCardList(dataGetBusinessCardListDummy)
    // );
    const params = {
      mode: GetBnCardListMode.GET_ALL,
      // limit: 500,
      ...param,
    };
    const data = await getBusinessCardList(params, {});
    if (data.status===200) {
      dispatch(businessCardActions.getBusinessCardList(data.data));
    } else{
      alert('Server error!');
    }
  }

  const isFocused = useIsFocused();

  useEffect(() => {
    getBusinessCardListFunc({});
  }, [props, isFocused]);

  useEffect(() => {
    getBusinessCardListFunc({});
    // getBusinessCardsFunc({
    //   selectedTargetType: SELECTED_TARGET_TYPE.allBusinessCard,
    // });
  }, []);

  /**
   * call api updateBusinessCardsList
   */
  const updateBusinessCardsListFunc = async () => {
    const { listId, listName, viewerList } = elementSelected;
    const listViewer = JSON.parse(viewerList);
    const params = {
      businessCardList: {
        businessCardListName: listName,
        listType: BUSINESS_CARD_LIST.FAVOR_LIST,
        listMode: elementSelected.listMode,
        ownerList:[authorization?.employeeId],
        isOverWrite: elementSelected.isOverWrite,
        updatedDate:elementSelected.updatedDate,
        viewerList: listViewer?.employeeId,
      },
      businessCardListDetailId: listId,
    };
    const response = await updateBusinessCardsList(params);
    if (response?.status == 200 && response?.data?.businessCardListDetailId) {
      dispatch(businessCardActions.changeToSharedList(elementSelected));
      getBusinessCardListFunc({});
    } 
    if(response?.status !== 200) {
      ShowError.alert("Notify", "Error!")
    }
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

  const copyList = (type: number, item: any) => {
    const filterFunc = (el: any) => {
      return (
        el.listName === item.listName ||
        el.listName.includes(`${item.listName}`)
      );
    };
    let number=1;
    let listName;
    switch (type) {
      case BUSINESS_CARD_LIST.FAVOR_LIST:
        // number = favorList.filter(filterFunc).length;
        break;
      case BUSINESS_CARD_LIST.MY_LIST:
        number = myList.filter(filterFunc).length;
        listName = `${item.listName + translate(messages.copy)}(${number})`;
        navigation.navigate("business-card-create-my-list", {
          list: {
            ...item,
            listName,
          },
        });
        break;
      case BUSINESS_CARD_LIST.SHARED_LIST:
        number = sharedList.filter(filterFunc).length;
        listName = `${item.listName + translate(messages.copy)}(${number})`;
        navigation.navigate("business-card-create-shared-list", {
          list: {
            ...item,
            listName,
          },
        });
        break;
      default:
        break;
    }
  };

  const getCoppyName = (type: number, element: any) => {
    const filterFunc = (el: any) => {
      return (
        el.listName === element.listName ||
        el.listName.includes(`${element.listName}`)
      );
    };
    let no = 1;
    let listName;
    switch (type) {
      case 1:
        no = myList.filter(filterFunc).length;
        listName = `${element.listName + translate(messages.copy)}(${no})`;
        return listName;
      case 2:
        no = sharedList.filter(filterFunc).length;
        listName = `${element.listName + translate(messages.copy)}(${no})`;
        return listName;
      default:
        return;
    }
  };

  /**
   * delete list
   */
  const onDelete = async () => {
    const { listId } = elementSelected;
    if (typeof listId === "number") {
      const params = {
        idOfList: elementSelected.listId,
      };
      const response = await handleListBusinessCards(
        BUSINESS_CARD_API.deleteBusinessCardList,
        params,
        {}
      );
      if (response?.status == 200 && response?.data?.idOfList) {
        // do smt
      }
    }

    const filterFunc = (el: any) => {
      return el.listId !== elementSelected.listId;
    };
    switch (typeSelected) {
      case BUSINESS_CARD_LIST.FAVOR_LIST:
        setFavorList(favorList.filter(filterFunc));
        break;
      case BUSINESS_CARD_LIST.MY_LIST:
        setMyList(myList.filter(filterFunc));
        break;
      case BUSINESS_CARD_LIST.SHARED_LIST:
        setSharedList(sharedList.filter(filterFunc));
        break;
      default:
        break;
    }
    onToggleModal();
  };

  /**
   * change my list to shared list
   */

  const onChangeToSharedList = () => {
    setModalChangeToSharedList(!modalChangeToSharedList);
    updateBusinessCardsListFunc();
  };

  /**
   * call api refreshAutoList
   * @param element
   */

  const pressRefresh = async (element: any) => {
    const params = {
      idOfList: element.listId,
    };
    const response = await handleListBusinessCards(
      BUSINESS_CARD_API.refreshAutoList,
      params,
      {}
    );
    if (response?.status == 200 && response?.data?.idOfList) {
      // do smt
    }
  };

  const createList = (type: number) => {
    navigation.navigate(
      type === BUSINESS_CARD_LIST.MY_LIST
        ? "business-card-create-my-list"
        : "business-card-create-shared-list"
    );
  };
  const editList = (type: any, element: any) => {
    // dispatch(businessCardDrawerActions.toggleDrawerStatus({}));
    // dispatch(businessCardActions.getTabbar(!status));
    navigation.navigate(
      type === BUSINESS_CARD_LIST.MY_LIST
        ? "business-card-create-my-list"
        : "business-card-create-shared-list",
      { list: element, mode: "edit" }
    );
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
          {!!iconRight && (
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              onPress={() => createList(type)}
            >
              <Icon name={iconRight || TEXT_EMPTY} />
            </TouchableOpacity>
          )}
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
                typeSelected = type;
                elementSelected = element;
                setActive(type);
                setActiveLine(index);
                if (!editer) {
                  dispatch(
                    businessCardActions.saveDrawerListSelected({
                      selectedTargetType: type,
                      selectedTargetId: element.listId,
                      listMode: element.listMode,
                      displayOrderFavoriteList:
                        element.displayOrderFavoriteList,
                      listId: elementSelected.listId,
                      listName: getCoppyName(element.listType, element),
                      listCard: element,
                    })
                  );
                  dispatch(businessCardDrawerActions.toggleDrawerStatus({}));
                }
              }}
              disabled={disable}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.txtList,
                  disable && styles.txtDisable,
                  !disable &&
                    active === type &&
                    activeLine === index &&
                    styles.txtActive,
                ]}
              >
                {element.listName}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.right}>
            {!!iconRight && (
              <TouchableOpacity
                hitSlop={CommonStyles.hitSlop}
                disabled={editer}
                onPress={() => {
                  pressRefresh(element.listId);
                }}
              >
                <Icon name={iconRight || TEXT_EMPTY} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {editer &&
          type !== BUSINESS_CARD_LIST.FAVOR_LIST &&
          element.listMode === BUSINESS_CARD_LIST_MODE.handwork &&
          active === type &&
          activeLine === index && (
            <View style={styles.viewContainerButton}>
              <View style={styles.left} />
              <View style={styles.middle}>
                <View style={styles.viewButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      editList(type, element);
                    }}
                  >
                    <Text>{translate(messages.edit)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => copyList(type, element)}
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
          type === BUSINESS_CARD_LIST.MY_LIST &&
          element.listMode === BUSINESS_CARD_LIST_MODE.handwork &&
          active === type &&
          activeLine === index && (
            <View style={styles.viewContainerButton}>
              <View style={CommonStyles.flex1} />
              <View style={CommonStyles.flex9}>
                <View style={styles.viewButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onToggleModalChangeToSharedList}
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
          editer && type === BUSINESS_CARD_LIST.FAVOR_LIST,
          type === BUSINESS_CARD_LIST.FAVOR_LIST
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
              (editer && type === BUSINESS_CARD_LIST.FAVOR_LIST) ||
                (editer && el.listMode === BUSINESS_CARD_LIST_MODE.auto),
              el.listMode === BUSINESS_CARD_LIST_MODE.auto
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
      return el.listName.includes(text);
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
          setActive(BUSINESS_CARD_ACTIVE.receiveBusinessCard);
          dispatch(
            businessCardActions.saveDrawerListSelected({
              selectedTargetType: 1,
              selectedTargetId: null,
            })
          );
          dispatch(businessCardDrawerActions.toggleDrawerStatus({}));
        }}
      >
        <Text
          style={[
            styles.txt,
            editer && styles.txtDisable,
            active === BUSINESS_CARD_ACTIVE.receiveBusinessCard &&
              styles.txtActive,
          ]}
        >
          {translate(messages.receiveBusinessCard)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewLabel}
        disabled={editer}
        onPress={() => {
          setActive(BUSINESS_CARD_ACTIVE.allBusinessCard);
          dispatch(
            businessCardActions.saveDrawerListSelected({
              selectedTargetType: 0,
              selectedTargetId: null,
            })
          );
          dispatch(businessCardDrawerActions.toggleDrawerStatus({}));
        }}
      >
        <Text
          style={[
            styles.txt,
            editer && styles.txtDisable,
            active === BUSINESS_CARD_ACTIVE.allBusinessCard && styles.txtActive,
          ]}
        >
          {translate(messages.allBusinessCard)}
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
          BUSINESS_CARD_LIST.FAVOR_LIST,
          translate(messages.favorList),
          favorList
        )}
        {renderList(
          BUSINESS_CARD_LIST.MY_LIST,
          translate(messages.myList),
          myList
        )}
        {renderList(
          BUSINESS_CARD_LIST.SHARED_LIST,
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
          onPress={onDelete}
        />

        <ModalCancel
          visible={modalChangeToSharedList}
          closeModal={onToggleModalChangeToSharedList}
          titleModal={translate(messages.delete)}
          contentModal={translate(messages.confirmDelete)}
          textBtnLeft={translate(messages.cancel)}
          textBtnRight={translate(messages.confirm)}
          onPress={onChangeToSharedList}
        />
      </ScrollView>
    </View>
  );
};
