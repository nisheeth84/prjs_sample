import * as React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ProductDetailsStyles } from "../product-details-style";
import { checkEmptyString } from "../../utils";
import { CommonStyles } from "../../../../shared/common-style";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import { theme } from "../../../../config/constants";

interface ProductItemProps {
  //Label
  label: string;
  //Value
  value: string;
  //Color of Value text
  colorValue: string;
  // On press item
  onPress?: () => void;
  // check is link
  isLink?: boolean;
}

/**
 * Component show product general information item
 * @param props
 */
export const ProductGeneralInfoItem: React.FC<ProductItemProps> = ({
  label,
  value,
  colorValue,
  onPress = () => { },
  isLink = false,
}) => {
  return (
    <View
      style={ProductDetailsStyles.generalInfoItem}
    >
      <View style={ProductDetailsStyles.row}>
        <View style={CommonStyles.flex1}>
          <Text style={[ProductDetailsStyles.itemTitle]}>{label || TEXT_EMPTY}</Text>
          {
            isLink ?
              <TouchableOpacity onPress={() => { onPress() }}>
                <Text
                  style={[ProductDetailsStyles.gray, { color: theme.colors.blue200 }]}>
                  {value || TEXT_EMPTY}
                </Text>
              </TouchableOpacity>
              :
              <Text style={[ProductDetailsStyles.gray, { color: colorValue }]}>
                {value || TEXT_EMPTY}
              </Text>
          }
        </View>
      </View>
    </View>
  );
};
