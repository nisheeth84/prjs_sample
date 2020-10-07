

import React from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import { CommonStyles, listProductStyles } from "./styles";
import { Icon } from "../../../shared/components/icon";
import { CheckBox } from "../../../shared/components/checkbox";
import { theme } from "../../../config/constants";
import { messages } from "./product-trading-item-messages";
import { translate } from "../../../config/i18n";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { formatLabel, formatDate, getJapanPrice, getFirstItem } from "../../../shared/util/app-utils";
import { useSelector, useDispatch } from "react-redux";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../config/constants/screen-name";
import { AuthorizationState } from "../../../modules/login/authorization/authorization-reducer";
import { authorizationSelector } from "../../../modules/login/authorization/authorization-selector";
import { ProductTrading } from "../../../modules/products-manage/product-type";
import { customerDetailActions } from "../../../modules/customer/detail/customer-detail-reducer";

const ActivityMode = {
  REGISTER: 1,
  EDIT: 2
}

export interface ProductsProps {
  item: ProductTrading;
  edit?: boolean;
  onCheck?: Function;
  fieldInfoArr?: any[];
  index?: number;
}

/**
  * render product trading
  * @param item
  */
export const ProductTradingItem: React.FC<ProductsProps> = ({
  item,
  edit = false,
  onCheck = () => { },
  fieldInfoArr = [],
  index = 0
}) => {

  const authState: AuthorizationState = useSelector(authorizationSelector);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const itemLabel = {
    amount: "amount",
    endPlanDate: "end_plan_date",
  }

  /**
   * check color of element
   * @param element 
   * @param label 
   */
  const checkColor = (element: any, label: string) => {
    if (!element.productTradingHistory) {
      return
    }

    let field = getFirstItem(fieldInfoArr.filter((fieldInfo: any) => {
      return fieldInfo.fieldName === label;
    }));

    if (!!field?.forwardColor &&
      !!field?.forwardText &&
      !!field?.backwardColor &&
      !!field?.backwardText
    ) {
      if (field.isDefault) {
        if (element[label] > element?.productTradingHistory[label]) {
          return field.forwardColor
        }
        if (element[label] < element?.productTradingHistory[label]) {
          return field.backwardColor
        }
      } else {
        if (element.productTradingData[label] > element?.productTradingHistory.productTradingData[label]) {
          return field.forwardColor
        }
        if (element.productTradingData[label] > element?.productTradingHistory.productTradingData[label]) {
          return field.backwardColor
        }
      }
    }
    return
  }

  const renderRightActions = (
    _progress: any,
    dragX: {
      interpolate: (arg0: {
        inputRange: number[];
        outputRange: number[];
      }) => any;
    }
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0, 0, 0],
      outputRange: [0, 0, 0, 1],
    });

    const transIos = dragX.interpolate({
      inputRange: [0, 1, 100, 100],
      outputRange: [0, 0, 30, 100],
    });
    return (
      <View
        style={
          [edit
            ? listProductStyles.viewSwipe
            : listProductStyles.viewSwipenull,
          ]
        }
      >
        <Animated.View
          style={[
            listProductStyles.btnSwipe,
            {
              transform: [{ translateX: Platform.OS === 'ios' ?  transIos : trans }],
            },
          ]}
        >
          <TouchableOpacity style={listProductStyles.btnDrop}
            onPress={() => {
              navigation.navigate(ScreenName.REGISTER_ACTIVITY,
                {
                  mode: ActivityMode.REGISTER,
                  customerId: item.customerId
                })
            }}
          >
            <Text style={listProductStyles.textBtn}>
              {translate(messages.productRegisterActivity)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={listProductStyles.btnDrop}
            onPress={() => {
              navigation.navigate(ScreenName.REGISTER_SALE)
            }}
          >
            <Text style={listProductStyles.textBtn}>
              {translate(messages.productRegisterInterest)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={listProductStyles.btnDrop}
            onPress={() => {
              navigation.navigate(ScreenName.REGISTER_TASK)
            }}
          >
            <Text style={listProductStyles.textBtn}>
              {translate(messages.productRegisterTask)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={listProductStyles.btnDrop}
            onPress={() => {
              navigation.navigate(ScreenName.REGISTER_SCHEDULE)
            }}
          >
            <Text style={listProductStyles.textBtn}>
              {translate(messages.productRegisterSchedule)}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[
          listProductStyles.containerProduct,
          CommonStyles.boxRowSpaceBetween,
        ]}
        onPress={() => {
          navigation.navigate(ScreenName.PRODUCT_TRADING_DETAIL, { data: item })
        }}
      >
        <View style={listProductStyles.boxText}>
          <View style={listProductStyles.txtProductNameBoxContainer}>
            <Text style={listProductStyles.txtCustomerName}
              onPress={() => {
                if (item?.customerId) {
                  let paramCustomer = {
                    customerId: item?.customerId,
                    customerName: item?.customerName,
                  };
                  dispatch(customerDetailActions.addCustomerIdNavigation(item?.customerId));
                  navigation.navigate(ScreenName.CUSTOMER_DETAIL, paramCustomer);
                }
              }}
            >
              {`${item.customerName || TEXT_EMPTY}`}
            </Text>
            <Text style={listProductStyles.txtProgressName}>
              {`${formatLabel(item.progressName)}`}
            </Text>
          </View>
          <Text style={listProductStyles.txtProductName}>
            {`${item.productName || TEXT_EMPTY}`}
          </Text>
          <Text style={[listProductStyles.txtProductsInfo,
          checkColor(item, itemLabel.amount)
            ? { color: checkColor(item, itemLabel.amount) }
            : {}
          ]}>
            {`${translate(messages.productsManageAmount)}:  ${getJapanPrice(item.amount, false, true)}`}
          </Text>
          <Text>
            <Text style={[listProductStyles.txtProductsInfo]}>
              {`${translate(messages.productsManageResponsible)}: `}
            </Text>
            <Text
              onPress={() => {
                if (item?.employee?.employeeId) {
                  navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
                    id: item?.employee?.employeeId,
                    title: item?.employee?.employeeName
                  })
                }
              }}
              style={[listProductStyles.txtProductsInfo, listProductStyles.txtLink]}>
              {`${item?.employee?.employeeName || TEXT_EMPTY}`}
            </Text>
          </Text>
          <Text style={[listProductStyles.txtProductsInfo,
          checkColor(item, itemLabel.amount)
            ? { color: checkColor(item, itemLabel.endPlanDate) }
            : {}
          ]}>
            {`${translate(messages.productsManageCompletionDate)}: ${
              formatDate(item.endPlanDate, authState.formatDate)
              }`}
          </Text>
        </View>
        {edit ? (
          <CheckBox
            checked={item.check}
            square={false}
            onChange={() => onCheck(item, index)}
            containerCheckBox={listProductStyles.iconArrow}
            checkBoxStyle={{
              borderColor: item.check
                ? theme.colors.blue200
                : theme.colors.gray200,
            }}
          />
        ) : (
            <TouchableOpacity onPress={() => {
              navigation.navigate(ScreenName.PRODUCT_TRADING_DETAIL, { data: item })
            }}>
              <Icon name="arrowRight" style={listProductStyles.iconArrow} />
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    </Swipeable>
  );
};