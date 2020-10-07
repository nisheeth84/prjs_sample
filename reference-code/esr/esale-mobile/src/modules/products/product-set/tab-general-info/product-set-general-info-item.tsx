import * as React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { checkEmptyString } from "../../utils";
import { CommonStyles } from "../../../../shared/common-style";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../config/constants/screen-name";
import { theme } from "../../../../config/constants";

interface ProductSetGeneralInfoItemProps {
  //Label
  label: string;
  //Value
  value: string;
  //Color of Value text
  colorValue: string;
  // onPress
  onPress?: () => void;
  // productSets
  productSets: any[];
  // isLink
  isLink?: boolean;
}

/**
 * Component show product set general information item
 * @param props
 */

export const ProductSetGeneralInfoItem: React.FC<ProductSetGeneralInfoItemProps> = ({
  label,
  value,
  colorValue,
  onPress = () => {},
  productSets = [],
  isLink = false,
}) => {
  const navigation = useNavigation();
  const data = productSets.filter((el) => el.productName);

  const onPressSet = (item: any) => {
    navigation.navigate(ScreenName.PRODUCT_DETAIL, {
      productId: item.productId,
    });
  };

  if (data.length > 0) {
    return (
      <View style={ProductSetDetailsStyles.generalInfoItem}>
        <View style={ProductSetDetailsStyles.row}>
          <View style={CommonStyles.flex1}>
            <Text style={[ProductSetDetailsStyles.itemTitle]}>
              {checkEmptyString(label) ? "" : label}
            </Text>
            <Text>
              {data.map((item, index) => {
                return (
                  <Text
                    style={[
                      ProductSetDetailsStyles.gray,
                      { color: theme.colors.blue200 },
                    ]}
                    onPress={() => onPressSet(item)}
                  >
                    {!checkEmptyString(item?.productName) && item.productName}
                    {index !== data.length - 1 && ", "}
                  </Text>
                );
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={ProductSetDetailsStyles.generalInfoItem}
    >
      <View style={ProductSetDetailsStyles.row}>
        <View>
          <Text style={[ProductSetDetailsStyles.itemTitle]}>
            {checkEmptyString(label) ? "" : label}
          </Text>
          {
            isLink ?
              <TouchableOpacity onPress={() => { onPress() }}>
                <Text
                  style={[ProductSetDetailsStyles.gray, { color: theme.colors.blue200 }]}>
                  {value || ""}
                </Text>
              </TouchableOpacity>
              :
              <Text style={[ProductSetDetailsStyles.gray, { color: colorValue }]}>
                {value || ""}
              </Text>
          }
        </View>
      </View>
    </View>
  );
};
