import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AppbarCommonProduct } from "../../../shared/components/appbar/appbar-common-product";
import { translate } from "../../../config/i18n";
import { SortProductStyle } from "./popup-sort-styles";
import { ConditionSelect } from "./popup-sort-choose-condition";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../config/constants";
import { OrderSelect } from "./popup-sort-order-select";
import { Input } from "../../../shared/components/input";
import { Icon } from "../../../shared/components/icon";
import { messages } from "./popup-sort-messages";
// import { getProducts, ProductResponse } from "../products-repository";
// import { queryProducts } from "../product-query";
import { productActions } from "../list/product-list-reducer";
import { orderSortSelector, categorySortSelector } from "./popup-sort-selector";
import { popupSortActions } from "./popup-sort-reducer";
import { CommonStyles } from "../../../shared/common-style";
import { SortType } from "../../../config/constants/enum";

const typeValues = ["product_name", "unit_price", "product_category_id"];

export function SortSelectionScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orderProps = useSelector(orderSortSelector);
  const sortByProps = useSelector(categorySortSelector);
  const [activeOrder, setActiveOrder] = useState(orderProps);
  const [sortBy, setSortBy] = useState(sortByProps);
  // const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setActiveOrder(orderProps);
    setSortBy(sortByProps);
  }, [orderProps, sortByProps]);

  /**
   * handle select order
   * @param orderType
   */
  const handleSelectOrder = (orderType: string) => {
    setActiveOrder(orderType);
  };

  /**
   * handle select type
   * @param orderType
   */
  const handleSelectCondition = (sortType: string) => {
    setSortBy(sortType);
  };

  /**
   * Dispatch sort condition to list
   */
  const sortProducts = async () => {
    dispatch(
      popupSortActions.updateSortCondition({
        order: activeOrder,
        category: sortBy,
      })
    );
    dispatch(productActions.setIsSet(true));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={SortProductStyle.container}>
      <AppbarCommonProduct
        title={`${translate(messages.sortTitle)}`}
        buttonText={`${translate(messages.applyConditions)}`}
        buttonType="complete"
        onPress={() => sortProducts()}
        leftIcon="md-close"
      />
      <View style={[CommonStyles.flex1, CommonStyles.bgWhite]}>
        <View
          style={[
            SortProductStyle.spacePadding,
            SortProductStyle.rowView,
            CommonStyles.width100,
          ]}
        >
          <View>
            <Text style={SortProductStyle.bold}>{`${translate(
              messages.sortOrder
            )}`}</Text>
          </View>
          <View style={CommonStyles.row}>
            <OrderSelect
              active={activeOrder === SortType.ASC}
              text={`${translate(messages.ascendingSort)}`}
              iconName="ios-arrow-round-up"
              textStyle={[SortProductStyle.bold]}
              containerStyle={[SortProductStyle.orderSelect]}
              iconViewStyle={[SortProductStyle.iconContainer]}
              handleChooseOrder={() => handleSelectOrder(SortType.ASC)}
            />
            <OrderSelect
              active={activeOrder === SortType.DESC}
              text={`${translate(messages.descendingSort)}`}
              iconName="ios-arrow-round-down"
              textStyle={[SortProductStyle.bold]}
              containerStyle={[SortProductStyle.orderSelect]}
              iconViewStyle={[SortProductStyle.iconContainer]}
              handleChooseOrder={() => handleSelectOrder(SortType.DESC)}
            />
          </View>
        </View>
        <View style={[SortProductStyle.searchBg]} />
        <ConditionSelect
          text={`${translate(messages.productNameSort)}`}
          active={sortBy === typeValues[0]}
          handleSelectCondition={() => handleSelectCondition(typeValues[0])}
        />
        <ConditionSelect
          text={`${translate(messages.unitSort)}`}
          active={sortBy === typeValues[1]}
          handleSelectCondition={() => handleSelectCondition(typeValues[1])}
        />
        <ConditionSelect
          text={`${translate(messages.categorySort)}`}
          active={sortBy === typeValues[2]}
          handleSelectCondition={() => handleSelectCondition(typeValues[2])}
        />
      </View>
    </SafeAreaView>
  );
}
