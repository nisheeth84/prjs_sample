import * as React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { StackActions, useNavigation } from "@react-navigation/native";
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
  // productSet's Id
  productSetId: number
}

/**
 * Component show product set include item
 * @param props 
 */

export const ProductSetSetIncludeItem: React.FC<ProductSetIncludeItemProps> = ({
  productImagePath,
  productName,
  unitPrice,
  productSetId
}) => {

  const navigation = useNavigation();

  /*
  * Navigate to Product Set Details Screen 
  */
  const onClickItem = () => {
    let pushAction = StackActions.push(ScreenName.PRODUCT_SET_DETAIL, { productSetId: productSetId });
    navigation.dispatch(pushAction);
  }

  return (
    <TouchableOpacity style={ProductSetDetailsStyles.inforProductSetInClude} >
      <View style={ProductSetDetailsStyles.rowCenter}>

        {
          !checkEmptyString(productImagePath) ?
            <Image
              style={ProductSetDetailsStyles.image}
              source={{
                uri: productImagePath
              }}
            />
            :
            <Image
              style={ProductSetDetailsStyles.image}
              source={appImages.iconCart2}
            />
        }

        <View style={[ProductSetDetailsStyles.inforProductSetInCludeText, { justifyContent: "center" }]}>
          <TouchableOpacity onPress={onClickItem}>
            <Text style={ProductSetDetailsStyles.productName}>{productName}</Text>
          </TouchableOpacity>

          <Text style={ProductSetDetailsStyles.productPrice}>
            {getJapanPrice(unitPrice)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
