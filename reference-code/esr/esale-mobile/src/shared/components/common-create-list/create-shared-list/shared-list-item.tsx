import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ShareListItemStyle } from "./styles";
import { messages } from "./create-shared-list-messages";
import { translate } from "../../../../config/i18n";
import { Icon } from "../../icon";

const styles = ShareListItemStyle;

interface BusinessItemProps {
  // position of card
  position: string;
  // department of card
  department: string;
  // species of card
  species: string;
  // to show/hide modal
  showModal: () => void;
  // id of card
  id: number;
  // to show/hide index
  onPress: () => void;
  // delete item press
  onDeletePress: () => void;
}

/**
 * Component show business card item
 * @param param0
 */
export const ShareListItem: React.FC<BusinessItemProps> = ({
  position,
  department,
  species,
  showModal = () => { },
  id,
  onPress = () => { },
  onDeletePress = () => { },
}) => {
  const modalShow = () => {
    showModal();
    onPress();
  };
  return (
    <View style={styles.viewInfo}>
      <View style={styles.viewAva}>
        <View style={id % 2 === 0 ? styles.avatar1 : styles.avatar2}>
          <Text>{translate(messages.company)}</Text>
        </View>
      </View>
      <View style={styles.viewBtn}>
        <View style={styles.viewTxt}>
          <Text style={styles.txtDepartment}>{department}</Text>
          <Text style={styles.txtPosition}>{position}</Text>
        </View>

        <View style={styles.species}>
          <TouchableOpacity style={styles.btn} onPress={modalShow}>
            <Text style={styles.txtSpecies}>{species}</Text>
            <Icon
              resizeMode="contain"
              style={styles.arrowDown}
              name="arrowDown"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={onDeletePress} style={styles.icon}>
        <Icon name="delete" />
      </TouchableOpacity>
    </View>
  );
};
