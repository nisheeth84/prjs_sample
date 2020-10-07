import * as React from "react";
import { View, Image, Text } from "react-native";
import { appImages } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { FollowTargetType } from "../../../config/constants/enum";
import { messages } from "./follow-management-messages";
import { translate } from "../../../config/i18n";
import { EnumFmDate } from "../../../config/constants/enum-fm-date";
import { FollowMangementStyles as styles } from "./follow-management-style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TEXT_EMPTY } from "../../../config/constants/constants";
let moment = require("moment");

interface ItemProps {
  // on click delete
  clickDelete: Function;
  // follow target id
  followTargetType: number;
  // follow target name
  followTargetName: string;
  // follow date
  createdDate: string;
}

const checkEmptyString = (input: string) => {
  return input == undefined || input.length == 0;
};

const getFormatDateTaskDetail = (
  input: string,
  format: EnumFmDate = EnumFmDate.YEAR_MONTH_DAY_JP
) => {
  if (checkEmptyString(input)) {
    return TEXT_EMPTY;
  }

  let data = moment(input).format(format);

  if (data == undefined || data == "Invalid date") {
    return TEXT_EMPTY;
  }
  return data;
};

/**
 * Component show follow manager item
 * @param props
 */

export const FollowManagerItem: React.FC<ItemProps> = ({
  clickDelete = () => {},
  followTargetType = FollowTargetType.BUSINESS_CARD,
  followTargetName = "",
  createdDate = "",
}) => {
  const checkFollowTargetType = (type: number) => {
    switch (type) {
      case FollowTargetType.BUSINESS_CARD:
        return (
          <View style={CommonStyles.imageTitle}>
            <Image
              style={[CommonStyles.imageSmall]}
              resizeMode="contain"
              source={appImages.icFollowBusinessCard}
            />
            <Text style={styles.titleIcon}>
              {translate(messages.followBusinessCard)}
            </Text>
          </View>
        );
      case FollowTargetType.CUSTOMER:
        return (
          <View style={CommonStyles.imageTitle}>
            <Image
              style={[CommonStyles.imageSmall]}
              resizeMode="contain"
              source={appImages.icFollowCustomer}
            />
            <Text style={styles.titleIcon}>
              {translate(messages.followCustomer)}
            </Text>
          </View>
        );

      default:
        return (
          <View style={CommonStyles.imageTitle}>
            <Image
              style={[CommonStyles.imageSmall]}
              resizeMode="contain"
              source={appImages.icFollowEmployee}
            />
            <Text style={styles.titleIcon}>
              {translate(messages.followEmployee)}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.prFollowItem}>
      <View style={styles.followItem}>
        {checkFollowTargetType(followTargetType)}
        <Text style={[CommonStyles.bold14, CommonStyles.blue14]}>
          {followTargetName}
        </Text>
        <Text style={CommonStyles.bold10}>
          {`${translate(messages.followDateStart)} : ${getFormatDateTaskDetail(
            createdDate,
            EnumFmDate.YEAR_MONTH_DAY_NORMAL
          )}`}
        </Text>
      </View>
      <View style={styles.iconClosePr}>
        <TouchableOpacity
          onPress={() => {
            clickDelete();
          }}
        >
          <Image
            style={styles.iconClose}
            source={appImages.iconCloseCircle}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
