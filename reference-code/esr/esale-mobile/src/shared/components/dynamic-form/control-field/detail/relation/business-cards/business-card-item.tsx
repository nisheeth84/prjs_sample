import { useNavigation, StackActions } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../../../icon";
import { BusinessCardItemStyles } from "./business-card-style";
import { FIELD_BELONG } from "../../../../../../../config/constants/enum";

/**
 * interface for bussinasscard screen props
 */
interface BusinessCardProps {
  // business id of card
  businessCardId: number;
  // url of card avatar
  businessImage: any;
  // name of customer
  customerName: string;
  // name of of bussiness card
  businessCardName: string;
  // service field belong
  belong: any;
}

/**
 * Render bussiness card component
 * @param businessCardId,@param businessImage,
 * @param customerName,@param businessCardName
 */
export const BusinessCardItem: React.FC<BusinessCardProps> = ({
  businessCardId,
  businessImage,
  customerName,
  businessCardName,
  belong
}) => {
  const navigation = useNavigation();
  /**
   * Detail Business Card
   * @param businessCardId
   */
  const detailBusinessCard = () => {
    if(belong === FIELD_BELONG.BUSINESS_CARD) {
      navigation.dispatch(
        StackActions.push('business-card-detail', { id: businessCardId })
      );
    } else {
      navigation.navigate("business-card-detail", { id: businessCardId })
    }
  };

  return (
    <TouchableOpacity
      style={BusinessCardItemStyles.inforBusiness}
      onPress={detailBusinessCard}>
      <View style={BusinessCardItemStyles.mainInforBlock}>
        <Image source={businessImage} style={BusinessCardItemStyles.avatar} />
        <View style={BusinessCardItemStyles.name}>
          <Text style={BusinessCardItemStyles.nameColor}>
            {customerName}
          </Text>
          <Text>{businessCardName}</Text>
        </View>
      </View>
      <View style={BusinessCardItemStyles.iconArrowRight}>
        <Icon name="iconArrowRight" />
      </View>
    </TouchableOpacity>
  );
};
