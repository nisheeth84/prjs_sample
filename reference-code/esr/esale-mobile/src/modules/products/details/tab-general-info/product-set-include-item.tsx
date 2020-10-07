import * as React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { ProductDetailsStyles } from "../product-details-style";
import { useNavigation } from "@react-navigation/native";
import { getJapanPrice, checkEmptyString } from "../../utils";
import { appImages } from "../../../../config/constants";
import { ScreenName } from "../../../../config/constants/screen-name";

interface ProductSetIncludeItemProps {
  // image path
  productImagePath: string;
  // product's name
  productName: string;
  // product's price
  unitPrice: number;
  //productSetId
  productSetId: number;
}

/**
 * Component show product trading item
 * @param props
 */

export const ProductSetIncludeItem: React.FC<ProductSetIncludeItemProps> = ({
  productSetId,
  productImagePath,
  productName,
  unitPrice,
}) => {
  const navigation = useNavigation();

  /*
   * Navigate to Product Set Details Screen
   */
  const onClickItem = () => {
    navigation.navigate(ScreenName.PRODUCT_SET_DETAIL, {
      productSetId: productSetId,
    });
  };

  return (
    <TouchableOpacity style={ProductDetailsStyles.inforProductSetInClude}>
      <View style={ProductDetailsStyles.rowCenter}>
        <Image
          style={ProductDetailsStyles.image}
          source={
            !checkEmptyString(productImagePath)
              ? {
                  uri: productImagePath,
                }
              : appImages.iconNoImage
          }
        />

        <View
          style={[
            ProductDetailsStyles.inforProductSetInCludeText,
            { justifyContent: "center" },
          ]}
        >
          <TouchableOpacity onPress={onClickItem}>
            <Text
              style={[
                ProductDetailsStyles.productName,
                ProductDetailsStyles.blueName,
                ProductDetailsStyles.flexWrap,
              ]}
            >
              {productName}
            </Text>
          </TouchableOpacity>

          <Text style={ProductDetailsStyles.productPrice}>
            {getJapanPrice(unitPrice, false)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
