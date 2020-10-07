import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./trading-products-style";
import { DUMMY_DATA } from "./trading-products-dummy";
import { messages } from "./trading-products-messages";
import { translate } from "../../../../config/i18n";
import {
  getTradingProducts,
  getProductTradingIds,
} from "./trading-production-repository";
import { TradingActions } from "./trading-products-reducer";
import { BusinessCardDetailState } from "./trading-production-selector";
import { CommonStyles } from "../../../../shared/common-style";
import { Icon } from "../../../../shared/components/icon";
import { ListEmptyComponent } from "../../../../shared/components/list-empty/list-empty";
import { ON_END_REACHED_THRESHOLD } from "../../../../config/constants/constants";
import { AppIndicator } from "../../../../shared/components/app-indicator/app-indicator";

interface ProductItemProps {
  productName: string;
  onClick: Function;
}

let page = 0;
let productTradingIds: any[] = [];

/**
 * Component for show product general info
 * name, price, image, category
 * @param props
 */

export const TradingProduction: React.FC<ProductItemProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const listTradingProducts = useSelector(BusinessCardDetailState);

  /**
   * call api getProductTradingIds
   */
  const getProductTradingIdsFunc = async () => {
    const { businessCardId }: any = route.params;
    const param = {
      businessCardIds: [businessCardId],
    };
    const dataResponse = await getProductTradingIds(param);
    if (dataResponse) {
      switch (dataResponse.status) {
        case 200:
          productTradingIds = dataResponse.data.productTradingIds;
          getTradingProductsNavigation();
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  /**
   * call api getProductTradingTab
   */
  const getTradingProductsNavigation = async () => {
    const param = {
      tabBelong: 4,
      offset: page * 30,
      limit: 30,
      searchConditions: [
        {
          fieldType: 3,
          fieldName: "product_trading_id",
          fieldValue: JSON.stringify(productTradingIds),
        },
      ],
    };
    const dataResponse = await getTradingProducts(param);
    if (dataResponse) {
      if (refreshing) setRefreshing(false);
      if (load) setLoad(false);
      switch (dataResponse.status) {
        case 200:
          dispatch(
            TradingActions.getDataTradingProducts(dataResponse.data.dataInfo)
          );
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    dispatch(TradingActions.getDataTradingProducts(DUMMY_DATA.dataInfo));
    getProductTradingIdsFunc();
  }, []);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.nameItem}>{item.customerName}</Text>
          <Text style={styles.txtItem}>
            {`${translate(messages.completionDate)}：${
              item.estimatedCompletionDate
            }`}
          </Text>
          <Text style={styles.txtItem}>
            {`${translate(messages.progress)}：${item.progressName}`}
          </Text>
          <Text style={styles.txtItem}>
            {`${translate(
              messages.amountMoney
            )}: ${item.price
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}${messages.yen}
              `}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("trading-products-detail", { data: item })
          }
          style={styles.itemIcon}
        >
          <Icon name="arrowRight" style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    page = 0;
    setRefreshing(true);
    dispatch(TradingActions.refreshList({}));
    getTradingProductsNavigation();
  };

  const onEndReached = () => {
    if (!load) {
      page += 1;
      setLoad(true);
      getTradingProductsNavigation();
      // async function getListNotifications() {
      //   const params = {
      //     employeeId,
      //     limit: 2,
      //     textSearch: "",
      //   };
      //   const notificationResponse = await getNotifications(
      //     queryNotifications(params),
      //     {}
      //   );
      //   // if (notificationResponse) {
      //   //   handleError(notificationResponse);
      //   // }
      // }
      // setTimeout(() => {
      //   setLoad(false);
      // }, 1000);
      // getListNotifications();
    }
  };
  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };
  return (
    <ScrollView style={CommonStyles.flex1}>
      <View style={styles.price}>
        <Text style={styles.txtPrice}>
          {`${translate(messages.price)}：${messages.yen}`}
        </Text>
      </View>
      <FlatList
        keyExtractor={(_item, index) => index.toString()}
        // extraData={listTradingProducts.length}
        data={listTradingProducts}
        renderItem={(i) => renderItem(i.item)}
        ListEmptyComponent={renderListEmptyComponent}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <AppIndicator style={CommonStyles.backgroundTransparent} />
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </ScrollView>
  );
};
