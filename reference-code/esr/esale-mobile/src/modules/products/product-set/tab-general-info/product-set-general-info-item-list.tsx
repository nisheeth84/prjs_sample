import * as React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { StackActions, useNavigation } from "@react-navigation/native";
import { checkEmptyString } from "../../utils";
import { ProductDetailSetInclude } from "../../products-repository";
import { ScreenName } from "../../../../config/constants/screen-name";
import { CommonStyles } from "../../../../shared/common-style";
import { useSelector } from "react-redux";
import { productSetDetailSetIncludeSelector } from "../product-set-details-selector";

interface ProductSetGeneralInfoItemListProps {
  //Label
  label: string;
  //Color of Value text
  colorValue: string;
  //List Product Set
  data?: Array<ProductDetailSetInclude>;
}

/**
 * Component show product set general information item with list input
 * @param props
 */

export const ProductSetGeneralInfoItemList: React.FC<ProductSetGeneralInfoItemListProps> = ({
  label,
  colorValue,
  data = [],
}) => {
  const navigation = useNavigation();
  var dataString = data.reduce((prevVal, currVal, idx) => {
    return idx == 0
      ? prevVal + currVal.productName
      : prevVal + ", " + currVal.productName;
  }, "");

  /*
   * Navigate to Product Set Details Screen
   */
  const onClickItem = (id: number) => {
    let pushAction = StackActions.push(ScreenName.PRODUCT_SET_DETAIL, {
      productSetId: id,
    });
    navigation.dispatch(pushAction);
  };

  return (
    <TouchableOpacity style={ProductSetDetailsStyles.generalInfoItem}>
      <View style={ProductSetDetailsStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[ProductSetDetailsStyles.bold]}>
            {checkEmptyString(label) ? "" : label}
          </Text>
          <Text>
            {data &&
              data.map((productSet: ProductDetailSetInclude, index: number) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onClickItem(productSet.productId);
                    }}
                    key={productSet?.productId?.toString()}
                  >
                    <Text
                      style={[
                        ProductSetDetailsStyles.gray,
                        { color: colorValue },
                      ]}
                    >
                      {dataString}
                    </Text>
                  </TouchableWithoutFeedback>
                );
              })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
