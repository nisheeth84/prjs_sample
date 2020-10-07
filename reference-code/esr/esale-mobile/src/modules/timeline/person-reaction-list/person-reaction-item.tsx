import * as React from "react";
import { View, Image, Text } from "react-native";
import { appImages } from "../../../config/constants";
import { PersonReactionListStyles as styles } from "./person-reaction-list-style";
import { CommonStyles } from "../../../shared/common-style";
import { Line } from "../../../shared/components/line";
import { TouchableOpacity } from "react-native-gesture-handler";
import { checkEmptyString } from "../../../shared/util/app-utils";

interface ItemProps {
  // employee's name  
  employeeName: string;
  // employee's image
  employeeImagePath: string;
  // check delete
  canDelete?: boolean
  // delete funtion
  deleteReaction?: Function
}

/**
 * Component show person reaction item
 * @param props
 */

export const PersonReactionItem: React.FC<ItemProps> = ({
  employeeName,
  employeeImagePath,
  canDelete = true,
  deleteReaction = () => { }
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemList}>
        <View style={CommonStyles.imageTitle}>
          <Image style={styles.iconEmployee}
            resizeMode="contain"
            source={!checkEmptyString(employeeImagePath) ? { uri: employeeImagePath } : appImages.icUser} />
          <Text style={styles.itemName}>{employeeName}</Text>
        </View>
        {canDelete ?
          <TouchableOpacity onPress={() => { deleteReaction() }}>
            <Image source={appImages.icClose} style={[styles.iconDelete]} />
          </TouchableOpacity>
          : <View />
        }
      </View>
      <Line />
    </View>

  );


}
