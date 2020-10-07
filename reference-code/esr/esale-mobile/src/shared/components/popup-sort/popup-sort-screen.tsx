import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { translate } from "../../../config/i18n";
import { PopupSortStyle } from "./popup-sort-styles";
import { ConditionSelect } from "./condition-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderSelect } from "./order-select";
import { messages } from "./popup-sort-messages";
import { CommonStyles } from "../../../shared/common-style";
import { Header } from "../../../shared/components/header";
import { theme } from "../../../config/constants";
import { ScrollView } from "react-native-gesture-handler";
import { commonPopupSortActions } from "./popup-sort-reducer";
import { useDispatch, useSelector } from "react-redux";
import { resultSortSelector } from "./popup-sort-selector";
import _ from "lodash";

const orderValues = ["ASC", "DESC"];

interface Sort {
  key: any;
  fieldType: any;
  name: string;
}

/**
 * Component show sort screen
 */
export const PopupSortScreen = () => {

  const route = useRoute<any>();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [activeOrder, setActiveOrder] = useState(orderValues[0]);
  const [sortBy, setSortBy] = useState(0);
  const [typeValues, setTypeValue] = useState<Array<Sort>>([]);
  let result = useSelector(resultSortSelector);

  useEffect(() => {
    if (!_.isEmpty(result?.value)) {
      setActiveOrder(result?.value);
    }
  }, [result]);

  useEffect(() => {
    if (route?.params?.data) {
      setTypeValue(route?.params?.data);
      for (let count = 0; count < route.params.data.length; count++) {
        if (route?.params?.data[count].key === result?.key) {
          setSortBy(count);
          break;
        }
      }
      // route?.params?.data.forEach((value: any, key: number) =>
      //   value.key === result.key ? setSortBy(key) : {}
      // )
    }
  }, [route?.params?.data])

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
  const handleSelectCondition = (sortType: number) => {
    setSortBy(sortType);
  };

  /**
   * Dispatch sort condition to list
   */
  const applySort = async () => {
    dispatch(commonPopupSortActions.updateSortCondition({
      screenName: route?.params?.screenName,
      result: {
        ...typeValues[sortBy],
        value: activeOrder
      }
    }))
    navigation.goBack();
  };

  return (
    <SafeAreaView style={PopupSortStyle.container}>
      <Header
        title={translate(messages.sortTitle)}
        titleSize={theme.fontSizes[4]}
        nameButton={translate(messages.applyConditions)}
        onLeftPress={() => {
          navigation.goBack();
        }}
        onRightPress={() => applySort()}
        containerStyle={PopupSortStyle.header}
        textBold={true}
      />

      <View style={[CommonStyles.flex1, CommonStyles.bgWhite]}>
        <View
          style={[
            PopupSortStyle.spacePadding,
            PopupSortStyle.rowView,
            CommonStyles.width100,
          ]}
        >
          <View>
            <Text style={PopupSortStyle.bold}>{`${translate(
              messages.sortOrder
            )}`}</Text>
          </View>
          <View style={CommonStyles.row}>
            <OrderSelect
              active={activeOrder === orderValues[0]}
              text={`${translate(messages.ascendingSort)}`}
              iconName="ios-arrow-round-up"
              textStyle={[PopupSortStyle.bold]}
              containerStyle={[PopupSortStyle.orderSelect]}
              iconViewStyle={[PopupSortStyle.iconContainer]}
              handleChooseOrder={() => handleSelectOrder(orderValues[0])}
            />
            <OrderSelect
              active={activeOrder === orderValues[1]}
              text={`${translate(messages.descendingSort)}`}
              iconName="ios-arrow-round-down"
              textStyle={[PopupSortStyle.bold]}
              containerStyle={[PopupSortStyle.orderSelect]}
              iconViewStyle={[PopupSortStyle.iconContainer]}
              handleChooseOrder={() => handleSelectOrder(orderValues[1])}
            />
          </View>
        </View>
        <View
          style={[PopupSortStyle.spacePadding, PopupSortStyle.searchBg]}
        />
        <ScrollView>
          {
            (typeValues || []).map((type, index) => {
              return (
                <ConditionSelect
                  text={type.name}
                  active={sortBy === index}
                  handleSelectCondition={() => handleSelectCondition(index)}
                />
              )
            })
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
