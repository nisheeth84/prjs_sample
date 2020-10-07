import * as React from "react";
import {
  Alert,
  Clipboard,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { ProductGeneralStyles } from "./product-general-style";
import { checkEmptyString, formatJaPrice } from "./utils";
import { appImages } from "../../config/constants";

import { CommonStyles } from "../../shared/common-style";
import { TEXT_EMPTY } from "../../config/constants/constants";
import { FIELD_NAME, LanguageCode } from "../../config/constants/enum";
import { customFieldsInfoSelector } from "./list/product-list-selector";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import StringUtils from "../../shared/util/string-utils";

const DUMMY_URL = "http://gateway-56161094.ap-northeast-1.elb.amazonaws.com";

interface ProductItemProps {
  // name
  productName: string;
  // unit price
  unitPrice: number;
  // image path
  productImagePath: string;
  // image name
  productCategoryName: string;
  // onclick
  onClick: Function;
  // is show share icon
  isShowShare?: boolean;
  // share data
  shareUrl?: string;
  // on click image
  onPressImg?: () => void;
  // number off line text
  numberOfLineProps?: number;
}

/**
 * Component for show product general info
 * name, price, image, category
 * @param props
 */
export const ProductGeneralInfo: React.FC<ProductItemProps> = ({
  productName,
  unitPrice,
  productImagePath,
  productCategoryName,
  onClick = () => {},
  isShowShare = false,
  shareUrl = TEXT_EMPTY,
  onPressImg = () => {},
  numberOfLineProps = 0,
}) => {
  const authState = useSelector(authorizationSelector);
  const customFieldsInfo = useSelector(customFieldsInfoSelector);
  const fieldInfo = customFieldsInfo.find(
    (el: any) => el.fieldName === FIELD_NAME.unitPrice
  );
  const currency = fieldInfo?.currencyUnit || "";
  const type = fieldInfo?.typeUnit || 0;

  const [pressIn, setPressIn] = React.useState(false);

  let categoryName = StringUtils.getFieldLabel(
    { productCategoryName },
    "productCategoryName",
    authState?.languageCode
  );

  /**
   * press share
   */
  const share = () => {
    const input = checkEmptyString(shareUrl) ? DUMMY_URL : shareUrl;
    Clipboard.setString(input);
    Alert.alert("The url has been copied to the clipboard");
  };

  /**
   * render label
   */
  const renderLabel = (
    input: string,
    styles: any,
    numberOfLine: number = 0
  ) => {
    if (numberOfLine) {
      return (
        <Text numberOfLines={numberOfLine} style={styles}>
          {input || TEXT_EMPTY}
        </Text>
      );
    }
    return <Text style={styles}>{input || TEXT_EMPTY}</Text>;
  };

  return (
    <View style={[ProductGeneralStyles.inforProduct]}>
      <TouchableOpacity
        style={[ProductGeneralStyles.inforProductRow, CommonStyles.flex1]}
        onPress={() => {
          onClick();
        }}
      >
        <TouchableOpacity onPress={() => onPressImg()}>
          <Image
            style={ProductGeneralStyles.image}
            source={
              !checkEmptyString(productImagePath)
                ? {
                    uri: productImagePath,
                  }
                : appImages.iconNoImage
            }
          />
        </TouchableOpacity>
        <View style={[ProductGeneralStyles.content, CommonStyles.flex1]}>
          {renderLabel(
            categoryName,
            ProductGeneralStyles.productCategory,
            numberOfLineProps
          )}
          {renderLabel(
            productName,
            ProductGeneralStyles.productName,
            numberOfLineProps
          )}
          {renderLabel(
            formatJaPrice(unitPrice, currency, type),
            ProductGeneralStyles.productPrice,
            numberOfLineProps
          )}
        </View>
      </TouchableOpacity>
      {isShowShare ? (
        <TouchableOpacity
          onPress={() => {
            share();
          }}
          onPressIn={() => setPressIn(true)}
          onPressOut={() => setPressIn(false)}
          delayPressOut={10}
          activeOpacity={1}
        >
          <Image
            resizeMode="contain"
            style={
              pressIn
                ? ProductGeneralStyles.topInfoIconShareActive
                : ProductGeneralStyles.topInfoIconShare
            }
            source={pressIn ? appImages.iconShareActive : appImages.iconShare}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};
