import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { ProductListItemStyles } from "./product-list-style";
import { ProductGeneralInfo } from "../product-general-info";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../config/constants/screen-name";
import { useDispatch } from "react-redux";
import { productActions } from "./product-list-reducer";

interface ProductItem {
  title: string;
  type: string;
}
interface ProductItemProps {
  productName: string;
  unitPrice: number;
  productImagePath: string;
  productCategoryName: string;
  productId: number;
  isSet?: boolean;
}

/**
 * Component show product item
 * @param props
 */

export const ProductItem: React.FC<ProductItemProps> = ({
  // product name
  productName,
  // unit price
  unitPrice,
  // image path
  productImagePath,
  //category
  productCategoryName,
  //productId - key in list
  productId,
  // isSet
  isSet,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  /*
   * Navigate to Product Details Screen
   */
  const onClickItem = () => {
    if (isSet) {
      navigation.navigate(ScreenName.PRODUCT_SET_DETAIL, {
        productSetId: productId,
      });
    } else {
      navigation.navigate(ScreenName.PRODUCT_DETAIL, { productId: productId });
    }
    dispatch(productActions.setproductID(productId));
  };

  return (
    <TouchableOpacity
      style={ProductListItemStyles.inforProduct}
      onPress={onClickItem}
    >
      <View style={ProductListItemStyles.inforProductRow}>
        <ProductGeneralInfo
          productName={productName}
          unitPrice={unitPrice}
          productImagePath={productImagePath}
          productCategoryName={productCategoryName}
          onClick={onClickItem}
          numberOfLineProps={1}
        />

        <Icon name="arrowRight" />

      </View>
    </TouchableOpacity>
  );
};
