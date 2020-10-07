import React, { useState, useEffect } from 'react'
import { Alert as ShowError, Text, View, Animated, Dimensions } from "react-native"
import DrawerLeftStyles from "./drawer-left-style"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon } from "../../../shared/components/icon"
import { translate } from "../../../config/i18n"
import { messages } from "./drawer-left-activity-messages"
import { BusinessCard } from "./drawer-left-activity-reducer"
import { getProductTradings, getCustomers, getBusinessCards, BusinessCardItem, customerItem } from "./drawer-activity-repository"
import { GetActivitiesParams } from "../activity-repository"
import { StackScreen, SelectionListInDrawerType } from "../constants"
import { useNavigation } from '@react-navigation/native'

interface Props {
  isShow: boolean
  listItem: Array<any>
  menuTitle: string
  handleShowList: () => void
}

export const SelectionListInDrawer: React.FC<Props> = (props) => {
  const [list, setList] = useState<any>([])
  useEffect(() => {
    if (props.menuTitle !== SelectionListInDrawerType.CUSTOMER) {
      let lst = props?.listItem.filter(item => item.displayOrderOfFavoriteList)
      setList(lst)
    } else {
      setList(props?.listItem)
    }
  },[props])

  const navigation = useNavigation()
  const [selectedItem, setSelectedItem] = useState(
    {
      menuName: "",
      itemId: null
    })
  const onSelectItem = (itemId?: any) => {
    setSelectedItem({ menuName: props.menuTitle, itemId })
  }
  const [isFetching, setIsFetching] = useState(false)
  const [parrentX] = useState(new Animated.Value(0));
  const { width } = Dimensions.get("window");
  const xTranslate = width - 50;
  const [subX] = useState(new Animated.Value(xTranslate));
  /**
   * Call API getProductTradings
   * @param selectedTargetId
   */
  const fetchListProductTradingId = async (selectedTargetId: number) => {
    let listId: Array<number> = []
    try {
      setIsFetching(true)
      const response = await getProductTradings({ selectedTargetId: selectedTargetId })
      if (response) {
        setIsFetching(false)
        if (response.status === 200 && response?.data?.productTradings?.length > 0) {
          response?.data?.productTradings?.forEach((item) => listId.push(item?.productTradingId))
        }
      }
    } catch (e) {
      setIsFetching(false)
      ShowError.alert("Message", e.message || e)
    }
    return listId
  }
  /**
   * Call API getCustomers
   * @param selectedTargetId
   */
  const fetchListBusinessCardId = async (selectedTargetId: number) => {
    let listId: Array<number> = []
    try {
      const getBusinessCardsResponse = await getBusinessCards({ selectedTargetId: selectedTargetId })
      if (getBusinessCardsResponse?.status === 200) {
        setIsFetching(false)
        if (getBusinessCardsResponse?.data?.businessCards?.length > 0) {
          getBusinessCardsResponse.data.businessCards.forEach((item: BusinessCardItem) => listId.push(item?.businessCardId))
        }
      }
    }
    catch (error) {
      setIsFetching(false)
      ShowError.alert('Message', error.message)
    }
    return listId
  }

  /**
 * Call API getCustomers
 * @param selectedTargetId
 */
  const fetchListCustomersId = async (selectedTargetId: number) => {
    let listId: Array<number> = []
    try {
      const getCustomersResponse = await getCustomers({ selectedTargetId: selectedTargetId })
      if (getCustomersResponse?.status === 200) {
        setIsFetching(false)
        if (getCustomersResponse?.data?.customers.length === 0) {
          listId = []
        } else {
          getCustomersResponse?.data?.customers.forEach((item: customerItem) => listId.push(item?.customerId))
        }
      }
    }
    catch (error) {
      ShowError.alert('Message', error.message)
    }
    return listId
  }


  const onNavigate = async (listId?: any) => {
    const params: GetActivitiesParams = {}
    if (props?.menuTitle === SelectionListInDrawerType.PRODUCT_TRADING) {
      const getListProductTradingIdResponse = await fetchListProductTradingId(listId)
      params.listProductTradingId = getListProductTradingIdResponse
      params.selectedTargetType = 5
      params.selectedTargetId = listId
    } else if (props?.menuTitle === SelectionListInDrawerType.BUSINESS_CARD) {
      const listBusinessCardId = await fetchListBusinessCardId(listId)
      params.listBusinessCardId = listBusinessCardId
      params.selectedTargetType = 4
      params.selectedTargetId = listId
    } else if (props?.menuTitle === SelectionListInDrawerType.CUSTOMER) {
      const getListCustomersIdResponse = await fetchListCustomersId(listId)
      params.listCustomerId = getListCustomersIdResponse
      params.selectedTargetType = 3
      params.selectedTargetId = listId
    } else {
      params.selectedTargetType = 0
      params.selectedTargetId = 0
    }
    navigation.navigate(StackScreen.DRAWER_ACTIVITY, {
      screen: StackScreen.ACTIVITY_LIST,
      params: {
        filterListParams: params
      }
    })
  }

   /**
   * run slide animation when press categoty
   *
   */
  const animationSlide = () => {
    Animated.parallel([
      Animated.timing(parrentX, {
        toValue: -xTranslate,
        duration: 500,
      }),
      Animated.timing(subX, {
        toValue: 0,
        duration: 500,
      }),
    ]).start(() => {
      parrentX.setValue(0);
      subX.setValue(xTranslate);
    });
  };
  return (
    <View style={[DrawerLeftStyles.boxHeaderOther]}>
      <TouchableOpacity onPress={props?.handleShowList} style={DrawerLeftStyles.dropdownHeader}>
        <View style={DrawerLeftStyles.headerArrow}>
          <Icon name={props?.isShow ? "arrowDown" : "arrowUp"} style={DrawerLeftStyles.iconUpDown} />
          <Text style={[DrawerLeftStyles.textHeader, DrawerLeftStyles.textFontSize, DrawerLeftStyles.textLeft,]}>
            {translate(messages[`${props?.menuTitle}`])}
          </Text>
        </View>
      </TouchableOpacity>
      {props?.isShow && props?.listItem?.length > 0 && (
        <View style={DrawerLeftStyles.boxText}>
          {list.map((item: BusinessCard, index: number) => {
            const addedStyle = selectedItem.menuName === props?.menuTitle && item?.listId === selectedItem?.itemId && DrawerLeftStyles.hasSelected
            return (
              <TouchableOpacity disabled={isFetching} key={index} onPress={() => {
                onSelectItem(item?.listId)
                onNavigate(item?.listId)
                animationSlide();
              }}>
                <Text style={[DrawerLeftStyles.boxTextTitle, DrawerLeftStyles.textFontSize, addedStyle]} numberOfLines={1} ellipsizeMode={'tail'}>
                  {item.listName}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}